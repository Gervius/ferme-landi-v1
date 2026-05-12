<?php

namespace App\Console\Commands;

use App\Models\ScheduledTreatment;
use App\Models\User;
use App\Notifications\ProphylaxisAlertNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class CheckProphylaxisAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-prophylaxis-alerts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks for pending scheduled treatments and sends alerts if the alert threshold is reached.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now()->startOfDay();

        // Find pending treatments
        $pendingTreatments = ScheduledTreatment::with(['step', 'generation'])
            ->where('status', 'pending')
            ->get();

        $alertsSent = 0;

        foreach ($pendingTreatments as $treatment) {
            $alertDaysBefore = $treatment->step->alert_days_before;

            // Expected alert date is scheduled date minus the alert days before
            $expectedAlertDate = Carbon::parse($treatment->scheduled_date)->subDays($alertDaysBefore)->startOfDay();

            if ($today->equalTo($expectedAlertDate)) {
                // Log the alert
                Log::info("Prophylaxis Alert: Treatment {$treatment->id} (Generation: {$treatment->generation->code}) requires attention soon. Scheduled on {$treatment->scheduled_date->format('Y-m-d')}.");

                // Ideally send to users with a specific role
                // Since roles aren't fully configured, we'll notify all admins or just keep it logged
                $adminUsers = User::whereHas('roles', function($q) {
                    $q->where('name', 'admin')->orWhere('name', 'gestionnaire');
                })->get();

                foreach ($adminUsers as $admin) {
                    $admin->notify(new ProphylaxisAlertNotification($treatment));
                }

                $alertsSent++;
            }
        }

        $this->info("Processed prophylaxis alerts. Total alerts triggered: {$alertsSent}");
    }
}
