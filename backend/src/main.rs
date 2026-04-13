//! Showcase Portfolio — Axum backend
//!
//! Endpoints:
//!   GET    /api/healthz
//!   GET    /api/projects
//!   POST   /api/projects          (auth)
//!   GET    /api/projects/:id
//!   PUT    /api/projects/:id      (auth)
//!   DELETE /api/projects/:id      (auth)
//!   GET    /api/theme-settings
//!   PUT    /api/theme-settings    (auth)
//!   POST   /api/auth/login
//!   POST   /api/auth/logout
//!   GET    /api/auth/me

mod auth;
mod models;
mod routes;

use std::sync::Arc;

use anyhow::Result;
use axum::{
    http::{HeaderValue, Method, StatusCode},
    response::IntoResponse,
    routing::{delete, get, post, put},
    Json, Router,
};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::SqlitePool;
use std::str::FromStr;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::auth::JwtConfig;

// ── Shared state ──────────────────────────────────────────────

#[derive(Clone)]
pub struct AppState {
    pub db:               SqlitePool,
    pub jwt:              Arc<JwtConfig>,
    pub admin_passphrase: String,
    pub cookie_secure:    bool,
    pub cookie_max_age:   i64,
}

// ── Main ──────────────────────────────────────────────────────

#[tokio::main]
async fn main() -> Result<()> {
    // Load .env (silently ignored if file missing)
    let _ = dotenvy::dotenv();

    // Tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "backend=debug,tower_http=debug".parse().unwrap()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // ── Config ────────────────────────────────────────────────
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(3000);

    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:./portfolio.db".into());

    let jwt_secret = std::env::var("JWT_SECRET")
        .expect("JWT_SECRET must be set — copy .env.example to .env");

    let admin_passphrase = std::env::var("ADMIN_PASSPHRASE")
        .expect("ADMIN_PASSPHRASE must be set — copy .env.example to .env");

    let jwt_expiry: u64 = std::env::var("JWT_EXPIRY_SECS")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(86_400);

    let cookie_secure: bool = std::env::var("COOKIE_SECURE")
        .map(|v| v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);

    let allowed_origins_raw = std::env::var("ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "http://localhost:5173".into());

    // ── Database ──────────────────────────────────────────────
    let opts = SqliteConnectOptions::from_str(&database_url)?.create_if_missing(true);

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(opts)
        .await?;

    // Run all migrations in a single call (supports multiple statements)
    sqlx::raw_sql(include_str!("../migrations/001_initial.sql"))
        .execute(&pool)
        .await?;

    tracing::info!("Database ready at {database_url}");

    // ── App state ─────────────────────────────────────────────
    let state = AppState {
        db: pool,
        jwt: Arc::new(JwtConfig::new(&jwt_secret, jwt_expiry)),
        admin_passphrase,
        cookie_secure,
        cookie_max_age: jwt_expiry as i64,
    };

    // ── CORS ──────────────────────────────────────────────────
    let origins: Vec<HeaderValue> = allowed_origins_raw
        .split(',')
        .filter_map(|s| s.trim().parse().ok())
        .collect();

    let cors = CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ])
        .allow_credentials(true)
        .allow_origin(AllowOrigin::list(origins));

    // ── Router ────────────────────────────────────────────────
    // In Axum 0.7 you can't register two handlers on the same path+method
    // in separate .route() calls — chain them on the same MethodRouter.
    let app = Router::new()
        // Health
        .route("/api/healthz", get(health_check))
        // Projects collection
        .route(
            "/api/projects",
            get(routes::projects::list_projects).post(routes::projects::create_project),
        )
        // Single project
        .route(
            "/api/projects/:id",
            get(routes::projects::get_project)
                .put(routes::projects::update_project)
                .delete(routes::projects::delete_project),
        )
        // Theme settings
        .route(
            "/api/theme-settings",
            get(routes::theme::get_theme_settings).put(routes::theme::update_theme_settings),
        )
        // Auth
        .route("/api/auth/login",  post(routes::auth::login))
        .route("/api/auth/logout", post(routes::auth::logout))
        .route("/api/auth/me",     get(routes::auth::me))
        .layer(cors)
        .with_state(state);

    let addr = format!("0.0.0.0:{port}");
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Listening on http://{addr}");

    axum::serve(listener, app).await?;
    Ok(())
}

// ── Health check ──────────────────────────────────────────────

async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, Json(serde_json::json!({ "status": "ok" })))
}
