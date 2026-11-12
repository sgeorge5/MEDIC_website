import { test, after } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:5173/",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLDialogElement",
  "SVGElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "MutationObserver",
  "getComputedStyle",
] as const)
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value: (dom.window as unknown as Record<string, unknown>)[key],
  });
Object.defineProperty(globalThis, "requestAnimationFrame", {
  value: dom.window.requestAnimationFrame.bind(dom.window),
  configurable: true,
});
Object.defineProperty(globalThis, "cancelAnimationFrame", {
  value: dom.window.cancelAnimationFrame.bind(dom.window),
  configurable: true,
});
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  value: true,
  writable: true,
  configurable: true,
});
dom.window.matchMedia = () => ({
  matches: true,
  media: "",
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return true;
  },
});
dom.window.HTMLElement.prototype.scrollIntoView = () => {};
dom.window.scrollTo = () => {};
dom.window.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
dom.window.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
Object.defineProperty(dom.window.SVGElement.prototype, "createSVGRect", {
  value: () => ({}),
});
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(globalThis, "ResizeObserver", {
  value: ResizeObserverMock,
  configurable: true,
});
Object.defineProperty(globalThis, "IntersectionObserver", {
  value: IntersectionObserverMock,
  configurable: true,
});

const { createElement } = await import("react");
const { render, screen, fireEvent, cleanup, waitFor, within } =
  await import("@testing-library/react");
const { default: Dashboard } = await import("../src/pages/Dashboard");
const { default: Home } = await import("../src/pages/Home");
const { default: DetectionPreview } =
  await import("../src/components/landing/DetectionPreview");
const { default: Architecture } =
  await import("../src/components/architecture/Architecture");
const { default: RecordTable } =
  await import("../src/components/dashboard/RecordTable");
const { demoInspections } = await import("../src/data/demoInspections");

after(() => {
  cleanup();
  dom.window.close();
});

