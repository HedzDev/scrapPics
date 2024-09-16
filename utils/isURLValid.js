const puppeteer = require("puppeteer");

/**
 * check if an URL is valid
 * @param {string} url
 * @returns {Boolean} isValid
 */

async function isURLValid(url) {
  let browser = null;
  let page = null;

  try {
    browser = await puppeteer.launch({ headless: "new" });
    page = await browser.newPage();

    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 25000,
    });

    return response.ok();
  } catch (error) {
    console.error(`Error while checking the URL: ${error.message}`);
    return false;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

module.exports = { isURLValid };
