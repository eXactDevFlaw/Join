class TaskClass {
    constructor(item) {
        this.taskData = item;
        this.taskName = item.title;
        this.taskDescription = item.description;
        this.taskCategory = item.category;
        this.taskPriority = item.priority
        // Füge weitere Felder hinzu, falls benötigt
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

        // task_content
        const taskContentDiv = document.createElement('div');
        taskContentDiv.className = 'task_content';

        // card_label
        const cardLabelDiv = document.createElement('div');
        cardLabelDiv.className = 'card_label margin_0';
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
        prioImg.src = './assets/icons/prio_medium.svg';
        prioImg.alt = '';

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