const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


/* =========================================================
   GAME STATE
========================================================= */

let currentArea = "street";

let collectedWords =
  JSON.parse(
    localStorage.getItem("kaminokawaWords") || "[]"
  );

let keys = {};

let dialogueOpen = false;
let libraryOpen = false;
let cardOpen = false;
let travelling = false;

let currentTarget = null;


/* =========================================================
   PLAYER
========================================================= */

const player = {

  x: 620,
  y: 500,

  width: 24,
  height: 36,

  speed: 3.1,

  direction: "down",

  walking: false,
  step: 0

};


/* =========================================================
   OBJECTS
========================================================= */

let objects = [];


/* =========================================================
   HELPERS
========================================================= */

function rectCollision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );

}


function distance(a, b) {

  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;

  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;

  return Math.hypot(
    ax - bx,
    ay - by
  );

}


function roundedRect(
  x,
  y,
  width,
  height,
  radius
){

  ctx.beginPath();

  ctx.roundRect(
    x,
    y,
    width,
    height,
    radius
  );

}


/* =========================================================
   OBJECT FACTORIES
========================================================= */

function addNPC(
  x,
  y,
  name,
  jp,
  cn,
  word
){

  objects.push({

    type: "npc",

    x,
    y,

    width: 28,
    height: 38,

    name,
    jp,
    cn,
    word,

    solid: true

  });

}


function addTravel(
  x,
  y,
  width,
  height,
  destination,
  spawn
){

  objects.push({

    type: "travel",

    x,
    y,
    width,
    height,

    destination,
    spawn,

    solid: false

  });

}


function addObject(
  type,
  x,
  y,
  width,
  height,
  options = {}
){

  objects.push({

    type,

    x,
    y,

    width,
    height,

    solid:
      options.solid ?? true,

    label:
      options.label,

    jp:
      options.jp,

    cn:
      options.cn,

    word:
      options.word

  });

}


/* =========================================================
   LOAD AREA
========================================================= */

function loadArea(
  area,
  spawn = null
){

  currentArea = area;

  document.getElementById(
    "areaName"
  ).textContent =
    AREAS[area].name;


  objects = [];


  if(area === "street")
    buildStreet();

  else if(area === "castle")
    buildCastle();

  else if(area === "library")
    buildLibrary();

  else if(area === "origami")
    buildOrigami();

  else if(area === "shrine")
    buildShrine();


  if(spawn){

    player.x = spawn.x;
    player.y = spawn.y;

  }


  showAreaSplash();

}


/* =========================================================
   STREET
========================================================= */

function buildStreet(){

  addObject(
    "house",
    80,80,
    210,130
  );

  addObject(
    "shop",
    350,75,
    220,140
  );

  addObject(
    "house",
    850,80,
    230,135
  );


  addObject(
    "vending",
    600,180,
    35,55,
    {
      jp:
        "これは自動販売機です。",

      cn:
        "这是自动售货机。",

      word:4
    }
  );


  addNPC(
    460,
    430,

    "町の人",

    "こんにちは。上三川を散歩しているんですか？",

    "你好。你是在上三川散步吗？",

    1
  );


  addNPC(
    800,
    440,

    "高校生",

    "この道をまっすぐ行くと、城址公園がありますよ。",

    "沿着这条路一直走，就能到城址公园。",

    29
  );


  /* 城址公園 */

  addTravel(
    1180,
    250,
    70,
    220,

    "castle",

    {
      x:628,
      y:630
    }
  );


  /* ORIGAMI */

  addTravel(
    20,
    250,
    60,
    220,

    "origami",

    {
      x:1120,
      y:400
    }
  );

}


/* =========================================================
   CASTLE PARK
========================================================= */

