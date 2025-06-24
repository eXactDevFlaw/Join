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


// // Hilfsfunktion: Fehlermeldung anzeigen
// function showError(inputId, message) {
//   const input = document.getElementById(inputId);
//   const errorDiv = input.parentElement.querySelector(".input_error");
//   errorDiv.textContent = message;
// }

// // Hilfsfunktion: Fehler zurücksetzen
// function clearErrors() {
//   document
//     .querySelectorAll(".input_error")
//     .forEach((div) => (div.textContent = ""));
// }

// // LOGIN-Funktion mit Validierung und Firebase-Prüfung
// async function login(event) {
//   event.preventDefault();
//   clearErrors();

//   const email = document.getElementById("login-username").value.trim();
//   const password = document.getElementById("login-userpassword").value;

//   if (!email) {
//     showError("login-username", "Bitte Email eingeben");
//     return;
//   }
//   if (!password) {
//     showError("login-userpassword", "Bitte Passwort eingeben");
//     return;
//   }

//   // Nutzer aus Firebase laden
//   const users = await getContactsFromDatabase();
//   let userFound = false;

//   if (users) {
//     for (const key in users) {
//       if (
//         users[key].username &&
//         users[key].userpassword &&
//         users[key].username.toLowerCase() === email.toLowerCase() &&
//         users[key].userpassword === password
//       ) {
//         userFound = true;
//         break;
//       }
//     }
//   }

//   if (userFound) {
//     // Erfolgreich eingeloggt, z.B. Weiterleitung:
//     window.location = "./summary.html";
//   } else {
//     showError("login-username", "Falsche Email oder Passwort");
//     showError("login-userpassword", "Falsche Email oder Passwort");
//   }
// }

// // SIGNUP-Funktion mit Validierung und Firebase-Eintrag
// async function signUp(event) {
//   event.preventDefault();
//   clearErrors();

//   const name = document.getElementById("signin-contactname").value.trim();
//   const email = document.getElementById("signin-username").value.trim();
//   const password = document.getElementById("signin-userpassword").value;
//   const passwordCheck = document.getElementById(
//     "signin-userpassword-check"
//   ).value;
//   const privacyChecked = document.getElementById("signin-btn-checkbox").checked;

//   if (!name) {
//     showError("signin-contactname", "Bitte Namen eingeben");
//     return;
//   }
//   if (!email) {
//     showError("signin-username", "Bitte Email eingeben");
//     return;
//   }
//   if (!password) {
//     showError("signin-userpassword", "Bitte Passwort eingeben");
//     return;
//   }
//   if (password.length < 6) {
//     showError("signin-userpassword", "Mindestens 6 Zeichen!");
//     return;
//   }
//   if (password !== passwordCheck) {
//     showError("signin-userpassword-check", "Passwörter stimmen nicht überein");
//     return;
//   }
//   if (!privacyChecked) {
//     alert("Bitte akzeptiere die Datenschutzbestimmungen");
//     return;
//   }

//   // Prüfe, ob Email bereits existiert
//   const users = await getContactsFromDatabase();
//   let userExists = false;
//   if (users) {
//     for (const key in users) {
//       if (
//         users[key].username &&
//         users[key].username.toLowerCase() === email.toLowerCase()
//       ) {
//         userExists = true;
//         break;
//       }
//     }
//   }

//   if (userExists) {
//     showError("signin-username", "Email ist bereits vergeben");
//     return;
//   }

//   // Neuen Nutzer anlegen
//   const newUser = {
//     contactname: name,
//     username: email,
//     userpassword: password,
//   };
//   await postToDatabase("users", newUser);

//   // Optional: Feedback anzeigen oder Weiterleiten
//   alert("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
//   toggleSignIn();
// }

// // Verhindere Form-Submit und nutze unsere eigenen Funktionen
// document.querySelectorAll("form")[0].addEventListener("submit", login);
// document.querySelectorAll("form")[1].addEventListener("submit", signUp);
