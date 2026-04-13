//! CRUD routes for /api/projects
//!
//! Uses sqlx::query_as::<_, T>() (runtime type mapping via FromRow derive)
//! so no DATABASE_URL is required at compile time.

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use axum_extra::extract::CookieJar;
use sqlx::Row;

use crate::{
    models::{CreateProjectBody, ErrorResponse, Project, ProjectImage, ProjectRow},
    AppState,
};

// ── GET /api/projects ─────────────────────────────────────────

pub async fn list_projects(State(state): State<AppState>) -> impl IntoResponse {
    let rows: Vec<ProjectRow> = match sqlx::query_as::<_, ProjectRow>(
        "SELECT id, title, description, repo_url, ext_url, tech_stack, hobby_tag, created_at
         FROM projects ORDER BY id DESC",
    )
    .fetch_all(&state.db)
    .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::error!("list_projects: {e}");
            return err500("Database error");
        }
    };

    let mut projects: Vec<Project> = Vec::with_capacity(rows.len());
    for row in rows {
        let images = load_images(&state, row.id).await;
        projects.push(Project::from_row(row, images));
    }

    (StatusCode::OK, Json(serde_json::json!(projects))).into_response()
}

// ── GET /api/projects/:id ─────────────────────────────────────

pub async fn get_project(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> impl IntoResponse {
    match fetch_one(&state, id).await {
        Some(p) => (StatusCode::OK, Json(serde_json::json!(p))).into_response(),
        None => err404(&format!("Project {id} not found")),
    }
}

// ── POST /api/projects ────────────────────────────────────────

pub async fn create_project(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(body): Json<CreateProjectBody>,
) -> impl IntoResponse {
    if !authed(&jar, &state) {
        return err401();
    }
    if body.title.trim().is_empty() || body.title.len() > 100 {
        return err400("title must be 1–100 characters");
    }
    if body.description.len() < 10 || body.description.len() > 5000 {
        return err400("description must be 10–5000 characters");
    }

    let tech_json = serde_json::to_string(&body.tech_stack).unwrap_or_else(|_| "[]".into());

    let row = match sqlx::query_as::<_, ProjectRow>(
        "INSERT INTO projects (title, description, repo_url, ext_url, tech_stack, hobby_tag)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         RETURNING id, title, description, repo_url, ext_url, tech_stack, hobby_tag, created_at",
    )
    .bind(&body.title)
    .bind(&body.description)
    .bind(&body.repo_url)
    .bind(&body.ext_url)
    .bind(&tech_json)
    .bind(&body.hobby_tag)
    .fetch_one(&state.db)
    .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::error!("create_project: {e}");
            return err500("Database error");
        }
    };

    let project = Project::from_row(row, vec![]);
    (StatusCode::CREATED, Json(serde_json::json!(project))).into_response()
}

// ── PUT /api/projects/:id ─────────────────────────────────────

pub async fn update_project(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(id): Path<i64>,
    Json(body): Json<CreateProjectBody>,
) -> impl IntoResponse {
    if !authed(&jar, &state) {
        return err401();
    }
    if fetch_one(&state, id).await.is_none() {
        return err404(&format!("Project {id} not found"));
    }

    let tech_json = serde_json::to_string(&body.tech_stack).unwrap_or_else(|_| "[]".into());

    let row = match sqlx::query_as::<_, ProjectRow>(
        "UPDATE projects
         SET title=?1, description=?2, repo_url=?3, ext_url=?4,
             tech_stack=?5, hobby_tag=?6, updated_at=datetime('now')
         WHERE id=?7
         RETURNING id, title, description, repo_url, ext_url, tech_stack, hobby_tag, created_at",
    )
    .bind(&body.title)
    .bind(&body.description)
    .bind(&body.repo_url)
    .bind(&body.ext_url)
    .bind(&tech_json)
    .bind(&body.hobby_tag)
    .bind(id)
    .fetch_one(&state.db)
    .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::error!("update_project: {e}");
            return err500("Database error");
        }
    };

    let images = load_images(&state, id).await;
    let project = Project::from_row(row, images);
    (StatusCode::OK, Json(serde_json::json!(project))).into_response()
}

// ── DELETE /api/projects/:id ──────────────────────────────────

pub async fn delete_project(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(id): Path<i64>,
) -> impl IntoResponse {
    if !authed(&jar, &state) {
        return err401();
    }

    match sqlx::query("DELETE FROM projects WHERE id = ?1")
        .bind(id)
        .execute(&state.db)
        .await
    {
        Ok(r) if r.rows_affected() == 0 => err404(&format!("Project {id} not found")),
        Ok(_) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => {
            tracing::error!("delete_project: {e}");
            err500("Database error")
        }
    }
}

// ── Helpers ───────────────────────────────────────────────────

async fn fetch_one(state: &AppState, id: i64) -> Option<Project> {
    let row: ProjectRow = sqlx::query_as::<_, ProjectRow>(
        "SELECT id, title, description, repo_url, ext_url, tech_stack, hobby_tag, created_at
         FROM projects WHERE id = ?1",
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await
    .ok()??;

    let images = load_images(state, id).await;
    Some(Project::from_row(row, images))
}

async fn load_images(state: &AppState, project_id: i64) -> Vec<ProjectImage> {
    // Map file_path → url so the JSON matches the OpenAPI schema
    let raw = sqlx::query(
        "SELECT id, file_path, display_order FROM project_images
         WHERE project_id = ?1 ORDER BY display_order ASC",
    )
    .bind(project_id)
    .fetch_all(&state.db)
    .await
    .unwrap_or_default();

    raw.into_iter()
        .map(|r| ProjectImage {
            id:            r.get("id"),
            url:           r.get("file_path"),
            display_order: r.get("display_order"),
        })
        .collect()
}

fn authed(jar: &CookieJar, state: &AppState) -> bool {
    jar.get("auth_token")
        .and_then(|c| state.jwt.validate(c.value()).ok())
        .is_some()
}

// ── Error response helpers ────────────────────────────────────

fn err400(msg: &str) -> axum::response::Response {
    (StatusCode::BAD_REQUEST, Json(serde_json::json!(ErrorResponse::new(msg)))).into_response()
}
fn err401() -> axum::response::Response {
    (StatusCode::UNAUTHORIZED, Json(serde_json::json!(ErrorResponse::new("Unauthorized")))).into_response()
}
fn err404(msg: &str) -> axum::response::Response {
    (StatusCode::NOT_FOUND, Json(serde_json::json!(ErrorResponse::new(msg)))).into_response()
}
fn err500(msg: &str) -> axum::response::Response {
    (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!(ErrorResponse::new(msg)))).into_response()
}
