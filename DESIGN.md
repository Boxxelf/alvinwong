# Alvin Wong 个人网站 · 设计文档 v0.1

> 状态：已确认（2026-10-10）
> 参考：`reference video.mp4`（37.6s，3024×1518 录屏，内容是 SPATIAL 音乐节官网 / Monom Studios）
> 内容来源：`Alvin_resume26.md`

---

## 1. 参考视频拆解

我按 1 帧/秒把视频抽成帧，逐段看完了。参考站的核心语言如下：

| # | 时间 | 参考站内容 | 设计特征 |
|---|------|-----------|---------|
| 1 | 0–2s | `SPATIAL` + 副标题 "A Festival for Spatial Sound…" | 白底黑字，文字像贴在弯曲的 3D 曲面上，滚动时从远处放大扑向镜头 |
| 2 | 2–3s | 字被放大到超出屏幕 | 液态 / 波浪形扭曲，字母被拉伸、局部变粗变细 |
| 3 | 3–5s | `12, 13, 14 of September 2025` | 顶部出现固定导航（左 logo，右 5 个小号大写链接）；日期居中，滚动时轻微倾斜再"爆开" |
| 4 | 5–8s | `Celebrating spatial sound as a contemporary art form` / `Space and time for embodied listening.` | 一句一屏，滚动驱动：远小 → 正常 → 扭曲放大冲出画面 |
| 5 | 8–9s | About 正文 + 暖橙色人物照片 | 左大段正文（中等字号、紧行距），右侧大图，整站唯一的暖色 |
| 6 | 9–12s | 黑底：`FOCUSED ATTENTION` / `PURE SOUND` / `PRESENCE` | 底色翻成纯黑，全大写巨型白字，每个词从扭曲状态"聚拢"成形再散开 |
| 7 | 12–17s | Program 节目单 | 黑底，细白线分隔的表格（时间 / 艺人 / 类型 / 场地）；鼠标悬停某行时，背后浮现一张黑白照片 |
| 8 | 17–18s | Tickets：`Night Pass` / `Day Pass` / `Weekend Pass` | 白底，超大字号，每项右上角挂一个小号 `TICKETS` 上标链接 |
| 9 | 18–20s | Artists 名单 | 居中，按字母排序的长列表，大字号；悬停下划线 |
| 10 | 20–23s | Venue：Funkhaus 建筑照 + 黑块段落 + 场馆图格 | 黑白摄影，图上叠白色场馆名（Sound Chamber / Shedhalle） |
| 11 | 23–26s | 结尾回扣 `SPATIAL` + 副标题 | 首屏标题以"平整"状态再次出现，形成首尾呼应 |
| 12 | 26–30s | Info 手风琴 | 细黑线分隔，左标题右 `+` |
| 13 | 30–32s | Footer | 左 logo，右侧多列极小字号信息（联系方式、合作方、地址、Instagram） |

**整体风格关键词**：瑞士国际主义排版 · 纯黑白 + 一处暖色摄影 · 极大字号对比 · 滚动驱动的 WebGL 文字扭曲 · 细线网格 · 大量留白。

---

## 2. 内容映射（参考站 → Alvin）

保持参考站的**章节节奏和视觉手法**，把内容换成 Alvin 的简历：

