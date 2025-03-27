# Task-Management
 ## Overview
Task Management Website is a simple and efficient tool designed to help users organize their daily activities. Users can create, update, and track their tasks easily. The app also includes user authentication and role-based access control, ensuring security and a personalized experience.

 ## Features
* Manage tasks with ease: Create, update, and delete tasks.
* Track progress: Assign statuses and add comment tasks.
* Collaborative work: Share tasks with other users.
* Secure authentication: Register and log in with JWT-based authentication.
  
 ## Technologies Used
 * **Frontend**: React, Tailwind, Vite
 * **Backend**: Express.js, Node.js, MySQL
 * **Authentication**: JSON Web Token (JWT)  

 ## Project Structure
```
TASKMANAGEMENT/
│── backend/                # Server-side code (Express.js)
│   ├── Models/             # SQL models
│   ├── Routes/             # API routes
│   ├── Controllers/        # Business logic
│   ├── Config/             # Configuration files
│   ├── Middleware/         # Authentication & validation
│   ├── .env                # Environment variables
|   │── package.json        # Dependencies and scripts
│   ├── server.js           # Main server file
│
│── frontend/               # Client-side code (React)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── api/            # Config for API call and Auth 
│   │   ├── contexts/       # React context         
│   │   ├── index.js        # Entry point
│   ├── App.jsx             # Main React component
|   │── package.json        # Dependencies and scripts
│── README.md               # Project documentation
```

 ## Install and run website
 ### Step 1: Clone the Repository
```
git clone https://github.com/tranductridung/Task-Management.git
```

```
cd Task-Management
```

 ### Step 2: Install Backend Dependencies
```
cd backend
```

```bash
npm install
```

 ### Step 3: Install Frontend Dependencies
```bash
cd frontend
```

```
npm install
```

### Step 4: Configure Environment Variables
Create a `.env` file in the backend directory with the following content:
```
PORT = 3000
ACCESS_TOKEN = your_access_token
EXPIRED_ACCESS_TOKEN = expired_time_of_your_access_token
REFRESH_TOKEN = your_refresh_token
EXPIRED_REFRESH_TOKEN = expired_time_of_your_refresh_token
MAX_AGE = TTL_of_refresh_token_in_cookie
```

### Step 5: Run the website
Open two terminals and run the following commands:
**Backend:**
```
cd backend
npm run dev
```
**Frontend:**
```
cd frontend
npm run dev
```
The website will be avaiable at `http://localhost:5173`

## Limitations 
* **No Responsive Design Support:** The UI is not optimized for mobile devices.
* **No Real-time Updates:** Users need to refresh the page to see task updates made by others.

## Future Development
* **Implement Responsive Design:** ensure the UI adapts well to all screen sizes.
* **Enable Real-time Updates:** allowing users to see task changes instantly without refreshing.
* **Optimize Performance:** implementing caching (React Query, Redux Toolkit Query, Redis) and lazy loading for better efficiency.
