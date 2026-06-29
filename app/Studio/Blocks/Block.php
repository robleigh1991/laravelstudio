<?php

declare(strict_types=1);

namespace App\Studio\Blocks;

/**
 * A single node in the block tree. Immutable value object.
 *
 * Canonical contract: docs/block-schema.md
 */
final class Block
{
    /**
     * @param  array<string, mixed>  $props
     * @param  array<string, list<string>>  $classes  Per-breakpoint Tailwind utilities, keyed by breakpoint.
     * @param  list<Block>  $children
     */
    public function __construct(
        public readonly string $id,
        public readonly string $type,
        public readonly array $props = [],
        public readonly array $classes = [],
        public readonly array $children = [],
    ) {}

    /**
     * Build a Block from a decoded JSON array.
     *
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        if (! isset($data['id'], $data['type'])) {
            throw new \InvalidArgumentException('Block requires "id" and "type".');
        }

        $children = array_map(
            static fn (array $child): self => self::fromArray($child),
            $data['children'] ?? [],
        );

        return new self(
            id: (string) $data['id'],
            type: (string) $data['type'],
            props: $data['props'] ?? [],
            classes: $data['classes'] ?? [],
            children: $children,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'props' => $this->props,
            'classes' => $this->classes,
            'children' => array_map(static fn (self $c): array => $c->toArray(), $this->children),
        ];
    }
}
