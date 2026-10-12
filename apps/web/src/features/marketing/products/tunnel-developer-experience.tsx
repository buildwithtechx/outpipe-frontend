import { Link } from '@tanstack/react-router';
import { Activity, ArrowRight, Code2, Terminal } from 'lucide-react';
import { type KeyboardEvent, useId, useRef, useState } from 'react';
import { SiExpress, SiNextdotjs, SiVite } from 'react-icons/si';
import { CopyButton } from './copy-button';
import { HighlightedTunnelCode } from './tunnel-code-tokenizer';
import styles from './tunnel-developer.module.css';

export const TUNNEL_PLUGINS = [
  {
    id: 'vite',
    name: 'Vite',
    file: 'vite.config.ts',
    install: 'npm install --save-dev @outpipe/vite',
    icon: SiVite,
    code: 'import { defineConfig } from "vite";\nimport outpipe from "@outpipe/vite";\n\nexport default defineConfig({\n  plugins: [outpipe({\n    apiKey: process.env.OUTPIPE_API_KEY,\n  })],\n});',
  },
  {
    id: 'next',
    name: 'Next.js',
    file: 'next.config.ts',
    install: 'npm install @outpipe/next',
    icon: SiNextdotjs,
    code: 'import withOutpipe from "@outpipe/next";\n\nexport default withOutpipe(\n  {},\n  {\n    apiKey: process.env.OUTPIPE_API_KEY,\n  },\n);',
  },
  {
    id: 'express',
    name: 'Express',
    file: 'server.ts',
    install: 'npm install @outpipe/express',
    icon: SiExpress,
    code: 'import express from "express";\nimport outpipe from "@outpipe/express";\n\nconst app = express();\noutpipe(app, {\n  apiKey: process.env.OUTPIPE_API_KEY,\n});\napp.listen(3000);',
  },
] as const;

export function tunnelPluginIndexFromKey(
  current: number,
  key: string,
): number | null {
  if (key === 'ArrowRight') return (current + 1) % TUNNEL_PLUGINS.length;
  if (key === 'ArrowLeft')
    return (current + TUNNEL_PLUGINS.length - 1) % TUNNEL_PLUGINS.length;
  if (key === 'Home') return 0;
  if (key === 'End') return TUNNEL_PLUGINS.length - 1;
  return null;
}

const exampleRequests = [
  {
    method: 'POST',
    path: '/webhooks/payment',
    status: '201 Created',
    duration: '58 ms',
    body: '{\n  "received": true,\n  "event": "payment.completed"\n}',
  },
  {
    method: 'GET',
    path: '/api/orders',
    status: '200 OK',
    duration: '24 ms',
    body: '{\n  "orders": [],\n  "hasMore": false\n}',
  },
  {
    method: 'PUT',
    path: '/api/account',
    status: '200 OK',
    duration: '41 ms',
    body: '{\n  "updated": true\n}',
  },
  {
    method: 'GET',
    path: '/api/health',
    status: '503 Unavailable',
    duration: '12 ms',
    body: '{\n  "healthy": false,\n  "dependency": "database"\n}',
  },
] as const;

function PluginTabs() {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = tunnelPluginIndexFromKey(index, event.key);
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.pluginDemo}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Tunnel framework integration"
      >
        {TUNNEL_PLUGINS.map((plugin, index) => {
          const Icon = plugin.icon;
          return (
            <button
              key={plugin.id}
              type="button"
              role="tab"
              id={`${id}-tab-${plugin.id}`}
              aria-controls={`${id}-panel-${plugin.id}`}
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => handleKey(event, index)}
            >
              <Icon aria-hidden="true" focusable="false" />
              {plugin.name}
            </button>
          );
        })}
      </div>
      {TUNNEL_PLUGINS.map((plugin, index) => (
        <div
          key={plugin.id}
          className={styles.pluginPanel}
          role="tabpanel"
          id={`${id}-panel-${plugin.id}`}
          aria-labelledby={`${id}-tab-${plugin.id}`}
          hidden={selected !== index}
        >
          <div className={styles.codeWindow}>
            <div className={styles.codeHeader}>
              <span>{plugin.file}</span>
              <CopyButton
                value={plugin.code}
                label={`Copy ${plugin.name} integration`}
                className={styles.copyButton}
              />
            </div>
            <pre className={styles.code}>
              <code>
                <HighlightedTunnelCode source={plugin.code} styles={styles} />
              </code>
            </pre>
          </div>
          <div className={styles.pluginFooter}>
            <code>{plugin.install}</code>
            <Link to="/plugins/$pluginId" params={{ pluginId: plugin.id }}>
              Setup guide
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ))}
      <p className={styles.tokenNote}>
        Use a server-side token with tunnel access. Never expose it in client
        code.
      </p>
    </div>
  );
}

