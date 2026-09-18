// Explicit contrast checks supplement axe where decorations or open panels obscure backgrounds.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const base = process.env.SITE_URL || "http://127.0.0.1:8766";
function rgb(hex) {
  const value = hex.trim().slice(1);
  return (
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value
  )
    .match(/../g)
    .map((value) => parseInt(value, 16));
}
function luminance(channels) {
  const linear = channels.map((value) => {
    const s = value / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
  });
  try {
    const page = await browser.newPage();
    await page.goto(`${base}/index.html`);
    let minimum = Infinity;
    for (const theme of ["light", "dark"]) {
      for (let color = 1; color <= 6; color++) {
        const tokens = await page.evaluate(
          ({ theme, color }) => {
            SitePreferences.setTheme(theme);
            SitePreferences.setColor(`color-${color}`);
            const style = getComputedStyle(document.documentElement);
            return Object.fromEntries(
              [
                "page-bg",
                "panel-bg",
                "subtle-bg",
                "text-color",
                "muted-text",
                "accent",
                "accent-ink",
                "control-border",
              ].map((name) => [name, style.getPropertyValue(`--${name}`)]),
            );
          },
          { theme, color },
        );
        const colors = Object.fromEntries(
          Object.entries(tokens).map(([name, value]) => [name, rgb(value)]),
        );
        const backgrounds = ["page-bg", "panel-bg", "subtle-bg"].map(
          (name) => colors[name],
        );
        for (const foreground of ["text-color", "muted-text", "accent"]) {
          for (const background of backgrounds) {
            const ratio = contrast(colors[foreground], background);
            minimum = Math.min(minimum, ratio);
            assert(
              ratio >= 4.5,
              `${theme} ${color} ${foreground}: ${ratio.toFixed(2)}:1`,
            );
          }
        }
        assert(
          contrast(colors["accent-ink"], colors.accent) >= 4.5,
          `${theme} ${color}: button text contrast`,
        );
        for (const background of backgrounds.slice(0, 3))
          assert(
            contrast(colors["control-border"], background) >= 3,
            `${theme}: control boundary contrast`,
          );
      }
    }
    await page.emulateMedia({ media: "print" });
    const printed = await page.locator("body").evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      text: getComputedStyle(element).color,
    }));
    assert.deepEqual(printed, {
      background: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
    });
    assert(!(await page.locator(".site-header").isVisible()));
    console.log(
      `PASS all 12 screen palettes (minimum tested text contrast ${minimum.toFixed(2)}:1), control boundaries, and dark-theme print output`,
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
