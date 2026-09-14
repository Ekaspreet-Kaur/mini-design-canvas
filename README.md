# Canvas Studio

A production-minded mini design canvas built for the Glazia Full Stack Developer Intern assignment.

## Stack

- Next.js + React + TypeScript + Tailwind CSS
- React Konva + Konva
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Zod validation

## Features

- Canvas create/load/update/delete
- Rectangle, circle and text elements
- Select, drag, resize and rotate
- Element properties: x, y, width, height, rotation, fill and text
- Layer ordering
- Undo/redo
- Autosave
- PNG export
- REST API with validation, CORS, status codes and error handling

## Architecture

Frontend and backend are separate applications in one repository. The browser keeps the active canvas in React state and persists it through the Express REST API. MongoDB stores the canvas document and its elements.

## Local setup

1. Install Node.js 20+.
2. Start MongoDB locally or create a MongoDB Atlas database.
3. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
4. Copy `frontend/.env.example` to `frontend/.env.local`.
5. Run `npm install` inside both `backend` and `frontend`.
6. Run `npm run dev` inside `backend` (port 5000).
7. Run `npm run dev` inside `frontend` (port 3000).
8. Open `http://localhost:3000`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/canvases` | Create canvas |
| GET | `/api/canvases` | List canvases |
| GET | `/api/canvases/:id` | Load canvas |
| PUT | `/api/canvases/:id` | Update canvas |
| DELETE | `/api/canvases/:id` | Delete canvas |

## Known limitations

- Authentication is not included because it is not required for the core assignment.
- Autosave is debounced and intentionally lightweight; production collaboration would need conflict resolution/versioning.
- PNG export currently exports the visible canvas stage.
