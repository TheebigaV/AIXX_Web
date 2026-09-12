<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'contact_name',
        'contact_email',
        'target_completion_date',
        'status',
    ];

    protected $casts = [
        'target_completion_date' => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $tenant): void {
            if (empty($tenant->slug)) {
                $tenant->slug = Str::slug($tenant->name);
            }
        });
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function departments()
    {
        return $this->hasMany(TenantDepartment::class);
    }
}
