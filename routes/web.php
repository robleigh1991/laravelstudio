<?php

use App\Http\Controllers\Studio\FileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Phase 1: design-system component gallery (dev preview of the admin UI kit).
Route::view('/studio/gallery', 'studio.gallery');

// Phase 2: Studio JSON filesystem API (backs the Explorer + editor).
Route::prefix('studio/api')->name('studio.api.')->group(function () {
    Route::get('tree', [FileController::class, 'tree'])->name('tree');
    Route::get('file', [FileController::class, 'show'])->name('file');
});
