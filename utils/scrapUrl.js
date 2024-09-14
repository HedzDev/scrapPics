const puppeteer = require("puppeteer");
const { isURLValid } = require("./isURLValid");
const fs = require("fs");

/**
 * process an url and save it to a file if it is not already there
 * @param {*} fileName
 * @param {*} url
 */

async function processUrl(fileName, url) {
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
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (!(await isURLValid(url))) {
    throw new Error("Invalid URL");
  }

  try {
    await page.goto(url, { waitUntil: "networkidle0" });

    await processUrl("urls.json", url);

    const images = await page.evaluate((baseUrl) => {
      return Array.from(document.images).map((img) => {
        const src = img.src;
        return src.startsWith("http") ? src : new URL(src, baseUrl).href;
      });
    }, url);

    await browser.close();
    return images;
  } catch (error) {
    console.error(`Error scrapping URL: ${error.message}`);
    await browser.close();
    return;
  }
}

module.exports = { scrapUrl };
