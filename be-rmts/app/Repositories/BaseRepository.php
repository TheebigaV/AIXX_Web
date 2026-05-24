<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Category;

abstract class BaseRepository
{
    /**
     * @var Model $model
     */
    protected Model $model;

    /**
     * @param Model $model
     * @return void
     */
    public function setModel(Model $model): void
    {
        $this->model = $model;
    }

    /**
     * @return Builder
     */
    public function queryBuilder(): Builder
    {
        return $this->model->query();
    }

    /**
     * @return Builder
     */
    protected function query(): Builder
    {
        $builder = $this->queryBuilder();

        // Apply filters
        if (!empty($this->model->filterable)) {
            $builder = $this->filters($builder);
        }

        // Apply relations
        if (!empty($this->model->relationable)) {
            $builder = $this->relations($builder);
        }

        return $builder;
    }

    /**
     * @param Builder $builder
     * @return Builder
     */
    protected function relations(Builder $builder): Builder
    {
        foreach ($this->model->relationable as $key => $columns) {
            $builder->with([$key => function ($q) use ($columns) {
                $q->select($columns);
            }]);
        }

        return $builder;
    }

    /**
     * Apply filters to the query builder
     *
     * @param Builder $builder
     * @return Builder
     */
    protected function filters(Builder $builder): Builder
    {
        foreach (request()->all() as $key => $value) {
            // Skip null or empty values
            if (is_null($value) || $value === '') continue;

            // Special handling for category_slug
            if ($key === 'category_slug'|| $key === 'category') {
                $category = Category::where('slug', $value)->first();
                if ($category) {
                    $builder->where('category_id', $category->id);
                }
                continue;
            }

            // Skip if key is not in filterable array
            if (!array_key_exists($key, $this->model->filterable)) continue;

            // Apply filter based on operator
            $operator = $this->model->filterable[$key];
            if ($operator === 'like') {
                $builder->where($key, 'like', '%' . $value . '%');
            } else {
                $builder->where($key, $operator, $value);
            }
        }

        // foreach (request()->all() as $key => $value) {
        //     if (is_null($value) || !array_key_exists($key, $this->model->filterable)) continue;
        //     $operator = $this->model->filterable[$key];
        //     $builder->where($key, $operator, $value . ($operator == 'like' ? '%' : null));
        // }
        // foreach (request()->all() as $key => $value) {
        //     if (is_null($value)) continue;
        //     // Special handling for category_slug
        //     if ($key === 'category_slug') {

        //         $category = Category::where('slug', $value)->first();
        //         if ($category) {
        //             $builder->where('category_id', $category->id);
        //         }
        //         continue; // skip normal filter for this key
        //     }

        //     if (!array_key_exists($key, $this->model->filterable)) continue;

        //     $operator = $this->model->filterable[$key];
        //     $builder->where($key, $operator, $value . ($operator == 'like' ? '%' : null));
        // }


        return $builder;
    }

//     protected function filters(Builder $builder): Builder
// {
//     $request = request();

//     \Log::info('=== FILTERS METHOD STARTED ===');
//     \Log::info('All request parameters:', $request->all());

//     // Handle name/search filter FIRST
//     if ($request->has('name') && !empty($request->name)) {
//         \Log::info("Processing name search: " . $request->name);
//         $builder->where(function ($query) use ($request) {
//             $query->where('name', 'like', '%' . $request->name . '%')
//                   ->orWhere('description', 'like', '%' . $request->name . '%');
//         });
//         \Log::info("Name search filter added for: " . $request->name);
//     }

//     // Handle category filter SECOND
//     if ($request->has('category') && !empty($request->category)) {
//         \Log::info("Processing category: " . $request->category);
//         $category = Category::where('slug', $request->category)->first();
//         if ($category) {
//             $builder->where('category_id', $category->id);
//             \Log::info("Category found: {$category->id}, added category filter");
//         } else {
//             \Log::info("Category NOT found for slug: " . $request->category);
//         }
//     }

//     // Handle other filterable parameters
//     foreach ($request->all() as $key => $value) {
//         // Skip null or empty values
//         if (is_null($value) || $value === '') {
//             \Log::info("Skipping empty key: {$key}");
//             continue;
//         }

//         // Skip already handled parameters
//         if (in_array($key, ['category', 'name', 'page', 'per_page'])) { // Removed 'search'
//             continue;
//         }

//         // Skip if key is not in filterable array
//         if (!array_key_exists($key, $this->model->filterable)) {
//             \Log::info("Key not in filterable: {$key}");
//             continue;
//         }

//         // Apply filter based on operator
//         $operator = $this->model->filterable[$key];
//         if ($operator === 'like') {
//             $builder->where($key, 'like', '%' . $value . '%');
//         } else {
//             $builder->where($key, $operator, $value);
//         }
//         \Log::info("Applied filter: {$key} {$operator} {$value}");
//     }

//     \Log::info('=== FILTERS METHOD COMPLETED ===');
//     \Log::info('Final SQL: ' . $builder->toSql());
//     \Log::info('Bindings: ', $builder->getBindings());

//     return $builder;
// }
    /**
     * @param string $id
     * @return mixed
     */
    public function find(string $id): mixed
    {
        return $this->model->findOrFail($id);
    }

    /**
     * @param string $column
     * @param string $value
     * @return mixed
     */
    public function findBy(string $column, string $value): mixed
    {
        $record = $this->model->where($column, $value)->first();
        return $record ?? null;
    }

    /**
     * @param string $column
     * @param array $value
     * @return Collection
     */
    public function whereBy(string $column, array $value): Collection
    {
        return $this->model->whereIn($column, $value)->get();
    }

    /**
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->query()->select($columns)->get();
    }

    /**
     * @param int $itemPerPage
     * @param array $columns
     * @return LengthAwarePaginator
     */
    public function paginate(int $itemPerPage = 5, array $columns = ['*']): LengthAwarePaginator
    {

        return $this->query()->select($columns)->paginate($itemPerPage);
    }

    /**
     * @param int $limit
     * @param array $columns
     * @param string $column
     * @param string $direction
     * @return Collection
     */
    public function take(int $limit = 5, array $columns = ['*'], string $column = 'created_at', string $direction = 'desc'): Collection
    {
        return $this->query()->select($columns)->orderBy($column, $direction)->limit($limit)->get();
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function create(array $data): mixed
    {
        return $this->model->create($data);
    }

    /**
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool
    {
        return $this->find($id)->fill($data)->save();
    }

    /**
     * @param string $column
     * @param string $value
     * @param array $data
     * @return bool
     */
    public function updateBy(string $column, string $value, array $data): bool
    {
        return $this->model->where($column, $value)->update($data);
    }

    /**
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool
    {
        return $this->find($id)->delete();
    }
}
