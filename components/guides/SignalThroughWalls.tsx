import { IconTower, IconLaptop } from "./icons";

const BAR_HEIGHTS = [6, 11, 16, 22];

/** Ascending signal bars, same visual idea as the homepage's Wi-Fi Signal gauge
 *  (though that one derives height from live measurements — this is static).
 *  `strong` lights all four bars; otherwise only the shortest bar lights up. */
function Bars({ strong }: { strong: boolean }) {
  return (
    <div className="sigbars" aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <i key={i} className={strong || i === 0 ? "" : "off"} style={{ height: h }} />
      ))}
    </div>
  );
}

/** Router-to-device diagram for why-is-my-wifi-slow: signal strength visibly
 *  drops crossing two walls. */
export default function SignalThroughWalls() {
  return (
    <div className="signal-walls">
      <div className="sw-node">
        <span className="sw-icon" aria-hidden="true"><IconTower /></span>
        <span className="sw-label">Router</span>
        <Bars strong />
      </div>

      <div className="sw-path">
        <span className="sw-line" />
        <span className="sw-wall">wall</span>
        <span className="sw-line" />
        <span className="sw-wall">wall</span>
        <span className="sw-line" />
      </div>

      <div className="sw-node">
        <span className="sw-icon" aria-hidden="true"><IconLaptop /></span>
        <span className="sw-label">Far room</span>
        <Bars strong={false} />
      </div>
    </div>
  );
}
