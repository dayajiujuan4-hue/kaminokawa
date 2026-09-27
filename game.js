const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");


/* ==============================
   GAME STATE
================================ */

let currentArea =
  "street";

let collectedWords =
  JSON.parse(
    localStorage.getItem("kaminokawaWords") || "[]"
  );

let keys = {};

let dialogueOpen =
  false;

let libraryOpen =
  false;

let cardOpen =
  false;

let currentTarget =
  null;


/* ==============================
   PLAYER
================================ */

const player = {

  x: 620,
  y: 500,

  width: 24,
  height: 36,

  speed: 3.2,

  direction: "down",

  walking: false,

  step: 0

};


/* ==============================
   MAP OBJECTS
================================ */

let objects = [];


/* ==============================
   HELPERS
================================ */

function rectCollision(a, b) {

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );

}


function distance(a, b) {

  const ax =
    a.x + a.width / 2;

  const ay =
    a.y + a.height / 2;

  const bx =
    b.x + b.width / 2;

  const by =
    b.y + b.height / 2;

  return Math.hypot(
    ax - bx,
    ay - by
  );

}


/* ==============================
   MAP LOAD
================================ */

function loadArea(area, spawn = null) {

  currentArea =
    area;

  document.getElementById(
    "areaName"
  ).textContent =
    AREAS[area].name;


  objects = [];


  if(area === "street")
    buildStreet();

  if(area === "castle")
    buildCastle();

  if(area === "library")
    buildLibrary();

  if(area === "origami")
    buildOrigami();

  if(area === "shrine")
    buildShrine();


  if(spawn) {

    player.x =
      spawn.x;

    player.y =
      spawn.y;

  }


  showAreaSplash();

}


/* ==============================
   OBJECT FACTORIES
================================ */

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


/* ==============================
   STREET
================================ */

function buildStreet(){

  addObject(
    "house",
    80,80,
    210,130
  );

  addObject(
    "shop",
    350,75,
    220,140,
    {
      label:"商店"
    }
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
      jp:"これは自動販売機です。",
      cn:"这是自动售货机。",
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


  addTravel(
    1180,
    250,
    70,
    220,

    "castle",

    {
      x:80,
      y:400
    }
  );


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


/* ==============================
   CASTLE
================================ */

function buildCastle(){

  addObject(
    "water",
    180,110,
    900,90,
    {
      solid:true
    }
  );


  addObject(
    "bridge",
    580,105,
    120,110,
    {
      solid:false
    }
  );


  addObject(
    "stone",
    350,280,
    580,70
  );


  addNPC(
    720,
    430,

    "歴史に詳しいおじいさん",

    "ここには昔、上三川城という城があったんだよ。",

    "这里以前有一座叫上三川城的城。",

    6
  );


  addObject(
    "sign",
    450,430,
    35,40,
    {
      jp:"城の周りには堀がありました。",
      cn:"城的周围曾经有护城河。",
      word:7
    }
  );


  addTravel(
    20,
    260,
    60,
    220,

    "street",

    {
      x:1120,
      y:400
    }
  );


  addTravel(
    1180,
    260,
    60,
    220,

    "library",

    {
      x:80,
      y:400
    }
  );

}


/* ==============================
   LIBRARY
================================ */

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
      jp:"折り紙の作品が展示されています。",
      cn:"这里展示着折纸作品。",
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
      y:400
    }
  );

}


/* ==============================
   ORIGAMI PLAZA
================================ */

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
      y:100
    }
  );

}


/* ==============================
   SHRINE
================================ */

