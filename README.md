# Portfolio Website - Skie

The online CV of Kerneil "Skie" Gocotano, IT Instructor at Phoenix Publishing Library (Lapu-Lapu City, Cebu) and software developer. Built with **ExpressJS** and **EJS** using **ES6+ module syntax**.

## Features

- 🪪 Interactive 3D ID badge on a satin lanyard (Three.js). Drag it, flick it to see the back
- 📄 The whole CV on one page: now, experience, work, stack, certificates, contact
- 🧱 Isometric 3D stack from embedded hardware up to AI tooling
- 🖼️ Cover-flow certificate shelf with a full-size viewer
- 🖨️ "Save CV as PDF" prints a clean one-column CV
- 📱 Responsive, keyboard accessible, respects reduced motion
- 📝 Contact form with API endpoint

## Tech Stack

- **Backend**: ExpressJS (ES6+ modules)
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Three.js (loaded from jsDelivr)
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Archivo, variable width)

## Project Structure

```
Portfolio/
├── public/
│   ├── css/style.css
│   ├── js/
│   │   ├── main.js        # nav, tilt, stack, certificate shelf, contact form
│   │   └── badge.js       # the 3D badge (ES module)
│   └── images/
│       ├── profile-card.jpg            # badge photo
│       └── certificates/
│           ├── *.jpg                   # original scans
│           ├── thumb/                  # shelf thumbnails
│           └── full/                   # viewer images
├── routes/index.js        # portfolio data + routes
├── views/
│   ├── partials/{header,footer}.ejs
│   ├── index.ejs
│   ├── 404.ejs
│   └── error.ejs
├── server.js
└── package.json
```

## Running the Application

```bash
npm install
npm run dev   # auto-reload
npm start     # production
```

The server starts on `http://localhost:5100` (set `PORT` to change it).

## Routes

- `/` - The CV
- `/about`, `/projects`, `/skills`, `/contact` - Redirect to their section of the CV
- `/api/contact` - POST endpoint for the contact form

## Customization

Edit the `portfolioData` object in `routes/index.js` to update roles, experience, projects, the stack layers, and certificates. The badge's front and back are drawn from the same data.

When adding a certificate, put the scan in `public/images/certificates/` and add resized copies to `thumb/` (560px) and `full/` (1800px).

Colors and type live as CSS variables in `:root` in `public/css/style.css`.

## License

MIT

## Author

**Kerneil "Skie" Gocotano**
- GitHub: [@SkieAdmin](https://github.com/SkieAdmin)
- Website: [pandadevelopment.net](https://pandadevelopment.net)
