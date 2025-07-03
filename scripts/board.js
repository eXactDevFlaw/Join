let dataPool = [];
const todoRef = document.getElementById('column-todo');
const inProgressRef = document.getElementById('no-tasks-In-progress');
const awaitFeedbackRef = document.getElementById('no-task-awaiting-feedback');
const doneRef = document.getElementById('no-tasks-done')


async function loadTasks() {
    let allTasks = Object.values(await getTasksFromDatabase())
    allTasks.forEach((singleTask) => {
        dataPool.push(new TaskClass(singleTask));
    })

    dataPool.forEach((task) => {
    task.logger()
})
}

function renderAllTasks() {
    dataPool.forEach((item) => {
        /**@type {HTMLElement} */
        let htmlel = item.constructHTMLElements()
        console.log(htmlel)
        todoRef.append(htmlel)
    });
    
}


document.addEventListener('DOMContentLoaded', async () => {
    getUserLogState()
   await loadTasks()
    renderAllTasks()
})