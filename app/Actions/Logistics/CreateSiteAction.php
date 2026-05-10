<?php

namespace App\Actions\Logistics;

use App\Models\Site;
use Illuminate\Support\Str;

class CreateSiteAction
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
     * Generate a unique code for the site based on its name.
     */
    private function generateUniqueCode(string $name): string
    {
        // Example: First 2 letters of name + an incremental number
        $prefix = strtoupper(substr($name, 0, 2));
        $count = Site::where('code', 'like', "{$prefix}%")->count();
        $nextNumber = $count + 1;

        $code = "{$prefix}{$nextNumber}";

        while (Site::where('code', $code)->exists()) {
            $nextNumber++;
            $code = "{$prefix}{$nextNumber}";
        }

        return $code;
    }
}
