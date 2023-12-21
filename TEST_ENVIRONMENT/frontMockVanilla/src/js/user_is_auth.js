
// BUTTON TO SEND MESSAGE IN CHAT
function addEventListenersIsAuth() {
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

  document.getElementById('goBackToProfileButton').addEventListener('click', async function () {
    const chatDiv = document.getElementById('showChat');
    chatDiv.classList.add('hidden');
    const profileDiv = document.getElementById('showUserProfile');
    profileDiv.classList.remove('hidden');
  })

  document.getElementById('create_chat_button').addEventListener('click', async function() {
    await createChat()
  })
    document.getElementById('createGameButton').addEventListener('click', createGame);

}


function setErrorWithTimout(element_id, error_message, timout) {
  const obj = document.getElementById(element_id)
  obj.textContent = error_message;
  obj.style.display = 'block';
  setTimeout(function() {
    obj.remove();
  }, timout);
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


// rn as HTTP but needs to happen through ws
async function inviteUser(invited_user_name){
  const url = `http://127.0.0.1:6969/user/inviteUserToChat/${websocket_obj.user_id}/${websocket_obj.chat_id}/${invited_user_name}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('This User does not exists');
        } else {
          throw new Error('Could not get Users Chats Data');
        }
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
    })
    .catch(error => {
      setErrorWithTimout('error_message_2', error, 5000)
      console.error('Error during getUserChats:', error);
    });
  // document.getElementById('createGameButton').addEventListener('click', createGame);
}


async function joinGame(gameId) {
  document.getElementById("showGameField").style.display = "block";

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  // Draw paddles
  ctx.fillStyle = "black";
  ctx.fillRect(10, canvas.height / 2 - 50, 10, 100);
  ctx.fillRect(canvas.width - 10, canvas.height / 2 - 50, 10, 100);


  // Draw the ball
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  console.log("IN JOINGAME");

  websocket_obj.game.left_pedal = canvas.height / 2 - 50;
  websocket_obj.game.right_pedal = canvas.height / 2 - 50;

  websocket_obj.game.game_id = gameId;
  websocket_obj.game.key_code = 0;
  websocket_obj.game.is_host = false;



  // sendDataToBackend('game_new_move');
  console.log("before init:");

  console.log(websocket_obj.game.is_host);

  await sendDataToBackend('init_game');

  console.log("after init:");

  console.log(websocket_obj.game.is_host);

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


  const username = "k";

  // console.log(element); // Check the console for the result



  var theButton = document.getElementById('createGameButton');
  theButton.style.display = 'none';
  try {

// _+_+_+_+_+_+_

    const response = await fetch(`http://127.0.0.1:6969/user/game/render/invites/${username}/`);
    const htmlContent = await response.text();

    // Assuming you have a container element with the id 'htmlContainer'
    const container = document.getElementById('game-session-container');
    container.innerHTML = htmlContent;
// _+_+_+_+_+_+_

// const response = await fetch(`http://127.0.0.1:6969/user/game/render/invites/${username}/`);
// console.log(response);

// // try {
//     const data = await response.json();

//     // Check if data.game_sessions is an array
//     if (Array.isArray(data.game_sessions)) {
//         console.log(data.game_sessions);
//         const gameSessions = data.game_sessions;

//         const container = document.getElementById('game-session-container');

//         // Loop through each game session and create a button
//         gameSessions.forEach(session => {
//             const button = document.createElement('button');
//             button.textContent = `Join ${session.id}`;

//             // Add a click event listener to handle the button click
//             button.addEventListener('click', () => {
//                 joinGame(session.id); // Replace with your logic
//             });

//             // Append the button to the container
//             container.appendChild(button);
//         });
//     } else {
//         console.error("Invalid data structure: game_sessions is not an array");
//     }
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
  var username = "k"
  var game_id = active_game;
  var guest_user_name = guestUser;
  try {
    const response = await fetch(`http://127.0.0.1:6969/user/game/invite/${username}/${game_id}/${guest_user_name}/`);
    const data = await response.json();

    if (response.ok) {
    displayError(null);
    // Perform actions on successful login, e.g., set isLoggedIn and userData
      active_game = null;

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

  console.log('In createGame:');


  // const username = "k";

    console.log("IN CREATEGAME"); // Check the console for the result


    var element = document.getElementById('createGameButton');
    console.log(element); // Check the console for the result



  var theButton = document.getElementById('createGameButton');
  theButton.style.display = 'none';
  try {
    const response = await fetch(`http://127.0.0.1:6969/user/game/create/${websocket_obj.username}/`);
    const data = await response.json();
    console.log(data.id); // Check the console for the result
    active_game = data.id;

    if (response.ok) {
    displayError(null);
    active_game = data.id;
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

async function leaveChat() {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.add('hidden');
  console.log('USER_ID | CHAT_ID: ', websocket_obj.user_id, websocket_obj.chat_id)
  const url = `http://127.0.0.1:6969/user/leaveChat/${websocket_obj.user_id}/${websocket_obj.chat_id}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get Users Chats Data');
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });
}


async function createChat() {

  const chat_name = document.getElementById('new_chat_name').value
  if (!chat_name.trim()) {
    setErrorWithTimout('error_message', 'Chat name cannot be empty',  5000)
    return;
  }

  const url = `http://127.0.0.1:6969/user/createPublicChat/${websocket_obj.user_id}/${chat_name}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Chat '+chat_name+' already exists');
        } else {
          throw new Error('Could not create new Chat');
        }
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
    })
    .catch(error => {
      setErrorWithTimout('error_message', error,  5000)
      console.error('Error during creating new Chat:', error);
    });
}


async function renderProfile() {

  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'

  let url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
  await fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get Users Chats Data');
      }
      return response.json();
    })
    .then(data => {
      websocket_obj.chat_data = data.chat_data
      renderUsersChatList()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });

  url = `http://127.0.0.1:6969/user/getAllUser/${websocket_obj.user_id}/`
  await fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get all Users');
      }
      return response.json();
    })
    .then(data => {
      websocket_obj.all_user = data.all_user
      renderAllUsersList()
    })
    .catch(error => {
      console.error('Error during getAllUser:', error);
    });
}

