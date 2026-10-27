# 夜栖 · 月下树洞

> 当前统一任务书为 docs/MASTER_TASK.md，阶段执行索引为 docs/EXECUTION_PLAN.md。阶段0—6已完成实现与本机验收；具体审美待用户验收，跨浏览器与人工听检限制见 PROGRESS.md。

私人、本地优先的心情与日常记录网站。把情绪、梦境和生活碎片写成封存给月亮的梦笺。原创黑色月拱门、柔粉纸幕与片尾式纵向索引；书写、档案和阅读各有独立场景。

技术栈：React 19、TypeScript 5.9、Vite 7、原生 CSS、SVG、localStorage。运行时只依赖 React 和 React DOM；不需要后端、账号、外部字体或图片 API。参考截图没有进入代码或公开资源。

## 安装与运行

建议 Node.js 24，最低 22.12；pnpm 固定为 11.25.0。首次下载依赖需要网络。

在项目根目录打开 PowerShell，当前 Codex 环境可直接运行：

```powershell
.\scripts\project.ps1 install
.\scripts\project.ps1 dev
```

脚本寻找系统 pnpm 或 Codex 随附的 pnpm，不修改全局配置。打开终端打印的地址，通常是 http://127.0.0.1:5173，看到月拱门与「今夜，让心事有处栖息」即成功。按 Ctrl+C 停止服务不会清空日记。

