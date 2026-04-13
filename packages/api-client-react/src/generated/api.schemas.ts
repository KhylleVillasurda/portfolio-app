// ============================================================
// Generated types — matches openapi.yaml component schemas
// ============================================================

export interface HealthStatus {
  status: string;
}

export interface ProjectImage {
  id: number;
  url: string;
  displayOrder: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  repoUrl?: string | null;
  extUrl?: string | null;
  techStack: string[];
  hobbyTag?: string | null;
  images: ProjectImage[];
  createdAt: string;
}

export interface CreateProjectBody {
  title: string;
  description: string;
  repoUrl?: string | null;
  extUrl?: string | null;
  techStack: string[];
  hobbyTag?: string | null;
}

export interface LoginBody {
  passphrase: string;
}

export interface LoginResponse {
  success: boolean;
  isAuthenticated: boolean;
}

export interface AuthStatus {
  isAuthenticated: boolean;
}

export interface ThemeSettings {
  manga_panel_A?: string | null;
  manga_panel_B?: string | null;
  manga_panel_C?: string | null;
  manga_panel_D?: string | null;
  manga_panel_E?: string | null;
  manga_panel_F?: string | null;
  manga_panel_G?: string | null;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
}
