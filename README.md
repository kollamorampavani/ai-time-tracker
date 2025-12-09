# AI-Powered Daily Time Tracking & Analytics Dashboard

A web application that lets users log their daily activities in minutes and analyse how their 24 hours are spent each day, with a clean analytics dashboard and Firebase-backed authentication and storage.

---

## 🚀 Live Demo

- **Deployed Link:** https://YOUR_GITHUB_PAGES_URL

---

## 🎥 Video Walkthrough

- **Watch the demo (2–5 min):** https://YOUR_VIDEO_LINK

In the video, you can see:
- Login / Sign up flow
- Adding, editing, and deleting daily activities
- Remaining minutes indicator for each day
- “Analyse” action showing the analytics dashboard
- “No data available” state for days with no records
- Short explanation of how AI tools were used while building the project

---

## 🧠 AI Usage

AI tools were actively used during development to:
- Draft the initial UI layout and suggest a consistent color palette and typography.
- Generate boilerplate HTML/CSS for the authentication and dashboard layout.
- Help design the data model for Firebase (Auth + Firestore collections and documents).
- Suggest helper functions and validation logic (e.g., enforcing the 1440-minute daily limit).
- Refine copywriting for labels, placeholder text, and README documentation.

This accelerated development and helped focus on logic, UX decisions, and polishing the final experience.

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla JS, DOM)
- **Backend / Database:** Firebase
  - Firebase Authentication (Email/Password + Google sign-in)
  - Cloud Firestore for storing per-user, per-date activities
- **Charts & Analytics:** Chart.js pie chart for time-per-category visualization
- **Deployment:** GitHub Pages (static hosting)
- **Version Control:** Git + GitHub

---

## ✨ Features

- **User Authentication**
  - Firebase Email/Password authentication
  - Optional Google sign-in
  - Only logged-in users can view, add, and analyse time tracking data

- **Daily Activity Logging**
  - Select a date and log multiple activities with:
    - Activity name/title
    - Category (e.g., Work, Study, Sleep, Exercise, Entertainment, etc.)
    - Duration in minutes
  - Displays remaining minutes for the day (out of 1440 minutes)
  - Validates that the total duration for a day never exceeds 1440 minutes
  - Supports adding, editing, and deleting activities

- **Data Storage with Firebase**
  - Each user has their own data in Firestore
  - Structure (per user per date):
    - `users/{userId}/days/{date}/activities/{activityId}`

- **Analytics Dashboard**
  - Date-based dashboard: pick a date to see analytics for that day
  - Shows:
    - Total time spent (hours and minutes)
    - Number of activities
    - Number of categories
    - Pie chart of time spent per category (Chart.js)
  - For dates with **no data**:
    - Clean “No data available” view with illustration and CTA-style copy

- **Analyse Button**
  - Once there is at least some data for a date (up to 1440 minutes), the "Analyse" button becomes clickable
  - Scrolls to / highlights the dashboard section and updates analytics for the selected date

- **Responsive UI / UX**
  - Fully responsive layout for mobile, tablet, and desktop
  - Modern card-based design, consistent color palette, and subtle shadows
  - Smooth hover effects for buttons and neat layout for activity list and stats
  - Simple and clear flow:
    - Login → Select Date → Add Activities → Analyse → View Dashboard

---

## 📁 Project Structure

.
├── index.html # Main HTML: auth section + app + dashboard
├── styles.css # Global styles and responsive layout
├── app.js # Firebase config, auth, Firestore CRUD, and dashboard logic
└── README.md # Project documentation


---

## 🧩 Data Model

The app uses Cloud Firestore with a per-user, per-day structure:

users
└── {userId}
└── days
└── {dateKey} # e.g., "2025-12-09"
└── activities
└── {activityId}
├── name: string
├── category: string
└── duration: number (minutes)

This makes it easy to query all activities for a specific user and date.

---

## 🧪 How to Run the Project Locally

1. **Clone the repository**

git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

2. **Set up Firebase**

- Go to the Firebase Console and create a new project.
- Add a **Web app** to the project.
- Enable:
  - **Authentication → Sign-in method → Email/Password and Google**
  - **Firestore Database → Start in test mode (for development)**
- Copy the Firebase config object from Project Settings → Your apps → Web app.

3. **Configure `app.js`**

- Open `app.js`.
- Replace the `firebaseConfig` object with your actual config values from the Firebase Console.

4. **Run locally**

- Open the project in VS Code (or similar).
- Use a simple static server (for example, the “Live Server” extension in VS Code).
- Right-click `index.html` → “Open with Live Server”.
- The app will open in your browser (usually at `http://127.0.0.1:5500` or similar).

5. **Test the app**

- Sign up with a new account.
- Log in and select a date.
- Add several activities, making sure the total does not exceed 1440 minutes.
- Click **Analyse** to see the dashboard and charts.
- Check the "No data available" view by choosing a date with no activities.

---

## 🌐 Deployment (GitHub Pages)

1. Commit and push your code to a public GitHub repository:

git add .
git commit -m "Initial AI time tracker app"
git push origin main

2. In your GitHub repository:
- Go to **Settings → Pages**.
- Under **Source**, select:
  - Branch: `main`
  - Folder: `/root`
- Save the configuration.

3. After a short build, GitHub Pages will give you a deployment URL like:

https://<your-username>.github.io/<your-repo-name>/
4. Use this URL as your **Live Demo** link in the submission.