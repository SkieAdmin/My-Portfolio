# Portfolio Website - Skie

A modern, responsive portfolio website built with **ExpressJS** using **ES6+ module syntax**.

## Features

- ✨ Modern and clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Fast and lightweight
- 🎨 Smooth animations and transitions
- 🚀 Built with ES6+ modules
- 📝 Contact form with API endpoint
- 🎯 SEO friendly

## Tech Stack

- **Backend**: ExpressJS (ES6+ modules)
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## Project Structure

```
Portfolio/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── routes/
│   └── index.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── about.ejs
│   ├── projects.ejs
│   ├── skills.ejs
│   ├── contact.ejs
│   ├── 404.ejs
│   └── error.ejs
├── server.js
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Express:
```bash
npm install express
```

3. Install EJS (optional, if not auto-installed):
```bash
npm install ejs
```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## Available Routes

- `/` - Home page
- `/about` - About me
- `/projects` - My projects
- `/skills` - Skills and technologies
- `/contact` - Contact form
- `/api/contact` - POST endpoint for contact form

## Customization

### Update Personal Information

Edit the `portfolioData` object in `routes/index.js`:

```javascript
const portfolioData = {
  name: 'Your Name',
  title: 'Your Title',
  // ... update other fields
};
```

### Modify Styles

Edit `public/css/style.css` to customize:
- Colors (CSS variables in `:root`)
- Layouts
- Animations
- Responsive breakpoints

### Add New Routes

Add routes in `routes/index.js`:

```javascript
router.get('/new-page', (req, res) => {
  res.render('new-page', { title: 'New Page' });
});
```

## Features to Add (Optional)

- [ ] Blog section
- [ ] Dark mode toggle
- [ ] Email integration for contact form
- [ ] Database integration
- [ ] Admin panel
- [ ] Analytics
- [ ] Testimonials section
- [ ] Resume download

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

**Skie**
- GitHub: [@SkieAdmin](https://github.com/SkieAdmin)
- Website: [pandadevelopment.net](https://pandadevelopment.net)

---

Built with ❤️ using ExpressJS and ES6+ JavaScript
