<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'footer_text' => 'AIXX brings next-generation AI, quantum, and autonomous systems together to help organizations build resilient, intelligent operations for a shared future.',
            'footer_copyright' => '© 2026 AIXX',
            'home_banner_title' => 'Next-Generation Technology Solutions',
            'home_banner_subtitle' => "Harnessing AI, Quantum computing, and Autonomous systems to redefine what's possible.",
            'home_about_title' => 'A Futuristic AI & Quantum Technology Integrator',
            'home_about_subtitle' => "AIXX is a forward‑looking technology integrator, uniting AI, Quantum computing, and cutting‑edge innovation to deliver real‑world solutions across diverse high‑tech sectors.\n\nFuture training programs in AI and Quantum technologies will empower the next generation of innovators.",
            'home_contact_title' => 'Ready to Build the Future With AIXX?',
            'home_contact_subtitle' => 'Partner with AIXX to deliver AI, Quantum, cybersecurity, autonomous mobility and logistics systems designed for the next generation of intelligent enterprises.',
            'about_banner_title' => 'Engineering the Future of AI & Quantum Integration',
            'about_banner_subtitle' => 'AIXX unites next-generation intelligence, quantum computing, and autonomous systems to build resilient operations for a shared future.',
            'about_content_title' => 'The Intelligence Behind AIXX',
            'about_content_tagline' => 'Architecting Tomorrow',
            'about_content_desc' => 'AIXX partners with global enterprises to integrate AI, Quantum computing, cybersecurity, and autonomous systems, creating ecosystems that are safer, smarter, and infinitely more capable.',
            'about_mission_title' => 'Mission',
            'about_mission_desc' => 'To accelerate intelligent transformation through AI and advanced systems integration, helping organizations operate with confidence and clarity.',
            'about_vision_title' => 'Vision',
            'about_vision_desc' => 'To shape the shared future by designing secure, scalable technology ecosystems that connect people, data, and decisions.',
            'contact_phone' => '+65 9771 0677',
            'contact_email' => 'cs@aixx.com.sg',
            'contact_address' => 'Singapore',
        ];

        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $val, 'group' => $this->getGroupForKey($key)]
            );
        }
    }

    private function getGroupForKey(string $key): string
    {
        if (str_starts_with($key, 'home_')) {
            return 'home';
        }
        if (str_starts_with($key, 'about_')) {
            return 'about';
        }
        if (str_starts_with($key, 'contact_')) {
            return 'contact';
        }
        return 'general';
    }
}
