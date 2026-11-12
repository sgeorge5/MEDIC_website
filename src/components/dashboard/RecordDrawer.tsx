import { ArrowUpRight, MapPin } from "lucide-react";
import { Dialog } from "../ui/Primitives";
import type { InspectionRecord } from "../../types/inspection";
import { asset, formatDate } from "../../lib/inspectionData";

export default function RecordDrawer({
  record,
  onClose,
  onViewMap,
}: {
  record: InspectionRecord | null;
  onClose: () => void;
  onViewMap: () => void;
}) {
  return (
    <Dialog
      open={Boolean(record)}
      onClose={onClose}
      title="Example defect details"
      className="record-drawer"
    >
      {record && (
        <>
          <div className="drawer-title">
            <span className="overline">SYNTHETIC INSPECTION RECORD</span>
            <h2>{record.id}</h2>
            <h3>{record.type}</h3>
            <span className={`severity-badge ${record.severity.toLowerCase()}`}>
              <i />
              {record.severity} severity
            </span>
            <span className="tag">{record.status}</span>
          </div>
          <div className="drawer-image">
            <img
              src={asset(record.image)}
              alt="Synthetic roadway illustration used as a placeholder, not actual defect evidence"
            />
            <span>ILLUSTRATION · NO FIELD EVIDENCE</span>
          </div>
          <p className="demo-warning">Sample data for demonstration only</p>
          <dl className="record-details">
            <div>
              <dt>Example location</dt>
              <dd>{record.location}</dd>
            </div>
            <div>
              <dt>Example coordinates</dt>
              <dd>
                {record.latitude.toFixed(6)}, {record.longitude.toFixed(6)}
              </dd>
            </div>
            <div>
              <dt>Sample timestamp</dt>
              <dd>
                {formatDate(record.timestamp)} ·{" "}
                {record.timestamp.slice(11, 16)} UTC
              </dd>
            </div>
            <div>
              <dt>Illustrative detection confidence</dt>
              <dd>
                {Math.round(record.confidence * 100)}%
                <small>Prediction certainty is separate from severity.</small>
              </dd>
            </div>
            <div>
              <dt>Inspection notes</dt>
              <dd>{record.notes}</dd>
            </div>
          </dl>
          <button
            className="button primary drawer-map-button"
            onClick={onViewMap}
          >
            <MapPin size={17} />
            View selected location on map
            <ArrowUpRight size={16} />
          </button>
        </>
      )}
    </Dialog>
  );
}
