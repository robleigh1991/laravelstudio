<?php

declare(strict_types=1);

namespace App\Studio\Blocks;

/**
 * Flattens a per-breakpoint class map into a single, deterministic Tailwind
 * class string. This is the heart of the responsive model — see
 * docs/block-schema.md.
 *
 * Determinism is a hard requirement: identical input must always produce
 * byte-identical output, so re-publishing an unchanged page yields no git diff.
 */
final class ClassResolver
{
    /**
     * Stable emit order. Mobile-first: `base` has no prefix; the rest are
     * prefixed with `{breakpoint}:`. `dark` is emitted last.
     *
     * @var array<string, string> map of breakpoint key => Tailwind prefix
     */
    private const ORDER = [
        'base' => '',
        'sm' => 'sm:',
        'md' => 'md:',
        'lg' => 'lg:',
        'xl' => 'xl:',
        '2xl' => '2xl:',
        'dark' => 'dark:',
    ];

    /**
     * @param  array<string, list<string>>  $classes
     */
    public function resolve(array $classes): string
    {
        $out = [];

        foreach (self::ORDER as $key => $prefix) {
            foreach ($classes[$key] ?? [] as $cls) {
                $cls = trim($cls);
                if ($cls === '') {
                    continue;
                }
                $out[] = $prefix === '' ? $cls : $prefix.$cls;
            }
        }

        return implode(' ', $out);
    }
}
