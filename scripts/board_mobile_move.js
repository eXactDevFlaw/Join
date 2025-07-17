
function mobileTaskMove() {
    const mobileMoveBtn = document.querySelectorAll('.mobile_move_btn');
    if (mobileMoveBtn.length > 0) {
        mobileMoveBtn.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();

                const taskCard = button.closest('.task_card');
                if (taskCard) {
                    const mobileNavbar = taskCard.querySelector('.mobile_navbar');
                    if (mobileNavbar) {
                        mobileNavbar.classList.toggle('d_none');
                    }
                }
                closeMobileNavbar()
            })
        })
    }
}

function closeMobileNavbar() {
    const mobileNavbars = document.querySelectorAll('.mobile_navbar');
    document.addEventListener('click', (e) => {
        mobileNavbars.forEach((navbar) => {
            if (!navbar.classList.contains('d_none') && !navbar.contains(e.target)) {
                navbar.classList.add('d_none');
            }
        });
    });
}
