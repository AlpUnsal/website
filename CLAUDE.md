# Personal Website - CLAUDE.md

## About This Project

This is Alp Unsal's personal website, used alongside his resume for job applications. It should showcase his personality and technical ability while looking polished and memorable. Alp is a dual-degree student (HBSc Computer Science + HBA Business) at Western/Ivey, graduating April 2027, with deep ML research experience (Vector Institute, UHN, SickKids) and multiple award-winning projects.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **API**: Google Gemini for the sandbox feature
- **Fonts**: Inter (sans) + Playfair Display (serif)

## Project Structure

```
app/                    # Next.js App Router pages
  api/sandbox/generate/ # Gemini-powered code generation endpoint
  writing/[slug]/       # Dynamic blog post routes
  sandbox/              # Interactive AI code sandbox
  projects/             # Project showcase
components/             # React components (particles, nav, backgrounds)
content/                # Blog posts (TypeScript arrays) + sandbox greetings
lib/                    # Utilities (rate limiter)
```

## Design Philosophy

- **Warm cream background** (#fffde2) with dark foreground - not a generic dark-mode portfolio
- **Interactive touches**: particle backgrounds (mouse-repelled, toggle with double-click), triangle animations, accent color randomization, time-based greetings
- **Sleek but playful**: the site should feel polished enough for recruiters at top companies while still being memorable and showing personality
- Balance between "creative & experimental" and "professional" - never boring, never messy

## Development Guidelines

- Content (blog posts) lives in `content/posts.ts` as TypeScript arrays, not MDX
- Hybrid SSR/client approach: server components by default, `"use client"` only when needed for interactivity
- Canvas API for performant background animations (not CSS/DOM-based)
- Rate limiting on the sandbox API is in-memory (fine for hobby project)
- Path alias: `@/*` maps to project root

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Key Context

- LiveMock.ai (listed in projects) was acquired
- Axilo is Alp's speed reading iOS app (App Store), built on RSVP research to reduce friction in reading books/papers
- Alp's research at Vector Institute involves anti-aging/senescence ML - paper coming 2026
- The sandbox feature lets visitors generate and run code in a sandboxed iframe - it's a signature interactive element
- The site targets technical recruiters and hiring managers at top tech companies and research labs
