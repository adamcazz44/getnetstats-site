import type { ReactNode } from "react";

interface ReadoutProps {
  shown: boolean;
  k: string;
  children: ReactNode;
  kIcon?: ReactNode;
  /** Optional element pinned to the card's top-right corner (e.g. a "Test" pill). */
  action?: ReactNode;
}

/** A single stat cell in the 2×2 readout grid; fades/slides in when revealed. */
export default function Readout({ shown, k, children, kIcon, action }: ReadoutProps) {
  return (
    <div className={"ro reveal" + (shown ? " in" : "")}>
      {action ? <div className="ro-action">{action}</div> : null}
      <div className="k">
        {kIcon}
        {k}
      </div>
      {children}
    </div>
  );
}
