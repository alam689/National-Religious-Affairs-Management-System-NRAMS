# NRAMS — National Religious Affairs Management System

React prototype of the Ministry of Religious Affairs (Bangladesh) integrated digital platform, built on the navy + brand-blue visual system in `DESIGN-THEME.md`. All data is synthetic and generated deterministically in `src/data/mock.ts`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
```

Live demo: https://alam689.github.io/National-Religious-Affairs-Management-System-NRAMS/

Deploy: `npm run build:pages` builds `dist/` for GitHub Pages (repo sub-path base + `404.html` SPA fallback). `.github/workflows/deploy-pages.yml` runs it on every push to `main` and publishes `dist/` to the `gh-pages` branch, which Pages serves.

Stack: Vite 5 · React 18 · TypeScript · Tailwind CSS 3 · lucide-react · recharts · react-router-dom 6 · Leaflet. Bangla is the default UI language (Hind Siliguri); toggle to English from the top bar or login screen.

## Routes ↔ scope modules

| Route | Scope module | Phase |
|---|---|---|
| `/login` | Officer sign-in (split screen, workspace selector) | — |
| `/` | 17 · Central Ministry Dashboard | 1 |
| `/institutions` | 1 · Religious Institution Registration & Database (registry, filters, 5-step registration wizard) | 1 |
| `/institutions/:id` | 2 · Religious Institution Digital Profile (committee, infra, grants, inspections, docs) | 1 |
| `/grants` | 3 · Government Grant Management (7-stage workflow, list + kanban board) | 1 |
| `/inspections` | 4 · Inspection Management (dashboard + field-officer mobile app mock) | 1 |
| `/gis` | 5 · GIS Mapping (real Bangladesh map — OpenStreetMap basemap, official division/district boundaries, layers, division → district drill-down) | 3 |
| `/hajj` | 6 · Hajj Management (pilgrim database, agencies, packages, pipeline) | 2 |
| `/hajj/operations` | 6 · Flights, accommodation, transport, medical + Pilgrim mobile app mock | 2 |
| `/hajj/training` | 7 · Hajj Training Management | 2 |
| `/complaints` | 8 · Hajj Complaint & Support Centre (tickets, SLA, categories) | 2 |
| `/waqf` | 9 · Waqf Property Management (digital asset registry) | 3 |
| `/waqf/leases` | 10 · Waqf Lease & Revenue Management | 3 |
| `/education` | 11 · Religious Education Management | 2 |
| `/personnel` | 12 · Religious Leader / Personnel Database | 1 |
| `/hrms` | 13 · e-HRMS & Attendance (+ mobile GPS attendance mock) | 1 |
| `/events` | 14 · Religious Event / Program Management | 2 |
| `/assistance` | 15 · Donation / Assistance Management | 2 |
| `/portal` | 16 · Citizen Service Portal (public layout) | 3 |
| `/analytics` | 18 · AI / Advanced Analytics (forecast, anomaly, risk, assistant) | 3 |
| `/roadmap` | Phased implementation, umbrella architecture, project names | — |

## Structure

```
src/
  i18n.tsx            language context, Bangla/English dictionary, number/date/money formatters
  components/ui.tsx   Card, StatTile, Badge (semantic tones), Table, Modal, Tabs, Stepper, Progress…
  components/Shell.tsx  264px navy sidebar (grouped nav with phase tags), white top bar, mobile drawer
  data/mock.ts        seeded generator: institutions, grants, inspections, pilgrims, agencies, flights,
                      waqf properties, leases, personnel, employees, events, assistance, time series
  pages/              one file per module
```

## Notes

- ID formats follow the theme (`MOS-2026-000123`, `GRT-2026-00061`, `WQF-DHA-00012`, `PLG-2026-000001`, `HCT-020291`).
- Status strings map automatically to semantic badge colours via `statusTone()` in `ui.tsx`.
- The GIS page is a Leaflet map: OpenStreetMap tiles (switchable to a boundaries-only view) under the 8 division and 64 district boundaries in `src/data/bd-geo.json`. The boundaries are Bangladesh Bureau of Statistics / OCHA data distributed by [geoBoundaries](https://www.geoboundaries.org) (gbOpen BGD ADM2, CC BY 3.0 IGO), simplified for the web; divisions and the national outline are dissolved from the districts. Sample markers are synthetic but always fall inside their district. A production build would serve boundaries and institutions from PostGIS.
- No backend: every action (approve, submit, check-in) is UI-only. Replace `data/mock.ts` imports with API calls to wire a real service layer.
