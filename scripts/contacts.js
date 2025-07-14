/**
 * Firebase Realtime Database contact utilities
 * @module contacts
 */
const FIREBASE_URL = "https://join-19b54-default-rtdb.europe-west1.firebasedatabase.app/";
const DB_PATH = "contacts";
let contacts = [];
let lastSelectedItem = null;
const listEl = document.getElementById("contacts-list");
const detailBox = document.getElementById("contact-detail");
/**
 * Returns initials from a full name ... funktion prüft ob es ein String ist und gibt die ersten beiden Buchstaben zurück.
 * Falls der Name leer ist oder kein String, gibt es "??" zurück.
 * @param {string} name 
 * @returns {string}
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "??";
  return name
    .trim()
    .split(/\s+/)
    .map(p => p[0]?.toUpperCase() || "")
    .join("")
    .substring(0, 2); // z. B. "M" oder "MM"
}
/**
 * Generates a color string from a string input
 * @param {string} str
 * @returns {string}
 */
function stringToColor(str) {
  let hash = 0;
  for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
  return `hsl(${hash % 360}, 70%, 50%)`;
}
/**
 * Fetch contacts from the database
 * @returns {Promise<Array>} contacts
 */
export async function fetchContacts() {
  const data = await loadFromDatabase(DB_PATH);
  return Object.entries(data || {}).map(([id, entry]) => ({ id, ...entry }));
}
/**
 * Create new contact in Firebase
 * @param {{name:string,email:string,phone:string}} contact
 * @returns {Promise<{name:string}>} Das Objekt mit dem neuen Key
 */
export async function createContact(contact) {
  // gebe das Ergebnis zurück, damit wir res.name bekommen
  return await postToDatabase(DB_PATH, contact);
}
/**
 * Zeigt einen kurzen Hinweistoast.
 * @param {string} message
 */
function showToast(message) {
  const container = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  container.appendChild(t);
  // nach Animation entfernen
  setTimeout(() => container.removeChild(t), 3000);
}
/**
 * Update existing contact
 * @param {string} id
 * @param {object} data
 */
export async function updateContact(id, data) {
  await updateOnDatabase(`${DB_PATH}/${id}`, data);
}
/**
 * Delete contact
 * @param {string} id
 */
export async function deleteContact(id) {
  await deleteFromDatabase(`${DB_PATH}/${id}`);
  showToast("Contact successfully deleted");
}
/**
 * Load JSON data from database
 * @param {string} path
 * @returns {Promise<object>}
 */
async function loadFromDatabase(path) {
  const res = await fetch(`${FIREBASE_URL}${path}.json`);
  return await res.json();
}
/**
 * Post data to database
 * @param {string} path
 * @param {object} data
 * @returns {Promise<object>}
 */
