
---

# CRUD with React, TypeScript, Next.js, Firebase, and Cloudinary

This project is a fully functional CRUD (Create, Read, Update, Delete) application built using modern web technologies: **React**, **TypeScript**, **Next.js**, **Firebase**, and **Cloudinary**. The app is designed to manage data with Firebase Firestore, upload images to Cloudinary, and includes user authentication.

---
## Live Preview

Link:[]() 


---


## Features

- 🔐 **Authentication**: User login and registration using Firebase Authentication.
- 🗃 **Firestore Integration**: CRUD operations powered by Firebase Firestore.
- 🖼 **Image Upload**: Upload images to **Cloudinary** and store references in Firestore.
- 🚀 **Next.js**: Server-side rendering and optimized performance.
- 🔄 **React Hooks**: Clean and maintainable code with React functional components.
- 🛠 **TypeScript**: Strict type-checking for a robust development experience.
- 🌟 **Responsive Design**: Fully responsive layout for various screen sizes.

---

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Firebase Firestore
- **Framework**: Next.js
- **Styling**: CSS/SCSS for custom styling
- **Image Hosting**: Cloudinary

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- Firebase project setup (see below for details)
- Cloudinary account setup (see below for details)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project.
   - Enable Firebase Authentication (Email/Password).
   - Set up Firestore database.
   - Copy your Firebase configuration settings.

4. Configure Cloudinary:
   - Create a free account at [Cloudinary](https://cloudinary.com/).
   - Navigate to the **Dashboard** to retrieve your Cloudinary `cloud_name`, `api_key`, and `api_secret`.

5. Create a `.env.local` file and add your Firebase and Cloudinary configurations:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Build the application for production.
- `npm start` - Start the production server.

---

## Features in Detail

### Authentication
- Login and signup forms.
- Firebase Authentication with email and password.

### CRUD Operations
- **Create**: Add new entries to Firestore.
- **Read**: Display a list of items from Firestore.
- **Update**: Edit existing items.
- **Delete**: Remove items from Firestore.

### Image Upload
- **Cloudinary Integration**: Images are uploaded to Cloudinary via a secure API.
- **Firestore References**: Store Cloudinary URLs in Firestore for easy retrieval and display.
- **Image Preview**: Preview uploaded images before saving them to the database.

### Responsive Design
- Optimized for desktop, tablet, and mobile screens.

---