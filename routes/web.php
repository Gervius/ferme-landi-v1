<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\Zootechnie\GenerationController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\UnitController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';



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

        
    // Sales Endpoints
    Route::prefix('sales')->group(function () {
        Route::resource('customers', \App\Http\Controllers\Sales\CustomerController::class)->names([
            'index'   => 'customersIndex',
            'create'  => 'customersCreate',
            'store'   => 'customersStore',
            'edit'    => 'customersEdit',
            'update'  => 'customersUpdate',
            'destroy' => 'customersDestroy',
        ]);

        Route::resource('sale-orders', \App\Http\Controllers\Sales\SaleOrderController::class)->names([
            'index'   => 'saleOrdersIndex',
            'create'  => 'saleOrdersCreate',
            'store'   => 'saleOrdersStore',
            'edit'    => 'saleOrdersEdit',
            'update'  => 'saleOrdersUpdate',
            'destroy' => 'saleOrdersDestroy',
        ]);

        Route::resource('delivery-notes', \App\Http\Controllers\Sales\DeliveryNoteController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'deliveryNotesIndex',
            'create'  => 'deliveryNotesCreate',
            'store'   => 'deliveryNotesStore',
        ]);
        Route::post('delivery-notes/{delivery_note}/approve', [\App\Http\Controllers\Sales\DeliveryNoteController::class, 'approve'])->name('deliveryNotesApprove');

        Route::resource('product-donations', \App\Http\Controllers\Sales\ProductDonationController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'productDonationsIndex',
            'create'  => 'productDonationsCreate',
            'store'   => 'productDonationsStore',
        ]);
        Route::post('product-donations/{product_donation}/approve', [\App\Http\Controllers\Sales\ProductDonationController::class, 'approve'])->name('productDonationsApprove');
    });

    // Zootechnie Endpoints
    Route::prefix('zootechnie')->group(function () {
        Route::resource('generations', GenerationController::class)->names([
            'index'   => 'generationsIndex',
            'create'  => 'generationsCreate',
            'store'   => 'generationsStore',
            'edit'    => 'generationsEdit',
            'update'  => 'generationsUpdate',
            'destroy' => 'generationsDestroy',
        ]);

        Route::resource('daily-productions', \App\Http\Controllers\Zootechnie\DailyProductionController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'dailyProductionsIndex',
            'create'  => 'dailyProductionsCreate',
            'store'   => 'dailyProductionsStore',
        ]);
        Route::post('daily-productions/{daily_production}/approve', [\App\Http\Controllers\Zootechnie\DailyProductionController::class, 'approve'])->name('dailyProductionsApprove');

        Route::resource('feed-consumptions', \App\Http\Controllers\Zootechnie\FeedConsumptionController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'feedConsumptionsIndex',
            'create'  => 'feedConsumptionsCreate',
            'store'   => 'feedConsumptionsStore',
        ]);
        Route::post('feed-consumptions/{feed_consumption}/approve', [\App\Http\Controllers\Zootechnie\FeedConsumptionController::class, 'approve'])->name('feedConsumptionsApprove');

        Route::resource('flock-mortalities', \App\Http\Controllers\Zootechnie\FlockMortalityController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'flockMortalitiesIndex',
            'create'  => 'flockMortalitiesCreate',
            'store'   => 'flockMortalitiesStore',
        ]);
        Route::post('flock-mortalities/{flock_mortality}/approve', [\App\Http\Controllers\Zootechnie\FlockMortalityController::class, 'approve'])->name('flockMortalitiesApprove');

        Route::resource('flock-cullings', \App\Http\Controllers\Zootechnie\FlockCullingController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'flockCullingsIndex',
            'create'  => 'flockCullingsCreate',
            'store'   => 'flockCullingsStore',
        ]);
        Route::post('flock-cullings/{flock_culling}/approve', [\App\Http\Controllers\Zootechnie\FlockCullingController::class, 'approve'])->name('flockCullingsApprove');

        Route::resource('breed-standards', \App\Http\Controllers\Zootechnie\BreedStandardController::class)->names([
            'index'   => 'breedStandardsIndex',
            'create'  => 'breedStandardsCreate',
            'store'   => 'breedStandardsStore',
            'edit'    => 'breedStandardsEdit',
            'update'  => 'breedStandardsUpdate',
            'destroy' => 'breedStandardsDestroy',
        ]);

        Route::resource('flock-weighings', \App\Http\Controllers\Zootechnie\FlockWeighingController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'flockWeighingsIndex',
            'create'  => 'flockWeighingsCreate',
            'store'   => 'flockWeighingsStore',
        ]);
        Route::post('flock-weighings/{flock_weighing}/approve', [\App\Http\Controllers\Zootechnie\FlockWeighingController::class, 'approve'])->name('flockWeighingsApprove');

        Route::resource('health-treatments', \App\Http\Controllers\Zootechnie\HealthTreatmentController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'healthTreatmentsIndex',
            'create'  => 'healthTreatmentsCreate',
            'store'   => 'healthTreatmentsStore',
        ]);
        Route::post('health-treatments/{health_treatment}/approve', [\App\Http\Controllers\Zootechnie\HealthTreatmentController::class, 'approve'])->name('healthTreatmentsApprove');

        Route::resource('prophylaxis-programs', \App\Http\Controllers\Zootechnie\ProphylaxisProgramController::class)->names([
            'index'   => 'prophylaxisProgramsIndex',
            'create'  => 'prophylaxisProgramsCreate',
            'store'   => 'prophylaxisProgramsStore',
            'edit'    => 'prophylaxisProgramsEdit',
            'update'  => 'prophylaxisProgramsUpdate',
            'destroy' => 'prophylaxisProgramsDestroy',
        ]);

        Route::get('scheduled-treatments', [\App\Http\Controllers\Zootechnie\ScheduledTreatmentController::class, 'index'])->name('scheduledTreatmentsIndex');
        Route::post('scheduled-treatments/{scheduled_treatment}/mark-as-done', [\App\Http\Controllers\Zootechnie\ScheduledTreatmentController::class, 'markAsDone'])->name('scheduledTreatmentsMarkAsDone');

        Route::resource('species', \App\Http\Controllers\Zootechnie\SpeciesController::class)->names([
            'index'   => 'speciesIndex',
            'create'  => 'speciesCreate',
            'store'   => 'speciesStore',
            'edit'    => 'speciesEdit',
            'update'  => 'speciesUpdate',
            'destroy' => 'speciesDestroy',
        ]);

        Route::resource('breeds', \App\Http\Controllers\Zootechnie\BreedController::class)->names([
            'index'   => 'breedsIndex',
            'create'  => 'breedsCreate',
            'store'   => 'breedsStore',
            'edit'    => 'breedsEdit',
            'update'  => 'breedsUpdate',
            'destroy' => 'breedsDestroy',
        ]);

        Route::get('stats/{generation}/metrics', [\App\Http\Controllers\Zootechnie\ZootechnieStatsController::class, 'getMetrics'])->name('metricsGetMetrics');
    });
});
