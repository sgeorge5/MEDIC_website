import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Cpu,
  Crosshair,
  Database,
  Layers3,
  MapPin,
  Menu,
  Radio,
  Route,
  ScanLine,
  ShieldCheck,
  Waypoints,
  X,
} from "lucide-react";
import {
  Logo,
  Eyebrow,
  SectionTitle,
  Reveal,
  ArrowLink,
  Dialog,
} from "../components/ui/Primitives";
import { Drone, HeroScene, SurveyMap } from "../components/landing/DroneScene";
import DetectionPreview from "../components/landing/DetectionPreview";
import Architecture from "../components/architecture/Architecture";
import { project, workflow } from "../data/project";
import { progress } from "../data/progress";
import { team } from "../data/team";
import { demoInspections } from "../data/demoInspections";
import { asset, summarize } from "../lib/inspectionData";

const nav = [
  ["Home", "home"],
  ["About", "about"],
  ["Technology", "technology"],
  ["How It Works", "workflow"],
  ["Progress", "progress"],
  ["Team", "team"],
];
const tech = [
  {
    title: "Purposeful flight.\nHuman oversight.",
    label: "SEMI-AUTONOMOUS NAVIGATION",
    icon: Route,
    text: "Planned GPS waypoints guide the proposed inspection route. The flight controller manages stabilization and navigation, while an operator supervises the mission and retains manual control.",
    tags: ["GPS waypoints", "Flight controller", "Operator supervision"],
    visual: "route",
  },
  {
    title: "From pixels\nto possible defects.",
    label: "COMPUTER VISION & YOLO",
    icon: ScanLine,
    text: "OpenCV prepares roadway imagery for a trained YOLO model. The proposed model predicts defect bounding boxes and class labels together, with confidence scores for each prediction.",
    tags: ["OpenCV preprocessing", "YOLO inference", "Bounding boxes"],
    visual: "vision",
  },
  {
    title: "Understand the finding.\nEvaluate the severity.",
    label: "DEFECT SEVERITY ASSESSMENT",
    icon: Layers3,
    text: "Separate measurement rules are proposed to classify severity as low, medium, or high. These estimates require calibration and validation. A high detection confidence does not mean a severe defect.",
    tags: [
      "Defect measurements",
      "Calibration required",
      "Validation required",
    ],
    visual: "severity",
  },
  {
    title: "Every finding\nneeds its context.",
    label: "GPS & GEOLOCATION",
    icon: MapPin,
    text: "Image timestamps are matched with UAV position records. Accurate ground-defect location estimates may also require camera calibration, flight altitude, orientation, and projection geometry.",
    tags: ["Timestamp matching", "UAV position", "Camera geometry"],
    visual: "gps",
  },
  {
    title: "Intelligence,\non board.",
    label: "ONBOARD COMPUTING",
    icon: Cpu,
    text: "The proposed compute platform brings a Raspberry Pi 5, Raspberry Pi AI HAT+, camera subsystem, GPS / flight controller, and local storage together on the aircraft.",
    tags: ["Raspberry Pi 5", "AI HAT+", "Camera subsystem"],
    visual: "compute",
  },
  {
    title: "From a local record\nto a clearer picture.",
    label: "STORAGE & REPORTING",
    icon: Database,
    text: "Inspection records are intended to persist locally, then synchronize with a cloud database when connectivity is available. A municipal dashboard and inspection reports complete the planned review workflow.",
    tags: ["Local persistence", "Planned cloud sync", "Inspection reports"],
    visual: "storage",
  },
];

