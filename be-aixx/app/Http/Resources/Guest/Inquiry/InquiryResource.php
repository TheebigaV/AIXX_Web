<?php

namespace App\Http\Resources\Guest\Inquiry;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InquiryResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->customer_name,
            'email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'message' => $this->message,
            'reply_message' => $this->reply_message,
            'is_viewed' => $this->is_viewed,
            'is_replyed' => $this->is_replyed,

        ];
    }

}
