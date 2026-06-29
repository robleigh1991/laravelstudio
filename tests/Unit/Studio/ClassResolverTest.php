<?php

declare(strict_types=1);

use App\Studio\Blocks\ClassResolver;

it('resolves base classes with no prefix', function () {
    $resolver = new ClassResolver;

    expect($resolver->resolve(['base' => ['bg-white', 'py-12']]))
        ->toBe('bg-white py-12');
});

it('prefixes breakpoint classes mobile-first in a stable order', function () {
    $resolver = new ClassResolver;

    $result = $resolver->resolve([
        'lg' => ['py-28'],
        'base' => ['py-12'],
        'md' => ['py-20'],
    ]);

    // Always base -> md -> lg regardless of input key order.
    expect($result)->toBe('py-12 md:py-20 lg:py-28');
});

it('emits dark variant last', function () {
    $resolver = new ClassResolver;

    expect($resolver->resolve([
        'dark' => ['bg-black'],
        'base' => ['bg-white'],
    ]))->toBe('bg-white dark:bg-black');
});

it('ignores empty breakpoints and blank classes', function () {
    $resolver = new ClassResolver;

    expect($resolver->resolve([
        'base' => ['flex', '  ', ''],
        'md' => [],
    ]))->toBe('flex');
});

it('is deterministic for identical input', function () {
    $resolver = new ClassResolver;
    $input = ['base' => ['a', 'b'], 'md' => ['c'], 'lg' => ['d']];

    expect($resolver->resolve($input))->toBe($resolver->resolve($input));
});
