// Cliente HTTP minimalista. Las rutas viven en el mismo origen porque
// Vite proxy las reenvía al backend (http://localhost:5000).

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && (data as { error: string }).error) ||
      `HTTP ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get:    <T>(url: string)              => request<T>('GET',    url),
  post:   <T>(url: string, body: unknown) => request<T>('POST',   url, body),
  put:    <T>(url: string, body: unknown) => request<T>('PUT',    url, body),
  delete: <T>(url: string)              => request<T>('DELETE', url),
};
