import { Link } from '@tanstack/react-router';
import { Activity, ArrowRight, Check, Database, Globe } from 'lucide-react';
import { docsUrl } from '#/lib/docs';
import { CopyButton } from './copy-button';
import styles from './tunnel-address.module.css';

function Command({ command, label }: { command: string; label: string }) {
  return (
    <div className={styles.command}>
      <span aria-hidden="true">$</span>
      <code>{command}</code>
      <CopyButton value={command} label={label} className={styles.copyButton} />
    </div>
  );
}

export function TunnelDomainSection() {
  return (
    <section
      className={`${styles.section} ${styles.domain}`}
      aria-labelledby="tunnel-domain-title"
    >
      <div className={styles.copy}>
        <h2 className={styles.title} id="tunnel-domain-title">
          Bring your
          <br />
          <span>own domain.</span>
        </h2>
        <p className={styles.lead}>
          A familiar address for the service on your machine. Connect a hostname
          you own, then use it for previews, callbacks, and integrations.
        </p>
        <ul className={styles.benefits}>
          <li>
            <Check className="size-4 shrink-0 text-emerald-400" />
            Automatic HTTPS for verified domains
          </li>
          <li>
            <Check className="size-4 shrink-0 text-emerald-400" />
            CNAME routing and TXT ownership verification
          </li>
          <li>
            <Check className="size-4 shrink-0 text-emerald-400" />
            The same address when you reconnect
          </li>
        </ul>
        <a
          href={docsUrl('platform-features/custom-domains')}
          className={styles.link}
        >
          Connect a domain
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
      <figure
        className={styles.domainDemo}
        aria-label="Illustrative custom-domain DNS configuration"
      >
        <div className={styles.browserBar}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <code>preview.example.com</code>
          <span className={styles.example}>EXAMPLE</span>
        </div>
        <div className={styles.domainHeader}>
          <span className={styles.domainIcon} aria-hidden="true">
            <Globe className="size-6" strokeWidth={1.5} />
          </span>
          <div>
            <p>Your domain, connected.</p>
            <span>Public address → localhost:3000</span>
          </div>
        </div>
        <dl className={styles.dnsRecords}>
          <div>
            <dt>
              <span>CNAME</span>Route visitors
            </dt>
            <dd>
              <code>preview.example.com</code>
              <span>Workspace-provided target</span>
            </dd>
          </div>
          <div>
            <dt>
              <span>TXT</span>Verify ownership
            </dt>
            <dd>
              <code>_outpipe-challenge.preview.example.com</code>
              <span>Your domain’s ownership token</span>
            </dd>
          </div>
        </dl>
        <div className={styles.domainCommand}>
          <Command
            command="outpipe 3000 --domain preview.example.com"
            label="Copy custom domain command"
          />
        </div>
        <figcaption>
          Illustrative configuration. Copy the exact DNS records from your
          workspace.
        </figcaption>
      </figure>
    </section>
  );
}

function LocalDevices() {
  return (
    <figure
      className={styles.localDemo}
      aria-label="Illustrative laptop, tablet, and phone accessing one local application"
    >
      <div className={styles.localGrid} aria-hidden="true" />
      <svg
        className={styles.deviceConnections}
        viewBox="0 0 600 390"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse
          cx="299"
          cy="211"
          rx="217"
          ry="128"
          stroke="#303030"
          strokeDasharray="4 6"
        />
        <ellipse cx="299" cy="211" rx="169" ry="90" stroke="#272727" />
        <path
          d="M270 165 168 268m144-99 102 76"
          stroke="#8d8d8d"
          strokeWidth="1.2"
        />
        <circle cx="270" cy="165" r="4" fill="#b3b3b3" />
        <circle cx="168" cy="268" r="4" fill="#8d8d8d" />
        <circle cx="414" cy="245" r="4" fill="#8d8d8d" />
      </svg>
      <div className={styles.laptop} aria-hidden="true">
        <div className={styles.laptopScreen}>
          <span className={styles.appLabel}>YOUR LOCAL APP</span>
          <span className={styles.appTitle}>Hello, network.</span>
          <div className={styles.appLines}>
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className={styles.laptopBase} />
      </div>
      <div className={styles.tablet} aria-hidden="true">
        <div>
          <span />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className={styles.phone} aria-hidden="true">
        <div>
          <span />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className={styles.localAddress}>
        <span className={styles.addressDot} aria-hidden="true" />
        <code>
          your-app<span>.local</span>
        </code>
        <small>ONE APP, SAME NETWORK</small>
      </div>
      <figcaption>
        Illustrative devices. Use the local address printed by the CLI.
      </figcaption>
    </figure>
  );
}