function buildShrine(){

  addObject(
    "torii",
    540,80,
    200,70,
    {
      jp:"大きな鳥居があります。",
      cn:"这里有一座巨大的鸟居。",
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
      jp:"おみくじを引いてみますか？",
      cn:"要不要抽一张神签？",
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


/* ==============================
   INPUT
================================ */

window.addEventListener(
  "keydown",
  e => {

    keys[
      e.key.toLowerCase()
    ] = true;


    if(
      e.key.toLowerCase() === "e" ||
      e.key === "Enter"
    ){

      interact();

    }


    if(
      e.key.toLowerCase() === "l"
    ){

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


/* ==============================
   MOVEMENT
================================ */

function updatePlayer(){

  if(
    dialogueOpen ||
    libraryOpen ||
    cardOpen
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


  player.walking =
    dx !== 0 ||
    dy !== 0;


  if(player.walking)
    player.step += .15;


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
    )
      blockedX = true;


    if(
      rectCollision(
        nextY,
        obj
      )
    )
      blockedY = true;

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


/* ==============================
   TRAVEL
================================ */

function checkTravel(){

  objects.forEach(obj => {

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

    }

  });

}


function travelTo(
  destination,
  spawn
){

  const overlay =
    document.getElementById(
      "travelOverlay"
    );


  document.getElementById(
    "travelDestination"
  ).textContent =
    AREAS[
      destination
    ].name;


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

  },600);

}


/* ==============================
   INTERACTION
================================ */

function findTarget(){

  let closest = null;

  let closestDistance =
    Infinity;


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
      d < 85 &&
      d < closestDistance
    ){

      closest =
        obj;

      closestDistance =
        d;

    }

  });


  return closest;

}


function interact(){

  if(cardOpen)
    return;


  if(dialogueOpen){

    closeDialogue();
    return;

  }


  const target =
    findTarget();


  if(!target)
    return;


  currentTarget =
    target;


  openDialogue(
    target.name ||
    "調べる",

    target.jp,

    target.cn,

    target.word
  );

}


/* ==============================
   DIALOGUE
================================ */

function openDialogue(
  speaker,
  jp,
  cn,
  word
){

  dialogueOpen =
    true;


  document.getElementById(
    "speakerName"
  ).textContent =
    speaker;


  document.getElementById(
    "dialogueJapanese"
  ).textContent =
    jp;


  document.getElementById(
    "dialogueChinese"
  ).textContent =
    cn;


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


  dialogueOpen =
    false;


  if(
    currentTarget &&
    currentTarget.word
  ){

    collectWord(
      currentTarget.word
    );

  }


  currentTarget =
    null;

}


/* ==============================
   WORD COLLECTION
================================ */

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


  if(word)
    showWordCard(word);

}


