<?php

declare(strict_types=1);

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Studio\Files\FileAccessException;
use App\Studio\Files\ProjectFiles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * JSON filesystem API backing the Studio Explorer and editor.
 */
final class FileController extends Controller
{
    public function tree(Request $request): JsonResponse
    {
        $path = (string) $request->query('path', '');

        try {
            $entries = ProjectFiles::forResources()->tree($path);
        } catch (FileAccessException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['path' => $path, 'entries' => $entries]);
    }

    public function show(Request $request): JsonResponse
    {
        $path = (string) $request->query('path', '');

        try {
            $contents = ProjectFiles::forResources()->read($path);
        } catch (FileAccessException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['path' => $path, 'contents' => $contents]);
    }

    public function store(Request $request): JsonResponse
    {
        $path = self::requiredString($request, 'path');
        if ($path === null) {
            return self::validationError('The path field is required.');
        }

        $contents = $request->input('contents');
        $contents = is_string($contents) ? $contents : '';

        try {
            ProjectFiles::forResources()->write($path, $contents);
        } catch (FileAccessException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['path' => $path, 'saved' => true]);
    }

    public function rename(Request $request): JsonResponse
    {
        $from = self::requiredString($request, 'from');
        $to = self::requiredString($request, 'to');
        if ($from === null || $to === null) {
            return self::validationError('The from and to fields are required.');
        }

        try {
            ProjectFiles::forResources()->rename($from, $to);
        } catch (FileAccessException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['from' => $from, 'to' => $to, 'renamed' => true]);
    }

    public function duplicate(Request $request): JsonResponse
    {
        $from = self::requiredString($request, 'from');
        $to = self::requiredString($request, 'to');
        if ($from === null || $to === null) {
            return self::validationError('The from and to fields are required.');
        }

        try {
            ProjectFiles::forResources()->duplicate($from, $to);
        } catch (FileAccessException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['from' => $from, 'to' => $to, 'duplicated' => true]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $path = self::requiredString($request, 'path');
        if ($path === null) {
            return self::validationError('The path field is required.');
        }

        try {
            ProjectFiles::forResources()->delete($path);
        } catch (FileAccessException $e) {
            return response()->json(['message' => $e->getMessage()], $e->status);
        }

        return response()->json(['path' => $path, 'deleted' => true]);
    }

    private static function requiredString(Request $request, string $key): ?string
    {
        $value = $request->input($key);

        return is_string($value) && $value !== '' ? $value : null;
    }

    private static function validationError(string $message): JsonResponse
    {
        return response()->json(['message' => $message], 422);
    }
}
