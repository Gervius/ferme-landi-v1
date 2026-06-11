<?php

namespace App\Models;

use App\Traits\HasApprovalWorkflow;
use App\Models\SupplierInvoice; // Assure-toi d'importer le modèle de facture si nécessaire
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseReceipt extends Model
{
    use HasFactory, SoftDeletes, HasApprovalWorkflow;

    protected $guarded = ["id"];

    protected $casts = [
        "receipt_date" => "date",
        "approved_at" => "datetime",
    ];

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function supplierInvoice(): HasOne
    {
        // Ajuste la clé étrangère si elle ne s'appelle pas purchase_receipt_id dans ta table supplier_invoices
        return $this->hasOne(SupplierInvoice::class, 'purchase_receipt_id'); 
    }

    public function items()
    {
        return $this->hasMany(PurchaseReceiptItem::class);
    }
}
