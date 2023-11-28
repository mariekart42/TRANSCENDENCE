
function addEventListenersIsAuth() {

  document.getElementById('sendMessageButton').addEventListener('click', function () {
    websocket_obj.message = document.getElementById('messageInput').value
    websocket_obj.sender = websocket_obj.username
    console.log('MESSGAE: ', websocket_obj.message)
    console.log('SENDER: ', websocket_obj.sender)

    // message bar empty after user hit send:
    document.getElementById('messageInput').value = ''

    // send inited data to backend:
    sendWebsocketData()
  });
}