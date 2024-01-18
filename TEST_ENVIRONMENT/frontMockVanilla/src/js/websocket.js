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
      left_pedal: 0,
      right_pedal: 0,
      is_host: false,
      ball_x: 0,
      ball_y: 0,
      host_score: 0,
      guest_score: 0

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
    else if (data.type === 'render_left')
    {
      const canvas = document.getElementById("pongCanvas");
      // websocket_obj.game.left_pedal = canvas.height * data.new_pedal_pos / 2
      websocket_obj.game.left_pedal = data.new_pedal_pos

      console.log("new left_pedal: ", websocket_obj.game.left_pedal);
      await update();

      // await renderGame()
    }


    else if (data.type === 'render_right')
    {
      const canvas = document.getElementById("pongCanvas");

      websocket_obj.game.right_pedal = data.new_pedal_pos
      // websocket_obj.game.right_pedal = data.new_pedal_pos
      console.log("new right_pedal: ", websocket_obj.game.right_pedal);
      await update();

      // await renderGame()
    }
    
    else if (data.type === 'init_game') {
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
    }

    else if (data.type === 'game_start')
    {
      console.log("GAME START");
      document.getElementById("waitingScreen").style.display = "none";

      launchGame();
    }
    else if (data.type === 'ball_update')
    {
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
    }
    else if (data.type === 'score_update')
    {
      console.log("SCORE_UPDATE");
      websocket_obj.game.host_score = data.host_score
      websocket_obj.game.guest_score = data.guest_score
      console.log("host_score: ", websocket_obj.game.host_score);
      console.log("guest_score: ", websocket_obj.game.guest_score);

      await updateScore();
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
        const canvas = document.getElementById("pongCanvas");
   
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
      else if (request_type === 'send_ball_update') {
        console.log("in ball_update");

        websocket_obj.websocket.send(JSON.stringify({
          'status': 'ok',
          'type': 'send_ball_update',
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

function drawPaddles() {

  console.log("in drawPaddles WEBSOCKETS.JS");
  const canvas = document.getElementById("pongCanvas");

  const ctx = canvas.getContext("2d");
  
  console.log("left pedal: ", websocket_obj.game.left_pedal);
  console.log("right pedal: ", websocket_obj.game.right_pedal);
  left_pedal = canvas.height * websocket_obj.game.left_pedal / 2
  right_pedal = canvas.height * websocket_obj.game.right_pedal / 2
  
  // left_pedal = 0.75
  // right_pedal = 0.75



  console.log("left pedal: ", left_pedal);
  console.log("right pedal: ", right_pedal);

  console.log ("canvas.width: ", canvas.width);
  console.log ("canvas.height: ", canvas.height);
  // console.log ("canvas.width / 80: ", canvas.width / 80);
  // console.log ("canvas.height / 8: ", canvas.height / 8);
  // console.log ("canvas.height / 4: ", canvas.height / 4);


  ctx.fillStyle = "black";

  ctx.fillRect(
    canvas.width / 80,
    left_pedal,
    canvas.width / 80,
    canvas.height / 4);

  ctx.fillRect(
    canvas.width - canvas.width / 80,
    right_pedal,
    canvas.width / 80,
    canvas.height / 4);
}

function drawBall() {
  const canvas = document.getElementById("pongCanvas");

  const ctx = canvas.getContext("2d");

  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  ctx.beginPath();
  ctx.arc(websocket_obj.game.ball_x, websocket_obj.game.ball_y, canvas.width / 80, 0, Math.PI * 2);
  console.log("BALL canvas.width / 80", canvas.width / 80)
  // ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 80, 0, Math.PI * 2);

  ctx.fill();
  ctx.closePath();
}

async  function update() {
  const canvas = document.getElementById("pongCanvas");

  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // moveBall();
  drawPaddles();
  drawBall();
}

async function updateScore() {
  var hostScoreElem = document.getElementById('score1');
  var guestScoreElem = document.getElementById('score2');
  hostScoreElem.textContent = websocket_obj.game.host_score;
  guestScoreElem.textContent = websocket_obj.game.guest_score;

}

async function launchGame()
{
  // document.getElementById("waitingScreen").style.display = "none";

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  const gameState = {
    ball: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: canvas.width / 80,
      speed: 5,
      dx: 5,
      dy: 5,
    },

  };

  await update()
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
  // ctx.fillRect(10, websocket_obj.game.left_pedal, 10, 100);
  // ctx.fillRect(canvas.width - 10, websocket_obj.game.right_pedal, 10, 100);
  ctx.fillRect(canvas.width / 80, canvas.height / 2 - canvas.height / 8, canvas.width / 80, canvas.height / 4);
  ctx.fillRect(canvas.width / 80 - canvas.width / 80, canvas.height / 2 - canvas.height / 8, canvas.width / 80, canvas.height / 4);
  console.log ("canvas.width: ", canvas.width);
  console.log ("canvas.height: ", canvas.height);
  console.log ("canvas.width / 80: ", canvas.width / 80);
  console.log ("canvas.height / 8: ", canvas.height / 8);
  console.log ("canvas.height / 4: ", canvas.height / 4);



  // Draw the ball
  ctx.beginPath();
  // ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 80, 0, Math.PI * 2);

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

