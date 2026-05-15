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
        Route::get('api/delivery-notes/{delivery_note}', [\App\Http\Controllers\Sales\DeliveryNoteController::class, 'showApi'])->name('apiDeliveryNotesShow');

        Route::resource('product-donations', \App\Http\Controllers\Sales\ProductDonationController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'productDonationsIndex',
            'create'  => 'productDonationsCreate',
            'store'   => 'productDonationsStore',
        ]);
        Route::post('product-donations/{product_donation}/approve', [\App\Http\Controllers\Sales\ProductDonationController::class, 'approve'])->name('productDonationsApprove');

        Route::resource('invoices', \App\Http\Controllers\Sales\InvoiceController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'invoicesIndex',
            'create'  => 'invoicesCreate',
            'store'   => 'invoicesStore',
        ]);
        Route::post('invoices/{invoice}/approve', [\App\Http\Controllers\Sales\InvoiceController::class, 'approve'])->name('invoicesApprove');

        Route::resource('customer-payments', \App\Http\Controllers\Sales\CustomerPaymentController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'customerPaymentsIndex',
            'create'  => 'customerPaymentsCreate',
            'store'   => 'customerPaymentsStore',
        ]);
        Route::post('customer-payments/{customer_payment}/approve', [\App\Http\Controllers\Sales\CustomerPaymentController::class, 'approve'])->name('customerPaymentsApprove');
    });

    // HR Endpoints
    Route::prefix('hr')->group(function () {
        Route::resource('employees', \App\Http\Controllers\HR\EmployeeController::class)->names([
            'index'   => 'employeesIndex',
            'create'  => 'employeesCreate',
            'store'   => 'employeesStore',
            'edit'    => 'employeesEdit',
            'update'  => 'employeesUpdate',
            'destroy' => 'employeesDestroy',
        ]);

        Route::resource('payroll-records', \App\Http\Controllers\HR\PayrollRecordController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'payrollRecordsIndex',
            'create'  => 'payrollRecordsCreate',
            'store'   => 'payrollRecordsStore',
        ]);
        Route::post('payroll-records/{payroll_record}/approve', [\App\Http\Controllers\HR\PayrollRecordController::class, 'approve'])->name('payrollRecordsApprove');
    });

    // Purchases Endpoints
    Route::prefix('purchases')->group(function () {
        Route::resource('suppliers', \App\Http\Controllers\Purchases\SupplierController::class)->names([
            'index'   => 'suppliersIndex',
            'create'  => 'suppliersCreate',
            'store'   => 'suppliersStore',
            'edit'    => 'suppliersEdit',
            'update'  => 'suppliersUpdate',
            'destroy' => 'suppliersDestroy',
        ]);

        Route::resource('purchase-orders', \App\Http\Controllers\Purchases\PurchaseOrderController::class)->names([
            'index'   => 'purchaseOrdersIndex',
            'create'  => 'purchaseOrdersCreate',
            'store'   => 'purchaseOrdersStore',
            'edit'    => 'purchaseOrdersEdit',
            'update'  => 'purchaseOrdersUpdate',
            'destroy' => 'purchaseOrdersDestroy',
        ]);
        Route::get('api/purchase-orders/{purchase_order}', [\App\Http\Controllers\Purchases\PurchaseOrderController::class, 'showApi'])->name('apiPurchaseOrdersShow');

        Route::resource('purchase-receipts', \App\Http\Controllers\Purchases\PurchaseReceiptController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'purchaseReceiptsIndex',
            'create'  => 'purchaseReceiptsCreate',
            'store'   => 'purchaseReceiptsStore',
        ]);
        Route::post('purchase-receipts/{purchase_receipt}/approve', [\App\Http\Controllers\Purchases\PurchaseReceiptController::class, 'approve'])->name('purchaseReceiptsApprove');
        Route::get('api/purchase-receipts/{purchase_receipt}', [\App\Http\Controllers\Purchases\PurchaseReceiptController::class, 'showApi'])->name('apiPurchaseReceiptsShow');

        Route::resource('supplier-invoices', \App\Http\Controllers\Purchases\SupplierInvoiceController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'supplierInvoicesIndex',
            'create'  => 'supplierInvoicesCreate',
            'store'   => 'supplierInvoicesStore',
        ]);
        Route::post('supplier-invoices/{supplier_invoice}/approve', [\App\Http\Controllers\Purchases\SupplierInvoiceController::class, 'approve'])->name('supplierInvoicesApprove');

        Route::resource('supplier-payments', \App\Http\Controllers\Purchases\SupplierPaymentController::class)->only(['index', 'create', 'store'])->names([
            'index'   => 'supplierPaymentsIndex',
            'create'  => 'supplierPaymentsCreate',
            'store'   => 'supplierPaymentsStore',
        ]);
        Route::post('supplier-payments/{supplier_payment}/approve', [\App\Http\Controllers\Purchases\SupplierPaymentController::class, 'approve'])->name('supplierPaymentsApprove');
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
