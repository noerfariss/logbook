<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Klien extends Model
{
    protected $connection = 'alternative';

    protected $table = 'klien';
    protected $guarded = [];
    public $timestamps = false;
}