function TechVisual({ type }: { type: string }) {
  if (type === "route" || type === "gps")
    return (
      <div className="tech-map">
        <SurveyMap />
        <div className="map-crosshair">
          <Crosshair size={34} />
          <span>
            {type === "gps"
              ? "POSITION + TIME + GEOMETRY"
              : "WAYPOINT ROUTE / CONCEPT"}
          </span>
        </div>
        <div className="map-tag">
          <span className="status-dot" />
          OPERATOR SUPERVISION
        </div>
      </div>
    );
  if (type === "vision")
    return (
      <div className="vision-visual">
        <img
          src={asset("images/roadway-sample.svg")}
          alt="Synthetic roadway used to explain computer vision"
          loading="lazy"
        />
        <div className="vision-target">
          <span>POTHOLE / EXAMPLE</span>
        </div>
        <div className="visual-foot">FRAME → PREPROCESS → INFERENCE</div>
      </div>
    );
  if (type === "severity")
    return (
      <div className="severity-visual">
        <div className="wire-pothole">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{
                width: `${95 - i * 9}%`,
                height: `${58 - i * 5}%`,
                top: `${18 + i * 3}%`,
              }}
            />
          ))}
        </div>
        <div className="severity-scale">
          <span>
            <i className="low" />
            Low
          </span>
          <span>
            <i className="medium" />
            Medium
          </span>
          <span>
            <i className="high" />
            High
          </span>
        </div>
        <small>MEASUREMENT → CALIBRATION → ESTIMATE</small>
      </div>
    );
  if (type === "compute")
    return (
      <div className="compute-visual">
        <div className="chip-lines" />
        <div className="compute-chip">
          <Cpu size={42} />
          <strong>Raspberry Pi 5</strong>
          <span>+ AI HAT+</span>
        </div>
        <span className="compute-label a">CAMERA IN</span>
        <span className="compute-label b">LOCAL STORAGE</span>
        <span className="compute-label c">GPS / CONTROLLER</span>
        <span className="compute-label d">PROPOSED HARDWARE</span>
      </div>
    );
  return (
    <div className="storage-visual">
      {[
        { title: "Onboard", sub: "Local inspection records", Icon: Database },
        { title: "Synchronize", sub: "Planned cloud database", Icon: Radio },
        { title: "Review", sub: "Municipal reporting", Icon: Layers3 },
      ].map(({ title, sub, Icon }, i) => (
        <div key={title}>
          <span className="storage-index">0{i + 1}</span>
          <Icon size={24} />
          <span>
            <strong>{title}</strong>
            <small>{sub}</small>
          </span>
          {i < 2 && <span className="vertical-connector" />}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [step, setStep] = useState(0);
  const demoMetrics = summarize(demoInspections);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a className="button nav-cta" href="#/dashboard/overview">
            Explore Dashboard
            <ArrowUpRight size={15} />
          </a>
          <button
            className="icon-button mobile-menu-button"
            aria-label="Open navigation"
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      <Dialog
        open={menu}
        onClose={() => setMenu(false)}
        title="Navigation"
        className="mobile-nav-dialog"
      >
        <nav aria-label="Mobile navigation">
          {nav.map(([label, id]) => (
            <a href={`#${id}`} key={id} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight size={20} />
            </a>
          ))}
          <a href="#/dashboard/overview" onClick={() => setMenu(false)}>
            Explore Dashboard
            <ArrowUpRight size={20} />
          </a>
        </nav>
      </Dialog>
      <main id="main-content">
        <section className="hero" id="home">
          <HeroScene />
          <div className="container hero-content">
            <Reveal>
              <div className="project-badge">
                <span className="status-dot" /> ENGINEERING A BETTER PERSPECTIVE{" "}
                <ChevronRight size={13} />
              </div>
              <Eyebrow>SENIOR DESIGN PROJECT / ROADWAY INTELLIGENCE</Eyebrow>
              <h1>
                A Smarter Way
                <br />
                to Inspect
                <br />
                <span>Our Roads.</span>
              </h1>
              <p>
                MEDIC is a semi-autonomous UAV inspection system designed to
                identify roadway defects, record their locations, and help
                municipalities make informed maintenance decisions.
              </p>
              <div className="hero-buttons">
                <a href="#about" className="button primary">
                  Explore the Project
                  <ArrowRight size={17} />
                </a>
                <a href="#/dashboard/overview" className="button secondary">
                  View Dashboard Demo
                  <ArrowUpRight size={17} />
                </a>
              </div>
              <div className="hero-support">
                UAV Technology
                <span />
                Computer Vision
                <span />
                Infrastructure Monitoring
              </div>
            </Reveal>
          </div>
          <div className="hero-bottom container">
            <span>
              <span className="status-dot" />
              IN DEVELOPMENT AT STEVENS
            </span>
            <a href="#about">
              SCROLL TO EXPLORE
              <span className="scroll-line" />
            </a>
            <span>ENGINEERED WITH PURPOSE.</span>
          </div>
        </section>
        <div className="capabilities-strip">
          <div className="container">
            <span>
              ONE CONNECTED
              <br />
              <strong>INSPECTION WORKFLOW</strong>
            </span>
            {[
              { Icon: Waypoints, text: "Supervised navigation" },
              { Icon: ScanLine, text: "AI-assisted detection" },
              { Icon: MapPin, text: "Geographic records" },
              { Icon: Layers3, text: "Actionable reporting" },
            ].map(({ Icon, text }) => (
              <div key={text}>
                <Icon size={21} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <section id="about" className="section container about-section">
          <Reveal>
            <div className="split-heading">
              <SectionTitle
                eyebrow="THE CHALLENGE. A NEW PERSPECTIVE."
                number="01"
                title={
                  <>
                    Roadway Inspections,
                    <br />
                    <span className="muted-heading">Reimagined.</span>
                  </>
                }
              />
              <p>
                Roads connect our communities.
                <br />
                Understanding their condition shouldn’t be the hardest part of
                maintaining them.
              </p>
            </div>
          </Reveal>
          <div className="about-layout">
            <Reveal className="problem-copy">
              <span className="overline">A FAMILIAR CHALLENGE</span>
              <h3>
                More road to cover.
                <br />
                More details to document.
              </h3>
              <p>
                Traditional inspections can mean manual travel, repeated field
                visits, human identification of defects, and time-consuming
                documentation.
              </p>
              <p>
                MEDIC proposes a connected workflow designed to reduce
                inspection effort and support municipal maintenance planning.
              </p>
              <div className="development-note">
                <ShieldCheck size={19} />
                <span>
                  A senior design project in development.
                  <br />
                  <strong>
                    Proposed capabilities. No unverified performance claims.
                  </strong>
                </span>
              </div>
            </Reveal>
            <Reveal className="comparison panel">
              <div className="comparison-column">
                <span className="overline">TRADITIONAL INSPECTION</span>
                {[
                  "Travel the inspection route",
                  "Identify defects manually",
                  "Document findings in the field",
                  "Compile reports by hand",
                ].map((text, i) => (
                  <div key={text}>
                    <span className="comparison-number">0{i + 1}</span>
                    {text}
                  </div>
                ))}
              </div>
              <div className="comparison-column proposed">
                <span className="overline">
                  <span className="status-dot" />
                  MEDIC PROPOSED WORKFLOW
                </span>
                {[
                  "Capture roadway imagery by UAV",
                  "Identify candidate defects with AI",
                  "Associate evidence with GPS records",
                  "Review digital inspection reports",
                ].map((text) => (
                  <div key={text}>
                    <Check size={15} />
                    {text}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="workflow" className="section workflow-section">
          <div className="container">
            <Reveal>
              <SectionTitle
                eyebrow="FROM FLIGHT TO INSIGHT"
                number="02"
                title={
                  <>
                    A clear path.
                    <br />
                    <span className="muted-heading">An informed decision.</span>
                  </>
                }
              >
                Five connected stages. One proposed workflow, with a human in
                the loop.
              </SectionTitle>
            </Reveal>
            <div
              className="workflow-tabs"
              role="tablist"
              aria-label="Inspection workflow"
            >
              {workflow.map((stage, i) => (
                <button
                  key={stage.title}
                  role="tab"
                  id={`workflow-tab-${i}`}
                  aria-selected={step === i}
                  aria-controls="workflow-panel"
                  tabIndex={step === i ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const next =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 4
                            : (step + (e.key === "ArrowRight" ? 1 : 4)) % 5;
                      setStep(next);
                      document.getElementById(`workflow-tab-${next}`)?.focus();
                    }
                  }}
                  onClick={() => setStep(i)}
                  className={step === i ? "active" : ""}
                >
                  <span>0{i + 1}</span>
                  <strong>{stage.title}</strong>
                  <small>{stage.short}</small>
                </button>
              ))}
            </div>
            <div
              className="workflow-panel"
              id="workflow-panel"
              role="tabpanel"
              aria-labelledby={`workflow-tab-${step}`}
            >
              <div className="workflow-illustration">
                <SurveyMap />
                {step < 2 ? (
                  <Drone className="workflow-drone" />
                ) : (
                  <div className="workflow-stage-icon">
                    {step === 2 ? (
                      <ScanLine size={62} />
                    ) : step === 3 ? (
                      <MapPin size={62} />
                    ) : (
                      <Layers3 size={62} />
                    )}
                  </div>
                )}
                <span className="visual-foot">
                  STAGE 0{step + 1} / PROPOSED WORKFLOW
                </span>
              </div>
              <div className="workflow-copy" key={step}>
                <Eyebrow>STAGE 0{step + 1}</Eyebrow>
                <h3>{workflow[step].title}</h3>
                <p>{workflow[step].text}</p>
                <div className="technology-label">{workflow[step].tech}</div>
                <dl className="input-output">
                  <div>
                    <dt>INPUT</dt>
                    <dd>{workflow[step].input}</dd>
                  </div>
                  <div>
                    <dt>OUTPUT</dt>
                    <dd>{workflow[step].output}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section
          id="technology"
          className="section container technology-section"
        >
          <Reveal>
            <div className="split-heading">
              <SectionTitle
                eyebrow="THE ENGINEERING BEHIND MEDIC"
                number="03"
                title={
                  <>
                    Built to see more.
                    <br />
                    <span className="muted-heading">
                      Designed to connect it.
                    </span>
                  </>
                }
              />
              <p>
                Flight systems, computer vision, and geographic data — brought
                together in one proposed inspection platform.
              </p>
            </div>
          </Reveal>
          {tech.map((t, i) => (
            <Reveal
              key={t.label}
              className={`tech-row ${i % 2 ? "reversed" : ""}`}
            >
              <div className="tech-copy">
                <Eyebrow>{t.label}</Eyebrow>
                <h3>
                  {t.title.split("\n").map((line, j) => (
                    <span key={line}>
                      {j > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h3>
                <p>{t.text}</p>
                <div className="tech-tags">
                  {t.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="tech-illustration">
                <TechVisual type={t.visual} />
                <span className="technical-number">
                  MEDIC / SUBSYSTEM 0{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </section>

        <section id="detection" className="section detection-section">
          <div className="container">
            <Reveal>
              <div className="split-heading">
                <SectionTitle
                  eyebrow="A CLOSER LOOK AT COMPUTER VISION"
                  number="04"
                  title={
                    <>
                      See the concept.
                      <br />
                      <span className="muted-heading">
                        Explore the details.
                      </span>
                    </>
                  }
                />
                <p>
                  Explore example bounding boxes, labels, and confidence values
                  on an original synthetic roadway illustration.
                </p>
              </div>
            </Reveal>
            <DetectionPreview />
          </div>
        </section>

        <section
          className="section container dashboard-teaser"
          id="dashboard-demo"
        >
          <Reveal className="dashboard-teaser-copy">
            <Eyebrow number="05">THE PROPOSED REVIEW EXPERIENCE</Eyebrow>
            <h2>
              A new perspective.
              <br />
              <span className="muted-heading">All in one place.</span>
            </h2>
            <p>
              Explore how geographic findings, review records, and inspection
              analytics could come together for municipal teams.
            </p>
            <a href="#/dashboard/overview" className="button primary">
              Open Dashboard Demo
              <ArrowUpRight size={17} />
            </a>
            <span className="fine-print">
              Synthetic demonstration data. No live UAV connection.
            </span>
          </Reveal>
          <a
            className="dashboard-mini panel"
            href="#/dashboard/overview"
            aria-label="Explore the interactive dashboard demo"
          >
            <div className="mini-top">
              <span className="brand-mini">M / MEDIC</span>
              <span className="tag">DEMO MODE</span>
            </div>
            <div className="mini-body">
              <div className="mini-sidebar">
                <div />
                <div />
                <div />
                <div />
              </div>
              <div className="mini-main">
                <span className="overline">INSPECTION OVERVIEW</span>
                <div className="mini-stats">
                  <div>
                    <small>Example defects</small>
                    <strong>{demoMetrics.total}</strong>
                  </div>
                  <div>
                    <small>High severity</small>
                    <strong>{demoMetrics.high}</strong>
                  </div>
                  <div>
                    <small>Reviewed</small>
                    <strong>
                      {
                        demoInspections.filter((r) => r.status === "Reviewed")
                          .length
                      }
                    </strong>
                  </div>
                </div>
                <div className="mini-map">
                  <SurveyMap />
                  {demoInspections.map((record) => (
                    <i
                      key={record.id}
                      style={{
                        left: `${12 + ((record.longitude + 74.035) / .011) * 74}%`,
                        top: `${15 + ((40.750 - record.latitude) / .011) * 65}%`,
                        background: record.severity === "High" ? "#fb7185" : record.severity === "Medium" ? "#fbbf24" : "#34d399",
                      }}
                    />
                  ))}
                </div>
                <div className="mini-bottom">
                  ILLUSTRATIVE DATA ONLY <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          </a>
        </section>

        <section id="architecture" className="section architecture-section">
          <div className="container">
            <Reveal>
              <SectionTitle
                eyebrow="A CONNECTED SYSTEM"
                number="06"
                title={
                  <>
                    Every layer.
                    <br />
                    <span className="muted-heading">
                      One considered architecture.
                    </span>
                  </>
                }
              >
                Explore the proposed path from camera capture to municipal
                review.
              </SectionTitle>
            </Reveal>
            <Architecture />
          </div>
        </section>

        <section id="progress" className="section container">
          <Reveal>
            <div className="split-heading">
              <SectionTitle
                eyebrow="THE ROAD AHEAD"
                number="07"
                title={
                  <>
                    An ambitious idea.
                    <br />
                    <span className="muted-heading">A considered roadmap.</span>
                  </>
                }
              />
              <p>
                Our planned development path. Stage completion has not been
                verified; the roadmap describes intended work.
              </p>
            </div>
          </Reveal>
          <div className="roadmap">
            {progress.map((stage, i) => (
              <Reveal className="roadmap-item" key={stage.title}>
                <span className="roadmap-index">0{i + 1}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
                <span className="roadmap-status">{stage.status}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="team" className="section team-section">
          <div className="container">
            <Reveal>
              <div className="split-heading">
                <SectionTitle
                  eyebrow="STEVENS INSTITUTE OF TECHNOLOGY"
                  number="08"
                  title={
                    <>
                      Meet the Team
                      <br />
                      <span className="muted-heading">Behind MEDIC.</span>
                    </>
                  }
                />
                <p>
                  A senior design project at the intersection of flight, vision,
                  and infrastructure.
                  <span className="editable-note">
                    Editable sample roles below. Team names and assignments are
                    awaiting confirmation.
                  </span>
                </p>
              </div>
            </Reveal>
            <div className="team-grid">
              {team.map((member, i) => (
                <Reveal className="team-card" key={member.name}>
                  <div className="team-avatar">
                    <span>M/{String(i + 1).padStart(2, "0")}</span>
                    <Crosshair size={68} strokeWidth={0.6} />
                  </div>
                  <span className="tag">NAME TO BE CONFIRMED</span>
                  <h3>{member.name}</h3>
                  <strong>{member.role}</strong>
                  <p>{member.responsibility}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section container">
          <Eyebrow>LOOKING AHEAD, LOOKING CLOSER.</Eyebrow>
          <h2>
            Better insight.
            <br />
            <span className="muted-heading">
              Starts with a new perspective.
            </span>
          </h2>
          <a href="#/dashboard/overview" className="button primary">
            Explore the MEDIC Demo
            <ArrowUpRight size={18} />
          </a>
          <span className="closing-coordinate">
            MEDIC / SENIOR DESIGN / STEVENS
          </span>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div>
              <Logo />
              <p>{project.fullName}</p>
              <span>
                {project.university}
                <br />
                Senior Design Project
              </span>
            </div>
            <nav aria-label="Footer navigation">
              <a href="#about">The project</a>
              <a href="#technology">Technology</a>
              <a href="#architecture">System architecture</a>
              <a href="#progress">Development progress</a>
              <a href="#team">The team</a>
              <a href="#/dashboard/overview">Dashboard demo</a>
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub repository
                  <ArrowUpRight size={14} />
                </a>
              )}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} MEDIC. A Stevens senior design
              project.
            </span>
            <span>IN DEVELOPMENT · DEMONSTRATION INTERFACE</span>
            <a href="#home" aria-label="Back to top">
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
