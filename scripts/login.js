window.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let hiddenItems = document.querySelectorAll(".fade_out");

    hiddenItems.forEach(function (element) {
      element.classList.add("fade_in");
      element.classList.remove("fade_out");
    });
  }, 1000);
});

const guestLoginBtn = document.querySelector('.guest_login_btn');
guestLoginBtn.addEventListener('click', () => {
  window.location = "./summary.html";
})

function showError(inputId, message) {
  const inputRef = document.getElementById(inputId);
  const errorRef = document.getElementById('error-wrapper');
  errorRef.innerText = message;
}

const userNameInput = document.querySelector('#login-username');
const userPasswordInput = document.querySelector('#login-userpassword');
const loginBtn = document.querySelector('.login_btn');
loginBtn.addEventListener('click', () => {
  let userPassInp = userPasswordInput.value;
  let userNameInp = userNameInput.value;
  let OK = inputChecker(userNameInp, userPassInp);
  if (OK) {
    console.log("Check OK!!!");
    resetInputFields();
  } else {
    resetInputFields();
    console.log("ERROR LOGIN FAIL!!!!")
  }
})

function resetInputFields() {
    userPasswordInput.value = "";
    userNameInput.value = "";
};

const toggleSignIn = document.querySelector(".btn_sign_up");
toggleSignIn.addEventListener('click', () => {
  document.getElementById("login-form").classList.toggle("d_none");
  document.getElementById("signin-form").classList.toggle("d_none");
  document.getElementById("signin-container").classList.toggle("d_none");
})


function signIn() { }

function togglePrivacyCheck() {
  let btnRef = document.getElementById("signin-btn-checkbox");
  let imgRef = document.getElementById("signin-btn-checkbox-img");

  if (btnRef.checked) {
    imgRef.src = "./assets/icons/checkbox_active.svg";
  } else {
    imgRef.src = "./assets/icons/checkbox.svg";
  }
}

async function fetchUsers() {
  const users = await getContactsFromDatabase();
  console.log(users)
}