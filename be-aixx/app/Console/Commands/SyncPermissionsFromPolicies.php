<?php

namespace App\Console\Commands;

use App\Models\RoleAndPermission\Permission;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class SyncPermissionsFromPolicies extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-permissions-from-policies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $existingPermissionNames = Permission::pluck('name')->all();
        $permissions = [];

        $policies = $this->getPolicies();

        //print_r($policies);

        foreach ($policies as $model => $policy) {
            $reflection = new \ReflectionClass($policy);
            $methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);
            foreach ($methods as $method) {
                $model = Str::pluralStudly(class_basename($model));
                $methodName = $method->name;

                if ($this->isPolicyModelIgnored($model)) {
                    continue;
                }

                if ($this->isPolicyMethodIgnored($methodName)) {
                    continue;
                }

                $permissionName = $this->formatPermissionName($model, $methodName);
                $permissions[] = $permissionName;

                Permission::firstOrCreate([
                        'name' => $permissionName,
                        'guard_name' => 'web',
                    ]
                );
            }
        }

        $this->deleteUnusedPermissions($permissions, $existingPermissionNames);

        $this->info('Permissions created successfully!');
    }

    /**
     * @return array
     */
    protected function getPolicies(): array
    {
        return app('Illuminate\Contracts\Auth\Access\Gate')
            ->policies();
    }

    /**
     * @param $model
     * @return bool
     */
    protected function isPolicyModelIgnored($model): bool
    {
        $ignoredModels = [];
        return in_array($model, $ignoredModels);
    }

    /**
     * @param $methodName
     * @return bool
     */
    protected function isPolicyMethodIgnored($methodName): bool
    {
        $ignoredMethods = [
            'before'
        ];
        return in_array($methodName, $ignoredMethods);
    }

    /**
     * @param $model
     * @param $method
     * @return string
     */
    protected function formatPermissionName($model, $method): string
    {
        $model = Str::slug($model, '-');
        $method = Str::slug($method, '-');

        return "{$model}-{$method}";
    }

    /**
     * @param $permissions
     * @param $existingPermissionNames
     * @return void
     */
    protected function deleteUnusedPermissions($permissions, $existingPermissionNames)
    {
        $deletedPermissions = array_diff($existingPermissionNames, $permissions);

        if (!empty($deletedPermissions)) {
            Permission::whereIn('name', $deletedPermissions)->delete();
        }
    }
}
