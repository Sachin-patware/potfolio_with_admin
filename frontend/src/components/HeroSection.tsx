import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactTyped } from "react-typed";
import { usePortfolio } from "@/context/portfolio-context";

const HeroSection = () => {
  const { portfolio } = usePortfolio();

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen bg-cream-bg flex items-center pt-12 sm:pt-28 lg:pt-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start animate-scale-in">
            <div className="relative">
              {/* Decorative elements above profile - smaller on mobile */}
              <div className="absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-8 sm:w-16 h-8 sm:h-16 bg-warm-brown/10 rounded-full animate-float"></div>
              <div
                className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 sm:w-8 h-4 sm:h-8 bg-warm-brown/20 rounded-full animate-float"
                style={{ animationDelay: "0.5s" }}
              ></div>

              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-card animate-float">
                <img
                  src={portfolio.hero.image}
                  alt={portfolio.siteName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-warm-brown/20"></div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-dark-text mb-4">
              {portfolio.hero.name.toUpperCase()}
              <br />
              <span className="text-warm-brown">
                {portfolio.hero.highlight.toUpperCase()}
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-warm-brown mb-6 sm:mb-8 font-medium">
              <ReactTyped
                strings={portfolio.hero.roles.map((role) => role.toUpperCase())}
                typeSpeed={120}
                backSpeed={120}
                loop
              />
            </p>
            <Button
              onClick={scrollToContact}
              className="bg-warm-brown hover:bg-warm-brown/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition-all duration-300 group shadow-soft mb-6 sm:mb-8"
            >
              {portfolio.hero.ctaLabel.toUpperCase()}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
