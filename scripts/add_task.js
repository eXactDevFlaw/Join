/**
 * Global used constant and variables
 */
const assignedInput = document.getElementById("assigned-to-dropdown");
const categoryDropdown = document.querySelector(".select_category_dropdown");

let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];
let subTaskDetails = {};
let allContacts = [];
let selectedContacts = [];
let pushedContactsName = [];
let subtaskInput = document.getElementById("add-subtasks");
let addSubTaskInput = document.getElementById("add-subtasks");

/**
 * Initializes contacts and sets default priority when the DOM is fully loaded.
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
    initContacts();
    setPriority("medium");
});

/**
 * Hides the contact assignment dropdown when clicking outside of it.
 * @event click
 */
document.addEventListener('click', (e) => {
    if (e.target.id != "add-task-contacts-list") {
        const list = document.getElementById("add-task-contacts-list");
        if (list) { list.classList.add('d_none') }
    }
})

/**
 * Closes the category dropdown when clicking outside of it.
 * @event click
 */
if (categoryDropdown) {
    document.addEventListener("click", function (event) {
        if (!categoryDropdown.contains(event.target)) {
            closeCategoryDropdown();
        }
    });
}

/**
 * Updates the contact assignment dropdown when the input changes.
 * @event input
 */
if (assignedInput) {
    assignedInput.addEventListener("input", () => {
        const list = document.getElementById("add-task-contacts-list");
        if (!list.classList.contains("d_none")) {
            renderContacts();
        }
    });
}

/**
 * Deactivates the subtask input if clicking outside and input is empty.
 * @event click
 */
if (subtaskInput) {
    document.addEventListener("click", function (event) {
        if (!subtaskInput.contains(event.target)) {
            if (subtaskInput.value === "") {
                unActivateSubtask();
            }
        }
    });
}

/**
 * Adds a new subtask when pressing Enter in the subtask input field.
 * @event keypress
 */
if (addSubTaskInput) {
    addSubTaskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addNewSubTask();
        }
    });
}

/**
 * Handles showing/hiding the assignment dropdown and rendering contacts.
 * @param {MouseEvent} e - The click event.
 */
window.toggleAssignedToDropdown = function (e) {
    e.stopPropagation();
    const list = document.getElementById("add-task-contacts-list");
    const arrow = document.getElementById("arrow-drop-down-assign");
    if (list.classList.contains("d_none")) renderContacts();
    list.classList.toggle("d_none");
    arrow.classList.toggle("up");
};

/**
 * Initializes contacts on page load.
 * Loads all contacts from database and formats for use in assignment UI.
 * @returns {Promise<void>}
 */
async function initContacts() {
    const raw = await getContactsFromDatabase();
    allContacts = Object.entries(raw || {}).map(([id, data]) => ({ id, ...data }));
}

/**
 * Sets priority selection state and updates the UI accordingly.
 * @param {string} level - Priority level ('urgent', 'medium', or 'low').
 */
function setPriority(level) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(p => {
        const btn = document.getElementById(`${p}-button`);
        if (btn) btn.classList.toggle(`${p}_set`, p === level);
    });
    priorities.forEach(p => {
        const icon = document.getElementById(`prio-${p}-icon`);
        const iconAct = document.getElementById(`prio-${p}-icon-active`);
        if (icon && iconAct) {
            icon.classList.toggle('d_none', p === level);
            iconAct.classList.toggle('d_none', p !== level);
        }
    });
    taskDetails.priority = level;
}

/**
 * Creates a task using current form values from the side overlay, validates and persists to DB.
 * @returns {Promise<void>}
 */
async function createTaskOnSide() {
    taskDetails.title = document.getElementById('title-input-overlay').value;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = selectedContacts;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    taskDetails.status = "todo";

    if (taskDetails.title && taskDetails.dueDate && taskDetails.category !== "Select task category") {
        await postToDatabase("tasks", taskDetails);
        showSuccessAddedTask();

    } else {
        validationHandling();
    }
}

