/* =========================================================
   ゆっくりブロック(slow-blocks)
   ---------------------------------------------------------
   このファイルの先頭に「設定」をまとめています。
   数字を書きかえて保存し、ブラウザを再読み込みすると反映されます。
   ========================================================= */

/* =========================================================
   設定(ここの数字は自由に変えてかまいません)
   ========================================================= */

// ブロックが1段落ちる間隔(ミリ秒。1000 = 1秒)
// ※ この速さは、何個積んでも、レベルが上がっても、絶対に変わりません。
const FALL_INTERVAL_MS = 2000;

// ↓キーや ▼ボタンを「押している間だけ」1段落ちる間隔(ミリ秒)
// 離すと、すぐに上の FALL_INTERVAL_MS に戻ります。
const SOFT_DROP_INTERVAL_MS = 60;

// 「ゆっくり」ボタンを押したとき、落ちる間隔を何倍にするか(5倍なら 2秒 → 10秒)
const SLOW_MULTIPLIER = 5;
// 「ゆっくり」が続く長さ(ミリ秒。15000 = 15秒)。たったら自動で元の速さに戻ります
const SLOW_DURATION_MS = 15000;

// 「やり直し」で、何手前まで戻れるか
const UNDO_LIMIT = 20;

// レベルが上がる「置いたブロックの数」
// (レベルが上がると形が複雑になります。速さは変わりません)
const LEVEL2_COUNT = 20; // この数だけ置くと、レベル2になる
const LEVEL3_COUNT = 40; // この数だけ置くと、レベル3になる

// 盤面の大きさ(横のマス数と、縦のマス数)
const BOARD_COLS = 10;
const BOARD_ROWS = 20;

// ←→キーを押しっぱなしにしたとき、くり返しが始まるまでの時間(ミリ秒)
const KEY_REPEAT_DELAY_MS = 200;
// ←→キーを押しっぱなしにしたときの、くり返しの間隔(ミリ秒)
const KEY_REPEAT_INTERVAL_MS = 100;

// お知らせ(「レベル2になりました」など)を表示しておく時間(ミリ秒)
const TOAST_DURATION_MS = 2200;

// 盤面の1マスを、何ピクセルで描くか(画面での大きさは CSS で自動調整されます)
const CELL_SIZE = 30;

/* =========================================================
   ブロックの形
   ---------------------------------------------------------
   形は「マスの座標 [x, y] のリスト」で書きます。
   x は右へ行くほど大きく、y は下へ行くほど大きくなります。
   例:[[0, 0], [1, 0]] は、横に2マス並んだ形です。
   level は「その形が出てくるようになるレベル」です。
   color は、はじめの色です。
   ========================================================= */
const SHAPES = [
  // ----- レベル1:かんたんな形(1〜3マス) -----
  { id: "m1", name: "1マス(●)", level: 1, color: "#e69f00", cells: [[0, 0]] },
  { id: "d2", name: "2マス(━)", level: 1, color: "#56b4e9", cells: [[0, 0], [1, 0]] },
  { id: "t3i", name: "3マス 一直線", level: 1, color: "#009e73", cells: [[0, 0], [1, 0], [2, 0]] },
  { id: "t3l", name: "3マス L字", level: 1, color: "#cc79a7", cells: [[0, 0], [0, 1], [1, 1]] },

  // ----- レベル2:4マスの形(I・O・T・S・Z・J・L の7種類) -----
  { id: "I4", name: "4マス I", level: 2, color: "#a23b72", cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { id: "O4", name: "4マス O", level: 2, color: "#9aa83a", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { id: "T4", name: "4マス T", level: 2, color: "#2f7fbf", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { id: "S4", name: "4マス S", level: 2, color: "#e3735e", cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { id: "Z4", name: "4マス Z", level: 2, color: "#5b8c5a", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  { id: "J4", name: "4マス J", level: 2, color: "#e8b4c8", cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  { id: "L4", name: "4マス L", level: 2, color: "#b0784a", cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },

  // ----- レベル3:5マスの形(ペントミノ12種類) -----
  { id: "F5", name: "5マス F", level: 3, color: "#8d6e63", cells: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]] },
  { id: "I5", name: "5マス I", level: 3, color: "#26a69a", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
  { id: "L5", name: "5マス L", level: 3, color: "#ffb74d", cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]] },
  { id: "N5", name: "5マス N", level: 3, color: "#7e57c2", cells: [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]] },
  { id: "P5", name: "5マス P", level: 3, color: "#f06292", cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]] },
  { id: "T5", name: "5マス T", level: 3, color: "#aed581", cells: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]] },
  { id: "U5", name: "5マス U", level: 3, color: "#4dd0e1", cells: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]] },
  { id: "V5", name: "5マス V", level: 3, color: "#ba68c8", cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { id: "W5", name: "5マス W", level: 3, color: "#ffd54f", cells: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]] },
  { id: "X5", name: "5マス X", level: 3, color: "#ef5350", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
  { id: "Y5", name: "5マス Y", level: 3, color: "#5c6bc0", cells: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]] },
  { id: "Z5", name: "5マス Z", level: 3, color: "#bcaaa4", cells: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]] },
];

