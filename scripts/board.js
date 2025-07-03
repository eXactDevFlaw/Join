let dataPool = [];
let cardPools = {
    dataTopDo: [],
    dataInProgress: [],
    dataAwaitFeedback: [],
    dataDone: [],
}

const todoRef = document.getElementById('column-todo');
const inProgressRef = document.getElementById('no-tasks-In-progress');
const awaitFeedbackRef = document.getElementById('no-task-awaiting-feedback');
const doneRef = document.getElementById('no-tasks-done');
const dragRef = document.querySelectorAll('.card_column');

async function loadTasks() {
    let fullTaskData = Object.entries(await getTasksFromDatabase())

    fullTaskData.forEach((singleTask) => {
        let [key,data] = [...singleTask]
        
        // console.log(data)
        dataPool.push(new TaskClass(key,data));
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
            e.dataTransfer.effectAllowed = "move";
        })
        todoRef.append(htmlel)
    });
}

dragRef.forEach(element => {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    })

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        let cardTaskName = e.dataTransfer.getData('text/plain')
        const card = document.querySelector(`.task_card[taskName="${cardTaskName}"]`)
        element.appendChild(card)
        console.log(element)
        const classIdentifyer = dataPool.filter(item => item.taskName == cardTaskName)
        classIdentifyer.taskStatus = element.getAttribute("name");
        console.log(classIdentifyer.taskStatus)
        updateOnCardsStatus(classIdentifyer.taskStatus)
        // push an DB für "status" await
    })
});

function updateOnCardsStatus(cardStatus) {
    let path = "tasks"
    let data = // OBject 
    updateOnDatabase(path, data)
}

document.addEventListener('DOMContentLoaded', async () => {
    getUserLogState()
    await loadTasks()
    renderAllTasks()
})