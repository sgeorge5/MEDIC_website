import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapPin, RotateCcw } from "lucide-react";
import type { InspectionRecord } from "../../types/inspection";

const colors = { Low: "#34d399", Medium: "#fbbf24", High: "#fb7185" };
export default function InspectionMap({
  records,
  selectedId,
  onSelect,
  expanded = false,
}: {
  records: InspectionRecord[];
  selectedId?: string;
  onSelect: (record: InspectionRecord) => void;
  expanded?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  const [fallback, setFallback] = useState(false);
  onSelectRef.current = onSelect;
  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, {
      center: [40.745, -74.03],
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    map.current = instance;
    const tiles = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      },
    );
    tiles.on("tileerror", () => {
      setFallback(true);
    });
    tiles.addTo(instance);
    markers.current = L.layerGroup().addTo(instance);
    const resize = new ResizeObserver(() => instance.invalidateSize());
    resize.observe(container.current);
    return () => {
      resize.disconnect();
      instance.remove();
      map.current = null;
      markers.current = null;
    };
  }, []);
  useEffect(() => {
    if (!markers.current || !map.current) return;
    markers.current.clearLayers();
    records.forEach((record) => {
      const selected = selectedId === record.id;
      const marker = L.circleMarker([record.latitude, record.longitude], {
        radius: selected ? 12 : 7,
        color: selected ? "#ffffff" : colors[record.severity],
        weight: selected ? 3 : 2,
        fillColor: colors[record.severity],
        fillOpacity: 0.8,
      });
      marker.bindTooltip(`${record.id} · ${record.type} · ${record.severity}`, {
        direction: "top",
      });
      marker.on("click", () => onSelectRef.current(record));
      marker.addTo(markers.current!);
      // Leaflet paths need explicit keyboard semantics for keyboard-only map exploration.
      const element = marker.getElement();
      element?.setAttribute("tabindex", "0");
      element?.setAttribute("role", "button");
      element?.setAttribute(
        "aria-label",
        `Open ${record.id}, ${record.type}, ${record.severity} severity`,
      );
      element?.addEventListener("keydown", (event) => {
        const e = event as KeyboardEvent;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectRef.current(record);
        }
      });
    });
    const record = records.find((r) => r.id === selectedId);
    if (record)
      map.current.panTo([record.latitude, record.longitude], {
        animate: false,
      });
  }, [records, selectedId]);
  const reset = () =>
    map.current?.setView([40.745, -74.03], 15, { animate: false });
  return (
    <div className={`inspection-map ${expanded ? "expanded" : ""}`}>
      <div
        ref={container}
        className="leaflet-map"
        aria-label="Interactive map of synthetic example defect locations"
        aria-hidden={fallback || undefined}
        inert={fallback}
      />
      {fallback && (
        <div className="map-fallback">
          <div className="fallback-roads" />
          {records.map((r) => (
            <button
              key={r.id}
              aria-label={`Open ${r.id}, ${r.type}, ${r.severity} severity`}
              className={`fallback-marker ${selectedId === r.id ? "selected" : ""}`}
              onClick={() => onSelect(r)}
              style={{
                left: `${12 + ((r.longitude + 74.035) / 0.011) * 74}%`,
                top: `${15 + ((40.75 - r.latitude) / 0.011) * 65}%`,
                background: colors[r.severity],
              }}
            >
              <span>{r.id}</span>
            </button>
          ))}
          <div className="fallback-message">
            <MapPin size={14} />
            Tiles unavailable · schematic fallback. Markers remain interactive.
          </div>
        </div>
      )}
      <div className="map-demo-label">
        <span className="status-dot" />
        ILLUSTRATIVE LOCATIONS
      </div>
      {!fallback && (
        <button
          className="map-reset"
          onClick={reset}
          aria-label="Reset map view"
        >
          <RotateCcw size={15} />
          Reset view
        </button>
      )}
      <div className="map-legend">
        {Object.entries(colors).map(([name, color]) => (
          <span key={name}>
            <i style={{ background: color }} />
            {name}
          </span>
        ))}
      </div>
      {!records.length && (
        <div className="map-empty">No sample locations match your filters.</div>
      )}
    </div>
  );
}
