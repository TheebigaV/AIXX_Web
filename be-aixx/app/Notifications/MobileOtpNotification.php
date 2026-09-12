<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MobileOtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected string $otpCode,
        protected string $purpose = 'verification'
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $action = $this->purpose === 'password_reset' ? 'reset your password' : 'verify your account';

        return (new MailMessage)
            ->subject('Your AIXX Verification Code')
            ->greeting('Hello ' . ($notifiable->full_name ?? 'there') . ',')
            ->line("Use the code below to {$action} in the AIXX mobile app.")
            ->line("**{$this->otpCode}**")
            ->line('This code expires in 10 minutes.')
            ->line('If you did not request this, you can safely ignore this email.')
            ->salutation('Best regards, AIXX Team');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'purpose' => $this->purpose,
        ];
    }
}
