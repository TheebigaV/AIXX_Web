<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\DeleteRoleRequest;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Http\Requests\Admin\Role\UpdateRoleRequest;
use App\Http\Resources\Admin\Role\PermissionCollection;
use App\Http\Resources\Admin\Role\RoleCollection;
use App\Http\Resources\Admin\Role\RolePermissionResource;
use App\Http\Resources\Admin\Role\RoleResource;
use App\Models\RoleAndPermission\Role;
use App\Services\Admin\PermissionService;
use App\Services\Admin\RoleService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 *
 */
class RoleController extends Controller
{
    /**
     * @var RoleService
     */
    private RoleService $roleService;
    /**
     * @var PermissionService
     */
    private PermissionService $permissionService;

    /**
     * @param RoleService $roleService
     * @param PermissionService $permissionService
     */
    public function __construct(RoleService $roleService, PermissionService $permissionService)
    {
        $this->roleService = $roleService;
        $this->permissionService = $permissionService;
    }

    /**
     * @param Request $request
     * @return RoleCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): RoleCollection
    {
        $this->authorize('viewany', Role::class);
        return new RoleCollection($this->roleService->paginate(
            $request->get('per_page', 15),
            [
                'id',
                'name'
            ]
        ));
    }

    /**
     * @param Request $request
     * @return RoleCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): RoleCollection
    {
        $this->authorize('viewAny', Role::class);
        return new RoleCollection($this->roleService->all(
            [
                'id',
                'name'
            ]
        ));
    }

    /**
     * @param StoreRoleRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        $this->authorize('create', Role::class);

        return response()->json([
            'message' => 'Role created successfully',
            'role' => new RoleResource($this->roleService->create($request->validated())),
        ], 201);
    }

    /**
     * @param string $role
     * @return RolePermissionResource
     * @throws AuthorizationException
     */
    public function show(string $role): RolePermissionResource
    {
        $role = $this->roleService->find($role);
        $this->authorize('view', $role);
        return new RolePermissionResource($role);

    }

    /**
     * @param UpdateRoleRequest $request
     * @param string $role
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateRoleRequest $request, string $role): JsonResponse
    {
        $this->authorize('update', $this->roleService->find($role));
        $this->roleService->update($role, $request->validated());
        return response()->json([
            'message' => 'Role updated successfully',
        ], 200);
    }

    /**
     * @param DeleteRoleRequest $request
     * @param string $role
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(DeleteRoleRequest $request, string $role): JsonResponse
    {
        $this->authorize('delete', $this->roleService->find($role));
        $this->roleService->delete($role);
        return response()->json([
            'message' => 'Role deleted successfully',
        ], 200);
    }

    /**
     * @param Request $request
     * @return PermissionCollection
     * @throws AuthorizationException
     */
    public function getAllPermissions(Request $request): PermissionCollection
    {
        $this->authorize('viewany', Role::class);
        return new PermissionCollection($this->permissionService->all());
    }

    /**
     * @param string $role
     * @return PermissionCollection
     * @throws AuthorizationException
     */
    public function permissions(string $role): PermissionCollection
    {
        $this->authorize('view', $this->roleService->find($role));
        return new PermissionCollection($this->roleService->permissions($role));
    }

    /**
     * @param string $role
     * @param int $permission
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function givePermission(string $role, int $permission): JsonResponse
    {
        $this->authorize('update', $this->roleService->find($role));
        return response()->json([
            'message' => 'Permission added successfully.',
            'role' => new RolePermissionResource($this->roleService->givePermission($role, $permission)),
        ], 200);
    }

    /**
     * @param string $role
     * @param int $permission
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function revokePermission(string $role, int $permission): JsonResponse
    {
        $this->authorize('update', $this->roleService->find($role));
        return response()->json([
            'message' => 'Permission removed successfully.',
            'role' => new RolePermissionResource($this->roleService->revokePermission($role, $permission)),
        ], 200);
    }


}
