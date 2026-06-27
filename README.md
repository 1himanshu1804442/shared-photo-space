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

We are laser-focused on delivering a rock-solid core experience before moving on to advanced AI features.

### Phase 1: Infrastructure Foundations (Current)
- [ ] Implement Environment Variables (JWT, DB, CORS)
- [ ] Implement Global Exception Handler
- [ ] Add Swagger/OpenAPI Documentation
- [ ] Add Structured Logging
- [ ] Add Rate Limiting

### Phase 2: Core Experience Refinement
- [ ] Phone OTP Authentication Flow (Backend + Frontend UI)
- [ ] Account Creation & Login
- [ ] Event Creation & Joining
- [ ] Invite Links

### Phase 3: Gallery & Media
- [ ] StorageService Abstraction (Local Storage MVP)
- [ ] Photo Upload with Progress Indicators
- [ ] Shared Gallery View
- [ ] Photo Download

### Phase 4: Launch Prep
- [ ] Basic Notifications
- [ ] Deployment Configuration (Docker/Cloud)
- [ ] Analytics Integration (PostHog/Firebase)

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
