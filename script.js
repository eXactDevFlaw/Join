function toggleLogoutOverlay(){
    document.getElementById("overlay-small-logout-win").classList.toggle("d_none");
}

// function closeLogoutOverlay(){
//     document.getElementById("overlay-small-logout-win").classList.add("d_none");
// }

function stopPropagation(event) {
  event.stopPropagation();
}