// import './style.css'
// import * as THREE from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as CANNON from 'cannon-es'
// import CannonDebugger from 'cannon-es-debugger';


// /*Variables*/
// const pointsUI = document.querySelector("#pointsUI");
// let points = 0;
// let gameOver = false;

// const randomRangeNum = (max, min) => {
//   return Math.floor(Math.random() * (max - min + 1) + min); 
// };
// const moveObstacles = (arr, speed, maxX, minX, maxZ, minZ) => {
//   arr.forEach((el) => {
//     el.body.position.z += speed;
//     if (el.body.position.z > camera.position.z) {
//       el.body.position.x = randomRangeNum(maxX, minX);
//       el.body.position.z = randomRangeNum(maxZ, minZ);
//     }

//     el.mesh.position.copy(el.body.position);
//     el.mesh.quaternion.copy(el.body.quaternion);
//   });
// };

// /*Scene Setup*/
// const scene = new THREE.Scene();
// const world = new CANNON.World({
//   gravity: new CANNON.Vec3(0, -9.82, 0)
// })

// const cannonDebugger = new CannonDebugger(scene, world, {
//   color: "#AEE2FF",
//   scale: 1,
// });  


// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// camera.position.z = 4.5;
// camera.position.y = 1.5;


// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setAnimationLoop( animate );
// document.body.appendChild( renderer.domElement );


// const controls = new OrbitControls(camera, renderer.domElement);

// /*Ground*/
// const groundBody = new CANNON.Body({
//   mass: 0, // Đặt khối lượng bằng 0 để giữ cố định mặt đất
//   shape: new CANNON.Box(new CANNON.Vec3(15, 0.5, 15)),
//   position: new CANNON.Vec3(0, -1, 0),
// });

// const ground = new THREE.Mesh( 
//   new THREE.BoxGeometry( 30, 1, 30 ), 
//   new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) 
// );
// ground.position.y =-1
// scene.add( ground );

// world.addBody(groundBody);


// /*Player*/ 
// const playerBody = new CANNON.Body({
//   mass: 1,
//   shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25)),
//   // position: new CANNON.Vec3(0, 0.25, 0), // Đặt y > 0 để tránh rơi qua mặt đất
//   fixedRotation: true,  
// });
// world.addBody(playerBody);

// const player = new THREE.Mesh( 
//   new THREE.BoxGeometry( 0.5, 0.5, 0.5 ), 
//   new THREE.MeshBasicMaterial( { color: 0xff0000 } ) 
// );
// scene.add(player);


// playerBody.addEventListener("collide", (e) => {
//   powerups.forEach((el) => {
//     if (e.body === el.body) {
//       el.body.position.x = randomRangeNum(8, -8);
//       el.body.position.z = randomRangeNum(-5, -10);
//       el.mesh.position.copy(el.body.position);
//       el.mesh.quaternion.copy(el.body.quaternion);
//       points += 1;
//       pointsUI.textContent = points.toString();
//     }
//   });

//   enemies.forEach((el) => {
//     if (e.body === el.body) {
//       gameOver = true;
//     }
//   });
// })


// /*Powerup*/
// const powerups = []
// for (let i = 0; i < 10; i++) {
//   const posX = randomRangeNum(8, -8);
//   const posZ = randomRangeNum(-8, -12); // random ra vị trí của những đối tượng chạy tới theo trục Z

//   const powerup = new THREE.Mesh(
//     new THREE.TorusGeometry(1, 0.4, 16, 50),
//     new THREE.MeshBasicMaterial( { color: 0xfff000 })
//   );

//   powerup.scale.set(0.1, 0.1, 0.1);
//   powerup.position.x = posX;
//   powerup.position.z = posZ;
//   powerup.name = "powerup" + [i + 1];
//   scene.add(powerup);

//   const powerupBody = new CANNON.Body({
//     shape: new CANNON.Sphere(0.2),
//   });
//   powerupBody.position.set(posX, 0, posZ);
//   world.addBody(powerupBody);

//   const powerupObject = {
//     mesh: powerup,
//     body: powerupBody,
//   };

//   powerups.push(powerupObject);
  
// }

// /*Enemy*/
// const enemies = [];
// for (let i = 0; i < 3; i++) {
//   const posX = randomRangeNum(8, -8);
//   const posZ = randomRangeNum(-8, -12);

//   const enemy = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial( { color: 0x0000ff })
//   );

//   enemy.position.x = posX;
//   enemy.position.z = posZ;
//   enemy.name = "enemy" + [i + 1];
//   scene.add(enemy);

//   const enemyBody = new CANNON.Body({
//     shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
//   });
  
