# Commission Management Module

This project is a full-stack Commission Management Module, featuring a Laravel backend, a React frontend, and a MySQL database, all orchestrated with Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Docker Desktop**: Includes Docker Engine and Docker Compose.
    *   [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
    *   [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
    *   [Install for Linux](https://docs.docker.com/engine/install/ubuntu/) (or your respective Linux distribution)

## How to Run the Project

The project can be run using Docker Compose, which will set up the backend, frontend, and database services.

### Accessible URLs

Once the project is running:

*   **Frontend (React)**: Accessible at [http://localhost:3000](http://localhost:3000)
*   **Backend (Laravel API)**: Accessible at [http://localhost:8000](http://localhost:8000)

### 1. For Linux Users

1.  **Navigate to the project root:**
    Open your terminal and change directory to the root of this project where `docker-compose.yml` is located.

2.  **Set directory permissions (if needed):**
    Laravel requires specific write permissions for its `storage` and `bootstrap/cache` directories. If you encounter permission errors after starting the containers, you might need to adjust them.
    The Dockerfile attempts to set these permissions for the `www-data` user, but if you're mounting volumes, the host user's permissions can interfere.

    To ensure the `backend` service can write to necessary directories, you might need to run the following commands *before* `docker-compose up` or after the containers are created if `www-data` user ID differs:

    ```bash
    sudo chmod -R 775 backend/storage backend/bootstrap/cache
    sudo chown -R $USER:www-data backend/storage backend/bootstrap/cache
    ```
    *Note: `$USER` will resolve to your current username. You might need to adjust `www-data` to match the group name used by PHP-FPM inside the container (which is typically `www-data`).*

3.  **Build and Run the containers:**
    ```bash
    docker-compose build
    docker-compose up -d
    ```

4.  **Perform initial setup inside the backend container:**
    ```bash
    docker-compose exec backend composer install
    docker-compose exec backend php artisan key:generate
    docker-compose exec backend php artisan migrate
    ```

5.  **Install frontend dependencies (optional, as Dockerfile does this but good for local dev):**
    ```bash
    docker-compose exec frontend npm install
    ```

### 2. For Windows Users

#### Using PowerShell (or Command Prompt):

1.  **Navigate to the project root:**
    Open PowerShell (or Command Prompt) and navigate to the root directory of this project where `docker-compose.yml` is located.

2.  **Build and Run the containers:**
    ```powershell
    docker-compose build
    docker-compose up -d
    ```

3.  **Perform initial setup inside the backend container:**
    ```powershell
    docker-compose exec backend composer install
    docker-compose exec backend php artisan key:generate
    docker-compose exec backend php artisan migrate
    ```

4.  **Install frontend dependencies (optional, as Dockerfile does this but good for local dev):**
    ```powershell
    docker-compose exec frontend npm install
    ```

#### Using WSL (Windows Subsystem for Linux):

1.  **Navigate to the project root:**
    Open your WSL terminal (e.g., Ubuntu) and navigate to the project directory. If your project is on a Windows drive (e.g., `C:`), it will be mounted under `/mnt/c/`. For example: `cd /mnt/c/Users/YourUser/YourProject`.

2.  **Set directory permissions (if needed):**
    Similar to Linux, if you encounter permission issues for Laravel's `storage` or `bootstrap/cache` directories, you might need to set them. In WSL, file system permissions generally behave like Linux.

    ```bash
    chmod -R 775 backend/storage backend/bootstrap/cache
    chown -R $(id -un):www-data backend/storage backend/bootstrap/cache
    ```
    *Note: `$(id -un)` will get your current WSL username. Adjust `www-data` if necessary.*

3.  **Build and Run the containers:**
    ```bash
    docker-compose build
    docker-compose up -d
    ```

4.  **Perform initial setup inside the backend container:**
    ```bash
    docker-compose exec backend composer install
    docker-compose exec backend php artisan key:generate
    docker-compose exec backend php artisan migrate
    ```

5.  **Install frontend dependencies (optional, as Dockerfile does this but good for local dev):**
    ```bash
    docker-compose exec frontend npm install
    ```

### Stopping the Project

To stop and remove the containers, networks, and volumes (database data will persist in the `db_data` volume by default), run:

```bash
docker-compose down
```

To stop and remove containers, networks, and all volumes (including database data), run:

```bash
docker-compose down -v
```

---

## Troubleshooting

### "Permission denied" errors for `storage` or `bootstrap/cache`

This is a common issue when running Laravel with Docker on systems where host user permissions don't align with the user inside the Docker container (`www-data`).

**Solution:**
Follow the `chmod` and `chown` instructions in the "Linux Users" or "Windows Users (WSL)" section above. Ensure the `www-data` group has write access. If issues persist, you might need to manually inspect the UID/GID inside the container and adjust host permissions accordingly, or change the user Docker runs as in the `backend/Dockerfile`.

### Ports already in use (e.g., `port 8000 already in use`)

This error occurs if another application on your host machine is already using port `8000` or `3000`.

**Solution:**
1.  Identify and stop the conflicting application.
2.  Alternatively, you can modify the `docker-compose.yml` file to map to different host ports. For example, to map backend to `8001` and frontend to `3001`:

    ```yaml
    # In docker-compose.yml
    services:
      backend:
        ports:
          - "8001:8000" # Change host port from 8000 to 8001
      frontend:
        ports:
          - "3001:3000" # Change host port from 3000 to 3001
    ```
    Remember to update `REACT_APP_BACKEND_URL` in `frontend/Dockerfile` if you change the backend port.

### Frontend (React) not connecting to Backend (Laravel)

Ensure the `REACT_APP_BACKEND_URL` in `docker-compose.yml` (and potentially `frontend/Dockerfile`) is correctly set to `http://localhost:8000` (or your chosen backend port). Also, verify the backend container is running without errors.

```bash
docker-compose logs backend
```

Check browser's developer console for network errors.
