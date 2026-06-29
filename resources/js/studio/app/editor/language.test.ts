import { describe, it, expect } from 'vitest';
import { detectLanguage } from './language';

describe('detectLanguage', () => {
  it('maps Blade files to html', () => {
    expect(detectLanguage('resources/views/welcome.blade.php')).toBe('html');
  });

  it('maps plain php files to php', () => {
    expect(detectLanguage('app/Studio/Compiler/BladeCompiler.php')).toBe('php');
  });

  it('maps common web extensions', () => {
    expect(detectLanguage('a.css')).toBe('css');
    expect(detectLanguage('a.js')).toBe('javascript');
    expect(detectLanguage('a.ts')).toBe('typescript');
    expect(detectLanguage('a.json')).toBe('json');
    expect(detectLanguage('a.md')).toBe('markdown');
    expect(detectLanguage('a.yml')).toBe('yaml');
    expect(detectLanguage('a.vue')).toBe('html');
  });

  it('falls back to plaintext for unknown or extensionless files', () => {
    expect(detectLanguage('LICENSE')).toBe('plaintext');
    expect(detectLanguage('a.xyz')).toBe('plaintext');
  });
});
