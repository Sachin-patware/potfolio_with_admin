import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Calendar, Trophy } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const AboutSection = () => {
  const { portfolio } = usePortfolio();

  return (
    <section id="about" className="py-20 bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-text mb-6">
            {portfolio.about.title.split(" ")[0]}{" "}
            <span className="text-warm-brown">{portfolio.about.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-xl text-dark-text/70 max-w-2xl mx-auto">
            {portfolio.about.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-card bg-white hover:shadow-lg transition-all duration-300 animate-fade-in">
            <h3 className="text-2xl font-bold text-dark-text mb-6 flex items-center">
              <div className="bg-warm-brown/10 p-2 rounded-lg mr-3">
                <GraduationCap className="h-5 w-5 text-warm-brown" />
              </div>
              Who I am
            </h3>

            <div className="space-y-5 text-dark-text/80 text-base sm:text-lg leading-relaxed">
              {portfolio.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Badge className="bg-warm-brown/10 text-warm-brown border-warm-brown/20 px-3 py-1 hover:bg-warm-brown/50 transition-colors text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  {portfolio.about.badges[0]}
                </Badge>
                <Badge className="bg-warm-brown/10 text-warm-brown border-warm-brown/20 px-3 py-1 hover:bg-warm-brown/50 transition-colors text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {portfolio.about.badges[1]}
                </Badge>
                <Badge className="bg-warm-brown/10 text-warm-brown border-warm-brown/20 px-3 py-1 hover:bg-warm-brown/50 transition-colors text-xs sm:text-sm">
                  <Trophy className="h-3 w-3 mr-1" />
                  {portfolio.about.badges[2]}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
