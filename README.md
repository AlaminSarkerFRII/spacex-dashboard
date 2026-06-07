# SpaceX Dashboard

A full-stack SpaceX data explorer built with **Next.js 16**, **Apollo Client 4**, and a local **GraphQL API** powered by GraphQL Yoga. Built as a learning project to understand GraphQL schema design, resolvers, Apollo Client integration, and modern Next.js App Router patterns.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | Tailwind CSS 4 |
| GraphQL Client | Apollo Client 4 + `@apollo/experimental-nextjs-app-support` |
| GraphQL Server | GraphQL Yoga (Next.js Route Handler at `/api/graphql`) |
| Unit Tests | Jest 30 + Testing Library |
| E2E Tests | Playwright 1.60 |
| Containerisation | Docker + Docker Compose |

---

## Features

- **Dashboard** — Company overview, leadership cards, stat grid, upcoming launches
- **Launches** — Past launches with search (mission, rocket, site, details) + success/failed filter + pagination
- **Rockets** — Rocket specs with search by name, country, engine type
- **Launchpads** — Launch site details with success rate stats
- **Fleet (Ships)** — Recovery ships, drone ships, fairing vessels with type filter + search
- **Auth** — Demo login modal, avatar, profile card, sign out (no backend required)

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/installation) — `npm install -g pnpm`
- [Docker + Docker Compose](https://docs.docker.com/get-docker/) _(optional, for containerised run)_

---

## Getting Started (Local)

### 1. Clone and install

```bash
git clone <repo-url>
cd spacex-dashboard
pnpm install
```

### 2. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The GraphQL playground is available at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

### 3. Build for production

```bash
pnpm build
pnpm start
```

---

## Demo Account

The app ships with a built-in demo account. Click **Sign in** in the header.

| Field | Value |
|---|---|
| Email | `admin@gmail.com` |
| Password | `admin` |

After signing in, click your avatar to view the profile card or sign out.

---

## Project Structure

```
spacex-dashboard/
├── src/
│   ├── app/
│   │   ├── api/graphql/route.ts     # GraphQL Yoga server (POST + GET)
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── launches/                # List + [id] detail
│   │   ├── rockets/                 # List + [id] detail
│   │   ├── launchpads/              # List + [id] detail
│   │   └── ships/                   # List + [id] detail
│   ├── components/                  # Shared UI components
│   ├── graphql/
│   │   ├── schema.ts                # GraphQL SDL type definitions
│   │   ├── resolvers.ts             # Query resolvers
│   │   ├── data.ts                  # Local data (rockets, launches, ships…)
│   │   └── queries.ts               # Apollo gql query documents
│   ├── lib/
│   │   ├── apollo-client.ts         # Apollo Client factory
│   │   ├── apollo-provider.tsx      # ApolloNextAppProvider wrapper
│   │   └── auth-context.tsx         # Auth context + useAuth hook
│   └── __tests__/                   # Jest unit tests
├── e2e/                             # Playwright E2E tests
├── Dockerfile                       # Multi-stage production build
├── Dockerfile.e2e                   # Playwright test runner image
├── docker-compose.yml               # App + E2E orchestration
├── playwright.config.ts
└── jest.config.ts
```

---

## GraphQL API

The app runs its own local GraphQL server — no external API dependency.

**Endpoint:** `POST /api/graphql`

### Available queries

```graphql
query {
  company { name founder ceo employees valuation }

  rockets { id name active first_flight }
  rocket(id: ID!) { ...all fields }

  launchesPast(limit: Int, offset: Int) { id mission_name launch_success }
  launchesUpcoming(limit: Int) { id mission_name launch_date_utc }
  launch(id: ID!) { ...all fields }

  launchPads { id name status launch_attempts launch_successes }
  launchPad(id: ID!) { ...all fields }

  ships { id name type roles active }
  ship(id: ID!) { ...all fields }
}
```

Open the playground at `/api/graphql` (GET request) to explore the full schema interactively.

---

## Testing

### Unit tests (Jest)

```bash
# Run all unit tests
pnpm test

# Watch mode — re-runs on file save
pnpm test:watch

# With coverage report
pnpm test:coverage
```

**What is tested:**

| File | Coverage |
|---|---|
| `data.test.ts` | Required fields, success ≤ attempts, future dates on upcoming launches |
| `resolvers.test.ts` | Every resolver: correct data, find by id, null for unknown, limit/offset |
| `auth.test.tsx` | Login/logout state transitions, correct/wrong credentials, return values |

### E2E tests (Playwright)

Requires the dev server to be running **or** use Docker (see below).

```bash
# Run all E2E tests — auto-starts the dev server
pnpm test:e2e

# Interactive UI mode — step through tests visually
pnpm test:e2e:ui

# Open the HTML report from the last run
pnpm test:e2e:report
```

**What is tested:**

| File | Coverage |
|---|---|
| `home.spec.ts` | Title, hero, company stats, leadership, CTA navigation |
| `launches.spec.ts` | Card list, search, no-results state, Success/Failed filters, detail page |
| `auth.spec.ts` | Modal open/close, wrong credentials error, login, profile modal, sign out, Escape key |
| `navigation.spec.ts` | All nav links, logo link, active link highlight |

---

## Docker

### Run the full stack

```bash
docker compose up --build
```

This runs in sequence:

**Step 1 — Build the `app` image** (Dockerfile, 5 stages)

```
base    →  Node 20 Alpine + corepack (pnpm)
deps    →  pnpm install --frozen-lockfile
test    →  pnpm test          ← Jest unit tests; build fails if any test fails
builder →  pnpm build         ← Next.js standalone output
runner  →  Minimal production image (non-root user, port 3000)
```

**Step 2 — Start the `app` container** and wait until it passes the healthcheck (`curl http://localhost:3000`)

**Step 3 — Run the `e2e` container** (`Dockerfile.e2e`) against the live app:
- Uses the official Playwright Docker image (browsers pre-installed, no download)
- `BASE_URL=http://app:3000` tells Playwright where the app lives
- `webServer` in `playwright.config.ts` is automatically skipped when `BASE_URL` is set
- Runs all 4 spec files and prints results

Visit [http://localhost:3000](http://localhost:3000) while the app container is running.

### Useful Docker commands

```bash
# Full flow — build + unit tests + start app + E2E tests
docker compose up --build

# Exit with the E2E result code (useful in CI pipelines)
docker compose up --build --exit-code-from e2e

# Start only the app, skip E2E
docker compose up --build app

# Rebuild just the E2E image after editing test files
docker compose build e2e && docker compose run --rm e2e

# Stop and remove all containers
docker compose down
```

---

## Scripts Reference

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server (requires build first) |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Jest unit tests |
| `pnpm test:watch` | Jest in watch mode |
| `pnpm test:coverage` | Jest with coverage report |
| `pnpm test:e2e` | Run Playwright E2E tests (starts dev server automatically) |
| `pnpm test:e2e:ui` | Playwright interactive UI mode |
| `pnpm test:e2e:report` | Open the last Playwright HTML report |

---

## Key Concepts Demonstrated

- **GraphQL schema-first design** — SDL types in `schema.ts`, resolvers in `resolvers.ts`, data in `data.ts`
- **Apollo Client 4 with App Router** — hooks from `@apollo/client/react`, provider via `ApolloNextAppProvider`
- **Next.js Route Handler as a GraphQL server** — `GET` serves the playground, `POST` handles queries
- **Client-side filtering** — search + filter stack over already-fetched data without extra requests
- **React Context for auth** — `useAuth` hook with `login`/`logout`, no external auth library
- **Multi-stage Docker builds** — Jest unit tests gate the image; E2E tests run against the live container
