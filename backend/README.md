# Spring Boot Backend

This backend replaces the previous Vite mock API during local development.

## Stack

- Spring Boot 3.3.x
- Spring Web
- Spring Data JPA
- MySQL 8.x
- Java 17

## Default config

- Port: `8080`
- Database: `ai_learning`
- Username: `root`
- Password: `123456`

Config file:

- `src/main/resources/application.yml`

## Demo account

- Username: `admin`
- Password: `123456`

The application seeds one demo user and several study plans on first startup.

## Run

```bash
cd backend
mvn spring-boot:run
```

## Frontend integration

The frontend Vite dev server proxies `/api` requests to `http://localhost:8080`.
Start the backend first, then run the frontend with:

```bash
npm run dev
```
