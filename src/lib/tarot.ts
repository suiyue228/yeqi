export interface CardMeaning {
  keywords: string;
  message: string;
  practice: string;
}
export interface NightCard {
  id: string;
  number: string;
  name: string;
  motif: string;
  essence: string;
  upright: CardMeaning;
  reversed: CardMeaning;
}

export const NIGHT_ARCANA: NightCard[] = [
  {
    id: "boat",
    number: "0",
    name: "愚者",
    motif: "纸舟",
    essence: "向未知启程",
    upright: {
      keywords: "启程 · 信任 · 好奇",
      message: "纸舟离岸时，岸上的地图还没画完。一个新体验正在邀请你行动。",
      practice: "选择一个代价小、可以回头的尝试，并给它一个开始的时间。",
    },
    reversed: {
      keywords: "冒进 · 迟疑 · 缺少准备",
      message:
        "你可能在冲动起步与迟迟不动之间摆荡。先看清脚边，再决定是否出发。",
      practice: "写出最需要确认的一件事，补齐它后再动身。",
    },
  },
  {
    id: "key",
    number: "I",
    name: "魔术师",
    motif: "钥匠",
    essence: "意志与创造",
    upright: {
      keywords: "创造 · 专注 · 运用",
      message: "钥匠把现有工具摆在桌上。你已有的经验和资源可以开始合作。",
      practice: "选一项拿手的能力，让它解决当前问题的一个小部分。",
    },
    reversed: {
      keywords: "分散 · 空转 · 误用",
      message: "工具很多，却未必朝着同一方向。注意漂亮计划是否替代了实际行动。",
      practice: "暂停一个耗力的分支，把注意力归到一个明确目标。",
    },
  },
  {
    id: "blossom",
    number: "III",
    name: "皇后",
    motif: "花盏",
    essence: "滋养与丰盛",
    upright: {
      keywords: "滋养 · 丰盛 · 生长",
      message: "花从盛水的盏中长出。成长需要照料，也需要安心接受好的事物。",
      practice: "给身体、关系或创作留一份具体的照料。",
    },
    reversed: {
      keywords: "过度付出 · 枯竭 · 忽视需求",
      message: "照料别人时，你自己的杯子可能已经很空。回收一些向外散去的力气。",
      practice: "明确一件你需要被照顾的事，并为它留出资源。",
    },
  },
  {
    id: "throne",
    number: "IV",
    name: "皇帝",
    motif: "石座",
    essence: "秩序与担当",
    upright: {
      keywords: "结构 · 边界 · 承担",
      message: "石座稳稳落地。清晰的规则、范围和责任能让混乱慢慢归位。",
      practice: "为这件事定一个边界、一位负责人和一个可检验的期限。",
    },
    reversed: {
      keywords: "控制 · 僵化 · 失序",
      message: "秩序可能变得过硬，也可能一直没人建立。留意谁在替所有人做决定。",
      practice: "找出一条需要协商的规则，用明确请求替代控制。",
    },
  },
  {
    id: "veil",
    number: "II",
    name: "女祭司",
    motif: "星帘",
    essence: "静听内心",
    upright: {
      keywords: "直觉 · 静观 · 潜意识",
      message: "帘后的信息尚未完全显露。安静的感受可能正在补足理性的线索。",
      practice: "先记录感受与事实的区别，给未知留一点观察时间。",
    },
    reversed: {
      keywords: "忽视直觉 · 封闭 · 混淆",
      message: "你可能把内心声音压得很低，或把猜测当成了证据。",
      practice: "分别写下你感受到的、已经知道的和仍需确认的。",
    },
  },
  {
    id: "book",
    number: "V",
    name: "教皇",
    motif: "双钥",
    essence: "传承与信念",
    upright: {
      keywords: "传承 · 学习 · 共识",
      message:
        "书页和钥匙提示一条被前人走过的路。经验、导师或共同约定可以支持你。",
      practice: "向一个可信的人请教，或找一条值得参考的成熟方法。",
    },
    reversed: {
      keywords: "教条 · 不合身 · 自立",
      message: "曾经有用的答案未必适合现在。你正在辨别哪些规则仍值得留下。",
      practice: "挑一条习以为常的标准，问问它是否仍符合你的价值。",
    },
  },
  {
    id: "moths",
    number: "VI",
    name: "恋人",
    motif: "双蛾",
    essence: "爱与抉择",
    upright: {
      keywords: "联结 · 选择 · 一致",
      message: "两只飞蛾靠近同一束光。关键是让选择与你真正重视的事一致。",
      practice: "把最重要的价值说清楚，给关系或选择一个诚实的回应。",
    },
    reversed: {
      keywords: "分歧 · 犹疑 · 失配",
      message: "愿望与承诺之间可能有一处错位。先听清分歧，再急着寻求和谐。",
      practice: "辨认一次妥协的代价，试着表达你的真实底线。",
    },
  },
  {
    id: "carriage",
    number: "VII",
    name: "战车",
    motif: "月辇",
    essence: "笃定前行",
    upright: {
      keywords: "方向 · 意志 · 推进",
      message: "两只车轮需要同向转动。把分散的力量收拢，可以推动眼前的进展。",
      practice: "选定一个优先方向，拆出本周可以完成的一步。",
    },
    reversed: {
      keywords: "失控 · 拉扯 · 用力过猛",
      message: "越用力未必越靠近目标。两股相反的期待可能正在争夺缰绳。",
      practice: "先停下来校准方向，再决定哪些任务值得继续推动。",
    },
  },
  {
    id: "lion",
    number: "VIII",
    name: "力量",
    motif: "抚狮",
    essence: "温柔的勇气",
    upright: {
      keywords: "耐心 · 勇气 · 温柔",
      message:
        "手掌轻放在狮身旁。真正的力量也可以是容纳情绪，而不让它替你掌舵。",
      practice: "允许感受存在，选择一种温和而坚定的回应。",
    },
    reversed: {
      keywords: "自疑 · 压抑 · 耗竭",
      message: "你可能对自己要求太硬，或把疲惫误认成无能。力量需要恢复。",
      practice: "减少一次自责，给自己一个现实的休息与支持安排。",
    },
  },
  {
    id: "lantern",
    number: "IX",
    name: "隐士",
    motif: "守灯",
    essence: "向内寻光",
    upright: {
      keywords: "独处 · 探索 · 内在指引",
      message: "一盏灯照清脚边。你可能需要暂离喧闹，辨认真正属于自己的方向。",
      practice: "安排一段安静时间，写下一个你已经知道的答案。",
    },
    reversed: {
      keywords: "隔绝 · 迷失 · 拒绝帮助",
      message: "独处可能逐渐变成与支持断开连接。你不必独自完成所有理解。",
      practice: "联系一位让你感到安全的人，分享一部分真实处境。",
    },
  },
  {
    id: "wheel",
    number: "X",
    name: "命运之轮",
    motif: "纺月",
    essence: "转机与循环",
    upright: {
      keywords: "转折 · 周期 · 时机",
      message: "轮子在转，旧阶段与新阶段正在交接。顺着变化观察可行动的窗口。",
      practice: "列出正在变化的条件，抓住其中一个可以回应的机会。",
    },
    reversed: {
      keywords: "反复 · 抗拒 · 节奏受阻",
      message: "同一种困局也许再次出现。看看你是否仍用旧办法应对新局面。",
      practice: "找出一个反复出现的环节，先改其中一个可控因素。",
    },
  },
  {
    id: "scale",
    number: "XI",
    name: "正义",
    motif: "羽秤",
    essence: "诚实与平衡",
    upright: {
      keywords: "公正 · 责任 · 明辨",
      message: "羽毛与石头各有重量。把事实、承诺和后果放在同一张桌上。",
      practice: "依据可核实的信息作判断，并承担属于你的那一份。",
    },
    reversed: {
      keywords: "偏见 · 回避 · 失衡",
      message: "判断里可能混入了单方面的标准，或有一份责任被悄悄移开。",
      practice: "听取被遗漏的视角，重新分清事实、解释与责任。",
    },
  },
  {
    id: "hanging",
    number: "XII",
    name: "倒吊人",
    motif: "悬灯",
    essence: "换一个视角",
    upright: {
      keywords: "暂停 · 换位 · 放下",
      message:
        "倒挂的灯看见另一种景色。暂时放开惯常解法，也许才能看到新的入口。",
      practice: "把一个急于解决的问题留白一天，换个位置重新看它。",
    },
    reversed: {
      keywords: "拖延 · 白费牺牲 · 不肯松手",
      message: "等待可能失去了目的。确认你付出的时间，是否仍在换来理解。",
      practice: "为等待设一个检查点，决定何时继续、调整或离开。",
    },
  },
  {
    id: "chrysalis",
    number: "XIII",
    name: "死神",
    motif: "蜕蝶",
    essence: "告别与新生",
    upright: {
      keywords: "结束 · 蜕变 · 腾出空间",
      message:
        "蝶离开旧壳，转变也需要告别。某种习惯、身份或期待到了收尾的时候。",
      practice: "完成一个小小的告别动作，为接下来的生活腾出空间。",
    },
    reversed: {
      keywords: "抓住过去 · 停滞 · 迟迟收尾",
      message: "变化已开始，但你可能仍攥着旧壳。留恋中也藏着值得被照料的失落。",
      practice: "说清你不舍的究竟是什么，再选择一点可以放下的部分。",
    },
  },
  {
    id: "cups",
    number: "XIV",
    name: "节制",
    motif: "潮杯",
    essence: "调和与节律",
    upright: {
      keywords: "调和 · 恢复 · 适度",
      message:
        "两只杯子缓慢交换水。看似相反的需要，可以找到一个能够共存的节奏。",
      practice: "做一次小幅调整，观察身体和关系是否更舒展。",
    },
    reversed: {
      keywords: "过量 · 失衡 · 急求结果",
      message:
        "某一部分正在占用过多空间。恢复平衡需要具体的节奏，而不是继续加码。",
      practice: "给一件过量的事设限，也给一件被忽略的需要补位。",
    },
  },
  {
    id: "chain",
    number: "XV",
    name: "恶魔",
    motif: "松链",
    essence: "看见束缚",
    upright: {
      keywords: "依附 · 诱惑 · 惯性",
      message: "环上的锁链也许比想象中松。留意短暂满足是否让你远离真正的需要。",
      practice: "辨认一种让你反复付出代价的模式，找一个可以打断它的动作。",
    },
    reversed: {
      keywords: "松绑 · 觉察 · 重获选择",
      message: "你开始看见限制自己的链条。走出来需要行动，也需要体谅反复。",
      practice: "给已经做出的改变一个支持条件，把选择权一点点拿回来。",
    },
  },
  {
    id: "tower",
    number: "XVI",
    name: "高塔",
    motif: "折塔",
    essence: "破局与重建",
    upright: {
      keywords: "揭露 · 松动 · 重建",
      message: "裂缝让被遮住的结构显露。一个不再可靠的前提，需要重新检验。",
      practice: "先稳定眼前可依靠的部分，再检查最需要重建的一处。",
    },
    reversed: {
      keywords: "回避变化 · 内在震动 · 修补",
      message:
        "你也许早已察觉松动，只是还没准备面对。小范围修正可以先于更大的调整。",
      practice: "承认一个被反复忽略的问题，从可承受的修补开始。",
    },
  },
  {
    id: "well",
    number: "XVII",
    name: "星星",
    motif: "星井",
    essence: "希望与疗愈",
    upright: {
      keywords: "希望 · 抚慰 · 重新相信",
      message: "星光在井里留下回声。真实而微小的慰藉，可以支持恢复中的你。",
      practice: "记录一件给你亮光的事，并让它在生活里再发生一次。",
    },
    reversed: {
      keywords: "失望 · 信心低落 · 忘了照料",
      message: "你可能很难看见进展，或把希望全交给一个遥远结果。",
      practice: "把尺度缩小到今天，找一项能够恢复一点能量的行动。",
    },
  },
  {
    id: "tide",
    number: "XVIII",
    name: "月亮",
    motif: "双潮",
    essence: "迷雾与直觉",
    upright: {
      keywords: "朦胧 · 梦境 · 未知",
      message: "两道潮水映出不同月影。感觉很强烈时，更需要区分直觉与猜测。",
      practice: "把事实与担心分开列出，对缺失的信息继续观察。",
    },
    reversed: {
      keywords: "雾散 · 面对恐惧 · 仍需核实",
      message: "一些隐约的担忧开始有了名字。慢慢核实，可以让想象回到现实尺度。",
      practice: "用一个可验证的小问题，替代对整个未来的猜测。",
    },
  },
  {
    id: "sun",
    number: "XIX",
    name: "太阳",
    motif: "晨窗",
    essence: "明朗与喜悦",
    upright: {
      keywords: "明朗 · 活力 · 共享",
      message: "晨窗打开，简单的好事变得可见。允许自己感受成果和联结。",
      practice: "承认一件已经做好的事，和愿意听见的人分享它。",
    },
    reversed: {
      keywords: "亮光暂隐 · 过高期待 · 恢复中",
      message:
        "好事可能已在发生，只是没有符合你设想的模样。给成果一个实际的尺度。",
      practice: "放下一个过高的标准，看见今天已经拥有的进展。",
    },
  },
  {
    id: "trumpet",
    number: "XX",
    name: "审判",
    motif: "唤鸟",
    essence: "觉醒与回应",
    upright: {
      keywords: "觉醒 · 回顾 · 回应",
      message:
        "号角唤醒纸鸟。回看过去的经验，你可能已经准备对一个召唤作出回应。",
      practice: "把最近学到的一件事化成行动，对自己作一次诚实确认。",
    },
    reversed: {
      keywords: "自我苛责 · 犹豫 · 抗拒回应",
      message:
        "内在的评判声可能盖住了真正的愿望。理解经历可以先于给自己下结论。",
      practice: "用学习的语气复盘一次经历，替代对自己的审判。",
    },
  },
  {
    id: "wreath",
    number: "XXI",
    name: "世界",
    motif: "环门",
    essence: "圆满与整合",
    upright: {
      keywords: "完成 · 整合 · 新周期",
      message: "叶环合拢成门。看见这一程已经积累的经验，给完成一个清楚的仪式。",
      practice: "为一段阶段性完成作记录，再挑一个愿意带走的收获。",
    },
    reversed: {
      keywords: "未竟 · 临门停步 · 缺少收尾",
      message: "你可能已走得很远，却还有一点未完成的整理。收尾也属于过程。",
      practice: "列出最小的收尾动作，让一个悬而未决的环节落地。",
    },
  },
].sort((a, b) => arcanaIndex(a.number) - arcanaIndex(b.number));

