// Kích thước ma trận
const sizeX = 60;
const sizeY = 28;

// Khởi tạo vị trí player, exit và enemies
const player = { x: 0, y: 0 };
const exit = { x: 19, y: 9 };
const enemies = [
  { x: 10, y: 25, direction: 'right' },
  { x: 10, y: 5, direction: 'down' },
  { x: 50, y: 25, direction: 'left' },
  { x: 50, y: 5, direction: 'up' },
];


// Đảm bảo player và exit nằm ngoài tường
function ensureValidPosition(position, maze) {
    while (
      position.y < 0 || 
      position.y >= maze.length || 
      position.x < 0 || 
      position.x >= maze[0].length || 
      maze[position.y][position.x] !== 0 // Đảm bảo là đường đi
    ) {
      position.x = Math.floor(Math.random() * (sizeX - 2)) + 1;
      position.y = Math.floor(Math.random() * (sizeY - 2)) + 1;
    }
  }
  

// Tạo mê cung bằng thuật toán DFS
function generateMaze(sizeX, sizeY) {
  const maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(1)); // 1 là tường, 0 là đường đi
  const directions = [
    { x: 0, y: -2 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: -2, y: 0 }
  ];
  
  function isValid(x, y) {
    return x > 0 && x < sizeX - 1 && y > 0 && y < sizeY - 1 && maze[y][x] === 1;
  }
  
  function breakWall(x1, y1, x2, y2) {
    maze[(y1 + y2) / 2][(x1 + x2) / 2] = 0; // Phá tường giữa hai ô
  }
  
  function dfs(x, y) {
    maze[y][x] = 0; // Đánh dấu ô là đường đi
    directions.sort(() => Math.random() - 0.5); // Trộn ngẫu nhiên hướng đi
    for (const dir of directions) {
      const nx = x + dir.x;
      const ny = y + dir.y;
      if (isValid(nx, ny)) {
        breakWall(x, y, nx, ny);
        dfs(nx, ny);
      }
    }
  }
  dfs(1, 1); // Bắt đầu tạo mê cung từ vị trí (1, 1)
  // Phá thêm tường ngẫu nhiên để tạo nhiều đường đi hơn
  for (let i = 0; i < sizeX * sizeY * 0.1; i++) { // Tỷ lệ phá tường thêm (10% số ô)
    const x = Math.floor(Math.random() * sizeX);
    const y = Math.floor(Math.random() * sizeY);
    if (maze[y][x] === 1) {
      maze[y][x] = 0; // Phá tường
    }
  }
  return maze;
}



// Tạo mê cung và chuyển đổi thành chướng ngại vật
// Cập nhật danh sách chướng ngại vật
const maze = generateMaze(sizeX, sizeY);
const obstacles = [];
for (let y = 0; y < sizeY; y++) {
  for (let x = 0; x < sizeX; x++) {
    if (maze[y][x] === 1) {
      obstacles.push({ x, y });
    }
  }
}



// Hàm hiển thị mê cung
function renderMaze() {
  const container = document.getElementById('game-container');
  container.innerHTML = '';
  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (x === player.x && y === player.y) {
        cell.classList.add('player');
      } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
        cell.classList.add('enemy');
      } else if (x === exit.x && y === exit.y) {
        cell.classList.add('exit');
      } else if (obstacles.some(o => o.x === x && o.y === y)) {
        cell.classList.add('obstacle');
      }
      container.appendChild(cell);
    }
  }
}



