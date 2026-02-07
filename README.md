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

- ### Environment Variables 

A template file `.env.example` is provided in the `backend/` directory for
documentation purposes only. It lists the required environment variables and
their expected format.

Developers may optionally create a local `.env` file (not committed) to store
their values for reference. However, Spring Boot reads configuration values
exclusively from **system environment variables**, which must be defined before
starting the application.


#### Steps to Add Environment Variables on Windows
1. Press **Windows + R**, type `sysdm.cpl`, and press **Enter**.
2. Navigate to the **Advanced** tab and click **Environment Variables**.
3. Under **User variables** , click **New**.
4. Add the following variables:

   - **Name:** `DB_URL`  
     **Value:** `jdbc:postgresql://localhost:5432/moviedb`

   - **Name:** `DB_USER`  
     **Value:** `postgres`

   - **Name:** `DB_PASS`  
     **Value:** *your local PostgreSQL password*

5. Click **OK** to save the changes.
6. Close all open terminal windows and open a new terminal session.

After defining the environment variables, navigate to the backend directory
and start the application:

```bash
mvn spring-boot:run
```

#### Steps to Add Environment Variables on macOS

1. Open the Terminal.

2. Edit the shell configuration file:
   ```bash
   nano ~/.zshrc  ```

then write :
فاثى
export DB_URL="jdbc:postgresql://localhost:5432/moviedb"
export DB_USER="postgres"
export DB_PASS="YOUR_LOCAL_PASSWORD"


Save the file and apply the changes: source ~/.zshrc

Start the backend service: mvn spring-boot:run



## Team Members
- Layan Alhugbani
- Sara Alshuwaier
- Jana Alshreef
- Reem Alharbi
- Loba Alyahya
