# DPH Archive OS

从明日方舟世界观，莱茵生命宣传影像中**学习 UI 视觉语法**，把文字与图形全部替换为 DPH 自有内容后，做成的一个可安装的 DPH 内置 UI 插件。

> 学习的是语法（纸面 / 发丝线 / 代码块 / 微型注脚 / 单一强调色），不是素材。交付包内**没有任何原作帧、标识、角色或字体**。

---

## 1. 它是什么

**第一层：整机换肤（主功能）**

插件通过 `ctx.theme.overrideTokens('dph-archive', …)` 在主题别名层叠上一层覆盖，把 Harness 外壳（侧栏、会话、编辑器、弹层）的 14 个颜色 token 全部换成「技术档案纸面」：

| Harness token | 浅色 | 深色 | 读作 |
|---|---|---|---|
| `bg-base` | `#E7E4DF` | `#0A0A0B` | 温白纸面 / 黑场 |
| `bg-layer-1` | `#F2EFEA` | `#151513` | 抬升面 |
| `bg-layer-2` | `#DDD9D2` | `#1E1C19` | 内嵌面 |
| `bg-overlay` | `#F7F5F1` | `#211F1C` | 浮层 |
| `border-l1` / `l2` | 16% / 30% 墨 | 16% / 30% 纸 | 发丝线 |
| `brand-primary` | `#A34700` | `#FF9A4D` | DPH 橙（纸面上降到 4.79:1 可读） |
| `label-primary` / `secondary` | `#0B0F0D` / `#4C514C` | `#E9E5DF` / `#A8A49D` | 墨 / 次级墨 |
| `sidebar-fill` | `#D8D3CB` | `#111110` | 侧栏纸色 |

同时接管 `sidebar.brand.mark`，把侧栏标识换成 DPH 的「切角文档 + 内核方块 + 橙点」。

颜色之外还有一层**外壳样式**（`CHROME_CSS`，注入 `document.head`），因为 token 只能换色、不能改形状：

| 规则 | 作用 |
|---|---|
| 整机 `border-radius: 0` | `body *:not(.dpa-root, .dpa-root *)` —— 除档案面板外，全部直角 |
| 按钮 / 输入 / 菜单 / 弹层 / 对话框 / 可编辑区 | 追加一条针对语义元素与 ARIA 角色的保险规则 |
| 浮层 1px 发丝边框 + 纸面投影 | 菜单、对话框、tooltip 不再是"悬浮卡片" |
| 输入框落在抬升纸面 | 焦点态改成 1px 橙线，不用光晕 |
| 选区橙色高亮 | `::selection` |
| 代码/序列号等宽 | `code / pre / kbd / samp` |
| 整帧 32px 网格 + 纸纹 | `body::after`，浅色 multiply、深色 screen |
| 四角定位标记 | `body::before`，5px 注册角标 |
| 1px hairline 分割线 | `hr / [role=separator]` |
| 细滚动条、等宽数字 | `scrollbar-*`、`font-feature-settings: tnum` |

> 这一层是可撤销的：停用 bundle 即完整还原，不改主题注册表、不改任何文件。

**第二层：外壳细节（输入框框架 / 标识）**

按反馈把"档案页面"从侧栏撤掉了（`createPanel` 代码保留，但不再注册 `main` / `sidebar.panellist`），改为把它的细节语言搬进外壳本身：

| 槽位 | 内容 |
|---|---|
| `conversation.input.dock` | 输入框上方框架条：`[IN] ────── 输入 / COMPOSER` |
| `sidebar.brand.mark` | 侧栏标识（切角文档 + 内核方块 + 橙点） |
| `conversation.hero.brand.mark` | 新会话空状态标识（同款文档标记，CSS 兜底绘制） |

**第三层：外壳样式（`CHROME_CSS`）**

颜色 token 管不到圆角、边框、纹理，因此另有一层注入到 `document.head` 的样式表：整机直角、浮层发丝边框、输入框下划线、图标描边统一 1.4px、32px 网格 + 纸纹、窗口最外沿 1px 发丝线、右上一个"文件夹 / 更多 / 右侧栏"的三角图标组。

## 2. 安装

```bash
git clone https://github.com/<you>/dph-archive-skin.git
```

然后在 DSH 里以插件包目录安装（`packages/dph-archive` 是一个合法的 bundle）：

```text
plugin_manager install_bundle  <repo>/packages/dph-archive
```

装完刷新页面（Ctrl+R；无变化则 Ctrl+Shift+R 强刷）。

**撤销**：设置 → 插件 → 停用 `dph-archive`，皮肤层、外壳样式一起移除，主题注册表不变。重新启用即恢复。

> 修改 `client.js` 后需要刷新页面才会加载新代码（若本机在跑 `pnpm run dev:web` 则有客户端 HMR）。

## 3. 目录

