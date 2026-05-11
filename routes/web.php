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
    Route::resource('units', UnitController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('generations', GenerationController::class)->only(['index', 'create', 'store']);
});
