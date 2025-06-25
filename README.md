# 🗨️ Group Chat Application

A real-time group chat application built using **React**, **Firebase**, and **Material-UI**, with support for creating and managing chat rooms.

The app is deployed using Vercel:

🔗 https://groupchat-application.vercel.app

### Sign-in Page
![Screenshot From 2025-06-26 01-33-40](https://github.com/user-attachments/assets/d25255e2-f4dc-466f-8406-f820def22ac4)

### Home Page
![Screenshot From 2025-06-26 01-34-09](https://github.com/user-attachments/assets/8b04535b-91c5-4990-b442-f68615c074e0)

### Chat Page
![Screenshot From 2025-06-26 01-34-38](https://github.com/user-attachments/assets/11299252-956e-421b-8e01-013c964fca22)


## 🚀 Features

- 🔥 Firebase Authentication
- 💬 Create and join group chat rooms
- 🧑‍💻 Only channel owners can delete rooms
- ⚡ Real-time message updates using Firestore
- 🎨 Material UI + Custom styling
- 📱 Fully responsive design

## 📷 Preview



## 🛠️ Tech Stack

- **Frontend**: React, Material-UI
- **Backend/Database**: Firebase Firestore
- **Deployment**: Vercel


## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app
4. Enable **Authentication** (Email/Password or Google)
5. Create a **Firestore Database**
6. Copy your config and paste it in `src/Firebase/Firebase.js`

```js
// Firebase.js
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-id",
  appId: "your-app-id"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
```
# Clone the repo
```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
# Install dependencies
```
npm install
```
# Start dev server
```
npm start
```
