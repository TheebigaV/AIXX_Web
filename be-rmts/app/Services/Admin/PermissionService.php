<?php

namespace App\Services\Admin;


use App\Repositories\Admin\PermissionRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    protected PermissionRepository $PermissionRepository;

    /**
     * @param PermissionRepository $PermissionRepository
     */
    public function __construct(PermissionRepository $PermissionRepository)
    {
        $this->PermissionRepository = $PermissionRepository;
    }

    /**
     * @param string $id
     * @return Permission|null
     */
    public function find(string $id): ?Permission
    {
        return $this->PermissionRepository->find($id);
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->PermissionRepository->all($columns);
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        return $this->PermissionRepository->update($id, $data);
    }

    /**
     * @param array $ids
     * @return Collection
     */
    public function getByIds(array $ids): Collection
    {
        return $this->PermissionRepository->whereBy('id', $ids);
    }
}