test("dashboard filters, search, empty states, reset, record drawer, and map navigation work", async () => {
  render(createElement(Dashboard, { view: "records" }));
  await screen.findByRole("button", { name: "View details for DEMO-001" });
  assert.equal(
    screen.getAllByRole("button", { name: /^View details for DEMO-/ }).length,
    12,
  );
  fireEvent.change(screen.getByLabelText("Filter by defect type"), {
    target: { value: "Pothole" },
  });
  fireEvent.change(screen.getByLabelText("Filter by severity"), {
    target: { value: "High" },
  });
  fireEvent.change(screen.getByLabelText("Filter by review status"), {
    target: { value: "In review" },
  });
  assert.equal(
    screen.getAllByRole("button", { name: /^View details for DEMO-/ }).length,
    1,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "View details for DEMO-007" }),
  );
  const drawer = screen.getByRole("dialog", { name: "Example defect details" });
  assert.ok(within(drawer).getByText("DEMO-007"));
  assert.ok(within(drawer).getByText("Sample data for demonstration only"));
  assert.ok(within(drawer).getByText("96%"));
  fireEvent.click(
    within(drawer).getByRole("button", {
      name: /View selected location on map/,
    }),
  );
  assert.equal(dom.window.location.hash, "#/dashboard/map");
  assert.equal(drawer.hasAttribute("open"), false);
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  fireEvent.change(
    screen.getByRole("textbox", { name: "Search sample records" }),
    { target: { value: "zzzz-no-result" } },
  );
  assert.ok(screen.getByText("No matching records"));
  assert.ok(
    (screen.getByRole("button", { name: /Export CSV/ }) as HTMLButtonElement)
      .disabled,
  );
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  assert.equal(
    screen.getAllByRole("button", { name: /^View details for DEMO-/ }).length,
    12,
  );
  cleanup();
});
test("table sorting changes row order and selecting a record exposes its ID", () => {
  let selected = "";
  render(
    createElement(RecordTable, {
      records: demoInspections,
      onSelect: (r) => {
        selected = r.id;
      },
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Defect ID" }));
  assert.equal(
    screen.getAllByRole("row")[1].textContent?.startsWith("DEMO-012"),
    true,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "View details for DEMO-012" }),
  );
  assert.equal(selected, "DEMO-012");
  fireEvent.click(screen.getByRole("button", { name: "Severity" }));
  assert.ok(screen.getAllByRole("row")[1].textContent?.includes("Low"));
  cleanup();
});
test("map markers open the same record detail and preserve selected location", async () => {
  render(createElement(Dashboard, { view: "map" }));
  const marker = await screen.findByRole("button", {
    name: "Open DEMO-002, Pavement crack, Medium severity",
  });
  fireEvent.click(marker);
  const drawer = screen.getByRole("dialog", { name: "Example defect details" });
  assert.ok(within(drawer).getByText("DEMO-002"));
  assert.ok(within(drawer).getByText("40.745200, -74.028400"));
  fireEvent.click(within(drawer).getByRole("button", { name: "Close dialog" }));
  assert.ok(screen.getByText("DEMO-002 · Pavement crack"));
  assert.equal(marker.getAttribute("tabindex"), "0");
  fireEvent.keyDown(marker, { key: "Enter" });
  await waitFor(() => assert.ok(drawer.hasAttribute("open")));
  cleanup();
});

test("a failed map tile enables interactive local fallback markers", async () => {
  render(createElement(Dashboard, { view: "map" }));
  await screen.findByRole("button", { name: "Open DEMO-001, Pothole, High severity" });
  const tile = document.querySelector(".leaflet-tile");
  assert.ok(tile, "Leaflet should request map tiles");
  fireEvent.error(tile);
  assert.ok(await screen.findByText(/Tiles unavailable/));
  const fallback = document.querySelector(".map-fallback")!;
  fireEvent.click(within(fallback as HTMLElement).getByRole("button", { name: "Open DEMO-003, Surface deterioration, Low severity" }));
  assert.ok(within(screen.getByRole("dialog", { name: "Example defect details" })).getByText("DEMO-003"));
  cleanup();
});

test("the export button downloads only filtered synthetic records", async () => {
  render(createElement(Dashboard, { view: "records" }));
  await screen.findByRole("button", { name: "View details for DEMO-001" });
  fireEvent.change(screen.getByLabelText("Filter by severity"), { target: { value: "High" } });
  let downloaded: Blob | undefined;
  let filename = "";
  const originalUrl = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  const originalClick = dom.window.HTMLAnchorElement.prototype.click;
  URL.createObjectURL = blob => { downloaded = blob as Blob; return "blob:demo-download"; };
  URL.revokeObjectURL = () => {};
  dom.window.HTMLAnchorElement.prototype.click = function() { filename = this.download; };
  try {
    fireEvent.click(screen.getByRole("button", { name: /Export CSV/ }));
    assert.equal(filename, "medic-demo-inspections.csv");
    assert.ok(downloaded);
    const csv = await downloaded.text();
    assert.ok(csv.includes("DEMO-001"));
    assert.ok(!csv.includes("DEMO-002"));
    assert.equal(csv.split("\r\n").length, 6);
  } finally {
    URL.createObjectURL = originalUrl;
    URL.revokeObjectURL = originalRevoke;
    dom.window.HTMLAnchorElement.prototype.click = originalClick;
    cleanup();
  }
});
test("all four analytics charts describe the shared data and empty filters are handled", async () => {
  render(createElement(Dashboard, { view: "analytics" }));
  await screen.findByRole("heading", { name: "Defects by category" });
  assert.ok(screen.getByRole("heading", { name: "Severity distribution" }));
  assert.ok(screen.getByRole("heading", { name: "Findings over time" }));
  assert.ok(screen.getByRole("heading", { name: "Review status" }));
  assert.ok(
    screen.getByRole("img", {
      name: "Pothole: 4; Pavement crack: 5; Surface deterioration: 3",
    }),
  );
  fireEvent.change(
    screen.getByRole("textbox", { name: "Search sample records" }),
    { target: { value: "no-finding" } },
  );
  assert.ok(screen.getByText("No analytics to display"));
  cleanup();
});
test("detection preview toggles original, boxes, confidence, and labels independently", () => {
  render(createElement(DetectionPreview));
  assert.equal(document.querySelectorAll(".detection-box").length, 3);
  fireEvent.click(screen.getByRole("checkbox", { name: "Confidence labels" }));
  assert.equal(
    document.querySelector(".detection-box>span")?.textContent,
    "Pothole",
  );
  fireEvent.click(screen.getByRole("checkbox", { name: "Box labels" }));
  assert.equal(document.querySelectorAll(".detection-box>span").length, 0);
  fireEvent.click(screen.getByRole("button", { name: "Original image" }));
  assert.equal(document.querySelectorAll(".detection-box").length, 0);
  assert.ok(
    (screen.getByRole("checkbox", { name: "Box labels" }) as HTMLInputElement)
      .disabled,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Example detection overlay" }),
  );
  assert.equal(document.querySelectorAll(".detection-box").length, 3);
  cleanup();
});
test("architecture components reveal their corresponding technical descriptions", () => {
  render(createElement(Architecture));
  fireEvent.click(screen.getByRole("button", { name: /YOLO Detection/ }));
  assert.ok(screen.getByRole("heading", { name: "YOLO Detection" }));
  assert.ok(
    screen.getByText(
      /predicts bounding boxes, defect classes, and detection confidence/,
    ),
  );
  fireEvent.click(
    screen.getByRole("button", { name: /Cloud Synchronization/ }),
  );
  assert.ok(screen.getByText(/No cloud backend is connected/));
  cleanup();
});
test("public navigation, workflow keyboard tabs, mobile menu, and anchor targets are present", () => {
  render(createElement(Home));
  for (const link of document.querySelectorAll('a[href^="#"]')) {
    const href = link.getAttribute("href")!;
    if (href.startsWith("#/")) continue;
    assert.ok(document.getElementById(href.slice(1)), `Missing anchor ${href}`);
  }
  fireEvent.click(screen.getByRole("tab", { name: /Detect roadway defects/ }));
  assert.equal(
    screen
      .getByRole("tab", { name: /Detect roadway defects/ })
      .getAttribute("aria-selected"),
    "true",
  );
  assert.ok(screen.getByRole("tabpanel").textContent?.includes("YOLO"));
  fireEvent.keyDown(
    screen.getByRole("tab", { name: /Detect roadway defects/ }),
    { key: "ArrowRight" },
  );
  assert.equal(
    screen
      .getByRole("tab", { name: /Record and evaluate/ })
      .getAttribute("aria-selected"),
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
  assert.ok(
    screen.getByRole("dialog", { name: "Navigation" }).hasAttribute("open"),
  );
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Navigation" })).getByRole(
      "link",
      { name: /Technology/ },
    ),
  );
  assert.equal(
    document.querySelector(".mobile-nav-dialog")?.hasAttribute("open"),
    false,
  );
  cleanup();
});
