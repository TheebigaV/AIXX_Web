<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\DeleteUserRequest;
use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Http\Resources\Admin\User\UserCollection;
use App\Http\Resources\Admin\User\UserResource;
use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @var UserService
     */
    private UserService $userService;

    /**
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @param Request $request
     * @return UserCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): UserCollection
    {
        $this->authorize('viewany', [User::class]);
        return new UserCollection($this->userService->paginate(
            $request->get('per_page', 15),
            [
                'id',
                'email',
                'name',
                'is_active'
            ]
        ));
    }

    /**
     * @param Request $request
     * @return UserCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): UserCollection
    {
        $this->authorize('viewany', [User::class]);
        return new UserCollection($this->userService->all(
            [
                'id',
                'email',
                'name',
                'is_active'
            ]
        ));
    }

    /**
     * @param StoreUserRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $this->authorize('create', [User::class]);
        $user = $this->userService->create($request->validated());
        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * @param string $user
     * @return UserResource
     * @throws AuthorizationException
     */
    public function show(string $user): UserResource
    {
        $user = $this->userService->find($user);
        $this->authorize('view', [$user]);
        return new UserResource($user);
    }

    /**
     * @param UpdateUserRequest $request
     * @param string $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateUserRequest $request, string $user): JsonResponse
    {
        $this->authorize('update', [$this->userService->find($user)]);
        $this->userService->update($user, $request->validated());
        return response()->json([
            'message' => 'User updated successfully',
        ], 200);
    }

    /**
     * @param DeleteUserRequest $request
     * @param string $user
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(DeleteUserRequest $request, string $user): JsonResponse
    {
        $this->authorize('delete', [$this->userService->find($user)]);
        $this->userService->delete($user);
        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }
}
