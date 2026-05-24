<?php

namespace App\Repositories\Admin;

use App\Models\Banner;
use App\Repositories\BaseRepository;

class BannerRepository extends BaseRepository
{
    /**
     * @param Banner $model
     */
    public function __construct(Banner $model)
    {
        $this->setModel($model);
    }

}
