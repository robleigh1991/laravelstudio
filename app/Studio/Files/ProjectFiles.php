<?php

declare(strict_types=1);

namespace App\Studio\Files;

/**
 * Safe, scoped access to a project's editable files. All access is confined to
 * a single root directory; any path that resolves outside it (e.g. via "..")
 * is rejected. This is the contract the Explorer and editor are built on.
 */
final class ProjectFiles
{
    public function __construct(private readonly string $root) {}

    /**
     * Scope the editor to the project's resources/ directory (pages, views,
     * components, css, js). Broader roots can be added later.
     */
    public static function forResources(): self
    {
        $resolved = realpath(resource_path());

        return new self($resolved === false ? resource_path() : $resolved);
    }

    /**
     * List the entries of a directory (directories first, then files, A→Z).
     *
     * @return list<array{name: string, type: string, path: string}>
     */
    public function tree(string $relative = ''): array
    {
        $dir = $this->resolve($relative);

        if (! is_dir($dir)) {
            throw FileAccessException::notADirectory();
        }

        $names = scandir($dir);
        if ($names === false) {
            return [];
        }

        $entries = [];
        foreach ($names as $name) {
            if ($name === '.' || $name === '..') {
                continue;
            }

            $full = $dir.DIRECTORY_SEPARATOR.$name;
            $entries[] = [
                'name' => $name,
                'type' => is_dir($full) ? 'dir' : 'file',
                'path' => $this->relativePath($full),
            ];
        }

        usort($entries, static function (array $a, array $b): int {
            if ($a['type'] !== $b['type']) {
                return $a['type'] === 'dir' ? -1 : 1;
            }

            return strcmp((string) $a['name'], (string) $b['name']);
        });

        return $entries;
    }

    /**
     * Read a file's contents.
     */
    public function read(string $relative): string
    {
        $file = $this->resolve($relative);

        if (! is_file($file)) {
            throw FileAccessException::notAFile();
        }

        $contents = file_get_contents($file);

        return $contents === false ? '' : $contents;
    }

    /**
     * Write (creating or overwriting) a file. The parent directory must already
     * exist inside the root.
     */
    public function write(string $relative, string $contents): void
    {
        $target = $this->resolveForWrite($relative);

        file_put_contents($target, $contents);
    }

    /**
     * Delete a file (not a directory).
     */
    public function delete(string $relative): void
    {
        $file = $this->resolve($relative);

        if (! is_file($file)) {
            throw FileAccessException::notAFile();
        }

        unlink($file);
    }

    /**
     * Rename/move a file to another location inside the root.
     */
    public function rename(string $from, string $to): void
    {
        $source = $this->resolve($from);

        if (! is_file($source)) {
            throw FileAccessException::notAFile();
        }

        rename($source, $this->resolveForWrite($to));
    }

    /**
     * Copy a file to another location inside the root.
     */
    public function duplicate(string $from, string $to): void
    {
        $source = $this->resolve($from);

        if (! is_file($source)) {
            throw FileAccessException::notAFile();
        }

        copy($source, $this->resolveForWrite($to));
    }

    /**
     * Resolve a write target: its parent directory must exist inside the root,
     * and the basename must be a real filename. Returns the absolute target path
     * (which may not exist yet).
     */
    private function resolveForWrite(string $relative): string
    {
        $relative = ltrim(str_replace('\\', '/', $relative), '/');
        if ($relative === '') {
            throw FileAccessException::outsideRoot();
        }

        $parts = explode('/', $relative);
        $basename = array_pop($parts);
        if ($basename === '' || $basename === '.' || $basename === '..') {
            throw FileAccessException::outsideRoot();
        }

        $parentDir = $this->resolve(implode('/', $parts));
        if (! is_dir($parentDir)) {
            throw FileAccessException::notADirectory();
        }

        return $parentDir.DIRECTORY_SEPARATOR.$basename;
    }

    /**
     * Resolve a relative path to a real absolute path inside the root, or throw.
     */
    private function resolve(string $relative): string
    {
        $relative = ltrim(str_replace('\\', '/', $relative), '/');
        $target = $relative === ''
            ? $this->root
            : $this->root.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $relative);

        $real = realpath($target);
        if ($real === false) {
            throw FileAccessException::notFound();
        }

        if ($real !== $this->root && ! str_starts_with($real, $this->root.DIRECTORY_SEPARATOR)) {
            throw FileAccessException::outsideRoot();
        }

        return $real;
    }

    private function relativePath(string $absolute): string
    {
        $relative = substr($absolute, strlen($this->root));

        return ltrim(str_replace(DIRECTORY_SEPARATOR, '/', $relative), '/');
    }
}
