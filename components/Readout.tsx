import type { ReactNode } from "react";

interface ReadoutProps {
  shown: boolean;
  k: string;
  children: ReactNode;
  kIcon?: ReactNode;
}

/** A single stat cell in the 2×2 readout grid; fades/slides in when revealed. */
export default function Readout({ shown, k, children, kIcon }: ReadoutProps) {
  return (
    <div className={"ro reveal" + (shown ? " in" : "")}>
      <div className="k">
        {kIcon}
        {k}
      </div>
      {children}
    </div>
  );
}
