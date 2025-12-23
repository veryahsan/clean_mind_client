# 🚀 Quick Cheat Sheet

## Client (React)
```bash
cd ~/Desktop/clean_mind_client
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

## Server (Django)
```bash
cd ~/Desktop/clean_mind_server
source venv/bin/activate
python manage.py runserver 3000    # Start server (port 3000)
python manage.py migrate           # Run migrations
python manage.py createsuperuser   # Create admin user
```

## Git Commands
```bash
# Client
cd ~/Desktop/clean_mind_client
git add .
git commit -m "message"
git push

# Server
cd ~/Desktop/clean_mind_server
git add .
git commit -m "message"
git push
```

## Start Both Servers
**Terminal 1:**
```bash
cd ~/Desktop/clean_mind_server && source venv/bin/activate && python manage.py runserver 3000
```

**Terminal 2:**
```bash
cd ~/Desktop/clean_mind_client && npm run dev
```

## URLs
- Client: http://localhost:5173
- Server: http://localhost:3000
- Admin: http://localhost:3000/admin/


