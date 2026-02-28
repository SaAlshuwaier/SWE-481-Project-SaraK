BEGIN;

DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS creditcards CASCADE;
DROP TABLE IF EXISTS genres_in_movies CASCADE;
DROP TABLE IF EXISTS stars_in_movies CASCADE;
DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS stars CASCADE;
DROP TABLE IF EXISTS movies CASCADE;

--Table 1: 
CREATE TABLE IF NOT EXISTS movies (
  id       VARCHAR(10) PRIMARY KEY, 
  title    VARCHAR(100) NOT NULL,
  year     INT NOT NULL,
  director VARCHAR(100) NOT NULL
);

--Table 2:
CREATE TABLE IF NOT EXISTS stars (
  id        VARCHAR(10) PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  birthYear INT
);

--Table 3:
CREATE TABLE IF NOT EXISTS stars_in_movies (
  starId  VARCHAR(10) NOT NULL REFERENCES stars(id),
  movieId VARCHAR(10) NOT NULL REFERENCES movies(id),
  PRIMARY KEY (starId, movieId)
);

--Table 4:
CREATE TABLE IF NOT EXISTS genres (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(32) NOT NULL
);

--Table 5:
CREATE TABLE IF NOT EXISTS genres_in_movies (
  genreId INT NOT NULL REFERENCES genres(id),
  movieId VARCHAR(10) NOT NULL REFERENCES movies(id),
  PRIMARY KEY (genreId, movieId)
);


--Table 6:
CREATE TABLE IF NOT EXISTS creditcards (
  id         VARCHAR(20) PRIMARY KEY,
  firstName  VARCHAR(50) NOT NULL,
  lastName   VARCHAR(50) NOT NULL,
  expiration DATE NOT NULL
);

--Table 7:
CREATE TABLE IF NOT EXISTS customers (
  id        SERIAL PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  lastName  VARCHAR(50) NOT NULL,
  ccId      VARCHAR(20) NOT NULL REFERENCES creditcards(id),
  address   VARCHAR(200) NOT NULL,
  email     VARCHAR(50) NOT NULL,
  password  VARCHAR(20) NOT NULL
);

--Table 8:
CREATE TABLE IF NOT EXISTS sales (
  id         SERIAL PRIMARY KEY,
  customerId INT NOT NULL REFERENCES customers(id),
  movieId    VARCHAR(10) NOT NULL REFERENCES movies(id),
  saleDate   DATE NOT NULL
);

--Table 9:
CREATE TABLE IF NOT EXISTS ratings (
  movieId  VARCHAR(10) PRIMARY KEY REFERENCES movies(id),
  rating   FLOAT NOT NULL,
  numVotes INT NOT NULL
);

COMMIT;
