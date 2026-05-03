export type NavItem = {
  label: string;
  href: string;
};

export type SocialPlatform = "linkedin" | "github" | "x" | "instagram" | "website" | "email";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
  iconKey: SocialPlatform;
};

export type HeroData = {
  name: string;
  highlight: string;
  roles: string[];
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export type AboutData = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  badges: string[];
};

export type SkillCategory = {
  id: string;
  title: string;
  iconKey: "code" | "database" | "globe" | "wrench";
  skills: {
    name: string;
    description: string;
    label?: string;
  }[];
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  markdownDescription?: string;
  techStack: string[];
  status: "Completed" | "In Progress" | "Planned";
  liveUrl: string;
  githubUrl: string;
  image?: string;
  featured?: boolean;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  description: string;
  highlights: string[];
};

export type EducationItem = {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  period?: string;
  grade?: string;
  current?: boolean;
  details?: {
    level: string;
    period: string;
    grade: string;
  }[];
};

export type CertificationItem = {
  id: string;
  title: string;
  date: string;
  organization?: string;
  description: string[];
};

export type ContactData = {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  location: string;
  formEnabled: boolean;
};

export type ResumeData = {
  title: string;
  subtitle: string;
  description: string;
  fileUrl: string;
  fileName: string;
};

export type PortfolioData = {
  siteName: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  navItems: NavItem[];
  hero: HeroData;
  about: AboutData;
  skills: {
    title: string;
    subtitle: string;
    categories: SkillCategory[];
  };
  projects: {
    title: string;
    subtitle: string;
    items: ProjectItem[];
  };
  experience: {
    title: string;
    subtitle: string;
    items: ExperienceItem[];
  };
  education: {
    title: string;
    subtitle: string;
    items: EducationItem[];
    certifications: CertificationItem[];
  };
  resume: ResumeData;
  contact: ContactData;
  socialLinks: SocialLink[];
};
