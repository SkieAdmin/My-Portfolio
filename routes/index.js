import express from 'express';

const router = express.Router();

const BIRTHDATE = new Date(2004, 3, 19); // April 19, 2004

const ageOn = (date) => {
  let age = date.getFullYear() - BIRTHDATE.getFullYear();
  const hadBirthday = date.getMonth() > BIRTHDATE.getMonth()
    || (date.getMonth() === BIRTHDATE.getMonth() && date.getDate() >= BIRTHDATE.getDate());
  return hadBirthday ? age : age - 1;
};

// Certificates keep their original scans; thumb/ and full/ hold web-sized copies.
const certificate = (file, cert) => ({
  ...cert,
  image: `/images/certificates/${file}`,
  thumb: `/images/certificates/thumb/${file}`,
  full: `/images/certificates/full/${file}`
});

// Portfolio data
const portfolioData = {
  fullName: 'Kerneil Rommel S. Gocotano',
  firstName: 'Kerneil',
  lastName: 'Gocotano',
  nickname: 'Skie',
  title: 'Software Developer & Systems Integrator',
  currentRole: {
    title: 'IT Instructor',
    org: 'Phoenix Publishing Library',
    location: 'Lapu-Lapu City, Cebu'
  },
  location: 'Lapu-Lapu City, Cebu',
  country: 'Philippines',
  phone: '+63-9525694638',
  phoneDisplay: '+63 952 569 4638',
  website: 'https://pandadevelopment.net',
  github: 'https://github.com/SkieAdmin',
  githubUsername: 'SkieAdmin',
  facebook: 'https://www.facebook.com/SkieAdmin',
  youtube: 'https://www.youtube.com/@SkieHacker',
  badgePhoto: '/images/profile-card.jpg',
  college: "St. Michael's College of Iligan Inc.",
  degree: 'Bachelor of Science in Information Technology',
  schoolYear: '2022 – 2026',
  about: [
    "I teach IT at Phoenix Publishing Library in Lapu-Lapu City, Cebu, where I've moved after graduating from St. Michael's College of Iligan with a BS in Information Technology.",
    "Before the classroom there were seven years of shipping code. I build secure backend infrastructure, web applications, and AI-integrated systems, mostly in C#, Node.js, Python, and React, on Linux servers I run myself.",
    'I use AI tooling like Claude Code and MCP to move faster without cutting corners, and I take projects all the way from the web down to embedded hardware.'
  ],
  experience: [
    {
      title: 'IT Instructor',
      org: 'Phoenix Publishing Library',
      location: 'Lapu-Lapu City, Cebu',
      period: '2026 – Present',
      current: true,
      description: 'Teaching information technology and programming, guiding learners from computer fundamentals through hands-on software projects.'
    },
    {
      title: 'Software Engineer, AI/ML',
      org: 'VeggieScan',
      period: '2025',
      description: 'Built a visual diagnosis app that detects vegetable freshness and contamination with YOLOv8, with a large language model explaining each verdict.'
    },
    {
      title: 'Full-Stack Developer',
      org: 'Clinic Web Application',
      period: '2024 – 2025',
      description: 'Engineered the backend of a healthcare platform in Python and Django, adding LLM-assisted features and speech-to-text for patient records.'
    },
    {
      title: 'Backend Infrastructure Engineer',
      org: 'PandaAuth System, Panda Development',
      period: '2020 – Present',
      description: 'Develop and maintain the server-side infrastructure of a key-system authentication platform: client integration, licensing, and automated entitlement checks.'
    },
    {
      title: '.NET / C# Developer',
      org: 'Independent',
      period: '2018 – Present',
      description: 'Building desktop applications and backend services with .NET, WinForms, and WPF.'
    }
  ],
  projects: [
    {
      name: 'PandaAuth System',
      role: 'Backend infrastructure engineer',
      description: 'A key-system authentication platform: secure client integration, licensing, and automated entitlement checks.',
      url: 'https://pandadevelopment.net',
      linkLabel: 'Visit pandadevelopment.net',
      tech: ['Node.js', 'Express', 'MongoDB']
    },
    {
      name: 'Clinic Web Application',
      role: 'Full-stack developer',
      description: 'A healthcare platform for patient records, with LLM-assisted features and speech-to-text to cut manual data entry.',
      url: 'https://github.com/SkieAdmin',
      linkLabel: 'View on GitHub',
      tech: ['Python', 'Django', 'REST APIs', 'LLM']
    },
    {
      name: 'VeggieScan',
      role: 'Software engineer, AI/ML',
      description: 'Visual diagnosis of vegetable freshness and contamination. YOLOv8 finds the problem; a language model explains the verdict.',
      url: 'https://github.com/SkieAdmin',
      linkLabel: 'View on GitHub',
      tech: ['Python', 'YOLOv8', 'LLM']
    }
  ],
  // Listed top to bottom; the 3D tower draws the last layer at the base.
  stack: [
    { name: 'AI tooling', label: 'AI tooling', items: ['Claude Code', 'VS Code AI integration', 'DeepSeek', 'MCP orchestration'] },
    { name: 'Web & desktop UI', label: 'UI', items: ['React', 'JavaScript', 'WinForms', 'WPF'] },
    { name: 'Languages & backend', label: 'Backend', items: ['C# / .NET', 'Node.js & Express', 'Python & Django', 'PHP', 'C++', 'Lua', 'REST APIs'] },
    { name: 'Data', label: 'Data', items: ['MySQL', 'MongoDB'] },
    { name: 'Infrastructure & security', label: 'Infrastructure', items: ['Linux system administration', 'Cybersecurity operations', 'VPS & dedicated servers (Contabo)', 'SMTP server setup'] },
    { name: 'Hardware & embedded', label: 'Hardware', items: ['Arduino embedded systems', 'Hardware prototyping', 'IoT integration'] }
  ],
  certificates: [
    certificate('best-oral-presentation.jpg', {
      title: 'Best Oral Presentation',
      issuer: "St. Michael's College of Iligan Inc.",
      date: 'March 5, 2026',
      category: 'Award',
      details: 'Track 4: Environmental Sustainability and Stewardship of Creation, Undergraduate Category, 6th International Research Congress'
    }),
    certificate('best-paper-presentation.jpg', {
      title: 'Best Paper Presentation',
      issuer: "St. Michael's College of Iligan Inc.",
      date: 'March 5, 2026',
      category: 'Award',
      details: 'Track 4: Environmental Sustainability and Stewardship of Creation, Undergraduate Category, 6th International Research Congress'
    }),
    certificate('google-ai-intro.jpg', {
      title: 'Introduction to AI',
      issuer: 'Google, Coursera',
      date: 'June 23, 2026',
      category: 'Certification',
      details: 'Google AI Essentials. Verify ID: C0L0H42QQH3O'
    }),
    certificate('google-ai-prompting.jpg', {
      title: 'Discover the Art of Prompting',
      issuer: 'Google, Coursera',
      date: 'June 23, 2026',
      category: 'Certification',
      details: 'Google AI Essentials. Verify ID: VZDRZT11KC71'
    }),
    certificate('google-ai-responsible.jpg', {
      title: 'Use AI Responsibly',
      issuer: 'Google, Coursera',
      date: 'June 23, 2026',
      category: 'Certification',
      details: 'Google AI Essentials. Verify ID: EAQI1AZ7UOH9'
    }),
    certificate('google-ai-productivity.jpg', {
      title: 'Maximize Productivity With AI Tools',
      issuer: 'Google, Coursera',
      date: 'June 23, 2026',
      category: 'Certification',
      details: 'Google AI Essentials. Verify ID: I7XT85EPCKDF'
    }),
    certificate('topcit-certification.jpg', {
      title: 'TOPCIT Certificate',
      issuer: 'IITP (Institute for Information & Communications Technology Promotion)',
      date: 'December 10, 2025',
      category: 'Certification',
      details: 'Level 3, score 404/1000. Certificate No. TL2506002251'
    }),
    certificate('research-congress-cert.jpg', {
      title: 'Research Paper Presenter',
      issuer: "St. Michael's College of Iligan Inc.",
      date: 'March 4–5, 2026',
      category: 'Recognition',
      details: '6th International Research Congress: Marian-Inspired Research for Social Transformation'
    }),
    certificate('4th-year-rep-cert.jpg', {
      title: '4th Year Representative',
      issuer: "College of Computer Studies, St. Michael's College of Iligan Inc.",
      date: 'March 18, 2026',
      category: 'Recognition',
      details: 'For service and commitment as 4th Year Representative, AY 2025–2026'
    }),
    certificate('cisco-seminar.jpg', {
      title: 'CISCO Routing & Switching: IP Telephony',
      issuer: 'Rivan IT Training Systems',
      date: 'March 10, 2026',
      category: 'Seminar',
      details: 'Educational tour for CISCO Routing & Switching, IP Telephony'
    })
  ]
};

// Home: the whole CV lives on one page
router.get('/', (req, res) => {
  res.render('index', {
    title: `${portfolioData.firstName} ${portfolioData.lastName}`,
    data: { ...portfolioData, age: ageOn(new Date()) }
  });
});

// The old multi-page routes now point at their section of the CV
const legacySections = {
  '/about': 'now',
  '/projects': 'work',
  '/skills': 'stack',
  '/contact': 'contact'
};
Object.entries(legacySections).forEach(([path, section]) => {
  router.get(path, (req, res) => res.redirect(301, `/#${section}`));
});

// API endpoint for contact form (if needed later)
router.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Here you can add email functionality or database storage
  console.log('Contact form submission:', { name, email, message });

  res.json({
    success: true,
    message: 'Message sent. I will get back to you soon.'
  });
});

export default router;
