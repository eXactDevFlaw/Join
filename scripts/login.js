const userNameInput = document.querySelector('#login-username');
const userPasswordInput = document.querySelector('#login-userpassword');
const loginBtn = document.querySelector('.login_btn');
const guestLoginBtn = document.querySelector('.guest_login_btn');
const toggleSignIn = document.querySelector('.btn_sign_up');
const toggleLogIn = document.querySelector('#signin-btn-back');
const togglePrivacyCheck = document.querySelector('#signin-btn-checkbox');
const signupBtn = document.querySelector('#sign-up');
const errorRef = document.getElementById('error-wrapper');

window.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    let hiddenItems = document.querySelectorAll(".fade_out");

    hiddenItems.forEach(function (element) {
      element.classList.add("fade_in");
      element.classList.remove("fade_out");
    });
  }, 1000);
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
if(userNameInput.classList.contains('input_error_border')){
  userNameInput.classList.remove('input_error_border');
  userPasswordInput.classList.remove('input_error_border');
  errorRef.innerText = "";
}
});

userPasswordInput.addEventListener('input', () => {
if(userPasswordInput.classList.contains('input_error_border')){
  userNameInput.classList.remove('input_error_border');
  userPasswordInput.classList.remove('input_error_border');
  errorRef.innerText = "";
}
});

loginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let userPassInp = userPasswordInput.value;
  let userNameInp = userNameInput.value;
  let OK = inputChecker(userNameInp, userPassInp);
  if (OK) {
    console.log("Check OK!!!");
    resetInputFields();
  } else {
    resetInputFields();
    showError("Check your email and password. Please try again.");
    console.log("ERROR LOGIN FAIL!!!!")
  }
})

function inputChecker(userNameVal, userPassVal) {
  return checkUsername(userNameVal) && checkUserPass(userPassVal);
};

async function checkUsername(value) {
  console.log("das ist der username: " + value)
  if (value.length <= 3) return false;
  const dataArr = await fetchUsers();
  console.log(dataArr);
  for (let item of Object.values(dataArr)) {
    console.log(item)
    if (item.email === value) {
      console.log("das hat geklappt")
      return true;
    }
  }
  console.log("nichts gefunden");
  return false;
}

async function checkUserPass(value) {
  console.log("das ist der userpassword: " + value)
  if (value.length <= 3) return false;
  const dataArr = await fetchUsers();
  for (let item of Object.values(dataArr)) {
    console.log(item.password)
    if (item.password === value) {
      console.log(value)
      console.log("das password ist richtig")
      return true;
    }
  }
  console.log("das password ist flasch")
  return false;
}

function resetInputFields() {
  userPasswordInput.value = "";
  userNameInput.value = "";

  userNameInput.classList.add('input_error_border');
  userPasswordInput.classList.add('input_error_border');
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

async function fetchUsers() {
  const users = await getContactsFromDatabase();
  return users
}