<?php

namespace App\Repositories\Guest;

use App\Models\Banner;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Builder;

class BannerRepository extends BaseRepository
{
    /**
     * @param Banner $model
     */
    public function __construct(Banner $model)
    {
        $this->setModel($model);
    }

    /**
     * @return Builder
     */
    public function queryBuilder(): Builder
    {
        return $this->model->where('is_active', true);
    }
}
