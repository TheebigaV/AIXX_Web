<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateRegistration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateRegistrationController extends Controller
{
    /**
     * Get paginated certificate registrations for admin.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 10);
        $search = $request->get('search');
        
        $query = CertificateRegistration::query();
        
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('registration_id', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc'); // last entry first by default
        
        // Safety checking for allowed sort columns
        $allowedSort = ['full_name', 'email', 'registration_id', 'company_name', 'phone', 'country', 'test_score', 'passed', 'created_at'];
        if (in_array($sortBy, $allowedSort)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginator = $query->paginate($perPage);

        return response()->json($paginator);
    }

    /**
     * Delete a registration.
     */
    public function destroy(string $id): JsonResponse
    {
        $registration = CertificateRegistration::findOrFail($id);
        $registration->delete();

        return response()->json([
            'message' => 'Registration deleted successfully',
        ]);
    }
}
