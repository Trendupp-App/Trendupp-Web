import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

declare module 'axios' {
  export interface AxiosRequestConfig {
    // Best-effort requests (e.g. hydrating extra profile data after login)
    // shouldn't be able to log the user out if they happen to 401.
    skipAuthRedirect?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? '',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function formatValidationErrorMessage(message: unknown): string {
  if (!message) return '';

  if (Array.isArray(message)) {
    return message.map((msg) => formatSingleMessage(String(msg))).join('. ');
  }

  if (typeof message === 'string') {
    return formatSingleMessage(message);
  }

  return String(message);
}

function formatSingleMessage(msg: string): string {
  let formatted = msg.replace(/\b([a-z]+)((?:[A-Z][a-z]*)+)\b/g, (match) => {
    const words = match
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim();
    return words;
  });

  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  return formatted;
}

/** Routes a signed-out visitor may use — never bounce these to /signin. */
const PUBLIC_PATH_PREFIXES = [
  '/signin',
  '/user-type',
  '/creator/signup',
  '/advertiser/signup',
  '/forgot-password',
  '/auth/callback',
  '/terms',
  '/privacy',
  '/',
];

const isOnPublicPath = () => {
  const path = window.location.pathname;
  return PUBLIC_PATH_PREFIXES.some((p) => (p === '/' ? path === '/' : path.startsWith(p)));
};

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.startsWith('/auth/');
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !error.config?.skipAuthRedirect &&
      typeof window !== 'undefined'
    ) {
      console.warn(
        '[apiClient] 401 on',
        error.config?.url,
        '- clearing session and redirecting to /signin',
      );
      useAuthStore.getState().clearSession();
      if (hadSession && !isOnPublicPath()) {
        window.location.href = '/signin';
      }
    }

    if (error.response?.data?.message) {
      error.response.data.message = formatValidationErrorMessage(error.response.data.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
