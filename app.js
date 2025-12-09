// app.js

// Import Firebase SDKs via CDN (v11 example) [web:19][web:21]
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// REMOVE these lines (they are for npm bundler, not CDN):
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your Firebase config (keep your values)
const firebaseConfig = {
  apiKey: "AIzaSyCwCw5KlAeMCF9eAUV93BFRlgv9CCKfaA4",
  authDomain: "ai-time-tracker-2d86a.firebaseapp.com",
  projectId: "ai-time-tracker-2d86a",
  storageBucket: "ai-time-tracker-2d86a.firebasestorage.app",
  messagingSenderId: "899357474430",
  appId: "1:899357474430:web:c8c03b97f00c305245622f",
  measurementId: "G-EBLL6FVRTK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------ rest of your existing JS stays exactly same ------------------

const authPage = document.getElementById("auth-page");
const appRoot = document.getElementById("app");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignupBtn = document.getElementById("show-signup");
const showLoginBtn = document.getElementById("show-login");
const googleLoginBtn = document.getElementById("google-login");

const userEmailSpan = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

const dateInput = document.getElementById("date-input");
const remainingMinutesSpan = document.getElementById("remaining-minutes");
const activityForm = document.getElementById("activity-form");
const activitiesUl = document.getElementById("activities-ul");
const analyseBtn = document.getElementById("analyse-btn");

const noDataView = document.getElementById("no-data-view");
const dashboard = document.getElementById("dashboard");
const statTotal = document.getElementById("stat-total");
const statCount = document.getElementById("stat-count");
const statCategories = document.getElementById("stat-categories");
const categoryCanvas = document.getElementById("categoryChart");

let currentUser = null;
let currentDateStr = null;
let activities = [];
let chartInstance = null;

function formatDateToKey(date) {
  return date;
}

function computeTotalMinutes() {
  return activities.reduce((sum, a) => sum + a.duration, 0);
}

function updateRemainingAndButton() {
  const total = computeTotalMinutes();
  const remaining = Math.max(0, 1440 - total);
  remainingMinutesSpan.textContent = remaining;
  analyseBtn.disabled = total === 0;
}

showSignupBtn.addEventListener("click", () => {
  document.getElementById("signup-card").classList.remove("hidden");
  document.querySelector(".auth-card").classList.add("hidden");
});

showLoginBtn.addEventListener("click", () => {
  document.getElementById("signup-card").classList.add("hidden");
  document.querySelector(".auth-card").classList.remove("hidden");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created. You are now logged in.");
  } catch (err) {
    alert("Signup failed: " + err.message);
  }
});

googleLoginBtn.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    alert("Google sign-in failed: " + err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    userEmailSpan.textContent = user.email || "Logged in";
    authPage.classList.add("hidden");
    appRoot.classList.remove("hidden");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
    handleDateChange();
  } else {
    currentUser = null;
    authPage.classList.remove("hidden");
    appRoot.classList.add("hidden");
  }
});

dateInput.addEventListener("change", handleDateChange);

async function handleDateChange() {
  if (!currentUser) return;
  const dateVal = dateInput.value;
  if (!dateVal) return;
  currentDateStr = formatDateToKey(dateVal);
  await loadActivities();
}

async function loadActivities() {
  if (!currentUser || !currentDateStr) return;
  activities = [];
  activitiesUl.innerHTML = "";

  const dayCollectionRef = collection(
    db,
    "users",
    currentUser.uid,
    "days",
    currentDateStr,
    "activities"
  );

  const q = query(dayCollectionRef);
  const snap = await getDocs(q);
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    activities.push({
      id: docSnap.id,
      name: data.name,
      category: data.category || "Uncategorized",
      duration: data.duration || 0,
    });
  });

  renderActivities();
  updateRemainingAndButton();
  updateDashboard();
}

function renderActivities() {
  activitiesUl.innerHTML = "";
  if (activities.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No activities logged yet.";
    li.style.fontSize = "0.85rem";
    li.style.color = "#9ca3af";
    activitiesUl.appendChild(li);
    return;
  }

  activities.forEach((act) => {
    const li = document.createElement("li");
    li.className = "activity-item";

    const metaDiv = document.createElement("div");
    metaDiv.className = "activity-meta";
    const nameSpan = document.createElement("span");
    nameSpan.className = "activity-name";
    nameSpan.textContent = act.name;
    const catSpan = document.createElement("span");
    catSpan.className = "activity-category";
    catSpan.textContent = act.category;
    metaDiv.appendChild(nameSpan);
    metaDiv.appendChild(catSpan);

    const durationDiv = document.createElement("div");
    durationDiv.className = "activity-duration";
    durationDiv.textContent = act.duration + " min";

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "activity-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => onEditActivity(act));

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => onDeleteActivity(act));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(delBtn);

    li.appendChild(metaDiv);
    li.appendChild(durationDiv);
    li.appendChild(actionsDiv);

    activitiesUl.appendChild(li);
  });
}

activityForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser || !currentDateStr) return;

  const name = document.getElementById("activity-name").value.trim();
  const category =
    document.getElementById("activity-category").value.trim() || "Uncategorized";
  const durationVal = parseInt(
    document.getElementById("activity-duration").value,
    10
  );

  if (!name || !durationVal || durationVal <= 0) {
    alert("Please enter valid activity name and duration.");
    return;
  }

  const existingTotal = computeTotalMinutes();
  if (existingTotal + durationVal > 1440) {
    alert("Total minutes cannot exceed 1440 for a day.");
    return;
  }

  try {
    const dayCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "days",
      currentDateStr,
      "activities"
    );
    const docRef = await addDoc(dayCollectionRef, {
      name,
      category,
      duration: durationVal,
    });
    activities.push({
      id: docRef.id,
      name,
      category,
      duration: durationVal,
    });
    renderActivities();
    updateRemainingAndButton();
    updateDashboard();
    activityForm.reset();
  } catch (err) {
    alert("Error adding activity: " + err.message);
  }
});

async function onEditActivity(act) {
  const newName = prompt("Update activity name:", act.name);
  if (newName === null) return;
  const newCategory = prompt(
    "Update category:",
    act.category === "Uncategorized" ? "" : act.category
  );
  if (newCategory === null) return;
  const newDurationStr = prompt("Update duration (minutes):", act.duration);
  if (newDurationStr === null) return;
  const newDuration = parseInt(newDurationStr, 10);
  if (!newDuration || newDuration <= 0) {
    alert("Invalid duration");
    return;
  }

  const totalWithoutThis = computeTotalMinutes() - act.duration;
  if (totalWithoutThis + newDuration > 1440) {
    alert("Total minutes cannot exceed 1440 for a day.");
    return;
  }

  try {
    const docRef = doc(
      db,
      "users",
      currentUser.uid,
      "days",
      currentDateStr,
      "activities",
      act.id
    );
    await updateDoc(docRef, {
      name: newName.trim(),
      category: (newCategory || "Uncategorized").trim(),
      duration: newDuration,
    });

    act.name = newName.trim();
    act.category = (newCategory || "Uncategorized").trim();
    act.duration = newDuration;
    renderActivities();
    updateRemainingAndButton();
    updateDashboard();
  } catch (err) {
    alert("Error updating: " + err.message);
  }
}

async function onDeleteActivity(act) {
  const ok = confirm("Delete this activity?");
  if (!ok) return;
  try {
    const docRef = doc(
      db,
      "users",
      currentUser.uid,
      "days",
      currentDateStr,
      "activities",
      act.id
    );
    await deleteDoc(docRef);
    activities = activities.filter((a) => a.id !== act.id);
    renderActivities();
    updateRemainingAndButton();
    updateDashboard();
  } catch (err) {
    alert("Error deleting: " + err.message);
  }
}

analyseBtn.addEventListener("click", () => {
  updateDashboard();
  dashboard.scrollIntoView({ behavior: "smooth" });
});

function updateDashboard() {
  if (!activities.length) {
    dashboard.classList.add("hidden");
    noDataView.classList.remove("hidden");
    return;
  }
  noDataView.classList.add("hidden");
  dashboard.classList.remove("hidden");

  const totalMinutes = computeTotalMinutes();
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  statTotal.textContent = `${hours} h ${minutes} min`;
  statCount.textContent = activities.length.toString();

  const categoryMap = {};
  activities.forEach((a) => {
    const cat = a.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + a.duration;
  });

  const categories = Object.keys(categoryMap);
  const durations = Object.values(categoryMap);
  statCategories.textContent = categories.length.toString();

  const colors = [
    "#4f46e5",
    "#22c55e",
    "#f97316",
    "#ec4899",
    "#0ea5e9",
    "#eab308",
    "#a855f7",
  ];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(categoryCanvas.getContext("2d"), {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: durations,
          backgroundColor: categories.map(
            (_, i) => colors[i % colors.length]
          ),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#e5e7eb",
          },
        },
        title: {
          display: true,
          text: "Time spent per category (minutes)",
          color: "#e5e7eb",
        },
      },
    },
  });
}
