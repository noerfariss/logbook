<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KtpController extends Controller
{
    public function index()
    {
        return inertia()->render('Ktp/Ktp');
    }

    public function new()
    {
        return inertia()->render('Ktp/Create');
    }

    public function recreate()
    {
        return inertia()->render('Ktp/Recreate');
    }

    public function reprint()
    {
        return inertia()->render('Ktp/Reprint');
    }
}
