<?php

namespace App\Services\Admin;


use App\Models\Document;
use App\Repositories\Admin\DocumentRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;


class DocumentService
{
    /**
     * @var DocumentRepository
     */
    private DocumentRepository $documentRepository;

    /**
     * @param DocumentRepository $documentRepository
     */
    public function __construct(DocumentRepository $documentRepository)
    {
        $this->documentRepository = $documentRepository;
    }

    /**
     * @param string $id
     * @return Document|null
     */
    public function find(string $id): ?Document
    {
        return $this->documentRepository->find($id);
    }

    /**
     * @param string $class
     * @param string $id
     * @param array $data
     * @return Document
     */
    public function create(string $class, string $id, array $data): Document
    {
        $data['user_id'] = auth()->id();
        $data['class'] = $class;
        $data['id'] = $id;
        $data['model'] = class_basename($class);
        return $this->documentRepository->create($data);
    }


    /**
     * @param string $column
     * @param string $value
     * @return Document|null
     */
    public function findBy(string $column, string $value): ?Document
    {
        return $this->documentRepository->findBy($column, $value);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->documentRepository->delete($id);
    }

}
