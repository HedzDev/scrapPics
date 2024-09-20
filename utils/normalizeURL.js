/**
 * normalize an URL by adding "https://" if no protocol is provided and "www." if no subdomain is provided
 * @param {string} url
 * @returns {string} normalizedUrl
 */

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    let urlObject = new URL(url);

    if (
      !urlObject.hostname.startsWith("www.") &&
      urlObject.hostname !== "localhost"
    ) {
      urlObject.hostname = "www." + urlObject.hostname;
    }
    return urlObject.toString();
  } catch {
    return url;
  }
}

module.exports = { normalizeUrl };
