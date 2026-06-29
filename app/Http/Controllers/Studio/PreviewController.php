<?php

declare(strict_types=1);

namespace App\Http\Controllers\Studio;

use App\Http\Controllers\Controller;
use App\Studio\Preview\PreviewRenderer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Throwable;

/**
 * Renders a block tree to HTML for the editor's live preview.
 */
final class PreviewController extends Controller
{
    public function render(Request $request, PreviewRenderer $renderer): Response
    {
        $blocks = $request->input('blocks');
        if (! is_array($blocks)) {
            return response('Invalid blocks payload.', 422);
        }

        try {
            $html = $renderer->render($blocks);
        } catch (Throwable $e) {
            return response('Render error: '.$e->getMessage(), 422);
        }

        return response($html)->header('Content-Type', 'text/html');
    }
}
