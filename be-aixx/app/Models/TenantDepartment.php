<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantDepartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'employees_count',
        'completed_count',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function getCompletionRateAttribute(): int
    {
        if ($this->employees_count <= 0) {
            return 0;
        }

        return (int) round(($this->completed_count / $this->employees_count) * 100);
    }
}
