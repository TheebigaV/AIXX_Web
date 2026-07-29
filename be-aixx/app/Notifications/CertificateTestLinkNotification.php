<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CertificateTestLinkNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected array $candidateData;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $candidateData)
    {
        $this->candidateData = $candidateData;
    }

    /**
     * Get the notification's delivery channels.
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
        $testUrl = "http://localhost:3000/ai-certificate/test?token=" . $this->candidateData['uuid'];

        return (new MailMessage)
            ->subject('Your AI Knowledge Certificate Access Link - AIXX')
            ->greeting("Hello {$this->candidateData['name']},")
            ->line('Thank you for registering to take the Free AI Knowledge Certificate Test.')
            ->line('You can access the 20 Multiple-Choice Questions (MCQ) Test using the unique button/link below.')
            ->line('Please note that you need to score at least **80%** (16/20 correct answers) to pass and receive your certificate.')
            ->action('Start AI Knowledge Test', $testUrl)
            ->line('If the button above does not work, copy and paste the following URL into your browser:')
            ->line($testUrl)
            ->line('')
            ->line('Good luck with your test!')
            ->salutation('Best regards, AIXX Team');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'name' => $this->candidateData['name'],
            'email' => $this->candidateData['email'],
            'uuid' => $this->candidateData['uuid'],
        ];
    }
}
