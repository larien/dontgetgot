# Operation X

A small web app for running short mission-based sessions with your team. The app is **public** (no Cloudflare Access). Users identify themselves by entering a **name, nickname, or email** on the login page; that value is sent with every API request via the `X-User-Identity` header.

## How the game works

**Operation X** is a mission-based social game. Each player has secret missions: you try to apply each mission to someone. If you achieve it, you mark **Got** (green); if you fail, **Failed** (red). In both cases you assign who got got. Only Got scores points.

- **Create or join a room** — Share the room code so others can join.
- **Missions** — Everyone has one **common mission** (same for the whole room) plus **5 personal missions**. Play in person at a team gathering; try to complete them without getting caught.
- **Outcome** — For each mission you either **succeeded** (you did it undetected) or **failed** (you got got). Only succeeded missions count for points.
- **Score & ranking** — Each mission is worth 1–5 points. Your score is the sum of points from missions you marked as succeeded. Ranking is by score (tie-break: who joined first).
- **End** — The room creator can “Burn the File” to close the room. No new joins; everyone can still view the final ranking.

## Tech stack

- **Frontend:** React 18, Vite, TypeScript (strict), TailwindCSS, Radix Slot, TanStack Query, React Router, lucide-react.
- **Backend:** Cloudflare Pages Functions (TypeScript) under `/functions`.
- **API:** REST JSON with a consistent success/error envelope.

## Local development

```bash
npm install
npm run dev
```

This starts the Vite dev server at **http://localhost:5173**. The app proxies `/api` to **http://localhost:8789**. If you see a **proxy error** or **ECONNREFUSED** when creating/joining a room, the API server is not running. Start it in a **second terminal**:

1. Build once: `npm run build`
2. Start the API (Pages Functions): `npm run dev:api`

Keep using **http://localhost:5173** in the browser; Vite will forward `/api` requests to the API server on 8789.

**Identity**

- The app is public; there is no Cloudflare Access or other gate.
- On first visit you enter your **name, nickname, or email** in a single input. That value is stored in the browser (localStorage) and sent with every API request via `X-User-Identity`. Use “Not you? Log out” to switch.

## Deploy to Cloudflare Pages

1. **Push the repo to GitHub** (or GitLab/other supported git host).

2. **Create a Pages project**
   - In [Cloudflare Dashboard](https://dash.cloudflare.com) go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
   - Select the repo and branch.

3. **Build settings**
   - **Framework preset:** None (or Vite if you prefer; override below).
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** leave default (repo root).
   - **Environment variables:** none required for basic run.
   - **Deploy command:** If the UI allows leaving it blank, do that—Cloudflare will upload the build and serve `/functions` from the repo. If a deploy command is required, use: `npx wrangler pages deploy ./dist --project-name=operationx` (the project name must match the Pages project name in the dashboard; see `wrangler.toml`). When using a custom deploy command, create an API token with **Account → Cloudflare Pages → Edit** ([API Tokens](https://dash.cloudflare.com/profile/api-tokens)), then add it to the project's build settings as an environment variable: name `CLOUDFLARE_API_TOKEN`, value = that token.

   Pages will automatically detect and run **Functions** from the `/functions` directory (no extra config).

4. **Deploy**
   - Save and deploy. Pages will run `npm run build`, then either upload automatically or run your deploy command. The app is served at e.g. `https://<project>.pages.dev`.

5. **Confirm**
   - Visit the app; enter a name, nickname, or email on the login page.
   - Call `GET /api/whoami` (from the same browser). The response should include your identity in `data.email`.

## Cloudflare KV (persistent store)

Rooms and all state are stored in **Cloudflare KV**. One key per room: `room:<code>` → JSON-serialized room. Data persists across deployments and cold starts.

**Local development**

- `npm run dev:api` runs `wrangler pages dev` with `--kv=ROOMS_KV`, so a **local** KV namespace is used (no Cloudflare account needed for dev).
- Room data in local KV is stored on disk and survives restarts of the dev server.

**Production (deploy)**

1. Create a KV namespace and get its id:
   ```bash
   npx wrangler kv namespace create ROOMS_KV
   ```
   Copy the **id** from the output (a UUID).

2. Set the id in `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "ROOMS_KV"
   id = "<paste-the-uuid-here>"
   ```

3. Deploy (e.g. push to Git if using Git integration, or `npx wrangler pages deploy`). Pages will use this config and bind `ROOMS_KV` to your namespace.

## Missions (technical)

Scoring is driven by **missions**:

- **1 common mission** — Same mission for everyone in the room. Picked at room creation with a seeded RNG (seed = room code).
- **5 personal missions** — Random, non-duplicated, per player. Assigned when the player joins. Deterministic: seeded RNG from `roomCode:commonMissionId:playerEmail` so the same player always gets the same set in a given room.
- Personal missions never include the common mission. Each mission has a point value (1–5). **Score** is the sum of points from missions you mark as **succeeded**; **failed** or **pending** missions do not count. Ranking uses this score (tie-break by join time).

Per mission, each player tries to apply it to someone, then sets outcome: **Got** (achieved, green) or **Failed** (red), and in both cases assigns who got got. The room page shows the common mission and your five missions with Got / Failed / Reset. Events feed shows `mission_succeeded`, `mission_failed`, `mission_reset`.

**Privacy:** Each player receives only their own mission list (1 common + 5 personal). The API returns missions only for the caller (identified by X-User-Identity); other players' missions are never exposed. Room state and events do not include mission IDs for other players (so you see "Alice succeeded at a mission +3" but not which mission).

## Project layout

- `functions/api/` — Pages Functions (whoami, room create/join/state/missions/leave/close).
- `functions/api/lib/` — Shared logic: errors, headers, JSON, KV store, types, validation, missions deck, random (seeded RNG), scoring.
- `src/app/` — API client, router, query client, config, utils.
- `src/features/room/` — Room UI: components, hooks, pages (Home, Room).
- `src/ui/` — Reusable UI: Button, Card, Input, Badge, Toast, Spinner.

## API summary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/whoami` | Current user identity (from X-User-Identity header). |
| POST | `/api/room/create` | Body: `{ name }`. Create room and join as creator. |
| POST | `/api/room/join` | Body: `{ code }`. Join room. |
| GET | `/api/room/state?code=XXXX` | Room state (room meta, you, players, ranking, events). |
| GET | `/api/room/missions?code=XXXX` | Your missions (common + 5 personal), completion status, score. |
| POST | `/api/room/missions/complete` | Body: `{ code, missionId, status }`. Set mission status: `succeeded`, `failed`, or `pending`. |
| POST | `/api/room/leave` | Body: `{ code }`. Leave room. |
| POST | `/api/room/close` | Body: `{ code }`. Close room (creator only). |

All endpoints require the `X-User-Identity` header (the value the user entered on the login page: name, nickname, or email).