| # | Alvin 网站章节 | 对应参考段 | 内容 |
|---|---------------|-----------|------|
| 1 | **Hero** | 1–2 | `ALVIN WONG` + 副标题 "UX Designer, Magician & Student — Eastvale, California"，曲面扭曲 → 滚动放大冲出 |
| 2 | **Status 大字** | 3 | `Class of 2027` / `Open to internships`（替代日期那一屏） |
| 3 | **Statement** | 4 | 两句一屏：`Designing digital experiences that feel like magic.` / `Research, wireframe, prototype — then perform.` |
| 4 | **About** | 5 | 左：简历 Summary 改写成 3 段正文；右：Alvin 的照片（暖色调处理，呼应参考站） |
| 5 | **Principles（黑底）** | 6 | 三个大写词逐屏出现：`USER FIRST` / `CLEAR DESIGN` / `A LITTLE MAGIC` |
| 6 | **Experience 表格（黑底）** | 7 | 细线表格，列：年份 / 职位 / 组织 / 地点。3 行：Magic Club Officer、CAVA Volunteer、Dim Sum Restaurant Assistant。悬停时背后浮现对应黑白照片，点击展开要点 |
| 7 | **Projects（白底巨型字）** | 8 | `Catalyst` + 上标 `FIGMA ↗`；`Card Binder` + 上标 `GITHUB ↗`。每项下方一行小字描述 |
| 8 | **Skills 名单** | 9 | 居中长列表：UX Design, Figma, FigJam, Wireframing, Prototyping, SwiftUI, CoreData, Adobe Illustrator, Canva, Cursor, Google Workspace, Leadership, Communication, Problem Solving… 悬停下划线 |
| 9 | **Education / Stage** | 10 | 黑白大图（学校或魔术表演现场）+ 黑块居中段落介绍 Eleanor Roosevelt High School 与魔术社；下方 2 格图：`Mid-Autumn Festival` / `School Rallies` |
| 10 | **Outro** | 11 | `ALVIN WONG` 以平整状态回归 |
| 11 | **Info 手风琴** | 12 | `What I'm looking for` / `Education` / `Tools` / `Magic Club` / `Contact` |
| 12 | **Footer** | 13 | 左 `ALVIN WONG`；右多列小字：Email、LinkedIn、GitHub、Eastvale, CA、© 2026 |

**导航**（固定顶部，和参考一致）：左 `ALVIN WONG`，右 `ABOUT` `EXPERIENCE` `PROJECTS` `SKILLS` `CONTACT`。

---

## 3. 视觉规范

### 3.1 颜色
| Token | 值 | 用途 |
|-------|----|------|
| `--ink` | `#000000` | 文字 / 黑色段落背景 |
| `--paper` | `#FFFFFF` | 白色段落背景 |
| `--rule` | `rgba(0,0,0,.85)` / 黑底上 `rgba(255,255,255,.7)` | 1px 细分隔线 |
| 摄影 | 黑白为主，About 照片一张暖橙调 | 唯一的"颜色" |

不使用任何品牌色、渐变、阴影、圆角。

### 3.2 字体
参考站使用的是一款紧凑的新怪诞无衬线（类似 Neue Haas Grotesk / PP Neue Montreal，字距偏紧）。

- **Inter Tight**（Google Fonts，免费商用）——已确认
- 字重：Regular 400 为主，几乎不用粗体，靠字号拉开层级

### 3.3 字号层级（桌面 / 手机）
| 层级 | 桌面 | 手机 | 用途 |
|------|------|------|------|
| Display XL | `clamp(120px, 18vw, 320px)` | 22vw | Hero、Outro 名字 |
| Display L | `clamp(64px, 9vw, 160px)` | 14vw | Principles、Projects |
| Display M | `clamp(40px, 5vw, 80px)` | 9vw | Status、Statement、Skills 列表 |
| Body L | 28px / 1.15 | 20px | About 正文、Experience 行 |
| Nav / Meta | 11px 大写，字距 +0.04em | 11px | 导航、上标、Footer |

字距统一 `-0.02em ~ -0.04em`（越大越紧）。

### 3.4 布局
- 12 栏网格，左右边距 16px（参考站非常贴边）
- 导航高度约 40px，无背景色，`mix-blend-mode: difference` 让它在黑/白段落上自动反色
- 黑白段落切换是硬切，不做渐变过渡

---

## 4. 动效规范（还原重点）

| 效果 | 实现方式 | 用在哪 |
|------|---------|-------|
| **文字曲面扭曲 + 滚动放大** | WebGL：把文字渲染到 canvas 纹理，贴在平面网格上，用顶点着色器做弯曲，片元着色器做波浪 UV 位移；滚动进度控制 scale / 弯曲度 / 扭曲强度 | Hero、Status、Statement、Principles、Outro |
| **平滑滚动** | Lenis | 全站 |
| **滚动驱动时间线** | GSAP ScrollTrigger，每个大字段落 `pin` 住 100–150vh | 所有大字屏 |
| **悬停浮现图片** | 行 hover 时，背后固定一张图跟随鼠标 Y 轴，`opacity` 渐入 | Experience 表格 |
| **手风琴** | 原生 `<details>` + 高度动画，`+` 旋转成 `×` | Info |
| **段落反色** | 进入黑色段落时 body 背景切黑，导航随之反色 | Principles / Experience / Education |

