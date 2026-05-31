import {
  SITE_URL,
  FULL_NAME,
  SITE_DESCRIPTION,
  ROLES,
  CORE_TECHS,
  SECONDARY_TECHS,
} from "@/constants/constants";
import { getOgImageUrl } from "@/lib/metadata";
import { activeSocials } from "@/data/static/social";

const PERSON_SCHEMA = {
  "@type": "Person",
  name: FULL_NAME,
  url: SITE_URL,
  jobTitle: ROLES[0],
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/profpic.png`,
  knowsAbout: [...CORE_TECHS, ...SECONDARY_TECHS],
  sameAs: activeSocials.map((social) => social.href),
};

/**
 * Returns the standard Person schema for the portfolio owner.
 * Includes bio, skills, and social links to build a unified identity graph for search engines.
 *
 * @returns A JSON-LD compliant `Person` schema object.
 */
export function getPersonSchema() {
  return PERSON_SCHEMA;
}

/**
 * Generates the primary WebSite schema structure.
 * Enables rich search features and defines the internal search action for the site.
 *
 * @returns A JSON-LD compliant `WebSite` schema object.
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: FULL_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: PERSON_SCHEMA,
    about: PERSON_SCHEMA,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blogs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Creates a BlogPosting schema for individual blog articles to improve SEO and content discoverability.
 *
 * @param props - An object containing the blog post's title, excerpt, date, slug, and optional image.
 * @returns A JSON-LD compliant `BlogPosting` schema object.
 */
export function getBlogPostingSchema({
  title,
  excerpt,
  date,
  slug,
  image,
}: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: date,
    author: PERSON_SCHEMA,
    url: `${SITE_URL}/blogs/${slug}`,
    image: image ?? getOgImageUrl(title, "Blog"),
  };
}

/**
 * Generates a ProfilePage schema representing the main portfolio landing page.
 * Includes the page's breadcrumb hierarchy and links to the main entity (the user).
 *
 * @returns A JSON-LD compliant `ProfilePage` schema object.
 */
export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: PERSON_SCHEMA,
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    name: `${FULL_NAME} - ${ROLES[0]}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
  };
}

/**
 * Constructs a BreadcrumbList schema to indicate page hierarchy and navigational structure.
 * Crucial for displaying clean, nested breadcrumbs in Google Search results.
 *
 * @param items - An array of objects representing each step in the breadcrumb path (name and URL).
 * @returns A JSON-LD compliant `BreadcrumbList` schema object.
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
