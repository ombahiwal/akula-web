# Open Graph Setup for Blog Sharing

This document explains how the Edge Function generates rich link previews (Open Graph metadata) for blog posts when shared on WhatsApp, Facebook, LinkedIn, Twitter, etc.

## How It Works

1. **Edge Function** (`netlify/edge-functions/blog-og.ts`) intercepts requests to `/blog/*` from bots/crawlers.
2. It fetches the matching Contentful blog entry by ID or slug.
3. Returns HTML with populated `<meta property="og:*">` tags containing the post title, description, and thumbnail.
4. Regular users (non-bots) get redirected to the SPA via JavaScript.

## Required Environment Variables

Set these in **Netlify UI** → Site settings → Environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `CONTENTFUL_SPACE_ID` | Your Contentful space ID | `b4yt88yvlwx3` |
| `CONTENTFUL_DELIVERY_TOKEN` | Contentful Content Delivery API token | `QIbGBB2m2leyeymIm9FFzD86YLTn5WnBX4UB65f1E34` |
| `CONTENTFUL_ENVIRONMENT_ID` | Contentful environment (optional, defaults to `master`) | `master` or `production` |
| `PUBLIC_SITE_URL` | Your production domain | `https://akula-dev.netlify.app` |
| `OG_FALLBACK_IMAGE` | Default OG image URL (optional, defaults to `/og-default.jpg`) | `https://akula-dev.netlify.app/og-default.png` |

> **Note**: Use the same values from your `.env` file (`VITE_SPACE_ID` → `CONTENTFUL_SPACE_ID`, `VITE_ACCESS_TOKEN` → `CONTENTFUL_DELIVERY_TOKEN`).

## Testing Locally

### Option 1: Netlify CLI with Edge Functions

```bash
# Install Netlify CLI
yarn global add netlify-cli
# or: brew install netlify-cli

# Run dev server with Edge Functions
netlify dev

# In another terminal, test with a bot user-agent
curl -A "WhatsApp/2.0" http://localhost:8888/blog/PbJ4BTUKevnjR2dXwTnZt
```

You should see HTML with `<meta property="og:title">`, `og:description`, `og:image`, etc.

### Option 2: Test on Staging Deploy

After pushing to Netlify:

```bash
# Simulate WhatsApp crawler
curl -A "WhatsApp/2.0" https://akula-dev.netlify.app/blog/PbJ4BTUKevnjR2dXwTnZt

# Or Facebook bot
curl -A "facebookexternalhit/1.1" https://akula-dev.netlify.app/blog/PbJ4BTUKevnjR2dXwTnZt
```

Look for `<meta property="og:title" content="...">` in the response.

## Validating Share Previews

Use these official tools to see how the link appears:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **WhatsApp**: Paste the URL in a chat—preview should appear automatically

> **Important**: These tools cache results. Click "Scrape Again" / "Fetch new information" after updating metadata.

## Troubleshooting

### "No preview appears when sharing"
- Verify environment variables are set in Netlify (not just `.env` locally).
- Check Edge Function logs in Netlify dashboard → Functions tab.
- Use `curl` with a bot user-agent to see the raw HTML response.

### "Wrong image/title showing"
- Clear cache in sharing debugger tools.
- Ensure the Contentful entry has `postTitle`, `shortDescription`, and `thumbnail` fields populated.
- Check `PUBLIC_SITE_URL` points to the correct domain.

### "Edge Function not running"
- Confirm `netlify.toml` references the correct function name and path.
- Check build logs for Edge Function deployment messages.
- Ensure you're testing a deployed URL (not just local `yarn dev` without `netlify dev`).

## Extending to Events

To add the same OG handling for `/events/*`:

1. Duplicate `netlify/edge-functions/blog-og.ts` → `event-og.ts`
2. Update Contentful query to use `eventsTimeline` content type
3. Add to `netlify.toml`:
   ```toml
   [[edge_functions]]
     path = "/events/*"
     function = "event-og"
   ```
