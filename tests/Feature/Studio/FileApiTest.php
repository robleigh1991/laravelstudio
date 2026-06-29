<?php

declare(strict_types=1);

it('lists the resources directory tree with directories first', function () {
    $response = $this->getJson('/studio/api/tree');

    $response->assertOk();

    $names = collect($response->json('entries'))->pluck('name');
    expect($names)->toContain('views')   // resources/views
        ->toContain('js')                 // resources/js
        ->toContain('css');               // resources/css

    // Directories sort before files.
    $types = collect($response->json('entries'))->pluck('type')->values()->all();
    $firstFile = array_search('file', $types, true);
    $lastDir = $firstFile === false ? count($types) : $firstFile;
    expect(array_slice($types, 0, $lastDir))->each->toBe('dir');
});

it('lists a nested directory', function () {
    $response = $this->getJson('/studio/api/tree?path=studio/pages');

    $response->assertOk();
    expect(collect($response->json('entries'))->pluck('name'))->toContain('home.json');
});

it('reads a file', function () {
    $response = $this->getJson('/studio/api/file?path=studio/pages/home.json');

    $response->assertOk();
    expect($response->json('contents'))->toContain('"slug": "home"');
});

it('rejects path traversal outside the project root', function () {
    $this->getJson('/studio/api/tree?path=../')->assertStatus(422);
    $this->getJson('/studio/api/file?path=../.env')->assertStatus(422);
});

it('returns 404 for a missing path', function () {
    $this->getJson('/studio/api/file?path=studio/pages/nope.json')->assertStatus(404);
});

it('returns 422 when reading a directory as a file', function () {
    $this->getJson('/studio/api/file?path=studio/pages')->assertStatus(422);
});
