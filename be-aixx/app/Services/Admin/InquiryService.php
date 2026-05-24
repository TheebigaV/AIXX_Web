<?php

namespace App\Services\Admin;


use App\Models\Inquiry;
use App\Repositories\Admin\InquiryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;


class InquiryService
{
    /**
     * @var InquiryRepository
     */
    private InquiryRepository $inquiryRepository;

    /**
     * @param InquiryRepository $inquiryRepository
     */
    public function __construct(InquiryRepository $inquiryRepository)
    {
        $this->inquiryRepository = $inquiryRepository;
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->inquiryRepository->paginate($itemPerPage, $columns);
    }


    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->inquiryRepository->all($columns);
    }

    /**
     * @param string $id
     * @return Inquiry|null
     */
    public function find(string $id): ?Inquiry
    {
        return $this->inquiryRepository->find($id);
    }

    /**
     * @param string $column
     * @param string $value
     * @return Inquiry|null
     */
    public function findBy(string $column, string $value): ?Inquiry
    {
        return $this->inquiryRepository->findBy($column, $value);
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        return $this->inquiryRepository->update($id, $data);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->inquiryRepository->delete($id);
    }

}
