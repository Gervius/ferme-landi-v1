<?php

namespace Tests\Feature\Zootechnie;

use App\Actions\Zootechnie\ApproveCullingAction;
use App\Actions\Zootechnie\ApproveMortalityAction;
use App\Actions\Zootechnie\LogCullingAction;
use App\Actions\Zootechnie\LogMortalityAction;
use App\Models\Breed;
use App\Models\Company;
use App\Models\Generation;
use App\Models\Site;
use App\Models\Species;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MortalityAndCullingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private Generation $generation;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $company = Company::factory()->create();
        $site = Site::factory()->create(['company_id' => $company->id]);
        $species = Species::create(['name' => 'Poulet']);
        $breed = Breed::create(['species_id' => $species->id, 'name' => 'Leghorn']);

        $this->generation = Generation::create([
            'site_id' => $site->id,
            'breed_id' => $breed->id,
            'code' => 'PP-2026-05-001',
            'type' => 'pondeuse',
            'start_date' => '2026-05-10',
            'initial_quantity' => 1000,
            'current_quantity' => 1000,
            'status' => 'actif',
        ]);

        $this->user = User::factory()->create();
    }

    public function test_mortality_workflow(): void
    {
        $logAction = new LogMortalityAction;

        $mortality = $logAction->execute([
            'generation_id' => $this->generation->id,
            'date' => '2026-05-11',
            'quantity' => 50,
            'cause' => 'Maladie',
        ], $this->user->id);

        $this->assertTrue($mortality->isDraft());
        $this->assertEquals(50, $mortality->quantity);

        // Ensure flock is untouched
        $this->assertEquals(1000, $this->generation->fresh()->current_quantity);

        $approveAction = app(ApproveMortalityAction::class);
        $approveAction->execute($mortality, $this->user->id);

        $this->assertTrue($mortality->fresh()->isApproved());

        // Ensure flock was deducted
        $this->assertEquals(950, $this->generation->fresh()->current_quantity);
    }

    public function test_culling_workflow_with_flock_closure(): void
    {
        $logAction = new LogCullingAction;

        $culling = $logAction->execute([
            'generation_id' => $this->generation->id,
            'date' => '2026-05-12',
            'quantity_culled' => 1000,
            'reason' => 'baisse_ponte',
        ], $this->user->id);

        $this->assertTrue($culling->isDraft());
        $this->assertEquals(1000, $culling->quantity_culled);

        // Ensure flock is untouched
        $this->assertEquals(1000, $this->generation->fresh()->current_quantity);
        $this->assertEquals('actif', $this->generation->fresh()->status);

        $approveAction = app(ApproveCullingAction::class);
        $approveAction->execute($culling, $this->user->id);

        $this->assertTrue($culling->fresh()->isApproved());

        // Ensure flock was deducted and closed because it dropped to 0
        $this->assertEquals(0, $this->generation->fresh()->current_quantity);
        $this->assertEquals('cloture', $this->generation->fresh()->status);
    }
}
