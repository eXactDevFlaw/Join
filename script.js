const navLogin = document.getElementById('nav-login');
const navBar = document.querySelector('.nav_items');
const helpDiv = document.querySelector('.help_content');
const navBarBottomDiv = document.querySelector('.nav_privacy_legal')
const btnLogOut = document.getElementById('btn-log-out');
const fadeOutRef = document.querySelectorAll('.fade_out');
const userInitials = document.getElementById('header-user-short-latters');
const userNameRef = document.getElementById('user-name');

const API_URL = "https://api.lutz-boelling.dev";

let isUserLogin;
let userDataFromLocalStorage = getUserLogState();

document.addEventListener('DOMContentLoaded', () => {
  getUserLogState();
  renderNavbar();
  getUserInitials();
});

/**
 * Returns the JWT token from localStorage.
 */
function getToken() {
  const data = JSON.parse(localStorage.getItem("isJoinUserLogin"));
  return data ? data.token : null;
}

/**
 * Returns headers with Authorization token for API calls.
 */
function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + getToken()
  };
}

/**
 * Retrieves contacts from the API.
 */
async function getContactsFromDatabase() {
  const res = await fetch(`${API_URL}/api/contacts`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return await res.json();
}

/**
 * Retrieves tasks from the API.
 */
async function getTasksFromDatabase() {
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json();
}

/**
 * Creates a new contact.
 */
async function createContact(contact) {
  const res = await fetch(`${API_URL}/api/contacts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(contact)
  });
  if (!res.ok) throw new Error("Failed to create contact");
  return await res.json();
}

/**
 * Updates a contact by ID.
 */
async function updateContact(id, data) {
  const res = await fetch(`${API_URL}/api/contacts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update contact");
  return await res.json();
}

/**
 * Deletes a contact by ID.
 */
async function deleteContact(id) {
  const res = await fetch(`${API_URL}/api/contacts/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete contact");
  return await res.json();
}

/**
 * Creates a new task.
 */
async function apiCreateTask(task) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error("Failed to create task");
  return await res.json();
}

/**
 * Updates a task by ID.
 */
async function updateTask(id, data) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update task");
  return await res.json();
}

/**
 * Deletes a task by ID.
 */
async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return await res.json();
}

/**
 * Toggles the visibility of the logout overlay.
 */
function toggleLogoutOverlay() {
  document.getElementById("overlay-small-logout-win").classList.toggle("d_none");
}

if (btnLogOut) {
  btnLogOut.addEventListener('click', () => {
    setUserIsLoggedOut();
    window.location = "/index.html";
  });
}

function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * Saves login state + JWT token to localStorage.
 */
function setUserIsLoggedIn(token, name, isGuest = false) {
  if (isGuest) {
    localStorage.setItem("isJoinUserLogin", JSON.stringify({
      loginstate: true,
      token: null,
      userFullName: "Guest User",
      isGuest: true
    }));
  } else {
    localStorage.setItem("isJoinUserLogin", JSON.stringify({
      loginstate: true,
      token: token,
      userFullName: name,
      isGuest: false
    }));
  }
}

/**
 * Clears login state from localStorage.
 */
function setUserIsLoggedOut() {
  localStorage.setItem("isJoinUserLogin", JSON.stringify({
    loginstate: false,
    token: null,
    userFullName: null,
    isGuest: false
  }));
}

/**
 * Reads login state from localStorage.
 */
function getUserLogState() {
  let data = JSON.parse(localStorage.getItem("isJoinUserLogin"));
  if (data) {
    isUserLogin = data.loginstate === true;
  } else {
    isUserLogin = false;
  }
  return data;
}

/**
 * Renders navbar based on login state.
 */
function renderNavbar() {
  if (isUserLogin && navLogin && navBar) {
    helpDiv.classList.remove('v_hidden');
    navLogin.classList.add('d_none');
    navBarBottomDiv.classList.add('d_none');
    navBar.classList.remove('d_none');
  } else if (!isUserLogin && navLogin && navBar) {
    helpDiv.classList.add('v_hidden');
    navLogin.classList.remove('d_none');
    navBarBottomDiv.classList.remove('d_none');
    navBar.classList.add('d_none');
  }
}

function locationReload() {
  location.reload();
}

/**
 * Displays user initials in the header.
 */
function getUserInitials() {
  if (!userDataFromLocalStorage || !userDataFromLocalStorage.userFullName) return;
  if (userNameRef) userNameRef.innerText = userDataFromLocalStorage.userFullName;
  let userName = userDataFromLocalStorage.userFullName.trim().split(' ');
  let firstInitial = userName[0][0].toUpperCase();
  let lastInitial = userName[userName.length - 1][0].toUpperCase();
  if (userInitials) userInitials.innerText = firstInitial + lastInitial;
}