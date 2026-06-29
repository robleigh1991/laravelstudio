import { describe, it, expect } from 'vitest';
import { resolveClasses } from './classResolver';

describe('resolveClasses (TS mirror of PHP ClassResolver)', () => {
  it('emits base classes without a prefix', () => {
    expect(resolveClasses({ base: ['bg-white', 'py-12'] })).toBe('bg-white py-12');
  });

  it('prefixes breakpoints mobile-first in a stable order', () => {
    expect(resolveClasses({ lg: ['py-28'], base: ['py-12'], md: ['py-20'] })).toBe(
      'py-12 md:py-20 lg:py-28',
    );
  });

  it('emits the dark variant last', () => {
    expect(resolveClasses({ dark: ['bg-black'], base: ['bg-white'] })).toBe(
      'bg-white dark:bg-black',
    );
  });

  it('ignores empty and blank classes', () => {
    expect(resolveClasses({ base: ['flex', '  ', ''], md: [] })).toBe('flex');
  });

  it('is deterministic for identical input', () => {
    const input = { base: ['a', 'b'], md: ['c'], lg: ['d'] };
    expect(resolveClasses(input)).toBe(resolveClasses(input));
  });
});