/* =========================================================
   ゲームの状態(いまの盤面や、落ちているブロックなど)
   ========================================================= */

// 盤面:board[y][x] に、置かれたブロックの形の id が入る(空いているマスは null)
// 色ではなく形の id を入れておくので、あとで色を変えると、置いたブロックの色も変わります。
let board = createEmptyBoard();

// いま落ちているブロック:{ shapeId, cells, x, y }
let current = null;

// 次に出てくるブロックの形の id
let nextShapeId = null;

// 置いたブロックの数
let placedCount = 0;

// 画面で選んだ「はじめのレベル」(1〜3)
let startLevel = 1;

// いまのレベル(1〜3)
let level = 1;

// ↓キー(▼ボタン)を押している間だけ true になる
let softDropping = false;

// 「やり直し」のための記録。ブロックを置く直前の様子を、新しい順に最大 UNDO_LIMIT 個まで覚えておく
// 1つの記録 = { board: 盤面の写し, placedCount: 置いた数, shapeId: 置いたブロックの形, nextShapeId: そのときの次のブロック }
let history = [];

// 一時停止中なら true
let paused = false;

// 盤面がいっぱいで、次のブロックを出せなくなったら true
let isFull = false;

// 模様モード:true のときは、横一列がそろっても消えない(はじめはオン)
let patternMode = true;

// 「ゆっくり」の残り時間(ミリ秒)。0 のときは、ゆっくりではない
let slowRemainingMs = 0;

// 前の段から、どれだけ時間がたったか(ミリ秒)
let fallTimer = 0;

// 前の画面更新の時刻
let lastTime = null;

/* =========================================================
   好きな色(ブラウザに保存する)
   ========================================================= */

// 色を保存するときの名前
const COLOR_STORAGE_KEY = "slowBlocks.colors";

// 自分で選んだ色:{ 形の id: "#rrggbb" }
let customColors = loadColors();

// 保存しておいた色を読みこむ。読めないとき(保存が使えないブラウザなど)は、空のままにする
function loadColors() {
  try {
    const text = window.localStorage.getItem(COLOR_STORAGE_KEY);
    if (!text) return {};
    const data = JSON.parse(text);
    const result = {};
    // 正しい形の色("#" + 6けた)だけを使う
    for (const shape of SHAPES) {
      const value = data && data[shape.id];
      if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) {
        result[shape.id] = value.toLowerCase();
      }
    }
    return result;
  } catch (error) {
    return {}; // 失敗しても、はじめの色で遊べる
  }
}

// 選んだ色を保存する。保存に失敗しても、ゲームはそのまま動く
function saveColors() {
  try {
    window.localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(customColors));
  } catch (error) {
    // 保存できなくても、何もしない(この画面を開いている間は、選んだ色が使われます)
  }
}

/* =========================================================
   画面の部品を取り出す
   ========================================================= */
const boardCanvas = document.getElementById("board");
const boardCtx = boardCanvas.getContext("2d");
const nextCanvas = document.getElementById("next");
const nextCtx = nextCanvas.getContext("2d");
const countValue = document.getElementById("count-value");
const levelValue = document.getElementById("level-value");
const startLevelSelect = document.getElementById("start-level");
const slowButton = document.getElementById("slow-button");
const slowLabel = document.getElementById("slow-label");
const undoButton = document.getElementById("undo-button");
const pauseButton = document.getElementById("pause-button");
const pauseOverlay = document.getElementById("pause-overlay");
const resumeButton = document.getElementById("resume-button");
const fullOverlay = document.getElementById("full-overlay");
const patternModeCheckbox = document.getElementById("pattern-mode");
const restartButtons = document.querySelectorAll(".js-restart");
const clearButtons = document.querySelectorAll(".js-clear");
const colorList = document.getElementById("color-list");
const colorResetButton = document.getElementById("color-reset");
const saveImageButtons = document.querySelectorAll(".js-save-image");
const toast = document.getElementById("toast");

