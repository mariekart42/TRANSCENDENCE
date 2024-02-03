
function gameDom() {
  // HERE EVENTLISTENERS FOR GAME:
  document.getElementById('createGameButton').addEventListener('click', createGame);
}

// HERE FUNCTIONS FOR GAME:


async function joinGame(gameId) {

  console.log('In JoinGame');
  document.getElementById("showGameField").style.display = "block";

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  // Draw paddles
  ctx.fillStyle = "black";

  websocket_obj.game.left_pedal = 0.75
  console.log("websocket_obj.game.left_pedal: ", websocket_obj.game.left_pedal);
  websocket_obj.game.right_pedal = 0.75


  ctx.fillRect(canvas.width / 80, canvas.height / 2 - (canvas.height / 4 / 2), canvas.width / 80, canvas.height / 4);
  ctx.fillRect(canvas.width - canvas.width / 80, canvas.height / 2 - (canvas.height / 4 / 2), canvas.width / 80, canvas.height / 4);

  // ctx.fillRect(canvas.width - 10, canvas.height / 2 - 50, 10, 100);


  websocket_obj.game.game_id = gameId;
  websocket_obj.game.key_code = 0;
  websocket_obj.game.is_host = false;



  console.log("IN JOINGAME");


  async function updateCanvasSize() {
    const canvas = document.getElementById("pongCanvas");
    canvas.width = window.innerWidth * 0.75;  // Set canvas width to window width
    canvas.height = window.innerHeight * 0.75;  // Set canvas height to window height

  }

  window.addEventListener("resize", updateCanvasSize);

  // window.addEventListener("load", updateCanvasSize);


  await sendDataToBackend('init_game');

  document.addEventListener("keydown", async function(event) {
      // Log the key code to the console
      console.log("Key pressed: " + event.keyCode);
      if (event.keyCode == 40 || event.keyCode == 38)
      {
          websocket_obj.game.key_code = event.keyCode;
          // websocket_obj.game.game_id = gameId;
          console.log("in key event listener:");

          console.log(websocket_obj.game.is_host);

          await sendDataToBackend('game_new_move');
          websocket_obj.game.key_code = 0;
      }

  });

  console.log('end of JoinGame');


}


async function renderInvites() {

  console.log('In renderInvites:');


  const username = websocket_obj.username;



  var theButton = document.getElementById('createGameButton');
  theButton.style.display = 'none';
  try {

// _+_+_+_+_+_+_

    const response = await fetch(`http://127.0.0.1:6969/user/game/render/invites/${username}/`);
    const htmlContent = await response.text();

    const container = document.getElementById('game-session-container');
    container.innerHTML = htmlContent;
// _+_+_+_+_+_+_

} catch (error) {
    console.error('There was a problem with the fetch operation:', error);
}




  }

  async function  displayError(){
    console.log('hi');

  }


async function sendGameInvitation() {


  console.log('In invite user to game');

  var userNameInput = document.getElementById("guestUser");

  // Access the value property to get the entered data
  var guestUser = userNameInput.value;

  console.log("User Name: " + guestUser);


  var theButton = document.getElementById('createGameButton');
  theButton.style.display = 'none';
  var username = websocket_obj.username
  var game_id = websocket_obj.active_game;
  var guest_user_name = guestUser;
  try {
    const response = await fetch(`http://127.0.0.1:6969/user/game/invite/${username}/${game_id}/${guest_user_name}/`);
    const data = await response.json();

    console.log('DATA ', data);

    if (response.ok) {
    displayError(null);
    // Perform actions on successful login, e.g., set isLoggedIn and userData
      websocket_obj.active_game = null;

        console.log(data);
    } else {
    displayError(data.error);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    displayError('Error fetching user data');
  }
}

async function createGame() {


  console.log("IN CREATEGAME");


  var element = document.getElementById('createGameButton');
  console.log(element);



var theButton = document.getElementById('createGameButton');
theButton.style.display = 'none';
try {
  const response = await fetch(`http://127.0.0.1:6969/user/game/create/${websocket_obj.username}/`);
  const data = await response.json();



  console.log('DATA ', data);
  websocket_obj.active_game = data.id;
  console.log('active game ', data.id);


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


}


function drawPaddles() {

  // console.log("in drawPaddles WEBSOCKETS.JS");
  const canvas = document.getElementById("pongCanvas");

  const ctx = canvas.getContext("2d");

  console.log("left pedal: ", websocket_obj.game.left_pedal);
  console.log("right pedal: ", websocket_obj.game.right_pedal);
  left_pedal = canvas.height * websocket_obj.game.left_pedal / 2
  right_pedal = canvas.height * websocket_obj.game.right_pedal / 2



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
  console.log("in drawBall WEBSOCKETS.JS");

  const canvas = document.getElementById("pongCanvas");

  const ctx = canvas.getContext("2d");


  ctx.beginPath();
  // radius = canvas.width / 80
  radius = canvas.height / 40

  ctx.arc(websocket_obj.game.ball_x, websocket_obj.game.ball_y, radius, 0, Math.PI * 2);
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
      dx: 5,
      dy: 5,
    },

  };

  await update()
}







//
// async function renderGame() {
//
//   console.log("in ACTUAL rendering");
//   console.log(websocket_obj.game.is_host);
//
//   const canvas = document.getElementById("pongCanvas");
//   const ctx = canvas.getContext("2d");
//
//   // Clear the canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//   ctx.fillStyle = "black";
//
//   ctx.fillRect(canvas.width / 80, canvas.height / 2 - canvas.height / 8, canvas.width / 80, canvas.height / 4);
//   ctx.fillRect(canvas.width / 80 - canvas.width / 80, canvas.height / 2 - canvas.height / 8, canvas.width / 80, canvas.height / 4);
//   console.log ("canvas.width: ", canvas.width);
//   console.log ("canvas.height: ", canvas.height);
//   console.log ("canvas.width / 80: ", canvas.width / 80);
//   console.log ("canvas.height / 8: ", canvas.height / 8);
//   console.log ("canvas.height / 4: ", canvas.height / 4);
//
//
//   // Draw the ball
//   ctx.beginPath();
//   // ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
//   ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 80, 0, Math.PI * 2);
//
//   ctx.fill();
//   ctx.closePath();
// }