function buildCastle(){

  /*
     添付マップをゲーム用にデフォルメ。

              北

         ┌────── 堀 ──────┐
       ／                     ＼
      │ 勝姫稲荷       四阿     │
 湧水 │                       │
      │       芝生広場          │
      │                       │
      │ 銀明水         野外舞台 │
       ＼                     ／
         └──── 橋 ──────┘
                │
              入口
                │
              駐車場

              南
  */


  /* --------------------------------
     芝生広場
  -------------------------------- */

  addObject(
    "lawnInteract",

    470,220,
    340,260,

    {
      solid:false,

      jp:
        "広い芝生広場です。町の人たちが遊んだり、のんびり過ごしたりしています。",

      cn:
        "这里是一片宽阔的草坪。当地居民会在这里玩耍、休息。",

      word:31
    }
  );


  /* --------------------------------
     勝姫稲荷神社
  -------------------------------- */

  addObject(
    "inari",

    270,150,
    75,75,

    {
      solid:true,

      jp:
        "公園の中に小さな稲荷神社があります。",

      cn:
        "公园里有一座小小的稻荷神社。",

      word:32
    }
  );


  /* --------------------------------
     湧水
  -------------------------------- */

  addObject(
    "spring",

    190,220,
    65,60,

    {
      solid:true,

      jp:
        "きれいな水が湧き出しています。",

      cn:
        "清澈的水从地下涌出。",

      word:33
    }
  );


  /* --------------------------------
     銀明水
  -------------------------------- */

  addObject(
    "ginmeisui",

    320,500,
    75,60,

    {
      solid:true,

      jp:
        "上三川七水のひとつ、「銀明水」です。",

      cn:
        "这是“上三川七水”之一的“银明水”。",

      word:34
    }
  );


  /* --------------------------------
     四阿
  -------------------------------- */

  addObject(
    "azumaya",

    875,160,
    75,65,

    {
      solid:true,

      jp:
        "公園の四阿です。木陰で休むことができます。",

      cn:
        "这是公园里的凉亭，可以在树荫下休息。",

      word:35
    }
  );


  addObject(
    "azumaya",

    280,545,
    70,60,

    {
      solid:true,

      jp:
        "木々に囲まれた四阿です。",

      cn:
        "这是一座被树木环绕的凉亭。",

      word:35
    }
  );


  addObject(
    "azumaya",

    440,525,
    70,60,

    {
      solid:true,

      jp:
        "散歩の途中で少し休憩できます。",

      cn:
        "散步途中可以在这里稍作休息。",

      word:35
    }
  );


  /* --------------------------------
     野外ステージ
  -------------------------------- */

  addObject(
    "stage",

    930,420,
    120,90,

    {
      solid:true,

      jp:
        "ここは野外ステージです。",

      cn:
        "这里是露天舞台。",

      word:36
    }
  );


  /* --------------------------------
     電源BOX
  -------------------------------- */

  addObject(
    "powerBox",

    675,530,
    35,35,

    {
      solid:true,

      jp:
        "イベントなどで使われる電源ボックスです。",

      cn:
        "这是举办活动时使用的电源箱。"
    }
  );


  /* --------------------------------
     案内板
  -------------------------------- */

  addObject(
    "parkSign",

    585,600,
    55,45,

    {
      solid:true,

      jp:
        "上三川城址公園の案内板です。",

      cn:
        "这是上三川城址公园的导览牌。",

      word:37
    }
  );


  /* --------------------------------
     木
  -------------------------------- */

  const castleTrees = [

    /* 北側 */

    [220,105],
    [270,95],
    [320,110],
    [370,85],
    [420,95],
    [475,82],
    [530,95],
    [590,82],
    [650,90],
    [710,80],
    [770,92],
    [830,85],
    [890,100],
    [950,105],
    [1000,125],

    /* 西側 */

    [180,305],
    [190,355],
    [175,410],
    [195,460],
    [200,520],

    /* 東側 */

    [1040,245],
    [1055,300],
    [1040,355],
    [1060,540],

    /* 南側 */

    [220,555],
    [375,570],
    [525,585],
    [755,580],
    [830,565],
    [995,545]

  ];


  castleTrees.forEach(
    ([x,y],index) => {

      addObject(
        "parkTree",

        x,
        y,

        34 + (index % 3) * 4,
        46 + (index % 2) * 6,

        {
          solid:true
        }
      );

    }
  );


  /* --------------------------------
     NPC
  -------------------------------- */

  addNPC(
    705,
    320,

    "歴史に詳しいおじいさん",

    "ここには昔、上三川城という城があったんだよ。今は町の公園になっているんだ。",

    "这里过去有一座名叫上三川城的城。现在这里已经成为镇上的公园。",

    6
  );


  addNPC(
    535,
    370,

    "子ども",

    "この芝生、広いでしょ！よくここで遊ぶんだ。",

    "这片草坪很大吧！我经常在这里玩。",

    31
  );


  addNPC(
    810,
    535,

    "散歩中の人",

    "この散策路を一周すると、いい散歩になりますよ。",

    "沿着这条散步道走一圈，很适合散步。",

    38
  );


  addNPC(
    345,
    230,

    "散歩中のおばあさん",

    "あそこにあるのは勝姫稲荷神社ですよ。",

    "那边的是胜姬稻荷神社。",

    32
  );


  /* --------------------------------
     南側入口 → 上三川通り
  -------------------------------- */

  addTravel(
    580,
    675,
    150,
    45,

    "street",

    {
      x:1110,
      y:400
    }
  );


  /* --------------------------------
     東側 → 図書館
  -------------------------------- */

  addTravel(
    1180,
    280,
    80,
    170,

    "library",

    {
      x:100,
      y:400
    }
  );

}


/* =========================================================
   LIBRARY
========================================================= */

function buildLibrary(){

  addObject(
    "bookshelf",
    100,100,
    180,70
  );

  addObject(
    "bookshelf",
    330,100,
    180,70
  );

  addObject(
    "bookshelf",
    560,100,
    180,70
  );

  addObject(
    "bookshelf",
    790,100,
    180,70
  );


  addNPC(
    600,
    420,

    "図書館員",

    "こんにちは。本を借りるには利用カードが必要です。",

    "你好。借书需要借阅卡。",

    14
  );


  addObject(
    "origamiDisplay",

    950,360,
    100,100,

    {
      jp:
        "折り紙の作品が展示されています。",

      cn:
        "这里展示着折纸作品。",

      word:16
    }
  );


  addTravel(
    20,
    250,
    60,
    220,

    "castle",

    {
      x:1120,
      y:370
    }
  );

}


/* =========================================================
   ORIGAMI PLAZA
========================================================= */

function buildOrigami(){

  addObject(
    "desk",
    200,160,
    220,90
  );

  addObject(
    "display",
    720,120,
    250,150
  );


  addNPC(
    560,
    400,

    "折り紙を教える人",

    "紙を半分に折ってみましょう。",

    "试着把纸对折吧。",

    18
  );


  addNPC(
    830,
    450,

    "女の子",

    "見て！鶴を作ったよ！",

    "你看！我折了一只鹤！",

    19
  );


  addTravel(
    1180,
    260,
    60,
    220,

    "street",

    {
      x:80,
      y:400
    }
  );


  addTravel(
    520,
    650,
    240,
    50,

    "shrine",

    {
      x:620,
      y:110
    }
  );

}


