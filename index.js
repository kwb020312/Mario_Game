import platform from "./img/platform.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// 중력
const gravity = 0.5;

// 플레이어 클래스
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 100;
    this.height = 100;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

// 지면 클래스
class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = 20;
  }

  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player();
const platforms = [
  new Platform({
    x: 200,
    y: 100,
  }),
  new Platform({
    x: 500,
    y: 200,
  }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {},
};

//  골인지점
let scrollOffset = 0;

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

  // 플레이어 이동
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    // 제한 영역을 넘었다면, 배경이 지나가는 것처럼 효과를 줌
    if (keys.right.pressed) {
      scrollOffset += 5;

      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;

      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }

  platforms.forEach((platform) => {
    // 플레이어 지면 밟음 감지
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // 승리 조건 달성
  if (scrollOffset > 2000) {
    console.log("골인");
  }
}

animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65: {
      console.log("left");
      keys.left.pressed = true;
      break;
    }

    case 83:
      console.log("down");
      break;

    case 68:
      keys.right.pressed = true;
      break;
    case 87:
      player.velocity.y -= 20;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65: {
      console.log("left");
      keys.left.pressed = false;
      break;
    }

    case 83:
      console.log("down");
      break;

    case 68:
      keys.right.pressed = false;
      break;
    case 87:
      break;
  }
});
