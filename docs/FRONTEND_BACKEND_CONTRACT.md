

### Run backend (Spring-boot):
#### 1- Start backend
cd backend
./mvnw spring-boot:run

#### 2- Access backend through:
 http://localhost:8080/api/health

##### Expected JSON: 
{
  "service": "backend",
  "status": "UP"
}

### Run frontend (Angular):
cd frontend
npm install
ng serve

#### 2- Access frontend through:
http://localhost:4200
Angular default page should be shown to verify Angular is running.

### Frontend-Backend communication
After verifying that both the backend and the frontend run independently, we validate the successful frontend–backend communication by sending an HTTP request from Angular to Spring Boot and displaying the returned JSON response.
#### Steps:
cd frontend
ng generate service services/health
ng serve

#### Access frontend through:
http://localhost:4200/
-click the button
-the button troggers an HTTP request to spring boot.
-the backend respons with the following JSON:
Backend responds with:
{
  "service": "backend",
  "status": "UP"
}
