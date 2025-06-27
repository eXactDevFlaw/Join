const userNameInput = document.querySelector('#login-username');
const userPasswordInput = document.querySelector('#login-userpassword');
const loginBtn = document.querySelector('.login_btn');
const guestLoginBtn = document.querySelector('.guest_login_btn');
const toggleSignIn = document.querySelector('.btn_sign_up');
const toggleLogIn = document.querySelector('#signin-btn-back');
const togglePrivacyCheck = document.querySelector('#signin-btn-checkbox');
const signupBtn = document.querySelector('#sign-up');
const errorRef = document.getElementById('error-wrapper');
const passwordInput = document.getElementById("login-userpassword");
const passwordIcon = document.getElementById("password-icon");
const lockIcon = "./assets/icons/lock.svg";
const eyeIcon = "./assets/icons/visibility_off.svg";
const eyeOffIcon = "./assets/icons/visibility.svg";

let isPasswordVisible = false;

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let hiddenItems = document.querySelectorAll(".fade_out");

    hiddenItems.forEach(function (element) {
      element.classList.add("fade_in");
      element.classList.remove("fade_out");
    });
  }, 1000);

  updateIcon()
});

guestLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location = "./summary.html";
})

function showError(message) {
  userNameInput.classList.add('input_error_border');
  userPasswordInput.classList.add('input_error_border');
  errorRef.innerText = message;
}

userNameInput.addEventListener('input', () => {
  if (userNameInput.classList.contains('input_error_border')) {
    userNameInput.classList.remove('input_error_border');
    userPasswordInput.classList.remove('input_error_border');
    errorRef.innerText = "";
  }
});

userPasswordInput.addEventListener('input', () => {
  if (userPasswordInput.classList.contains('input_error_border')) {
    userNameInput.classList.remove('input_error_border');
    userPasswordInput.classList.remove('input_error_border');
    errorRef.innerText = "";
  }
});

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

async function checkUserCredentials(email, password) {
  if (!isValidEmail(email)) return false;
  if (password.length <= 3) return false;

  const dataArr = await fetchUsers();
  for (let item of Object.values(dataArr)) {
    if (item.email === email && item.password === password) {
      return true;
    }
  }
  return false;
}

loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  let userPassInp = userPasswordInput.value;
  let userNameInp = userNameInput.value;

  const OK = await checkUserCredentials(userNameInp, userPassInp);
  if (OK) {
    console.log("Check OK!!!");
    resetInputFields();
  } else {
    resetInputFields();
    showError("Check your email and password. Please try again.");
    console.log("ERROR LOGIN FAIL!!!!")
  }
});

function resetInputFields() {
  userPasswordInput.value = "";
  userNameInput.value = "";

  userNameInput.classList.remove('input_error_border');
  userPasswordInput.classList.remove('input_error_border');
  updateIcon()
};

toggleSignIn.addEventListener('click', toggleFormLoginSignin);
toggleLogIn.addEventListener('click', toggleFormLoginSignin);

function toggleFormLoginSignin() {
  document.getElementById("login-form").classList.toggle("d_none");
  document.getElementById("signin-form").classList.toggle("d_none");
  document.getElementById("signin-container").classList.toggle("d_none");
}

togglePrivacyCheck.addEventListener('click', () => {
  let btnRef = document.getElementById("signin-btn-checkbox");
  let imgRef = document.getElementById("signin-btn-checkbox-img");

  if (btnRef.checked) {
    imgRef.src = "./assets/icons/checkbox_active.svg";
  } else {
    imgRef.src = "./assets/icons/checkbox.svg";
  }
})

signupBtn.addEventListener('click', () => {
  console.log("hier muss der push in die DB")
})


function updateIcon() {
  if (passwordInput.value) {
    passwordIcon.src = isPasswordVisible ? eyeOffIcon : eyeIcon;
    passwordIcon.style.cursor = "pointer";
  } else {
    passwordIcon.src = lockIcon;
    passwordIcon.style.cursor = "default";
  }
}

passwordInput.addEventListener("input", updateIcon);

passwordIcon.addEventListener("click", function () {
  if (!passwordInput.value) return; // Nichts tun, wenn Feld leer

  isPasswordVisible = !isPasswordVisible;
  passwordInput.type = isPasswordVisible ? "text" : "password";
  updateIcon();
});

async function fetchUsers() {
  const users = await getContactsFromDatabase();
  return users
}