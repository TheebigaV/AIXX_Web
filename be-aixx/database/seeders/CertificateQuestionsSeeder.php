<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CertificateQuestion;

class CertificateQuestionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            // MODULE 1: Basics of AI (Questions 1 - 5)
            [
                'question' => 'What does the term "LLM" stand for in modern AI?',
                'options' => [
                    'Logical Learning Machine',
                    'Large Language Model',
                    'Linear Latent Model',
                    'Language Low Memory'
                ],
                'answer_letter' => 'B',
                'explanation' => 'LLM stands for Large Language Model, an AI model trained on massive amounts of text data to understand and generate human language.'
            ],
            [
                'question' => 'Which type of AI model is specifically designed to create new content such as text, images, or audio?',
                'options' => [
                    'Discriminative AI',
                    'Generative AI',
                    'Predictive regression model',
                    'Decision tree algorithm'
                ],
                'answer_letter' => 'B',
                'explanation' => 'Generative AI refers to algorithms capable of generating new content, including text, images, audio, and code based on user prompts.'
            ],
            [
                'question' => 'In machine learning, what is "overfitting"?',
                'options' => [
                    'A model performs well on training data but poorly on unseen test data',
                    'A model fails to identify patterns in the training data',
                    'A model becomes too fast during inference',
                    'A dataset having too many redundant columns'
                ],
                'answer_letter' => 'A',
                'explanation' => 'Overfitting occurs when a machine learning model learns the training data noise too closely, failing to generalize to new, unseen data.'
            ],
            [
                'question' => 'Which transformer-based mechanism allows models to focus on different words dynamically when processing input?',
                'options' => [
                    'Recurrent pooling',
                    'Attention mechanism',
                    'Convolution filter',
                    'Backpropagation'
                ],
                'answer_letter' => 'B',
                'explanation' => 'The Attention Mechanism enables neural networks to weigh the importance of different words in a sequence dynamically regardless of distance.'
            ],
            [
                'question' => 'What is a "token" in natural language processing (NLP)?',
                'options' => [
                    'A crypto payment coin used to buy GPU rigs',
                    'A basic unit of text (like a word or sub-word segment) processed by language models',
                    'A session cookie stored in browser storage',
                    'The primary key of relational database rows'
                ],
                'answer_letter' => 'B',
                'explanation' => 'Tokens are the foundational building blocks of text (words or sub-word fragments) that language models process.'
            ],

            // MODULE 2: AI in Daily Life (Questions 6 - 10)
            [
                'question' => 'What can AI chatbots help you with in daily work?',
                'options' => [
                    'Only coding',
                    'Only math',
                    'Only designing',
                    'All of the above (coding, writing, math, designing, and research)'
                ],
                'answer_letter' => 'D',
                'explanation' => 'Modern AI chatbots are versatile assistants capable of writing, coding, math calculations, brainstorming, and design guidance.'
            ],
            [
                'question' => 'What is the main purpose of "reinforcement learning from human feedback" (RLHF)?',
                'options' => [
                    'To compress the model size for edge deployment',
                    'To automate label generation in unsupervised learning',
                    'To align AI model outputs with human preferences, helpfulness, and safety guidelines',
                    'To bypass neural network training'
                ],
                'answer_letter' => 'C',
                'explanation' => 'RLHF uses human evaluation to fine-tune AI models so they respond safely, accurately, and align with human intentions.'
            ],
            [
                'question' => 'What is "hallucination" in Generative AI?',
                'options' => [
                    'When a model generates incorrect, fabricated, or nonsensical information confidently',
                    'When the user inputs prompts that cause server crashes',
                    'A method used to augment training images with noise',
                    'The compression of parameters into quantized matrices'
                ],
                'answer_letter' => 'A',
                'explanation' => 'Hallucination refers to instances where an AI model generates plausibly sounding but factually false information.'
            ],
            [
                'question' => 'What is "context window" size in LLMs?',
                'options' => [
                    'The maximum resolution of AI generated interface images',
                    'The maximum number of tokens a model can process collectively in a single query and response session',
                    'The count of total threads allocated on host systems',
                    'The response timer for custom API connections'
                ],
                'answer_letter' => 'B',
                'explanation' => 'The context window limits the total volume of text (input prompt + generated completion) an AI model can remember at one time.'
            ],
            [
                'question' => 'Which benchmark is widely used to evaluate an AI model\'s massive multitask language understanding capabilities?',
                'options' => [
                    'SQLQuery Bench',
                    'MMLU',
                    'API-Speed Benchmark',
                    'CSS Flexbox Validator'
                ],
                'answer_letter' => 'B',
                'explanation' => 'MMLU (Massive Multitask Language Understanding) is a standardized benchmark measuring AI knowledge across 57 varied academic disciplines.'
            ],

            // MODULE 3: Using AI Tools (Questions 11 - 15)
            [
                'question' => 'Which tool can help you create images from text prompts?',
                'options' => [
                    'Grammarly',
                    'DALL-E',
                    'Zoom',
                    'Google Drive'
                ],
                'answer_letter' => 'B',
                'explanation' => 'DALL-E is an advanced Generative AI model created by OpenAI that synthesizes high-quality images from text descriptions.'
            ],
            [
                'question' => 'What should you do before using any new AI tool?',
                'options' => [
                    'Share personal sensitive credentials',
                    'Read terms and privacy policy to understand data usage rules',
                    'Use without internet connection',
                    'Trust all outputs without verification'
                ],
                'answer_letter' => 'B',
                'explanation' => 'Always inspect privacy policies to ensure sensitive personal or organizational data is not stored or used for model training.'
            ],
            [
                'question' => 'Which of the following is a good practice when using AI tools?',
                'options' => [
                    'Copy everything without checking',
                    'Trust results blindly',
                    'Verify and review the output before using or sharing',
                    'Share private passwords in prompts'
                ],
                'answer_letter' => 'C',
                'explanation' => 'Human review and fact-checking are essential to verify AI outputs for accuracy, tone, and compliance before publication.'
            ],
            [
                'question' => 'Which prompt engineering technique involves guiding an AI through step-by-step reasoning?',
                'options' => [
                    'Zero-shot prompting',
                    'Directional stimulus prompting',
                    'Chain of Thought prompting',
                    'Meta-prompting'
                ],
                'answer_letter' => 'C',
                'explanation' => 'Chain of Thought (CoT) prompting instructs the AI model to show its intermediate reasoning steps, significantly reducing errors in complex tasks.'
            ],
            [
                'question' => 'What is "temperature" in the context of Large Language Model text generation?',
                'options' => [
                    'A metric representing CPU heat during inference',
                    'A hyperparameter controlling the degree of randomness and creativity of outputs',
                    'The size of the vector database search query',
                    'The total speed of token generation per second'
                ],
                'answer_letter' => 'B',
                'explanation' => 'Temperature is a parameter where lower values (e.g. 0.1) yield deterministic, focused responses, while higher values (e.g. 0.8) produce more creative text.'
            ],

            // MODULE 4: AI & The Future (Questions 16 - 20)
            [
                'question' => 'What does "RAG" stand for in generative AI system design?',
                'options' => [
                    'Recursive Analysis Grid',
                    'Reasoning and Action Graph',
                    'Retrieval-Augmented Generation',
                    'Random Adversarial Generator'
                ],
                'answer_letter' => 'C',
                'explanation' => 'Retrieval-Augmented Generation (RAG) grounds LLM outputs by fetching relevant facts from external databases before generating an answer.'
            ],
            [
                'question' => 'In RAG systems, what is the primary role of a vector database?',
                'options' => [
                    'To run raw SQL queries on structured client logs',
                    'To store and perform semantic similarity searches on text embeddings',
                    'To train new base transformer models from scratch',
                    'To compile TypeScript frontend builds'
                ],
                'answer_letter' => 'B',
                'explanation' => 'Vector databases store mathematical representations of text (embeddings) to enable rapid, semantic similarity searches.'
            ],
            [
                'question' => 'What is an AI agent or "agentic system"?',
                'options' => [
                    'A server that only routes API requests without logical parsing',
                    'An autonomous system capable of planning, utilizing tools, and making decisions to achieve goals',
                    'A database trigger that logs user logins',
                    'A machine learning framework restricted to static tabular predictions'
                ],
                'answer_letter' => 'B',
                'explanation' => 'An AI agent can formulate multi-step plans, invoke APIs/tools, and iteratively execute tasks to accomplish complex goals autonomously.'
            ],
            [
                'question' => 'What is "prompt injection"?',
                'options' => [
                    'A technique to feed more API keys to custom integrations',
                    'A security vulnerability where untrusted inputs manipulate an LLM\'s system instructions',
                    'The physical installation of memory expansion modules into AI GPUs',
                    'Increasing the temperature parameter during prompt design'
                ],
                'answer_letter' => 'B',
                'explanation' => 'Prompt injection is a cybersecurity threat where malicious user inputs override system guardrails to exploit the AI model.'
            ],
            [
                'question' => 'Which concept describes the challenge of ensuring AI systems act in accordance with human values and intent?',
                'options' => [
                    'AI alignment problem',
                    'Gradient descent optimization',
                    'Model quantization challenge',
                    'RAG latency bottleneck'
                ],
                'answer_letter' => 'A',
                'explanation' => 'The AI alignment problem focuses on designing AI systems whose goals and behaviors consistently align with human morals, safety, and interest.'
            ]
        ];

        $map = [
            'A' => 0,
            'B' => 1,
            'C' => 2,
            'D' => 3
        ];

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        CertificateQuestion::query()->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $training = \App\Models\Training::where('name', 'Free AI Knowledge Certificate Program')->first();
        $targetTrainingId = $training ? $training->id : 128;

        foreach ($questions as $q) {
            CertificateQuestion::create([
                'training_id' => $targetTrainingId, // Dynamic link to Free AI Knowledge Certificate Program
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer_index' => $map[$q['answer_letter']],
                'explanation' => $q['explanation'],
                'is_active' => true,
            ]);
        }
    }
}

