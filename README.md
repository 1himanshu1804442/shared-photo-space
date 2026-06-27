<div align="center">
  <h1>📸 Shared Photo Space</h1>
  <p>An AI-powered universal application for sharing event memories effortlessly.</p>
</div>

## 🌟 Overview
Shared Photo Space is a modern, cross-platform memory-sharing application. It allows event hosts (weddings, trips, parties) to create an event and share a 6-digit join code with their guests. Everyone can upload, view, and download photos from a real-time shared gallery. 

The architecture is built for speed, scale, and cross-platform accessibility.

## 🏗️ Architecture Stack

- **Backend (API):** Java 17 + Spring Boot 3.3
- **Database:** PostgreSQL (with Hibernate/JPA)
- **Universal Frontend:** React Native + Expo (SDK 54) targeting iOS, Android, and Web simultaneously.
- **Legacy Web (Deprecated):** React + Vite (Preserved for future admin dashboard / marketing landing page).

## 🚀 Version 1 Launch Roadmap

We are aggressively prioritizing features that acquire and retain users before focusing on infrastructure.

### Phase 1: Get People Using It
These features determine whether someone can actually use the app on a trip or at an event.
- [ ] Authentication (Login / Register)
- [ ] Create Event & Join Event
- [ ] Invite Links
- [ ] Event Members List & Event Covers
- [ ] Upload Photos, Photo Download, and Shared Gallery

### Phase 2: Make It Feel Good
UX polish that users notice immediately.
- [ ] Upload Progress & Background Uploads
- [ ] Image Compression
- [ ] Basic Notifications

### Phase 3: Infrastructure (Production Readiness)
- [ ] Environment Variables (JWT, DB, CORS)
- [ ] Global Exception Handler & Structured Logging
- [ ] Swagger/OpenAPI & Rate Limiting

### Phase 4: Deployment & Release
- [ ] Docker & Cloud Deployment
- [ ] Analytics (PostHog / Firebase)
- [ ] Crash Reporting (Crashlytics / Sentry)

## 🛠️ Local Development Setup

### 1. Database Setup
Ensure Docker is running, then spin up the PostgreSQL database:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the backend directory and run the Spring Boot application:
```bash
cd backend
./mvnw spring-boot:run
```
*The backend API runs on `http://localhost:8080`.*

### 3. Mobile / Web App Setup
Navigate to the universal app directory and start the Expo bundler:
```bash
cd mobile
npm install
npm run start
```
* **Web:** Press `w` to open in browser (runs on `http://localhost:8081`)
* **Phone:** Scan the QR code using the Expo Go app. 
  *(Note: When testing on a physical phone, ensure your laptop's firewall allows incoming connections on port 8080).*

---
<div align="center">
  <i>Built with ❤️ using Spring Boot & Expo Universal</i>
</div>
