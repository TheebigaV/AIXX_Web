<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Inquiry\InquiryCollection;
use App\Http\Resources\Admin\Inquiry\InquiryResource;
use App\Models\Inquiry;
use App\Models\Product;
use App\Services\Admin\InquiryService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

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
     * @param Request $request
     * @return InquiryCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): InquiryCollection
    {
        $this->authorize('viewAny', Inquiry::class);
        return new InquiryCollection(
            $this->inquiryService->paginate(
                $request->get('per_page', 15),
                [
                    'id',
                ]
            )
        );
    }

    /**
     * @return InquiryCollection
     * @throws AuthorizationException
     */
    public function all(): InquiryCollection
    {
        $this->authorize('viewAny', Inquiry::class);
        return new InquiryCollection(
            $this->inquiryService->all(
                [
                    'id',
                ]
            )
        );
    }

    /**
     * @param string $inquiry
     * @return InquiryResource
     * @throws AuthorizationException
     */
    public function show(string $inquiry): InquiryResource
    {
        $inquiry = $this->inquiryService->find($inquiry);
        $this->authorize('view', $inquiry);
        return new InquiryResource($inquiry);
    }

    /**
     * @param Inquiry $inquiry
     * @return JsonResponse
     */
    public function markAsViewed(Inquiry $inquiry): JsonResponse
    {
        try {
            $inquiry->update(['is_viewed' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Inquiry marked as viewed',
                'data' => $inquiry
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark inquiry as viewed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param Inquiry $inquiry
     * @return JsonResponse
     */
    public function markAsReplied(Inquiry $inquiry): JsonResponse
    {
        try {
            $inquiry->update([
                'is_viewed' => true,
                'is_replyed' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Inquiry marked as replied',
                'data' => $inquiry
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark inquiry as replied',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @param Inquiry $inquiry
     * @return JsonResponse
     */
    public function reply(Request $request, Inquiry $inquiry): JsonResponse
    {
        try {
            $validated = $request->validate([
                'reply_message' => 'required|string'
            ]);

            $inquiry->update([
                'reply_message' => $validated['reply_message'],
                'is_viewed' => true,
                'is_replyed' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reply sent successfully',
                'data' => $inquiry
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
