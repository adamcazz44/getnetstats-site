/* ===========================================================
   GetNetStats — network measurement engine (typed, framework-agnostic)
   Real data via public, CORS-enabled, no-key endpoints.
   Honest about what browsers cannot measure (Wi-Fi radio signal):
   the "Wi-Fi Signal" meter is a DERIVED quality score, not a hardware reading.
   Ported verbatim from the prototype's window.GNS.
   =========================================================== */

export interface IPInfo {
  ip: string;
  version: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  isp: string | null;
  source: "ipwho.is" | "ipapi.co";
}

export interface PingResult {
  ping: number; // ms
  jitter: number; // ms
}

/** Rolling stats emitted per probe by measurePingLive (all ms; null until known). */
export interface PingSample {
  index: number; // 0-based probe number
  rttMs: number | null; // this probe's round-trip, or null if it timed out/failed
  runningMedian: number | null;
  jitter: number | null;
  min: number | null;
  max: number | null;
  lossPct: number; // failed / sent so far, 0–100
}

export interface PingLiveOptions {
  count?: number; // total probes (default 20)
  gapMs?: number; // pause between probes so it reads as a live monitor (default 250)
  onSample?: (s: PingSample) => void; // fires once per probe, in order
  signal?: AbortSignal; // abort to stop early (e.g. a Stop button)
}

export interface PingLiveResult {
  samples: (number | null)[]; // every probe in order; null = lost
  median: number | null;
  jitter: number | null;
  min: number | null;
  max: number | null;
  lossPct: number;
  sent: number; // probes attempted (may be < count if aborted)
  received: number; // successful probes
}

export interface ConnectionInfo {
  type: string | null; // 'wifi' | 'cellular' | 'ethernet' | ...
  effectiveType: string | null; // '4g' | '3g' | ...
  downlink: number | null;
  rtt: number | null;
  saveData?: boolean;
  supported: boolean;
}

export type QualityClass = "q-good" | "q-fair" | "q-bad";

export interface QualityLabel {
  label: "Excellent" | "Good" | "Fair" | "Weak" | "Poor";
  cls: QualityClass;
  bars: number;
}

/** Network Information API shape (not in lib.dom). Best-effort, vendor-prefixed. */
interface NetworkInformationLike {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/** fetch with an abort-based timeout. */
function fetchT(url: string, ms: number, opts?: RequestInit): Promise<Response> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  return fetch(url, { signal: c.signal, cache: "no-store", ...opts }).finally(() =>
    clearTimeout(t),
  );
}

// ---- IP + ISP + location (primary: ipwho.is, fallback: ipapi.co) ----
export async function getIPInfo(): Promise<IPInfo> {
  try {
    const r = await fetchT("https://ipwho.is/", 7000);
    const j = await r.json();
    if (j && j.success !== false && j.ip) {
      const conn = j.connection || {};
      return {
        ip: j.ip,
        version: j.type || (j.ip.includes(":") ? "IPv6" : "IPv4"),
        city: j.city ?? null,
        region: j.region ?? null,
        country: j.country ?? null,
        isp: conn.isp || conn.org || j.org || null,
        source: "ipwho.is",
      };
    }
  } catch {
    /* fall through */
  }
  try {
    const r = await fetchT("https://ipapi.co/json/", 7000);
    const j = await r.json();
    if (j && j.ip) {
      return {
        ip: j.ip,
        version: j.version || (j.ip.includes(":") ? "IPv6" : "IPv4"),
        city: j.city ?? null,
        region: j.region ?? null,
        country: j.country_name ?? null,
        isp: j.org || null,
        source: "ipapi.co",
      };
    }
  } catch {
    /* fall through */
  }
  throw new Error("ip-unavailable");
}

// ---- IPv6 probe (so we can show both stacks when present) ----
export async function getIPv6(): Promise<string | null> {
  try {
    const r = await fetchT("https://api64.ipify.org?format=json", 5000);
    const j = await r.json();
    return j && j.ip && j.ip.includes(":") ? j.ip : null;
  } catch {
    return null;
  }
}

