const puppeteer = require("puppeteer");
const { isURLValid } = require("./isURLValid");
const fs = require("fs");

/**
 * process an url and save it to a file if it is not already there
 * @param {string} fileName
 * @param {string} url
 */

async function saveProcessedUrl(fileName, url) {
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
 * @param {*} url
 * @returns {Array} images
 */

async function scrapUrl(url) {
  let browser = null;
  let page = null;
  try {
    if (!(await isURLValid(url))) {
      throw new Error("Invalid URL");
    }

    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    await saveProcessedUrl("urls.json", url);

    const images = await page.evaluate((baseUrl) => {
      return Array.from(document.images).map((img) => {
        const src = img.src;
        return src.startsWith("http" || "https")
          ? src
          : new URL(src, baseUrl).href;
      });
    }, url);

    return images;
  } catch (error) {
    throw new Error(`Error while scraping the URL: ${error.message}`);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

module.exports = { scrapUrl };
