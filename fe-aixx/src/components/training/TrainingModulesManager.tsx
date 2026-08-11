'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaSpinner, FaChevronDown, FaChevronUp, FaBookOpen, FaQuestionCircle } from 'react-icons/fa';
import { api } from '@/lib/api';

interface Question {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct_answer: string;
  explanation: string;
}

interface Module {
  id?: number;
  module_index: number;
  title: string;
  study_notes: string;
  is_published: boolean;
  questions: Question[];
}

export const TrainingModulesManager = ({ trainingId }: { trainingId: string }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(0);

  useEffect(() => {
    fetchModules();
  }, [trainingId]);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/training-modules?training_id=${trainingId}`);
      if (response.data && response.data.length > 0) {
        setModules(response.data);
      } else {
        // Default empty module
        addModule();
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        module_index: modules.length + 1,
        title: '',
        study_notes: '',
        is_published: false,
        questions: []
      }
    ]);
    setExpandedModuleIndex(modules.length);
  };

  const removeModule = async (index: number) => {
    if (!confirm('Are you sure you want to remove this module?')) return;
    
    const module = modules[index];
    if (module.id) {
      try {
        await api.delete(`/api/admin/training-modules/${module.id}`);
      } catch (err) {
        alert('Failed to delete module');
        return;
      }
    }
    
    const newModules = [...modules];
    newModules.splice(index, 1);
    
    // Re-index
    newModules.forEach((m, i) => {
      m.module_index = i + 1;
    });
    
    setModules(newModules);
  };

  const addQuestion = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].questions.push({
      question: '',
      options: { A: '', B: '', C: '', D: '' },
      correct_answer: 'A',
      explanation: ''
    });
    setModules(newModules);
  };

  const removeQuestion = (moduleIndex: number, questionIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].questions.splice(questionIndex, 1);
    setModules(newModules);
  };

  const handleModuleChange = (moduleIndex: number, field: keyof Module, value: any) => {
    const newModules = [...modules];
    newModules[moduleIndex] = { ...newModules[moduleIndex], [field]: value };
    setModules(newModules);
  };

  const handleQuestionChange = (moduleIndex: number, questionIndex: number, field: string, value: any) => {
    const newModules = [...modules];
    if (field.startsWith('option_')) {
      const optKey = field.split('_')[1];
      newModules[moduleIndex].questions[questionIndex].options = {
        ...newModules[moduleIndex].questions[questionIndex].options,
        [optKey]: value
      };
    } else {
      (newModules[moduleIndex].questions[questionIndex] as any)[field] = value;
    }
    setModules(newModules);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save modules sequentially
      for (const module of modules) {
        if (module.id) {
          await api.put(`/api/admin/training-modules/${module.id}`, module);
        } else {
          await api.post('/api/admin/training-modules', { ...module, training_id: trainingId });
        }
      }
      alert('Modules and Questions saved successfully!');
      fetchModules(); // Refresh
    } catch (error) {
      console.error('Failed to save modules:', error);
      alert('Failed to save modules. Please check all fields.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center"><FaSpinner className="animate-spin text-2xl mx-auto text-brand-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Course Modules & Assessments</h2>
          <p className="text-sm text-slate-500">Manage modules, study notes, and 20-question assessments.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addModule}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <FaPlus size={12} /> Add Module
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            Save All Changes
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module, mIdx) => (
          <div key={mIdx} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div 
              className="bg-slate-50 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setExpandedModuleIndex(expandedModuleIndex === mIdx ? null : mIdx)}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                  {module.module_index}
                </div>
                <h3 className="font-bold text-slate-800">
                  {module.title || 'Untitled Module'}
                </h3>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                  {module.questions.length} Questions
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${module.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {module.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); removeModule(mIdx); }}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove Module"
                >
                  <FaTrash />
                </button>
                {expandedModuleIndex === mIdx ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expandedModuleIndex === mIdx && (
              <div className="p-6 space-y-6 border-t border-slate-200">
                
                {/* Module Basics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Module Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(mIdx, 'title', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none"
                      placeholder="e.g., AI IN DAILY LIFE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => handleModuleChange(mIdx, 'is_published', false)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${!module.is_published ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => handleModuleChange(mIdx, 'is_published', true)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${module.is_published ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                      >
                        Published
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Study Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                    <FaBookOpen className="text-brand-600" /> Study Notes (Optional)
                  </label>
                  <textarea
                    value={module.study_notes || ''}
                    onChange={(e) => handleModuleChange(mIdx, 'study_notes', e.target.value)}
                    rows={5}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none"
                    placeholder="Enter study notes or context for this module before the assessment starts..."
                  />
                </div>

                {/* Questions Array */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                      <FaQuestionCircle className="text-brand-500" /> MCQ Assessment Questions
                    </h4>
                    <button
                      onClick={() => addQuestion(mIdx)}
                      className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5"
                    >
                      <FaPlus size={10} /> Add Question
                    </button>
                  </div>

                  <div className="space-y-4">
                    {module.questions.map((q, qIdx) => (
                      <div key={qIdx} className="bg-white border border-slate-200 p-4 rounded-lg relative shadow-sm">
                        <button 
                          onClick={() => removeQuestion(mIdx, qIdx)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                        >
                          <FaTrash size={14} />
                        </button>
                        
                        <div className="flex gap-3 mb-4">
                          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {qIdx + 1}
                          </div>
                          <div className="flex-grow pr-8">
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => handleQuestionChange(mIdx, qIdx, 'question', e.target.value)}
                              className="w-full border-b border-slate-300 px-2 py-1 text-sm font-semibold focus:border-brand-500 outline-none bg-transparent"
                              placeholder="Enter question text here..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9 mb-4">
                          {['A', 'B', 'C', 'D'].map((opt) => (
                            <div key={opt} className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500">{opt})</span>
                              <input
                                type="text"
                                value={(q.options as any)[opt] || ''}
                                onChange={(e) => handleQuestionChange(mIdx, qIdx, `option_${opt}`, e.target.value)}
                                className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:border-brand-500 outline-none"
                                placeholder={`Option ${opt}`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="pl-9 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Correct Answer</label>
                            <select
                              value={q.correct_answer}
                              onChange={(e) => handleQuestionChange(mIdx, qIdx, 'correct_answer', e.target.value)}
                              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:border-brand-500 outline-none bg-white"
                            >
                              <option value="A">Option A</option>
                              <option value="B">Option B</option>
                              <option value="C">Option C</option>
                              <option value="D">Option D</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 mb-1">Explanation (Shown after answering)</label>
                            <input
                              type="text"
                              value={q.explanation || ''}
                              onChange={(e) => handleQuestionChange(mIdx, qIdx, 'explanation', e.target.value)}
                              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:border-brand-500 outline-none"
                              placeholder="Why is this the correct answer?"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {module.questions.length === 0 && (
                      <p className="text-sm text-slate-500 italic text-center py-4">No questions added yet. Click "Add Question" to begin.</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
        {modules.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
            No modules found. Click "Add Module" to start building your interactive course.
          </div>
        )}
      </div>
    </div>
  );
};
