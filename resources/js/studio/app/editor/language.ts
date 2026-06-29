/**
 * Map a file path to a Monaco language id. Pure + testable; the editor reads it
 * to pick syntax highlighting. Blade is treated as HTML until a dedicated
 * grammar lands (tracked in TASKS.md).
 */
export function detectLanguage(path: string): string {
  const lower = path.toLowerCase();

  if (lower.endsWith('.blade.php')) {
    return 'html';
  }

  const ext = lower.includes('.') ? lower.slice(lower.lastIndexOf('.') + 1) : '';

  switch (ext) {
    case 'php':
      return 'php';
    case 'css':
      return 'css';
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'html':
    case 'vue':
      return 'html';
    default:
      return 'plaintext';
  }
}