function RequestInspection() {
  const id = useId();
  const [selected, setSelected] = useState(0);
  const request = exampleRequests[selected];

  return (
    <article className={`${styles.card} ${styles.inspectionCard}`}>
      <div className={styles.cardHeading}>
        <span className={styles.icon}>
          <Activity className="size-5" aria-hidden="true" />
        </span>
        <h3>Inspect every request</h3>
      </div>
      <p className={styles.description}>
        Follow HTTP traffic through your tunnel. Enable request capture to look
        closer at headers and supported payloads.
      </p>
      <div className={styles.inspector}>
        <div className={styles.inspectorHeader}>
          <span>Requests</span>
          <span>Example · capture enabled</span>
        </div>
        <ul className={styles.requestList} aria-label="Example tunnel requests">
          {exampleRequests.map((item, index) => (
            <li key={item.path}>
              <button
                type="button"
                aria-pressed={selected === index}
                aria-controls={`${id}-request-detail`}
                aria-label={`Inspect ${item.method} ${item.path}, ${item.status}`}
                className={styles.requestRow}
                onClick={() => setSelected(index)}
              >
                <span className={styles.method}>{item.method}</span>
                <code>{item.path}</code>
                <span
                  className={styles.status}
                  data-error={item.status.startsWith('5')}
                >
                  {item.status.slice(0, 3)}
                </span>
                <span className={styles.duration}>{item.duration}</span>
              </button>
            </li>
          ))}
        </ul>
        <section
          className={styles.requestDetail}
          id={`${id}-request-detail`}
          aria-label="Selected example request"
        >
          <div className={styles.detailTitle}>
            <code>
              {request.method} {request.path}
            </code>
            <span>Response</span>
          </div>
          <dl className={styles.metadata}>
            <div>
              <dt>Status</dt>
              <dd data-error={request.status.startsWith('5')}>
                {request.status}
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{request.duration}</dd>
            </div>
            <div>
              <dt>Content type</dt>
              <dd>application/json</dd>
            </div>
          </dl>
          <pre className={styles.response}>
            <code>{request.body}</code>
          </pre>
        </section>
      </div>
      <span className={styles.srOnly} role="status">
        Showing example {request.method} {request.path}, {request.status},{' '}
        {request.duration}.
      </span>
      <div className={styles.inspectionFooter}>
        <span>See the request, not just the status.</span>
        <Link to="/plugins">
          Explore Tunnels
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function TunnelDeveloperExperience() {
  return (
    <section
      className={styles.section}
      aria-labelledby="tunnel-developer-title"
    >
      <div className={styles.heading}>
        <h2 className={styles.title} id="tunnel-developer-title">
          First-class developer experience
        </h2>
        <p>
          Less setup. More building. Outpipe fits right into the tools you
          already use.
        </p>
      </div>
      <div className={styles.grid}>
        <div className={styles.tools}>
          <article className={`${styles.card} ${styles.commandCard}`}>
            <div className={styles.cardHeading}>
              <span className={styles.icon}>
                <Terminal className="size-5" aria-hidden="true" />
              </span>
              <h3>Online in one line</h3>
            </div>
            <p className={styles.description}>
              Start your app. Point Outpipe at its port. Get a public address
              without deploying a thing.
            </p>
            <div className={styles.command}>
              <span aria-hidden="true">$</span>
              <code>npx outpipe 3000</code>
              <CopyButton
                value="npx outpipe 3000"
                label="Copy CLI quickstart"
                className={styles.copyButton}
              />
            </div>
          </article>
          <article className={`${styles.card} ${styles.pluginCard}`}>
            <div className={styles.cardHeading}>
              <span className={styles.icon}>
                <Code2 className="size-5" aria-hidden="true" />
              </span>
              <h3>Fits into your workflow</h3>
            </div>
            <p className={styles.description}>
              Prefer your usual dev command? Let a framework plugin open the
              tunnel when your server starts.
            </p>
            <PluginTabs />
          </article>
        </div>
        <RequestInspection />
      </div>
    </section>
  );
}
