<?php

declare(strict_types=1);

namespace App\Studio\Preview;

use App\Studio\Blocks\Block;
use App\Studio\Compiler\BladeCompiler;
use Illuminate\Support\Facades\Blade;

/**
 * Renders a block tree to HTML by compiling it to Blade (the same deterministic
 * compiler used at publish) and evaluating it against the real components. This
 * is what backs the editor's live preview — what you see is what publishing
 * produces.
 */
final class PreviewRenderer
{
    public function __construct(private readonly BladeCompiler $compiler) {}

    /**
     * @param  array<array-key, mixed>  $blocks  Decoded block-tree JSON.
     */
    public function render(array $blocks): string
    {
        $tree = array_map(
            static fn (mixed $block): Block => Block::fromArray((array) $block),
            array_values($blocks),
        );

        return Blade::render($this->compiler->compilePage($tree));
    }
}
