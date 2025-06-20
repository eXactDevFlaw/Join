// 1. Firebase SDK einbinden (siehe vorherige Antwort)
// 2. Konfiguration (dein Link als databaseURL)
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "join-19b54.firebaseapp.com",
  databaseURL: "https://join-19b54-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "join-19b54",
  storageBucket: "join-19b54.appspot.com",
  messagingSenderId: "DEINE_MESSAGING_SENDER_ID",
  appId: "DEINE_APP_ID"
};

// 3. Initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Beispiel: Nutzer anlegen
function addUser(userId, name, email, password) {
  db.ref("users/" + userId).set({
    name: name,
    email: email,
    password: password
  });
}

// Beispiel: Task anlegen
function addTask(taskId, title, description, assignedTo, dueDate, status) {
  db.ref("tasks/" + taskId).set({
    title: title,
    description: description,
    assignedTo: assignedTo,
    dueDate: dueDate,
    status: status
  });
}

function toggleLogoutOverlay(){
    document.getElementById("overlay-small-logout-win").classList.toggle("d_none");
}

// function closeLogoutOverlay(){
//     document.getElementById("overlay-small-logout-win").classList.add("d_none");
// }

function stopPropagation(event) {
  event.stopPropagation();
}

const btnHelpBack = document.getElementById('btn-help-back');

btnHelpBack.addEventListener("click", () => {
  window.history.back()
})