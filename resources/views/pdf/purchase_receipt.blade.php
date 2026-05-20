@extends('pdf.layout')

@section('content')
<table class="no-border header">
    <tr>
        <td width="50%">
            <div class="company-info">FERME-LANDI</div>
            <div>Site: {{ $document->site ? $document->site->name : 'N/A' }}</div>
        </td>
        <td width="50%" class="text-right">
            <div><strong>Fournisseur:</strong> {{ $document->purchaseOrder && $document->purchaseOrder->supplier ? $document->purchaseOrder->supplier->name : 'N/A' }}</div>
        </td>
    </tr>
</table>

<div class="document-title">
    BON DE RÉCEPTION N° {{ $document->reference }}
</div>

<table class="no-border">
    <tr>
        <td width="50%"><strong>Date de Réception:</strong> {{ $document->receipt_date->format('d/m/Y') }}</td>
        <td width="50%" class="text-right"><strong>Réf Commande:</strong> {{ $document->purchaseOrder ? $document->purchaseOrder->reference : 'N/A' }}</td>
    </tr>
</table>

<table>
    <thead>
        <tr>
            <th>Article</th>
            <th class="text-center">Quantité Reçue</th>
            <th class="text-center">Unité</th>
        </tr>
    </thead>
    <tbody>
        @foreach($document->items as $item)
            <tr>
                <td>{{ $item->category->name }}</td>
                <td class="text-center">{{ number_format($item->received_quantity, 2) }}</td>
                <td class="text-center">{{ $item->unit->symbol }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@endsection
