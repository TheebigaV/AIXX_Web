<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactFormAcknowledgementNotification extends Notification
{
    use Queueable;

    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('AIXX: We received your message')
            ->greeting('Hello ' . ($this->data['name'] ?? 'there') . ',')
            ->line('Thank you for contacting AIXX. We have received your message and one of our team members will get back to you shortly.')
            ->line('Here is a copy of your submission:')
            ->line('Service Interest: ' . ($this->data['service_interest'] ?? 'N/A'))
            ->line('Industry Type: ' . ($this->data['industry_type'] ?? 'N/A'))
            ->line('Timeline: ' . ($this->data['budget_timeline'] ?? 'N/A'))
            ->line('Message: ' . ($this->data['message'] ?? ''))
            ->line('If you need urgent assistance, feel free to reply directly to this email.')
            ->line('Thanks again for reaching out to AIXX.')
            ->salutation('Best regards,')->salutation('AIXX Support Team');
    }

    public function toArray(object $notifiable): array
    {
        return $this->data;
    }
}
