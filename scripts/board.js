let rawTasksData = [];
let dataPool = [];
let cardPools = {
    dataTopDo: [],
    dataInProgress: [],
    dataAwaitFeedback: [],
    dataDone: [],
}

const todoRef = document.getElementById('column-todo');
const todoEmptyRef = document.getElementById('no-tasks-to-do');
const inProgressRef = document.getElementById('column-in-progress');
const inProgressEmptyRef = document.getElementById('no-tasks-in-progress');
const awaitFeedbackRef = document.getElementById('column-await-feedback');
const awaitFeedbackEmptyRef = document.getElementById('no-task-awaiting-feedback');
const doneRef = document.getElementById('column-done');
const doneEmptyRef = document.getElementById('no-tasks-done');
const dragRef = document.querySelectorAll('.card_column');

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
        htmlel.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.taskName);
        })

        if(item.taskStatus === "todo"){
            todoRef.append(htmlel)
        } else if(item.taskStatus === "in progress"){
            inProgressRef.append(htmlel)
        } else if(item.taskStatus === "await feedback"){
            awaitFeedbackRef.append(htmlel)
        } else {
            doneRef.append(htmlel)
        }
    });
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
})