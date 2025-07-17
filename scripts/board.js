let rawTasksData = [];
let dataPool = [];
let cardPools = {
    dataToDo: [],
    dataInProgress: [],
    dataAwaitFeedback: [],
    dataDone: [],
}

let data = [];

const todoRef = document.getElementById('column-todo');
const todoEmptyRef = document.getElementById('no-tasks-to-do');
const inProgressRef = document.getElementById('column-in-progress');
const inProgressEmptyRef = document.getElementById('no-tasks-in-progress');
const awaitFeedbackRef = document.getElementById('column-await-feedback');
const awaitFeedbackEmptyRef = document.getElementById('no-tasks-awaiting-feedback');
const doneRef = document.getElementById('column-done');
const doneEmptyRef = document.getElementById('no-tasks-done');
const dragRef = document.querySelectorAll('.card_column');
const searchRef = document.getElementById('find-task');

const columnRefs = {
    dataToDo: todoRef,
    dataInProgress: inProgressRef,
    dataAwaitFeedback: awaitFeedbackRef,
    dataDone: doneRef,
}

const emptyRefs = {
    dataToDo: todoEmptyRef,
    dataInProgress: inProgressEmptyRef,
    dataAwaitFeedback: awaitFeedbackEmptyRef,
    dataDone: doneEmptyRef,
};

async function loadTasks() {
    let dataFromDatabase = await getTasksFromDatabase()
    if (dataFromDatabase) {
        rawTasksData = Object.entries(dataFromDatabase)
    }
    if (rawTasksData) {
        rawTasksData.forEach((singleTask) => {
            let [key, data] = [...singleTask]
            dataPool.push(new TaskClass(key, data));
        })
        dataPool.forEach((task) => {
            // task.logger()
        })
    }
}

function renderAllTasks() {
    dataPool.forEach((item) => {
        /**@type {HTMLElement} */
        let htmlel = item.constructHTMLElements()
        htmlel.setAttribute("taskName", item.taskName)
        htmlel.setAttribute("taskStatus", item.taskStatus)
        htmlel.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.taskName);
        })
        pushCardsToCardsPool(item.taskStatus, htmlel)
        taskDetailsRef()
    });
}

function pushCardsToCardsPool(taskStatus, htmlel) {
    if (taskStatus === "todo") {
        todoRef.append(htmlel)
        cardPools.dataToDo.push(htmlel)
    } else if (taskStatus === "in progress") {
        inProgressRef.append(htmlel)
        cardPools.dataInProgress.push(htmlel)
    } else if (taskStatus === "await feedback") {
        awaitFeedbackRef.append(htmlel)
        cardPools.dataAwaitFeedback.push(htmlel)
    } else {
        doneRef.append(htmlel)
        cardPools.dataDone.push(htmlel)
    }
}

function checkColumnContent() {
    Object.keys(cardPools).forEach((key) => {
        const pool = cardPools[key];
        const ref = emptyRefs[key];
        if (pool.length === 0) {
            ref.classList.remove('d_none');
        } else {
            ref.classList.add('d_none');
        }
    });
}

function refreshBoard() {
    Object.keys(cardPools).forEach((key) => {
        const ref = columnRefs[key];
        let refTasks = ref.querySelectorAll('.task_card')
        if (refTasks.length > 0) {
            refTasks.forEach((item) => {
                ref.removeChild(item);
            })
        }
    });

    cardPools.dataToDo = [];
    cardPools.dataInProgress = [];
    cardPools.dataAwaitFeedback = [];
    cardPools.dataDone = [];

    renderAllTasks();
    checkColumnContent();
}

function searchTaskOnBoard() {
    searchRef.addEventListener('input', (e) => {
        let searchInput = e.target.value.toLowerCase().trim();

        Object.values(cardPools).forEach((cardList) => {
            cardList.forEach((card) => {
                let taskName = card.getAttribute('taskName').toLowerCase();
                let taskDescription = card.querySelector('#task-content').innerHTML.toLowerCase();
                searchTaskName(taskName, searchInput, card, taskDescription);
                
            })
        })
        checkColumnContent()
    })
};

