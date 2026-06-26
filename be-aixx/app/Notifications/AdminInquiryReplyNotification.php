<?php

namespace App\Notifications;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class AdminInquiryReplyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Inquiry $inquiry;

    public function __construct(Inquiry $inquiry)
    {
        $this->inquiry = $inquiry;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('We have a response to your inquiry - AIXX')
            ->greeting("Hello {$this->inquiry->customer_name},")
            ->line('Thank you for your inquiry. We have reviewed your request and here is our response:')
            ->line('')
            ->line('**Response:**')
            ->line($this->inquiry->reply_message)
            ->line('')
            ->line('If you have any follow-up questions, please feel free to reach out to us.')
            ->salutation('Best regards, AIXX Team');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'inquiry_id' => $this->inquiry->id,
            'customer_name' => $this->inquiry->customer_name,
            'reply_message' => $this->inquiry->reply_message,
        ];
    }
}
