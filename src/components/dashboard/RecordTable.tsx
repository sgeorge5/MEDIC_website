import { useState } from "react";
import { ArrowDown, ArrowUpDown, ArrowUpRight, SearchX } from "lucide-react";
import type { InspectionRecord } from "../../types/inspection";
import { formatDate } from "../../lib/inspectionData";

const columns = [
  { key: "id", label: "Defect ID" },
  { key: "type", label: "Defect type" },
  { key: "severity", label: "Severity" },
  { key: "location", label: "Location" },
  { key: "timestamp", label: "Timestamp (UTC)" },
  { key: "status", label: "Review status" },
] as const;
export default function RecordTable({
  records,
  selectedId,
  onSelect,
  compact = false,
}: {
  records: InspectionRecord[];
  selectedId?: string;
  onSelect: (record: InspectionRecord) => void;
  compact?: boolean;
}) {
  const [sort, setSort] = useState<{
    key: keyof InspectionRecord;
    ascending: boolean;
  }>({ key: "id", ascending: true });
  const sorted = [...records].sort((a, b) => {
    const severity = { Low: 1, Medium: 2, High: 3 };
    const result =
      sort.key === "severity"
        ? severity[a.severity] - severity[b.severity]
        : String(a[sort.key]).localeCompare(String(b[sort.key]));
    return result * (sort.ascending ? 1 : -1);
  });
  const shown = compact ? sorted.slice(0, 5) : sorted;
  return (
    <div className="records-table-wrap">
      {!records.length ? (
        <div className="empty-state">
          <SearchX size={32} />
          <h3>No matching records</h3>
          <p>Try another search or reset your filters.</p>
        </div>
      ) : (
        <table className="records-table">
          <caption className="sr-only">
            Synthetic demonstration defect records. Select a record ID to view
            details and its map location.
          </caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={
                    sort.key === c.key
                      ? sort.ascending
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    onClick={() =>
                      setSort({
                        key: c.key,
                        ascending: sort.key === c.key ? !sort.ascending : true,
                      })
                    }
                  >
                    {c.label}
                    {sort.key === c.key ? (
                      <ArrowDown
                        size={12}
                        style={{
                          transform: sort.ascending ? "rotate(180deg)" : "",
                        }}
                      />
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr
                key={r.id}
                className={selectedId === r.id ? "selected-row" : ""}
              >
                <td>
                  <button
                    className="record-id"
                    onClick={() => onSelect(r)}
                    aria-label={`View details for ${r.id}`}
                  >
                    {r.id}
                    <ArrowUpRight size={12} />
                  </button>
                </td>
                <td>{r.type}</td>
                <td>
                  <span
                    className={`severity-badge ${r.severity.toLowerCase()}`}
                  >
                    <i />
                    {r.severity}
                  </span>
                </td>
                <td>
                  <span className="table-location">{r.location}</span>
                  <small className="table-coordinate">
                    {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                  </small>
                </td>
                <td>
                  {formatDate(r.timestamp)}
                  <small className="table-coordinate">
                    {r.timestamp.slice(11, 16)} UTC
                  </small>
                </td>
                <td>
                  <span
                    className={`review-status ${r.status.toLowerCase().replace(" ", "-")}`}
                  >
                    <i />
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="table-footer">
        <span>
          {compact ? Math.min(5, records.length) : records.length} of{" "}
          {records.length} matching sample records
        </span>
        <span>SYNTHETIC DATA</span>
      </div>
    </div>
  );
}
