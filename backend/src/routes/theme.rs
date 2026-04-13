//! Theme settings routes

use axum::{
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::CookieJar;
use sqlx::Row;

use crate::{
    models::{ErrorResponse, ThemeSettings},
    AppState,
};

// ── GET /api/theme-settings ───────────────────────────────────

pub async fn get_theme_settings(State(state): State<AppState>) -> impl IntoResponse {
    let row = sqlx::query(
        "SELECT manga_panel_a, manga_panel_b, manga_panel_c,
                manga_panel_d, manga_panel_e, manga_panel_f, manga_panel_g
         FROM theme_settings WHERE id = 1",
    )
    .fetch_optional(&state.db)
    .await;

    match row {
        Ok(Some(r)) => {
            let settings = ThemeSettings {
                manga_panel_a: r.get("manga_panel_a"),
                manga_panel_b: r.get("manga_panel_b"),
                manga_panel_c: r.get("manga_panel_c"),
                manga_panel_d: r.get("manga_panel_d"),
                manga_panel_e: r.get("manga_panel_e"),
                manga_panel_f: r.get("manga_panel_f"),
                manga_panel_g: r.get("manga_panel_g"),
            };
            (StatusCode::OK, Json(serde_json::json!(settings))).into_response()
        }
        Ok(None) => (StatusCode::OK, Json(serde_json::json!(ThemeSettings::default()))).into_response(),
        Err(e) => {
            tracing::error!("get_theme_settings: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!(ErrorResponse::new("Database error"))),
            )
                .into_response()
        }
    }
}

// ── PUT /api/theme-settings ───────────────────────────────────

pub async fn update_theme_settings(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(body): Json<ThemeSettings>,
) -> impl IntoResponse {
    if jar
        .get("auth_token")
        .and_then(|c| state.jwt.validate(c.value()).ok())
        .is_none()
    {
        return (
            StatusCode::UNAUTHORIZED,
            Json(serde_json::json!(ErrorResponse::new("Unauthorized"))),
        )
            .into_response();
    }

    let result = sqlx::query(
        "INSERT INTO theme_settings
             (id, manga_panel_a, manga_panel_b, manga_panel_c,
              manga_panel_d, manga_panel_e, manga_panel_f, manga_panel_g,
              updated_at)
         VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET
             manga_panel_a = excluded.manga_panel_a,
             manga_panel_b = excluded.manga_panel_b,
             manga_panel_c = excluded.manga_panel_c,
             manga_panel_d = excluded.manga_panel_d,
             manga_panel_e = excluded.manga_panel_e,
             manga_panel_f = excluded.manga_panel_f,
             manga_panel_g = excluded.manga_panel_g,
             updated_at    = excluded.updated_at",
    )
    .bind(&body.manga_panel_a)
    .bind(&body.manga_panel_b)
    .bind(&body.manga_panel_c)
    .bind(&body.manga_panel_d)
    .bind(&body.manga_panel_e)
    .bind(&body.manga_panel_f)
    .bind(&body.manga_panel_g)
    .execute(&state.db)
    .await;

    match result {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!(body))).into_response(),
        Err(e) => {
            tracing::error!("update_theme_settings: {e}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!(ErrorResponse::new("Database error"))),
            )
                .into_response()
        }
    }
}
