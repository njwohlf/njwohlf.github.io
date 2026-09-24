/* Browser verification. Start a local server, then run npm test. Never submits a live message. */
const { chromium } = require("playwright");
const axe = require("axe-core");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const projects = require("../content/projects.json");
const base = process.env.SITE_URL || "http://127.0.0.1:8766";
const pages = fs
  .readdirSync(root)
  .filter((name) => name.endsWith(".html"))
  .concat(
    fs
      .readdirSync(path.join(root, "projects"))
      .filter((name) => name.endsWith(".html"))
      .map((name) => `projects/${name}`),
  );
const results = [];
const output = path.join(root, "test-results");
fs.mkdirSync(output, { recursive: true });

async function audit(page, label) {
  await page.evaluate(axe.source);
  const result = await page.evaluate(async () =>
    axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    }),
  );
  results.push({
    label,
    violations: result.violations,
    incomplete: result.incomplete.map((item) => ({
      id: item.id,
      impact: item.impact,
    })),
  });
  assert.deepEqual(
    result.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
    [],
    `Accessibility: ${label}`,
  );
}

async function reflow(page, label) {
  const sizes = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  assert(
    sizes.content <= sizes.viewport + 1,
    `${label}: horizontal overflow (${sizes.content} > ${sizes.viewport})`,
  );
  assert.equal(await page.locator("main").count(), 1);
  assert.equal(await page.locator("h1").count(), 1);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    headless: true,
  });
  try {
    const context = await browser.newContext({
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // Unexpected third-party requests are blocked. Form tests provide local mock responses below.
    await context.route("https://**/*", (route) => route.abort());
    for (const width of [320, 390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const file of pages) {
        await page.goto(`${base}/${file}`, { waitUntil: "load" });
        await reflow(page, `${width} ${file}`);
        if (width === 390) await audit(page, `light / mobile / ${file}`);
        if (width === 1440) {
          await page.evaluate(() => SitePreferences.setTheme("dark"));
          await audit(page, `dark / desktop / ${file}`);
          await page.evaluate(() => SitePreferences.setTheme("light"));
        }
      }
      console.log(`PASS ${pages.length} pages at ${width}px`);
    }

    // Keyboard: skip link, mobile navigation, disclosure, Escape, and focus restoration.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/index.html`);
    await page.keyboard.press("Tab");
    assert.equal(
      await page.locator(":focus").getAttribute("class"),
      "skip-link",
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator(":focus").getAttribute("id"),
      "main-content",
    );
    await page.locator(".menu-toggle").focus();
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "true",
    );
    assert(await page.locator("#primary-navigation").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(":focus").getAttribute("class"),
      "menu-toggle",
    );
    assert(!(await page.locator("#primary-navigation").isVisible()));
    await page.locator(".appearance summary").focus();
    await page.keyboard.press("Enter");
    await audit(page, "mobile appearance panel open");
    await reflow(page, "mobile appearance panel");
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(":focus").evaluate((element) => element.tagName),
      "SUMMARY",
    );
    console.log("PASS keyboard navigation and appearance disclosure");

    // Check every accent against the complete contact page and the visible controls.
    await page.goto(`${base}/contact.html`);
    for (const theme of ["light", "dark"]) {
      for (let color = 1; color <= 6; color++) {
        await page.evaluate(
          ({ theme, color }) => {
            SitePreferences.setTheme(theme);
            SitePreferences.setColor(`color-${color}`);
            document.querySelector(".appearance").open = true;
          },
          { theme, color },
        );
        await audit(page, `${theme} / accent ${color}`);
      }
    }
    await page.locator('[data-theme-choice="light"]').click();
    await page.locator('[data-color="color-4"]').click();
    await page.reload();
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    assert.equal(
      await page.locator("html").getAttribute("data-color"),
      "color-4",
    );
    // First visits follow the OS; an explicit choice survives reloads and OS changes.
    await page.emulateMedia({ colorScheme: "dark" });
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    for (const scheme of ["light", "dark"]) {
      const fresh = await browser.newContext({ colorScheme: scheme });
      const firstVisit = await fresh.newPage();
      await firstVisit.goto(`${base}/index.html`);
      assert.equal(
        await firstVisit.locator("html").getAttribute("data-theme"),
        scheme,
      );
      assert.equal(await firstVisit.locator("[data-theme-choice]").count(), 2);
      assert.equal(
        await firstVisit
          .locator(`[data-theme-choice="${scheme}"]`)
          .getAttribute("aria-pressed"),
        "true",
      );
      const other = scheme === "dark" ? "light" : "dark";
      await firstVisit.emulateMedia({ colorScheme: other });
      await firstVisit.waitForFunction(
        (theme) => document.documentElement.dataset.theme === theme,
        other,
      );
      await firstVisit.evaluate(
        (theme) => SitePreferences.setTheme(theme),
        scheme,
      );
      await firstVisit.reload();
      assert.equal(
        await firstVisit.locator("html").getAttribute("data-theme"),
        scheme,
      );
      // Old 'system' preferences migrate to the same automatic default.
      await firstVisit.evaluate(() =>
        localStorage.setItem("selectedTheme", "system"),
      );
      await firstVisit.reload();
      assert.equal(
        await firstVisit.locator("html").getAttribute("data-theme"),
        other,
      );
      await fresh.close();
    }
    console.log(
      "PASS 12 palettes, first-visit system appearance, and saved light/dark choices",
    );

    // A single static collection supports category filtering and view changes.
    await page.goto(`${base}/projects.html`);
    const visibleCards = () => page.locator(".project-card:visible").count();
    assert.equal(await visibleCards(), projects.length);
    for (const category of ["Academic", "Personal", "Research", "All"]) {
      await page.locator(`[data-filter="${category}"]`).click();
      assert.equal(await visibleCards(), projects.filter(p => category === "All" || p.category === category).length);
      await reflow(page, `${category} list`);
    }
    assert.equal(await page.locator("#project-search").count(), 0);

    await page.reload();
    assert.equal(
      await page.locator("#projects-grid").getAttribute("data-view"),
      "list",
    );
    await audit(page, "project list view");
    console.log("PASS project categories and compact list");

    // Native constraint validation, failure recovery, and confirmation using mocked HTTP only.
    await page.goto(`${base}/contact.html`);
    let submissions = 0;
    let responseStatus = 422;
    await page.route("https://formspree.io/f/xvgkoplg", async (route) => {
      submissions++;
      assert.equal(route.request().method(), "POST");
      await route.fulfill({
        status: responseStatus,
        contentType: "application/json",
        body: JSON.stringify(
          responseStatus === 200
            ? { ok: true }
            : { errors: [{ message: "Test failure" }] },
        ),
      });
    });
    await page.locator('button[type="submit"]').click();
    assert.equal(submissions, 0, "An empty form must not submit");
    await page.locator("#name").fill("Portfolio test");
    await page.locator("#email").fill("portfolio-test@example.com");
    await page
      .locator("#message")
      .fill("Mocked test message. Never sent to a service.");
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() =>
      document
        .getElementById("form-status")
        .textContent.includes("could not be confirmed"),
    );
    assert.equal(
      await page.locator("#message").inputValue(),
      "Mocked test message. Never sent to a service.",
    );
    assert(!(await page.locator('button[type="submit"]').isDisabled()));
    responseStatus = 200;
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(() =>
      document
        .getElementById("form-status")
        .textContent.includes("has been sent"),
    );
    assert.equal(await page.locator("#message").inputValue(), "");
    assert.equal(submissions, 2);
    await audit(page, "contact success state");
    console.log("PASS contact validation and mocked success/failure responses");

    // Browser restrictions must not remove access to content or core navigation.
    const noJS = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 800 },
    });
    const plain = await noJS.newPage();
    for (const file of [
      "index.html",
      "projects.html",
      "projects/character-recognition.html",
      "contact.html",
    ]) {
      await plain.goto(`${base}/${file}`);
      assert(await plain.locator("#primary-navigation").isVisible());
      await reflow(plain, `no JS ${file}`);
    }
    await plain.goto(`${base}/projects.html`);
    assert.equal(await plain.locator(".project-card:visible").count(), projects.length);
    assert(!(await plain.locator(".project-controls").isVisible()));
    await noJS.close();

    const restricted = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    await restricted.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Storage unavailable");
        },
      }),
    );
    const privatePage = await restricted.newPage();
    const privateErrors = [];
    privatePage.on("pageerror", (error) => privateErrors.push(error.message));
    await privatePage.goto(`${base}/projects.html`);
    await privatePage.evaluate(() => {
      SitePreferences.setTheme("dark");
      SitePreferences.setColor("color-6");
    });

    assert.equal(
      await privatePage.locator("html").getAttribute("data-theme"),
      "dark",
    );
    assert.equal(
      await privatePage.locator("#projects-grid").getAttribute("data-view"),
      "list",
    );
    assert.deepEqual(privateErrors, []);
    await restricted.close();
    console.log("PASS no-JavaScript and restricted-storage behavior");

    // Zoom-like reflow and WCAG text-spacing overrides must not hide content.
    await page.setViewportSize({ width: 320, height: 800 });
    for (const file of [
      "index.html",
      "projects.html",
      "contact.html",
      "experiences.html",
      "projects/character-recognition.html",
      "about.html",
    ]) {
      await page.goto(`${base}/${file}`);
      await page.addStyleTag({
        content:
          "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }",
      });
      await reflow(page, `text spacing ${file}`);
    }
    await page.goto(`${base}/index.html`);
    assert.equal(
      await page
        .locator(".button")
        .first()
        .evaluate((element) => getComputedStyle(element).transitionDuration),
      "0s",
    );
    await page.emulateMedia({ forcedColors: "active" });
    await reflow(page, "forced colors");
    await page.emulateMedia({ forcedColors: "none" });
    console.log(
      "PASS narrow reflow, text spacing, reduced motion, and forced colors",
    );

    const payload = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .reduce((bytes, entry) => bytes + entry.encodedBodySize, 0),
    );
    assert(
      payload < 250 * 1024,
      `Home resource payload exceeds 250 KiB: ${payload}`,
    );
    assert.deepEqual(errors, [], "Unexpected JavaScript errors");
    for (const [width, theme, file] of [
      [1440, "light", "index.html"],
      [390, "light", "index.html"],
      [1440, "dark", "index.html"],
      [390, "dark", "projects.html"],
      [1440, "light", "projects/character-recognition.html"],
      [390, "light", "contact.html"],
      [1440, "light", "about.html"],
      [390, "dark", "about.html"],
      [1440, "light", "experiences.html"],
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}/${file}`);
      await page.evaluate((theme) => {
        SitePreferences.setTheme(theme);
        SitePreferences.setColor("color-3");
      }, theme);
      await page.screenshot({
        path: path.join(
          output,
          `${file.replaceAll("/", "-").replace(".html", "")}-${width}-${theme}.png`,
        ),
        fullPage: true,
      });
    }
    console.log(
      `PASS home resource budget (${Math.round(payload / 1024)} KiB) and browser error checks`,
    );
    await context.close();
  } finally {
    fs.writeFileSync(
      path.join(output, "accessibility.json"),
      JSON.stringify(results, null, 2),
    );
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
