
// BUTTON TO SEND MESSAGE IN CHAT
function addEventListenersIsAuth() {
  document.getElementById('sendMessageButton').addEventListener('click', async function () {
    websocket_obj.message = document.getElementById('messageInput').value
    websocket_obj.sender = websocket_obj.username

    document.getElementById('messageInput').value = ''
    await getMessageData()
    await renderChat();
  });
}

async function leaveChat() {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.add('hidden');
  console.log('USER_ID | CHAT_ID: ', websocket_obj.user_id, websocket_obj.chat_id)
  const url = `http://127.0.0.1:6969/user/leaveChat/${websocket_obj.user_id}/${websocket_obj.chat_id}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get Users Chats Data');
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });
}


async function createChat() {

  const chat_name = document.getElementById('new_chat_name').value
  if (!chat_name.trim()) {
    console.error('CHAT NAME CANT BE EMPTY ')
    return
  }

  const url = `http://127.0.0.1:6969/user/createChat/${websocket_obj.user_id}/${chat_name}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not create new Chat');
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
      // getMessageData()
      // renderChat()
    })
    .catch(error => {
      console.error('Error during creating new Chat:', error);
    });
}


async function renderProfile() {

  const chatDiv = document.getElementById('userChatsList');
  chatDiv.classList.remove('hidden');

  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'

  const url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get Users Chats Data');
      }
      return response.json();
    })
    .then(data => {
      // console.log('GOT USER CHAT LIST: ', data)
      websocket_obj.chat_data = data.chat_data
      console.log('GOT USER CHAT LIST: ', websocket_obj.chat_data)
      renderUsersChatList()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });
}


async function handleButtonClick(chatId, chatName) {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.remove('hidden');

  websocket_obj.chat_id = chatId;
  websocket_obj.chat_name = chatName;

  await getMessageData()
  await renderChat();
}

async function renderUsersChatList() {
  let array_of_chats = websocket_obj.chat_data
  let userChatsList = document.getElementById('userChatsList');
  userChatsList.innerHTML = '';

  let title = document.createElement('h2');
  title.textContent = 'Your Chats:'
  userChatsList.appendChild(title);

  if (array_of_chats.length === 0) {
    let paragraph = document.createElement('p');
    paragraph.textContent = 'Damn, pretty empty here...'
    userChatsList.appendChild(paragraph);
  }

  for (let i = 0; i < array_of_chats.length; i++)
  {
    let paragraph = document.createElement('p');
    let button = document.createElement('button');
    button.textContent = array_of_chats[i].chat_name;

    button.addEventListener('click', async function () {
      await handleButtonClick(array_of_chats[i].chat_id, array_of_chats[i].chat_name);
    });

    userChatsList.appendChild(paragraph);
    userChatsList.appendChild(button);
  }
}
