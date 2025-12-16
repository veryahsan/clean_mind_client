# Clean Mind Client

React + Vite frontend application for the Clean Mind project.

## 🚀 Quick Start

**For detailed setup and commands, see [QUICK_START.md](./QUICK_START.md)**

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Client runs on: `http://localhost:5173`

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── pages/
│   └── accounts/
│       ├── Login.jsx
│       ├── Register.jsx
│       └── CreateSpecialist.jsx
├── services/
│   └── api.js          # Axios API configuration
├── styles/
│   └── main.scss       # Global styles
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## 🔗 Backend Integration

The client connects to the Django backend API:
- **Development:** Uses Vite proxy (`/api` → `http://localhost:3000`)
- **Production:** Set `VITE_API_BASE_URL` environment variable

## 📝 API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/user/` - Get current user (requires auth)

## 🌐 Deployment

See [QUICK_START.md](./QUICK_START.md) for deployment options including:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 📖 Documentation

- [Quick Start Guide](./QUICK_START.md) - Complete setup and workflow guide
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
