<template>
  <div>
    <canvas ref="pingPongCanvas" width="800" height="400"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      paddleWidth: 10,
      paddleHeight: 60,
      paddleSpeed: 5,
      leftPaddle: { x: 10, y: 0, dy: 0 },
      rightPaddle: { x: 0, y: 0, dy: 0 },
      ball: { x: 0, y: 0, dx: 5, dy: 5, radius: 5 },
    };
  },
  mounted() {
    this.canvas = this.$refs.pingPongCanvas;
    this.ctx = this.canvas.getContext("2d");

    // Input handling
    window.addEventListener("keydown", this.keyDownHandler);
    window.addEventListener("keyup", this.keyUpHandler);

    // Start the game loop
    this.gameLoop();
  },
  methods: {
    keyDownHandler(e) {
      if (e.key === "ArrowUp") {
        this.rightPaddle.dy = -this.paddleSpeed;
      } else if (e.key === "ArrowDown") {
        this.rightPaddle.dy = this.paddleSpeed;
      }

      if (e.key === "w") {
        this.leftPaddle.dy = -this.paddleSpeed;
      } else if (e.key === "s") {
        this.leftPaddle.dy = this.paddleSpeed;
      }
    },
    keyUpHandler(e) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        this.rightPaddle.dy = 0;
      }

      if (e.key === "w" || e.key === "s") {
        this.leftPaddle.dy = 0;
      }
    },
    update() {
      // Update paddles
      this.leftPaddle.y += this.leftPaddle.dy;
      this.rightPaddle.y += this.rightPaddle.dy;

      // Keep paddles within the canvas
      this.leftPaddle.y = Math.max(
        0,
        Math.min(this.canvas.height - this.paddleHeight, this.leftPaddle.y)
      );
      this.rightPaddle.y = Math.max(
        0,
        Math.min(this.canvas.height - this.paddleHeight, this.rightPaddle.y)
      );

      // Update ball position
      this.ball.x += this.ball.dx;
      this.ball.y += this.ball.dy;

      // Bounce off the top and bottom edges
      if (
        this.ball.y + this.ball.radius > this.canvas.height ||
        this.ball.y - this.ball.radius < 0
      ) {
        this.ball.dy = -this.ball.dy;
      }

      // Bounce off left paddle
      if (
        this.ball.x - this.ball.radius < this.leftPaddle.x + this.paddleWidth &&
        this.ball.y > this.leftPaddle.y &&
        this.ball.y < this.leftPaddle.y + this.paddleHeight
      ) {
        this.ball.dx = -this.ball.dx;
      }

      // Bounce off right paddle
      if (
        this.ball.x + this.ball.radius > this.rightPaddle.x &&
        this.ball.y > this.rightPaddle.y &&
        this.ball.y < this.rightPaddle.y + this.paddleHeight
      ) {
        this.ball.dx = -this.ball.dx;
      }

      // Reset ball if it goes out of bounds
      if (
        this.ball.x - this.ball.radius < 0 ||
        this.ball.x + this.ball.radius > this.canvas.width
      ) {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
      }
    },
    draw() {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw paddles
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(
        this.leftPaddle.x,
        this.leftPaddle.y,
        this.paddleWidth,
        this.paddleHeight
      );
      this.ctx.fillRect(
        this.rightPaddle.x,
        this.rightPaddle.y,
        this.paddleWidth,
        this.paddleHeight
      );

      // Draw ball
      this.ctx.beginPath();
      this.ctx.arc(
        this.ball.x,
        this.ball.y,
        this.ball.radius,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
      this.ctx.closePath();
    },
    gameLoop() {
      this.update();
      this.draw();
      requestAnimationFrame(this.gameLoop);
    },
  },
};
</script>

<style scoped>
  canvas {
    border: 1px solid #000;
    display: block;
    margin: 20px auto;
  }
</style>
