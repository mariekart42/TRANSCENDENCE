
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
    let chat_name = document.getElementById('new_chat_name').value
    const private_chat = false
    await createChat(chat_name, private_chat)
  })

  document.getElementById('create_private_chat_button').addEventListener('click', async function() {
    let chat_name = document.getElementById('new_private_chat_name').value
    const private_chat = true
    await createChat(chat_name, private_chat)
  })

  document.getElementById('close_button_clicked_user').addEventListener('click', async function() {
    const public_chat_backdrop = document.getElementById('lol')
    public_chat_backdrop.style.opacity = 1;
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


async function createChat(chatName, chatIsPrivate) {
  console.log('CHAT NAME: ', chatName, '  PRIVATE: ', chatIsPrivate)
  if (chatName.trim() === '') {
    if (chatIsPrivate) {
      setErrorWithTimout('info_create_private_chat', 'Username cannot be empty',  5000)
    } else {
      setErrorWithTimout('info_create_chat', 'Chat name cannot be empty',  5000)
    }
    return;
  }

  websocket_obj.chat_is_private = chatIsPrivate
  websocket_obj.new_chat_name = chatName
  await sendDataToBackend('set_new_chat')
  await sendDataToBackend('get_current_users_chats')

  if (chatIsPrivate) {
    await setMessageWithTimout('info_create_private_chat', 'Created chat "' + chatName + '" successfully', 5000)
  } else {
    await setMessageWithTimout('info_create_chat', 'Created chat "' + chatName + '" successfully', 5000)
  }
}

async function createPrivateChat() {

}


async function renderProfile() {
  console.log('rendering profile')
  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'
}

async function handleButtonClickChats(chat_obj) {

  const chatDiv = document.getElementById('messageSide');
  chatDiv.classList.remove('hidden');

  const right_heading_name = document.getElementById('right-heading-name')
  right_heading_name.textContent = chat_obj.chat_name

  let private_profile_button = document.getElementById('profile-in-private-chat-button')
  let private_profile_header = document.getElementById('backdropPrivateProfileLabel')
  let public_profile_button = document.getElementById('profile-in-public-chat-button')
  let public_profile_header = document.getElementById('backdropPublicProfileLabel')
  if (chat_obj.isPrivate) {
    private_profile_button.classList.remove('hidden')
    private_profile_header.textContent = chat_obj.chat_name
    public_profile_button.classList.add('hidden')
  } else {
    public_profile_button.classList.remove('hidden')
    public_profile_header.textContent = chat_obj.chat_name
    private_profile_button.classList.add('hidden')
  }

  websocket_obj.chat_id = chat_obj.chat_id;
  websocket_obj.chat_name = chat_obj.chat_name;
  await sendDataToBackend('get_online_stats')
  await sendDataToBackend('get_user_in_current_chat')
  await sendDataToBackend('get_chat_messages')
}


async function renderChat() {
  const chats_container = document.getElementById('chatsLeftSide')
  chats_container.innerHTML = ''

  let myArray = websocket_obj.chat_data
  myArray.forEach(chat => {
    const chat_element = document.createElement('div');
    chat_element.classList.add('row', 'sideBar-body');

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
    if (chat.isPrivate) {
      chatName.textContent = chat.chat_name + ' [PRIVATE]';
    } else {
      chatName.textContent = chat.chat_name + ' [PUBLIC]';
    }

    chat_element.addEventListener('click', async function () {
      await handleButtonClickChats(chat);
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
