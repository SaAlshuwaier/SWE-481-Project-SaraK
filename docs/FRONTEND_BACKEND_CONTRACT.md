# Frontend-Backend Setup 
This README explains how to:
1. Run the Spring Boot backend.
2. Run the Angular frontend.
3. Verify successful communication between backend and frontend.

## Run backend (Spring Boot)
### 1. Start backend
- `cd backend`
- `./mvnw spring-boot:run`

### 2. Verify Backend
Open in browser: 
- `http://localhost:8080/api/`
---

## 2. Run frontend (Angular)
### 1. Install Dependencies
- `cd frontend`
- `npm install`

### 2. Start Angular Application
- `ng serve`

### 3. Verify Frontend
Open in browser:
- `http://localhost:4200`
The app.html page should be displayed to confirm the frontend is running.

## 3. Frontend-Backend Communication Test
After confirming that both the backend and the frontend run independently, we verify the communication between them.
Angular sends an HTTP request to multiple backend endpoints and displays the returned JSON response.

#### Steps:
- `cd frontend`
- `ng serve`
 Open in browser:
- `http://localhost:4200/`

- Click the endpoint checking buttons
- Each button triggers an HTTP request to Spring Boot backend.
- The backend respondes and an alert is displayed.
This Confirms that the frontend and backend are successfully connected.
This Confirms that the frontend and backend are successfully connected.
