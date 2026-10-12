import { createFileRoute } from '@tanstack/react-router';
import {
  ProductPage,
  TunnelFeatureSections,
  TunnelHero,
  TunnelTerminalSection,
} from '#/features/marketing';
import { createSeo, siteName } from '#/lib/seo';

export const Route = createFileRoute('/_marketing/products/tunnels')({
  head: () =>
    createSeo({
      title: `Tunnels — ${siteName}`,
      description:
        'A public address for the app on your machine. Share your work, catch real webhooks, and test from anywhere—without a deployment.',
      path: '/products/tunnels',
    }),
  component: () => (
    <ProductPage
      product="tunnels"
      hero={<TunnelHero />}
      workflow={<TunnelTerminalSection />}
      sections={<TunnelFeatureSections />}
    />
  ),
});
