websocket_obj = {

  username: null,
  password: null,
  age: null,

  chat_name: null,
  chat_id: null,

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

    // if (data.type === 'chat.online.stats')
    // {
    //   websocket_obj.onlineStats = data.online_stats
    //   // await sendMessage()
    // }
    // else
    // {

    if (data.type === 'all_chat_messages') {
      // check if current user is in the same chat_id
      if (data.chat_id === websocket_obj.chat_id) {
        await renderProfile()
        websocket_obj.messages = data
        await renderChat()
      }
    }
    else if (data.type === 'online_stats') {
      websocket_obj.onlineStats = data.online_stats
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
      if (request_type === 'send_chat_message') {
        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'save_message_in_db',
          'data': {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
            'sender': websocket_obj.sender,
            'message': websocket_obj.message,
          },
        }));
      }
      else if (request_type === 'get_chat_messages') {
        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'send_chat_messages',
          'data': {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          },
        }));
      }
      else if (request_type === 'get_online_stats') {
        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'send_online_stats',
          'data': {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          },
        }));
      }


      //   websocket_obj.websocket.send(JSON.stringify({
      //     'status': 'ok',
      //     'type': 'chat.online.stats',
      //     'data': {
      //       'chat_id': websocket_obj.chat_id,
      //     },
      //   }));



      // websocket_obj.websocket.addEventListener('message', onMessage);
      websocket_obj.websocket.addEventListener('error', sendError);
      resolve() // WITHOUT this we don't return to prev functions!!

    } else {
      console.error("WebSocket connection is not open.");
      reject(new Error("WebSocket connection is not open."));
    }
  });
}



// ASYNC because we want to get a Promise that we got the response
// of the ws request before continuing with further functions where
// we're dependent on the data
async function sendMessageToBackend() {
  try
  {
    const request_type = 'send_chat_message'
    await sendDataToBackend(request_type);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getMessagesFromBackend() {
  try
  {
    const request_type = 'get_chat_messages'
    await sendDataToBackend(request_type);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getOnlineStatsFromBackend() {
  try
  {
    const request_type = 'get_online_stats'
    await sendDataToBackend(request_type);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function renderChat() {

  const chatDiv = document.getElementById('userChatsList');
  chatDiv.classList.add('hidden');
  const userDiv = document.getElementById('userFriendsList');
  userDiv.classList.add('hidden');
  const chatTitle = document.getElementById('chatTitle')
  chatTitle.textContent = websocket_obj.chat_name +' | ' + websocket_obj.chat_id

// console.log('HEEEERE1: ', websocket_obj.all_user)
//   console.log('HEEEERE2: ', websocket_obj.onlineStats)
  // let leaveChatButton = document.createElement('button')

  let myArray = websocket_obj.messages.message_data;
  let mainContainer = document.getElementById('messageContainer');
  mainContainer.innerHTML = '';

  let tmpDiv = [];
  for (let i = 0; i < myArray.length; i++) {
    let messageDiv = document.createElement('div');
    let contentDiv = document.createElement('div');
    let strongElement = document.createElement('strong');
    let lineBreakElement = document.createElement('br');

    let textDiv = document.createElement('div');
    textDiv.classList.add('text-break');
    textDiv.textContent = myArray[i].text;

    let timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.textContent = myArray[i].timestamp;

    if (websocket_obj.username === myArray[i].sender)
    {
      strongElement.textContent = 'You';
      messageDiv.style.textAlign = 'right';
      contentDiv.classList.add('own-message-text');
    }
    else
    {
      contentDiv.classList.add('other-message-text');
      const currentUserId = myArray[i].sender_id
      function hasMatchingUserId(user) {
        // console.log('CURRENT USER [', currentUserId, '] | OTHER [', user.user_id, ']')
        return user.user_id === currentUserId;
      }

      const isCurrentUserOnline = websocket_obj.onlineStats.some(hasMatchingUserId);
      if (isCurrentUserOnline) {
        strongElement.textContent = myArray[i].sender + ' 🟢';
      } else {
        strongElement.textContent = myArray[i].sender + ' 🔴';
      }
    }

    contentDiv.appendChild(strongElement);
    contentDiv.appendChild(lineBreakElement);
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timestampDiv);

    messageDiv.appendChild(contentDiv);
    tmpDiv.push(messageDiv);
  }

  for (let i = 0; i < myArray.length; i++) {
    mainContainer.appendChild(tmpDiv[i]);

    if (i < tmpDiv.length - 1) {
      mainContainer.appendChild(document.createElement('br'));
    }
  }
}

