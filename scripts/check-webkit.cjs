// A second-engine smoke test; this is not a substitute for testing on an actual iPhone.
const { webkit } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const projects = require("../content/projects.json");
const base = process.env.SITE_URL || "http://127.0.0.1:8766";
const pages = ["", "about/", "projects/", "experiences/", "resume/", "contact/", "404.html", ...projects.map(p => `projects/${p.slug}/`)];
(async () => {
  const browser = await webkit.launch();
  try {
    const page = await browser.newPage({ colorScheme: "light" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const file of pages) {
        await page.goto(`${base}/${file}`, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => Boolean(window.SitePreferences));
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `WebKit overflow: ${width} ${file}`,
        );
      }
      console.log(`PASS WebKit: ${pages.length} pages at ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/projects/`);
    await page.locator(".menu-toggle").click();
    assert(await page.locator("#primary-navigation").isVisible());
    await page.keyboard.press("Escape");
    assert(!(await page.locator("#primary-navigation").isVisible()));
    await page.locator(".appearance summary").click();
    await page.locator('[data-theme-choice="dark"]').click();
    await page.locator('button[data-color="color-6"]').click();
    await page.keyboard.press("Escape");
    await page.locator('[data-filter="Research"]').click();
    assert.equal(await page.locator(".project-card:visible").count(), projects.filter(p => p.category === "Research").length);
    assert.equal(await page.locator("#project-search").count(), 0);

    await page.reload();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.equal(
      await page.locator("html").getAttribute("data-color"),
      "color-6",
    );
    assert.equal(
      await page.locator("#projects-grid").getAttribute("data-view"),
      "list",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS WebKit: navigation, appearance, filtering, and persistence",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