//   enemyBody.position.set(posX, 0, posZ);
//   world.addBody(enemyBody);

//   const enemyObject = {
//     mesh: enemy,
//     body: enemyBody,
//   };

//   enemies.push(enemyObject);
// }



//   // /*Grid Helper*/ 
//   // const gridHelper = new THREE.GridHelper(30, 30);
//   // scene.add(gridHelper);

//   /*Particles*/
//   scene.fog = new THREE.FogExp2(0x0047ab, 0.09, 50);

//   const geometry = new THREE.BufferGeometry();
//   const vertices = [];
//   const size = 2000;
  
//   for (let i = 0; i < 5000; i++) {
//     const x = (Math.random() * size + Math.random() * size) / 2 - size / 2;
//     const y = (Math.random() * size + Math.random() * size) / 2 - size / 2;
//     const z = (Math.random() * size + Math.random() * size) / 2 - size / 2;
  
//     vertices.push(x, y, z);
//   }
  
//   geometry.setAttribute(
//     "position",
//     new THREE.Float32BufferAttribute(vertices, 3)
//   );
  
//   const material = new THREE.PointsMaterial({
//     size: 2,
//     color: 0xffffff
//   });
  
//   const particles = new THREE.Points(geometry, material);
//   scene.add(particles);



// camera.position.z = 5;


// /*Animate Loop*/ 
// function animate() {
//   requestAnimationFrame( animate );

//   particles.rotation.x += .000001;
//   particles.rotation.y += .000001;
//   particles.rotation.z += .000005;

//   if (!gameOver) {
//     moveObstacles (powerups, 0.001, 8, -8, -5, -10); 
//     moveObstacles (enemies, 0.0011, 8, -8, -5, -10);
//   } else {
//     pointsUI.textContent = "GAME OVER";
//     playerBody.velocity.set(playerBody.position.x, 5, 5);

//     enemies.forEach((el) => {
//     scene.remove(el.mesh);
//     world.removeBody (el.body);
//     });

//     powerups.forEach((el) => {
//     scene.remove(el.mesh);
//     world.removeBody (el.body);
//     });

//     if (playerBody.position.z > camera.position.z) {
//       scene.remove(player);
//       world.removeBody(playerBody);
//     }    
//   }

//   controls.update();

//   world.fixedStep();

//   player.position.copy(playerBody.position);
//   player.quaternion.copy(playerBody.quaternion);

//   cannonDebugger.update();

// 	renderer.render( scene, camera );

// }

// animate();

// // Event listener
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// })

// window.addEventListener("keydown", (e) => {
//   if (e.key === "d" ||  e.key === "D" || e.key === "ArrowRight") {
//     playerBody.position.x += 0.5;
//   }

//   if (e.key === "a" ||  e.key === "A" || e.key === "ArrowLeft") {
//     playerBody.position.x -= 0.5;
//   }

//   if (e.key === "r" || e.key === "R") {
//     playerBody.position.set(0, 0, 0);  // Đặt lại vị trí của playerBody
//     player.position.copy(playerBody.position);  // Đảm bảo player.position cũng được cập nhật
//   }
  

//   if (e.key === " ") {
//     playerBody.position.y = 2;
//   }

//   // if (e.key === "s" ||  e.key === "S" || e.key === "ArrowDown") {
//   //   player.position.z += 1;
//   // }

//   // if (e.key === "w" ||  e.key === "W" || e.key === "ArrowUp") {
//   //   player.position.z -= 1;
//   // }
// });



// Khởi tạo ma trận 10x10
const size = 11;
// const sizeX = 10;
// const sizeY = 20;
const maze = Array.from({ length: size }, () => Array(size).fill(''));

// Đặt vị trí ban đầu cho player và các thực thể khác
const player = { x: 0, y: 0 };
const enemies = [
  { x: 2, y: 2, direction: 'right' },
  { x: 5, y: 5, direction: 'down' },
  { x: 7, y: 3, direction: 'left' },
  { x: 1, y: 8, direction: 'up' },
  { x: 2, y: 10, direction: 'right' },
  { x: 4, y: 8, direction: 'down' },
  { x: 3, y: 19, direction: 'left' },
  { x: 1, y: 10, direction: 'right' },
  { x: 6, y: 8, direction: 'down' },
  { x: 12, y: 6, direction: 'left' },
  { x: 18, y: 7, direction: 'up' },
];
const exit = { x: 10, y: 10 };

