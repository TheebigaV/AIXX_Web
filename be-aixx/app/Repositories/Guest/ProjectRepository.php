<?php

namespace App\Repositories\Guest;

use App\Models\Category;
use App\Models\Project;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Builder;

/**
 *
 */
class ProjectRepository extends BaseRepository
{
    /**
     * @param Project $model
     */
    public function __construct(Project $model)
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

    /**
     * @param int $count
     * @param array $columns
     * @return mixed
     */
    public function getRandom(int $count = 3, array $columns = ['*']): mixed
    {
        // return $this->model->inRandomOrder()->select($columns)->limit($count)->get();
         return $this->queryBuilder()
            ->inRandomOrder()
            ->select($columns)
            ->limit($count)
            ->get();
    }

}
