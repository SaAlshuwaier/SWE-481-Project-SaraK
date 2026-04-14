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
- Verified the connection between frontend and backend.
- Complete API and Interface Specification for all features that will be implemented in later phases.

### API and Interface Specification Requirements:
The following specifications are defind under the '/docs' directory:
- REST API endpoints (URLs, HTTP methods).
- Request parameters and payloads.
- Response formats and HTTP status codes.
- Authentication requirements (if applicable).
- Frontend-to-backend interaction contracts.

- ### Environment Variables 

A template file `.env.example` is provided in the `backend/` directory for
documentation purposes only. It lists the required environment variables and
their expected format.

Developers must create a local `.env` file (not committed) to store
their values for reference.

## Phase 3 Status
In this phase, we focused on developing  comprehensive test cases across backend, frontend, and full system levels.

### Comleted in Phase 3:
- Backend unit tests implemented (service-level logic testing).
- Backend integration tests implemented (controller-level REST endpoint validation).
- Frontend component unit tests implemented using Angular TestBed.
- Frontend service tests implemented using HttpClientTestingModule and HttpTestingController.
- End-to-End (E2E) tests implemented using Playwright to validate complete user workflows.
- Stress testing implemented using k6 to evaluate system performance under high load.
- Robustness testing implemented using k6 to evaluate system behavior under failure conditions.
- **Testing detailed explanation and execution instructions are defind under the '/docs' directory in Testing.md**

## Phase 4 Status
In this phase, we focused on implementing the system features based on the defined architecture and API specifications.

### Completed in Phase 4:
- Backend services fully implemented using Spring Boot.
- Dynamic movie search functionality implemented.
- Browse movies by genre implemented.
- Browse movies by first letter implemented.
- Movie details feature (getMovieById) implemented.
- Star details feature implemented.
- Authentication functionality implemented (login and registration).
- Dynamic data rendering implemented across all pages.
- Pagination, sorting, and filtering functionality implemented.
  
## Team Members
- Layan Alhugbani
- Sara Alshuwaier
- Jana Alshreef
- Reem Alharbi
- Loba Alyahya
