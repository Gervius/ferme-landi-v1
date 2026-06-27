<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class LogPurchaseOrderAction
{
    public function execute(array $data, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($data, $userId) {
            
            // 1. Demande atomique du prochain numéro à PostgreSQL (Zéro collision possible)
            $sequence = DB::selectOne("SELECT nextval('purchase_order_ref_seq') AS next_val")->next_val;
            
            // 2. Formatage lisible pour les humains (ex: BC-2606-0042)
            // '26' pour l'année, '06' pour le mois, et un nombre sur 4 chiffres
            $reference = sprintf('BC-%s-%04d', date('ym'), $sequence);

            // 3. Création de la commande
            $order = PurchaseOrder::create([
                'site_id' => $data['site_id'],
                'supplier_id' => $data['supplier_id'],
                'order_date' => $data['order_date'],
                'reference' => $reference, // Injection de la référence auto-générée
                'created_by' => $userId,
                'status' => 'draft',
            ]);

            // 4. Ajout des lignes (Élimination du N+1 à l'insertion via createMany)
            $itemsData = array_map(function ($item) {
                return [
                    'item_id' => $item['item_id'],
                    'unit_id' => $item['unit_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ];
            }, $data['items']);
            
            $order->items()->createMany($itemsData);

            return $order;
        });
    }
}