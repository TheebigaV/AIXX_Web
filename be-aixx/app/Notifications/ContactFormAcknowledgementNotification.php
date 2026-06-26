<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class ContactFormAcknowledgementNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected array $contactData;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $contactData)
    {
        $this->contactData = $contactData;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('We received your message - AIXX')
            ->greeting("Hello {$this->contactData['name']},")
            ->line('Thank you for reaching out to us. We have received your inquiry and will get back to you as soon as possible.')
            ->line('')
            ->line('Here is a summary of your submission:')
            ->line('**Service Interest:** ' . $this->contactData['service_interest'])
            ->line('**Industry Type:** ' . $this->contactData['industry_type'])
            ->line('**Budget Timeline:** ' . $this->contactData['budget_timeline'])
            ->line('')
            ->line('**Your Message:**')
            ->line($this->contactData['message'])
            ->line('')
            ->line('Our team will review your inquiry and contact you shortly.')
            ->line('If you have any urgent questions, please feel free to contact us directly.')
            ->salutation('Best regards, AIXX Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'customer_name' => $this->contactData['name'],
            'customer_email' => $this->contactData['email'],
            'service_interest' => $this->contactData['service_interest'],
        ];
    }
}
