"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Check,
  Copy,
  Flame,
  RefreshCcw,
  Sparkles,
  Wand2,
  X
} from "lucide-react";
import "./rest-restart.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Dimension = "energy" | "anchor" | "strategy" | "tempo";
type Scores = Record<"I" | "E" | "A" | "V" | "P" | "F" | "S" | "R", number>;
type RestCode = `${"I" | "E"}${"A" | "V"}${"P" | "F"}${"S" | "R"}`;

type Option = {
  text: string;
  sub: string;
  weights: Partial<Scores>;
};

type Question = {
  title: string;
  scene: string;
  options: Option[];
};

type RestType = {
  code: RestCode;
  name: string;
  shortName: string;
  summary: string;
  advisor: string;
  reflection: string;
  careers: string[];
  dreamBoard: string[];
  microAction: string;
  palette: string;
};

const baseScores: Scores = {
  I: 0,
  E: 0,
  A: 0,
  V: 0,
  P: 0,
  F: 0,
  S: 0,
  R: 0
};

const dimensionPairs: Record<Dimension, readonly [keyof Scores, keyof Scores]> = {
  energy: ["I", "E"],
  anchor: ["A", "V"],
  strategy: ["P", "F"],
  tempo: ["S", "R"]
};

const questions: Question[] = [
  {
    title: "凌晨 1:17，你突然想重启人生。",
    scene: "手机还亮着，窗外像一块缓慢发光的蓝玻璃。你第一步会做什么？",
    options: [
      { text: "打开备忘录，把旧事一条条写完", sub: "先安静地回收能量", weights: { I: 3, A: 2, P: 1, S: 1 } },
      { text: "给一个懂你的人发语音", sub: "在回应里确认自己", weights: { E: 3, A: 2, F: 1, S: 1 } },
      { text: "搜索一个从没去过的城市", sub: "先让未来变得可见", weights: { V: 3, E: 1, F: 1, R: 1 } },
      { text: "删掉一个让你反复内耗的入口", sub: "今晚就切断回路", weights: { R: 3, I: 1, A: 1, P: 1 } }
    ]
  },
  {
    title: "你获得一张空白的第二人生通行证。",
    scene: "通行证需要盖上第一个印章，才会显示下一段路线。",
    options: [
      { text: "盖在旧日记旁边", sub: "把过去变成地图", weights: { A: 3, I: 2, S: 1 } },
      { text: "盖在未来蓝图中央", sub: "先定义新身份", weights: { V: 3, P: 2, I: 1 } },
      { text: "盖在朋友们的合照上", sub: "让关系成为起点", weights: { E: 3, A: 1, S: 1 } },
      { text: "盖在一张单程票上", sub: "用行动宣布开始", weights: { R: 3, V: 2, F: 1 } }
    ]
  },
  {
    title: "你要做一个 Dream Board。",
    scene: "桌面上散着照片、车票、颜料和一张空白画布。",
    options: [
      { text: "按主题分区：工作、身体、关系、自由", sub: "清晰会带来安全感", weights: { P: 3, V: 1, S: 1 } },
      { text: "把最有感觉的图先贴上去", sub: "让直觉替你排序", weights: { F: 3, V: 1, I: 1 } },
      { text: "保留旧照片，旁边贴新的可能性", sub: "不急着抹掉任何一段", weights: { A: 3, S: 2, I: 1 } },
      { text: "约朋友现场共创一版", sub: "在碰撞里看见自己", weights: { E: 3, F: 1, R: 1 } }
    ]
  },
  {
    title: "你遇到一个旧模式复发的下午。",
    scene: "熟悉的焦虑感又来了，像旧程序在后台自动启动。",
    options: [
      { text: "暂停社交，给自己一小时复盘", sub: "从内部重新校准", weights: { I: 3, A: 1, P: 1 } },
      { text: "出门走路，换一个身体状态", sub: "先动起来，再理解", weights: { E: 2, R: 2, F: 1 } },
      { text: "拆成三件今天能做的小事", sub: "用微习惯夺回控制权", weights: { P: 3, S: 2 } },
      { text: "临时改变计划，做一件反常的小事", sub: "给命运一个岔路口", weights: { F: 3, R: 2, V: 1 } }
    ]
  },
  {
    title: "一位未来的你给你寄来包裹。",
    scene: "盒子里只能放一样东西，你希望它是什么？",
    options: [
      { text: "一封解释过去为何值得的信", sub: "你需要和解的证据", weights: { A: 3, I: 2, S: 1 } },
      { text: "一份十年后的日程表", sub: "你想知道路怎样走", weights: { V: 2, P: 3, S: 1 } },
      { text: "一张新城市的门禁卡", sub: "你想要立即进入新场景", weights: { V: 2, R: 3, E: 1 } },
      { text: "一小瓶没有标签的香水", sub: "你相信答案会慢慢显影", weights: { F: 3, I: 1, V: 1 } }
    ]
  },
  {
    title: "你要向旧生活告别。",
    scene: "系统询问你：选择一种告别方式。",
    options: [
      { text: "一个人整理房间，留下该留下的", sub: "温柔地完成清点", weights: { I: 2, A: 3, P: 1, S: 1 } },
      { text: "办一场小型告别派对", sub: "让人群见证转换", weights: { E: 3, A: 2, R: 1 } },
      { text: "发一段公开宣言", sub: "说出口就是新版本", weights: { E: 2, V: 2, R: 2 } },
      { text: "不告别，只在某天自然不再回头", sub: "像换季一样发生", weights: { F: 3, S: 2, V: 1 } }
    ]
  },
  {
    title: "你的重启计划卡住了。",
    scene: "任务清单被画了很多圈，但真正动起来的部分很少。",
    options: [
      { text: "重写里程碑，把第一步缩小", sub: "降低启动阻力", weights: { P: 3, S: 2 } },
      { text: "直接报名一个活动，逼自己入场", sub: "用外部能量破局", weights: { E: 3, R: 2, V: 1 } },
      { text: "做一张情绪地图，找出真正的阻碍", sub: "先听懂自己", weights: { I: 3, A: 2, F: 1 } },
      { text: "随机抽一个方向试三天", sub: "让实验替代纠结", weights: { F: 3, R: 1, V: 1 } }
    ]
  },
  {
    title: "你最想拥有哪一种重启道具？",
    scene: "四件发光物品漂浮在你面前。",
    options: [
      { text: "记忆考古灯", sub: "照亮旧伤和旧热爱", weights: { I: 2, A: 3, S: 1 } },
      { text: "未来身份面具", sub: "先扮演，再成为", weights: { E: 1, V: 3, R: 2 } },
      { text: "命运甘特图", sub: "每一步都能被安排", weights: { P: 3, V: 1, S: 1 } },
      { text: "随缘传送门", sub: "走进去才知道去哪", weights: { F: 3, E: 1, R: 1 } }
    ]
  },
  {
    title: "如果有 30 天做实验，你会怎么安排？",
    scene: "倒计时已经开始，页面等待你选择模式。",
    options: [
      { text: "每天一个 20 分钟微行动", sub: "让新生活长出来", weights: { S: 3, P: 2 } },
      { text: "第 1 天就做最大改变", sub: "先把旧轨道炸开", weights: { R: 3, V: 1, E: 1 } },
      { text: "前 10 天独处观察，后 20 天行动", sub: "先向内，再向外", weights: { I: 3, A: 1, P: 1 } },
      { text: "每天根据直觉换一个任务", sub: "用流动保持新鲜", weights: { F: 3, E: 1, S: 1 } }
    ]
  },
  {
    title: "你在梦里进入一座重启城市。",
    scene: "四个区域同时亮起，你被其中一个吸引。",
    options: [
      { text: "旧书仓库与手写信博物馆", sub: "那里保存着你的根", weights: { A: 3, I: 2, S: 1 } },
      { text: "悬浮建筑学院与观星台", sub: "那里训练未来想象力", weights: { V: 3, P: 1, I: 1 } },
      { text: "夜市、舞台和共享工坊", sub: "那里有连接和即兴", weights: { E: 3, F: 2 } },
      { text: "机场、高速路和倒计时塔", sub: "那里只欢迎快速决定", weights: { R: 3, V: 1, E: 1 } }
    ]
  },
  {
    title: "别人最容易误解你的重启方式。",
    scene: "他们以为你停在原地，其实你的系统正在后台编译。",
    options: [
      { text: "我沉默时，其实在处理很深的东西", sub: "独处不是退缩", weights: { I: 3, A: 1 } },
      { text: "我热闹时，其实在寻找新的自己", sub: "连接不是逃避", weights: { E: 3, V: 1 } },
      { text: "我慢，是因为想让改变真的留下", sub: "稳定比速度重要", weights: { S: 3, P: 1 } },
      { text: "我快，是因为拖延会让我失去火", sub: "现在就是入口", weights: { R: 3, F: 1 } }
    ]
  },
  {
    title: "测试最后，系统要求你签下第一条咒语。",
    scene: "这条咒语会成为你的第二人生启动句。",
    options: [
      { text: "我允许过去成为我的材料", sub: "不是枷锁，是矿脉", weights: { A: 3, I: 1, S: 1 } },
      { text: "我允许未来先于证据出现", sub: "先看见，再靠近", weights: { V: 3, F: 1, R: 1 } },
      { text: "我用步骤保护灵感", sub: "计划是容器", weights: { P: 3, S: 1, V: 1 } },
      { text: "我用一次行动打开新门", sub: "决定会制造道路", weights: { R: 3, E: 1, F: 1 } }
    ]
  }
];

