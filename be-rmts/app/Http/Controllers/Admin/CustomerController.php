<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Customer\StoreCustomerRequest;
use App\Http\Requests\Admin\Customer\UpdateCustomerRequest;
use App\Http\Requests\Admin\Customer\DeleteCustomerRequest;
use App\Http\Resources\Admin\Customer\CustomerCollection;
use App\Http\Resources\Admin\Customer\CustomerResource;
use App\Models\Customer;
use App\Services\Admin\CustomerService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * @var CustomerService
     */
    private CustomerService $customerService;

    /**
     * @param CustomerService $customerService
     */
    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    /**
     * @param Request $request
     * @return CustomerCollection
     * @throws AuthorizationException
     */
    public function index(Request $request): CustomerCollection
    {
        $this->authorize('viewany', [Customer::class]);
        return new CustomerCollection($this->customerService->paginate(
            $request->get('per_page', 15),
            [
                'id',
            ]
        ));
    }

    /**
     * @param Request $request
     * @return CustomerCollection
     * @throws AuthorizationException
     */
    public function all(Request $request): CustomerCollection
    {
        $this->authorize('viewany', [Customer::class]);
        return new CustomerCollection($this->customerService->all(
            [
                'id',
            ]
        ));
    }

    /**
     * @param StoreCustomerRequest $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $this->authorize('create', [Customer::class]);
        $customer = $this->customerService->create($request->validated());
        return response()->json([
            'message' => 'Customer created successfully',
            'User' => new CustomerResource($customer),
        ], 201);
    }

    /**
     * @param string $customer
     * @return CustomerResource
     * @throws AuthorizationException
     */
    public function show(string $customer): CustomerResource
    {
        $customer = $this->customerService->find($customer);
        $this->authorize('view', [$customer]);
        return new CustomerResource($customer);
    }

    /**
     * @param UpdateCustomerRequest $request
     * @param string $customer
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function update(UpdateCustomerRequest $request, string $customer): JsonResponse
    {
        $this->authorize('update', [$this->customerService->find($customer)]);
        $this->customerService->update($customer, $request->validated());
        return response()->json([
            'message' => 'Customer updated successfully',
        ], 200);
    }

    /**
     * @param DeleteCustomerRequest $request
     * @param string $customer
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function destroy(DeleteCustomerRequest $request, string $customer): JsonResponse
    {
        $this->authorize('delete', [$this->customerService->find($customer)]);
        $this->customerService->delete($customer);
        return response()->json([
            'message' => 'Customer deleted successfully',
        ], 200);
    }
}
