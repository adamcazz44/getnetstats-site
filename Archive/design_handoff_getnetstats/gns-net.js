/* ===========================================================
   GetNetStats — network measurement engine (runs in browser)
   Real data via public, CORS-enabled, no-key endpoints.
   Honest about what browsers cannot measure (WiFi radio signal).
   Exposes window.GNS
   =========================================================== */
(function () {
  function fetchT(url, ms, opts) {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), ms);
    return fetch(url, Object.assign({ signal: c.signal, cache: 'no-store' }, opts || {}))
      .finally(() => clearTimeout(t));
  }

  // ---- IP + ISP + location (primary: ipwho.is, fallback: ipapi.co) ----
  async function getIPInfo() {
    try {
      const r = await fetchT('https://ipwho.is/', 7000);
      const j = await r.json();
      if (j && j.success !== false && j.ip) {
        const conn = j.connection || {};
        return {
          ip: j.ip,
          version: j.type || (j.ip.includes(':') ? 'IPv6' : 'IPv4'),
          city: j.city, region: j.region, country: j.country,
          isp: conn.isp || conn.org || j.org || null,
          source: 'ipwho.is',
        };
      }
    } catch (e) { /* fall through */ }
    try {
      const r = await fetchT('https://ipapi.co/json/', 7000);
      const j = await r.json();
      if (j && j.ip) {
        return {
          ip: j.ip,
          version: j.version || (j.ip.includes(':') ? 'IPv6' : 'IPv4'),
          city: j.city, region: j.region, country: j.country_name,
          isp: j.org || null, source: 'ipapi.co',
        };
      }
    } catch (e) { /* fall through */ }
    throw new Error('ip-unavailable');
  }

  // ---- IPv6 probe (so we can show both stacks when present) ----
  async function getIPv6() {
    try {
      const r = await fetchT('https://api64.ipify.org?format=json', 5000);
      const j = await r.json();
      return j && j.ip && j.ip.includes(':') ? j.ip : null;
    } catch (e) { return null; }
  }

  // ---- latency / ping (median of warm round-trips) ----
  async function measurePing(n) {
    n = n || 6;
    const url = 'https://speed.cloudflare.com/__down?bytes=0';
    const samples = [];
    for (let i = 0; i < n; i++) {
      const t0 = performance.now();
      try { await fetchT(url + '&t=' + Date.now() + '_' + i, 4000); }
      catch (e) { continue; }
      samples.push(performance.now() - t0);
    }
    if (!samples.length) return null;
    // drop the first (cold connection) when we have enough
    const warm = samples.length > 2 ? samples.slice(1) : samples;
    const sorted = warm.slice().sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    let jitter = 0;
    if (warm.length > 1) {
      let d = 0;
      for (let i = 1; i < warm.length; i++) d += Math.abs(warm[i] - warm[i - 1]);
      jitter = d / (warm.length - 1);
    }
    return { ping: Math.max(1, Math.round(median)), jitter: Math.round(jitter) };
  }

  // ---- download throughput (streams real bytes, reports live Mbps) ----
  async function measureDownload(onProgress, budgetMs) {
    budgetMs = budgetMs || 9000;
    const url = 'https://speed.cloudflare.com/__down?bytes=100000000&t=' + Date.now();
    const c = new AbortController();
    const to = setTimeout(() => c.abort(), budgetMs);
    const start = performance.now();
    let received = 0, last = 0;
    try {
      const resp = await fetch(url, { signal: c.signal, cache: 'no-store' });
      const reader = resp.body.getReader();
      while (true) {
        const r = await reader.read();
        if (r.done) break;
        received += r.value.length;
        const elapsed = performance.now() - start;
        if (onProgress && elapsed - last > 90) {
          last = elapsed;
          onProgress((received * 8) / (elapsed / 1000) / 1e6, elapsed / budgetMs);
        }
        if (elapsed > budgetMs) { c.abort(); break; }
      }
    } catch (e) { /* abort after budget is expected */ }
    clearTimeout(to);
    const elapsed = (performance.now() - start) / 1000;
    if (received < 80000 || elapsed < 0.2) return null;
    return (received * 8) / elapsed / 1e6; // Mbps
  }

  // ---- upload throughput (POST a blob to the CDN sink) ----
  async function measureUpload(bytes) {
    bytes = bytes || 10000000; // 10 MB
    const payload = new Blob([new Uint8Array(bytes)]);
    const start = performance.now();
    try {
      await fetchT('https://speed.cloudflare.com/__up?t=' + Date.now(), 18000, {
        method: 'POST', body: payload,
      });
    } catch (e) { return null; }
    const elapsed = (performance.now() - start) / 1000;
    if (elapsed < 0.15) return null;
    return (bytes * 8) / elapsed / 1e6; // Mbps
  }

  // ---- connection class via Network Information API (best-effort) ----
  function getConnection() {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return { type: null, effectiveType: null, downlink: null, rtt: null, supported: false };
    return {
      type: c.type || null,                 // 'wifi' | 'cellular' | 'ethernet' | ...
      effectiveType: c.effectiveType || null,// '4g' | '3g' | ...
      downlink: typeof c.downlink === 'number' ? c.downlink : null,
      rtt: typeof c.rtt === 'number' ? c.rtt : null,
      saveData: !!c.saveData, supported: true,
    };
  }

  // human label for connection
  function connectionLabel(conn) {
    if (conn.type) {
      const map = { wifi: 'Wi-Fi', cellular: 'Cellular', ethernet: 'Ethernet', wimax: 'WiMAX', bluetooth: 'Bluetooth', none: 'Offline' };
      return map[conn.type] || conn.type.charAt(0).toUpperCase() + conn.type.slice(1);
    }
    if (conn.effectiveType) return conn.effectiveType.toUpperCase() + '-class';
    return 'Broadband';
  }

  // ---- derived connection-quality score (NOT WiFi radio signal) ----
  // Combines real download throughput + latency into a 0-100 estimate.
  function qualityScore(download, ping) {
    const dl = Math.max(0, Math.min(1, Math.log10((download || 0) + 1) / Math.log10(301)));
    const pg = ping == null ? 0.5 : Math.max(0, Math.min(1, (140 - ping) / 130));
    return Math.round((dl * 0.66 + pg * 0.34) * 100);
  }
  function qualityLabel(score) {
    if (score >= 78) return { label: 'Excellent', cls: 'q-good', bars: 5 };
    if (score >= 58) return { label: 'Good',      cls: 'q-good', bars: 4 };
    if (score >= 38) return { label: 'Fair',      cls: 'q-fair', bars: 3 };
    if (score >= 18) return { label: 'Weak',      cls: 'q-bad',  bars: 2 };
    return { label: 'Poor', cls: 'q-bad', bars: 1 };
  }

  window.GNS = {
    getIPInfo, getIPv6, measurePing, measureDownload, measureUpload,
    getConnection, connectionLabel, qualityScore, qualityLabel,
  };
})();
