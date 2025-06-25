window.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let hiddenItems = document.querySelectorAll(".fade_out");

    hiddenItems.forEach(function (element) {
      element.classList.add("fade_in");
      element.classList.remove("fade_out");
    });
  }, 1000);
});

function toggleSignIn() {
  document.getElementById("login-form").classList.toggle("d_none");
  document.getElementById("signin-form").classList.toggle("d_none");
  document.getElementById("signin-container").classList.toggle("d_none");
}

function signIn() {}

function togglePrivacyCheck() {
  let btnRef = document.getElementById("signin-btn-checkbox");
  let imgRef = document.getElementById("signin-btn-checkbox-img");

  if (btnRef.checked) {
    imgRef.src = "./assets/icons/checkbox_active.svg";
  } else {
    imgRef.src = "./assets/icons/checkbox.svg";
  }
}

function guestLogin() {
  window.location = "./summary.html";
}

function showError(inputId, message) {
  const inputRef = document.getElementById(inputId);
  const errorRef = document.getElementById('error-wrapper');
  errorRef.innerText = message;
}

async function login(data) {
  const userName = document.getElementById('login-username').value.trim();
  const userPassword = document.getElementById('login-userpassword').value ;

  if (!userName || !userPassword) {
    showError('login-userpassword', 'Check your email and password. Please try again.')
  }
}

async function fetchUsers() {
  const users = await getContactsFromDatabase();
  console.log(users)
}