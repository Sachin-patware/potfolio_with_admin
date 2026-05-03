import type { PortfolioData } from "@/types/portfolio";

export const defaultPortfolio: PortfolioData = {
  siteName: "Sachin Patware",
  seo: {
    title: "Sachin Patware | Software Developer",
    description:
      "Personal portfolio of Sachin Patware featuring projects, skills, education, and contact details.",
    keywords: ["Sachin Patware", "portfolio", "software developer", "full stack", "React"],
    ogImage: "/og-image.jpg",
  },
  navItems: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Education", href: "#education" },
    { label: "Resume", href: "#resume" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    name: "Sachin",
    highlight: "Patware",
    roles: ["Software Developer", "Problem Solver", "Full Stack Builder"],
    image: "/profile-photo.jpg",
    ctaLabel: "Reach Out",
    ctaHref: "#contact",
  },
  about: {
    title: "About Me",
    subtitle: "Software developer passionate about building impactful solutions.",
    paragraphs: [
      "Hi! I'm Sachin Patware, a B.Tech student specializing in Computer Science and Data Science at Acropolis Institute of Technology and Research, Indore.",
      "I enjoy building practical products with a strong focus on clean architecture, user experience, and performance.",
      "I’m currently seeking internship opportunities to apply my skills, learn from experienced professionals, and contribute to innovative tech projects that create real impact.",
    ],
    badges: ["3rd Year Student", "Indore, M.P.", "CSE - Data Science"],
  },
  skills: {
    title: "My Skills",
    subtitle:
      "A comprehensive overview of my technical skills and expertise across web development, backend systems, and data-focused work.",
    categories: [
      {
        id: "programming",
        title: "Programming Languages",
        iconKey: "code",
        skills: [
          {
            name: "Python",
            description: "Object-oriented programming, Flask, Django, and data science workflows.",
            label: "Language",
          },
          {
            name: "C & C++",
            description: "Strong grasp of syntax, data structures, OOP, and algorithms.",
            label: "Language",
          },
          {
            name: "JavaScript",
            description: "Modern JavaScript, ES6+, and frontend application development.",
            label: "Language",
          },
        ],
      },
      {
        id: "database",
        title: "Database & Analytics",
        iconKey: "database",
        skills: [
          {
            name: "SQL",
            description: "Database queries, schema design, and solving real-world data problems.",
            label: "Database",
          },
          {
            name: "MongoDB",
            description: "NoSQL data modeling and CRUD operations.",
            label: "Database",
          },
          {
            name: "SQLite",
            description: "Lightweight relational database used in small-scale apps.",
            label: "Database",
          },
        ],
      },
      {
        id: "stack",
        title: "Full-Stack Development",
        iconKey: "globe",
        skills: [
          {
            name: "MERN Stack",
            description:
              "MongoDB, Express, React, and Node.js for modern full-stack applications.",
            label: "Framework",
          },
          {
            name: "React",
            description: "Responsive UIs, component-driven design, and reusable interfaces.",
            label: "Framework",
          },
          {
            name: "Node.js",
            description: "Backend services, async programming, and event-driven systems.",
            label: "Framework",
          },
          {
            name: "Express.js",
            description: "RESTful APIs and middleware pipelines for server-side logic.",
            label: "Framework",
          },
        ],
      },
      {
        id: "tools",
        title: "Development Tools & AI Skills",
        iconKey: "wrench",
        skills: [
          {
            name: "GitHub",
            description: "Version control, collaboration, branching, and pull requests.",
            label: "Tool",
          },
          {
            name: "Postman",
            description: "API development, testing, and documentation.",
            label: "Tool",
          },
          {
            name: "Basic Web Deployment",
            description: "Deployment experience with Netlify, Vercel, and GitHub Pages.",
            label: "Tool",
          },
          {
            name: "Data Science (Python)",
            description: "Fundamental knowledge of data analysis, ML concepts, and AI workflows.",
            label: "Tool",
          },
        ],
      },
    ],
  },
  projects: {
    title: "My Projects",
    subtitle:
      "A selection of work highlighting full-stack architecture, product thinking, and user-focused design.",
    items: [
      {
        id: "ayurwell",
        title: "AyurWell - Cloud based Ayurvedic Diet Management Software",
        description:
          "A full-stack SaaS platform with ML-based Ayurvedic diet recommendations, patient assessment, diet planning, and appointment management for practitioners.",
        markdownDescription:
          "A full-stack SaaS platform with **ML-based Ayurvedic diet recommendations**, patient assessment, diet planning, and appointment management for practitioners.",
        techStack: ["Flask", "Next.js", "TypeScript", "JWT Auth", "Machine Learning"],
        status: "Completed",
        liveUrl: "https://ayurwell2-o.vercel.app/",
        githubUrl: "https://github.com/Sachin-patware/ayurwell2.o",
        featured: true,
      },
      {
        id: "triphaven",
        title: "TripHaven Renting App",
        description:
          "A full-stack MERN application for vacation rentals with interactive maps, secure authentication, and a modern responsive UI.",
        markdownDescription:
          "A full-stack MERN application for vacation rentals with interactive maps, secure authentication, and a modern responsive UI.",
        techStack: ["MongoDB", "Express.js", "React", "Node.js", "Authentication"],
        status: "Completed",
        liveUrl: "https://triphaven-renting-app.netlify.app/",
        githubUrl: "https://github.com/sachin-patware/airbnb_project",
      },
    ],
  },
  experience: {
    title: "Experience",
    subtitle: "Professional work, internships, and project experience.",
    items: [
      {
        id: "internship-dmaan",
        company: "Dmaan Engineering",
        role: "Web Development Intern",
        startDate: "2025-05-15",
        endDate: "2025-07-24",
        location: "Remote",
        description:
          "Worked on a real-time web development project for the company's website and strengthened full-stack delivery habits.",
        highlights: [
          "Built features using Python, Django, React, and SQLite.",
          "Worked with deployment, API testing, and production-ready UI updates.",
        ],
      },
    ],
  },
  education: {
    title: "Education",
    subtitle: "Academic background and certifications.",
    items: [
      {
        id: "btech",
        degree: "Bachelor of Technology",
        field: "CSE - Data Science",
        institution: "Acropolis Institute of Technology & Research",
        period: "2023 - 2027",
        grade: "CGPA: 7.2",
        current: true,
      },
      {
        id: "school",
        degree: "High School Education",
        institution: "Red Flower Hr. Sec. School",
        details: [
          { level: "XII (PCM)", period: "2022 - 2023", grade: "79.6%" },
          { level: "X", period: "2020 - 2021", grade: "78%" },
        ],
      },
    ],
    certifications: [
      {
        id: "web-dev",
        title: "Web Development Internship Certificate",
        date: "May 15, 2025 - July 24, 2025",
        organization: "Dmaan Engineering",
        description: [
          "Successfully completed a 2-month internship in Web Development during the internship period.",
          "Gained exposure to Python, Django, SQLite, React, HTML/CSS, Git, Postman, and cloud deployment.",
        ],
      },
      {
        id: "nptel",
        title: "Python for Data Science - NPTEL Online Certification",
        date: "January - February 2025",
        organization: "IIT Madras",
        description: [
          "Elite certification for successfully completing the 4-week course with a consolidated score of 69%.",
          "Completed online assignments and the proctored exam with strong results.",
        ],
      },
      {
        id: "salesforce",
        title: "Salesforce AI Associate Certified",
        date: "Nov, 2024",
        description: [
          "Earned the Salesforce AI Associate Certification.",
          "Built familiarity with AI fundamentals and Salesforce's AI tools.",
        ],
      },
    ],
  },
  resume: {
    title: "Resume",
    subtitle: "Preview or download my latest resume in one click.",
    description:
      "Use the buttons below to preview or download the resume PDF. Add the file to public/resume.pdf, or update the resume URL in the portfolio data.",
    fileUrl: "",
    fileName: "Sachin_Patware_Resume.pdf",
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Send me an email through the form below, or reach out via social links.",
    email: "sachinpatware10@gmail.com",
    phone: "+91 7974390787",
    location: "Indore, MP, India",
    formEnabled: true,
  },
  socialLinks: [
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/sachin-patware/",
      iconKey: "linkedin",
    },
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com/sachin-patware",
      iconKey: "github",
    },
    {
      platform: "x",
      label: "X",
      url: "https://x.com/patware_sa6889",
      iconKey: "x",
    },
  ],
};
