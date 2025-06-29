const pwIcons = document.querySelectorAll('.pw_icon');
const pwInputs = document.querySelectorAll('.pw_input');
const lockIcon = "./assets/icons/lock.svg";
const eyeIcon = "./assets/icons/visibility_off.svg";
const eyeOffIcon = "./assets/icons/visibility.svg";
const userNameInput = document.querySelector('#login-username');
const userPasswordInput = document.querySelector('#login-userpassword');
const loginBtn = document.querySelector('.login_btn');
const guestLoginBtn = document.querySelector('.guest_login_btn');
const signinForm = document.getElementById("signin-form");
const signinContainer = document.getElementById("signin-container");
const signinNameInput = document.getElementById("signin-contactname");
const signinEmailInput = document.getElementById("signin-username");
const signinPasswordInput = document.getElementById("signin-userpassword");
const signinPasswordCheckInput = document.getElementById("signin-userpassword-check");
const signinCheckbox = document.getElementById("signin-btn-checkbox");
const signupBtn = document.querySelector('#sign-up');
const dialogSignin = document.getElementById("dialog_signin");
const toggleSignIn = document.querySelector('.btn_sign_up');
const toggleLogIn = document.querySelector('#signin-btn-back');
const togglePrivacyCheck = document.querySelector('#signin-btn-checkbox');
let isPasswordVisible = false;

function showInputError(input, message) {
  const wrapper = input.closest('.input_icon_wrapper');
  let errorDiv = wrapper ? wrapper.querySelector('.input_error') : null;
  input.classList.add('input_error_border');
  if (errorDiv) errorDiv.innerText = message || '';
  updatePwIcons();
}

function clearInputError(input) {
  const wrapper = input.closest('.input_icon_wrapper');
  let errorDiv = wrapper ? wrapper.querySelector('.input_error') : null;
  input.classList.remove('input_error_border');
  if (errorDiv) errorDiv.innerText = '';
  updatePwIcons();
}

function setSignupBtnState(isDisabled) {
  signupBtn.disabled = isDisabled;
  signupBtn.style.cursor = isDisabled ? "not-allowed" : "pointer";
}

function updatePwIcons() {
  for (let i = 0; i < pwInputs.length; i++) {
    if (pwInputs[i].value.length === 0) {
      pwIcons[i].src = lockIcon;
      pwIcons[i].style.cursor = "default";
      pwInputs[i].type = "password";
    } else {
      if (isPasswordVisible) {
        pwInputs[i].type = "text";
        pwIcons[i].src = eyeOffIcon;
      } else {
        pwInputs[i].type = "password";
        pwIcons[i].src = eyeIcon;
      }
      pwIcons[i].style.cursor = "pointer";
    }
  }
}

function showLoginErrorBothRed(message) {
  userNameInput.classList.add('input_error_border');
  userPasswordInput.classList.add('input_error_border');
  setLoginErrorMessage(userNameInput, "");
  setLoginErrorMessage(userPasswordInput, message);
  updatePwIcons();
}

function setLoginErrorMessage(input, message) {
  const wrapper = input.closest('.input_icon_wrapper');
  if (wrapper) {
    const errorDiv = wrapper.querySelector('.input_error');
    if (errorDiv) errorDiv.innerText = message || '';
  }
}

function clearLoginError() {
  clearInputError(userNameInput);
  clearInputError(userPasswordInput);
}

function isValidEmail(email) {
  let trimmedEmail = email.trim();
  return checkEmailAt(trimmedEmail) && checkEmailDot(trimmedEmail) && checkEmailNoSpace(trimmedEmail);
}

function checkEmailAt(email) {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return false;
  const secondAt = email.indexOf('@', atIndex + 1);
  if (secondAt !== -1) return false;
  if (atIndex < 1) return false;
  return true;
}

function checkEmailDot(email) {
  const atIndex = email.indexOf('@');
  const dotIndex = email.indexOf('.', atIndex);
  if (dotIndex === -1 || dotIndex === email.length - 1) return false;
  return true;
}

function checkEmailNoSpace(email) {
  return !email.includes(' ');
}

function isValidFullName(name) {
  let trimmedName = name.trim();
  const parts = trimmedName.split(/\s+/);
  if (parts.length < 2) return false;
  return checkNameParts(parts);
}

