interface FlowNode {
  label: string;
  sublabel?: string;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
}

/** A linear N-step chain with arrows between steps — e.g. domain name → resolver
 *  → IP address. Wraps to a stacked layout on narrow viewports. */
export default function FlowDiagram({ nodes }: FlowDiagramProps) {
  return (
    <div className="flow-diagram">
      {nodes.map((n, i) => (
        <div className="flow-diagram-item" key={n.label}>
          <div className="flow-node">
            <span className="flow-node-label mono">{n.label}</span>
            {n.sublabel ? <span className="flow-node-sub">{n.sublabel}</span> : null}
          </div>
          {i < nodes.length - 1 ? <span className="flow-arrow" aria-hidden="true">→</span> : null}
        </div>
      ))}
    </div>
  );
}
