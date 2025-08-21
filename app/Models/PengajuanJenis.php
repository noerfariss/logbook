<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanJenis extends Model
{
    protected $connection = 'alternative';

    protected $table = 'jenis_pengajuan';
    protected $guarded = [];
    public $timestamps = false;
}
