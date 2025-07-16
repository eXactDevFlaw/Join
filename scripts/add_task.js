let task = [];
let taskDetails = {};
let users = {};
let categorys = ["Technical Task", "User Story"];
let subTasks = [];
let subTaskDetails = {};
let allContacts = [];
let selectedContacts = [];
let pushedContactsName = [];


window.toggleAssignedToDropdown = function (e) {
    e.stopPropagation();
    const list = document.getElementById("add-task-contacts-list");
    const arrow = document.getElementById("arrow-drop-down-assign");
    if (list.classList.contains("d_none")) renderContacts();
    list.classList.toggle("d_none");
    arrow.classList.toggle("up");
};


const assignedInput = document.getElementById("assigned-to-dropdown");
if (assignedInput) {
    assignedInput.addEventListener("input", () => {

        const list = document.getElementById("add-task-contacts-list");
        if (!list.classList.contains("d_none")) {
            renderContacts();
        }
    });
}

/**
 * Lädt alle Kontakte einmalig ins Array.
 */
async function initContacts() {
    const raw = await getContactsFromDatabase();
    allContacts = Object.entries(raw || {}).map(([id, data]) => ({ id, ...data }));
}


document.addEventListener("DOMContentLoaded", () => {
    initContacts();
    setPriority("medium");
});


document.addEventListener('click', (e) => {
    if (e.target.id != "add-task-contacts-list") {
        const list = document.getElementById("add-task-contacts-list");
        if (list) { list.classList.add('d_none') }
    }
})

function openTaskOverlay() {
    // Overlay öffnen
    const overlay = document.getElementById("task-overlay");
    overlay.classList.remove("d_none");

    // Template injizieren
    const addTaskEntry = document.getElementById("add-task-entry");
    addTaskEntry.innerHTML = addTaskTemplate();
    addTaskEntry.classList.remove("d_none");
    void addTaskEntry.offsetWidth;
    addTaskEntry.classList.add("show");

    // Elemente greifen **innerhalb** des neueingefügten DOM
    const wrap = addTaskEntry.querySelector(".input_assigned_to");
    const list = addTaskEntry.querySelector("#add-task-contacts-list");
    const arrow = addTaskEntry.querySelector("#arrow-drop-down-assign");
    const input = addTaskEntry.querySelector("#assigned-to-dropdown");

    // Sofort erst rendern (ohne Suchbegriff)
    renderContacts();

    // 1) Live-Filter
    if (input) {
        input.addEventListener("input", () => {
            if (!list.classList.contains("d_none")) {
                renderContacts();
            }
        });
    }

    // 2) Öffnen / Schließen per Klick auf Wrap (Input + Pfeil)
    if (wrap && list && arrow) {
        wrap.addEventListener("click", e => {
            e.stopPropagation();
            if (list.classList.contains("d_none")) renderContacts();
            list.classList.toggle("d_none");
            arrow.classList.toggle("up");
        });

        // 3) Klick außerhalb schließt Dropdown
        document.addEventListener("click", e => {
            if (!wrap.contains(e.target) && !list.contains(e.target)) {
                list.classList.add("d_none");
                arrow.classList.add("up");
            }
        });
    }
}


/**
 * Schließt das Overlay wieder.
 */
function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");
    const entry = document.getElementById("add-task-entry");
    entry.classList.remove("show");
    setTimeout(() => entry.classList.add("d_none"), 300);
}

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

async function createTask() {
    taskDetails.title = document.getElementById('title-input-overlay').value;
    taskDetails.description = document.getElementById('description-input-overlay').value;
    taskDetails.dueDate = document.getElementById('datepicker').value;
    taskDetails.assignedTo = pushedContactsName;
    taskDetails.category = document.getElementById("selected-category").innerHTML;
    taskDetails.subtasks = subTasks;
    taskDetails.status = "todo";

    if (taskDetails.title && taskDetails.dueDate && taskDetails.category !== "Select task category") {
        await postToDatabase("tasks", taskDetails);
        showSuccessAddedTask()
    } else {
        validationHandling();
    }
}

