<div align="center">
  <h1>🔗 UrlShorty</h1>
</div> 

### *A blazing-fast URL shortener built with Next.js, leveraging Redis caching to provide instant redirections and a lightning-fast dashboard experience without constantly hitting the database.*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](#)
[![Redis](https://img.shields.io/badge/Redis-Caching-red?logo=redis)](#)

## Table of Contents
- [🎨 Preview](#preview)
- [🏗 Architecture](#architecture)
- [⚡ How Redis Makes It Blazing Fast](#how-redis-makes-it-blazing-fast)
- [🛠 Tech Stack](#tech-stack)

<a id="preview"></a>
## 🎨 Preview

*(Add your screenshots here)*
- **Dashboard View**: View all shortened URLs.
- **Url Redirection**: Instant redirection to the original URL.

<a id="architecture"></a>
## 🏗 Architecture 

The application follows a modern, speed-optimized architecture:
1. **Frontend/Backend (Next.js)**: A full-stack Next.js application that handles UI rendering and API requests.
2. **Primary Data Source (Redis)**: The ultra-fast, in-memory store where all data fetching happens. Because of its incredible read speeds, Redis serves as the primary source for serving data to users.
3. **Persistent Storage & Backup (MongoDB)**: Operates as the permanent storage layer. It safely stores the URL mappings as a backup and is only queried when data expires or is missing from Redis (a cache miss).

<a id="how-redis-makes-it-blazing-fast"></a>
## ⚡ How Redis Makes It Blazing Fast

The application relies on **Redis** as the primary source for fetching data, prioritizing its in-memory speed responses and only using MongoDB as a backup storage mechanism.

### 1. Lightning-Fast Single Link Redirection
When a user clicks on a shortened link (e.g., `url-shorty/xyz123`), the system needs to find where that link goes.
* **The DB Way (MongoDB)**: The server queries MongoDB, searches through the database, retrieves the original URL, and then redirects.
* **The Redis Way (Primary)**: 
  - The server immediately queries Redis for the `xyz123` key.
  - Since Redis operates entirely in RAM, it retrieves the original URL in less than a millisecond (Hit) and instantly redirects the user.
  - **Fallback**: Only if the link is not in Redis (e.g., due to expiration), it fetches the mapping from MongoDB (as a backup), redirects the user, and immediately populates Redis so subsequent reads are instant again.

### 2. Instant Dashboard Loading (All Links Page)
When a user visits the dashboard to see all their shortened URLs:
* **The DB Way (MongoDB)**: The server runs a query on MongoDB to fetch every single URL record and return it to the frontend.
* **The Redis Way (Primary)**: 
  - The system fetches the entire pool of URLs (`allUrlsList`) directly from Redis.
  - It instantly parses the JSON data from memory and serves the dashboard to the user without touching the MongoDB database.
  - **Smart Syncing**: When a URL is created or deleted, the application directly updates the list stored in Redis (pushing the new URL or filtering out the deleted one) and updates MongoDB in the background. This ensures that the dashboard always loads instantly from Redis while MongoDB safely keeps the persistent backup.

<a id="tech-stack"></a>
## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Database:** MongoDB (Mongoose)
* **Cache:** Redis (ioredis)

