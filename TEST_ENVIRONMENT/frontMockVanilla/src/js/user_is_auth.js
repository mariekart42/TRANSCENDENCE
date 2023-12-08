
// BUTTON TO SEND MESSAGE IN CHAT
function addEventListenersIsAuth() {
  document.getElementById('sendMessageButton').addEventListener('click', async function () {
    websocket_obj.message = document.getElementById('messageInput').value
    websocket_obj.sender = websocket_obj.username

    document.getElementById('messageInput').value = ''
    await sendDataToBackend('send_chat_message')
    await sendDataToBackend('get_online_stats')
    await sendDataToBackend('get_chat_messages')
  });

  document.getElementById('invite_user_button').addEventListener('click', async function () {
    const invited_user_name = document.getElementById('invite_user').value

    document.getElementById('invite_user').value = ''
    await inviteUser(invited_user_name)
  })

  document.getElementById('logoutButton').addEventListener('click', async function () {
    await logoutUser()
  })

  document.getElementById('goBackToProfileButton').addEventListener('click', async function () {
    const chatDiv = document.getElementById('showChat');
    chatDiv.classList.add('hidden');
    const profileDiv = document.getElementById('showUserProfile');
    profileDiv.classList.remove('hidden');
  })

  document.getElementById('create_chat_button').addEventListener('click', async function() {
    await createChat()
  })
}


function setErrorWithTimout(element_id, error_message, timout) {
  const obj = document.getElementById(element_id)
  obj.textContent = error_message;
  obj.style.display = 'block';
  setTimeout(function() {
    obj.remove();
  }, timout);
}


async function logoutUser() {
  let websocket_obj = null
  const notAuth = document.getElementById('userIsNotAuth');
  notAuth.classList.remove('hidden');
  const isAuth = document.getElementById('userIsAuth');
  isAuth.classList.add('hidden');
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.add('hidden');
  const profileDiv = document.getElementById('showUserProfile');
  profileDiv.classList.add('hidden');
}


// rn as HTTP but needs to happen through ws
async function inviteUser(invited_user_name){
  const url = `http://127.0.0.1:6969/user/inviteUserToChat/${websocket_obj.user_id}/${websocket_obj.chat_id}/${invited_user_name}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('This User does not exists');
        } else {
          throw new Error('Could not get Users Chats Data');
        }
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
    })
    .catch(error => {
      setErrorWithTimout('error_message_2', error, 5000)
      console.error('Error during getUserChats:', error);
    });
}


async function leaveChat() {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.add('hidden');
  const profileDiv = document.getElementById('showUserProfile');
  profileDiv.classList.remove('hidden');
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
    setErrorWithTimout('error_message', 'Chat name cannot be empty',  5000)
    return;
  }

  const url = `http://127.0.0.1:6969/user/createPublicChat/${websocket_obj.user_id}/${chat_name}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Chat '+chat_name+' already exists');
        } else {
          throw new Error('Could not create new Chat');
        }
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
    })
    .catch(error => {
      setErrorWithTimout('error_message', error,  5000)
      console.error('Error during creating new Chat:', error);
    });
}


async function renderProfile() {

  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'

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
      renderUsersChatList()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });

  url = `http://127.0.0.1:6969/user/getAllUser/${websocket_obj.user_id}/`
  await fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get all Users');
      }
      return response.json();
    })
    .then(data => {
      websocket_obj.all_user = data.all_user
      renderAllUsersList()
    })
    .catch(error => {
      console.error('Error during getAllUser:', error);
    });
}

async function handleButtonClickChats(chatId, chatName) {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.remove('hidden');
  const showProfile = document.getElementById('showUserProfile');
  showProfile.classList.add('hidden');

  websocket_obj.chat_id = chatId;
  websocket_obj.chat_name = chatName;
  await sendDataToBackend('get_online_stats')
  await sendDataToBackend('get_user_in_current_chat')
  await sendDataToBackend('get_chat_messages')
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
    button.classList.add('btn');
    button.classList.add('btn-outline-success');

    button.addEventListener('click', async function () {
      await handleButtonClickChats(array_of_chats[i].chat_id, array_of_chats[i].chat_name);
    });

    userChatsList.appendChild(paragraph);
    userChatsList.appendChild(button);
  }
}

// DELETE LATER
async function handleButtonClickUser(userId, userName) {
  const userModal = new bootstrap.Modal(document.getElementById('userProfileModal'));

  const label = document.getElementById('userModalLabel');
  label.innerHTML = `<h5>${userName}</h5>`;

  // Populate the modal body with user data
  const modalBody = document.getElementById('userProfileModalBody');
  modalBody.innerHTML = `<p>Name: ${userName}</p><p>ID: ${userId}</p>`;

  // Show the modal
  userModal.show();
}


async function renderAllUsersList() {
  let array_of_users = websocket_obj.all_user
  let userFriendsList = document.getElementById('userFriendsList');
  userFriendsList.innerHTML = '';

  let title = document.createElement('h2');
  title.textContent = 'All User:'
  userFriendsList.appendChild(title);

  if (array_of_users.length === 0) {
    let paragraph = document.createElement('p');
    paragraph.textContent = 'Damn, pretty empty here...'
    userFriendsList.appendChild(paragraph);
  }

  for (let i = 0; i < array_of_users.length; i++)
  {
    let paragraph = document.createElement('p');
    let button = document.createElement('button');
    button.textContent = array_of_users[i].name;
    button.classList.add('btn');
    button.classList.add('btn-outline-success');

    button.addEventListener('click', async function () {
      console.log('LOL: ', array_of_users[i])
      await handleButtonClickUser(array_of_users[i].id, array_of_users[i].name);
    });

    userFriendsList.appendChild(paragraph);
    userFriendsList.appendChild(button);
  }
}