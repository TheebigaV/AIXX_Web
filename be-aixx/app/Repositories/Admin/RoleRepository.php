<?php

namespace App\Repositories\Admin;

use App\Models\RoleAndPermission\Role;
use App\Repositories\BaseRepository;
use App\Services\Admin\PermissionService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

class RoleRepository extends BaseRepository
{
    private PermissionService $permissionService;

    public function __construct(Role $role, PermissionService $permissionService)
    {
        $this->setModel($role);
        $this->permissionService = $permissionService;
    }

    /**
     * Get all roles including Super Admin
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->select($columns)->get();
    }

    public function queryBuilder(): Builder
    {
        return $this->model->whereNotIn('name', [config('role.superAdmin')]);
    }

    public function permissions(string $id): Collection
    {
        return $this->find($id)->permissions;
    }

    public function givePermission(string $role, int $permission): Role
    {
        $permission = $this->permissionService->find($permission);
        return $this->find($role)->givePermissionTo($permission);
    }

    public function revokePermission(string $role, int $permission): Role
    {
        $permission = $this->permissionService->find($permission);
        return $this->find($role)->revokePermissionTo($permission);
    }

    public function givePermissions(string $roleId, array $permissionIds): Role
    {
        $role = $this->find($roleId);
        $permissions = $this->permissionService->getByIds($permissionIds);
        $role->givePermissionTo($permissions);
        return $role->refresh();
    }

    public function revokeAllPermissions(string $roleId): Role
    {
        $role = $this->find($roleId);
        $role->permissions()->detach();
        return $role->refresh();
    }
}
