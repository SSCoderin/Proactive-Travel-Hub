# Project Setup Guide

This document explains how to run the **Proactive Travel Hub** project locally using:

- Manual setup (Backend + Frontend)
- Docker (recommended)

---

## Backend Setup (FastAPI + MySQL)

### 1. Environment Variables

Create a `.env` file at the following path:

backend/app/.env

routeros
Copy code

Add the following values:

```env
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=proactivetravelhub
Make sure MySQL is running locally and the database exists.

2. Create Virtual Environment
From the backend directory:

bash
Copy code
cd backend
python -m venv venv
Activate the virtual environment:

Windows

bash
Copy code
venv\Scripts\activate
macOS / Linux

bash
Copy code
source venv/bin/activate
3. Install Dependencies
bash
Copy code
pip install -r requirements.txt
4. Run Backend Server
bash
Copy code
cd app
uvicorn main:app --reload
Backend will be available at:

dts
Copy code
http://127.0.0.1:8000
Swagger Docs:

dts
Copy code
http://127.0.0.1:8000/docs
Frontend Setup (Next.js + Clerk)
1. Environment Variables
Create a .env.local file at:

stylus
Copy code
proactive_travel_hub/.env.local
Add the provided environment variables:

env
Copy code
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here
⚠️ Clerk credentials are temporary and will be removed after 2 days.

2. Install Dependencies
bash
Copy code
cd proactive_travel_hub
npm install
3. Run Frontend
bash
Copy code
npm run dev
Frontend will be available at:

dts
Copy code
http://localhost:3000
Docker Setup (Recommended)
Docker runs both frontend and backend with a single command.

Prerequisites
Docker

Docker Compose

Run Project with Docker
From the project root:

bash
Copy code
docker compose up --build
Services:

Frontend → http://localhost:3000

Backend → http://localhost:8000

SQLite is used by default in Docker for simplicity.
Schema is compatible with MySQL/PostgreSQL
```