/* =========================================================
   SHRINE
========================================================= */

function buildShrine(){

  addObject(
    "torii",

    540,80,
    200,70,

    {
      jp:
        "大きな鳥居があります。",

      cn:
        "这里有一座巨大的鸟居。",

      word:22
    }
  );


  addObject(
    "shrineBuilding",

    440,180,
    400,170
  );


  addNPC(
    850,
    430,

    "参拝客",

    "神社では静かに参拝します。",

    "在神社参拜时要保持安静。",

    23
  );


  addObject(
    "omikuji",

    300,420,
    80,60,

    {
      jp:
        "おみくじを引いてみますか？",

      cn:
        "要不要抽一张神签？",

      word:24
    }
  );


  addTravel(
    520,
    20,
    240,
    60,

    "origami",

    {
      x:620,
      y:600
    }
  );

}


/* =========================================================
   INPUT
========================================================= */

window.addEventListener(
  "keydown",
  e => {

    const key =
      e.key.toLowerCase();


    keys[key] = true;


    if(
      key === "e" ||
      e.key === "Enter"
    ){

      interact();

    }


    if(key === "l"){

      toggleLibrary();

    }

  }
);


window.addEventListener(
  "keyup",
  e => {

    keys[
      e.key.toLowerCase()
    ] = false;

  }
);


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer(){

  if(
    dialogueOpen ||
    libraryOpen ||
    cardOpen ||
    travelling
  )
    return;


  let dx = 0;
  let dy = 0;


  if(keys["w"]){

    dy -= player.speed;
    player.direction = "up";

  }


  if(keys["s"]){

    dy += player.speed;
    player.direction = "down";

  }


  if(keys["a"]){

    dx -= player.speed;
    player.direction = "left";

  }


  if(keys["d"]){

    dx += player.speed;
    player.direction = "right";

  }


  /* 斜め移動補正 */

  if(dx !== 0 && dy !== 0){

    dx *= .707;
    dy *= .707;

  }


  player.walking =
    dx !== 0 ||
    dy !== 0;


  if(player.walking){

    player.step += .17;

  }


  const nextX = {

    ...player,

    x:
      player.x + dx

  };


  const nextY = {

    ...player,

    y:
      player.y + dy

  };


  let blockedX = false;
  let blockedY = false;


  objects.forEach(obj => {

    if(!obj.solid)
      return;


    if(
      rectCollision(
        nextX,
        obj
      )
    ){

      blockedX = true;

    }


    if(
      rectCollision(
        nextY,
        obj
      )
    ){

      blockedY = true;

    }

  });


  if(!blockedX)
    player.x += dx;


  if(!blockedY)
    player.y += dy;


  player.x =
    Math.max(
      0,
      Math.min(
        canvas.width - player.width,
        player.x
      )
    );


  player.y =
    Math.max(
      0,
      Math.min(
        canvas.height - player.height,
        player.y
      )
    );


  checkTravel();

}


/* =========================================================
   TRAVEL
========================================================= */

function checkTravel(){

  if(travelling)
    return;


  for(const obj of objects){

    if(
      obj.type === "travel" &&
      rectCollision(
        player,
        obj
      )
    ){

      travelTo(
        obj.destination,
        obj.spawn
      );

      break;

    }

  }

}


function travelTo(
  destination,
  spawn
){

  travelling = true;


  const overlay =
    document.getElementById(
      "travelOverlay"
    );


  document.getElementById(
    "travelDestination"
  ).textContent =
    AREAS[destination].name;


  overlay.classList.remove(
    "hidden"
  );


  setTimeout(() => {

    loadArea(
      destination,
      spawn
    );


    overlay.classList.add(
      "hidden"
    );


    setTimeout(() => {

      travelling = false;

    },200);

  },600);

}


/* =========================================================
   INTERACTION
========================================================= */

function findTarget(){

  let closest = null;
  let closestDistance = Infinity;


  objects.forEach(obj => {

    if(
      !obj.jp &&
      obj.type !== "npc"
    )
      return;


    const d =
      distance(
        player,
        obj
      );


    if(
      d < 88 &&
      d < closestDistance
    ){

      closest = obj;
      closestDistance = d;

    }

  });


  return closest;

}


function interact(){

  if(
    cardOpen ||
    libraryOpen ||
    travelling
  )
    return;


  if(dialogueOpen){

    closeDialogue();
    return;

  }


  const target =
    findTarget();


  if(!target)
    return;


  openDialogue(

    target.name ||
    "調べる",

    target.jp,

    target.cn,

    target.word

  );

}


/* =========================================================
   DIALOGUE
========================================================= */

function openDialogue(
  speaker,
  jp,
  cn,
  word
){

  dialogueOpen = true;


  document.getElementById(
    "speakerName"
  ).textContent =
    speaker;


  document.getElementById(
    "dialogueJapanese"
  ).textContent =
    jp || "";


  document.getElementById(
    "dialogueChinese"
  ).textContent =
    cn || "";


  document.getElementById(
    "dialogueBox"
  ).classList.remove(
    "hidden"
  );


  currentTarget = {
    word
  };

}


function closeDialogue(){

  document.getElementById(
    "dialogueBox"
  ).classList.add(
    "hidden"
  );


  dialogueOpen = false;


  if(
    currentTarget &&
    currentTarget.word
  ){

    collectWord(
      currentTarget.word
    );

  }


  currentTarget = null;

}


