export interface PropField {
  key: string;
  label: string;
}

/**
 * Editable text props per component type — the seed of the component registry.
 * The inspector renders a field for each, whether or not the block has set it
 * yet. Complex props (e.g. feature item arrays) get dedicated editors later.
 */
export const componentFields: Record<string, PropField[]> = {
  hero: [
    { key: 'headline', label: 'Headline' },
    { key: 'subheadline', label: 'Subheadline' },
    { key: 'ctaLabel', label: 'Button label' },
    { key: 'ctaHref', label: 'Button link' },
  ],
  features: [{ key: 'heading', label: 'Heading' }],
  footer: [{ key: 'copyright', label: 'Copyright' }],
  header: [{ key: 'brand', label: 'Brand' }],
  cta: [
    { key: 'heading', label: 'Heading' },
    { key: 'subheading', label: 'Subheading' },
    { key: 'buttonLabel', label: 'Button label' },
    { key: 'buttonHref', label: 'Button link' },
  ],
  faq: [{ key: 'heading', label: 'Heading' }],
};

export function fieldsFor(type: string): PropField[] {
  return componentFields[type] ?? [];
}
