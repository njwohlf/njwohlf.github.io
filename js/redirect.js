// Preserve bookmarked query strings and fragments when migrating old page URLs.
const destination = new URL(document.querySelector('link[rel="canonical"]').href);
location.replace(destination.pathname + location.search + location.hash);
