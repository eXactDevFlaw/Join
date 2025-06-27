const userNameInput = document.querySelector('#login-username');
const userPasswordInput = document.querySelector('#login-userpassword');
const loginBtn = document.querySelector('.login_btn');
const guestLoginBtn = document.querySelector('.guest_login_btn');
const toggleSignIn = document.querySelector('.btn_sign_up');
const toggleLogIn = document.querySelector('#signin-btn-back');
const togglePrivacyCheck = document.querySelector('#signin-btn-checkbox');
const signupBtn = document.querySelector('#sign-up');
const errorRef = document.getElementById('error-wrapper');
const loginForm = document.getElementById("login-form");
const signinForm = document.getElementById("signin-form");
const signinContainer = document.getElementById("signin-container");
const signinNameInput = document.getElementById("signin-contactname");
const signinEmailInput = document.getElementById("signin-username");
const signinPasswordInput = document.getElementById("signin-userpassword");
const signinPasswordCheckInput = document.getElementById("signin-userpassword-check");
const signinCheckbox = document.getElementById("signin-btn-checkbox");


signupBtn.disabled = true;

document.addEventListener("DOMContentLoaded", function () {
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

function showError(input, errMsg) {
  userNameInput.classList.add('input_error_border');
  userPasswordInput.classList.add('input_error_border');
  errorRef.innerText = errMsg;
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
    showError(userPassInp, "Check your email and password. Please try again.");
    console.log("ERROR LOGIN FAIL!!!!")
  }
});

function resetInputFields() {
  userPasswordInput.value = "";
  userNameInput.value = "";

  userNameInput.classList.remove('input_error_border');
  userPasswordInput.classList.remove('input_error_border');
};

toggleSignIn.addEventListener('click', toggleFormLoginSignin);
toggleLogIn.addEventListener('click', toggleFormLoginSignin);

function toggleFormLoginSignin() {
  if (loginForm.classList.contains("d_none")) {
    loginForm.classList.remove("d_none");
    signinForm.classList.add("d_none");
    signinContainer.classList.remove("d_none");
  } else {
    loginForm.classList.add("d_none");
    signinForm.classList.remove("d_none");
    signinContainer.classList.add("d_none");
  }
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

const passwordIcon = document.querySelectorAll('.pw_icon')
const passwordValue = document.querySelectorAll('.pw_input')
const lockIcon = "./assets/icons/lock.svg";
const eyeIcon = "./assets/icons/visibility_off.svg";
const eyeOffIcon = "./assets/icons/visibility.svg";
let isPasswordVisible = false;
let isPasswordValue = false

passwordValue.forEach(element => {
  element.addEventListener('input', () =>{
    if (element.value > 0) {
      isPasswordValue = true
    } else {
      isPasswordValue = false
    }
    checkIconState();
  })
})

passwordIcon.forEach(element => {
  element.addEventListener("click", () => {
    isPasswordVisible = !isPasswordVisible 
    passwordValue.forEach((el) => {
      console.log(element)
      checkIconState(el, element)
    })
  })
});

function checkIconState(input, icon) {
  console.log(input, icon)
  if (isPasswordVisible) {
    input.type = "text";
  } else {
    input.type = "password";
  };

  if (isPasswordValue) {
        console.log("pointer")
    icon.src = isPasswordVisible ? eyeOffIcon : eyeIcon;
    icon.style.cursor = "pointer";
  } else {
    console.log("default")
    icon.src = lockIcon;
    icon.style.cursor = "default";
  }
};

function validateSigninForm() {
  const nameValid = signinNameInput.value.trim().length > 0;
  const emailValid = isValidEmail(signinEmailInput.value.trim());
  const passwordValid = signinPasswordInput.value.length > 3;
  const passwordMatch = signinPasswordInput.value === signinPasswordCheckInput.value && signinPasswordInput.value.length > 0;
  const checkboxChecked = signinCheckbox.checked;

  console.log(nameValid)
  signupBtn.disabled = !(nameValid && emailValid && passwordValid && passwordMatch && checkboxChecked);
  cursorEventSigupBtn();
  console.log(nameValid, signinNameInput)
  setInputError(signinNameInput, nameValid);
  setInputError(signinEmailInput, emailValid, "This is not a valid e-mail adress.");
  setInputError(signinPasswordInput, passwordValid);
  setInputError(signinPasswordCheckInput, passwordMatch);
}

function cursorEventSigupBtn() {
  if (signupBtn.disabled) {
    signupBtn.style.cursor = "not-allowed";
  } else {
    signupBtn.style.cursor = "pointer";
  }
}

function setInputError(input, isValid, errMsg) {
  if (!isValid && input.value.length > 0) {
    input.classList.add('input_error_border');
  } else {
    input.classList.remove('input_error_border');
  }
}

[
  signinNameInput,
  signinEmailInput,
  signinPasswordInput,
  signinPasswordCheckInput,
  signinCheckbox
].forEach(el => {
  el.addEventListener('input', validateSigninForm);
  el.addEventListener('change', validateSigninForm);
});


async function fetchUsers() {
  const users = await getContactsFromDatabase();
  return users
}