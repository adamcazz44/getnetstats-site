export default function SiteHeader() {
  return (
    <header className="site">
      <div className="wrap bar">
        <a className="brand" href="/" aria-label="GetNetStats home">
          <span className="dot" />
          <b>
            GetNet<span>Stats</span>
          </b>
        </a>
        <nav className="main">
          <a href="/vpn-guide">VPN Guide</a>
          <a href="/#how">How It Works</a>
          <a href="/#faq">FAQ</a>
        </nav>
      </div>
    </header>
  );
}
