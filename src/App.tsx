import { lazy, Suspense, useEffect, useState } from "react";
import Home from "./pages/Home";
const Dashboard = lazy(() => import("./pages/Dashboard"));
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const dashboard = hash.startsWith("#/dashboard");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    document.title = dashboard
      ? "Inspection Demo — MEDIC"
      : "MEDIC — Roadway Intelligence";
    if (dashboard) window.scrollTo(0, 0);
    else {
      const target = hash.replace(/^#/, "") || "home";
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? "auto"
        : "smooth";
      requestAnimationFrame(() =>
        document.getElementById(target)?.scrollIntoView({ behavior }),
      );
    }
  }, [dashboard, hash]);
  return dashboard ? (
    <Suspense
      fallback={
        <div className="app-loading">
          <span className="status-dot" />
          Loading the inspection demo…
        </div>
      }
    >
      <Dashboard view={hash.split("/")[2] || "overview"} />
    </Suspense>
  ) : (
    <Home />
  );
}
