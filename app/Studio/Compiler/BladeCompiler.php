<?php

declare(strict_types=1);

namespace App\Studio\Compiler;

use App\Studio\Blocks\Block;
use App\Studio\Blocks\ClassResolver;

/**
 * Compiles a block tree into clean, deterministic Blade markup using
 * <x-...> component tags.
 *
 * Guarantees (covered by Pest round-trip tests):
 *  - Deterministic: identical block tree -> byte-identical Blade.
 *  - Props are emitted in a stable (alphabetical) order.
 *  - Per-breakpoint classes are flattened mobile-first via ClassResolver.
 *
 * See docs/block-schema.md.
 */
final class BladeCompiler
{
    private const INDENT = '    ';

    public function __construct(
        private readonly ClassResolver $classResolver = new ClassResolver,
    ) {}

    /**
     * Compile an ordered list of top-level blocks into a Blade page body.
     *
     * @param  list<Block>  $blocks
     */
    public function compilePage(array $blocks): string
    {
        $compiled = array_map(
            fn (Block $block): string => $this->compileBlock($block, 0),
            $blocks,
        );

        return implode("\n\n", $compiled)."\n";
    }

    public function compileBlock(Block $block, int $indent = 0): string
    {
        $pad = str_repeat(self::INDENT, $indent);
        $tag = 'x-'.$block->type;
        $attributes = $this->attributesFor($block);
        $hasChildren = $block->children !== [];

        if ($attributes === []) {
            $open = $hasChildren ? "{$pad}<{$tag}>" : "{$pad}<{$tag} />";
        } else {
            $lines = array_map(fn (string $a): string => "{$pad}".self::INDENT.$a, $attributes);
            $body = implode("\n", $lines);
            $close = $hasChildren ? "\n{$pad}>" : "\n{$pad}/>";
            $open = "{$pad}<{$tag}\n{$body}{$close}";
        }

        if (! $hasChildren) {
            return $open;
        }

        $inner = implode("\n\n", array_map(
            fn (Block $child): string => $this->compileBlock($child, $indent + 1),
            $block->children,
        ));

        return "{$open}\n{$inner}\n{$pad}</{$tag}>";
    }

    /**
     * Build the ordered list of attribute strings for a block.
     *
     * @return list<string>
     */
    private function attributesFor(Block $block): array
    {
        $attributes = [];

        // Stable, alphabetical prop order keeps output deterministic.
        $props = $block->props;
        ksort($props);

        foreach ($props as $key => $value) {
            if (is_string($value)) {
                $attributes[] = sprintf('%s="%s"', $key, htmlspecialchars($value, ENT_QUOTES));
            } else {
                $attributes[] = sprintf(':%s="%s"', $key, $this->phpLiteral($value));
            }
        }

        $classes = $this->classResolver->resolve($block->classes);
        if ($classes !== '') {
            $attributes[] = sprintf('class="%s"', $classes);
        }

        return $attributes;
    }

    /**
     * Render a non-string prop value as a PHP literal for a bound (:prop) attribute.
     */
    private function phpLiteral(mixed $value): string
    {
        if (is_array($value)) {
            $isList = array_is_list($value);
            $parts = [];
            foreach ($value as $k => $v) {
                $parts[] = $isList
                    ? $this->phpLiteral($v)
                    : sprintf("'%s' => %s", $this->escapeSingle((string) $k), $this->phpLiteral($v));
            }

            return '['.implode(', ', $parts).']';
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_string($value)) {
            return "'".$this->escapeSingle($value)."'";
        }

        if ($value === null) {
            return 'null';
        }

        return (string) $value;
    }

    private function escapeSingle(string $value): string
    {
        return str_replace("'", "\\'", $value);
    }
}
