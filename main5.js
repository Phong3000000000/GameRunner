// Khởi tạo ma trận 10x10
// const size = 11;
const sizeX = 20;
const sizeY = 10;
const maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(''));



// Đặt vị trí ban đầu cho player và các thực thể khác
const player = { x: 0, y: 0 };
const enemies = [
  { x: 17, y: 2, direction: 'right' },
  { x: 5, y: 5, direction: 'down' },
  { x: 15, y: 7, direction: 'left' },
  { x: 17, y: 4, direction: 'up' },
  { x: 2, y: 9, direction: 'right' },
  { x: 4, y: 8, direction: 'down' },
  // { x: 3, y: 19, direction: 'left' },
  // { x: 1, y: 10, direction: 'right' },
  // { x: 6, y: 8, direction: 'down' },
  // { x: 12, y: 6, direction: 'left' },
  // { x: 18, y: 7, direction: 'up' },
];
const exit = { x: 19, y: 9 };

// Tạo 5 ô chướng ngại vật ngẫu nhiên
const obstacles = [];
while (obstacles.length < 50) {
  const x = Math.floor(Math.random() * sizeX);
  const y = Math.floor(Math.random() * sizeY);
  if ((x !== player.x || y !== player.y) && (x !== exit.x || y !== exit.y) && !obstacles.some(o => o.x === x && o.y === y)) {
    obstacles.push({ x, y });
  }
}

// Hàm tạo giao diện ma trận
function renderMaze() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Xóa giao diện cũ

  for (let y = 0; y < sizeY; y++) {
    for (let x = 0; x < sizeX; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Kiểm tra các ô và thêm các lớp tương ứng
      if (x === player.x && y === player.y) {
        cell.classList.add('player');
        // cell.textContent = 'P';
      } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
        cell.classList.add('enemy');
        // cell.textContent = 'E';
      } else if (x === exit.x && y === exit.y) {
        cell.classList.add('exit');
        // cell.textContent = 'X';
      } else if (obstacles.some(o => o.x === x && o.y === y)) {
        cell.classList.add('obstacle');
        // cell.textContent = 'O'; // Đặt ký tự 'O' cho ô chướng ngại vật
      }

      container.appendChild(cell);
    }
  }
}

// Gọi hàm để hiển thị ma trận ban đầu
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

let gameStarted = false;
// function moveEnemies() {
//     // Nếu game over, không thực hiện di chuyển
//     let gameOver = false;
  
//     // Duyệt qua từng enemy và di chuyển chúng
//     for (let enemy of enemies) {
//       if (gameOver) break; // Nếu đã game over, không kiểm tra tiếp enemy khác
  
//       // Tính toán đường đi từ enemy đến player
//       const path = aStar({ x: enemy.x, y: enemy.y }, { x: player.x, y: player.y }, obstacles);
  
//       // Di chuyển enemy nếu có đường đi
//       if (path.length > 1) {
//         enemy.x = path[1].x;
//         enemy.y = path[1].y;
//       }
  
//       // Kiểm tra nếu enemy đụng trúng player
//       if (enemy.x === player.x && enemy.y === player.y) {
//         alert('Game Over!');
//         window.location.reload(); // Reset game
//         gameOver = true; // Đặt cờ game over
//         break; // Dừng vòng lặp nếu đã game over
//       }
//     }
  
//     renderMaze(); // Cập nhật giao diện
// }
  
// Di chuyển enemies định kỳ
const btnStart = document.getElementById('btn_start');
document.addEventListener('click', () => {
    gameStarted = true;
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
  if (!gameStarted) return; 
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


