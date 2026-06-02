# LocalScope
# Implementation Plan - Local Business Directory Platform

The Local Business Directory Platform is a full-stack web application designed to connect local service providers with potential customers. It provides user registration, JWT-based authentication, a comprehensive business management interface, interactive maps using Leaflet.js (a zero-config alternative to Google Maps API), a detailed rating/review system, bookmarks/favorites, and an administrative dashboard for verification and content moderation.

To ensure immediate, reliable execution out-of-the-box without requiring the setup of external databases or paid API keys, the backend uses a local file-based database (with an interface easily swappable for MongoDB) and Leaflet/OpenStreetMap.

---

## User Review Required

We propose using **Leaflet.js / OpenStreetMap** as the primary interactive map because it is fully free and does not require credit card details or API keys, meaning the application's map features will work immediately. We will also include configurable environment variables to swap to Google Maps if desired.

We propose using a **local file-based JSON database** by default, with complete compatibility layer for MongoDB. This guarantees that the application runs instantly on your machine without needing to install, configure, or start a MongoDB service.

---

## The Architecture 

```
local-business-directory/
├── package.json (root runner using concurrently)
├── backend/
│   ├── package.json
│   ├── server.js (entry point)
│   ├── .env
│   ├── config/
│   │   └── database.js (JSON file store database logic)
│   ├── data/
│   │   └── db.json (persisted JSON database)
│   ├── middleware/
│   │   └── auth.js (JWT authentication)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── businesses.js
│   │   ├── reviews.js
│   │   └── admin.js
│   └── controllers/ (business logic controllers)
└── frontend/
    ├── package.json
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── index.css (central modern design styling)
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BusinessCard.jsx
    │   │   ├── BusinessMap.jsx
    │   │   ├── ReviewSection.jsx
    │   │   └── StarRating.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Search.jsx
    │       ├── BusinessDetail.jsx
    │       ├── RegisterBusiness.jsx
    │       ├── Dashboard.jsx
    │       ├── AdminPanel.jsx
    │       ├── Login.jsx
    │       └── Register.jsx
```

### Backend Component

The backend will be a Node.js and Express server handling the API endpoints, JWT authentication, and data storage.

---

### Frontend Component

The frontend is a React application styled using Vanilla CSS following modern dark mode aesthetics (glassmorphism, vibrant indigo/violet gradients, Outfit typography, responsive layout).

---

## Verification Plan

### Automated Tests
- Verify successful building of backend and frontend.
- Launch client and server concurrently using `npm start` in the root folder.
- Execute HTTP tests (using postman or simplified scripts) to verify backend auth, business registry, and reviews APIs.

### Manual Verification
- Verify registration, business creation, map pins rendering, searching/filtering by category, bookmarking, posting reviews, and admin approval in a web browser.
