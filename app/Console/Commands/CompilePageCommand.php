<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Studio\Blocks\Block;
use App\Studio\Compiler\BladeCompiler;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * Publish spike: read a page's block-tree JSON and compile it to a Blade file.
 *
 *   php artisan studio:compile home
 *
 * Reads  resources/studio/pages/{slug}.json
 * Writes resources/views/pages/{slug}.blade.php
 */
final class CompilePageCommand extends Command
{
    protected $signature = 'studio:compile {slug=home}';

    protected $description = 'Compile a Studio page block-tree (JSON) into a Blade view.';

    public function handle(BladeCompiler $compiler): int
    {
        $slug = (string) $this->argument('slug');
        $source = resource_path("studio/pages/{$slug}.json");

        if (! File::exists($source)) {
            $this->error("Page source not found: {$source}");

            return self::FAILURE;
        }

        /** @var array<string, mixed> $page */
        $page = json_decode(File::get($source), true, flags: JSON_THROW_ON_ERROR);

        $blocks = array_map(
            static fn (array $b): Block => Block::fromArray($b),
            $page['blocks'] ?? [],
        );

        $blade = $compiler->compilePage($blocks);

        $target = resource_path("views/pages/{$slug}.blade.php");
        File::ensureDirectoryExists(dirname($target));
        File::put($target, $blade);

        $this->info("Compiled {$slug} → ".str_replace(base_path().DIRECTORY_SEPARATOR, '', $target));
        $this->line($blade);

        return self::SUCCESS;
    }
}
