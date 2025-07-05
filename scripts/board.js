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
        task.logger()
    })
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
    });
}

function pushCardsToCardsPool(taskStatus, htmlel){
        if(taskStatus === "todo"){
            todoRef.append(htmlel)
            cardPools.dataToDo.push(htmlel)
        } else if(taskStatus === "in progress"){
            inProgressRef.append(htmlel)
            cardPools.dataInProgress.push(htmlel)
        } else if(taskStatus === "await feedback"){
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

document.addEventListener('DOMContentLoaded', async () => {
    getUserLogState()
    await loadTasks()
    renderAllTasks()
    checkColumnContent()
})