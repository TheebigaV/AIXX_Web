<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Get paginated inquiries for admin.
     */
    public function index(Request $request): JsonResponse
    {
        // TODO: Re-enable after permissions are properly set up
        // $this->authorize('viewAny', Inquiry::class);

        
        $perPage = (int) $request->get('per_page', 10);
        $paginator = Inquiry::orderByDesc('created_at')->paginate($perPage);

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (Inquiry $inquiry) => $this->transformInquiry($inquiry))
        );

        return response()->json($paginator);
    }

    /**
     * Get all inquiries without pagination.
     */
    public function all(Request $request): JsonResponse
    {
        // TODO: Re-enable after permissions are properly set up
        // $this->authorize('viewAny', Inquiry::class);

        $inquiries = Inquiry::orderByDesc('created_at')->get()->map(
            fn (Inquiry $inquiry) => $this->transformInquiry($inquiry)
        );

        return response()->json(['data' => $inquiries]);
    }

    /**
     * Display a single inquiry.
     */
    public function show(string $inquiry): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($inquiry);
        // TODO: Re-enable after permissions are properly set up
        // $this->authorize('view', $inquiry);

        return response()->json($this->transformInquiry($inquiry));
    }

    /**
     * Send a reply to an inquiry.
     */
    public function sendReply(string $inquiry, Request $request): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($inquiry);
        // TODO: Re-enable after permissions are properly set up
        // $this->authorize('update', $inquiry);

        $validated = $request->validate([
            'reply_message' => 'required|string',
        ]);

        $inquiry->update([
            'reply_message' => $validated['reply_message'],
            'is_replyed' => true,
        ]);

        \Illuminate\Support\Facades\Notification::route('mail', $inquiry->customer_email)
            ->notify(new \App\Notifications\AdminInquiryReplyNotification($inquiry));

        return response()->json([
            'message' => 'Reply sent successfully',
            'data' => $this->transformInquiry($inquiry),
        ]);
    }

    /**
     * Delete an inquiry.
     */
    public function destroy(string $inquiry): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($inquiry);
        // TODO: Re-enable after permissions are properly set up
        // $this->authorize('delete', $inquiry);

        $inquiry->delete();

        return response()->json([
            'message' => 'Inquiry deleted successfully',
        ]);
    }

    /**
     * Transform inquiry payload for frontend compatibility.
     */
    private function transformInquiry(Inquiry $inquiry): array
    {
        return array_merge($inquiry->toArray(), [
            'name' => $inquiry->customer_name,
            'email' => $inquiry->customer_email,
        ]);
    }
}
