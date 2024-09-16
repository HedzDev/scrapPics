/**
 * normalize an URL by adding "https://" if no protocol is provided and "www." if no subdomain is provided
 * @param {string} url
 * @returns {string} normalizedUrl
 */

function normalizeUrl(url) {
  // Si l'URL ne commence pas par un protocole, on ajoute "https://"
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    const urlObject = new URL(url);
    // Si le domaine ne commence pas par "www.", on l'ajoute
    if (
      !urlObject.hostname.startsWith("www.") &&
      urlObject.hostname !== "localhost"
    ) {
      urlObject.hostname = "www." + urlObject.hostname;
    }
    return urlObject.toString();
  } catch {
    // Si la création de l'objet URL échoue, on retourne l'URL d'origine
    return url;
  }
}

module.exports = { normalizeUrl };
