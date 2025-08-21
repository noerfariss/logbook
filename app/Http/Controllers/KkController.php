<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KkController extends Controller
{
    public function index()
    {
        return inertia()->render('Kk/Kk');
    }

    public function new()
    {
        return inertia()->render('Kk/Create');
    }

    public function recreate()
    {
        return inertia()->render('Kk/Recreate');
    }
}
