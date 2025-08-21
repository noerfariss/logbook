<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanDetail extends Model
{
    protected $connection = 'alternative';

    protected $table = 'detail_pengajuan';
    protected $guarded = [];
    public $timestamps = false;
}
