<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\Contact\ContactFormRequest;
use App\Http\Requests\Guest\Inquiry\StoreInquiryRequest;
use App\Http\Resources\Guest\Inquiry\InquiryCollection;
use App\Http\Resources\Guest\Inquiry\InquiryResource;
use App\Models\Inquiry;
use App\Services\Guest\InquiryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 *
 */
class InquiryController extends Controller
{
    /**
     * @var InquiryService
     */
    private InquiryService $inquiryService;

    /**
     * @param InquiryService $inquiryService
     */
    public function __construct(InquiryService $inquiryService)
    {
        $this->inquiryService = $inquiryService;
    }

    /**
     * @param StoreInquiryRequest $request
     * @return JsonResponse
     */
    public function store(StoreInquiryRequest $request): JsonResponse
    {
        $inquiry= $this->inquiryService->create($request->validated());
        return response()->json([
            'message' => 'Inquiry created successfully',
            'inquiry' => new InquiryResource($inquiry),
        ], 201);
    }

    /**
     * @param ContactFormRequest $request
     * @return JsonResponse
     */
    public function submitContact(ContactFormRequest $request): JsonResponse
    {
        $result = $this->inquiryService->submitContactForm($request->validated());
        if ($result['status']) {
            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 500);
        }
    }

}
