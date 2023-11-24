  websocket_obj = {
    switch_bool: false,
    websocket: null,
}

function establishWebsocketConnection() {
    const roomName = "your_room_name";  // Replace with the actual room name

    websocket_obj.websocket = new WebSocket(
        'ws://localhost:6969/ws/test/'
    );

    // Wait for the WebSocket to open before sending messages
    websocket_obj.websocket.onopen = function (event) {
        console.log("WebSocket opened. You can now send messages.");
        sendWebsocketData()
    };


    // Handle incoming messages
    websocket_obj.websocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        // Process the incoming message data
        console.log(data);
        let switch_text = document.getElementById('lol')

        if (data.switch) {
            switch_text.textContent = 'IS TRUE'
        } else {
            switch_text.textContent = 'IS NOT TRUE'
        }
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
            'switch': websocket_obj.switch_bool,
            // 'message': message,
        }));
    }
    else {
        console.error("WebSocket connection is not open.");
    }
}