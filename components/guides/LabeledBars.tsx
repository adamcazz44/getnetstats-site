interface BarRow {
  label: string;
  display: string;
  value: number;
}

interface LabeledBarsProps {
  rows: BarRow[];
  max: number;
}

/** Horizontal bar rows visualizing numbers a guide's own copy already states —
 *  never a source of new figures, just a scannable view of the existing text. */
export default function LabeledBars({ rows, max }: LabeledBarsProps) {
  return (
    <div className="labeled-bars">
      {rows.map((r) => (
        <div className="lb-row" key={r.label}>
          <span className="lb-label">{r.label}</span>
          <div className="lb-track">
            <div className="lb-fill" style={{ width: `${Math.min(100, (r.value / max) * 100)}%` }} />
          </div>
          <span className="lb-value mono">{r.display}</span>
        </div>
      ))}
    </div>
  );
}