async function postToDatabase(path, data) {
  const res = await fetch(`${FIREBASE_URL}${path}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
/**
 * Put (overwrite) data in database
 * @param {string} path
 * @param {object} data
 * @returns {Promise<object>}
 */
async function updateOnDatabase(path, data) {
  const res = await fetch(`${FIREBASE_URL}${path}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
/**
 * Delete data from database
 * @param {string} path
 * @returns {Promise<object>}
 */
async function deleteFromDatabase(path) {
  const res = await fetch(`${FIREBASE_URL}${path}.json`, { method: "DELETE" });
  return await res.json();
}
/**
 * Renders contact list into DOM
 */
export async function renderContacts() {
  contacts = await fetchContacts();
  listEl.innerHTML = "";
  const grouped = groupContacts();
  for (const L in grouped) {
    const section = document.createElement("div");
    section.className = "contact_section";
    section.innerHTML = `<div class="contact_initial">${L}</div>`;
    grouped[L].forEach(c => {
      const item = document.createElement("div");
      item.className = "contact-list-item";
      item.dataset.id = c.id;
      item.innerHTML = `
        <div class="contact_left">
          <div class="contact_circle">${getInitials(c.name)}</div>
          <div class="contact_details">
            <div class="contact_name">${c.name}</div>
            <div class="contact_email">${c.email}</div>
          </div>
        </div>`;
      item.querySelector(".contact_circle").style.backgroundColor = stringToColor(c.name);
      item.addEventListener("click", () => showContactDetails(c, item));
      section.appendChild(item);
    });
    listEl.appendChild(section);
  }
}
/**
 * Groups contacts by initial letter
 * @returns {object}
 */
function groupContacts() {
  return contacts.slice().sort((a, b) => a.name.localeCompare(b.name)).reduce((acc, c) => {
    const L = c.name[0].toUpperCase();
    (acc[L] ||= []).push(c);
    return acc;
  }, {});
}
/**
 * Shows contact details
 * @param {object} contact 
 * @param {HTMLElement} itemEl 
 */
export async function showContactDetails(contact, itemEl) {
  if (lastSelectedItem) lastSelectedItem.classList.remove("contact_list_item_active");
  itemEl.classList.add("contact_list_item_active");
  lastSelectedItem = itemEl;
  detailBox.classList.remove("d_none");
  document.getElementById("detail-initials").textContent = getInitials(contact.name);
  document.getElementById("detail-initials").style.backgroundColor = stringToColor(contact.name);
  document.getElementById("detail-name").textContent = contact.name;
  const emailEl = document.getElementById("detail-email");
  emailEl.textContent = contact.email;
  emailEl.href = `mailto:${contact.email}`;
  document.getElementById("detail-phone").textContent = contact.phone;
  checkAndRenderMobileView()
  setupEditDeleteButtons(contact);
  setupEditDeleteButtonsMobile(contact);

}
/**
 * Binds the click on the pencil to open the unified edit-overlay.
 * @param {{id:string,name:string,email:string,phone:string}} c
 */
function bindEditButton(c) {
  const btn = document.getElementById("btn-edit-detail");
  if (!btn) return;
  btn.onclick = () => openEditContactOverlay(c);
}
/**
 * Binds the delete button inside the edit-overlay.
 * @param {{id:string}} c
 */
function bindOverlayDelete(c) {
  const btn = document.querySelector(".btn_clear");
  if (!btn) return;
  btn.onclick = async () => {
    await deleteContact(c.id);
    closeOverlay();
    hideContactDetailsArea();
    await renderContacts();
  };
}
/**
 * Binds the delete icon in the detail pane (outside overlay).
 * @param {{id:string}} c
 */
function bindDetailDelete(c) {
  const btn = document.getElementById("btn-delete-detail");
  if (!btn) return;
  btn.onclick = async () => {
    await deleteContact(c.id);
    document.getElementById("contact-detail").classList.add("d_none");
    await renderContacts();
  };
}
/**
 * Sets up edit & delete for a given contact.
 * @param {{id:string,name:string,email:string,phone:string}} c
 */
function setupEditDeleteButtons(c) {
  bindEditButton(c);
  bindOverlayDelete(c);
  bindDetailDelete(c);
}

/**
 * Öffnet das Bearbeitungs‑Overlay für einen Kontakt,
 * füllt das Formular und bindet Save/Delete.
 * @param {{id:string,name:string,email:string,phone:string}} contact
 */
export async function openEditContactOverlay(contact) {
  await loadFormIntoOverlay("./templates/edit_Contacts.html");
  slideInOverlay();
  await new Promise(r => setTimeout(r, 0));

  fillContactFormFields(contact);
  updateContactInitialsPreview(contact.name);

  const form = document.getElementById("edit-contact-form");
  form.onsubmit = async e => {
    e.preventDefault();
    clearContactInputErrors();

    if (!validateNewContactForm()) {
      showToast("Please fix the errors in the form");
      return;
    }

    const updated = {
      name: document.getElementById("contact-namefield").value.trim(),
      email: document.getElementById("contact-emailfield").value.trim(),
      phone: document.getElementById("contact-phonefield").value.trim()
    };

    await updateContact(contact.id, updated);
    closeOverlay();
    await renderContacts();

    const newDetail = { id: contact.id, ...updated };
    const updatedItem = document.querySelector(`.contact-list-item[data-id="${contact.id}"]`);
    if (updatedItem) {
      await showContactDetails(newDetail, updatedItem);
    }
  };
}

/**
 * Füllt die Eingabefelder des Formulars mit Kontaktdaten.
 * @param {{name:string,email:string,phone:string}} contact 
 */
function fillContactFormFields(contact) {
  ["name", "email", "phone"].forEach(f =>
    document.getElementById(`contact-${f}field`).value = contact[f]
  );
}

/**
 * Aktualisiert das Initialen-Preview im Bearbeitungs-Overlay.
 * @param {string} name 
 */
function updateContactInitialsPreview(name) {
  const ic = document.getElementById("edit-contact-initials");
  ic.textContent = getInitials(name);
  ic.style.backgroundColor = stringToColor(name);
}

/**
 * Validiert das Eingabefeld im Kontaktformular.
 * Entfernt die Fehlermeldung, wenn Eingabe korrekt ist.
 */
window.validateInput = function (inputId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`error-${inputId}`);
  if (!input || !error) return;
  const value = input.value.trim();
  let valid = true;
  let message = "";
  if (inputId.includes("name")) {
    const namePattern = /^[A-Za-zÄÖÜäöüß]{2,}(?: [A-Za-zÄÖÜäöüß]{2,})+$/;
    if (!namePattern.test(value)) {
      valid = false;
      message = "Bitte gib Vor- und Nachname mit Buchstaben ein.";
    }
  }
  if (inputId.includes("email")) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(value)) {
      valid = false;
      message = "Bitte gib eine gültige E-Mail-Adresse ein.";
    }
  }
  if (inputId.includes("phone")) {
    const phonePattern = /^[0-9]{4,15}$/;
    if (!phonePattern.test(value)) {
      valid = false;
      message = "Nur Ziffern, mindestens 4 Stellen.";
    }
  }
  if (!value) {
    valid = false;
    message = "Dieses Feld darf nicht leer sein.";
  }
  if (!valid) {
    error.textContent = message;
    error.classList.remove("d_none");
  } else {
    error.textContent = "";
    error.classList.add("d_none");
  }
};
/**
 * Öffnet das „Add Contact“ Overlay und verarbeitet das Formular.
 * @async
 * @function openAddContactOverlay
 */
