import { Card } from "@/components/ui/card";
import { BriefcaseBusiness, MapPin, CalendarDays } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const ExperienceSection = () => {
  const { portfolio } = usePortfolio();

  if (portfolio.experience.items.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-20 bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-text mb-4">
            {portfolio.experience.title}
          </h2>
          <p className="text-lg text-dark-text/70 max-w-2xl mx-auto">
            {portfolio.experience.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {portfolio.experience.items.map((item) => (
            <Card key={item.id} className="p-6 sm:p-8 shadow-card bg-white">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-warm-brown/10 p-3">
                    <BriefcaseBusiness className="h-6 w-6 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-dark-text">{item.role}</h3>
                    <p className="text-warm-brown font-semibold">{item.company}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-dark-text/60">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {item.startDate} {item.endDate ? `to ${item.endDate}` : "Present"}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {item.current ? (
                  <span className="inline-flex self-start rounded-full bg-warm-brown px-3 py-1 text-xs font-semibold text-white">
                    Current
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-dark-text/75 leading-relaxed">{item.description}</p>

              <ul className="mt-4 space-y-2 text-sm text-dark-text/70 list-disc pl-5">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