const restTypes: Record<RestCode, RestType> = {
  IAPS: {
    code: "IAPS",
    name: "温柔的考古学家",
    shortName: "考古者",
    summary: "你通过独自梳理过往，一点点挖出被掩埋的热爱，不急着推翻，只重建地基。",
    advisor: "你不是不能重启，你只是需要安静地、慢慢地、与自己和解。",
    reflection:
      "你习惯独自蹲在记忆的废墟里，用刷子轻轻扫去灰尘，捡起那些被忽略的热爱和伤痕。你不急着推翻旧生活，而是想看清楚地基在哪里。你的重启像修复一本旧书，每一页都值得被重新装订。",
    careers: ["旧物/回忆策展师", "修复型文案策划", "人生复盘教练"],
    dreamBoard: ["旧木箱", "手写信", "枯萎的干花", "翻开的日记"],
    microAction: "今晚写下三个曾经让你发光的瞬间，给其中一个安排 15 分钟回访。",
    palette: "amber"
  },
  IAPR: {
    code: "IAPR",
    name: "灼烧的凤凰",
    shortName: "焚烧者",
    summary: "你独处时看清旧伤，然后用一次决绝的切断让自己重生。",
    advisor: "你的重启不是慢慢解释，而是在看清之后果断离场。",
    reflection:
      "你在独处时看清了过去的沉重，然后选择了一把火烧掉所有不再属于你的标签。你的重启不是渐进式的，而是一个决绝的转身。别怕那场火，灰烬里会长出你从未见过的绿芽。",
    careers: ["身份重塑顾问", "极简主义整理师", "职业断裂带导师"],
    dreamBoard: ["火焰余烬", "灰烬中绿芽", "空房间", "行李箱"],
    microAction: "删除一个让你焦虑的 App、聊天入口或收藏夹，今晚就做。",
    palette: "ember"
  },
  IAFS: {
    code: "IAFS",
    name: "溪流般的疗愈师",
    shortName: "溪流者",
    summary: "你在独处中接纳过去，改变方式像水一样柔和，每天写一句话就足够。",
    advisor: "你适合让改变流过生活，而不是把自己推上审判台。",
    reflection:
      "你不跟过去对抗，也不急于摆脱它，只是每天安安静静地流过一个石头、一片落叶。你的改变像水，柔和但持续。你会发现，最深的伤口在日复一日的微小行动中，悄悄结痂了。",
    careers: ["微习惯设计师", "晨间日记引导师", "渐进式自由职业探索教练"],
    dreamBoard: ["溪流", "鹅卵石", "晨雾", "滴漏咖啡"],
    microAction: "连续七天每天写一句：今天我愿意放过自己的哪一部分？",
    palette: "river"
  },
  IAFR: {
    code: "IAFR",
    name: "深夜的闪电",
    shortName: "闪断者",
    summary: "你习惯独自反思，却会在某个深夜突然顿悟，然后彻底转变生活方式。",
    advisor: "你需要给顿悟留一扇门，一旦它出现，就别再压低音量。",
    reflection:
      "你总是一个人想很多，然后在某个凌晨突然被一道念头击中，接着第二天你就换了头像、改了签名、买了一直不敢买的单程票。你的重启不按计划，但每一次闪电过后，空气都是新的。",
    careers: ["灵感转化师", "突发事件响应顾问", "24小时决策陪伴者"],
    dreamBoard: ["黑暗闪电", "裂开的云层", "十字路口", "路灯"],
    microAction: "把脑中反复出现的新身份写成账号简介，先存草稿。",
    palette: "violet"
  },
  IVPS: {
    code: "IVPS",
    name: "阁楼里的蓝图",
    shortName: "蓝图者",
    summary: "你独自在安静中画出未来十年的样子，每天添一笔，不慌不忙。",
    advisor: "你真正需要的不是刺激，而是一份可以持续靠近的未来图纸。",
    reflection:
      "你喜欢把自己关在安静的空间里，一笔一划地画出十年后的模样。你不张扬，但每一步都踩在自己画的图纸上。你的重启像建造一座教堂，慢，但每一块石头都知道自己的位置。",
    careers: ["人生建筑模型师", "独立研究型创作者", "远程战略规划顾问"],
    dreamBoard: ["卷尺", "望远镜", "星盘", "建筑图纸"],
    microAction: "画一条 12 个月时间线，只填第一个月的三个小里程碑。",
    palette: "blueprint"
  },
  IVPR: {
    code: "IVPR",
    name: "孤独的发射者",
    shortName: "发射者",
    summary: "你内心早已设计好新身份，只等一个时机，然后一天之内去新城市。",
    advisor: "你的未来已经在倒计时，关键是选定发射窗口。",
    reflection:
      "你内心早已造好了一艘飞船，只等一个倒计时结束。你的重启常让身边人惊讶，“他居然真的走了”。你不需要掌声，只需要起飞时那片刻的沉默。",
    careers: ["单点爆发式项目经理", "数字游民基地发起人", "“已注销”生涯咨询"],
    dreamBoard: ["火箭发射架", "单人驾驶舱", "清晨高速", "倒计时"],
    microAction: "定一个 72 小时内能完成的公开动作，让未来身份被现实看见。",
    palette: "cosmic"
  },
  IVFS: {
    code: "IVFS",
    name: "梦游的画家",
    shortName: "梦画者",
    summary: "你在独处时跟随直觉，画出一个模糊的未来，每天让画面清晰一点。",
    advisor: "你不必立刻说清未来，先把它画到能被你认出来。",
    reflection:
      "你不擅长列计划，但擅长在脑海里飘过一个个模糊的画面。你的重启像水彩颜料晕开，方向不清晰，但色彩很美。允许自己继续做梦，笔触会自己找到形状。",
    careers: ["愿景板引导师", "直觉式职业探索向导", "慢内容创作者"],
    dreamBoard: ["未干水彩", "雾中的山", "若隐轮廓", "月色画布"],
    microAction: "找 9 张没有理由但很吸引你的图，拼出一版不解释的 Dream Board。",
    palette: "mist"
  },
  IVFR: {
    code: "IVFR",
    name: "午夜魔术师",
    shortName: "魔术师",
    summary: "你突然看见未来版本自己，当晚就开始行动，卖掉旧物，买一张单程票。",
    advisor: "你的人生转场常常发生在别人睡着之后。",
    reflection:
      "你会在最安静的深夜里，突然变出一个全新的自己，注销旧账号、扔掉旧衣服、给老朋友发了不一样的消息。别人以为你是一时冲动，只有你知道，这场魔术你已经在心里排练了一百遍。",
    careers: ["身份切换体验设计师", "夜间创意顾问", "重启直播主"],
    dreamBoard: ["扑克牌", "礼帽兔子", "月亮上的门", "单程票"],
    microAction: "今晚把一个旧物上架或送出，让空间先替你完成转场。",
    palette: "moon"
  },
  EAPS: {
    code: "EAPS",
    name: "篝火旁的讲述者",
    shortName: "讲述者",
    summary: "你通过深度对话和他人故事理解自己的过去，一步步重建。",
    advisor: "你会在被听见的时刻，把旧章节重新命名。",
    reflection:
      "你需要围坐在人群里，听着别人的故事，才能看清自己的过往。你通过讲述和倾听，把沉重的过去变成了篝火旁的燃料。你的重启不是孤独的，而是一群人围坐的温暖。",
    careers: ["社群叙事治疗师", "口述历史采集人", "播客《重启电台》主播"],
    dreamBoard: ["篝火", "围坐人影", "老照片影集", "木椅"],
    microAction: "约一个可信的人聊 40 分钟，只讲一个你一直没讲完整的故事。",
    palette: "campfire"
  },
  EAPR: {
    code: "EAPR",
    name: "街头革命家",
    shortName: "革命者",
    summary: "你在人群中获得力量，用一场公开仪式与过去决裂。",
    advisor: "你的告别需要被世界听见，因为见证会让你更有力量。",
    reflection:
      "你不怕把伤口亮出来，甚至愿意站在街头喊出自己的故事。你的重启往往伴随着一场小型革命，也许是一次朋友圈的长文，也许是一场告别派对。你让过去成为旗帜，而不是枷锁。",
    careers: ["公共仪式策划师", "社会行动发起人", "叛逆品牌主理人"],
    dreamBoard: ["涂鸦墙", "麦克风", "挥手人群", "宣言海报"],
    microAction: "写一段公开告别声明，不一定发布，但要读出声。",
    palette: "graffiti"
  },
  EAFS: {
    code: "EAFS",
    name: "流浪歌者",
    shortName: "歌者",
    summary: "你带着过去的故事出发，在旅行或新社群中随遇而安，每天遇见一个人。",
    advisor: "你不是要摆脱过去，而是要带着它去更远的地方唱出来。",
    reflection:
      "你带着过去的吉他，走到哪里就唱到哪里。你不急于改变一切，只是每天遇见一个新的人、听到一个新故事。你的重启像流浪，没有终点，但每一步都有回声。",
    careers: ["流动工作坊带领者", "沙发客式职业探索", "城市游牧买手"],
    dreamBoard: ["吉他", "市集", "手绘地图", "拼贴车票"],
    microAction: "明天去一个陌生街区，随机进一家店，和店主聊 10 分钟。",
    palette: "market"
  },
  EAFR: {
    code: "EAFR",
    name: "即兴火焰",
    shortName: "火焰者",
    summary: "你参与集体活动时突然被点燃，当场决定改变。",
    advisor: "你需要一个现场，一个人群，一个足够热的瞬间。",
    reflection:
      "你会在音乐节、市集、或一次即兴戏剧中，突然被一团火点燃。当晚你就决定换一种活法。你的重启不需要排练，只需要一个眼神、一次击掌。你不怕失控，因为火焰总是向上。",
    careers: ["即兴体验设计师", "派对型职业启蒙师", "活动灭火员"],
    dreamBoard: ["火把游行", "狂欢节面具", "散落彩带", "鼓点"],
    microAction: "报名一个本周的线下活动，到场后对一个陌生人说出你的新计划。",
    palette: "festival"
  },
  EVPS: {
    code: "EVPS",
    name: "城市建造师",
    shortName: "建造师",
    summary: "你和伙伴一起规划第二人生，用项目管理和社群支持逐步实现。",
    advisor: "你适合把理想做成项目，把朋友变成共同施工队。",
    reflection:
      "你享受和伙伴一起画图纸、定节点、开复盘会。你的第二人生不是独角戏，而是一个共同项目。你的重启像建造一座城市，需要地基、砖瓦，也需要邻居。",
    careers: ["协作式人生实验室主理人", "社会企业项目总监", "共创型咨询顾问"],
    dreamBoard: ["建筑模型", "共享办公桌", "甘特图", "城市灯网"],
    microAction: "找两个人组成 14 天重启小队，每人只承诺一个可验收动作。",
    palette: "city"
  },
  EVPR: {
    code: "EVPR",
    name: "烟花引爆者",
    shortName: "引爆者",
    summary: "你召集一群人共同发起一个大动作，一天之内改变所有。",
    advisor: "你的重启像倒计时，越多人一起喊，越容易真正发生。",
    reflection:
      "你擅长召集一群人，然后喊一个倒计时，“三、二、一，我们现在就变！”你的重启往往伴随集体行动，一起辞职旅行、一起开工作室。你相信绚烂的瞬间可以改变一生。",
    careers: ["集体行动发起人", "众筹式人生转折教练", "限时实验策展人"],
    dreamBoard: ["烟花绽放", "倒计时", "人群跳跃", "启动按钮"],
    microAction: "发起一个 24 小时挑战，邀请三个人一起完成并互相截图。",
    palette: "firework"
  },
  EVFS: {
    code: "EVFS",
    name: "风中的信使",
    shortName: "信使",
    summary: "你跟随好奇加入不同圈子，让未来的样子自然浮现。",
    advisor: "你会在一次次对话里收到下一站的提示。",
    reflection:
      "你不喜欢固定的路线，总是随风飘进不同的社群、沙龙、咖啡馆。你的重启像折纸飞机，每一次抛出去都不知道落在哪里，但总有人捡起来读。你的灵感来自每一次相遇。",
    careers: ["跨界连接者", "人生灵感记者", "随机漫步式导游"],
    dreamBoard: ["纸飞机", "风筝", "交叉路口", "对话气泡"],
    microAction: "明天换一个咖啡馆工作，主动问一个人：你最近在研究什么？",
    palette: "wind"
  },
  EVFR: {
    code: "EVFR",
    name: "闪灵舞台",
    shortName: "舞台者",
    summary: "你在一次即兴表演或公开表达中，瞬间成为理想中的自己，再也没回头。",
    advisor: "你不是慢慢准备好才上台，你是在上台那一刻完成切换。",
    reflection:
      "你在聚光灯下，哪怕是临时的舞台，才能听见自己真正的声音。你的重启往往发生在一次演讲、一场表演、或一次被陌生人注视的时刻。那一刻你不再是旧角色，而是理想中的自己。",
    careers: ["舞台式生涯教练", "TEDx式职业策展人", "仪式感主播"],
    dreamBoard: ["聚光灯", "空舞台", "打开帷幕", "掌声"],
    microAction: "录一段 60 秒新身份自我介绍，发给一个会认真回应你的人。",
    palette: "stage"
  }
};

