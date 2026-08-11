<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Training\TrainingCollection;
use App\Models\Training;
use Illuminate\Http\Request;

class TrainingController extends Controller
{
    public function index(Request $request): TrainingCollection
    {
        $query = Training::where('is_active', true);
        if ($request->has('type') && !empty($request->get('type'))) {
            $query->where('type', $request->get('type'));
        }
        return new TrainingCollection($query->with('image')->paginate($request->get('per_page', 15)));
    }

    public function all(Request $request): TrainingCollection
    {
        $query = Training::where('is_active', true);
        if ($request->has('type') && !empty($request->get('type'))) {
            $query->where('type', $request->get('type'));
        }
        return new TrainingCollection($query->with('image')->get());
    }

    public function getModules($slug)
    {
        $training = Training::where('slug', $slug)->firstOrFail();
        $modules = $training->modules()->where('is_published', true)->with('questions')->orderBy('module_index')->get();
        
        return response()->json([
            'training' => $training,
            'modules' => $modules
        ]);
    }
}
