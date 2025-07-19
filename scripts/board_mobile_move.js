/**
 * Attaches click event handlers to all elements with the class `.mobile_move_btn` to enable toggling of the associated mobile navbar for a task card.
 * When a mobile move button is clicked, it toggles the visibility of the corresponding `.mobile_navbar` and closes any other open navbars.
 */
function setupMobileTaskMove() {
    const mobileMoveBtns = document.querySelectorAll('.mobile_move_btn');
    mobileMoveBtns.forEach((btn) => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const cardContent = btn.closest('.task_content');
            const mobileNavbar = cardContent.querySelector('.mobile_navbar');
            if (mobileNavbar) {
                closeOtherMobileNavbars(mobileNavbar);
                mobileNavbar.classList.toggle('d_none');
            }
        }
    });
}

/**
 * Closes all open mobile navbars except the currently active one.
 *
 * @param {Element} currentNavbar - The mobile navbar element that should remain open.
 */
function closeOtherMobileNavbars(currentNavbar) {
    document.querySelectorAll('.mobile_navbar').forEach(navbar => {
        if (!navbar.classList.contains('d_none') && navbar !== currentNavbar) {
            navbar.classList.add('d_none');
        }
    });
}

// Global click event to close any open mobile navbar when clicking outside of it.
/**
 * Adds a click listener to the document to close any open `.mobile_navbar` if the click is outside of it.
 *
 * @param {MouseEvent} e - The click event.
 */
document.addEventListener('click', function(e) {
    document.querySelectorAll('.mobile_navbar').forEach(navbar => {
        if (!navbar.classList.contains('d_none') && !navbar.contains(e.target)) {
            navbar.classList.add('d_none');
        }
    });
});

/**
 * Initializes click event handlers for each move option in the mobile navbar of every task card.
 * Clicking an option will trigger a status change for the task.
 */
function setupMobileNavbarMove() {
    document.querySelectorAll('.task_card').forEach(card => {
        const mobileNavbar = card.querySelector('.mobile_navbar');
        if (mobileNavbar) {
            mobileNavbar.querySelectorAll('p').forEach(option => {
                option.onclick = function(e) {
                    e.stopPropagation();
                    handleMoveOptionClick(card, option, mobileNavbar);
                };
            });
        }
    });
}

/**
 * Handles the logic when a move option is clicked in the mobile navbar.
 * Updates task status, hides the navbar, and refreshes the board.
 *
 * @async
 * @param {Element} card - The DOM element representing the task card.
 * @param {Element} option - The option element that was clicked.
 * @param {Element} mobileNavbar - The mobile navbar containing the options.
 */
async function handleMoveOptionClick(card, option, mobileNavbar) {
    const newStatus = getStatusValue(option.textContent.trim());
    if (!newStatus) return;
    const taskObj = findTaskObj(card);
    if (taskObj) {
        taskObj.taskStatus = newStatus;
        await updateOnCardsStatus(taskObj);
    }
    mobileNavbar.classList.add('d_none');
    refreshBoard();
}

/**
 * Maps the display text of a status option to its corresponding status value.
 *
 * @param {string} text - The display text of the status option.
 * @returns {string|undefined} The corresponding status value, or undefined if not found.
 */
function getStatusValue(text) {
    const statusMap = {
        "To do": "todo",
        "In progress": "in progress",
        "Await feedback": "await feedback",
        "Done": "done"
    };
    return statusMap[text];
}

/**
 * Finds a task object in the global data pool that matches the given card's task name.
 *
 * @param {Element} card - The DOM element representing the task card.
 * @returns {Object|undefined} The found task object, or undefined if not found.
 */
function findTaskObj(card) {
    const taskName = card.getAttribute('taskname');
    return dataPool.find(task => task.taskName === taskName);
}

/**
 * Sets up a click event for each task card to trigger a rotation animation and handle card click logic,
 * except on wide screens (width >= 1400px). Ignores clicks that originate from the navbar or its move button.
 */
function setupCardRotation() {
    if (window.innerWidth >= 1400) return;
    document.querySelectorAll('.task_card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (isNavbarClick(e)) return;
            card.classList.add('rotating');
            setTimeout(() => card.classList.remove('rotating'), 300);
            handleTaskCardClick(card);
        });
    });
}

/**
 * Determines if the click event was triggered by the mobile move button or inside the mobile navbar.
 *
 * @param {MouseEvent} e - The click event.
 * @returns {boolean} True if the click was on the mobile move button or inside the navbar, otherwise false.
 */
function isNavbarClick(e) {
    return e.target.classList.contains('mobile_move_btn') ||
           e.target.closest('.mobile_navbar');
}