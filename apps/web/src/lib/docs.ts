import { env } from '#/env';

export function docsUrl(path = '') {
  const defaultUrl = import.meta.env.DEV
    ? 'http://localhost:4323'
    : 'https://docs.outpipe.dev';
  const base = (env.VITE_OUTPIPE_DOCS_URL ?? defaultUrl).replace(
    /\/+$/,
    '',
  );
  const suffix = path.replace(/^\/+/, '');
  return suffix ? `${base}/${suffix}` : `${base}/`;
}
