# Online Bookstore

A full-stack e-commerce web application for an online bookstore. Users can browse and search the catalog, manage a cart and wishlist, and place orders. Administrators can manage the catalog and view store statistics.

The front end is built with React and the back end is a Flask REST API, using JWT authentication, a SQLAlchemy database layer, and Docker for deployment.

## Features

**Users**
- Browse the catalog, filter by category, and search for books
- Book detail pages with author, publisher, description, and price
- Shopping cart with quantity management
- Wishlist for saving books
- Checkout with shipping details and order placement
- Accounts with sign-up, login, profile editing, and password reset

**Administrators**
- Dashboard with store statistics: users, orders, total revenue, and best-selling books
- Add, edit, and delete books
- Set and remove sale prices
- Mark and unmark recommended books

**Implementation**
- JWT-based authentication with protected routes
- REST API organized into modular Flask blueprints
- Relational data model covering users, books, cart, wishlist, orders, and order items
- Database migrations with Alembic / Flask-Migrate
- Containerized front end and back end

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Front end | React, React Router, Axios, React Modal, React Slick |
| Back end | Flask, Flask-JWT-Extended, Flask-CORS |
| Database | SQLAlchemy ORM, SQLite, Alembic |
| Tooling | Docker, Docker Compose |

## Architecture

The front end communicates with the back end through a REST API under the `/api` prefix, with admin-only endpoints grouped under `/api/admin`. Authentication uses JSON Web Tokens sent in the `Authorization` header.

```
React (frontend, :3000)  ->  Flask REST API (backend, :5000)  ->  SQLite database
```

## Getting Started

### Docker

The full stack runs with a single command:

```bash
docker-compose up --build
```

- Front end: http://localhost:3000
- Back end API: http://localhost:5000

### Running locally

Back end:

```bash
cd backend
pip install -r requirements.txt
flask run --host=0.0.0.0 --port=5000
```

Front end:

```bash
cd frontend
npm install
npm start
```

The front end proxies API requests to the back end automatically.

## Project Structure

```
Repozitorijum/
├── docker-compose.yml
├── backend/
│   ├── app.py            App setup, config, blueprint registration
│   ├── models.py         SQLAlchemy models
│   ├── routes/           API endpoints (auth, books, cart, wishlist, orders, admin)
│   ├── utils/            JWT auth helpers
│   ├── migrations/       Alembic database migrations
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/    Reusable UI (modals, cards, header, footer)
    │   ├── pages/         Home, catalog, cart, wishlist, profile, admin
    │   ├── routes.js
    │   └── App.js
    └── package.json
```

## API Overview

| Area | Example endpoints |
|------|-------------------|
| Auth | `POST /api/register`, `POST /api/login`, password reset |
| Books | `GET /api/books`, `GET /api/books/<id>` |
| Cart | add, update, and remove cart items |
| Wishlist | add and remove wishlist items |
| Orders | `POST /api/order/create`, `GET /api/orders` |
| Admin | `POST /api/admin/books/add`, `GET /api/admin/stats` |