// キャンバスの大きさ(ピクセル)を、盤面のマス数に合わせる
boardCanvas.width = BOARD_COLS * CELL_SIZE;
boardCanvas.height = BOARD_ROWS * CELL_SIZE;
nextCanvas.width = 120;
nextCanvas.height = 120;

/* =========================================================
   盤面とブロックの基本の処理
   ========================================================= */

// 空っぽの盤面を作る
function createEmptyBoard() {
  const rows = [];
  for (let y = 0; y < BOARD_ROWS; y++) {
    rows.push(new Array(BOARD_COLS).fill(null));
  }
  return rows;
}

// id から形をさがす
function getShape(shapeId) {
  return SHAPES.find((shape) => shape.id === shapeId);
}

// 形の色を返す(自分で選んだ色があれば、そちらを使う)
function getColor(shapeId) {
  return customColors[shapeId] || getShape(shapeId).color;
}

// マスの座標を、いちばん左上が [0, 0] になるようにずらす
function normalizeCells(cells) {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => [x - minX, y - minY]);
}

// 形の横幅と高さ(マス数)を調べる
function getSize(cells) {
  const width = Math.max(...cells.map((c) => c[0])) + 1;
  const height = Math.max(...cells.map((c) => c[1])) + 1;
  return { width, height };
}

// 形を右回りに90度回した、新しいマスのリストを作る
// (1マスのブロックは、回しても同じ形のままです)
function rotateCells(cells) {
  return normalizeCells(cells.map(([x, y]) => [-y, x]));
}

// 置いたブロックの数と「はじめのレベル」から、いまのレベルを決める
// (レベルで変わるのは、出てくるブロックの形だけです。速さは変わりません)
function calcLevel() {
  let byCount = 1;
  if (placedCount >= LEVEL3_COUNT) {
    byCount = 3;
  } else if (placedCount >= LEVEL2_COUNT) {
    byCount = 2;
  }
  return Math.max(startLevel, byCount);
}

// レベルを計算しなおす。上がったときは、お知らせを出す(ゲームは止めない)
function refreshLevel() {
  const newLevel = calcLevel();
  if (newLevel > level) {
    const message = newLevel === 2
      ? "レベル2になりました!4マスの形が出てきます"
      : "レベル3になりました!5マスの形が出てきます";
    showToast(message);
  }
  level = newLevel;
}

// 出てくるブロックの形を、ランダムに1つ選ぶ(いまのレベル以下の形から選ぶ)
function pickRandomShapeId() {
  const choices = SHAPES.filter((shape) => shape.level <= level);
  const index = Math.floor(Math.random() * choices.length);
  return choices[index].id;
}

// ブロックを、盤面の上のまん中に作る
function createPiece(shapeId) {
  const cells = normalizeCells(getShape(shapeId).cells);
  const { width } = getSize(cells);
  return {
    shapeId,
    cells,
    x: Math.floor((BOARD_COLS - width) / 2),
    y: 0,
  };
}

// ブロックを (x, y) の位置に置けるかどうか(壁や、置いたブロックにぶつからないか)
function canPlace(cells, x, y) {
  return cells.every(([cx, cy]) => {
    const bx = x + cx;
    const by = y + cy;
    if (bx < 0 || bx >= BOARD_COLS || by < 0 || by >= BOARD_ROWS) {
      return false; // 盤面の外
    }
    return board[by][bx] === null; // 空いていれば置ける
  });
}

// 次のブロックを出す
function spawnNextPiece() {
  current = createPiece(nextShapeId);
  nextShapeId = pickRandomShapeId();
  fallTimer = 0;
  // ↓を押したまま次のブロックになったときは、ふつうの速さに戻す(もう一度押すと速くなる)
  softDropping = false;

  if (!canPlace(current.cells, current.x, current.y)) {
    // 置く場所がない(盤面がいっぱい)。ゲームオーバーではなく「いっぱいになりました」と出す
    nextShapeId = current.shapeId; // 出せなかった形を「次のブロック」に戻しておく
    current = null;
    setFull(true);
  }
}

// 「いっぱいになりました」の表示を出したり消したりする
function setFull(value) {
  isFull = value;
  fullOverlay.hidden = !isFull;
  if (isFull) {
    stopAllInput();
  }
}

