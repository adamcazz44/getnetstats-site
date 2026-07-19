import type { ReactNode } from "react";

interface IconRowItem {
  icon: ReactNode;
  label: string;
  sublabel?: string;
}

interface IconRowProps {
  items: IconRowItem[];
}

/** A row of labeled icons — device types, connection types, comparison pairs.
 *  Wraps responsively; column count follows item count up to 4 per row. */
export default function IconRow({ items }: IconRowProps) {
  return (
    <div className="icon-row">
      {items.map((it) => (
        <div className="icon-row-item" key={it.label}>
          <span className="icon-row-icon" aria-hidden="true">{it.icon}</span>
          <span className="icon-row-label">{it.label}</span>
          {it.sublabel ? <span className="icon-row-sub">{it.sublabel}</span> : null}
        </div>
      ))}
    </div>
  );
}