async function openAddContactOverlay() {
  await loadFormIntoOverlay("./templates/new_contact.html");
  slideInOverlay();
  document.getElementById("addnew-contact-form").onsubmit = async e => {
    e.preventDefault();
    const nameRaw = document.getElementById("contact-namefield").value.trim();
    const emailRaw = document.getElementById("contact-emailfield").value.trim();
    const phoneRaw = document.getElementById("contact-phonefield").value.trim();
    const phone = normalizePhone(phoneRaw);
    const contact = {
      name: nameRaw,
      email: emailRaw,
      phone
    };
    try {
      const res = await createContact(contact);
      const newId = res.name;
      closeOverlay();
      await renderContacts();
      showToast("Contact successfully created");
      contact.id = newId;
      const newItem = document.querySelector(
        `.contact-list-item[data-id="${newId}"]`
      );
      if (newItem) showContactDetails(contact, newItem);
    } catch (err) {
      console.error("Create contact failed:", err);
      showToast("Error creating contact");
    }
  };
}
/**
 * Validiert die Eingaben und speichert den Kontakt, wenn alle Felder korrekt sind.
 * Zeigt ggf. Fehler an.
 */
async function submitNewContact() {
  if (validateNewContactForm()) {
    const nameRaw = document.getElementById("contact-namefield").value.trim();
    const emailRaw = document.getElementById("contact-emailfield").value.trim();
    const phoneRaw = document.getElementById("contact-phonefield").value.trim();
    const phone = normalizePhone(phoneRaw);
    const contact = {
      name: nameRaw,
      email: emailRaw,
      phone
    };
    try {
      const res = await createContact(contact);
      const newId = res.name;
      closeOverlay();
      await renderContacts();
      showToast("Contact successfully created");
      contact.id = newId;
      const newItem = document.querySelector(`.contact-list-item[data-id="${newId}"]`);
      if (newItem) showContactDetails(contact, newItem);
    } catch (err) {
      console.error("Create contact failed:", err);
      showToast("Error creating contact");
    }
  } else {
    showToast("Please fix the errors in the form");
  }
}
/**
 * Validiert das Formular zur Erstellung eines neuen Kontakts.
 * Überprüft Name, E-Mail und Telefonnummer anhand von regulären Ausdrücken.
 * Zeigt bei ungültiger Eingabe entsprechende Fehlermeldungen an.
 * 
 * @returns {boolean} true, wenn alle Eingaben gültig sind, sonst false
 */
