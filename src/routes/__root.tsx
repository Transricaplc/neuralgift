import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NeuralGift — One card. Every AI tool." },
      { name: "description", content: "Gift the future of thinking. A universal AI gift card redeemable across ChatGPT, Claude, Midjourney and more." },
      { name: "author", content: "NeuralGift" },
      { property: "og:title", content: "NeuralGift — One card. Every AI tool." },
      { property: "og:description", content: "Gift the future of thinking. A universal AI gift card redeemable across ChatGPT, Claude, Midjourney and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@NeuralGift" },
      { name: "twitter:title", content: "NeuralGift — One card. Every AI tool." },
      { name: "twitter:description", content: "Gift the future of thinking. A universal AI gift card redeemable across ChatGPT, Claude, Midjourney and more." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b65db7da-a898-48ad-b9bc-83f23a0bcc40/id-preview-2894ba99--240c0e4a-4912-4ef3-b65d-6259d6818ceb.lovable.app-1777119462873.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b65db7da-a898-48ad-b9bc-83f23a0bcc40/id-preview-2894ba99--240c0e4a-4912-4ef3-b65d-6259d6818ceb.lovable.app-1777119462873.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
