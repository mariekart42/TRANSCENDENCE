websocket_obj = {

  active_game: null,

  username: null,
  password: null,
  avatar: 'https://files.cults3d.com/uploaders/24252348/illustration-file/8a3219aa-d7d4-4194-bede-ccc90a6f2103/B8QC6DAZ9PWRK7M2.jpg',
  age: null,

  chat_name: null,
  chat_id: null,
  chat_is_private: null,
  new_chat_name: null,

  onlineStats: [
    {
      user_id: null,
      stat: null,
    }
  ],

  all_user: [
    {
      user_id: null,
      user_name: null,
    }
  ],

  chat_data: [
    {
      chat_id: null,
      chat_name: null,
      private_chat_names: [],
      isPrivate: null,
      last_message: null,
    }
  ],
  messages: [
    {
      id: 0,
      sender_id: null,
      sender: null,
      text: null,
      timestamp: 0,
    }
  ],

  game: [
    {
      game_id: null,
      invited_id: null,

      key_code: 0,
      left_pedal: 0,
      right_pedal: 0,
      is_host: false,
      ball_x: 0,
      ball_y: 0,
      host_score: 0,
      guest_score: 0

    }
  ],
  userInCurrentChat: [
    {
      user_name: null,
      user_id: null
    }
  ],

  invited_user_name: null,
  message: null,
  sender: null,
  websocket: null,
}

