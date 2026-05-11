<?php

namespace Tests\Feature\Traits;

use App\Models\User;
use App\Traits\HasApprovalWorkflow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TestApproverModel extends Model
{
    use HasApprovalWorkflow;

    protected $table = 'test_approvers';

    protected $guarded = [];
}

class HasApprovalWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('test_approvers', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('draft');
            $table->foreignId('prepared_by')->nullable();
            $table->foreignId('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function test_it_can_approve_a_draft()
    {
        $user = User::factory()->create();
        $model = TestApproverModel::create([
            'status' => 'draft',
            'prepared_by' => $user->id,
        ]);

        $this->assertTrue($model->isDraft());

        $model->approve($user->id);

        $this->assertTrue($model->isApproved());
        $this->assertEquals($user->id, $model->approved_by);
        $this->assertNotNull($model->approved_at);
    }

    public function test_it_can_reject_a_draft()
    {
        $user = User::factory()->create();
        $model = TestApproverModel::create([
            'status' => 'draft',
            'prepared_by' => $user->id,
        ]);

        $model->reject($user->id);

        $this->assertTrue($model->isRejected());
        $this->assertEquals($user->id, $model->approved_by);
    }

    public function test_it_cannot_approve_or_reject_if_not_draft()
    {
        $user = User::factory()->create();
        $model = TestApproverModel::create([
            'prepared_by' => $user->id,
            'status' => 'approved',
        ]);

        $this->assertFalse($model->approve($user->id));
        $this->assertFalse($model->reject($user->id));
    }
}
