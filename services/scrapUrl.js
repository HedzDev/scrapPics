const puppeteer = require("puppeteer");
const fs = require("fs");
const { normalizeUrl } = require("../utils/normalizeURL");

/**
 * process an url and save it to a file if it is not already there
 * @param {string} fileName
 * @param {string} url
 */

function saveProcessedUrl(fileName, url) {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, "[]");
  }
  const processedUrls = JSON.parse(fs.readFileSync(fileName, "utf8"));

  if (!processedUrls.includes(url)) {
    fs.writeFileSync(
      fileName,
      JSON.stringify([...processedUrls, url], null, 2)
    );
  }
}

/**
 * scrap an url and return the images found
 * @param {string} url
 * @returns {Array} images
 */

async function scrapUrl(url) {
  let browser = null;
  let page = null;

  try {
    const normalizedUrl = normalizeUrl(url);

    browser = await puppeteer.launch({ headless: "new" });
    page = await browser.newPage();

    const response = await page.goto(normalizedUrl, {
      waitUntil: "networkidle0",
      timeout: 25000,
    });

    if (!response.ok()) {
      throw new Error("URL is not reachable");
    }

    saveProcessedUrl("urls.json", normalizedUrl);

    const images = await page.evaluate((baseUrl) => {
      return Array.from(document.images).map((img) => {
        const src = img.src;
        return src.startsWith("http") || src.startsWith("https")
          ? src
          : new URL(src, baseUrl).href;
      });
    }, normalizedUrl);

    return images;
  } catch (error) {
    console.log(`Error while scraping the URL: ${error.message}`);
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

module.exports = { scrapUrl };