// Đảm bảo có đường đi giữa hai vị trí bằng cách phá tường
function ensurePath(maze, start, end) {
    const path = aStar(start, end, obstacles);
    if (path.length === 0) {
      // Phá tường để tạo lối đi
      let current = { ...start };
      while (current.x !== end.x || current.y !== end.y) {
        maze[current.y][current.x] = 0; // Mở ô hiện tại
  
        // Di chuyển theo hướng ngắn nhất đến đích
        if (current.x < end.x) current.x++;
        else if (current.x > end.x) current.x--;
        else if (current.y < end.y) current.y++;
        else if (current.y > end.y) current.y--;
      }
      maze[end.y][end.x] = 0; // Đảm bảo điểm đích cũng là đường đi
    }
  }
  
  // Khởi tạo vị trí đảm bảo nằm trên đường đi
  function ensureValidPosition(position, maze) {
    do {
      position.x = Math.floor(Math.random() * (sizeX - 2)) + 1;
      position.y = Math.floor(Math.random() * (sizeY - 2)) + 1;
    } while (maze[position.y][position.x] !== 0); // Đảm bảo là đường đi
  }
  
  // Đảm bảo không có thực thể nào bị bao quanh bởi tường
  function ensureEntitiesUnblocked(maze, entities) {
    for (const entity of entities) {
      let validNeighbors = [
        { x: entity.x + 1, y: entity.y },
        { x: entity.x - 1, y: entity.y },
        { x: entity.x, y: entity.y + 1 },
        { x: entity.x, y: entity.y - 1 },
      ].filter((n) =>
        n.x >= 0 &&
        n.x < sizeX &&
        n.y >= 0 &&
        n.y < sizeY &&
        maze[n.y][n.x] === 0
      );
  
      if (validNeighbors.length === 0) {
        // Phá tường xung quanh nếu bị bao quanh
        validNeighbors = [
          { x: entity.x + 1, y: entity.y },
          { x: entity.x - 1, y: entity.y },
          { x: entity.x, y: entity.y + 1 },
          { x: entity.x, y: entity.y - 1 },
        ];
        for (const n of validNeighbors) {
          if (n.x >= 0 && n.x < sizeX && n.y >= 0 && n.y < sizeY) {
            maze[n.y][n.x] = 0; // Mở tường
          }
        }
      }
    }
  }
  
  // Gọi hàm đảm bảo sau khi khởi tạo
  ensureValidPosition(player, maze);       // Đảm bảo player nằm ngoài tường
  ensureValidPosition(exit, maze);         // Đảm bảo exit nằm ngoài tường
  ensurePath(maze, player, exit);          // Đảm bảo có đường nối giữa player và exit
  ensureEntitiesUnblocked(maze, [player, exit, ...enemies]); // Đảm bảo các thực thể không bị bao quanh
  renderMaze();


// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function aStar(start, goal, obstacles) {
  const openSet = [start]; // Mảng các node chưa được duyệt
  const cameFrom = {}; // Lưu trữ đường đi
  const gScore = Array.from({ length: sizeY }, () => Array(sizeX).fill(Infinity));  // Đánh giá chi phí từ start đến node
  const fScore = Array.from({ length: sizeY }, () => Array(sizeX).fill(Infinity)); // Đánh giá chi phí từ start đến goal qua node


  gScore[start.y][start.x] = 0; // Chi phí từ start đến start là 0
  fScore[start.y][start.x] = calculateHeuristic(start.x, start.y, goal.x, goal.y); // Chi phí dự đoán từ start đến goal

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
        !obstacles.some((o) => o.x === n.x && o.y === n.y)
    );

    for (const neighbor of neighbors) {
        const tentativeGScore = gScore[current.y][current.x] + 1;  // Cập nhật chi phí tạm thời đến ô kề
  
        if (tentativeGScore < gScore[neighbor.y][neighbor.x]) {
          cameFrom[`${neighbor.x},${neighbor.y}`] = current;  // Lưu lại node trước đó
          gScore[neighbor.y][neighbor.x] = tentativeGScore;  // Cập nhật gScore
          fScore[neighbor.y][neighbor.x] =
            tentativeGScore + calculateHeuristic(neighbor.x, neighbor.y, goal.x, goal.y);  // Cập nhật fScore
  
          if (!openSet.some((n) => n.x === neighbor.x && n.y === neighbor.y)) {
            openSet.push(neighbor);  // Thêm neighbor vào openSet nếu chưa có
          }
        }
    }
  }

  return []; // Không tìm được đường
}

