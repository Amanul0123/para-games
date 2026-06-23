import { chromium } from "playwright";

const BASE = "http://localhost:3001";
const shotDir = "C:/Users/admin/AppData/Local/Temp/claude/C--Users-admin-para-games-report/4b12f6c7-2441-4127-9334-e9673538c074/scratchpad/shots";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

async function shot(name) {
  await page.screenshot({ path: `${shotDir}/${name}.png`, fullPage: true });
  console.log(`screenshot: ${name}`);
}

console.log("== Admin login ==");
await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
await page.waitForSelector("text=APC Medical Portal");
await shot("01-admin-login");

console.log("== Reporting wizard step1 ==");
await page.goto(`${BASE}/form/step1`, { waitUntil: "networkidle" });
await page.waitForSelector("text=Reporter Information");
await shot("02-form-step1");

console.log("== Keyboard tab order check on step1 ==");
await page.keyboard.press("Tab");
await page.keyboard.press("Tab");
const focused1 = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
console.log("focused element id/tag:", focused1);

console.log("== Fill step1 and go to step2 ==");
await page.selectOption("#npc", { label: "India" });
await page.fill("#reportedBy", "Test Reporter");
await page.fill("#dateOfReport", "2026-06-23");
await page.fill("#email", "test@example.com");
await page.fill("#phone", "9876543210");
await page.click('button[type="submit"]');
await page.waitForSelector("text=Injuries", { timeout: 10000 });
await shot("03-form-step2");

console.log("== Check injury form labels ==");
const labelFor = await page.getAttribute('label[for="injury-0-accreditationNo"]', "for").catch(() => null);
console.log("label for injury-0-accreditationNo exists:", !!labelFor);

console.log("== Admin reports table (will redirect to login if unauthenticated) ==");
await page.goto(`${BASE}/admin/reports`, { waitUntil: "networkidle" });
await shot("04-admin-reports-or-login");

console.log("== ConfirmDialog focus trap check (if reachable) ==");
const hasDeleteBtn = await page.locator('button[aria-label^="Delete report"]').first().isVisible().catch(() => false);
if (hasDeleteBtn) {
  await page.locator('button[aria-label^="Delete report"]').first().click();
  await page.waitForSelector('[role="dialog"]');
  await shot("05-confirm-dialog");
  const activeIsCancel = await page.evaluate(() => document.activeElement?.textContent);
  console.log("focused on dialog open:", activeIsCancel);
  await page.keyboard.press("Escape");
  const dialogGone = await page.locator('[role="dialog"]').isVisible().catch(() => false);
  console.log("dialog closed after Escape:", !dialogGone);
}

console.log("\n=== Console errors captured ===");
console.log(errors.length ? errors.join("\n") : "(none)");

await browser.close();
