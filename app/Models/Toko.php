<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Toko extends Model
{
    protected $connection = 'alternative';

    protected $table = 'prd_toko';
    protected $primaryKey = 'idtoko';
    protected $guarded = [];
    public $timestamps = false;
}
