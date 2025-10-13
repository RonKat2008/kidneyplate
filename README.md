# 🩺 KidneyPlate – CKD Nutrition Tracker

KidneyPlate is a **full-stack mobile application** built with **React Native**, **Expo**, and **TypeScript**, designed specifically for **chronic kidney disease (CKD) patients**. The app allows users to **track meals, monitor nutrition, record lab values**, and access **personalized dietary recommendations** powered by **GPT with Retrieval-Augmented Generation (RAG)**.

---

## 🎯 Overview

KidneyPlate helps CKD patients manage their health by:

- Logging meals and tracking nutrients like **sodium, potassium, phosphorus, and protein**
- Recording lab values (**eGFR, creatinine, BUN, albumin, phosphorus**) and visualizing trends
- Receiving **personalized AI dietary advice** via GPT + RAG based on CKD stage and user data
- Managing user profile and dietary preferences
- Exporting nutrition and lab data for healthcare providers

---

## 🏥 Features

### ✅ User Management
- Sign up, login, logout, password reset
- Profile management (personal info, CKD stage, dietary preferences)
- Account actions (data export, notifications)

### ✅ Nutrition & Meal Tracking
- Add meals with **food search and nutrient breakdown**
- Categorize meals (breakfast, lunch, dinner, snack)
- Track daily nutrient totals vs. goals
- Meal history and analytics

### ✅ Lab Tracking
- Input and monitor key CKD lab values
- Trend visualization with **normal range indicators**
- Historical lab data access

### ✅ AI Assistant
- Chat with a GPT-powered AI trained on CKD nutrition
- Personalized suggestions based on CKD stage and logged data
- Uses **RAG** to retrieve relevant dietary guidelines and resources

### ✅ Analytics & Dashboard
- Daily, weekly, and monthly nutrient summaries
- Progress cards with goal tracking
- Quick stats overview and recent meals

---

## 🛠 Technology Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express, TypeScript, Supabase, Firebase
- **AI & RAG**: OpenAI GPT, pgvector (Supabase vector database for embeddings)
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Charts**: Victory Native / Chart Kit
- **Styling**: StyleSheet (ready for Tailwind via NativeWind)
- **Icons**: Expo Vector Icons

---

