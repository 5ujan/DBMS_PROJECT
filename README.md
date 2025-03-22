# Volunteer Management System

## Project Structure
```
.
├── backend
├── database
├── docker-compose.yml
├── frontend
├── nginx.conf
├── node_modules
├── README.md
└── temp.md
```

## Setup Instructions (Without Docker)

### 1. Restore Database
If running without Docker, restore the database before starting the services:
```sh
cd database
mysql -u root -p VOLUNTEER_MANAGEMENT < database.sql
```

### 2. Run Backend
Navigate to the backend directory and start the server:
```sh
cd backend
npm install
npm start
```
- .env file has been included for convenience, so no external api keys(cloudinary) are necessary.

### 3. Run Frontend
Navigate to the frontend directory and start the React application:
```sh
cd frontend
npm install
npm run dev
```

### 4. Nginx Configuration (If applicable)
Ensure `nginx.conf` is properly set up and restart Nginx if needed:
```sh
sudo systemctl restart nginx
```

The application should now be accessible in your browser. 🚀