**降级**：
- `prefers-reduced-motion` 时关闭 WebGL 扭曲，大字直接平整显示
- 不支持 WebGL 或手机性能较低时，用 CSS `transform` 做简单的缩放 + 倾斜代替
- 所有大字在 DOM 中保留真实文本（WebGL 只是视觉层），保证 SEO 和屏幕阅读器可读

---

## 5. 技术方案

| 项 | 选择 | 理由 |
|----|------|------|
| 构建 | **Vite + 原生 JS**（单页） | 轻、快、好部署；内容量不需要框架 |
| 3D / 着色器 | **Three.js**（或更轻的 OGL） | 实现文字扭曲 |
| 动画 | **GSAP + ScrollTrigger** | 滚动时间线行业标准 |
| 平滑滚动 | **Lenis** | 与参考站手感一致 |
| 部署 | Vercel 或 GitHub Pages | 免费，可绑定自定义域名 |

目录结构（预计）：
```
alvin web/
├── DESIGN.md
├── index.html
├── src/
│   ├── main.js          # Lenis + GSAP 初始化
│   ├── warp-text.js     # WebGL 文字扭曲
│   ├── sections/        # 各段落交互
│   └── styles.css
└── public/
    ├── fonts/
    └── images/          # Alvin 提供的照片
```

---

## 6. 已确认的决定

| 项 | 决定 |
|----|------|
| 照片 | **不放个人照和魔术照**。参考站里用照片的位置，改成程序生成的画面（WebGL 颗粒雾光 shader）：About 用暖橙色"雾中光源"，Experience 悬停与 Education 图格用黑白版本。项目截图位暂用同风格占位，之后有截图可直接替换 |
| 电话 | 不放，只放 Email + LinkedIn + GitHub |
| 笔误 | `Catalys`→`Catalyst`；`Mid-Attumn`→`Mid-Autumn`；第二段经历改为 **CAVA Volunteer — Team Member** |
| 语言 | 仅英文 |
| 字体 | **Inter Tight**（Google Fonts） |

## 6.1 原始待确认清单（存档）

1. **照片素材**：参考站很依赖摄影。需要 Alvin 的：
   - 1 张个人照（About，会调成暖色调）
   - 2–4 张魔术表演 / 社团活动照（Experience 悬停、Education 图格）
   - Catalyst、Card Binder 的截图各 1–2 张
   - 没有的话我先用灰色占位块
2. **电话号码**：简历里有手机号。放到公开网站上会被爬虫抓到，**建议不放**，只放 Email + LinkedIn。确认吗？
3. **简历里几处疑似笔误**，网站上我准备这样改，请确认：
   - `Catalys` → `Catalyst`
   - `Mid-Attumn Festival` → `Mid-Autumn Festival`
   - 第二段经历标题 `Cava Volunteer Magic Club Officer` 看起来是复制错了，我理解为 **CAVA Volunteer — Team Member**，对吗？
4. **语言**：网站只做英文？还是需要中英切换？
5. **字体**：PP Neue Montreal（更接近参考，但只能个人非商用）还是 Inter Tight（免费商用，略有差别）？个人作品集用前者通常没问题。
6. **章节文案**：第 2 节里的 Statement、Principles 三个词是我拟的，Alvin 如果有自己想说的话可以替换。
7. **域名 / 部署**：需要我顺便配好部署吗？

---

## 7. 开发步骤（确认后执行）

1. 搭 Vite 项目，排出全部静态版式（无动效），先对齐字号、网格、黑白段落
2. 加 Lenis + GSAP，实现大字滚动缩放、表格悬停、手风琴
3. 加 WebGL 文字扭曲（最耗时的一步，会反复对照视频调参）
4. 手机适配 + 降级方案
5. 在浏览器里逐段和参考视频对比截图，微调
6. 部署
