import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/portfolio-context";
import { Download, FileText, Eye } from "lucide-react";

const ResumeSection = () => {
  const { portfolio } = usePortfolio();
  const hasResume = Boolean(portfolio.resume.fileUrl.trim());

  return (
    <section id="resume" className="py-20 bg-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-dark-text mb-4">
            {portfolio.resume.title}
          </h2>
          <p className="text-lg text-dark-text/70 max-w-2xl mx-auto">
            {portfolio.resume.subtitle}
          </p>
        </div>

        <Card className="overflow-hidden border-0 bg-white shadow-xl">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-warm-brown/10 px-4 py-2 text-sm font-semibold text-warm-brown">
                <FileText className="h-4 w-4" />
                Resume section
              </div>

              <h3 className="mt-6 text-3xl sm:text-4xl font-bold text-dark-text">
                View my latest resume and keep a copy for offline review.
              </h3>

              <p className="mt-4 max-w-2xl text-base sm:text-lg leading-7 text-dark-text/70">
                {portfolio.resume.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  disabled={!hasResume}
                  className="gap-2 bg-warm-brown text-white hover:bg-warm-brown/90 disabled:opacity-60"
                >
                  <a
                    href={hasResume ? portfolio.resume.fileUrl : undefined}
                    target={hasResume ? "_blank" : undefined}
                    rel={hasResume ? "noreferrer" : undefined}
                  >
                    <Eye className="h-4 w-4" />
                    Preview Resume
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  disabled={!hasResume}
                  className="gap-2 border-warm-brown text-warm-brown hover:bg-warm-brown/5 disabled:opacity-60"
                >
                  <a
                    href={hasResume ? portfolio.resume.fileUrl : undefined}
                    download={hasResume ? portfolio.resume.fileName : undefined}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
              </div>

              {!hasResume ? (
                <p className="mt-4 text-sm text-dark-text/60">
                  Add a PDF at <span className="font-semibold">public/resume.pdf</span> or set
                  <span className="font-semibold"> resume.fileUrl</span> in the portfolio data to enable the buttons.
                </p>
              ) : null}
            </div>

            <div className="bg-gradient-to-br from-cream-bg to-light-cream p-8 sm:p-10 lg:p-12">
              <div className="h-full rounded-3xl border border-dashed border-warm-brown/25 bg-white/70 p-6 shadow-inner">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-warm-brown">
                      Preview
                    </p>
                    <h4 className="mt-2 text-2xl font-bold text-dark-text">
                      {portfolio.siteName}
                    </h4>
                  </div>
                  <div className="rounded-2xl bg-warm-brown/10 p-3 text-warm-brown">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl bg-warm-brown/10 p-4">
                    <div className="h-3 w-2/3 rounded-full bg-warm-brown/30" />
                    <div className="mt-3 h-3 w-1/2 rounded-full bg-warm-brown/20" />
                    <div className="mt-3 h-3 w-5/6 rounded-full bg-warm-brown/15" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-dark-text">File</p>
                      <p className="mt-1 text-sm text-dark-text/60">
                        {portfolio.resume.fileName}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-dark-text">Status</p>
                      <p className="mt-1 text-sm text-dark-text/60">
                        {hasResume ? "Ready to preview" : "Resume not connected yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ResumeSection;
