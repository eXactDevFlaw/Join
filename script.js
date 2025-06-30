/**
 * 
 */
const navLogin = document.getElementById('nav-login');
const navSummary = document.getElementById('nav-summary');
const navAddTask = document.getElementById('nav-add-task');
const navBoard = document.getElementById('nav-board');
const navContacts = document.getElementById('nav-contacts');
const FIREBASE_URL = "https://join-19b54-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Retrieves contacts from the database.
 * @async
 * @function
 * @returns {Promise<object>} A promise that resolves to the contacts data from the database.
 */
async function getUsersFromDatabase() {
  let users = await loadFromDatabase("users");
  console.log(typeof(users))
  return users;
}

async function getContactsFromDatabase() {
  let contacts = await loadFromDatabase("contacts");
  return contacts;
}
/**
 * Retrieves contacts from the database.
 * @async
 * @function
 * @returns {Promise<object>} A promise that resolves to the contacts data from the database.
 */
async function getTasksFromDatabase() {
  let tasks = await loadFromDatabase("tasks");
  return tasks;
}

/**
 * Loads data from the specified path in the Firebase Realtime Database.
 * @async
 * @function
 * @param {string} path - The path to the data in the database.
 * @returns {Promise<object>} A promise that resolves to the data from the database.
 */
async function loadFromDatabase(path) {
  let response = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await response.json();
  console.log(typeof(responseToJson));
  return responseToJson;
}

/**
 * Posts new data to the specified path in the Firebase Realtime Database.
 * @async
 * @function
 * @param {string} path - The path where the data should be posted.
 * @param {object} data - The data to be posted.
 * @returns {Promise<object>} A promise that resolves to the response data from the database.
 */
async function postToDatabase(path, data) {
  let response = await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Updates data at the specified path in the Firebase Realtime Database.
 * @async
 * @function
 * @param {string} path - The path where the data should be updated.
 * @param {object} data - The data to be updated.
 * @returns {Promise<object>} A promise that resolves to the response data from the database.
 */
async function updateOnDatabase(path, data) {
  let response = await fetch(FIREBASE_URL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Deletes data from the specified path in the Firebase Realtime Database.
 * @async
 * @function
 * @param {string} path - The path to the data to be deleted.
 * @returns {Promise<object>} A promise that resolves to the response data from the database.
 */
async function deleteFromDatabase(path) {
  let response = await fetch(FIREBASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

function toggleLogoutOverlay() {
  document
    .getElementById("overlay-small-logout-win")
    .classList.toggle("d_none");
}

// function closeLogoutOverlay(){
//     document.getElementById("overlay-small-logout-win").classList.add("d_none");
// }

function stopPropagation(event) {
  event.stopPropagation();
}

// function init() {
//     // getContactsFromDatabase()
//     // fetchUsers();
// }


let isUserLogin = true;
function renderNavbar() {
  console.log(isUserLogin)
  if (!isUserLogin) {
    console.log(isUserLogin)
    navLogin.classList.add('d_none');
    navSummary.classList.remove('d_none');
    navAddTask.classList.remove('d_none');
    navBoard.classList.remove('d_none');
    navContacts.classList.remove('d_none');
  } else {
    console.log(isUserLogin)
    navLogin.classList.remove('d_none');
    navSummary.classList.add('d_none');
    navAddTask.classList.add('d_none');
    navBoard.classList.add('d_none');
    navContacts.classList.add('d_none');
  }
}
renderNavbar();

function locationReload() {
  location.reload();
}