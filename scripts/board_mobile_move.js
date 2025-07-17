
function mobileTaskMove() {
    const mobileMoveBtn = document.querySelectorAll('.mobile_move_btn');
    if (mobileMoveBtn.length > 0) {
        mobileMoveBtn.forEach((card) => {
            card.addEventListener('click', (e) => {
                e.stopPropagation()
                console.log("click")
                console.log(e.target)
            })
        })
    }
}
