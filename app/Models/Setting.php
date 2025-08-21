<?php

namespace App\Models;

use App\Trait\HasUuid;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Jenssegers\Agent\Agent;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Setting extends Model
{
    use HasUuid, LogsActivity;

    protected $guarded = [];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'slogan', 'favicon', 'logo', 'additional', 'province_id', 'city_id'])
            ->useLogName('setting')
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

    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('DD MMM YYYY HH:mm'),
        );
    }

    protected function updatedAt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)->timezone(env('APP_TIMEZONE'))->isoFormat('DD MMM YYYY HH:mm'),
        );
    }
}
