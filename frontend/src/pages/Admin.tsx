import { useEffect, useMemo, useState } from "react";
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Code,
  Database,
  ExternalLink,
  Github,
  Globe,
  Link2,
  Plus,
  Save,
  SquarePen,
  Wrench,
  Trash2,
  LogOut,
  LockKeyhole,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePortfolio } from "@/context/portfolio-context";
import {
  getAdminSession,
  setAdminSession,
  setAdminToken,
} from "@/lib/portfolio-storage";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioData,
  ProjectItem,
  SocialLink,
  SkillCategory,
} from "@/types/portfolio";

type SkillModalState = {
  mode: "create" | "edit";
  draft: SkillCategory;
};

type ProjectModalState = {
  mode: "create" | "edit";
  draft: ProjectItem;
};

type ExperienceModalState = {
  mode: "create" | "edit";
  draft: ExperienceItem;
};

type SocialModalState = {
  mode: "create" | "edit";
  index: number | null;
  draft: SocialLink;
};

const blankProject = (): ProjectItem => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  markdownDescription: "",
  techStack: [],
  status: "Completed",
  liveUrl: "",
  githubUrl: "",
});

const blankExperience = (): ExperienceItem => ({
  id: crypto.randomUUID(),
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  current: false,
  location: "",
  description: "",
  highlights: [""],
});

const blankEducation = (): EducationItem => ({
  id: crypto.randomUUID(),
  degree: "",
  field: "",
  institution: "",
  period: "",
  grade: "",
  current: false,
  details: [],
});

const blankCertification = (): CertificationItem => ({
  id: crypto.randomUUID(),
  title: "",
  date: "",
  organization: "",
  description: [""],
});

const blankSocial = (): SocialLink => ({
  platform: "website",
  label: "",
  url: "",
  iconKey: "website",
});

const blankSkillCategory = (): SkillCategory => ({
  id: crypto.randomUUID(),
  title: "",
  iconKey: "code",
  skills: [{ name: "", description: "", label: "Skill" }],
});

const skillIconMap = {
  code: Code,
  database: Database,
  globe: Globe,
  wrench: Wrench,
} as const;

