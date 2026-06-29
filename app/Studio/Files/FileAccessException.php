<?php

declare(strict_types=1);

namespace App\Studio\Files;

use RuntimeException;

/**
 * Raised by ProjectFiles for any disallowed or impossible file access. Carries
 * an HTTP status so the controller can translate it into a JSON response.
 */
final class FileAccessException extends RuntimeException
{
    public function __construct(string $message, public readonly int $status)
    {
        parent::__construct($message);
    }

    public static function outsideRoot(): self
    {
        return new self('Path is outside the project root.', 422);
    }

    public static function notFound(): self
    {
        return new self('Path not found.', 404);
    }

    public static function notADirectory(): self
    {
        return new self('Path is not a directory.', 422);
    }

    public static function notAFile(): self
    {
        return new self('Path is not a file.', 422);
    }
}
