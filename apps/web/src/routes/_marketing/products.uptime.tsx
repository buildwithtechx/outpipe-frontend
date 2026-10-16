import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '#/features/marketing';
import { createSeo, siteName } from '#/lib/seo';

export const Route = createFileRoute('/_marketing/products/uptime')({
  head: () =>
    createSeo({
      title: `Uptime — ${siteName}`,
      description:
        'Multi-region synthetic checks, HTTP/TCP/ICMP probes, SSL expiry monitoring, and branded public status pages for your infrastructure.',
      path: '/products/uptime',
    }),
  component: () => <ProductPage product="uptime" />,
});
