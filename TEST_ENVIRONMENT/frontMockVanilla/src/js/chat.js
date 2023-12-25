
function chatDom() {
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

  document.getElementById('create_chat_button').addEventListener('click', async function() {
    await createChat()
  })
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


async function inviteUser(invited_user_name){
  websocket_obj.invited_user_name = invited_user_name
  await sendDataToBackend('set_invited_user_to_chat')
  await sendDataToBackend('get_current_users_chats')


  // const url = `http://127.0.0.1:6969/user/inviteUserToChat/${websocket_obj.user_id}/${websocket_obj.chat_id}/${invited_user_name}/`
  // fetch(url)
  //   .then(response => {
  //     if (!response.ok) {
  //       if (response.status === 404) {
  //         throw new Error('This User does not exists');
  //       } else {
  //         throw new Error('Could not get Users Chats Data');
  //       }
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     renderProfile()
  //     setMessageWithTimout('message_with_timeout', 'Invite send!', 5000)
  //   })
  //   .catch(error => {
  //     setErrorWithTimout('message_with_timeout', error, 5000)
  //     console.error('Error during getUserChats:', error);
  //   });
}


async function leaveChat() {
  await sendDataToBackend('set_user_left_chat')
  await sendDataToBackend('get_current_users_chats')
}


async function createChat() {
  const chat_name = document.getElementById('new_chat_name').value
  if (!chat_name.trim()) {
    setErrorWithTimout('info_create_chat', 'Chat name cannot be empty',  5000)
    return;
  }
  await sendDataToBackend('set_new_chat')
  await sendDataToBackend('get_current_users_chats')
  setMessageWithTimout('info_create_chat', 'Created chat "'+chat_name+'" successfully', 5000)
}


async function renderProfile() {
  console.log('rendering profile')
  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'
}

async function handleButtonClickChats(chatId, chatName) {
  const chatDiv = document.getElementById('messageSide');
  chatDiv.classList.remove('hidden');

  const right_heading_name = document.getElementById('right-heading-name')
  right_heading_name.textContent = chatName

  const profile_button = document.getElementById('profile-in-chat-button')
  profile_button.classList.remove('hidden')

  const profile_button_header = document.getElementById('staticBackdropLabel')
  profile_button_header.textContent = chatName

  websocket_obj.chat_id = chatId;
  websocket_obj.chat_name = chatName;
  await sendDataToBackend('get_online_stats')
  await sendDataToBackend('get_user_in_current_chat')
  await sendDataToBackend('get_chat_messages')
}


async function renderChat() {
  console.log('render new chat, chats: ', websocket_obj.chat_data)
  // render user list on the left side
  const chats_container = document.getElementById('chatsLeftSide')
  chats_container.innerHTML = ''

  let myArray = websocket_obj.chat_data
  console.log('MY ARRAY: ', myArray)
  myArray.forEach(chat => {
    const chat_element = document.createElement('div');
    chat_element.classList.add('row', 'sideBar-body');

    // console.log('CHAT: ', chat)

    const avatarCol = document.createElement('div');
    avatarCol.classList.add('col-sm-3', 'col-xs-3', 'sideBar-avatar');

    const avatarIcon = document.createElement('div');
    avatarIcon.classList.add('avatar-icon');

    const avatarImg = document.createElement('img');
    avatarImg.src = "https://files.cults3d.com/uploaders/24252348/illustration-file/8a3219aa-d7d4-4194-bede-ccc90a6f2103/B8QC6DAZ9PWRK7M2.jpg";

    avatarIcon.appendChild(avatarImg);
    avatarCol.appendChild(avatarIcon);

    const mainCol = document.createElement('div');
    mainCol.classList.add('col-sm-9', 'col-xs-9', 'sideBar-main');

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    const nameCol = document.createElement('div');
    nameCol.classList.add('col-sm-8', 'col-xs-8', 'sideBar-name');

    let chatName = document.createElement('div');
    chatName.textContent = chat.chat_name;

    chat_element.addEventListener('click', async function () {
      await handleButtonClickChats(chat.chat_id, chat.chat_name);
    });

    nameCol.appendChild(chatName);

    const timeCol = document.createElement('div');
    timeCol.classList.add('col-sm-4', 'col-xs-4', 'pull-right', 'sideBar-time');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time-meta', 'pull-right');
    timeSpan.textContent = '69:69'; // HERE extract actual timestamp from last message

    timeCol.appendChild(timeSpan);

    rowDiv.appendChild(nameCol);
    rowDiv.appendChild(timeCol);
    mainCol.appendChild(rowDiv);
    chat_element.appendChild(avatarCol);
    chat_element.appendChild(mainCol);
    chats_container.appendChild(chat_element);
  });
}
