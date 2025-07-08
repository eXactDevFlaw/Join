let rawTasksData = [];
let dataPool = [];
let cardPools = {
    dataToDo: [],
    dataInProgress: [],
    dataAwaitFeedback: [],
    dataDone: [],
}

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
    rawTasksData = Object.entries(await getTasksFromDatabase())
    rawTasksData.forEach((singleTask) => {
        let [key, data] = [...singleTask]
        dataPool.push(new TaskClass(key, data));
    })
    dataPool.forEach((task) => {
        // task.logger()
    })
}

function renderAllTasks() {
    dataPool.forEach((item) => {
        /**@type {HTMLElement} */
        let htmlel = item.constructHTMLElements()
        htmlel.setAttribute("taskName", item.taskName)
        htmlel.setAttribute("taskStatus", item.taskStatus)
        // htmlel.setAttribute("onclick", `openTaskDetails()`)
        // ${item.taskKey}
        htmlel.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.taskName);
        })
        pushCardsToCardsPool(item.taskStatus, htmlel)
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
                if (taskName.includes(searchInput)) {
                    card.classList.remove('d_none');
                } else {
                    card.classList.add('d_none')
                }
            })
        })
        checkColumnContent()
    })
};

dragRef.forEach(element => {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
    })

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
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
function getUserCapitalInitials(data) {
    let userName = data.trim().split(' ');
    let firstInitial = userName[0][0].toUpperCase();
    let lastInitial = userName[userName.length - 1][0].toUpperCase();
    return firstInitial + lastInitial
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
    taskDetailsRef ()
})

function taskDetailsRef (){
    const taskCards = document.querySelectorAll(".task_card");
    taskCards.forEach(task => {
        task.addEventListener("click", function () {
            let taskname = this.getAttribute("taskname")
            dataPool.forEach((data) => {
                if (data.taskName === taskname){
                     renderTaskDetailView(data);
                     console.log("geht");
                     
                }
            })
        });
    });
   
}

function renderTaskDetailView(data) {
    const taskCategory = document.getElementById("task-category");
    const taskTitle = document.querySelector(".task_detail_title");
    const taskDescription = document.querySelector(".task_detail_description");
    const taskDueDate = document.querySelector(".detail_due_date");
    if (data.taskCategory === "Technical Task"){
        taskCategory.style.backgroundColor = 'rgba(31, 215, 193, 1)';
        
    } else {
        taskCategory.style.backgroundColor = 'rgba(0, 56, 255, 1)'
    }
    taskCategory.innerHTML = data.taskCategory;  
    taskTitle.innerHTML = data.taskName;
    taskDescription.innerHTML = data.taskDescription;
    taskDueDate.innerHTML = data.taskData.dueDate.toLocaleString();
    console.log(data);
    openTaskDetails()
}

function openTaskDetails() {
   
    document.getElementById("task-overlay").classList.remove("d_none");
    let task_detail_entry = document.getElementById("task-details");
    task_detail_entry.classList.remove("d_none");
    void task_detail_entry.offsetWidth;
    task_detail_entry.classList.add("show");
}

function closeTaskOverlay() {
    document.getElementById("task-overlay").classList.add("d_none");;
    const entry = document.getElementById("add-task-entry");
    const task_detail_entry = document.getElementById("task-details");
    entry.classList.remove("show");
    task_detail_entry.classList.remove("show");
    setTimeout(() => {
        entry.classList.add("d_none");
        task_detail_entry.classList.add("d_none");
    }, 300);
}