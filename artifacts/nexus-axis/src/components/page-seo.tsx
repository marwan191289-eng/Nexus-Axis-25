import { useEffect } from "react";

interface PageSEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  author?: string;
  noSuffix?: boolean;
}

const SITE_NAME = "Nexus Axis Consultants";
const BASE_URL = "https://nexusaxisconsultants.com";
const DEFAULT_IMAGE = `${BASE_URL}/opengraph.jpg`;
const DEFAULT_DESC =
  "Premier boutique law firm serving UAE and Egypt since 2009. Commercial litigation, corporate tax, international arbitration & more. Consultation from AED 500.";

function setMeta(selector: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [attr, val] = selector.replace("meta[", "").replace("]", "").split('="');
    el.setAttribute(attr, val.replace('"', ""));
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function PageSEO({
  title,
  description = DEFAULT_DESC,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  publishedAt,
  author,
  noSuffix = false,
}: PageSEOProps) {
  useEffect(() => {
    const fullTitle = noSuffix
      ? (title ?? SITE_NAME)
      : title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} | Boutique Law Firm — UAE & Egypt`;
    const fullUrl = path ? `${BASE_URL}${path}` : BASE_URL;
    const imgUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

    document.title = fullTitle;
    setLink("canonical", fullUrl);

    setMeta(`meta[name="description"]`, description);
    setMeta(`meta[property="og:title"]`, fullTitle);
    setMeta(`meta[property="og:description"]`, description);
    setMeta(`meta[property="og:url"]`, fullUrl);
    setMeta(`meta[property="og:image"]`, imgUrl);
    setMeta(`meta[property="og:image:secure_url"]`, imgUrl);
    setMeta(`meta[property="og:type"]`, type);
    setMeta(`meta[name="twitter:title"]`, fullTitle);
    setMeta(`meta[name="twitter:description"]`, description);
    setMeta(`meta[name="twitter:image"]`, imgUrl);

    if (publishedAt) setMeta(`meta[property="article:published_time"]`, publishedAt);
    if (author) setMeta(`meta[name="author"]`, author);

    return () => {
      document.title = `${SITE_NAME} | Boutique Law Firm — UAE & Egypt`;
    };
  }, [title, description, path, image, type, publishedAt, author, noSuffix]);

  return null;
}
