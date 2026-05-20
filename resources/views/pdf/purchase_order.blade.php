@extends('pdf.layout')

@section('content')
<table class="no-border header">
    <tr>
        <td width="50%">
            <div class="company-info">FERME-LANDI</div>
            <div>Site: {{ $document->site ? $document->site->name : 'N/A' }}</div>
        </td>
        <td width="50%" class="text-right">
            <div><strong>Fournisseur:</strong> {{ $document->supplier->name }}</div>
        </td>
    </tr>
</table>

<div class="document-title">
    BON DE COMMANDE N° {{ $document->reference }}
</div>

<table class="no-border">
    <tr>
        <td width="50%"><strong>Date:</strong> {{ $document->order_date->format('d/m/Y') }}</td>
        <td width="50%" class="text-right"><strong>Statut:</strong> {{ ucfirst($document->status) }}</td>
    </tr>
</table>

<table>
    <thead>
        <tr>
            <th>Article</th>
            <th class="text-center">Quantité</th>
            <th class="text-center">Unité</th>
            <th class="text-right">Prix Unitaire</th>
            <th class="text-right">Total HT</th>
        </tr>
    </thead>
    <tbody>
        @php $total = 0; @endphp
        @foreach($document->items as $item)
            @php
                $lineTotal = $item->quantity * $item->unit_price;
                $total += $lineTotal;
            @endphp
            <tr>
                <td>{{ $item->category->name }}</td>
                <td class="text-center">{{ number_format($item->quantity, 2) }}</td>
                <td class="text-center">{{ $item->unit->symbol }}</td>
                <td class="text-right">{{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">{{ number_format($lineTotal, 2) }}</td>
            </tr>
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <th colspan="4" class="text-right">Total Général HT</th>
            <th class="text-right">{{ number_format($total, 2) }}</th>
        </tr>
    </tfoot>
</table>
@endsection
