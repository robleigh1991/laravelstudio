export interface FileEntry {
  name: string;
  type: 'dir' | 'file';
  path: string;
}

export interface TreeResponse {
  path: string;
  entries: FileEntry[];
}

export interface FileResponse {
  path: string;
  contents: string;
}

function csrfToken(): string {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') ?? '';
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const isMutation = method !== 'GET';

  const response = await fetch(url, {
    ...options,
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(isMutation ? { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken() } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function fetchTree(path = ''): Promise<TreeResponse> {
  return request<TreeResponse>(`/studio/api/tree?path=${encodeURIComponent(path)}`);
}

export function fetchFile(path: string): Promise<FileResponse> {
  return request<FileResponse>(`/studio/api/file?path=${encodeURIComponent(path)}`);
}

export function saveFile(path: string, contents: string): Promise<{ saved: boolean }> {
  return request('/studio/api/file', {
    method: 'PUT',
    body: JSON.stringify({ path, contents }),
  });
}

export function renameFile(from: string, to: string): Promise<{ renamed: boolean }> {
  return request('/studio/api/file/rename', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  });
}

export function duplicateFile(from: string, to: string): Promise<{ duplicated: boolean }> {
  return request('/studio/api/file/duplicate', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  });
}

export function deleteFile(path: string): Promise<{ deleted: boolean }> {
  return request('/studio/api/file', {
    method: 'DELETE',
    body: JSON.stringify({ path }),
  });
}
