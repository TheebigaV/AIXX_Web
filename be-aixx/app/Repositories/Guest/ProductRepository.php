<?php

namespace App\Repositories\Guest;

use App\Models\Category;
use App\Models\Product;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository
{
    /**
     * @param Product $model
     */
    public function __construct(Product $model)
    {
        $this->setModel($model);
    }

    public function queryBuilder(): Builder
    {
        return $this->model->where('is_active', true);
    }

    /**
     * @param Builder $builder
     * @return Builder
     */
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
//                     ->orwhere('category_id',$request->category_id)
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
     * @param int $count
     * @param array $columns
     * @return mixed
     */
    public function getRandom(int $count = 3, array $columns = ['*']): mixed
    {
        return $this->model->inRandomOrder()->select($columns)->limit($count)->get();
    }
//     public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
// {
//     $builder = $this->model->newQuery();
//     $builder = $this->filters($builder); // Apply filters

//     return $builder->select($columns)
//                    ->paginate($perPage)
//                    ->appends(request()->query());
// }
}
