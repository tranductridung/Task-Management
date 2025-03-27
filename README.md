# Task-Management
 ## Overview

 ## Features
 * Add, edit and delete task
 * Assign status, comment to task
 * Add another user to task
 * User registation, login and authentication
  
 ## Technologies Used
 * **Frontend**: React, Tailwind, Vite
 * **Backend**: Express.js, Node.js, MySQL
 * **Authentication**: JSON Web Token (JWT)  

 ## Project Structure
*TASKMANAGEMENT/
*│── backend/                # Server-side code (Express.js)
*│   ├── Models/             # SQL models
*│   ├── Routes/             # API routes
*│   ├── Controllers/        # Business logic
*│   ├── Config/             # Configuration files
*│   ├── Middleware/         # Authentication & validation
*│   ├── .env                # Environment variables
*|   │── package.json        # Dependencies and scripts
*│   ├── server.js           # Main server file
*│
*│── frontend/               # Client-side code (React)
*│   ├── src/
*│   │   ├── components/     # Reusable components
*│   │   ├── pages/          # Page components
*│   │   ├── api/            # API and Auth config
*│   │   ├── context/        # Context of react         
*│   │   ├── index.js        # Entry point
*│   ├── public/             # Static files
*│   ├── App.jsx             # Main React component
*|   │── package.json        # Dependencies and scripts
*│── README.md               # Project documentation

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
