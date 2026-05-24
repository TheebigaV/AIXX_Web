<?php

namespace App\Services\Guest;

use App\Models\Banner;
use App\Repositories\Guest\BannerRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

class BannerService
{
    private BannerRepository $bannerRepository;

    public function __construct(BannerRepository $bannerRepository)
    {
        $this->bannerRepository = $bannerRepository;
    }

    /**
     * Paginate banners.
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->bannerRepository->paginate($itemPerPage, $columns);
    }

    /**
     * Get all banners.
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->bannerRepository->all($columns);
    }

    /**
     * Find a banner by ID.
     */
    public function find(string $id): ?Banner
    {
        return $this->bannerRepository->find($id);
    }


}
