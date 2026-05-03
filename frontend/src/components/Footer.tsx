import { Mail, Phone, MapPin, Linkedin, Github, Instagram, Twitter, Globe } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  x: Twitter,
  website: Globe,
  email: Mail,
} as const;

const Footer = () => {
  const { portfolio } = usePortfolio();

  const contactInfo = [
    {
      icon: Mail,
      value: portfolio.contact.email,
      href: `mailto:${portfolio.contact.email}`,
    },
    {
      icon: Phone,
      value: portfolio.contact.phone,
      href: `tel:${portfolio.contact.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MapPin,
      value: portfolio.contact.location,
      href: "#",
    },
  ];

  return (
    <footer className="bg-dark-text text-light-cream py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-base font-semibold mb-2">Contact Info</h4>
            <div className="space-y-1">
              {contactInfo.map((info) => (
                <div key={info.value} className="flex items-center">
                  <info.icon className="h-3 w-3 mr-2 text-warm-brown" />
                  <a
                    href={info.href}
                    className="text-light-cream/70 hover:text-light-cream transition-colors text-xs"
                  >
                    {info.value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2">Connect With Me</h4>
            <div className="flex flex-wrap gap-2">
              {portfolio.socialLinks.map((social) => {
                const SocialIcon = iconMap[social.iconKey];
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-warm-brown/10 p-2 rounded-lg hover:bg-warm-brown hover:text-white transition-all duration-300 flex items-center justify-center group"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <SocialIcon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-light-cream/20 mt-4 pt-3 text-center">
          <p className="text-light-cream/60 text-xs">
            &copy; 2026 {portfolio.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
