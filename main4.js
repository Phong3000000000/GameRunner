// Khởi tạo ma trận 10x20
const sizeX = 20; // Số cột
const sizeY = 10; // Số dòng
const maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(''));

// Đặt vị trí ban đầu cho player và các thực thể khác
const player = { x: 0, y: 0 };
const enemies = [
  { x: 2, y: 2, direction: 'right' },
  { x: 5, y: 5, direction: 'down' },
  { x: 7, y: 3, direction: 'left' },
  { x: 1, y: 8, direction: 'up' },
  // { x: 12, y: 19, direction: 'right' },
  // { x: 15, y: 5, direction: 'down' },
  // { x: 7, y: 13, direction: 'left' },
  // { x: 19, y: 18, direction: 'up' },
];
const exit = { x: 19, y: 9 }; // Cửa ra ở góc dưới bên phải

// Tạo 30 ô chướng ngại vật ngẫu nhiên
const obstacles = [];
while (obstacles.length < 50) {
  const x = Math.floor(Math.random() * sizeX);
  const y = Math.floor(Math.random() * sizeY);
  if (
    (x !== player.x || y !== player.y) &&
    (x !== exit.x || y !== exit.y) &&
    !obstacles.some((o) => o.x === x && o.y === y)
  ) {
    obstacles.push({ x, y });
  }
}

// Hàm tạo giao diện ma trận
// Hàm tạo giao diện ma trận
function renderMaze() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Xóa giao diện cũ
  container.style.gridTemplateColumns = `repeat(${sizeX}, 1fr)`;

  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x; // Gắn data-x cho ô
      cell.dataset.y = y; // Gắn data-y cho ô

      // Kiểm tra các ô và thêm các lớp tương ứng
      if (x === player.x && y === player.y) {
        cell.classList.add('player');
        cell.textContent = 'P';
      } else if (enemies.some((enemy) => enemy.x === x && enemy.y === y)) {
        cell.classList.add('enemy');
        cell.textContent = 'E';
      } else if (x === exit.x && y === exit.y) {
        cell.classList.add('exit');
        cell.textContent = 'X';
      } else if (obstacles.some((o) => o.x === x && o.y === y)) {
        cell.classList.add('obstacle');
        cell.textContent = 'O'; // Đặt ký tự 'O' cho ô chướng ngại vật
      }

      container.appendChild(cell);
    }
  }
}

// Cập nhật lại giao diện
renderMaze();

// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Hàm tìm đường đi ngắn nhất từ vị trí bất kỳ đến đích bằng A*
function aStar(start, goal, obstacles) {
  const openSet = [start];
  const cameFrom = {};
  const gScore = Array.from({ length: sizeY }, () => Array(sizeX).fill(Infinity));
  const fScore = Array.from({ length: sizeY }, () => Array(sizeX).fill(Infinity));

  gScore[start.y][start.x] = 0;
  fScore[start.y][start.x] = calculateHeuristic(start.x, start.y, goal.x, goal.y);

  while (openSet.length > 0) {
    const current = openSet.reduce((best, node) =>
      fScore[node.y][node.x] < fScore[best.y][best.x] ? node : best
    );

    if (current.x === goal.x && current.y === goal.y) {
      const path = [];
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom[`${temp.x},${temp.y}`];
      }
      return path.reverse();
    }

    openSet.splice(openSet.indexOf(current), 1);

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

  return [];
}

// Hàm kiểm tra và di chuyển enemies
function moveEnemies() {
  let gameOver = false;

  enemies.forEach((enemy) => {
    if (gameOver) return;

    const path = aStar({ x: enemy.x, y: enemy.y }, { x: player.x, y: player.y }, obstacles);

    if (path.length > 1) {
      enemy.x = path[1].x;
      enemy.y = path[1].y;
    }

    if (enemy.x === player.x && enemy.y === player.y) {
      alert('Game Over!');
      window.location.reload();
      gameOver = true;
    }
  });

  renderMaze();
}

// Di chuyển player
document.addEventListener('keydown', (event) => {
  const { key } = event;
  let newX = player.x;
  let newY = player.y;

  if (key === 'ArrowUp' && newY > 0) newY--;
  if (key === 'ArrowDown' && newY < sizeY - 1) newY++;
  if (key === 'ArrowLeft' && newX > 0) newX--;
  if (key === 'ArrowRight' && newX < sizeX - 1) newX++;

  if (obstacles.some((o) => o.x === newX && o.y === newY)) {
    return;
  }

  player.x = newX;
  player.y = newY;

  if (newX === exit.x && newY === exit.y) {
    alert('You Win!');
    window.location.reload();
  }

  renderMaze();
});

// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Hàm tìm đường đi ngắn nhất từ player đến exit bằng Hill Climbing
function findPath() {
  let path = [];
  let visited = Array.from({ length: sizeY }, () => Array(sizeX).fill(false)); // Thêm sizeY, sizeX để phù hợp với ma trận
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
      (n) => n.x >= 0 && n.x < sizeX && n.y >= 0 && n.y < sizeY && !visited[n.y][n.x] &&
             !obstacles.some((o) => o.x === n.x && o.y === n.y) // Kiểm tra không phải ô chướng ngại vật
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

// Hàm tô màu đường đi
function highlightPath(path) {
  const container = document.getElementById('game-container');
  const cells = container.querySelectorAll('.cell');
  
  cells.forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    const isPath = path.some(p => p.x === x && p.y === y);
    
    if (isPath) {
      cell.classList.add('path');
    } else {
      cell.classList.remove('path');
    }
  });
}

// Gọi hàm findPath và tô màu đường đi
const path = findPath();
highlightPath(path);

// Cập nhật lại giao diện
renderMaze();


// Di chuyển enemies định kỳ
setInterval(moveEnemies, 500);

// Lắng nghe sự kiện phím để xóa chướng ngại vật
// Lắng nghe sự kiện phím để xóa chướng ngại vật
document.addEventListener('keydown', (event) => {
  const { key } = event;
  let targetX = player.x;
  let targetY = player.y;

  // Xác định hướng kiểm tra và xóa
  if (key === 'w' || key === 'W') targetY--; // Phía trên
  else if (key === 'a' || key === 'A') targetX--; // Phía bên trái
  else if (key === 's' || key === 'S') targetY++; // Phía dưới
  else if (key === 'd' || key === 'D') targetX++; // Phía bên phải

  // Kiểm tra nếu ô mục tiêu nằm trong giới hạn ma trận
  if (targetX >= 0 && targetX < sizeX && targetY >= 0 && targetY < sizeY) {
    // Tìm chướng ngại vật tại vị trí mục tiêu
    const obstacleIndex = obstacles.findIndex(o => o.x === targetX && o.y === targetY);

    // Nếu tìm thấy chướng ngại vật, tiến hành xóa
    if (obstacleIndex !== -1) {
      obstacles.splice(obstacleIndex, 1); // Xóa chướng ngại vật khỏi danh sách
      console.log(`Obstacle at (${targetX}, ${targetY}) removed!`);

      // Nếu có ma trận đại diện cho mê cung, xóa tường tại đó
      if (maze[targetY] && maze[targetY][targetX] === 'O') { // Giả sử 'O' là tường
        maze[targetY][targetX] = ''; // Xóa tường (chuyển thành đường trống)
      }

      // Cập nhật giao diện
      renderMaze();
    }
  }
});


// Hiển thị giao diện ban đầu
renderMaze();