/* =========================================================
   ブロックを動かす
   ========================================================= */

// 左右に動かす(dx = -1 で左、1 で右)
function moveSideways(dx) {
  if (!current) return;
  if (canPlace(current.cells, current.x + dx, current.y)) {
    current.x += dx;
  }
}

// 回転させる。壁などにぶつかるときは、少し横や上にずらして回せないか試す
function rotate() {
  if (!current) return;
  const oldSize = getSize(current.cells);
  const newCells = rotateCells(current.cells);
  const newSize = getSize(newCells);

  // 回転の中心がだいたい同じになるように、位置を調整する
  const baseX = current.x + Math.floor((oldSize.width - newSize.width) / 2);
  // (盤面の上にはみ出さないよう、いちばん上より上には行かないようにする)
  const baseY = Math.max(0, current.y + Math.floor((oldSize.height - newSize.height) / 2));

  // ずらし方の候補(まずはそのまま、だめなら左右、さらに上)
  const tries = [
    [0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0],
    [0, -1], [-1, -1], [1, -1],
  ];
  for (const [dx, dy] of tries) {
    if (canPlace(newCells, baseX + dx, baseY + dy)) {
      current.cells = newCells;
      current.x = baseX + dx;
      current.y = baseY + dy;
      return;
    }
  }
  // どうしても回せないときは、何もしない
}

// 1段下に落とす。これ以上落ちられないときは、そこに置く
function stepDown() {
  if (!current) return;
  if (canPlace(current.cells, current.x, current.y + 1)) {
    current.y += 1;
  } else {
    lockPiece();
  }
}

// 盤面の写しを作る(元の盤面を変えても、写しは変わらない)
function copyBoard(source) {
  return source.map((row) => row.slice());
}

// いまのブロックを、盤面に置く(固定する)
function lockPiece() {
  // 「やり直し」のために、置く前の様子を記録しておく
  history.push({
    board: copyBoard(board),
    placedCount,
    shapeId: current.shapeId,
    nextShapeId,
  });
  // 古すぎる記録は捨てる
  if (history.length > UNDO_LIMIT) {
    history.shift();
  }

  for (const [cx, cy] of current.cells) {
    board[current.y + cy][current.x + cx] = current.shapeId;
  }
  placedCount += 1;

  // 模様モードがオフのときだけ、そろった横一列を消す
  if (!patternMode) {
    clearFullRows();
  }

  refreshLevel();
  spawnNextPiece();
  updateInfo();
}

// 横一列がすべてうまっている段を消して、上の段を下にずらす(ふつうの落ちものパズル)
// ※ 列を消しても、落ちる速さは変わりません
function clearFullRows() {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const clearedCount = BOARD_ROWS - remaining.length;
  for (let i = 0; i < clearedCount; i++) {
    remaining.unshift(new Array(BOARD_COLS).fill(null)); // 上に空の段を足す
  }
  board = remaining;
}

/* =========================================================
   盤面を全部消す / もう一度
   ========================================================= */

// 盤面のブロックを全部消す(確認してから)。置いた数とレベルはそのまま
function clearBoard() {
  if (!window.confirm("盤面のブロックを全部消します。本当に消しますか?")) return;
  board = createEmptyBoard();
  history = []; // 消す前の盤面には戻れないようにする
  setFull(false);
  setPaused(false);
  spawnNextPiece();
  updateInfo();
}

// 最初から始める
function restartGame() {
  // ゲームの途中で押したときは、念のため確認する
  if (!isFull && placedCount > 0) {
    if (!window.confirm("いまの盤面を消して、最初から始めますか?")) return;
  }
  startGame();
}

/* =========================================================
   やり直し(元に戻す)
   ---------------------------------------------------------
   直前に置いたブロックを盤面から取り除き、その1つ前の状態に戻します。
   取り除いたブロックと同じ形が、また上から落ちてきます。
   ========================================================= */
function undo() {
  if (history.length === 0) return; // 戻せる記録がない
  const record = history.pop();
  board = record.board;
  placedCount = record.placedCount; // 置いた数の表示も戻す
  level = calcLevel(); // 置いた数が減ったので、レベルも計算しなおす
  nextShapeId = record.nextShapeId;
  current = createPiece(record.shapeId); // 同じ形を、上から落ちてくる位置に戻す
  fallTimer = 0;
  softDropping = false;
  setFull(false); // いっぱいになっていても、戻せばまた遊べる
  updateInfo();
}

