<?php

namespace App\Class;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;

class ImageClass
{
    public static function resize($file, $folder = '', $width = 200)
    {
        $filename = 'thumb_' . time() . '.' . $file->getClientOriginalExtension();
        $resize = ImageManager::gd()->read($file)->scale($width)->encode();
        Storage::put($folder . '/' . $filename, $resize);
    }

    public static function generate($file, $folder = '', $resize = true, $width = 400)
    {
        $filename = time() . '.' . $file->getClientOriginalExtension();
        Storage::putFileAs($folder, $file, $filename);

        if ($resize) {
            $thumb = 'thumb_' . $filename;
            $resize = ImageManager::gd()->read($file)->scale($width)->encode();
            Storage::put($folder . '/' . $thumb, $resize);
        }

        return $filename;
    }

    public static function parseURL($url)
    {
        $parse = parse_url($url);
        $path = $parse['path'];
        $exp = explode('/', $path);
        $images = $exp[3];

        $imageExp = explode('_', $images);

        return $imageExp[1];
    }
}
