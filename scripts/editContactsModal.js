let originalContactEmail = null;
let originalContactId = null;

function openEditContactsModal() {
    let overlay = document.getElementById('modalOverlay');
    let container = document.getElementById('editContactsModal');

    overlay.classList.remove('dNone');
    container.classList.remove('dNone');
    getEditContactsModalStructure();

    setTimeout(() => {
        let modal = document.getElementById('modalContent');
        modal.classList.add('show');
    }, 10);

    fillEditContactsForm();
}

function closeEditContactsModal() {
    let modal = document.getElementById('modalContent');
    let overlay = document.getElementById('modalOverlay');
    let container = document.getElementById('editContactsModal');

    if (modal) {
        modal.classList.remove('show');

        setTimeout(() => {
            overlay.classList.add('dNone');
            container.classList.add('dNone');
        }, 300);
    }
}

function getEditContactsModalStructure() {
    let container = document.getElementById('editContactsModal');
    container.innerHTML = `
    <div class="modalMainContent" id="modalContent">
        <div class="headlineSection">
            <img class="contactsModalImage" src="./assets/img/joinLogoSidebar.svg" alt="">
            <div class="headlineContainer">
                <h1>Edit contact</h1>
                <p class="blueUnderline"></p>
            </div>

        </div>
        <div class="contentSection">
            <div class="modalIconContainer">
                <div class="contactsModalIcon">
                <img src="./assets/img/whitePerson.svg" alt="">
                </div>
            </div>
            <div class="modalContentContainer">
                <div class="modalCloseButtonWrapper">
                    <button class="modalCloseButton" onclick="closeEditContactsModal()"><img src="./assets/img/closeIcon.svg"></button>
                </div>
                <div class="inputFieldContainer">
                    <div class="inputFieldWrapper">
                        <input class="inputFields" type="text" placeholder="Name" id="contactNameEdit" required>
                        <img class="inputIcon" src="./assets/img/person.svg">
                        <span id="namePlaceholderError" class="errorMsg">Placeholder</span>
                    </div>
                    <div id="nameError" class="inputError dNone">Fehlertext</div>
                    <div class="inputFieldWrapper">
                        <input class="inputFields" type="email" placeholder="Email" id="contactEmailEdit" required>
                        <img class="inputIcon" src="./assets/img/mail.svg">
                        <span id="emailPlaceholderError" class="errorMsg">Placeholder</span>
                    </div>
                    <div id="emailError" class="inputError dNone">Fehlertext</div>
                    <div class="inputFieldWrapper">
                        <input class="inputFields" type="text" placeholder="Phone" id="contactPhoneEdit" required>
                        <img class="inputIcon" src="./assets/img/phone.svg">
                        <span id="phonePlaceholderError" class="errorMsg">Placeholder</span>
                    </div>
                    <div id="phoneError" class="inputError dNone">Fehlertext</div>
                </div>
                <div class="buttonsContainer">
                <button onclick="clearInputFields()" class="modalCancelButton">Delete</button>
                <button onclick="updateContacts()" class="modalSafeButton" type="button">Save <img src="./assets/img/createIcon.svg"></button>
                </div>
            </div>
        </div>
    </div>`
}


/// Editation ///

async function fillEditContactsForm() {
    if (!currentContactId) return;
    let contact = await getData(`/users/${loggedInUser}/contacts/${currentContactId}`);
    if (!contact) return;
    document.getElementById("contactNameEdit").value = contact.name;
    document.getElementById("contactEmailEdit").value = contact.email;
    document.getElementById("contactPhoneEdit").value = contact.phone;

    originalContactId = currentContactId;
    console.log("originalContactID:", originalContactId);
    originalContactEmail = contact.email;
}

