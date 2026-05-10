<?php

namespace Tests\Feature\Zootechnie;

use App\Actions\Zootechnie\RegisterBirthOrArrivalAction;
use App\Models\Breed;
use App\Models\Company;
use App\Models\Site;
use App\Models\Species;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterBirthOrArrivalActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_registers_a_new_generation(): void
    {
        $company = Company::factory()->create();
        $site = Site::factory()->create(['company_id' => $company->id]);
        $species = Species::create(['name' => 'Poulet']);
        $breed = Breed::create(['species_id' => $species->id, 'name' => 'Leghorn']);

        $action = new RegisterBirthOrArrivalAction();

        $generation = $action->execute([
            'site_id' => $site->id,
            'breed_id' => $breed->id,
            'type' => 'pondeuse',
            'start_date' => '2026-05-10',
            'initial_quantity' => 1000,
        ]);

        $this->assertEquals('PP-2026-05-001', $generation->code);
        $this->assertEquals(1000, $generation->current_quantity);
        $this->assertEquals('actif', $generation->status);

        $generation2 = $action->execute([
            'site_id' => $site->id,
            'breed_id' => $breed->id,
            'type' => 'pondeuse',
            'start_date' => '2026-05-15',
            'initial_quantity' => 500,
        ]);

        $this->assertEquals('PP-2026-05-002', $generation2->code);
    }
}
