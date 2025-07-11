let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];
let subTaskDetails = {};

document.addEventListener("DOMContentLoaded", () => {
    setPriority("medium");
})

function openTaskOverlay() {
    document.getElementById("task-overlay").classList.remove("d_none");;
    let add_task_entry = document.getElementById("add-task-entry");
    add_task_entry.innerHTML = addTaskTemplate();
    add_task_entry.classList.remove("d_none");
    void add_task_entry.offsetWidth;
    add_task_entry.classList.add("show");
}

function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");;
    const entry = document.getElementById("add-task-entry");
    entry.classList.remove("show");
    setTimeout(() => {
        entry.classList.add("d_none");
    }, 300);
}

function setPriority(level) {
    const priorities = ['urgent', 'medium', 'low'];
    priorities.forEach(priority => {
        if (document.getElementById(`${priority}-button`)) {
            document.getElementById(`${priority}-button`).classList.toggle(`${priority}_set`, priority === level);
        }
    });
    priorities.forEach(priority => {
        if (document.getElementById(`prio-${priority}-icon`)) {
            document.getElementById(`prio-${priority}-icon`).classList.remove('d_none');
            document.getElementById(`prio-${priority}-icon-active`).classList.add('d_none');
        }
    });
    if (document.getElementById(`prio-${level}-icon`)) {
        document.getElementById(`prio-${level}-icon`).classList.add('d_none');
        document.getElementById(`prio-${level}-icon-active`).classList.remove('d_none');
    }
    taskDetails.priority = level;
}

async function createTask() {
    taskDetails.title = document.getElementById('title-input-overlay').value;;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = document.getElementById('assigned-to-dropdown').value;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    taskDetails.status = "todo";
    if (taskDetails.title > "" && taskDetails.dueDate > "" && taskDetails.category != "Select task category") {
        await postToDatabase("tasks", taskDetails);
        locationReload();
    } else {
        validationHandling();
    }

}

function validationHandling() {
    if (taskDetails.title === "") {
        document.getElementById('title-input-overlay').classList.add("input_error_border");
        document.getElementById('required-title').classList.remove("d_none");
    }
    if (taskDetails.dueDate === "") {
        document.getElementById('datepicker').classList.add("input_error_border");
        document.getElementById('required-date').classList.remove("d_none");
    }
    if (taskDetails.category === "Select task category") {
        document.getElementById("select-task-category").classList.add("input_error_border");
        document.getElementById('required-category').classList.remove("d_none");
    }
}

let contactDropdown = document.querySelector(".input_assigned_to");
if (contactDropdown) {
    document.addEventListener("click", function (event) {
        if (!contactDropdown.contains(event.target)) {
            closeAssignedToDropdown();
        }
    });
}

function closeAssignedToDropdown() {
    document.getElementById("add-task-contacts-list").classList.add("d_none");
    document.getElementById("arrow-drop-down-assign").classList.add("up");
}

function toggleAssignedToDropdown(event) {
    event.stopPropagation(); // ⛔ verhindert, dass das Dropdown sich sofort wieder schließt
    renderContacts();
    document.getElementById("add-task-contacts-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-assign").classList.toggle("up");
}

document.addEventListener("click", (event) => {
    const dropdown = document.getElementById("add-task-contacts-list");
    const input = document.getElementById("assigned-to-dropdown");

    if (dropdown && input && !dropdown.contains(event.target) && !input.contains(event.target)) {
        closeAssignedToDropdown();
    }
});

async function renderContacts() {
    const addTaskContactsList = document.getElementById("add-task-contacts-list");
    addTaskContactsList.innerHTML = "";

    // 1) Rohe Contacts holen (Objekt) und in ein Array verwandeln
    const contactsObj = await getContactsFromDatabase();
    const contacts = Object.values(contactsObj);

    // 2) Array alphabetisch sortieren
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // 3) Nur jeweils 5 anzeigen (optional)
    // const visible = contacts.slice(0, 5);

    contacts.forEach(contact => {
        const color = stringToColor(contact.name);
        const initials = getInitials(contact.name);

        const contactItem = document.createElement("div");
        contactItem.className = "assign_contact_row";
        contactItem.innerHTML = `
      <div class="assign_contact_left">
        <div class="contact_circle" style="background-color: ${color};">
          ${initials}
        </div>
        <span class="assign_contact_name">${contact.name}</span>
      </div>
      <div class="assign_contact_checkbox">
        <img src="./assets/icons/check.svg" alt="checked icon" class="check_icon d_none">
        </div>

    `;

        contactItem.addEventListener('click', (event) => {
            event.stopPropagation();

            contactItem.classList.toggle('contact_list_item_active');

            const checkIcon = contactItem.querySelector('.check_icon');
            checkIcon.classList.toggle('d_none');

            const nameEl = contactItem.querySelector('.assign_contact_name');
            nameEl.style.color = contactItem.classList.contains('contact_list_item_active') ? '#white' : '';
        });


        addTaskContactsList.appendChild(contactItem);
    });
}

