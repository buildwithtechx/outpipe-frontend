export const productIds = [
  'tunnels',
  'observability',
  'secrets',
  'uptime',
] as const;

export type ProductId = (typeof productIds)[number];

type ProductContent = {
  name: string;
  number: string;
  title: string;
  description: string;
  summary: string;
  tags: readonly string[];
  workflow: {
    title: string;
    description: string;
    steps: readonly { title: string; description: string }[];
    label: string;
    code: string;
    note: string;
  };
  capabilities: readonly { title: string; description: string }[];
  useCases: readonly { title: string; description: string }[];
  next: ProductId;
  connection: string;
};

export const products: Record<ProductId, ProductContent> = {
  tunnels: {
    name: 'Tunnels',
    number: '01',
    title: 'Give your local service a public address.',
    description:
      'Share a development server, receive a real webhook, or connect to a TCP service. Outpipe forwards traffic to localhost while you keep working in your own environment.',
    summary: 'A public URL for the service running on your machine.',
    tags: ['HTTP · TCP · UDP', 'Custom domains', 'Request inspection'],
    workflow: {
      title: 'From local to reachable.',
      description:
        'Keep your existing development server. Add the CLI, authenticate, and open a tunnel to its port.',
      steps: [
        {
          title: 'Run your service',
          description:
            'Start your app on localhost, just as you normally would.',
        },
        {
          title: 'Open a tunnel',
          description:
            'Point Outpipe at the local port. Use a reserved subdomain when you need a consistent HTTP address.',
        },
        {
          title: 'Share and inspect',
          description:
            'Send the public URL to a teammate or webhook provider, then review incoming requests in the console.',
        },
      ],
      label: 'Terminal',
      code: 'npm install -g outpipe\noutpipe login\noutpipe 3000\n\n# Use your reserved HTTP subdomain\noutpipe 3000 --subdomain orders',
      note: 'Your local service and CLI stay running while the tunnel is live. Reserved subdomains and custom domains require the appropriate account access.',
    },
    capabilities: [
      {
        title: 'More than HTTP',
        description:
          'Forward HTTP, TCP, and UDP traffic. Use public URLs for web apps and remote ports for TCP or UDP services.',
      },
      {
        title: 'An address you recognize',
        description:
          'Reserve an HTTP subdomain or connect a verified custom domain, so integrations can use the same address next time.',
      },
      {
        title: 'Inspect the exchange',
        description:
          'Review request methods, paths, status codes, and timing. Enable full capture when you need supported headers and bodies.',
      },
      {
        title: 'Fits your development setup',
        description:
          'Use the CLI directly or integrate a development tunnel with the Next.js, Vite, Express, or NestJS plugins.',
      },
    ],
    useCases: [
      {
        title: 'Webhook development',
        description:
          'Receive events from external services on the handler you are editing locally.',
      },
      {
        title: 'Review without a deployment',
        description:
          'Give a teammate or client a link to a running development server.',
      },
      {
        title: 'Device testing',
        description:
          'Open your local web app from another device using its public HTTPS URL.',
      },
    ],
    next: 'observability',
    connection:
      'A tunnel shows what reached your app. Observability shows what happened inside it.',
  },
  observability: {
    name: 'Observability',
    number: '02',
    title: 'Find the story behind a request.',
    description:
      'Bring server-side traces, structured logs, and metrics into one workspace. Follow a request into its dependencies and see where time was spent, without piecing together disconnected output.',
    summary: 'Traces, logs, and metrics with shared request context.',
    tags: ['OpenTelemetry', 'Node.js SDK', 'Framework adapters'],
    workflow: {
      title: 'Instrument once. Follow the context.',
      description:
        "Start telemetry before your server imports its framework and dependencies. Outpipe's distribution handles common instrumentation for you.",
      steps: [
        {
          title: 'Create an ingest token',
          description:
            'Give a server-side token the Send telemetry permission.',
        },
        {
          title: 'Start the SDK first',
          description:
            'Set the service name and environment in your server bootstrap, before importing the app.',
        },
        {
          title: 'Follow a real request',
          description:
            'Send traffic, open its trace, and investigate spans, related logs, and service metrics in the console.',
        },
      ],
      label: 'bootstrap.ts · server only',
      code: 'import { startOutpipeObservability }\n  from "@outpipe/observability";\n\nconst telemetry = startOutpipeObservability({\n  apiKey: process.env.OBSERVABILITY_TOKEN,\n  serviceName: "orders-api",\n  environment: "production",\n  captureConsole: true,\n});\n\nawait import("./server.js");',
      note: 'Install @outpipe/observability first. Keep the token on the server; never bundle it into browser code. Console capture is opt-in, and telemetry does not require a tunnel.',
    },
    capabilities: [
      {
        title: 'Request and dependency spans',
        description:
          'Automatically instrument common Node.js HTTP libraries, frameworks, databases, and clients. Add child spans for your own operations.',
      },
      {
        title: 'Logs with their context',
        description:
          'Send structured application logs with the active trace and span context. Opt in to console capture while keeping normal local output.',
      },
      {
        title: 'Metrics for the service',
        description:
          'Inspect request counts, duration, and active requests from framework adapters. Use the OpenTelemetry meter for custom application metrics.',
      },
      {
        title: 'Capture under your control',
        description:
          'Framework adapters can opt in to bounded JSON and form payload capture, with sensitive fields redacted and additional redaction rules you define.',
      },
    ],
    useCases: [
      {
        title: 'A slow endpoint',
        description:
          'Separate time spent in the request handler from calls to a database or external service.',
      },
      {
        title: 'An error with missing context',
        description:
          'Read a failure and its related application logs within the request that produced them.',
      },
      {
        title: 'An operation worth measuring',
        description:
          'Wrap a background job or business operation in a custom span and record application metrics.',
      },
    ],
    next: 'secrets',
    connection:
      'Keep your observability token server-side. Secrets can deliver it to the process at runtime.',
  },
  secrets: {
    name: 'Secrets',
    number: '03',
    title: 'Keep configuration out of the handoff.',
    description:
      'Organize encrypted values in vaults and environments, keep a history of changes, and inject the right configuration into a running command. Your team can share a source of truth without passing around dotenv files.',
    summary: 'Encrypted, versioned configuration delivered at runtime.',
    tags: ['Environment vaults', 'Version history', 'CLI injection'],
    workflow: {
      title: 'Store once. Inject when needed.',
      description:
        'Organize secrets by vault and environment. Authenticate the CLI to inject them directly into your development process.',
      steps: [
        {
          title: 'Create a vault',
          description:
            'Group configuration by project, application, or service tier.',
        },
        {
          title: 'Add environments',
          description:
            'Set up development, staging, and production values with audit tracking.',
        },
        {
          title: 'Inject into processes',
          description:
            'Run commands with ephemeral environment variable injection.',
        },
      ],
      label: 'Terminal',
      code: 'outpipe secrets run --env development -- npm run dev',
      note: 'Values are decrypted on demand and injected directly into child process memory, never written to disk.',
    },
    capabilities: [
      {
        title: 'Zero-knowledge encryption',
        description:
          'Secrets are encrypted before storage and only decrypted in-process during runtime injection.',
      },
      {
        title: 'Granular access control',
        description:
          'Grant environment and vault access by team member, service account, or machine token.',
      },
      {
        title: 'Audit logging',
        description:
          'Track every read, write, and rotation event with timestamp and actor attribution.',
      },
      {
        title: 'CLI integration',
        description:
          'Inject secrets into any script or tool without modifying source code.',
      },
    ],
    useCases: [
      {
        title: 'Local development secrets',
        description:
          'Share local dev environment variables across teammates without checking them into git.',
      },
      {
        title: 'CI/CD runner injection',
        description:
          'Deliver ephemeral credentials to automated build pipelines securely.',
      },
      {
        title: 'Secret rotation',
        description:
          'Rotate database and API keys centrally across distributed deployments.',
      },
    ],
    next: 'uptime',
    connection:
      'Keep your secrets safe. Monitor your service health to verify that credentials remain valid.',
  },
  uptime: {
    name: 'Uptime',
    number: '04',
    title: 'Know when services stop responding.',
    description:
      'Monitor HTTP endpoints, ping TCP ports, and publish branded public status pages. Receive instant notifications across email, Slack, and webhooks.',
    summary: 'Multi-region synthetic checks and public status pages.',
    tags: ['Synthetic monitoring', 'Multi-region checks', 'Status pages'],
    workflow: {
      title: 'Configure once. Monitor continuously.',
      description:
        'Add target endpoints, configure thresholds, and get alerted immediately on outage or latency spikes.',
      steps: [
        {
          title: 'Create a monitor',
          description:
            'Specify the target URL, interval, and assertions for healthy responses.',
        },
        {
          title: 'Set up alert routes',
          description:
            'Connect email, Slack, or webhook integrations for on-call notification.',
        },
        {
          title: 'Publish a status page',
          description:
            'Show real-time incident reports and component status under your custom domain.',
        },
      ],
      label: 'Health Check Spec',
      code: 'GET https://api.acme.com/health\nExpected: 200 OK\nInterval: 30s\nRegions: us-east, eu-west, ap-south',
      note: 'Monitors check automatically from distributed edge nodes and verify TLS certificate expiry.',
    },
    capabilities: [
      {
        title: 'Multi-region probes',
        description:
          'Probe endpoints from multiple geographic regions simultaneously to eliminate false positives.',
      },
      {
        title: 'SSL / TLS monitoring',
        description:
          'Get early warnings before TLS certificates expire or handshakes degrade.',
      },
      {
        title: 'Custom status pages',
        description:
          'Display service health and incident timelines on your own verified domain.',
      },
      {
        title: 'Incident history',
        description:
          'Track historical uptime percentages, mean time to recovery, and response latencies.',
      },
    ],
    useCases: [
      {
        title: 'API endpoint health',
        description:
          'Ensure payment gateways, auth endpoints, and internal microservices are operational.',
      },
      {
        title: 'Customer communication',
        description:
          'Provide a transparent status page for end users during maintenance windows.',
      },
      {
        title: 'SLA verification',
        description:
          'Generate compliance reports showing achieved uptime against contractual SLAs.',
      },
    ],
    next: 'tunnels',
    connection:
      'From local tunnels to live production services: complete lifecycle coverage in Outpipe.',
  },
};
