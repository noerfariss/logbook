<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class PengajuanDeadline extends Model
{
    protected $connection = 'alternative';
    protected $table = 'logbook_pengajuan_deadlines';
    protected $guarded = [];

    protected function deadline(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('dddd, DD MMM YYYY') : null,
        );
    }
}
