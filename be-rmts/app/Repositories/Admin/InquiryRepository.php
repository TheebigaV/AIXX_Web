<?php

namespace App\Repositories\Admin;

use App\Models\Inquiry;
use App\Repositories\BaseRepository;

class InquiryRepository extends BaseRepository
{
    /**
     * @param Inquiry $model
     */
    public function __construct(Inquiry $model)
    {
        $this->setModel($model);
    }

}
