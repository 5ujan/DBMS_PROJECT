# Volunteer Management System
This project is a Volunteer Management System designed to facilitate the coordination of volunteers, organizations, donations, and programs efficiently.

**Team Members:**  
- **078BCT093** - Sujan Baskota  
- **078BCT095** - Yugesh KC  
- **078BCT096** - Yujal Shrestha



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

# App in action 
Here is the preview of the major pages and components of the app.
# Landing Page

![Landing Page](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/landing_page.png)

# Login Page

![Login Page](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/login_page.png)

# Register as Volunteer

![Register as Volunteer](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/register_as_volunteer.png)

# Register as Organization

![Register as Organization](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/register_as_organization.png)

# Dashboard

![Dashboard](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/dashboard.png)

# Events Page

![Events Page](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/events_page.png)

# Create Event

![Create Event](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/create_event.png)

# Event Preview

![Event Preview](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/event_preview.png)

# Profile Details

![Profile Details](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/profile_details.png)

# Admin Dashboard

![Admin Dashboard](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/admin_dashboard.png)

# Admin Manage Volunteers

![Admin Manage Volunteers](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/admin_manage_volunteers.png)

# Admin Manage Organizations

![Admin Manage Organizations](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/admin_manage_organizations.png)

# Admin Manage Events

![Admin Manage Events](https://raw.githubusercontent.com/5ujan/VOLUNTEER_MANAGEMENT_SYSTEM/refs/heads/main/screenshots/admin_manage_events.png)



