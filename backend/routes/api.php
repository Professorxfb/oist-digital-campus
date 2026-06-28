<?php

use App\Http\Controllers\Api\V1\PublicCmsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('site-settings', [PublicCmsController::class, 'siteSettings']);
    Route::get('homepage-sections', [PublicCmsController::class, 'homepageSections']);
    Route::get('menus/{location}', [PublicCmsController::class, 'menu']);
    Route::get('notices', [PublicCmsController::class, 'notices']);
    Route::get('notices/{slug}', [PublicCmsController::class, 'notice']);
    Route::get('news', [PublicCmsController::class, 'news']);
    Route::get('news/{slug}', [PublicCmsController::class, 'newsPost']);
    Route::get('events', [PublicCmsController::class, 'events']);
    Route::get('events/{slug}', [PublicCmsController::class, 'event']);
    Route::get('gallery-albums', [PublicCmsController::class, 'galleryAlbums']);
    Route::get('gallery-albums/{slug}', [PublicCmsController::class, 'galleryAlbum']);
    Route::get('downloads', [PublicCmsController::class, 'downloads']);
    Route::get('departments', [PublicCmsController::class, 'departments']);
    Route::get('departments/{slug}', [PublicCmsController::class, 'department']);
    Route::get('faculty-profiles', [PublicCmsController::class, 'facultyProfiles']);
});
