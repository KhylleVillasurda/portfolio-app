-- ============================================================
-- 001_initial.sql — Showcase Portfolio initial schema
-- ============================================================

CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
    description TEXT    NOT NULL CHECK(length(description) BETWEEN 10 AND 5000),
    repo_url    TEXT    CHECK(repo_url IS NULL OR repo_url LIKE 'https://%'),
    ext_url     TEXT    CHECK(ext_url  IS NULL OR ext_url  LIKE 'https://%'),
    tech_stack  TEXT    NOT NULL DEFAULT '[]',   -- JSON array
    hobby_tag   TEXT    CHECK(hobby_tag IS NULL OR length(hobby_tag) <= 50),
    created_at  DATETIME DEFAULT (datetime('now')),
    updated_at  DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS project_images (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id    INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_path     TEXT    NOT NULL,
    file_size     INTEGER CHECK(file_size <= 5242880),
    mime_type     TEXT    CHECK(mime_type IN ('image/jpeg','image/png','image/webp')),
    display_order INTEGER DEFAULT 0,
    uploaded_at   DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS theme_settings (
    id             INTEGER PRIMARY KEY CHECK(id = 1),
    manga_panel_a  TEXT,
    manga_panel_b  TEXT,
    manga_panel_c  TEXT,
    manga_panel_d  TEXT,
    manga_panel_e  TEXT,
    manga_panel_f  TEXT,
    manga_panel_g  TEXT,
    updated_at     DATETIME DEFAULT (datetime('now'))
);

-- Seed an empty theme_settings row so GET always returns data
INSERT OR IGNORE INTO theme_settings (id) VALUES (1);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id
    ON project_images(project_id);
