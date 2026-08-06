<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    // Explicit connection so relations from User (connection 'alternative') don't inherit it via newRelatedInstance().
    protected $connection = 'mysql';
}
