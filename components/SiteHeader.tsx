/** Site header. Pass `home` on the home page. On every other page a top-left
 *  "← Home" back-link is rendered just below the header bar. The brand mark also
 *  always links home. */
export default function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <>
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
      {!home ? (
        <div className="wrap back-home-row">
          <a href="/" className="back-home">
            <span aria-hidden="true">←</span> Home
          </a>
        </div>
      ) : null}
    </>
  );
}
