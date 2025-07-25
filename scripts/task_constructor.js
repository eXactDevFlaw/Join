/**
 * @class TaskClass
 * Represents a task and provides methods to render its UI components as HTML elements.
 */
class TaskClass {
    /**
     * Initializes a TaskClass instance.
     * @param {string} key - The unique key for the task.
     * @param {Object} data - The task data object.
     */
    constructor(key, data) {
        this.taskKey = key;
        this.taskData = data;
        this.taskName = data.title;
        this.taskDescription = data.description;
        this.taskCategory = data.category;
        this.taskPriority = data.priority;
        this.taskStatus = data.status;
        this.taskSubTasks = data.subtasks;
        this.taskAssignedTo = data.assignedTo;
        this.taskDueDate = data.dueDate;
    }

    /**
     * Constructs the main HTML element for the task card.
     * @returns {HTMLDivElement} The task card element.
     */
    constructHTMLElements() {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'task_card';
        cardDiv.draggable = true;
        const taskContentDiv = document.createElement('div');
        taskContentDiv.className = 'task_content';
        taskContentDiv.append(
            this.createTaskCategoryContainer(),
            this.creatTaskDescriptionContainer(),
            this.createSubTasksContainer(),
            this.createFooterContainer(),
            this.createMobileNavbar(),
        );
        cardDiv.append(taskContentDiv);
        return cardDiv;
    }

    /**
     * Creates the priority icon container for the task card footer.
     * @returns {HTMLDivElement} The priority icon container.
     */
    creatPriorityContainer() {
        const priorityDiv = document.createElement('div');
        priorityDiv.className = 'priority_symbol_container d_flex_center margin_0';
        priorityDiv.id = 'priority_symbol';
        const prioImg = document.createElement('img');
        prioImg.src = this._getPriorityIcon();
        priorityDiv.append(prioImg);
        return priorityDiv;
    }

    /**
     * Returns the icon path for the current priority.
     * @private
     * @returns {string}
     */
    _getPriorityIcon() {
        switch (this.taskPriority) {
            case "urgent": return './assets/icons/prio_urgent.svg';
            case "medium": return './assets/icons/prio_medium.svg';
            case "low": return './assets/icons/prio_low.svg';
            default: return '';
        }
    }

    /**
     * Creates the profile badge container for assigned users.
     * @returns {HTMLDivElement} The profile badge container.
     */
    createProfileBadgeContainer() {
        const profileBadgesDiv = document.createElement('div');
        profileBadgesDiv.className = 'profile_badges d_flex_center_row margin_0 justify_start';
        if (this.taskAssignedTo) {
            let data = Object.values(this.taskAssignedTo);
            for (let i = 0; i < Math.min(3, data.length); i++) {
                const badge = this._createProfileBadge(data[i]);
                profileBadgesDiv.append(badge);
            }
        }
        return profileBadgesDiv;
    }

    /**
     * Creates a single profile badge.
     * @private
     * @param {string} user - The user for the badge.
     * @returns {HTMLDivElement}
     */
    _createProfileBadge(user) {
        let badge = document.createElement('div');
        badge.className = 'profile_badge';
        badge.style.backgroundColor = stringToColor(user);
        badge.innerText = getUserCapitalInitials(user);
        return badge;
    }

    /**
     * Creates the task card footer.
     * @returns {HTMLDivElement}
     */
    createFooterContainer() {
        const footerDiv = document.createElement('div');
        footerDiv.className = 'task_card_footer d_flex_center_row justify_between';
        footerDiv.append(this.createProfileBadgeContainer(), this.creatPriorityContainer());
        return footerDiv;
    }

    /**
     * Creates the subtasks progress and summary container for the task card.
     * @returns {HTMLDivElement} The subtasks wrapper element.
     */
    createSubTasksContainer() {
        const subTasksWrapper = document.createElement('div');
        this._resetSubtaskCounters();
        if (this._hasValidSubtasks()) {
            this._countSubtasks();
            subTasksWrapper.append(this._createSubtaskProgress());
        }
        return subTasksWrapper;
    }

    /**
     * Checks if the task has a valid, non-empty subtasks array.
     * @returns {boolean}
     */
    _hasValidSubtasks() {
        return Array.isArray(this.taskSubTasks) && this.taskSubTasks.length > 0;
    }

    /**
     * Resets subtask counters.
     * @private
     */
    _resetSubtaskCounters() {
        this.taskSubTasksAmount = 0;
        this.taskSubTasksAmountCompleted = 0;
    }

    /**
     * Counts total and completed subtasks.
     * @private
     */
    _countSubtasks() {
        this.taskSubTasks.forEach(item => {
            this.taskSubTasksAmount++;
            if (item.status === "closed") this.taskSubTasksAmountCompleted++;
        });
        this.taskSubTasksProcent =
            (this.taskSubTasksAmountCompleted / this.taskSubTasksAmount) * 100;
    }

