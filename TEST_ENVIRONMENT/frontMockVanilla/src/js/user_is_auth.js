
function addEventListenersIsAuth() {

  document.getElementById('sendMessageButton').addEventListener('click', function () {
    websocket_obj.message = document.getElementById('messageInput').value
    websocket_obj.sender = websocket_obj.username
    console.log('MESSGAE: ', websocket_obj.message)
    console.log('SENDER: ', websocket_obj.sender)

    // message bar empty after user hit send:
    document.getElementById('messageInput').value = ''

    // send inited data to backend:
    sendWebsocketData()
  });
}


function changeButtonText() {
  const button = document.getElementById('showChatButton');
  const chatDiv = document.getElementById('showChat')

  chatDiv.classList.toggle('hidden');
  button.textContent = (button.textContent === 'show Chat') ? 'hide Chat' : 'show Chat';
}



function renderProfile() {
  let sender_title = document.getElementById('senderTitle');
  sender_title.textContent = 'YOU ARE:  ' + websocket_obj.username
  // create list of all chats the user is in
  const url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        alert('Credentials are wrong');
        throw new Error('Credentials are wrong');
      }
      return response.json();
    })
    .then(data => {
      console.log('REGISTER OK RESPONSE:', data);
      websocket_obj.chat_data = data.chat_data
      console.log(websocket_obj.chat_data)

      renderUsersChatList()
    })
    .catch(error => {
      console.error('Error during login:', error);
    });
}


function renderUsersChatList() {
  let array_of_chats = websocket_obj.chat_data
  let userChatsList = document.getElementById('userChatsList');
  userChatsList.innerHTML = '';

  // Iterate over the array using a for loop
  for (let i = 0; i < array_of_chats.length; i++) {
    // Create a paragraph element
    let paragraph = document.createElement('p');

    // Set the text content to the chat name
    // paragraph.textContent = array_of_chats[i].chat_name;
    // console.log('PARA: ', paragraph.textContent)
    console.log('PARA ORI: ', array_of_chats[i])



      // Create a button element
    let button = document.createElement('button');

    // Set the button text
    button.textContent = array_of_chats[i].chat_name;

    // Add a click event listener to the button
    button.addEventListener('click', function () {
      // Modify this function to define the action when the button is clicked
      alert(`Button clicked for chat: ${button.textContent}`);
      const chatDiv = document.getElementById('showChat')

      chatDiv.classList.remove('hidden');
      renderChat()
    });

    // Append the paragraph to the container
    userChatsList.appendChild(paragraph);
    userChatsList.appendChild(button);
  }
}