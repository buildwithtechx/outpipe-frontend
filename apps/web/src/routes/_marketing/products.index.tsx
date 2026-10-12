import { createFileRoute } from '@tanstack/react-router';
import { ProductsIndex } from '#/features/marketing';
import { createSeo, siteName } from '#/lib/seo';

export const Route = createFileRoute('/_marketing/products/')({
  head: () =>
    createSeo({
      title: `Products — ${siteName}`,
      description:
        'Explore Outpipe Tunnels, Observability, Secrets, and Uptime: connected developer tools from a local service to a running application.',
      path: '/products',
    }),
  component: ProductsIndex,
});
