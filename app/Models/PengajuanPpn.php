<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanPpn extends Model
{
    protected $connection = 'alternative';
    protected $table = 'logbook_pengajuan_ppns';
    protected $guarded = [];
}
