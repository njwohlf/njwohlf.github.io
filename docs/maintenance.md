# Maintaining the portfolio

The deployed site is static HTML, CSS, images, and small JavaScript enhancements.
There are no production npm dependencies, client-side framework, analytics scripts,
external fonts, or browser-side template requests.

## Local development

Requirements: Python 3.9+ for the build; Node 18+ for browser tests.

```sh
python3 scripts/build.py
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/`. All generated HTML is kept in the repository, so the
hosting service does not need Python or Node. Run the build before publishing
content/template changes. CSS and JavaScript changes can be previewed directly.

## Where to make changes

| Location                                       | Purpose                                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------------------- |
| `content/pages/`                               | Authored page content, including the home, about, contact, and resume pages             |
| `content/projects.json`                        | Project summaries, technologies, and short overviews                                    |
| `content/experience.json`                      | Role titles, organizations, dates, and descriptions                                     |
| `templates/page.html`                          | Shared document metadata and page shell                                                 |
| `partials/navbar.html`, `partials/footer.html` | Shared navigation, appearance controls, and footer                                      |
| `scripts/build.py`                             | Renders templates, project pages, experience, sitemap, and robots.txt                   |
| `css/styles.css`                               | All design tokens, themes, components, responsive rules, and print styles               |
| `js/theme-init.js`                             | Applies validated preferences before content paints; safely handles unavailable storage |
| `js/script.js`                                 | Mobile navigation, appearance disclosure, and enhanced contact submission               |
| `js/projects-page.js`                          | Filters the existing project cards; toggles the layout                                  |
| `assets/resume.pdf`                            | Original resume; replace intentionally when career details change                       |

Root HTML and `projects/*.html` are **generated output**. Edit the sources above,
then run the build. `python3 scripts/build.py --check` reports stale output without
rewriting it. Page-specific titles/descriptions, the public domain, and copyright
year live in `scripts/build.py`; update them when appropriate.

To add a project, use an existing record in `content/projects.json` as a guide.
Keep its slug unique and stable, use one of the three existing categories, and
include a short card summary, an `overview` array of one or two paragraphs,
and topic tags. `featured: true` includes it on the
homepage. All project cards and detail pages are generated from the same record.
Do not add numerical results, collaborators, dates, or links without verifying them.

The old light/dark/skin stylesheets and browser-side partial/catalog loaders were
replaced by design tokens and generated HTML. Existing `selectedTheme`,
`selectedColor`, and `projectsView` preferences are supported; the old paired
color IDs 7 and 8 migrate to color slots 3 and 6.

The ignored `archive/` and `updates/` directories remain historical experiments
and are not inputs to the build. They should not be added to a production deploy.

## Checks

```sh
npm ci
npm run check
npx playwright install chromium
# Keep the local Python server running in a separate terminal.
npm test
```

To use an installed Chrome instead of downloading Chromium:

```sh
CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm test
```

`SITE_URL` overrides the default local server URL. The browser checks cover:

- All generated pages at 320, 390, 768, 1440, and 1920 pixels.
- WCAG-tagged axe checks on mobile/light and desktop/dark layouts, every accent
  palette, open appearance controls, list view, and contact confirmation.
- Keyboard navigation, skip link, Escape, and focus restoration.
- Project categories, grid/list layout, and saved settings.
- System appearance changes, disabled JavaScript, and unavailable local storage.
- Form validation, failure recovery, and success using **mocked** Formspree requests.
- Text-spacing overrides, narrow reflow, reduced motion, and forced colors.
- A 250 KiB homepage resource budget and browser JavaScript errors.

The contrast checker also calculates foreground/background ratios for all 12
palettes, the decorative dot pattern, button labels, and control boundaries.
It checks that printing a dark-themed page uses a white background. Axe can leave
contrast checks incomplete where a panel overlaps text or text sits over a
decorative layer; those are review items, not automatically confirmed violations.

For the optional second-engine smoke test:

```sh
npx playwright install webkit
npm run test:webkit
```

This checks every page at four widths and exercises navigation, appearance,
filters and persistence. The available WebKit build depends on the host
OS; this does not replace testing on an actual iPhone or current Safari release.

Screenshots and the axe report are written to ignored `test-results/`. Review
screenshots manually: an automated pass is not a substitute for visual review or
assistive-technology testing. Tests never send a live contact message.

## Publishing and limitations

Only publish after `npm run check` and `npm test` pass and the generated output is
included. No deployment or remote repository changes are performed by the build.
`CNAME`, canonical URLs, sitemap URLs, and the contact endpoint should agree with
the deployment. `404.html` uses root-relative asset links so it can render at a
missing nested URL; configure a non-GitHub host to serve it with a 404 status.

The resume PDF is retained as supplied. Its tagging, reading order, and the native
PDF viewer are outside the HTML accessibility checks. The experience page provides
an HTML overview, not a full transcript of every PDF detail. Verify PDF accessibility
separately before claiming whole-site WCAG conformance.

Form success/failure UI is tested with mocks. Live delivery, account settings,
spam protection, and Formspree's own pages need an end-to-end check by the owner.
The site contains a factual privacy explanation, not a certification of legal
compliance. Hosting security headers and server logs are controlled by the host.

## Writing voice

Keep the copy personal and specific. Use first person when describing Nick’s work,
ordinary language for introductions, and technical terms where they explain the
project. Prefer “what I worked on” to broad claims about impact or excellence.
Avoid agency-style slogans, invented results, and repeated statements of philosophy.
The project pages can stay precise without sounding like a sales pitch.

Keep page titles and section headings direct. Avoid decorative numbering, repeated subtitles, and copy that narrates how to browse the site. Personal details belong in the content; navigation and labels can speak for themselves.

Appearance offers Light and Dark. Without a saved choice (including the old “system” value), the site follows the device preference. An explicit choice overrides it and persists locally. Public HTML and JavaScript do not contain a personal email address; use the contact form and social profiles. Review contact details in downloadable documents separately.