/* =========================================================
   一時停止
   ========================================================= */
function setPaused(value) {
  paused = value;
  stopAllInput();
  pauseButton.textContent = paused ? "再開" : "一時停止";
  pauseButton.setAttribute("aria-pressed", paused ? "true" : "false");
  pauseOverlay.hidden = !paused;
}

function togglePause() {
  if (isFull) return; // いっぱいのときは、一時停止の切りかえはしない
  setPaused(!paused);
}

/* =========================================================
   落ちる速さ
   ---------------------------------------------------------
   ここが「1段落ちる間隔」を決める、ただ1つの場所です。
   置いたブロックの数やレベルは、ここでは一切使いません。
   つまり、ゲームが進んでも速くなることはありません。
   ========================================================= */
function getFallInterval() {
  if (softDropping) {
    // ↓(▼)を押している間だけ速く落ちる。離すと元に戻る
    return SOFT_DROP_INTERVAL_MS;
  }
  if (slowRemainingMs > 0) {
    // 「ゆっくり」の間は、さらに遅くなる(2秒 × 5 = 10秒)
    return FALL_INTERVAL_MS * SLOW_MULTIPLIER;
  }
  return FALL_INTERVAL_MS;
}

/* =========================================================
   ストップモーション(「ゆっくり」ボタン)
   ========================================================= */

// 「ゆっくり」を始める。ゆっくり中に押したときは、すぐ元の速さに戻す
function toggleSlow() {
  if (slowRemainingMs > 0) {
    slowRemainingMs = 0;
  } else {
    slowRemainingMs = SLOW_DURATION_MS;
  }
  updateSlowButton();
}

// 「ゆっくり」ボタンの色と、残り秒数の表示を新しくする
let shownSlowSeconds = null;
function updateSlowButton() {
  const seconds = Math.ceil(slowRemainingMs / 1000);
  if (seconds === shownSlowSeconds) return; // 表示が変わらないときは何もしない
  shownSlowSeconds = seconds;
  if (seconds > 0) {
    slowButton.classList.add("active");
    slowButton.setAttribute("aria-pressed", "true");
    slowLabel.textContent = "ゆっくり中 あと" + seconds + "秒";
  } else {
    slowButton.classList.remove("active");
    slowButton.setAttribute("aria-pressed", "false");
    slowLabel.textContent = "ゆっくり";
  }
}

/* =========================================================
   画面に描く
   ========================================================= */

// 1マスを描く(色を塗って、細い縁取りを付ける)
function drawCell(ctx, px, py, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(px, py, size, size);
  // 上と左を少し明るく、立体っぽく見せる
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(px, py, size, size * 0.18);
  // 細い縁取り(色だけに頼らず、マスの区切りが分かるように)
  ctx.strokeStyle = "rgba(0, 0, 0, 0.55)";
  ctx.lineWidth = Math.max(1, size / 15);
  ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
}

// 盤面の背景と、うすいマス目を描く
function drawBoardBackground(ctx) {
  ctx.fillStyle = "#1d2433";
  ctx.fillRect(0, 0, BOARD_COLS * CELL_SIZE, BOARD_ROWS * CELL_SIZE);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  for (let x = 1; x < BOARD_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE + 0.5, 0);
    ctx.lineTo(x * CELL_SIZE + 0.5, BOARD_ROWS * CELL_SIZE);
    ctx.stroke();
  }
  for (let y = 1; y < BOARD_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_SIZE + 0.5);
    ctx.lineTo(BOARD_COLS * CELL_SIZE, y * CELL_SIZE + 0.5);
    ctx.stroke();
  }
}

// 盤面に置かれたブロックを描く
function drawPlacedBlocks(ctx) {
  for (let y = 0; y < BOARD_ROWS; y++) {
    for (let x = 0; x < BOARD_COLS; x++) {
      const shapeId = board[y][x];
      if (shapeId !== null) {
        drawCell(ctx, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, getColor(shapeId));
      }
    }
  }
}

// ブロックが落ちる場所の目安(点線のわく)を描く
function drawGhost(ctx) {
  let ghostY = current.y;
  while (canPlace(current.cells, current.x, ghostY + 1)) {
    ghostY += 1;
  }
  if (ghostY === current.y) return;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  for (const [cx, cy] of current.cells) {
    ctx.strokeRect(
      (current.x + cx) * CELL_SIZE + 3,
      (ghostY + cy) * CELL_SIZE + 3,
      CELL_SIZE - 6,
      CELL_SIZE - 6
    );
  }
  ctx.setLineDash([]);
}

