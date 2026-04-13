# Backend API Reference

> Complete API documentation for Rust (Axum) backend.

---

## Base URL

```
Development: http://localhost:3000
Production:  https://your-backend.com
```

---

## Authentication

### Login
```http
POST /api/login
Content-Type: application/json

{
  "passphrase": "your_secure_passphrase"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Authentication successful"
}
```
Sets cookie: `auth_token={jwt}; HttpOnly; Secure; SameSite=Strict`

**Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSPHRASE",
    "message": "Invalid passphrase"
  }
}
```

### Logout
```http
POST /api/logout
Cookie: auth_token={jwt}
```

**Success (200):** Clears auth cookie

---

## Projects

### List All Projects
```http
GET /api/projects
```

**Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "My Project",
      "description": "Project description...",
      "repo_url": "https://github.com/user/repo",
      "ext_url": "https://demo.example.com",
      "tech_stack": ["Rust", "React", "TypeScript"],
      "hobby_tag": "Built while learning Rust",
      "images": [
        {
          "id": 1,
          "url": "/uploads/project-1-image-1.webp",
          "display_order": 0
        }
      ],
      "created_at": "2026-04-12T10:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "fetched_at": "2026-04-12T12:00:00Z"
  }
}
```

### Get Single Project
```http
GET /api/projects/:id
```

**Success (200):** Same as list item

**Error (404):**
```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project with id 999 not found"
  }
}
```

### Create Project (Auth Required)
```http
POST /api/projects
Content-Type: multipart/form-data
Cookie: auth_token={jwt}

------FormBoundary
Content-Disposition: form-data; name="title"

My Project
------FormBoundary
Content-Disposition: form-data; name="description"

Project description (10-5000 chars, Markdown supported)
------FormBoundary
Content-Disposition: form-data; name="repo_url"

https://github.com/user/repo
------FormBoundary
Content-Disposition: form-data; name="tech_stack"

["Rust", "React"]
------FormBoundary
Content-Disposition: form-data; name="images"; filename="screenshot.png"
Content-Type: image/png

<binary data>
------FormBoundary--
```

**Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-100 chars |
| description | string | Yes | 10-5000 chars |
| repo_url | string | No | Valid HTTPS URL |
| ext_url | string | No | Valid HTTPS URL |
| tech_stack | JSON array | Yes | Array of strings |
| hobby_tag | string | No | Max 50 chars |
| images | File[] | No | Max 5 files, 5MB each |

**Success (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My Project",
    ...
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

### Update Project (Auth Required)
```http
PUT /api/projects/:id
Content-Type: multipart/form-data
Cookie: auth_token={jwt}
```

Same fields as Create. Omit fields to keep existing values.

### Delete Project (Auth Required)
```http
DELETE /api/projects/:id
Cookie: auth_token={jwt}
```

**Success (204):** No content

**Error (404):** Project not found

---

## Status

### Get User Status (Footer)
```http
GET /api/status
```

**Success (200):**
```json
{
  "success": true,
  "data": {
    "current_activity": "Building cool things",
    "last_updated": "2026-04-12T10:00:00Z"
  }
}
```

### Update Status (Auth Required)
```http
PUT /api/status
Content-Type: application/json
Cookie: auth_token={jwt}

{
  "current_activity": "Learning Rust 🦀"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Error Codes
| Code | HTTP | Meaning |
|------|------|---------|
| INVALID_PASSPHRASE | 401 | Wrong login password |
| UNAUTHORIZED | 401 | Missing/invalid JWT |
| VALIDATION_ERROR | 400 | Input validation failed |
| PROJECT_NOT_FOUND | 404 | Project doesn't exist |
| PAYLOAD_TOO_LARGE | 413 | File > 5MB |
| INTERNAL_ERROR | 500 | Server error |

---

## Database Schema

```sql
-- Projects
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 100),
    description TEXT NOT NULL CHECK(length(description) BETWEEN 10 AND 5000),
    repo_url TEXT CHECK(repo_url IS NULL OR repo_url LIKE 'https://%'),
    ext_url TEXT CHECK(ext_url IS NULL OR ext_url LIKE 'https://%'),
    tech_stack TEXT NOT NULL,
    hobby_tag TEXT CHECK(hobby_tag IS NULL OR length(hobby_tag) <= 50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Images
CREATE TABLE project_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER CHECK(file_size <= 5242880),
    mime_type TEXT CHECK(mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    display_order INTEGER DEFAULT 0,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Status
CREATE TABLE user_status (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_activity TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## File Uploads

- **Location:** `/uploads/{uuid}.{ext}`
- **Max size:** 5MB per file
- **Max files:** 5 per project
- **Allowed types:** image/jpeg, image/png, image/webp
- **Public URL:** `/uploads/{filename}`

---

## Dependencies

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower-http = { version = "0.5", features = ["cors", "fs"] }
serde = { version = "1", features = ["derive"] }
sqlx = { version = "0.7", features = ["sqlite", "runtime-tokio"] }
jsonwebtoken = "9"
bcrypt = "0.15"
multer = "3"
```
