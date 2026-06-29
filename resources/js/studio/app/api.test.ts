import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchTree, saveFile, renameFile } from './api';

type FetchMock = ReturnType<typeof vi.fn>;

function stubFetch(impl: FetchMock) {
  vi.stubGlobal('fetch', impl);
}

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchTree returns the parsed entries', async () => {
    stubFetch(
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ path: '', entries: [{ name: 'views', type: 'dir', path: 'views' }] }),
      }),
    );

    const result = await fetchTree('');
    expect(result.entries[0].name).toBe('views');
  });

  it('throws with the server-provided message on error', async () => {
    stubFetch(
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ message: 'Path is outside the project root.' }),
      }),
    );

    await expect(fetchTree('..')).rejects.toThrow('Path is outside the project root.');
  });

  it('saveFile issues a PUT with a CSRF header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ saved: true }),
    });
    stubFetch(fetchMock);

    await saveFile('studio/pages/home.json', '{}');

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = options.headers as Record<string, string>;
    expect(options.method).toBe('PUT');
    expect(headers).toHaveProperty('X-CSRF-TOKEN');
  });

  it('renameFile POSTs from/to to the rename endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ renamed: true }),
    });
    stubFetch(fetchMock);

    await renameFile('a.json', 'b.json');

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/studio/api/file/rename');
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ from: 'a.json', to: 'b.json' }));
  });
});
