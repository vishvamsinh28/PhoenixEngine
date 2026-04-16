# SynthioLabs Chat UI

This project is a responsive mock chat experience built with Next.js and Tailwind CSS. It focuses on UI polish, reusable components, and a lightweight mock streaming flow for assistant replies.

Live demo:
- [synthioassignment.vercel.app](https://synthioassignment.vercel.app/)

## Setup

Requirements:
- Node.js 18+
- npm

Run locally:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Libraries Used

- `next`
  App framework and routing
- `react` / `react-dom`
  UI rendering and state management
- `tailwindcss`
  Styling and responsive utility classes
- `lucide-react`
  Icons used across the interface
- `postcss` / `autoprefixer`
  Tailwind build pipeline

## Project Structure

- [app/page.jsx](/app/page.jsx)
  Main page layout
- [hooks/useMockChat.js](/hooks/useMockChat.js)
  Mock chat state and streaming behavior
- [data/mockData.js](/data/mockData.js)
  Seed chat and message data
- [data/uiConfig.js](/data/uiConfig.js)
  Shared UI config such as nav tabs and message actions
- [components](/components)
  Reusable UI components

## Assumptions

- The chat experience is mock/demo only and does not call a backend or real AI model.
- Assistant replies are streamed from a random response chosen from the mock assistant message pool.
- While a reply is streaming, the composer is intentionally disabled to avoid overlapping sends.
- Sidebar previews are derived from message state so the conversation list stays in sync with the active thread.
- The current implementation prioritizes clean component structure and responsive behavior over backend integration.

## Notes

- The copy action on assistant messages is functional.
- Mobile uses a floating chat list sheet opened from the hamburger menu.
