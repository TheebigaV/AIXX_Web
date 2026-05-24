<?php

namespace App\Repositories\Auth\RoleAndPermission\Role;

use App\Services\Auth\RoleAndPermission\Permission\PermissionService;
use App\Models\RoleAndPermission\Role;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

/**
 *
 */
class RoleRepository extends BaseRepository
{
    /**
     * @var PermissionService
     */
    private PermissionService $permissionService;

    /**
     * @param Role $model
     * @param PermissionService $permissionService
     */
    public function __construct(Role $model, PermissionService $permissionService)
    {
        $this->setModel($model);
        $this->permissionService = $permissionService;
    }

    /**
     * @return Builder
     */
    public function queryBuilder(): Builder
    {
        return $this->model->whereNotIn('name', [config('role.superAdmin'), config('role.employee')]);
    }

    /**
     * @param string $id
     * @return Collection
     */
    public function permissions(string $id): Collection
    {
        return $this->find($id)->permissions;
    }

    /**
     * @param string $role
     * @param int $permission
     * @return Role
     */
    public function givePermission(string $role, int $permission): Role
    {
        $permission = $this->permissionService->find($permission);
        return $this->find($role)->givePermissionTo($permission);
    }

    /**
     * @param string $roleId
     * @param array $permissionIds
     * @return Role
     */
    public function givePermissions(string $roleId, array $permissionIds): Role
    {
        $role = $this->find($roleId);
        $permissions = $this->permissionService->getByIds($permissionIds);
        $role->givePermissionTo($permissions);
        return $role->refresh();
    }

    /**
     * @param string $role
     * @param int $permission
     * @return Role
     */
    public function revokePermission(string $role, int $permission): Role
    {
        $permission = $this->permissionService->find($permission);
        return $this->find($role)->revokePermissionTo($permission);
    }

    /**
     * @param string $roleId
     * @return Role
     */
    public function revokeAllPermissions(string $roleId): Role
    {
        $role = $this->find($roleId);
        $role->permissions()->detach();
        return $role->refresh();
    }

}