// 盤面全体を描く
function drawBoard() {
  drawBoardBackground(boardCtx);
  drawPlacedBlocks(boardCtx);
  if (current) {
    drawGhost(boardCtx);
    const color = getColor(current.shapeId);
    for (const [cx, cy] of current.cells) {
      drawCell(boardCtx, (current.x + cx) * CELL_SIZE, (current.y + cy) * CELL_SIZE, CELL_SIZE, color);
    }
  }
}

// 形を、キャンバスのまん中に小さく描く(「次のブロック」などで使う)
function drawShapePreview(ctx, shapeId) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.fillStyle = "#1d2433";
  ctx.fillRect(0, 0, w, h);
  if (!shapeId) return;
  const cells = normalizeCells(getShape(shapeId).cells);
  const size = getSize(cells);
  // 5マスの形まで入るように、マスの大きさを決める
  const cell = Math.floor(Math.min(w, h) / 6);
  const offsetX = Math.floor((w - size.width * cell) / 2);
  const offsetY = Math.floor((h - size.height * cell) / 2);
  const color = getColor(shapeId);
  for (const [cx, cy] of cells) {
    drawCell(ctx, offsetX + cx * cell, offsetY + cy * cell, cell, color);
  }
}

// 置いたブロックの数などの表示を新しくする
function updateInfo() {
  countValue.textContent = placedCount;
  levelValue.textContent = level;
  // 戻せる記録がないときは「やり直し」を押せない見た目にする
  undoButton.disabled = history.length === 0;
  undoButton.title = "あと" + history.length + "回 戻せます";
  drawShapePreview(nextCtx, nextShapeId);
}

// 短いお知らせを出す(ゲームは止めない)
let toastTimerId = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimerId);
  toastTimerId = setTimeout(() => toast.classList.remove("show"), TOAST_DURATION_MS);
}

/* =========================================================
   画像(PNG)で保存
   ---------------------------------------------------------
   盤面に積んだ模様だけを(落ちている途中のブロックは入れずに)、
   別のキャンバスに描いて、PNG画像として保存します。
   ========================================================= */
function saveImage() {
  const scale = 2; // くっきりさせるため、2倍の大きさで描く
  const canvas = document.createElement("canvas");
  canvas.width = BOARD_COLS * CELL_SIZE * scale;
  canvas.height = BOARD_ROWS * CELL_SIZE * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  drawBoardBackground(ctx);
  drawPlacedBlocks(ctx);

  canvas.toBlob((blob) => {
    if (!blob) {
      showToast("画像を作れませんでした");
      return;
    }
    // ダウンロード用のリンクを作って、自動で押す
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "slow-blocks-" + makeTimeStamp() + ".png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // 少し待ってから、使い終わったURLを片づける
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    showToast("模様を画像で保存しました");
  }, "image/png");
}

// ファイル名に使う日時(例:20260101-123045)
function makeTimeStamp() {
  const d = new Date();
  const two = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) +
    "-" + two(d.getHours()) + two(d.getMinutes()) + two(d.getSeconds());
}

/* =========================================================
   「色の設定」の画面
   ========================================================= */

// 色の設定の、1つ1つの行(形の絵と、色を選ぶ部品)を覚えておく
const colorRows = [];

// 形ごとに「形の絵」「名前」「色を選ぶ部品」を並べる
function buildColorSettings() {
  const levelNames = { 1: "レベル1の形", 2: "レベル2の形(4マス)", 3: "レベル3の形(5マス)" };
  for (const levelNumber of [1, 2, 3]) {
    const heading = document.createElement("h3");
    heading.className = "color-group-title";
    heading.textContent = levelNames[levelNumber];
    colorList.appendChild(heading);

    const group = document.createElement("div");
    group.className = "color-group";
    colorList.appendChild(group);

    for (const shape of SHAPES.filter((s) => s.level === levelNumber)) {
      const label = document.createElement("label");
      label.className = "color-item";

      const preview = document.createElement("canvas");
      preview.width = 60;
      preview.height = 60;
      preview.className = "color-preview";

      const name = document.createElement("span");
      name.className = "color-name";
      name.textContent = shape.name;

      const input = document.createElement("input");
      input.type = "color";
      input.value = getColor(shape.id);
      input.setAttribute("aria-label", shape.name + "の色");

      // 色を選んだら、すぐに盤面と次のブロックの色を変えて、保存する
      input.addEventListener("input", () => {
        customColors[shape.id] = input.value.toLowerCase();
        drawShapePreview(preview.getContext("2d"), shape.id);
        updateInfo();
        saveColors();
      });

      label.appendChild(preview);
      label.appendChild(name);
      label.appendChild(input);
      group.appendChild(label);
      colorRows.push({ shape, input, preview });
      drawShapePreview(preview.getContext("2d"), shape.id);
    }
  }
}

