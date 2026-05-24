<?php

namespace App\Repositories\Guest;

use App\Models\Category;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Builder;

class CategoryRepository extends BaseRepository
{
    /**
     * @param Category $model
     */
    public function __construct(Category $model)
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
