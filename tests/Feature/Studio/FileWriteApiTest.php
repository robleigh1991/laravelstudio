<?php

declare(strict_types=1);

use Illuminate\Support\Facades\File;

afterEach(function () {
    foreach (['__w.json', '__ren.json', '__dup.json'] as $name) {
        File::delete(resource_path('studio/pages/'.$name));
    }
});

it('creates a new file', function () {
    $this->putJson('/studio/api/file', [
        'path' => 'studio/pages/__w.json',
        'contents' => '{"x":1}',
    ])->assertOk()->assertJson(['saved' => true]);

    expect(File::get(resource_path('studio/pages/__w.json')))->toBe('{"x":1}');
});

it('overwrites an existing file', function () {
    File::put(resource_path('studio/pages/__w.json'), 'old');

    $this->putJson('/studio/api/file', [
        'path' => 'studio/pages/__w.json',
        'contents' => 'new',
    ])->assertOk();

    expect(File::get(resource_path('studio/pages/__w.json')))->toBe('new');
});

it('renames a file', function () {
    File::put(resource_path('studio/pages/__w.json'), 'data');

    $this->postJson('/studio/api/file/rename', [
        'from' => 'studio/pages/__w.json',
        'to' => 'studio/pages/__ren.json',
    ])->assertOk();

    expect(File::exists(resource_path('studio/pages/__w.json')))->toBeFalse();
    expect(File::exists(resource_path('studio/pages/__ren.json')))->toBeTrue();
});

it('duplicates a file', function () {
    File::put(resource_path('studio/pages/__w.json'), 'data');

    $this->postJson('/studio/api/file/duplicate', [
        'from' => 'studio/pages/__w.json',
        'to' => 'studio/pages/__dup.json',
    ])->assertOk();

    expect(File::get(resource_path('studio/pages/__dup.json')))->toBe('data');
});

it('deletes a file', function () {
    File::put(resource_path('studio/pages/__w.json'), 'data');

    $this->deleteJson('/studio/api/file', ['path' => 'studio/pages/__w.json'])->assertOk();

    expect(File::exists(resource_path('studio/pages/__w.json')))->toBeFalse();
});

it('rejects writing outside the project root', function () {
    $this->putJson('/studio/api/file', ['path' => '../evil.json', 'contents' => 'x'])
        ->assertStatus(422);
});

it('validates required fields on write', function () {
    $this->putJson('/studio/api/file', ['contents' => 'x'])->assertStatus(422);
});

it('returns 404 when renaming a missing source', function () {
    $this->postJson('/studio/api/file/rename', [
        'from' => 'studio/pages/does-not-exist.json',
        'to' => 'studio/pages/__ren.json',
    ])->assertStatus(404);
});
