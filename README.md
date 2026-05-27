# Phoenix Engine

Phoenix Engine is a physics-informed engineering copilot created by Vishvamsinh Vaghela for rapid R&D screening. It helps teams frame simulation studies, reason about thermal, aerodynamic, battery, materials, and manufacturing problems, and turn engineering questions into fast preliminary analysis.

The product is designed for early iteration. Its AI responses are not a replacement for validated CFD, FEA, process simulation, or physical testing.

## Features

- Email/password accounts with HTTP-only, MongoDB-backed sessions
- Account-owned saved conversation history by engineering domain
- Analysis domains for electronics thermal, aerodynamics, battery cooling, and semiconductor processing
- Gemini-powered server-side engineering responses
- MongoDB conversation persistence
- Markdown, table, and LaTeX equation rendering for technical responses
- Saved conversation search, Markdown export, and per-domain history deletion
- Screening-result streaming UI with assumption and validation messaging
- Functional copy-answer and sign-out actions
- Stop-generating control with cancellation-aware answer handling
- Deterministic thermal-resistance screening runs with validated physical inputs
- Saved thermal run history, temperature-margin status, and convection sensitivity comparison
- External-flow force and Reynolds screening driven by user-supplied aerodynamic coefficients
- Battery liquid-loop energy-balance and rectangular-channel pressure-drop screening
- Reaction-limited thin-film deposition uniformity screening with temperature sensitivity
- Saved domain run history and one-click handoff of calculated results into chat for interpretation

## Configuration

Create an `.env` file locally:

```bash
GEMINI_API=your_google_ai_api_key
GEMINI_MODEL=gemini-2.5-flash
MONGO_DATABASE_URL=mongodb+srv://username:password@cluster/phoenix_engine
```

- `GEMINI_API` is read only in the server API route and is never sent to the browser.
- `GEMINI_MODEL` chooses the Gemini model used for analysis generation.
- `MONGO_DATABASE_URL` stores user accounts, expiring sessions, user-owned messages, and saved engineering screening runs through the official MongoDB Node.js driver.
- MongoDB and Gemini configuration are required for the authenticated analysis workflow.

## Run Locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run lint
npm run build
npm run start
```

## Architecture

- `app/page.jsx`: Phoenix Engine workspace shell
- `app/api/chat/route.js`: Gemini-backed engineering response endpoint
- `app/api/conversations/route.js`: authenticated saved-conversation loader
- `app/api/thermal-runs/route.js`: authenticated calculation and persistence endpoint for thermal screening runs
- `app/api/*-runs/route.js`: authenticated persisted screening runs for aerodynamics, battery cooling, and process modeling
- `app/api/auth/*`: account and session endpoints
- `hooks/usePhoenixChat.js`: browser conversation and streamed-display state
- `data/engineData.js`: available engineering analysis domains
- `lib/thermalAnalysis.js`: deterministic steady-state thermal resistance calculation and sensitivity sweep
- `lib/aerodynamicsAnalysis.js`: coefficient-driven external-flow force and Reynolds calculation
- `lib/batteryCoolingAnalysis.js`: coolant energy balance and rectangular-channel pressure-drop calculation
- `lib/processModelingAnalysis.js`: reaction-limited Arrhenius deposition uniformity calculation
- `lib/auth.js`: password hashing and database-backed sessions
- `lib/gemini.js`: server-only Gemini REST integration
- `lib/mongodb.js`: MongoDB connection reuse and persistence setup
