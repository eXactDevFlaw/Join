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

function closeOtherMobileNavbars(currentNavbar) {
    document.querySelectorAll('.mobile_navbar').forEach(navbar => {
        if (!navbar.classList.contains('d_none') && navbar !== currentNavbar) {
            navbar.classList.add('d_none');
        }
    });
}

document.addEventListener('click', function(e) {
    document.querySelectorAll('.mobile_navbar').forEach(navbar => {
        if (!navbar.classList.contains('d_none') && !navbar.contains(e.target)) {
            navbar.classList.add('d_none');
        }
    });
});

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

function getStatusValue(text) {
    const statusMap = {
        "To do": "todo",
        "In progress": "in progress",
        "Await feedback": "await feedback",
        "Done": "done"
    };
    return statusMap[text];
}

function findTaskObj(card) {
    const taskName = card.getAttribute('taskname');
    return dataPool.find(task => task.taskName === taskName);
}

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

function isNavbarClick(e) {
    return e.target.classList.contains('mobile_move_btn') ||
           e.target.closest('.mobile_navbar');
}