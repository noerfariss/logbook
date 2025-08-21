<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class PengajuanLog extends Model
{
    protected $connection = 'alternative';
    protected $table = 'logbook_pengajuan_logs';
    protected $guarded = [];

    public function pengajuan()
    {
        return $this->belongsTo(Pengajuan::class, 'pengajuan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('dddd, DD MMM YYYY HH:mm')
        );
    }
}
