import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  Globe,
  Laptop,
  Lock,
  Pause,
  Play,
  Server,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './tunnel-network.module.css';

const stages = [
  {
    key: 'local',
    title: 'Localhost',
    icon: Laptop,
    description: 'Your local server, still on your machine.',
    address: 'localhost:3000',
  },
  {
    key: 'secure',
    title: 'Secure tunnel',
    icon: Lock,
    description: 'A TLS-protected outbound connection.',
    address: 'No port forwarding',
  },
  {
    key: 'edge',
    title: 'Outpipe Edge',
    icon: Server,
    description: 'Routes public traffic to your local app.',
    address: 'The connection in between',
  },
  {
    key: 'public',
    title: 'Public Internet',
    icon: Globe,
    description: 'A public address, ready to share.',
    address: 'demo.outpipe.app',
  },
] as const;

export function TunnelNetworkDiagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    motionQuery.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);

    const element = sectionRef.current;
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => setOnScreen(entry?.isIntersecting ?? false),
            { threshold: 0.15 },
          );
    if (observer && element) observer.observe(element);
    else setOnScreen(true);

    return () => {
      motionQuery.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer?.disconnect();
    };
  }, []);

  const running =
    !paused && reducedMotion === false && onScreen && documentVisible;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="tunnel-connection-title"
      data-motion={running ? 'running' : 'paused'}
      data-reduced-motion={reducedMotion === true}
    >
      <div className={styles.heading}>
        <h2 className={styles.title} id="tunnel-connection-title">
          It just works.
        </h2>
        <p className={styles.description}>
          Your app stays on your machine. Outpipe connects it to the world.
          <br className={styles.desktopBreak} /> No port forwarding. No
          deployment. Just a connection.
        </p>
      </div>

      <div className={styles.diagram}>
        <div className={styles.track} aria-hidden="true">
          <span className={styles.packet} />
        </div>
        <ol
          className={styles.flow}
          aria-label="How a tunnel connects your local app to the internet"
        >
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <li
                className={styles.stage}
                key={stage.key}
                data-stage={stage.key}
              >
                <div className={styles.node} aria-hidden="true">
                  <span className={styles.glow} />
                  <span className={styles.pulse} />
                  <Icon className="size-8" strokeWidth={1.8} />
                </div>
                <div className={styles.stageCopy}>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  <span className={styles.address}>{stage.address}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.footer}>
        <p>
          Illustrative connection. Keep your app and CLI running to stay
          connected.
        </p>
        <div className={styles.actions}>
          <Link to="/plugins" className={styles.docsLink}>
            How the connection works
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          {reducedMotion === true ? (
            <span className={styles.staticPreview}>Static diagram</span>
          ) : (
            <button
              className={styles.motionControl}
              type="button"
              aria-label={
                paused
                  ? 'Resume connection animation'
                  : 'Pause connection animation'
              }
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? (
                <Play className="size-3" aria-hidden="true" />
              ) : (
                <Pause className="size-3" aria-hidden="true" />
              )}
              {paused ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
