<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommissionRequest;
use App\Http\Requests\UpdateCommissionRequest;
use App\Http\Resources\AirportResource;
use App\Http\Resources\CommissionResource;
use App\Models\Airport;
use App\Models\CommissionRule;
use Illuminate\Support\Facades\DB;

class CommissionController extends Controller
{
    protected $ruleModel;
    protected $airportModel;

    public function __construct(CommissionRule $ruleModel, Airport $airportModel)
    {
        $this->ruleModel = $ruleModel;
        $this->airportModel = $airportModel;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rules = $this->ruleModel->with(['origins', 'destinations'])->get();
        return CommissionResource::collection($rules);
    }

   public function getAirports()
   {
       return AirportResource::collection($this->airportModel->all());
   }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommissionRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $this->ruleModel->query()->delete();

            $airportMap = $this->airportModel->pluck('id', 'code')->toArray();

            foreach ($data['rules'] as $ruleData) {
                $rule = $this->ruleModel->create([
                    'rate' => $ruleData['rate'],
                    'rate_type' => $ruleData['rate_type'],
                    'all_origins' => $ruleData['all_origins'] ?? false,
                    'all_destinations' => $ruleData['all_destinations'] ?? false,
                ]);

                if (empty($ruleData['all_origins']) || $ruleData['all_origins'] === false) {
                    $originIds = [];
                    if (!empty($ruleData['origins'])) {
                        foreach ($ruleData['origins'] as $origin) {
                            $code = $origin['code'] ?? $origin;
                            if (isset($airportMap[$code])) {
                                $originIds[] = $airportMap[$code];
                            }
                        }
                    }
                    if (!empty($originIds)) {
                        $rule->origins()->attach($originIds, ['type' => 'origin']);
                    }
                }

                if (empty($ruleData['all_destinations']) || $ruleData['all_destinations'] === false) {
                    $destIds = [];
                    if (!empty($ruleData['destinations'])) {
                        foreach ($ruleData['destinations'] as $dest) {
                            $code = $dest['code'] ?? $dest;
                            if (isset($airportMap[$code])) {
                                $destIds[] = $airportMap[$code];
                            }
                        }
                    }
                    if (!empty($destIds)) {
                        $rule->destinations()->attach($destIds, ['type' => 'destination']);
                    }
                }
            }
        });

        return response()->json(['message' => 'Rules saved successfully']);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $rule = $this->ruleModel->findOrFail($id);
        return new CommissionResource($rule);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommissionRequest $request, string $id)
    {
        $rule = $this->ruleModel->findOrFail($id);
        $validated = $request->validated();

        DB::transaction(function () use ($rule, $validated, $request) {
            $rule->update($validated); // update() automatically ignores missing keys!
            if ($request->hasAny(['origins', 'destinations'])) {
                $airportMap = $this->airportModel->pluck('id', 'code')->toArray();
            }

            if ($request->has('all_origins') || $request->has('origins')) {
                $allOrigins = $validated['all_origins'] ?? $rule->all_origins;

                if ($allOrigins) {
                    $rule->origins()->detach();
                } else {
                    if ($request->has('origins')) {
                        $originIds = [];
                        if (!empty($validated['origins'])) {
                            foreach ($validated['origins'] as $origin) {
                                $code = $origin['code'] ?? $origin;
                                if (isset($airportMap[$code])) $originIds[] = $airportMap[$code];
                            }
                        }
                        $rule->origins()->sync($originIds);
                    }
                }
            }

            if ($request->has('all_destinations') || $request->has('destinations')) {
                $allDestinations = $validated['all_destinations'] ?? $rule->all_destinations;

                if ($allDestinations) {
                    $rule->destinations()->detach();
                } else {
                    if ($request->has('destinations')) {
                        $destIds = [];
                        if (!empty($validated['destinations'])) {
                            foreach ($validated['destinations'] as $dest) {
                                $code = $dest['code'] ?? $dest;
                                if (isset($airportMap[$code])) $destIds[] = $airportMap[$code];
                            }
                        }
                        $rule->destinations()->sync($destIds);
                    }
                }
            }
        });

        return response()->json([
            'message' => 'Rule updated successfully',
            'data' => new CommissionResource($rule->load(['origins', 'destinations']))
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rule = $this->ruleModel->findOrFail($id);
        $rule->delete();

        return response()->json([
            'message' => 'Rule deleted successfully'
        ], 200);
    }
}
