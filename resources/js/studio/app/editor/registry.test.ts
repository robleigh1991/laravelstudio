import { describe, it, expect } from 'vitest';
import { fieldsFor } from './registry';

describe('fieldsFor', () => {
  it('returns the editable fields for a known component', () => {
    expect(fieldsFor('hero').map((f) => f.key)).toEqual([
      'headline',
      'subheadline',
      'ctaLabel',
      'ctaHref',
    ]);
  });

  it('returns an empty list for an unknown component', () => {
    expect(fieldsFor('mystery')).toEqual([]);
  });
});
