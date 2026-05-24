<?php

namespace App\Repositories\Admin;

use App\Models\Product;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository
{
    /**
     * @param Product $model
     */
    public function __construct(Product $model)
    {
        $this->setModel($model);
    }
}
