import { test } from "node:test";
import assert from "node:assert/strict";
import { demoInspections } from "../src/data/demoInspections";
import {
  ApiInspectionProvider,
  DemoInspectionProvider,
  emptyFilters,
  filterRecords,
  groupRecords,
  recordsCsv,
  summarize,
} from "../src/lib/inspectionData";

test("the shared synthetic dataset is complete and uniquely identified", () => {
  assert.equal(new Set(demoInspections.map((r) => r.id)).size, 12);
  for (const r of demoInspections) {
    assert.match(r.id, /^DEMO-/);
    assert.ok(r.latitude >= -90 && r.latitude <= 90);
    assert.ok(r.longitude >= -180 && r.longitude <= 180);
    assert.ok(Number.isFinite(Date.parse(r.timestamp)));
    assert.ok(r.confidence >= 0 && r.confidence <= 1);
    assert.ok(r.notes.includes("Fictional"));
    assert.equal(r.image, "images/roadway-sample.svg");
  }
});
test("metrics and all chart groups agree with the same dataset", () => {
  assert.deepEqual(summarize(demoInspections), {
    total: 12,
    potholes: 4,
    cracks: 5,
    high: 4,
  });
  for (const key of ["type", "severity", "status"] as const)
    assert.equal(
      groupRecords(demoInspections, key).reduce((sum, g) => sum + g.value, 0),
      12,
    );
});
test("search, type, severity, and status filters compose correctly", () => {
  const result = filterRecords(demoInspections, {
    search: "DEMO",
    type: "Pothole",
    severity: "High",
    status: "In review",
  });
  assert.deepEqual(
    result.map((r) => r.id),
    ["DEMO-007"],
  );
  assert.equal(
    filterRecords(demoInspections, {
      ...emptyFilters,
      search: "  pAvEmEnT cRaCk  ",
    }).length,
    5,
  );
  assert.equal(
    filterRecords(demoInspections, {
      ...emptyFilters,
      search: "not a real location",
    }).length,
    0,
  );
});
test("filtered export preserves exact selected records and marks the data synthetic", () => {
  const records = filterRecords(demoInspections, {
    ...emptyFilters,
    severity: "High",
  });
  const csv = recordsCsv(records);
  assert.match(csv, /SYNTHETIC DEMONSTRATION/);
  assert.equal(csv.split("\r\n").length, records.length + 2);
  for (const r of records) assert.ok(csv.includes(r.id));
  assert.ok(!csv.includes("DEMO-002"));
  assert.ok(
    recordsCsv([
      { ...demoInspections[0], location: '=FORMULA,"quoted"' },
    ]).includes('"\'=FORMULA,""quoted"""'),
  );
});
test("the demo provider returns independent records and the API provider fails explicitly", async () => {
  const provider = new DemoInspectionProvider();
  const first = await provider.getRecords();
  first[0].status = "Reviewed";
  assert.equal((await provider.getRecords())[0].status, "Unreviewed");
  await assert.rejects(
    () => new ApiInspectionProvider().getRecords(),
    /not configured/,
  );
});
