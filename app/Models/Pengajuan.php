<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Pengajuan extends Model
{
    protected $connection = 'alternative';

    protected $table = 'pengajuan';
    protected $guarded = [];
    public $timestamps = false;

    public function logs()
    {
        return $this->hasMany(PengajuanLog::class, 'pengajuan_id', 'idpengajuan');
    }

    protected $appends = ['status_pengajuan'];

    public function getStatusPengajuanAttribute()
    {
        if ($this->logs->count() === 0) {
            return 'new';
        }

        if ($this->logs->contains('status', 1)) {
            return 'done';
        }

        return 'process';
    }

    protected function timeInput(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('dddd, DD MMM YYYY HH:mm')
        );
    }

    protected function tanggal(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('dddd, DD MMM YYYY')
        );
    }
}
