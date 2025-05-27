let colors = [
    "#9327ff", // lila
    "#1fd7c1", // grün
    "#fc71ff", // pink
    "#6e52ff", // blau
    "#ff7a02", // orange
    "#6e52ff", // gelb
];

async function renderContacts() {
    console.log("renderContacts wurde aufgerufen");
    let container = document.getElementById("contactList");
    container.innerHTML = "";

    let data = await getData('/users/' + loggedInUser + '/contacts');

    if (!data) return;

    let entries = Object.entries(data).sort((a, b) => a[1].name.localeCompare(b[1].name));
    let currentLetter = "";

    for (let [id, contact] of entries) {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            container.appendChild(createLetterDivider(firstLetter));
            container.appendChild(createLetterDividerLine());
        }
        container.appendChild(createContactCard(contact, id));
    };
}

function createLetterDivider(letter) {
    let div = document.createElement("div");
    div.classList.add("letterDivider");
    div.textContent = letter;
    return div;

}

function createLetterDividerLine() {
    let div = document.createElement("div");
    div.classList.add("letterDividerLine");
    return div
}

function createContactCard(contact, contactId) {
    let card = document.createElement("div");
    card.classList.add("contactCard");
    card.dataset.contactId = contactId;
    let initials = getInitials(contact.name);
    let bgColor = getColorFromName(contact.name + contact.email);


    card.innerHTML = `
        <div class="contactIcon" style="background-color: ${bgColor}">${initials}</div>
        <div class="contactDetails">
            <strong>${contact.name}</strong>
            <span class="email">${contact.email}</span>
        </div>
    `;


    card.onclick = async () => {
        currentContactId = contactId;
        await openContactById(contactId);
        addContactCardBgToggle(card);
        showContactDetailsToggle(card);
        if (window.innerWidth <= 800) {
            openContactMobile(contactId);
        }
    };

    return card;
}

async function openContactById(contactId) {
    let contact = (await getData(`/users/${loggedInUser}/contacts/${contactId}`));
    let userNameDeleteContainer = document.getElementById('userNameDeleteContainer');


    if (!contact || !contact.name || !contact.email) return;
    document.getElementById("userName").innerHTML = contact.name;
    document.getElementById("userEmail").innerHTML = contact.email;
    document.getElementById("userPhoneNumber").innerHTML = contact.phone;

    let initials = getInitials(contact.name);
    let color = getColorFromName(contact.name + contact.email);
    let initialsContainer = document.getElementById("contactInitials");

    initialsContainer.innerHTML = initials;
    initialsContainer.style.backgroundColor = color;
    initialsContainer.style.color = "white";
    userNameDeleteContainer.innerHTML = `
    <div class="userNameDeleteIconContainer">
    <img class="defaultIcon" src="./assets/img/delete.svg" alt="">
    <img class="hoverIcon" src="./assets/img/deleteHover.svg" alt="">
    </div>
    <span onclick="deleteContact('${contactId}')">Delete</span>`;

    currentContactId = adjustEmail(contact.email);
}

function getInitials(name) {
    if (!name || typeof name !== 'string') return '';
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();
}

window.addEventListener("DOMContentLoaded", () => {
    renderContacts();
});

function getColorFromName(name) {
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i) + (i + 1);
    }
    let index = sum % colors.length;
    return colors[index];
}

function addContactCardBgToggle(cardElement) {
    let allCards = document.querySelectorAll('.contactCard');

    if (cardElement.classList.contains('active')) {
        cardElement.classList.remove('active');
    } else {
        allCards.forEach(card => card.classList.remove('active'));
        cardElement.classList.add('active');
    }
}

function showContactDetailsToggle(cardElement) {
    let overview = document.getElementById('showContactDetails');

    if (cardElement.classList.contains('active', 'show')) {
        overview.classList.add('active', 'show');
    } else {
        overview.classList.remove('active', 'show');
    }
}

function showSuccessOverlayImg() {
    let successOverlayImg = document.getElementById('succesfullyCreatedOverlayImg');

    successOverlayImg.classList.add('show');
    setTimeout(() => {
        successOverlayImg.classList.remove('show');
    }, 800);
}

function openContactMobile(contactId) {
    document.getElementById('contactListContainer').classList.add('dNone');
    document.getElementById('contactsOverview').classList.remove('dNone');
    document.getElementById('contactsOverview').classList.add('mobileVisible');
    openContactById(contactId);
}

function closeContactDetailOverlay() {

}