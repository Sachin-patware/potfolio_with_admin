import { useRef, useState } from "react";
import type { FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { Card } from "@/components/ui/card";
import { Mail, User, MessageSquare, Info } from "lucide-react";
import { usePortfolio } from "@/context/portfolio-context";

const ContactSection = () => {
  const form = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState(false);
  const { portfolio } = usePortfolio();

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setSuccess(true);
        form.current?.reset();
      })
      .catch((error) => {
        console.error("Email sending error:", error);
        setSuccess(false);
      });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-cream to-light-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-dark-text mb-4">
            {portfolio.contact.title.split(" ")[0]}{" "}
            <span className="text-warm-brown">{portfolio.contact.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-lg text-dark-text/70 max-w-2xl mx-auto">
            {portfolio.contact.subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {portfolio.contact.formEnabled ? (
            <form ref={form} onSubmit={sendEmail}>
              <Card className="p-6 sm:p-8 shadow-lg bg-white space-y-5">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Your Email"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Subject
                  </label>
                  <div className="relative">
                    <Info className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="Subject"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-1">
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <textarea
                      name="message"
                      required
                      placeholder="Your Message"
                      className="w-full border border-gray-300 rounded-lg p-3 pl-10 h-32 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-warm-brown text-white px-6 py-3 rounded-lg hover:bg-warm-brown/90 transition"
                >
                  Send Message
                </button>

                {success && (
                  <p className="text-green-600 font-medium pt-2">
                    Message sent successfully!
                  </p>
                )}
              </Card>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
