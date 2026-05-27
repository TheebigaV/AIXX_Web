<?php

namespace App\Repositories\Admin;

use App\Models\Training;
use App\Repositories\BaseRepository;

class TrainingRepository extends BaseRepository
{
    /**
     * @param Training $model
     */
    public function __construct(Training $model)
    {
        $this->setModel($model);
    }
}
