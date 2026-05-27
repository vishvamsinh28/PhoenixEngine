# Phoenix Engine

Phoenix Engine is a physics-informed engineering copilot for rapid R&D screening. It helps teams frame simulation studies, reason about thermal, aerodynamic, battery, materials, and manufacturing problems, and turn engineering questions into fast preliminary analysis.

The product is designed for early iteration. Its AI responses are not a replacement for validated CFD, FEA, process simulation, or physical testing.

## Features

- Engineering Copilot with project-specific analysis threads
- Seed projects across electronics thermal, aerodynamics, battery cooling, and semiconductor processing
- Gemini-powered server-side engineering responses
- MongoDB conversation persistence when configured
- CAD/data asset selection for STEP, IGES, STL, CSV, JSON, VTK, and OBJ inputs
- Screening-result streaming UI with assumption and validation messaging
- Overview, model library, and dataset workspace surfaces

Asset files are currently represented in prompt context by filename only. Binary CAD parsing and solver ingestion are the next integration stage.

## Configuration

Create an `.env` file locally:

```bash
GEMINI_API=your_google_ai_api_key
GEMINI_MODEL=gemini-2.5-flash
MONGO_DATABASE_URL=mongodb+srv://username:password@cluster/phoenix_engine
```

- `GEMINI_API` is read only in the server API route and is never sent to the browser.
- `GEMINI_MODEL` chooses the Gemini model used for analysis generation.
- `MONGO_DATABASE_URL` enables persisted thread messages through the official MongoDB Node.js driver.
- Without configuration, the UI remains usable with seeded projects and clearly marked fallback responses.

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
- `app/api/conversations/route.js`: stored or seeded conversation loader
- `hooks/usePhoenixChat.js`: browser conversation and streamed-display state
- `data/engineData.js`: starter engineering projects
- `lib/gemini.js`: server-only Gemini REST integration
- `lib/mongodb.js`: MongoDB connection reuse and persistence setup
