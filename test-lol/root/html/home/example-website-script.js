const ball = document.getElementById('ping-pong-ball');
const leftPaddle = document.getElementById('left-paddle');
const rightPaddle = document.getElementById('right-paddle');
const chatMessages = document.getElementById('chat-messages');

// Initial ball position and speed
let ballX = 300;
let ballY = 200;
let ballSpeedX = -3;
let ballSpeedY = 2;

function updateGameArea() {
    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check collision with paddles and update ball direction
    if (
        (ballX <= 30 && ballY >= leftPaddle.offsetTop && ballY <= leftPaddle.offsetTop + 100) ||
        (ballX >= 550 && ballY >= rightPaddle.offsetTop && ballY <= rightPaddle.offsetTop + 100)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Check collision with top and bottom walls
    if (ballY <= 0 || ballY >= 380) {
        ballSpeedY = -ballSpeedY;
    }

    // Update ball position
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Request animation frame for smooth animation
    requestAnimationFrame(updateGameArea);
}

// Start the game loop
updateGameArea();
