let editIndex = null;

// Dummy-Kontakte (ersetzt später lokale Speicherung oder Backend)
const contacts = [
  { id: 1, name: "Anna Müller", email: "anna.mueller@example.com", phone: "+49 170 1234567" },
  { id: 2, name: "Ben Schneider", email: "ben.schneider@example.com", phone: "+49 172 9876543" },
  { id: 3, name: "Clara Fischer", email: "clara.fischer@example.com", phone: "+49 151 7654321" }
];

// Elemente referenzieren
const contactsList = document.getElementById('contacts-list');
const overlay = document.getElementById('contact-overlay');

// Kontakte anzeigen
function renderContacts() {
    const contactList = document.getElementById("contacts-list");
    contactList.innerHTML = "";

    contacts.forEach((contact, index) => {
        const contactItem = document.createElement("div");
        contactItem.className = "contact-item";
        contactItem.innerHTML = `
            <strong>${contact.name}</strong><br>
            ${contact.email}<br>
            ${contact.phone}<br>
            <button class="btn_white" onclick="editContact(${index})">Bearbeiten</button>
        `;
        contactList.appendChild(contactItem);
    });
}
function editContact(index) {
    const contact = contacts[index];
    editIndex = index;

// Fülle die Felder mit vorhandenen Daten
    // Make sure these elements exist in your HTML and have the correct IDs
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const phoneInput = document.getElementById("contact-phone");

    if (nameInput) nameInput.value = contact.name;
    if (emailInput) emailInput.value = contact.email;
    if (phoneInput) phoneInput.value = contact.phone;
    // Zeige Overlay
    openOverlay();
}
function saveContact() {
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const phone = document.getElementById("contact-phone").value;

    const newContact = { name, email, phone };

    if (editIndex !== null) {
        // Bearbeite bestehenden Kontakt
        contacts[editIndex] = newContact;
        editIndex = null;
    } else {
        // Füge neuen Kontakt hinzu
        contacts.push(newContact);
    }

    renderContacts();
    closeOverlay();
}


// Overlay öffnen
function openOverlay() {
    document.getElementById("overlay").classList.remove("dNone");

    // Felder nur zurücksetzen, wenn KEIN Bearbeiten läuft
    if (editIndex === null) {
        document.getElementById("contact-name").value = "";
        document.getElementById("contact-email").value = "";
        document.getElementById("contact-phone").value = "";
    }
}

function openContactOverlay(contact) {
  overlay.classList.remove('dNone');
  overlay.innerHTML = `
    <div class="overlay-content" style="background: white; padding: 24px; border-radius: 8px; max-width: 400px;">
      <h2>${contact.name}</h2>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <button class="btn_dark" onclick="closeOverlay()">Close</button>
    </div>
  `;

  // zentrieren
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999';
}

// Overlay schließen
function closeOverlay() {
  overlay.classList.add('dNone');
  overlay.innerHTML = '';
}

// Initialisierung nach Laden
window.addEventListener('DOMContentLoaded', () => {
  renderContacts();
});
// Kontakt hinzufügen Overlay öffnen
function openAddContactOverlay() {
  overlay.classList.remove('dNone');
  overlay.innerHTML = `
    <div class="overlay-content" style="background: white; padding: 24px; border-radius: 8px; max-width: 400px;">
      <h2>Neuen Kontakt hinzufügen</h2>
      <form onsubmit="submitNewContact(event)">
        <div style="margin-bottom: 12px;">
          <label>Name:<br>
            <input type="text" id="new-name" required>
          </label>
        </div>
        <div style="margin-bottom: 12px;">
          <label>Email:<br>
            <input type="email" id="new-email" required>
          </label>
        </div>
        <div style="margin-bottom: 12px;">
          <label>Telefon:<br>
            <input type="tel" id="new-phone" required>
          </label>
        </div>
        <button type="submit" class="btn_dark">Speichern</button>
        <button type="button" class="btn_white" onclick="closeOverlay()" style="margin-left: 12px;">Abbrechen</button>
      </form>
    </div>
  `;

  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999';
}

// Formularverarbeitung für neuen Kontakt
function submitNewContact(event) {
  event.preventDefault();
  const name = document.getElementById('new-name').value;
  const email = document.getElementById('new-email').value;
    const newContact = {
    id: contacts.length + 1, // einfache ID-Generierung
    name,
    email,
    phone
  };

  contacts.push(newContact);
  closeOverlay();
  renderContacts();
}