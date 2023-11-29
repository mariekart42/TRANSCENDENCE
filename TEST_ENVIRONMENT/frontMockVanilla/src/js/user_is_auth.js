
// BUTTON TO SEND MESSAGE IN CHAT
async function addEventListenersIsAuth() {
  document.getElementById('sendMessageButton').addEventListener('click', function () {
    websocket_obj.message = document.getElementById('messageInput').value
    websocket_obj.sender = websocket_obj.username

    document.getElementById('messageInput').value = ''
    sendWsMessageDataRequest()
  });
}


async function renderProfile() {

  let sender_title = document.getElementById('senderTitle');
  sender_title.textContent = 'YOU ARE:  ' + websocket_obj.username

  const url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get Users Chats Data');
      }
      return response.json();
    })
    .then(data => {
      console.log('getUserChats OK RESPONSE:', data);
      websocket_obj.chat_data = data.chat_data

      renderUsersChatList()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });
}


async function renderUsersChatList() {
  let array_of_chats = websocket_obj.chat_data
  let userChatsList = document.getElementById('userChatsList');
  userChatsList.innerHTML = '';

  for (let i = 0; i < array_of_chats.length; i++)
  {
    let paragraph = document.createElement('p');

    let button = document.createElement('button');
    button.textContent = array_of_chats[i].chat_name;

    button.addEventListener('click', function () {
      const chatDiv = document.getElementById('showChat')
      chatDiv.classList.remove('hidden');
      websocket_obj.chat_id = array_of_chats[i].chat_id
      websocket_obj.chat_name = array_of_chats[i].chat_name
      renderChat()
    });

    userChatsList.appendChild(paragraph);
    userChatsList.appendChild(button);
  }
}
