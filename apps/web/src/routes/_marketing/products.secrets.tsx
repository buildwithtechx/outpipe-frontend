import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '#/features/marketing';
import { createSeo, siteName } from '#/lib/seo';

export const Route = createFileRoute('/_marketing/products/secrets')({
  head: () =>
    createSeo({
      title: `Secrets — ${siteName}`,
      description:
        'Organize encrypted values in vaults and environments, keep a history of changes, and inject runtime configuration into processes without dotenv files.',
      path: '/products/secrets',
    }),
  component: () => <ProductPage product="secrets" />,
});
