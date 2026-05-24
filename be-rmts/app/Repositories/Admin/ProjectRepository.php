<?php

namespace App\Repositories\Admin;

use App\Models\Project;
use App\Repositories\BaseRepository;

class ProjectRepository extends BaseRepository
{
    /**
     * @param Project $model
     */
    public function __construct(Project $model)
    {
        $this->setModel($model);
    }

}
