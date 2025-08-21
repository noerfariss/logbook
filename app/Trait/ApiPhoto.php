<?php

namespace App\Trait;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Facades\Image;
use Intervention\Image\ImageManager;

trait ApiPhoto
{
    protected function savePhoto($file, string $path)
    {
        if ($file) {
            switch ($path) {
                case 'checkin':
                    $size_gambar = 680;
                    break;

                case 'checkout':
                    $size_gambar = 680;
                    break;

                case 'attendance':
                    $size_gambar = 720;
                    break;

                default:
                    $size_gambar = 420;
                    break;
            }

            $name = time() . rand(11111, 99999);
            $ext  = $file->getClientOriginalExtension();
            $foto = $name . '.' . $ext;
            $fullPath = $path . '/'  . $foto;

            $path = $file->getRealPath();
            $manager = new ImageManager(new Driver());
            $thum = $manager->read($path)->scale(width: $size_gambar);

            $path = Storage::put($fullPath, $thum->encode());

            return $fullPath;
        }
    }

    protected function showPhoto($photo = ''): string
    {
        return $photo ? env('APP_URL') . '/storage' . '/' . $photo : '';
    }
}
