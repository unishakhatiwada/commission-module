<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionRule extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $casts = [
        'all_origins' => 'boolean',
        'all_destinations' => 'boolean',
        'rate' => 'decimal:2',
    ];
    public function origins()
    {
        return $this->belongsToMany(Airport::class, 'commission_rule_airport')
            ->wherePivot('type', 'origin');
    }

    public function destinations()
    {
        return $this->belongsToMany(Airport::class, 'commission_rule_airport')
            ->wherePivot('type', 'destination');
    }
}
