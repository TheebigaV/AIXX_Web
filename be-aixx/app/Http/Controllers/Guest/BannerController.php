<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guest\Banner\BannerCollection;
use App\Models\Banner;
use App\Services\Guest\BannerService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

/**
 *
 */
class BannerController extends Controller
{
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
     */
    public function index(Request $request): BannerCollection
    {
        return new BannerCollection(
            $this->bannerService->paginate(
                $request->get('per_page', 15),
                [
                    'id',
                    'title_1',
                    'title_2',
                    'subtitle',
                    'link'
                ]
            )
        );
    }

    /**
     * @param Request $request
     * @return BannerCollection
     */
    public function all(Request $request): BannerCollection
    {
        return new BannerCollection(
            $this->bannerService->all(
                [
                    'id',
                    'title_1',
                    'title_2',
                    'subtitle',
                    'link'
                ]
            )
        );
    }

}
