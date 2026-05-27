<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TrainingController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/banners/latest', [BannerController::class, 'latestPublic']);

Route::get('admin/dashboard/metrics', [DashboardController::class, 'metrics']);


Route::middleware('guest')->group(function () {
    Route::post('/forgot-password', [AuthController::class, 'forgot']);
    Route::post('/reset-password', [AuthController::class, 'reset']);
});
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    // Get Role Permissions
    Route::get('roles/{role}/permissions', [RoleController::class, 'permissions']);
    // Give Role Permission
    Route::post('roles/{role}/permissions/{permission}/give', [RoleController::class, 'givePermission']);
    // Revoke Role Permission
    Route::post('roles/{role}/permissions/{permission}/revoke', [RoleController::class, 'revokePermission']);


    Route::prefix('admin')->group(function () {

        // Roles & Permissions
        Route::get('roles/all', [RoleController::class, 'all']);
        Route::apiResource('roles', RoleController::class);
        Route::get('permissions', [RoleController::class, 'getAllPermissions']);
        // Users
        Route::apiResource('users', UserController::class);
        Route::get('users/all', [UserController::class, 'all']);
        // Banners
        Route::get('banners/all', [BannerController::class, 'all']);
        Route::apiResource('banners', BannerController::class);
        // Categories (Services)
        Route::get('categories/all', [CategoryController::class, 'all']);
        Route::apiResource('categories', CategoryController::class);

        // Trainings
        Route::get('trainings/all', [TrainingController::class, 'all']);
        Route::apiResource('trainings', TrainingController::class);

        // Customers
        Route::apiResource('customers', CustomerController::class);

        // Settings
        Route::get('settings', [SettingController::class, 'index']);
        Route::post('settings', [SettingController::class, 'update']);
    });
});



// Public Routes (Accessible by both guests and authenticated users)
Route::get('banners/all', [\App\Http\Controllers\Guest\BannerController::class, 'all']);
Route::get('banners', [\App\Http\Controllers\Guest\BannerController::class,'index']);
Route::get('categories/{slug}/by-slug', [\App\Http\Controllers\Guest\CategoryController::class, 'show']);
Route::get('categories/all', [\App\Http\Controllers\Guest\CategoryController::class, 'all']);
Route::get('categories', [\App\Http\Controllers\Guest\CategoryController::class,'index']);
Route::get('trainings/all', [\App\Http\Controllers\Guest\TrainingController::class, 'all']);
Route::get('trainings', [\App\Http\Controllers\Guest\TrainingController::class, 'index']);
Route::post('inquiries', [\App\Http\Controllers\Guest\InquiryController::class, 'store']);
Route::post('submit-contact-form', [\App\Http\Controllers\Guest\InquiryController::class, 'submitContact']);
Route::get('settings', [SettingController::class, 'index']);

