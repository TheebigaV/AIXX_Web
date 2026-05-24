<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Banner\StoreBannerRequest;
use App\Http\Requests\Admin\Banner\UpdateBannerRequest;
use App\Http\Requests\Admin\Banner\DeleteBannerRequest;
use App\Http\Resources\Admin\Banner\BannerCollection;
use App\Http\Resources\Admin\Banner\BannerResource;
use App\Models\Banner;
use App\Services\Admin\BannerService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 *
 */
class BannerController extends Controller
{
    /**
     * @var BannerService
     */
    private BannerService $bannerService;

    /**
     * @param BannerService $bannerService
     */
    public function __construct(BannerService $bannerService)
    {
        $this->bannerService = $bannerService;
    }

    /**
     * @param Request $request
     * @return BannerCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): BannerCollection
    {
        $this->authorize('viewAny', Banner::class);
        return new BannerCollection(
            $this->bannerService->paginate(
                $request->get('per_page', 15),
                [
                    'id',
                    'title_1',
                    'title_2',
                    'subtitle',
                    'is_active',
                    'link'
                ]
            )
        );
    }

    /**
     * @param Request $request
     * @return BannerCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): BannerCollection
    {
        $this->authorize('viewAny', Banner::class);
        $query = Banner::with('image');
        if ($request->has('page')) {
            $query->where('page', $request->get('page'));
        }
        return new BannerCollection($query->get());
    }

    /**
     * @param StoreBannerRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreBannerRequest $request): JsonResponse
    {
        $this->authorize('create', Banner::class);
        $banner = $this->bannerService->create($request->validated());
        return response()->json([
            'message' => 'Banner created successfully',
            'banner' => new BannerResource($banner),
        ], 201);
    }

    /**
     * @param string $id
     * @return BannerResource
     * @throws AuthorizationException
     */
    public function show(string $id): BannerResource
    {
        $banner = $this->bannerService->find($id);
        $this->authorize('view', $banner);
        return new BannerResource($banner);
    }

    /**
     * @param UpdateBannerRequest $request
     * @param string $id
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateBannerRequest $request, string $id): JsonResponse
    {
        $banner = $this->bannerService->find($id);
        $this->authorize('update', $banner);
        $this->bannerService->update($id, $request->validated());
        return response()->json([
            'message' => 'Banner updated successfully'
        ]);
    }

    /**
     * @param DeleteBannerRequest $request
     * @param string $id
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(DeleteBannerRequest $request, string $id): JsonResponse
    {
        $banner = $this->bannerService->find($id);
        $this->authorize('delete', $banner);
        $this->bannerService->delete($id);
        return response()->json([
            'message' => 'Banner deleted successfully'
        ]);
    }

    /**
     * @return BannerResource|null
     */
    public function latestPublic(): ?BannerResource
    {
        $banner = Banner::latest()->first();

        if (!$banner) {
            return null;
        }

        $banner->image_url = $banner->image ? Storage::url($banner->image) : null;

        return new BannerResource($banner);
    }
}
