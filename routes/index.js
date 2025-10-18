import express from 'express';

const router = express.Router();

// Portfolio data
const portfolioData = {
  fullName: 'Kerneil Rommel S. Gocotano',
  nickname: 'Skie',
  name: 'Kerneil.net',
  title: 'Software Engineer & Senior Web Developer',
  company: 'Panda-Pelican Development',
  companyHandle: '@Panda-Pelican Development',
  age: 21,
  birthdate: 'April 19, 2004',
  location: 'Philippines',
  description: "I'm a 21-year-old graduating student from St. Michael's College of Iligan Inc., passionate about building innovative web solutions using modern JavaScript technologies.",
  phone: '+63-9525694638',
  website: 'https://pandadevelopment.net',
  github: 'https://github.com/SkieAdmin',
  githubUsername: 'SkieAdmin',
  avatar: 'https://github.com/SkieAdmin.png',
  college: "St. Michael's College of Iligan Inc.",
  status: 'Graduating Student',
  skills: {
    languages: [
      '.NET / C# (since 2018)',
      'C++ (since 2019)',
      'JavaScript (NodeJS, ExpressJS, ReactJS)'
    ],
    databases: ['MySQL', 'MongoDB']
  },
  projects: [
    {
      name: 'Panda Development',
      description: 'Main development portfolio and services platform',
      url: 'https://pandadevelopment.net',
      tech: ['NodeJS', 'ExpressJS', 'MongoDB']
    },
    {
      name: 'GitHub Projects',
      description: 'Various open-source projects and contributions',
      url: 'https://github.com/SkieAdmin',
      tech: ['JavaScript', 'ReactJS', 'MySQL']
    }
  ],
  about: `I'm a 21-year-old Web Developer and Software Engineer currently pursuing my degree at St. Michael's College of Iligan Inc.
          With over 7 years of programming experience, I've been developing with .NET/C# since 2018 and C++ since 2019.
          I specialize in full-stack development using JavaScript (NodeJS, ExpressJS, ReactJS), C#/.NET, and C++.
          I'm passionate about creating efficient, scalable applications and continuously learning new technologies.`,
  experience: [
    {
      title: 'Full-Stack Developer',
      company: 'Panda Development',
      period: '2020 - Present',
      description: 'Building web applications using modern JavaScript frameworks, .NET/C#, and databases'
    },
    {
      title: '.NET / C# Developer',
      company: 'Independent',
      period: '2018 - Present',
      description: 'Developing enterprise applications and backend services using .NET framework and C#'
    },
    {
      title: 'C++ Developer',
      company: 'Independent',
      period: '2019 - Present',
      description: 'Creating high-performance applications and system-level programming with C++'
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
