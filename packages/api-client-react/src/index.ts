// ============================================================
// @workspace/api-client-react
// Hand-crafted React Query hooks matching the OpenAPI contract.
// All requests use credentials: 'include' so the auth cookie is
// forwarded automatically.
// ============================================================

import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";

import type {
  Project,
  CreateProjectBody,
  LoginBody,
  LoginResponse,
  AuthStatus,
  ThemeSettings,
  HealthStatus,
} from "./generated/api.schemas";

// ── Base fetcher ──────────────────────────────────────────────

const BASE = "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}

// ── Query key factories ───────────────────────────────────────

export const getListProjectsQueryKey = () => ["projects"] as const;
export const getProjectQueryKey = (id: number) => ["projects", id] as const;
export const getGetMeQueryKey = () => ["auth", "me"] as const;
export const getGetThemeSettingsQueryKey = () => ["theme-settings"] as const;
export const getHealthCheckQueryKey = () => ["healthz"] as const;

// ── Health ────────────────────────────────────────────────────

export function useHealthCheck(options?: {
  query?: Partial<UseQueryOptions<HealthStatus>>;
}): UseQueryResult<HealthStatus> {
  return useQuery({
    queryKey: getHealthCheckQueryKey(),
    queryFn: () => apiFetch<HealthStatus>("/healthz"),
    ...options?.query,
  });
}

// ── Projects ──────────────────────────────────────────────────

export function useListProjects(options?: {
  query?: Partial<UseQueryOptions<Project[]>>;
}): UseQueryResult<Project[]> {
  return useQuery({
    queryKey: getListProjectsQueryKey(),
    queryFn: () => apiFetch<Project[]>("/projects"),
    ...options?.query,
  });
}

export function useGetProject(
  id: number,
  options?: { query?: Partial<UseQueryOptions<Project>> },
): UseQueryResult<Project> {
  return useQuery({
    queryKey: getProjectQueryKey(id),
    queryFn: () => apiFetch<Project>(`/projects/${id}`),
    enabled: !!id,
    ...options?.query,
  });
}

export function useCreateProject(options?: {
  mutation?: Partial<
    UseMutationOptions<Project, Error, { data: CreateProjectBody }>
  >;
}): UseMutationResult<Project, Error, { data: CreateProjectBody }> {
  return useMutation({
    mutationFn: ({ data }) =>
      apiFetch<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useUpdateProject(options?: {
  mutation?: Partial<
    UseMutationOptions<Project, Error, { id: number; data: CreateProjectBody }>
  >;
}): UseMutationResult<Project, Error, { id: number; data: CreateProjectBody }> {
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiFetch<Project>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useDeleteProject(options?: {
  mutation?: Partial<UseMutationOptions<void, Error, { id: number }>>;
}): UseMutationResult<void, Error, { id: number }> {
  return useMutation({
    mutationFn: ({ id }) =>
      apiFetch<void>(`/projects/${id}`, { method: "DELETE" }),
    ...options?.mutation,
  });
}

// ── Auth ──────────────────────────────────────────────────────

export function useGetMe(options?: {
  query?: Partial<UseQueryOptions<AuthStatus>>;
}): UseQueryResult<AuthStatus> {
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: () => apiFetch<AuthStatus>("/auth/me"),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min
    ...options?.query,
  });
}

export function useLogin(options?: {
  mutation?: Partial<
    UseMutationOptions<LoginResponse, Error, { data: LoginBody }>
  >;
}): UseMutationResult<LoginResponse, Error, { data: LoginBody }> {
  return useMutation({
    mutationFn: ({ data }) =>
      apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}

export function useLogout(options?: {
  mutation?: Partial<UseMutationOptions<{ success: boolean }, Error, void>>;
}): UseMutationResult<{ success: boolean }, Error, void> {
  return useMutation({
    mutationFn: () =>
      apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" }),
    ...options?.mutation,
  });
}

// ── Theme Settings ────────────────────────────────────────────

export function useGetThemeSettings(options?: {
  query?: Partial<UseQueryOptions<ThemeSettings>>;
}): UseQueryResult<ThemeSettings> {
  return useQuery({
    queryKey: getGetThemeSettingsQueryKey(),
    queryFn: () => apiFetch<ThemeSettings>("/theme-settings"),
    ...options?.query,
  });
}

export function useUpdateThemeSettings(options?: {
  mutation?: Partial<
    UseMutationOptions<ThemeSettings, Error, { data: ThemeSettings }>
  >;
}): UseMutationResult<ThemeSettings, Error, { data: ThemeSettings }> {
  return useMutation({
    mutationFn: ({ data }) =>
      apiFetch<ThemeSettings>("/theme-settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    ...options?.mutation,
  });
}
