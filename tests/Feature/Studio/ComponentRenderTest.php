<?php

declare(strict_types=1);

it('renders every component type from a block tree', function () {
    $blocks = [
        ['id' => 'h', 'type' => 'header', 'props' => ['brand' => 'Acme Co']],
        ['id' => 'hero', 'type' => 'hero', 'props' => ['headline' => 'Hello hero']],
        [
            'id' => 'feat',
            'type' => 'features',
            'props' => ['heading' => 'The features', 'items' => [['title' => 'Fast', 'body' => 'Very fast']]],
        ],
        [
            'id' => 'cta',
            'type' => 'cta',
            'props' => ['heading' => 'Start today', 'buttonLabel' => 'Sign up'],
        ],
        [
            'id' => 'faq',
            'type' => 'faq',
            'props' => ['heading' => 'Questions', 'items' => [['question' => 'Why?', 'answer' => 'Because']]],
        ],
        ['id' => 'foot', 'type' => 'footer', 'props' => ['copyright' => '© 2026 Acme']],
    ];

    $response = $this->postJson('/studio/api/preview', ['blocks' => $blocks]);

    $response->assertOk();

    expect($response->getContent())
        ->toContain('Acme Co')      // header
        ->toContain('Hello hero')   // hero
        ->toContain('The features') // features heading
        ->toContain('Very fast')    // feature item body
        ->toContain('Start today')  // cta heading
        ->toContain('Sign up')      // cta button
        ->toContain('Why?')         // faq question
        ->toContain('Because')      // faq answer
        ->toContain('© 2026 Acme'); // footer
});
