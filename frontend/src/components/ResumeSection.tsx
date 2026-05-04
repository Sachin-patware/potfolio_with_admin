import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/context/portfolio-context";
import { Download, Eye, FileText } from "lucide-react";

const ResumeSection = () => {
  const { portfolio } = usePortfolio();
  const resume = portfolio.resume;
  const hasResume = Boolean(resume.fileUrl.trim());

  return (
    <section id="resume" className="py-14 bg-cream-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border border-warm-brown/10 bg-white shadow-card">
          <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-warm-brown/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-warm-brown uppercase">
                <FileText className="h-3.5 w-3.5" />
                Resume
              </div>

              <h2 className="mt-4 text-3xl font-bold text-dark-text sm:text-4xl">
                {resume.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-dark-text/70">
                {resume.subtitle}
              </p>
              <p className="mt-4 text-sm leading-6 text-dark-text/65">
                {resume.description}
              </p>

              {!hasResume ? (
                <p className="mt-3 text-xs text-dark-text/50">
                  Add a PDF path in the admin panel to enable preview and download.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <Button
                asChild
                disabled={!hasResume}
                className="gap-2 bg-warm-brown text-white hover:bg-warm-brown/90 disabled:opacity-60"
              >
                <a
                  href={hasResume ? resume.fileUrl : undefined}
                  target={hasResume ? "_blank" : undefined}
                  rel={hasResume ? "noreferrer" : undefined}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                disabled={!hasResume}
                className="gap-2 border-warm-brown text-warm-brown hover:bg-warm-brown/5 disabled:opacity-60"
              >
                <a
                  href={hasResume ? resume.fileUrl : undefined}
                  download={hasResume ? resume.fileName : undefined}
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ResumeSection;
