class TaskClass {
    constructor(key, data) {
        this.taskKey = key;
        this.taskData = data;
        this.taskName = data.title;
        this.taskDescription = data.description;
        this.taskCategory = data.category;
        this.taskPriority = data.priority;
        this.taskStatus = data.status;
        this.taskSubTasks = data.subTasks;
        this.taskAssigendTo = data.assigendTo;
    }

    logger() {
        if (this.taskData) {
            console.table(this.taskData);
        } else {
            console.log("Error on loading of data!");
        }
    }

    constructHTMLElements() {
        // Äußere Karte
        const cardDiv = document.createElement('div');
        cardDiv.className = 'task_card';
        cardDiv.draggable = true

        // task_content
        const taskContentDiv = document.createElement('div');
        taskContentDiv.className = 'task_content';

        // card_label
        const cardLabelDiv = document.createElement('div');
        cardLabelDiv.className = 'card_label margin_0';
        switch (this.taskCategory) {
            case "Technical Task":
                cardLabelDiv.style.backgroundColor =  'rgba(31, 215, 193, 1)'
                break;
            default:
                cardLabelDiv.style.backgroundColor =  'rgba(0, 56, 255, 1)'
                break;
        }
        cardLabelDiv.innerText = this.taskCategory;

        // task_description
        const taskDescriptionDiv = document.createElement('div');
        taskDescriptionDiv.className = 'task_description margin_0';

        // task_title
        const taskTitleDiv = document.createElement('div');
        taskTitleDiv.className = 'task_title margin_0';
        taskTitleDiv.id = 'task-title';
        taskTitleDiv.innerText = this.taskName;

        // task_content (inner)
        const taskContentInnerDiv = document.createElement('div');
        taskContentInnerDiv.className = 'task_content margin_0';
        taskContentInnerDiv.id = 'task-content';
        taskContentInnerDiv.innerText = this.taskDescription;

        // Description zusammenbauen
        taskDescriptionDiv.append(taskTitleDiv, taskContentInnerDiv);

        // subtask_progress
        const subtaskProgressDiv = document.createElement('div');
        subtaskProgressDiv.className = 'subtask_progress margin_0';

        const progressBarDiv = document.createElement('div');
        progressBarDiv.className = 'progress_bar margin_0';

        const progressStatusDiv = document.createElement('div');
        progressStatusDiv.className = 'progress_status margin_0';
        progressStatusDiv.style.width = '75%'; // Hier ggf. dynamisch setzen

        progressBarDiv.append(progressStatusDiv);

        // subtasks
        const subtasksDiv = document.createElement('div');
        subtasksDiv.className = 'subtasks margin_0';

        const finishedSubtasksP = document.createElement('p');
        finishedSubtasksP.id = 'finised-subtasks';
        finishedSubtasksP.innerText = "0";

        const slashP = document.createElement('p');
        slashP.innerText = "/";

        const subtasksLengthP = document.createElement('p');
        subtasksLengthP.id = 'subtasks-length';
        subtasksLengthP.innerText = "2";

        const subtasksTextP = document.createElement('p');
        subtasksTextP.innerHTML = "&nbsp;Subtasks";

        subtasksDiv.append(finishedSubtasksP, slashP, subtasksLengthP, subtasksTextP);

        subtaskProgressDiv.append(progressBarDiv, subtasksDiv);

        // task_card_footer
        const footerDiv = document.createElement('div');
        footerDiv.className = 'task_card_footer d_flex_center_row justify_between';

        // profile_badges
        const profileBadgesDiv = document.createElement('div');
        profileBadgesDiv.className = 'profile_badges d_flex_center_row margin_0 justify_start';

        // Beispiel-Badges (hier ggf. dynamisch aus deinen Daten!)
        for (let i = 0; i < 3; i++) {
            const badge = document.createElement('div');
            badge.className = 'profile_badge';
            badge.innerText = 'AM';
            profileBadgesDiv.append(badge);
        }

        // priority_symbol_container
        const priorityDiv = document.createElement('div');
        priorityDiv.className = 'priority_symbol_container d_flex_center margin_0';
        priorityDiv.id = 'priority_symbol';

        const prioImg = document.createElement('img');
        switch (this.taskPriority) {
            case "urgent":
                prioImg.src = './assets/icons/prio_high.svg';
                break;
            case "mid":
                prioImg.src = './assets/icons/prio_medium.svg';
                break;
            case "low":
                prioImg.src = './assets/icons/prio_low.svg';
                break;
            default:
                break;
        }
        priorityDiv.append(prioImg);

        footerDiv.append(profileBadgesDiv, priorityDiv);

        // Alles zusammenbauen
        taskContentDiv.append(
            cardLabelDiv,
            taskDescriptionDiv,
            subtaskProgressDiv,
            footerDiv
        );
        cardDiv.append(taskContentDiv);

        return cardDiv;
    }
}