function arcanaIndex(number: string): number {
  return [
    "0",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
    "XXI",
  ].indexOf(number);
}

export interface SpreadPosition {
  title: string;
  question: string;
  lens: string;
}
export const TAROT_SPREADS = {
  moon: {
    title: "月影三问",
    description: "认识当前处境，三张牌。",
    positions: [
      {
        title: "眼前",
        question: "目前最需要看见的是什么？",
        lens: "这张牌描绘你现在与问题相处的方式。",
      },
      {
        title: "暗处",
        question: "还有哪些需要、顾虑或资源？",
        lens: "在容易被忽略的一层，这张牌提醒你留意以下线索。",
      },
      {
        title: "下一步",
        question: "怎样迈出可行的一步？",
        lens: "把这张牌作为接下来的行动方向来理解。",
      },
    ],
  },
  river: {
    title: "时间之河",
    description: "看清来处、当下与发展方向，三张牌。",
    positions: [
      {
        title: "来处",
        question: "什么经验正在影响此刻？",
        lens: "把这张牌放在已经发生的经验里，看看它如何影响现在。",
      },
      {
        title: "当下",
        question: "目前的重心落在哪里？",
        lens: "在当下的位置，它呈现你正在处理的核心课题。",
      },
      {
        title: "走向",
        question: "沿当前节奏可能走向何处？",
        lens: "这是当前模式继续时的一个可能方向，可以通过你的行动调整。",
      },
    ],
  },
  paths: {
    title: "岔路星盘",
    description: "比较两条路及各自代价，五张牌。",
    positions: [
      {
        title: "现状",
        question: "我从什么位置作选择？",
        lens: "先把这张牌视为你作选择时的出发点。",
      },
      {
        title: "道路 A",
        question: "这条路会调动什么力量？",
        lens: "想象走向道路 A 时，这张牌会带来怎样的资源与要求。",
      },
      {
        title: "道路 B",
        question: "另一条路有哪些机会与牵挂？",
        lens: "这张牌呈现道路 B 值得看见的一面，也包括它需要你付出的部分。",
      },
      {
        title: "盲点",
        question: "比较两条路时遗漏了什么？",
        lens: "放到选择的盲点里，它提示一种需要补充考虑的因素。",
      },
      {
        title: "建议",
        question: "我怎样作出更适合自己的决定？",
        lens: "建议位把关注点交还给你的做法与判断。",
      },
    ],
  },
} satisfies Record<
  string,
  { title: string; description: string; positions: SpreadPosition[] }
