<?php

namespace Tests\Feature\Logistics;

use App\Actions\Logistics\CreateSiteAction;
use App\Models\Company;
use App\Models\Site;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateSiteActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_site_with_provided_code(): void
    {
        $company = Company::factory()->create();

        $action = new CreateSiteAction;
        $site = $action->execute([
            'company_id' => $company->id,
            'name' => 'Ferme Avicole Beta',
            'code' => 'FAB1',
            'type' => 'ferme_avicole',
            'is_active' => true,
        ]);

        $this->assertInstanceOf(Site::class, $site);
        $this->assertEquals('FAB1', $site->code);
        $this->assertDatabaseHas('sites', [
            'code' => 'FAB1',
        ]);
    }

    public function test_it_generates_a_unique_code_when_code_is_empty(): void
    {
        $company = Company::factory()->create();

        $action = new CreateSiteAction;

        $site1 = $action->execute([
            'company_id' => $company->id,
            'name' => 'KIRI 1-PONDEUSE',
            'code' => null,
            'type' => 'ferme_avicole',
            'is_active' => true,
        ]);

        $this->assertEquals('KI1', $site1->code);

        $site2 = $action->execute([
            'company_id' => $company->id,
            'name' => 'KIRI 2-PONDEUSE',
            'code' => '',
            'type' => 'ferme_avicole',
            'is_active' => true,
        ]);

        $this->assertEquals('KI2', $site2->code);
    }
}