/**
 * Creates a task using current form values, validates, persists to DB, and closes overlay.
 * @returns {Promise<void>}
 */
async function createTask() {
    taskDetails.title = document.getElementById('title-input-overlay').value;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = selectedContacts;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    taskDetails.status = "todo";

    if (taskDetails.title && taskDetails.dueDate && taskDetails.category !== "Select task category") {
        await postToDatabase("tasks", taskDetails);
        showSuccessAddedTask();
        closeTaskOverlay();
    } else {
        validationHandling();
    }
}

/**
 * Validates required fields and shows/hides error messages.
 */
function validationHandling() {
    if (!taskDetails.title) {
        document.getElementById('title-input-overlay').classList.add("input_error_border");
        document.getElementById('required-title').classList.remove("d_none");
    } else {
        document.getElementById('title-input-overlay').classList.remove("input_error_border");
        document.getElementById('required-title').classList.add("d_none");
    }
    if (!taskDetails.dueDate) {
        document.getElementById('datepicker').classList.add("input_error_border");
        document.getElementById('required-date').classList.remove("d_none");
    } else {
        document.getElementById('datepicker').classList.remove("input_error_border");
        document.getElementById('required-date').classList.add("d_none");
    }
    if (taskDetails.category === "Select task category") {
        document.getElementById("select-task-category").classList.add("input_error_border");
        document.getElementById('required-category').classList.remove("d_none");
    } else {
        document.getElementById("select-task-category").classList.remove("input_error_border");
        document.getElementById('required-category').classList.add("d_none");
    }
}

/**
 * Shows the 'success added' message and redirects or refreshes as needed.
 */
function showSuccessAddedTask() {
    const successContent = document.querySelector('.added_success_task_wrapper')
    successContent.classList.remove('d_none');
    if (window.location.pathname.endsWith('addtask.html')) {
        setTimeout(() => {
            window.location.href = './board.html';
        }, 2000);
    } else {
        setTimeout(async () => {
            successContent.classList.add('d_none');
            await loadTasks();
            refreshBoard();
        }, 2000);
    }
}

/**
 * Renders the list of assignable contacts into the assign dropdown,
 * filtered by input search term and sorted alphabetically.
 * Uses helpers for filtering and row creation.
 * @returns {Promise<void>}
 */
async function renderContacts() {
    const container = document.getElementById("add-task-contacts-list");
    const input = document.getElementById("assigned-to-dropdown");
    if (!container || !input) return console.warn("renderContacts: Container oder Input nicht gefunden.");

    const searchTerm = input.value.trim().toLowerCase();

    container.innerHTML = "";
    getFilteredContacts(searchTerm).forEach(contact => {
        container.appendChild(createContactRow(contact));
    });
}

/**
 * Returns a filtered and sorted array of contacts matching the search term.
 * @param {string} searchTerm
 * @returns {Array<Object>}
 */
function getFilteredContacts(searchTerm) {
    return allContacts
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(contact => contact.name.toLowerCase().startsWith(searchTerm));
}

/**
 * Creates a DOM row for a contact in the assign dropdown.
 * @param {Object} contact
 * @returns {HTMLDivElement}
 */
function createContactRow(contact) {
    const sel = selectedContacts.includes(contact.name);
    const color = stringToColor(contact.name);
    const initials = getInitials(contact.name);
    const row = document.createElement("div");
    row.className = "assign_contact_row" + (sel ? " contact_list_item_active" : "");
    row.innerHTML = creatContactsHtml(color, initials, sel, contact.name);
    row.addEventListener("click", e => {
        e.stopPropagation();
        const idx = selectedContacts.indexOf(contact.name);
        if (idx >= 0) selectedContacts.splice(idx, 1);
        else selectedContacts.push(contact.name);
        renderContacts();
        renderSelectedCircles();
    });
    return row;
}



/**
 * Renders up to 4 selected contact badges, and a 'More..' badge if >4.
 */
