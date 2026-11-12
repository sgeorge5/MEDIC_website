export type DefectType = "Pothole" | "Pavement crack" | "Surface deterioration";
export type Severity = "Low" | "Medium" | "High";
export type ReviewStatus = "Unreviewed" | "In review" | "Reviewed";
export interface InspectionRecord {
  id: string;
  type: DefectType;
  severity: Severity;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: string;
  confidence: number;
  status: ReviewStatus;
  notes: string;
  image: string;
}
export interface InspectionFilters {
  search: string;
  type: string;
  severity: string;
  status: string;
}
