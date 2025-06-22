# 📚 Book Management System API

A RESTful API built with NestJS and Prisma to manage authors and books. Supports CRUD operations with validations, relational integrity, versioned routes, and great developer experience via Swagger.

## 🚀 Features

- Authors: Create, read, update, and delete authors with proper validation.

- Books: Full CRUD support, checks for duplicates (ISBN) and author existence.

- API Versioning: URI versioning (e.g., `/v1/authors`, `/v1/books`)

- Automatic Documentation: Swagger UI available at `/docs`

- Pagination and search on listing endpoints.

- E2E / Unit Tests: Built with Jest and Supertest for robustness.

## 🛠️ Getting Started
```js
* Clone the repo
- git clone https://github.com/jinnatul/book-management-api.git
- cd book-management-api

* Install dependencies
- npm install

* Configure environment variables, Create a .env file in root:
- DATABASE_URL="postgresql://USER:PASS@HOST:PORT/DBNAME"

* Run Prisma migrations
- npx prisma migrate dev --name init
- npx prisma generate

* Start the app
- npm run start:dev
```
## 🧩 API Endpoints
- http://localhost:5000/docs

## ✅ Testing

- **Unit Tests**: `npm run test`
- **End-to-End (E2E) Tests**: `npm run test:e2e`

### 📷 Unit Test Result

![Unit Test](https://github.com/user-attachments/assets/4cf6d03b-c31d-44c6-a3a7-a299d476b856)

### 📷 E2E Test Result

![E2E Test](https://github.com/user-attachments/assets/dd9da0a0-7cf9-44e9-9b8e-3022e36c4eb3)

> Uses `supertest` to verify full HTTP flows, including:
> - Creating an author via `POST /v1/authors`
> - Fetching the same author via `GET /v1/authors/:id`

## 🧠 Architecture & Design
- NestJS modular structure

- Prisma for database ORM

- DTOs with class-validator + class-transformer

- Swagger from decorators (`@ApiProperty`)

- Global validation pipe enforces DTO shape & sanitization

- Logging built into services for visibility

- Global versioning enabled via `js app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });`

## ✅ Code Quality & Standards

- Strict typing with TypeScript

- ESLint and Prettier for consistent style

- TDD—unit & integration covered with Jest

- Highly reusable: common pagination, base entities, exception handling

