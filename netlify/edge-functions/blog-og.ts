declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
};

const BOT_UA_PATTERN = /(whatsapp|facebookexternalhit|twitterbot|slackbot|linkedinbot|telegrambot|discordbot|pinterest|embedly|quora|vkshare|bitlybot|redditbot|googlebot|bingbot|duckduckbot|baiduspider|yandexbot)/i;

type ContentfulAsset = {
  sys: { id: string };
  fields?: {
    title?: string;
    description?: string;
    file?: { url?: string };
  };
};

type ContentfulEntry = {
  sys: { id: string; createdAt?: string }; 
  fields?: Record<string, any>;
};

type ContentfulResponse = {
  items?: ContentfulEntry[];
  includes?: { Asset?: ContentfulAsset[] };
};

const handler = async (request: Request, context: any) => {
  const userAgent = request.headers.get("user-agent") || "";
  if (!BOT_UA_PATTERN.test(userAgent)) {
    return context.next();
  }

  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);

  if (segments[0] !== "blog" || !segments[1]) {
    return context.next();
  }

  const identifier = decodeURIComponent(segments[1]);

  const spaceId = Deno.env.get("CONTENTFUL_SPACE_ID");
  const envId = Deno.env.get("CONTENTFUL_ENVIRONMENT_ID") || "master";
  const accessToken = Deno.env.get("CONTENTFUL_DELIVERY_TOKEN");
  const siteUrl = Deno.env.get("PUBLIC_SITE_URL") || `${url.origin}`;
  const fallbackImage = Deno.env.get("OG_FALLBACK_IMAGE") || `${siteUrl}/og-default.jpg`;

  if (!spaceId || !accessToken) {
    console.warn("Missing Contentful credentials in Edge Function environment.");
    return context.next();
  }

  let entry: ContentfulEntry | undefined;
  let assets: ContentfulAsset[] = [];

  const endpoints = [
    new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries`),
    new URL(`https://cdn.contentful.com/spaces/${spaceId}/environments/${envId}/entries`),
  ];

  // First try by sys.id
  endpoints[0].searchParams.set("content_type", "blogPost");
  endpoints[0].searchParams.set("sys.id[in]", identifier);
  endpoints[0].searchParams.set("limit", "1");
  endpoints[0].searchParams.set("include", "2");

  // Then try slug field
  endpoints[1].searchParams.set("content_type", "blogPost");
  endpoints[1].searchParams.set("fields.slug", identifier);
  endpoints[1].searchParams.set("limit", "1");
  endpoints[1].searchParams.set("include", "2");

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Contentful API error", response.status, await response.text());
      continue;
    }

    const data = (await response.json()) as ContentfulResponse;
    if (data.items && data.items.length > 0) {
      entry = data.items[0];
      assets = data.includes?.Asset || [];
      break;
    }
  }

  if (!entry) {
    return context.next();
  }

  const fields = entry.fields || {};
  const title = stringifyField(fields.postTitle || fields.title, "AKULA Blog");
  const description = truncate(
    stringifyField(
      fields.shortDescription || fields.excerpt || stripRichText(fields.blogBody) || "",
      "Stories from AKULA."
    ),
    200
  );

  const image = resolveAssetUrl(fields.thumbnail, assets) || fallbackImage;
  const canonical = `${siteUrl}${url.pathname}`;
  const published = fields.postDateTime || entry.sys.createdAt || new Date().toISOString();

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)} · AKULA Blog</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="canonical" href="${canonical}" />
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${canonical}" />
<meta property="article:published_time" content="${published}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${image}" />
</head>
<body>
  <noscript>Continue to <a href="${canonical}">${escapeHtml(title)}</a></noscript>
  <script>window.location.replace(${JSON.stringify(canonical)});</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=600",
    },
  });
};

function resolveAssetUrl(field: any, assets: ContentfulAsset[]): string | null {
  if (!field) return null;

  if (typeof field === "string" && field.startsWith("http")) {
    return field;
  }

  const assetId =
    typeof field === "object" && field.sys?.id
      ? field.sys.id
      : Array.isArray(field) && field[0]?.sys?.id
      ? field[0].sys.id
      : null;

  if (!assetId) return null;

  const asset = assets.find((asset) => asset.sys.id === assetId);
  const url = asset?.fields?.file?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `https:${url}`;
}

function stringifyField(value: any, fallback: string): string {
  if (!value) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    if (value.nodeType && value.content) {
      return stripRichText(value);
    }
    return JSON.stringify(value);
  }
  return fallback;
}

function stripRichText(value: any): string {
  try {
    if (!value || typeof value !== "object") return "";
    const traverse = (node: any): string => {
      if (!node) return "";
      if (node.nodeType === "text" && node.value) return node.value;
      if (Array.isArray(node)) return node.map(traverse).join(" ");
      if (node.content) return node.content.map(traverse).join(" ");
      return "";
    };
    return traverse(value).replace(/\s+/g, " ").trim();
  } catch (_) {
    return "";
  }
}

function truncate(value: string, max = 200): string {
  if (!value) return value;
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default handler;