// 「色をもとに戻す」:はじめの色に戻す
function resetColors() {
  customColors = {};
  saveColors();
  for (const row of colorRows) {
    row.input.value = row.shape.color;
    drawShapePreview(row.preview.getContext("2d"), row.shape.id);
  }
  updateInfo();
  showToast("色をもとに戻しました");
}

/* =========================================================
   毎回の画面更新(1秒に約60回くり返す)
   ========================================================= */
function gameLoop(time) {
  if (lastTime === null) lastTime = time;
  // 前回からの時間。タブを切りかえて戻ったときに一気に進まないよう、上限を付ける
  const dt = Math.min(time - lastTime, 250);
  lastTime = time;

  // 一時停止中は、ブロックも「ゆっくり」の残り時間も進めない
  if (!paused) {
    // 「ゆっくり」の残り時間を減らす。0 になったら自動で元の速さに戻る
    if (slowRemainingMs > 0) {
      slowRemainingMs = Math.max(0, slowRemainingMs - dt);
      updateSlowButton();
    }
  }

  if (current && !paused) {
    fallTimer += dt;
    if (fallTimer >= getFallInterval()) {
      fallTimer = 0;
      stepDown();
    }
  }

  drawBoard();
  requestAnimationFrame(gameLoop);
}

/* =========================================================
   キーボードの操作
   ========================================================= */

// ←→を押しっぱなしにしたときの、くり返しのしくみ
// 押した瞬間に1回動き、少し待ってから、一定の間隔でくり返し動く
const repeaters = {};
function startRepeat(name, action) {
  stopRepeat(name);
  action();
  const timer = { delayId: null, intervalId: null };
  timer.delayId = setTimeout(() => {
    timer.intervalId = setInterval(action, KEY_REPEAT_INTERVAL_MS);
  }, KEY_REPEAT_DELAY_MS);
  repeaters[name] = timer;
}
function stopRepeat(name) {
  const timer = repeaters[name];
  if (!timer) return;
  clearTimeout(timer.delayId);
  clearInterval(timer.intervalId);
  delete repeaters[name];
}
function stopAllInput() {
  Object.keys(repeaters).forEach(stopRepeat);
  softDropping = false;
}

// 文字の入力欄や選択欄を操作しているときは、ゲームのキー操作をしない
function isTypingTarget(target) {
  const tag = target && target.tagName;
  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
}

