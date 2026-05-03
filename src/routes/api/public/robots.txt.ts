import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://neuralgift.app";

export const Route = createFileRoute("/api/public/robots/txt")({
  server: {
    handlers: {
      GET: () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /account",
          "Disallow: /business",
          "Disallow: /buy/return",
          "Disallow: /buy/success",
          "Disallow: /unsubscribe",
          "Disallow: /api/",
          "",
          `Sitemap: ${SITE}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});