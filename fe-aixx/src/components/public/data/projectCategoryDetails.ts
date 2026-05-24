export interface DetailSection {
  title: string;
  paragraph?: string; // optional paragraph field
  points: string[];
}

export interface ProjectDetail {
  id: string;
  title: string;
  mainImages: string[];
  overview: string;
  whyChooseUs: DetailSection;
  whatWeCover: DetailSection;
}

export const projectDetails: ProjectDetail[] = [
  {
    id: '1',
    title: 'Home Inspection & Maintenance',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us?',
      paragraph: `Choosing the right team for your home's inspection and maintenance is essential for long-term peace of mind. At the heart of our service is a commitment to quality, integrity, and customer satisfaction. We don't just fix issues; we build trust. Our clients know they can rely on us for thorough assessments, reliable solutions, and transparent communication at every step.`,
      points: [
        'Experienced licensed and insured professionals',
        'Transparent pricing with detailed reports',
        'Quick response times and punctual service',
        'High-quality materials and precise execution',
        'Customizable maintenance plans for every home',
      ],
    },
    whatWeCover: {
      title: 'What We Cover',
      points: [
        'Roof and Ceiling Inspection',
        'Plumbing Checks',
        'Electrical System Evaluation',
        'HVAC System Servicing',
        'Gutter and Drainage Cleaning',
        'Window and Door Sealing',
        'Pest, Mold & Dampness Inspection',
        'Water Heater & Tank Maintenance',
        'Appliance Safety Checks',
        'Energy Efficiency Upgrades',
      ],
    },
  },
  {
    id: '2',
    title: 'Commercial Space Renovation',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Commercial Renovation?',
      paragraph: 'We’re dedicated to transforming commercial spaces into functional and impressive environments while minimizing downtime.',
      points: [
        'Specialized in commercial projects',
        'Adherence to strict timelines and budgets',
        'Experienced project managers',
        'High-quality, durable materials',
        'Minimal business disruption',
      ],
    },
    whatWeCover: {
      title: 'Commercial Renovation Services Include:',
      points: [
        'Space planning and layout optimization',
        'Interior and exterior structural modifications',
        'HVAC, plumbing, and electrical system upgrades',
        'Flooring, ceiling, and wall finishes',
        'Custom millwork and cabinetry',
        'Fixture and equipment installation',
        'Compliance with ADA and safety regulations',
      ],
    },
  },
  {
    id: '3',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '4',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '5',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '6',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '7',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '8',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '9',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
  {
    id: '10',
    title: 'Office Interior Design',
    mainImages: [
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
      '/images/project/frame3.svg',
    ],
    overview: `Our expert team begins every project with a detailed home inspection to identify hidden issues early—such as roof leaks, outdated electrical wiring, damaged plumbing, pest infestation, poor ventilation, or foundation cracks. We examine every space, from the attic to the basement, using the latest tools like thermal imaging, moisture meters, and circuit testers to uncover problems that often go unnoticed. Every inspection is followed by a clear, photo-documented report, giving homeowners a full view of their property’s condition and a prioritized list of recommendations.
    
    Routine maintenance is the foundation of a safe, efficient, and long-lasting home. Our technicians handle essential upkeep including plumbing tune-ups, circuit board safety checks, HVAC system servicing, appliance testing, water pressure balancing, and sealing of doors and windows. Regular maintenance reduces the risk of emergencies, extends the life of major home systems, and ensures consistent performance throughout the year. We don’t just fix problems—we prevent them.

    In addition to routine care, we offer seasonal maintenance packages designed to protect your home throughout the year. Before monsoon, we check roofs for leaks, clean gutters, and waterproof vulnerable areas. In winter, we inspect insulation, test heating systems, and protect outdoor plumbing from freezing. Summer maintenance focuses on air conditioning performance, ventilation quality, and energy-saving upgrades. We also prepare homes for storm seasons by reinforcing roofing, checking backup power sources, and ensuring proper drainage. Our seasonal care ensures your home remains safe, energy-efficient, and weather-resistant—providing peace of mind in every season.
    `,
    whyChooseUs: {
      title: 'Why Choose Us for Office Design?',
      paragraph: 'Our office designs reflect your brand identity and support productive, collaborative, and healthy workspaces.',
      points: [
        'Tailored designs for unique brand identities',
        'Focus on employee well-being and productivity',
        'Expertise in modern office trends',
        'Sustainable and ergonomic solutions',
        'Seamless project execution',
      ],
    },
    whatWeCover: {
      title: 'Office Interior Design Services:',
      points: [
        'Space planning and conceptualization',
        'Furniture selection and procurement',
        'Lighting design and installation',
        'Acoustic solutions',
        'Branding integration',
        'Material and finish selection',
        'Project management and installation oversight',
      ],
    },
  },
];
