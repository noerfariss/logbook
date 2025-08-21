<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subdivisi extends Model
{

    protected $connection = 'alternative';

    protected $table = 'subdivisi';
    protected $guarded = [];
    public $timestamps = false;
}
