# Event Management System

This is a full-stack Event Management System with **NestJS backend** and **React frontend**.  
Users can view events, register, cancel registration, and track ticket status with QR code scanning. Admins can create events, view attendees, and export reports.

---

## **Backend Setup**

**Technologies:** NestJS, TypeORM, MySQL, JWT, Passport

**Install dependencies:**

```bash
npm install -g @nestjs/cli
npm install
npm install mysql2 @nestjs/typeorm typeorm bcryptjs jsonwebtoken
npm install @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt

to run backend: npm run start
