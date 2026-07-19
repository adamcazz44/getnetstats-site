/** IPv4 vs IPv6 format comparison — the exact examples the ipv4-vs-ipv6 guide's
 *  own copy already uses ("192.0.2.146" and the shortened "2001:db8:85a3::8a2e:370:7334"). */
export default function AddressFormatCompare() {
  return (
    <div className="addr-compare">
      <div className="addr-row">
        <span className="addr-tag">IPv4</span>
        <span className="addr-example mono">192.0.2.146</span>
        <span className="addr-note">4 numbers, dots</span>
      </div>
      <div className="addr-row">
        <span className="addr-tag">IPv6</span>
        <span className="addr-example mono">2001:db8:85a3::8a2e:370:7334</span>
        <span className="addr-note">8 groups, colons</span>
      </div>
    </div>
  );
}
