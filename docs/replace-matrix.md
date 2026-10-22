# 内容替换矩阵

原则：**复用语法，替换全部表达**。下表逐项覆盖画面中出现的可见元素，并记录落点与校验结果。

| # | 元素类型 | 视频中的形态 | 处理方式 | DPH 对应物 | 落点 | 状态 |
|---|---|---|---|---|---|---|
| 1 | 品牌主标识 | 环形徽记 + 组织名锁排 | 不复刻；重新设计几何标识 | 切角文档 + 内核方块 + 橙色小方点 | `client.template.js` → `Mark` | ✅ |
| 2 | 品牌字标 | 全大写粗黑 + 副标 | 用 DPH 现有品牌字符串 | `DEEPSEEK` / `SYNTHESIZE INTELLIGENCE` / `HARNESS OS` | 取自 `~/.dsh/dsh-startup.json` 由 `build.py` 注入 | ✅ |
| 3 | 栏目代码块 | DEF / STRU / NRG / ORG / ECO / SCIEN | 换语义，保留 3–4 字母 + 黑色方块语法 | INDX / TOOL / AGNT / SPEC / SYS | 左侧导航 | ✅ |
| 4 | 论文式编号 | `ANALYSIS 08` + 8 格刻度 | 保留「编号 + 刻度」语法 | 底部 5 格刻度随栏目填充；页面黑牌 `01–05` | 底栏 / 页头 | ✅ |
| 5 | 身份信息条 | `身份信息确认：乔伊丝·摩尔` | 换为 DPH 自身身份数据 | `Dr.郭 / 0610 / LEVEL 6` | 右栏 PROFILE | ✅ |
| 6 | 欢迎语 | `WELCOME TO … INTERNAL ARCHIVE` | 结构保留，内容替换 | `WELCOME TO DEEPSEEK HARNESS INTERNAL ARCHIVE` | 文案常量（未在首页显示，备用） | ✅ |
| 7 | 数据表格 | `PROFILE / RACE / HEIGHT / POB` | 保留「黑表头 + 键值行」语法 | `RUNTIME / IDENTITY / LEVEL / MODE / LOCALE / BUILD` | 右栏 PROFILE | ✅ |
| 8 | 引线标注 | 细引线 + 全大写标签指向构件 | 保留引线语法 | 标识构造图：PRIMARY MARK / SAFE AREA / CORE BLOCK / ACCENT 2% MAX | 右栏 SPECIMEN | ✅ |
| 9 | 部门砖墙 | 黑/白方砖散落 + 2° 旋转 | 不复刻砖墙；保留「黑牌 + 白字 + 轻微旋转」语法 | 页头黑色栏目牌 | 页头右侧 | ✅ |
| 10 | 人物立绘 / 剪影 | 角色视觉 | 完全移除 | 无 | — | ✅ |
| 11 | 静物摄影 | 线缆、药瓶、显微图 | 不复用任何帧 | 纯 CSS 网格 + 噪点纹理 | 背景 | ✅ |
| 12 | 品质纹理 | 纸纹、六边形、做旧划痕 | 只保留可程序化的纸纹与噪点 | `feTurbulence` 噪点 + 1px 网格 | `.dpa-root::before/::after` | ✅ |
| 13 | 字体 | 未确认的商业无衬线 | 不复用 | 系统栈：Inter / Segoe UI / Noto Sans SC / Microsoft YaHei；等宽 Cascadia/Consolas | `tokens.json` | ✅ |
| 14 | 图标 | 几乎无图标系统 | 按同语法补最小图标 | 24px 网格、1.5px 描边、直角端点（标识与状态点） | `Mark` / `Specimen` | ✅ |
| 15 | 专有名词 | 世界观术语、`C-023`、`PARABOLIC` | 全部禁用 | 无 | 机器校验见 `checks/checks.json` | ✅ |
| 16 | 配色 | 纸 `#E6E4E0` / 墨 `#0F1311` / 橙 `#F77304` | 纸墨保留（无版权属性），橙替换为 DPH 品牌橙 `#FF7500` | `--dph-accent` | `tokens.json` | ✅ |
| 17 | 交互控件 | 无真实控件（宣传影像） | 按同语法自建 | 导航、明暗切换、可聚焦态、hover 左侧橙标 | `client.template.js` | ✅ |
| 18 | 状态语义 | `WARNING` 细条、`CONFIDENTIAL` 印章 | 保留语法，换语义 | 底部「风格研究 · 未使用原作素材」印章 | SYS 页 | ✅ |

## 机器校验

| 校验 | 方法 | 结果 |
|---|---|---|
| 占位符残留 | 扫描 `{{`、`TODO:`、构建标记 | 0 处 |
| IP 名词残留 | 18 个禁用词扫描 `packages/dph-archive` | 0 处 |
| 对比度 | WCAG 2.1，18 组前景/背景对 | 18/18 通过 |
| 文本溢出 | Chromium 实测 `scrollWidth > clientWidth` | 10 组视口配置全部 0 溢出（`checks/overflow.json`） |
| 原帧像素 | 交付包内无任何图片资产，仅 SVG 手绘 | 通过 |