function renderSelectedCircles() {
    const preview = document.getElementById("assigned-contacts-preview");
    if (!preview) return;
    preview.innerHTML = "";
    if (selectedContacts.length) {
        for (i = 0; i < Math.min(4, selectedContacts.length); i++) {
            let name = selectedContacts[i];

            const c = allContacts.find(x => x.name === name);
            if (!c) return;
            const circle = document.createElement("div");
            circle.className = "assigned_circle";
            circle.textContent = getInitials(c.name);
            circle.style.backgroundColor = stringToColor(c.name);
            preview.appendChild(circle);
        };
        const badge = renderBlankedBadge()
        if (badge) {
            preview.appendChild(badge)
        }
    }
}

/**
 * If more than 4 contacts are selected, returns a DOM badge.
 * @returns {HTMLDivElement|undefined}
 */
function renderBlankedBadge() {
    let moreBadge
    if (selectedContacts.length > 4) {
        moreBadge = document.createElement('div');
        moreBadge.className = "assigned_circle"
        moreBadge.textContent = "More.."
        moreBadge.style.backgroundColor = "grey"
    }
    return moreBadge
}

/**
 * Gets up to 2 initials from a name (for badge display).
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
    return name.split(" ").map(w => w[0].toUpperCase()).join("").slice(0, 2);
}

/**
 * Generates a unique color for a string (used for contact badges).
 * @param {string} str
 * @returns {string} hsl color string
 */
function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360},70%,50%)`;
}

/**
 * Renders assignable contacts in the edit overlay as a checkbox list.
 * @returns {Promise<void>}
 */
async function renderAssignableContacts() {
    const container = document.getElementById("assign-contact-list");
    if (!container) return;
    container.innerHTML = "";
    container.classList.remove("d_none");
    const contacts = await fetchContacts();
    contacts.forEach((c, i) => {
        const div = document.createElement("div");
        div.className = "assign-contact-item";
        div.innerHTML = `
      <div class="assign-left">
        <div class="contact_circle" style="background-color:${stringToColor(c.name)}">
          ${getInitials(c.name)}
        </div>
        <span class="assign-name">${c.name}</span>
      </div>
      <input type="checkbox" id="assign-checkbox-${i}" class="assign-checkbox" />
    `;
        container.appendChild(div);
    });
}

/**
 * Closes the category dropdown and resets the arrow icon.
 */
function closeCategoryDropdown() {
    document.getElementById("category-list").classList.add("d_none");
    document.getElementById("arrow-drop-down-category").classList.add("up");
}

/**
 * Opens or closes the category dropdown and hides error messages.
 */
function toggleCategoryDropdown() {
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
    document.getElementById("required-category").classList.add("d_none");
    document.getElementById("required-category-container").classList.add("d_none");
}

/**
 * Sets the selected category for the task and updates the UI.
 * @param {string|number} number - Category identifier or index.
 */
function setCategory(number) {
    let category = document.getElementById("category" + number).innerHTML;
    let selectedCategory = document.getElementById("selected-category");
    selectedCategory.innerHTML = category;
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
}

/**
 * Clears the entire add-task form and resets all UI state.
 */
function clearTask() {
    let taskEntry = document.getElementById("add-task-entry");
    taskEntry.innerHTML = addTaskTemplate();
    setPriority("medium");
    selectedContacts = [];
}

/**
 * Clears the add-task form fields and resets task details and UI.
 */
function clearAddTask() {
    document.getElementById('title-input-overlay').value = "";
    description = document.getElementById('description-input-overlay').value = "";
    taskDetails.dueDate = document.getElementById('datepicker').value = "";
    taskDetails.category = document.getElementById("selected-category").innerHTML = "Select task category";
    subTasks = [];
    renderSubTasks();
    selectedContacts = [];
    setPriority("medium");
    renderContacts();
    document.getElementById("assigned-contacts-preview").innerHTML = "";
}