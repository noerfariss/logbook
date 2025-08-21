<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Province;
use App\Models\Subdistrict;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class AjaxController extends Controller
{
    public function state(Request $request)
    {
        $term = $request->term;

        $data = Province::query()
            ->when($term, function ($e, $term) {
                $e->where('name', 'like', '%' . $term . '%');
            })
            ->select('id', 'name as label');

        if ($data->count() > 0) {
            return response()->json([
                'data'  => $data->get(),
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'data'  => null,
            ]);
        }
    }

    public function city(Request $request)
    {
        $term = $request->term;
        $state = $request->state;

        $data = City::query()
            ->when($term, function ($e, $term) {
                $e->where('name', 'like', '%' . $term . '%');
            })
            ->when($state, function ($e, $state) {
                $e->where('state_id', $state);
            })
            ->select('id', 'name as label');

        if ($data->count() > 0) {
            return response()->json([
                'data'  => $data->get(),
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'data'  => null,
            ]);
        }
    }

    public function district(Request $request)
    {
        $term = $request->term;

        $data = Cache::remember('district', 3600, function () {
            return Subdistrict::query()
                ->where('city_id', 7606)
                // ->where('city_id', 3515)
                ->select('id', 'city_id as parent', 'name as label')
                ->get();
        });

        if ($data->count() > 0) {
            return response()->json([
                'data'  => $data,
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'data'  => null,
            ]);
        }
    }

    public function village(Request $request)
    {
        $term = $request->term;

        $data = Cache::remember('village', 3600, function () {
            return Village::query()
                ->whereIn('subdistrict_id', [760601, 760602, 760603, 760604, 760605])
                // ->whereIn('subdistrict_id', [351501, 351502, 351503, 351504, 351505, 351506, 351507, 351508, 351509, 351510, 351511, 351512, 351513, 351514, 351515, 351516, 351517, 351518])
                ->select('id', 'subdistrict_id as parent', 'name as label')
                ->get();
        });

        if ($data->count() > 0) {
            return response()->json([
                'data'  => $data,
                'status' => true
            ]);
        } else {
            return response()->json([
                'status' => false,
                'data'  => null,
            ]);
        }
    }

    public function ganti_foto(Request $request)
    {
        if ($request->has('file')) {
            $file = $request->file;
            $path = $request->path;

            switch ($path) {

                case 'foto':
                    $size_gambar = 500;
                    break;

                case 'banner':
                    $size_gambar = 1024;
                    break;

                default:
                    $size_gambar = 400;
                    break;
            }

            $request->validate([
                'file' => 'required|image|max:7000'
            ]);

            $name = time() . rand(11111, 99999);
            $ext  = $file->getClientOriginalExtension();
            $foto = $name . '.' . $ext;

            $fullPath = $path . '/'  . $foto;

            $path = $file->getRealPath();
            $manager = new ImageManager(new Driver());
            $thum = $manager->read($path)->scale(width: $size_gambar);

            $path = Storage::put($fullPath, $thum->encode());

            return response()->json([
                'file' => $fullPath,
            ]);
        }
    }
}
