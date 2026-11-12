import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Box,
  Camera,
  Cloud,
  Cpu,
  Database,
  FileText,
  LocateFixed,
  ScanLine,
  SlidersHorizontal,
  LayoutDashboard,
} from "lucide-react";
import { architecture, project } from "../../data/project";
import { asset } from "../../lib/inspectionData";
const icons = [
  Camera,
  Camera,
  SlidersHorizontal,
  Cpu,
  ScanLine,
  LocateFixed,
  FileText,
  Database,
  Cloud,
  LayoutDashboard,
];

export default function Architecture() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="architecture">
      <div className="architecture-note">
        <span className="status-dot" />
        PROPOSED SYSTEM ARCHITECTURE<span>Select a component to explore</span>
      </div>
      <div className="architecture-layout">
        <div className="architecture-pipeline">
          {architecture.map((node, i) => {
            const Icon = icons[i];
            return (
              <div key={node.name} className="architecture-node-wrap">
                <button
                  className={`architecture-node ${selected === i ? "selected" : ""}`}
                  onClick={() => setSelected(i)}
                  aria-pressed={selected === i}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <Icon size={19} />
                  <strong>{node.name}</strong>
                  <ArrowUpRight size={15} />
                </button>
                {i < architecture.length - 1 && (
                  <ArrowDown className="connector" size={21} />
                )}
              </div>
            );
          })}
        </div>
        <div className="architecture-detail panel" aria-live="polite">
          <Box size={30} />
          <div className="eyebrow">
            COMPONENT {String(selected + 1).padStart(2, "0")}
          </div>
          <h3>{architecture[selected].name}</h3>
          <p>{architecture[selected].detail}</p>
          <span className="tag">PROPOSED · IN DEVELOPMENT</span>
          <div className="architecture-divider" />
          <h4>Technical diagram library</h4>
          {project.diagrams.length ? (
            project.diagrams.map((d) => (
              <a className="text-link" href={asset(d.file)} key={d.file}>
                {d.title}
                <ArrowUpRight size={15} />
              </a>
            ))
          ) : (
            <p>
              No project algorithm diagrams have been supplied yet. Confirmed
              diagrams can be added to the technical library as they become
              available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
