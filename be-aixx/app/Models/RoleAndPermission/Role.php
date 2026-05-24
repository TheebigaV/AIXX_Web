<?php

namespace App\Models\RoleAndPermission;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'guard_name'
    ];

    public array $filterable = [
        'name' => 'like',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Role')
            ->logOnlyDirty();
    }
}
