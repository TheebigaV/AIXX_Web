<?php

namespace App\Services\Admin;


use App\Models\User;
use App\Repositories\Admin\RoleRepository;
use App\Repositories\Admin\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * @var UserRepository
     */
    private UserRepository $userRepository;
    private RoleRepository $roleRepository;

    /**
     * @param UserRepository $userRepository
     * @param RoleRepository $roleRepository
     */
    public function __construct(UserRepository $userRepository, RoleRepository $roleRepository)
    {
        $this->userRepository = $userRepository;
        $this->roleRepository = $roleRepository;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->userRepository->paginate($itemPerPage, $columns);
    }


    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->userRepository->all($columns);
    }

    /**
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data);

        if (!empty($data['role_ids'])) {
            $user->roles()->detach();
            $user->roles()->attach($data['role_ids']);
        }
        return $user;
    }

    /**
     * @param string $id
     * @return User|null
     */
    public function find(string $id): ?User
    {
        return $this->userRepository->find($id);
    }

    /**
     * @param string $column
     * @param string $value
     * @return User|null
     */
    public function findBy(string $column, string $value): ?User
    {
        return $this->userRepository->findBy($column, $value);
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $user = $this->find($id);
        if (!empty($data['role_ids'])) {
            $user->roles()->detach();
            $user->roles()->attach($data['role_ids']);
        }
        return $this->userRepository->update($id, $data);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->userRepository->delete($id);
    }

}
