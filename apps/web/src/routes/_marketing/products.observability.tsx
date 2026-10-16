import { createFileRoute } from '@tanstack/react-router';
import { ProductPage } from '#/features/marketing';
import { createSeo, siteName } from '#/lib/seo';

export const Route = createFileRoute('/_marketing/products/observability')({
  head: () =>
    createSeo({
      title: `Observability — ${siteName}`,
      description:
        'Follow request stories across services with OpenTelemetry traces, correlated logs, and service metrics in a single unified workspace.',
      path: '/products/observability',
    }),
  component: () => <ProductPage product="observability" />,
});
