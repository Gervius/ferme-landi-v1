<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\GenerationController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\UnitController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('companies', CompanyController::class)->only(['show', 'edit', 'update']);
    Route::resource('sites', SiteController::class)->names([
        'index' => 'sitesIndex',
        'create' => 'sitesCreate',
        'store' => 'sitesStore',
        'edit' => 'sitesEdit',
        'update' => 'sitesUpdate',
        'destroy' => 'sitesDestroy'
    ]);
    Route::resource('units', UnitController::class)->names([
        'index' => 'unitsIndex',
        'create' => 'unitsCreate',
        'store' => 'unitsStore',
        'edit' => 'unitsEdit',
        'update' => 'unitsUpdate',
        'destroy' => 'unitsDestroy'
    ]);


    Route::resource('categories', CategoryController::class)->names([
        'index' => 'categoriesIndex',
        'create' => 'categoriesCreate',
        'store' => 'categoriesStore',
        'edit' => 'categoriesEdit',
        'update' => 'categoriesUpdate',
        'destroy' => 'categoriesDestroy']);

        
    Route::resource('generations', GenerationController::class)->only(['index', 'create', 'store']);

    // Zootechnie Endpoints
    Route::prefix('zootechnie')->name('zootechnie.')->group(function () {
        Route::resource('daily-productions', \App\Http\Controllers\Zootechnie\DailyProductionController::class)->only(['index', 'create', 'store']);
        Route::post('daily-productions/{daily_production}/approve', [\App\Http\Controllers\Zootechnie\DailyProductionController::class, 'approve'])->name('daily-productions.approve');

        Route::resource('feed-consumptions', \App\Http\Controllers\Zootechnie\FeedConsumptionController::class)->only(['index', 'create', 'store']);
        Route::post('feed-consumptions/{feed_consumption}/approve', [\App\Http\Controllers\Zootechnie\FeedConsumptionController::class, 'approve'])->name('feed-consumptions.approve');

        Route::resource('flock-mortalities', \App\Http\Controllers\Zootechnie\FlockMortalityController::class)->only(['index', 'create', 'store']);
        Route::post('flock-mortalities/{flock_mortality}/approve', [\App\Http\Controllers\Zootechnie\FlockMortalityController::class, 'approve'])->name('flock-mortalities.approve');

        Route::resource('flock-cullings', \App\Http\Controllers\Zootechnie\FlockCullingController::class)->only(['index', 'create', 'store']);
        Route::post('flock-cullings/{flock_culling}/approve', [\App\Http\Controllers\Zootechnie\FlockCullingController::class, 'approve'])->name('flock-cullings.approve');
    });
});
