import { useState } from "react";
import { ScanLine } from "lucide-react";
import { asset } from "../../lib/inspectionData";

export default function DetectionPreview() {
  const [overlay, setOverlay] = useState(true);
  const [labels, setLabels] = useState(true);
  const [confidence, setConfidence] = useState(true);
  const boxes = [
    { name: "Pothole", confidence: "94%", x: 40, y: 39, w: 9, h: 14 },
    {
      name: "Longitudinal crack",
      confidence: "87%",
      x: 51,
      y: 41,
      w: 8,
      h: 23,
    },
    { name: "Transverse crack", confidence: "89%", x: 33, y: 17, w: 9, h: 13 },
  ];
  return (
    <div className="detection-preview panel">
      <div className="panel-heading">
        <div>
          <ScanLine size={16} />
          <span>Computer vision, made visible</span>
        </div>
        <span className="tag">ILLUSTRATIVE</span>
      </div>
      <div className="detection-image">
        <img
          src={asset("images/roadway-sample.svg")}
          alt="Original synthetic overhead roadway illustration with example pothole and pavement cracks"
          loading="lazy"
        />
        {overlay &&
          boxes.map((b) => (
            <div
              key={b.name}
              className="detection-box"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
              }}
            >
              {(labels || confidence) && (
                <span>
                  {labels && b.name}
                  {labels && confidence && " · "}
                  {confidence && b.confidence}
                </span>
              )}
            </div>
          ))}
        <span className="image-corner">SYNTHETIC FRAME / 001</span>
      </div>
      <div className="detection-controls">
        <button
          className={`segmented-button ${overlay ? "" : "active"}`}
          onClick={() => setOverlay(false)}
        >
          Original image
        </button>
        <button
          className={`segmented-button ${overlay ? "active" : ""}`}
          onClick={() => setOverlay(true)}
        >
          Example detection overlay
        </button>
        <label>
          <input
            type="checkbox"
            checked={labels}
            onChange={(e) => setLabels(e.target.checked)}
            disabled={!overlay}
          />
          Box labels
        </label>
        <label>
          <input
            type="checkbox"
            checked={confidence}
            onChange={(e) => setConfidence(e.target.checked)}
            disabled={!overlay}
          />
          Confidence labels
        </label>
      </div>
      <p className="disclaimer">
        Illustrative detection preview — not live model inference. Confidence is
        illustrative and does not represent severity.
      </p>
    </div>
  );
}
