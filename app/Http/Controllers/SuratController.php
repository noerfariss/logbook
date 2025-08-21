<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SuratController extends Controller
{
    public function index()
    {
        return inertia()->render('Letter/Index');
    }

    public function born()
    {
        return inertia()->render('Letter/Create');
    }

    public function dead()
    {
        return inertia()->render('Letter/Create');
    }

    public function domicile()
    {
        return inertia()->render('Letter/Create');
    }

    public function transfer()
    {
        return inertia()->render('Letter/Recreate');
    }
}
