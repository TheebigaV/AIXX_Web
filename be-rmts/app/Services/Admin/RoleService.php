<?php

namespace App\Services\Admin;

use App\Repositories\Admin\RoleRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class RoleService
{
    protected RoleRepository $roleRepository;

    /**
     * @param RoleRepository $roleRepository
     */
    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    /**
     * @param string $id
     * @return Role|null
     */
    public function find(string $id): ?Role
    {
        return $this->roleRepository->find($id);
    }


    /**
     * @param string $column
     * @param string $value
     * @return Role|null
     */
    public function findBy(string $column, string $value): ?Role
    {
        return $this->roleRepository->findBy($column, $value);
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->roleRepository->all($columns);
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->roleRepository->paginate($itemPerPage, $columns);
    }

    /**
     * @param array $data
     * @return Role
     */
    public function create(array $data): Role
    {
        $data['guard_name'] = 'web';
        $permissionsIds = $data['permission_ids'];
        $role = $this->roleRepository->create($data);
        if (!empty($permissionsIds)) {
            $this->givePermissions($role->id, $permissionsIds);
        }
        return $role;
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        $permissionsIds = $data['permission_ids'];
        $role = $this->roleRepository->update($id, $data);
        $this->revokeAllPermissions($id);
        if (!empty($permissionsIds)) {
            $this->givePermissions($id, $permissionsIds);
        }
        return $role;
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->roleRepository->delete($id);
    }

    /**
     * @param string $id
     * @return Collection
     */
    public function permissions(string $id): Collection
    {
        return $this->roleRepository->permissions($id);
    }

    /**
     * @param string $role
     * @param int $permission
     * @return Role
     */
    public function givePermission(string $role, int $permission): Role
    {
        return $this->roleRepository->givePermission($role, $permission);
    }

    /**
     * Give multiple permissions to a role.
     *
     * @param string $roleId
     * @param array $permissionIds
     * @return Role
     */
    public function givePermissions(string $roleId, array $permissionIds): Role
    {
        return $this->roleRepository->givePermissions($roleId, $permissionIds);
    }

    /**
     * @param string $role
     * @param int $permission
     * @return Role
     */
    public function revokePermission(string $role, int $permission): Role
    {
        return $this->roleRepository->revokePermission($role, $permission);
    }

    /**
     * Revoke all permissions from a role.
     *
     * @param string $roleId
     * @return Role
     */
    public function revokeAllPermissions(string $roleId): Role
    {
        return $this->roleRepository->revokeAllPermissions($roleId);
    }
}
