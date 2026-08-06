<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\PermissionRegistrar;

class Role extends SpatieRole
{
    // Explicit connection so relations from User (connection 'alternative') don't inherit it via newRelatedInstance().
    protected $connection = 'mysql';

    /**
     * User's own connection ('alternative', unprefixed) wins when it's the related model in this
     * relation, so the pivot table name must be given fully-qualified ('logbook_' prefix) here —
     * otherwise Spatie's role-deletion cleanup (`$role->users()->detach()`) looks for an unprefixed
     * `model_has_roles` table that doesn't exist on that connection.
     */
    public function users(): BelongsToMany
    {
        return $this->morphedByMany(
            User::class,
            'model',
            'logbook_'.config('permission.table_names.model_has_roles'),
            app(PermissionRegistrar::class)->pivotRole,
            config('permission.column_names.model_morph_key')
        );
    }
}
