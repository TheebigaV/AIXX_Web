export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const courseQuestions: Record<number, QuizQuestion[]> = {
  // --- ENTERPRISE AI & PRODUCTIVITY (100 series) ---
  // Module 1 Quiz (Ecosystem)
  103: [
    {
      question: "Which tool is specifically designed for enterprise-wide integration with Microsoft 365 services?",
      options: ["ChatGPT Free", "Microsoft Copilot", "Midjourney", "Google Gemini Free"],
      correctAnswer: 1
    },
    {
      question: "What does RBAC stand for in enterprise data systems?",
      options: ["Real-time Business Access Control", "Role-Based Access Control", "Responsive Business Automation Center", "Resource-Based Allocation Client"],
      correctAnswer: 1
    },
    {
      question: "Which is a major security guarantee of ChatGPT Enterprise over consumer versions?",
      options: ["It runs twice as fast", "It does not train on customer business data", "It is completely free to use", "It only generates images"],
      correctAnswer: 1
    },
    {
      question: "What is the primary role of a Custom RAG App?",
      options: ["To retrieve internal company files to ground model answers", "To replace human programmers", "To scrape competitor websites", "To check code syntax errors"],
      correctAnswer: 0
    },
    {
      question: "Which component coordinates security permissions for Microsoft Copilot?",
      options: ["Microsoft Graph", "OpenAI API", "Windows Explorer", "Public Web Search Index"],
      correctAnswer: 0
    },
    {
      question: "What does SLA guarantee in enterprise cloud AI services?",
      options: ["Software License Availability", "Service Level Agreement", "System Level Assessment", "Standard Language Architecture"],
      correctAnswer: 1
    },
    {
      question: "Which data classification specifies the highest level of security in enterprise environments?",
      options: ["Public", "Internal-Only", "Confidential / Restricted", "General"],
      correctAnswer: 2
    },
    {
      question: "What is data sovereignty?",
      options: ["The right to copy anyone's data", "Ensuring data is stored and processed according to local regional laws", "Encrypting passwords locally", "Deleting logs every 24 hours"],
      correctAnswer: 1
    },
    {
      question: "Which of the following is NOT an enterprise AI integration strategy?",
      options: ["Role provisioning", "Data classification boundaries", "Allowing employees to upload confidential code to free public tools", "Prompt design training"],
      correctAnswer: 2
    },
    {
      question: "Why do enterprises host their own custom LLMs on AWS/Azure?",
      options: ["To ensure full control over model weights and private logs", "To save on electricity bills", "To get free cloud credits", "Because public endpoints do not support English"],
      correctAnswer: 0
    }
  ],
  // Module 2 Quiz (Workflow)
  105: [
    {
      question: "What is the key benefit of integrating Make or Zapier with AI tools?",
      options: ["Improving model training speed", "Automating triggers and multi-step data pushes across SaaS applications", "Rendering 3D graphics", "Reducing database memory usage"],
      correctAnswer: 1
    },
    {
      question: "In workflow automation, what is a 'Trigger'?",
      options: ["An API error", "An event that initiates an automated workflow", "A visual banner", "A database query"],
      correctAnswer: 1
    },
    {
      question: "Which concept describes connecting systems that lack native direct integrations?",
      options: ["Web Scraping", "Custom API Integrations", "Database Indexing", "Binary Serialization"],
      correctAnswer: 1
    },
    {
      question: "How does AI assist in the triage stage of customer support ticket workflows?",
      options: ["By deleting low-priority emails", "By classifying sentiment, urgency, and routing to the right team", "By answering calls automatically in voice", "By creating new bugs"],
      correctAnswer: 1
    },
    {
      question: "What is a 'human-in-the-loop' safeguard?",
      options: ["Requiring humans to copy code", "Pausing an automated loop for manual review and approval before final execution", "Using CAPTCHAs", "Hiring external testers"],
      correctAnswer: 1
    },
    {
      question: "Which protocol is standard for sending real-time event updates to a listener URL?",
      options: ["SMTP", "Webhooks", "FTP", "SSH"],
      correctAnswer: 1
    },
    {
      question: "What is a major risk of full end-to-end automation without human-in-the-loop controls?",
      options: ["Slower systems", "Hallucinated answers sent directly to customers", "Higher cloud storage costs", "Fewer support emails"],
      correctAnswer: 1
    },
    {
      question: "How can AI optimize document review pipelines?",
      options: ["By printing files automatically", "By scanning, categorizing, and extracting key metadata fields", "By renaming documents to hash values", "By compressing PDF sizes"],
      correctAnswer: 1
    },
    {
      question: "Which type of automation tools require local computer installation and emulate user mouse clicks?",
      options: ["RPA (Robotic Process Automation)", "Headless API triggers", "Database triggers", "Cloud functions"],
      correctAnswer: 0
    },
    {
      question: "What does API stand for in software systems integration?",
      options: ["Application Programming Interface", "Automated Process Integrator", "Access Protocol Identifier", "Analytical Program Instance"],
      correctAnswer: 0
    }
  ],
  // Module 3 Quiz (Governance)
  107: [
    {
      question: "What is a key requirement of GDPR compliance when using third-party AI APIs?",
      options: ["Using only visual tools", "Protecting personally identifiable information (PII) and maintaining data agreements", "Buying enterprise licenses for all citizens", "Using model parameters under 7B"],
      correctAnswer: 1
    },
    {
      question: "What is SOC 2 Type II certification?",
      options: ["A programming language standard", "An audit validating system security, availability, and processing integrity over time", "A graphics rendering standard", "A cloud speed assessment"],
      correctAnswer: 1
    },
    {
      question: "What does DLP stand for in enterprise security configurations?",
      options: ["Database Logging Protocol", "Data Loss Prevention", "Deep Learning Parameters", "Direct License Provisioning"],
      correctAnswer: 1
    },
    {
      question: "Which risk involves an attacker inputting malicious text to override an LLM's system guardrails?",
      options: ["SQL Injection", "Prompt Injection", "Data Leakage", "DNS Spoofing"],
      correctAnswer: 1
    },
    {
      question: "What is the role of an 'AI system prompt' or guardrail?",
      options: ["To format HTML code", "To govern boundaries, prohibited topics, and tone rules for the model", "To calculate billing cost", "To measure inference speed"],
      correctAnswer: 1
    },
    {
      question: "What is the primary function of PII scrubbers?",
      options: ["To delete inactive files", "To strip sensitive elements like SSNs and emails before data is sent to APIs", "To optimize database queries", "To format raw text to bold"],
      correctAnswer: 1
    },
    {
      question: "Which standard governs security controls for medical data applications?",
      options: ["GDPR", "HIPAA", "SOC 1", "ISO 9001"],
      correctAnswer: 1
    },
    {
      question: "What is LLM hallucination?",
      options: ["A hardware breakdown", "A model generating false or factually incorrect information confidently", "An API timeout error", "Overloading network memory"],
      correctAnswer: 1
    },
    {
      question: "What is model data lineage tracking?",
      options: ["Documenting model file sizes", "Tracing the origin, processing, and modification of data used to train or ground AI models", "Graphing prompt completion times", "Measuring parameter layers"],
      correctAnswer: 1
    },
    {
      question: "Which policy defines allowed actions for employees leveraging AI software?",
      options: ["SOC 2 Compliance", "Acceptable Use Policy (AUP)", "Service Level Agreement (SLA)", "NDA Policy"],
      correctAnswer: 1
    }
  ],
  // Module 4 Quiz (ROI)
  109: [
    {
      question: "What is the primary calculation formula for ROI in business investments?",
      options: ["Cost divided by Benefit", "(Net Benefit / Cost) * 100", "Benefit plus Cost", "Yearly Revenue minus Taxes"],
      correctAnswer: 1
    },
    {
      question: "How can businesses measure qualitative AI benefits like 'employee satisfaction'?",
      options: ["By checking CPU server load", "By conducting baseline surveys and comparing attrition rates", "By measuring API tokens consumed", "By counting lines of code written"],
      correctAnswer: 1
    },
    {
      question: "What does TCO stand for in enterprise technology procurement?",
      options: ["Technical Compliance Officer", "Total Cost of Ownership", "Transaction Control Operator", "Terminal Command Output"],
      correctAnswer: 1
    },
    {
      question: "Which cost is typically categorized as an ongoing Operational Expense (OpEx) for AI?",
      options: ["Initial server hardware procurement", "Monthly API token consumption and subscription licenses", "Software architecture designs", "Initial database setups"],
      correctAnswer: 1
    },
    {
      question: "What is Change Management in enterprise AI adoption?",
      options: ["Upgrading system drivers", "Structured frameworks to prepare, support, and train workers during transition to AI tools", "Changing cloud service providers", "Updating Git branches"],
      correctAnswer: 1
    },
    {
      question: "Which metric tracks user adoption of newly deployed AI software?",
      options: ["CPU usage", "Active Daily/Weekly Users (DAU/WAU)", "Total database file sizes", "Number of model parameters"],
      correctAnswer: 1
    },
    {
      question: "What is a pilot program in AI change management?",
      options: ["Flying remote servers", "A small-scale test deployment to collect feedback and validate ROI before company-wide launch", "An automation script", "A system rollback"],
      correctAnswer: 1
    },
    {
      question: "What is the risk of deploying AI tools without user training?",
      options: ["Higher storage space", "Low adoption rates, incorrect prompt usage, and data security risks", "Slower API response speeds", "API license overruns"],
      correctAnswer: 1
    },
    {
      question: "Which is a tangible metric of productivity improvement?",
      options: ["Number of emails sent", "Reduction in average time taken to complete core tasks", "Number of meetings scheduled", "Increase in monitor screen time"],
      correctAnswer: 1
    },
    {
      question: "What is shadow IT in the context of enterprise AI?",
      options: ["Running dark mode software", "Employees using unauthorized, unmonitored public AI apps for work tasks", "A security backup center", "Command line tools"],
      correctAnswer: 1
    }
  ],
  // Final Exam (AI & Productivity)
  110: [
    {
      question: "Which framework is designed to retrieve and ground LLM prompts with private corporate data?",
      options: ["RAG (Retrieval-Augmented Generation)", "RLHF (Reinforcement Learning from Human Feedback)", "Fine-Tuning", "Zero-Shot Prompting"],
      correctAnswer: 0
    },
    {
      question: "What is the key mechanism in Microsoft Copilot that ensures data matches employee access rights?",
      options: ["Microsoft Graph accessing active directory permissions", "Public internet indices", "Storing passwords locally", "Deleting employee cookies"],
      correctAnswer: 0
    },
    {
      question: "Which metric is the best measure of task-level time savings from workflow automation?",
      options: ["Database backup count", "Task duration reduction compared to baseline metrics", "Number of API keys active", "Total network server requests"],
      correctAnswer: 1
    },
    {
      question: "What role do webhooks play in Make or Zapier pipelines?",
      options: ["They serialize database tables", "They push real-time event alerts from a sender platform to trigger a workflow", "They compress images", "They track browser cookies"],
      correctAnswer: 1
    },
    {
      question: "How does Prompt Injection threaten enterprise data security?",
      options: ["It drains network bandwidth", "It manipulates model prompts to extract hidden instructions, system data, or override filters", "It crashes server processors", "It injects malicious SQL statements into backend tables"],
      correctAnswer: 1
    },
    {
      question: "What is the primary function of a PII Scrubber in AI middleware?",
      options: ["To delete temporary browser caches", "To redact names, emails, and SSNs before sending logs to external AI providers", "To format data tables to JSON", "To check server temperature"],
      correctAnswer: 1
    },
    {
      question: "In calculating AI ROI, which of the following is considered an indirect cost?",
      options: ["API subscription seat cost", "Employee time spent on prompt engineering training", "Server hosting credit costs", "Custom UI domain costs"],
      correctAnswer: 1
    },
    {
      question: "Why is human-in-the-loop essential for automating client email replies?",
      options: ["To slow down communication", "To review and confirm facts, preventing hallucinated errors from reaching clients", "To decrease license costs", "To check email headers"],
      correctAnswer: 1
    },
    {
      question: "What is shadow AI?",
      options: ["Developing deep neural networks", "Employees leveraging unapproved external AI services on corporate networks", "A model backup server", "Visual AI tools"],
      correctAnswer: 1
    },
    {
      question: "Which data standard governs the privacy and consent laws for EU citizens?",
      options: ["SOC 2 Type II", "GDPR", "HIPAA", "PCI-DSS"],
      correctAnswer: 1
    }
  ],

  // --- GENERATIVE AI MASTERCLASS (200 series) ---
  // Module 1 Quiz (LLM Architecture)
  203: [
    {
      question: "Which component of the Transformer architecture allows it to process words in relation to all other words in a sentence?",
      options: ["Recurrent Connections", "Self-Attention Mechanism", "Convolutional Pools", "Pooling Layers"],
      correctAnswer: 1
    },
    {
      question: "What is tokenization?",
      options: ["Verifying user passwords", "Converting raw text into numeric sub-word units or tokens", "Compressing model file sizes", "Encrypting API endpoints"],
      correctAnswer: 1
    },
    {
      question: "Which landmark research paper introduced the Transformer model architecture?",
      options: ["Attention Is All You Need", "Deep Residual Learning for Image Recognition", "BERT: Pre-training of Deep Bidirectional Transformers", "ImageNet Classification with Deep Networks"],
      correctAnswer: 0
    },
    {
      question: "What does 'autoregressive' mean in relation to decoder-only LLMs?",
      options: ["Processing images in parallel", "Generating the next word based on all preceding generated words", "Training models in reverse order", "Running multiple model copies at once"],
      correctAnswer: 1
    },
    {
      question: "What is the primary role of the Encoder in sequence-to-sequence models?",
      options: ["To predict the next word", "To read and build a contextual representation of the input text", "To sample from probabilities", "To manage user inputs"],
      correctAnswer: 1
    },
    {
      question: "What is the difference between parameters and tokens?",
      options: ["Tokens are variables; parameters are word units", "Parameters are internal learned weights; tokens are the pieces of text processed", "Parameters are GPU units; tokens are memory registers", "Tokens are model prompts; parameters are target answers"],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of positional embeddings in Transformers?",
      options: ["To store API keys", "To preserve the sequential order information of tokens", "To normalize vector spaces", "To decrease model size"],
      correctAnswer: 1
    },
    {
      question: "Which model family is typified by a decoder-only architecture?",
      options: ["BERT", "GPT", "T5", "ResNet"],
      correctAnswer: 1
    },
    {
      question: "What does LLM stand for?",
      options: ["Logical Language Model", "Large Language Model", "Linear Layer Machine", "Latent Learnable Matrix"],
      correctAnswer: 1
    },
    {
      question: "What is contextual window size?",
      options: ["The browser layout size", "The maximum number of tokens a model can read and write in a single interaction", "The server processing speed", "The number of parameters in a layer"],
      correctAnswer: 1
    }
  ],
  // Module 2 Quiz (Prompt Engineering)
  205: [
    {
      question: "What is Few-Shot Prompting?",
      options: ["Asking questions in few words", "Providing a few concrete input-output examples in the prompt to teach formatting/style", "Training a model for a few epochs", "Running prompts via command line"],
      correctAnswer: 1
    },
    {
      question: "Which prompting technique instructs the model to explain its logical steps step-by-step?",
      options: ["Zero-Shot Prompting", "Chain-of-Thought (CoT)", "Role Play Prompting", "Input Structuring"],
      correctAnswer: 1
    },
    {
      question: "What is the primary benefit of System Prompts?",
      options: ["Faster compute speeds", "Setting global rules, behavioral style, and constraints for the entire session", "Compressing outputs", "Encrypting conversations"],
      correctAnswer: 1
    },
    {
      question: "What is Zero-Shot Prompting?",
      options: ["Providing no examples and asking the model to perform a task directly", "Deleting the context window", "Using a model with zero parameters", "Using a model that cannot read text"],
      correctAnswer: 0
    },
    {
      question: "How does temperature affect LLM completions?",
      options: ["It alters physical server cooling rates", "It controls the random variation/creativity of word selections", "It changes context window size", "It controls the number of API queries per second"],
      correctAnswer: 1
    },
    {
      question: "What is Top-P (nucleus sampling)?",
      options: ["Taking only the top 1 most probable token", "Restricting selection to a cumulative probability threshold pool of tokens", "Calculating parameter counts", "Sorting database queries"],
      correctAnswer: 1
    },
    {
      question: "Which technique is designed to stop model hallucinations?",
      options: ["Increasing model temperature", "Using strict system constraints, grounding data, and factual prompts", "Decreasing parameters", "Removing user role play"],
      correctAnswer: 1
    },
    {
      question: "What is a delimiters' role in prompt writing?",
      options: ["To end a session", "To separate different parts of a prompt (e.g. instructions from input text)", "To translate languages", "To format paragraph spacing"],
      correctAnswer: 1
    },
    {
      question: "Why should prompt structures be consistent?",
      options: ["To prevent memory overflow", "To make it easier for parsing scripts and model structures to match inputs", "To save on local files", "Because models cannot read spaces"],
      correctAnswer: 1
    },
    {
      question: "What is the main goal of iterative prompt testing?",
      options: ["To install different libraries", "To systematically refine system instructions based on output accuracy comparisons", "To calculate server hosting costs", "To format console print logs"],
      correctAnswer: 1
    }
  ],
  // Module 3 Quiz (RAG Systems)
  207: [
    {
      question: "What is the primary problem RAG (Retrieval-Augmented Generation) is designed to solve?",
      options: ["Low image resolution", "Grounding LLMs with current, proprietary, or specific external knowledge bases to prevent hallucinations", "Speeding up CPU clocks", "Fine-tuning base models"],
      correctAnswer: 1
    },
    {
      question: "What is a Vector Embedding?",
      options: ["A compressed zip file", "A high-dimensional numeric representation of text semantic meaning", "A database index key", "A font file formatting style"],
      correctAnswer: 1
    },
    {
      question: "Which component stores vector representations of documents for quick similarity search?",
      options: ["Relational SQL Database", "Vector Database", "Local Cache File", "Git Repository"],
      correctAnswer: 1
    },
    {
      question: "What is 'semantic search'?",
      options: ["Searching by exact letter matches", "Searching by underlying meaning and contextual relationship", "Running searches in alphabetical order", "Filtering records by file size"],
      correctAnswer: 1
    },
    {
      question: "What is document 'chunking' in RAG setups?",
      options: ["Deleting unread text files", "Breaking down large source documents into smaller, coherent text segments before embedding", "Creating copy backups of documents", "Converting documents to PDF formats"],
      correctAnswer: 1
    },
    {
      question: "Which algorithm is commonly used to measure distance/similarity between vector embeddings?",
      options: ["Cosine Similarity", "Merge Sort", "Dijkstra's Algorithm", "Binary Search"],
      correctAnswer: 0
    },
    {
      question: "What is the function of the 'Retriever' in a RAG pipeline?",
      options: ["To format final completions", "To query the vector database and fetch top relevant text chunks for the prompt context", "To calculate billing tokens", "To train the model weight matrix"],
      correctAnswer: 1
    },
    {
      question: "What is the role of the 'Generator' in a RAG system?",
      options: ["To fetch document files", "To read the context chunks alongside user prompt and synthesize a cohesive text answer", "To host vector indices", "To generate API authentication tokens"],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a leading vector database tool?",
      options: ["PostgreSQL (without extension)", "Pinecone / Chroma", "SQLite", "MongoDB (without index)"],
      correctAnswer: 1
    },
    {
      question: "How does metadata filtering improve RAG search quality?",
      options: ["By reducing document word counts", "By restricting searches to specific subsets of documents (e.g. date range, author, department)", "By increasing vector embedding dimensions", "By translating files to English"],
      correctAnswer: 1
    }
  ],
  // Module 4 Quiz (Agentic AI)
  209: [
    {
      question: "What defines an Agentic AI system?",
      options: ["A model that only answers chats", "An LLM-driven loop that can plan steps, query tools, make decisions, and act autonomously", "A static system script", "A database backup system"],
      correctAnswer: 1
    },
    {
      question: "What is tool calling (function calling) in agentic systems?",
      options: ["Invoking external APIs from a command line", "An LLM outputs structured arguments (e.g. JSON) indicating which tool to run and with what values", "Writing script functions in Python", "Linking database schemas"],
      correctAnswer: 1
    },
    {
      question: "Which framework combines Reasoning and Action loops in agent prompts?",
      options: ["CoT", "ReAct", "RAG", "RLHF"],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of planning steps in agent loops?",
      options: ["To structure data columns", "To split a complex user goal into sequential sub-tasks and evaluate next actions", "To compress model weights", "To calculate compute costs"],
      correctAnswer: 1
    },
    {
      question: "In multi-agent systems, how do agents coordinate?",
      options: ["By editing the same binary code", "By communicating via structured chat/prompts, delegating tasks based on specialized roles", "By sharing the same GPU memory space directly", "They do not coordinate"],
      correctAnswer: 1
    },
    {
      question: "What is a 'human-in-the-loop' check in agent execution?",
      options: ["Using human testers during model pre-training", "Halting automated agent tool execution to require human confirmation for sensitive operations", "Using captchas in prompts", "A manual backup copy of databases"],
      correctAnswer: 1
    },
    {
      question: "Which tool allows an AI agent to execute calculations securely without hallucination?",
      options: ["Vector search", "Python Code Sandbox / Calculator tool", "SQL Database trigger", "Text formatter"],
      correctAnswer: 1
    },
    {
      question: "What does JSON format support in function calling?",
      options: ["Standardized structures for passing arguments between the model and API integration scripts", "Rendering visual graphs", "Running models in browser tabs", "Compressing files"],
      correctAnswer: 0
    },
    {
      question: "What is a major challenge in agent loops?",
      options: ["Small context window sizes", "Infinite loops, getting stuck, or hallucinating tool arguments", "Lack of coding frameworks", "Slower internet speeds"],
      correctAnswer: 1
    },
    {
      question: "Which is a leading library for building agentic AI loops?",
      options: ["React Redux", "LangChain / LangGraph / Autogen", "Webpack", "Tailwind CSS"],
      correctAnswer: 1
    }
  ],
  // Module 5 Quiz (Fine-Tuning)
  211: [
    {
      question: "What is Fine-Tuning?",
      options: ["Optimizing server hosting layouts", "Adjusting internal model weights on a targeted dataset to learn specific tasks, domains, or formatting", "Rewriting prompt instructions", "Adding vector indexes"],
      correctAnswer: 1
    },
    {
      question: "Which method is a Parameter-Efficient Fine-Tuning (PEFT) technique that freezes base weights and injects low-rank matrices?",
      options: ["SFT (Supervised Fine-Tuning)", "LoRA (Low-Rank Adaptation)", "RLHF", "DPO (Direct Preference Optimization)"],
      correctAnswer: 1
    },
    {
      question: "What is the key benefit of LoRA fine-tuning?",
      options: ["It produces smaller models that consume less GPU memory to train and save", "It alters prompt token sizes", "It deletes base parameters", "It requires no training data"],
      correctAnswer: 0
    },
    {
      question: "What is Supervised Fine-Tuning (SFT)?",
      options: ["Training without human labels", "Training a model on labeled input-output pairs to replicate a desired style or behavior", "Running prompts sequentially", "Testing API response times"],
      correctAnswer: 1
    },
    {
      question: "What does RLHF stand for?",
      options: ["Robust Language Hybrid Framework", "Reinforcement Learning from Human Feedback", "Recursive Layer Hierarchy Filter", "Rational Logarithmic Hyperparameter Function"],
      correctAnswer: 1
    },
    {
      question: "What is catastophic forgetting in fine-tuning?",
      options: ["Running out of RAM during inference", "A model losing its generalized capabilities/knowledge when overtrained on a single narrow task", "API keys expiring", "Database crashes"],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of the Reward Model in RLHF?",
      options: ["To give users discount codes", "To score model outputs based on human preference alignments", "To calculate prompt completion speeds", "To manage parameter weights"],
      correctAnswer: 1
    },
    {
      question: "What does QLoRA combine to optimize fine-tuning?",
      options: ["RAG and LoRA", "Quantization (e.g. 4-bit) and LoRA", "RLHF and SQL", "Ensembling and Clustering"],
      correctAnswer: 1
    },
    {
      question: "Which dataset format is typical for SFT training?",
      options: ["Unstructured raw text dumps", "Structured list of prompt-response instruction pairs", "Table relational databases", "Folder paths of images"],
      correctAnswer: 1
    },
    {
      question: "When should you choose RAG over Fine-Tuning?",
      options: ["When you need to change model tone", "When you need to ground the model on dynamic, real-time, or highly proprietary source files", "When you have massive GPU server farms", "When you want to train structural syntax coding rules"],
      correctAnswer: 1
    }
  ],
  // Module 6 Quiz (Deploying & Scaling)
  213: [
    {
      question: "What is model quantization?",
      options: ["Increasing parameter counts", "Reducing numerical precision of model weights (e.g., FP32 to INT8) to shrink file sizes and speed up inference", "Splitting datasets", "Translating models"],
      correctAnswer: 1
    },
    {
      question: "Which framework is optimized for high-throughput LLM serving using PagedAttention?",
      options: ["Express.js", "vLLM", "Docker Compose", "Nginx"],
      correctAnswer: 1
    },
    {
      question: "What is the role of a model registry?",
      options: ["To record domain names", "To track, store, and manage version control of machine learning model weights", "To check user license key balances", "To record logs of prompt histories"],
      correctAnswer: 1
    },
    {
      question: "Which metrics are most critical to monitor for LLM user experience?",
      options: ["CPU temperature", "Time to First Token (TTFT) and Tokens Per Second (TPS)", "Database table counts", "Git commit counts"],
      correctAnswer: 1
    },
    {
      question: "What is inference compilation (e.g., TensorRT, ONNX)?",
      options: ["Converting code to HTML", "Optimizing model computation graphs for specific deployment hardware targets", "Compressing text logs", "Managing git branches"],
      correctAnswer: 1
    },
    {
      question: "What is serverless inference?",
      options: ["Running code on offline drives", "AI model hosting where compute resources scale down to zero when inactive, billing only per request", "Using database triggers", "Local terminal execution"],
      correctAnswer: 1
    },
    {
      question: "Why is caching prompts (e.g. semantic cache) useful in scaling production LLMs?",
      options: ["To reduce model files", "To serve identical or highly similar user queries instantly from local memory without querying the LLM", "To protect API endpoints from SQL injections", "To increase GPU memory speed"],
      correctAnswer: 1
    },
    {
      question: "What does A/B testing compare in production deployments?",
      options: ["CPU vs RAM usage", "Output performance and metrics between two different models or prompt versions in active use", "Database rows", "Network interfaces"],
      correctAnswer: 1
    },
    {
      question: "What is data drift in ML production systems?",
      options: ["Deleting database rows", "Changes in input data distribution over time, potentially reducing model accuracy", "Network data routing errors", "File corruption during transfer"],
      correctAnswer: 1
    },
    {
      question: "Which tool standardizes packing and shipping application environments to any host?",
      options: ["Git", "Docker Containers", "Sass", "Babel"],
      correctAnswer: 1
    }
  ],
  // Final Exam (GenAI Masterclass)
  214: [
    {
      question: "What is the core building block of the Self-Attention mechanism in Transformers?",
      options: ["Pooling layers", "Query, Key, and Value vector matrices", "Recurrent neural units", "Kernel filters"],
      correctAnswer: 1
    },
    {
      question: "Which prompt engineering technique prevents prompt hallucinations by feeding specific document chunks?",
      options: ["RAG (Retrieval-Augmented Generation)", "Chain of Thought", "Zero-Shot", "Few-Shot"],
      correctAnswer: 0
    },
    {
      question: "What is the difference between SFT and RLHF?",
      options: ["SFT is unsupervised; RLHF is supervised", "SFT teaches task replication; RLHF aligns outputs with human preferences using reward modeling", "SFT adjusts tokens; RLHF changes hardware compute paths", "SFT is for code; RLHF is for images"],
      correctAnswer: 1
    },
    {
      question: "Which fine-tuning method operates by freezing base model weights and training a tiny set of adapter layers?",
      options: ["Full fine-tuning", "LoRA (Low-Rank Adaptation)", "Quantization", "Data drift ensembling"],
      correctAnswer: 1
    },
    {
      question: "What is the benefit of vLLM's PagedAttention?",
      options: ["It compresses weights to INT4", "It optimizes GPU memory allocation for key-value (KV) caches, minimizing waste and scaling batch size", "It translates text automatically", "It compiles code to binary"],
      correctAnswer: 1
    },
    {
      question: "What is prompt cache?",
      options: ["Clearing browser cache files", "Reusing computed context prefixes to speed up inference and save token costs on recurrent queries", "A database index tablespace", "Encrypting prompt text data"],
      correctAnswer: 1
    },
    {
      question: "Which metric defines the delay before a user sees the first characters of an AI reply?",
      options: ["Latency", "Time to First Token (TTFT)", "Throughput (TPS)", "Context Size"],
      correctAnswer: 1
    },
    {
      question: "In agent architectures, what does 'ReAct' stand for?",
      options: ["Reacting to user events in JavaScript", "Reasoning and Acting integration", "Recursive Action Tuning", "Refactoring and Active Compilation"],
      correctAnswer: 1
    },
    {
      question: "What does cosine similarity measure between two text embedding vectors?",
      options: ["Character matching count", "The cosine of the angle between them, evaluating semantic closeness", "Alphabetical index similarity", "File size similarities"],
      correctAnswer: 1
    },
    {
      question: "What is a major risk of catastrophic forgetting in LLMs?",
      options: ["Hard drives erasing model files", "Losing general knowledge during fine-tuning on a narrow dataset", "Model parameters leaking out via SQL errors", "Inference loops getting timed out"],
      correctAnswer: 1
    }
  ],

  // --- MACHINE LEARNING FOUNDATIONS (300 series) ---
  // Module 1 Quiz (ML Paradigms)
  303: [
    {
      question: "What is the primary difference between Supervised and Unsupervised Learning?",
      options: ["Supervised requires GPU hardware; unsupervised does not", "Supervised uses labeled training data; unsupervised learns patterns from unlabeled data", "Supervised is for text; unsupervised is for numerical tables", "Supervised cannot run in real time"],
      correctAnswer: 1
    },
    {
      question: "Which of the following is a classic Unsupervised Learning task?",
      options: ["Image classification", "Clustering (e.g. K-Means)", "Stock price regression forecasting", "Spam email detection"],
      correctAnswer: 1
    },
    {
      question: "What is Reinforcement Learning?",
      options: ["Overtraining on a single sample", "An agent learning actions through trial and error rewards/penalties in an environment", "Sorting database arrays", "Writing custom CSS styles"],
      correctAnswer: 1
    },
    {
      question: "What is a 'label' in machine learning datasets?",
      options: ["A database index name", "The target output or ground truth class we want the model to predict", "A visual UI border tag", "The file path string"],
      correctAnswer: 1
    },
    {
      question: "Which task is considered a regression problem?",
      options: ["Classifying a scan as cancer vs normal", "Predicting the continuous house price in dollars", "Clustering users by interest", "Generating realistic images"],
      correctAnswer: 1
    },
    {
      question: "Which task is considered a classification problem?",
      options: ["Predicting house prices", "Identifying an email as spam or not-spam", "Grouping customers by shopping habit", "Estimating crop yield weights"],
      correctAnswer: 1
    },
    {
      question: "What does 'training features' refer to in tabular data?",
      options: ["The number of model parameter layers", "The input variables or attributes used by the model to make predictions", "The chart graphs plotted", "The speed metrics of GPUs"],
      correctAnswer: 1
    },
    {
      question: "Which model is a basic linear baseline algorithm for regression?",
      options: ["K-Means", "Linear Regression", "Decision Tree Classifier", "Convolutional Neural Network"],
      correctAnswer: 1
    },
    {
      question: "What is the goal of dimensionality reduction?",
      options: ["Reducing model parameter weights to INT4", "Reducing the number of feature variables while retaining key variance data", "Decreasing context token bounds", "Formatting databases to CSV"],
      correctAnswer: 1
    },
    {
      question: "What represents the 'ground truth' in a classification dataset?",
      options: ["A random output value", "The actual verified label class of each data point", "The predictions of a model", "The system prompt parameters"],
      correctAnswer: 1
    }
  ],
  // Module 2 Quiz (Loss & Optimizers)
  305: [
    {
      question: "What is the role of a Loss Function in machine learning?",
      options: ["To delete bad files", "To calculate a numeric score representing the error between predictions and ground truth labels", "To speed up computation runs", "To format output text tables"],
      correctAnswer: 1
    },
    {
      question: "Which optimization algorithm works by taking steps proportional to the negative of the gradient of the loss function?",
      options: ["Binary Search", "Gradient Descent", "K-Nearest Neighbors", "Backpropagation Matrix"],
      correctAnswer: 1
    },
    {
      question: "What is a learning rate in gradient descent?",
      options: ["The speed at which data loads from storage disks", "The size of steps taken to adjust weights towards the loss minimum", "The number of epochs run per second", "The accuracy score on test validation data"],
      correctAnswer: 1
    },
    {
      question: "What is Mean Squared Error (MSE)?",
      options: ["A classification accuracy score", "The average of squared differences between predictions and actual targets (regression)", "A database query sorting time", "A token count metric"],
      correctAnswer: 1
    },
    {
      question: "What does 'local minimum' mean in optimization?",
      options: ["A minor folder directory", "A point in the parameter space where loss is lower than nearby points but not the absolute lowest", "The lowest learning rate", "A GPU memory limit"],
      correctAnswer: 1
    },
    {
      question: "What is the global minimum of a loss function?",
      options: ["The absolute lowest possible value of the loss function across all parameter configurations", "The initial loss value", "The learning rate bounds", "The local server storage space"],
      correctAnswer: 0
    },
    {
      question: "Which optimizer adapts learning rates per-parameter based on historical gradients?",
      options: ["Stochastic Gradient Descent (SGD) Baseline", "Adam Optimizer", "Linear Activation", "Gradient Boosted Tree"],
      correctAnswer: 1
    },
    {
      question: "What is a batch size in model training?",
      options: ["The model file disk size", "The number of training samples processed in one forward and backward pass to calculate weight updates", "The number of GPUs available", "The number of training epochs"],
      correctAnswer: 1
    },
    {
      question: "What is an epoch in ML training?",
      options: ["One single optimization step", "One full forward and backward pass of the entire training dataset through the model", "The model release date tag", "The inference delay metrics"],
      correctAnswer: 1
    },
    {
      question: "What is overfitting?",
      options: ["Using hardware that is too big", "A model learning training data noise too well, resulting in poor generalizations on unseen test data", "Setting learning rates to zero", "Having more features than samples"],
      correctAnswer: 1
    }
  ],
  // Module 3 Quiz (SVMs & Trees)
  307: [
    {
      question: "What is a Support Vector Machine (SVM) primarily designed to find in classification?",
      options: ["A cluster center point", "An optimal decision boundary (hyperplane) that maximizes margin between classes", "A split criteria probability", "A deep weight matrix"],
      correctAnswer: 1
    },
    {
      question: "What is the 'kernel trick' in SVMs?",
      options: ["Writing fast graphics code", "Mapping low-dimensional inputs to a higher-dimensional space to solve non-linear classification problems", "Clearing OS caches", "Compiling kernel drivers"],
      correctAnswer: 1
    },
    {
      question: "In a Decision Tree, what represents a decision point?",
      options: ["A leaf node", "An internal node (representing a feature split check)", "A root connection line", "A matrix coefficient weight"],
      correctAnswer: 1
    },
    {
      question: "What is Gini Impurity or Entropy used for in Decision Trees?",
      options: ["Calculating model compute times", "Measuring split quality at internal nodes to choose the best feature split", "Managing memory cache lines", "Normalizing weights"],
      correctAnswer: 1
    },
    {
      question: "What is a Random Forest?",
      options: ["A model directory folder", "An ensemble method that trains multiple decision trees and averages/votes their outputs", "A random database generator", "A visual graphic generator"],
      correctAnswer: 1
    },
    {
      question: "What is bagging in Random Forests?",
      options: ["Compacting binary data files", "Bootstrap Aggregating - training individual trees on random bootstrapped subsets of the data", "Deleting missing columns", "Running predictions in parallel threads"],
      correctAnswer: 1
    },
    {
      question: "What does 'pruning' accomplish in decision trees?",
      options: ["Deleting columns in datasets", "Cutting off branches that add little predictive power to reduce overfitting", "Renaming variables", "Overtraining deep layers"],
      correctAnswer: 1
    },
    {
      question: "What is the margin in SVM algorithms?",
      options: ["The distance between page elements in CSS", "The distance between the decision hyperplane and the closest training data points (support vectors)", "The learning rate bounds", "The database memory limits"],
      correctAnswer: 1
    },
    {
      question: "What are Support Vectors in SVM classification?",
      options: ["The coordinate pointers of GPUs", "The critical data points closest to the decision boundary that define its position", "The dimensions of output vectors", "The learning rate parameter variables"],
      correctAnswer: 1
    },
    {
      question: "Which metric does Gradient Boosting optimize?",
      options: ["Learning rate increments", "Pseudo-residuals (errors) of the preceding weak learners sequentially", "Epoch counts", "Feature selection probabilities"],
      correctAnswer: 1
    }
  ],
  // Module 4 Quiz (Neural Networks)
  309: [
    {
      question: "What is an activation function in neural networks?",
      options: ["A tool that measures model file loading speeds", "A mathematical function that introduces non-linearity to node outputs", "An API call key trigger", "A database connection script"],
      correctAnswer: 1
    },
    {
      question: "Which activation function is defined as f(x) = max(0, x)?",
      options: ["Sigmoid", "ReLU (Rectified Linear Unit)", "Tanh", "Softmax"],
      correctAnswer: 1
    },
    {
      question: "What is the primary role of Backpropagation?",
      options: ["Generating random test values", "Calculating the gradient of the loss function with respect to weights using chain rule to update them", "Formatting data logs", "Loading data to RAM"],
      correctAnswer: 1
    },
    {
      question: "What is the Sigmoid activation function commonly used for?",
      options: ["Vector distance checks", "Scaling output probabilities between 0 and 1 (binary classification)", "Initializing network layers", "Quantizing model parameters"],
      correctAnswer: 1
    },
    {
      question: "Which layer type is typical for processing grid-structured data like images?",
      options: ["Fully Connected Dense Layer", "Convolutional Layer (CNN)", "Recurrent Layer (RNN)", "Linear Classification Layer"],
      correctAnswer: 1
    },
    {
      question: "What is a perceptron?",
      options: ["A GPU processor cores layout", "The basic building block of a neural network that calculates a weighted sum of inputs and applies activation", "A model compilation file", "A relational table matrix"],
      correctAnswer: 1
    },
    {
      question: "What does the Softmax function do in multi-class neural networks?",
      options: ["It compresses parameters", "It normalizes network outputs to a probability distribution over multiple target classes", "It acts as a local minimum check", "It filters SQL injection inputs"],
      correctAnswer: 1
    },
    {
      question: "What are hidden layers in Multi-Layer Perceptrons?",
      options: ["Invisible files in folders", "The intermediate layers of neurons between the input layer and the output layer", "System files of cloud providers", "Unused network connections"],
      correctAnswer: 1
    },
    {
      question: "What is the vanishing gradient problem in deep networks?",
      options: ["Gradients growing infinitely large", "Gradients becoming extremely small during backpropagation, stopping earlier layers from learning weights", "Loss functions hitting absolute zero", "CPU memory leak exceptions"],
      correctAnswer: 1
    },
    {
      question: "What does 'fully connected' (Dense) layer imply?",
      options: ["Every server is wired together", "Every neuron in the layer is connected to every neuron in the preceding layer", "All database tables are linked", "The script runs offline without APIs"],
      correctAnswer: 1
    }
  ],
  // Module 5 Quiz (Validation & Metrics)
  311: [
    {
      question: "What is K-Fold Cross-Validation?",
      options: ["Overtraining on K copies of files", "Splitting datasets into K equal parts, training K times on K-1 folds, validating on the remaining fold", "Multiplying learning rates by K", "Splitting parameters into folds"],
      correctAnswer: 1
    },
    {
      question: "Which metric is the ratio of true positives to the total predicted positives?",
      options: ["Recall / Sensitivity", "Precision", "Accuracy", "F1-Score"],
      correctAnswer: 1
    },
    {
      question: "Which metric is the ratio of true positives to all actual positives?",
      options: ["Precision", "Recall / Sensitivity", "Accuracy", "Specificity"],
      correctAnswer: 1
    },
    {
      question: "What is the F1-Score?",
      options: ["The training accuracy score", "The harmonic mean of precision and recall", "The loss function value", "The ratio of parameters to GPU speed"],
      correctAnswer: 1
    },
    {
      question: "What is a Confusion Matrix?",
      options: ["A complex network layout", "A table mapping actual vs predicted classes to check classifier errors", "A system database error log", "A compilation log screen"],
      correctAnswer: 1
    },
    {
      question: "What does a False Positive represent?",
      options: ["A model failing to compile", "A negative class sample incorrectly predicted as positive", "A positive class sample predicted correctly", "A database index crash"],
      correctAnswer: 1
    },
    {
      question: "What does a False Negative represent?",
      options: ["A negative class sample predicted correctly", "A positive class sample incorrectly predicted as negative", "An API response timeout", "A compilation error"],
      correctAnswer: 1
    },
    {
      question: "What is the Area Under the ROC Curve (AUC-ROC)?",
      options: ["A neural network layout type", "A metric measuring the classifier's performance at all classification probability thresholds", "The percentage of CPU memory consumed", "The loss reduction rate"],
      correctAnswer: 1
    },
    {
      question: "What is the primary cause of high variance in model validation metrics?",
      options: ["High bias", "Overfitting (the model fits training data noise too closely)", "Low learning rates", "Small training datasets"],
      correctAnswer: 1
    },
    {
      question: "What does high bias imply in machine learning validation?",
      options: ["Overfitting", "Underfitting (the model is too simple to capture patterns, e.g. using linear model on non-linear data)", "Using unbalanced folds", "Having too many neural hidden layers"],
      correctAnswer: 1
    }
  ],
  // Final Exam (ML Foundations)
  312: [
    {
      question: "Which ML paradigm uses labeled inputs to predict continuous continuous variables?",
      options: ["Supervised Regression", "Supervised Classification", "Unsupervised Clustering", "Reinforcement Learning"],
      correctAnswer: 0
    },
    {
      question: "What is the role of backpropagation in deep neural networks?",
      options: ["Calculating model weights directly", "Computing gradients of loss with respect to weights to run optimization updates", "Evaluating accuracy scores on test folds", "Mapping features to higher dimensions via kernels"],
      correctAnswer: 1
    },
    {
      question: "Which activation function is designed to scale outputs between 0 and 1, facilitating binary classification?",
      options: ["ReLU", "Sigmoid", "Softmax", "Tanh"],
      correctAnswer: 1
    },
    {
      question: "What does Adam optimizer do differently than simple SGD?",
      options: ["It computes full gradients on all datasets", "It dynamically adapts parameter-specific learning rates using historical moments", "It deletes non-zero parameter weights", "It maps features to vector embeddings"],
      correctAnswer: 1
    },
    {
      question: "How does a Random Forest classifier prevent individual decision trees from overfitting?",
      options: ["By training on a single data branch", "By bagging (bootstrap aggregating) both datasets and features across multiple trees and ensembling outputs", "By reducing parameter epochs to 1", "By using soft SVM decision margins"],
      correctAnswer: 1
    },
    {
      question: "What is a False Positive in clinical diagnosis software context?",
      options: ["Diagnosing a healthy patient as sick", "Diagnosing a sick patient as healthy", "Confirming a sick patient as sick", "Failing to scan a patient"],
      correctAnswer: 0
    },
    {
      question: "Which evaluation metric is defined as the harmonic mean of precision and recall?",
      options: ["Accuracy", "F1-Score", "AUC-ROC", "Gini Impurity"],
      correctAnswer: 1
    },
    {
      question: "What is the key advantage of using K-Fold Cross-Validation over a single train-test split?",
      options: ["It trains models faster", "It reduces performance estimation variance by validating the model on every data fold", "It shrinks parameter file sizes", "It eliminates the need for activation functions"],
      correctAnswer: 1
    },
    {
      question: "What does Gini Impurity evaluate in Decision Tree algorithms?",
      options: ["Model speed metrics", "Node homogeneity/split quality to select the optimal feature splits", "Gradient step values", "Kernel mapping sizes"],
      correctAnswer: 1
    },
    {
      question: "Which SVM hyperparameter controls the soft margin tolerance for training misclassifications?",
      options: ["Learning Rate (alpha)", "C Parameter", "Epochs count", "Top-P value"],
      correctAnswer: 1
    }
  ]
};