async function establishWebsocketConnection() {

  websocket_obj.websocket = new WebSocket(`ws://localhost:6969/ws/test/${websocket_obj.user_id}/`);

  websocket_obj.websocket.onopen = function (event) {
    console.log("WebSocket onopen");
    renderProfile()
  };

  websocket_obj.websocket.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    console.log('ONMESSAGE DATA: ', data)
    switch (data.type) {
      case 'all_chat_messages':
         if (data.chat_id === websocket_obj.chat_id) {
          await renderProfile()
          websocket_obj.messages = data
          await renderMessages()
        }
        break
      case 'online_stats':
        websocket_obj.onlineStats = data.online_stats
          await renderMessages()
        break
      case 'user_left_chat_info':
        console.log('user removed from chat info: ', data.message)
        break
      case 'online_stats_on_disconnect':
        websocket_obj.onlineStats = data.online_stats
        await renderMessages()
        break
      case 'user_in_current_chat':
        websocket_obj.userInCurrentChat = data.user_in_chat
        break
      case 'current_users_chats':
        if (data.user_id === websocket_obj.user_id) {
          websocket_obj.chat_data = data.users_chats
          await renderChat()
        }
        break
      case 'created_chat':
        if (data.message === 'ok') {
          websocket_obj.chat_id = data.chat_id
          await sendDataToBackend('get_current_users_chats')
          await setMessageWithTimout('info_create_chat', 'Created chat successfully', 5000)
        } else {
          await setErrorWithTimout('info_create_chat', 'Error: ' + data.message, 5000)
        }
        break
      case 'created_private_chat':
          if (data.message === 'ok') {
            await setMessageWithTimout('info_create_private_chat', 'Created chat successfully', 5000)
          } else {
            await setErrorWithTimout('info_create_private_chat', 'Error: ' + data.message, 5000)
          }
        break
      case 'invited_user_to_chat':
        if (data.message !== 'ok') {
          await setErrorWithTimout('message_with_timeout', data.message, 5000)
        } else {
          await renderChat()
          await setMessageWithTimout('message_with_timeout', 'Invite send successfully', 5000)
        }
        break
      case 'render_left':
        // var canvas = document.getElementById("pongCanvas");
        // websocket_obj.game.left_pedal = canvas.height * data.new_pedal_pos / 2
        websocket_obj.game.left_pedal = data.new_pedal_pos
        console.log("new left_pedal: ", websocket_obj.game.left_pedal);
        await update();
        // await renderGame()
        break
      case 'render_right':
        // var canvas = document.getElementById("pongCanvas");
        websocket_obj.game.right_pedal = data.new_pedal_pos
        // websocket_obj.game.right_pedal = data.new_pedal_pos
        console.log("new right_pedal: ", websocket_obj.game.right_pedal);
        await update();
        // await renderGame()
        break
      case 'init_game':
        console.log(data);
        document.getElementById("waitingScreen").style.display = "block";
        if (data.is_host === 'True')
        {
          websocket_obj.game.is_host = true
          console.log("game.is_host = true");
          console.log(websocket_obj.game.is_host);
        }
        else
          websocket_obj.game.is_host = false
        break
      case 'game_start':
        console.log("GAME START");
        document.getElementById("waitingScreen").style.display = "none";
        launchGame();
        break
      case 'ball_update':
        console.log("BALL_UPDATE");
        // websocket_obj.game.ball_x = data.ball_x
        const canvas = document.getElementById("pongCanvas");
        websocket_obj.game.ball_x = data.ball_x * canvas.width / 4;
        console.log("ball_x: ", websocket_obj.game.ball_x)
        console.log("data.ball_x: ", data.ball_x)
        console.log("data.ball_y: ", data.ball_y)
        // // websocket_obj.game.ball_y = data.ball_y
        websocket_obj.game.ball_y = data.ball_y * canvas.height / 2;
        console.log("ball_y: ", websocket_obj.game.ball_y);
        await update();
        break
      case 'score_update':
        console.log("SCORE_UPDATE");
        websocket_obj.game.host_score = data.host_score
        websocket_obj.game.guest_score = data.guest_score
        console.log("host_score: ", websocket_obj.game.host_score);
        console.log("guest_score: ", websocket_obj.game.guest_score);
        await updateScore();
        break
      case 'game_over':
        console.log("GAME_OVER");
        // document.getElementById("waitingScreen").style.display = "block";
        websocket_obj.game.host_score = 0
        websocket_obj.game.guest_score = 0
        websocket_obj.game.game_id = 0
        // await updateScore();
        await updateScore();
        break
      case 'opponent_disconnected':
        console.log("YOUR APPONENT LEFT THE GAME");
        websocket_obj.game.host_score = 0
        websocket_obj.game.guest_score = 0
        websocket_obj.game.game_id = 0
        await updateScore();
        break  
      default:
        console.log('SOMETHING ELSE [something wrong in onmessage type]')
    }
  };

  websocket_obj.websocket.onerror = function (error) {
    console.error("WebSocket error:", error);
    logoutUser()
  };

  websocket_obj.websocket.onclose = function (event) {
    console.log("WebSocket closed:", event);
    logoutUser()
  };
}

const sendError = async (error) => {
  console.error('Error: Failed to receive ws data: ', error)
}

