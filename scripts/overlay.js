async function loadFormIntoOverlay(file) {
  const overlayContent = document.getElementById('overlay_content');
  const resp = await fetch(file);
  overlayContent.innerHTML = resp.ok
    ? await resp.text()
    : `<p style="padding:16px;color:red">Template nicht gefunden</p>`;
}

function slideInOverlay() {
  document.getElementById('overlay').classList.add('show');
  document.getElementById('overlayContainer').classList.add('show');
}

function closeOverlay() {
  document.getElementById('overlayContainer').classList.remove('show');
  setTimeout(() => {
    document.getElementById('overlay').classList.remove('show');
  }, 250);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add_contact_btn').addEventListener('click', async () => {
    await loadFormIntoOverlay('./templates/edit_Contacts.html');
    slideInOverlay();
  });
});