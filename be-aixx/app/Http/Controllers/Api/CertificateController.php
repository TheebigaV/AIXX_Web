<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateRegistration;
use App\Notifications\CertificateTestLinkNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CertificateController extends Controller
{
    // 20 MCQ Master Questions Key (Correct answers kept on backend for security)
    protected array $questions = [
        [
            'id' => 1,
            'question' => 'What does the term "LLM" stand for in modern AI?',
            'options' => [
                'A' => 'Logical Learning Machine',
                'B' => 'Large Language Model',
                'C' => 'Linear Latent Model',
                'D' => 'Language Low Memory'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 2,
            'question' => 'Which prompt engineering technique involves guiding an AI through step-by-step reasoning?',
            'options' => [
                'A' => 'Zero-shot prompting',
                'B' => 'Directional stimulus prompting',
                'C' => 'Chain of Thought prompting',
                'D' => 'Meta-prompting'
            ],
            'answer' => 'C'
        ],
        [
            'id' => 3,
            'question' => 'In machine learning, what is "overfitting"?',
            'options' => [
                'A' => 'A model performs well on training data but poorly on unseen test data',
                'B' => 'A model fails to identify patterns in the training data',
                'C' => 'A model becomes too fast during inference',
                'D' => 'A dataset having too many redundant columns'
            ],
            'answer' => 'A'
        ],
        [
            'id' => 4,
            'question' => 'What is the main purpose of "reinforcement learning from human feedback" (RLHF)?',
            'options' => [
                'A' => 'To compress the model size for edge deployment',
                'B' => 'To automate label generation in unsupervised learning',
                'C' => 'To align AI model outputs with human preferences and safety guidelines',
                'D' => 'To bypass neural network training'
            ],
            'answer' => 'C'
        ],
        [
            'id' => 5,
            'question' => 'Which transformer-based mechanism allows models to focus on different words dynamically when processing input?',
            'options' => [
                'A' => 'Recurrent pooling',
                'B' => 'Attention mechanism',
                'C' => 'Convolution filter',
                'D' => 'Backpropagation'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 6,
            'question' => 'What is "temperature" in the context of Large Language Model text generation?',
            'options' => [
                'A' => 'A metric representing CPU heat during inference',
                'B' => 'A hyperparameter controlling the degree of randomness/creativity of outputs',
                'C' => 'The size of the vector database search query',
                'D' => 'The total speed of token generation per second'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 7,
            'question' => 'What does "RAG" stand for in generative AI system design?',
            'options' => [
                'A' => 'Recursive Analysis Grid',
                'B' => 'Reasoning and Action Graph',
                'C' => 'Retrieval-Augmented Generation',
                'D' => 'Random Adversarial Generator'
            ],
            'answer' => 'C'
        ],
        [
            'id' => 8,
            'question' => 'In RAG systems, what is the primary role of a vector database?',
            'options' => [
                'A' => 'To run raw SQL queries on structured client logs',
                'B' => 'To store and perform semantic similarity searches on text embeddings',
                'C' => 'To train new base transformer models from scratch',
                'D' => 'To compile TypeScript frontend builds'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 9,
            'question' => 'What is "hallucination" in Generative AI?',
            'options' => [
                'A' => 'When a model generates incorrect, fabricated, or nonsensical information confidently',
                'B' => 'When the user inputs prompts that cause server crashes',
                'C' => 'A method used to augment training images with noise',
                'D' => 'The compression of parameters into quantized matrices'
            ],
            'answer' => 'A'
        ],
        [
            'id' => 10,
            'question' => 'Which type of AI model is specifically designed to create new contents such as text, images, or audio?',
            'options' => [
                'A' => 'Discriminative AI',
                'B' => 'Generative AI',
                'C' => 'Predictive regression model',
                'D' => 'Decision tree algorithm'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 11,
            'question' => 'What is an AI agent or "agentic system"?',
            'options' => [
                'A' => 'A server that only routes API requests without logical parsing',
                'B' => 'An autonomous system capable of planning, utilizing tools, and making decisions to achieve goals',
                'C' => 'A database trigger that logs user logins',
                'D' => 'A machine learning framework restricted to static tabular predictions'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 12,
            'question' => 'What does "zero-shot learning" mean in LLM task execution?',
            'options' => [
                'A' => 'The model performs a task without receiving any prior example of it in the prompt',
                'B' => 'The model runs with zero parameter weight configuration',
                'C' => 'Training a model with zero datasets available',
                'D' => 'Running inference in offline desktop environments'
            ],
            'answer' => 'A'
        ],
        [
            'id' => 13,
            'question' => 'What is "prompt injection"?',
            'options' => [
                'A' => 'A technique to feed more API keys to custom integrations',
                'B' => 'A security vulnerability where untrusted inputs manipulate an LLM\'s system instructions',
                'C' => 'The physical installation of memory expansion modules into AI GPUs',
                'D' => 'Increasing the temperature parameter during prompt design'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 14,
            'question' => 'Which of the following is a key characteristic of "deep learning"?',
            'options' => [
                'A' => 'Relying exclusively on small linear spreadsheets',
                'B' => 'Utilizing artificial neural networks with multiple hidden layers',
                'C' => 'Avoiding the use of gradient descent optimization',
                'D' => 'Executing programs only in low-level assembly code'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 15,
            'question' => 'What does the term "fine-tuning" refer to?',
            'options' => [
                'A' => 'Writing system prompts with more adjectives and style directives',
                'B' => 'Training a pre-trained model on a smaller, specialized dataset to adapt it to specific tasks',
                'C' => 'Aligning vector search databases manually',
                'D' => 'Adjusting the display brightness of neural monitors'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 16,
            'question' => 'What is the purpose of "system instructions" (system prompts) in AI assistants?',
            'options' => [
                'A' => 'To define core personas, behaviors, constraints, and instructions for responses',
                'B' => 'To measure model response speed and output size',
                'C' => 'To compile frontend source configurations',
                'D' => 'To load custom database migration routes'
            ],
            'answer' => 'A'
        ],
        [
            'id' => 17,
            'question' => 'What is "context window" size in LLMs?',
            'options' => [
                'A' => 'The maximum resolution of AI generated interface images',
                'B' => 'The maximum number of tokens a model can process collectively in a single query and response',
                'C' => 'The count of total threads allocated on host systems',
                'D' => 'The response timer for custom API connections'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 18,
            'question' => 'Which concept describes the challenge of ensuring AI systems act in accordance with human values and intent?',
            'options' => [
                'A' => 'AI alignment problem',
                'B' => 'Gradient descent optimization',
                'C' => 'Model quantization challenge',
                'D' => 'RAG latency bottleneck'
            ],
            'answer' => 'A'
        ],
        [
            'id' => 19,
            'question' => 'What is a "token" in natural language processing (NLP)?',
            'options' => [
                'A' => 'A crypto payment coin used to buy GPU rigs',
                'B' => 'A basic unit of text (like a word or sub-word segment) processed by language models',
                'C' => 'A session cookie stored in browser storage',
                'D' => 'The primary key of relational database rows'
            ],
            'answer' => 'B'
        ],
        [
            'id' => 20,
            'question' => 'Which benchmark is widely used to evaluate an AI model\'s massive multitask language understanding capabilities?',
            'options' => [
                'A' => 'SQLQuery Bench',
                'B' => 'MMLU',
                'C' => 'API-Speed Benchmark',
                'D' => 'CSS Flexbox Validator'
            ],
            'answer' => 'B'
        ]
    ];

    /**
     * Register a candidate for the Free AI Certificate
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'gender' => 'required|string|in:Male,Female,Other',
            'company_name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:255',
            'country' => 'required|string|max:255',
        ]);

        $uuid = (string) Str::uuid();

        $registration = CertificateRegistration::create([
            'uuid' => $uuid,
            'full_name' => $validated['full_name'],
            'gender' => $validated['gender'],
            'company_name' => $validated['company_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'country' => $validated['country'],
            'password' => '', // Password disabled per request
        ]);

        $registrationId = 'AIXX-REG-' . $registration->id;
        $registration->update([
            'registration_id' => $registrationId
        ]);

        return response()->json([
            'message' => 'Registration successful!',
            'uuid' => $uuid,
            'registration_id' => $registrationId,
        ], 201);
    }

    /**
     * Login candidate with Registration ID
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|string',
        ]);

        $candidate = CertificateRegistration::where('registration_id', $validated['registration_id'])->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid Registration ID.'], 401);
        }

        return response()->json([
            'message' => 'Login successful!',
            'token' => $candidate->uuid,
            'full_name' => $candidate->full_name,
            'registration_id' => $candidate->registration_id,
        ], 200);
    }

    /**
     * Verify candidate access token
     */
    public function verifyToken(Request $request)
    {
        $uuid = $request->query('token');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = CertificateRegistration::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid or expired test token.'], 404);
        }

        if ($candidate->passed) {
            return response()->json([
                'message' => 'Test already completed successfully.',
                'already_passed' => true,
                'full_name' => $candidate->full_name,
                'registration_id' => $candidate->registration_id,
                'score' => $candidate->test_score,
                'passed_at' => $candidate->passed_at ? $candidate->passed_at->format('d M Y') : ''
            ], 200);
        }

        return response()->json([
            'message' => 'Token verified successfully.',
            'already_passed' => false,
            'full_name' => $candidate->full_name,
            'registration_id' => $candidate->registration_id,
        ], 200);
    }

    /**
     * Get 20 MCQ test questions (Strip correct answers for security)
     */
    public function getQuestions(Request $request)
    {
        $uuid = $request->query('token');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = CertificateRegistration::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Unauthorized token.'], 403);
        }

        // Return questions with answers stripped out
        $publicQuestions = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'question' => $item['question'],
                'options' => $item['options']
            ];
        }, $this->questions);

        return response()->json([
            'questions' => $publicQuestions
        ], 200);
    }

    /**
     * Grade submitted responses and update status
     */
    public function submitTest(Request $request)
    {
        $uuid = $request->input('token');
        $answers = $request->input('answers'); // Associative array: [question_id => selected_option]

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = CertificateRegistration::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid or unauthorized candidate token.'], 403);
        }

        if ($candidate->passed) {
            return response()->json([
                'message' => 'This certificate has already been earned and completed.',
                'passed' => true,
                'score' => $candidate->test_score
            ], 200);
        }

        // Calculate score
        $correctCount = 0;
        $totalQuestions = count($this->questions);
        $details = [];

        foreach ($this->questions as $q) {
            $qId = $q['id'];
            $correctAnswer = $q['answer'];
            $submittedAnswer = $answers[$qId] ?? null;

            $isCorrect = ($submittedAnswer === $correctAnswer);
            if ($isCorrect) {
                $correctCount++;
            }

            $details[] = [
                'question_id' => $qId,
                'submitted' => $submittedAnswer,
                'correct' => $correctAnswer,
                'is_correct' => $isCorrect
            ];
        }

        $percentageScore = round(($correctCount / $totalQuestions) * 100);
        $hasPassed = ($percentageScore >= 80);

        // Update database record
        $candidate->test_score = $percentageScore;
        if ($hasPassed) {
            $candidate->passed = true;
            $candidate->passed_at = Carbon::now();
        }
        $candidate->save();

        return response()->json([
            'passed' => $hasPassed,
            'score' => $percentageScore,
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'full_name' => $candidate->full_name,
            'passed_at' => $candidate->passed_at ? $candidate->passed_at->format('d M Y') : Carbon::now()->format('d M Y')
        ], 200);
    }
}
