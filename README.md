# MEDIC · Roadway Intelligence

A complete static React + TypeScript website for **Monitoring and Early Detection Infrastructure Crafter**, a Stevens Institute of Technology senior design project. The public site explains the proposed supervised UAV inspection system; a separate application-style dashboard demonstrates inspection review with **12 clearly labeled synthetic records**.

## Run locally

Open a terminal in this folder:

```powershell
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/**. If that port is occupied, Vite prints the available port. Dashboard: **http://127.0.0.1:5173/#/dashboard/overview**.

Node.js 22 LTS is recommended. The selected Vite 6 / Tailwind 4.1 toolchain also works with the Node.js 18.18 installed on the original development computer. Versions are locked in `package-lock.json`; use `npm ci` for reproducible installation.

```powershell
npm test           # Data and DOM interaction tests
npm run typecheck  # Strict TypeScript checks
npm run build      # Typecheck + static production output in dist/
npm run preview    # Serve the production build on port 4173
```

## Included experiences

- Cinematic dark navy public site with original UAV, mapping, hardware, and roadway SVG illustrations. Fonts are bundled locally.
- Responsive navigation, mobile menu, interactive five-stage workflow with keyboard tab navigation, six technology explanations, and detection preview controls.
- Ten-component architecture explorer, honest development roadmap, and clearly labeled editable team placeholders.
- Dashboard overview, interactive Leaflet map, searchable/sortable records, shared type/severity/status filters, CSV export, and record detail drawer.
- Four Recharts visualizations for category, severity, findings over time, and review status. Each uses the same filtered records as the map and table.
- Map marker and table selection share one selected record. The details drawer can navigate to that record on the map.
- Map tiles use CARTO basemaps with OpenStreetMap/CARTO attribution. If tiles fail, an interactive local schematic appears. The rest of the site has no external image or font dependency.
- Semantic controls, skip links, visible focus styles, native modal focus handling, and reduced-motion support.

## Update project content

| File                          | Edit here                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `src/data/project.ts`         | Project metadata, actual repository URL, confirmed technical diagram entries |
| `src/data/team.ts`            | Replace sample team names and responsibilities with confirmed information    |
| `src/data/progress.ts`        | Descriptions and independently editable, verified stage statuses             |
| `src/data/demoInspections.ts` | The single synthetic dataset used throughout the demonstration               |
| `public/diagrams/`            | Add confirmed algorithm diagrams, then register paths in project.ts          |
| `src/styles/global.css`       | Design system, component styles, and responsive breakpoints                  |

The repository URL is empty by default, so no speculative GitHub link is displayed. No team names, field results, completed stages, accuracy claims, customers, flights, or working inference have been invented. All roadway images in this version are original illustrations, not experimental evidence.

## GitHub Pages — prepared for later publication

**No repository has been created or published by this local implementation.** When you approve the design:

1. Create the intended GitHub repository and push these source files, including `package-lock.json`, to its `main` branch. Do not push `node_modules` or `dist`.
2. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. The included `.github/workflows/deploy.yml` installs with `npm ci`, runs tests, configures Pages, builds, uploads `dist`, and deploys using official GitHub actions.
4. The workflow obtains the repository base path from `actions/configure-pages`. Both project sites (`/REPOSITORY/`) and root sites are supported.
5. Open the URL reported by the deployment job. For a normal project repository it will be `https://USERNAME.github.io/REPOSITORY/`.

Navigation uses hash routes (`#/dashboard/records`) and normal public section anchors. A dashboard refresh requests the same static `index.html`, avoiding server-side route fallbacks. Assets respect Vite's configured base path. See [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

For a manual project-path build in PowerShell:

```powershell
$env:VITE_BASE_PATH = '/MEDIC_website/'
npm run build
Remove-Item Env:VITE_BASE_PATH
npm run preview -- --base=/MEDIC_website/
```

The preview must use the same base as the production build. Open the printed URL ending in `/MEDIC_website/`. To verify its assets while the preview runs, use `node scripts/check-build.mjs --base /MEDIC_website/`. The default build base is relative (`./`) for portable local builds. Do not leave a GitHub-specific `VITE_BASE_PATH` configured when deploying to a root domain.

## Vercel

Import the same Git repository as a Vite project. The included `vercel.json` uses `npm run build` and the `dist` directory. Leave `VITE_BASE_PATH` unset for a normal root deployment. No server, database, or credentials are required.

## Future backend integration

`src/lib/inspectionData.ts` defines `InspectionDataProvider`. `DemoInspectionProvider` is the active implementation. `ApiInspectionProvider` is intentionally reserved and raises a clear configuration error; it does not silently pretend to use a backend.

When a real Flask/SQLite backend exists, implement and validate its response contract, error handling, access controls, and CORS before selecting the API provider. GitHub Pages hosts only the static frontend; Flask and persistent storage need separate hosting. Cloud synchronization, telemetry, and inference are not connected in this demo. Keep secrets out of frontend code and Vite variables, which are public in the built bundle.

## Verification and limits

Automated tests exercise shared counts, filters, CSV contents, sorting, drawers, table-to-map selection, map marker clicks/keyboard access, analytics data labels, detection controls, architecture selection, public anchors, workflow tabs, and the mobile menu. DOM tests use jsdom and do not replace a rendered browser review.

The original session could not access its browser automation host. Desktop/mobile visual review, screenshots, actual tile rendering, and browser console verification therefore remain manual checks. Review the local site at desktop, tablet, and mobile widths before publication. The application is fully static and remains usable when map tiles are unavailable.
