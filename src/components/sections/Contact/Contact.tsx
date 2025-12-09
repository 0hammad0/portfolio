"use client";

import { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { ParallaxText } from "@/components/animations/ParallaxText";
import { ContactForm } from "./ContactForm";
import { socialLinks } from "@/lib/constants/social";
import { siteConfig } from "@/lib/constants/siteConfig";
import { MapPin, Mail, Clock, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: siteConfig.author.location,
  },
  {
    icon: Clock,
    label: "Availability",
    value: "Open for opportunities",
  },
];

function ContactComponent() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden">
      {/* Background parallax text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <ParallaxText baseVelocity={-25} repeat={6}>
          CONTACT • LET&apos;S WORK TOGETHER •
        </ParallaxText>
      </div>

      
      <div className="section relative">
        <Container>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-4 text-xs sm:text-sm font-medium text-accent bg-accent/10 rounded-full"
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Get In Touch
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Let&apos;s <span className="text-gradient">Connect</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-foreground-muted max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 sm:px-0"
            >
              Have a project in mind or just want to say hello? Feel free to reach out.
              I&apos;m always open to discussing new projects and opportunities.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Info */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Info Card */}
              <motion.div
                variants={itemVariants}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent/50 via-transparent to-accent/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

                <div className="relative p-4 sm:p-6 rounded-lg sm:rounded-xl bg-background-secondary border border-border">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    <h3 className="text-lg sm:text-xl font-semibold">Contact Information</h3>
                  </div>
                  <div className="space-y-4 sm:space-y-5">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <motion.div
                          key={info.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start gap-4 group/item"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-3 rounded-xl bg-accent/10 text-accent group-hover/item:bg-accent group-hover/item:text-white transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                          </motion.div>
                          <div>
                            <p className="text-sm text-foreground-muted">
                              {info.label}
                            </p>
                            {info.href ? (
                              <a
                                href={info.href}
                                className="font-medium hover:text-accent transition-colors cursor-pointer"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="font-medium">{info.value}</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Social Links Card */}
              <motion.div
                variants={itemVariants}
                className="relative group"
              >
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent/50 via-transparent to-accent/50 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

                <div className="relative p-4 sm:p-6 rounded-lg sm:rounded-xl bg-background-secondary border border-border">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Connect With Me</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer",
                            "bg-background-tertiary border border-border",
                            "hover:bg-accent hover:text-white hover:border-accent",
                            "transition-all duration-300"
                          )}
                          aria-label={social.label}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{social.name}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="relative group">
                {/* Animated border */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-accent via-accent/50 to-accent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                <div className="relative p-6 md:p-8 rounded-xl bg-background-secondary border border-border">
                  <div className="flex items-center gap-2 mb-6">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Send className="h-5 w-5 text-accent" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">Send a Message</h3>
                  </div>
                  <ContactForm />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}

// Memoize to prevent unnecessary re-renders
export const Contact = memo(ContactComponent);
