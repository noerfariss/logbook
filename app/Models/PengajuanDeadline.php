<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Jenssegers\Agent\Agent;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\Contracts\Activity;

class PengajuanDeadline extends Model
{
    use LogsActivity;

    protected $connection = 'alternative';
    protected $table = 'logbook_pengajuan_deadlines';
    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['pengajuan_id', 'deadline', 'created_at', 'updated_at'])
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

    protected function deadline(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ? Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('dddd, DD MMM YYYY') : null,
        );
    }
}
