<?php

namespace App\Http\Controllers;

use App\Models\Training;
use Illuminate\Support\Facades\Response;

class CourseController extends Controller
{
    /**
     * Return the list of courses (type = 'courses') for the frontend.
     */
    public function index()
    {
        // Hard‑coded course catalogue (user supplied data). Missing values are populated with reasonable placeholders.
        $courses = [
            [
                'course' => 'AI for Business Leaders',
                'duration' => '6 weeks – 6 months (Professional Certificate / Executive Education)',
                'subModules' => 'Introduction to AI, AI Strategy, Generative AI for Business, AI-Driven Decision Making, Business Process Automation, Digital Transformation, AI Ethics & Governance, Data-Driven Leadership, AI Risk Management, Change Management, AI Implementation Frameworks, Business Case Development, AI Productivity Tools (e.g., ChatGPT, Microsoft Copilot, Gemini), Responsible AI, Future AI Trends',
                'fees' => '',
            ],
            [
                'course' => 'Generative AI Masterclass',
                'duration' => null,
                'subModules' => null,
                'fees' => '',
            ],
            [
                'course' => 'Computer Science (CS)',
                'duration' => '3–4 years',
                'subModules' => 'Programming, Data Structures, OS, Networks, Databases, Algorithms, Theory of Computation',
                'fees' => '',
            ],
            [
                'course' => 'Software Engineering',
                'duration' => '3–4 years',
                'subModules' => 'Software Design, Agile Development, Web Dev, Mobile Apps, DevOps, Testing, Architecture',
                'fees' => '',
            ],
            [
                'course' => 'Data Science',
                'duration' => '3–4 years',
                'subModules' => 'Statistics, Python, Data Mining, Big Data, Visualization, Machine Learning basics',
                'fees' => '',
            ],
            [
                'course' => 'Artificial Intelligence (AI)',
                'duration' => '3–4 years',
                'subModules' => 'Machine Learning, Deep Learning, Neural Networks, NLP, Computer Vision, Reinforcement Learning',
                'fees' => '',
            ],
            [
                'course' => 'Cyber Security',
                'duration' => '3–4 years',
                'subModules' => 'Ethical Hacking, Cryptography, Network Security, Digital Forensics, Malware Analysis',
                'fees' => '',
            ],
            [
                'course' => 'Information Technology (IT)',
                'duration' => '3 years',
                'subModules' => 'IT Infrastructure, Cloud Computing, System Admin, Networking, Database Management',
                'fees' => '',
            ],
            [
                'course' => 'Computer Engineering',
                'duration' => '4 years',
                'subModules' => 'Digital Electronics, Microprocessors, Embedded Systems, Computer Architecture, IoT, Robotics',
                'fees' => '',
            ],
            [
                'course' => 'Game Development / Multimedia',
                'duration' => '3–4 years',
                'subModules' => 'Game Design, Unity/Unreal, 3D Graphics, Animation, UI/UX, Interactive Media',
                'fees' => '',
            ],
            [
                'course' => 'AI Specializations (Advanced)',
                'duration' => '1–2 years (MSc level)',
                'subModules' => 'Advanced Machine Learning, AI Research, Robotics AI, Generative AI, LLMs, AI Ethics',
                'fees' => 'Domestic: £12,000–£80,000/year | International: $30,000–$120,000/year',
            ],
        ];

        return Response::json($courses);
    }
}
