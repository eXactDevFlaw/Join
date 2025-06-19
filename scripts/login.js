let userName = document.getElementById('username');
let userPassword = document.getElementById('userpassword')

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    
    let hiddenItems = document.querySelectorAll('.fade_out');
   
    hiddenItems.forEach(function(element) {
      element.classList.add('fade_in');
      element.classList.remove('fade_out');
    });
  }, 1000);
});

function toggleSignIn() {
  document.getElementById('login-form').classList.toggle('d_none');
  document.getElementById('signin-form').classList.toggle('d_none');
  document.getElementById('signin-container').classList.toggle('d_none');
}

function signIn() {
  
}

function togglePrivacyCheck(){
  let btnRef = document.getElementById('signin-btn-checkbox');
  let imgRef = document.getElementById('signin-btn-checkbox-img');

  if(btnRef.checked){
    imgRef.src = "./assets/icons/checkbox_active.svg"
  }else{
    imgRef.src = "./assets/icons/checkbox.svg"
  }
}

function guestLogin(){
  window.location = "./summary.html"
}


// Fehler-Objekte für beide Formulare
const loginErrors = {};
const signinErrors = {};

// Rote Border beim Fehler setzen oder entfernen
function setInputErrorStyle(input, hasError) {
  // Wenn das Feld leer ist, zeige die neutrale Border
  if (input.value === "") {
    input.style.borderColor = "#ccc";
  } else {
    input.style.borderColor = hasError ? "#e53935" : "#ccc";
  }
}

// Fehlermeldung unter Feld anzeigen und Border setzen
function showFieldError(input, message) {
  const errDiv = input.parentElement.querySelector('.input_error');
  // Wenn Feld leer ist: keine Fehlermeldung, Border neutral
  if (input.value === "") {
    if (errDiv) errDiv.textContent = '';
    input.style.borderColor = "#ccc";
  } else {
    if (errDiv) errDiv.textContent = message || '';
    input.style.borderColor = message ? "#e53935" : "#ccc";
  }
}

// Alle Fehler im Formular anzeigen
function showFormErrors(form, errors) {
  Array.from(form.elements).forEach(input => {
    if (input.name) showFieldError(input, errors[input.name]);
  });
  if (form.id === "signin-form") showPrivacyError(form);
}

// Loginfeld prüfen
function validateLoginField(name, value) {
  if (name === "username" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Bitte gültige E-Mail eingeben.";
  if (name === "userpassword" && (!value || value.length < 6))
    return "Bitte Passwort (mind. 6 Zeichen) eingeben.";
  return "";
}

// Anmeldefeld prüfen
function validateSigninField(form, name, value) {
  if (name === "contactname" && !value.trim().includes(" "))
    return "Vor- und Nachname erforderlich.";
  if (name === "username" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Bitte gültige E-Mail eingeben.";
  if (name === "userpassword" && (!value || value.length < 6))
    return "Passwort zu kurz (mind. 6 Zeichen).";
  if (name === "userpasswordrepeat") {
    let pw = form.elements["userpassword"].value;
    if (value !== pw) return "Passwörter stimmen nicht überein.";
  }
  return "";
}

// Checkbox prüfen
function validatePrivacy(form) {
  let cb = form.querySelector("#signin-btn-checkbox");
  return cb && !cb.checked ? "Bitte akzeptiere die Datenschutzrichtlinie." : "";
}

// Fehlermeldung für Datenschutz anzeigen
function showPrivacyError(form) {
  let cb = form.querySelector("#signin-btn-checkbox");
  let errDiv = cb.closest('label').parentElement.querySelector('.input_error');
  errDiv.textContent = signinErrors["privacy"] || '';
}

// Login: Prüfung bei Eingabe
function onInputLogin(e) {
  let input = e.target;
  if (!input.name) return;
  loginErrors[input.name] = validateLoginField(input.name, input.value);
  showFieldError(input, loginErrors[input.name]);
}

// Signin: Prüfung bei Eingabe
function onInputSignin(e) {
  let input = e.target;
  if (!input.name) return;
  signinErrors[input.name] = validateSigninField(this, input.name, input.value);
  showFieldError(input, signinErrors[input.name]);
  if (input.name === "userpassword") checkPasswordRepeat(this);
}

// Passwort-Wiederholung direkt prüfen
function checkPasswordRepeat(form) {
  let repeat = form.elements["userpasswordrepeat"];
  if (repeat) {
    signinErrors["userpasswordrepeat"] = validateSigninField(
      form, "userpasswordrepeat", repeat.value
    );
    showFieldError(repeat, signinErrors["userpasswordrepeat"]);
  }
}

// Login: Alles prüfen beim Absenden
function onSubmitLogin(e) {
  e.preventDefault();
  let form = e.target, valid = true;
  Array.from(form.elements).forEach(input => {
    if (!input.name) return;
    loginErrors[input.name] = validateLoginField(input.name, input.value);
    if (loginErrors[input.name]) valid = false;
  });
  showFormErrors(form, loginErrors);
  if (valid) alert("Login erfolgreich!");
}

// Signin: Alles prüfen beim Absenden
function onSubmitSignin(e) {
  e.preventDefault();
  let form = e.target, valid = true;
  Array.from(form.elements).forEach(input => {
    if (!input.name) return;
    signinErrors[input.name] = validateSigninField(form, input.name, input.value);
    if (signinErrors[input.name]) valid = false;
  });
  signinErrors["privacy"] = validatePrivacy(form);
  if (signinErrors["privacy"]) valid = false;
  showFormErrors(form, signinErrors);
  if (valid) alert("Registrierung erfolgreich!");
}

// Event-Listener zuweisen
document.getElementById('login-form').addEventListener('input', onInputLogin);
document.getElementById('login-form').addEventListener('submit', onSubmitLogin);
document.getElementById('signin-form').addEventListener('input', onInputSignin);
document.getElementById('signin-form').addEventListener('submit', onSubmitSignin);