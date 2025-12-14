# Commission Management Module

A full-stack application for managing airline commission rules, featuring a **Laravel** backend, **React** frontend, and **MySQL** database, all orchestrated with **Docker Compose**.

---

## Prerequisites

You can run this project using **either** Docker (recommended) **or** a manual local setup.

- **Docker & Docker Compose (v2)** *OR*
- **PHP 8.1+**, **Node.js**, and **MySQL** (for manual installation)
- **Docker**: [Install Docker Engine](https://docs.docker.com/get-docker/)
- ⏱️ **Estimated setup time:** ~2 minutes with Docker

---

## Project Structure

```text
backend/            → Laravel API  
frontend/           → React application  
docker-compose.yml  → Docker orchestration config
README.md           → Project documentation
```

---

## 🚀 Quick Start (Recommended: Docker)
Docker ensures a consistent and hassle-free setup across systems.

### 1.Configure Environment
Before starting the containers, create the backend environment file by copying the example file.
```bash
cp backend/.env.example backend/.env
```
### 2.Start the Project
From the root directory, build and start all containers:
````bash
docker compose up -d --build
````

### 3. Setup Database & Admin User (CRITICAL)
**Wait 10–15 seconds** for the MySQL container to fully initialize, then run the command below to:
 # Generate App Key:

```bash
docker compose exec backend php artisan key:generate
```
# Migrate & Seed Data:

````bash
docker compose exec backend php artisan migrate:fresh --seed
````

### 4. Login Details
After seeding completes, access the application dashboard:

* **URL:** [http://localhost:3000](http://localhost:3000)
* **Email:** `admin@admin.com`
* **Password:** `Password@123`

> The seeded admin user has full access to manage commission rules.

---

## ✅ Running Automated Tests
This project includes an **Automated Feature Test** suite (Laravel) covering:
* Authentication & security rules
* Business logic constraints
* CRUD operations

Run the test suite with:

````bash
docker compose exec backend php artisan test
````

**What is tested?**
* Unauthenticated access is blocked (401 Unauthorized)
* Admin login and token generation
* **Business Logic:** Prevents Origin & Destination from being the same
* **Wildcards:** Verifies "Select All" functionality works correctly

---

## 🛠️ Tech Stack

### Frontend
* React.js
* Axios
* CSS Modules (Responsive UI)

### Backend
* Laravel 11
* Sanctum Authentication

### Database
* MySQL 8.0

### Infrastructure
* Docker
* Docker Compose (v2)

> Docker is the recommended environment to ensure consistency across systems and simplify setup.

---

## ❓ Troubleshooting

### Database Connection Refused
If the migration command fails immediately, the MySQL container may still be starting.
**✅ Solution:**
1. Wait 10 seconds.
2. Re-run step #2 (`migrate:fresh --seed`).

### Port Conflicts
If ports `3000` or `8000` are already in use, update the port mappings in `docker-compose.yml`.

**Example:**
```yaml
ports:
- "8081:8000" # Maps localhost:8081 → container:8000
  ```
  *Make sure to update frontend environment variables if backend ports change.*

---

## 🧩 Alternative: Manual Installation (No Docker)

If Docker is not available, you can run the project locally using the steps below.

### ✅ Prerequisites
* PHP 8.1+ & Composer
* Node.js & npm
* MySQL Server (running locally)

### 🔧 Step 1: Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. **Configure Environment** Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your local database:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=commission_db
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```
   *Ensure the database exists before continuing.*

4. Generate App Key & Seed Database:
   ```bash
   php artisan key:generate
   php artisan migrate:fresh --seed
   ```

5. Start the Backend Server:
   ```bash
   php artisan serve
   ```
   Backend API will be available at: `http://127.0.0.1:8000`

### 🎨 Step 2: Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```
   The application will be available at: `http://localhost:3000`

---

## ✅ Summary
* Fully containerized with Docker for fast setup
* Manual installation supported (no Docker required)
* Seeded admin user included for immediate access
* Automated tests included for business logic & security

---
**👩‍💻 Author:** Unisha Khatiwada  
