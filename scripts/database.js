// === Firebase SDK initialisieren (Browser-kompatibel) ===
// Achtung: Stelle sicher, dass die Firebase SDKs via <script> in deiner HTML eingebunden sind!

const firebaseConfig = {
  apiKey: "AIzaSyBnosdHgCr19bkqmG6rYitI1pO0OhryIi4",
  authDomain: "join-19b54.firebaseapp.com",
  databaseURL: "https://join-19b54-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-19b54",
  storageBucket: "join-19b54.firebasestorage.app",
  messagingSenderId: "107000721938",
  appId: "1:107000721938:web:39af9b25fc2f55f7001ecb",
  measurementId: "G-BFRZ336C48"
};

// Firebase-Initialisierung
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const contactsRef = db.ref("contacts");

// === Funktionen für Kontakte ===

async function fetchContacts() {
  const snapshot = await contactsRef.once("value");
  const data = snapshot.val() || {};
  return Object.entries(data).map(([id, c]) => ({ id, ...c }));
}

async function createContact(contact) {
  const newRef = contactsRef.push();
  await newRef.set(contact);
}

async function updateContact(id, contact) {
  await contactsRef.child(id).update(contact);
}

async function deleteContact(id) {
  await contactsRef.child(id).remove();
}
