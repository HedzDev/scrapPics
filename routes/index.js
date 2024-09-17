var express = require("express");
var router = express.Router();
const fs = require("fs");

const { scrapUrl } = require("../services/scrapUrl");

/**
 * scrap images from a URL
 * @route POST /scrap-images
 * @param {string} url.query.required - URL to scrap images from
 * @returns {object} 200 - An array of images
 * @returns {Error} 400 - Bad request URL is required
 * @returns {Error} 500 - Internal server error
 */

router.post("/scrap-images", async (req, res) => {
  const url = req.query.url;

  try {
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }
    const images = await scrapUrl(url);
    res.json({ images });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * get processed URLs
 * @route GET /processed-urls
 * @returns {object} 200 - An array of processed URLs
 */

router.get("/processed-urls", (req, res) => {
  if (!fs.existsSync("urls.json")) {
    fs.writeFileSync("urls.json", "[]");
  }
  return res.json({ processedURLS: fs.readFileSync("urls.json", "utf8") });
});

module.exports = router;
