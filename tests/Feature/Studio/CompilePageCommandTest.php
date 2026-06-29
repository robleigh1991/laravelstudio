<?php

declare(strict_types=1);

use Illuminate\Support\Facades\File;

$slug = '__cmdtest';

beforeEach(function () use ($slug) {
    $page = [
        'title' => 'Command Test',
        'slug' => $slug,
        'blocks' => [
            [
                'id' => 'b1',
                'type' => 'hero',
                'props' => ['headline' => 'Fixture headline'],
                'classes' => ['base' => ['bg-white', 'py-16'], 'md' => ['py-24']],
            ],
            ['id' => 'b2', 'type' => 'footer', 'props' => ['copyright' => 'Test']],
        ],
    ];

    File::put(
        resource_path("studio/pages/{$slug}.json"),
        json_encode($page, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
    );
});

afterEach(function () use ($slug) {
    File::delete(resource_path("studio/pages/{$slug}.json"));
    File::delete(resource_path("views/pages/{$slug}.blade.php"));
});

it('compiles a page into a Blade view', function () use ($slug) {
    $this->artisan('studio:compile', ['slug' => $slug])->assertSuccessful();

    $target = resource_path("views/pages/{$slug}.blade.php");
    expect(File::exists($target))->toBeTrue();

    expect(File::get($target))
        ->toContain('<x-hero')
        ->toContain('headline="Fixture headline"')
        ->toContain('class="bg-white py-16 md:py-24"')
        ->toContain('<x-footer');
});

it('is idempotent — re-publishing yields byte-identical output', function () use ($slug) {
    $this->artisan('studio:compile', ['slug' => $slug])->assertSuccessful();
    $first = File::get(resource_path("views/pages/{$slug}.blade.php"));

    $this->artisan('studio:compile', ['slug' => $slug])->assertSuccessful();
    $second = File::get(resource_path("views/pages/{$slug}.blade.php"));

    expect($second)->toBe($first);
});

it('fails gracefully for an unknown page', function () {
    $this->artisan('studio:compile', ['slug' => 'does-not-exist'])->assertFailed();
});
