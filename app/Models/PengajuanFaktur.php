<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanFaktur extends Model
{
    protected $connection = 'alternative';
    protected $table = 'logbook_pengajuan_fakturs';
    protected $guarded = [];
}
