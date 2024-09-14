const puppeteer = require("puppeteer");

/**
 * check if an URL is valid
 * @param {*} url
 * @returns {Boolean} isValid
 */

async function isURLValid(url) {
  let browser = null;
  let page = null;

  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000, // 30 secondes de timeout
    });

    return response.ok();
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'URL: ${error.message}`);
    return false;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

module.exports = { isURLValid };
