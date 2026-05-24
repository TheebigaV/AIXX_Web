<?php

namespace App\Repositories\Admin;

use App\Models\Customer;
use App\Repositories\BaseRepository;

class CustomerRepository extends BaseRepository
{
    /**
     * @param Customer $model
     */
    public function __construct(Customer $model)
    {
        $this->setModel($model);
    }
}
