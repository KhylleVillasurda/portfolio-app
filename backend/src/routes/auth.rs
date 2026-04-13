//! Authentication routes: login, logout, me

use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::{
    cookie::{Cookie, SameSite},
    CookieJar,
};
use time::Duration;

use crate::{
    models::{AuthStatus, ErrorResponse, LoginBody, LoginResponse},
    AppState,
};

// ── POST /api/auth/login ──────────────────────────────────────

pub async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(body): Json<LoginBody>,
) -> impl IntoResponse {
    if body.passphrase != state.admin_passphrase {
        return (
            StatusCode::UNAUTHORIZED,
            jar,
            Json(ErrorResponse::new("Invalid passphrase")),
        )
            .into_response();
    }

    let token = match state.jwt.issue() {
        Ok(t) => t,
        Err(e) => {
            tracing::error!("JWT issue error: {e}");
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                jar,
                Json(ErrorResponse::new("Server error")),
            )
                .into_response();
        }
    };

    let mut builder = Cookie::build(("auth_token", token))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .max_age(Duration::seconds(state.cookie_max_age));

    if state.cookie_secure {
        builder = builder.secure(true);
    }

    let updated_jar = jar.add(builder.build());

    (
        StatusCode::OK,
        updated_jar,
        Json(LoginResponse {
            success: true,
            is_authenticated: true,
        }),
    )
        .into_response()
}

// ── POST /api/auth/logout ─────────────────────────────────────

pub async fn logout(jar: CookieJar) -> impl IntoResponse {
    let removal = Cookie::build(("auth_token", ""))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .max_age(Duration::seconds(0))
        .build();

    let updated_jar = jar.add(removal);

    (
        StatusCode::OK,
        updated_jar,
        Json(serde_json::json!({ "success": true })),
    )
        .into_response()
}

// ── GET /api/auth/me ──────────────────────────────────────────

pub async fn me(State(state): State<AppState>, jar: CookieJar) -> impl IntoResponse {
    let is_authenticated = jar
        .get("auth_token")
        .and_then(|c| state.jwt.validate(c.value()).ok())
        .is_some();

    (
        StatusCode::OK,
        Json(AuthStatus { is_authenticated }),
    )
        .into_response()
}
