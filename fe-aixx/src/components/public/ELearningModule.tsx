'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaCheckCircle, FaLock, FaBookOpen, FaLaptopCode, FaArrowRight, FaArrowLeft, FaClock, FaLayerGroup, FaChartLine, FaBrain, FaNetworkWired, FaFileAlt, FaTimesCircle, FaTrophy, FaApple, FaFacebook, FaGoogle, FaLinkedin, FaCheck } from 'react-icons/fa';
import { api } from '@/lib/public/api';
import { courseQuestions } from './courseQuestions';
// --- MOCK DATA ---

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'notes' | 'quiz' | 'video';
  status: string;
  content?: string;
  questions?: QuizQuestion[];
}

interface CurriculumSection {
  id: string;
  sectionTitle: string;
  lessons: Lesson[];
}

const availableCourses = [
  { 
    id: 'ai-productivity', 
    title: 'Enterprise AI & Productivity', 
    description: 'Master enterprise-grade AI tools to optimize workflows and drive organizational efficiency.', 
    extendedDescription: 'The course is further enhanced with a practical and hands-on approach that will introduce the learner to the most innovative enterprise AI tools and automation platforms, including Microsoft Copilot, ChatGPT Enterprise, and intelligent workflow solutions.',
    modules: 4, 
    duration: '2h 15m',
    icon: FaChartLine,
    theme: 'brand',
    price: 'Free'
  },
  { 
    id: 'gen-ai', 
    title: 'Generative AI Masterclass', 
    description: 'Comprehensive deep dive into LLMs, advanced prompt engineering, and GenAI applications.', 
    extendedDescription: 'The course is further enhanced with a practical and hands-on approach that will introduce the learner to the most innovative tools and technologies in the industry, including OpenAI APIs, Claude, Midjourney, and advanced prompting techniques.',
    modules: 6, 
    duration: '4h 30m',
    icon: FaBrain,
    theme: 'emerald',
    price: 'Free'
  },
  { 
    id: 'ml-basics', 
    title: 'Machine Learning Foundations', 
    description: 'Understand the architectural concepts of ML and neural networks for real-world modeling.', 
    extendedDescription: 'The course is further enhanced with a practical and hands-on approach that will introduce the learner to the most innovative tools and technologies in the industry, including TensorFlow, PyTorch, and scikit-learn.',
    modules: 5, 
    duration: '3h 45m',
    icon: FaNetworkWired,
    theme: 'blue',
    price: 'Free'
  }
];

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const countryPhoneCodes = [
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "Malaysia", code: "+60", flag: "🇲🇾" },
  { country: "Indonesia", code: "+62", flag: "🇮🇩" },
  { country: "Thailand", code: "+66", flag: "🇹🇭" },
  { country: "Philippines", code: "+63", flag: "🇵🇭" },
  { country: "Vietnam", code: "+84", flag: "🇻🇳" },
  { country: "India", code: "+91", flag: "🇮🇳" },
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "United States", code: "+1", flag: "🇺🇸" },
  { country: "Canada", code: "+1", flag: "🇨🇦" },
  { country: "China", code: "+86", flag: "🇨🇳" },
  { country: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { country: "Japan", code: "+81", flag: "🇯🇵" },
  { country: "South Korea", code: "+82", flag: "🇰🇷" },
  { country: "Taiwan", code: "+886", flag: "🇹🇼" },
  { country: "New Zealand", code: "+64", flag: "🇳🇿" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Netherlands", code: "+31", flag: "🇳🇱" },
  { country: "Switzerland", code: "+41", flag: "🇨🇭" },
  { country: "Sweden", code: "+46", flag: "🇸🇪" },
  { country: "Norway", code: "+47", flag: "🇳🇴" },
  { country: "Denmark", code: "+45", flag: "🇩🇰" },
  { country: "Finland", code: "+358", flag: "🇫🇮" },
  { country: "Russia", code: "+7", flag: "🇷🇺" },
  { country: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { country: "UAE", code: "+971", flag: "🇦🇪" },
  { country: "Qatar", code: "+974", flag: "🇶🇦" },
  { country: "South Africa", code: "+27", flag: "🇿🇦" },
  { country: "Egypt", code: "+20", flag: "🇪🇬" },
  { country: "Turkey", code: "+90", flag: "🇹🇷" },
  { country: "Brazil", code: "+55", flag: "🇧🇷" },
  { country: "Argentina", code: "+54", flag: "🇦🇷" },
  { country: "Mexico", code: "+52", flag: "🇲🇽" },
  { country: "Pakistan", code: "+92", flag: "🇵🇰" },
  { country: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { country: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { country: "Myanmar", code: "+95", flag: "🇲🇲" },
  { country: "Cambodia", code: "+855", flag: "🇰🇭" },
  { country: "Brunei", code: "+673", flag: "🇧🇳" },
  { country: "Laos", code: "+856", flag: "🇱🇦" }
];

const courseCurriculums: Record<string, CurriculumSection[]> = {
  'basic-ai': [
    {
      id: 'intro',
      sectionTitle: 'Course Introduction',
      lessons: [
        {
          id: 401,
          title: 'Introduction to Free AI Knowledge Certificate',
          duration: '4 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p class="text-xl font-bold text-slate-900 font-serif">Welcome to the Free AI Knowledge Certificate!</p>
              <p>This program is a comprehensive, non-technical introduction designed to build your core artificial intelligence literacy. As AI technologies integrate into search engines, enterprise software, and everyday life, knowing how they work has become an essential modern skill.</p>
              
              <div class="p-5 bg-emerald-50/60 border-l-4 border-emerald-500 text-emerald-900 rounded-r-xl space-y-2">
                <strong class="text-base">Why AI Literacy Matters:</strong>
                <p class="text-sm">Understanding AI is not just for computer scientists. It enables managers, writers, educators, and entrepreneurs to collaborate with smart systems, automate redundant tasks, and make informed choices about privacy and ethics.</p>
              </div>

              <h4 class="text-lg font-bold text-slate-900 font-serif">What You Will Study</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <h5 class="font-bold text-slate-900 mb-1 text-sm">Module 1: Everyday AI</h5>
                  <p class="text-xs text-slate-500">Learn how predictive systems, recommendation engines, smart voice assistants, and search indexing affect your daily lifestyle.</p>
                </div>
                <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <h5 class="font-bold text-slate-900 mb-1 text-sm">Module 2: Generative AI</h5>
                  <p class="text-xs text-slate-500">Understand the prompting frameworks for tools like ChatGPT and Claude, while learning about hallucinations and AI bias.</p>
                </div>
              </div>

              <h4 class="text-lg font-bold text-slate-900 font-serif">Assessment Requirements</h4>
              <p class="text-sm">This curriculum concludes with a <strong>20-question final exam</strong>. To receive your digital completion certificate, you must score at least <strong>80% (16/20 correct answers)</strong>. You can retry the exam as many times as necessary to pass.</p>
            </div>
          `
        }
      ]
    },
    {
      id: 'module1',
      sectionTitle: 'Module 1: AI in Everyday Life',
      lessons: [
        {
          id: 402,
          title: 'What is AI and How Does it Work?',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Artificial Intelligence (AI) refers to computer systems designed to perform tasks that typically require human intelligence. This includes reasoning, learning from past experiences, and understanding natural language.</p>
              
              <h4 class="text-xl font-bold text-slate-900 font-serif">Core AI Technologies Explained Simply</h4>
              <div class="space-y-4">
                <div class="border-b border-gray-100 pb-4">
                  <h5 class="font-bold text-slate-900 text-sm">1. Machine Learning (ML)</h5>
                  <p class="text-sm text-slate-600 mt-1">Instead of writing code that describes every step, we show a computer millions of examples. The computer learns to identify patterns from these examples and applies them to new data.</p>
                </div>
                <div class="border-b border-gray-100 pb-4">
                  <h5 class="font-bold text-slate-900 text-sm">2. Deep Learning & Neural Networks</h5>
                  <p class="text-sm text-slate-600 mt-1">Inspired by biological brain structures, deep learning uses layers of artificial neurons to process information. Each layer refines the decision (e.g., one layer detects simple lines, the next detects shapes, and the final layer identifies a human face).</p>
                </div>
                <div class="border-b border-gray-100 pb-4">
                  <h5 class="font-bold text-slate-900 text-sm">3. Natural Language Processing (NLP)</h5>
                  <p class="text-sm text-slate-600 mt-1">Enables computers to read, translate, and extract meaning from human language. This technology drives automated voice translations and smart document summaries.</p>
                </div>
                <div>
                  <h5 class="font-bold text-slate-900 text-sm">4. Computer Vision</h5>
                  <p class="text-sm text-slate-600 mt-1">Allows machines to "see" and interpret visual data from cameras. Autonomous vehicles use computer vision to detect lane markings, traffic lights, and pedestrians in real-time.</p>
                </div>
              </div>

              <h4 class="text-xl font-bold text-slate-900 font-serif">Everyday Examples of AI</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Recommendation Systems:</strong> Streaming services like Netflix or music platforms like Spotify analyze your past choices to suggest new movies or songs.</li>
                <li><strong>Smart Assistants:</strong> Voice-activated helpers like Siri, Alexa, or Google Assistant translate your voice commands into actions.</li>
                <li><strong>Search Engines:</strong> Google and Bing use AI to predict what you are searching for and deliver the most relevant websites.</li>
              </ul>

              <div class="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 class="font-bold text-slate-900 mb-2 font-serif text-sm">AI vs. Traditional Computer Programming</h5>
                <p class="text-sm">In traditional programming, the developer writes explicit rules: <code>Inputs + Rules = Answers</code>. In Machine Learning, the system creates the rules: <code>Inputs + Answers = Rules</code>. This allows computers to solve complex problems that are too difficult for humans to write rules for.</p>
              </div>
            </div>
          `
        },
        {
          id: 403,
          title: 'Module 1 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is the primary difference between AI and traditional software?",
              options: ["AI requires no internet connection to operate", "AI systems learn from patterns in data rather than just following rigid pre-written rules", "Traditional software does not use databases", "AI is only used in video games"],
              correctAnswer: 1
            },
            {
              question: "Which of the following is an everyday example of AI at work?",
              options: ["A simple mechanical wall clock", "A recommendation algorithm suggesting videos on YouTube", "A calculator showing the sum of 2 + 2", "A standard print copy of a book"],
              correctAnswer: 1
            },
            {
              question: "Why do streaming platforms use recommendation engines?",
              options: ["To delete old movies automatically", "To predict and suggest content you are likely to enjoy based on your past activity", "To charge you extra monthly fees", "To test your device's audio volume"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module2',
      sectionTitle: 'Module 2: Generative AI & Ethics',
      lessons: [
        {
          id: 404,
          title: 'Understanding Generative AI & Prompting',
          duration: '15 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Generative AI is a subset of artificial intelligence capable of generating new text, images, videos, audio, or code from scratch when given a simple natural language request. Popular examples include ChatGPT, Claude, and Midjourney.</p>

              <h4 class="text-xl font-bold text-slate-900 font-serif">How Large Language Models (LLMs) Work</h4>
              <p class="text-sm">Large Language Models (like GPT-4 or Claude) are trained on massive libraries of text. Under the hood, they act like highly sophisticated autocomplete engines. They do not "think" or feel like humans; instead, they analyze the words you have written and calculate the most statistically probable next words to complete your sentence.</p>

              <h4 class="text-xl font-bold text-slate-900 font-serif">The Prompt Engineering Framework: R-T-C-F</h4>
              <p class="text-sm">A <strong>prompt</strong> is the text instruction you write to command a generative AI model. Use the <strong>R-T-C-F</strong> layout to get premium results:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>R - Role:</strong> Tell the AI who it should pretend to be (e.g., "Act as a senior marketing specialist...").</li>
                <li><strong>T - Task:</strong> State the primary output required (e.g., "...write a weekly newsletter header...").</li>
                <li><strong>C - Context:</strong> Give additional background details (e.g., "...for a community garden project that is starting a winter program...").</li>
                <li><strong>F - Format:</strong> Specify structure (e.g., "...format as 3 bullet points, under 50 words each.").</li>
              </ul>

              <h4 class="text-xl font-bold text-slate-900 font-serif">Ethics, Hallucinations, and Safety</h4>
              <p class="text-sm">Because LLMs predict probable next words rather than retrieving raw facts, they sometimes experience <strong>hallucinations</strong>—confidently asserting statements or statistics that are completely made up. Other critical ethical considerations include:</p>
              <ul class="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>Algorithmic Bias:</strong> If training data is biased or represents only a subset of people, the AI predictions will reinforce those unfair biases.</li>
                <li><strong>Data Privacy:</strong> Public AI tools often save your prompts to retrain their models. Never share confidential business reports, personal numbers, or password keys.</li>
                <li><strong>Human-in-the-loop:</strong> Professional outputs must always be reviewed by human experts to ensure safety, accuracy, and legal compliance.</li>
              </ul>
            </div>
          `
        },
        {
          id: 405,
          title: 'Module 2 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is 'Generative AI'?",
              options: ["AI that only counts files on a server", "AI capable of creating new text, images, or code based on user prompts", "A system that prevents computers from turning off", "A database backup system"],
              correctAnswer: 1
            },
            {
              question: "What is an AI 'hallucination'?",
              options: ["When an AI system goes offline due to high traffic", "When a generative AI model confidently presents false or fabricated information as fact", "When a computer screen starts flickering", "When a user inputs a prompt using emojis"],
              correctAnswer: 1
            },
            {
              question: "Which of the following makes a prompt more effective?",
              options: ["Keeping it as short and vague as possible", "Being specific, providing context, and defining formatting rules", "Using capital letters for every word", "Asking the AI to answer in another language only"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'certification',
      sectionTitle: 'Final Certification',
      lessons: [
        {
          id: 406,
          title: 'Final Certification Exam',
          duration: '10 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Which term describes systems that learn from data patterns to make predictions rather than following rigid pre-programmed rules?",
              options: ["Static scripting", "Artificial Intelligence & Machine Learning", "HTML rendering", "Binary compilation"],
              correctAnswer: 1
            },
            {
              question: "What do recommendation systems use to predict what products or media you might like?",
              options: ["Random guess selection", "Your past viewing or purchasing history and behavior patterns", "The device battery percentage", "The time zone of your router"],
              correctAnswer: 1
            },
            {
              question: "Which of these is a typical function of Generative AI?",
              options: ["Replacing computer CPUs physically", "Creating new paragraphs of text or drawing images based on prompts", "Backing up documents to local folders", "Encrypting database passwords"],
              correctAnswer: 1
            },
            {
              question: "What is an AI 'prompt'?",
              options: ["A system shutdown timer", "The written instruction or input text you give to guide an AI's response", "A database configuration key", "An error code on screen"],
              correctAnswer: 1
            },
            {
              question: "If a generative AI tool outputs a fact you plan to use in a professional report, you should:",
              options: ["Copy and paste it immediately without review", "Verify the facts using trusted external sources before publishing", "Delete the AI tool from your device", "Write the report in bold characters"],
              correctAnswer: 1
            },
            {
              question: "What is the phenomenon where an AI model confidently invents incorrect facts?",
              options: ["Data drift", "Hallucination", "Overclocking", "Bit rot"],
              correctAnswer: 1
            },
            {
              question: "To make a prompt more effective, which of the following should you include?",
              options: ["Vague instructions", "Specific role context, clear constraints, and expected output formats", "A database index command", "No spaces between words"],
              correctAnswer: 1
            },
            {
              question: "Which tool is an example of an AI-powered smart voice assistant?",
              options: ["Apple Siri", "Windows Notepad", "Microsoft Excel", "Google Chrome Browser"],
              correctAnswer: 0
            },
            {
              question: "Which of the following is an ethical concern regarding AI development?",
              options: ["The color of the computer casing", "Algorithmic bias and data privacy protections", "The CPU fan noise speed", "Using double quotes in text files"],
              correctAnswer: 1
            },
            {
              question: "What does it mean for a course to be self-paced?",
              options: ["You must complete it in a single continuous session", "You can study the materials and attempt quizzes whenever it is convenient for you", "The course lessons are read to you by an audio assistant", "You are not allowed to retake any quizzes"],
              correctAnswer: 1
            }
          ]
        }
      ]
    }
  ],
  'ai-productivity': [
    {
      id: 'intro',
      sectionTitle: 'Course Introduction',
      lessons: [
        {
          id: 101,
          title: 'Introduction to Enterprise AI & Productivity',
          duration: '3 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-4 text-slate-700">
              <p class="text-lg font-medium text-slate-900">Welcome to the Enterprise AI & Productivity course!</p>
              <p>In this digital age, organizations are rapidly evolving from digital-first to AI-first. Enterprise artificial intelligence isn't just about single-task tools; it is about building a cohesive, secure, and highly automated environment that empowers employees, eliminates bottlenecks, and drives organizational efficiency.</p>
              <p>Throughout this course, you will learn how to leverage enterprise-grade AI tools, design automated workflows, adhere to critical data governance and security frameworks, and measure the tangible ROI of AI initiatives.</p>
              <div class="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-xl">
                <strong>Learning Path:</strong> Complete the reading notes in each module, then pass the respective Knowledge Check quizzes with a score of 50% or higher to progress toward your final certification.
              </div>
            </div>
          `
        }
      ]
    },
    {
      id: 'module1',
      sectionTitle: 'Module 1: AI Tools for Business Automation',
      lessons: [
        {
          id: 102,
          title: 'Enterprise AI Tool Ecosystem',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Enterprise AI systems differ fundamentally from consumer tools. While a consumer might use a chatbot for brainstorming, an enterprise requires tools that connect with corporate data graphs, respect role-based access control (RBAC), and comply with strict service-level agreements (SLAs).</p>
              <h4 class="text-xl font-bold text-slate-900">Key Enterprise AI Tools</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Microsoft Copilot:</strong> Deeply integrated into the Microsoft 365 environment, it accesses your emails, chats, calendars, and files securely via the Microsoft Graph to assist in drafting documents, summarizing meetings, and analyzing data in Excel.</li>
                <li><strong>ChatGPT Enterprise:</strong> Offers enterprise-grade security, administrative controls, custom templates, and unlimited high-speed access to advanced models without training on your business data.</li>
                <li><strong>Custom Enterprise RAG Apps:</strong> Internal search engines that retrieve answers strictly from proprietary company knowledge bases, ensuring custom search results without public data leakages.</li>
              </ul>
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 class="font-bold text-slate-900 mb-2">Integration Strategies</h5>
                <p>Deploying these tools successfully requires a clear strategy. Start by training employees on prompt design, defining data classifications (public, internal, confidential), and provisioning licenses according to role needs.</p>
              </div>
            </div>
          `
        },
        {
          id: 103,
          title: 'Module 1 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Which tool is specifically designed for enterprise-wide integration with Microsoft 365 services?",
              options: ["ChatGPT Free", "Microsoft Copilot", "Midjourney"],
              correctAnswer: 1
            },
            {
              question: "What is a key advantage of ChatGPT Enterprise over the consumer version?",
              options: ["Dedicated data privacy and security guarantees", "It is completely free", "It requires no internet connection"],
              correctAnswer: 0
            },
            {
              question: "Which phase is crucial before deploying any AI automation tool in a business workflow?",
              options: ["Creating marketing videos", "Workflow analysis and bottleneck identification", "Hiring a new CEO"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module2',
      sectionTitle: 'Module 2: Practical Implementation',
      lessons: [
        {
          id: 104,
          title: 'Designing AI-Powered Workflows',
          duration: '12 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Workflow automation is the engine of enterprise productivity. By mapping out manual, repetitive tasks, teams can design workflows where AI handles data extraction, draft generation, and initial triage, leaving human workers to review, edit, and approve.</p>
              <h4 class="text-xl font-bold text-slate-900">Practical Automation Stack</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Triggers:</strong> Events that start the workflow, such as receiving a customer email, a new form submission, or a scheduled database update.</li>
                <li><strong>AI Reasoning Steps:</strong> Using APIs (like OpenAI or Anthropic) to categorize the request, summarize key details, or extract structured JSON fields.</li>
                <li><strong>Action Steps:</strong> Writing the results to a CRM, sending a Slack alert, or generating a draft email response.</li>
              </ul>
              <div class="p-4 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100">
                <h5 class="font-bold mb-1">Human-in-the-Loop (HITL)</h5>
                <p>Always insert a human approval step for high-impact actions like issuing refunds, publishing public-facing content, or sending external communications. This guards against hallucinations and ensures brand alignment.</p>
              </div>
            </div>
          `
        },
        {
          id: 105,
          title: 'Module 2 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "In AI-driven workflow design, what does 'human-in-the-loop' mean?",
              options: ["A human reviews or approves AI actions to ensure quality", "AI supervises human workers at all times", "No human involvement is permitted"],
              correctAnswer: 0
            },
            {
              question: "Which of the following is a leading integration platform for connecting business apps without writing custom code?",
              options: ["Docker", "Make/Zapier", "Nginx"],
              correctAnswer: 1
            },
            {
              question: "What is the primary goal of workflow optimization?",
              options: ["Increasing page rank on Google", "Eliminating waste, reducing cycle times, and improving efficiency", "Hiring more manual data entry agents"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module3',
      sectionTitle: 'Module 3: Data Governance & Security',
      lessons: [
        {
          id: 106,
          title: 'Securing the AI-First Enterprise',
          duration: '15 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>As enterprises adopt AI, data security becomes paramount. Sending proprietary code, customer records, or financial projections to public AI models exposes the organization to intellectual property loss and regulatory penalties (e.g., GDPR, HIPAA).</p>
              <h4 class="text-xl font-bold text-slate-900">Governance Framework Guidelines</h4>
              <ol class="list-decimal pl-5 space-y-3">
                <li><strong>Opt-Out of Model Training:</strong> Ensure all API agreements explicitly state that input/output data is not used for model retraining.</li>
                <li><strong>Data Anonymization:</strong> Sanitize or mask personally identifiable information (PII) before transmitting requests to external LLM APIs.</li>
                <li><strong>Role-Based Access Control:</strong> Ensure RAG systems restrict information access based on existing user permissions, so employees cannot query confidential files they shouldn't access.</li>
              </ol>
              <div class="p-4 bg-rose-50 text-rose-950 rounded-xl border border-rose-100">
                <strong>Algorithmic Fairness:</strong> Evaluate your training and prompting inputs to detect bias, ensuring that automated customer triages or candidate screenings are fair, non-discriminatory, and explainable.
              </div>
            </div>
          `
        },
        {
          id: 107,
          title: 'Module 3 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Why is data governance essential when utilizing public AI APIs?",
              options: ["To guarantee faster response times", "To prevent accidental leakage of sensitive or proprietary company data", "To increase the model's parameters"],
              correctAnswer: 1
            },
            {
              question: "What is 'data residency'?",
              options: ["The requirement that data must be stored and processed within specific geographical borders", "A type of local database backup", "The time a user spends on a webpage"],
              correctAnswer: 0
            },
            {
              question: "Which concept ensures that AI systems make fair and non-discriminatory decisions?",
              options: ["Algorithmic fairness and ethical AI design", "Maximum likelihood estimation", "Overfitting prevention"],
              correctAnswer: 0
            }
          ]
        }
      ]
    },
    {
      id: 'module4',
      sectionTitle: 'Module 4: Measuring AI ROI & Change Management',
      lessons: [
        {
          id: 108,
          title: 'Upskilling & Calculating ROI',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Adopting AI requires an investment in software licenses, cloud compute, and employee training. To justify this cost, businesses must measure return on investment (ROI) and manage organizational change effectively.</p>
              <h4 class="text-xl font-bold text-slate-900">ROI Assessment Framework</h4>
              <p>Measure success across multiple axes:</p>
              <ul class="list-disc pl-5 space-y-2">
                <li><strong>Quantitative Time-Savings:</strong> Calculate the average hours saved per week on repetitive tasks (e.g., meeting summaries, report drafting) multiplied by employee hourly rates.</li>
                <li><strong>Qualitative Improvements:</strong> Assess improvements in employee satisfaction, reductions in document error rates, and accelerated speed-to-market.</li>
                <li><strong>Platform Usage Metrics:</strong> Monitor monthly active users and prompt volume to identify adoption gaps.</li>
              </ul>
              <div class="p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
                <strong>Upskilling & Change Management:</strong> Address anxiety about job displacement by positioning AI as a "copilot" that removes administrative burden, allowing employees to focus on creative, high-value tasks.
              </div>
            </div>
          `
        },
        {
          id: 109,
          title: 'Module 4 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "How is ROI typically calculated for an enterprise AI initiative?",
              options: ["Comparing value/time saved against licensing, implementation, and training costs", "Counting the number of developers in the team", "By measuring CPU utilization rates"],
              correctAnswer: 0
            },
            {
              question: "What is a common cause of employee resistance to AI adoption?",
              options: ["Fear of job displacement and lack of training/support", "Models having too much context memory", "High internet speed"],
              correctAnswer: 0
            },
            {
              question: "Which metric is most direct for measuring efficiency in customer support AI tools?",
              options: ["Average resolution time and first-contact resolution rate", "The total number of emojis used", "Page refresh speed"],
              correctAnswer: 0
            }
          ]
        }
      ]
    },
    {
      id: 'certification',
      sectionTitle: 'Final Certification',
      lessons: [
        {
          id: 110,
          title: 'Final Certification Exam',
          duration: '10 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Which Microsoft service integrates secure AI assistance across corporate graphs?",
              options: ["Bing Search", "Microsoft Copilot", "Cortana Classic"],
              correctAnswer: 1
            },
            {
              question: "What feature is typically disabled or governed in ChatGPT Enterprise compared to the free tier?",
              options: ["Markdown formatting", "Training models on user inputs and data", "Dark mode UI theme"],
              correctAnswer: 1
            },
            {
              question: "Which step ensures quality when designing high-impact AI automated workflows?",
              options: ["Using only encoder models", "Human-in-the-loop approval gates", "Removing all API logging logs"],
              correctAnswer: 1
            },
            {
              question: "How should sensitive corporate customer information be handled before sending to public APIs?",
              options: ["Masking or anonymization of personally identifiable information (PII)", "Writing it in capital letters", "No modifications are needed"],
              correctAnswer: 0
            },
            {
              question: "What does role-based access control (RBAC) in enterprise RAG systems prevent?",
              options: ["Users from using search engines", "Employees from querying confidential documents they aren't authorized to view", "The database from shutting down"],
              correctAnswer: 1
            },
            {
              question: "Which of the following describes 'data residency' regulations?",
              options: ["Data must reside in specific cloud servers within national/regional boundaries", "A requirement that all users must work from the office", "The length of time data stays in cache"],
              correctAnswer: 0
            },
            {
              question: "What is the quantitative measure of AI business success?",
              options: ["Total CPU clock cycles", "Hours saved per employee times their compensation rate", "Number of neural layers trained"],
              correctAnswer: 1
            },
            {
              question: "To handle employee anxiety about AI automation, organizations should:",
              options: ["Keep deployment secret", "Position AI as an assistant that automates routine chores to enable high-value work", "Replace all departments instantly"],
              correctAnswer: 1
            },
            {
              question: "What is the primary function of triggers in workflow automation?",
              options: ["Evaluating code complexity", "Initiating a series of automated actions based on a specific event", "Limiting bandwidth"],
              correctAnswer: 1
            },
            {
              question: "Which AI governance policy protects trade secrets?",
              options: ["Ensuring API vendors explicitly opt-out inputs from model training datasets", "Using open-source operating systems", "Restricting models to 10 tokens"],
              correctAnswer: 0
            }
          ]
        }
      ]
    }
  ],
  'gen-ai': [
    {
      id: 'intro',
      sectionTitle: 'Course Introduction',
      lessons: [
        {
          id: 201,
          title: 'Introduction to Generative AI',
          duration: '3 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-4 text-slate-700">
              <p class="text-lg font-medium text-slate-900">Welcome to the Generative AI Masterclass!</p>
              <p>Generative AI represents one of the most transformative technology shifts of our generation. Moving beyond traditional analytical AI, generative systems can create text, code, images, and structured outputs from human language instructions.</p>
              <p>In this comprehensive course, you will learn the internal mechanics of LLMs (Large Language Models), master the art of prompt engineering, explore advanced reasoning frameworks like Chain-of-Thought and ReAct, design Retrieval-Augmented Generation (RAG) pipelines, build autonomous AI agents, and learn the fundamentals of model fine-tuning.</p>
              <div class="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-905 rounded-r-xl">
                <strong>Learning Path:</strong> This curriculum comprises 6 core technical modules, extensive reading notes, and knowledge checks to certify your expertise.
              </div>
            </div>
          `
        }
      ]
    },
    {
      id: 'module1',
      sectionTitle: 'Module 1: LLM Architecture & Mechanics',
      lessons: [
        {
          id: 202,
          title: 'How Large Language Models Work',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>To write effective prompts and build reliable systems, you must understand how Large Language Models compute outputs. Modern LLMs are based on the Transformer architecture (specifically Decoder-only models like GPT-4, Llama, and Claude).</p>
              <h4 class="text-xl font-bold text-slate-900">Core Concepts</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Tokenization:</strong> LLMs do not read words directly; they break text down into tokens (sub-word chunks, roughly 4 characters or 0.75 words per token).</li>
                <li><strong>Context Window:</strong> The memory capacity of the model for a single query and response (e.g., 8K, 32K, or even 200K+ tokens).</li>
                <li><strong>Generation Parameters:</strong> Controls like <em>Temperature</em> (randomness/creativity, 0.0 for deterministic, 1.0 for creative) and <em>Top-P</em> (nuclei sampling threshold).</li>
              </ul>
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 class="font-bold text-slate-900 mb-2">Self-Attention Mechanism</h5>
                <p>The core innovation of Transformers is Self-Attention, which allows the model to calculate contextually dependent relationships between every single token in a prompt simultaneously, rather than processing words sequentially.</p>
              </div>
            </div>
          `
        },
        {
          id: 203,
          title: 'Module 1 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What architecture, introduced in 2017, forms the foundation of modern LLMs?",
              options: ["Recurrent Neural Network (RNN)", "Transformer", "Convolutional Neural Network (CNN)"],
              correctAnswer: 1
            },
            {
              question: "What does a higher 'temperature' setting in LLM generation cause?",
              options: ["Faster inference speeds", "More creative and random outputs", "More deterministic and repetitive outputs"],
              correctAnswer: 1
            },
            {
              question: "What is a 'token' in the context of LLMs?",
              options: ["A sub-word unit of text that the model processes", "A digital security key", "A type of database indexing"],
              correctAnswer: 0
            }
          ]
        }
      ]
    },
    {
      id: 'module2',
      sectionTitle: 'Module 2: Core Prompt Engineering',
      lessons: [
        {
          id: 204,
          title: 'Foundations of Prompt Design',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Prompt engineering is the practice of structured communication with an LLM to align its responses with user intent. It is the fastest way to program an AI system.</p>
              <h4 class="text-xl font-bold text-slate-900">Key Prompting Paradigms</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Zero-Shot:</strong> Asking the model to perform a task without giving any examples (e.g., "Translate this text to Spanish: Hello").</li>
                <li><strong>Few-Shot:</strong> Providing a few examples of desired input/output patterns to guide the model's tone, format, and behavior before asking the actual query.</li>
                <li><strong>System Prompts:</strong> High-level directives that establish the model's persona, rules, boundaries, and formatting instructions.</li>
              </ul>
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 class="font-bold text-slate-900 mb-2">Best Practices</h5>
                <p>Use clear delimiters (like triple backticks or XML tags) to separate instructions from source data, specify the desired length and formatting of the output, and explicitly state what the model should do if it doesn't know the answer to reduce hallucinations.</p>
              </div>
            </div>
          `
        },
        {
          id: 205,
          title: 'Module 2 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is 'few-shot prompting'?",
              options: ["Providing the model with a few examples of input/output pairs in the prompt", "Training a model with small amounts of compute", "Prompting a model with single-character inputs"],
              correctAnswer: 0
            },
            {
              question: "What are delimiters used for in prompt engineering?",
              options: ["Speeding up calculation", "Separating distinct parts of the prompt, like instructions and user input", "Adding mathematical variables"],
              correctAnswer: 1
            },
            {
              question: "Which prompt component establishes the voice and constraints of the model?",
              options: ["System Prompt / Persona", "Few-shot examples", "Temperature parameters"],
              correctAnswer: 0
            }
          ]
        }
      ]
    },
    {
      id: 'module3',
      sectionTitle: 'Module 3: Advanced Prompting Frameworks',
      lessons: [
        {
          id: 206,
          title: 'Reasoning and Cognitive Architectures',
          duration: '12 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Simple prompts fail on complex reasoning tasks, math, or logical deduction. Advanced frameworks force the model to compute intermediate steps before outputting final answers.</p>
              <h4 class="text-xl font-bold text-slate-900">Reasoning Frameworks</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Chain of Thought (CoT):</strong> Asking the model to "think step-by-step." This prompts the model to generate its reasoning path, which dramatically improves accuracy in arithmetic and symbolic reasoning.</li>
                <li><strong>Tree of Thoughts (ToT):</strong> Generalizes CoT by allowing the model to explore multiple reasoning branches, evaluate its own intermediate progress, and backtrack if a path is incorrect.</li>
                <li><strong>ReAct (Reasoning & Acting):</strong> Integrates reasoning step generation with external tool executions (e.g., searching web, executing code) to solve complex query objectives.</li>
              </ul>
            </div>
          `
        },
        {
          id: 207,
          title: 'Module 3 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What does 'Chain of Thought' prompting ask the model to do?",
              options: ["Formulate a list of keywords", "Show its step-by-step reasoning before outputting the final answer", "Directly execute Python scripts"],
              correctAnswer: 1
            },
            {
              question: "Which framework combines reasoning step generation with action execution?",
              options: ["Zero-shot prompting", "ReAct", "RAG"],
              correctAnswer: 1
            },
            {
              question: "What is the primary benefit of 'Tree of Thoughts' over simple Chain of Thought?",
              options: ["It produces shorter answers", "It allows the model to explore multiple reasoning paths and self-correct", "It requires fewer tokens"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module4',
      sectionTitle: 'Module 4: Retrieval-Augmented Generation (RAG)',
      lessons: [
        {
          id: 208,
          title: 'Grounding LLMs with Vector Search',
          duration: '15 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>LLMs are frozen in time and lack access to private corporate databases. Retrieval-Augmented Generation (RAG) bridges this gap by searching external files and injecting relevant snippets directly into the prompt context.</p>
              <h4 class="text-xl font-bold text-slate-900">RAG Pipeline Steps</h4>
              <ol class="list-decimal pl-5 space-y-3">
                <li><strong>Document Ingestion:</strong> Parsing text files and splitting them into small, coherent "chunks."</li>
                <li><strong>Embeddings Generation:</strong> Using an embedding model to convert text chunks into high-dimensional vectors representing semantic meaning.</li>
                <li><strong>Vector Database Storage:</strong> Storing vectors in specialized databases (e.g., Pinecone, Chroma, pgvector).</li>
                <li><strong>Semantic Retrieval:</strong> Converting the user's query into a vector, searching the vector db for the most similar chunks, and appending them to the prompt.</li>
              </ol>
            </div>
          `
        },
        {
          id: 209,
          title: 'Module 4 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is the primary purpose of RAG?",
              options: ["To ground LLMs in external, up-to-date, or private documents to reduce hallucinations", "To retrain the base weights of the model", "To replace prompt engineering"],
              correctAnswer: 0
            },
            {
              question: "How are text passages represented in a vector database for semantic search?",
              options: ["As raw string keys", "As high-dimensional numerical vectors called embeddings", "As binary search trees"],
              correctAnswer: 1
            },
            {
              question: "What does 'chunking' refer to in document ingestion?",
              options: ["Deleting old files", "Splitting large text documents into smaller, coherent segments for retrieval", "Combining documents of different file formats"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module5',
      sectionTitle: 'Module 5: AI Agents & Tool Use',
      lessons: [
        {
          id: 210,
          title: 'Autonomous Multi-Agent Systems',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>AI Agents are autonomous systems that leverage LLMs as their central planner to make decisions, execute actions, call APIs, and collaborate to solve complex goals.</p>
              <h4 class="text-xl font-bold text-slate-900">Agentic Architecture</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Planning:</strong> Deconstructing large tasks into sub-tasks, reflecting on previous attempts, and correcting mistakes.</li>
                <li><strong>Memory:</strong> Short-term memory (chat history) and long-term memory (vector storage for past interactions).</li>
                <li><strong>Tools:</strong> External APIs, web browsers, calculators, or Python runtimes that the agent can choose to execute.</li>
              </ul>
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h5 class="font-bold text-slate-900 mb-2">Function Calling</h5>
                <p>Most agent frameworks rely on the LLM's capacity to output a structured JSON structure representing a function name and arguments, which the host system then executes and feeds back to the model.</p>
              </div>
            </div>
          `
        },
        {
          id: 211,
          title: 'Module 5 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is 'function calling' in LLMs?",
              options: ["Calling customer support", "The model's ability to output structured JSON arguments to call external APIs or code", "Executing SQL queries directly on the host computer"],
              correctAnswer: 1
            },
            {
              question: "In an agentic system, what does the LLM act as?",
              options: ["The database database", "The central planner/brain that decides which tools to invoke", "The CSS compiler"],
              correctAnswer: 1
            },
            {
              question: "What is a multi-agent system?",
              options: ["A computer with multiple GPUs", "A system where multiple specialized agents collaborate and communicate to solve a task", "A single agent running multiple threads"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module6',
      sectionTitle: 'Module 6: Fine-Tuning & Custom LLMs',
      lessons: [
        {
          id: 212,
          title: 'Customizing Base Models',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Fine-tuning involves taking a pre-trained base model (e.g., Llama 3) and training it on a specific dataset to customize its tone, style, output formatting, or specialize it in a domain.</p>
              <h4 class="text-xl font-bold text-slate-900">Fine-Tuning Approaches</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Supervised Fine-Tuning (SFT):</strong> Training on input-output pairs to adjust all weights of the model.</li>
                <li><strong>Parameter-Efficient Fine-Tuning (PEFT / LoRA):</strong> Freezing the base model and training only a small set of adapter layers, saving compute resources and storage space.</li>
                <li><strong>RLHF (Reinforcement Learning from Human Feedback):</strong> Aligning the model with human preferences for safety, helpfulness, and style.</li>
              </ul>
            </div>
          `
        },
        {
          id: 213,
          title: 'Module 6 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is LoRA (Low-Rank Adaptation)?",
              options: ["A hardware cooling system", "A parameter-efficient fine-tuning technique that trains only a small subset of adapter weights", "An algorithm for clustering"],
              correctAnswer: 1
            },
            {
              question: "When is fine-tuning generally preferred over RAG?",
              options: ["When accessing dynamic real-time data", "When modifying the model's tone, style, or specific output formatting", "When data sizes are extremely small"],
              correctAnswer: 1
            },
            {
              question: "What does RLHF stand for?",
              options: ["Real-time Learning with Heuristic Functions", "Reinforcement Learning from Human Feedback", "Robust Linear Hidden Filtering"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'certification',
      sectionTitle: 'Final Certification',
      lessons: [
        {
          id: 214,
          title: 'Final Certification Exam',
          duration: '10 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Which component of the Transformer architecture enables context-aware token calculations?",
              options: ["Recurrent hidden nodes", "Self-Attention mechanism", "Max pooling"],
              correctAnswer: 1
            },
            {
              question: "What unit of processed text roughly corresponds to 4 characters or 0.75 words?",
              options: ["Byte", "Token", "N-gram"],
              correctAnswer: 1
            },
            {
              question: "Few-shot prompting relies on supplying what within the user query prompt?",
              options: ["A dedicated weights matrix", "Several demonstration input/output examples", "A Python compiler environment"],
              correctAnswer: 1
            },
            {
              question: "Which cognitive prompting framework instructs models to outline logical steps before showing answers?",
              options: ["Zero-shot classification", "Chain of Thought (CoT)", "Gradient descent optimization"],
              correctAnswer: 1
            },
            {
              question: "What does semantic retrieval in a RAG system search within a vector database?",
              options: ["Filename extensions", "Text embeddings similar to the query vector", "SQL database index columns"],
              correctAnswer: 1
            },
            {
              question: "In an agentic pipeline, how does the agent submit structured tool arguments?",
              options: ["Writing a text message", "Outputting structural JSON data parsed by the host system", "Modifying base model weights"],
              correctAnswer: 1
            },
            {
              question: "LoRA improves fine-tuning efficiency by doing what?",
              options: ["Doubling GPU memory", "Training only small adapter layers and freezing the base weights", "Deleting half the training dataset"],
              correctAnswer: 1
            },
            {
              question: "RLHF aligns model generation behavior by utilizing what inputs?",
              options: ["Direct web searches", "Human feedback and preference scores", "Raw compiler execution logs"],
              correctAnswer: 1
            },
            {
              question: "To prevent a model from fabricating information (hallucinating) on corporate manuals, you should use:",
              options: ["A high temperature setting", "Retrieval-Augmented Generation (RAG)", "Few-shot translation pairs"],
              correctAnswer: 1
            },
            {
              question: "What parameter dictates the creativity and randomness of the LLM generation process?",
              options: ["Top-K bounds", "Temperature", "Context length"],
              correctAnswer: 1
            }
          ]
        }
      ]
    }
  ],
  'ml-basics': [
    {
      id: 'intro',
      sectionTitle: 'Course Introduction',
      lessons: [
        {
          id: 301,
          title: 'Introduction to Machine Learning',
          duration: '3 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-4 text-slate-700">
              <p class="text-lg font-medium text-slate-900">Welcome to Machine Learning Foundations!</p>
              <p>Machine Learning is the science of programming computers so they can learn from data. By studying mathematical models, statistical algorithms, and neural networks, ML engineers build systems that make predictions, classify information, and uncover hidden structures in massive datasets.</p>
              <p>This foundational course is designed to guide you through supervised learning, regression, classification, deep neural networks, unsupervised clustering, and model validation protocols.</p>
              <div class="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-900 rounded-r-xl">
                <strong>Self-Paced Course:</strong> This curriculum comprises 5 core modules + Intro + Certification. Ensure you pass each Knowledge Check before taking the final exam.
              </div>
            </div>
          `
        }
      ]
    },
    {
      id: 'module1',
      sectionTitle: 'Module 1: Supervised Learning & Regression',
      lessons: [
        {
          id: 302,
          title: 'Foundations of Regression Models',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>In Supervised Learning, the algorithm learns from labeled training data. The model is trained on inputs alongside their corresponding correct target outputs (labels).</p>
              <h4 class="text-xl font-bold text-slate-900">Regression vs. Classification</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Regression:</strong> Predicting a continuous numerical value (e.g., house prices, stock values).</li>
                <li><strong>Classification:</strong> Predicting a categorical class label (e.g., spam vs. ham, cat vs. dog).</li>
              </ul>
              <h4 class="text-xl font-bold text-slate-900">Linear Regression & Gradient Descent</h4>
              <p>Linear Regression models the relationship between dependent and independent variables using a linear equation. To find the optimal coefficients, we use a <strong>Cost Function</strong> (like Mean Squared Error) and apply <strong>Gradient Descent</strong> to iteratively step down the cost curve toward the global minimum.</p>
            </div>
          `
        },
        {
          id: 303,
          title: 'Module 1 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is the goal of Linear Regression?",
              options: ["To partition data points into clusters", "To find the line of best fit that models the relationship between dependent and independent variables", "To classify text into distinct categories"],
              correctAnswer: 1
            },
            {
              question: "What does Gradient Descent do?",
              options: ["Increases the learning rate dynamically", "Iteratively minimizes the cost function by adjusting model parameters", "Trains decision trees recursively"],
              correctAnswer: 1
            },
            {
              question: "Logistic Regression is primarily used for what type of task?",
              options: ["Regression", "Clustering", "Classification"],
              correctAnswer: 2
            }
          ]
        }
      ]
    },
    {
      id: 'module2',
      sectionTitle: 'Module 2: Classification Algorithms',
      lessons: [
        {
          id: 304,
          title: 'Exploring Classifiers',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Classification is the task of predicting a discrete class label. Various algorithms offer different trade-offs in interpretability, training speed, and decision boundary complexity.</p>
              <h4 class="text-xl font-bold text-slate-900">Popular Classifiers</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Decision Trees:</strong> Model decisions as tree structures of simple rules (e.g., if age > 30, classify A). Simple to interpret but prone to overfitting.</li>
                <li><strong>Random Forests:</strong> An ensemble method that trains multiple decision trees and averages their votes to reduce overfitting and improve robustness.</li>
                <li><strong>Support Vector Machines (SVM):</strong> Finds the hyperplane that maximizes the margin between classes in feature space. Uses the "kernel trick" to handle non-linearly separable data.</li>
                <li><strong>K-Nearest Neighbors (KNN):</strong> A simple instance-based classifier that assigns a label based on the majority vote of the K nearest data points in the feature space.</li>
              </ul>
            </div>
          `
        },
        {
          id: 305,
          title: 'Module 2 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is a Random Forest?",
              options: ["A single very large decision tree", "An ensemble learning method consisting of multiple decision trees", "A type of unsupervised neural network"],
              correctAnswer: 1
            },
            {
              question: "In SVM, what is a 'kernel trick'?",
              options: ["A method to encrypt classification datasets", "A method to project low-dimensional data into higher dimensions to make it linearly separable", "A technique to remove outliers from dataset"],
              correctAnswer: 1
            },
            {
              question: "How does K-Nearest Neighbors classify a new data point?",
              options: ["By predicting values with linear slopes", "By voting based on the class of its nearest neighbors in feature space", "By training feed-forward weight adjustments"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module3',
      sectionTitle: 'Module 3: Neural Networks & Deep Learning',
      lessons: [
        {
          id: 306,
          title: 'Deep Learning Architectures',
          duration: '12 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Deep Learning is a subset of machine learning inspired by the structure and function of the biological human brain, utilizing artificial neural networks with many hidden layers.</p>
              <h4 class="text-xl font-bold text-slate-900">Neural Network Mechanics</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Perceptron:</strong> The basic artificial neuron that takes weighted inputs, sums them, applies an activation function, and outputs a signal.</li>
                <li><strong>Activation Functions:</strong> Introduce non-linearity into the network, enabling it to learn complex, non-linear relationships. Popular choices include <em>ReLU</em> (Rectified Linear Unit), <em>Sigmoid</em>, and <em>Tanh</em>.</li>
                <li><strong>Backpropagation:</strong> The optimization algorithm that calculates the gradients of the loss function with respect to the network weights, moving backwards from the output to the input layer to update weights.</li>
              </ul>
            </div>
          `
        },
        {
          id: 307,
          title: 'Module 3 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Why are activation functions like ReLU used in neural networks?",
              options: ["To speed up document indexing", "To introduce non-linearity, allowing the network to learn complex patterns", "To automatically regularize weights to zero"],
              correctAnswer: 1
            },
            {
              question: "What is backpropagation?",
              options: ["A method to retrieve backup datasets", "The algorithm used to calculate gradients of the loss function to update neural network weights", "A type of unsupervised dimensionality reduction"],
              correctAnswer: 1
            },
            {
              question: "What is a hidden layer in a neural network?",
              options: ["A layer of code that is commented out", "A layer of neurons between the input layer and the output layer", "A database table that is hidden from public APIs"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module4',
      sectionTitle: 'Module 4: Unsupervised Learning',
      lessons: [
        {
          id: 308,
          title: 'Clustering and Dimensionality Reduction',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Unsupervised learning deals with unlabeled training data. The model must analyze patterns, structures, and groupings on its own without predefined target outputs.</p>
              <h4 class="text-xl font-bold text-slate-900">Core Techniques</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Clustering (K-Means):</strong> Automatically groups data points into K clusters based on Euclidean distance to cluster centers (centroids).</li>
                <li><strong>Dimensionality Reduction (PCA):</strong> Principal Component Analysis projects high-dimensional data into a lower-dimensional subspace, preserving as much variance as possible while removing noise.</li>
                <li><strong>Anomaly Detection:</strong> Identifying rare events or observations that differ significantly from the majority of the data.</li>
              </ul>
            </div>
          `
        },
        {
          id: 309,
          title: 'Module 4 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is the main objective of K-Means Clustering?",
              options: ["To map data points to linear equations", "To partition data points into K clusters based on similarity/distance", "To evaluate model precision scores"],
              correctAnswer: 1
            },
            {
              question: "What is PCA used for?",
              options: ["Splitting data into training and test folds", "Dimensionality reduction and feature extraction while preserving variance", "Regularizing linear weights"],
              correctAnswer: 1
            },
            {
              question: "Unsupervised learning is characterized by what?",
              options: ["High learning rates", "Training models on unlabeled data", "Human-in-the-loop annotations"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'module5',
      sectionTitle: 'Module 5: Model Evaluation & Validation',
      lessons: [
        {
          id: 310,
          title: 'Metrics and Performance Verification',
          duration: '10 min read',
          type: 'notes',
          status: 'unlocked',
          content: `
            <div class="space-y-6 text-slate-700">
              <p>Building a model is only half the battle. You must evaluate how well it generalizes to unseen, real-world data.</p>
              <h4 class="text-xl font-bold text-slate-900">Key Metrics & Pitfalls</h4>
              <ul class="list-disc pl-5 space-y-3">
                <li><strong>Overfitting vs. Underfitting:</strong> Overfitting occurs when the model learns training noise (high variance); underfitting occurs when the model is too simple (high bias).</li>
                <li><strong>Cross-Validation:</strong> Splitting data into K folds, training on K-1 folds, and validating on the remaining fold, repeating this K times to get a stable estimate.</li>
                <li><strong>Evaluation Metrics:</strong> Precision (TP / (TP + FP)), Recall (TP / (TP + FN)), F1-Score (harmonic mean of precision and recall), and ROC-AUC curve analysis.</li>
              </ul>
            </div>
          `
        },
        {
          id: 311,
          title: 'Module 5 Knowledge Check',
          duration: '3 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "What is overfitting?",
              options: ["When model takes too long to train", "When a model performs extremely well on training data but poorly on unseen test data", "When cost functions explode toward infinity"],
              correctAnswer: 1
            },
            {
              question: "In binary classification, what does 'Recall' measure?",
              options: ["The speed of database reads", "The proportion of actual positives that were correctly identified", "The correlation of variables"],
              correctAnswer: 1
            },
            {
              question: "What is cross-validation?",
              options: ["Hashing passwords securely", "A technique to evaluate model generalization by partitioning data into multiple training/test folds", "Deploying models in containerized pods"],
              correctAnswer: 1
            }
          ]
        }
      ]
    },
    {
      id: 'certification',
      sectionTitle: 'Final Certification',
      lessons: [
        {
          id: 312,
          title: 'Final Certification Exam',
          duration: '10 Questions',
          type: 'quiz',
          status: 'unlocked',
          questions: [
            {
              question: "Supervised machine learning algorithms learn using what kind of training data?",
              options: ["Unlabeled raw inputs", "Labeled dataset inputs with target outputs", "High-frequency audio data only"],
              correctAnswer: 1
            },
            {
              question: "Which of the following optimization techniques is used to iteratively minimize a model's cost function?",
              options: ["Principal Component Analysis (PCA)", "Gradient Descent", "Cross-Validation"],
              correctAnswer: 1
            },
            {
              question: "What type of ML task aims to predict discrete class labels?",
              options: ["Regression", "Classification", "Dimensionality reduction"],
              correctAnswer: 1
            },
            {
              question: "Which ensemble algorithm uses votes from multiple decision trees to produce predictions?",
              options: ["Linear Support Hyperplane", "Random Forest", "K-Means Centroid"],
              correctAnswer: 1
            },
            {
              question: "How does the Support Vector Machine (SVM) handle datasets that are not linearly separable?",
              options: ["By setting learning rates to zero", "By projecting features into higher dimensions using the kernel trick", "By executing PCA iterations"],
              correctAnswer: 1
            },
            {
              question: "Which neural network activation function outputs values in the range [0, 1] representing probabilities?",
              options: ["ReLU", "Sigmoid", "Linear pass"],
              correctAnswer: 1
            },
            {
              question: "What is the name of the core learning algorithm that propagates errors backward to update weights?",
              options: ["PCA projection", "Backpropagation", "Gradient accentuation"],
              correctAnswer: 1
            },
            {
              question: "In K-Means clustering, what does 'K' represent?",
              options: ["The dimensionality of the dataset features", "The target number of partition clusters", "The learning rate divisor coefficient"],
              correctAnswer: 1
            },
            {
              question: "When a model fits the training set extremely well but does not generalize to new test data, it is said to be:",
              options: ["Underfitting", "Overfitting", "Anomalous"],
              correctAnswer: 1
            },
            {
              question: "Which evaluation metric represents the harmonic mean of precision and recall?",
              options: ["ROC area under curve", "F1-Score", "Mean Squared Error"],
              correctAnswer: 1
            }
          ]
        }
      ]
    }
  ]
};


export default function ELearningModule() {
  // STATE
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'unenrolled' | 'enrolling' | 'enrolled'>('unenrolled');
  const [coursesList, setCoursesList] = useState(availableCourses);
  
  const [activeLessonId, setActiveLessonId] = useState(101);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);

  // Fetch backend E-Learning modules created in admin
  useEffect(() => {
    const fetchELearningCourses = async () => {
      try {
        const response = await api.get('api/trainings/all?type=elearning');
        const items = response.data?.data || response.data || [];
        if (Array.isArray(items) && items.length > 0) {
          const mapped = items.map((item: any, idx: number) => {
            const themes = ['brand', 'emerald', 'blue'];
            const icons = [FaChartLine, FaBrain, FaNetworkWired];
            return {
              id: item.slug || item.id?.toString() || `elearning-${idx}`,
              title: item.name || 'Untitled E-Learning Module',
              description: item.description || 'Comprehensive E-learning module with interactive lessons and assessment.',
              extendedDescription: item.description || 'Master this module with a hands-on approach, practical guidance, and certification.',
              modules: item.sub_modules ? item.sub_modules.split('\n').filter(Boolean).length : 4,
              duration: item.duration || '2h 30m',
              icon: icons[idx % icons.length],
              theme: themes[idx % themes.length],
              price: 'Free'
            };
          });
          setCoursesList([...mapped, ...availableCourses.filter(ac => !mapped.some(m => m.id === ac.id))]);
        }
      } catch (err) {
        console.error('Failed to fetch backend E-learning modules:', err);
      }
    };
    fetchELearningCourses();
  }, []);
  
  // Quiz states
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [certName, setCertName] = useState("");
  const [isCertGenerated, setIsCertGenerated] = useState(false);

  // Enrollment detailed states
  const [enrollFormSubmitted, setEnrollFormSubmitted] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [enrollFormData, setEnrollFormData] = useState({
    fullName: '',
    gender: '',
    companyName: '',
    phone: '',
    email: '',
    country: 'Singapore'
  });

  // Dynamic certificate scaling ref & observer
  const certContainerRef = useRef<HTMLDivElement>(null);
  const [certScale, setCertScale] = useState(1);

  useEffect(() => {
    if (!certContainerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const parentWidth = entry.contentRect.width;
        const certWidth = 650;
        if (parentWidth < certWidth) {
          setCertScale(parentWidth / certWidth);
        } else {
          setCertScale(1);
        }
      }
    });
    resizeObserver.observe(certContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [isCertGenerated]);
  
  // Accordion state for player
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['intro']);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const selectedCourse = coursesList.find(c => c.id === selectedCourseId) || coursesList[0];
  const currentCurriculum = courseCurriculums[selectedCourse.id] || courseCurriculums['ai-productivity'];
  const allLessons = currentCurriculum.flatMap(section => section.lessons);
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const currentQuestions = courseQuestions[activeLessonId] || activeLesson.questions || [];
  const isFinalExam = allLessons.length > 0 && activeLessonId === allLessons[allLessons.length - 1].id;
  const passingPercentage = selectedCourse.id === 'basic-ai' ? 0.8 : 0.6;
  const passingScoreRequired = Math.ceil(currentQuestions.length * passingPercentage);
  
  const progressPercentage = allLessons.length > 0 
    ? Math.round((completedLessonIds.length / allLessons.length) * 100) 
    : 0;

  const isLessonLocked = (lessonId: number) => {
    const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex <= 0) return false;
    for (let i = 0; i < lessonIndex; i++) {
      if (!completedLessonIds.includes(allLessons[i].id)) {
        return true;
      }
    }
    return false;
  };

  // --- HANDLERS ---

  const handleEnrollClick = () => {
    setEnrollmentStatus('enrolling');
    setEnrollFormSubmitted(false);
  };

  const handleSimulateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingForm) return;
    setLoadingForm(true);
    try {
      await api.post('api/certificate/register', {
        full_name: enrollFormData.fullName,
        gender: enrollFormData.gender,
        company_name: enrollFormData.companyName,
        phone: enrollFormData.phone,
        email: enrollFormData.email,
        country: enrollFormData.country
      });
      setEnrollFormSubmitted(true);
      setToastMessage('Success: Registration complete. You may now begin the test!');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setToastMessage(err.response?.data?.message || 'Failed to submit registration. Please check your details and try again.');
    } finally {
      setLoadingForm(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const toggleLessonComplete = () => {
    if (completedLessonIds.includes(activeLessonId)) {
      setCompletedLessonIds(prev => prev.filter(id => id !== activeLessonId));
    } else {
      setCompletedLessonIds(prev => [...prev, activeLessonId]);
    }
  };

  const handleLessonChange = (lessonId: number) => {
    setActiveLessonId(lessonId);
    // reset quiz states
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setQuizScore(0);
    setUserAnswers({});
    setCertName("");
    setIsCertGenerated(false);
    setIsMobileSidebarOpen(false);
  };

  const handleNextLesson = () => {
    if (activeLesson.type === 'quiz' && !isQuizCompleted) {
      setToastMessage("Please complete the Knowledge Check quiz before moving to the next lesson.");
      return;
    }
    // mark current as complete
    if (!completedLessonIds.includes(activeLessonId)) {
      setCompletedLessonIds(prev => [...prev, activeLessonId]);
    }
    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex < allLessons.length - 1) {
      handleLessonChange(allLessons[currentIndex + 1].id);
      
      // Expand the topic of the new lesson
      const nextLesson = allLessons[currentIndex + 1];
      const nextTopic = currentCurriculum.find(section => section.lessons.some(l => l.id === nextLesson.id));
      if (nextTopic && !expandedTopics.includes(nextTopic.id)) {
        setExpandedTopics(prev => [...prev, nextTopic.id]);
      }
    }
  };

  const handleQuizNextQuestion = () => {
    if (selectedAnswer === null) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedAnswer
    }));

    if (selectedAnswer === currentQuestions[currentQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsQuizCompleted(true);
      if (!completedLessonIds.includes(activeLessonId)) {
         setCompletedLessonIds(prev => [...prev, activeLessonId]);
      }
    }
  };

  // --- VIEWS ---

  // VIEW 0: COURSE LIST (If none selected)
  if (!selectedCourseId) {
    return (
      <div className="py-8 relative overflow-hidden bg-transparent text-slate-900 w-full animate-fade-in-up">
        <div className="relative z-10 w-full">
          <div className="flex flex-col gap-4">
            {coursesList.map((course) => (
              <div 
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id);
                  setEnrollmentStatus('unenrolled');
                }}
                className="group cursor-pointer bg-transparent rounded-[24px] border border-slate-200 p-6 sm:p-8 hover:shadow-lg hover:border-brand-200 transition-all duration-300 transform flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">{course.title}</h3>
                  <p className="text-slate-600 text-base mb-5 leading-relaxed">{course.description}</p>
                  <div className="flex items-center gap-6 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-2"><FaLayerGroup className="text-slate-400" /> {course.modules} Topics</span>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <div className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-center transition-colors border border-brand-200 text-brand-600 group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent">
                    View Details
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 1: COURSE DETAILS (Image 1)
  if (enrollmentStatus === 'unenrolled') {
    return (
      <div className="w-full bg-white text-slate-900 animate-fade-in-up relative z-10 p-4 md:p-8">
        <button 
          onClick={() => setSelectedCourseId(null)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-500 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Courses
        </button>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Content */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif text-[#4A5568] mb-6">{selectedCourse.title}</h1>
            <div className="text-sm text-slate-600 space-y-4 mb-12">
              <p>{selectedCourse.description}</p>
              <p>{selectedCourse.extendedDescription}</p>
              <p>Course content will be available for students at course enrollment and students are able to complete the lessons in a self-paced manner. To complete a lesson, you need to undertake a quiz and score more than 50% (60% on the final exam). You will receive a certificate of completion at the end of this course.</p>
            </div>

            <div className="bg-[#FAF8F5] p-6 md:p-10 rounded-xl border border-gray-100">
              <h2 className="text-2xl font-serif text-[#4A5568] mb-6">Course curriculum</h2>
              <div className="flex flex-col gap-1">
                {currentCurriculum.map((section) => (
                  <div key={section.id} className="border-b border-gray-300 py-4 px-2 hover:bg-gray-50 transition-colors cursor-pointer">
                    <span className="text-[#4A5568] font-medium">{section.sectionTitle}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-16 bg-[#FAF8F5] p-6 md:p-10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-serif text-[#4A5568] max-w-sm leading-tight">
                Discover your potential, starting today
              </h2>
              <button 
                onClick={handleEnrollClick}
                className="px-8 py-3 rounded-full border border-gray-400 font-medium hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-colors whitespace-nowrap"
              >
                Enroll Now
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0">
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden sticky top-24">
              <div className={`h-[200px] flex flex-col items-center justify-center p-6 text-center text-white relative bg-gradient-to-br ${selectedCourse.theme === 'emerald' ? 'from-emerald-900 to-slate-900' : selectedCourse.theme === 'blue' ? 'from-blue-900 to-slate-900' : 'from-brand-900 to-slate-900'}`}>
                <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest border border-white/30 px-2 py-1 rounded">AIXX</div>
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                <selectedCourse.icon className="text-5xl text-brand-400 mb-3 drop-shadow-md z-10" />
                <h3 className="font-bold text-lg leading-tight text-white z-10">{selectedCourse.title}</h3>
              </div>
              
              <div className="p-6">
                <h4 className="text-lg font-serif text-[#4A5568] border-b border-gray-200 pb-2 mb-4">About this course</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="font-bold text-lg">$</span> 
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <FaBookOpen className="text-lg text-gray-400" /> 
                    <span className="font-medium">{allLessons.length} Lessons</span>
                  </div>
                </div>
                <button 
                  onClick={handleEnrollClick}
                  className="w-full mt-6 py-3 bg-brand-500 text-white font-bold rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: ENROLLMENT FORM (Image 2)
  if (enrollmentStatus === 'enrolling') {
    if (enrollFormSubmitted) {
      return (
        <div className="w-full bg-white text-slate-900 animate-fade-in-up p-6 md:p-12 max-w-xl mx-auto border border-gray-100 rounded-2xl shadow-lg mt-8 text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-sm">
            <FaCheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">Access Link Dispatched!</h3>
          <p className="text-slate-600 text-sm max-w-md leading-relaxed">
            Thank you, <strong className="text-slate-900">{enrollFormData.fullName}</strong>. We have sent a unique test access link to your email <strong className="text-slate-900">{enrollFormData.email}</strong>.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 text-left w-full space-y-1">
            <h5 className="font-bold text-slate-700 mb-1">Simulated Link Details:</h5>
            <p>• Access Link: <span className="text-blue-600 font-mono">https://aixx.com.sg/ai-certificate/test?token=AIXX-DEMO</span></p>
            <p>• Verification: Sent to {enrollFormData.email} (Handphone: {enrollFormData.phone})</p>
          </div>
          <button 
            onClick={() => {
              setEnrollmentStatus('enrolled');
              setEnrollFormSubmitted(false);
              // Set active lesson to the first lesson of this course's curriculum
              const firstLessonId = currentCurriculum[0]?.lessons[0]?.id || 101;
              setActiveLessonId(firstLessonId);
              // Expand the first topic
              const firstTopicId = currentCurriculum[0]?.id || 'intro';
              setExpandedTopics([firstTopicId]);
              // Clear completed lessons
              setCompletedLessonIds([]);
              // Set the certificate name to the entered full name automatically!
              setCertName(enrollFormData.fullName);
            }}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors text-sm uppercase tracking-wider"
          >
            Start Test / Course Now
          </button>
        </div>
      );
    }

    return (
      <div className="w-full bg-white text-slate-900 animate-fade-in-up p-4 md:p-8 max-w-5xl mx-auto border border-gray-100 rounded-2xl shadow-sm mt-8">
        <button 
          onClick={() => setEnrollmentStatus('unenrolled')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-500 mb-8 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Left: Product Summary */}
          <div className="flex-1">
            <div className={`h-[250px] md:h-[300px] flex flex-col items-center justify-center p-6 text-center text-white relative rounded-xl mb-6 shadow-xl overflow-hidden bg-gradient-to-br ${selectedCourse.theme === 'emerald' ? 'from-emerald-900 to-slate-900' : selectedCourse.theme === 'blue' ? 'from-blue-900 to-slate-900' : 'from-brand-900 to-slate-900'}`}>
                <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest border border-white/30 px-2 py-1 rounded z-10">AIXX</div>
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                <selectedCourse.icon className="text-6xl text-brand-400 mb-5 drop-shadow-lg z-10" />
                <h3 className="font-bold text-2xl md:text-3xl leading-tight text-white z-10 max-w-[80%]">{selectedCourse.title}</h3>
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{selectedCourse.title}</h2>
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
              <span className="text-slate-600 font-medium">Free</span>
              <span className="font-bold text-slate-900">$0.00</span>
            </div>
            <p className="text-center text-sm text-slate-500 mt-8">
              Need help placing your order? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>
            </p>
          </div>

          {/* Right: Detailed Registration Form */}
          <div className="flex-1 max-w-md w-full mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif text-[#4A5568] mb-6">Enroll in course</h2>
            
            <form onSubmit={handleSimulateSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  value={enrollFormData.fullName}
                  onChange={(e) => setEnrollFormData({...enrollFormData, fullName: e.target.value})}
                  placeholder="Full Name" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Gender <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    value={enrollFormData.gender}
                    onChange={(e) => setEnrollFormData({...enrollFormData, gender: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Company Name <span className="text-red-500">*</span></label>
                  <input 
                    required 
                    type="text" 
                    value={enrollFormData.companyName}
                    onChange={(e) => setEnrollFormData({...enrollFormData, companyName: e.target.value})}
                    placeholder="Company Name" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all">
                  <select
                    value={enrollFormData.country}
                    onChange={(e) => setEnrollFormData({...enrollFormData, country: e.target.value})}
                    className="bg-slate-50 px-3 border-r border-gray-200 text-xs font-semibold text-slate-700 outline-none cursor-pointer max-w-[120px]"
                  >
                    {countryPhoneCodes.map((item) => (
                      <option key={item.country} value={item.country}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    required 
                    type="tel" 
                    value={enrollFormData.phone}
                    onChange={(e) => setEnrollFormData({...enrollFormData, phone: e.target.value})}
                    placeholder="Mobile Number" 
                    className="w-full px-4 py-2.5 bg-transparent outline-none text-slate-900 text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="email" 
                  value={enrollFormData.email}
                  onChange={(e) => setEnrollFormData({...enrollFormData, email: e.target.value})}
                  placeholder="johndoe@email.com" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Country <span className="text-red-500">*</span></label>
                <select 
                  required 
                  value={enrollFormData.country}
                  onChange={(e) => setEnrollFormData({...enrollFormData, country: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-slate-900 appearance-none cursor-pointer"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loadingForm}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md transition-colors mt-6 flex justify-center items-center text-sm uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loadingForm ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Enroll & Request Test Link"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3: LEARNING PLAYER (Image 3)
  return (
    <>
    <div className="flex flex-col md:flex-row h-[680px] sm:h-[750px] md:h-[85vh] min-h-[500px] md:min-h-[750px] w-full bg-gray-100 border border-gray-300 rounded-xl overflow-hidden shadow-xl z-20 animate-fade-in-up my-4 relative">
      
      {/* Sidebar Navigation */}
      <div className={`w-full md:w-[320px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-30 ${isMobileSidebarOpen ? 'absolute inset-0 md:relative md:flex' : 'hidden md:flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-[#191E42] flex justify-center items-center h-[52px]">
           <div className="bg-white p-1 rounded-sm shadow-sm"><span className="font-bold text-[#242A56] text-[10px] tracking-widest">AIXX</span></div>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => {
                setEnrollmentStatus('unenrolled');
              }}
              className="text-xs text-gray-500 font-semibold hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <FaArrowLeft size={10}/> Go to Dashboard
            </button>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-xs text-slate-500 hover:text-slate-700 font-bold border border-slate-200 px-2 py-1 rounded"
              title="Close menu"
            >
              ✕ Close
            </button>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">{selectedCourse.title}</h2>
          
          <div className="mb-2">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-gray-600 tracking-wider uppercase">{progressPercentage}% complete</p>
        </div>
        
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <input 
            type="text" 
            placeholder="Search by lesson title" 
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-brand-500 shadow-inner"
          />
        </div>

        {/* Accordion Topics */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
          {currentCurriculum.map((topic) => {
            const isExpanded = expandedTopics.includes(topic.id);
            const topicCompletedLessons = topic.lessons.filter(l => completedLessonIds.includes(l.id)).length;
            const isTopicCompleted = topicCompletedLessons === topic.lessons.length && topic.lessons.length > 0;

            return (
              <div key={topic.id} className="border-b border-gray-200 last:border-b-0 bg-white">
                <button 
                  onClick={() => toggleTopic(topic.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${isTopicCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'border-gray-300'}`}>
                      {isTopicCompleted && <FaCheck size={10} />}
                    </div>
                    <span className="font-bold text-xs text-slate-800 pr-2">{topic.sectionTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-gray-500">{topicCompletedLessons}/{topic.lessons.length}</span>
                    <span className={`transform transition-transform text-gray-400 text-[10px] ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="bg-gray-50 flex flex-col">
                    {topic.lessons.map(lesson => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      
                      const isLocked = isLessonLocked(lesson.id);
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (isLocked) {
                              setToastMessage("Please complete the preceding lessons and quizzes before moving forward.");
                              return;
                            }
                            handleLessonChange(lesson.id);
                          }}
                          className={`w-full text-left pl-[44px] pr-4 py-3.5 flex gap-3 transition-colors relative border-t border-gray-100 ${
                            isActive ? 'bg-gray-200/50 shadow-inner' : 'hover:bg-gray-100'
                          } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {/* Active indicator line */}
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                          
                          <div className={`mt-[3px] shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                              : isLocked 
                                ? 'border-gray-200 bg-gray-100 text-gray-400' 
                                : 'border-gray-300'
                          }`}>
                            {isCompleted ? <FaCheck size={7} /> : isLocked ? <FaLock size={7} /> : null}
                          </div>
                          
                          <div className="flex-1">
                            <h5 className={`text-xs ${isActive ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{lesson.title}</h5>
                            <div className="flex items-center gap-1.5 text-[9px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                              {lesson.type === 'notes' ? <FaFileAlt size={9} /> : lesson.type === 'video' ? <FaPlay size={7} /> : <FaCheckCircle size={9} />}
                              {lesson.duration}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col h-full relative overflow-hidden">
        {/* Top bar */}
        <div className="h-[52px] border-b border-gray-200 flex justify-between items-center px-4 md:px-6 bg-white shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 text-[#191E42]"
              title="Open course menu"
            >
              <span className="text-sm font-bold mr-1">☰</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Menu</span>
            </button>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[150px] sm:max-w-xs">{activeLesson.title}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar relative">
          <div className="max-w-3xl mx-auto pb-28">
            {activeLesson.type === 'notes' ? (
              <div className="animate-fade-in-up">
                <div className={`rounded-xl overflow-hidden mb-6 shadow-md flex items-center justify-center p-6 h-28 md:h-36 relative border border-gray-100 bg-gradient-to-br ${selectedCourse.theme === 'emerald' ? 'from-emerald-900 to-slate-900' : selectedCourse.theme === 'blue' ? 'from-blue-900 to-slate-900' : 'from-brand-900 to-slate-900'}`}>
                   <div className="absolute top-4 right-4 border border-white/20 text-white/80 text-[9px] uppercase px-2 py-0.5 tracking-widest rounded shadow-sm z-20">AIXX</div>
                   <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                   <div className="text-center text-white relative z-10 flex items-center gap-4 justify-center">
                     <selectedCourse.icon className="text-3xl md:text-4xl text-brand-400 drop-shadow-lg" />
                     <h2 className="text-xl md:text-2xl font-bold leading-tight text-white">{selectedCourse.title}</h2>
                   </div>
                   <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
                </div>
                
                <h3 className="text-2xl font-serif text-slate-900 mb-6 border-b border-gray-100 pb-4">{activeLesson.title}</h3>
                <div 
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: activeLesson.content || '' }} 
                />
              </div>
            ) : activeLesson.type === 'video' ? (
               <div className="animate-fade-in-up flex flex-col items-center justify-center h-full min-h-[400px]">
                 <div className="w-full max-w-3xl aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white shadow-2xl relative overflow-hidden group border border-slate-700">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                   <button className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(var(--brand-500),0.6)] z-20">
                     <FaPlay className="text-xl ml-1" />
                   </button>
                   <p className="absolute bottom-6 left-6 z-20 font-bold tracking-wide drop-shadow-md">{activeLesson.title}</p>
                 </div>
               </div>
            ) : (
               <div className="animate-fade-in-up bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  {isQuizCompleted ? (
                    isFinalExam ? (
                      quizScore >= passingScoreRequired ? (
                        !isCertGenerated ? (
                          <div className="flex flex-col items-center justify-center text-center py-8 w-full max-w-md mx-auto animate-fade-in-up">
                            <FaTrophy className="text-6xl text-yellow-500 mb-6 animate-bounce" />
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Final Exam Passed!</h3>
                            
                            <div className="flex gap-4 justify-center items-center mb-6">
                              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                                <div className="text-xs text-emerald-800 font-semibold uppercase">Correct</div>
                                <div className="text-xl font-bold text-emerald-600">{quizScore}</div>
                              </div>
                              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
                                <div className="text-xs text-slate-800 font-semibold uppercase">Total</div>
                                <div className="text-xl font-bold text-slate-700">{currentQuestions.length}</div>
                              </div>
                            </div>

                            <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium">
                              Congratulations on completing the curriculum requirements for <strong>{selectedCourse.title}</strong>! Enter your full name below to claim your official certification.
                            </p>
                            <div className="w-full space-y-4">
                              <input 
                                type="text" 
                                value={certName}
                                onChange={(e) => setCertName(e.target.value)}
                                placeholder="Enter your name for the certificate" 
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold text-center text-base"
                              />
                              <button 
                                onClick={() => {
                                  if (!certName.trim()) {
                                    setToastMessage("Please enter your name to generate your certificate.");
                                    return;
                                  }
                                  setIsCertGenerated(true);
                                }}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors text-sm uppercase tracking-wider"
                              >
                                Generate Certificate
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 w-full animate-fade-in-up">
                            
                            {/* Dynamically scaled container for mobile responsiveness */}
                            <div ref={certContainerRef} className="w-full flex justify-center items-start overflow-hidden py-4">
                              <div 
                                style={{ 
                                  width: '650px', 
                                  height: `${460 * certScale}px`,
                                  overflow: 'hidden',
                                }}
                                className="flex justify-center items-start transition-all duration-300"
                              >
                                <div 
                                  style={{ 
                                    width: '650px', 
                                    height: '460px',
                                    transform: `scale(${certScale})`,
                                    transformOrigin: 'top center',
                                  }}
                                  className="shrink-0"
                                >
                                  {/* Printable Certificate Frame */}
                                  <div id="aixx-certificate" className="w-full h-full bg-[#FDFBF7] p-8 md:p-10 rounded-lg border-[10px] border-double border-slate-800 shadow-xl relative flex flex-col justify-between text-center font-serif">
                                    
                                    {/* Decorative corner blocks */}
                                    <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-slate-500"></div>
                                    <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-slate-500"></div>
                                    <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-slate-500"></div>
                                    <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-slate-500"></div>
                                    
                                    {/* Background watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
                                      <span className="text-[100px] font-bold tracking-widest font-sans">AIXX</span>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative z-10 space-y-4 flex flex-col justify-between h-full">
                                      
                                      {/* Certificate Header */}
                                      <div className="space-y-1">
                                        <div className="text-[10px] font-sans font-bold tracking-[0.3em] text-[#191E42] uppercase">AIXX Academy & Intelligence Systems</div>
                                        <div className="w-12 h-[2px] bg-emerald-500 mx-auto"></div>
                                      </div>
                                      
                                      {/* Main Certificate Title */}
                                      <div className="space-y-1">
                                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-wide text-slate-800 font-serif italic">Certificate of Completion</h2>
                                        <p className="text-[10px] font-sans text-slate-500 uppercase tracking-widest">This is proudly presented to</p>
                                      </div>
                                      
                                      {/* Student Name */}
                                      <div>
                                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#191E42] underline decoration-emerald-500/30 underline-offset-8 font-serif">{certName}</h1>
                                      </div>
                                      
                                      {/* Course completion message */}
                                      <div className="max-w-md mx-auto space-y-1">
                                        <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-sans">
                                          for successfully demonstrating mastery and completing all requirements for the professional curriculum in
                                        </p>
                                        <h3 className="text-base md:text-lg font-bold text-slate-800 uppercase tracking-wide font-sans">{selectedCourse.title}</h3>
                                      </div>
                                      
                                      {/* Signatures & Date */}
                                      <div className="flex justify-between items-end pt-3 border-t border-slate-200/60 font-sans text-left">
                                        <div className="space-y-0.5">
                                          <div className="text-[10px] font-bold text-slate-800">Date of Issue</div>
                                          <div className="text-[9px] text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        </div>
                                        <div className="w-16 h-16 flex items-center justify-center shrink-0">
                                          {/* Seal Graphic */}
                                          <div className="w-12 h-12 rounded-full border-4 border-double border-emerald-600 flex flex-col items-center justify-center text-[7px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 shadow-inner rotate-12">
                                            <span>AIXX</span>
                                            <span className="text-[5px]">SEAL</span>
                                          </div>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                          <div className="text-[10px] font-bold text-slate-800 italic underline decoration-slate-400">T. S. Viga</div>
                                          <div className="text-[9px] text-slate-500 font-medium">Director, AIXX Training Board</div>
                                        </div>
                                      </div>
                                      
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex gap-4 mt-6 w-full justify-center">
                              <style dangerouslySetInnerHTML={{ __html: `
                                @media print {
                                  #aixx-certificate {
                                    transform: none !important;
                                    margin: 0 !important;
                                    width: 100% !important;
                                    height: auto !important;
                                    aspect-ratio: 1.414/1 !important;
                                  }
                                }
                              `}} />
                              <button 
                                onClick={() => {
                                  window.print();
                                }}
                                className="px-6 py-2 bg-[#191E42] text-white font-semibold rounded-lg shadow hover:bg-slate-800 transition-colors text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse"
                              >
                                Print Certificate
                              </button>
                              <button 
                                onClick={() => {
                                  setIsCertGenerated(false);
                                  setCertName("");
                                }}
                                className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-xs uppercase tracking-wider"
                              >
                                Change Name
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-8 w-full max-w-md mx-auto animate-fade-in-up">
                          <FaTimesCircle className="text-6xl text-red-500 mb-6 animate-pulse" />
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Exam Failed</h3>
                          
                          <div className="flex gap-4 justify-center items-center mb-6">
                            <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-center">
                              <div className="text-xs text-red-800 font-semibold uppercase">Your Score</div>
                              <div className="text-xl font-bold text-red-600">{quizScore} / {currentQuestions.length}</div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
                              <div className="text-xs text-slate-800 font-semibold uppercase">Passing Score</div>
                              <div className="text-xl font-bold text-slate-700">{passingPercentage * 100}% ({passingScoreRequired}/{currentQuestions.length})</div>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium">
                            Unfortunately, you did not reach the passing score required to receive a certificate for <strong>{selectedCourse.title}</strong>. Please review the course materials and try again.
                          </p>
                          
                          <button 
                            onClick={() => handleLessonChange(activeLessonId)}
                            className="w-full py-3 bg-[#191E42] text-white hover:bg-slate-800 font-bold rounded-xl shadow-md transition-colors text-sm uppercase tracking-wider"
                          >
                            Retry Final Exam
                          </button>
                        </div>
                      )
                    ) : (
                      // Regular quiz results view
                      <div className="flex flex-col items-center justify-center text-center py-6 w-full animate-fade-in-up">
                        <FaTrophy className="text-5xl text-yellow-500 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h3>
                        
                        <div className="flex gap-6 justify-center items-center mb-6">
                          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                            <div className="text-xs text-emerald-800 font-semibold uppercase">Correct</div>
                            <div className="text-xl font-bold text-emerald-600">{quizScore}</div>
                          </div>
                          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-center">
                            <div className="text-xs text-red-800 font-semibold uppercase">Incorrect</div>
                            <div className="text-xl font-bold text-red-600">{currentQuestions.length - quizScore}</div>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
                            <div className="text-xs text-slate-800 font-semibold uppercase">Total</div>
                            <div className="text-xl font-bold text-slate-700">{currentQuestions.length}</div>
                          </div>
                        </div>

                        <div className="w-full text-left bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200 mb-6 max-h-[320px] overflow-y-auto custom-scrollbar">
                          <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-wider">Review Questions</h4>
                          <div className="space-y-3">
                            {currentQuestions.map((q, qIdx) => {
                              const userAnsIdx = userAnswers[qIdx];
                              const isCorrect = userAnsIdx === q.correctAnswer;
                              return (
                                <div key={qIdx} className="p-3.5 bg-white rounded-lg border border-slate-200/60 shadow-sm">
                                  <p className="font-bold text-xs md:text-sm text-slate-800 mb-2">
                                    {qIdx + 1}. {q.question}
                                  </p>
                                  <div className="text-[11px] md:text-xs space-y-1">
                                    <p className="flex items-center gap-1.5">
                                      <span className="font-medium text-slate-500">Your Answer:</span>
                                      <span className={isCorrect ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                                        {userAnsIdx !== undefined ? q.options[userAnsIdx] : "Unanswered"}
                                      </span>
                                      {isCorrect ? (
                                        <FaCheck className="text-emerald-500 text-[10px]" />
                                      ) : (
                                        <FaTimesCircle className="text-red-500 text-[10px]" />
                                      )}
                                    </p>
                                    {!isCorrect && (
                                      <p className="text-emerald-700 font-medium flex items-center gap-1.5">
                                        <span className="font-medium text-slate-500">Correct Answer:</span>
                                        <span className="font-semibold">{q.options[q.correctAnswer]}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <button 
                          onClick={handleNextLesson}
                          className="px-8 py-3 bg-emerald-500 text-white font-bold rounded shadow hover:bg-emerald-600 transition-colors w-full sm:w-auto"
                        >
                          Continue to Next Lesson
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="w-full flex flex-col h-full">
                      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                        <h4 className="text-lg md:text-xl font-bold text-slate-900">{activeLesson.title}</h4>
                        <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
                      </div>
                      
                      <div className="mb-8 flex-grow">
                        <h5 className="text-base md:text-lg font-semibold text-slate-800 mb-6 leading-relaxed">
                          {currentQuestionIndex + 1}. {currentQuestions[currentQuestionIndex]?.question}
                        </h5>
                        <div className="space-y-3">
                          {currentQuestions[currentQuestionIndex]?.options.map((option, idx) => {
                            const isSelected = selectedAnswer === idx;
                            
                            let baseClasses = "flex items-center justify-between p-3.5 md:p-4 border rounded-xl transition-all shadow-sm text-sm md:text-base ";
                            
                            if (isSelected) {
                              baseClasses += "border-brand-500 bg-brand-50 text-brand-800";
                            } else {
                              baseClasses += "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50 cursor-pointer group";
                            }
 
                            return (
                              <label key={idx} className={baseClasses}>
                                <div className="flex items-center gap-3 w-full cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name={`q${currentQuestionIndex}`} 
                                    checked={isSelected}
                                    onChange={() => setSelectedAnswer(idx)}
                                    className="text-brand-500 focus:ring-brand-500 w-4 h-4 cursor-pointer" 
                                  />
                                  <span className={`font-medium w-full ${!isSelected ? 'group-hover:text-brand-700' : ''}`}>{option}</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
 
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                        <div className="text-xs text-slate-400 font-semibold italic">Select an answer to proceed</div>
                        <button 
                          onClick={handleQuizNextQuestion}
                          disabled={selectedAnswer === null}
                          className="px-6 py-2.5 bg-[#191E42] text-white font-bold text-sm rounded-xl shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Finish Exam'}
                        </button>
                      </div>
                    </div>
                  )}
               </div>
            )}
          </div>
        </div>
        
        {/* Bottom Actions Bar (Absolute at bottom of content) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white/90 backdrop-blur-sm flex items-center justify-center px-6 shrink-0 z-20 gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleNextLesson}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 w-[160px] shadow-sm"
          >
            CONTINUE <FaArrowRight size={10} />
          </button>
        </div>
        
      </div>
    </div>

    {toastMessage && (
      <>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes toastSlideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-toast { animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}} />
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-800 font-sans font-semibold text-xs md:text-sm flex items-center gap-3 animate-toast max-w-sm">
          {toastMessage.startsWith('Success') ? (
            <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">✓</div>
          ) : (
            <FaTimesCircle className="shrink-0 text-red-500 text-lg md:text-xl" />
          )}
          <span className="flex-1 leading-snug">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-wider pl-2 transition-colors">
            ✕
          </button>
        </div>
      </>
    )}
  </>
  );
}
