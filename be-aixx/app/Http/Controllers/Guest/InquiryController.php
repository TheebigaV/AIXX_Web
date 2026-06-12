<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'service_interest' => 'required|string|max:255',
            'industry_type' => 'required|string|max:255',
            'budget_timeline' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $inquiry = Inquiry::create([
            'product_id' => null,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'service_interest' => $validated['service_interest'],
            'industry_type' => $validated['industry_type'],
            'budget_timeline' => $validated['budget_timeline'],
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Inquiry received',
            'data' => $inquiry,
        ], 201);
    }

    public function submitContact(Request $request)
    {
        // TODO: implement guest contact form submission logic.
        return response()->json([
            'message' => 'Contact message received',
        ], 201);
    }
}
