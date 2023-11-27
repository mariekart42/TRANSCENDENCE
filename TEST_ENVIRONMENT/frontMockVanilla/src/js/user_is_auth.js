
function addEventListenersIsAuth() {

  document.getElementById('sendMessageButton').addEventListener('click', function () {
    const message = document.getElementById('messageInput').value
    const sender = websocket_obj.username
    console.log('MESSGAE: ', message)
    websocket_obj.message = message
    console.log('SENDER: ', sender)
    websocket_obj.sender = sender

    // message bar empty after user hit send:
    document.getElementById('messageInput').value = ''

    // send inited data to backend:
    sendWebsocketData()
  });



}