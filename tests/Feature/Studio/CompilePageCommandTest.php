<?php

declare(strict_types=1);

use Illuminate\Support\Facades\File;

afterEach(function () {
    File::delete(resource_path('views/pages/home.blade.php'));
});

it('compiles the sample home page into a Blade view', function () {
    $this->artisan('studio:compile', ['slug' => 'home'])
        ->assertSuccessful();

    $target = resource_path('views/pages/home.blade.php');

    expect(File::exists($target))->toBeTrue();

    $blade = File::get($target);

    expect($blade)
        ->toContain('<x-hero')
        ->toContain('headline="Build real Laravel sites, visually."')
        ->toContain('class="bg-white py-16 md:py-24 lg:py-32"')
        ->toContain('<x-features')
        ->toContain('<x-footer');
});

it('is idempotent — re-publishing yields byte-identical output', function () {
    $this->artisan('studio:compile', ['slug' => 'home'])->assertSuccessful();
    $first = File::get(resource_path('views/pages/home.blade.php'));

    $this->artisan('studio:compile', ['slug' => 'home'])->assertSuccessful();
    $second = File::get(resource_path('views/pages/home.blade.php'));

    expect($second)->toBe($first);
});

it('fails gracefully for an unknown page', function () {
    $this->artisan('studio:compile', ['slug' => 'does-not-exist'])
        ->assertFailed();
});
