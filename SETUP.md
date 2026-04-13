# Setup Guide

This guide will help you get the Showcase Portfolio project up and running on your local machine.

## Prerequisites

Ensure you have the following installed:
- **Node.js**: version 20 or higher
- **pnpm**: version 9 or higher
- **Rust**: Latest stable version (via [rustup](https://rustup.rs/))
- **SQLite**: (Recommended) but the application will create a database file automatically.

---

## 1. Initial Installation

Clone the repository and install all frontend and shared package dependencies from the root:

```bash
pnpm install
```

---

## 2. Backend Configuration

Navigate to the `backend/` directory and create a `.env` file based on the following template:

```bash
# Server Port
PORT=3000

# SQLite Database Connection URL
DATABASE_URL=sqlite:./portfolio.db

# Security - Replace these with strong, unique values
JWT_SECRET=your_32_character_random_string_here
ADMIN_PASSPHRASE=your_secure_admin_login_passphrase

# Authentication Settings
JWT_EXPIRY_SECS=86400
COOKIE_SECURE=false # Set to 'true' in production with HTTPS

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 3. Frontend Configuration

Navigate to the `frontend/` directory and create a `.env` file:

```bash
# Base URL for the Backend API
VITE_API_URL=http://localhost:3000
```

---

## 4. Running the Application

You can run both the frontend and backend simultaneously from the root using the following commands (ideally in separate terminal windows):

### Backend

```bash
pnpm dev:backend
```
*Note: The backend will automatically handle database migrations on the first run.*

### Frontend

```bash
pnpm dev:frontend
```

The frontend should now be accessible at `http://localhost:5173`.

---

## Project Structure Overview

- `backend/`: Rust Axum server and SQLite database management.
- `frontend/`: React + Vite + TypeScript application.
- `packages/api-client-react/`: Shared API client for the frontend.
- `docs/`: Detailed project documentation.

For more technical details, refer to `PROJECT_GUIDE.md`.