/* =========================================================
   WORD COLLECTION
========================================================= */

function collectWord(id){

  if(
    collectedWords.includes(id)
  )
    return;


  collectedWords.push(id);


  localStorage.setItem(
    "kaminokawaWords",
    JSON.stringify(
      collectedWords
    )
  );


  updateHUD();


  const word =
    WORDS.find(
      w => w.id === id
    );


  if(word){

    showWordCard(word);

  }

}


function showWordCard(word){

  cardOpen = true;


  document.getElementById(
    "cardJapanese"
  ).textContent =
    word.jp;


  document.getElementById(
    "cardReading"
  ).textContent =
    word.reading;


  document.getElementById(
    "cardChinese"
  ).textContent =
    word.cn;


  document.getElementById(
    "cardExample"
  ).textContent =
    word.example;


  document.getElementById(
    "cardPopup"
  ).classList.remove(
    "hidden"
  );

}


/* =========================================================
   LIBRARY
========================================================= */

function renderLibrary(){

  const grid =
    document.getElementById(
      "libraryGrid"
    );


  grid.innerHTML = "";


  for(
    let i = 1;
    i <= 100;
    i++
  ){

    const word =
      WORDS.find(
        w => w.id === i
      );


    const unlocked =
      collectedWords.includes(i);


    const item =
      document.createElement(
        "div"
      );


    item.className =
      "word-item";


    if(!unlocked){

      item.classList.add(
        "word-locked"
      );

    }


    if(
      unlocked &&
      word
    ){

      item.innerHTML = `

        <div class="word-number">
          NO.${String(i).padStart(3,"0")}
        </div>

        <div class="word-japanese">
          ${word.jp}
        </div>

        <div class="word-reading">
          ${word.reading}
        </div>

        <div class="word-chinese">
          ${word.cn}
        </div>

      `;

    }

    else {

      item.innerHTML = `

        <div class="word-number">
          NO.${String(i).padStart(3,"0")}
        </div>

        <div class="word-japanese">
          ？？？
        </div>

        <div class="word-chinese">
          尚未发现
        </div>

      `;

    }


    grid.appendChild(item);

  }


  document.getElementById(
    "libraryProgressText"
  ).textContent =
    `${collectedWords.length} / 100`;


  document.getElementById(
    "progressFill"
  ).style.width =
    `${Math.min(collectedWords.length,100)}%`;

}


