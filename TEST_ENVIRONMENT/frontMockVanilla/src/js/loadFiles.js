

document.addEventListener('DOMContentLoaded', function () {
  function loadContent(file, targetId) {
    fetch(file)
      .then(response => response.text())
      .then(html => {
        document.getElementById(targetId).innerHTML = html;
        addEventListenersNotAuth();
      })
      .catch(error => console.error('Error loading content:', error));
  }
  loadContent('html/userIsNotAuth.html', 'userIsNotAuth');


  function loadContentIsAuth(file, targetId) {
  fetch(file)
    .then(response => response.text())
    .then(html => {
      document.getElementById(targetId).innerHTML = html;
      addEventListenersIsAuth();
    })
    .catch(error => console.error('Error loading content:', error));
  }
  loadContentIsAuth('html/userIsAuth.html', 'userIsAuth');
});
