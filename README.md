# Phoenix Engine

Phoenix Engine is a physics-informed engineering screening workspace created by Vishvamsinh Vaghela. It combines deterministic engineering calculators, saved analysis conversations, report exports, a tutorial hub, and reduced-order 3D visualizations for early R&D decisions.

Phoenix is built for fast screening and explanation. It is not a replacement for validated CFD, FEA, process simulation, supplier data, or physical testing.

## Features

- Email/password authentication with HTTP-only MongoDB-backed sessions.
- Separate Dashboard, Workbench, Simulations, Chat, and Tutorial views.
- Saved conversations by engineering domain with search, clear, and PDF export.
- Gemini-backed server-side chat for explaining results, assumptions, tradeoffs, and validation steps.
- Deterministic workbenches for:
  - electronics thermal resistance screening
  - coefficient-based aerodynamics force screening
  - battery/cold-plate coolant outlet and pressure-drop screening
  - semiconductor process uniformity screening
- 3D Simulation Studio for electronics, battery cooling, aerodynamics, and process visualization.
- Saved screening runs with assumptions, sensitivity sweeps, result summaries, and one-click "Discuss in Chat".
- Tutorial subpages with tool guides, physics explanations, beginner concepts, and worked examples.
- Request-body validation and size limits on API JSON payloads.
- Escaped report HTML for generated run reports.

## Physics Scope

Phoenix produces screening-level engineering estimates:

- Thermal uses a steady-state equivalent resistance network.
- Aerodynamics uses user-supplied `Cd`/`Cl` with `q = 0.5 rho V^2`, `D = q A Cd`, `L = q A Cl`, and `Re = rho V L / mu`.
- Battery cooling uses a bulk coolant energy balance plus rectangular-channel Darcy-Weisbach pressure drop.
- Process modeling uses a two-point Arrhenius temperature-sensitivity estimate.
- 3D scenes are visual reduced-order concept models, not CFD or FEA mesh solves.

Use Phoenix to compare concepts, find sensitive inputs, and plan validation. Do not use Phoenix outputs as final design-release evidence without higher-fidelity simulation or test data.

## Configuration

Create `.env` from `.env.example`:

```bash
GEMINI_API=your_google_ai_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
MONGO_DATABASE_URL=mongodb+srv://username:password@cluster/phoenix_engine
SESSION_DAYS=365
```

- `GEMINI_API` stays server-side.
- `GEMINI_MODEL` selects the Gemini model used by the chat endpoint.
- `MONGO_DATABASE_URL` stores users, sessions, messages, and saved runs.
- `SESSION_DAYS` is optional and defaults to 365.

MongoDB and Gemini are required for the authenticated analysis workflow.

## Run Locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Verification:

```bash
npm run lint
npm run build
npm run start
```

If Next/Webpack cache warnings appear during development, clear the generated cache:

```bash
rm -rf .next/cache
```

## Project Structure

- `app/page.jsx` - auth/loading gate.
- `components/workspace/PhoenixWorkspace.jsx` - authenticated app shell and view routing.
- `components/workspace/ChatView.jsx` - chat tools, messages, scroll controls, and input.
- `components/workspace/WorkbenchView.jsx` - workbench header and domain workbench selection.
- `components/SimulationStudio.jsx` - simulation studio state/orchestration.
- `components/simulation-studio/*` - simulation header, setup panel, viewport, and results panel.
- `components/TutorialPage.jsx` - tutorial UI.
- `data/engineData.js` - core engineering domains.
- `data/domainWorkbenchConfig.js` - aero, battery, and process workbench configuration.
- `data/thermalWorkbenchConfig.js` - thermal workbench configuration.
- `data/simulationStudioConfig.js` - 3D simulation modules, defaults, and presets.
- `data/tutorialContent.js` - tutorial pages, examples, concepts, and beginner questions.
- `hooks/usePhoenixChat.js` - browser conversation state and streamed-display behavior.
- `hooks/useSimulationStudioScene.js` - Three.js scene lifecycle.
- `lib/*Analysis.js` - deterministic physics calculations.
- `lib/screeningRunHandlers.js` - shared persisted-run API handlers.
- `lib/requestValidation.js` - JSON parsing and request-size guards.
- `lib/auth.js` - password hashing and session cookies.
- `lib/gemini.js` - server-only Gemini REST integration.
- `lib/mongodb.js` - MongoDB connection reuse and indexes.

## API Routes

- `app/api/auth/*` - register, login, logout, session.
- `app/api/chat/route.js` - authenticated engineering chat.
- `app/api/conversations/route.js` - conversation load and clear.
- `app/api/thermal-runs/route.js` - thermal run CRUD.
- `app/api/aerodynamics-runs/route.js` - aerodynamics run CRUD.
- `app/api/battery-runs/route.js` - battery cooling run CRUD.
- `app/api/process-runs/route.js` - process modeling run CRUD.
- `app/api/simulation-runs/route.js` - 3D simulation run CRUD.

## Security Notes

- Sessions use random tokens stored as SHA-256 hashes in MongoDB.
- Session cookies are HTTP-only, `sameSite: lax`, and secure in production.
- Passwords are salted and hashed with Node `scrypt`.
- API routes require authentication before loading or mutating user-owned data.
- JSON request bodies are size-limited and invalid JSON is handled explicitly.
- Generated report HTML escapes user/run data before writing markup.

Known dependency-audit item: the current project uses `next@13.5.1`, and `npm audit` reports Next.js advisories. `npm audit fix` does not resolve them without a forced framework version change. The next security hardening step is upgrading `next` and `eslint-config-next` together, then regression-testing the app.
