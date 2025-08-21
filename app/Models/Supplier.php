<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $connection = 'alternative';

    protected $table = 'supplier';
    protected $guarded = [];
    public $timestamps = false;
}