function showWordCard(word){

  cardOpen =
    true;


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


/* ==============================
   LIBRARY
================================ */

function renderLibrary(){

  const grid =
    document.getElementById(
      "libraryGrid"
    );


  grid.innerHTML = "";


  for(let i = 1; i <= 100; i++){

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


    if(!unlocked)
      item.classList.add(
        "word-locked"
      );


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


    grid.appendChild(
      item
    );

  }


  document.getElementById(
    "libraryProgressText"
  ).textContent =
    `${collectedWords.length} / 100`;


  document.getElementById(
    "progressFill"
  ).style.width =
    `${collectedWords.length}%`;

}


function toggleLibrary(){

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


/* ==============================
   DRAW
================================ */

function draw(){

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  drawGround();

  drawRoads();


  objects.forEach(
    drawObject
  );


  drawPlayer();

}


/* ==============================
   GROUND
================================ */

function drawGround(){

  if(currentArea === "street")
    ctx.fillStyle = "#9eb985";

  else if(currentArea === "castle")
    ctx.fillStyle = "#8eae79";

  else if(currentArea === "library")
    ctx.fillStyle = "#d7cbb6";

  else if(currentArea === "origami")
    ctx.fillStyle = "#d9d4c4";

  else
    ctx.fillStyle = "#98ae83";


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* ==============================
   ROADS
================================ */

function drawRoads(){

  if(currentArea === "street"){

    ctx.fillStyle =
      "#747875";

    ctx.fillRect(
      0,
      280,
      1280,
      250
    );


    ctx.fillStyle =
      "#d9d9d3";


    for(
      let x=30;
      x<1280;
      x+=100
    ){

      ctx.fillRect(
        x,
        398,
        55,
        8
      );

    }


    /* sidewalks */

    ctx.fillStyle =
      "#c7c5ba";

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

    ctx.fillStyle =
      "#b7aa8e";

    ctx.fillRect(
      575,
      0,
      130,
      720
    );

  }

}


/* ==============================
   OBJECT DRAW
================================ */

function drawObject(o){

  switch(o.type){

    case "house":

      ctx.fillStyle =
        "#e8e0cf";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle =
        "#55534f";

      ctx.fillRect(
        o.x-10,
        o.y-20,
        o.width+20,
        30
      );

      break;


    case "shop":

      ctx.fillStyle =
        "#ddd0b2";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle =
        "#5f4637";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        30
      );


      ctx.fillStyle =
        "#fff";

      ctx.font =
        "18px sans-serif";

      ctx.fillText(
        "商 店",
        o.x+75,
        o.y+25
      );

      break;


    case "npc":

      drawNPC(o);

      break;


    case "vending":

      ctx.fillStyle =
        "#e7e7e7";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle =
        "#75a3b5";

      ctx.fillRect(
        o.x+5,
        o.y+8,
        o.width-10,
        18
      );

      break;


    case "water":

      ctx.fillStyle =
        "#709ca0";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "bridge":

      ctx.fillStyle =
        "#b9aa8b";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "stone":

      ctx.fillStyle =
        "#77796e";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "sign":

      ctx.fillStyle =
        "#765a3b";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "bookshelf":

      ctx.fillStyle =
        "#76553c";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      for(
        let x=o.x+10;
        x<o.x+o.width-10;
        x+=15
      ){

        ctx.fillStyle =
          "#b45d4e";

        ctx.fillRect(
          x,
          o.y+10,
          9,
          45
        );

      }

      break;


    case "origamiDisplay":

    case "display":

      ctx.fillStyle =
        "#ece9df";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "desk":

      ctx.fillStyle =
        "#9a795c";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;


    case "torii":

      ctx.fillStyle =
        "#a64132";

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


    case "shrineBuilding":

      ctx.fillStyle =
        "#69473b";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );


      ctx.fillStyle =
        "#35362e";

      ctx.fillRect(
        o.x-30,
        o.y,
        o.width+60,
        35
      );

      break;


    case "omikuji":

      ctx.fillStyle =
        "#eee9dd";

      ctx.fillRect(
        o.x,
        o.y,
        o.width,
        o.height
      );

      break;

  }

}


/* ==============================
   NPC
================================ */

function drawNPC(o){

  ctx.fillStyle =
    "#f1c5a5";

  ctx.beginPath();

  ctx.arc(
    o.x + 14,
    o.y + 9,
    8,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle =
    "#4f6773";

  ctx.fillRect(
    o.x+5,
    o.y+17,
    18,
    21
  );

}


/* ==============================
   PLAYER DRAW
================================ */

function drawPlayer(){

  const bounce =
    player.walking
      ? Math.sin(player.step)*2
      : 0;


  /* shadow */

  ctx.fillStyle =
    "rgba(0,0,0,.2)";

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


  /* body */

  ctx.fillStyle =
    "#334c63";

  ctx.fillRect(
    player.x+4,
    player.y+14+bounce,
    16,
    20
  );


  /* head */

  ctx.fillStyle =
    "#efc19f";

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

  ctx.fillStyle =
    "#292724";

  ctx.fillRect(
    player.x+5,
    player.y+2+bounce,
    14,
    5
  );

}


/* ==============================
   INTERACTION PROMPT
================================ */

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
    !libraryOpen
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


/* ==============================
   AREA SPLASH
================================ */

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


/* ==============================
   HUD
================================ */

function updateHUD(){

  document.getElementById(
    "collectionCount"
  ).textContent =
    `${collectedWords.length} / 100`;

}


/* ==============================
   BUTTONS
================================ */

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

  cardOpen =
    false;

};


/* ==============================
   GAME LOOP
================================ */

function gameLoop(){

  updatePlayer();

  updatePrompt();

  draw();

  requestAnimationFrame(
    gameLoop
  );

}


/* ==============================
   START
================================ */

updateHUD();

loadArea(
  "street"
);

gameLoop();
