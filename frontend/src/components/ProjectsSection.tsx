import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const ProjectsSection = () => {
  const { portfolio } = usePortfolio();

  return (
    <section id="projects" className="py-16 sm:py-24 bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-dark-text mb-4">
            {portfolio.projects.title.split(" ")[0]}{" "}
            <span className="text-warm-brown">{portfolio.projects.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-lg sm:text-xl text-dark-text/70 max-w-2xl mx-auto">
            {portfolio.projects.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {portfolio.projects.items.map((project) => (
            <Card
              key={project.id}
              className="p-6 sm:p-8 shadow-card bg-white hover:shadow-xl transition-all duration-300 group animate-fade-in h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-warm-brown/10 p-2 rounded-lg">
                  <Code className="h-5 w-5 text-warm-brown" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-dark-text mb-3 group-hover:text-warm-brown transition-colors">
                {project.title}
              </h3>

              <p className="text-dark-text/70 text-sm sm:text-base leading-relaxed mb-5 flex-grow">
                {project.description}
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-warm-brown/10 text-warm-brown text-xs sm:text-sm rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-warm-brown text-warm-brown hover:bg-warm-brown hover:text-white transition"
                  onClick={() => window.open(project.githubUrl, "_blank")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-warm-brown hover:bg-warm-brown/90 text-white transition"
                  onClick={() => window.open(project.liveUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
