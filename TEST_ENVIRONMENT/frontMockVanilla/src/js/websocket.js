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

    if (data.type === 'chat.online.stats') {
      websocket_obj.onlineStats = data.online_stats
      await getMessageData()
    }
    // else if (data.type === 'chat.online.stats.onClose') {
    //   websocket_obj.onlineStats = data.online_stats
    //   await renderProfile()
    //     // websocket_obj.messages = data
    //     await renderChat()
    // }
    else
    {
      // check if current user is in the same chat_id
      if (data.chat_id === websocket_obj.chat_id) {
        await renderProfile()
        websocket_obj.messages = data
        await renderChat()
      }
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

async function sendWsMessageDataRequest(request_type) {
  return new Promise((resolve, reject) => {
    if (websocket_obj.websocket.readyState === WebSocket.OPEN) {
      if (request_type === 'chat.message') {
        // console.log('WS REQUEST MESSAGE DATA')
        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'chat.message',
          'data': {
            'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
            'sender': websocket_obj.sender,
            'message': websocket_obj.message,
          },
        }));
      }
      else {
        // console.log('WS REQUEST ONLINE STATS')
        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'chat.online.stats',
          'data': {
            // 'user_id': websocket_obj.user_id,
            'chat_id': websocket_obj.chat_id,
          },
        }));
      }



      // websocket_obj.websocket.addEventListener('message', onMessage);
      websocket_obj.websocket.addEventListener('error', sendError);
    } else {
      console.error("WebSocket connection is not open.");
      reject(new Error("WebSocket connection is not open."));
    }
  });
}



// ASYNC because we want to get a Promise that we got the response
// of the ws request before continuing with further functions where
// we're dependent on the data
async function getMessageData() {
  try
  {
    const request_type = 'chat.message'
    await sendWsMessageDataRequest(request_type);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function getOnlineStats() {
  try
  {
    const request_type = 'chat.online.stats'
    await sendWsMessageDataRequest(request_type);
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
      // const onlineStatData = websocket_obj.onlineStats
      // console.log('ONLINE STATS: ', onlineStatData)
      // const isCurrentUserOnline = websocket_obj.onlineStats.some(user => user.user_id === currentUserId);
      function hasMatchingUserId(user) {
        console.log('CURRENT USER [', currentUserId, '] | OTHER [', user.user_id, ']')
        // console.log('USER : ', user)
        // console.log('OTHER USER NAME: ', user.user_id)
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

