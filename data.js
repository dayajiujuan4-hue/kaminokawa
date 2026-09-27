const WORDS = [

  {
    id: 1,
    jp: "こんにちは",
    reading: "こんにちは",
    cn: "你好",
    example: "こんにちは。今日はいい天気ですね。"
  },

  {
    id: 2,
    jp: "すみません",
    reading: "すみません",
    cn: "不好意思 / 对不起",
    example: "すみません、図書館はどこですか？"
  },

  {
    id: 3,
    jp: "商店",
    reading: "しょうてん",
    cn: "商店",
    example: "この通りには商店があります。"
  },

  {
    id: 4,
    jp: "自動販売機",
    reading: "じどうはんばいき",
    cn: "自动售货机",
    example: "自動販売機でお茶を買いました。"
  },

  {
    id: 5,
    jp: "横断歩道",
    reading: "おうだんほどう",
    cn: "人行横道",
    example: "横断歩道を渡りましょう。"
  },

  {
    id: 6,
    jp: "城",
    reading: "しろ",
    cn: "城堡",
    example: "ここには昔、城がありました。"
  },

  {
    id: 7,
    jp: "堀",
    reading: "ほり",
    cn: "护城河",
    example: "城の周りに堀があります。"
  },

  {
    id: 8,
    jp: "石垣",
    reading: "いしがき",
    cn: "石墙 / 石垣",
    example: "古い石垣が残っています。"
  },

  {
    id: 9,
    jp: "橋",
    reading: "はし",
    cn: "桥",
    example: "橋を渡って公園に入ります。"
  },

  {
    id: 10,
    jp: "桜",
    reading: "さくら",
    cn: "樱花",
    example: "春になると桜が咲きます。"
  },

  {
    id: 11,
    jp: "図書館",
    reading: "としょかん",
    cn: "图书馆",
    example: "図書館で本を読みます。"
  },

  {
    id: 12,
    jp: "本",
    reading: "ほん",
    cn: "书",
    example: "日本の歴史の本を読みました。"
  },

  {
    id: 13,
    jp: "読む",
    reading: "よむ",
    cn: "读",
    example: "私は本を読みます。"
  },

  {
    id: 14,
    jp: "借りる",
    reading: "かりる",
    cn: "借",
    example: "図書館で本を借ります。"
  },

  {
    id: 15,
    jp: "返す",
    reading: "かえす",
    cn: "归还",
    example: "来週、本を返します。"
  },

  {
    id: 16,
    jp: "折り紙",
    reading: "おりがみ",
    cn: "折纸",
    example: "折り紙で鶴を作ります。"
  },

  {
    id: 17,
    jp: "紙",
    reading: "かみ",
    cn: "纸",
    example: "四角い紙を使います。"
  },

  {
    id: 18,
    jp: "折る",
    reading: "おる",
    cn: "折",
    example: "紙を半分に折ります。"
  },

  {
    id: 19,
    jp: "鶴",
    reading: "つる",
    cn: "鹤",
    example: "折り紙で鶴を折りました。"
  },

  {
    id: 20,
    jp: "作品",
    reading: "さくひん",
    cn: "作品",
    example: "すばらしい作品ですね。"
  },

  {
    id: 21,
    jp: "神社",
    reading: "じんじゃ",
    cn: "神社",
    example: "日本の神社を訪れました。"
  },

  {
    id: 22,
    jp: "鳥居",
    reading: "とりい",
    cn: "鸟居",
    example: "鳥居をくぐります。"
  },

  {
    id: 23,
    jp: "参拝",
    reading: "さんぱい",
    cn: "参拜",
    example: "神社で参拝します。"
  },

  {
    id: 24,
    jp: "おみくじ",
    reading: "おみくじ",
    cn: "神签",
    example: "おみくじを引いてみましょう。"
  },

  {
    id: 25,
    jp: "お守り",
    reading: "おまもり",
    cn: "护身符",
    example: "神社でお守りをいただきました。"
  },

  {
    id: 26,
    jp: "御朱印",
    reading: "ごしゅいん",
    cn: "御朱印",
    example: "参拝の記念に御朱印をいただきました。"
  },

  {
    id: 27,
    jp: "田んぼ",
    reading: "たんぼ",
    cn: "水田",
    example: "町の外には田んぼが広がっています。"
  },

  {
    id: 28,
    jp: "住宅",
    reading: "じゅうたく",
    cn: "住宅",
    example: "静かな住宅街を歩きます。"
  },

  {
    id: 29,
    jp: "散歩",
    reading: "さんぽ",
    cn: "散步",
    example: "町をゆっくり散歩します。"
  },

  {
    id: 30,
    jp: "町",
    reading: "まち",
    cn: "城镇 / 小镇",
    example: "上三川は静かな町です。"
  },

  {
    id: 31,
    jp: "芝生",
    reading: "しばふ",
    cn: "草坪",
    example: "芝生の上で遊びます。"
  },

  {
    id: 32,
    jp: "稲荷神社",
    reading: "いなりじんじゃ",
    cn: "稻荷神社",
    example: "公園の中に小さな稲荷神社があります。"
  },

  {
    id: 33,
    jp: "湧水",
    reading: "ゆうすい",
    cn: "泉水 / 涌泉",
    example: "ここでは地下から水が湧き出しています。"
  },

  {
    id: 34,
    jp: "銀明水",
    reading: "ぎんめいすい",
    cn: "银明水",
    example: "銀明水は上三川七水のひとつです。"
  },

  {
    id: 35,
    jp: "四阿",
    reading: "あずまや",
    cn: "凉亭",
    example: "四阿で少し休みましょう。"
  },

  {
    id: 36,
    jp: "野外ステージ",
    reading: "やがいステージ",
    cn: "露天舞台",
    example: "公園には野外ステージがあります。"
  },

  {
    id: 37,
    jp: "案内板",
    reading: "あんないばん",
    cn: "导览牌",
    example: "案内板で公園の地図を確認します。"
  },

  {
    id: 38,
    jp: "散策路",
    reading: "さんさくろ",
    cn: "散步道",
    example: "散策路を歩いて公園を一周します。"
  },

  {
    id: 39,
    jp: "木陰",
    reading: "こかげ",
    cn: "树荫",
    example: "暑いので木陰で休みます。"
  },

  {
    id: 40,
    jp: "公園",
    reading: "こうえん",
    cn: "公园",
    example: "休日に公園を散歩しました。"
  }

];


/* =========================
   AREA DATA
========================= */

const AREAS = {

  street: {
    name: "上三川通り",
    chinese: "上三川街道"
  },

  castle: {
    name: "上三川城址公園",
    chinese: "上三川城址公园"
  },

  library: {
    name: "上三川町立図書館",
    chinese: "上三川町立图书馆"
  },

  origami: {
    name: "ORIGAMIプラザ",
    chinese: "ORIGAMI广场"
  },

  shrine: {
    name: "白鷺神社",
    chinese: "白鹭神社"
  }

};