// ---- latency / ping (median of warm round-trips) ----
export async function measurePing(n = 6): Promise<PingResult | null> {
  const url = "https://speed.cloudflare.com/__down?bytes=0";
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    const t0 = performance.now();
    try {
      await fetchT(url + "&t=" + Date.now() + "_" + i, 4000);
    } catch {
      continue;
    }
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

// ---- live ping monitor (per-probe streaming; drives the /ping-test tool) ----
// Streaming sibling of measurePing: same Cloudflare __down?bytes=0 endpoint and
// timeout pattern, but emits rolling stats per round-trip so the UI can show a
// live sample history and packet-loss%. A failed/timed-out probe is a null
// sample → it's the packet-loss numerator. measurePing stays untouched.
function pingStats(
  ok: number[],
  sent: number,
): { median: number | null; jitter: number | null; min: number | null; max: number | null; lossPct: number } {
  const sorted = ok.slice().sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;
  let jitter: number | null = null;
  if (ok.length > 1) {
    let d = 0;
    for (let i = 1; i < ok.length; i++) d += Math.abs(ok[i] - ok[i - 1]);
    jitter = d / (ok.length - 1);
  }
  const min = ok.length ? Math.min(...ok) : null;
  const max = ok.length ? Math.max(...ok) : null;
  const lossPct = sent ? ((sent - ok.length) / sent) * 100 : 0;
  return { median, jitter, min, max, lossPct };
}

const roundOrNull = (n: number | null): number | null =>
  n == null ? null : Math.round(n);

export async function measurePingLive(
  options: PingLiveOptions = {},
): Promise<PingLiveResult> {
  const count = options.count ?? 20;
  const gapMs = options.gapMs ?? 250;
  const { onSample, signal } = options;
  const url = "https://speed.cloudflare.com/__down?bytes=0";

  const ok: number[] = []; // successful round-trips, in arrival order
  const all: (number | null)[] = [];
  let sent = 0;

  for (let i = 0; i < count; i++) {
    if (signal?.aborted) break;
    sent++;
    let rtt: number | null = null;
    const t0 = performance.now();
    try {
      await fetchT(url + "&t=" + Date.now() + "_" + i, 4000);
      rtt = performance.now() - t0;
    } catch {
      rtt = null; // timeout / network failure → counts as packet loss
    }
    all.push(rtt);
    if (rtt != null) ok.push(rtt);

    const s = pingStats(ok, sent);
    onSample?.({
      index: i,
      rttMs: roundOrNull(rtt),
      runningMedian: roundOrNull(s.median),
      jitter: roundOrNull(s.jitter),
      min: roundOrNull(s.min),
      max: roundOrNull(s.max),
      lossPct: Math.round(s.lossPct),
    });

    if (i < count - 1 && !signal?.aborted) {
      await new Promise((r) => setTimeout(r, gapMs));
    }
  }

  const f = pingStats(ok, sent);
  return {
    samples: all.map(roundOrNull),
    median: roundOrNull(f.median),
    jitter: roundOrNull(f.jitter),
    min: roundOrNull(f.min),
    max: roundOrNull(f.max),
    lossPct: Math.round(f.lossPct),
    sent,
    received: ok.length,
  };
}

// ---- download throughput (streams real bytes, reports live Mbps) ----
export async function measureDownload(
  onProgress?: (mbps: number, fraction: number) => void,
  budgetMs = 9000,
): Promise<number | null> {
  const url = "https://speed.cloudflare.com/__down?bytes=100000000&t=" + Date.now();
  const c = new AbortController();
  const to = setTimeout(() => c.abort(), budgetMs);
  const start = performance.now();
  let received = 0;
  let last = 0;
  try {
    const resp = await fetch(url, { signal: c.signal, cache: "no-store" });
    const reader = resp.body!.getReader();
    while (true) {
      const r = await reader.read();
      if (r.done) break;
      received += r.value.length;
      const elapsed = performance.now() - start;
      if (onProgress && elapsed - last > 90) {
        last = elapsed;
        onProgress((received * 8) / (elapsed / 1000) / 1e6, elapsed / budgetMs);
      }
      if (elapsed > budgetMs) {
        c.abort();
        break;
      }
    }
  } catch {
    /* abort after budget is expected */
  }
  clearTimeout(to);
  const elapsed = (performance.now() - start) / 1000;
  if (received < 80000 || elapsed < 0.2) return null;
  return (received * 8) / elapsed / 1e6; // Mbps
}

// ---- upload throughput (POST a blob to the CDN sink) ----
export async function measureUpload(bytes = 10_000_000): Promise<number | null> {
  const payload = new Blob([new Uint8Array(bytes)]);
  const start = performance.now();
  try {
    await fetchT("https://speed.cloudflare.com/__up?t=" + Date.now(), 18000, {
      method: "POST",
      body: payload,
    });
  } catch {
    return null;
  }
  const elapsed = (performance.now() - start) / 1000;
  if (elapsed < 0.15) return null;
  return (bytes * 8) / elapsed / 1e6; // Mbps
}

// ---- connection class via Network Information API (best-effort) ----
export function getConnection(): ConnectionInfo {
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };
  const c = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (!c) {
    return {
      type: null,
      effectiveType: null,
      downlink: null,
      rtt: null,
      supported: false,
    };
  }
  return {
    type: c.type || null,
    effectiveType: c.effectiveType || null,
    downlink: typeof c.downlink === "number" ? c.downlink : null,
    rtt: typeof c.rtt === "number" ? c.rtt : null,
    saveData: !!c.saveData,
    supported: true,
  };
}

// human label for connection
export function connectionLabel(conn: ConnectionInfo): string {
  if (conn.type) {
    const map: Record<string, string> = {
      wifi: "Wi-Fi",
      cellular: "Cellular",
      ethernet: "Ethernet",
      wimax: "WiMAX",
      bluetooth: "Bluetooth",
      none: "Offline",
    };
    return map[conn.type] || conn.type.charAt(0).toUpperCase() + conn.type.slice(1);
  }
  if (conn.effectiveType) return conn.effectiveType.toUpperCase() + "-class";
  return "Broadband";
}

// ---- derived connection-quality score (NOT Wi-Fi radio signal) ----
// Combines real download throughput + latency into a 0-100 estimate.
export function qualityScore(download: number | null, ping: number | null): number {
  const dl = Math.max(
    0,
    Math.min(1, Math.log10((download || 0) + 1) / Math.log10(301)),
  );
  const pg = ping == null ? 0.5 : Math.max(0, Math.min(1, (140 - ping) / 130));
  return Math.round((dl * 0.66 + pg * 0.34) * 100);
}

export function qualityLabel(score: number): QualityLabel {
  if (score >= 78) return { label: "Excellent", cls: "q-good", bars: 5 };
  if (score >= 58) return { label: "Good", cls: "q-good", bars: 4 };
  if (score >= 38) return { label: "Fair", cls: "q-fair", bars: 3 };
  if (score >= 18) return { label: "Weak", cls: "q-bad", bars: 2 };
  return { label: "Poor", cls: "q-bad", bars: 1 };
}
