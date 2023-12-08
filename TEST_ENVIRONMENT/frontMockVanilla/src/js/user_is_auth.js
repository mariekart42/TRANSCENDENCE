// let tmp = {
//   active_game: null,  // Make sure to initialize the name property
// }




// BUTTON TO SEND MESSAGE IN CHAT
function addEventListenersIsAuth() {
  document.getElementById('sendMessageButton').addEventListener('click', async function () {
    websocket_obj.message = document.getElementById('messageInput').value
    websocket_obj.sender = websocket_obj.username

    document.getElementById('messageInput').value = ''
    await getMessageData()
    await renderChat();
  });
  // document.getElementById('createGameButton').addEventListener('click', createGame);
}



// async function renderInvites() {

//   console.log('In renderInvites:');


//   const username = "k";
  
//   // console.log(element); // Check the console for the result
    
    

//   var theButton = document.getElementById('createGameButton');
//   theButton.style.display = 'none';
//   try {

// // _+_+_+_+_+_+_

//     const response = await fetch(`http://127.0.0.1:6969/user/game/render/invites/${username}/`);
//     const htmlContent = await response.text();
    
//     // Assuming you have a container element with the id 'htmlContainer'
//     const container = document.getElementById('game-session-container');
//     container.innerHTML = htmlContent;
// // _+_+_+_+_+_+_

// // const response = await fetch(`http://127.0.0.1:6969/user/game/render/invites/${username}/`);
// // console.log(response);

// // // try {
// //     const data = await response.json();

// //     // Check if data.game_sessions is an array
// //     if (Array.isArray(data.game_sessions)) {
// //         console.log(data.game_sessions);
// //         const gameSessions = data.game_sessions;

// //         const container = document.getElementById('game-session-container');

// //         // Loop through each game session and create a button
// //         gameSessions.forEach(session => {
// //             const button = document.createElement('button');
// //             button.textContent = `Join ${session.id}`;

// //             // Add a click event listener to handle the button click
// //             button.addEventListener('click', () => {
// //                 joinGame(session.id); // Replace with your logic
// //             });

// //             // Append the button to the container
// //             container.appendChild(button);
// //         });
// //     } else {
// //         console.error("Invalid data structure: game_sessions is not an array");
// //     }
// } catch (error) {
//     console.error('There was a problem with the fetch operation:', error);
// }




//   }

//   async function  displayError(){
//     console.log('hi');

//   }


// async function sendGameInvitation() {


//   console.log('In invite user to game');

//   var userNameInput = document.getElementById("guestUser");

//   // Access the value property to get the entered data
//   var guestUser = userNameInput.value;

//   console.log("User Name: " + guestUser);
    

//   var theButton = document.getElementById('createGameButton');
//   theButton.style.display = 'none';  
//   var username = "k"  
//   var game_id = active_game;
//   var guest_user_name = guestUser;
//   try {
//     const response = await fetch(`http://127.0.0.1:6969/user/game/invite/${username}/${game_id}/${guest_user_name}/`);
//     const data = await response.json();

//     if (response.ok) {
//     displayError(null);
//     // Perform actions on successful login, e.g., set isLoggedIn and userData
//       active_game = null;

//         console.log(data);
//     } else {
//     displayError(data.error);
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     displayError('Error fetching user data');
//   }
// }

// async function createGame() {

//   console.log('In createGame:');


//   // const username = "k";

//     console.log("IN CREATEGAME"); // Check the console for the result


//     var element = document.getElementById('createGameButton');
//     console.log(element); // Check the console for the result
    
    

//   var theButton = document.getElementById('createGameButton');
//   theButton.style.display = 'none';    
//   try {
//     const response = await fetch(`http://127.0.0.1:6969/user/game/create/${websocket_obj.username}/`);
//     const data = await response.json();
//     console.log(data.id); // Check the console for the result
//     active_game = data.id;

//     if (response.ok) {
//     displayError(null);
//     active_game = data.id;
//     // console.log(data.id); // Check the console for the result

//     // Perform actions on successful login, e.g., set isLoggedIn and userData
//         console.log(data);
//     } else {
//     displayError(data.error);
//     }
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     displayError('Error fetching user data');
//   }


// }

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
    console.error('CHAT NAME CANT BE EMPTY ')
    return
  }

  const url = `http://127.0.0.1:6969/user/createChat/${websocket_obj.user_id}/${chat_name}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not create new Chat');
      }
      return response.json();
    })
    .then(data => {
      renderProfile()
      // getMessageData()
      // renderChat()
    })
    .catch(error => {
      console.error('Error during creating new Chat:', error);
    });
}


async function renderProfile() {

  const chatDiv = document.getElementById('userChatsList');
  chatDiv.classList.remove('hidden');

  let sender_title = document.getElementById('displayUserName');
  sender_title.textContent = 'Hey ' + websocket_obj.username + ' 🫠'

  const url = `http://127.0.0.1:6969/user/getUserChats/${websocket_obj.user_id}/`
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Could not get Users Chats Data');
      }
      return response.json();
    })
    .then(data => {
      // console.log('GOT USER CHAT LIST: ', data)
      websocket_obj.chat_data = data.chat_data
      console.log('GOT USER CHAT LIST: ', websocket_obj.chat_data)
      renderUsersChatList()
    })
    .catch(error => {
      console.error('Error during getUserChats:', error);
    });
}


async function handleButtonClick(chatId, chatName) {
  const chatDiv = document.getElementById('showChat');
  chatDiv.classList.remove('hidden');

  websocket_obj.chat_id = chatId;
  websocket_obj.chat_name = chatName;

  await getMessageData()
  await renderChat();
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

    button.addEventListener('click', async function () {
      await handleButtonClick(array_of_chats[i].chat_id, array_of_chats[i].chat_name);
    });

    userChatsList.appendChild(paragraph);
    userChatsList.appendChild(button);
  }
}
