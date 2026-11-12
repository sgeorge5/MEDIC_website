import { demoInspections } from "../data/demoInspections";
import type { InspectionFilters, InspectionRecord } from "../types/inspection";

export interface InspectionDataProvider {
  getRecords(): Promise<InspectionRecord[]>;
}
export class DemoInspectionProvider implements InspectionDataProvider {
  async getRecords() {
    return demoInspections.map((record) => ({ ...record }));
  }
}
export class ApiInspectionProvider implements InspectionDataProvider {
  async getRecords(): Promise<InspectionRecord[]> {
    throw new Error(
      "API integration is not configured. Use DemoInspectionProvider until a validated backend is available.",
    );
  }
}
export const inspectionProvider: InspectionDataProvider =
  new DemoInspectionProvider();
export const emptyFilters: InspectionFilters = {
  search: "",
  type: "All",
  severity: "All",
  status: "All",
};
export function filterRecords(
  records: InspectionRecord[],
  filters: InspectionFilters,
) {
  const query = filters.search.trim().toLowerCase();
  return records.filter(
    (r) =>
      (!query ||
        `${r.id} ${r.type} ${r.location} ${r.status} ${r.severity}`
          .toLowerCase()
          .includes(query)) &&
      (filters.type === "All" || r.type === filters.type) &&
      (filters.severity === "All" || r.severity === filters.severity) &&
      (filters.status === "All" || r.status === filters.status),
  );
}
export function summarize(records: InspectionRecord[]) {
  return {
    total: records.length,
    potholes: records.filter((r) => r.type === "Pothole").length,
    cracks: records.filter((r) => r.type === "Pavement crack").length,
    high: records.filter((r) => r.severity === "High").length,
  };
}
export function groupRecords(
  records: InspectionRecord[],
  key: "type" | "severity" | "status",
) {
  return Object.entries(
    records.reduce<Record<string, number>>((acc, r) => {
      acc[r[key]] = (acc[r[key]] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));
}
export function recordsCsv(records: InspectionRecord[]) {
  const columns: (keyof InspectionRecord)[] = [
    "id",
    "type",
    "severity",
    "location",
    "latitude",
    "longitude",
    "timestamp",
    "status",
    "confidence",
  ];
  const escape = (value: unknown) => {
    let text = String(value);
    if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [
    '"SYNTHETIC DEMONSTRATION DATA - not real inspection results"',
    columns.join(","),
    ...records.map((record) =>
      columns.map((key) => escape(record[key])).join(","),
    ),
  ].join("\r\n");
}
export function exportRecords(records: InspectionRecord[]) {
  const url = URL.createObjectURL(
    new Blob([recordsCsv(records)], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "medic-demo-inspections.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const asset = (path: string) =>
  `${import.meta.env?.BASE_URL || "./"}${path}`;
export const formatDate = (timestamp: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(timestamp));
