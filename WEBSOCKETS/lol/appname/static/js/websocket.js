const socket = new WebSocket('ws://localhost:8000/ws/some_path/');

socket.onopen = function (event) {
    console.log('WebSocket connection opened.');
    // Send any initial messages if needed
};

socket.onmessage = function (event) {
    console.log('Received message:', event.data);
};

socket.onerror = function (error) {
    console.error('WebSocket error:', error);
};

socket.onclose = function (event) {
    console.log('WebSocket connection closed:', event);
};