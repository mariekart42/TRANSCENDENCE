
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

  document.getElementById('create_public_chat_button').addEventListener('click', async function() {
    // let chat_name = document.getElementById('new_chat_name').value
    // const private_chat = false
    // await createChat(chat_name, private_chat)
    await createPublicChat()
  })

  document.getElementById('create_private_chat_button').addEventListener('click', async function() {
    // let chat_name = document.getElementById('new_private_chat_name').value
    // const private_chat = true
    // await createChat(chat_name, private_chat)
    // const chat_name = document.getElementById('')
    await createPrivateChat()
  })

  document.getElementById('close_button_clicked_user').addEventListener('click', async function() {
    const public_chat_backdrop = document.getElementById('lol')
    public_chat_backdrop.style.opacity = 1;
  })

  // testing this button:
  document.getElementById('goToChatButton').addEventListener('click', async function(){

    const clicked_user = document.getElementById('backdropClickedUserLabel')

    let chatNameToFind = clicked_user.textContent;
    let foundChat = websocket_obj.chat_data.find(chat => chat.chat_name === chatNameToFind);

    if (foundChat) {
      console.log(foundChat);
      await handleButtonClickChats(foundChat);
      const public_chat_backdrop = document.getElementById('lol')
      public_chat_backdrop.style.opacity = 1;
      $('#staticBackdropProfile').modal('hide');
      $('#backdropClickedUser').modal('hide');
    } else {
      console.log('No matching chat, create one')
      console.log(chatNameToFind);
      // TODO create new chat here
      document.getElementById('new_private_chat_name').value = chatNameToFind
      console.log('BEFORE chat name: ', document.getElementById('new_private_chat_name').value)
      await sendDataToBackend('set_new_private_chat')
      await sendDataToBackend('get_current_users_chats')
      await showChat(chatNameToFind)

      // foundChat = websocket_obj.chat_data.find(chat => chat.chat_name === chatNameToFind);
      // if (foundChat) {
      //   await handleButtonClickChats(foundChat);
      //   const public_chat_backdrop = document.getElementById('lol')
      //   public_chat_backdrop.style.opacity = 1;
      //   $('#staticBackdropProfile').modal('hide');
      //   $('#backdropClickedUser').modal('hide');
      // } else {
      //   console.log('unexpected error, should not happen!!!')
      // }
    }
  })

  document.getElementById('blockUserButton').addEventListener('click', async function() {
    console.log('here block logic')
  })
}

async function showChat(chat_name){
  let foundChat = websocket_obj.chat_data.find(chat => chat.chat_name === chat_name);
  if (foundChat) {
    await handleButtonClickChats(foundChat);
    const public_chat_backdrop = document.getElementById('lol')
    public_chat_backdrop.style.opacity = 1;
    $('#staticBackdropProfile').modal('hide');
    $('#backdropClickedUser').modal('hide');
  } else {
    console.log('unexpected error, should not happen!!!')
  }
}


async function logoutUser() {
  let websocket_obj = null
  const notAuth = document.getElementById('userIsNotAuth');
  notAuth.classList.remove('hidden');
  const isAuth = document.getElementById('userIsAuth');
  isAuth.classList.add('hidden');
  // const chatDiv = document.getElementById('showChat');
  // chatDiv.classList.add('hidden');
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


async function createPublicChat() {
  let chat_name = document.getElementById('new_chat_name').value

  if (chat_name.trim() === '') {
    setErrorWithTimout('info_create_chat', 'Chat name cannot be empty',  5000)
    return;
  }

  await sendDataToBackend('set_new_chat')
  // await sendDataToBackend('get_current_users_chats')
  let chatNameLabel = document.getElementById('new_chat_name');
  chatNameLabel.value = '';
  chatNameLabel.textContent = '';
}

async function createPrivateChat() {
  let chat_name = document.getElementById('new_private_chat_name').value
  if (chat_name.trim() === '') {
      setErrorWithTimout('info_create_private_chat', 'Username cannot be empty',  5000)
    return;
  }
  await sendDataToBackend('set_new_private_chat')
  await sendDataToBackend('get_current_users_chats')
  let chatNameLabel = document.getElementById('new_private_chat_name');
  chatNameLabel.value = '';
  chatNameLabel.textContent = '';
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

  let myArray = sortChats(websocket_obj.chat_data)
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
    timeSpan.textContent = getTimestamp(chat)

    timeCol.appendChild(timeSpan);
    rowDiv.appendChild(nameCol);
    rowDiv.appendChild(timeCol);
    mainCol.appendChild(rowDiv);
    chat_element.appendChild(avatarCol);
    chat_element.appendChild(mainCol);
    chats_container.appendChild(chat_element);
  });
}

function getTimestamp(chat) {
  const dateString = chat.last_message["time"]
  if (dateString === '0') { return '' }
  let dateParts = dateString.split(' ');
  const timePart = dateParts[0];
  const datePart = dateParts[1];
  const currentDate = new Date();
  dateParts = datePart.split('.');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);
  const date = new Date(year, month - 1, day);
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isYesterday) {
    return 'yesterday'
  } else if (date < yesterday) {
    return datePart
  } else {
    return timePart
  }
}

function sortChats(chats){
  chats.sort(compareChats);
  return chats
}

function compareChats(chat1, chat2) {
  var time1 = parseTimeString(chat1.last_message["time"]);
  var time2 = parseTimeString(chat2.last_message["time"]);

  // Handle the case where one of the timestamps is '0'
  if (time1 === '0') { return 1 }
  if (time2 === '0') { return -1 }

  if (time1.getFullYear() !== time2.getFullYear()) {
    return time2.getFullYear() - time1.getFullYear();
  }
  if (time1.getMonth() !== time2.getMonth()) {
    return time2.getMonth() - time1.getMonth();
  }
  if (time1.getDate() !== time2.getDate()) {
    return time2.getDate() - time1.getDate();
  }
  return time2.getHours() * 60 + time2.getMinutes() - (time1.getHours() * 60 + time1.getMinutes());
}

function parseTimeString(timeString) {
  if (timeString === '0') {
    return new Date(0); // Set to the epoch for '0' timestamp
  }
  var [hours, minutes, day, month, year] = timeString.match(/\d+/g);
  return new Date(year, month - 1, day, hours, minutes);
}