let userName = document.getElementById('username');
let userPassword = document.getElementById('userpassword')

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    
    let hiddenItems = document.querySelectorAll('.fade_out');
   
    hiddenItems.forEach(function(element) {
      element.classList.add('fade_in');
      element.classList.remove('fade_out');
    });
  }, 1000);
});