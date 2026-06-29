<?php

declare(strict_types=1);

use App\Studio\Blocks\Block;
use App\Studio\Compiler\BladeCompiler;

it('compiles a simple block with string props and resolved classes', function () {
    $block = Block::fromArray([
        'id' => 'b1',
        'type' => 'hero',
        'props' => ['headline' => 'Welcome', 'ctaLabel' => 'Get started'],
        'classes' => ['base' => ['bg-white', 'py-12'], 'md' => ['py-20']],
    ]);

    $blade = (new BladeCompiler)->compileBlock($block);

    expect($blade)->toBe(<<<'BLADE'
        <x-hero
            ctaLabel="Get started"
            headline="Welcome"
            class="bg-white py-12 md:py-20"
        />
        BLADE);
});

it('emits array props as bound :attributes with PHP literals', function () {
    $block = Block::fromArray([
        'id' => 'b2',
        'type' => 'features',
        'props' => ['items' => [['title' => 'Visual', 'body' => 'Edit visually.']]],
    ]);

    $blade = (new BladeCompiler)->compileBlock($block);

    expect($blade)->toContain(":items=\"[['title' => 'Visual', 'body' => 'Edit visually.']]\"");
});

it('compiles nested children inside a parent component', function () {
    $block = Block::fromArray([
        'id' => 'wrap',
        'type' => 'container',
        'children' => [
            ['id' => 'c1', 'type' => 'footer', 'props' => ['copyright' => '2026']],
        ],
    ]);

    $blade = (new BladeCompiler)->compileBlock($block);

    expect($blade)
        ->toContain('<x-container>')
        ->toContain('<x-footer')
        ->toContain('</x-container>');
});

it('produces byte-identical output on repeated compilation (deterministic)', function () {
    $blocks = [
        Block::fromArray(['id' => 'b1', 'type' => 'hero', 'props' => ['headline' => 'Hi'], 'classes' => ['lg' => ['py-28'], 'base' => ['py-12']]]),
        Block::fromArray(['id' => 'b2', 'type' => 'footer', 'props' => ['copyright' => '2026']]),
    ];

    $compiler = new BladeCompiler;

    expect($compiler->compilePage($blocks))->toBe($compiler->compilePage($blocks));
});

it('orders props alphabetically regardless of input order', function () {
    $a = Block::fromArray(['id' => 'b', 'type' => 'hero', 'props' => ['z' => '1', 'a' => '2']]);
    $b = Block::fromArray(['id' => 'b', 'type' => 'hero', 'props' => ['a' => '2', 'z' => '1']]);

    $compiler = new BladeCompiler;

    expect($compiler->compileBlock($a))->toBe($compiler->compileBlock($b));
});

it('escapes double quotes in string prop values', function () {
    $block = Block::fromArray(['id' => 'b', 'type' => 'hero', 'props' => ['headline' => 'Say "hi"']]);

    expect((new BladeCompiler)->compileBlock($block))->toContain('headline="Say &quot;hi&quot;"');
});
