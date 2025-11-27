# 💖 Happy Thoughts API

> _“The backend powering happiness — one joyful thought at a time.”_

A fully featured REST API built with **Express**, **MongoDB**, **Mongoose**, **JWT authentication**, and **bcrypt**.  
This API supports user registration, login, posting happy thoughts, liking, updating, and deleting — all with secure ownership protection.

🌐 **Live API:**  
**https://js-project-api-j7vv.onrender.com**

---

## 🏗️ Architecture

```mermaid
flowchart TD
    User[🙂 User in browser] -->|Types & clicks| ReactApp[💖 Happy Thoughts Frontend (React)]
    ReactApp -->|HTTPS fetch()| API[🧠 Happy Thoughts API (Express on Render)]
    API -->|Mongoose queries| DB[(🍃 MongoDB Atlas)]

    subgraph Frontend
      ReactApp
    end

    subgraph Backend
      API --> Auth[🔐 Auth (JWT + bcrypt)]
      API --> Thoughts[💬 Thoughts routes]
    end

---

## 🧠 Overview

This backend was created for the **Happy Thoughts** project, Technigo.  
It includes:

- 🗄️ Express server  
- 🍃 MongoDB Atlas database  
- 🔐 JWT authentication  
- 👤 User accounts (signup + login)  
- 💬 Thoughts CRUD routes  
- ❤️ Like functionality  
- 🚫 Owner-protected editing & deletion  
- 🧪 Validations and error handling  
- 🌱 Database seed support  
- 🚀 Deployment on Render  

---

## ✨ Features

- ✍️ **Post thoughts** (5–140 characters)  
- 🔐 **Secure authentication** (signup & login)  
- 📝 **Only the owner can edit/delete** their thoughts  
- ❤️ **Like any thought** (auth required)  
- 🔍 **Filtering, sorting & pagination**  
- 🔎 **Full text search** (`q=` parameter)  
- 🧵 `tags` field supported  
- 📜 Auto-generated docs at `/`  
- 🌱 Optional database seeding with `data.json`  

---

## 🧩 Tech Stack

| Technology | Purpose |
|-----------|----------|
| 🚀 Express | Web server & routing |
| 🍃 MongoDB Atlas | Cloud database |
| 🧬 Mongoose | Models & validation |
| 🔐 JSON Web Tokens | Authentication |
| 🧂 bcryptjs | Password hashing |
| 🌍 CORS | Cross-origin support |
| ☁️ Render | Deployment |
| 🧪 Node.js | JavaScript runtime |
---

---

## 🪄 Getting Started (Local)

1️⃣ Install dependencies  
```bash
npm install
```

2️⃣ Start the development server  
```bash
npm run dev
```

Server runs at:  
**http://localhost:8080**

3️⃣ Seed the database (optional)  
```bash
npm run seed
```

4️⃣ Production start  
```bash
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```
MONGO_URL=your_mongo_atlas_url
JWT_SECRET=yoursecretstring
PORT=8080
```

---

## 📚 API Endpoints

### Root — Auto Docs  
```
GET /
```
Returns a full list of routes using **express-list-endpoints**.

---

# 🔐 Authentication

### ➕ POST /auth/signup  
Create a new user.

**Body:**
```json
{
  "username": "ulrika",
  "password": "secret123"
}
```

---

### 🔑 POST /auth/login  
Log in a user and receive a JWT.

**Body:**
```json
{
  "username": "ulrika",
  "password": "secret123"
}
```

---

# 💬 Thoughts Routes

**All modifying routes require:**  
```
Authorization: Bearer <token>
```

---

### 📥 GET /thoughts  
Fetch thoughts with full filtering support:

| Query | Description |
|-------|-------------|
| page | pagination |
| limit | items per page |
| q | full-text search |
| minHearts | filter by hearts |
| newerThan | ISO date filter |
| tag | comma-separated tags |
| sort | createdAt / hearts |
| order | asc / desc |

---

### 📄 GET /thoughts/:id  
Fetch a single thought.

---

### ✍️ POST /thoughts _(auth required)_  
Create a new thought.

**Body:**
```json
{
  "message": "Hello world!",
  "author": "Ulrika",
  "tags": ["fun"]
}
```

---

### 🛠️ PATCH /thoughts/:id _(auth + owner only)_  
Update a thought you own.

---

### ❌ DELETE /thoughts/:id _(auth + owner only)_  
Delete a thought you own.

---

### ❤️ POST /thoughts/:id/like _(auth required)_  
Increase the `hearts` count.

---

## 🧪 Error Handling

| Status | Meaning |
|--------|----------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden (not owner) |
| 404 | Not found |
| 409 | Duplicate username |
| 500 | Internal error |

---

## 🌱 Seed Script

Run:
```bash
npm run seed
```

- Clears old thoughts  
- Loads data from `data.json`  
- Inserts fresh seed data  

---

## 🚀 Deployment (Render)

**Start command:**  
```
node src/server.js
```

**Environment variables:**  
- `MONGO_URL`
- `JWT_SECRET`
- `PORT=8080`

Free-tier instances hibernate — first request may take a few seconds.

---

## 📱 Frontend Integration

This API supports all features needed by a Happy Thoughts React frontend:

- Signup & Login  
- Authenticated posting  
- Liking  
- Editing & deleting (owner only)  
- Showing error messages  
- Pagination, filtering, and search  

---

## 👩‍💻 Author

Built with 💖, ☕, curiosity, and collaborative help from **ChatGPT** by **Ulrika Einerbrant**.  
Frontend developer passionate about accessible, joyful user experiences.

---

## 🪶 License

Released under the **MIT License**.

---

## ⭐ Connect

🌐 **API Live:** https://js-project-api-j7vv.onrender.com  
💻 **GitHub Repo:** https://github.com/UlrikaRakkaBrant/js-project-api  
🧭 **Portfolio:** https://ulrikasportfolio.netlify.app  
💼 **LinkedIn:** https://www.linkedin.com/in/ulrika-einebrant/
