<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateQuestion;
use Illuminate\Http\Request;

class CertificateQuestionController extends Controller
{
    public function index()
    {
        return response()->json(CertificateQuestion::with('training')->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'training_id' => 'required|exists:trainings,id',
            'question' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_answer_index' => 'required|integer|min:0',
            'explanation' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $question = CertificateQuestion::create($validated);
        return response()->json($question, 201);
    }

    public function show($id)
    {
        return response()->json(CertificateQuestion::with('training')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $question = CertificateQuestion::findOrFail($id);

        $validated = $request->validate([
            'training_id' => 'required|exists:trainings,id',
            'question' => 'required|string',
            'options' => 'required|array|min:2',
            'correct_answer_index' => 'required|integer|min:0',
            'explanation' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $question->update($validated);
        return response()->json($question);
    }

    public function destroy($id)
    {
        $question = CertificateQuestion::findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
