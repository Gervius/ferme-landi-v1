<?php

namespace App\Notifications;

use App\Models\ScheduledTreatment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProphylaxisAlertNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public ScheduledTreatment $treatment)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // For now, only DB notifications or simple logging
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'scheduled_treatment_id' => $this->treatment->id,
            'message' => "Prophylaxis alert: Treatment '{$this->treatment->step->description}' scheduled on {$this->treatment->scheduled_date->format('Y-m-d')} for generation {$this->treatment->generation->code}.",
        ];
    }
}
