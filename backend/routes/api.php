<?php

use App\Http\Controllers\Api\V1\PublicCmsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('search', [PublicCmsController::class, 'search']);
    Route::get('site-settings', [PublicCmsController::class, 'siteSettings']);
    Route::get('homepage-sections', [PublicCmsController::class, 'homepageSections']);
    Route::get('hero-section', [PublicCmsController::class, 'heroSection']);
    Route::get('about-section', [PublicCmsController::class, 'aboutSection']);
    Route::get('chairman-message', [PublicCmsController::class, 'chairmanMessage']);
    Route::get('oist-lab', [PublicCmsController::class, 'oistLab']);
    Route::get('campus-life-section', [PublicCmsController::class, 'campusLifeSection']);
    Route::get('hero-feature-cards', [PublicCmsController::class, 'heroFeatureCards']);
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
    Route::get('academic-programs', [PublicCmsController::class, 'academicPrograms']);
    Route::get('departments', [PublicCmsController::class, 'departments']);
    Route::get('departments/{slug}', [PublicCmsController::class, 'department']);
    Route::get('faculty-profiles', [PublicCmsController::class, 'facultyProfiles']);
    Route::get('institutional-pages', [PublicCmsController::class, 'institutionalPages']);
    Route::get('institutional-pages/{slug}', [PublicCmsController::class, 'institutionalPage']);
    Route::get('scholarships', [PublicCmsController::class, 'scholarships']);
    Route::get('scholarships/{slug}', [PublicCmsController::class, 'scholarship']);
    Route::get('facilities', [PublicCmsController::class, 'facilities']);
    Route::get('facilities/{slug}', [PublicCmsController::class, 'facility']);
    Route::get('faqs', [PublicCmsController::class, 'faqs']);
    Route::get('leadership-profiles', [PublicCmsController::class, 'leadershipProfiles']);
    Route::get('leadership-profiles/{slug}', [PublicCmsController::class, 'leadershipProfile']);
    Route::get('videos', [PublicCmsController::class, 'videos']);
    Route::get('videos/{slug}', [PublicCmsController::class, 'video']);
});
