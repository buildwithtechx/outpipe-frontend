import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { type ProductId, productIds, products } from './product-content';
import { ProductIcon } from './product-icon';
import { ProductPreview } from './product-preview';
import './products.css';

export function ProductPage({
  product,
  hero,
  workflow,
  sections,
  className = '',
}: {
  product: ProductId;
  hero?: ReactNode;
  workflow?: ReactNode;
  sections?: ReactNode;
  className?: string;
}) {
  const content = products[product];

  return (
    <article className={`pd-page ${className}`.trim()}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {hero ?? (
          <section className="pd-hero" aria-labelledby="product-title">
            <div className="pd-hero-copy">
              <p className="pd-eyebrow">
                <ProductIcon product={product} />
                OUTPIPE {content.name.toUpperCase()}
              </p>
              <h1 id="product-title">{content.title}</h1>
              <p className="pd-lead">{content.description}</p>
              <div className="pd-actions">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
                <Link to="/plugins" className="pd-text-link">
                  Read the docs
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <ul className="pd-tags" aria-label={`${content.name} highlights`}>
                {content.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
            <ProductPreview product={product} />
          </section>
        )}

        {workflow ?? (
          <section
            className="pd-workflow pd-section"
            aria-labelledby="workflow-title"
          >
            <div>
              <p className="pd-eyebrow">THE WORKFLOW</p>
              <h2 id="workflow-title">{content.workflow.title}</h2>
              <p className="pd-section-description">
                {content.workflow.description}
              </p>
              <ol className="pd-steps">
                {content.workflow.steps.map((step, index) => (
                  <li key={step.title}>
                    <span aria-hidden="true">0{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="pd-code-panel">
              <div className="pd-code-heading">
                <span>{content.workflow.label}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <pre>
                <code>{content.workflow.code}</code>
              </pre>
              <p>{content.workflow.note}</p>
              <Link to="/plugins" className="pd-text-link">
                Full setup guide
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        )}

        {sections ?? (
          <>
            <section
              className="pd-section"
              aria-labelledby="capabilities-title"
            >
              <div className="pd-section-heading">
                <p className="pd-eyebrow">BUILT IN</p>
                <h2 id="capabilities-title">
                  The details that make it useful.
                </h2>
              </div>
              <div className="pd-capabilities">
                {content.capabilities.map((capability, index) => (
                  <div key={capability.title}>
                    <span className="pd-capability-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="pd-section pd-use-cases"
              aria-labelledby="use-cases-title"
            >
              <div>
                <p className="pd-eyebrow">IN PRACTICE</p>
                <h2 id="use-cases-title">Where it fits in your day.</h2>
              </div>
              <div>
                {content.useCases.map((useCase) => (
                  <div className="pd-use-case" key={useCase.title}>
                    <h3>{useCase.title}</h3>
                    <p>{useCase.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="pd-connected" aria-labelledby="connected-title">
              <span className="pd-connected-icon">
                <ProductIcon product={content.next} />
              </span>
              <div>
                <p className="pd-eyebrow">BETTER TOGETHER</p>
                <h2 id="connected-title">{content.connection}</h2>
              </div>
              <Link to={`/products/${content.next}`} className="pd-text-link">
                Explore {products[content.next].name}
                <ArrowRight className="size-4" />
              </Link>
            </section>

            <section className="pd-bottom-cta" aria-labelledby="start-title">
              <div>
                <p className="pd-eyebrow">YOUR NEXT STEP</p>
                <h2 id="start-title">
                  Start with {content.name.toLowerCase()}.
                </h2>
                <p>Create a workspace and connect your first service.</p>
              </div>
              <div className="pd-actions">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  Get started
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </article>
  );
}

export function ProductsIndex() {
  return (
    <div className="pd-page pd-index mx-auto max-w-6xl px-4 sm:px-6">
      <section
        className="pd-index-hero py-16 text-center"
        aria-labelledby="products-title"
      >
        <p className="pd-eyebrow justify-center">THE OUTPIPE TOOLKIT</p>
        <h1 id="products-title" className="mx-auto">
          Four tools. One workspace.
          <br />
          Start where you need them.
        </h1>
        <p className="pd-lead mx-auto">
          Expose a local service, understand its requests, manage its
          configuration, and keep an eye on its public endpoint.
        </p>
        <div className="pd-actions justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Get started
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <div className="pd-index-products">
        {productIds.map((id) => (
          <section
            className="pd-index-product"
            key={id}
            aria-labelledby={`${id}-title`}
          >
            <div className="pd-index-copy">
              <p className="pd-eyebrow">
                {products[id].number} / {products[id].name.toUpperCase()}
              </p>
              <h2 id={`${id}-title`}>{products[id].summary}</h2>
              <p className="pd-lead">{products[id].description}</p>
              <ul
                className="pd-tags"
                aria-label={`${products[id].name} highlights`}
              >
                {products[id].tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <Link to={`/products/${id}`} className="pd-text-link mt-4">
                Explore {products[id].name}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ProductPreview product={id} />
          </section>
        ))}
      </div>
    </div>
  );
}
