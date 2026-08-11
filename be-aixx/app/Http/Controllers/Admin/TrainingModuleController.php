<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainingModule;
use Illuminate\Http\Request;

class TrainingModuleController extends Controller
{
    public function index(Request $request)
    {
        $trainingId = $request->query('training_id');
        $modules = TrainingModule::with('questions')->where('training_id', $trainingId)->orderBy('module_index')->get();
        return response()->json($modules);
    }

    public function store(Request $request)
    {
        $request->validate([
            'training_id' => 'required|exists:trainings,id',
            'module_index' => 'required|integer',
            'title' => 'required|string',
            'study_notes' => 'nullable|string',
            'questions' => 'nullable|array',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array',
            'questions.*.correct_answer' => 'required|string',
            'questions.*.explanation' => 'nullable|string',
            'is_published' => 'boolean',
        ]);

        $module = TrainingModule::create($request->only('training_id', 'module_index', 'title', 'study_notes', 'is_published'));

        if ($request->has('questions')) {
            foreach ($request->questions as $q) {
                $module->questions()->create($q);
            }
        }

        return response()->json($module->load('questions'), 201);
    }

    public function show(string $id)
    {
        $module = TrainingModule::with('questions')->findOrFail($id);
        return response()->json($module);
    }

    public function update(Request $request, string $id)
    {
        $module = TrainingModule::findOrFail($id);

        $request->validate([
            'module_index' => 'required|integer',
            'title' => 'required|string',
            'study_notes' => 'nullable|string',
            'questions' => 'nullable|array',
            'is_published' => 'boolean',
        ]);

        $module->update($request->only('module_index', 'title', 'study_notes', 'is_published'));

        if ($request->has('questions')) {
            // Very simple approach: delete old questions and create new ones
            $module->questions()->delete();
            foreach ($request->questions as $q) {
                $module->questions()->create($q);
            }
        }

        return response()->json($module->load('questions'));
    }

    public function destroy(string $id)
    {
        $module = TrainingModule::findOrFail($id);
        $module->delete();
        return response()->json(null, 204);
    }
}