function searchTaskName(taskName, searchInput, card, taskDescription) {
    if (taskName.includes(searchInput)) {
        card.classList.remove('d_none');
    } else {
        searchTaskDescription(taskName, searchInput, card, taskDescription);
    }
}

function searchTaskDescription(taskName, searchInput, card, taskDescription) {
    if (taskDescription.includes(searchInput)) {
        card.classList.remove('d_none');
    } else {
        card.classList.add('d_none')
    }
}

dragRef.forEach(element => {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('hover_dragzone');
    })

    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.classList.remove('hover_dragzone');
    })

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('hover_dragzone')
        let cardTaskName = e.dataTransfer.getData('text/plain')
        const card = document.querySelector(`.task_card[taskName="${cardTaskName}"]`)
        element.appendChild(card)
        const [cardIdentifyer] = [...dataPool.filter(item => item.taskName == cardTaskName)]
        cardIdentifyer.taskStatus = element.getAttribute("name");
        updateOnCardsStatus(cardIdentifyer)
        checkColumnContent();
        refreshBoard()
    })
});

const updateOnCardsStatus = async (cardIdentifyer) => {
    if (cardIdentifyer) {
        let taskFromDB = await loadCurrentTaskFromDatabase(cardIdentifyer.taskKey);
        taskFromDB.status = cardIdentifyer.taskStatus;
        await updateTasksOnDatabase(cardIdentifyer.taskKey, taskFromDB);
    }
}

async function loadCurrentTaskFromDatabase(taskKey) {
    try {
        let response = await fetch(FIREBASE_URL + "tasks/" + taskKey + ".json");
        let responseToJson = await response.json();
        return responseToJson
    } catch (error) {
        throw new Error("Failed to fetch firebase url", error)
    }
}

