<?php

namespace App\Repositories\Admin;

use App\Models\Category;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryRepository extends BaseRepository
{
    /**
     * @param Category $model
     */
    public function __construct(Category $model)
    {
        $this->setModel($model);
    }
}