async function handleButtonClickChats(chatId, chatName) {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.remove('hidden');
  const showProfile = document.getElementById('showUserProfile');
  showProfile.classList.add('hidden');

  websocket_obj.chat_id = chatId;
  websocket_obj.chat_name = chatName;
  await sendDataToBackend('get_online_stats')
  await sendDataToBackend('get_user_in_current_chat')
  await sendDataToBackend('get_chat_messages')
}

async function renderUsersChatList() {
  let array_of_chats = websocket_obj.chat_data
  let userChatsList = document.getElementById('userChatsList');
  userChatsList.innerHTML = '';

  let title = document.createElement('h2');
  title.textContent = 'Your Chats:'
  userChatsList.appendChild(title);

  if (array_of_chats.length === 0) {
    let paragraph = document.createElement('p');
    paragraph.textContent = 'Damn, pretty empty here...'
    userChatsList.appendChild(paragraph);
  }

  for (let i = 0; i < array_of_chats.length; i++)
  {
    let paragraph = document.createElement('p');
    let button = document.createElement('button');
    button.textContent = array_of_chats[i].chat_name;
    button.classList.add('btn');
    button.classList.add('btn-outline-success');

    button.addEventListener('click', async function () {
      await handleButtonClickChats(array_of_chats[i].chat_id, array_of_chats[i].chat_name);
    });

    userChatsList.appendChild(paragraph);
    userChatsList.appendChild(button);
  }
}

// DELETE LATER
async function handleButtonClickUser(userId, userName) {
  const userModal = new bootstrap.Modal(document.getElementById('userProfileModal'));

  const label = document.getElementById('userModalLabel');
  label.innerHTML = `<h5>${userName}</h5>`;

  // Populate the modal body with user data
  const modalBody = document.getElementById('userProfileModalBody');
  modalBody.innerHTML = `<p>Name: ${userName}</p><p>ID: ${userId}</p>`;

  // Show the modal
  userModal.show();
}


async function renderAllUsersList() {
  let array_of_users = websocket_obj.all_user
  let userFriendsList = document.getElementById('userFriendsList');
  userFriendsList.innerHTML = '';

  let title = document.createElement('h2');
  title.textContent = 'All User:'
  userFriendsList.appendChild(title);

  if (array_of_users.length === 0) {
    let paragraph = document.createElement('p');
    paragraph.textContent = 'Damn, pretty empty here...'
    userFriendsList.appendChild(paragraph);
  }

  for (let i = 0; i < array_of_users.length; i++)
  {
    let paragraph = document.createElement('p');
    let button = document.createElement('button');
    button.textContent = array_of_users[i].name;
    button.classList.add('btn');
    button.classList.add('btn-outline-success');

    button.addEventListener('click', async function () {
      console.log('LOL: ', array_of_users[i])
      await handleButtonClickUser(array_of_users[i].id, array_of_users[i].name);
    });

    userFriendsList.appendChild(paragraph);
    userFriendsList.appendChild(button);
  }
}