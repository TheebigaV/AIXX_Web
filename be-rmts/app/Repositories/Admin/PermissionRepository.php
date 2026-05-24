<?php

namespace App\Repositories\Admin;

use App\Models\RoleAndPermission\Permission;
use App\Repositories\BaseRepository;

class PermissionRepository extends BaseRepository
{
    /**
     * @param Permission $permission
     */
    public function __construct(Permission $permission)
    {
        $this->setModel($permission);
    }
}
