<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\StoreCategoryRequest;
use App\Http\Requests\Admin\Category\UpdateCategoryRequest;
use App\Http\Requests\Admin\Category\DeleteCategoryRequest;
use App\Http\Resources\Admin\Category\CategoryResource;
use App\Http\Resources\Admin\Category\CategoryCollection;
use App\Models\Category;
use App\Services\Admin\CategoryService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 *
 */
class CategoryController extends Controller
{
    /**
     * @var CategoryService
     */
    private CategoryService $categoryService;

    /**
     * @param CategoryService $categoryService
     */
    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * @param Request $request
     * @return CategoryCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): CategoryCollection
    {
        $this->authorize('viewany', [Category::class]);
        return new CategoryCollection(
            $this->categoryService->paginate(
                $request->get('per_page', 15),
                ['id', 'name', 'slug', 'description', 'is_active']
            ));
    }

    /**
     * @param Request $request
     * @return CategoryCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): CategoryCollection
    {
        $this->authorize('viewany', [Category::class]);
        return new CategoryCollection(
            $this->categoryService->all(
                ['id', 'name', 'slug', 'description', 'is_active']
            )
        );
    }

    /**
     * @param StoreCategoryRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $this->authorize('create', [Category::class]);
        $category = $this->categoryService->create($request->validated());
        return response()->json([
            'message' => 'Category created successfully',
            'category' => new CategoryResource($category),
        ], 201);
    }

    /**
     * @param string $category
     * @return CategoryResource
     * @throws AuthorizationException
     */
    public function show(string $category): CategoryResource
    {
        $category = $this->categoryService->find($category);
        $this->authorize('view', [$category]);
        return new CategoryResource($category);
    }

    /**
     * @param UpdateCategoryRequest $request
     * @param string $category
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateCategoryRequest $request, string $category): JsonResponse
    {
        $this->authorize('update', [$this->categoryService->find($category)]);
        $this->categoryService->update($category, $request->validated());
        return response()->json([
            'message' => 'Category updated successfully',
        ]);
    }

    /**
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $category = $this->categoryService->find($id);
        $this->authorize('delete', $category);
        $this->categoryService->delete($id);
        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }

}
