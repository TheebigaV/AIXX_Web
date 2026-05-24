<?php

namespace App\Providers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Inquiry;
use App\Models\Product;
use App\Models\Project;
use App\Models\RoleAndPermission\Role;
use App\Models\User;
use App\Policies\BannerPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\InquiryPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\RolePolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(Banner::class, BannerPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Customer::class, CustomerPolicy::class);
        Gate::policy(Inquiry::class, InquiryPolicy::class);
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
    }
}
