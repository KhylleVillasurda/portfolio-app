# ── Stage 1: Build ───────────────────────────────────────────
FROM rust:slim AS builder

WORKDIR /app

# Cache dependency compilation before copying source.
# This layer only re-runs when Cargo.toml / Cargo.lock changes.
COPY Cargo.toml Cargo.lock ./
RUN mkdir -p src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -f src/main.rs

# Now copy the real source and rebuild (only this layer changes on code edits)
COPY src ./src
COPY migrations ./migrations
RUN touch src/main.rs && cargo build --release

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM debian:bookworm-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates libssl3 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/backend ./backend
COPY --from=builder /app/migrations ./migrations

EXPOSE 3000

CMD ["./backend"]
