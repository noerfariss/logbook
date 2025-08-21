<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderDetail extends Model
{
    protected $connection = 'alternative';

    protected $table = 'detail_po';
    protected $guarded = [];
    public $timestamps = false;
}
