<?php

namespace App\Repositories\Auth\RoleAndPermission\Permission;

use App\Models\RoleAndPermission\Permission;
use App\Repositories\BaseRepository;

/**
 *
 */
class PermissionRepository extends BaseRepository
{
    /**
     * @param Permission $model
     */
    public function __construct(Permission $model)
    {
        $this->setModel($model);
    }
}