function validateNewContactForm() {
  let isValid = true;
  /** @type {HTMLInputElement} */
  const nameField = document.getElementById("contact-namefield");
  /** @type {HTMLInputElement} */
  const emailField = document.getElementById("contact-emailfield");
  /** @type {HTMLInputElement} */
  const phoneField = document.getElementById("contact-phonefield");
  clearContactInputErrors();
  const namePattern = /^(?=.{3,})([A-Za-zÄÖÜäöüß]+(?:\s+[A-Za-zÄÖÜäöüß]+)+)$/;
  const phonePattern = /^[0-9]{4,15}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!namePattern.test(nameField.value.trim())) {
    showContactInputError(nameField, "Please enter a name");
    isValid = false;
  }
  if (!emailPattern.test(emailField.value.trim())) {
    showContactInputError(emailField, "Please enter an e-mail address");
    isValid = false;
  }
  if (!phonePattern.test(phoneField.value.trim())) {
    showContactInputError(phoneField, "Please enter a phone number");
    isValid = false;
  }
  return isValid;
}
/**
 * Zeigt eine Fehlermeldung für ein ungültiges Eingabefeld an und markiert es visuell.
 * 
 * @param {HTMLInputElement} inputElement - Das fehlerhafte Eingabefeld
 * @param {string} message - Die anzuzeigende Fehlermeldung
 */
function showContactInputError(inputElement, message) {
  inputElement.classList.add("input_error_border");
  const errorContainer = inputElement.parentElement.querySelector(".input_error");
  if (errorContainer) {
    errorContainer.textContent = message;
  }
}
/**
 * Entfernt alle Fehleranzeigen und roten Rahmen von den Eingabefeldern im Kontaktformular.
 */
function clearContactInputErrors() {
  document.querySelectorAll(".input_error_border").forEach(el => {
    el.classList.remove("input_error_border");
  });
  document.querySelectorAll(".input_error").forEach(el => {
    el.textContent = "";
  });
}
/**
 * Normalisiert eine Telefonnummer
 * @param {string} rawRaw
 * @returns {string}
 */
function normalizePhone(rawRaw) {
  let s = rawRaw.replace(/[^\d+]/g, ""); // alles außer Ziffern und '+' weg
  if (s.startsWith("00")) s = "+" + s.slice(2);
  if (s.startsWith("+")) return s;
  if (s.startsWith("0")) s = s.slice(1);
  // hänge deutsche Ländervorwahl an
  return "+49" + s;
}
/**
 * Hides contact detail panel
 */
export function hideContactDetailsArea() {
  detailBox.classList.add("d_none");
  if (lastSelectedItem) {
    lastSelectedItem.classList.remove("contact_list_item_active");
    lastSelectedItem = null;
  }
}
const backBtnMobile = document.getElementById('btn-contacts-back')
const mobileDetailContactView = document.getElementById('contacts-overview')
const contactEditMobileBtn = document.querySelector('.contact_edit_mobile_btn')
const addContactMobileBtn = document.querySelector('.add_contact_btn')
const mobileEditContactsNav = document.querySelector('.edit_contacts_mobile_nav')
const editContactMobileBtn = document.querySelector('#edit-contacts-mobile-view')
const deleteContactMobileBtn = document.querySelector('#delete-contacts-mobile-view')

if (backBtnMobile) {
  backBtnMobile.addEventListener('click', () => {
    mobileDetailContactView.style.display = "none";
    contactEditMobileBtn.classList.add('d_none')
    addContactMobileBtn.classList.remove('d_none')
  })
}
function checkAndRenderMobileView() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    mobileDetailContactView.style.display = "flex";
    contactEditMobileBtn.classList.remove('d_none')
    addContactMobileBtn.classList.add('d_none')
  }
}
if (contactEditMobileBtn) {
  contactEditMobileBtn.addEventListener('click', (e) => {
    mobileEditContactsNav.classList.remove('d_none')
  })
}
document.addEventListener('click', (event) => {
  const isClickInsideNav = mobileEditContactsNav.contains(event.target);
  const isClickOnEditButton = contactEditMobileBtn.contains(event.target);
  if (!isClickInsideNav && !isClickOnEditButton) {
    mobileEditContactsNav.classList.add('d_none');
  }
});

function setupEditDeleteButtonsMobile(contact) {
  if(editContactMobileBtn){
    editContactMobileBtn.addEventListener('click', () => {
      openEditContactOverlay(contact)
    })
  }

  if(deleteContactMobileBtn){
    deleteContactMobileBtn.addEventListener('click', () => {
      deleteContact(contact.id)
    })
  }
}

window.addEventListener("DOMContentLoaded", renderContacts);
window.openAddContactOverlay = openAddContactOverlay;
window.submitNewContact = submitNewContact;
