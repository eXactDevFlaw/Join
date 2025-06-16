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

function toggleSignIn() {
  document.getElementById('login-form').classList.toggle('d_none');
  document.getElementById('signin-form').classList.toggle('d_none');
  document.getElementById('signin-container').classList.toggle('d_none');
}

function signIn() {
  
}

function togglePrivacyCheck(){
  let btnRef = document.getElementById('signin-btn-checkbox');
  let imgRef = document.getElementById('signin-btn-checkbox-img');

  if(btnRef.checked){
    imgRef.src = "./assets/icons/checkbox_active.svg"
  }else{
    imgRef.src = "./assets/icons/checkbox.svg"
  }
}