async function updateTasksOnDatabase(taskKey, data) {
    let response = await fetch(FIREBASE_URL + "tasks/" + taskKey + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
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
 * Function to set capital letters for usercontrol
 */
function getUserCapitalInitials(name) {
    if (!name || typeof name !== "string") return "";
    let userName = name.trim().split(" ");
    let firstInitial = userName[0][0]?.toUpperCase() || "";
    let lastInitial = userName[userName.length - 1][0]?.toUpperCase() || "";
    return firstInitial + lastInitial;
}

/**
 * Checks string and whitespace
 * @param {string} str 
 * */
function formatDescription(str, iterator) {
    const nextSpace = str.indexOf(" ", iterator);
    if (nextSpace === -1) {
        return str;
    }
    return str.slice(0, nextSpace);
}


document.addEventListener('DOMContentLoaded', async () => {
    getUserLogState()
    await loadTasks()
    renderAllTasks()
    checkColumnContent()
    searchTaskOnBoard()
    taskDetailsRef()
})

function taskDetailsRef() {
    const taskCards = document.querySelectorAll(".task_card");
    taskCards.forEach(task => {
        task.addEventListener("click", function () {
            let taskname = this.getAttribute("taskname")
            dataPool.forEach((task) => {
                if (task.taskName === taskname) {
                    data = task;
                    if (data.taskSubTasks === undefined) {
                        subTasks = [];
                        data.taskSubTasks = subTasks;
                    }
                    renderTaskDetailView(data);
                }
            })
        });
    });

}

function renderTaskDetailView(data) {
    const taskDetail = document.getElementById('task-details');
    taskDetail.innerHTML = "";
    taskDetail.innerHTML = taskDetailViewTemplate(data);

    const taskCategory = document.getElementById("task-category");
    if (data.taskCategory === "Technical Task") {
        taskCategory.style.backgroundColor = 'rgba(31, 215, 193, 1)';
    } else {
        taskCategory.style.backgroundColor = 'rgba(0, 56, 255, 1)'
    }
    taskCategory.innerHTML = data.taskCategory;
    renderContactsDetailView(data);
    renderSubTasksDetailView(data)
    openTaskDetails();
    prepareDeleteTask();
    prepareEditTask()
}

function renderContactsDetailView(data) {
    const assignedTo = document.getElementById("assigned-contacts");
    if (data.taskData.assignedTo) {
        data.taskData.assignedTo.forEach((contact) => {
            assignedTo.innerHTML += `
        <div class="width_100 assigned_contact"> 
        <div class="assigned_circle margin_0" id="${contact}"}></div><div class="margin_0 ">${contact}</div>
        </div>`;
            const profileBadge = document.getElementById(contact);
            profileBadge.style.backgroundColor = stringToColor(contact);
            profileBadge.innerText = getUserCapitalInitials(contact);
        })
    }
}


function renderSubTasksDetailView(data) {
    subTasks = [];
    subTasks = data.taskSubTasks;
    let subTasksRef = document.getElementById("subTasks-detail-view");
    subTasksRef.innerHTML = "";
    if (subTasks) {
        Object.values(subTasks).forEach((subTask, index) => {
            if (subTask.status === "open") {
                subTasksRef.innerHTML += `<div class="margin_0 subtask_detail_view">
                <div class="checkbox-wrapper" id="checkbox${index}"><img src="./assets/icons/checkbox.svg" alt="checkbox" onclick="checkSubTask(${index})"></div>${subTask.title}</div>`;
            } else {
                subTasksRef.innerHTML += `<div class="margin_0 subtask_detail_view">
                <div class="checkbox-wrapper" id="checkbox-active${index}"><img src="./assets/icons/checkbox_active.svg" alt="checkbox_active" onclick="unCheckSubTask(${index})"></div>${subTask.title}</div>`;
            }
        })
    }
}

function openTaskDetails() {
    document.getElementById("task-overlay").classList.remove("d_none");
    let task_detail_entry = document.getElementById("task-details");
    task_detail_entry.classList.remove("d_none");
    void task_detail_entry.offsetWidth;
    task_detail_entry.classList.add("show");
}

async function checkSubTask(index) {
    data.taskData.subtasks[index].status = "closed";
    pushData = data.taskData;
    taskKey = data.taskKey;
    renderSubTasksDetailView(data);
    await updateOnDatabase("tasks/" + taskKey, pushData);
}

function unCheckSubTask(index) {
    data.taskSubTasks[index].status = "open";
    renderSubTasksDetailView(data)
    refreshBoard()
}

function prepareDeleteTask() {
    const deleteTask = document.getElementById("deleteTask");
    deleteTask.addEventListener("click", async function () {
        let taskKey = this.getAttribute("taskname");
        await deleteFromDatabase("tasks/" + taskKey);
        location.reload();
    })
}

function prepareEditTask() {
    const editTask = document.getElementById("edit-Task");
    editTask.addEventListener("click", function () {
        renderTaskDetailEdit();
        prepareUpdateTask();
    })
}

function renderTaskDetailEdit() {
    const taskDetail = document.getElementById('task-details');
    taskDetail.innerHTML = taskDetailEditTemplate(data);
    renderSubTasks();
    setPriority(data.taskPriority);
    selectedContacts = data.taskData.assignedTo;
    if (selectedContacts === undefined) {
        selectedContacts = [];
    }
    prepareRenderContacts();
    renderSelectedCircles();
}

function prepareUpdateTask() {
    const checkEditTask = document.getElementById("check-edit-task");
    checkEditTask.addEventListener("click", function () {
        let taskKey = this.getAttribute("taskname");
        dataPool.forEach((task) => {
            if (task.taskKey === taskKey) {
                updateTask(task);
            }
        })
        refreshBoard()
    })
}

async function updateTask(data) {
    let rawPrio = Object.values(taskDetails)
    data.taskData.title = document.getElementById('title-input-overlay').value;
    data.taskData.description = document.getElementById('description-input-overlay').value;
    data.taskData.dueDate = document.getElementById('datepicker').value;
    data.taskData.assignedTo = selectedContacts;
    data.taskData.subtasks = subTasks;
    data.taskData.priority = rawPrio[0]
    pushData = data.taskData;
    taskKey = data.taskKey;
    await updateOnDatabase("tasks/" + taskKey, pushData);
    // closeTaskOverlay();
    // openTaskDetails();
    renderTaskDetailView(data);
    refreshBoard();
}