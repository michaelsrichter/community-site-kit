# Community Site Kit

Copilot CLI skills, custom agents and scripts for rebuilding a volunteer **dance or community
organization's website**: audit the old site, migrate real content, build a fast accessible Astro site
with Decap CMS, add community events, a map, photos and analytics, deploy to Azure Static Web Apps,
connect a custom domain and hand off to editors.

It packages everything learned while rebuilding the
[Swing Dance Long Island website](https://github.com/michaelsrichter/sdli-website): one 900-line brief
plus 27 follow-up requests. The next project gets all of them **on day one**.

Pair it with the template repo
[`michaelsrichter/community-site-starter`](https://github.com/michaelsrichter/community-site-starter),
a working, tested site with sample content that you rebrand in about an hour.

## Install

```powershell
copilot plugin marketplace add michaelsrichter/community-site-kit
copilot plugin install community-site-kit@community-site-kit
copilot plugin list            # community-site-kit should be listed
```

Update later with `copilot plugin update community-site-kit`. (A direct
`copilot plugin install michaelsrichter/community-site-kit` also works today, but Copilot is phasing out
direct installs.)

In the skills, `<kit>` means the folder the plugin is installed in — usually
`~/.copilot/installed-plugins/community-site-kit/community-site-kit` (check with
`copilot plugin list --json`) — or a clone of this repo.

## Start a new project

In Copilot CLI, in an empty folder:

```text
@community-site-modernizer Modernize the website for <Org name> (<old site URL>). Repo on my personal
GitHub account, public. Photos are in <folder>. Email me at <address> when things are live.
```

Or fill in `skills/modernize-community-site/references/project-brief-template.md` and paste it as the
first message. The agent runs the intake questions, starts from the template, and works through the
phases with the specialist skills and agents below.

## What's inside

### Skills (`skills/`)

| Skill | Use it for |
| --- | --- |
| `modernize-community-site` | The playbook: intake, phases, requirement baseline, project brief template, lessons learned, owner handoff emails, Windows notes |
| `legacy-site-audit` | Crawl the old site, inventory content, draft redirects, screenshots, migration docs |
| `community-event-sourcing` | Other organizers' events from PDF calendars, Facebook groups, calendar widgets; organizer directory; teacher and band links |
| `event-listing-ux` | Home organization first, human dates, next 3 + "Show more", list/calendar/map/past, filters, calendar/share/directions |
| `venue-map-geocoding` | Free geocoding (Census → Nominatim), coordinates in the CMS, Leaflet map, "near me" |
| `photo-and-video-curation` | Photo rights, picking dancing photos, resizing, focus points, short videos, slideshow |
| `decap-cms-github-oauth` | Decap CMS on Azure, GitHub OAuth App, editors, config pitfalls, editor guide |
| `site-analytics-otel` | GA4 + Clarity with consent, OpenTelemetry custom events and metrics to Azure Monitor |
| `azure-swa-deploy-and-domain` | Provisioning, app settings, security headers, smoke tests, custom domain DNS records |
| `site-quality-gates` | Tests, accessibility, 320 px, header fit, light/dark × phone/desktop screenshots |
| `site-ux-patterns` | Light/dark switch people can find, header social button, no banners, plain language |

### Agents (`agents/`)

| Agent | Role |
| --- | --- |
| `community-site-modernizer` | Leads the whole project and delegates |
| `legacy-site-auditor` | Crawls and documents the old site; redirect map |
| `community-event-researcher` | Finds community events, organizers, performer links, venue facts (with sources) |
| `visual-qa-reviewer` | Screenshots + layout checks before every publish |
| `plain-language-editor` | Rewrites copy for an average high-school reader without changing facts |

### Scripts

Run them from the site repo folder (they use its `sharp`, `playwright` and `yaml` packages). Find the
installed kit folder with `copilot plugin list --json`.

| Script | What it does |
| --- | --- |
| `legacy-site-audit/scripts/crawl-site.mjs` | Polite same-site crawler → `crawl.json`, raw HTML, `summary.md` |
| `legacy-site-audit/scripts/redirect-draft.mjs` | Old URLs → new paths from ordered regex rules, plus a review list |
| `legacy-site-audit/scripts/screenshot-pages.mjs` | Phone + desktop screenshots of a list of pages |
| `community-event-sourcing/scripts/parse-pdf-calendar.py` | Monthly dance-calendar PDFs → dated listings |
| `venue-map-geocoding/scripts/geocode-venues.mjs` | Fill venue latitude/longitude (Census, then Nominatim) |
| `photo-and-video-curation/scripts/contact-sheet.mjs` | Numbered thumbnail grid for picking photos |
| `photo-and-video-curation/scripts/prepare-photos.mjs` | Rotate, strip EXIF/GPS, resize (no upscaling), compress |
| `photo-and-video-curation/scripts/prepare-video.mjs` | Short, silent, small H.264 clip + poster |
| `photo-and-video-curation/scripts/find-cc-photos.mjs` | Openly licensed Wikimedia Commons photos with credits |
| `site-quality-gates/scripts/visual-check.mjs` | Light/dark × phone/desktop screenshots, 320 px overflow, header wrap, broken/upscaled images, console errors |
| `site-quality-gates/scripts/normalize-lockfile.mjs` | Rewrites private npm mirror URLs in lockfiles to registry.npmjs.org (`--check` for CI) |

## Where each original request went

| Request on the first project | Now covered by |
| --- | --- |
| The 900-line brief (audit, Astro + Decap + Azure SWA, accessibility, SEO, tests, docs, deploy) | `project-brief-template.md`, `requirements-baseline.md`, starter template |
| Repo on my personal GitHub account, public | Intake questionnaire; `decap-cms-github-oauth` (EMU limits) |
| GA4 + Clarity + OpenTelemetry/Azure Monitor custom events | `site-analytics-otel` |
| Email/Teams me the URL and details when deployed | `owner-handoff.md`; every agent's finish step |
| Add to calendar, share, directions, copy; next event on homepage; photos of people dancing; no dead links; mobile first | `event-listing-ux`, `site-quality-gates`, `photo-and-video-curation` |
| Old URLs must keep working + a document explaining the migration | `legacy-site-audit`, `legacy-site-auditor` |
| Venue facts from Google Maps (parking, reviews) | `community-event-sourcing/references/source-types.md` |
| Community events from regional calendars and the Facebook group; badges; style tags; archive backfill | `community-event-sourcing`, `community-event-researcher` |
| Set up the GitHub OAuth app for the CMS | `decap-cms-github-oauth` |
| Next home event first; "Tonight!", "in 4 days!" | `event-listing-ux` |
| My work account can't access the repo | `decap-cms-github-oauth` (EMU section), lessons learned |
| Link teachers' and bands' websites and socials; import a teacher's calendar | `community-event-sourcing` step 6 |
| "Frequently Asked Questions" instead of "Questions and answers" | `site-ux-patterns`, `plain-language-editor` |
| Photos cut off / weird crops; more photos from Google reviews | `photo-and-video-curation` (focus points, rights) |
| Custom domain + what to put in Namecheap / Azure | `azure-swa-deploy-and-domain` |
| Map view with geocoded venues stored in the CMS | `venue-map-geocoding` |
| Facebook group link; remove banner; carousel of dancing photos; prioritize new photos and videos | `site-ux-patterns`, `photo-and-video-curation` |
| Only the next 3 home events, with "show more" | `event-listing-ux` §3 |
| Light/dark switch people can find | `site-ux-patterns` |
| (Standing preferences) plain language for a high-school reader; verify visually before publishing | `plain-language.md`, `site-quality-gates`, `visual-qa-reviewer` |

## Contributing

Each skill is a folder with `SKILL.md` (front matter `name` + `description`) and optional `scripts/` and
`references/`. Agents are `agents/<name>.agent.md`. Keep instructions generic (no organization-specific
secrets or IDs), test scripts against a real project, and bump `version` in `plugin.json`.

MIT licensed.