const Admin = () => {
  const navigate = useNavigate();
  const { portfolio, updatePortfolio, refreshPortfolio, isSaving } =
    usePortfolio();
  const [isAuthenticated, setIsAuthenticated] = useState(getAdminSession());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<PortfolioData>(portfolio);
  const [saving, setSaving] = useState(false);
  const [skillModal, setSkillModal] = useState<SkillModalState | null>(null);
  const [projectModal, setProjectModal] = useState<ProjectModalState | null>(
    null,
  );
  const [experienceModal, setExperienceModal] =
    useState<ExperienceModalState | null>(null);
  const [socialModal, setSocialModal] = useState<SocialModalState | null>(null);

  useEffect(() => {
    setDraft(portfolio);
  }, [portfolio]);

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(portfolio),
    [draft, portfolio],
  );

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    const apiBase = import.meta.env.VITE_PORTFOLIO_API_BASE_URL as
      | string
      | undefined;

    if (!apiBase) {
      toast.error("Backend URL is not configured");
      return;
    }

    fetch(`${apiBase.replace(/\/$/, "")}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json() as Promise<{ token: string }>;
      })
      .then((data) => {
        setAdminToken(data.token);
        setAdminSession(true);
        setIsAuthenticated(true);
        toast.success("Admin session unlocked");
      })
      .catch(() => {
        toast.error("Invalid admin credentials");
      });
  };

  const handleLogout = () => {
    setAdminSession(false);
    setAdminToken(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  const saveDraft = async () => {
    const errors = validateDraft(draft);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setSaving(true);
    try {
      await updatePortfolio(draft);
      toast.success("Portfolio saved");
    } finally {
      setSaving(false);
    }
  };

  const commitDraft = (updater: (next: PortfolioData) => void) => {
    setDraft((current) => {
      const next = structuredClone(current) as PortfolioData;
      updater(next);
      return next;
    });
  };

  const openSkillModal = (category?: SkillCategory) => {
    setSkillModal({
      mode: category ? "edit" : "create",
      draft: category
        ? structuredClone(category)
        : blankSkillCategory(),
    });
  };

  const openProjectModal = (project?: ProjectItem) => {
    setProjectModal({
      mode: project ? "edit" : "create",
      draft: project ? structuredClone(project) : blankProject(),
    });
  };

  const openExperienceModal = (item?: ExperienceItem) => {
    setExperienceModal({
      mode: item ? "edit" : "create",
      draft: item ? structuredClone(item) : blankExperience(),
    });
  };

  const openSocialModal = (link?: SocialLink, index: number | null = null) => {
    setSocialModal({
      mode: link ? "edit" : "create",
      index,
      draft: link ? structuredClone(link) : blankSocial(),
    });
  };

  const saveSkillModal = () => {
    if (!skillModal) return;

    if (!skillModal.draft.title.trim()) {
      toast.error("Skill category title is required");
      return;
    }

    if (skillModal.draft.skills.some((skill) => !skill.name.trim())) {
      toast.error("Each skill needs a name");
      return;
    }

    commitDraft((next) => {
      if (skillModal.mode === "edit") {
        next.skills.categories = next.skills.categories.map((category) =>
          category.id === skillModal.draft.id ? structuredClone(skillModal.draft) : category,
        );
      } else {
        next.skills.categories = [...next.skills.categories, structuredClone(skillModal.draft)];
      }
    });

    setSkillModal(null);
    toast.success(
      skillModal.mode === "edit" ? "Skill category updated" : "Skill category added",
    );
  };

  const saveProjectModal = () => {
    if (!projectModal) return;

    if (!projectModal.draft.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const invalidTech = projectModal.draft.techStack.find(
      (tech) => tech.trim() && tech.trim().split(/\s+/).length > 2,
    );
    if (invalidTech) {
      toast.error("Keep each tech stack item to 1-2 words max");
      return;
    }

    commitDraft((next) => {
      const normalizedProject = {
        ...structuredClone(projectModal.draft),
        techStack: projectModal.draft.techStack
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      if (projectModal.mode === "edit") {
        next.projects.items = next.projects.items.map((project) =>
          project.id === projectModal.draft.id
            ? normalizedProject
            : project,
        );
      } else {
        next.projects.items = [...next.projects.items, normalizedProject];
      }
    });

    setProjectModal(null);
    toast.success(projectModal.mode === "edit" ? "Project updated" : "Project added");
  };

  const saveExperienceModal = () => {
    if (!experienceModal) return;

    if (!experienceModal.draft.company.trim() || !experienceModal.draft.role.trim()) {
      toast.error("Company and role are required");
      return;
    }

    commitDraft((next) => {
      if (experienceModal.mode === "edit") {
        next.experience.items = next.experience.items.map((entry) =>
          entry.id === experienceModal.draft.id
            ? structuredClone(experienceModal.draft)
            : entry,
        );
      } else {
        next.experience.items = [
          ...next.experience.items,
          structuredClone(experienceModal.draft),
        ];
      }
    });

    setExperienceModal(null);
    toast.success(
      experienceModal.mode === "edit" ? "Experience updated" : "Experience added",
    );
  };

  const saveSocialModal = () => {
    if (!socialModal) return;

    if (!socialModal.draft.label.trim() || !socialModal.draft.url.trim()) {
      toast.error("Label and URL are required");
      return;
    }

    commitDraft((next) => {
      if (socialModal.mode === "edit" && socialModal.index !== null) {
        next.socialLinks = next.socialLinks.map((link, index) =>
          index === socialModal.index ? structuredClone(socialModal.draft) : link,
        );
      } else {
        next.socialLinks = [...next.socialLinks, structuredClone(socialModal.draft)];
      }
    });

    setSocialModal(null);
    toast.success(socialModal.mode === "edit" ? "Social link updated" : "Social link added");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-bg to-light-cream flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-warm-brown/10 text-warm-brown">
              <LockKeyhole className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-dark-text">Admin Login</h1>
            <p className="mt-2 text-sm text-dark-text/70">
              Enter your admin email and password to edit portfolio content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="admin-email"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Admin email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="admin-password"
                autoComplete="new-password"
                autoCapitalize="none"
                spellCheck={false}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin password"
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-warm-brown hover:bg-warm-brown/90 text-white"
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-bg via-light-cream to-white px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-warm-brown">
              Portfolio CMS
            </p>
            <h1 className="text-3xl font-bold text-dark-text">
              Admin Dashboard
            </h1>
            <p className="text-sm text-dark-text/70">
              Edit content once and the public site updates instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isDirty ? (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                Unsaved changes
              </span>
            ) : null}
            <Button
              variant="outline"
              onClick={() => refreshPortfolio()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={saveDraft}
              className="gap-2 bg-warm-brown text-white hover:bg-warm-brown/90"
            >
              <Save className="h-4 w-4" />
              {saving || isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 shadow-card">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-dark-text">
                  Hero profile
                </h2>
                <p className="text-sm text-dark-text/70">
                  Keep the main hero content short and structured.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Site name">
                  <Input
                    value={draft.siteName}
                    onChange={(event) =>
                      updateDraft(setDraft, "siteName", event.target.value)
                    }
                  />
                </Field>
                <Field label="Hero image URL">
                  <Input
                    value={draft.hero.image}
                    onChange={(event) =>
                      updateDraft(setDraft, "hero.image", event.target.value)
                    }
                  />
                </Field>
                <Field label="Hero name">
                  <Input
                    value={draft.hero.name}
                    onChange={(event) =>
                      updateDraft(setDraft, "hero.name", event.target.value)
                    }
                  />
                </Field>
                <Field label="Hero surname">
                  <Input
                    value={draft.hero.highlight}
                    onChange={(event) =>
                      updateDraft(
                        setDraft,
                        "hero.highlight",
                        event.target.value,
                      )
                    }
                  />
                </Field>
                <div className="md:col-span-2 rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark-text">
                        Hero roles
                      </p>
                      <p className="text-xs text-dark-text/60">
                        Add one role per row for cleaner editing and display.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          hero: {
                            ...current.hero,
                            roles: [...current.hero.roles, ""],
                          },
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add role
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {draft.hero.roles.map((role, index) => (
                      <div
                        key={`hero-role-${index}`}
                        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
                      >
                        <Input
                          placeholder={`Role ${index + 1}`}
                          value={role}
                          maxLength={42}
                          className="h-10 rounded-xl px-3 text-sm"
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              hero: {
                                ...current.hero,
                                roles: current.hero.roles.map((item, itemIndex) =>
                                  itemIndex === index ? event.target.value : item,
                                ),
                              },
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-red-600 hover:text-red-700"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              hero: {
                                ...current.hero,
                                roles: current.hero.roles.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              },
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Field label="CTA label">
                  <Input
                    value={draft.hero.ctaLabel}
                    onChange={(event) =>
                      updateDraft(setDraft, "hero.ctaLabel", event.target.value)
                    }
                  />
                </Field>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-dark-text">
                  About content
                </h2>
                <p className="text-sm text-dark-text/70">
                  Keep the profile bio and badges short, structured, and easy to edit.
                </p>
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="About subtitle">
                  <Input
                    value={draft.about.subtitle}
                    onChange={(event) =>
                      updateDraft(
                        setDraft,
                        "about.subtitle",
                        event.target.value,
                      )
                    }
                  />
                </Field>

                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark-text">
                        About paragraphs
                      </p>
                      <p className="text-xs text-dark-text/60">
                        Add one paragraph per row so the bio stays clean and manageable.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          about: {
                            ...current.about,
                            paragraphs: [...current.about.paragraphs, ""],
                          },
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add paragraph
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {draft.about.paragraphs.map((paragraph, index) => (
                      <div
                        key={`about-paragraph-${index}`}
                        className="rounded-2xl bg-white/80 p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dark-text/50">
                            Paragraph {index + 1}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-red-600 hover:text-red-700"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                about: {
                                  ...current.about,
                                  paragraphs: current.about.paragraphs.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                },
                              }))
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          rows={3}
                          placeholder="Write a short paragraph about your background or goals"
                          value={paragraph}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              about: {
                                ...current.about,
                                paragraphs: current.about.paragraphs.map(
                                  (item, itemIndex) =>
                                    itemIndex === index ? event.target.value : item,
                                ),
                              },
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark-text">
                        Profile badges
                      </p>
                      <p className="text-xs text-dark-text/60">
                        Add short badges like location, year, or specialization.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          about: {
                            ...current.about,
                            badges: [...current.about.badges, ""],
                          },
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add badge
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {draft.about.badges.map((badge, index) => (
                      <div
                        key={`about-badge-${index}`}
                        className="grid gap-3 md:grid-cols-[1fr_auto]"
                      >
                        <Input
                          placeholder="Badge text"
                          value={badge}
                          maxLength={32}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              about: {
                                ...current.about,
                                badges: current.about.badges.map((item, itemIndex) =>
                                  itemIndex === index ? event.target.value : item,
                                ),
                              },
                            }))
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-red-600 hover:text-red-700"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              about: {
                                ...current.about,
                                badges: current.about.badges.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              },
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <SectionHeader
              title="Skills"
              description="Manage skill categories as focused cards. Edit one category at a time."
              onAdd={() => openSkillModal()}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {draft.skills.categories.map((category) => {
                const CategoryIcon = skillIconMap[category.iconKey];
                return (
                  <Card key={category.id} className="flex h-full flex-col gap-4 p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dark-text">
                            {category.title || "Untitled category"}
                          </h3>
                          <p className="text-xs uppercase tracking-[0.2em] text-dark-text/50">
                            {category.iconKey}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-warm-brown/10 text-warm-brown">
                        {category.skills.length} skills
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.slice(0, 4).map((skill) => (
                        <Badge key={`${category.id}-${skill.name}`} variant="outline" className="rounded-full">
                          {skill.name || "Unnamed"}
                        </Badge>
                      ))}
                      {category.skills.length > 4 ? (
                        <Badge variant="outline" className="rounded-full">
                          +{category.skills.length - 4} more
                        </Badge>
                      ) : null}
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => openSkillModal(category)}
                      >
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-red-600 hover:text-red-700"
                        onClick={() => {
                          commitDraft((next) => {
                            next.skills.categories = next.skills.categories.filter(
                              (item) => item.id !== category.id,
                            );
                          });
                          toast.success("Skill category deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {draft.skills.categories.length === 0 ? (
              <Card className="border-dashed p-10 text-center shadow-card">
                <p className="text-lg font-semibold text-dark-text">No skill categories yet</p>
                <p className="mt-1 text-sm text-dark-text/70">
                  Add one category to start grouping the skills you want to showcase.
                </p>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <SectionHeader
              title="Projects"
              description="Project cards keep the list readable while the modal handles detailed edits."
              onAdd={() => openProjectModal()}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              {draft.projects.items.map((project) => (
                <Card key={project.id} className="flex h-full flex-col gap-4 p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-dark-text">
                          {project.title || "Untitled project"}
                        </h3>
                        {project.featured ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                            Featured
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-dark-text/60">
                        {project.status}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                      <Code className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-dark-text/70">
                    {project.description || "No description yet."}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <Badge key={`${project.id}-${tech}`} variant="secondary" className="rounded-full">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 5 ? (
                      <Badge variant="outline" className="rounded-full">
                        +{project.techStack.length - 5} more
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm text-dark-text/60">
                    {project.liveUrl ? (
                      <span className="inline-flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        Live
                      </span>
                    ) : null}
                    {project.githubUrl ? (
                      <span className="inline-flex items-center gap-1">
                        <Github className="h-4 w-4" />
                        GitHub
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => openProjectModal(project)}
                    >
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="gap-2 text-red-600 hover:text-red-700"
                      onClick={() => {
                        commitDraft((next) => {
                          next.projects.items = next.projects.items.filter(
                            (item) => item.id !== project.id,
                          );
                        });
                        toast.success("Project deleted");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {draft.projects.items.length === 0 ? (
              <Card className="border-dashed p-10 text-center shadow-card">
                <p className="text-lg font-semibold text-dark-text">No projects yet</p>
                <p className="mt-1 text-sm text-dark-text/70">
                  Add a project card to start building a visible portfolio list.
                </p>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <SectionHeader
              title="Experience"
              description="Timeline-style cards keep roles readable and editing focused."
              onAdd={() => openExperienceModal()}
            />

            <div className="space-y-4">
              {draft.experience.items.map((item) => (
                <Card key={item.id} className="p-5 shadow-card">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                        <BriefcaseBusiness className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text">
                          {item.role || "Untitled role"}
                        </h3>
                        <p className="text-sm font-medium text-warm-brown">
                          {item.company || "Company not set"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-dark-text/60">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {item.startDate || "Start date"}{" "}
                            {item.endDate ? `to ${item.endDate}` : "Present"}
                          </span>
                          {item.location ? (
                            <span className="inline-flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {item.location}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.current ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Current
                        </Badge>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => openExperienceModal(item)}
                      >
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-red-600 hover:text-red-700"
                        onClick={() => {
                          commitDraft((next) => {
                            next.experience.items = next.experience.items.filter(
                              (entry) => entry.id !== item.id,
                            );
                          });
                          toast.success("Experience entry deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-dark-text/70">
                    {item.description || "No description yet."}
                  </p>

                  {item.highlights.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-dark-text/70">
                      {item.highlights.slice(0, 4).map((highlight) => (
                        <li key={`${item.id}-${highlight}`}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                </Card>
              ))}
            </div>

            {draft.experience.items.length === 0 ? (
              <Card className="border-dashed p-10 text-center shadow-card">
                <p className="text-lg font-semibold text-dark-text">No experience entries yet</p>
                <p className="mt-1 text-sm text-dark-text/70">
                  Add a timeline card for an internship, freelance role, or job.
                </p>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <SectionHeader
              title="Education"
              description="Edit the education section and certification list shown on the public site."
              onAdd={() => {
                commitDraft((next) => {
                  next.education.items = [...next.education.items, blankEducation()];
                });
                toast.success("Education entry added");
              }}
            />

            <Card className="p-6 shadow-card">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Education title">
                  <Input
                    value={draft.education.title}
                    onChange={(event) =>
                      updateDraft(setDraft, "education.title", event.target.value)
                    }
                  />
                </Field>
                <Field label="Education subtitle">
                  <Input
                    value={draft.education.subtitle}
                    onChange={(event) =>
                      updateDraft(setDraft, "education.subtitle", event.target.value)
                    }
                  />
                </Field>
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              {draft.education.items.map((item) => (
                <Card key={item.id} className="flex h-full flex-col gap-4 p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text">
                          {item.degree || "Untitled education"}
                        </h3>
                        <p className="text-sm text-dark-text/60">
                          {item.institution || "Institution not set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.current ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Current
                        </Badge>
                      ) : null}
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-red-600 hover:text-red-700"
                        onClick={() => {
                          commitDraft((next) => {
                            next.education.items = next.education.items.filter(
                              (entry) => entry.id !== item.id,
                            );
                          });
                          toast.success("Education entry deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Degree">
                      <Input
                        value={item.degree}
                        onChange={(event) =>
                          updateEducationField(setDraft, item.id, "degree", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Field">
                      <Input
                        value={item.field ?? ""}
                        onChange={(event) =>
                          updateEducationField(setDraft, item.id, "field", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Institution">
                      <Input
                        value={item.institution}
                        onChange={(event) =>
                          updateEducationField(
                            setDraft,
                            item.id,
                            "institution",
                            event.target.value,
                          )
                        }
                      />
                    </Field>
                    <Field label="Period">
                      <Input
                        value={item.period ?? ""}
                        onChange={(event) =>
                          updateEducationField(setDraft, item.id, "period", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Grade">
                      <Input
                        value={item.grade ?? ""}
                        onChange={(event) =>
                          updateEducationField(setDraft, item.id, "grade", event.target.value)
                        }
                      />
                    </Field>
                    <Field label="Current">
                      <div className="flex h-10 items-center rounded-md border border-input bg-background px-3">
                        <label className="flex items-center gap-2 text-sm text-dark-text">
                          <input
                            type="checkbox"
                            checked={Boolean(item.current)}
                            onChange={(event) =>
                              updateEducationField(
                                setDraft,
                                item.id,
                                "current",
                                event.target.checked,
                              )
                            }
                          />
                          Mark as current
                        </label>
                      </div>
                    </Field>
                  </div>

                  <Field
                    label="Details"
                    className="md:col-span-2"
                  >
                    <Textarea
                      rows={4}
                      value={serializeEducationDetails(item.details)}
                      onChange={(event) =>
                        updateEducationField(
                          setDraft,
                          item.id,
                          "details",
                          parseEducationDetails(event.target.value),
                        )
                      }
                      placeholder="One row per detail: level | period | grade"
                    />
                  </Field>
                </Card>
              ))}
            </div>

            {draft.education.items.length === 0 ? (
              <Card className="border-dashed p-10 text-center shadow-card">
                <p className="text-lg font-semibold text-dark-text">No education entries yet</p>
                <p className="mt-1 text-sm text-dark-text/70">
                  Add your degree or school records so the public page can show them.
                </p>
              </Card>
            ) : null}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-dark-text">Certifications</h2>
                  <p className="text-sm text-dark-text/70">
                    Keep certification titles, dates, and bullet points in sync with the public site.
                  </p>
                </div>
                <Button
                  type="button"
                  className="gap-2 bg-warm-brown text-white hover:bg-warm-brown/90"
                  onClick={() => {
                    commitDraft((next) => {
                      next.education.certifications = [
                        ...next.education.certifications,
                        blankCertification(),
                      ];
                    });
                    toast.success("Certification added");
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add certification
                </Button>
              </div>

              <div className="space-y-4">
                {draft.education.certifications.map((cert) => (
                  <Card key={cert.id} className="p-5 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-dark-text">
                            {cert.title || "Untitled certification"}
                          </h3>
                          <p className="text-sm text-dark-text/60">
                            {cert.organization || "Organization not set"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 text-red-600 hover:text-red-700"
                        onClick={() => {
                          commitDraft((next) => {
                            next.education.certifications =
                              next.education.certifications.filter((entry) => entry.id !== cert.id);
                          });
                          toast.success("Certification deleted");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <Input
                          value={cert.title}
                          onChange={(event) =>
                            updateCertificationField(
                              setDraft,
                              cert.id,
                              "title",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Date">
                        <Input
                          value={cert.date}
                          onChange={(event) =>
                            updateCertificationField(
                              setDraft,
                              cert.id,
                              "date",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Organization">
                        <Input
                          value={cert.organization ?? ""}
                          onChange={(event) =>
                            updateCertificationField(
                              setDraft,
                              cert.id,
                              "organization",
                              event.target.value,
                            )
                          }
                        />
                      </Field>
                      <Field label="Description">
                        <Textarea
                          rows={4}
                          value={cert.description.join("\n")}
                          onChange={(event) =>
                            updateCertificationField(
                              setDraft,
                              cert.id,
                              "description",
                              splitLines(event.target.value),
                            )
                          }
                          placeholder="One bullet point per line"
                        />
                      </Field>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resume" className="space-y-4">
            <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark-text">Resume</h2>
                <p className="text-sm text-dark-text/70">
                  Set the PDF path and the labels used for preview and download.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="gap-2 border-warm-brown text-warm-brown hover:bg-warm-brown/5"
                onClick={() => {
                  updateDraft(setDraft, "resume.fileUrl", "/resume.pdf");
                  toast.success("Resume path reset");
                }}
              >
                <RefreshCw className="h-4 w-4" />
                Reset path
              </Button>
            </div>

            <Card className="p-6 shadow-card">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Section title">
                  <Input
                    value={draft.resume.title}
                    onChange={(event) =>
                      updateDraft(setDraft, "resume.title", event.target.value)
                    }
                  />
                </Field>
                <Field label="Section subtitle">
                  <Input
                    value={draft.resume.subtitle}
                    onChange={(event) =>
                      updateDraft(setDraft, "resume.subtitle", event.target.value)
                    }
                  />
                </Field>
                <Field label="Resume file path">
                  <Input
                    value={draft.resume.fileUrl}
                    onChange={(event) =>
                      updateDraft(setDraft, "resume.fileUrl", event.target.value)
                    }
                    placeholder="/resume.pdf"
                  />
                </Field>
                <Field label="File name">
                  <Input
                    value={draft.resume.fileName}
                    onChange={(event) =>
                      updateDraft(setDraft, "resume.fileName", event.target.value)
                    }
                    placeholder="Sachin_Patware_Resume.pdf"
                  />
                </Field>
                <Field label="Description" className="md:col-span-2">
                  <Textarea
                    rows={4}
                    value={draft.resume.description}
                    onChange={(event) =>
                      updateDraft(setDraft, "resume.description", event.target.value)
                    }
                  />
                </Field>
              </div>

              <div className="mt-4 rounded-2xl bg-muted/30 p-4 text-sm text-dark-text/70">
                Tip: put your PDF in <span className="font-semibold">frontend/public/resume.pdf</span> and
                use <span className="font-semibold">/resume.pdf</span> as the path.
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <SectionHeader
              title="Social links"
              description="Keep public links in compact cards and edit one link at a time."
              onAdd={() => openSocialModal()}
            />

            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-dark-text">Contact details</h2>
                  <p className="text-sm text-dark-text/70">
                    Keep your contact information alongside the social links.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Email">
                  <Input
                    value={draft.contact.email}
                    onChange={(event) =>
                      updateDraft(setDraft, "contact.email", event.target.value)
                    }
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={draft.contact.phone}
                    onChange={(event) =>
                      updateDraft(setDraft, "contact.phone", event.target.value)
                    }
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={draft.contact.location}
                    onChange={(event) =>
                      updateDraft(
                        setDraft,
                        "contact.location",
                        event.target.value,
                      )
                    }
                  />
                </Field>
                <Field label="Contact subtitle">
                  <Input
                    value={draft.contact.subtitle}
                    onChange={(event) =>
                      updateDraft(
                        setDraft,
                        "contact.subtitle",
                        event.target.value,
                      )
                    }
                  />
                </Field>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {draft.socialLinks.map((link, index) => (
                <Card key={`${link.platform}-${index}`} className="flex h-full flex-col gap-4 p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                        <Link2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text">
                          {link.label || "Untitled link"}
                        </h3>
                        <p className="text-sm text-dark-text/60">{link.platform}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {link.iconKey}
                    </Badge>
                  </div>

                  <p className="break-all text-sm text-dark-text/70">
                    {link.url || "No URL yet"}
                  </p>

                  <div className="mt-auto flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => openSocialModal(link, index)}
                    >
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="gap-2 text-red-600 hover:text-red-700"
                      onClick={() => {
                        commitDraft((next) => {
                          next.socialLinks = next.socialLinks.filter(
                            (_, itemIndex) => itemIndex !== index,
                          );
                        });
                        toast.success("Social link deleted");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={Boolean(skillModal)}
          onOpenChange={(open) => {
            if (!open) setSkillModal(null);
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {skillModal?.mode === "edit"
                  ? "Edit skill category"
                  : "Add skill category"}
              </DialogTitle>
              <DialogDescription>
                Manage a single category and its nested skills in one focused view.
              </DialogDescription>
            </DialogHeader>

            {skillModal ? (
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      value={skillModal.draft.title}
                      onChange={(event) =>
                        setSkillModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: { ...current.draft, title: event.target.value },
                              }
                            : current,
                        )
                      }
                    />
                    {!skillModal.draft.title.trim() ? (
                      <p className="mt-1 text-xs text-red-600">Title is required.</p>
                    ) : null}
                  </Field>
                  <Field label="Icon key">
                    <Input
                      value={skillModal.draft.iconKey}
                      onChange={(event) =>
                        setSkillModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: {
                                  ...current.draft,
                                  iconKey: event.target.value as SkillCategory["iconKey"],
                                },
                              }
                            : current,
                        )
                      }
                    />
                  </Field>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-dark-text">Skills</p>
                    <p className="text-xs text-dark-text/60">
                      Give each skill a short name, quick note, and label.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() =>
                      setSkillModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: {
                                ...current.draft,
                                skills: [
                                  ...current.draft.skills,
                                  { name: "", description: "", label: "Skill" },
                                ],
                              },
                            }
                          : current,
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add skill
                  </Button>
                </div>

                <div className="space-y-3">
                  {skillModal.draft.skills.map((skill, skillIndex) => (
                    <div
                      key={`${skillModal.draft.id}-${skillIndex}`}
                      className="rounded-2xl border border-dashed border-warm-brown/20 bg-white/80 p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dark-text/50">
                          Skill {skillIndex + 1}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setSkillModal((current) =>
                              current
                                ? {
                                    ...current,
                                    draft: {
                                      ...current.draft,
                                      skills: current.draft.skills.filter(
                                        (_, index) => index !== skillIndex,
                                      ),
                                    },
                                  }
                                : current,
                            )
                          }
                          className="shrink-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-dark-text/70">
                            Skill name
                          </span>
                          <Input
                            placeholder="Python"
                            value={skill.name}
                            maxLength={32}
                            onChange={(event) =>
                              setSkillModal((current) =>
                                current
                                  ? {
                                      ...current,
                                      draft: {
                                        ...current.draft,
                                        skills: current.draft.skills.map((entry, index) =>
                                          index === skillIndex
                                            ? { ...entry, name: event.target.value }
                                            : entry,
                                        ),
                                      },
                                    }
                                  : current,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-dark-text/70">
                            Short note
                          </span>
                          <Input
                            placeholder="Quick summary"
                            value={skill.description}
                            maxLength={60}
                            onChange={(event) =>
                              setSkillModal((current) =>
                                current
                                  ? {
                                      ...current,
                                      draft: {
                                        ...current.draft,
                                        skills: current.draft.skills.map((entry, index) =>
                                          index === skillIndex
                                            ? { ...entry, description: event.target.value }
                                            : entry,
                                        ),
                                      },
                                    }
                                  : current,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-dark-text/70">
                            Badge label
                          </span>
                          <Input
                            placeholder="Language"
                            value={skill.label ?? ""}
                            maxLength={18}
                            onChange={(event) =>
                              setSkillModal((current) =>
                                current
                                  ? {
                                      ...current,
                                      draft: {
                                        ...current.draft,
                                        skills: current.draft.skills.map((entry, index) =>
                                          index === skillIndex
                                            ? { ...entry, label: event.target.value }
                                            : entry,
                                        ),
                                      },
                                    }
                                  : current,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSkillModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-warm-brown text-white hover:bg-warm-brown/90"
                onClick={saveSkillModal}
              >
                Save category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(projectModal)}
          onOpenChange={(open) => {
            if (!open) setProjectModal(null);
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {projectModal?.mode === "edit" ? "Edit project" : "Add project"}
              </DialogTitle>
              <DialogDescription>
                Keep the card list compact and edit the detailed content here.
              </DialogDescription>
            </DialogHeader>

            {projectModal ? (
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      value={projectModal.draft.title}
                      onChange={(event) =>
                        setProjectModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: { ...current.draft, title: event.target.value },
                              }
                            : current,
                        )
                      }
                    />
                    {!projectModal.draft.title.trim() ? (
                      <p className="mt-1 text-xs text-red-600">Title is required.</p>
                    ) : null}
                  </Field>
                  <Field label="Status">
                    <Input
                      value={projectModal.draft.status}
                      onChange={(event) =>
                        setProjectModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: {
                                  ...current.draft,
                                  status: event.target.value as ProjectItem["status"],
                                },
                              }
                            : current,
                        )
                      }
                    />
                  </Field>
                  <Field label="Live URL">
                    <Input
                      value={projectModal.draft.liveUrl}
                      onChange={(event) =>
                        setProjectModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: { ...current.draft, liveUrl: event.target.value },
                              }
                            : current,
                        )
                      }
                    />
                  </Field>
                  <Field label="GitHub URL">
                    <Input
                      value={projectModal.draft.githubUrl}
                      onChange={(event) =>
                        setProjectModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: { ...current.draft, githubUrl: event.target.value },
                              }
                            : current,
                        )
                      }
                    />
                  </Field>
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 p-4 md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark-text">
                        Tech stack
                      </p>
                      <p className="text-xs text-dark-text/60">
                        Add each technology as a separate chip-style row.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setProjectModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: {
                                  ...current.draft,
                                  techStack: [...current.draft.techStack, ""],
                                },
                              }
                            : current,
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add tech
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {projectModal.draft.techStack.map((tech, index) => (
                      <div
                        key={`${projectModal.draft.id}-tech-${index}`}
                        className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]"
                      >
                        <Input
                          placeholder={`Tech ${index + 1}`}
                          value={tech}
                          maxLength={28}
                          className="h-10 rounded-xl px-3 text-sm"
                          onChange={(event) =>
                            setProjectModal((current) =>
                              current
                                ? {
                                    ...current,
                                    draft: {
                                      ...current.draft,
                                      techStack: current.draft.techStack.map(
                                        (item, itemIndex) =>
                                          itemIndex === index
                                            ? event.target.value
                                            : item,
                                      ),
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-red-600 hover:text-red-700"
                          onClick={() =>
                            setProjectModal((current) =>
                              current
                                ? {
                                    ...current,
                                    draft: {
                                      ...current.draft,
                                      techStack: current.draft.techStack.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                      ),
                                    },
                                  }
                                : current,
                            )
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Field label="Description">
                  <Textarea
                    rows={4}
                    value={projectModal.draft.description}
                    onChange={(event) =>
                      setProjectModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, description: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>

                <Field label="Markdown description">
                  <Textarea
                    rows={4}
                    value={projectModal.draft.markdownDescription ?? ""}
                    onChange={(event) =>
                      setProjectModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: {
                                ...current.draft,
                                markdownDescription: event.target.value,
                              },
                            }
                          : current,
                      )
                    }
                  />
                </Field>

              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-warm-brown text-white hover:bg-warm-brown/90"
                onClick={saveProjectModal}
              >
                Save project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(experienceModal)}
          onOpenChange={(open) => {
            if (!open) setExperienceModal(null);
          }}
        >
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {experienceModal?.mode === "edit"
                  ? "Edit experience"
                  : "Add experience"}
              </DialogTitle>
              <DialogDescription>
                Build a timeline item with a concise summary and supporting highlights.
              </DialogDescription>
            </DialogHeader>

            {experienceModal ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Company">
                  <Input
                    value={experienceModal.draft.company}
                    onChange={(event) =>
                      setExperienceModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, company: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                  {!experienceModal.draft.company.trim() ? (
                    <p className="mt-1 text-xs text-red-600">Company is required.</p>
                  ) : null}
                </Field>
                <Field label="Role">
                  <Input
                    value={experienceModal.draft.role}
                    onChange={(event) =>
                      setExperienceModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, role: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                  {!experienceModal.draft.role.trim() ? (
                    <p className="mt-1 text-xs text-red-600">Role is required.</p>
                  ) : null}
                </Field>
                <Field label="Start date">
                  <Input
                    value={experienceModal.draft.startDate}
                    onChange={(event) =>
                      setExperienceModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, startDate: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <Field label="End date">
                  <Input
                    value={experienceModal.draft.endDate ?? ""}
                    onChange={(event) =>
                      setExperienceModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, endDate: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={experienceModal.draft.location ?? ""}
                    onChange={(event) =>
                      setExperienceModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, location: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <Field label="Current role">
                  <label className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-dark-text">
                    <input
                      type="checkbox"
                      checked={Boolean(experienceModal.draft.current)}
                      onChange={(event) =>
                        setExperienceModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: { ...current.draft, current: event.target.checked },
                              }
                            : current,
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-warm-brown focus:ring-warm-brown"
                    />
                    <span>Currently working here</span>
                  </label>
                </Field>
                <Field label="Description" className="md:col-span-2">
                  <Textarea
                    rows={4}
                    value={experienceModal.draft.description}
                    onChange={(event) =>
                      setExperienceModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, description: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <div className="md:col-span-2 rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-dark-text">
                        Highlights
                      </p>
                      <p className="text-xs text-dark-text/60">
                        Add each highlight as its own row for cleaner editing.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setExperienceModal((current) =>
                          current
                            ? {
                                ...current,
                                draft: {
                                  ...current.draft,
                                  highlights: [...current.draft.highlights, ""],
                                },
                              }
                            : current,
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add highlight
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {experienceModal.draft.highlights.map((highlight, index) => (
                      <div
                        key={`${experienceModal.draft.id}-highlight-${index}`}
                        className="grid gap-3 md:grid-cols-[1fr_auto]"
                      >
                        <Input
                          placeholder={`Highlight ${index + 1}`}
                          value={highlight}
                          onChange={(event) =>
                            setExperienceModal((current) =>
                              current
                                ? {
                                    ...current,
                                    draft: {
                                      ...current.draft,
                                      highlights: current.draft.highlights.map(
                                        (item, itemIndex) =>
                                          itemIndex === index
                                            ? event.target.value
                                            : item,
                                      ),
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-red-600 hover:text-red-700"
                          onClick={() =>
                            setExperienceModal((current) =>
                              current
                                ? {
                                    ...current,
                                    draft: {
                                      ...current.draft,
                                      highlights: current.draft.highlights.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                      ),
                                    },
                                  }
                                : current,
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setExperienceModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-warm-brown text-white hover:bg-warm-brown/90"
                onClick={saveExperienceModal}
              >
                Save experience
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(socialModal)}
          onOpenChange={(open) => {
            if (!open) setSocialModal(null);
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {socialModal?.mode === "edit" ? "Edit social link" : "Add social link"}
              </DialogTitle>
              <DialogDescription>
                Keep the public link list clean and easy to scan.
              </DialogDescription>
            </DialogHeader>

            {socialModal ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Platform">
                  <Input
                    value={socialModal.draft.platform}
                    onChange={(event) =>
                      setSocialModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: {
                                ...current.draft,
                                platform: event.target.value as SocialLink["platform"],
                                iconKey: event.target.value as SocialLink["iconKey"],
                              },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <Field label="Icon key">
                  <Input
                    value={socialModal.draft.iconKey}
                    onChange={(event) =>
                      setSocialModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: {
                                ...current.draft,
                                iconKey: event.target.value as SocialLink["iconKey"],
                              },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <Field label="Label">
                  <Input
                    value={socialModal.draft.label}
                    onChange={(event) =>
                      setSocialModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, label: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
                <Field label="URL" className="md:col-span-2">
                  <Input
                    value={socialModal.draft.url}
                    onChange={(event) =>
                      setSocialModal((current) =>
                        current
                          ? {
                              ...current,
                              draft: { ...current.draft, url: event.target.value },
                            }
                          : current,
                      )
                    }
                  />
                </Field>
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSocialModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-warm-brown text-white hover:bg-warm-brown/90"
                onClick={saveSocialModal}
              >
                Save link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1 block text-sm font-medium text-dark-text">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  onAdd,
}: {
  title: string;
  description: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-dark-text">{title}</h2>
        <p className="text-sm text-dark-text/70">{description}</p>
      </div>
      <Button
        onClick={onAdd}
        className="gap-2 bg-warm-brown text-white hover:bg-warm-brown/90"
      >
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </div>
  );
}

function updateDraft(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  path: string,
  value: unknown,
) {
  setDraft((current) => {
    const next = structuredClone(current) as PortfolioData;
    const keys = path.split(".");
    let target: Record<string, unknown> = next as Record<string, unknown>;
    for (let index = 0; index < keys.length - 1; index += 1) {
      target = target[keys[index]] as Record<string, unknown>;
    }
    target[keys[keys.length - 1]] = value;
    return next;
  });
}

function updateArrayItem(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  id: string,
  field: keyof SkillCategory,
  value: unknown,
) {
  setDraft((current) => ({
    ...current,
    skills: {
      ...current.skills,
      categories: current.skills.categories.map((category) =>
        category.id === id ? { ...category, [field]: value } : category,
      ),
    },
  }));
}

function updateNestedList(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  id: string,
  field: "skills",
  value: SkillCategory["skills"],
) {
  setDraft((current) => ({
    ...current,
    skills: {
      ...current.skills,
      categories: current.skills.categories.map((category) =>
        category.id === id ? { ...category, [field]: value } : category,
      ),
    },
  }));
}

function updateSkillField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  categoryId: string,
  skillIndex: number,
  field: "name" | "description" | "label",
  value: string,
) {
  setDraft((current) => ({
    ...current,
    skills: {
      ...current.skills,
      categories: current.skills.categories.map((category) => {
        if (category.id !== categoryId) {
          return category;
        }
        const skills = [...category.skills];
        skills[skillIndex] = { ...skills[skillIndex], [field]: value };
        return { ...category, skills };
      }),
    },
  }));
}

function removeSkill(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  categoryId: string,
  skillIndex: number,
) {
  setDraft((current) => ({
    ...current,
    skills: {
      ...current.skills,
      categories: current.skills.categories.map((category) => {
        if (category.id !== categoryId) {
          return category;
        }
        return {
          ...category,
          skills: category.skills.filter((_, index) => index !== skillIndex),
        };
      }),
    },
  }));
}

function updateProjectField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  id: string,
  field: keyof ProjectItem,
  value: unknown,
) {
  setDraft((current) => ({
    ...current,
    projects: {
      ...current.projects,
      items: current.projects.items.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    },
  }));
}

function updateExperienceField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  id: string,
  field: keyof ExperienceItem,
  value: unknown,
) {
  setDraft((current) => ({
    ...current,
    experience: {
      ...current.experience,
      items: current.experience.items.map((experience) =>
        experience.id === id ? { ...experience, [field]: value } : experience,
      ),
    },
  }));
}

function updateEducationField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  id: string,
  field: keyof EducationItem,
  value: unknown,
) {
  setDraft((current) => ({
    ...current,
    education: {
      ...current.education,
      items: current.education.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    },
  }));
}

function updateCertificationField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  id: string,
  field: keyof CertificationItem,
  value: unknown,
) {
  setDraft((current) => ({
    ...current,
    education: {
      ...current.education,
      certifications: current.education.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert,
      ),
    },
  }));
}

function updateSocialField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  index: number,
  field: keyof SocialLink,
  value: unknown,
) {
  setDraft((current) => {
    const socialLinks = [...current.socialLinks];
    socialLinks[index] = {
      ...socialLinks[index],
      [field]: value,
    } as SocialLink;
    return { ...current, socialLinks };
  });
}

function removeSocialField(
  setDraft: Dispatch<SetStateAction<PortfolioData>>,
  index: number,
) {
  setDraft((current) => ({
    ...current,
    socialLinks: current.socialLinks.filter(
      (_, itemIndex) => itemIndex !== index,
    ),
  }));
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeEducationDetails(
  details: EducationItem["details"],
) {
  return (details ?? [])
    .map((detail) => `${detail.level} | ${detail.period} | ${detail.grade}`)
    .join("\n");
}

function parseEducationDetails(value: string): EducationItem["details"] {
  return splitLines(value).map((line) => {
    const [level = "", period = "", grade = ""] = line.split("|").map((item) => item.trim());
    return { level, period, grade };
  });
}

function validateDraft(portfolio: PortfolioData) {
  const errors: string[] = [];
  if (!portfolio.siteName.trim()) errors.push("Site name is required");
  if (!portfolio.hero.name.trim()) errors.push("Hero name is required");
  if (!portfolio.contact.email.trim()) errors.push("Contact email is required");
  if (portfolio.projects.items.length === 0)
    errors.push("At least one project is required");
  return errors;
}

export default Admin;
