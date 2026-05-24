<?php

namespace App\Services\Guest;


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
}
