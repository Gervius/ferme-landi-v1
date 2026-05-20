@extends('pdf.layout')

@section('content')
<table class="no-border header">
    <tr>
        <td width="50%">
            <div class="company-info">FERME-LANDI</div>
            <div>Site: {{ $document->deliveryNote && $document->deliveryNote->site ? $document->deliveryNote->site->name : 'N/A' }}</div>
        </td>
        <td width="50%" class="text-right">
            <div><strong>Client:</strong> {{ $document->customer ? $document->customer->name : 'N/A' }}</div>
        </td>
    </tr>
</table>

<div class="document-title">
    FACTURE N° {{ $document->reference ?? ('FACT-' . $document->id) }}
</div>

<table class="no-border">
    <tr>
        <td width="50%"><strong>Date de Facturation:</strong> {{ $document->invoice_date->format('d/m/Y') }}</td>
        <td width="50%" class="text-right"><strong>Réf BL:</strong> {{ $document->deliveryNote ? $document->deliveryNote->reference : 'N/A' }}</td>
    </tr>
</table>

<table>
    <thead>
        <tr>
            <th>Désignation</th>
            <th class="text-center">Quantité</th>
            <th class="text-center">Unité</th>
            <th class="text-right">Prix Unitaire</th>
            <th class="text-right">Total HT</th>
        </tr>
    </thead>
    <tbody>
        @foreach($document->items as $item)
            @php $lineTotal = $item->quantity * $item->unit_price; @endphp
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
            <th colspan="4" class="text-right">Net à Payer (TTC)</th>
            <th class="text-right">{{ number_format($document->total_amount, 2) }}</th>
        </tr>
    </tfoot>
</table>
@endsection
