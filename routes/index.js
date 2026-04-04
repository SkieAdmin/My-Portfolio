import express from 'express';

const router = express.Router();

// Portfolio data
const portfolioData = {
  fullName: 'Kerneil Rommel S. Gocotano',
  nickname: 'Skie',
  name: 'Kerneil.net',
  title: 'Software Developer & Systems Integrator',
  company: 'Panda-Pelican Development',
  companyHandle: '@Panda-Pelican Development',
  age: 21,
  birthdate: 'April 19, 2004',
  location: 'Philippines',
  description: "IT Graduate and Full-Stack Developer specializing in secure backend infrastructure, modern web applications, and AI-integrated systems. Highly proficient in C#, NodeJS, and React, with a strong foundation in Linux system administration.",
  phone: '+63-9525694638',
  website: 'https://pandadevelopment.net',
  github: 'https://github.com/SkieAdmin',
  githubUsername: 'SkieAdmin',
  avatar: '/images/profile.png',
  college: "St. Michael's College of Iligan Inc.",
  status: 'Graduate (SY 2025-2026)',
  degree: 'Bachelor of Science in Information Technology',
  schoolYear: 'S.Y. 2022-2026',
  skills: {
    languages: [
      'C# (.NET, WinForms, WPF)',
      'Python (Django)',
      'JavaScript (Node.js, React)',
      'PHP',
      'C++',
      'Lua'
    ],
    databases: ['MySQL', 'MongoDB'],
    infrastructure: [
      'Advanced Linux System Administration',
      'Cybersecurity Operations',
      'Cloud Fundamentals (Azure)'
    ],
    aiTools: [
      'Claude Code',
      'VS Code AI Integration (Claude Extension)',
      'DeepSeek',
      'Model Context Protocol (MCP) Orchestration'
    ],
    hardware: [
      'Hardware Prototyping',
      'Arduino-based Embedded Systems',
      'IoT Integration'
    ]
  },
  projects: [
    {
      name: 'PandaAuth System',
      description: 'Advanced key system authentication platform with secure integration, licensing, and automated entitlement checks',
      url: 'https://pandadevelopment.net',
      tech: ['NodeJS', 'ExpressJS', 'MongoDB']
    },
    {
      name: 'Clinic Web Application',
      description: 'Full-stack healthcare platform with LLM-assisted capabilities and Speech-To-Text APIs for patient record management',
      url: 'https://github.com/SkieAdmin',
      tech: ['Python', 'Django', 'REST APIs']
    },
    {
      name: 'VeggieScan',
      description: 'Visual diagnosis application to detect vegetable freshness and contamination using YOLOv8 and LLM models',
      url: 'https://github.com/SkieAdmin',
      tech: ['Python', 'YOLOv8', 'AI/ML']
    },
    {
      name: 'GitHub Projects',
      description: 'Various open-source projects and contributions',
      url: 'https://github.com/SkieAdmin',
      tech: ['JavaScript', 'C#', 'React']
    }
  ],
  about: `I'm a 21-year-old Software Developer and Systems Integrator, a proud graduate of St. Michael's College of Iligan Inc. (SY 2025-2026) with a BS in Information Technology.
          With over 7 years of programming experience, I specialize in secure backend infrastructure, modern web applications, and AI-integrated systems.
          I'm highly proficient in C#, NodeJS, React, and Python, with a strong foundation in Linux system administration and cybersecurity.
          I leverage advanced AI development tooling like Claude Code to accelerate development cycles, write robust logic, and deploy scalable solutions.`,
  experience: [
    {
      title: 'Backend Infrastructure Engineer',
      company: 'PandaAuth System - Panda Development',
      period: '2020 - Present',
      description: 'Developed and maintained server-side infrastructure for an advanced key system authentication platform with secure integration, licensing, and automated entitlement checks'
    },
    {
      title: 'Full-Stack Developer',
      company: 'Clinic Web Application',
      period: '2024 - 2025',
      description: 'Engineered complete backend infrastructure for a healthcare platform using Python/Django, integrating LLM-assisted capabilities and Speech-To-Text APIs'
    },
    {
      title: 'Software Engineer (AI/ML)',
      company: 'VeggieScan',
      period: '2025',
      description: 'Developed a visual diagnosis application using YOLOv8 for vegetable freshness detection, powered by Large Language Models'
    },
    {
      title: '.NET / C# Developer',
      company: 'Independent',
      period: '2018 - Present',
      description: 'Developing enterprise applications and backend services using .NET framework, WinForms, and WPF'
    }
  ],
  certificates: [
    {
      title: 'TOPCIT Certificate',
      issuer: 'IITP (Institute for Information & Communications Technology Promotion)',
      date: 'December 10, 2025',
      category: 'Certification',
      details: 'Level 3 | Score: 404/1000 | Certificate No. TL2506002251',
      icon: 'fas fa-certificate',
      image: '/images/certificates/topcit-certification.jpg'
    },
    {
      title: 'Best Oral Presentation',
      issuer: 'St. Michael\'s College of Iligan Inc.',
      date: 'March 5, 2026',
      category: 'Award',
      details: 'Track 4: Environmental Sustainability and Stewardship of Creation - Undergraduate Category, 6th International Research Congress',
      icon: 'fas fa-trophy',
      image: '/images/certificates/best-oral-presentation.jpg'
    },
    {
      title: 'Best Paper Presentation',
      issuer: 'St. Michael\'s College of Iligan Inc.',
      date: 'March 5, 2026',
      category: 'Award',
      details: 'Track 4: Environmental Sustainability and Stewardship of Creation - Undergraduate Category, 6th International Research Congress',
      icon: 'fas fa-trophy',
      image: '/images/certificates/best-paper-presentation.jpg'
    },
    {
      title: 'Research Paper Presenter',
      issuer: 'St. Michael\'s College of Iligan Inc.',
      date: 'March 4-5, 2026',
      category: 'Recognition',
      details: '6th International Research Congress: Marian-Inspired Research for Social Transformation',
      icon: 'fas fa-award',
      image: '/images/certificates/research-congress-cert.jpg'
    },
    {
      title: '4th Year Representative Recognition',
      issuer: 'College of Computer Studies, St. Michael\'s College of Iligan Inc.',
      date: 'March 18, 2026',
      category: 'Recognition',
      details: 'In recognition of invaluable service and commitment as 4th Year Representative, AY 2025-2026',
      icon: 'fas fa-award',
      image: '/images/certificates/4th-year-rep-cert.jpg'
    },
    {
      title: 'CISCO Routing & Switching - IP Telephony Seminar',
      issuer: 'Rivan IT Training Systems',
      date: 'March 10, 2026',
      category: 'Seminar',
      details: 'Educational Tour for CISCO Routing & Switching - IP Telephony',
      icon: 'fas fa-network-wired',
      image: '/images/certificates/cisco-seminar.jpg'
    }
  ]
};

// Home Route
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    data: portfolioData
  });
});

// About Route
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    data: portfolioData
  });
});

// Projects Route
router.get('/projects', (req, res) => {
  res.render('projects', {
    title: 'My Projects',
    data: portfolioData
  });
});

// Skills Route
router.get('/skills', (req, res) => {
  res.render('skills', {
    title: 'Skills & Technologies',
    data: portfolioData
  });
});

// Contact Route
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Me',
    data: portfolioData
  });
});

// API endpoint for contact form (if needed later)
router.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Here you can add email functionality or database storage
  console.log('Contact form submission:', { name, email, message });

  res.json({
    success: true,
    message: 'Thank you for your message! I will get back to you soon.'
  });
});

export default router;
