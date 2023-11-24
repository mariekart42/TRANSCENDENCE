

function establishWebsocketConnection() {

    const username = obj.username
    const password = obj.password
    console.log('TEST OBJ< NAME: ', username)
    console.log('TEST OBJ< PASSWORD: ', password)

    const chatSocket = new WebSocket(
        'ws://localhost:6969/ws/test/'
    );

    // Wait for the WebSocket to open before sending messages
    chatSocket.onopen = function (event) {
        console.log("WebSocket opened. You can now send messages.");

        // Example: Sending a message after the WebSocket is open
        const message = "LOL I AM MESSGAE SEND FROM FRONTEND TO BACKEND!";
        chatSocket.send(JSON.stringify({
            'type': 'chat.message',
            'message': message,
        }));
    };

    // Handle incoming messages
    chatSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        // Process the incoming message data
        console.log(data);
    };

    // Handle WebSocket errors
    chatSocket.onerror = function (error) {
        console.error("WebSocket error:", error);
    };

    // Handle WebSocket closure
    chatSocket.onclose = function (event) {
        console.log("WebSocket closed:", event);
    };
}