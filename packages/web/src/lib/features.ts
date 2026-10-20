/**
 * Runtime feature flags.
 *
 * The online search backend (packages/api) is not deployed yet, so the deployed
 * build must not advertise a search that cannot work. Online search is enabled
 * in development by default and can be switched on in production builds with
 * `VITE_ENABLE_ONLINE_SEARCH=true` once an API host exists.
 */
export const isOnlineSearchEnabled = (): boolean => {
  const flag = import.meta.env.VITE_ENABLE_ONLINE_SEARCH;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return Boolean(import.meta.env.DEV);
};

/**
 * Base URL for the search API.
 *
 * - `VITE_API_URL` wins when set (stripped of any trailing slash).
 * - Development falls back to the local API server.
 * - Production falls back to same-origin `/api`, which works when the API is
 *   deployed behind the same host or a reverse proxy.
 */
export const resolveApiBaseUrl = (): string => {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return configured.replace(/\/+$/, '');
  if (import.meta.env.DEV) return 'http://localhost:3001';
  return '';
};
