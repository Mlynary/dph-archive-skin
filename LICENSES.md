# LICENSES

逐项列出交付物内使用的资产、来源与许可。**不含任何来自源视频的素材。**

## 代码

| 文件 | 许可 | 说明 |
|---|---|---|
| `packages/dph-archive/*.js` | MIT | 本项目原创 |
| `pipeline/*.py` | MIT | 本项目原创 |
| `tools/cdp/*.mjs`、`tools/preview/*` | MIT | 本项目原创（仅本地验证用，不随插件分发） |

## 图形

| 资产 | 来源 | 许可 |
|---|---|---|
| `packages/dph-archive/icon.svg` | 本项目绘制 | CC0 / MIT |
| 面板内标识（切角文档 + 内核方块） | 本项目绘制（SVG 内联） | CC0 / MIT |
| 标本构造图（引线 + 标注） | 本项目绘制（SVG 内联） | CC0 / MIT |
| 背景网格 / 噪点纹理 | 纯 CSS 与 `feTurbulence` 程序生成 | 无外部资产 |

## 字体

**不打包、不分发任何字体文件。** 运行时仅使用系统字体栈：

| 角色 | 字体栈 | 说明 |
|---|---|---|
| 无衬线 | `Inter`, `Helvetica Neue`, `Segoe UI`, `Noto Sans SC`, `Microsoft YaHei`, `system-ui` | 均为系统或开源字体，回退顺序保证可读 |
| 等宽 | `JetBrains Mono`, `Cascadia Mono`, `Consolas`, `SF Mono`, `ui-monospace` | 同上 |

若使用者系统未安装 `Inter` / `JetBrains Mono`，将回退到系统默认，不影响布局（已做宽度溢出验证）。

## 运行时依赖

| 依赖 | 版本 | 许可 |
|---|---|---|
| React | 宿主提供（插件不打包 React） | MIT |
| Cordis / DSH 运行时 | 宿主提供 | 见 DSH 发行许可 |

## 源视频

| 资产 | 状态 |
|---|---|
| B 站 `BV1rr4y1b7sz` 视频文件 | **未包含在交付物中**；仅存在于本地分析目录 `runs/`，分发时需排除 |
| 抽帧图片 | 同上，仅本地分析用，未进入任何产物 |
| 视频文案 / 术语 | 未使用 |

## 品牌数据

| 来源 | 用途 |
|---|---|
| `~/.dsh/dsh-startup.json`（用户自己的 DPH 配置：品牌字符串、身份、强调色 `#FF7500`） | 作为「DPH 自有内容」注入面板 |

该文件属于用户本机配置，仅在构建时读取，不随插件分发。

## 参考

风格分析方法参考 Design Tokens 社区格式（`design-tokens.org` schema）与 WCAG 2.1 对比度要求。
