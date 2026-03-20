# AppCloud

Application web full-stack cloud-native permettant de créer et consulter des posts (articles, contenus), déployée sur Google Cloud avec une architecture scalable et une pipeline CI/CD automatisée.

URL Backend : https://appcloud-backend-188500171231.europe-west1.run.app
URL Frontend : https://cloud-fullstack-app.vercel.app/

---

## 📌 Objectifs du projet

L’objectif de ce projet est de démontrer la mise en place d’une application cloud-native complète :
- Développement d’une API backend (Laravel)
- Frontend moderne (React / Vercel)
- Déploiement sur le cloud (Google Cloud Run)
- Mise en place d’une pipeline CI/CD automatisée
- Monitoring et observabilité (Cloud Logging & Monitoring)
  
---

## 🧱 Architecture

### Backend
- Framework : Laravel (PHP)
- Conteneurisé via Docker
- Déployé sur **Google Cloud Run**

### Frontend
- Framework : React (Vite)
- Déployé sur **Vercel**
- Connecté au backend via API REST

### Base de données
- Google Cloud SQL (MySQL)
- Connexion sécurisée via socket Cloud SQL

---

## Infrastructure Cloud

Composants / Services :
Backend : Cloud Run
Database : Cloud SQL
Frontend : Vercel
Container Registry : Artifact registry
CI/CD : Github Actions
Monitoring : Cloud Monitoring (cf tableau)
Logs : Cloud Logging

---

## ⚙️ Fonctionnalités principales
- Création de posts
- Lecture de posts (API REST)
- Gestion des requêtes API
- Backend scalable automatiquement (Cloud Run)
- Monitoring des performances

---

## 🔄 CI/CD (Continuous Integration & Deployment)
Pipeline GitHub Actions automatisée :

### Étapes :
1. ✅ Installation des dépendances (Composer)
2. ✅ Tests Laravel
3. ✅ Build de l’image Docker
4. ✅ Push vers Artifact Registry
5. ✅ Déploiement automatique sur Cloud Run

---

## 🐳 Docker

### Backend
- Image basée sur PHP 8.3
- Installation des extensions nécessaires
- Optimisation Composer (production)
- Serveur PHP intégré

### Frontend
- Node.js 20
- Build Vite
- Développement local via container

---

## 🔐 Variables d’environnement
Les variables sensibles sont stockées dans :
- GitHub Secrets
- Cloud Run Environment Variables

Exemples :
APP_ENV=production
APP_DEBUG=false
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...
