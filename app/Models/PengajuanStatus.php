<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanStatus extends Model
{
    protected $connection = 'alternative';

    protected $table = 'status_pe';
    protected $guarded = [];
    public $timestamps = false;
}
