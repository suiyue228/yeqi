export const NIGHT_ARCANA = [
  {
    id: "boat",
    number: "0",
    name: "愚者",
    motif: "纸舟",
    reading: "试着把未知当成一小段可以摸索的路。",
    prompt: "哪件小事，值得我先做一步？",
  },
  {
    id: "key",
    number: "I",
    name: "魔术师",
    motif: "钥匠",
    reading: "看看手边已有的工具，也许有一件一直被低估。",
    prompt: "我已经有什么可以用上？",
  },
  {
    id: "veil",
    number: "II",
    name: "女祭司",
    motif: "星帘",
    reading: "给那些还没找到名字的感受留一点空白。",
    prompt: "安静下来时，我最先听见什么？",
  },
  {
    id: "lantern",
    number: "IX",
    name: "隐士",
    motif: "守灯",
    reading: "一盏灯照不了整条路，但能照清脚边。",
    prompt: "眼下哪一点已经足够明白？",
  },
  {
    id: "wheel",
    number: "X",
    name: "命运之轮",
    motif: "纺月",
    reading: "变化有自己的节奏，找找能由你掌握的那一圈。",
    prompt: "哪些事在变，哪些事仍在我手里？",
  },
  {
    id: "scale",
    number: "XI",
    name: "正义",
    motif: "羽秤",
    reading: "把事实和自己的解释放在秤的两边，各看一眼。",
    prompt: "怎样看待这件事，对自己更公平？",
  },
  {
    id: "cups",
    number: "XIV",
    name: "节制",
    motif: "潮杯",
    reading: "两种需要可以同时存在，试着给它们各留一处。",
    prompt: "我想给什么多一点，也给什么少一点？",
  },
  {
    id: "tower",
    number: "XVI",
    name: "高塔",
    motif: "折塔",
    reading: "发现一处松动时，可以先放下撑住一切的力气。",
    prompt: "哪条早已不合身的规矩可以松一松？",
  },
  {
    id: "well",
    number: "XVII",
    name: "星星",
    motif: "星井",
    reading: "记下一点真实的慰藉，让它在暗处有名字。",
    prompt: "最近是什么给了我一点亮光？",
  },
  {
    id: "tide",
    number: "XVIII",
    name: "月亮",
    motif: "双潮",
    reading: "朦胧时可以多观察一会儿，允许答案暂时有两种。",
    prompt: "这里有哪些事实，哪些是我的猜测？",
  },
  {
    id: "sun",
    number: "XIX",
    name: "太阳",
    motif: "晨窗",
    reading: "给简单而明亮的事多留片刻，让身体也记住。",
    prompt: "今天有什么微小的好事可以承认？",
  },
  {
    id: "wreath",
    number: "XXI",
    name: "世界",
    motif: "环门",
    reading: "回头看看已经走完的这一圈，给它一个收尾。",
    prompt: "有什么值得我正式说一句谢谢或再见？",
  },
] as const;

export const TAROT_SPREAD = [
  { title: "眼前", detail: "我此刻看见了什么？" },
  { title: "暗处", detail: "有什么还没被我留意？" },
  { title: "下一步", detail: "我愿意试哪一件小事？" },
] as const;

export type NightCard = (typeof NIGHT_ARCANA)[number];

export function dealNightCards() {
  const deck: NightCard[] = [...NIGHT_ARCANA];
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck.slice(0, 6);
}
