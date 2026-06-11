<?php

namespace App\Actions\Logistics;

use App\Models\Site;
use Illuminate\Support\Facades\DB;

final readonly class CreateSiteAction
{
    /**
     * Create a new Site.
     */
    public function execute(array $data): Site
    {
        if (empty($data['code'])) {
            $data['code'] = $this->generateUniqueCode($data['name']);
        }

        return Site::create($data);
    }

    /**
     * Génération du code en UNE SEULE requête (adieu les N+1)
     */
    private function generateUniqueCode(string $name): string
    {
        $prefix = strtoupper(substr($name, 0, 2));
        
        // On lock la lecture ou on cherche directement le dernier code avec ce préfixe
        $latestSite = Site::select('code')
            ->where('code', 'like', "{$prefix}%")
            ->orderByRaw('LENGTH(code) DESC') // Gère SI1, SI2... SI10 proprement
            ->orderBy('code', 'desc')
            ->first();

        if (! $latestSite) {
            return "{$prefix}1";
        }

        // Extraction du numéro existant et incrémentation locale (RAM)
        $lastNumber = (int) str_replace($prefix, '', $latestSite->code);
        
        return $prefix . ($lastNumber + 1);
    }
}