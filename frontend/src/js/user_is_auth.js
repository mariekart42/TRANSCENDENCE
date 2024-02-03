
// BUTTON TO SEND MESSAGE IN CHAT
function addEventListenersIsAuth() {

  function loadContentGame(file, targetId) {
    fetch(file)
        .then(response => response.text())
        .then(html => {
          document.getElementById(targetId).innerHTML = html;
          gameDom();
        })
        .catch(error => console.error('Error loading content:', error));
  }

  loadContentGame('html/game.html', 'gameSite');


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


  document.getElementById('homeButton').addEventListener('click', function () {
    showSiteHideOthers('homeSite')
  })

  document.getElementById('showChatButton').addEventListener('click', async function () {
    await sendDataToBackend('get_current_users_chats')
    await sendDataToBackend('get_blocked_by_user')
    await sendDataToBackend('get_blocked_user') // NEW since 02.02
    showSiteHideOthers('chat')
  })

  document.getElementById('gameButton').addEventListener('click', async function () {
    showSiteHideOthers('gameSite')
  })

  document.getElementById('nothingButton').addEventListener('click', async function () {
    showSiteHideOthers('nothingSite')
  })

  document.getElementById('profileButton').addEventListener('click', function () {
    const userModal = new bootstrap.Modal(document.getElementById('userProfileModal2'));
    const label = document.getElementById('userModalLabel2');
    label.innerHTML = `<h5>${websocket_obj.username}</h5>`;
    const modalBody = document.getElementById('userProfileModalBody2');

    modalBody.innerHTML = `
    <div id="previewContainer">
      <img id="previewImage" alt="Profile Preview">
      <div id="onHoverText">CHANGE PROFILEPICTURE</div>
    </div>
    <form id="profileForm">
      <span id="selectedFileName"></span>
      <input type="file" id="profilePictureInput" accept="image/*" style="display: none;" onchange="submitForm()">
    </form>  
    <p>Name: ${websocket_obj.username}</p><p>ID: ${websocket_obj.user_id}</p>
  `;
    document.getElementById('previewImage').src = websocket_obj.avatar;
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.style.display = 'block';
    previewContainer.addEventListener('click', function () {
      const profilePictureInput = document.getElementById('profilePictureInput');
      profilePictureInput.click();
    });
    userModal.show();
  })

}
function showSiteHideOthers(site_to_show) {
  const sites = ['gameSite', 'nothingSite', 'homeSite', 'chat'];

  sites.forEach(site => {
    if (site === site_to_show) showDiv(site)
    else hideDiv(site)
  });
}

function submitForm() {
  const img = document.getElementById('profilePictureInput')
    if (img.files && img.files[0]) {
        const file = img.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            websocket_obj.avatar = imageData
            displayImagePreview(imageData);
        };
      displayImagePreview(websocket_obj.avatar)
      reader.readAsDataURL(file);
    }
}

function displayImagePreview(imageData) {
  document.getElementById('previewImage').src = imageData;
  document.getElementById('previewContainer').style.display = 'block';
}

function setErrorWithTimout(element_id, error_message, timout) {
  const obj = document.getElementById(element_id)
  obj.textContent = error_message;
  obj.style.display = 'block';
  obj.style.color = 'red'
  setTimeout(function() {
    obj.style.display = 'none';
  }, timout);
}

async function setMessageWithTimout(element_id, message, timout) {
  const obj = document.getElementById(element_id)
  obj.textContent = message;
  obj.style.display = 'block';
  obj.style.color = 'green'
  setTimeout(async function() {
    obj.style.display = 'none';
  }, timout);
}

function hideDiv(element_id) {
  document.getElementById(element_id).classList.add('hidden')
}

function showDiv(element_id) {
  document.getElementById(element_id).classList.remove('hidden')
}
