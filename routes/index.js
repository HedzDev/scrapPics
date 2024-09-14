var express = require("express");
var router = express.Router();
const fs = require("fs");

const { scrapUrl } = require("../utils/scrapUrl");

router.post("/scrap-images", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const images = await scrapUrl(url);

    res.json({ images });
  } catch (error) {
    console.error("Error scraping images:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/processed-urls", (req, res) => {
  if (!fs.existsSync("urls.json")) {
    fs.writeFileSync("urls.json", "[]");
  }
  return res.json({ processedURLS: fs.readFileSync("urls.json", "utf8") });
});

module.exports = router;
