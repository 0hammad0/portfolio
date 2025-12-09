// Reusable animation presets for GSAP

export const fadeInUp = {
  from: { opacity: 0, y: 50 },
  to: { opacity: 1, y: 0 },
};

export const fadeInDown = {
  from: { opacity: 0, y: -50 },
  to: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  from: { opacity: 0, x: -50 },
  to: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  from: { opacity: 0, x: 50 },
  to: { opacity: 1, x: 0 },
};

export const fadeInScale = {
  from: { opacity: 0, scale: 0.9 },
  to: { opacity: 1, scale: 1 },
};

export const scaleUp = {
  from: { scale: 0.8, opacity: 0 },
  to: { scale: 1, opacity: 1 },
};

export const staggerConfig = {
  each: 0.1,
  from: "start" as const,
};

export const staggerFromCenter = {
  each: 0.08,
  from: "center" as const,
};

// Hero-specific animations
export const heroTitle = {
  from: { opacity: 0, y: 100, skewY: 7 },
  to: { opacity: 1, y: 0, skewY: 0 },
};

export const heroSubtitle = {
  from: { opacity: 0, y: 30 },
  to: { opacity: 1, y: 0 },
};

// Card hover animation values
export const cardHover = {
  scale: 1.02,
  y: -5,
  duration: 0.3,
  ease: "power2.out",
};

// Navigation link animation
export const navLinkHover = {
  scale: 1.05,
  duration: 0.2,
};
