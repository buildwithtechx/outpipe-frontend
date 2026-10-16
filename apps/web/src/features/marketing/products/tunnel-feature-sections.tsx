import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { docsUrl } from '#/lib/docs';
import { TunnelAddressSections } from './tunnel-address-sections';
import { TunnelDeveloperExperience } from './tunnel-developer-experience';
import { TunnelNetworkDiagram } from './tunnel-network-diagram';
import styles from './tunnel-sections.module.css';

const openSourceDetails = [
  {
    number: '01',
    title: 'Inspect every layer',
    description:
      'Follow a request through the CLI, tunnel server, and console. The platform source is available under AGPL-3.0.',
  },
  {
    number: '02',
    title: 'Make it better, together',
    description:
      'Report an issue, share an idea, or contribute a fix. Build the tools you want to use.',
  },
  {
    number: '03',
    title: 'Run it on your terms',
    description:
      'Self-host the platform on your own infrastructure, with your own configuration and instance-owned limits.',
  },
];

function TunnelOpenSourceSection() {
  return (
    <section
      className={`${styles.section} ${styles.openSource}`}
      aria-labelledby="tunnel-open-source-title"
    >
      <div className={styles.sourceIntro}>
        <h2 className={styles.title} id="tunnel-open-source-title">
          Built in the open.
          <br />
          <span>Yours to run.</span>
        </h2>
        <p className={styles.description}>
          Your development workflow shouldn’t be a mystery. Read the code, get
          involved, or bring Outpipe onto your own infrastructure.
        </p>
        <div className={styles.sourceLinks}>
          <a
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            href="https://github.com/buildwithtechx/outpipe"
            target="_blank"
            rel="noreferrer"
          >
            <SiGithub className="size-4" />
            Explore the source
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
        <p className={styles.license}>AGPL-3.0 platform · MIT framework SDKs</p>
      </div>
      <ol className={styles.sourceDetails}>
        {openSourceDetails.map((detail) => (
          <li key={detail.number}>
            <span aria-hidden="true">{detail.number}</span>
            <div>
              <h3>{detail.title}</h3>
              <p>{detail.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TunnelGetStartedSection() {
  return (
    <section className={styles.cta} aria-labelledby="tunnel-start-title">
      <h2 className={styles.title} id="tunnel-start-title">
        Keep building locally.
        <br />
        <span>Let the world in.</span>
      </h2>
      <p className={styles.description}>
        A webhook, a teammate, a phone on your network.
        <br />
        Give your app a way to be reached.
      </p>
      <div className={styles.ctaActions}>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5"
        >
          Get started
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <a href={docsUrl()} className="pd-text-link">
          Read the docs
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function TunnelFeatureSections() {
  return (
    <>
      <TunnelDeveloperExperience />
      <TunnelNetworkDiagram />
      <TunnelAddressSections />
      <TunnelOpenSourceSection />
      <TunnelGetStartedSection />
    </>
  );
}
