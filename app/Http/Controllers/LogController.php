<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class LogController extends Controller
{
    public function index()
    {
        return inertia()->render('Profile/Log');
    }

    public function ajax(Request $request)
    {
        $data = Activity::query()
            ->orderBy('id', 'desc')
            ->paginate(10);

        $data->getCollection()->transform(function ($item) {
            $item->created_string = Carbon::parse($item->created_at)->timezone(env('APP_TIMEZONE'))->isoFormat('DD MMM YYYY HH:mm');
            // $item->browser = $item->properties['platform'] . ' ' . $item->properties['browser'] . ' - ' . $item->properties['browser_version'] . ' - ' . $item->properties['ip'];
            // $item->logs = $item->properties;
            return $item;
        });

        // dd($data->toArray());

        return response()->json($data);
    }
}
