# Shared Photo Space - Project Context & Rules

## Core Identity
This is an **AI Event Memory Platform**, not just a photo storage app. It aims to completely eliminate friction for users sharing photos at events like college trips and weddings.

## Tech Stack
- **Frontend (Planned):** React Native (Expo) - Mobile App for auto-uploading.
- **Web Frontend (Planned):** React - Lightweight read-only viewer.
- **Backend:** Java Spring Boot 3.2.x (Java 17).
- **Database:** PostgreSQL (Local DB name: `shared_photo`, User: `postgres`).
- **Storage (Planned):** AWS S3 / Cloudflare R2.

## Current State
- ✅ Project scaffolded.
- ✅ PostgreSQL database created locally.
- ✅ Spring Boot configured to connect to local DB.
- ✅ Core JPA Entities created (`User`, `Event`, `EventParticipant`, `Photo`).
- ⏳ Next: REST APIs and AWS S3 integration.

## Agent Guidelines
1. **No Hallucinations:** Stick strictly to this tech stack. Do not introduce new technologies without explicit user permission.
2. **Phase 1 MVP:** Focus only on the manual upload, zero-friction flow first. Do NOT build complex AI or auto-upload features until Phase 1 is fully functional and tested.
3. **Database Rules:** Always use PostgreSQL dialect for JPA.
4. **Git Discipline:** Commit code regularly after completing logical chunks of work.