>;

export type SpreadId = keyof typeof TAROT_SPREADS;
export interface DrawnCard {
  card: NightCard;
  reversed: boolean;
}
export function dealNightCards(
  includeReversed = true,
  random = Math.random,
): DrawnCard[] {
  const deck = NIGHT_ARCANA.map((card) => ({
    card,
    reversed: includeReversed && random() < 0.5,
  }));
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
}
export function cutNightDeck(deck: DrawnCard[], cut: number): DrawnCard[] {
  const offset = ((cut % deck.length) + deck.length) % deck.length;
  return [...deck.slice(offset), ...deck.slice(0, offset)];
}
export function meaningOf(draw: DrawnCard): CardMeaning {
  return draw.reversed ? draw.card.reversed : draw.card.upright;
}
export function summarizeReading(
  draws: DrawnCard[],
  spreadId: SpreadId,
): string {
  const spread = TAROT_SPREADS[spreadId];
  const first = draws[0],
    last = draws[draws.length - 1];
  const reversedCount = draws.filter((draw) => draw.reversed).length;
  const middle = draws[1];
  if (spreadId === "paths") {
    return `你从「${first.card.name}」出发。道路 A 的「${draws[1].card.name}」带来${meaningOf(draws[1]).keywords}，道路 B 的「${draws[2].card.name}」侧重${meaningOf(draws[2]).keywords}。比较时也请带上盲点位「${draws[3].card.name}」的提醒。建议位落在「${last.card.name}」：${meaningOf(last).practice}`;
  }
  return `这组牌从${spread.positions[0].title}的「${first.card.name}」经过「${middle.card.name}」，走到${spread.positions[2].title}的「${last.card.name}」。中间的线索是${meaningOf(middle).keywords}。${reversedCount > 0 ? `其中 ${reversedCount} 张逆位，值得多留意内在阻力、延迟或尚未整合的经验。` : "三张均为正位，可以留意它们怎样彼此配合。"}${meaningOf(last).practice}`;
}