function toggleLibrary(){

  if(cardOpen)
    return;


  libraryOpen =
    !libraryOpen;


  if(libraryOpen){

    renderLibrary();

    document.getElementById(
      "libraryOverlay"
    ).classList.remove(
      "hidden"
    );

  }

  else {

    document.getElementById(
      "libraryOverlay"
    ).classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   DRAW MAIN
========================================================= */

function draw(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawGround();


  if(currentArea === "castle"){

    drawCastleLandscape();

  }

  else {

    drawRoads();

  }


  /*
     y座標順に描画。
     キャラクターが建物の前後を歩いている感じを出す。
  */

  const drawableObjects =
    objects
      .filter(
        obj =>
          obj.type !== "travel" &&
          obj.type !== "lawnInteract"
      )
      .sort(
        (a,b) =>
          (a.y + a.height) -
          (b.y + b.height)
      );


  let playerDrawn = false;


  drawableObjects.forEach(
    obj => {

      if(
        !playerDrawn &&
        player.y + player.height <
        obj.y + obj.height
      ){

        drawPlayer();

        playerDrawn = true;

      }


      drawObject(obj);

    }
  );


  if(!playerDrawn){

    drawPlayer();

  }


  if(currentArea === "castle"){

    drawCastleForeground();

  }

}


/* =========================================================
   GROUND
========================================================= */

function drawGround(){

  if(currentArea === "street"){

    ctx.fillStyle = "#91ae72";

  }

  else if(currentArea === "castle"){

    ctx.fillStyle = "#538f2f";

  }

  else if(currentArea === "library"){

    ctx.fillStyle = "#d7cbb6";

  }

  else if(currentArea === "origami"){

    ctx.fillStyle = "#d9d4c4";

  }

  else {

    ctx.fillStyle = "#8ca374";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   NORMAL ROADS
========================================================= */

function drawRoads(){

  if(currentArea === "street"){

    /* 道路 */

    ctx.fillStyle = "#747875";

    ctx.fillRect(
      0,
      280,
      1280,
      250
    );


    /* センターライン */

    ctx.fillStyle = "#e9e6d5";


    for(
      let x = 30;
      x < 1280;
      x += 100
    ){

      ctx.fillRect(
        x,
        398,
        55,
        8
      );

    }


    /* 歩道 */

    ctx.fillStyle = "#c7c5ba";

    ctx.fillRect(
      0,
      255,
      1280,
      25
    );

    ctx.fillRect(
      0,
      530,
      1280,
      25
    );

  }


  if(currentArea === "shrine"){

    ctx.fillStyle = "#b7aa8e";

    ctx.fillRect(
      575,
      0,
      130,
      720
    );

  }

}


/* =========================================================
   CASTLE LANDSCAPE
========================================================= */

function drawCastleLandscape(){

  /*
     まず外側の土・道路
  */

  ctx.fillStyle = "#c6b892";

  ctx.fillRect(
    0,
    0,
    1280,
    720
  );


  /*
     公園外側の緑
  */

  ctx.fillStyle = "#4c9d2d";

  ctx.beginPath();

  ctx.moveTo(150,70);
  ctx.lineTo(260,25);
  ctx.lineTo(440,35);
  ctx.lineTo(520,15);
  ctx.lineTo(760,25);
  ctx.lineTo(1020,65);
  ctx.lineTo(1120,135);
  ctx.lineTo(1145,540);
  ctx.lineTo(1040,625);
  ctx.lineTo(790,660);
  ctx.lineTo(720,630);
  ctx.lineTo(550,650);
  ctx.lineTo(430,630);
  ctx.lineTo(210,615);
  ctx.lineTo(140,520);
  ctx.lineTo(125,250);

  ctx.closePath();
  ctx.fill();


  /*
     外周の堀
  */

  ctx.fillStyle = "#518ea1";

  ctx.beginPath();

  ctx.moveTo(185,90);
  ctx.lineTo(275,55);
  ctx.lineTo(430,65);
  ctx.lineTo(515,40);
  ctx.lineTo(750,48);
  ctx.lineTo(990,85);
  ctx.lineTo(1080,145);
  ctx.lineTo(1100,515);
  ctx.lineTo(1010,585);
  ctx.lineTo(795,620);
  ctx.lineTo(705,595);
  ctx.lineTo(560,615);
  ctx.lineTo(440,590);
  ctx.lineTo(245,580);
  ctx.lineTo(180,510);
  ctx.lineTo(160,250);

  ctx.closePath();
  ctx.fill();


  /*
     水面のハイライト
  */

  ctx.strokeStyle =
    "rgba(215,242,245,.35)";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(205,105);
  ctx.lineTo(285,75);
  ctx.lineTo(430,82);
  ctx.lineTo(520,58);
  ctx.lineTo(745,65);
  ctx.lineTo(975,100);

  ctx.stroke();


  /*
     堀の内側の城域
  */

  ctx.fillStyle = "#64a936";

  ctx.beginPath();

  ctx.moveTo(215,115);
  ctx.lineTo(295,85);
  ctx.lineTo(435,92);
  ctx.lineTo(530,68);
  ctx.lineTo(740,75);
  ctx.lineTo(955,110);
  ctx.lineTo(1035,165);
  ctx.lineTo(1050,485);
  ctx.lineTo(975,550);
  ctx.lineTo(790,585);
  ctx.lineTo(700,560);
  ctx.lineTo(560,580);
  ctx.lineTo(450,555);
  ctx.lineTo(275,550);
  ctx.lineTo(215,490);
  ctx.lineTo(195,260);

  ctx.closePath();
  ctx.fill();


  /*
     中央芝生
  */

  const lawnGradient =
    ctx.createLinearGradient(
      400,
      180,
      800,
      500
    );


  lawnGradient.addColorStop(
    0,
    "#a9d94a"
  );

  lawnGradient.addColorStop(
    1,
    "#96cc3d"
  );


  ctx.fillStyle =
    lawnGradient;


  ctx.beginPath();

  ctx.moveTo(455,190);
  ctx.quadraticCurveTo(
    620,155,
    825,205
  );

  ctx.quadraticCurveTo(
    860,330,
    815,465
  );

  ctx.quadraticCurveTo(
    630,505,
    430,460
  );

  ctx.quadraticCurveTo(
    405,330,
    455,190
  );

  ctx.closePath();
  ctx.fill();


  /*
     芝模様
  */

  ctx.fillStyle =
    "rgba(65,130,38,.17)";


  for(let i=0;i<90;i++){

    const x =
      445 + ((i * 73) % 380);

    const y =
      195 + ((i * 47) % 270);


    ctx.fillRect(
      x,
      y,
      3,
      7
    );

  }


  /*
     散策路
  */

  ctx.strokeStyle = "#d9ca9e";
  ctx.lineWidth = 24;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";


  ctx.beginPath();

  ctx.moveTo(620,595);

  ctx.quadraticCurveTo(
    430,565,
    320,500
  );

  ctx.quadraticCurveTo(
    245,410,
    290,285
  );

  ctx.quadraticCurveTo(
    335,175,
    455,145
  );

  ctx.quadraticCurveTo(
    650,95,
    870,155
  );

  ctx.quadraticCurveTo(
    1000,200,
    990,330
  );

  ctx.quadraticCurveTo(
    980,480,
    850,525
  );

  ctx.quadraticCurveTo(
    730,565,
    620,595
  );

  ctx.stroke();


  /*
     芝生を横切る園路
  */

  ctx.beginPath();

  ctx.moveTo(350,480);

  ctx.quadraticCurveTo(
    520,450,
    690,470
  );

  ctx.quadraticCurveTo(
    830,480,
    965,430
  );

  ctx.stroke();


  /*
     北側園路
  */

  ctx.beginPath();

  ctx.moveTo(350,205);

  ctx.quadraticCurveTo(
    510,135,
    690,145
  );

  ctx.quadraticCurveTo(
    830,145,
    930,220
  );

  ctx.stroke();


  /*
     南側入口
  */

  ctx.fillStyle = "#d5c49b";

  ctx.beginPath();

  ctx.moveTo(570,720);
  ctx.lineTo(605,575);
  ctx.lineTo(670,575);
  ctx.lineTo(715,720);

  ctx.closePath();
  ctx.fill();


  /*
     正面橋
  */

  ctx.fillStyle = "#b5aa91";

  ctx.fillRect(
    595,
    560,
    90,
    65
  );


  /*
     橋の欄干
  */

  ctx.fillStyle = "#76634a";

  ctx.fillRect(
    592,
    565,
    6,
    58
  );

  ctx.fillRect(
    682,
    565,
    6,
    58
  );


  /*
     駐車場
  */

  ctx.fillStyle = "#8c8f8b";

  ctx.beginPath();

  ctx.moveTo(350,650);
  ctx.lineTo(520,625);
  ctx.lineTo(565,720);
  ctx.lineTo(300,720);

  ctx.closePath();
  ctx.fill();


  /*
     駐車場白線
  */

  ctx.strokeStyle =
    "rgba(255,255,255,.75)";

  ctx.lineWidth = 2;


  for(let x=330;x<520;x+=38){

    ctx.beginPath();

    ctx.moveTo(
      x,
      675
    );

    ctx.lineTo(
      x+15,
      720
    );

    ctx.stroke();

  }


  /*
     東側出口
  */

  ctx.fillStyle = "#d5c49b";

  ctx.fillRect(
    1030,
    320,
    250,
    55
  );

}


/* =========================================================
   CASTLE FOREGROUND
========================================================= */

function drawCastleForeground(){

  /*
     公園名
  */

  ctx.save();

  ctx.font =
    "bold 14px sans-serif";

  ctx.fillStyle =
    "rgba(255,255,255,.85)";

  ctx.strokeStyle =
    "rgba(30,55,30,.75)";

  ctx.lineWidth = 4;

  ctx.strokeText(
    "上三川城址公園",
    545,
    125
  );

  ctx.fillText(
    "上三川城址公園",
    545,
    125
  );


  /*
     芝生広場ラベル
  */

  ctx.font =
    "bold 13px sans-serif";

  ctx.strokeText(
    "芝生広場",
    605,
    340
  );

  ctx.fillText(
    "芝生広場",
    605,
    340
  );


  /*
     お堀
  */

  ctx.font =
    "12px sans-serif";

  ctx.strokeText(
    "お堀",
    625,
    62
  );

  ctx.fillText(
    "お堀",
    625,
    62
  );


  ctx.restore();

}


/* =========================================================
   OBJECT DRAW
========================================================= */

function drawObject(o){

  switch(o.type){


    /* -------------------------
       HOUSE
    ------------------------- */

    case "house":

      ctx.fillStyle = "#e8e0cf";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle = "#55534f";

      ctx.fillRect(
        o.x-10,
        o.y-20,
        o.width+20,
        30
      );

      break;


    /* -------------------------
       SHOP
    ------------------------- */

    case "shop":

      ctx.fillStyle = "#ddd0b2";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle = "#5f4637";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        30
      );


      ctx.fillStyle = "#fff";

      ctx.font =
        "18px sans-serif";

      ctx.fillText(
        "商 店",
        o.x+75,
        o.y+24
      );

      break;


    /* -------------------------
       NPC
    ------------------------- */

    case "npc":

      drawNPC(o);

      break;


    /* -------------------------
       VENDING MACHINE
    ------------------------- */

    case "vending":

      ctx.fillStyle = "#e8ecec";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle = "#74a3b7";

      ctx.fillRect(
        o.x+5,
        o.y+8,
        o.width-10,
        18
      );


      ctx.fillStyle = "#555";

      ctx.fillRect(
        o.x+22,
        o.y+34,
        7,
        12
      );

      break;


    /* -------------------------
       TREE
    ------------------------- */

    case "parkTree":

      drawTree(o);

      break;


    /* -------------------------
       INARI
    ------------------------- */

    case "inari":

      drawInari(o);

      break;


    /* -------------------------
       SPRING
    ------------------------- */

    case "spring":

      drawSpring(o);

      break;


    /* -------------------------
       GINMEISUI
    ------------------------- */

    case "ginmeisui":

      drawGinmeisui(o);

      break;


    /* -------------------------
       AZUMAYA
    ------------------------- */

    case "azumaya":

      drawAzumaya(o);

      break;


    /* -------------------------
       STAGE
    ------------------------- */

    case "stage":

      drawStage(o);

      break;


    /* -------------------------
       POWER BOX
    ------------------------- */

    case "powerBox":

      ctx.fillStyle = "#8b908a";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.strokeStyle = "#515650";

      ctx.strokeRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    /* -------------------------
       PARK SIGN
    ------------------------- */

    case "parkSign":

      drawParkSign(o);

      break;


    /* -------------------------
       BOOKSHELF
    ------------------------- */

    case "bookshelf":

      ctx.fillStyle = "#76553c";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      for(
        let x = o.x+10;
        x < o.x+o.width-10;
        x += 15
      ){

        ctx.fillStyle =
          (x % 30 === 0)
          ? "#54707c"
          : "#b45d4e";


        ctx.fillRect(
          x,
          o.y+10,
          9,
          45
        );

      }

      break;


    /* -------------------------
       ORIGAMI
    ------------------------- */

    case "origamiDisplay":
    case "display":

      ctx.fillStyle = "#ece9df";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "desk":

      ctx.fillStyle = "#9a795c";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    /* -------------------------
       TORII
    ------------------------- */

    case "torii":

      ctx.fillStyle = "#a64132";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        18
      );

      ctx.fillRect(
        o.x+25,
        o.y,
        20,
        100
      );

      ctx.fillRect(
        o.x+o.width-45,
        o.y,
        20,
        100
      );

      break;


    /* -------------------------
       SHRINE
    ------------------------- */

    case "shrineBuilding":

      ctx.fillStyle = "#69473b";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle = "#35362e";

      ctx.fillRect(
        o.x-30,
        o.y,
        o.width+60,
        35
      );

      break;


    case "omikuji":

      ctx.fillStyle = "#eee9dd";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;

  }

}


/* =========================================================
   TREE
========================================================= */

function drawTree(o){

  /* shadow */

  ctx.fillStyle =
    "rgba(25,60,25,.22)";

  ctx.beginPath();

  ctx.ellipse(
    o.x + o.width/2 + 5,
    o.y + o.height - 2,
    o.width/2,
    8,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* trunk */

  ctx.fillStyle = "#715038";

  ctx.fillRect(
    o.x + o.width/2 - 4,
    o.y + o.height/2,
    8,
    o.height/2
  );


  /* back foliage */

  ctx.fillStyle = "#2f7630";

  ctx.beginPath();

  ctx.arc(
    o.x + o.width/2 + 7,
    o.y + 22,
    o.width/2.15,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* main foliage */

  ctx.fillStyle = "#428a36";

  ctx.beginPath();

  ctx.arc(
    o.x + o.width/2 - 5,
    o.y + 18,
    o.width/2.05,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* highlight */

  ctx.fillStyle =
    "rgba(110,170,65,.7)";

  ctx.beginPath();

  ctx.arc(
    o.x + o.width/2 - 10,
    o.y + 12,
    o.width/5,
    0,
    Math.PI*2
  );

  ctx.fill();

}


/* =========================================================
   INARI SHRINE
========================================================= */

function drawInari(o){

  /* stone base */

  ctx.fillStyle = "#afa792";

  ctx.fillRect(
    o.x,
    o.y+48,
    o.width,
    27
  );


  /* building */

  ctx.fillStyle = "#812f23";

  ctx.fillRect(
    o.x+18,
    o.y+26,
    42,
    38
  );


  /* roof */

  ctx.fillStyle = "#392e29";

  ctx.beginPath();

  ctx.moveTo(
    o.x+7,
    o.y+31
  );

  ctx.lineTo(
    o.x+39,
    o.y+3
  );

  ctx.lineTo(
    o.x+71,
    o.y+31
  );

  ctx.closePath();

  ctx.fill();


  /* small torii */

  ctx.fillStyle = "#b63c2b";

  ctx.fillRect(
    o.x-10,
    o.y+39,
    30,
    5
  );

  ctx.fillRect(
    o.x-4,
    o.y+36,
    4,
    34
  );

  ctx.fillRect(
    o.x+13,
    o.y+36,
    4,
    34
  );

}


/* =========================================================
   SPRING
========================================================= */

function drawSpring(o){

  /* stones */

  ctx.fillStyle = "#787b6c";

  ctx.beginPath();

  ctx.ellipse(
    o.x+32,
    o.y+35,
    34,
    24,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* water */

  ctx.fillStyle = "#70bdc2";

  ctx.beginPath();

  ctx.ellipse(
    o.x+32,
    o.y+34,
    26,
    17,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* shine */

  ctx.fillStyle =
    "rgba(230,255,255,.65)";

  ctx.beginPath();

  ctx.ellipse(
    o.x+23,
    o.y+29,
    8,
    3,
    -.3,
    0,
    Math.PI*2
  );

  ctx.fill();

}


/* =========================================================
   GINMEISUI
========================================================= */

function drawGinmeisui(o){

  ctx.fillStyle = "#806a4a";

  ctx.fillRect(
    o.x,
    o.y+28,
    o.width,
    30
  );


  ctx.fillStyle = "#69abb6";

  ctx.beginPath();

  ctx.ellipse(
    o.x+37,
    o.y+30,
    30,
    15,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle = "#ddd8c7";

  ctx.font = "10px sans-serif";

  ctx.fillText(
    "銀明水",
    o.x+20,
    o.y+55
  );

}


/* =========================================================
   AZUMAYA
========================================================= */

function drawAzumaya(o){

  /* shadow */

  ctx.fillStyle =
    "rgba(0,0,0,.15)";

  ctx.beginPath();

  ctx.ellipse(
    o.x + o.width/2,
    o.y + o.height,
    o.width/2,
    8,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* roof */

  ctx.fillStyle = "#604733";

  ctx.beginPath();

  ctx.moveTo(
    o.x-7,
    o.y+25
  );

  ctx.lineTo(
    o.x+o.width/2,
    o.y
  );

  ctx.lineTo(
    o.x+o.width+7,
    o.y+25
  );

  ctx.closePath();

  ctx.fill();


  /* columns */

  ctx.fillStyle = "#73583e";

  ctx.fillRect(
    o.x+12,
    o.y+24,
    5,
    38
  );

  ctx.fillRect(
    o.x+o.width-17,
    o.y+24,
    5,
    38
  );


  /* bench */

  ctx.fillRect(
    o.x+15,
    o.y+45,
    o.width-30,
    6
  );

}


/* =========================================================
   STAGE
========================================================= */

function drawStage(o){

  /* shadow */

  ctx.fillStyle =
    "rgba(0,0,0,.15)";

  ctx.fillRect(
    o.x+8,
    o.y+70,
    o.width,
    18
  );


  /* back */

  ctx.fillStyle = "#776552";

  ctx.fillRect(
    o.x,
    o.y+30,
    o.width,
    o.height-30
  );


  /* roof */

  ctx.fillStyle = "#4b473e";

  ctx.beginPath();

  ctx.moveTo(
    o.x-10,
    o.y+35
  );

  ctx.lineTo(
    o.x+o.width/2,
    o.y
  );

  ctx.lineTo(
    o.x+o.width+10,
    o.y+35
  );

  ctx.closePath();

  ctx.fill();


  /* stage */

  ctx.fillStyle = "#b4976d";

  ctx.fillRect(
    o.x+12,
    o.y+55,
    o.width-24,
    22
  );

}


/* =========================================================
   PARK SIGN
========================================================= */

function drawParkSign(o){

  ctx.fillStyle = "#684d32";

  ctx.fillRect(
    o.x,
    o.y+8,
    o.width,
    30
  );


  ctx.fillRect(
    o.x+8,
    o.y+35,
    5,
    15
  );


  ctx.fillRect(
    o.x+o.width-13,
    o.y+35,
    5,
    15
  );


  ctx.fillStyle = "#eee6c7";

  ctx.fillRect(
    o.x+5,
    o.y+13,
    o.width-10,
    20
  );


  ctx.fillStyle = "#465545";

  ctx.font = "7px sans-serif";

  ctx.fillText(
    "城址公園",
    o.x+9,
    o.y+26
  );

}


/* =========================================================
   NPC
========================================================= */

function drawNPC(o){

  /* shadow */

  ctx.fillStyle =
    "rgba(0,0,0,.18)";

  ctx.beginPath();

  ctx.ellipse(
    o.x+14,
    o.y+38,
    13,
    5,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* legs */

  ctx.fillStyle = "#454a48";

  ctx.fillRect(
    o.x+7,
    o.y+29,
    5,
    9
  );

  ctx.fillRect(
    o.x+17,
    o.y+29,
    5,
    9
  );


  /* body */

  ctx.fillStyle = "#536e78";

  ctx.fillRect(
    o.x+5,
    o.y+16,
    18,
    17
  );


  /* head */

  ctx.fillStyle = "#efc19f";

  ctx.beginPath();

  ctx.arc(
    o.x+14,
    o.y+9,
    8,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* hair */

  ctx.fillStyle = "#39312e";

  ctx.beginPath();

  ctx.arc(
    o.x+14,
    o.y+6,
    8,
    Math.PI,
    Math.PI*2
  );

  ctx.fill();

}


/* =========================================================
   PLAYER
========================================================= */

function drawPlayer(){

  const bounce =
    player.walking
      ? Math.sin(player.step) * 2
      : 0;


  /* shadow */

  ctx.fillStyle =
    "rgba(0,0,0,.22)";

  ctx.beginPath();

  ctx.ellipse(
    player.x+12,
    player.y+35,
    13,
    5,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* legs */

  ctx.fillStyle = "#313a42";

  ctx.fillRect(
    player.x+5,
    player.y+27+bounce,
    5,
    9
  );

  ctx.fillRect(
    player.x+15,
    player.y+27-bounce,
    5,
    9
  );


  /* body */

  ctx.fillStyle = "#334c63";

  ctx.fillRect(
    player.x+4,
    player.y+14+bounce,
    16,
    17
  );


  /* head */

  ctx.fillStyle = "#efc19f";

  ctx.beginPath();

  ctx.arc(
    player.x+12,
    player.y+9+bounce,
    8,
    0,
    Math.PI*2
  );

  ctx.fill();


  /* hair */

  ctx.fillStyle = "#292724";

  ctx.beginPath();

  ctx.arc(
    player.x+12,
    player.y+6+bounce,
    8,
    Math.PI,
    Math.PI*2
  );

  ctx.fill();

}


/* =========================================================
   PROMPT
========================================================= */

function updatePrompt(){

  const target =
    findTarget();


  const prompt =
    document.getElementById(
      "interactionPrompt"
    );


  if(
    target &&
    !dialogueOpen &&
    !cardOpen &&
    !libraryOpen &&
    !travelling
  ){

    prompt.classList.remove(
      "hidden"
    );

  }

  else {

    prompt.classList.add(
      "hidden"
    );

  }

}


/* =========================================================
   AREA SPLASH
========================================================= */

function showAreaSplash(){

  const splash =
    document.getElementById(
      "areaSplash"
    );


  document.getElementById(
    "areaSplashJapanese"
  ).textContent =
    AREAS[currentArea].name;


  document.getElementById(
    "areaSplashChinese"
  ).textContent =
    AREAS[currentArea].chinese;


  splash.classList.remove(
    "hidden"
  );


  setTimeout(() => {

    splash.classList.add(
      "hidden"
    );

  },1800);

}


/* =========================================================
   HUD
========================================================= */

function updateHUD(){

  document.getElementById(
    "collectionCount"
  ).textContent =
    `${collectedWords.length} / 100`;

}


/* =========================================================
   BUTTONS
========================================================= */

document.getElementById(
  "libraryButton"
).onclick =
  toggleLibrary;


document.getElementById(
  "libraryClose"
).onclick =
  toggleLibrary;


document.getElementById(
  "cardClose"
).onclick = () => {

  document.getElementById(
    "cardPopup"
  ).classList.add(
    "hidden"
  );


  cardOpen = false;

};


/* =========================================================
   LOOP
========================================================= */

function gameLoop(){

  updatePlayer();

  updatePrompt();

  draw();


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================================================
   START
========================================================= */

updateHUD();

loadArea(
  "street"
);

gameLoop();
