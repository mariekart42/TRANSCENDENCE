


function addEventListenersIsAuth() {

  document.getElementById('button').addEventListener('click', function () {
    console.log('Button clicked'); // Check if the button click is registered
    websocket_obj.switch_bool = !websocket_obj.switch_bool
    console.log('SWITCH: ', websocket_obj.switch_bool)
    const content1 = document.getElementById('oneThing');
    const content2 = document.getElementById('anotherThing');
    content1.classList.toggle('hidden');
    content2.classList.toggle('hidden');
    sendWebsocketData()
  });

}