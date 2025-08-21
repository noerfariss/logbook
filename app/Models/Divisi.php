<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Divisi extends Model
{

    protected $connection = 'alternative';

    protected $table = 'divisi';
    protected $guarded = [];
    public $timestamps = false;
}
