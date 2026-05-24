<?php

namespace App\Services\Admin;


use App\Models\Customer;
use App\Repositories\Admin\CustomerRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;


class CustomerService
{
    /**
     * @var CustomerRepository
     */
    private CustomerRepository $customerRepository;

    /**
     * @param CustomerRepository $customerRepository
     */
    public function __construct(CustomerRepository $customerRepository)
    {
        $this->customerRepository = $customerRepository;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->customerRepository->paginate($itemPerPage, $columns);
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->customerRepository->all($columns);
    }

    /**
     * @param array $data
     * @return Customer
     */
    public function create(array $data): Customer
    {
        return $this->customerRepository->create($data);
    }

    /**
     * @param string $id
     * @return Customer|null
     */
    public function find(string $id): ?Customer
    {
        return $this->customerRepository->find($id);
    }

    /**
     * @param string $column
     * @param string $value
     * @return Customer|null
     */
    public function findBy(string $column, string $value): ?Customer
    {
        return $this->customerRepository->findBy($column, $value);
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        return $this->customerRepository->update($id, $data);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->customerRepository->delete($id);
    }

}