export function TunnelLocalSection() {
  return (
    <section
      className={`${styles.section} ${styles.local}`}
      aria-labelledby="tunnel-local-title"
    >
      <LocalDevices />
      <div className={styles.copy}>
        <h2 className={styles.title} id="tunnel-local-title">
          <span>.local,</span>
          <br />
          on every device.
        </h2>
        <p className={styles.lead}>
          Your phone is part of your dev environment, too. Add{' '}
          <code>--local</code> to advertise your app on your local network while
          keeping its public tunnel.
        </p>
        <Command
          command="outpipe 3000 --local"
          label="Copy local network command"
        />
        <p className={styles.localNote}>
          Devices need to share a network and support mDNS, such as Bonjour or
          Avahi. For trusted local HTTPS, install mkcert and trust its CA on
          each device; otherwise certificates are self-signed.
        </p>
        <Link to="/plugins" className={styles.link}>
          Explore local access
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

const protocols = [
  {
    name: 'HTTP / HTTPS',
    kind: 'http',
    use: 'Web apps, APIs, webhooks',
    description:
      'Give your development server a public URL. Receive real callbacks and share a preview without deploying it.',
    command: 'outpipe http 3000',
    label: 'Copy HTTP tunnel command',
    icon: Globe,
  },
  {
    name: 'TCP',
    kind: 'tcp',
    use: 'Databases, SSH, socket services',
    description:
      'Forward a stream-based service. Connect clients using the public host and port printed by the CLI.',
    command: 'outpipe tcp 5432',
    label: 'Copy TCP tunnel command',
    icon: Database,
  },
  {
    name: 'UDP',
    kind: 'udp',
    use: 'Games, datagrams, real-time services',
    description:
      'Forward datagrams to your local service and relay its responses. Use the assigned public endpoint.',
    command: 'outpipe udp 5000',
    label: 'Copy UDP tunnel command',
    icon: Activity,
  },
] as const;

export function TunnelProtocolsSection() {
  return (
    <section
      className={`${styles.section} ${styles.protocols}`}
      aria-labelledby="tunnel-protocols-title"
    >
      <div className={styles.protocolIntro}>
        <h2 className={styles.title} id="tunnel-protocols-title">
          Any protocol.
          <br />
          <span>One command away.</span>
        </h2>
        <p className={styles.lead}>
          An HTTP URL, a TCP stream, or a UDP endpoint. Pick the transport your
          service already speaks.
        </p>
      </div>
      <div className={styles.protocolGrid}>
        {protocols.map((protocol) => {
          const Icon = protocol.icon;
          return (
            <article className={styles.protocol} key={protocol.kind}>
              <span className={styles.protocolIcon}>
                <Icon className="size-6" strokeWidth={1.5} />
              </span>
              <h3>{protocol.name}</h3>
              <p className={styles.protocolUse}>{protocol.use}</p>
              <p className={styles.protocolDescription}>
                {protocol.description}
              </p>
              <Command command={protocol.command} label={protocol.label} />
            </article>
          );
        })}
      </div>
      <div className={styles.protocolFooter}>
        <p>
          Raw TCP and UDP services still need their own authentication and
          encryption.
        </p>
        <a
          href={docsUrl('concepts/protocol')}
          className={styles.link}
        >
          Choose your protocol
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function TunnelAddressSections() {
  return (
    <>
      <TunnelDomainSection />
      <TunnelLocalSection />
      <TunnelProtocolsSection />
    </>
  );
}
