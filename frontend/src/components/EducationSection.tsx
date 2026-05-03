import { Card } from "@/components/ui/card";
import { Calendar, GraduationCap, Award } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const EducationSection = () => {
  const { portfolio } = usePortfolio();

  return (
    <section id="education" className="py-20 bg-cream-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-text mb-4 text-center">
            <span className="text-warm-brown">{portfolio.education.title}</span>
          </h2>
          <p className="text-lg text-dark-text/70 max-w-2xl mx-auto text-center">
            {portfolio.education.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.education.items.map((edu) => (
            <Card key={edu.id} className="p-6 shadow-card bg-white hover:shadow-lg transition-all duration-300 animate-fade-in">
              <div className="flex items-start space-x-4">
                <div className="bg-warm-brown/10 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-warm-brown" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-dark-text mb-2">
                    {edu.degree}
                  </h3>
                  {edu.field && (
                    <p className="text-warm-brown font-medium mb-1">{edu.field}</p>
                  )}
                  <p className="text-dark-text/70 mb-2">{edu.institution}</p>

                  {edu.details ? (
                    <div className="space-y-2">
                      {edu.details.map((detail) => (
                        <div key={detail.level} className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-dark-text/60">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="font-medium text-dark-text">{detail.level}</span>
                            <span className="ml-2">({detail.period})</span>
                          </div>
                          <span className="font-semibold text-warm-brown">{detail.grade}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 text-sm text-dark-text/60">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {edu.period}
                      </div>
                      <span className="font-semibold text-warm-brown">{edu.grade}</span>
                    </div>
                  )}

                  {edu.current && (
                    <span className="inline-block mt-2 px-3 py-1 bg-warm-brown text-white text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-text mb-12 text-center">
            <span className="text-warm-brown">Certifications</span>
          </h2>

          <div className="space-y-8">
            {portfolio.education.certifications.map((cert) => (
              <Card
                key={cert.id}
                className="p-6 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="bg-warm-brown/10 p-4 rounded-full flex-shrink-0">
                    <Award className="h-7 w-7 text-warm-brown" />
                  </div>

                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                      <h3 className="text-xl sm:text-2xl font-semibold text-dark-text">
                        {cert.title}
                      </h3>
                      <span className="text-warm-brown font-medium text-base sm:text-lg mt-1 sm:mt-0">
                        {cert.date}
                      </span>
                    </div>

                    <ul className="list-disc pl-5 space-y-2 text-dark-text/80 text-sm sm:text-base leading-relaxed">
                      {cert.description.map((desc) => (
                        <li key={desc}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
