# Product Inventory System (Groq AI + JWT + RBAC) ✅

A final-year BTech **full-stack mini project**.

✅ Frontend: React (Vite) + TailwindCSS (Glassmorphism / Liquid Glass)  
✅ Backend: Node.js + Express.js  
✅ DB: MongoDB Atlas (Free Tier)  
✅ AI: **Groq API** (console.groq.com) to generate product descriptions  
✅ Security: JWT Auth, bcrypt hashing, RBAC, validation, sanitization, rate-limiting, Helmet, optional CSRF  

---

## Folder Structure
```
product-inventory-groq-rbac/
  frontend/
  backend/
  README.md
```

---

# ✅ Features

## MVP
- Signup/Login/Logout (JWT)
- Role-Based Access Control (RBAC)
  - **Admin**: Add/Edit products + Generate AI description
  - **User**: View products only
- Product CRUD (admin only for create/edit)
- AI Description generation (Groq)

## Advanced
- Low stock warning (<= 5)
- Search products
- Secure backend: rate limit + sanitization + Helmet

---

# 1) Backend Setup

## Install
```bash
cd backend
npm install
```

## Setup env
```bash
cp .env.example .env
```

Fill:
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`  (from console.groq.com)

## Run
```bash
npm start
```
Backend: `http://localhost:5000`

---

# 2) Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend: `http://localhost:5173`

---

# 3) Create Admin User

All signups are created as **role=user**.

To make yourself admin:
1. Signup once from UI
2. Open MongoDB Atlas → Collections → `users`
3. Change:
```json
"role": "admin"
```

Now login again → admin features enabled.

---

# 4) Groq API Setup (FREE)

1. Go to console.groq.com
2. Create API key
3. Put into backend `.env`:
```
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

---

# Security Notes (Viva Points)

- Password stored as `bcrypt` hash
- JWT token expiration (`JWT_EXPIRES_IN`)
- Token invalidation using `TokenBlacklist` collection on logout
- API validation using `express-validator`
- Input sanitization using `express-mongo-sanitize` and `xss-clean`
- `helmet` sets secure headers
- `express-rate-limit` prevents brute-force attempts
- CSRF optional (ENABLE_CSRF=1). In production use HTTPS.

---

# Deployment (Free Tier)

## A) Backend → Render

1. Push project to GitHub
2. Render → New Web Service
3. Root: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Add ENV vars from `.env`

Render will give a URL like:
```
https://your-backend.onrender.com
```

## B) Frontend → Vercel

1. Vercel → New Project
2. Root: `frontend`
3. Add env:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
```
Deploy ✅

---

## Author
Final Year BTech Mini Project (Groq AI + Inventory + Security).