// Tạo 5 ô chướng ngại vật ngẫu nhiên
const obstacles = [];
while (obstacles.length < 30) {
  const x = Math.floor(Math.random() * size);
  const y = Math.floor(Math.random() * size);
  if ((x !== player.x || y !== player.y) && (x !== exit.x || y !== exit.y) && !obstacles.some(o => o.x === x && o.y === y)) {
    obstacles.push({ x, y });
  }
}

// Hàm tạo giao diện ma trận
function renderMaze() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Xóa giao diện cũ

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Kiểm tra các ô và thêm các lớp tương ứng
      if (x === player.x && y === player.y) {
        cell.classList.add('player');
        cell.textContent = 'P';
      } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
        cell.classList.add('enemy');
        cell.textContent = 'E';
      } else if (x === exit.x && y === exit.y) {
        cell.classList.add('exit');
        cell.textContent = 'X';
      } else if (obstacles.some(o => o.x === x && o.y === y)) {
        cell.classList.add('obstacle');
        cell.textContent = 'O'; // Đặt ký tự 'O' cho ô chướng ngại vật
      }

      container.appendChild(cell);
    }
  }
}

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();


// Hàm kiểm tra và di chuyển enemy
function moveEnemies() {
  enemies.forEach(enemy => {
    let { x, y } = enemy;

    // Tạo một mảng các hướng di chuyển có thể (up, down, left, right)
    const directions = ['up', 'down', 'left', 'right'];

    // Chọn một hướng ngẫu nhiên
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    // Di chuyển theo hướng ngẫu nhiên
    if (randomDirection === 'right') {
      x++;
    } else if (randomDirection === 'down') {
      y++;
    } else if (randomDirection === 'left') {
      x--;
    } else if (randomDirection === 'up') {
      y--;
    }

    // Kiểm tra nếu enemy di chuyển ra ngoài ma trận hoặc gặp ô exit
    if (x >= size || x < 0 || y >= size || y < 0 || (x === exit.x && y === exit.y)) {
      // Nếu gặp lỗi, quay lại vị trí cũ (không di chuyển)
      return;
    }

    // Cập nhật vị trí enemy
    enemy.x = x;
    enemy.y = y;

    // Kiểm tra nếu enemy đụng trúng player
    if (x === player.x && y === player.y) {
      alert('Game Over!');
      window.location.reload();
    }
  });

  renderMaze();
}

// Di chuyển enemies định kỳ
setInterval(moveEnemies, 500);

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();


// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Hàm tìm đường đi ngắn nhất từ player đến exit bằng Hill Climbing
// function findPath() {
//   let path = [];
//   let visited = Array.from({ length: size }, () => Array(size).fill(false));
//   let current = { x: player.x, y: player.y };

//   while (current.x !== exit.x || current.y !== exit.y) {
//     path.push({ x: current.x, y: current.y });
//     visited[current.y][current.x] = true;

//     // Tìm ô kế tiếp tốt nhất dựa trên khoảng cách heuristic
//     let neighbors = [
//       { x: current.x + 1, y: current.y },
//       { x: current.x - 1, y: current.y },
//       { x: current.x, y: current.y + 1 },
//       { x: current.x, y: current.y - 1 }
//     ];

//     neighbors = neighbors.filter(
//       (n) => n.x >= 0 && n.x < size && n.y >= 0 && n.y < size && !visited[n.y][n.x]
//     );

//     if (neighbors.length === 0) break; // Không còn ô để tiếp tục

//     // Chọn ô có giá trị heuristic tốt nhất
//     let bestNeighbor = neighbors.reduce((best, n) => {
//       return calculateHeuristic(n.x, n.y, exit.x, exit.y) <
//         calculateHeuristic(best.x, best.y, exit.x, exit.y)
//         ? n
//         : best;
//     });

//     current = bestNeighbor;
//   }

//   if (current.x === exit.x && current.y === exit.y) {
//     path.push({ x: exit.x, y: exit.y });
//   }

//   return path;
// }

// function findPath() {
//   let path = [];
//   let visited = Array.from({ length: size }, () => Array(size).fill(false));
//   let current = { x: player.x, y: player.y };

//   while (current.x !== exit.x || current.y !== exit.y) {
//     path.push({ x: current.x, y: current.y });
//     visited[current.y][current.x] = true;

//     // Tìm tất cả các ô lân cận
//     let neighbors = [
//       { x: current.x + 1, y: current.y },
//       { x: current.x - 1, y: current.y },
//       { x: current.x, y: current.y + 1 },
//       { x: current.x, y: current.y - 1 }
//     ];

