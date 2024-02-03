
function chatDom() {
  document.getElementById('sendMessageButton').addEventListener('click', async function () {
    const isBlocked = websocket_obj.blocked_by && websocket_obj.blocked_by.includes(websocket_obj.chat_name);
    if (isBlocked) {
      $('#userBlockedYouWarning').modal('show');
      return
    }
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
    await createPublicChat()
  })

  document.getElementById('create_private_chat_button').addEventListener('click', async function() {
    await createPrivateChat()
  })

  document.getElementById('close_button_clicked_user').addEventListener('click', async function() {
    const public_chat_backdrop = document.getElementById('publicChatModal')
    public_chat_backdrop.style.opacity = 1;
  })

  document.getElementById('goToChatButton').addEventListener('click', async function(){
    const clicked_user = document.getElementById('backdropClickedUserLabel')
    let chatNameToFind = clicked_user.textContent;
    let foundChat = websocket_obj.chat_data.find(chat=> chat.chat_name === chatNameToFind);
    if (foundChat) {
      await handleClickedOnChatElement(foundChat);
      document.getElementById('publicChatModal').style.opacity = 1
      $('#staticBackdropProfile').modal('hide');
      $('#backdropClickedUser').modal('hide');
    } else {
      await sendDataToBackend('set_new_private_chat')
      await sendDataToBackend('get_current_users_chats')
      await showChat(chatNameToFind)
    }
  })

  document.getElementById('blockUserButton').addEventListener('click', async function() {
    await sendDataToBackend('block_user')
    $('#backdropPrivateProfile').modal('hide');
  })

  document.getElementById('unblockUserButton').addEventListener('click',  async function () {
    await sendDataToBackend('unblock_user')
    $('#backdropPrivateProfile').modal('hide');
  })

  document.getElementById('profile-in-private-chat-button').addEventListener('click',  async function () {
    if (websocket_obj.blocked_user && websocket_obj.blocked_user.includes(websocket_obj.chat_name)) {
      showDiv('unblockUserButton')
      hideDiv('blockUserButton')
    } else {
      showDiv('blockUserButton')
      hideDiv('unblockUserButton')
    }
    $('#backdropPrivateProfile').modal('show');
  })

  document.getElementById('challengeUserToGame').addEventListener('click', async function() {
    
    console.log('In inviting through chat')
    // const username = websocket_obj.username;
    sendDataToBackend('get_user_in_current_chat')
    console.log('get_user_in_current_chat ', websocket_obj.userInCurrentChat)

    function findOtherUserName(users, username) {
      for (let i = 0; i < users.length; i++) {
          if (users[i].user_name !== username) {
              return users[i].user_name;
          }
      }
      return null; // Return null if the username is not found
  }
    const invited_username = findOtherUserName(websocket_obj.userInCurrentChat, websocket_obj.username);
    console.log('invited_username ', invited_username)
    // const invited_username = 'test'
    websocket_obj.invited_id = invited_username
    
    try {
      const response = await fetch(`http://127.0.0.1:6969/user/game/create/${websocket_obj.username}/${websocket_obj.invited_id}`);
      const data = await response.json();
  
  
  
      console.log('DATA ', data);
      // websocket_obj.active_game = data.id;
  
      if (response.ok) {
      displayError(null);
      websocket_obj.active_game = data.id;
      // console.log(data.id); // Check the console for the result
  
      // Perform actions on successful login, e.g., set isLoggedIn and userData
          console.log(data);
      } else {
      displayError(data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      displayError('Error fetching user data');
    }
  })



  document.getElementById('challengeUserToGame').addEventListener('click', async function() {
    
    console.log('In inviting through chat')
    // const username = websocket_obj.username;
    sendDataToBackend('get_user_in_current_chat')
    console.log('get_user_in_current_chat ', websocket_obj.userInCurrentChat)

    function findOtherUserName(users, username) {
      for (let i = 0; i < users.length; i++) {
          if (users[i].user_name !== username) {
              return users[i].user_name;
          }
      }
      return null; // Return null if the username is not found
  }
    const invited_username = findOtherUserName(websocket_obj.userInCurrentChat, websocket_obj.username);
    console.log('invited_username ', invited_username)
    // const invited_username = 'test'
    websocket_obj.invited_id = invited_username
    
    try {
      const response = await fetch(`http://127.0.0.1:6969/user/game/create/${websocket_obj.username}/${websocket_obj.invited_id}`);
      const data = await response.json();
  
  
  
      console.log('DATA ', data);
      // websocket_obj.active_game = data.id;
  
      if (response.ok) {
      displayError(null);
      websocket_obj.active_game = data.id;
      // console.log(data.id); // Check the console for the result
  
      // Perform actions on successful login, e.g., set isLoggedIn and userData
          console.log(data);
      } else {
      displayError(data.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      displayError('Error fetching user data');
    }
  

  //   try {
  

  //     const response = await fetch(`http://127.0.0.1:6969/user/game/render/invites/${username}/`);
  //     const htmlContent = await response.text();
  
  //     const container = document.getElementById('game-session-container');
  //     container.innerHTML = htmlContent;
  
  // } catch (error) {
  //     console.error('There was a problem with the fetch operation:', error);
  // }
  

    // await sendDataToBackend('new_invite')

    

  })
}


async function showChat(chat_name){
  let foundChat = websocket_obj.chat_data.find(chat => chat.chat_name === chat_name);
  if (foundChat) {
    await handleClickedOnChatElement(foundChat);
    document.getElementById('publicChatModal').style.opacity = 1;
    $('#staticBackdropProfile').modal('hide');
    $('#backdropClickedUser').modal('hide');
  } else {
    alert('unexpected error, should not happen!!!')
  }
}

async function logoutUser() {
  let websocket_obj = null

  showDiv('userIsNotAuth')
  hideDiv('userIsAuth')
}


async function inviteUser(invited_user_name){
  websocket_obj.invited_user_name = invited_user_name
  await sendDataToBackend('set_invited_user_to_chat')
  await sendDataToBackend('get_current_users_chats')
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
  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'
}

async function handleClickedOnChatElement(chat_obj) {
  showDiv('messageSide')
  document.getElementById('right-heading-name').textContent = chat_obj.chat_name
  if (chat_obj.isPrivate) {
    showDiv('profile-in-private-chat-button')
    hideDiv('profile-in-public-chat-button')
    document.getElementById('backdropPrivateProfileLabel').textContent = chat_obj.chat_name
  } else {
    showDiv('profile-in-public-chat-button')
    hideDiv('profile-in-private-chat-button')
    document.getElementById('backdropPublicProfileLabel').textContent = chat_obj.chat_name
  }
  websocket_obj.chat_id = chat_obj.chat_id;
  websocket_obj.chat_name = chat_obj.chat_name;
  await sendDataToBackend('get_online_stats')
  await sendDataToBackend('get_user_in_current_chat')
  await sendDataToBackend('get_chat_messages')
}

async function renderMessages() {
  let myArray = websocket_obj.messages.message_data;
  renderUserInChatList()
  let mainContainer = document.getElementById('messageContainer');
  mainContainer.innerHTML = '';
  if (!myArray) { return }
  let tmpDiv = [];
  for (let i = 0; i < myArray.length; i++) {
    let messageDiv = document.createElement('div');
    let contentDiv = document.createElement('div');
    let titleElement = document.createElement('div');
    let timestampElement = document.createElement('div');
    let textDiv = document.createElement('div');
    textDiv.classList.add('text-break');
    textDiv.textContent = myArray[i].text;
    timestampElement.textContent = myArray[i].timestamp;
    if (websocket_obj.username === myArray[i].sender) {
      titleElement.classList.add('sender-title')
      titleElement.textContent = 'You';
      messageDiv.style.textAlign = 'right';
      contentDiv.classList.add('sender-message-content');
      timestampElement.classList.add('sender-timestamp');
    }
    else {
      titleElement.classList.add('receiver-title')
      contentDiv.classList.add('receiver-message-content');
      timestampElement.classList.add('receiver-timestamp');
      const currentUserId = myArray[i].sender_id
      function hasMatchingUserId(user) {
        return user.user_id === currentUserId;
      }

      if (websocket_obj.onlineStats.some(hasMatchingUserId)) {
        titleElement.textContent = myArray[i].sender + ' 🟢';
      } else {
        titleElement.textContent = myArray[i].sender + ' 🔴';
      }
    }
    contentDiv.appendChild(titleElement);
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timestampElement);
    messageDiv.appendChild(contentDiv);
    tmpDiv.push(messageDiv);
  }
  for (let i = 0; i < myArray.length; i++) {
    mainContainer.appendChild(tmpDiv[i]);
    if (i < tmpDiv.length - 1) {
      mainContainer.appendChild(document.createElement('br'));
    }
  }
  // THIS scrolls to the bottom of messageDiv by default (user sees last messages first)
  mainContainer.scrollTo(0, mainContainer.scrollHeight);
}

function renderUserInChatList() {
  let mainContainer = document.getElementById('userInChatList');
  mainContainer.innerHTML = '';
  let myArray = websocket_obj.userInCurrentChat
  let title = document.createElement('h2');
  title.textContent = 'User in Chat:'
  mainContainer.appendChild(title);
  // own user always first in the list
  const own_user = document.createElement('div');
  own_user.classList.add('row', 'own-user-in-chat-profile');
  own_user.textContent = 'You';
  mainContainer.appendChild(own_user)
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].user_name !== websocket_obj.username) {
      const chat_element = document.createElement('div');
      chat_element.classList.add('row', 'contacts-in-chat-profile');
      chat_element.textContent = myArray[i].user_name;
      chat_element.addEventListener('click', async function () {
        await handleClickedElementInPublicChatModal(myArray[i].user_name);
      });
      mainContainer.appendChild(chat_element)
    }
  }
}

async function handleClickedElementInPublicChatModal(clickedUser) {
  const modal = new bootstrap.Modal(document.getElementById('backdropClickedUser'));
  document.getElementById('publicChatModal').style.opacity = 0.5;
  document.getElementById('backdropClickedUserLabel').textContent = clickedUser
  modal.show();
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
      await handleClickedOnChatElement(chat);
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
