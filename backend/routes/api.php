<?php

use App\Http\Controllers\Api\V1\PublicCmsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('site-settings', [PublicCmsController::class, 'siteSettings']);
    Route::get('homepage-sections', [PublicCmsController::class, 'homepageSections']);
    Route::get('menus/{location}', [PublicCmsController::class, 'menu']);
});
