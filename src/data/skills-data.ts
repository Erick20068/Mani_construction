// Generado por scripts/generate-skills-data.mjs — no editar a mano.
// Reejecuta: node scripts/generate-skills-data.mjs

export interface SkillInfo {
  name: string
  description: string
  category: string
  source: "OpenCode" | "Agents"
  usedInProject: string | null
}

export const SKILLS: SkillInfo[] = [
  {
    "name": "academy-guide",
    "description": ">",
    "category": "general",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "Agent Cost Report",
    "description": ">-",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "algorithmic-art",
    "description": "Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algorithmic art rather than copying existing artists work to avoid copyright violations.",
    "category": "art",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "animate",
    "description": "Build an animation from scratch, making the decisions in the order that determines whether it feels right — should it animate at all, what purpose, which tool, which properties, which curve and duration, how it interrupts, how it exits. Writes the implementation. Use when asked to animate something, add motion, make a component feel alive, or build a transition. For critiquing existing motion use review-animations; for auditing a whole codebase use improve-animations.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": "Animaciones de entrada y micro-interacciones"
  },
  {
    "name": "animate-expo",
    "description": "Build animations in React Native and Expo, making the decisions in the order that determines whether they feel right — should it animate, which thread it runs on, which properties, spring or timing, how the gesture hands off, how it degrades. Writes the implementation with Reanimated, Gesture Handler, Expo Router and expo-haptics. Use when animating anything in an Expo app, adding gestures, sheets, screen transitions, press feedback or haptics, or fixing motion that stutters on device. For web animation use `animate`.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "animated-chart",
    "description": "Make a looping animated chart for LinkedIn or a newsletter in code with Claude Code. Bars that become a line, a number that counts up, a before and after. Every value stays exactly as given. Use when someone says animate my chart, animated graph, make my results move, stat animation or wants a data graphic that loops.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "animation-performance",
    "description": "Keep web animations inside the frame budget — animate composite-only properties, keep motion off the main thread when the page is busy, and find the cause when an animation drops frames. Covers the layout/paint/composite pipeline, cheaper property swaps, CSS vs WAAPI vs requestAnimationFrame, Framer Motions hardware-accelerated path, React re-rendering per frame, inherited CSS variable recalculation, blur cost, and when `will-change` actually helps. Use when an animation is janky, choppy, stutters, or drops frames; when choosing which property to animate; when deciding between CSS and JS animation on performance grounds; or when reaching for `will-change` or GPU layers. For choosing easing, duration, or whether to animate at all use animate; for reviewing motion as a whole use review-animations.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": "Rendimiento de las animaciones de canvas/3D"
  },
  {
    "name": "animation-vocabulary",
    "description": "Reverse-lookup glossary that turns a vague description of a web animation or motion effect into its exact term (the bouncy thing when a popover opens → Pop in; the iOS rubber-band scroll → Rubber-banding). Use when the user asks whats it called when…, or describes a motion effect without knowing its name and wants the right word to prompt an AI or designer with. For naming an effect, not designing or building one.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "apple-design",
    "description": "Apples approach to interface design and fluid, physical motion, translated for the web. Use when building or reviewing gesture-driven UI, spring animations, drag/swipe/sheet interactions, momentum and interruptible transitions, translucent materials and depth, typography (optical sizing, tracking, leading), reduced-motion, or the design foundations (feedback, spatial consistency, restraint) behind Apple-style interfaces.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Transiciones y gestos del reproductor de video"
  },
  {
    "name": "apple-launch-film",
    "description": "Rebuild an Apple-style Mac launch film entirely in code with Claude Code. A thin menu bar, the black notch growing into widgets one scene at a time, full-screen gradient wallpapers and one short caption per scene. No screen recording, no After Effects. Use when someone says Apple-style launch, Mac launch video, notch animation, make it look like an Apple keynote, macOS UI launch film or wants a product launch that looks like native Mac interface.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "ask-sonner",
    "description": "Guide to Sonner, the React toast library — install and wire up the Toaster, pick the right toast() call, promise and loading toasts, updating, dismissing and persisting toasts, styling, theming and icons, positioning and multiple toasters. Use when working with Sonner or troubleshooting it — toasts that dont appear, appear twice, lose their styles, ignore Tailwind classes, sit behind a modal, or dont follow dark mode.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "babysit",
    "description": "Watch a pull request or review cycle until it is ready to merge. Use when asked to babysit, monitor, or keep checking PR comments, reviews, and CI until all actionable issues are resolved.",
    "category": "workflow",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "banner-design",
    "description": "Design banners for social media, ads, website heroes, creative assets, and print. Multiple art direction options with optional generated or supplied visuals. Actions: design, create, generate banner. Platforms: Facebook, Twitter/X, LinkedIn, YouTube, Instagram, Google Display, website hero, print. Styles: minimalist, gradient, bold typography, photo-based, illustrated, geometric, retro, glassmorphism, 3D, neon, duotone, editorial, collage.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "brand",
    "description": "Brand voice, visual identity, messaging frameworks, asset management, brand consistency. Activate for branded content, tone of voice, marketing assets, brand compliance, style guides.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Tono de voz y coherencia de marca"
  },
  {
    "name": "brand-guidelines",
    "description": "Applies Anthropics official brand colors and typography to any sort of artifact that may benefit from having Anthropics look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.",
    "category": "design",
    "source": "Agents",
    "usedInProject": "Paleta de marca del constructor"
  },
  {
    "name": "brand-intake",
    "description": "The setup step every other skill in this pack reads. A short interview plus 3 to 5 reference frames becomes two files in your project, brand.md (who you are, what you sell, your assets) and MOTION.md (your colours, type, timing and motion rules), plus a rule in CLAUDE.md so Claude reads them before it animates anything. Use at the start of any motion project, or when someone says set up my brand, brand intake, build my motion design system, make it look like my brand, onboard me, write my MOTION.md or drops a batch of brand frames into chat.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "break-ui",
    "description": "Try to break a piece of UI by feeding it worst-case data — long names, unbreakable emails, one-letter names, missing fields, huge counts, zero items, long labels, non-Latin text, emoji, extreme numbers — then render it behind a Demo data / Worst case toggle and report everything that broke, with the fix for each. Use when the user asks to stress-test, break, or find edge cases in a component or screen, or to try the worst case. For visual design critique use emil-design-eng; for motion use review-animations.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "canvas-design",
    "description": "Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists work to avoid copyright violations.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "ccs-align",
    "description": "Run the CCS Align seats hourly breathing cycle — prove the local claude-mem worker is healthy, pull needle observations through search → timeline → get_observations, land them in a seat-owned middle cache via atomic grab → append → filter exclude-marks → replace, manage exclude marks, and walk house → project → seat rules to detect conflicts (SHADOW_HOUSE, DENY_ALLOW, DRIFT, CLOCK_HEADER) with an append-only rules-report.md. Use when asked to run CCS Align, breathe the alignment seat, refresh the middle cache, exclude or restore an observation, walk rules, check rules conflicts, or check the Worker Watch board.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "claude-api",
    "description": "|-",
    "category": "general",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "cloud-sync",
    "description": "Set up or check claude-mem cloud sync with cmem.ai Pro. Use when the user says set up cloud sync, sync my memories, cmem pro, cloud backup, sync status, or wants their memory database backed up or synced to their cmem.ai account.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "design",
    "description": "Comprehensive design skill: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini, Atlas Cloud, or MuAPI AI), corporate identity program (50 deliverables, CIP mockups), HTML presentations (Chart.js), banner design (22 styles, social/ads/web/print), icon design (15 styles, SVG, Gemini 3.1 Pro), social photos (HTML→screenshot, multi-platform). Actions: design logo, create CIP, generate mockups, build slides, design banner, generate icon, create social photos, social media images, brand identity, design system. Platforms: Facebook, Twitter, LinkedIn, YouTube, Instagram, Pinterest, TikTok, Threads, Google Ads.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "design-is",
    "description": "Audit a design against Dieter Rams ten Good design is... principles, then hand off a /make-plan prompt for one of three outcomes — new design, refine design, or redesign. Use when the user says audit this design, design review, check this UI against Rams, is this UI good, critique this design, design audit, or asks for a critique that should lead to a plan.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "design-system",
    "description": "Token architecture, component specifications, and slide generation. Three-layer tokens (primitive→semantic→component), CSS variables, spacing/typography scales, component specs, strategic slide creation. Use for design tokens, systematic design, brand-compliant presentations.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Tokens de color, tipografía y espaciado"
  },
  {
    "name": "design-taste-frontend-v1",
    "description": "The original taste-skill v1, kept for projects that depend on its exact behaviour. Opt-in: it runs only when called by name.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "design-taste-frontend-v2-experimental",
    "description": "The single-file, dial-driven taste-skill that was the default before v2, kept for projects that depend on its exact behaviour. Opt-in: it runs only when called by name.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "discernment-nudge",
    "description": ">",
    "category": "general",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "do",
    "description": "Execute a phased implementation plan using subagents. Use when asked to execute, run, or carry out a plan — especially one created by make-plan.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Ejecución por fases del plan"
  },
  {
    "name": "doc-coauthoring",
    "description": "Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers. Trigger when user mentions writing docs, creating proposals, drafting specs, or similar documentation tasks.",
    "category": "documents",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "doctor",
    "description": "Audits an existing PagoKit integration in the current project against the generated per-provider checklist, so it covers every provider in the catalog rather than a hardcoded few. Checks .gitignore covers .env, that env vars are present and use test-key prefixes, that the webhook secret looks valid, that the webhook handler verifies signatures, that the minimum events for the integrated provider are routed, and that PAGOKIT_INTEGRATION.md exists. Used by /pagokit/doctor. Read-only — never writes files.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "docx",
    "description": "Use this skill whenever the user wants to create, read, edit, or manipulate Word documents (.docx files) or Word templates (.dotx files). Triggers include: any mention of Word doc, word document, .docx, .dotx, or requests to produce professional documents with formatting like tables of contents, headings, page numbers, or letterheads. Also use when extracting or reorganizing content from .docx or .dotx files, inserting or replacing images in documents, performing find-and-replace in Word files, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a report, memo, letter, template, or similar deliverable as a Word or .docx file, use this skill. Do NOT use for PDFs, spreadsheets, Google Docs, or general coding tasks unrelated to document generation.",
    "category": "documents",
    "source": "Agents",
    "usedInProject": "Documentos de entrega"
  },
  {
    "name": "emil-design-eng",
    "description": "This skill encodes Emil Kowalskis philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Filosofía de detalle fino en la UI"
  },
  {
    "name": "find-animation-opportunities",
    "description": "Search a codebase or UI for places that dont animate but should, and reject everything that shouldnt. Read-only; it proposes motion with exact values, it does not implement it. Use when the user asks what could be animated here? or wants to make this feel more alive. For fixing existing animations, use improve-animations or review-animations instead.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": "Auditoría de animaciones del reproductor"
  },
  {
    "name": "frontend-design",
    "description": "Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that dont read as templated defaults.",
    "category": "design",
    "source": "Agents",
    "usedInProject": "Dirección visual de la landing y del panel admin"
  },
  {
    "name": "gpt-taste",
    "description": "Classic skill for GPT and Codex, opt-in: it runs only when called by name. Layout variance, a strict AIDA page structure and GSAP scroll motion.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "graphify",
    "description": "Use for any question about a codebase, its architecture, file relationships, or project content — especially when graphify-out/ exists, where the question should be treated as a graphify query first. Turns any input (code, docs, papers, images, videos) into a persistent knowledge graph with god nodes, community detection, and query/path/explain tools.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Mapa de conocimiento del proyecto"
  },
  {
    "name": "handoff",
    "description": "Generate a HANDOFF.md that captures goal, current state, files touched, failed attempts, and next steps — so a fresh Claude session can continue exactly where this one left off. Use when sessions are getting long, Claude keeps retrying the same broken solution, or the user wants to step away and resume later.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Documento de traspaso de sesión"
  },
  {
    "name": "high-end-visual-design",
    "description": "Classic style skill, opt-in: it runs only when called by name. A calm, polished look with soft contrast, generous whitespace and spring motion.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "how-it-works",
    "description": "Explain how claude-mem captures observations, when memory injection kicks in, and where data lives. Use when the user asks how does claude-mem work? or what is this thing doing?.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "improve-animations",
    "description": "Survey a codebases animation and motion code as a senior motion advisor, then produce a prioritized audit and self-contained implementation plans for other agents (or cheaper models) to execute. Read-only on source code — it plans improvements, it does not apply them. Use when the user asks to improve the animations, audit the motion, make this app feel better, or wants a roadmap of animation fixes rather than a review of a single diff.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": "Plan de mejoras de movimiento"
  },
  {
    "name": "industrial-brutalist-ui",
    "description": "Classic style skill, opt-in: it runs only when called by name. A hard mechanical look with Swiss type, rigid grids, extreme scale contrast and utilitarian colour.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "integration-builder",
    "description": "Composes a complete payment integration by resolving capability fragments against the chosen providers catalog entry, then emits a structured file plan for integration-specialist to execute. Selects fragments by verification family, notification model and checkout pattern rather than by provider name, so a provider new to the catalog composes correctly without new templates. Refuses to emit a signature verifier when the providers scheme is not verified, emitting re-fetch and an explicit TODO instead.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "internal-comms",
    "description": "A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, etc.).",
    "category": "documents",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "knowledge-agent",
    "description": "Build and query AI-powered knowledge bases from claude-mem observations. Use when users want to create focused brains from their observation history, ask questions about past work patterns, or compile expertise on specific topics.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": "Bases de conocimiento del proyecto"
  },
  {
    "name": "launch-video",
    "description": "Make a 30-45 second product launch video in code with Claude Code, the kind SaaS companies post on launch day. One sentence split across scenes, real product screens with slow camera moves, a typed prompt, a proof beat and a clear call to action. Use when someone says launch video, promo video for my product, announce my course/cohort/offer, make a launch reel or trailer for my product.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "learn-codebase",
    "description": "Prime a codebase by reading every source file in full. Use when starting work on a new or unfamiliar project, or when the user asks to learn the codebase, read the codebase, prime, or get up to speed.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Lectura completa del codebase al iniciar"
  },
  {
    "name": "loop-cover",
    "description": "Turn a newsletter or blog cover into a seamless looping GIF at 896 x 640, 180 frames at 20fps. Only the one element you name moves, the loop is rotated so frame 1 shows the finished picture, and the seam is measured, not eyeballed. Use when someone says animated cover, make my cover move, looping GIF cover, newsletter cover GIF, animate my thumbnail or wants a cover that moves in the inbox without looking busy.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "make-plan",
    "description": "Create a detailed, phased implementation plan with documentation discovery. Use when asked to plan a feature, task, or multi-step implementation — especially before executing with do.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Plan de 5 fases del proyecto"
  },
  {
    "name": "mcp-builder",
    "description": "Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).",
    "category": "tooling",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "mem-search",
    "description": "Search claude-mem persistent cross-session memory through enforced progressive disclosure. Use for previous decisions, solutions, work history, and before saving your own durable notes.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": "Memoria persistente entre proyectos"
  },
  {
    "name": "milestone-reveal",
    "description": "Make a 12-second looping milestone clip in code with Claude Code. Thousands of tiny points drift like a night sky, pull together into your real number (followers, subscribers, revenue, customers), a line draws underneath and the label settles in. Premium, not a party. Use when someone says milestone video, celebrate 10k followers, animate my subscriber count, number reveal, particle number animation or wants to mark a result on LinkedIn or Instagram.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "minimalist-ui",
    "description": "Classic style skill, opt-in: it runs only when called by name. Editorial product UI with a warm monochrome palette, typographic contrast and flat bento grids.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "mobile-native",
    "description": "Make a web app feel native on a phone — the small CSS and meta-tag fixes that separate a website in a browser from something that feels installed. Covers sticky hover states, tap highlight flashes, the 100vh bug, inputs that zoom the page, laggy taps, pull-to-refresh hijacking scroll, content under the notch, long-press selecting button text, carousels that scroll the wrong way, mismatched status bars, and the rule that you test on real hardware. Use when a web app is being built for or reviewed on mobile, when something works in Chrome but feels wrong on my phone, when building a PWA, a bottom sheet, a carousel, a full-screen layout, or any touch interaction. For motion itself use animate; for React Native use animate-expo.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "mode-creator",
    "description": "Interactively create, install, activate, and verify custom claude-mem modes, including domain-specific observation types, concept tags, optional Telegram alerts, bot setup, worker restart, and startup-context verification. Use this whenever someone asks to customize what claude-mem remembers, create or change a mode, track domain-specific notes, add observation types or tags, or send Telegram notifications for particular memories—even if they do not use the word mode.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "model-showdown",
    "description": "Give the same motion brief to three AI models, keep each first try, render all three the same way and stack them into one comparison video with model names and logos. Makes a 16:9 side-by-side for a newsletter and a 1080 x 1920 stacked reel for Instagram and TikTok. Use when someone says compare three models, same prompt three AIs, model showdown, which AI is the best motion designer, side by side comparison video or wants a fair head-to-head of AI outputs.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "motion-brief-writer",
    "description": "Turns a rough idea for an animated graphic into a precise build brief for Claude Code, in your own brand. Asks for anything essential first (exact numbers, size, length, brand), keeps real results apart from sample data, and never invents a figure. Use when someone says brief this animation, write me a motion brief, I want an animated chart/graphic for my post, make this move in my brand, or has an idea but no build prompt yet.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "motion-effects",
    "description": "Build any of 16 premium motion effects from scratch in your own brand, as one 8-second looping HTML file with window.seek(seconds) so it exports frame-exact to MP4 or GIF. Interfaces (button to player, search to results, card to workspace, tabs to panels), data (chart morph, dashboard zoom, spring stack, magnetic dock), type (masked type, elastic type, text to layout, image reveal) and systems (perspective shift, glass focus, flowing paths, particle logo). Use when someone says build the chart morph, make a button that turns into a video player, animate my logo with particles, motion effect, UI animation, product animation, animated dashboard, kinetic type or names any of the 16 effects.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": "Efectos de movimiento premium del reproductor 3D"
  },
  {
    "name": "motion-prompt-writer",
    "description": "Write a complete 8-part Claude Motion prompt (The bar, Format, The one rule, Look, Motion, Never, Before you finish, The scene) for one short looping motion graphic, in your own brand. Takes your brand (a website screenshot, a logo, hex codes, or nothing for the Apple-style default) and one moment you want to show, in plain words. Use when someone says write me a Motion prompt, turn this idea into a motion graphic, fill in the 8 parts or make my motion brief. Outputs parts 1 to 7 as a reusable brief and part 8 as the scene, in one paste-ready code block.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "newsletter-promo",
    "description": "Turn a newsletter edition into a 12-20 second promo clip for LinkedIn, Instagram or X that drives people to read and subscribe. Hook question, three proof frames from the edition, then the newsletter name and where to read it. Use when someone says promo for my newsletter, trailer for this edition, get people to my Substack, teaser video or promote this issue.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "oh-my-issues",
    "description": "Cluster a GitHub issue backlog by root cause into a small set of plan-master issues, redirect children with a standardized comment, and bundle architectural-fix PRs that close clusters atomically. Use when an issue tracker has accumulated dozens of reports that share underlying defects, when asked to triage / consolidate / cluster / dedupe issues, when asked to build a plan series or roadmap from open issues, or when routing a new incoming bug into an existing plan.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "pathfinder",
    "description": "Map a codebase into feature-grouped flowcharts, identify duplicated concerns across features, and propose a unified architecture. Use when asked to find the ideal path, unify duplicated systems, or audit architecture before a refactor. Emits a proposed unified flowchart plus per-system /make-plan prompts.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Auditoría de arquitectura y flujos"
  },
  {
    "name": "payment-advisor",
    "description": "Recommends the single best payment provider for the users project after a short interactive wizard, then hands off to the implementer. Runs a deterministic local ranking engine instead of scoring by hand, so the same situation always yields the same answer and every rejection has an exact reason. Computes real fees on a concrete transaction, always states whether PagoKit can actually BUILD the integration or only advise on it, discloses when the data was last verified, and refuses sanctioned markets outright. Bilingual ES/EN/PT, language inferred from the users first prompt.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "payment-migrator",
    "description": "Plans and executes a migration from one payment provider to another without downtime. Establishes what cannot move (stored card tokens usually cannot), maps the two providers event vocabularies, flags architectural differences such as a change of notification model or a move to a merchant of record, and sequences a coexistence period rather than an atomic switch. Powers /pagokit/migrate.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "pdf",
    "description": "Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill.",
    "category": "documents",
    "source": "Agents",
    "usedInProject": "Generación de proformas en PDF"
  },
  {
    "name": "pick-ui-library",
    "description": "Pick the right library for a given frontend task from a curated, opinionated list — numbers, OTP inputs, charts, command menus, virtualization, drag and drop, toasts, state, styling, and more. Only runs when explicitly invoked; it does not trigger on its own.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "playwright-cli",
    "description": "Automate browser interactions, test web pages and work with Playwright tests.",
    "category": "review",
    "source": "Agents",
    "usedInProject": "Automatización del navegador para QA"
  },
  {
    "name": "pptx",
    "description": "Use this skill any time a .pptx or .potx file is involved in any way — as input, output, or both. This includes: creating slide decks, pitch decks, or presentations; reading, parsing, or extracting text from any .pptx or .potx file (even if the extracted content will be used elsewhere, like in an email or summary); editing, modifying, or updating existing presentations; combining or splitting slide files; working with templates (.potx), layouts, speaker notes, or comments. Trigger whenever the user mentions \\deck,\\ \\slides,\\ \\presentation,\\ or references a .pptx or .potx filename, regardless of what they plan to do with the content afterward. If a .pptx or .potx file needs to be opened, created, or touched, use this skill.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "project-analyzer",
    "description": "Detects a projects technology stack, framework, deploy target, ORM, primary language, and active payment use cases by reading package.json/pyproject.toml/composer.json/Gemfile, schema files, route files, and deploy configs. Use this skill at the start of any PagoKit flow to ground recommendations in the real project context. Emits a structured detection result for payment-advisor and integration-specialist to consume.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": "Detección de stack para integraciones"
  },
  {
    "name": "prototype",
    "description": "Build multiple genuinely different versions of a UI piece you describe, rendered behind a visual picker so you can flip through them live and promote the one that feels right. Only runs when explicitly invoked; it does not trigger on its own.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "reel-export",
    "description": "Turn any horizontal or square motion video into a 1080 x 1920 Instagram Reel or TikTok that uploads cleanly. Headline and logos inside the safe zone, H.264, yuv420p, limited colour range, bt709, a silent audio track when there is no sound, and an ffprobe check before upload. Use when someone says make this a reel, vertical version, export for Instagram, TikTok version, 9:16 cut, reel export or has a 16:9 or 4:5 video that needs to go on a vertical feed.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "reference-to-motion",
    "description": "Turn references you admire into a scene-by-scene Claude Motion prompt for your own topic and brand. Takes a video for the moves (screenshots, frames or a contact sheet of a reel or ad) and, optionally, a look reference for the style (a website, a brand, a moodboard). Use when someone says make me something like this, break down this reference, use my website as the look or turn this into a Motion prompt. Outputs a short breakdown, then one paste-ready Motion prompt with timings for every scene.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "review-animations",
    "description": "Reviews animation and motion code against a high craft bar derived from Emil Kowalskis design engineering philosophy. Default to flagging; approval is earned.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": "Critica de animaciones existentes"
  },
  {
    "name": "scroll-world",
    "description": ">",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "slack-gif-creator",
    "description": "Knowledge and utilities for creating animated GIFs optimized for Slack. Provides constraints, validation tools, and animation concepts. Use when users request animated GIFs for Slack like make me a GIF of X doing Y for Slack.",
    "category": "art",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "slides",
    "description": "Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "DECK de presentación comercial"
  },
  {
    "name": "smart-explore",
    "description": "Token-optimized structural code search using tree-sitter AST parsing. Use instead of reading full files when you need to understand code structure, find functions, or explore a codebase efficiently.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Búsqueda estructural en el código"
  },
  {
    "name": "standup",
    "description": "Facilitate a read-only standup across git worktrees, branches, or PRs to compare changes and produce one consolidation plan.",
    "category": "architecture",
    "source": "OpenCode",
    "usedInProject": "Consolidación de trabajo entre sesiones"
  },
  {
    "name": "stitch-design-taste",
    "description": "Classic skill for Google Stitch, opt-in: it runs only when called by name. Writes an agent-friendly DESIGN.md with strict type, colour and layout rules.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "subscription-lifecycle",
    "description": "Covers everything after the subscription is created — trials, proration on upgrade and downgrade, dunning and retry schedules, grace periods, involuntary churn from expired cards, cancellation timing, and the bank-mandate lifecycle for SEPA, Bacs, PAD, UPI AutoPay and Pix Automatico. Also covers the stored-credential framework and the network transaction id that recurring charges must carry. This is the part every payment tutorial stops short of, and where production subscriptions actually break.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "tax-advisor",
    "description": "Explains what a merchant owes the tax authority once a payment succeeds, and whether a merchant of record removes that obligation. Covers the merchant-of-record trade-off, e-invoicing mandates (CFDI, NF-e, DTE, SUNAT, DIAN, SRI, SdI, KSeF, ZATCA), EU VAT OSS, US economic nexus with home-rule jurisdictions, and when a tax engine is genuinely required. Reads the obligation from the catalog rather than recalling it. Never gives legal advice — it names the obligation and points at who can discharge it.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "theme-factory",
    "description": "Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.",
    "category": "design",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "timeline-report",
    "description": "Generate a Journey Into [Project] narrative report analyzing a projects entire development history from claude-mems timeline. Use when asked for a timeline report, project history analysis, development journey, or full project report.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": "Historial de desarrollo del proyecto"
  },
  {
    "name": "title-sequence-3d",
    "description": "Make a cinematic 3D title sequence (8-15 seconds) in code with Claude Code and Three.js. A camera moves through a lit scene, such as a rainy street at night with brand names as neon signs, then a big question or title lands. Use when someone wants a scroll-stopping opener, a film-style intro, 3D intro, cinematic opening, title sequence or a hook for a video, reel or newsletter.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "ui-styling",
    "description": "Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user interfaces, implementing design systems, creating responsive layouts, adding accessible components (dialogs, dropdowns, forms, tables), customizing themes and colors, implementing dark mode, generating visual designs and posters, or establishing consistent styling patterns across applications.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Componentes shadcn/ui del design system"
  },
  {
    "name": "ui-ux-pro-max",
    "description": "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local data: 79 searchable styles (50 active), 192 product palettes and reasoning profiles, 74 font pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Biblioteca de estilos y paletas"
  },
  {
    "name": "vercel-composition-patterns",
    "description": "React composition patterns that scale. Use when refactoring components with",
    "category": "general",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "vercel-react-best-practices",
    "description": "React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.",
    "category": "general",
    "source": "Agents",
    "usedInProject": "Optimización y patrones de rendimiento en React/Next"
  },
  {
    "name": "vercel-react-native-skills",
    "description": "React Native and Expo best practices for building performant mobile apps. Use",
    "category": "general",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "version-bump",
    "description": "Automated semantic versioning and release workflow for Claude Code plugins. Handles version increments across package.json, marketplace.json, plugin.json manifests, build verification, git tagging, GitHub releases, and changelog generation. Ends with the agent running npm publish itself using the maintainers npm token.",
    "category": "workflow",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "vox-explainer",
    "description": "Make a short Vox-style documentary explainer (30-60 seconds) entirely in code with Claude Code. Torn paper, halftone texture, bold condensed type, motion on twos. Use when someone says make a Vox-style video, explainer video about..., why does X happen, or wants a documentary-style motion graphic for LinkedIn, Instagram or YouTube without After Effects or a video generator.",
    "category": "motion",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "web-artifacts-builder",
    "description": "Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.",
    "category": "general",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "web-design-guidelines",
    "description": "Review UI code for Web Interface Guidelines compliance. Use when asked to review my UI, check accessibility, audit design, review UX, or check my site against best practices.",
    "category": "review",
    "source": "Agents",
    "usedInProject": "Auditoría de UI y accesibilidad"
  },
  {
    "name": "webapp-testing",
    "description": "Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.",
    "category": "review",
    "source": "Agents",
    "usedInProject": "Pruebas de las rutas con Playwright"
  },
  {
    "name": "webhook-verifier",
    "description": "Reads the GENERATED signatures.md rather than recalling schemes from memory. Reference for cryptographic verification of payment webhooks. Cited by integration-specialist whenever it generates a webhook handler. Documents per-provider signature algorithms, timestamp tolerances, replay-protection strategies, raw-body capture per stack, and the minimum set of events each handler must route. Always use this skill (instead of recalling from training data) — webhook verification is where the integration goes silently wrong.",
    "category": "commerce",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "weekly-digests",
    "description": "Generate a serial week-by-week narrative digest of a projects full claude-mem timeline. Splits the timeline into per-ISO-week files, then runs one consecutive subagent per week — each receiving the prior weeks carry-forward block — to produce one chapter per ISO week of data. Use when asked for weekly digests, week-by-week story, serial timeline, or narrative chapters of a projects history.",
    "category": "memory",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "what-the",
    "description": "What the? Use when the user wants a plain-English breakdown of something technical — the who, what, where, why, and when.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "wowerpoint",
    "description": "Turn one document into a kawaii NotebookLM slide-deck PDF. Use for wowerpoint this, make a deck about <file>, turn this report into slides, or any request to render a single document as shareable narrative slides.",
    "category": "design",
    "source": "OpenCode",
    "usedInProject": "Presentación del proyecto"
  },
  {
    "name": "write-swift",
    "description": "How to write modern Swift well — modeling with value types, Swift 6 data-race safety and approachable concurrency (@concurrent, main-actor-by-default, actors, task groups), protocols and generics (some vs any), API design, performance and ARC, Swift Testing, macros, and the modern language features agents dont know about yet. Use when writing, reviewing, or migrating Swift, or when a concurrency error, a hang, a data race, a retain cycle, or a performance problem needs fixing.",
    "category": "general",
    "source": "OpenCode",
    "usedInProject": null
  },
  {
    "name": "writing-guidelines",
    "description": "Review docs/prose for Writing Guidelines compliance. Use when asked to review my docs, check writing style, audit prose, review docs voice and tone, or check this page against the writing handbook.",
    "category": "review",
    "source": "Agents",
    "usedInProject": null
  },
  {
    "name": "xlsx",
    "description": "Use this skill any time a spreadsheet file is the primary input or output. This means any task where the user wants to: open, read, edit, or fix an existing .xlsx, .xlsm, .xltx, .csv, or .tsv file (e.g., adding columns, computing formulas, formatting, charting, cleaning messy data); create a new spreadsheet from scratch or from other data sources; or convert between tabular file formats. Trigger especially when the user references a spreadsheet file by name or path — even casually (like \\the xlsx in my downloads\\) — and wants something done to it or produced from it. Also trigger for cleaning or restructuring messy tabular data files (malformed rows, misplaced headers, junk data) into proper spreadsheets. The deliverable must be a spreadsheet file. Do NOT trigger when the primary deliverable is a Word document, HTML report, standalone Python script, database pipeline, or Google Sheets API integration, even if tabular data is involved.",
    "category": "documents",
    "source": "Agents",
    "usedInProject": null
  }
]

export const SKILL_CATEGORIES = ["architecture","art","commerce","design","documents","general","memory","motion","review","tooling","workflow"]
