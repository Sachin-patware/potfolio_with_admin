import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Globe, Wrench } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const iconMap = {
  code: Code,
  database: Database,
  globe: Globe,
  wrench: Wrench,
} as const;

const SkillsSection = () => {
  const { portfolio } = usePortfolio();

  return (
    <section id="skills" className="py-12 sm:py-20 bg-cream-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-text mb-4 sm:mb-6">
            {portfolio.skills.title.split(" ")[0]}{" "}
            <span className="text-warm-brown">{portfolio.skills.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-lg sm:text-xl text-dark-text/70 max-w-2xl mx-auto px-4">
            {portfolio.skills.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {portfolio.skills.categories.map((category) => {
            const CategoryIcon = iconMap[category.iconKey];

            return (
              <Card
                key={category.id}
                className="p-4 sm:p-8 shadow-card bg-white hover:shadow-xl transition-all duration-300 animate-fade-in border-0 rounded-2xl"
              >
                <div className="flex items-center mb-4 sm:mb-8">
                  <div className="bg-gradient-to-br from-warm-brown to-warm-brown/80 p-3 sm:p-4 rounded-2xl mr-3 sm:mr-6 shadow-lg">
                    <CategoryIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-dark-text">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="group">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-warm-brown/5 to-warm-brown/10 rounded-xl hover:from-warm-brown/15 hover:to-warm-brown/20 transition-all duration-300 border border-warm-brown/10 hover:border-warm-brown/20">
                        <div className="flex items-center flex-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-warm-brown rounded-full mr-3 sm:mr-4 group-hover:scale-125 transition-transform"></div>
                          <div className="flex-1">
                            <span className="text-dark-text font-semibold text-base sm:text-lg group-hover:text-warm-brown transition-colors block">
                              {skill.name}
                            </span>
                            {skill.description && (
                              <p className="text-xs sm:text-sm text-dark-text/60 leading-relaxed mt-1">
                                {skill.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-warm-brown/10 text-warm-brown border-warm-brown/20 group-hover:bg-warm-brown/20 transition-colors text-xs sm:text-sm"
                        >
                          {skill.label ?? "Skill"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
