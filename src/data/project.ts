export const project = {
  name: "MEDIC",
  fullName: "Monitoring and Early Detection Infrastructure Crafter",
  university: "Stevens Institute of Technology",
  repositoryUrl: "https://github.com/sgeorge5/MEDIC_website",
  diagrams: [] as { title: string; file: string }[], // Store confirmed diagrams in public/diagrams/.
};
export const workflow = [
  {
    title: "Plan the mission",
    short: "Define the route",
    text: "An operator selects an inspection area and GPS waypoints. The proposed route remains under human supervision.",
    tech: "GPS waypoints · Flight controller",
    input: "Inspection area + operator constraints",
    output: "Planned waypoint route",
  },
  {
    title: "Capture roadway images",
    short: "See the surface",
    text: "The UAV follows the planned route while the camera captures roadway imagery. The operator can take manual control when necessary.",
    tech: "Camera subsystem · Supervised UAV",
    input: "Approved waypoint route",
    output: "Road images + capture timestamps",
  },
  {
    title: "Detect roadway defects",
    short: "Find the details",
    text: "OpenCV preprocesses images. A trained YOLO model is intended to predict bounding boxes and supported defect classes together.",
    tech: "OpenCV · YOLO · AI HAT+",
    input: "Preprocessed roadway imagery",
    output: "Example boxes, classes + confidence",
  },
  {
    title: "Record and evaluate",
    short: "Add the context",
    text: "Image evidence, timestamps, and UAV position are associated with each finding. Severity estimates need calibrated measurements and validation.",
    tech: "GPS association · Severity rules",
    input: "Detections + position records",
    output: "Geographic inspection records",
  },
  {
    title: "Review inspection results",
    short: "Inform the next step",
    text: "Records are stored locally, with cloud synchronization planned. Municipal users would review findings and prepare inspection reports.",
    tech: "Local storage · Dashboard · Reporting",
    input: "Stored inspection records",
    output: "Reviewed findings + inspection reports",
  },
];
export const architecture = [
  {
    name: "UAV and Camera",
    detail:
      "A supervised UAV carries the camera and onboard compute. The flight controller handles flight stabilization and waypoint execution; the operator retains manual control.",
  },
  {
    name: "Image Acquisition",
    detail:
      "The camera subsystem captures roadway images with timestamps. Capture settings and flight parameters will require evaluation.",
  },
  {
    name: "Image Preprocessing",
    detail:
      "OpenCV prepares camera frames through resizing and other selected image operations. It is not itself a trained defect classifier.",
  },
  {
    name: "YOLO Detection",
    detail:
      "The proposed trained YOLO model predicts bounding boxes, defect classes, and detection confidence from processed images.",
  },
  {
    name: "Classification and Severity",
    detail:
      "Class labels describe the defect. Separate measurement rules estimate severity. Model confidence expresses prediction certainty, not physical severity.",
  },
  {
    name: "GPS Association",
    detail:
      "Position and image timestamps are matched. Accurate ground-defect coordinates may require camera calibration, altitude, orientation, and projection geometry.",
  },
  {
    name: "Inspection Record Generation",
    detail:
      "A structured record associates the defect class, proposed severity, image reference, timestamp, and location estimate.",
  },
  {
    name: "Local Storage",
    detail:
      "Inspection records are intended to persist onboard before synchronization. Storage behavior and recovery require implementation and validation.",
  },
  {
    name: "Cloud Synchronization",
    detail:
      "A planned synchronization layer transfers stored records when connectivity is available. No cloud backend is connected to this website.",
  },
  {
    name: "Municipal Dashboard",
    detail:
      "A planned review and reporting interface supports municipal maintenance decisions. This website demonstrates the interface with synthetic data only.",
  },
];
