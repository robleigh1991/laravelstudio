<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Phase 1: design-system component gallery (dev preview of the admin UI kit).
Route::view('/studio/gallery', 'studio.gallery');
