<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'all_origins' => (bool) $this->all_origins,
            'all_destinations' => (bool) $this->all_destinations,
            'origins' => $this->all_origins
                ? []
                : AirportResource::collection($this->whenLoaded('origins')),

            'destinations' => $this->all_destinations
                ? []
                : AirportResource::collection($this->whenLoaded('destinations')),
            'rate' => (float) $this->rate,
            'rate_type' => $this->rate_type,
        ];
    }
}
