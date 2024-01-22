
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

  document.getElementById('showChatButton').addEventListener('click', async function () {
    const chat = document.getElementById('chat')
    chat.classList.remove('hidden')
    const nothingSite = document.getElementById('nothingSite')
    nothingSite.classList.add('hidden')
    const home = document.getElementById('homeSite')
    home.classList.add('hidden')

    await sendDataToBackend('get_current_users_chats') // NEW since 22.01
    // let url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
    // await fetch(url)
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Could not get Users Chats Data');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     websocket_obj.chat_data = data.chat_data
    //     console.log('HTTP CHAT DATA: ', websocket_obj.chat_data)
    //     renderChat()
    //   })
    //   .catch(error => {
    //     console.error('Error during getUserChats:', error);
    //   });
  })


  document.getElementById('nothingButton').addEventListener('click', async function () {
    const chat = document.getElementById('chat')
    chat.classList.add('hidden')
    const nothingSite = document.getElementById('nothingSite')
    nothingSite.classList.remove('hidden')
    const home = document.getElementById('homeSite')
    home.classList.add('hidden')
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

    const previewImage = document.getElementById('previewImage');
    const previewContainer = document.getElementById('previewContainer');
    previewImage.src = websocket_obj.avatar
    previewContainer.style.display = 'block';

    previewContainer.addEventListener('click', function () {
      const profilePictureInput = document.getElementById('profilePictureInput');
      profilePictureInput.click();
    });

    userModal.show();
  })

  document.getElementById('homeButton').addEventListener('click', function () {
    const chat = document.getElementById('chat')
    chat.classList.add('hidden')
    const nothingSite = document.getElementById('nothingSite')
    nothingSite.classList.add('hidden')
      const home = document.getElementById('homeSite')
    home.classList.remove('hidden')
    // also game etc. later
  })



  // TEST GO BACK AND FORWARD - DELETE LATER
  document.getElementById('goBack').addEventListener('click', function (event){
    console.log('event: ', event)
    console.log('state: ', event.state)

    // history.back()
  })
  document.getElementById('goForward').addEventListener('click', function (){
    // New state object representing the state of the 'about' page
  var newStateData = { page: 'about', timestamp: Date.now() };

  // New title for the document (can be an empty string or null)
  var newPageTitle = 'About Page';

  // New URL to be displayed in the address bar
  var newUrl = '/about';

  // Replace the current entry in the session history with the new state
  history.replaceState(newStateData, newPageTitle, newUrl);
    })
  //   window.addEventListener('popstate', function(event) {
  //   var state = event.state;
  //
  //   // Use 'state' to determine the current state and update your UI accordingly
  //   // You can retrieve the state data that you pushed when using pushState
  //   console.log('Pop State:', state);
  // });

}

function submitForm() {
    // Add logic to handle form submission, for example, sending data to the server via AJAX.
    // After handling the submission, you might want to close the modal.
    // userModal.hide();
  const img = document.getElementById('profilePictureInput')
  // websocket_obj.avatar = img.files[0]

      // Check if a file is selected
    if (img.files && img.files[0]) {
        // Get the selected file
        const file = img.files[0];

        // Create a FileReader to read the file
        const reader = new FileReader();

        // Set up the FileReader to handle the file load event
        reader.onload = function (e) {
            // Get the result (base64-encoded data or data URL)
            const imageData = e.target.result;
            websocket_obj.avatar = imageData
            // Display the image preview
            displayImagePreview(imageData);
        };
        // Read the file as a data URL
      displayImagePreview(websocket_obj.avatar)
        reader.readAsDataURL(file);
    }
}
function displayImagePreview(imageData) {
  // Get the preview elements
  const previewImage = document.getElementById('previewImage');
  const previewContainer = document.getElementById('previewContainer');

  // Set the src attribute of the preview image
  previewImage.src = imageData;

  // Show the preview container
  previewContainer.style.display = 'block';
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
