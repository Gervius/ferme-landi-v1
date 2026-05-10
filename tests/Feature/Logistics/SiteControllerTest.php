<?php

namespace Tests\Feature\Logistics;

use App\Models\Company;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class SiteControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure permissions exist
        Permission::findOrCreate('view sites');
        Permission::findOrCreate('create sites');
        Permission::findOrCreate('edit sites');
        Permission::findOrCreate('delete sites');
    }

    public function test_user_without_permission_cannot_view_sites(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('sites.index'));

        $response->assertForbidden();
    }

    public function test_user_with_permission_can_view_sites(): void
    {
        $this->withoutExceptionHandling();
        $this->withoutVite();

        $user = User::factory()->create();
        $user->givePermissionTo('view sites');

        $response = $this->actingAs($user)->get(route('sites.index'));

        $response->assertStatus(200);
    }

    public function test_user_with_permission_can_create_site(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create sites');
        $company = Company::factory()->create();

        $response = $this->actingAs($user)->post(route('sites.store'), [
            'company_id' => $company->id,
            'name' => 'Ferme Avicole Gamma',
            'code' => 'FAG1',
            'type' => 'ferme_avicole',
            'is_active' => true,
        ]);

        $response->assertRedirect(route('sites.index'));
        $this->assertDatabaseHas('sites', [
            'code' => 'FAG1',
        ]);
    }
}
