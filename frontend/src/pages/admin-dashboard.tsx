import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import {
  useListProjects,
  getListProjectsQueryKey,
  useCreateProject,
  useDeleteProject,
  useLogout,
  useGetThemeSettings,
  getGetThemeSettingsQueryKey,
  useUpdateThemeSettings,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TECH_OPTIONS } from "@/lib/tech-options";
import { Loader2, Plus, Trash2, LogOut, LayoutDashboard, Layers, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const PANEL_INFO: { id: string; label: string; description: string }[] = [
  { id: "A", label: "Panel A — Large Hero", description: "Top-left, largest panel. Speed lines." },
  { id: "B", label: "Panel B — Top Right", description: "Top-right strip. Halftone dots." },
  { id: "C", label: "Panel C — Mid Right", description: "Small mid panel. Shows kanji 力." },
  { id: "D", label: "Panel D — Accent", description: "Tiny corner. Neon glow." },
  { id: "E", label: "Panel E — Mid Left", description: "Medium left. Halftone dots." },
  { id: "F", label: "Panel F — Mid Right Wide", description: "Wide mid panel. Speed lines." },
  { id: "G", label: "Panel G — Bottom Strip", description: "Full-width bottom. Halftone + kanji row." },
];

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: projects, isLoading } = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });

  const { data: themeSettings, isLoading: isLoadingSettings } = useGetThemeSettings({
    query: { queryKey: getGetThemeSettingsQueryKey() },
  });

  const [panelUrls, setPanelUrls] = useState<Record<string, string>>({});
  const [panelsDirty, setPanelsDirty] = useState(false);

  // Sync server state into local inputs whenever themeSettings loads or refreshes
  useEffect(() => {
    if (!themeSettings) return;
    const incoming: Record<string, string> = {};
    for (const p of PANEL_INFO) {
      const key = `manga_panel_${p.id}` as keyof typeof themeSettings;
      incoming[p.id] = (themeSettings[key] as string | null | undefined) ?? "";
    }
    setPanelUrls(incoming);
    setPanelsDirty(false);
  }, [themeSettings]);

  const updateSettingsMutation = useUpdateThemeSettings({
    mutation: {
      onSuccess: () => {
        toast({ title: "Saved", description: "Manga panel images updated." });
        queryClient.invalidateQueries({ queryKey: getGetThemeSettingsQueryKey() });
        setPanelsDirty(false);
      },
      onError: () =>
        toast({ title: "Error", description: "Failed to save panel images.", variant: "destructive" }),
    },
  });

  const createMutation = useCreateProject({
    mutation: {
      onSuccess: () => {
        toast({ title: "Success", description: "Project created." });
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setFormData({
          title: "",
          description: "",
          repoUrl: "",
          extUrl: "",
          techStack: [],
          hobbyTag: "",
        });
      },
      onError: () =>
        toast({ title: "Error", description: "Failed to create project.", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteProject({
    mutation: {
      onSuccess: () => {
        toast({ title: "Success", description: "Project deleted." });
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      },
      onError: () =>
        toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" }),
    },
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/");
      },
    },
  });

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    repoUrl: string;
    extUrl: string;
    techStack: string[];
    hobbyTag: string;
  }>({
    title: "",
    description: "",
    repoUrl: "",
    extUrl: "",
    techStack: [],
    hobbyTag: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        title: formData.title,
        description: formData.description,
        repoUrl: formData.repoUrl || null,
        extUrl: formData.extUrl || null,
        techStack: formData.techStack,
        hobbyTag: formData.hobbyTag || null,
      },
    });
  };

  const handlePanelUrlChange = (panelId: string, value: string) => {
    setPanelUrls((prev) => ({ ...prev, [panelId]: value }));
    setPanelsDirty(true);
  };

  const handleSavePanels = () => {
    const payload: Record<string, string> = {};
    for (const p of PANEL_INFO) {
      payload[`manga_panel_${p.id}`] = panelUrls[p.id] ?? "";
    }
    updateSettingsMutation.mutate({ data: payload });
  };

  const handleClearPanel = (panelId: string) => {
    setPanelUrls((prev) => ({ ...prev, [panelId]: "" }));
    setPanelsDirty(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-[var(--accent-purple)]" />
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              className="bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-red)] hover:bg-[var(--bg-hover)]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Projects section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Form */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[var(--accent-green)]" />
                  New Project
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)]">Title</Label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[var(--bg-input)] border-[var(--border-color)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)]">Description</Label>
                    <Textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[var(--bg-input)] border-[var(--border-color)] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)]">Tech Stack</Label>
                    <div className="flex flex-col gap-2">
                      <Select
                        value=""
                        onValueChange={(val) => {
                          if (val && !formData.techStack.includes(val)) {
                            setFormData({ ...formData, techStack: [...formData.techStack, val] });
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[var(--bg-input)] border-[var(--border-color)]">
                          <SelectValue placeholder="Add technology..." />
                        </SelectTrigger>
                        <SelectContent>
                          {TECH_OPTIONS.filter((t) => !formData.techStack.includes(t.value)).map((tech) => (
                            <SelectItem key={tech.value} value={tech.value}>
                              <div className="flex items-center gap-2">
                                <img src={tech.iconUrl} alt={tech.label} className="w-4 h-4" />
                                {tech.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {formData.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.techStack.map((tech) => {
                            const icon = TECH_OPTIONS.find((t) => t.value === tech)?.iconUrl;
                            return (
                              <span key={tech} className="px-2 py-1 text-xs font-mono rounded bg-[var(--bg-hover)] border border-[var(--border-color)] flex items-center gap-1.5 text-[var(--text-primary)]">
                                {icon && <img src={icon} alt={tech} className="w-3.5 h-3.5" />}
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) })}
                                  className="text-[var(--text-muted)] hover:text-[var(--accent-red)] ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)]">Repo URL (optional)</Label>
                    <Input
                      type="url"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--accent-blue)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)]">External URL (optional)</Label>
                    <Input
                      type="url"
                      value={formData.extUrl}
                      onChange={(e) => setFormData({ ...formData, extUrl: e.target.value })}
                      className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--accent-green)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)]">Hobby Tag (optional)</Label>
                    <Input
                      placeholder="e.g. Game Dev, UI Design"
                      value={formData.hobbyTag}
                      onChange={(e) => setFormData({ ...formData, hobbyTag: e.target.value })}
                      className="bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--accent-yellow)]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="w-full bg-[var(--accent-green)] text-[var(--bg-main)] hover:bg-[var(--accent-green)]/90 font-bold mt-6"
                  >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Project
                  </Button>
                </form>
              </div>
            </div>

            {/* Project List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Manage Projects</h2>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-blue)]" />
                </div>
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group hover:border-[var(--accent-blue)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1 truncate">{project.title}</h3>
                      <p className="text-[var(--text-secondary)] text-sm line-clamp-1 mb-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                        <span>{project.techStack.length} tags</span>
                        <span>•</span>
                        <span>{project.images.length} images</span>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: project.id })}
                      disabled={deleteMutation.isPending}
                      className="bg-[var(--bg-hover)] text-[var(--accent-red)] border border-[var(--border-color)] hover:bg-[var(--accent-red)] hover:text-[var(--bg-main)] transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]">
                  <p className="text-[var(--text-muted)] font-mono">
                    No projects found. Create one to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Manga Panels section */}
          <div className="border-t border-[var(--border-color)] pt-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Layers className="w-6 h-6 text-[var(--accent-purple)]" />
                  <h2 className="text-2xl font-bold">Manga Panel Images</h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-[var(--accent-purple)]/40 text-[var(--accent-purple)]">
                    Otaku Theme
                  </span>
                </div>
                <p className="text-[var(--text-muted)] text-sm max-w-xl">
                  Paste an image URL into any panel slot. When the Otaku theme is active, that panel will
                  display your image with a manga halftone overlay instead of the generated effect. Leave
                  a field empty to keep the default animated effect.
                </p>
              </div>

              <Button
                onClick={handleSavePanels}
                disabled={updateSettingsMutation.isPending || !panelsDirty}
                className="bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple)]/90 font-bold shrink-0"
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Panels
              </Button>
            </div>

            {isLoadingSettings ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-purple)]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PANEL_INFO.map((panel) => {
                  const hasImage = !!panelUrls[panel.id];
                  return (
                    <div
                      key={panel.id}
                      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-purple)]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-[var(--accent-purple)] opacity-40 font-mono">
                              {panel.id}
                            </span>
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {panel.label}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{panel.description}</p>
                        </div>
                        {hasImage && (
                          <button
                            onClick={() => handleClearPanel(panel.id)}
                            className="text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors p-1"
                            aria-label="Clear image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {hasImage && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-[var(--border-color)] h-20 bg-[var(--bg-input)]">
                          <img
                            src={panelUrls[panel.id]}
                            alt={`Panel ${panel.id} preview`}
                            className="w-full h-full object-cover opacity-70"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      <Input
                        type="url"
                        placeholder="https://example.com/your-image.jpg"
                        value={panelUrls[panel.id] ?? ""}
                        onChange={(e) => handlePanelUrlChange(panel.id, e.target.value)}
                        className="bg-[var(--bg-input)] border-[var(--border-color)] font-mono text-xs text-[var(--accent-blue)] placeholder:text-[var(--text-muted)]"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {panelsDirty && (
              <p className="text-xs font-mono text-[var(--accent-yellow)] mt-4 text-center">
                You have unsaved changes — click Save Panels to apply them.
              </p>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