/** Generiert aus einem String einen HSL-Farbwert */
function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360}, 70%, 50%)`;
}

/** Extrahiert die ersten beiden Initialen aus einem Namen */
function getInitials(name) {
    return name
        .split(" ")
        .map(n => n[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 2);
}

function getRandomColor() {
    const colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E"];
    return colors[Math.floor(Math.random() * colors.length)];
}


async function renderAssignableContacts() {
    const container = document.getElementById("assign-contact-list");
    if (!container) return;

    container.innerHTML = "";
    container.classList.remove("d_none");

    const contacts = await fetchContacts(); // bereits in contacts.js definiert

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

// // Klick auf das Inputfeld oder Dropdown-Pfeil zeigt Liste an
// document.getElementById("assign-input").addEventListener("click", renderAssignableContacts);


let categoryDropdown = document.querySelector(".select_category_dropdown");
if (categoryDropdown) {
    document.addEventListener("click", function (event) {
        if (!categoryDropdown.contains(event.target)) {
            closeCategoryDropdown();
        }
    });
}

function closeCategoryDropdown() {
    document.getElementById("category-list").classList.add("d_none");
    document.getElementById("arrow-drop-down-category").classList.add("up");
}

function toggleCategoryDropdown() {
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
    document.getElementById("required-category").classList.add("d_none");
    document.getElementById("required-category-container").classList.add("d_none");
}

function setCategory(number) {
    let category = document.getElementById("category" + number).innerHTML;
    let selectedCategory = document.getElementById("selected-category");
    selectedCategory.innerHTML = category;
    document.getElementById("category-list").classList.toggle("d_none");
    document.getElementById("arrow-drop-down-category").classList.toggle("up");
}

function activateSubtask() {
    document.querySelector(".add").classList.add("d_none");
    document.getElementById("add-subtasks").focus();
    document.querySelector(".add_or_remove").classList.remove("d_none");
}

let subtaskInput = document.getElementById("add-subtasks");
if (subtaskInput) {
    document.addEventListener("click", function (event) {
        if (!subtaskInput.contains(event.target)) {
            if (subtaskInput.value === "") {
                unActivateSubtask();
            }
        }
    });
}

function unActivateSubtask() {
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function addNewSubTask() {
    let subTask = document.getElementById("add-subtasks");
    let subTaskTitle = subTask.value
    if (subTaskTitle > "") {
        subTaskDetails.status = "open";
        subTaskDetails.title = subTaskTitle;
        subTasks.push(subTaskDetails);
        renderSubTasks();
        subTaskDetails = {};
    }
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function renderSubTasks() {
    let addSubtaskList = document.querySelector(".added_subtask_list");
    addSubtaskList.innerHTML = "";
    subTasks.forEach((subTask, index) => {
        addSubtaskList.innerHTML += addSubTaskTemplate(subTask.title, index);
    })
}

let addSubTaskInput = document.getElementById("add-subtasks");
if (addSubTaskInput) {
    addSubTaskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addNewSubTask();
        }
    });
}

function clearSubTaskValue() {
    let subTask = document.getElementById("add-subtasks");
    subTask.value = "";
    document.querySelector(".add").classList.remove("d_none");
    document.querySelector(".add_or_remove").classList.add("d_none");
}

function deleteSubTask(index) {
    subTasks.splice(index, 1);
    renderSubTasks();
}

function editSubTask(index) {
    document.getElementById('subtask' + index).classList.add('d_none');
    document.getElementById('edit-subtask' + index).classList.remove('d_none');
}

function editCheck(index) {
    let editCheck = document.getElementById("edit-value" + index)
    let editCheckValue = editCheck.value;
    subTasks[index] = editCheckValue;
    renderSubTasks()
}