let isGameOver = false; 
function moveEnemies() {
  if (isGameOver) return; // Nếu đã game over, không tiếp tục

  // Duyệt qua từng enemy và di chuyển chúng
  for (let enemy of enemies) {
      // Tính toán đường đi từ enemy đến player
      const path = aStar({ x: enemy.x, y: enemy.y }, { x: player.x, y: player.y }, obstacles);

      // Di chuyển enemy nếu có đường đi
      if (path.length > 1) {
          enemy.x = path[1].x;
          enemy.y = path[1].y;
      }

      // Kiểm tra nếu enemy đụng trúng player
      if (enemy.x === player.x && enemy.y === player.y) {
          isGameOver = true; // Đặt trạng thái game over
          alert('Game Over!');
          window.location.reload(); // Reset game
          break; // Dừng vòng lặp nếu đã game over
      }
  }

  renderMaze(); // Cập nhật giao diện
}
  
// Di chuyển enemies định kỳ
const btnStart = document.getElementById('btn_start');
document.addEventListener('click', () => {
    setInterval(moveEnemies, 300);
});

// setInterval(moveEnemies, 300);
// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();

// Hàm tính khoảng cách Manhattan
function calculateHeuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();

// Hàm tìm đường đi ngắn nhất từ player đến exit bằng Hill Climbing
function findPath() {
    let path = [];
    let visited = Array.from({ length: sizeY }, () => Array(sizeX).fill(false)); // Sửa lại kích thước
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
        (n) => n.x >= 0 && n.x < sizeX && n.y >= 0 && n.y < sizeY && 
               !visited[n.y][n.x] && !obstacles.some(o => o.x === n.x && o.y === n.y)
      );
  
      if (neighbors.length === 0) break; // Không còn ô để tiếp tục
  
      // Chọn ô có giá trị heuristic tốt nhất
      let bestNeighbor = neighbors.reduce((best, n) => {
        return calculateHeuristic(n.x, n.y, exit.x, exit.y) <
               calculateHeuristic(best.x, best.y, exit.x, exit.y) ? n : best; 
      });
  
      current = bestNeighbor;
    }
  
    if (current.x === exit.x && current.y === exit.y) {
      path.push({ x: exit.x, y: exit.y });
    }
  
    return path;
    // const path = aStar({ x: player.x, y: player.y }, exit, obstacles);
    // return path.length > 0 ? path : [];
}
  

// Hàm vẽ đường đi lên giao diện
function renderPath(path) {
  const container = document.getElementById('game-container');
  path.forEach(({ x, y }) => {
    const index = x + y * sizeX;
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
  if (key === 'ArrowDown' && newY < sizeY - 1) newY++;
  if (key === 'ArrowLeft' && newX > 0) newX--;
  if (key === 'ArrowRight' && newX < sizeX - 1) newX++;

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

  // Tìm và hiển thị đường đi ngắn nhất
  const path = findPath();
  renderMaze();
  renderPath(path);
});

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();

// Xử lý phím W, A, S, D để phá chướng ngại vật theo hướng
document.addEventListener('keydown', (event) => {
  const { key } = event;
  let targetX = player.x;
  let targetY = player.y;

  // Xác định hướng kiểm tra dựa trên phím nhấn
  if (key === 'w' || key === 'W') targetY--; // Kiểm tra ô phía trên
  else if (key === 'a' || key === 'A') targetX--; // Kiểm tra ô phía bên trái
  else if (key === 's' || key === 'S') targetY++; // Kiểm tra ô phía bên dưới
  else if (key === 'd' || key === 'D') targetX++; // Kiểm tra ô phía bên phải

  // Kiểm tra nếu ô mục tiêu nằm trong giới hạn ma trận
  if (targetX >= 0 && targetX < sizeX && targetY >= 0 && targetY < sizeY) {
    // Tìm chướng ngại vật tại vị trí mục tiêu
    const obstacleIndex = obstacles.findIndex(o => o.x === targetX && o.y === targetY);
    if (obstacleIndex !== -1) {
      // Xóa chướng ngại vật khỏi danh sách
      obstacles.splice(obstacleIndex, 1);
      console.log(`Obstacle at (${targetX}, ${targetY}) removed!`);

      // Cập nhật giao diện
      renderMaze();
    }
  }
});

// Gọi hàm để hiển thị ma trận ban đầu
renderMaze();