//     // Lọc ra các ô hợp lệ (nằm trong ma trận và chưa được thăm)
//     neighbors = neighbors.filter(
//       (n) =>
//         n.x >= 0 &&
//         n.x < size &&
//         n.y >= 0 &&
//         n.y < size &&
//         !visited[n.y][n.x] &&
//         !obstacles.some(o => o.x === n.x && o.y === n.y) // Loại bỏ ô chướng ngại vật
//     );

//     if (neighbors.length === 0) break; // Không còn ô để tiếp tục, kết thúc

//     // Chọn ô có giá trị heuristic tốt nhất (leo đồi dốc đứng)
//     let bestNeighbor = neighbors.reduce((best, n) => {
//       return calculateHeuristic(n.x, n.y, exit.x, exit.y) <
//         calculateHeuristic(best.x, best.y, exit.x, exit.y)
//         ? n
//         : best;
//     });

//     // Nếu không có ô nào tốt hơn hiện tại, dừng lại (tìm kiếm bế tắc)
//     if (
//       calculateHeuristic(bestNeighbor.x, bestNeighbor.y, exit.x, exit.y) >=
//       calculateHeuristic(current.x, current.y, exit.x, exit.y)
//     ) {
//       break;
//     }

//     current = bestNeighbor;
//   }

//   if (current.x === exit.x && current.y === exit.y) {
//     path.push({ x: exit.x, y: exit.y });
//   }

//   return path;
// }

// // Hàm vẽ đường đi lên giao diện
// function renderPath(path) {
//   const container = document.getElementById('game-container');
//   path.forEach(({ x, y }) => {
//     const index = y * size + x;
//     const cell = container.children[index];
//     if (!cell.classList.contains('player') && !cell.classList.contains('exit')) {
//       cell.classList.add('path');
//     }
//   });
// }

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();


// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Hàm tìm đường đi ngắn nhất từ player đến exit bằng Hill Climbing
function findPath() {
  let path = [];
  let visited = Array.from({ length: size }, () => Array(size).fill(false));
  let current = { x: player.x, y: player.y };

  while (current.x !== exit.x || current.y !== exit.y) {
    path.push({ x: current.x, y: current.y });
    visited[current.y][current.x] = true;

    // Tìm ô kế tiếp tốt nhất dựa trên khoảng cách heuristic
    let neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    ];

    neighbors = neighbors.filter(
      (n) => n.x >= 0 && n.x < size && n.y >= 0 && n.y < size && !visited[n.y][n.x]
    );

    if (neighbors.length === 0) break; // Không còn ô để tiếp tục

    // Chọn ô có giá trị heuristic tốt nhất
    let bestNeighbor = neighbors.reduce((best, n) => {
      return calculateHeuristic(n.x, n.y, exit.x, exit.y) <
        calculateHeuristic(best.x, best.y, exit.x, exit.y)
        ? n
        : best;
    });

    current = bestNeighbor;
  }

  if (current.x === exit.x && current.y === exit.y) {
    path.push({ x: exit.x, y: exit.y });
  }

  return path;
}

// Hàm vẽ đường đi lên giao diện
function renderPath(path) {
  const container = document.getElementById('game-container');
  path.forEach(({ x, y }) => {
    const index = y * size + x;
    const cell = container.children[index];
    if (!cell.classList.contains('player') && !cell.classList.contains('exit')) {
      cell.classList.add('path');
    }
  });
}

// Cập nhật hàm di chuyển player để tránh ô chướng ngại vật
document.addEventListener('keydown', (event) => {
  const { key } = event;
  let newX = player.x;
  let newY = player.y;

  // Di chuyển player
  if (key === 'ArrowUp' && newY > 0) newY--;
  if (key === 'ArrowDown' && newY < size - 1) newY++;
  if (key === 'ArrowLeft' && newX > 0) newX--;
  if (key === 'ArrowRight' && newX < size - 1) newX++;

  // Kiểm tra nếu player gặp ô chướng ngại vật
  if (obstacles.some(o => o.x === newX && o.y === newY)) {
    return; // Nếu gặp chướng ngại vật, không di chuyển
  }

  // Cập nhật vị trí player
  player.x = newX;
  player.y = newY;

  // Kiểm tra điều kiện thắng
  if (newX === exit.x && newY === exit.y) {
    alert('You Win!');
    window.location.reload();
  }

  // Kiểm tra nếu player đụng trúng enemy sau khi di chuyển
  // if (enemies.some(enemy => enemy.x === newX && enemy.y === newY)) {
  //   alert('Game Over!');
  //   window.location.reload();
  // }

  // Tìm và hiển thị đường đi ngắn nhất
  const path = findPath();
  renderMaze();
  renderPath(path);
});
// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();




