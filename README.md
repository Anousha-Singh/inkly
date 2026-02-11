# Inkly 🎨

**Inkly** is a high-performance, real-time collaborative whiteboard designed for creative teams, educators, and individuals. Built with a focus on speed and seamless interaction, it allows users to brainstorm, design, and visualize ideas together in a shared digital space.

## ✨ Features

- **Real-time Collaboration**: Sync drawing actions across all participants instantly using Firebase.
- **Rich Toolset**:
  - **Drawing**: Smooth pen and eraser tools.
  - **Shapes**: Rectangle, Circle, Diamond, Star, Hexagon, Triangle, and Arrows.
  - **Text**: Add labels and notes directly to the board.
- **Infinite Canvas**: Pan and zoom freely to create without boundaries.
- **Live Presence**: Track collaborators with real-time cursor visibility and active member lists.
- **Smart Controls**:
  - Customizable color palettes, line widths, and opacity.
  - Light and Dark mode support.
  - Optional grid view for precision.
- **Persistent Workspace**:
  - **Autosave**: Your work is automatically synced to Firestore.
  - **Undo/Redo**: Quick corrections via keyboard shortcuts (Ctrl+Z).
- **Export**: Save your masterwork as a high-quality PNG image.
- **Live Chat**: Integrated real-time messaging for seamless team coordination.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend/Real-time**: [Firebase](https://firebase.google.com/) (Firestore & Realtime Database)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utility**: [UUID](https://github.com/uuidjs/uuid)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS version recommended)
- A Firebase project (Free tier works great)

### 2. Installation
```bash
git clone https://github.com/Anousha-Singh/inkly.git
cd inkly
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start creating!

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
Created with ❤️ by Anousha Singh
