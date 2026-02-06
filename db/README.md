# Database Setup (PostgreSQL)

This folder contains all SQL scripts required to create, load, and verify
the PostgreSQL database used by this project.

The database itself is not included in the repository.

---

## Folder Structure

- `schema/createtable.sql`  
  Creates all database tables.

- `load/movie-data.sql`  
  Loads the dataset into the database using `INSERT` statements.

- `verify/verify.sql`  
  Verifies that the database was loaded correctly using row-count checks.

---

## Prerequisites

- PostgreSQL installed locally
- A local PostgreSQL user with permission to create databases
- `psql` available in the terminal

Database credentials (username and password) are **not included** in the repository
and must be provided locally by each developer.

---

## Create and Load the Database

Run the following commands **from the project root**:

```bash
createdb moviedb
psql -U <your_postgres_username> -d moviedb -f db/schema/createtable.sql
psql -U <your_postgres_username> -d moviedb -f db/load/movie-data.sql
After loading the database, run: psql -U <your_postgres_username> -d moviedb -f db/verify/verify.sql

