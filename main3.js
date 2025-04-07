// Khởi tạo ma trận 10x20
const sizeX = 20;
const sizeY = 10;
// const maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(''));
// Tạo mê cung bằng DFS
const maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(0)); // 0: Tường, 1: Đường đi
const visited = Array.from({ length: sizeY }, () => Array(sizeX).fill(false));
const directions = [
  [0, -1], // Up
  [0, 1],  // Down
  [-1, 0], // Left
  [1, 0],  // Right
];

// Kiểm tra xem một ô có hợp lệ để duyệt không
function isValid(x, y) {
  return (
    x >= 0 &&
    x < sizeX &&
    y >= 0 &&
    y < sizeY &&
    !visited[y][x]
  );
}

// Thuật toán DFS tạo mê cung
function dfs(x, y) {
  visited[y][x] = true;
  maze[y][x] = 1; // Đánh dấu ô hiện tại là đường đi
  // Trộn ngẫu nhiên hướng đi
  directions.sort(() => Math.random() - 0.5);

  for (const [dx, dy] of directions) {
    const nx = x + 2 * dx;
    const ny = y + 2 * dy;

    if (isValid(nx, ny)) {
      // Tạo đường nối giữa các ô
      maze[y + dy][x + dx] = 1;
      dfs(nx, ny);
    }
  }
}

// Xóa một số tường ngẫu nhiên để làm mềm mê cung
function removeRandomWalls(count) {
  let wallRemoved = 0;
  while (wallRemoved < count) {
    const randomX = Math.floor(Math.random() * sizeX);
    const randomY = Math.floor(Math.random() * sizeY);

    if (maze[randomY][randomX] === 0) { // Chỉ xóa nếu là tường
      maze[randomY][randomX] = 1;
      wallRemoved++;
    }
  }
}

// Khởi tạo mê cung
function generateMaze() {
  // Bắt đầu từ một điểm ngẫu nhiên
  const startX = Math.floor(Math.random() * sizeX);
  const startY = Math.floor(Math.random() * sizeY);
  dfs(startX, startY);

  // Loại bỏ tường ngẫu nhiên để tăng tính mềm mại
  removeRandomWalls(Math.floor(sizeX * sizeY * 0.1));

  // Đảm bảo player và exit không bị chặn
  maze[player.y][player.x] = 1;
  maze[exit.y][exit.x] = 1;
}

// Đặt vị trí ban đầu cho player và các thực thể khác
const player = { x: 0, y: 0 };
const enemies = [
  { x: 2, y: 2, direction: 'right' },
  { x: 5, y: 5, direction: 'down' },
  { x: 7, y: 3, direction: 'left' },
  { x: 1, y: 8, direction: 'up' },
];
const exit = { x: sizeX - 1, y: sizeY - 1 }; // Exit ở góc dưới cùng bên phải

// Tạo 30 ô chướng ngại vật ngẫu nhiên
const obstacles = [];
while (obstacles.length < 20) {
  const x = Math.floor(Math.random() * sizeX);
  const y = Math.floor(Math.random() * sizeY);
  if ((x !== player.x || y !== player.y) && (x !== exit.x || y !== exit.y) && !obstacles.some(o => o.x === x && o.y === y)) {
    obstacles.push({ x, y });
  }
}

// Hàm tạo giao diện ma trận
// function renderMaze() {
//   const container = document.getElementById('game-container');
//   container.innerHTML = ''; // Xóa giao diện cũ
//   container.style.gridTemplateColumns = `repeat(${sizeX}, 1fr)`; // Cập nhật layout grid

//   for (let y = 0; y < sizeY; y++) {
//     for (let x = 0; x < sizeX; x++) {
//       const cell = document.createElement('div');
//       cell.classList.add('cell');

//       // Kiểm tra các ô và thêm các lớp tương ứng
//       if (x === player.x && y === player.y) {
//         cell.classList.add('player');
//         cell.textContent = 'P';
//       } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
//         cell.classList.add('enemy');
//         cell.textContent = 'E';
//       } else if (x === exit.x && y === exit.y) {
//         cell.classList.add('exit');
//         cell.textContent = 'X';
//       } else if (obstacles.some(o => o.x === x && o.y === y)) {
//         cell.classList.add('obstacle');
//         cell.textContent = 'O'; // Đặt ký tự 'O' cho ô chướng ngại vật
//       }

//       container.appendChild(cell);
//     }
//   }
// }
function renderMaze() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Xóa giao diện cũ
  container.style.gridTemplateColumns = `repeat(${sizeX}, 1fr)`; // Cập nhật layout grid

  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Phân loại ô
      if (x === player.x && y === player.y) {
        cell.classList.add('player');
        cell.textContent = 'P';
      } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
        cell.classList.add('enemy');
        cell.textContent = 'E';
      } else if (x === exit.x && y === exit.y) {
        cell.classList.add('exit');
        cell.textContent = 'X';
      } else if (maze[y][x] === 0) { // Tường
        cell.classList.add('obstacle');
        cell.textContent = 'O';
      } else {
        cell.textContent = ''; // Đường đi
      }

      container.appendChild(cell);
    }
  }
}
// Tạo mê cung với DFS và hiển thị
generateMaze();
renderMaze();


// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Hàm tìm hướng di chuyển tốt nhất của enemy để bắt player
function findBestMove(enemy, player) {
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 },  // right
  ];

  let bestMove = null;
  let minDistance = Infinity;

  directions.forEach(dir => {
    const newX = enemy.x + dir.x;
    const newY = enemy.y + dir.y;

    // Kiểm tra tính hợp lệ của vị trí mới (không phải tường và không phải chướng ngại vật)
    if (
      newX >= 0 &&
      newX < sizeX &&
      newY >= 0 &&
      newY < sizeY &&
      maze[newY][newX] === 1 && // Không phải tường
      !obstacles.some(o => o.x === newX && o.y === newY) // Không phải chướng ngại vật
    ) {
      const distance = calculateHeuristic(newX, newY, player.x, player.y);
      if (distance < minDistance) {
        minDistance = distance;
        bestMove = { x: newX, y: newY };
      }
    }
  });

  return bestMove;
}

function aStar(start, goal, obstacles) {
  const openSet = [start];
  const cameFrom = {};
  const gScore = Array.from({ length: size }, () => Array(size).fill(Infinity));
  const fScore = Array.from({ length: size }, () => Array(size).fill(Infinity));

  gScore[start.y][start.x] = 0;
  fScore[start.y][start.x] = calculateHeuristic(start.x, start.y, goal.x, goal.y);

  while (openSet.length > 0) {
    // Lấy node có fScore nhỏ nhất
    const current = openSet.reduce((best, node) =>
      fScore[node.y][node.x] < fScore[best.y][best.x] ? node : best
    );

    // Nếu tìm thấy đích
    if (current.x === goal.x && current.y === goal.y) {
      // Truy ngược đường đi
      const path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom[`${temp.x},${temp.y}`];
      }
      return path.reverse(); // Trả về đường đi
    }

    // Loại bỏ current khỏi openSet
    openSet.splice(openSet.indexOf(current), 1);

    // Lấy các ô kề hợp lệ
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ].filter(
      (n) =>
        n.x >= 0 &&
        n.x < sizeX &&
        n.y >= 0 &&
        n.y < sizeY &&
        maze[n.y][n.x] === 1 && // Không phải tường
        !obstacles.some((o) => o.x === n.x && o.y === n.y)
    );
    
    for (const neighbor of neighbors) {
      const tentativeGScore = gScore[current.y][current.x] + 1;

      if (tentativeGScore < gScore[neighbor.y][neighbor.x]) {
        cameFrom[`${neighbor.x},${neighbor.y}`] = current;
        gScore[neighbor.y][neighbor.x] = tentativeGScore;
        fScore[neighbor.y][neighbor.x] =
          tentativeGScore + calculateHeuristic(neighbor.x, neighbor.y, goal.x, goal.y);

        if (!openSet.some((n) => n.x === neighbor.x && n.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return []; // Không tìm được đường
}

// Hàm kiểm tra và di chuyển enemy
function moveEnemies() {
  enemies.forEach((enemy) => {
    const bestMove = findBestMove(enemy, player);

    if (bestMove) {
      enemy.x = bestMove.x;
      enemy.y = bestMove.y;
    }

    // Kiểm tra nếu enemy đụng trúng player
    if (enemy.x === player.x && enemy.y === player.y) {
      alert('Game Over!');
      window.location.reload();
    }
  });

  renderMaze();
}

// Di chuyển enemies định kỳ
setInterval(moveEnemies, 500);

// Xử lý phím mũi tên để di chuyển player
// document.addEventListener('keydown', (event) => {
//   const { key } = event;
//   let newX = player.x;
//   let newY = player.y;

//   if (key === 'ArrowUp' && newY > 0) newY--;
//   if (key === 'ArrowDown' && newY < sizeY - 1) newY++;
//   if (key === 'ArrowLeft' && newX > 0) newX--;
//   if (key === 'ArrowRight' && newX < sizeX - 1) newX++;

//   // Kiểm tra nếu player gặp ô chướng ngại vật
//   if (obstacles.some(o => o.x === newX && o.y === newY)) {
//     return; // Nếu gặp chướng ngại vật, không di chuyển
//   }

//   // Cập nhật vị trí player
//   player.x = newX;
//   player.y = newY;

//   // Kiểm tra điều kiện thắng
//   if (newX === exit.x && newY === exit.y) {
//     alert('You Win!');
//     window.location.reload();
//   }

//   renderMaze();
// });

document.addEventListener('keydown', (event) => {
  const { key } = event;
  let newX = player.x;
  let newY = player.y;

  if (key === 'ArrowUp' && newY > 0) newY--;
  if (key === 'ArrowDown' && newY < sizeY - 1) newY++;
  if (key === 'ArrowLeft' && newX > 0) newX--;
  if (key === 'ArrowRight' && newX < sizeX - 1) newX++;

  // Kiểm tra nếu gặp chướng ngại vật
  if (obstacles.some(o => o.x === newX && o.y === newY)) {
    return; // Nếu gặp chướng ngại vật, không di chuyển
  }

  // Kiểm tra nếu gặp tường
  if (maze[newY][newX] === 0) {
    return; // Không thể di chuyển vào ô là tường
  }

  // Cập nhật vị trí player
  player.x = newX;
  player.y = newY;

  // Kiểm tra điều kiện thắng
  if (newX === exit.x && newY === exit.y) {
    alert('You Win!');
    window.location.reload();
  }

  renderMaze();
});



// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();
