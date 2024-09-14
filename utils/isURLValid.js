const puppeteer = require("puppeteer");

/**
 * check if an URL is valid
 * @param {*} url
 * @returns {Boolean} isValid
 */

async function isURLValid(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const response = await page.goto(url, { waitUntil: "networkidle0" });
    const isValid = response.ok();
    await browser.close();
    return isValid;
  } catch (error) {
    console.error(`Error checking URL: ${error.message}`);
    await browser.close();
    return false;
  }
}

module.exports = { isURLValid };