常规环境等价命令：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm preview
```

PowerShell 检查与构建：

```powershell
.\scripts\project.ps1 test
.\scripts\project.ps1 build
.\scripts\project.ps1 test:e2e
.\scripts\project.ps1 preview
```

构建结果在 dist/；生产预览通常为 http://127.0.0.1:4173。不能双击 index.html 运行，需要服务器。

浏览器测试在 Windows 默认使用已安装的 Microsoft Edge，其他平台默认 Playwright Chromium。缺少浏览器时运行 `pnpm exec playwright install chromium`，PowerShell 设置 `$env:PLAYWRIGHT_CHANNEL = 'chromium'`；也可设置为 chrome。测试自动启动/停止 5173 服务，建议关闭占用该端口的其他项目。

## 功能与使用

- 纸艺小剧场：悬挂星月、原创守灯人、书本、抽屉与纸门均有反馈；可切换月相、听星铃（先开启音效）、查看真实计数、继续草稿或回顾旧信。手机可点击，键盘可Tab/Enter，减少动态效果保持静态纸景。

- 夜栖地图：独立选择写作、档案、月历、草稿、回响、心愿、收藏与纸艺剧场，八个空间均可用；各空间可直接返回地图，不经过写作中转。
- 心情月历：按月翻阅、选择有心情标记的日期，打开当天真实记录。
- 草稿匣：快速保存碎片，刷新恢复，继续编辑、删除或转为正式梦笺；写作页也可手动存为草稿。
- 心愿瓶：添加愿望、标记完成，切换进行中/已完成/全部。
- 秘密收藏：档案或阅读页收藏后独立查看，可取消；不提供密码加密。

- 「写下心情」：填写可选标题、必填正文、心情、日期时间、标签，再「封存这段记忆」。保存成功才跳转阅读，失败保留输入。
- 标题最多 80 字，正文最多 20000 字；最多 8 个标签，每个最多 20 字，逗号分隔并去重；日期 1900—2100 年。
- 五种心情有名称、含义与符号，自定义感受可写进标签。正文按纯文本显示，支持换行，不解析 HTML。
- 「记忆档案」：按标题/正文搜索，组合心情和标签筛选，按记忆时间升降序、结果计数、清除筛选。
- 打开梦笺后「重新落笔」编辑；删除有二次确认，Escape 可以取消。
- 「今夜回响」随机打开真实记录，多条时避开刚回顾的一条；新用户没有假日记。
- 刷新后恢复记录；未保存离开有确认，关闭/刷新用浏览器内置提示（显示方式由浏览器决定）。
- JSON 备份下载；手机页底也有备份和隐私入口。
- hash 导航、浏览器前进/后退、焦点提示、键盘入口、响应式与减少动态效果。
- 读取损坏数据时暂停写入并允许原文导出；容量失败保留输入；其他标签页修改后阻止旧页面覆盖。

## 场景与页面切换

首页是蕾丝帷幕包围的月影剧场，可点击门中钥匙或「写下心情」进入手稿桌。档案采用秘密收藏柜与抽屉梦笺；打开记录后展为旧信，回响则配有星盘抽笺台。

书写/编辑/草稿续写/剧场采用刺绣帷幕，档案/草稿匣/收藏采用柜门，阅读采用解封信纸，回响/月历采用星盘，其余空间采用月影门。正常模式每次约1.8秒（640ms合拢、160ms停顿、1000ms展开），结束后恢复操作和键盘焦点；系统启用减少动态效果时直接切页，也可在过渡中途启用。

放弃草稿和删除记录使用主题确认框；「继续写信」或Escape保留草稿，删除仍明确说明永久删除。浏览器后退取消后保留原历史位置。关闭/刷新仍由浏览器显示未保存提醒。

首页星盘图形、蜡烛、花饰和档案拉手是装饰；可用入口都有明确文字。剧场中的星月、人物、书、抽屉和纸门是实际按钮。星盘不执行占卜，回响只随机读取真实记录。

## 音乐与音效

背景改用Scott Buckley《Sleep》的官方Piano Only钢琴录音（CC BY 4.0），替代持续低频音床。选曲依据是作曲者对梦境钢琴的说明，尚未人工听检。音景设置显示作品/作者/许可与处理说明；来源和文件SHA256见public/audio/README.md。MP3随站保存，约7.38MB，运行不连接外部音频站点。不要删除署名或把录音说成本项目原创演奏。

默认静音，首次明确开启才读取录音，加载可取消、失败可重试；不会回退嗡鸣。保留音乐/音效独立开关、音量与yeqi.audio.v1偏好。录音解码为32kHz，温和调整增益、外侧静尾和8秒首尾重叠，约168.5秒循环；只有一个音乐声源，不因切页重复创建。暂停记住位置，恢复3秒柔起；刷新不自动播放，后台清理声音，返回后主动恢复。

剧场星铃改为一次接触驱动的玻璃阻尼共振，约22%机会出现更弱的第二击，0.36秒内结束实际碰撞，之后仅余韵衰减。悬线与星一同绕悬点小幅摇摆1.8秒；悬停/聚焦/点击去重，停留不重播。全局1400ms冷却、硬上限两个星铃声源；铃响时背景短暂轻退再恢复。音效关闭、音量零、后台或未主动激活时安静；触摸、键盘和减少动态效果均支持。普通帷幕/保存等轻反馈保留。

开发修改后可完整刷新一次，再打开音景试听。程序渲染、播放行为和回归已验证，音色舒适度、真实设备效果与音乐衔接听感仍待人工验收。

## 数据与隐私

第一版数据仅保存在当前浏览器、当前来源的 localStorage，key 为 `yeqi.entries.v1`，格式为 `{ schemaVersion: 1, entries: [...] }`。网站不会把私人记录发送到外部服务，不会自动同步其他设备。

新增草稿、愿望和收藏索引独立存于yeqi.workspace.v1，常规JSON导出包含workspace。某一区损坏时暂停该区写入并保留原文；正式日记损坏时可分别导出原始数据和含其他模块的恢复资料。声音偏好单独存于yeqi.audio.v1。

不同浏览器、域名和端口有独立数据：5173 和 4173 不互通，localhost 和 127.0.0.1 不互通。数据未出现时先核对网址，不要清空存储。

清理浏览器数据、关闭隐私窗口或删除浏览器配置可能导致记录丢失，请定期导出 JSON。备份包含私人文字，应妥善保管。本地存储未加密，共用设备的人可能读取。**Git 备份代码，不备份浏览器日记。**

常规导出包含 schemaVersion、exportedAt、entries 和 workspace（草稿、愿望、收藏索引）。日记损坏时“导出备份”下载原文，“导出全部恢复资料”同时保留原文与其他模块。第一版尚未提供导入/恢复界面，请保留 JSON 文件用于后续恢复。不要为排错直接执行 localStorage.clear()。

## 实际目录

```text
.
├── AGENTS.md                    Codex 长期规则与文档阅读入口
├── README.md                    安装、使用、Git 和故障指南
├── PROGRESS.md                  真实进度、验证结果、限制和下一步
├── docs/
│   ├── MASTER_TASK.md           用户统一总任务书原文
│   ├── EXECUTION_PLAN.md        阶段清单、状态、实施边界
│   ├── AUDIO_TASK.md            本轮音频专项A—E范围、状态与验收边界
│   ├── DESIGN_SPEC.md           配色、构图、原创性、响应式、待确认决策
│   └── INTERACTION_SPEC.md      页面关系、数据、流程、异常和无障碍
├── public/moon.svg              原创月亮 favicon
├── public/audio/                许可钢琴MP3与README署名/许可/校验说明
├── src/
│   ├── main.tsx                 React 启动入口
│   ├── vite-env.d.ts            Vite客户端/热更新类型
│   ├── App.tsx                  页面组装、导航、全局反馈
│   ├── types.ts                 Entry 类型和心情定义
│   ├── styles.css               CSS 变量、布局、动画、响应式
│   ├── scenes.css               场景增量样式与仪式过渡
│   ├── ritual.css               慢速刺绣帷幕
│   ├── audio.css                音景控制面板
│   ├── rooms.css                独立空间地图
│   ├── modules.css              月历、碎片桌、心愿瓶、藏匣
│   ├── theatre.css              立体纸艺场景、悬线与机关
│   ├── components/
│   │   ├── Shell.tsx            框架和导航
│   │   ├── StageArt.tsx         原创 SVG 舞台
│   │   ├── EntrySlip.tsx        可打开的梦笺
│   │   ├── ConfirmDialog.tsx    删除/离开确认与焦点管理
│   │   ├── SceneArt.tsx         原创场景道具与星盘
│   │   ├── RitualTransition.tsx 五类过渡的显示层
│   │   ├── AudioControls.tsx    音景开关/音量/恢复
│   │   ├── RoomHeader.tsx       独立模块标题与地图返回
│   │   └── PaperTheatreArt.tsx  原创纸窗/树影/守灯人/书本
│   ├── pages/                   Home、Editor、Archive、Reader、Privacy、Rooms、
│   │                            Calendar、Drafts、Wishes、Collection、Theatre
│   ├── hooks/                   useEntries、useRoute、useWorkspace
│   └── lib/                     entries/storage、workspace及其数据测试，
│                                audio控制/musicTrack许可录音及循环/
│                                soundDesign交互音色、ritual时序、rooms目录
├── tests/                       app/ritual/audio/rooms/modules/theatre/quality
│                                核心流程、真实音频实例、模块、响应式与异常
├── scripts/project.ps1          Windows 安装/运行/验证兼容入口
├── index.html                  页面元信息和挂载点
├── package.json                依赖、命令与环境要求
├── pnpm-lock.yaml              锁定真实依赖，必须入库
├── pnpm-workspace.yaml         允许 esbuild 必要安装脚本
├── tsconfig.json               TypeScript 严格检查
├── vite.config.ts              Vite/React 构建配置
├── vitest.config.ts            单元测试范围
├── playwright.config.ts        浏览器测试配置
├── .gitignore                  Git 忽略规则
├── dist/                       构建生成，不入库
├── outputs/                    交付截图与说明，不入库
└── work/                       临时工具和文件，不入库
```

.gitignore 避免依赖、构建、日志、临时文件、环境变量密钥进入历史；保留代码、原创资源、规范与锁文件。不要把整个 public/src 排除。

## 如何让 Codex 遵守项目文档

Codex 在此项目目录工作时会按作用范围读取 AGENTS.md 的项目指令。若在其他目录聊天，不要期待它自动找到本项目。后续可以这样说：

> 请先读取 AGENTS.md、docs/MASTER_TASK.md、docs/EXECUTION_PLAN.md、README.md、PROGRESS.md；本次涉及视觉/交互时读取对应规范。先检查 Git 状态，保留未提交工作，完成验证后更新进度，不发布或推送。

DESIGN_SPEC 约束视觉，INTERACTION_SPEC 约束行为与数据。具体实现决策不伪装成用户确认，待确认提案单独标记。

每完成重要阶段更新 PROGRESS：实际完成功能、重要文件、执行的命令和结果、已知问题、下一步和待确认。新增功能先更新对应规范，再实现验证，最后同步 README；不能将计划或没执行的测试写成完成。

## 日常 Git

当前仓库 main 分支，仅本地管理，没有远程或推送。按用户明确授权仅配置当前仓库身份 Ange，未改全局身份。实际提交以 git log 为准。

修改前：

```sh
git status --short --branch
git diff
git log --oneline -5
```

有你自己的未提交工作时，告诉 Codex 哪些必须保留。独立阶段完成且验证通过后，选择实际改动文件暂存：

```sh
git diff --check
git add src docs README.md PROGRESS.md
git diff --cached
git commit -m "Improve archive filtering"
```

初始版本提交信息为 `Initial commit: Moonlit Treehole MVP`。以后一次独立、可运行、验证通过的改进对应一个提交，不必每改一行就提交。

VS Code：打开此文件夹 → 左侧「源代码管理」→ 点文件查看差异 → 文件旁 + 暂存 → 写清提交说明 →「提交」。不要点「发布分支」或「同步更改」，本项目目前没有远程。

改坏了先检查：

```sh
git status
git diff
git log --oneline -5
git show HEAD:src/App.tsx
```

先复制重要工作到项目外备份，或让 Codex 创建保护分支/提交。确认某个未提交文件可以丢弃后，才执行 `git restore --source=HEAD -- src/App.tsx`，这会覆盖该文件未提交内容。若坏改动已提交，工作区干净后用 `git revert <坏提交哈希>` 生成反向提交保留历史。不要随意 revert 首个根提交；需要恢复时逐文件比较。不要使用 reset --hard 或 clean -fd 清理用户工作。代码恢复无法恢复被删日记，日记依赖 JSON 备份。

## 常见问题

- 找不到 npm/pnpm：当前机器使用 scripts/project.ps1；其他机器先安装 Node 24、pnpm 11 并重开终端。
- PowerShell 阻止脚本：不必改系统策略，使用 pnpm 命令；当前机器也可直接执行 `node "$env:USERPROFILE/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pnpm/bin/pnpm.cjs" run dev`，dev 可替换为 build/test。
- 无法打开：确认依赖安装成功、服务未退出、打开的是终端打印端口；端口变更会形成独立数据来源。
- esbuild 脚本提示：检查 pnpm-workspace.yaml 中已允许 esbuild，不要开启全局任意脚本。
- 保存失败：先复制正文、导出已有记录，再检查存储空间与权限。
- 多页冲突：复制未保存内容后刷新，避免同时编辑。
- 记录消失：先核对浏览器、完整网址和端口。清理数据后没有云端副本，不要继续清空。
- 浏览器测试找不到 Edge：安装 Playwright Chromium 并按上方设置 PLAYWRIGHT_CHANNEL。

## 验证范围与当前限制

2026-10-27音频专项：14项数据测试、35项Edge浏览器测试通过；严格检查与生产构建通过。包含许可录音实际解码/循环边界、加载取消/失败重试、同播与切页单实例、默认静音/偏好/模拟后台、单击/弱二击渲染、触碰去重/停留/并发/触屏/键盘/减少动态效果与全套原有功能。六档宽度的11路由无溢出。开发与生产预览均实际开启钢琴和星铃，音频文件HTTP200，无浏览器错误或外部请求；生产预览创建/刷新恢复通过。

未人工试听；后台行为使用visibilitychange模拟，未检验真实系统切后台。未验证Firefox、Safari、真实手机、屏幕阅读器和海量记录性能。离开档案页再返回会重置筛选；草稿需手动保存，尚未保存的输入不自动持久化。导入恢复、密码加密、登录、云同步和PWA未实现。开发热更新属于开发工具请求，不是上传日记。视觉截图与阶段细节见PROGRESS最新记录。

后续建议（未执行）：先人工听检与真实设备适配，再做JSON校验/预览/确认合并恢复，随后评估自动草稿恢复和筛选保留；密码加密需先确认密钥恢复方案。
