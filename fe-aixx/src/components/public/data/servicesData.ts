export type Service = {
  id: string;
  title: string;
  icon: string;
  description: string;
  image?: string;
  content?: string;
  features?: string[];
  price?: string;
};

export type ServiceCategory = {
  find(arg0: (service: { id: number; }) => boolean): unknown;
  residential: Service[];
  commercial: Service[];
  specialty: Service[];
};

export const headerContent = {
  residential: {
    title: "Core Technology Ecosystems",
    description: "We provide comprehensive AI and Quantum-ready foundations designed for resilient operations. From intelligent infrastructure to quantum-secure networks."
  },
  commercial: {
    title: "Enterprise Solutions",
    description: "Professional high-tech integration for global enterprises. We ensure seamless AI orchestration, autonomous scalability, and future-proof digital transformation."
  },
  specialty: {
    title: "Advanced Specialty Integration",
    description: "Custom technology solutions for mission-critical operations. From autonomous logistics hubs to data-driven intelligence systems, we lead the way in precision engineering."
  }
};

export const services: ServiceCategory = {
  residential: [
    {
      id: "res-1",
      title: "Home Wiring",
      icon: "/images/home/logo1.svg",
      image: "/images/aboutus/ai_chip.png",
      description: "Safe, efficient, and professional wiring for new homes, upgrades, or repairs—ensuring your home meets all safety standards and electrical codes for optimal performance.",
      content: "Our certified electricians provide comprehensive home wiring services for new constructions, renovations, and upgrades. We ensure all wiring meets local electrical codes and safety standards, using high-quality materials for durability and performance.",
      features: [
        "Whole-home wiring solutions",
        "Code-compliant installations",
        "Panel upgrades",
        "Safety inspections"
      ]
    },
  
    {
      id: "res-2",
      title: "Outlet Installation",
      icon: "/images/home/logo2.svg",
      image: "/images/aboutus/quantum_engineer.png",
      description: "Professional installation of electrical outlets for all your power needs, including GFCI outlets in wet areas and USB charging ports for modern convenience.",
      content: "From standard outlets to GFCI installations in kitchens and bathrooms, we provide safe and reliable outlet services. We can install specialized outlets for appliances and outdoor-rated receptacles.",
      features: [
        "GFCI installation",
        "USB outlet options",
        "Appliance circuits",
        "Outdoor receptacles"
      ]
    },
    {
      id: "res-3",
      title: "Lighting Solution",
      icon: "/images/home/logo3.svg",
      image: "/images/aboutus/tech_grid.png",
      description: "Custom lighting designs and installations to brighten your space, from ambient lighting to task lighting, including energy-efficient LED options.",
      content: "We design and install interior and exterior lighting solutions that enhance your home's aesthetics, functionality, and security. Our services include recessed lighting and energy-efficient LED conversions.",
      features: [
        "Interior lighting design",
        "Exterior security lights",
        "LED conversions",
        "Smart lighting"
      ]
    },
    {
      id: "res-4",
      title: "Home Entertainment System",
      icon: "/images/home/logo8.svg",
      image: "/images/home/home_contact_future.png",
      description: "Seamless setup of home theater and audio systems with proper wiring and installation for optimal sound quality and viewing experience."
    },
    {
      id: "res-5",
      title: "Smart Home Integration",
      icon: "/images/home/logo9.svg",
      image: "/images/service/services_banner.png",
      description: "Modern smart home technology integration for automated living, including smart switches, lighting control, and home automation systems."
    },
    {
      id: "res-6",
      title: "Safety Inspections",
      icon: "/images/home/logo10.svg",
      image: "/images/home/futuristic_about.png",
      description: "Comprehensive electrical safety inspections for peace of mind, identifying potential hazards and ensuring your home's electrical system is up to code."
    }
  ],
  commercial: [
    {
      id: "com-1",
      title: "Commercial Wiring",
      icon: "/images/home/logo4.svg",
      image: "/images/aboutus/ai_chip.png",
      description: "Professional wiring solutions for businesses and commercial properties, designed to handle higher loads and meet commercial electrical codes.",
      content: "Our commercial electrical services include complete wiring solutions for businesses of all sizes, ensuring compliance with commercial electrical codes and safety regulations.",
      features: [
        "Office building wiring",
        "Retail space installations",
        "Three-phase power",
        "Energy-efficient solutions"
      ]
    },
    {
      id: "com-2",
      title: "Panel Upgrades",
      icon: "/images/home/logo6.svg",
      image: "/images/aboutus/quantum_engineer.png",
      description: "Upgrade your electrical panel to meet the demands of your business, ensuring sufficient power capacity and modern safety features."
    },
    {
      id: "com-3",
      title: "LED Retrofit",
      icon: "/images/home/logo7.svg",
       image: "/images/aboutus/tech_grid.png",
      description: "Energy-efficient LED lighting solutions for commercial spaces, reducing energy costs while improving lighting quality and longevity."
    },
    {
      id: "com-4",
      title: "Data Cabling",
      icon: "/images/home/logo8.svg",
       image: "/images/home/home_contact_future.png",
      description: "Structured cabling for network and telecommunications systems, ensuring reliable connectivity throughout your commercial space."
    },
    {
      id: "com-5",
      title: "Security Systems",
      icon: "/images/home/logo9.svg",
       image: "/images/service/services_banner.png",
      description: "Installation of commercial security and surveillance systems, including access control, CCTV, and alarm systems."
    },
    {
      id: "com-6",
      title: "Code Compliance",
      icon: "/images/home/logo10.svg",
       image: "/images/aboutus/about_banner.png",
      description: "Ensure your commercial property meets all electrical codes and regulations, avoiding fines and ensuring safety for occupants."
    }
  ],
  specialty: [
    {
      id: "spec-1",
      title: "Generator Installation",
      icon: "/images/home/logo5.svg",
       image: "/images/aboutus/ai_chip.png",
      description: "Backup power solutions for uninterrupted electricity supply, including standby generators and transfer switches for automatic operation during outages."
    },
    {
      id: "spec-2",
      title: "EV Charging Stations",
      icon: "/images/home/logo6.svg",
       image: "/images/aboutus/quantum_engineer.png",
      description: "Installation of electric vehicle charging stations at home or business, including Level 2 chargers for faster charging times."
    },
    {
      id: "spec-3",
      title: "Solar Panel Wiring",
      icon: "/images/home/logo7.svg",
       image: "/images/aboutus/tech_grid.png",
      description: "Professional wiring for solar power systems, including inverters, disconnects, and integration with your existing electrical system."
    },
    {
      id: "spec-4",
      title: "Industrial Equipment",
      icon: "/images/home/logo8.svg",
       image: "/images/home/home_contact_future.png",
      description: "Electrical solutions for heavy machinery and industrial equipment, including motor controls, three-phase systems, and high-voltage installations."
    },
    {
      id: "spec-5",
      title: "Emergency Repairs",
      icon: "/images/home/logo9.svg",
       image: "/images/service/services_banner.png",
      description: "24/7 emergency electrical repair services to address urgent issues like power outages, sparking outlets, or electrical hazards."
    },
    {
      id: "spec-6",
      title: "Energy Audits",
      icon: "/images/home/logo10.svg",
      image: "/images/home/home_contact_future.png",
      description: "Comprehensive energy efficiency evaluations to identify areas for improvement and reduce your energy consumption and costs."
    },
    {
      id: "spec-7",
      title: "HVAC Electrical",
      icon: "/images/home/logo5.svg",
      image: "/images/aboutus/ai_chip.png",
      description: "Specialized electrical services for heating, ventilation, and air conditioning systems.",
      content: "Professional installation and maintenance of electrical components for HVAC systems, ensuring optimal performance and energy efficiency.",
      features: [
        "HVAC control wiring",
        "Thermostat installation",
        "Circuit upgrades",
        "Preventive maintenance"
      ]
    },
    {
      id: "spec-8",
      title: "Data Center Power",
      icon: "/images/home/logo6.svg",
      image: "/images/aboutus/quantum_engineer.png",
      description: "Reliable power solutions for server rooms and data centers with backup systems.",
      content: "Specialized electrical installations for data centers including redundant power systems, UPS installations, and server room wiring.",
      features: [
        "Redundant power systems",
        "UPS installation",
        "Server room wiring",
        "Power monitoring"
      ]
    }
  ],
  find: function (): unknown {
    throw new Error("Function not implemented.");
  }
};