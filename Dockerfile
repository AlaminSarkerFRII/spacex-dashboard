# ─── Stage 1: base ───────────────────────────────────────────
# Shared Alpine + pnpm setup used by every stage below.
FROM node:20-alpine AS base
RUN corepack enable

# ─── Stage 2: deps ───────────────────────────────────────────
# Install ALL dependencies (dev + prod) so later stages can
# run tests and build without re-installing.
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Stage 3: test ───────────────────────────────────────────
# Run Jest unit tests.  If any test fails the whole Docker build
# fails here — the runner image is never produced from a broken build.
FROM deps AS test
WORKDIR /app

COPY . .
RUN pnpm test --passWithNoTests

# ─── Stage 4: builder ────────────────────────────────────────
# Build the Next.js application (standalone output).
FROM deps AS builder
WORKDIR /app

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ─── Stage 5: runner ─────────────────────────────────────────
# Minimal production image — only the standalone server + assets.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# curl for the healthcheck
RUN apk add --no-cache curl

# Dedicated non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy the standalone server (built in stage 4)
COPY --from=builder /app/public               ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone  ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static      ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
