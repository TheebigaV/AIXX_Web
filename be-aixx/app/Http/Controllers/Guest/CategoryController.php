<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guest\Category\CategoryCollection;
use App\Http\Resources\Guest\Category\CategoryResource;
use App\Models\Category;
use App\Services\Guest\CategoryService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;

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
     */
    public function index(Request $request): CategoryCollection
    {
        return new CategoryCollection(
            $this->categoryService->paginate(
                $request->get('per_page', 15),
                [
                    'id',
                    'name',
                    'slug'
                ]
            ));
    }

    /**
     * @param Request $request
     * @return CategoryCollection
     */
    public function all(Request $request): CategoryCollection
    {
        return new CategoryCollection(
            $this->categoryService->all(
                [
                    'is_active',
                    'id',
                    'name',
                    'slug'
                ]
            )
        );
    }

    /**
     * @param string $category
     * @return CategoryResource
     */
    public function show(string $category): CategoryResource
    {
        $category = $this->categoryService->findBySlug($category);
        if (!$category) {
            abort(404, 'Category not found');
        }
        return new CategoryResource($category);
    }
}