    /**
     * Creates the DOM element representing the subtask progress bar and summary.
     * @returns {HTMLDivElement}
     */
    _createSubtaskProgress() {
        const subtaskProgressDiv = document.createElement('div');
        subtaskProgressDiv.className =
            this.taskSubTasksProcent < 1 ? 'progress_bar v_hidden' : 'subtask_progress';
        subtaskProgressDiv.append(this._createProgressBar(), this._createSubtaskSummary());
        return subtaskProgressDiv;
    }

    /**
     * Creates the progress bar element for subtasks.
     * @returns {HTMLDivElement}
     */
    _createProgressBar() {
        const progressBarDiv = document.createElement('div');
        progressBarDiv.className = 'progress_bar';
        const progressStatusDiv = document.createElement('div');
        progressStatusDiv.className = 'progress_status margin_0';
        progressStatusDiv.style.width = `${this.taskSubTasksProcent}%`;
        progressBarDiv.append(progressStatusDiv);
        return progressBarDiv;
    }

    /**
     * Creates the summary element for subtasks (X / Y Subtasks).
     * @returns {HTMLDivElement}
     */
    _createSubtaskSummary() {
        const subtasksDiv = document.createElement('div');
        subtasksDiv.className = 'subtasks margin_0';
        const finishedSubtasksP = document.createElement('p');
        finishedSubtasksP.id = 'finised-subtasks';
        finishedSubtasksP.innerText = this.taskSubTasksAmountCompleted;
        const slashP = document.createElement('p');
        slashP.innerText = "/";
        const subtasksLengthP = document.createElement('p');
        subtasksLengthP.id = 'subtasks-length';
        subtasksLengthP.innerText = this.taskSubTasksAmount;
        const subtasksTextP = document.createElement('p');
        subtasksTextP.innerHTML = "&nbsp;Subtasks";
        subtasksDiv.append(
            finishedSubtasksP, slashP, subtasksLengthP, subtasksTextP
        );
        return subtasksDiv;
    }

    /**
     * Creates the task description container, including title and truncated description.
     * @returns {HTMLDivElement} The task description container.
     */
    creatTaskDescriptionContainer() {
        const taskDescriptionDiv = document.createElement('div');
        taskDescriptionDiv.className = 'task_description';
        const taskTitleDiv = document.createElement('div');
        taskTitleDiv.className = 'task_title margin_0';
        taskTitleDiv.id = 'task-title';
        taskTitleDiv.innerText = this.taskName;
        const taskContentInnerDiv = document.createElement('div');
        taskContentInnerDiv.className = 'task_content margin_0';
        taskContentInnerDiv.id = 'task-content';
        taskContentInnerDiv.innerText =
            this.taskDescription.length > 50
                ? formatDescription(this.taskDescription, 50) + "..."
                : this.taskDescription;
        taskDescriptionDiv.append(taskTitleDiv, taskContentInnerDiv);
        return taskDescriptionDiv;
    }

    /**
     * Creates the task category label and mobile move button.
     * @returns {HTMLDivElement} The task category container.
     */
    createTaskCategoryContainer() {
        const cardLableWrapper = document.createElement('div');
        cardLableWrapper.className = 'card_label_wrapper';
        const cardLabelDiv = document.createElement('div');
        cardLabelDiv.className = 'card_label margin_0';
        cardLabelDiv.style.backgroundColor =
            this.taskCategory === "Technical Task"
                ? 'rgba(31, 215, 193, 1)'
                : 'rgba(0, 56, 255, 1)';
        cardLabelDiv.innerText = this.taskCategory;
        const cardMoveBtnImg = document.createElement('img');
        cardMoveBtnImg.src = './assets/icons/move_btn_mobile.svg';
        cardMoveBtnImg.className = 'mobile_move_btn';
        cardLableWrapper.append(cardLabelDiv, cardMoveBtnImg);
        return cardLableWrapper;
    }

    /**
     * Creates the mobile navbar for changing task status.
     * @returns {HTMLDivElement} The mobile navbar element.
     */
    createMobileNavbar() {
        const mobileNavbarDiv = document.createElement('div');
        mobileNavbarDiv.className = 'mobile_navbar d_none';
        const mobileNavbarHead = document.createElement('h6');
        mobileNavbarHead.innerText = "Move to";
        const navItemsDiv = document.createElement('div');
        navItemsDiv.className = 'mobile_navbar_items';
        [
            { text: "To do", value: "todo" },
            { text: "In progress", value: "in progress" },
            { text: "Await feedback", value: "await feedback" },
            { text: "Done", value: "done" }
        ].forEach(status => {
            if (this.taskStatus !== status.value) {
                const statusElement = document.createElement('p');
                statusElement.textContent = status.text;
                navItemsDiv.appendChild(statusElement);
            }
        });
        mobileNavbarDiv.append(mobileNavbarHead, navItemsDiv);
        return mobileNavbarDiv;
    }
}