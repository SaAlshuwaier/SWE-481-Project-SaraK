## SWE-481-Project

This repository contains the implementation of the SWE-481 course project. The project is a full-stack web application developed by team members as part of the Software Engineering course requirements. The web application allows users to browse, search, and rent movies from the IMDb dataset. The development of this project is divided into multiple phases. For each phase, specific instructions and guidelines will be added to this repository as the project progresses.

## Phase 1 Status
- Private GitHub repository created
- Team members and instructors added as collaborators
- Repository structure initialized
- GitHub Actions workflow configured
- Branching and Pull Request strategy established
  
## Planned Technology Stack
Frontend: Angular
Backend: Spring Boot
Database: PostgreSQL

## Phase 2 Status
In this phase we focus on system architicture setup, communication between frontend and backend, and complete API and interface specification.

### Comleted in Phase 2:
- Full-stack architecture setup between frontend,and backend (database deferred to later phases)
- Running Spring Boot backend with REST support.
- Verified the connection between frontend and backend using a health-chack endpoint.
- Complete API and Interface Specification  for all features that will be implemented in later phases.

### API and Interface Specification Requirements:
The following specifications are defind under the '/docs' directory:
- REST API endpoints (URLs, HTTP methods).
- Request parameters and payloads.
- Response formats and HTTP status codes.
- Authentication requirements (if applicable).
- Frontend-to-backend interaction contracts.

- ## Environment Variables (Backend Configuration)

Sensitive configuration values such as database credentials are **not committed**
to the repository. Each developer must define the required environment variables
locally before running the backend service.

### Required Environment Variables
The backend requires the following variables:

- `DB_URL` – PostgreSQL connection URL  
  Example: `jdbc:postgresql://localhost:5432/moviedb`
- `DB_USER` – PostgreSQL username  
  Example: `postgres`
- `DB_PASS` – PostgreSQL password (local only)

A template file `.env.example` is provided in the `backend/` directory as a reference.
Developers should create their own local `.env` file (not committed) or define the
variables directly in their environment.


### Running the Backend (Windows PowerShell)

Before starting the Spring Boot application, the required configuration values
must be provided as environment variables.
Spring Boot does not read .env files automatically; instead, it resolves
configuration values from the operating system environment at application startup.

A .env.example file is provided as a reference template only. Developers may
use it to define their local values and then export them to the environment
manua

$env:DB_URL="jdbc:postgresql://localhost:5432/moviedb"
$env:DB_USER="postgres"
$env:DB_PASS="YOUR_LOCAL_PASSWORD"
mvn spring-boot:run





## Team Members
- Layan Alhugbani
- Sara Alshuwaier
- Jana Alshreef
- Reem Alharbi
- Loba Alyahya
