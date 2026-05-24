<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inquiry;
use App\Models\Category;
use App\Models\Banner;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Get dashboard metrics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function metrics()
    {
        try {
            $metrics = [
                'enquiries' => $this->getEnquiriesMetric(),
                'categories' => $this->getCategoriesMetric(),
                'banners' => $this->getBannersMetric(),
                'users' => $this->getUsersMetric(),
                'recentInquiries' => Inquiry::latest()->take(5)->get(),
                'contentStatus' => $this->getContentStatus(),
                'categoriesWithCount' => $this->getCategoriesWithProductCount(),
            ];

            return response()->json([
                'success' => true,
                'data' => $metrics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get enquiries metric
     *
     * @return array
     */
    private function getEnquiriesMetric()
    {
        $current = Inquiry::count();
        $previous = Inquiry::where('created_at', '<', now()->startOfMonth())->count();
        $change = $current - $previous;

        return [
            'label' => 'Enquiries',
            'value' => $current,
            'change' => $change,
            'trend' => $change >= 0 ? 'up' : 'down',
            'icon' => 'group'
        ];
    }

    /**
     * Get categories metric
     *
     * @return array
     */
    private function getCategoriesMetric()
    {
        $current = Category::count();
        $previous = Category::where('created_at', '<', now()->startOfMonth())->count();
        $change = $current - $previous;

        return [
            'label' => 'Categories',
            'value' => $current,
            'change' => $change,
            'trend' => $change >= 0 ? 'up' : 'down',
            'icon' => 'box'
        ];
    }

    /**
     * Get banners metric
     *
     * @return array
     */
    private function getBannersMetric()
    {
        $current = Banner::count();
        $active = Banner::where('is_active', true)->count();

        return [
            'label' => 'Banners',
            'value' => $current,
            'active' => $active,
            'icon' => 'box'
        ];
    }

    /**
     * Get users metric
     *
     * @return array
     */
    private function getUsersMetric()
    {
        $current = User::count();

        return [
            'label' => 'Users',
            'value' => $current,
            'icon' => 'group'
        ];
    }

    /**
     * Get content status overview
     *
     * @return array
     */
    private function getContentStatus()
    {
        $categoriesActive = Category::where('is_active', true)->count();
        $bannersActive = Banner::where('is_active', true)->count();

        return [
            'total_content' => $categoriesActive + $bannersActive,
            'categories_active' => $categoriesActive,
            'banners_active' => $bannersActive,
        ];
    }

    /**
     * Get categories with their product count
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getCategoriesWithProductCount()
    {
        return Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);
    }
}
