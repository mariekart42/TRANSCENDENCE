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
      isPrivate: false,
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
  userInCurrentChat: [
    {
      user_name: null,
      user_id: null,
    }
  ],

  game: [
    {
      game_id: null,
      key_code: 0,
      left_pedal: null,
      right_pedal: null,
      is_host: false,

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

    if (data.type === 'all_chat_messages') {
      if (data.chat_id === websocket_obj.chat_id) {
        await renderProfile()
        websocket_obj.messages = data
        await renderChat()
      }
    }
    else if (data.type === 'online_stats') {
      websocket_obj.onlineStats = data.online_stats
    }
    else if (data.type === 'online_stats_on_disconnect') {
      websocket_obj.onlineStats = data.online_stats
      await renderChat()
    }
    else if (data.type === 'user_in_current_chat') {
      websocket_obj.userInCurrentChat = data.user_in_chat
    }
    // else if (data.type === 'render_game_scene') {
    //   console.log("in render_game_scene")
    //   console.log("new pedal position:");
    //   console.log(data.new_pedal_pos);
    //   console.log(data);
    //   console.log("host status:");
    //   console.log(websocket_obj.game.is_host);


    //   if (websocket_obj.game.is_host === true)
    //   {
    //     websocket_obj.game.left_pedal = data.new_pedal_pos
    //     console.log("left_pedal = data.new_pedal_pos");
    //   }
    //   else
    //     websocket_obj.game.right_pedal = data.new_pedal_pos
    //   // websocket_obj.game.key_code = 0
    //   await renderGame()

    // }
    else if (data.type === 'render_left')
    {
      websocket_obj.game.left_pedal = data.new_pedal_pos
      await renderGame()


    }
    else if (data.type === 'render_right')
    {
      websocket_obj.game.right_pedal = data.new_pedal_pos
      await renderGame()

    }
    
    else if (data.type === 'init_game') {
      console.log(data);
      // document.getElementById("waitingScreen").style.display = "block";

      if (data.is_host === 'True')
      {
        websocket_obj.game.is_host = true
        console.log("game.is_host = true");
        console.log(websocket_obj.game.is_host);
      }
      else
        websocket_obj.game.is_host = false      
    }

    else if (data.type === 'game_start')
    {
      console.log("GAME START");
      // document.getElementById("waitingScreen").style.display = "none";

      launchGame();
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
      else if (request_type === 'get_user_in_current_chat') {
        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'send_user_in_current_chat',
          'data': {
            'chat_id': websocket_obj.chat_id,
          },
        }));
      }

      else if (request_type === 'game_new_move') {
        console.log("in game_new_move");
        console.log(websocket_obj.game.is_host);
        // prev_pos =  websocket_obj.game.left_pedal;
        if (websocket_obj.game.is_host === true)
          pedal_pos = websocket_obj.game.left_pedal
        else
          pedal_pos = websocket_obj.game.right_pedal
        // console.log(prev_pos);


        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'send_game_scene',
          'data': {
            'game_id': websocket_obj.game.game_id,
            'key_code': websocket_obj.game.key_code,
            'prev_pos': pedal_pos,
            // 'is_host': websocket_obj.game.is_host,

          },
        }));
      }
      else if (request_type === 'init_game') {
        console.log("in init_game");


        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'send_init_game',
          'data': {
            'game_id': websocket_obj.game.game_id,
            'user_id': websocket_obj.user_id,

          },
        }));
      }

      // websocket_obj.websocket.addEventListener('message', onMessage);
      websocket_obj.websocket.addEventListener('error', sendError);
      resolve() // WITHOUT this we don't return to prev functions!!

    } else {
      console.error("WebSocket connection is not open.");
      reject(new Error("WebSocket connection is not open."));
    }
  });
}

async function launchGame()
{
  // document.getElementById("waitingScreen").style.display = "none";

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  const gameState = {
    // leftPedal: web,
    // rightPedal: canvas.height / 2 - 50,
    ball: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speed: 5,
      dx: 5,
      dy: 5,
    },
    // game_id: gameId,
    // key_code: 0,
    // is_host: false,
  };

  function drawPaddles() {
    ctx.fillStyle = "black";
    ctx.fillRect(
      10,
      websocket_obj.game.left_pedal,
      10,
      100
    );
    ctx.fillRect(
      canvas.width - 10,
      websocket_obj.game.right_pedal,
      10,
      100
    );
  }

  // Draw the ball
  function drawBall() {
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  // Move the ball
  function moveBall() {
    gameState.ball.x += gameState.ball.dx;
    gameState.ball.y += gameState.ball.dy;

    // Handle ball-wall collisions
    if (gameState.ball.y - gameState.ball.radius < 0 || gameState.ball.y + gameState.ball.radius > canvas.height) {
      gameState.ball.dy *= -1;
    }

    // Handle ball-paddle collisions
    if (
      gameState.ball.x - gameState.ball.radius < 20 && // Adjust the value based on paddle width
      gameState.ball.y > websocket_obj.game.left_pedal &&
      gameState.ball.y < websocket_obj.game.left_pedal + 100 // Adjust the value based on paddle height
    ) {
      gameState.ball.dx *= -1;
    }

    if (
      gameState.ball.x + gameState.ball.radius > canvas.width - 20 && // Adjust the value based on paddle width
      gameState.ball.y > websocket_obj.game.right_pedal &&
      gameState.ball.y < websocket_obj.game.right_pedal + 100 // Adjust the value based on paddle height
    ) {
      gameState.ball.dx *= -1;
    }
  }

  function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveBall();
    drawPaddles();
    drawBall();
  }
  function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
  }


  gameLoop()

}

async function renderGame() {

  console.log("in ACTUAL rendering");
  console.log(websocket_obj.game.is_host);


  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles at the updated position
  ctx.fillStyle = "black";
  ctx.fillRect(10, websocket_obj.game.left_pedal, 10, 100);
  ctx.fillRect(canvas.width - 10, websocket_obj.game.right_pedal, 10, 100);


  // Draw the ball
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();


}

async function renderChat() {

  const chatTitle = document.getElementById('chatTitle')
  chatTitle.textContent = websocket_obj.chat_name +' | ' + websocket_obj.chat_id

  let myArray = websocket_obj.messages.message_data;
  let lol = websocket_obj.userInCurrentChat
  renderUserInChatList()
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


function renderUserInChatList() {
  let mainContainer = document.getElementById('userInChatList');
  mainContainer.innerHTML = '';

  // CHANGE ALL_USER WITH user in chat
  console.log('WEBSOCKET DATa in func: ', websocket_obj.userInCurrentChat)
  let myArray = websocket_obj.userInCurrentChat
  console.log('MyArray: ', myArray)

  let title = document.createElement('h2');
  title.textContent = 'User in Chat:'
  mainContainer.appendChild(title);

  for (let i = 0; i < myArray.length; i++) {

    let textDiv = document.createElement('div');
      textDiv.textContent = myArray[i].user_name;
    // get array of all user in that cyrrent chat

      mainContainer.appendChild(textDiv)
  }


}

