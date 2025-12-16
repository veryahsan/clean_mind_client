# Quick Start Guide - Clean Mind Project

## 📋 Prerequisites
- Node.js and npm installed
- Python 3.x and pip installed
- Git installed

---

## 🚀 Quick Commands Reference

### Client (React) - Port 5173

#### First Time Setup
```bash
cd ~/Desktop/clean_mind_client
npm install
```

#### Start Development Server
```bash
npm run dev
```
**OR** use the script:
```bash
./run-dev.sh
```

The client will be available at: `http://localhost:5173`

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

---

### Server (Django) - Port 3000

#### First Time Setup
```bash
cd ~/Desktop/clean_mind_server
python -m venv venv          # Create virtual environment (if not exists)
source venv/bin/activate     # Activate virtual environment (Mac/Linux)
# OR
venv\Scripts\activate        # Activate on Windows
pip install -r requirements.txt  # Install dependencies
python manage.py migrate     # Run migrations
```

#### Start Development Server
```bash
cd ~/Desktop/clean_mind_server
source venv/bin/activate     # Activate virtual environment
python manage.py runserver 3000
```

The server will be available at: `http://localhost:3000`

#### Create Superuser (Admin)
```bash
python manage.py createsuperuser
```

#### Run Migrations
```bash
python manage.py migrate
```

#### Create Migrations
```bash
python manage.py makemigrations
```

---

## 🔄 Running Both Servers

### Option 1: Two Terminal Windows
**Terminal 1 - Client:**
```bash
cd ~/Desktop/clean_mind_client
npm run dev
```

**Terminal 2 - Server:**
```bash
cd ~/Desktop/clean_mind_server
source venv/bin/activate
python manage.py runserver 3000
```

### Option 2: Background Process
**Start Client:**
```bash
cd ~/Desktop/clean_mind_client
npm run dev &
```

**Start Server:**
```bash
cd ~/Desktop/clean_mind_server
source venv/bin/activate
python manage.py runserver 3000 &
```

---

## 📦 Git Commands - Quick Reference

### Client Repository (clean_mind_client)

```bash
cd ~/Desktop/clean_mind_client

# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline

# Create and switch to new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name

# Merge branch
git checkout master
git merge feature-name
```

### Server Repository (clean_mind_server)

```bash
cd ~/Desktop/clean_mind_server

# Same commands as above
git status
git add .
git commit -m "Your commit message"
git push
git pull
```

---

## 🎯 Daily Workflow

### Starting Development
```bash
# 1. Start Server (Terminal 1)
cd ~/Desktop/clean_mind_server
source venv/bin/activate
python manage.py runserver 3000

# 2. Start Client (Terminal 2)
cd ~/Desktop/clean_mind_client
npm run dev
```

### Making Changes & Pushing
```bash
# After making changes to client
cd ~/Desktop/clean_mind_client
git add .
git commit -m "Added new feature"
git push

# After making changes to server
cd ~/Desktop/clean_mind_server
git add .
git commit -m "Updated API endpoint"
git push
```

---

## 🔧 Common Issues & Solutions

### Client Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Server Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Migrations conflict:**
```bash
python manage.py migrate --run-syncdb
```

**Virtual environment not found:**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📝 Useful Aliases (Optional)

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Client aliases
alias ccd='cd ~/Desktop/clean_mind_client'
alias cdev='cd ~/Desktop/clean_mind_client && npm run dev'
alias cpush='cd ~/Desktop/clean_mind_client && git add . && git commit -m'

# Server aliases
alias scd='cd ~/Desktop/clean_mind_server'
alias srun='cd ~/Desktop/clean_mind_server && source venv/bin/activate && python manage.py runserver 3000'
alias spush='cd ~/Desktop/clean_mind_server && git add . && git commit -m'

# Quick start both
alias start-all='cd ~/Desktop/clean_mind_server && source venv/bin/activate && python manage.py runserver 3000 & cd ~/Desktop/clean_mind_client && npm run dev'
```

After adding aliases, reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

Then use:
- `cdev` - Start client
- `srun` - Start server
- `cpush "message"` - Commit and push client
- `spush "message"` - Commit and push server

---

## 🔗 Important URLs

- **Client:** http://localhost:5173
- **Server API:** http://localhost:3000/api/auth/
- **Server Admin:** http://localhost:3000/admin/
- **Client GitHub:** https://github.com/veryahsan/clean_mind_client
- **Server GitHub:** https://github.com/veryahsan/clean_mind_server

---

## ⚙️ Environment Configuration

### Client (.env - if needed)
```env
VITE_API_BASE_URL=/api/auth/
```

### Server (.env - if needed)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/user/` - Get current user (requires auth)

### Request Format
**Register:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123"
}
```

**Login:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

---

## 🎨 Project Structure

```
clean_mind_client/
├── src/
│   ├── pages/
│   │   └── accounts/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       └── CreateSpecialist.jsx
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── main.scss
└── vite.config.js

clean_mind_server/
├── accounts/
├── config/
└── manage.py
```

---

## 🚨 Troubleshooting Checklist

- [ ] Virtual environment activated? (`source venv/bin/activate`)
- [ ] Dependencies installed? (`pip install -r requirements.txt` / `npm install`)
- [ ] Migrations run? (`python manage.py migrate`)
- [ ] Ports available? (3000 for server, 5173 for client)
- [ ] CORS configured? (Vite proxy handles this in dev)
- [ ] Environment variables set? (if using .env files)

---

**Happy Coding! 🎉**

