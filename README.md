# Task-Management
 ## Overview

 ## Features
  Add, edit and delete task
  Assign status to task
  Add another user to task
  User registation, login and authentication
  
 ## Technologies Used
Frontend: React, Tailwind, Vite
Backend: Express.js, Node.js, MySQL
Authentication: JSON Web Token (JWT)

 ## Project Structure


 ## Install and run website
 ### Step 1: Clone the Repository
```bash
git clone https://github.com/tranductridung/Task-Management.git
```

```bash
cd Task-Management
```

 ### Step 2: Install Backend Dependencies
```bash
cd backend
```

```bash
npm install
```

 ### Step 3: Install Frontend Dependencies
```bash
cd frontend
```

```bash
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

## API Endpoints
### User Endpoints
| Method | Endpoint      | Description |
|:-------|:--------------|:-----------|
| POST   | /api/users/register | Register new user      |
| POST   | /api/users/login |   User login|
| POST   | /api/users/logout | User logout |
| GET    | /api/users/refreshToken | Refresh access token  |
| POST   | /api/users/changePassword | Change user password|
| GET    | /api/users/verifyToken | Check validate token|
| GET    | /api/users | Get user information  |
| DELETE | /api/users | Delete user account |
| PUT    | /api/users | Update user information |



