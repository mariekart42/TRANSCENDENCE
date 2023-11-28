websocket_obj = {

  username: null,
  password: null,

  chat_name: null,
  chat_id: 44,

  messages: [
    {
      id: 0,
      sender: null,
      text: null,
      timestamp: 0,
    }
  ],

  message: null,
  sender: null,
  websocket: null,
}

function establishWebsocketConnection() {

  websocket_obj.websocket = new WebSocket('ws://localhost:6969/ws/test/');

  // Wait for the WebSocket to open before sending messages
  websocket_obj.websocket.onopen = function (event) {
    console.log("WebSocket opened. You can now send messages.");
    sendWebsocketData()
  };


  // Handle incoming messages
  websocket_obj.websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    websocket_obj.messages = data
    console.log('WEBSOCKET DATA: ', websocket_obj.messages)

    renderChat()
  };


  // Handle WebSocket errors
  websocket_obj.websocket.onerror = function (error) {
    console.error("WebSocket error:", error);
  };


  // Handle WebSocket closure
  websocket_obj.websocket.onclose = function (event) {
    console.log("WebSocket closed:", event);
  };
}


function sendWebsocketData() {
  if (websocket_obj.websocket.readyState === WebSocket.OPEN)
  {
    console.log("WebSocket open");
    websocket_obj.websocket.send(JSON.stringify({
        'type': 'chat.message',
        'user_id': websocket_obj.user_id,
        'chat_id': websocket_obj.chat_id, // init somewhere, rn hardcoded in object
        'sender': websocket_obj.sender,
        'message': websocket_obj.message,
    }));
  }
  else {
    console.error("WebSocket connection is not open.");
  }
}


function renderChat() {

  let sender_title = document.getElementById('senderTitle');
  sender_title.textContent = 'CHAT: ' + websocket_obj.username

  let myArray = websocket_obj.messages.message_data;

  let mainContainer = document.getElementById('messageContainer');
  mainContainer.innerHTML = '';

  // Iterate through the array and append each element to the output div
  let tmpDiv = [];
  for (let i = 0; i < myArray.length; i++) {
    let messageDiv = document.createElement('div');
    let contentDiv = document.createElement('div');
    let strongElement = document.createElement('strong');
    let lineBreakElement = document.createElement('br');

    // Create a div element for the message text
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
      strongElement.textContent = myArray[i].sender;
    }

    contentDiv.appendChild(strongElement);
    contentDiv.appendChild(lineBreakElement);
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timestampDiv);

    messageDiv.appendChild(contentDiv);
    tmpDiv.push(messageDiv);
  }

  // Append all divs in the tmpDiv array to the main container
  for (let i = 0; i < myArray.length; i++) {
    mainContainer.appendChild(tmpDiv[i]);

    if (i < tmpDiv.length - 1) {
      mainContainer.appendChild(document.createElement('br'));
    }
  }
}