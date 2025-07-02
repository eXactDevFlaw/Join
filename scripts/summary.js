const greetingRef = document.getElementById('greeting');
const todoRef = document.getElementById('to-dos');
const doneRef = document.getElementById('dones');
const urgentRef = document.getElementById('urgents');
const upcomingref = document.getElementById('date');
const tasksInBoardRef = document.getElementById('tasks-in-board');
const tasksInProgressRef = document.getElementById('tasks-in-progress');
const awaitingFeedbackRef = document.getElementById('awaiting-feedback');

let tasks;

function setGreetingConditions(){
    let currentDate = new Date();
    let currentHours = currentDate.getHours();
    let shownText = setGreetingTime(currentHours)
    greetingRef.innerText = shownText
}

function setGreetingTime(hours){
    if(hours >= 0 && hours < 12){
        return "Good morning,"
    } else if(hours >= 18 && hours <=23) {
        return "Good evening,"
    } else {
        return "Have a good day,"
    }
}


function getTasksDetails() {
    let tasksAmount = 0;
    let tasksOpen = 0;
    let tasksActive = 0;
    let tasksClosed = 0;
    let tasksUrgent = 0;
    let tasksFeedback = 0;

    Object.values(tasks).forEach(element => {
        tasksAmount++
        if(element.priority = "urgent"){
            console.log("ich bin urgent")
        }
    });
    console.log(tasksAmount)
    return {tasksAmount, tasksOpen, tasksActive, tasksClosed, tasksUrgent, tasksFeedback}
}

async function getTasks() {
   tasks = await getTasksFromDatabase()
}

document.addEventListener('DOMContentLoaded', async () => {
    setGreetingConditions();
    await getTasks();
    getTasksDetails();
    console.log(tasks)
})