function checkNameParts(parts) {
  const letterRegex = /^[A-Za-zÄÖÜäöüß]+$/;
  for (let i = 0; i < parts.length; i++) {
    if (!letterRegex.test(parts[i])) return false;
  }
  return true;
}

function formatFullName(name) {
  let trimmedName = name.trim();
  let nameParts = trimmedName.split(/\s+/);
  let formattedParts = [];
  for (let i = 0; i < nameParts.length; i++) {
    let word = nameParts[i];
    let formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    formattedParts.push(formattedWord);
  }
  return formattedParts.join(' ');
}

function doPasswordsMatch() {
  if (!signinPasswordInput || !signinPasswordCheckInput) return false;
  if (signinPasswordInput.value !== signinPasswordCheckInput.value) return false;
  if (signinPasswordInput.value.length === 0) return false;
  return true;
}

async function checkUserCredentials(email, password) {
  if (!isValidEmail(email)) return false;
  if (password.length <= 3) return false;
  const users = await fetchUsers();
  return findMatchingUser(users, email, password);
}

function findMatchingUser(users, email, password) {
  const userValues = Object.values(users);
  for (let i = 0; i < userValues.length; i++) {
    if (userValues[i].email === email && userValues[i].password === password) {
      return true;
    }
  }
  return false;
}

async function emailExists(email) {
  const users = await fetchUsers();
  const userValues = Object.values(users);
  for (let i = 0; i < userValues.length; i++) {
    if (userValues[i].email === email) return true;
  }
  return false;
}

function showEmailExistsError() {
  showInputError(signinEmailInput, "Email already in use.");
}

async function handleLogin(event) {
  event.preventDefault();
  clearLoginError();
  const email = userNameInput.value;
  const password = userPasswordInput.value;
  let emailValid = isValidEmail(email);
  let passwordValid = password.length > 3;
  if (!emailValid || !passwordValid) {
    showLoginErrorBothRed("Check your email and password. Please try again.");
    return;
  }
  const isOk = await checkUserCredentials(email, password);
  if (isOk) {
    userPasswordInput.value = "";
    userNameInput.value = "";
    clearLoginError();
    updatePwIcons();
    isUserLogin = true;
    //Hier muss dann die weiterlitung rein !
  } else {
    showLoginErrorBothRed("Check your email and password. Please try again.");
    userPasswordInput.value = "";
    userNameInput.value = "";
    updatePwIcons();
  }
}

function validateSigninForm() {
  let nameValid = isValidFullName(signinNameInput.value);
  let emailValid = isValidEmail(signinEmailInput.value.trim());
  let passwordValid = signinPasswordInput.value.length > 3;
  let passwordMatch = doPasswordsMatch();
  let checkboxChecked = signinCheckbox.checked;
  showInputErrorIfInvalid(signinNameInput, nameValid, "Please enter your first and last name.");
  showInputErrorIfInvalid(signinEmailInput, emailValid, "Please enter a viald email-adress.");
  showInputErrorIfInvalid(signinPasswordInput, passwordValid, "Please enter atleast 4 letters.");
  showInputErrorIfInvalid(signinPasswordCheckInput, passwordMatch, "The password didn't match.");
  let disabled = !(nameValid && emailValid && passwordValid && passwordMatch && checkboxChecked);
  setSignupBtnState(disabled);
}

function showInputErrorIfInvalid(input, isValid, msg) {
  if (!input) return;
  if (!isValid && input.value.length > 0) showInputError(input, msg);
  else clearInputError(input);
}

async function handleSignup(event) {
  event.preventDefault();
  validateSigninForm();
  if (signupBtn.disabled) return;
  const name = formatFullName(signinNameInput.value);
  const email = signinEmailInput.value.trim();
  const password = signinPasswordInput.value;

  if (await emailExists(email)) {
    showEmailExistsError();
    return;
  }

  const userData = { name, email, password };
  const contactData = { name, email };
  await saveUserAndContact(userData, contactData);
  showSigninSuccessDialog();
}