async function sendDataToBackend(request_type) {
  return new Promise((resolve, reject) => {
    if (websocket_obj.websocket.readyState === WebSocket.OPEN) {
      let type = 'none'
      let data = 'none'

      switch (request_type) {
        case 'send_chat_message':
          type = 'save_message_in_db'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
            'sender': websocket_obj.sender,
            'message': websocket_obj.message,
          }
          break
        case 'get_chat_messages':
          type = 'send_chat_messages'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          }
          break
        case 'get_online_stats':
          type = 'send_online_stats'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          }
          break
        case 'get_user_in_current_chat':
          type = 'send_user_in_current_chat'
          data = {
            'user_id': websocket_obj.user_id,// new
            'chat_id': websocket_obj.chat_id,
          }
          break
        case 'get_current_users_chats':
          console.log('CHAT_ID: ', websocket_obj.chat_id)
          type = 'send_current_users_chats'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          }
          break
        case 'set_user_left_chat':
          type = 'send_user_left_chat'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          }
          break
        case 'set_new_chat':
          type = 'send_created_new_chat'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
            'chat_name': document.getElementById('new_chat_name').value,
            'isPrivate': false,
            // 'isPrivate': websocket_obj.chat_is_private
          }
          break
        case 'set_new_private_chat':
          type = 'send_created_new_private_chat'
            data = {
              'user_id': websocket_obj.user_id,
              'chat_id': websocket_obj.chat_id,
              'chat_name': document.getElementById('new_private_chat_name').value,
            }
          break
        case 'set_invited_user_to_chat':
          type = 'set_invited_user_to_chat'
          data = {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
            'invited_user_name': websocket_obj.invited_user_name
          }
          break
        case 'game_new_move':
          // const canvas = document.getElementById("pongCanvas");
          console.log("in game_new_move");
          console.log(websocket_obj.game.is_host);
          // prev_pos =  websocket_obj.game.left_pedal;
          if (websocket_obj.game.is_host === true)
            pedal_pos = websocket_obj.game.left_pedal
          else
            pedal_pos = websocket_obj.game.right_pedal
          // console.log(prev_pos);

          // pedal_pos = pedal_pos * 2 / canvas.height;
          console.log("pedal_pos: ", pedal_pos);
          type = 'send_game_scene'
          data = {
            'user_id': websocket_obj.user_id,
            // 'chat_id': websocket_obj.chat_id,
            'game_id': websocket_obj.game.game_id,
            'key_code': websocket_obj.game.key_code,
            'prev_pos': pedal_pos,
            // 'is_host': websocket_obj.game.is_host,
          }
          break
        case 'init_game':
          console.log("in init_game");
          type = 'send_init_game'
          data = {
            'user_id': websocket_obj.user_id,
            // 'chat_id': websocket_obj.chat_id,
            'game_id': websocket_obj.game.game_id,
          }
          break
        case 'send_ball_update':
          type = 'send_ball_update'
          data = {
            'user_id': websocket_obj.user_id,
            // 'chat_id': websocket_obj.chat_id,
            'game_id': websocket_obj.game.game_id,
          }
          break

        case 'send_new_invite':
          type = 'send_new_invite'
          data = {
            'user_id': websocket_obj.user_id,
            // 'chat_id': websocket_obj.chat_id,
            'game_id': websocket_obj.active_game,
            'invited_id': websocket_obj.invited_id
          }
          break
        default:
          console.log('SOMETHING ELSE [something wrong in onmessage type]')
      }

      websocket_obj.websocket.send(JSON.stringify({
        'status': 'ok',
        'type': type,
        'data': data
      }));

      // websocket_obj.websocket.addEventListener('message', onMessage);
      websocket_obj.websocket.addEventListener('error', sendError);
      resolve() // WITHOUT this we don't return to prev functions!!

    } else {
      console.error("WebSocket connection is not open.");
      reject(new Error("WebSocket connection is not open."));
    }
  });
}


// TODO: MARIE: MOVE THIS TO CHAT.JS
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

    if (websocket_obj.username === myArray[i].sender)
    {
      titleElement.classList.add('sender-title')
      titleElement.textContent = 'You';
      messageDiv.style.textAlign = 'right';
      contentDiv.classList.add('sender-message-content');
      timestampElement.classList.add('sender-timestamp');
    }
    else
    {
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

// TODO: MARIE: MOVE THIS TO CHAT.JS
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
        await handleButtonClickChatsInProfile(myArray[i].user_name);
      });
      mainContainer.appendChild(chat_element)
    }
  }
}

// TODO: MARIE: MOVE THIS TO CHAT.JS
async function handleButtonClickChatsInProfile(clickedUser) {
  // automatically render profile of clicked user
  const modal = new bootstrap.Modal(document.getElementById('backdropClickedUser'));
  const lol = document.getElementById('lol')
  lol.style.opacity = 0.5;
  let private_profile_header = document.getElementById('backdropClickedUserLabel')
  private_profile_header.textContent = clickedUser
  modal.show();
}