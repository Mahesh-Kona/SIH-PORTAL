// Dynamic API base URL configuration for different environments
export const apiBase = import.meta.env.VITE_API_BASE || 
  (import.meta.env.MODE === 'development' ? 'http://localhost:4000/api' : '/api');

export async function apiGet(path: string) {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  });
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!text && res.ok) {
    // Gracefully handle empty successful responses
    return [];
  }
  if (contentType.includes('application/json')) {
    try {
      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json.error || 'Request failed');
      return json;
    } catch {
      throw new Error('Unexpected response from server');
    }
  }
  throw new Error('Unexpected response from server');
}

export async function apiSend(path: string, options: RequestInit = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  const isJson = contentType.includes('application/json');
  const parsed = isJson && text ? JSON.parse(text) : (text ? text : {});
  if (!res.ok) {
    const message = isJson && parsed && (parsed as any).error ? (parsed as any).error : 'Request failed';
    throw new Error(message);
  }
  return isJson ? (parsed || {}) : (text ? { data: text } : {});
}


