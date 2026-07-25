import "server-only";

export type LiveResource = {
  title: string;
  url: string;
  description: string;
  source: string;
  category: "Learn" | "Practice" | "Interview";
};

export type ResourceSection = {
  title: string;
  query: string;
  resources: LiveResource[];
};

const blockedHosts = [
  "pinterest.",
  "facebook.",
  "instagram.",
  "quora.",
  "tiktok."
];

const trustedHosts = [
  "developer.mozilla.org",
  "owasp.org",
  "portswigger.net",
  "github.com",
  "freecodecamp.org",
  "docs.",
  "learn.microsoft.com",
  "cloud.google.com",
  "aws.amazon.com",
  "youtube.com",
  "coursera.org",
  "edx.org",
  "geeksforgeeks.org"
];

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function tag(item: string, name: string) {
  const match = item.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isUseful(resource: LiveResource) {
  const host = hostname(resource.url);
  return Boolean(
    host &&
    resource.url.startsWith("https://") &&
    !blockedHosts.some((blocked) => host.includes(blocked))
  );
}

function qualityScore(resource: LiveResource) {
  const host = hostname(resource.url);
  const trusted = trustedHosts.some((candidate) => host.includes(candidate)) ? 10 : 0;
  const learningIntent = /learn|guide|course|tutorial|documentation|practice|interview|roadmap/i
    .test(`${resource.title} ${resource.description}`) ? 3 : 0;
  return trusted + learningIntent;
}

async function searchBing(query: string, category: LiveResource["category"]) {
  const endpoint = `https://www.bing.com/search?format=rss&count=8&q=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; DiptishAI/1.0; study-resource-search)" },
    signal: AbortSignal.timeout(9000)
  });
  if (!response.ok) throw new Error(`Search failed with ${response.status}`);

  const xml = await response.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match): LiveResource => {
      const url = tag(match[1], "link");
      return {
        title: tag(match[1], "title"),
        url,
        description: tag(match[1], "description").slice(0, 220),
        source: hostname(url),
        category
      };
    })
    .filter(isUseful)
    .sort((a, b) => qualityScore(b) - qualityScore(a))
    .slice(0, 5);
}

const fallback: LiveResource[] = [
  {
    title: "OWASP Top 10",
    url: "https://owasp.org/www-project-top-ten/",
    description: "A standard awareness document for the most critical web application security risks.",
    source: "owasp.org",
    category: "Learn"
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    description: "Structured web-development learning material maintained by Mozilla and contributors.",
    source: "developer.mozilla.org",
    category: "Learn"
  },
  {
    title: "Web Security Academy",
    url: "https://portswigger.net/web-security",
    description: "Free explanations and safe, legal interactive web-security labs.",
    source: "portswigger.net",
    category: "Practice"
  }
];

export async function getGoalResources(input: {
  role: string;
  experience: string;
  weakSkills: string[];
  topic?: string;
}) {
  const focus = input.topic || input.weakSkills.slice(0, 2).join(" and ");
  const level = input.experience || "beginner";
  const definitions = [
    {
      title: "Learn the foundations",
      category: "Learn" as const,
      query: `${input.role} ${level} learning roadmap ${focus} official documentation tutorial`
    },
    {
      title: "Practice with real projects",
      category: "Practice" as const,
      query: `${input.role} ${focus} hands-on practice labs projects GitHub course`
    },
    {
      title: "Prepare for interviews",
      category: "Interview" as const,
      query: `${input.role} ${level} interview preparation questions study guide`
    }
  ];

  const results = await Promise.allSettled(
    definitions.map((definition) => searchBing(definition.query, definition.category))
  );
  const seen = new Set<string>();

  const sections: ResourceSection[] = definitions.map((definition, index) => {
    const result = results[index];
    const resources = result.status === "fulfilled"
      ? result.value.filter((resource) => {
          const key = resource.url.replace(/\/$/, "");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
      : [];
    return { title: definition.title, query: definition.query, resources };
  });

  if (sections.every((section) => section.resources.length === 0)) {
    sections[0].resources = fallback.filter((item) => item.category === "Learn");
    sections[1].resources = fallback.filter((item) => item.category === "Practice");
  }

  return sections.filter((section) => section.resources.length > 0);
}
