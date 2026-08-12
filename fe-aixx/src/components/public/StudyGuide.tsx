"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FaBookOpen, 
  FaChevronRight, 
  FaChevronLeft, 
  FaLightbulb, 
  FaShieldAlt, 
  FaAward, 
  FaLock, 
  FaCheckCircle, 
  FaInfoCircle,
  FaCheck,
  FaFileAlt
} from "react-icons/fa";

interface StudyGuideProps {
  token: string;
  candidateName: string;
  candidateRegId?: string;
}

export default function StudyGuide({ token, candidateName, candidateRegId }: StudyGuideProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({});

  const lessons = [
    {
      title: "1. NLP & LLM Architecture",
      icon: <FaBookOpen className="text-blue-500" />,
      sublessons: [
        {
          title: "Sub-Lesson 1.1: Core Transformers & Self-Attention",
          desc: "Deep dive into the neural structure that redefined language modeling.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Before 2017, Recurrent Neural Networks (RNNs) and LSTM networks processed text sequentially (word-by-word), which was slow and struggled with long-range word relationships.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold text-brand-700">
                Key Breakthrough: The Self-Attention Mechanism
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The Transformer architecture maps inputs to Query (Q), Key (K), and Value (V) matrices. It calculates the correlation between every single word in a sentence simultaneously. This allows the model to capture context and dependencies regardless of distance.
              </p>
            </div>
          )
        },
        {
          title: "Sub-Lesson 1.2: Tokenization & Embeddings Ingestion",
          desc: "How raw text is parsed and translated into machine-readable numeric formats.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                AI models cannot read alphabets directly. Text is converted into numerical formats through a multi-step pipeline:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Tokenization:</strong> Breaking strings into words or subword chunks. Most modern LLMs use Byte-Pair Encoding (BPE) or WordPiece tokenization to handle typos and unknown words.</li>
                <li><strong>Embeddings:</strong> Mapping tokens into high-dimensional vector spaces where words with similar semantic meanings are placed closer together.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 1.3: Context Windows & Scale Benchmarks",
          desc: "Understanding physical computing limits and standard metrics.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                LLMs operate within strict computing configurations:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Context Window:</strong> The hard limit of tokens a model can process collectively in a single query and response session. Exceeding this boundary results in loss of memory.</li>
                <li><strong>MMLU Scale:</strong> The Massive Multitask Language Understanding benchmark is the golden standard to evaluate model capabilities across 57 subjects ranging from physics to history.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 1.4: Pre-training vs. Inference Stages",
          desc: "Understanding the pipeline from raw model weights initialization to final deployments.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Building and deploying an LLM involves two primary technical phases:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Pre-training (Self-Supervised):</strong> The model reads massive text libraries to learn grammar, facts, and reasoning. This is highly compute-intensive, requiring clusters of GPUs.</li>
                <li><strong>Inference (Autoregressive Decoding):</strong> Running the trained model to generate completions. The model predicts text token-by-token, feeding its own previous outputs back as input.</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      title: "2. Prompt Engineering",
      icon: <FaLightbulb className="text-amber-500" />,
      sublessons: [
        {
          title: "Sub-Lesson 2.1: Persona & System Instructions",
          desc: "Establishing absolute guardrails and styling personas for conversations.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed">
                <strong>System Prompts (System Instructions)</strong> act as a global configuration layer. They dictate:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Persona & Role:</strong> (e.g. &quot;You are an expert AIXX database administrator.&quot;)</li>
                <li><strong>Formatting Requirements:</strong> Enforcing strict outputs like Markdown, JSON tables, or code syntax block.</li>
                <li><strong>Constraints:</strong> Explicit lists of prohibited topics or rules (e.g. &quot;Do not disclose backend passwords.&quot;)</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 2.2: Context Injection (Zero-Shot vs. Few-Shot)",
          desc: "Direct prompt instruction methods to guide text synthesis.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guiding how the LLM answers queries without training dataset modifications:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Zero-Shot Prompting:</strong> Asking a model to execute a task directly without giving any examples. Good for general knowledge tasks.</li>
                <li><strong>Few-Shot Prompting:</strong> Providing 2 to 5 concrete input-output examples in the prompt, allowing the model to mirror formatting patterns or writing styles.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 2.3: Logical Chains & Reasoning Loops",
          desc: "Unlocking logical reasoning and managing output variations.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Methods to control reasoning quality and creativity thresholds:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Chain of Thought (CoT):</strong> Directing the model to break down its reasoning step-by-step before printing a final answer. Reduces calculations shortcuts.</li>
                <li><strong>Self-Consistency:</strong> Generating multiple reasoning paths and taking the majority vote to ensure mathematical accuracy.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 2.4: Temperature & Nucleus Sampling Parameters",
          desc: "Fine-tuning text output creativity and distribution thresholds.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sampling parameters dictate how the model selects the next token from its probability distribution:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Temperature:</strong> Controls probability scaling. Lower values (e.g. 0.1) prioritize the most probable words, making responses predictable and precise. Higher values (e.g. 0.9) increase creativity.</li>
                <li><strong>Top-P (Nucleus Sampling):</strong> Restricts selections to a cumulative percentage threshold (e.g. top 90% probability pool) to weed out highly improbable words.</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      title: "3. RAG Systems & Hallucination",
      icon: <FaBookOpen className="text-emerald-500" />,
      sublessons: [
        {
          title: "Sub-Lesson 3.1: Vector Storage & Semantic Search Ingestion",
          desc: "How documents are chunked and index-searched for semantic relevance.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Retrieval-Augmented Generation (RAG) updates model inputs dynamically using a vector search pipeline:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Document Chunking:</strong> Large PDFs are broken down into overlapping segments (e.g. 500-token chunks) to preserve sentence coherence.</li>
                <li><strong>Vector Embeddings:</strong> High-dimensional numbers representing chunks are stored in a <strong>Vector Database</strong> (e.g., Pinecone or Chroma).</li>
                <li><strong>Semantic Similarity:</strong> Distance metrics (like Cosine Similarity) are calculated to fetch the top-matching reference chunks based on query meaning.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 3.2: Mitigation of Hallucinations",
          desc: "Solving model fabrications by grounding response logic.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                LLMs have no internal check for factual accuracy. They output the most probable tokens, which can result in **hallucinations** (confident but fabricated errors).
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By implementing RAG, the prompt context is grounded on verified document chunks. The model is instructed to formulate its answers *only* using the retrieved documents, eliminating fabrication risks.
              </p>
            </div>
          )
        },
        {
          title: "Sub-Lesson 3.3: Chunking Strategies & Metadata Filtering",
          desc: "Improving retrieval precision using chunk structures and attributes.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                RAG pipelines can be optimized using granular search configurations:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Recursive Splitters:</strong> Automatically splits documents by paragraphs first, then sentences, keeping semantic units intact.</li>
                <li><strong>Metadata Filtering:</strong> Attaches keywords (e.g. date range, category, department) to document chunks so search queries can filter search scopes instantly.</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      title: "4. Training & Security",
      icon: <FaShieldAlt className="text-purple-500" />,
      sublessons: [
        {
          title: "Sub-Lesson 4.1: Deep Learning & Overfitting Diagnostics",
          desc: "Neural network configurations and overfitting prevention strategies.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Artificial neural networks consist of interconnected node layers. During training, weights are updated via backpropagation.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Overfitting:</strong> A major challenge where the model memorizes training noise instead of learning generalized patterns. It results in low training loss but poor performance on unseen validation/test data.
              </p>
            </div>
          )
        },
        {
          title: "Sub-Lesson 4.2: Fine-Tuning & RLHF Alignment",
          desc: "Adapting weights to specialized instructions and human values.",
          content: (
            <div className="space-y-3">
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Supervised Fine-Tuning (SFT):</strong> Adapting pre-trained base models by training them on curated instruction-response pairs.</li>
                <li><strong>RLHF (Reinforcement Learning from Human Feedback):</strong> Uses reward models representing human ratings. Addresses the <strong>AI Alignment Problem</strong>, keeping AI aligned with human safety values.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 4.3: Security exploits & Autonomous Agentic Loops",
          desc: "Securing systems from prompt injection and outlining planning loops.",
          content: (
            <div className="space-y-3">
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Prompt Injection:</strong> A critical exploit where untrusted user input overrides system prompts to extract secret instructions or bypass safety guardrails.</li>
                <li><strong>Agentic Systems:</strong> Systems utilizing loops (e.g. ReAct - Reasoning & Acting) that plan sub-tasks, call external APIs (like calculators or database query runtimes), and make decisions autonomously.</li>
              </ul>
            </div>
          )
        },
        {
          title: "Sub-Lesson 4.4: AI Ethics, Alignment & Safeguards",
          desc: "Technological systems for safety alignments.",
          content: (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Aligning systems to remain helpful, harmless, and honest:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-600 space-y-1.5">
                <li><strong>Jailbreak Safeguards:</strong> Implementing dual-LLM configurations (guardrail filters) to scan inputs and redact potential attacks before they reach backend models.</li>
                <li><strong>PII Scrubbers:</strong> Middleware programs that strip sensitive personal information (social security numbers, emails) from prompts to protect user privacy.</li>
              </ul>
            </div>
          )
        }
      ]
    }
  ];

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleNext = () => {
    if (activeTab < lessons.length - 1) {
      // Mark current tab as completed *only* when they click next to advance
      setCompletedLessons((prev) => ({ ...prev, [activeTab]: true }));
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleCompleteFinalLesson = () => {
    // Mark final tab as completed
    setCompletedLessons((prev) => ({ ...prev, [activeTab]: true }));
  };

  const completedAll = Object.keys(completedLessons).length === lessons.length;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* Left Sidebar Layout (30% on desktop) */}
      <div className="w-full lg:w-[30%] bg-slate-100/70 border border-slate-200/50 rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          {/* Candidate Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 space-y-2 shadow-sm">
            <div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Logged Candidate</span>
              <strong className="text-sm font-bold text-slate-800 leading-tight block">{candidateName}</strong>
            </div>
            {candidateRegId && (
              <div className="border-t border-slate-100 pt-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">Registration ID</span>
                <strong className="text-xs font-mono font-black text-brand-600 block">{candidateRegId}</strong>
              </div>
            )}
          </div>

          <div className="border-b border-slate-200/80 pb-3">
            <h6 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Study Modules Outline
            </h6>
            <p className="text-[11px] text-slate-505 mt-1 font-medium">Read lessons and click &quot;Next Lesson&quot; at the bottom to mark them complete and unlock the test.</p>
          </div>

          {/* Module Links List */}
          <nav className="flex flex-col gap-2.5">
            {lessons.map((lesson, index) => {
              const isActive = activeTab === index;
              const isCompleted = completedLessons[index];
              return (
                <div key={index} className="space-y-1.5">
                  <button
                    onClick={() => handleTabChange(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border text-left cursor-pointer ${
                      isActive
                        ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-100"
                        : "bg-white text-slate-700 border-slate-200/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0">{lesson.icon}</span>
                      <span>{lesson.title}</span>
                    </div>
                    {isCompleted ? (
                      <FaCheckCircle className={isActive ? "text-white" : "text-emerald-500"} size={14} />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-slate-350"}`}></span>
                    )}
                  </button>

                  {/* Sub-lessons nested list directly in sidebar under active main lesson */}
                  {isActive && (
                    <div className="pl-6 pr-2 py-1 flex flex-col gap-2 border-l-2 border-brand-500 ml-4.5 animate-fadeIn">
                      {lesson.sublessons.map((sub, sidx) => (
                        <div key={sidx} className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold py-0.5">
                          <FaFileAlt size={10} className="text-slate-400" />
                          <span className="truncate">{sub.title.split(": ")[1]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Lock indicator card at bottom of sidebar */}
        <div className={`p-4.5 rounded-2xl border transition-all ${
          completedAll 
            ? "bg-emerald-50 border-emerald-100 text-emerald-900" 
            : "bg-amber-50 border-amber-100 text-amber-900"
        }`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {completedAll ? (
                <FaCheckCircle className="text-emerald-500" size={18} />
              ) : (
                <FaLock className="text-amber-500" size={16} />
              )}
            </div>
            <div className="space-y-1">
              <h6 className="font-extrabold text-xs tracking-wide">
                {completedAll ? "Exam Unlocked!" : "Final Exam Status"}
              </h6>
              <p className="text-[11px] leading-relaxed text-slate-655 font-medium">
                {completedAll 
                  ? "Congratulations! You have completed all study modules. You are ready to start the final test."
                  : `Review all 4 modules. Progress: ${Object.keys(completedLessons).length}/4 completed.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area (70% on desktop) */}
      <div className="flex-1 bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[500px] shadow-sm">
        
        {/* Lesson Active Content with Sub-lessons */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-lg sm:text-xl text-slate-950 flex items-center gap-2">
              {lessons[activeTab].title}
            </h3>
            <span className="text-xs font-bold text-slate-450 uppercase tracking-widest">
              Module {activeTab + 1} of 4
            </span>
          </div>
          
          {/* Sub-lessons Rendering */}
          <div className="space-y-6 animate-fadeIn">
            {lessons[activeTab].sublessons.map((sub, idx) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-200/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <FaInfoCircle className="text-brand-500 mt-1 flex-shrink-0" size={14} />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                      {sub.title}
                    </h5>
                    <p className="text-xs text-slate-455 font-medium mt-0.5">{sub.desc}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200/40 pt-3 pl-6">
                  {sub.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-slate-200/60 w-full">
          <button
            onClick={handlePrev}
            disabled={activeTab === 0}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-650 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer py-3 px-4 bg-slate-100 md:bg-transparent rounded-xl md:rounded-none"
          >
            <FaChevronLeft size={12} />
            <span>Previous Lesson</span>
          </button>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {activeTab < lessons.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-md shadow-brand-100"
              >
                <span>Complete Module & Continue</span>
                <FaChevronRight size={12} />
              </button>
            ) : (
              !completedLessons[activeTab] && (
                <button
                  onClick={handleCompleteFinalLesson}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shadow-md shadow-brand-100"
                >
                  <FaCheck size={10} />
                  <span>Complete Final Lesson</span>
                </button>
              )
            )}

            {completedAll ? (
              <Link
                href={`/ai-certificate/test?token=${token}`}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 px-8 rounded-xl text-sm sm:text-base transition-all shadow-lg shadow-emerald-100 animate-bounce cursor-pointer text-center"
              >
                <span>Start MCQ Test Now</span>
                <FaAward size={16} />
              </Link>
            ) : (
              activeTab === lessons.length - 1 && !completedAll && (
                <button
                  disabled
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-200 text-slate-400 font-bold py-3 px-6 rounded-xl text-xs sm:text-sm cursor-not-allowed border border-slate-300/40 text-center"
                >
                  <FaLock size={12} />
                  <span>MCQ Test Locked</span>
                </button>
              )
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