document.addEventListener("keydown", (event) => {
  if (isTypingTarget(event.target)) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = event.key;

  // 一時停止は、いつでも切りかえられる
  if (key === "p" || key === "P") {
    event.preventDefault();
    if (!event.repeat) togglePause();
    return;
  }
  // 一時停止中は、ほかの操作をしない(矢印キーやスペースキーでページが動かないようにだけする)
  if (paused) {
    if (key.startsWith("Arrow") || key === " ") event.preventDefault();
    return;
  }

  if (key === "ArrowLeft" || key === "ArrowRight") {
    event.preventDefault();
    if (event.repeat) return; // くり返しは自分で管理する
    const dx = key === "ArrowLeft" ? -1 : 1;
    startRepeat(key, () => moveSideways(dx));
  } else if (key === "ArrowUp" || key === "z" || key === "Z" || key === " ") {
    // 回転は ↑、Z、スペースキーのどれでもできる
    // (preventDefault で、スペースキーでページが下に動いたり、
    //  最後に押した画面のボタンがもう一度押されたりしないようにする)
    event.preventDefault();
    if (event.repeat) return;
    rotate();
  } else if (key === "ArrowDown") {
    event.preventDefault();
    if (event.repeat) return;
    softDropping = true;
  } else if (key === "s" || key === "S") {
    event.preventDefault();
    if (event.repeat) return;
    toggleSlow();
  } else if (key === "u" || key === "U") {
    event.preventDefault();
    if (event.repeat) return;
    undo();
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key;
  // スペースキーを離したときに、画面のボタンが押されないようにする
  if (key === " " && !isTypingTarget(event.target)) {
    event.preventDefault();
  }
  if (key === "ArrowLeft" || key === "ArrowRight") {
    stopRepeat(key);
  } else if (key === "ArrowDown") {
    softDropping = false;
    fallTimer = 0; // 離したら、ふつうの速さで数え直す
  }
});

// 別のウィンドウに切りかえたときは、押しっぱなしの状態を解除する
window.addEventListener("blur", stopAllInput);

/* =========================================================
   画面のボタンなど
   ========================================================= */

/* ---------- ブロックを動かすボタン(スマホ用) ---------- */

// ボタンを「押している間」の動きを登録する
// onPress:押したとき / onRelease:指(マウス)を離したとき
function setupHoldButton(button, onPress, onRelease) {
  let holding = false;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault(); // 長押しでメニューが出たり、拡大されたりしないように
    if (paused || isFull) return;
    holding = true;
    button.classList.add("pressed");
    // 指がボタンの外に少しずれても、離したことが分かるようにする
    try {
      button.setPointerCapture(event.pointerId);
    } catch (error) {
      // 使えないブラウザでは何もしない
    }
    onPress();
  });

  const release = () => {
    if (!holding) return;
    holding = false;
    button.classList.remove("pressed");
    if (onRelease) onRelease();
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);

  // キーボードの Enter などでボタンを押したとき(マウスや指ではないとき)は、1回だけ動かす
  button.addEventListener("click", (event) => {
    if (event.detail !== 0 || paused || isFull) return;
    onPress();
    if (onRelease) onRelease();
  });

  // 長押しで出るメニューを出さない
  button.addEventListener("contextmenu", (event) => event.preventDefault());
}

// ◀ ▶:押しっぱなしにすると、一定の間隔でくり返し動く
setupHoldButton(
  document.getElementById("pad-left"),
  () => startRepeat("padLeft", () => moveSideways(-1)),
  () => stopRepeat("padLeft")
);
setupHoldButton(
  document.getElementById("pad-right"),
  () => startRepeat("padRight", () => moveSideways(1)),
  () => stopRepeat("padRight")
);
// 回転:押すたびに1回まわす
setupHoldButton(document.getElementById("pad-rotate"), rotate, null);
// ▼:押している間だけ速く落ちる。離すと元の速さに戻る
setupHoldButton(
  document.getElementById("pad-down"),
  () => { softDropping = true; },
  () => { softDropping = false; fallTimer = 0; }
);

/* ---------- そのほかのボタン ---------- */

slowButton.addEventListener("click", toggleSlow);
undoButton.addEventListener("click", undo);
pauseButton.addEventListener("click", togglePause);
resumeButton.addEventListener("click", () => setPaused(false));
restartButtons.forEach((button) => button.addEventListener("click", restartGame));
clearButtons.forEach((button) => button.addEventListener("click", clearBoard));
saveImageButtons.forEach((button) => button.addEventListener("click", saveImage));

// 模様モードのスイッチ
patternModeCheckbox.checked = patternMode;
patternModeCheckbox.addEventListener("change", () => {
  patternMode = patternModeCheckbox.checked;
  showToast(patternMode
    ? "模様モード オン:そろった列も消えずに残ります"
    : "模様モード オフ:そろった列が消えます");
  patternModeCheckbox.blur(); // すぐに矢印キーでブロックを動かせるように、選択を外す
});

// 「はじめのレベル」を選んだら、すぐにそのレベルの形が出てくるようにする
startLevelSelect.addEventListener("change", () => {
  startLevel = Number(startLevelSelect.value);
  refreshLevel();
  // 「次のブロック」も、新しいレベルの形から選びなおす
  nextShapeId = pickRandomShapeId();
  updateInfo();
  startLevelSelect.blur(); // ←→キーで選択欄が変わらないように、選択を外す
});

/* =========================================================
   ゲームを始める
   ========================================================= */
function startGame() {
  board = createEmptyBoard();
  placedCount = 0;
  history = [];
  level = calcLevel();
  slowRemainingMs = 0;
  updateSlowButton();
  setFull(false);
  setPaused(false);
  nextShapeId = pickRandomShapeId();
  spawnNextPiece();
  updateInfo();
}

colorResetButton.addEventListener("click", resetColors);

buildColorSettings();
startGame();
requestAnimationFrame(gameLoop);
