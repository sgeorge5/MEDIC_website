import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleAlert,
  Download,
  FileText,
  LayoutDashboard,
  Map,
  Menu,
  Network,
  ScanLine,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Logo, Dialog } from "../components/ui/Primitives";
import InspectionMap from "../components/dashboard/InspectionMap";
import RecordTable from "../components/dashboard/RecordTable";
import RecordDrawer from "../components/dashboard/RecordDrawer";
import InspectionCharts from "../components/charts/InspectionCharts";
import Architecture from "../components/architecture/Architecture";
import {
  emptyFilters,
  exportRecords,
  filterRecords,
  inspectionProvider,
  summarize,
} from "../lib/inspectionData";
import type { InspectionFilters, InspectionRecord } from "../types/inspection";

const navigation = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "map", label: "Inspection Map", Icon: Map },
  { id: "records", label: "Defect Records", Icon: FileText },
  { id: "analytics", label: "Analytics", Icon: ChartNoAxesCombined },
  { id: "architecture", label: "System Architecture", Icon: Network },
];
export default function Dashboard({ view }: { view: string }) {
  const current = navigation.find((n) => n.id === view) || navigation[0];
  const [records, setRecords] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<InspectionFilters>({
    ...emptyFilters,
  });
  const [selected, setSelected] = useState<InspectionRecord | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [exported, setExported] = useState(false);
  useEffect(() => setExported(false), [filters]);
  useEffect(() => {
    let active = true;
    inspectionProvider
      .getRecords()
      .then((data) => {
        if (active) {
          setRecords(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  const filtered = useMemo(
    () => filterRecords(records, filters),
    [records, filters],
  );
  const metrics = summarize(filtered);
  const activeFilter = Object.keys(filters).some(
    (key) =>
      filters[key as keyof InspectionFilters] !==
      emptyFilters[key as keyof InspectionFilters],
  );
  const select = (r: InspectionRecord) => {
    setSelected(r);
    setDrawer(true);
  };
  const changeFilter = (key: keyof InspectionFilters, value: string) =>
    setFilters((previous) => ({ ...previous, [key]: value }));
  const sidebar = (
    <>
      <div className="sidebar-brand">
        <Logo compact />
        <span>INSPECTION PLATFORM</span>
      </div>
      <div className="workspace-label">
        DEMO WORKSPACE<span>01</span>
      </div>
      <nav aria-label="Dashboard navigation">
        {navigation.map(({ id, label, Icon }) => (
          <a
            key={id}
            href={`#/dashboard/${id}`}
            onClick={() => setMobileMenu(false)}
            className={current.id === id ? "active" : ""}
            aria-current={current.id === id ? "page" : undefined}
          >
            <Icon size={18} />
            {label}
            {current.id === id && <span className="nav-active-dot" />}
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-demo">
          <span className="status-dot" />
          <strong>Explore the concept</strong>
          <p>
            Illustrative records.
            <br />
            No live system connection.
          </p>
        </div>
        <a href="#home" className="back-to-site">
          <ArrowLeft size={16} />
          Back to project
        </a>
        <div className="sidebar-version">
          MEDIC / SENIOR DESIGN<span>DEMO v1.0</span>
        </div>
      </div>
    </>
  );
  return (
    <div className="dashboard-shell">
      <a
        className="skip-link"
        href="#dashboard-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("dashboard-main")?.focus();
        }}
      >
        Skip to dashboard content
      </a>
      <aside className="dashboard-sidebar">{sidebar}</aside>
      <Dialog
        open={mobileMenu}
        onClose={() => setMobileMenu(false)}
        title="Dashboard navigation"
        className="dashboard-menu-dialog"
      >
        {sidebar}
      </Dialog>
      <div className="dashboard-body">
        <header className="dashboard-topbar">
          <div>
            <button
              className="icon-button dashboard-menu-button"
              aria-label="Open dashboard navigation"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{current.label}</strong>
          </div>
          <label className="dashboard-search">
            <Search size={16} />
            <input
              aria-label="Search sample records"
              placeholder="Search sample records…"
              value={filters.search}
              onChange={(e) => changeFilter("search", e.target.value)}
            />
            <kbd>DEMO</kbd>
          </label>
          <span className="topbar-demo">
            <span className="status-dot" />
            DEMO MODE
          </span>
        </header>
        <main className="dashboard-main" id="dashboard-main" tabIndex={-1}>
          <div className="demo-banner">
            <CircleAlert size={16} />
            <strong>DEMO MODE — Illustrative Inspection Data</strong>
            <span>Synthetic records. No live telemetry or inference.</span>
          </div>
          <div className="dashboard-page-heading">
            <div>
              <div className="eyebrow">MEDIC / INSPECTION WORKSPACE</div>
              <h1>
                {current.id === "overview"
                  ? "A clearer view of the road."
                  : current.label}
              </h1>
              <p>
                {current.id === "architecture"
                  ? "Explore the proposed system. Select a component to see its responsibilities."
                  : "Explore synthetic inspection findings and the proposed municipal review experience."}
              </p>
            </div>
            {current.id !== "architecture" && (
              <button
                className="button secondary export-button"
                disabled={loading || !filtered.length}
                onClick={() => {
                  exportRecords(filtered);
                  setExported(true);
                }}
              >
                <Download size={16} />
                Export CSV
              </button>
            )}
          </div>
          <div aria-live="polite" className="export-status">
            {exported &&
              "CSV download prepared with the currently filtered synthetic records."}
          </div>
          {loading ? (
            <div className="panel empty-state">
              <span className="status-dot" />
              <h3>Loading sample records…</h3>
            </div>
          ) : error ? (
            <div role="alert" className="panel empty-state">
              <h3>Unable to load inspection records</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {current.id !== "architecture" && (
                <>
                  <div className="dashboard-filters">
                    <div className="filter-icon">
                      <SlidersHorizontal size={15} />
                      <span>Filter records</span>
                    </div>
                    <label>
                      <span className="sr-only">Filter by defect type</span>
                      <select
                        aria-label="Filter by defect type"
                        value={filters.type}
                        onChange={(e) => changeFilter("type", e.target.value)}
                      >
                        <option value="All">All defect types</option>
                        <option>Pothole</option>
                        <option>Pavement crack</option>
                        <option>Surface deterioration</option>
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">Filter by severity</span>
                      <select
                        aria-label="Filter by severity"
                        value={filters.severity}
                        onChange={(e) =>
                          changeFilter("severity", e.target.value)
                        }
                      >
                        <option value="All">All severities</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">Filter by review status</span>
                      <select
                        aria-label="Filter by review status"
                        value={filters.status}
                        onChange={(e) => changeFilter("status", e.target.value)}
                      >
                        <option value="All">All review statuses</option>
                        <option>Unreviewed</option>
                        <option>In review</option>
                        <option>Reviewed</option>
                      </select>
                    </label>
                    {activeFilter && (
                      <button
                        className="reset-filters"
                        onClick={() => setFilters({ ...emptyFilters })}
                      >
                        <X size={13} />
                        Reset filters
                      </button>
                    )}
                    <span className="filter-count" aria-live="polite">
                      {filtered.length} / {records.length} examples
                    </span>
                  </div>
                </>
              )}
              {current.id === "overview" && (
                <>
                  <div className="metrics-grid">
                    {[
                      {
                        label: "Total example defects",
                        value: metrics.total,
                        Icon: ScanLine,
                        color: "cyan",
                      },
                      {
                        label: "Example potholes",
                        value: metrics.potholes,
                        Icon: CircleAlert,
                        color: "blue",
                      },
                      {
                        label: "Example pavement cracks",
                        value: metrics.cracks,
                        Icon: ChartNoAxesCombined,
                        color: "purple",
                      },
                      {
                        label: "Example high-severity findings",
                        value: metrics.high,
                        Icon: CircleAlert,
                        color: "red",
                      },
                    ].map(({ label, value, Icon, color }, i) => (
                      <div className={`metric-card panel ${color}`} key={label}>
                        <div>
                          <span>{label}</span>
                          <Icon size={17} />
                        </div>
                        <strong>{String(value).padStart(2, "0")}</strong>
                        <div className="metric-bottom">
                          <span>FROM SAMPLE DATASET</span>
                          <div className="metric-sparkline" aria-hidden="true">
                            {filtered.map(
                              (record) => (
                                <i
                                  key={record.id}
                                  style={{
                                    height: "16px",
                                    opacity: i === 0 || (i === 1 && record.type === "Pothole") || (i === 2 && record.type === "Pavement crack") || (i === 3 && record.severity === "High") ? 1 : .12,
                                  }}
                                />
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <section className="panel map-panel">
                    <div className="panel-heading">
                      <div>
                        <Map size={17} />
                        <h2>Inspection map</h2>
                        <span className="tag">EXAMPLE LOCATIONS</span>
                      </div>
                      <a href="#/dashboard/map" className="text-link">
                        Open map
                        <ArrowUpRight size={15} />
                      </a>
                    </div>
                    <InspectionMap
                      records={filtered}
                      selectedId={selected?.id}
                      onSelect={select}
                    />
                  </section>
                  <InspectionCharts records={filtered} compact />
                  <section className="panel table-panel">
                    <div className="panel-heading">
                      <div>
                        <FileText size={17} />
                        <h2>Example defect records</h2>
                      </div>
                      <a className="text-link" href="#/dashboard/records">
                        View all records
                        <ArrowRight size={15} />
                      </a>
                    </div>
                    <RecordTable
                      records={filtered}
                      selectedId={selected?.id}
                      onSelect={select}
                      compact
                    />
                  </section>
                </>
              )}
              {current.id === "map" && (
                <>
                  <section className="panel map-panel">
                    <div className="panel-heading">
                      <div>
                        <Map size={17} />
                        <h2>Example inspection area</h2>
                      </div>
                      <span className="muted small-text">
                        Select a marker to inspect a sample finding
                      </span>
                    </div>
                    <InspectionMap
                      records={filtered}
                      selectedId={selected?.id}
                      onSelect={select}
                      expanded
                    />
                  </section>
                  {selected && (
                    <div className="selected-location panel">
                      <Map size={20} />
                      <div>
                        <strong>
                          {selected.id} · {selected.type}
                        </strong>
                        <p>
                          {selected.latitude.toFixed(6)},{" "}
                          {selected.longitude.toFixed(6)} · {selected.severity}{" "}
                          severity · Synthetic location
                        </p>
                      </div>
                      <button
                        className="text-link"
                        onClick={() => setDrawer(true)}
                      >
                        Open details
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  )}
                  <RecordTable
                    records={filtered}
                    selectedId={selected?.id}
                    onSelect={select}
                  />
                </>
              )}
              {current.id === "records" && (
                <section className="panel table-panel">
                  <div className="panel-heading">
                    <div>
                      <FileText size={17} />
                      <h2>Defect record library</h2>
                    </div>
                    <span className="tag">{filtered.length} EXAMPLES</span>
                  </div>
                  <RecordTable
                    records={filtered}
                    selectedId={selected?.id}
                    onSelect={select}
                  />
                </section>
              )}
              {current.id === "analytics" && (
                <>
                  <InspectionCharts records={filtered} />
                  <section className="panel inspection-summary">
                    <div>
                      <span className="eyebrow">INSPECTION SUMMARY</span>
                      <h2>One dataset. A connected view.</h2>
                      <p>
                        The current selection contains {metrics.total} example
                        findings: {metrics.potholes} potholes, {metrics.cracks}{" "}
                        pavement cracks, and{" "}
                        {
                          filtered.filter(
                            (r) => r.type === "Surface deterioration",
                          ).length
                        }{" "}
                        surface deterioration examples. {metrics.high} findings
                        have illustrative high severity;{" "}
                        {filtered.filter((r) => r.status === "Reviewed").length}{" "}
                        are marked reviewed.
                      </p>
                    </div>
                    <div className="summary-note">
                      <CircleAlert size={22} />
                      <p>
                        All charts reflect the same filtered sample dataset as
                        the map and table. These numbers do not describe MEDIC
                        performance or actual roadway conditions.
                      </p>
                    </div>
                  </section>
                </>
              )}
              {current.id === "architecture" && <Architecture />}
            </>
          )}
          <footer className="dashboard-footer">
            <span>MEDIC · Stevens Institute of Technology · Senior Design</span>
            <span>
              <span className="status-dot" />
              SYNTHETIC DATA / NO LIVE CONNECTION
            </span>
          </footer>
        </main>
      </div>
      <RecordDrawer
        record={drawer ? selected : null}
        onClose={() => setDrawer(false)}
        onViewMap={() => {
          setDrawer(false);
          window.location.hash = "/dashboard/map";
        }}
      />
    </div>
  );
}
