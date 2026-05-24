<?php

namespace App\Services\Admin;


use App\Models\Banner;
use App\Repositories\Admin\BannerRepository;
use App\Types;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

/**
 *
 */
class BannerService
{
    /**
     * @var BannerRepository
     */
    private BannerRepository $bannerRepository;
    /**
     * @var DocumentService
     */
    private DocumentService $documentService;

    /**
     * @param BannerRepository $bannerRepository
     * @param DocumentService $documentService
     */
    public function __construct(BannerRepository $bannerRepository, DocumentService $documentService)
    {
        $this->bannerRepository = $bannerRepository;
        $this->documentService = $documentService;
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
     * Create a new banner.
     */
    public function create(array $data): Banner
    {
        $banner = $this->bannerRepository->create($data);
        $data['type'] = Types::Image;
        $this->documentService->create(Banner::class, $banner->id, $data);
        return $banner;
    }

    /**
     * Find a banner by ID.
     */
    public function find(string $id): ?Banner
    {
        return $this->bannerRepository->find($id);
    }

    /**
     * Update a banner.
     */
    public function update(string $id, array $data): bool
    {
        if (isset($data['image'])) {
            $banner = $this->bannerRepository->find($id);
            $banner->image->delete();
            $data['type'] = Types::Image;
            $this->documentService->create(Banner::class, $banner->id, $data);
        }
        return $this->bannerRepository->update($id, $data);
    }

    /**
     * Delete a banner.
     */
    public function delete(string $id): bool
    {
        return $this->bannerRepository->delete($id);
    }
}
