<?php

namespace App\Repositories\Auth\User;

use App\Models\User;
use App\Repositories\BaseRepository;

class ProfileRepository extends BaseRepository
{
    /**
     * @param User $model
     */
    public function __construct(User $model)
    {
        $this->setModel($model);
    }

}