async function updateContacts() {
    console.log("updateContacts wurde aufgerufen");

    let isValid = await validateEditContactInput();
    if (!isValid) return;

    let emailValid = await validateEditEmailFormat(originalContactEmail);
    if (!emailValid) return;

    let name = document.getElementById('contactNameEdit').value.trim();
    let email = document.getElementById('contactEmailEdit').value.trim();
    let phone = document.getElementById('contactPhoneEdit').value.trim();
    let newContactId = adjustEmail(email);
    let updatedContact = {
        name: name,
        email: email,
        phone: phone
    };

    try {
        await putData('/users/' + loggedInUser + '/contacts', updatedContact, newContactId);
        if (newContactId !== originalContactId) {
            console.log("Will delete old contact:", originalContactId);
            await deleteContact(originalContactId);
        }

        currentContactId = newContactId;
        await renderContacts();
        await openContactById(currentContactId);

        let allCards = document.querySelectorAll('.contactCard');
        allCards.forEach(card => card.classList.remove('active'));

        let updatedCard = Array.from(allCards).find(
            c => c.dataset.contactId === currentContactId
        );

        if (updatedCard) {
            addContactCardBgToggle(updatedCard);
            showContactDetailsToggle(updatedCard);
        }

        closeEditContactsModal();
    } catch (error) {
        console.error('Error while updating contact:', error);
    }
}

async function validateEditContactInput() {
    let inputs = getEditContactInputs();
    let values = {
        name: inputs.nameInput.value.trim().toLowerCase(),
        email: inputs.emailInput.value.trim().toLowerCase(),
        phone: inputs.phoneInput.value.trim()
    };

    resetContactInputErrors(inputs);

    if (checkEmptyFields(inputs, values)) return false;

    let existingContacts = await getData('/users/' + loggedInUser + '/contacts' + originalContactId) || {};
    if (checkEditDuplicateFields(inputs, values, existingContacts, originalContactId)) return false;

    return true;
}


function getEditContactInputs() {
    return {
        nameInput: document.getElementById('contactNameEdit'),
        emailInput: document.getElementById('contactEmailEdit'),
        phoneInput: document.getElementById('contactPhoneEdit'),
        nameError: document.getElementById('nameError'),
        emailError: document.getElementById('emailError'),
        phoneError: document.getElementById('phoneError')
    };
}

function checkEditDuplicateFields(inputs, values, existingContacts, originalContactId) {
    let hasError = false;
    let original = existingContacts[originalContactId];

    for (let key in existingContacts) {
        if (key === originalContactId) continue;
        let contact = existingContacts[key];

        if (contact.name?.trim().toLowerCase() === values.name && values.name !== original.name?.trim().toLowerCase()) {
            inputs.nameInput.classList.add('error');
            document.getElementById('namePlaceholderError').innerHTML = "Name already used.";
            document.getElementById('namePlaceholderError').classList.add('visible');
            hideErrorMessages('namePlaceholderError', inputs.nameInput.id);
            hasError = true;
        }

        if (contact.email?.trim().toLowerCase() === values.email && values.email !== original.email?.trim().toLowerCase()) {
            inputs.emailInput.classList.add('error');
            document.getElementById('emailPlaceholderError').innerHTML = "E-Mail already used.";
            document.getElementById('emailPlaceholderError').classList.add('visible');
            hideErrorMessages('emailPlaceholderError', inputs.emailInput.id);
            hasError = true;
        }

        if (contact.phone?.trim() === values.phone && values.phone !== original.phone?.trim()) {
            inputs.phoneInput.classList.add('error');
            document.getElementById('phonePlaceholderError').innerHTML = "Phone number already used.";
            document.getElementById('phonePlaceholderError').classList.add('visible');
            hideErrorMessages('phonePlaceholderError', inputs.phoneInput.id);
            hasError = true;
        }
    }

    return hasError;
}

async function validateEditEmailFormat(originalEmail) {
    let email = document.getElementById("contactEmailEdit").value.trim().toLowerCase();
    let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorMsgEmail = document.getElementById("emailError");

    if (!pattern.test(email)) {
        errorMsgEmail.innerText = "Please enter a valid email address.";
        errorMsgEmail.classList.remove("dNone");
        return false;
    }

    if (!originalEmail || email !== originalEmail.toLowerCase()) {
        let existingContacts = await getData('/users/' + loggedInUser + '/contacts') || {};
        for (let key in existingContacts) {
            if (existingContacts[key].email.trim().toLowerCase() === email) {
                errorMsgEmail.innerText = "Email is already used.";
                errorMsgEmail.classList.remove("dNone");
                return false;
            }
        }
    }

    errorMsgEmail.classList.add("dNone");
    return true;
}