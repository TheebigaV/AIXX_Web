<?php

namespace App\Console\Commands;

use App\Models\RoleAndPermission\Role;
use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class CreateSuperAdminRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-super-admin-role';

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
        $role = Role::firstOrCreate([
                'name' => config('role.superAdmin'),
            ]
        );

        $role->revokePermissionTo(Permission::all());

        $permissions = Permission::all();

        $this->givePermissions($role, $permissions);

        $user = User::where('email', 'cs@aixx.com.sg')->first();
        if (!$user) {
            $user = User::firstOrCreate([
                    'name' => 'Super Admin',
                    'email' => 'cs@aixx.com.sg',
                    'email_verified_at'=> Carbon::now()->toDateTimeString(),
                    'password' => Hash::make('12345678'),
                ]
            );
        }

        $user->removeRole($role);
        $user->assignRole($role);
        $this->info('Super user role created successfully!');

    }

    private function givePermissions($role, $permissions)
    {
        foreach ($permissions as $permission)
        {
            $role->givePermissionTo($permission);
        }
    }
}
