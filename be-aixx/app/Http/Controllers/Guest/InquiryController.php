<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        // TODO: implement guest inquiry storage logic.
        return response()->json([
            'message' => 'Inquiry received',
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
