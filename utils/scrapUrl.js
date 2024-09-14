const puppeteer = require("puppeteer");
const { isURLValid } = require("./isURLValid");
const fs = require("fs");

/**
 * process an url and save it to a file if it is not already there
 * @param {*} fileName
 * @param {*} url
 */

async function processUrl(fileName, url) {
  if (!fs.existsSync("urls.json")) {
    fs.writeFileSync("urls.json", "[]");
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
      throw new Error("URL invalide");
    }

    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    await processUrl("urls.json", url);

    const images = await page.evaluate((baseUrl) => {
      return Array.from(document.images).map((img) => {
        const src = img.src;
        return src.startsWith("http") ? src : new URL(src, baseUrl).href;
      });
    }, url);

    return images;
  } catch (error) {
    console.error(`Erreur lors du scraping de l'URL: ${error.message}`);
    throw new Error(`Erreur lors du scraping de l'URL: ${error.message}`);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

module.exports = { scrapUrl };
