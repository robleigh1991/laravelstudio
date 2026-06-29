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
}
