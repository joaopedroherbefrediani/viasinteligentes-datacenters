import type { ContactPayload, SiteContent } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const raw = body?.message;
    const message = Array.isArray(raw) ? raw[0] : (raw ?? 'Não foi possível concluir a solicitação.');
    throw new ApiError(res.status === 429 ? 'Muitas tentativas. Aguarde um minuto e tente novamente.' : message, res.status);
  }
  return body as T;
}

export const api = {
  getContent: (signal?: AbortSignal) => request<SiteContent>('/content', { signal }),
  sendContact: (payload: ContactPayload) =>
    request<{ id: string; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
