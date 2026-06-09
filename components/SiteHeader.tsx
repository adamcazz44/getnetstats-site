/** Site header. Pass `home` on the home page so the contextual "Home" link is
 *  hidden there and shown on every other page (a clear way back home). The brand
 *  mark also always links home. */
export default function SiteHeader({ home = false }: { home?: boolean }) {
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
          {!home ? (
            <a href="/" className="nav-home">
              <span aria-hidden="true">←</span> Home
            </a>
          ) : null}
          <a href="/vpn-guide">VPN Guide</a>
          <a href="/#how">How It Works</a>
          <a href="/#faq">FAQ</a>
        </nav>
      </div>
    </header>
  );
}
