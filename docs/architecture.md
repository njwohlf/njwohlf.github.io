# Engineering decisions and interview discussion

## The problem

The portfolio needs to introduce the engineer, make work easy to explore, and
remain usable on small screens and with different input methods. A visitor should
not need a JavaScript application to read a project or find contact information.

## Content before enhancement

A small Python build combines authored HTML, structured project/experience records,
and shared templates. It produces complete, independently addressable pages.
The project collection exists in HTML before any script runs; category filters
change visibility instead of recreating DOM content.

This provides useful no-JavaScript behavior, predictable links, crawlable text,
and a clear separation between content and presentation. The tradeoff is that
source/template edits require a build. Generated output is checked for staleness
so a forgotten build is visible before publication.

## A deliberate visual system

One stylesheet owns the design tokens, components, and breakpoints. A neutral
surface palette, consistent spacing, restrained borders, and a sans/serif pairing
establish hierarchy. Accent colors are adapted for light and dark backgrounds.
They do not carry state alone: controls expose pressed state and visible selection,
and navigation identifies the active page with an underline.

Project pages contain short overviews and topic tags. The existing portrait is
used only as a portrait; unrelated images do not stand in for project documentation.

## Resilient interaction

- Navigation is an ordinary list of links enhanced with a mobile disclosure.
  It is fully available if JavaScript fails or is disabled.
- Appearance uses native `details`/`summary` plus native buttons, with Escape and
  focus restoration. Storage access is guarded, so privacy restrictions do not
  break the page. The initial appearance follows OS preferences until a visitor saves Light or Dark.
- Category filters operate on the same card collection, preserve
  focus, and announce the result count. Grid/list changes are CSS layout changes.
- The contact form retains native validation and a standard POST action. Enhanced
  submission disables duplicate attempts, times out, preserves text on failure,
  and announces the outcome. Requests are mocked in automated tests.

## Accessibility and verification

The implementation targets WCAG 2.2 AA. Semantic structure, keyboard behavior,
reflow, visible focus, contrast, motion preferences, and form labels are explicit
design constraints, not a separate visual theme. Automated axe checks supplement
manual keyboard and screenshot review. They do not prove full conformance;
screen-reader checks, the supplied PDF, and external services require separate
review. See `accessibility.html` and the maintenance guide for the scope.

Reference standards:

- [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [W3C disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [Web Vitals](https://web.dev/articles/vitals)

A local payload budget checks obvious regressions without inventing a production
performance score. Real-world Core Web Vitals require measurement after deployment
with real network/device conditions; local browser tests are not field data.

## Useful next iterations

Add verified repository/demo links and project-specific artifacts when available.
For deeper case studies, record a real constraint, the alternatives considered,
a reproducible test method, and the observed result. Avoid retrofitting metrics
that were not collected. For the resume, create a tagged PDF and a complete HTML
version from a common source when the content is next updated.

Potential interview questions to walk through:

1. Why generate static HTML instead of using a client framework or fetching partials?
2. What still works when scripts, storage, or the form service are unavailable?
3. How do theme colors maintain contrast across backgrounds and interactive states?
4. How does a project content change reach the homepage, index, detail page, and sitemap?
5. Which assertions are automated, and which claims still need human or production testing?
