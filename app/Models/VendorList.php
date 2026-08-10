<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Jenssegers\Agent\Agent;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class VendorList extends Model
{
    use LogsActivity;

    protected $connection = 'alternative';
    protected $table = 'logbook_vendor_lists';
    protected $guarded = [];

    protected $casts = [
        'tanggal_vendor' => 'date',
        'tgl_tf' => 'date',
        'kelengkapan_dokumen' => 'boolean',
        'done' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'pengajuan_id', 'po_msb', 'toko_id', 'toko_manual', 'jenis_kerja',
                'suggest_vendor_id', 'vendor_id', 'tanggal_vendor', 'dp', 'biaya_lain',
                'biaya_fee', 'kelengkapan_dokumen', 'tgl_tf', 'done',
            ])
            ->useLogName('user')
            ->logOnlyDirty();
    }

    public function tapActivity(Activity $activity, string $eventName)
    {
        $agent = new Agent();
        $activity->properties = $activity->properties->merge([
            'ip' => request()->ip(),
            'browser' => $agent->browser(),
            'browser_version' => $agent->version($agent->browser()),
            'platform' => $agent->platform(),
        ]);
    }

    public function suggestVendor()
    {
        return $this->belongsTo(Supplier::class, 'suggest_vendor_id', 'idsupplier');
    }

    public function vendor()
    {
        return $this->belongsTo(Supplier::class, 'vendor_id', 'idsupplier');
    }

    public function toko()
    {
        return $this->belongsTo(Toko::class, 'toko_id', 'idtoko');
    }
}