function resolveCode(scores: Scores): RestCode {
  const energy = scores.I >= scores.E ? "I" : "E";
  const anchor = scores.A >= scores.V ? "A" : "V";
  const strategy = scores.P >= scores.F ? "P" : "F";
  const tempo = scores.S >= scores.R ? "S" : "R";
  return `${energy}${anchor}${strategy}${tempo}` as RestCode;
}

function sumScores(answerIndexes: number[]) {
  return answerIndexes.reduce<Scores>((next, answerIndex, questionIndex) => {
    const option = questions[questionIndex]?.options[answerIndex];
    if (!option) {
      return next;
    }
    Object.entries(option.weights).forEach(([key, value]) => {
      next[key as keyof Scores] += value ?? 0;
    });
    return next;
  }, { ...baseScores });
}

function pairPercent(scores: Scores, pair: readonly [keyof Scores, keyof Scores]) {
  const [left, right] = pair;
  const total = scores[left] + scores[right];
  if (total === 0) {
    return 50;
  }
  return Math.round((scores[left] / total) * 100);
}

export function RestRestartApp() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "calculating" | "result">("quiz");
  const [copied, setCopied] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);

  const scores = useMemo(() => sumScores(answers), [answers]);
  const code = resolveCode(scores);
  const result = restTypes[code];
  const activeQuestion = questions[questionIndex];
  const selectedIndex = answers[questionIndex];
  const progress = Math.round((answers.filter((value) => value !== undefined).length / questions.length) * 100);
  const liveClues = result.dreamBoard;
  const personaImageSrc = `${publicBasePath}/rest-restart/personas/${result.code}.jpg`;

  const chooseOption = (index: number) => {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = index;
      return next;
    });
  };

  const goNext = () => {
    if (selectedIndex === undefined) {
      return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    setPhase("calculating");
    window.setTimeout(() => setPhase("result"), 1300);
  };

  const goBack = () => {
    setQuestionIndex((current) => Math.max(0, current - 1));
  };

  const restart = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setPhase("quiz");
    setCopied(false);
    setInsightOpen(false);
  };

  const copyResult = async () => {
    const text = `我的 REST 重启人格是 ${result.code} ${result.name}：${result.summary} 微行动：${result.microAction}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="rest-shell min-h-[100dvh] overflow-hidden bg-[#080914] text-[#f6f0df]">
      <div className="rest-aurora" />
      <div className="rest-grid" />
      <section className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1500px] flex-col px-4 py-3 sm:px-6 lg:px-8">
        <header className="rest-topbar">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#a8dfd2]">REST Restart Indicator</p>
            <h1 className="mt-1 text-2xl font-black leading-none text-[#fff8df] sm:text-3xl">REST 重启人格测试</h1>
          </div>
          <div className="rest-code-runes" aria-label="当前 REST 代码">
            {code.split("").map((letter, index) => (
              <span key={`${letter}-${index}`} className="rest-rune">
                {answers.length > index * 2 ? letter : "?"}
              </span>
            ))}
          </div>
        </header>

        {phase === "quiz" && (
          <div className="grid flex-1 gap-4 py-3 lg:grid-cols-[190px_minmax(0,1fr)_340px] xl:grid-cols-[220px_minmax(0,1fr)_390px]">
            <aside className="rest-panel rest-progress-panel">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#cbb7ff]">人生节点</span>
                <span className="text-xs font-black text-[#ffe196]">{progress}%</span>
              </div>
              <div className="mt-5 space-y-2.5">
                {questions.map((question, index) => (
                  <button
                    key={question.title}
                    type="button"
                    onClick={() => setQuestionIndex(index)}
                    className={`rest-node ${index === questionIndex ? "is-active" : ""} ${answers[index] !== undefined ? "is-done" : ""}`}
                    aria-label={`前往第 ${index + 1} 题`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i />
                  </button>
                ))}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-sm border border-[#3d456d] bg-[#11182e]">
                <div className="h-full bg-[#ffcf6b]" style={{ width: `${progress}%` }} />
              </div>
            </aside>

            <section className="rest-panel rest-question-panel">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rest-chip">
                  <Sparkles size={15} />
                  正在采集你的重启能量
                </span>
                <span className="text-sm font-black text-[#94dacd]">
                  {questionIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff8e75]">Restart Node</p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.8vw,3.45rem)] font-black leading-[0.98] text-[#fff8df]">
                  {activeQuestion.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-[#d8d5e8] sm:text-lg">{activeQuestion.scene}</p>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {activeQuestion.options.map((option, index) => (
                  <button
                    key={option.text}
                    type="button"
                    onClick={() => chooseOption(index)}
                    className={`rest-option ${selectedIndex === index ? "is-selected" : ""}`}
                  >
                    <span className="rest-option-index">{String.fromCharCode(65 + index)}</span>
                    <span>
                      <strong>{option.text}</strong>
                      <small>{option.sub}</small>
                    </span>
                    {selectedIndex === index && <Check className="rest-check" size={18} />}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={goBack} disabled={questionIndex === 0} className="rest-control">
                  <ArrowLeft size={18} />
                  上一节点
                </button>
                <button type="button" onClick={goNext} disabled={selectedIndex === undefined} className="rest-primary">
                  {questionIndex === questions.length - 1 ? "生成人格档案" : "进入下一节点"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>

            <aside className="rest-panel rest-dream-panel">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.24em] text-[#a8dfd2]">Dream Board</span>
                <Wand2 size={18} className="text-[#ffcf6b]" />
              </div>
              <div className={`rest-board mt-5 palette-${result.palette}`}>
                {liveClues.map((clue, index) => (
                  <span key={clue} className={`rest-clue clue-${index}`}>
                    {clue}
                  </span>
                ))}
                <span className="rest-portal">{code}</span>
              </div>
              <div className="mt-5 space-y-4">
                {Object.entries(dimensionPairs).map(([dimension, pair]) => {
                  const percent = pairPercent(scores, pair);
                  return (
                    <div key={dimension}>
                      <div className="mb-1.5 flex items-center justify-between text-xs font-black text-[#cfd1e9]">
                        <span>{pair[0]}</span>
                        <span>{pair[1]}</span>
                      </div>
                      <div className="rest-meter">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rest-preview">
                <p>{result.shortName}</p>
                <strong>{result.name}</strong>
                <span>{result.dreamBoard.join(" / ")}</span>
              </div>
            </aside>
          </div>
        )}

        {phase === "calculating" && (
          <section className="grid flex-1 place-items-center py-12">
            <div className="rest-calculating">
              <Flame size={38} />
              <p>正在生成你的第二人生剧本</p>
              <span>{code.split("").join(" · ")}</span>
            </div>
          </section>
        )}

        {phase === "result" && (
          <section className="grid flex-1 gap-4 py-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <article className={`rest-result-card palette-${result.palette}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a8dfd2]">Your REST Code</p>
                  <h2 className="mt-3 text-[clamp(4.2rem,14vw,10rem)] font-black leading-[0.82] text-[#fff8df]">{result.code}</h2>
                </div>
                <button type="button" onClick={copyResult} className="rest-control">
                  <Copy size={17} />
                  {copied ? "已复制" : "复制结果"}
                </button>
              </div>
              <div className="mt-7 border-y border-[#ffffff2c] py-6">
                <p className="text-lg font-black text-[#ffcf6b]">{result.shortName}</p>
                <h3 className="mt-2 text-[clamp(2.2rem,6vw,5.6rem)] font-black leading-none text-[#fff8df]">{result.name}</h3>
                <p className="mt-5 max-w-4xl text-xl font-bold leading-9 text-[#e9e5f7]">{result.summary}</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rest-advice">
                  <span>顾问笔记</span>
                  <p>{result.advisor}</p>
                </div>
                <div className="rest-advice">
                  <span>7 日微行动</span>
                  <p>{result.microAction}</p>
                </div>
              </div>
              <button type="button" onClick={() => setInsightOpen(true)} className="rest-insight-button">
                <BookOpenText size={18} />
                查看完整人格解析与职业建议
                <ArrowRight size={18} />
              </button>
            </article>

            <aside className="rest-panel">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#cbb7ff]">Persona Artwork</p>
                  <h3 className="mt-2 text-3xl font-black text-[#fff8df]">你的第二人生肖像</h3>
                </div>
                <button type="button" onClick={restart} className="rest-control">
                  <RefreshCcw size={17} />
                  重测
                </button>
              </div>
              <div className={`rest-persona-frame mt-6 palette-${result.palette}`}>
                <img src={personaImageSrc} alt={`${result.code} ${result.name} 人格配图`} className="rest-persona-image" />
                <div className="rest-persona-caption">
                  <span>{result.code}</span>
                  <strong>{result.name}</strong>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {result.dreamBoard.map((clue) => (
                  <div key={clue} className="rest-tag">
                    {clue}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-bold leading-6 text-[#cdc9e4]">
                你的 {result.code} 型梦板适合从这些视觉线索开始。也可以混入完全不同的元素，让第二人生保留一点不可预测。
              </p>
            </aside>
          </section>
        )}

        {insightOpen && (
          <div className="rest-modal-backdrop" role="presentation" onClick={() => setInsightOpen(false)}>
            <section
              className={`rest-insight-modal palette-${result.palette}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rest-insight-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={() => setInsightOpen(false)} className="rest-modal-close" aria-label="关闭人格解析">
                <X size={20} />
              </button>
              <div className="rest-modal-hero">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#a8dfd2]">REST Persona Insight</p>
                  <h2 id="rest-insight-title">
                    {result.code} {result.name}
                  </h2>
                </div>
                <span>{result.shortName}</span>
              </div>

              <div className="rest-modal-body">
                <article className="rest-modal-section">
                  <div className="rest-modal-section-title">
                    <BookOpenText size={20} />
                    <h3>人格阐述</h3>
                  </div>
                  <p>{result.reflection}</p>
                </article>

                <article className="rest-modal-section">
                  <div className="rest-modal-section-title">
                    <BriefcaseBusiness size={20} />
                    <h3>适合的第二人生职业</h3>
                  </div>
                  <div className="rest-career-list">
                    {result.careers.map((career) => (
                      <span key={career}>{career}</span>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
