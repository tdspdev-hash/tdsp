# TDSP Farmers Value Chain: web application

Lives in the project root (`/Users/ecky/Desktop/tdsp`), alongside `docs/`.

Technical foundation (Milestone 1). Read `CLAUDE.md` and `docs/markdown-files/README.md` first. They define the scope, security and language rules.

## Status

| Area | State |
|---|---|
| Next.js App Router, TypeScript, CSS Modules | Implemented, builds |
| Kiswahili (default) / English with persistent switcher | Implemented, tested |
| Mobile-first shared layout and navigation | Implemented, tested on 4 viewports |
| Zod + React Hook Form | Implemented (contact form example, not connected to a backend) |
| Supabase client/server/session helpers | **Code only.** No Supabase project exists yet; nothing is provisioned |
| Registration, login, forgot-password **screens** | Built and tested as UI (validation, both languages, mobile/desktop). The Supabase calls in `lib/auth/client.ts` are **not tested** against a live project |
| Payment instructions, receipt upload, status screen, member dashboard, admin screens, approval workflow, database tables, RLS | **Not started.** Blocked on connecting the live Supabase project and approving the migration |
| Vercel project, domain, deployment | **Not done.** `vercel.json` only; nothing linked or deployed |
| Playwright | 7 viewport projects (360, 390, 412, 768, 1024, 1280, 1440); smoke, language, responsive, form, auth-screen and homepage tests |

Public pages: Home, About, Services, Contact, Join (registration), Login, Forgot password. Home shows a "how to join" section and states no fee amount (the fee is not approved).

## Stack and versions

next 16.4.6, react 19.3.0, typescript 5, @supabase/supabase-js 2.119.0, @supabase/ssr 0.12.7, zod 4.6.7, react-hook-form 7.92.0, @hookform/resolvers 7.0.7, @playwright/test 1.65.1. Node >= 20.9 (developed on 25.2.1).

## Commands

```bash
npm install
npm run dev          # local development
npm run typecheck    # tsc --noEmit
npm run lint
npm run build
npm test             # builds, serves on :3100, runs Playwright on 4 viewports
```

First Playwright run on a machine: `npx playwright install chromium`.

## Structure

```
proxy.ts                     language redirect + cookie, Supabase session refresh
app/[lang]/                  routes under /sw and /en
components/                  SiteHeader, SiteFooter, ContactForm, ComingSoon, ui.module.css
lib/i18n/                    config, dictionaries (sw.ts defines the shape, en.ts must match)
lib/supabase/                env, client (browser), server, session (proxy)
lib/validation/              Zod schemas built from the active language's messages
supabase/migrations/         migrations go here (none yet)
tests/                       Playwright specs
```

## Language

- URLs are `/sw/...` and `/en/...`. A path with no language redirects to the remembered language, else Kiswahili.
- The choice is saved when the user clicks the switcher, and on a direct page load. It is deliberately **not** saved on background prefetches, which would flip it silently.
- Add text by adding the key to `lib/i18n/dictionaries/sw.ts` first; TypeScript then requires it in `en.ts`.
- Texts are drafts. Wording taken verbatim from TDSP documents (Financial Linkage statement, registration number, contact details) is marked in comments. TDSP must review all text before launch.

## Environment variables

See `.env.example`. Names only; never commit values.

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser + server | Public key. `NEXT_PUBLIC_SUPABASE_ANON_KEY` also accepted |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Not used yet. Never in browser code, never `NEXT_PUBLIC_` |

Without these variables the site still runs; Supabase helpers are skipped or throw a clear error.

## Required configuration that does not exist yet

1. A TDSP-owned Supabase project, and the variables above in `.env.local` and in Vercel.
2. A TDSP-owned domain and Vercel project (Vercel root directory = repository root). Check Vercel plan terms and cost with TDSP first (see `CLAUDE.md`).
3. Auth settings in Supabase (site URL, redirect URLs, email confirmation policy).

## Design decisions

- **Cache Components off** (`next.config.ts`): the scaffold enabled it, but it kept previous routes alive in hidden DOM, duplicating the header and element ids when switching language.
- **Auth is not authorisation.** In Milestone 2 a valid login must not grant member access; membership status is checked on the server and enforced by RLS. See the table in `CLAUDE.md` and `docs/markdown-files/`.
- **One database.** Supabase is the intended system of record; the Supabase vs Google Sheets decision is still pending with TDSP.

## Homepage (desktop + mobile)

One responsive homepage built from the two design mockups in `docs/screens/1-Karibu TDSP/`. From 900px: dark contact strip, header navigation, wide hero, six service cards in a row (from 1200px). Below 900px: compact app bar, two-column service cards, membership banner and a **fixed five-item bottom navigation** (Karibu, Huduma, Fursa, Habari, Akaunti, Lucide icons, safe-area aware). Screenshots of the implementation: `docs/screens/implementation/`.

