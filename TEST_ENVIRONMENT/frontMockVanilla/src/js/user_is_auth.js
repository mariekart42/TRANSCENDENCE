
// BUTTON TO SEND MESSAGE IN CHAT
function addEventListenersIsAuth() {

  function loadContentChat(file, targetId) {
    fetch(file)
      .then(response => response.text())
      .then(html => {
        document.getElementById(targetId).innerHTML = html;
        chatDom();
      })
      .catch(error => console.error('Error loading content:', error));
  }
  loadContentChat('html/chat.html', 'chat');

  document.getElementById('showChatButton').addEventListener('click', function () {
    const chat = document.getElementById('chat')
    chat.classList.remove('hidden')
    const nothing = document.getElementById('nothingSite')
    nothing.classList.add('hidden')
    const home = document.getElementById('homeSite')
    home.classList.add('hidden')
  })
  document.getElementById('nothingButton').addEventListener('click', async function () {
    const chat = document.getElementById('chat')
    chat.classList.add('hidden')
    const nothingSite = document.getElementById('nothingSite')
    nothingSite.classList.remove('hidden')
    const home = document.getElementById('homeSite')
    home.classList.add('hidden')
    let url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
    await fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not get Users Chats Data');
        }
        return response.json();
      })
      .then(data => {
        websocket_obj.chat_data = data.chat_data
        // renderUsersChatList()
        renderChat()
      })
      .catch(error => {
        console.error('Error during getUserChats:', error);
      });
  })
  document.getElementById('profileButton').addEventListener('click', function () {

    const userModal = new bootstrap.Modal(document.getElementById('userProfileModal2'));

    const label = document.getElementById('userModalLabel2');
    label.innerHTML = `<h5>${websocket_obj.username}</h5>`;

    // Populate the modal body with user data
    const modalBody = document.getElementById('userProfileModalBody2');
    modalBody.innerHTML = `<p>Name: ${websocket_obj.username}</p><p>ID: ${websocket_obj.user_id}</p>`;

    // Show the modal
    userModal.show();


  })
  document.getElementById('home').addEventListener('click', function () {
    const chat = document.getElementById('chat')
    chat.classList.add('hidden')
    const nothingSite = document.getElementById('nothingSite')
    nothingSite.classList.add('hidden')
    // also game etc. later
  })

}


function setErrorWithTimout(element_id, error_message, timout) {
  const obj = document.getElementById(element_id)
  obj.textContent = error_message;
  obj.style.display = 'block';
  obj.style.color = 'red'
  setTimeout(function() {
    obj.remove();
  }, timout);
}

function setMessageWithTimout(element_id, message, timout) {
  const obj = document.getElementById(element_id)
  obj.textContent = message;
  obj.style.display = 'block';
  obj.style.color = 'green'
  setTimeout(function() {
    obj.remove();
  }, timout);
}