```
DPH/
├── packages/dph-archive/          # 插件包（bundle）
│   ├── package.json               # dsh.bundle.patch + dsh.client
│   ├── cordis.patch.yml           # 插入 dph-archive 一行
│   ├── index.js                   # Host 半边（空实现，界面在 Client）
│   ├── client.template.js         # 源码（唯一手写文件）
│   ├── client.js                  # 由 build.py 生成，勿手改
│   ├── locale/{en,zh}.json        # 插件显示名与描述
│   └── icon.svg                   # 原创图标
├── tokens/{tokens.json,tokens.css,tokens.ts}
├── pipeline/
│   ├── contact_sheet.py           # 抽帧 → 联系表
│   ├── palette.py                 # k-means 取色 + sRGB→OKLCH
│   ├── accent.py                  # 强调色提取
│   ├── build.py                   # Token + 品牌 + 档案 → client.js
│   └── check.py                   # 对比度 / IP 词 / 占位符
├── docs/{style-report,replace-matrix,style-guide}.md
├── runs/BV1rr4y1b7sz/             # 分析工作区（源视频、帧、检查、截图）
├── tools/                         # 本地工具（ffmpeg、yt-dlp、CDP 截图、渲染夹具）
├── LICENSES.md · NOTICE.md
```

## 4. 重新生成

```powershell
# 改完 tokens/tokens.json 或 client.template.js 后
python pipeline/build.py         # 生成 tokens.css / tokens.ts / client.js
python pipeline/check.py         # 对比度 + IP 词 + 占位符
node tools/preview/build.mjs     # 重建渲染夹具（可选）
```

`build.py` 会读取：

- `tokens/tokens.json` → CSS 变量、TS 常量、色板数据
- `~/.dsh/dsh-startup.json` → DPH 品牌字符串、身份、强调色
- `runs/` 与 `docs/` → 档案索引的**真实文件大小与数量**（`runs/` 为本地分析目录，不随仓库分发）

## 5. 验证状态

| 项 | 结果 | 证据 |
|---|---|---|
| 插件安装 | `application: applied`，无警告 | `plugin_manager` 返回 |
| 槽位注册 | `main`、`sidebar.panellist` 均存在 `dph-archive` occupant，active | `cordis_inspect_query` |
| 换肤调用 | `overrideTokens('dph-archive', {14 tokens × light/dark})` 实际执行 | 渲染夹具记录 `window.__skin`：`count:14` |
| 换肤着色 | 深浅两套 14 色全部通过对比度（品牌 4.79:1，次级文字 6.40:1） | `checks/checks.json` |
| 外壳样式 | `style[data-dph-skin]` 已注入，`button` 计算圆角 = `0px`，8 条 `!important` 规则生效 | 渲染夹具 DOM 断言 |
| 明暗跟随 | `theme/change` 事件切换 `html[data-dph-skin]`，纹理在深色下改用 screen | 代码路径 |
| 面板渲染 | 浅色/深色、中/英、五页均已截图 | [`docs/screens/`](docs/screens/) |
| 对比度 | 31/31 通过 | `python pipeline/check.py` 的输出 |
| 文本溢出 | 10 组视口配置，0 溢出 | 本地渲染夹具实测 |
| IP 词残留 | 0 | `python pipeline/check.py` 的输出 |
| 盲测 | **未执行外部盲测** | [docs/similarity.md](docs/similarity.md) |

### 已知限制

1. **换肤后的整机观感没有在真实界面里截图验证**。GUI 需要 `dsh web` 打印的带 token 的 URL，无头浏览器被挡在认证页；面板部分用「加载同一个 `client.js` 的渲染夹具」（`tools/preview/`）验证，换肤部分只能验证到「override 调用成功 + 颜色对比度达标」，**最终观感需要你刷新后肉眼确认**。
2. 换肤只覆盖 Client 主题服务暴露的 14 个颜色 token；字号、圆角、字体族不在这个扩展点上，因此另用一层外壳 CSS 补形状与质感。**外壳 CSS 按元素类型与 ARIA 角色命中，不依赖应用的私有类名**——用 div 拼的组件（例如消息气泡、输入卡片外壳）可能仍保留自己的圆角与底色，这类需要拿到具体 DOM 片段才能精准命中。
3. `brand-primary` 在浅色下取 `#A34700` 而非纯 `#FF7500`：品牌橙直接压在纸面上只有 2.1:1，作为文字不可读；深色下仍用 `#FF9A4D`。
4. 档案索引里的文件大小是 `build.py` 构建那一刻的快照。
5. 外部盲测未做；未做 Safari / Firefox 实测。

## 6. 合规

见 [NOTICE.md](NOTICE.md) 与 [LICENSES.md](LICENSES.md)。一句话：**只学风格，不搬素材；与原作权利方无任何关联。**