Content that comes from TDSP, not from the mockups, is controlled in `lib/site-config.ts`. These stay hidden until real values exist:

| Mockup element | Why it is not shown yet | Switch |
|---|---|---|
| Statistics figures (10,000+, 350+, 25+, 9) | Not confirmed by TDSP | `siteConfig.stats` |
| "Tazama Video" button | No video exists | `siteConfig.videoUrl` |
| Social icons | No verified page URLs | `siteConfig.social` |
| Search icon, notification bell | No search or notifications feature yet (would be fake controls) | build the feature first |

Other deliberate differences from the mockups: the organisation name shown is TDSP's real name, not "Tanzania Development Support Programme"; the contact email is `tdsphq@gmail.com` (the mockup's `info@tdsp.or.tz` appears nowhere in TDSP's documents). The hero photo is an interim crop from the mockup and must be replaced with approved TDSP photography. The English bottom-bar tab for Fursa is "Explore" because the word "Opportunities" (about 76px at 11px) is wider than a phone tab (68px at 360px wide); the page itself is still titled "Opportunities". `/opportunities` and `/news` are honest "coming soon" pages so the bottom bar never leads to a 404.

Header tiers (from measured content widths; `tests/header-widths.spec.ts` sweeps 13 widths): below 900px compact app bar + fixed bottom bar; 900-1199px two-row header (brand and actions, then a roomy navigation row); 1200px+ one row with the compact name "TDSP Farmers Value Chain"; 1360px+ the full organisation name; 1440px+ the tagline (dropped first when space is tight). The bottom bar is kept on tablets up to 899px on purpose: it is 64px tall (about 6% of a 1024px-high screen), the page reserves that space so no content is covered, and one navigation pattern is used for every touch-sized screen.

## "Kuhusu TDSP" page: content decisions

Built from `docs/screens/2- Kuhusu TDSP/` (desktop and phone mockups). The mockups' wording is design copy and was NOT all published, because the brief requires official TDSP content:

| Element | What is shown | Why |
|---|---|---|
| Vision / mission ("Dira / Dhamira") | TDSP Constitution wording, **verbatim, in English** on both language versions, with a source note | Only official text that exists. No approved Kiswahili translation. The mockup's Kiswahili text is not from TDSP. See `lib/about-content.ts`. |
| Values ("Maadili Yetu") | **Hidden** | No official values exist in any TDSP document. The mockup's five values are invented. Add approved values to `approvedValues` in `lib/about-content.ts` and the card appears. |
| Objectives ("Malengo Yetu") | The **nine** objectives in Waraka No. 2, verbatim, labelled as the platform's objectives | TDSP has not supplied an organisational objectives list; the mockup's six labels are not official. Replace when TDSP supplies one. |
| "TDSP ni Nani?" paragraph | Written from TDSP's own documents (registered development organisation; coordinator, facilitator, follow-up actor) | The mockup paragraph is not in any TDSP document. |
| Hero description | "**Shirika** linalowezesha..." | The brief and mockup say "Mashirika linalowezesha" (plural noun, singular verb). Corrected; TDSP to confirm. |
| Four focus-area labels | As in the brief | Theme labels, not statements of fact; TDSP to review. |
| Photos | Hero field and farmer photo are crops from the mockups | Placeholders (AI-generated; not TDSP people). Replace with approved photography. |

The page has its own tests (`tests/about.spec.ts`) that fail if the vision or mission wording changes or if unapproved values appear.

## Uanachama page

`/sw/uanachama` and `/en/membership` (one shared component; slugs in `lib/i18n/config.ts`). Buttons lead to the existing registration (`/join`) and sign-in (`/login`) screens, which are UI only until Supabase is connected. Categories and requirements are unapproved content and carry a visible note; see `docs/markdown-files/15-content-approvals-needed.md` section F.

## Testing rule

Playwright starts the app with Supabase variables forced empty, and the screen tests assert that no request goes to Supabase. UI tests therefore never create real accounts. Tests against the live project are a separate step that needs explicit approval.

## Known limitations

- Playwright runs Chromium only. Real iOS Safari/WebKit is not covered; check on a device.
- `npm audit` reports high-severity findings in the ESLint/typescript-eslint dependency chain (dev tooling, not shipped). Not force-fixed because the suggested fix downgrades `eslint-config-next`.
- Contact form validates but sends nothing.
- Not yet tested: authentication, role-specific navigation, access control (nothing to test until Milestone 2).

## Member portal

`/[lang]/member/*` is for signed-in users with an ACTIVE membership only (checked on the server in every page). It depends on migration `0002_membership`, which is prepared and NOT applied, so no real account can open it yet.

Tests with a local stand-in for Supabase (synthetic data; Row Level Security is not tested):

```bash
npx playwright test -c playwright.member.config.ts
```

