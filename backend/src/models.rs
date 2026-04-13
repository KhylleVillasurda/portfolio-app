//! Data models — mirror the OpenAPI component schemas exactly
//! so JSON serialization needs zero manual mapping.

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

// ── Project ──────────────────────────────────────────────────

/// Full project row as stored in SQLite.
#[derive(Debug, FromRow)]
pub struct ProjectRow {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub repo_url: Option<String>,
    pub ext_url: Option<String>,
    /// Stored as a JSON string, e.g. `["Rust","React"]`
    pub tech_stack: String,
    pub hobby_tag: Option<String>,
    pub created_at: NaiveDateTime,
}

/// API response shape — camelCase to match the OpenAPI spec.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Project {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub repo_url: Option<String>,
    pub ext_url: Option<String>,
    pub tech_stack: Vec<String>,
    pub hobby_tag: Option<String>,
    pub images: Vec<ProjectImage>,
    pub created_at: String,
}

impl Project {
    pub fn from_row(row: ProjectRow, images: Vec<ProjectImage>) -> Self {
        let tech_stack: Vec<String> = serde_json::from_str(&row.tech_stack).unwrap_or_default();

        Self {
            id: row.id,
            title: row.title,
            description: row.description,
            repo_url: row.repo_url,
            ext_url: row.ext_url,
            tech_stack,
            hobby_tag: row.hobby_tag,
            images,
            created_at: row.created_at.format("%Y-%m-%dT%H:%M:%SZ").to_string(),
        }
    }
}

// ── Project Image ─────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ProjectImage {
    pub id: i64,
    pub url: String,
    pub display_order: i64,
}

// ── Create / Update body ──────────────────────────────────────

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProjectBody {
    pub title: String,
    pub description: String,
    pub repo_url: Option<String>,
    pub ext_url: Option<String>,
    pub tech_stack: Vec<String>,
    pub hobby_tag: Option<String>,
}

// ── Auth ──────────────────────────────────────────────────────

#[derive(Debug, Deserialize)]
pub struct LoginBody {
    pub passphrase: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginResponse {
    pub success: bool,
    pub is_authenticated: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthStatus {
    pub is_authenticated: bool,
}

// ── Theme settings ────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize, FromRow, Default)]
pub struct ThemeSettings {
    #[serde(rename = "manga_panel_A")]
    pub manga_panel_a: Option<String>,
    #[serde(rename = "manga_panel_B")]
    pub manga_panel_b: Option<String>,
    #[serde(rename = "manga_panel_C")]
    pub manga_panel_c: Option<String>,
    #[serde(rename = "manga_panel_D")]
    pub manga_panel_d: Option<String>,
    #[serde(rename = "manga_panel_E")]
    pub manga_panel_e: Option<String>,
    #[serde(rename = "manga_panel_F")]
    pub manga_panel_f: Option<String>,
    #[serde(rename = "manga_panel_G")]
    pub manga_panel_g: Option<String>,
}

// ── Error ─────────────────────────────────────────────────────

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub success: bool,
    pub error: String,
}

impl ErrorResponse {
    pub fn new(msg: impl Into<String>) -> Self {
        Self {
            success: false,
            error: msg.into(),
        }
    }
}
