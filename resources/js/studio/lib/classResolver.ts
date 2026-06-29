import type { ClassMap } from '../types/block';

/**
 * Flattens a per-breakpoint class map into a single, deterministic Tailwind
 * class string. This is the TS mirror of App\Studio\Blocks\ClassResolver (PHP)
 * — the editor's live preview must produce the same classes the compiler will.
 *
 * Keep these two in lockstep: any change here needs the same change in PHP,
 * and both are covered by determinism tests.
 */
const ORDER: Record<string, string> = {
  base: '',
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
  dark: 'dark:',
};

export function resolveClasses(classes: ClassMap = {}): string {
  const out: string[] = [];

  for (const [key, prefix] of Object.entries(ORDER)) {
    const group = classes[key as keyof ClassMap] ?? [];
    for (const raw of group) {
      const cls = String(raw).trim();
      if (cls === '') continue;
      out.push(prefix === '' ? cls : prefix + cls);
    }
  }

  return out.join(' ');
}
