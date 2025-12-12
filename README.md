# Portfolio Website

A modern, animated portfolio website built with Next.js 15, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP + Framer Motion
- **Database**: Supabase PostgreSQL + Prisma ORM
- **Particles**: tsParticles

## Features

### Core
- Dark/Light/System theme support
- Responsive design (mobile-first)
- SEO optimized with dynamic OG images
- Blog with MDX support
- Contact form with email notifications

### Interactive Elements
- **Command Palette** (Cmd+K) - Quick navigation and actions
- **Mini Terminal** - Draggable terminal with commands (minimize, expand, close)
- **Custom Cursor** - Instant-responsive SVG arrow cursor
- **Cursor Glow Effect** - Subtle spotlight that follows cursor
- **Sound Effects** - Toggle-able UI sounds
- **Draggable Skill Cards** - Rearrangeable skill visualization
- **Button Ripple Effect** - Material Design-style ripple on click

### Visual Enhancements
- Animated gradient text
- Noise/grain texture overlay
- 3D tilt cards with parallax
- Magnetic buttons
- Scroll-triggered animations
- Particle background in hero
- **Page Transitions** - Smooth fade between pages
- **Image Reveal Animations** - Clip-path reveals on scroll
- **Section Transitions** - Blur/fade reveals for sections
- **Text Hover Effects** - Character scatter, wave, and slide animations
- **Animated Link Underlines** - Multiple underline animation variants

### Accessibility
- Keyboard navigation with visible focus indicators
- Reduced motion support
- Font size toggle (Small/Medium/Large)
- High contrast mode
- Screen reader friendly

### Engagement
- Blog view counter
- Reaction buttons (like, love, clap, fire, rocket)
- Share functionality with dynamic OG images

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. Push database schema:
   ```bash
   npx prisma db push
   ```

5. Seed sample data (optional):
   ```bash
   npx prisma db seed
   ```

6. Run development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── template.tsx       # Page transitions
│   └── page.tsx           # Home page
├── components/
│   ├── animations/        # Animation components
│   │   ├── ImageReveal    # Clip-path image reveals
│   │   ├── SectionReveal  # Section transitions
│   │   ├── TextHover      # Text hover effects
│   │   ├── AnimatedLink   # Animated underlines
│   │   └── ...more
│   ├── interactive/       # Terminal, Command Palette
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Hero, About, Skills, Projects, Contact, Blog
│   ├── ui/                # Reusable UI components (Button w/ ripple, CursorGlow)
│   └── visualizations/    # Skill radar chart
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities, constants, database
├── providers/             # Context providers
└── types/                 # TypeScript interfaces
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `` ` `` | Toggle terminal |
| `T` | Cycle theme |
| `Escape` | Close modals |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