function showSigninSuccessDialog() {
  if (!dialogSignin) return;
  dialogSignin.classList.remove("d_none");
  const innerBox = document.getElementById('dialog_signin_inner');
  if (innerBox) {
    innerBox.classList.remove('hide_dialog_signin');
    innerBox.classList.add('show_dialog_signin');
  }
  clearSigninInputs();
  setTimeout(function () {
    hideSigninSuccessDialog();
    showLoginAfterSignin();
  }, 1800);
}

function hideSigninSuccessDialog() {
  if (!dialogSignin) return;
  dialogSignin.classList.add("d_none");
  const innerBox = document.getElementById('dialog_signin_inner');
  if (innerBox) {
    innerBox.classList.remove('show_dialog_signin');
    innerBox.classList.add('hide_dialog_signin');
  }
}

function showLoginAfterSignin() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm || !signinForm || !signinContainer) return;
  loginForm.classList.remove("d_none");
  signinForm.classList.add("d_none");
  signinContainer.classList.remove("d_none");
}

function clearSigninInputs() {
  if (signinNameInput) signinNameInput.value = "";
  if (signinEmailInput) signinEmailInput.value = "";
  if (signinPasswordInput) signinPasswordInput.value = "";
  if (signinPasswordCheckInput) signinPasswordCheckInput.value = "";
  if (signinCheckbox) signinCheckbox.checked = false;
}


async function fetchUsers() {
  return await getUsersFromDatabase();
}
async function saveUserAndContact(userData, contactData) {
  await postToDatabase('/users', userData);
  await postToDatabase('/contacts', contactData);
}

function setupPasswordToggle() {
  for (let i = 0; i < pwIcons.length; i++) {
    pwIcons[i].addEventListener('click', function () {
      if (pwInputs[i].value.length === 0) return;
      isPasswordVisible = !isPasswordVisible;
      updatePwIcons();
    });
  }
  updatePwIcons();
}

function runFadeInOut() {
  setTimeout(function () {
    const elements = document.querySelectorAll(".fade_out");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("fade_in");
      elements[i].classList.remove("fade_out");
    }
  }, 1000);
}

function setupLoginListeners() {
  if (loginBtn) loginBtn.addEventListener('click', handleLogin);
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location = "./summary.html";
    });
  }
  if (userNameInput) userNameInput.addEventListener('input', clearLoginError);
  if (userPasswordInput) userPasswordInput.addEventListener('input', function () {
    clearLoginError();
    updatePwIcons();
  });
}

function setupSigninListeners() {
  if (signupBtn) signupBtn.addEventListener('click', handleSignup);
  [
    signinNameInput,
    signinEmailInput,
    signinPasswordInput,
    signinPasswordCheckInput,
    signinCheckbox
  ].forEach(function (el) {
    if (el) {
      el.addEventListener('input', function () {
        validateSigninForm();
        updatePwIcons();
      });
      el.addEventListener('change', function () {
        validateSigninForm();
        updatePwIcons();
      });
    }
  });
}

function setupToggleListeners() {
  if (toggleSignIn && toggleLogIn) {
    toggleSignIn.addEventListener('click', toggleFormLoginSignin);
    toggleLogIn.addEventListener('click', toggleFormLoginSignin);
  }
  function toggleFormLoginSignin() {
    const loginForm = document.getElementById("login-form");
    if (!loginForm || !signinForm || !signinContainer) return;
    const loginHidden = loginForm.classList.contains("d_none");
    if (!loginHidden) {
      loginForm.classList.add("d_none");
      signinForm.classList.remove("d_none");
      signinContainer.classList.add("d_none");
    } else {
      loginForm.classList.remove("d_none");
      signinForm.classList.add("d_none");
      signinContainer.classList.remove("d_none");
    }
  }
}

function setupPrivacyCheckboxListener() {
  if (togglePrivacyCheck) {
    togglePrivacyCheck.addEventListener('click', function () {
      let btnRef = document.getElementById("signin-btn-checkbox");
      let imgRef = document.getElementById("signin-btn-checkbox-img");
      if (btnRef && imgRef) {
        imgRef.src = btnRef.checked
          ? "./assets/icons/checkbox_active.svg"
          : "./assets/icons/checkbox.svg";
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  runFadeInOut();
  setupLoginListeners();
  setupSigninListeners();
  setupToggleListeners();
  setupPrivacyCheckboxListener();
  setupPasswordToggle();
});