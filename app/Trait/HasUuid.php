<?php

namespace App\Trait;

use Ramsey\Uuid\Uuid;

trait HasUuid
{
    // Laravel akan otomatis memanggil ini: bootHasUuid
    protected static function bootHasUuid()
    {
        static::creating(function ($model) {
            if (!$model->uuid) {
                $model->uuid = Uuid::uuid7()->toString();
            }
        });
    }

    // Override key yang digunakan Eloquent dan route binding
    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
