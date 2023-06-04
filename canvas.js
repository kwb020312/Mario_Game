const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

// 중력
const gravity = 0.5;

// 플레이어 클래스
class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
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
    }
  }
}

// 지면 클래스
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// 클래스
class GenericObj {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

// 이미지 경로
const platform = "./img/platform.png";
const background = "./img/background.png";
const hills = "./img/hills.png";
const platformSmallTall = "./img/platformSmallTall.png";

// 지면
let platformImage = createImage(platform);
let platformSmallTallImage = createImage(platformSmallTall);

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let player = new Player();
let platforms = [];
platformImage.onload = () => {
  // 지면 배열
  platforms = [];
};

let genericObjects = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {},
};

//  골인지점
let scrollOffset = 0;

// 초기화 함수
function init() {
  // 지면
  platformImage = createImage(platform);

  function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
  }

  player = new Player();
  platformImage.onload = () => {
    // 지면 배열
    platforms = [
      new Platform({
        x:
          platformImage.width * 4 +
          300 -
          2 +
          platformImage.width -
          platformSmallTallImage.width,
        y: 270,
        image: createImage(platformSmallTall),
      }),
      new Platform({
        x: -1,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width - 2,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 2 + 100,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 3 + 300,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 4 + 300 - 2,
        y: 470,
        image: platformImage,
      }),
      new Platform({
        x: platformImage.width * 5 + 700 - 2,
        y: 470,
        image: platformImage,
      }),
    ];
  };

  genericObjects = [
    new GenericObj({
      x: -1,
      y: -1,
      image: createImage(background),
    }),
    new GenericObj({
      x: -1,
      y: -1,
      image: createImage(hills),
    }),
  ];

  //  골인지점
  scrollOffset = 0;
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // 배경 그리기
  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  // 지면 생성
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  // 플레이어 이동
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    // 제한 영역을 넘었다면, 배경이 지나가는 것처럼 효과를 줌
    if (keys.right.pressed) {
      scrollOffset += player.speed;

      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;

      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
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

  // 승리 조건
  if (scrollOffset > platformImage.width * 5 + 300 - 2) {
    console.log("골인");
  }

  // 패배 조건
  if (player.position.y > canvas.height) {
    init();
  }
}

init();
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65: {
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
      player.velocity.y -= 15;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65: {
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
