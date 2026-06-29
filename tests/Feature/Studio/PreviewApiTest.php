<?php

declare(strict_types=1);

use Illuminate\Support\Facades\File;

/**
 * @return array<int, mixed>
 */
function homeBlocks(): array
{
    $json = File::get(resource_path('studio/pages/home.json'));
    $page = json_decode($json, true, flags: JSON_THROW_ON_ERROR);

    return $page['blocks'];
}

it('renders a block tree to HTML through the real components', function () {
    $response = $this->postJson('/studio/api/preview', ['blocks' => homeBlocks()]);

    $response->assertOk();

    $html = $response->getContent();

    expect($html)
        ->toContain('Build real Laravel sites, visually.') // hero headline
        ->toContain('Why Laravel Studio')                   // features heading
        ->toContain('Visual editing')                       // a feature item
        ->toContain('© 2026 Laravel Studio');               // footer
});

it('renders the hero headline inside an h1', function () {
    $response = $this->postJson('/studio/api/preview', [
        'blocks' => [
            ['id' => 'b1', 'type' => 'hero', 'props' => ['headline' => 'Hello world']],
        ],
    ]);

    $response->assertOk();
    expect($response->getContent())->toMatch('/<h1[^>]*>\s*Hello world\s*<\/h1>/');
});

it('rejects a non-array blocks payload', function () {
    $this->postJson('/studio/api/preview', ['blocks' => 'nope'])->assertStatus(422);
});
