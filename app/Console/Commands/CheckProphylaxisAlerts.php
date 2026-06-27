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
    protected $signature = 'app:check-prophylaxis-alerts';

    protected $description = 'Checks for pending scheduled treatments and sends alerts natively via SQL optimization.';

    public function handle()
    {
        $today = Carbon::now()->format('Y-m-d');

        // 🔴 OPTIMISATION RAM & LATENCE : Le filtrage de la date d'alerte se fait en SQL.
        // On ne ramène en mémoire RAM QUE les traitements qui ont besoin d'une alerte aujourd'hui.
        $treatmentsToAlert = ScheduledTreatment::query()
            ->select('scheduled_treatments.*') // Important pour ne pas écraser les ID avec le join
            ->join('prophylaxis_steps', 'scheduled_treatments.prophylaxis_step_id', '=', 'prophylaxis_steps.id')
            ->where('scheduled_treatments.status', 'pending')
            // Logique : DatePrévue - JoursD'Alerte == Aujourd'hui
            ->whereRaw('DATE_SUB(scheduled_treatments.scheduled_date, INTERVAL prophylaxis_steps.alert_days_before DAY) = ?', [$today])
            // Eager loading ultra-ciblé pour ne pas hydrater les colonnes inutiles dans la Notification
            ->with([
                'step:id,description', 
                'generation:id,code'
            ])
            ->get();

        if ($treatmentsToAlert->isEmpty()) {
            $this->info("Aucune alerte de prophylaxie déclenchée pour aujourd'hui.");
            return;
        }

        // 🔴 OPTIMISATION N+1 : On charge la liste des destinataires UNE SEULE FOIS, hors de la boucle.
        $usersToNotify = User::permission('receive prophylaxis alerts')->get();

        if ($usersToNotify->isEmpty()) {
            $this->warn("Alerte requise, mais aucun utilisateur n'a la permission 'receive prophylaxis alerts'.");
            return;
        }

        $alertsSent = 0;

        foreach ($treatmentsToAlert as $treatment) {
            Log::info("Prophylaxis Alert: Treatment {$treatment->id} (Generation: {$treatment->generation->code}) requires attention soon. Scheduled on {$treatment->scheduled_date->format('Y-m-d')}.");

            foreach ($usersToNotify as $user) {
                // On notifie l'utilisateur (le traitement est déjà correctement hydraté)
                $user->notify(new ProphylaxisAlertNotification($treatment));
            }

            $alertsSent++;
        }

        $this->info("Processed prophylaxis alerts. Total alerts triggered: {$alertsSent}");
    }
}