function validationHandling() {
    if (!taskDetails.title) {
        document.getElementById('title-input-overlay').classList.add("input_error_border");
        document.getElementById('required-title').classList.remove("d_none");
    }
    if (!taskDetails.dueDate) {
        document.getElementById('datepicker').classList.add("input_error_border");
        document.getElementById('required-date').classList.remove("d_none");
    }
    if (taskDetails.category === "Select task category") {
        document.getElementById("select-task-category").classList.add("input_error_border");
        document.getElementById('required-category').classList.remove("d_none");
    }
}

function showSuccessAddedTask() {
    const successContent = document.querySelector('.added_success_task_wrapper')
    successContent.classList.remove('d_none');
    setTimeout(() => {
        window.location.href = './board.html';
    }, 2000);
}


/**
 * Rendert die Contact‑Liste im Dropdown alphabetisch und optional gefiltert.
 */
async function renderContacts() {
    const container = document.getElementById("add-task-contacts-list");
    const input = document.getElementById("assigned-to-dropdown");
    console.log("Hallo")
    if (!container || !input) {
        console.warn("renderContacts: Container oder Input nicht gefunden.");
        return;
    }
    const searchTerm = input.value.trim().toLowerCase();
    container.innerHTML = "";

    allContacts
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(contact => {
            if (!contact.name.toLowerCase().startsWith(searchTerm)) return;
            const sel = selectedContacts.includes(contact.id);
            const color = stringToColor(contact.name);
            const initials = getInitials(contact.name);
            const row = document.createElement("div");
            row.className = "assign_contact_row" + (sel ? " contact_list_item_active" : "");
            row.innerHTML = `
                <div class="assign_contact_left">
                  <div class="contact_circle" style="background-color:${color}">
                    ${initials}
                  </div>
                  <span class="assign_contact_name" style="color:${sel ? 'white' : ''}">
                    ${contact.name}
                  </span>
                </div>
                <div class="assign_contact_checkbox">
                  <img src="./assets/icons/check.svg"
                       class="check_icon"
                       style="display:${sel ? 'block' : 'none'}" />
                </div>
            `;
            row.addEventListener("click", e => {
                e.stopPropagation();
                const idx = selectedContacts.indexOf(contact.id);
                const idname = selectedContacts[contact.name]
                if (idx >= 0) {
                    selectedContacts.splice(idx, 1);
                    pushedContactsName.splice(idname, 1)
                } 
                else {
                    selectedContacts.push(contact.id);
                   pushedContactsName.push(contact.name) 
                } 
                renderContacts();
                renderSelectedCircles();
            });
            container.appendChild(row);
        });
}


/**
 * Zeigt unter dem Inputkreischen der ausgewählten Kontakte.
 */
function renderSelectedCircles() {
    const preview = document.getElementById("assigned-contacts-preview");

    if (!preview) return;                  // ← Guard
    preview.innerHTML = "";
    if (selectedContacts.length) {
        for (i = 0; i < Math.min(4, selectedContacts.length); i++) {
            let id = selectedContacts[i];

            const c = allContacts.find(x => x.id === id);
            if (!c) return;
            const circle = document.createElement("div");
            circle.className = "assigned_circle";
            circle.textContent = getInitials(c.name);
            circle.style.backgroundColor = stringToColor(c.name);
            preview.appendChild(circle);
        };
        const badge = renderBlankedBadge()
        if(badge) {
            preview.appendChild(badge)
        }
    }

}

function renderBlankedBadge() {
    let moreBadge
    if (selectedContacts.length > 4){
        moreBadge = document.createElement('div');
        moreBadge.className = "assigned_circle"
        moreBadge.textContent = "More.."
        moreBadge.style.backgroundColor = "grey"
    }
    return moreBadge
}


/** Hilfsfunktionen */
function getInitials(name) {
    return name.split(" ").map(w => w[0].toUpperCase()).join("").slice(0, 2);
}
function stringToColor(str) {
    let hash = 0;
    for (const c of str) hash = (hash << 5) - hash + c.charCodeAt(0);
    return `hsl(${hash % 360},70%,50%)`;
}

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
    if (subTasks > "") {
        subTasks.forEach((subTask, index) => {
            addSubtaskList.innerHTML += addSubTaskTemplate(subTask, index);
        })
    }

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
    subTasks[index].title = editCheckValue;
    renderSubTasks()
}