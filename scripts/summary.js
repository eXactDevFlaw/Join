const greetingRef = document.getElementById('greeting');
const todoRef = document.getElementById('to-dos');
const doneRef = document.getElementById('dones');
const urgentRef = document.getElementById('urgents');
const upcomingref = document.getElementById('date');
const tasksInBoardRef = document.getElementById('tasks-in-board');
const tasksInProgressRef = document.getElementById('tasks-in-progress');
const awaitingFeedbackRef = document.getElementById('awaiting-feedback');

let tasks;
let urgentDueDates = [];

let tasksAmount = 0;
let tasksDone = 0;
let tasksToDo = 0;
let tasksUrgent = 0;
let tasksFeedback = 0;
let tasksProgress = 0;

function setGreetingConditions() {
    let currentDate = new Date();
    let currentHours = currentDate.getHours();
    let shownText = setGreetingTime(currentHours)
    greetingRef.innerText = shownText
}

function setGreetingTime(hours) {
    if (hours >= 0 && hours < 12) {
        return "Good morning,"
    } else if (hours >= 18 && hours <= 23) {
        return "Good evening,"
    } else {
        return "Have a good day,"
    }
}

function getTasksDetails() {
    Object.values(tasks).forEach(task => {
        tasksAmount++;
        if (task.priority === "urgent") tasksUrgent++;
        task.status === "todo" ? tasksToDo++ :
            task.status === "done" ? tasksDone++ :
                task.status === "in progress" ? tasksProgress++ :
                    tasksFeedback++;
    });
    renderTasksNumbers();
}

function renderTasksNumbers() {
    document.getElementById("urgents").innerHTML = tasksUrgent;
    document.getElementById("tasks-in-board").innerHTML = tasksAmount;
    document.getElementById("to-dos").innerHTML = tasksToDo;
    document.getElementById("dones").innerHTML = tasksDone;
    document.getElementById("tasks-in-progress").innerHTML = tasksProgress;
    document.getElementById("awaiting-feedback").innerHTML = tasksFeedback;
}

function renderUpcomingDeadline() {
    Object.values(tasks).forEach(task => {
        let dueDate = task.dueDate;
        if (task.priority === "urgent") {
            urgentDueDates.push(dueDate);
        }
    })
    changeDateFormat();
}

function changeDateFormat() {
    let dateString = urgentDueDates[0];
    let date = new Date(dateString);
    const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('date').innerHTML = formatted;
}


async function getTasks() {
    tasks = await getTasksFromDatabase()
}

document.addEventListener('DOMContentLoaded', async () => {
    setGreetingConditions();
    await getTasks();
    getTasksDetails();
    renderUpcomingDeadline()
})
