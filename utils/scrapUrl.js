const puppeteer = require("puppeteer");
const { isURLValid } = require("./isURLValid");
const fs = require("fs");

async function hasAlreadyBeenProcessed(fileName, url) {
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

async function scrapUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (!(await isURLValid(url))) {
    throw new Error("Invalid URL");
  }

  try {
    await page.goto(url, { waitUntil: "networkidle0" });

    await hasAlreadyBeenProcessed("urls.json", url);

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
