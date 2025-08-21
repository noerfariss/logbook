<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $connection = 'alternative';

    protected $table = 'purchaseorder';
    protected $guarded = [];
    public $timestamps = false;

    protected function tanggal(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->timezone('Asia/Jakarta')->isoFormat('dddd, DD MMM YYYY')
        );
    }
}
