window.__ModuleLoader__.load({
  id: 'dph-archive',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect } = React;

    // ------------------------------------------------------------------
    // Injected by pipeline/build.py
    //   tokens.json -> TOKENS_CSS / SPEC / SKIN
    //   run artefacts -> ARCHIVE
    //   ~/.dsh/dsh-startup.json -> BRAND
    // ------------------------------------------------------------------
    const TOKENS_CSS = /*__TOKENS_CSS__*/"";
    const ARCHIVE = /*__ARCHIVE__*/[];
    const SPEC = /*__SPEC__*/[];
    const BRAND = /*__BRAND__*/{};
    const SKIN = /*__SKIN__*/{};

    const BUILD = '2026-10-22';
    let currentCtx = null;

    // ------------------------------------------------------------------
    // Render helpers (variadic: keeps the tree readable)
    // ------------------------------------------------------------------
    const div = (cls, ...kids) => h('div', cls ? { className: cls } : null, ...kids);
    const span = (cls, ...kids) => h('span', cls ? { className: cls } : null, ...kids);
    const divx = (props, ...kids) => h('div', props, ...kids);

    // ------------------------------------------------------------------
    // Copy
    // ------------------------------------------------------------------
    const COPY = {
      en: {
        brand: BRAND.brand1 || 'DEEPSEEK',
        brandSub: BRAND.brand2 || 'SYNTHESIZE INTELLIGENCE',
        osc: (BRAND.brand3a || 'HARNESS') + ' ' + (BRAND.brand3b || 'OS'),
        crumb: [BRAND.orgSub || 'DEEPSEEK HARNESS', 'STYLE SPECIMEN'],
        profile: 'PROFILE',
        status: 'STATUS',
        statusLine: 'ALL SYSTEMS NOMINAL',
        footer: BRAND.footer || 'POWERED BY DEEPSEEK',
        order: 'ORDER 08-114',
        sheet: 'SHEET',
        navHint: 'GLOBAL PANELS',
        notice: 'ORIGINAL MARK / REDRAWN ICONS',
        ledeIndex: 'Every artefact produced by this style study, as filed: the source reel, the extracted frames, the token set and this panel.',
        ledeTool: 'The runtime capabilities this agent can call, grouped by the kind of reach each one has.',
        ledeAgnt: 'Roles available to a session, and their current posture on the network.',
        ledeSpec: 'The token set distilled from the reference reel: paper, ink, one accent, one signal, and nothing rounded.',
        ledeSys: 'Provenance, licence posture and build facts for this panel.',
        welcome: 'WELCOME TO DEEPSEEK HARNESS INTERNAL ARCHIVE',
        identity: 'IDENTITY CONFIRMED',
      },
      zh: {
        brand: BRAND.orgZh || '深度求索',
        brandSub: BRAND.orgSub || 'DEEPSEEK HARNESS',
        osc: (BRAND.brand3a || 'HARNESS') + ' ' + (BRAND.brand3b || 'OS'),
        crumb: [BRAND.orgZh || '深度求索', '风格标本'],
        profile: '档案',
        status: '状态',
        statusLine: '全部系统正常',
        footer: BRAND.footer || 'POWERED BY DEEPSEEK',
        order: '编号 08-114',
        sheet: '页',
        navHint: '全局面板',
        notice: '原创标识 / 重绘图标',
        ledeIndex: '本次风格研究归档的全部条目：源影像、抽帧、设计变量与本面板。',
        ledeTool: '当前代理可调用的运行时能力，按触及范围分组。',
        ledeAgnt: '会话可用的代理角色，及其当前工作状态。',
        ledeSpec: '从参考影像蒸馏出的设计变量：纸色、墨色、一个强调色、一个信号色，以及零圆角。',
        ledeSys: '本面板的来源、授权立场与构建事实。',
        welcome: '欢迎访问 深度求索 内部档案',
        identity: '身份信息确认',
      },
    };

    const SECTIONS = [
      { id: 'index', code: 'INDX', no: '01', en: 'ARCHIVE INDEX', short: 'ARCHIVE', zh: '档案索引', lede: 'ledeIndex' },
      { id: 'tool', code: 'TOOL', no: '02', en: 'TOOL REGISTRY', short: 'TOOLS', zh: '工具注册表', lede: 'ledeTool' },
      { id: 'agnt', code: 'AGNT', no: '03', en: 'AGENT NETWORK', short: 'AGENTS', zh: '代理网络', lede: 'ledeAgnt' },
      { id: 'spec', code: 'SPEC', no: '04', en: 'DESIGN SPECIMEN', short: 'SPECIMEN', zh: '设计标本', lede: 'ledeSpec' },
      { id: 'sys', code: 'SYS', no: '05', en: 'SYSTEM FILE', short: 'SYSTEM', zh: '系统档案', lede: 'ledeSys' },
    ];

    const TOOLS = [
      { code: 'READ', name: 'read', zh: '读取文件', group: 'IO', note: '按行读取工作区文本' },
      { code: 'WRTE', name: 'write', zh: '写入文件', group: 'IO', note: '整体替换或新建' },
      { code: 'EDIT', name: 'edit', zh: '定点修改', group: 'IO', note: '字面量替换，保留上下文' },
      { code: 'GLOB', name: 'glob', zh: '路径检索', group: 'IO', note: '按模式发现文件' },
      { code: 'GREP', name: 'grep', zh: '内容检索', group: 'IO', note: '正则搜索，附行号' },
      { code: 'BASH', name: 'bash', zh: '命令执行', group: 'EXEC', note: '受沙箱约束的进程' },
      { code: 'JOBS', name: 'job_output', zh: '作业观测', group: 'EXEC', note: '读取后台作业输出' },
      { code: 'FETC', name: 'web_fetch', zh: '网页抓取', group: 'WEB', note: '返回解码后的正文' },
      { code: 'SRCH', name: 'web_search', zh: '网络检索', group: 'WEB', note: '多查询合并结果' },
      { code: 'SUBA', name: 'subagent', zh: '子代理', group: 'AGENT', note: '独立上下文的工作单元' },
      { code: 'FLOW', name: 'workflow', zh: '编排脚本', group: 'AGENT', note: '分阶段扇出与汇聚' },
      { code: 'MSG', name: 'send_message', zh: '代理通信', group: 'AGENT', note: '向子代理投递消息' },
      { code: 'CORD', name: 'cordis_inspect_query', zh: '运行时勘察', group: 'CORDIS', note: '只读查询服务与插槽' },
      { code: 'PRES', name: 'present', zh: '交付文件', group: 'UI', note: '声明最终产物' },
      { code: 'ASK', name: 'ask_user_question', zh: '询问用户', group: 'UI', note: '确认、选择或补充信息' },
      { code: 'TODO', name: 'todo_write', zh: '任务清单', group: 'META', note: '多步工作的进度板' },
      { code: 'SKIL', name: 'skill', zh: '加载技能', group: 'META', note: '读取任务专属指令' },
    ];

    const AGENTS = [
      { code: 'PRIM', en: 'PRIMARY AGENT', zh: '主代理', note: 'sessions · tools · streaming', state: 'ONLINE' },
      { code: 'RESR', en: 'RESEARCH AGENT', zh: '研究代理', note: 'isolated context · returns a summary', state: 'STANDBY' },
      { code: 'FLOW', en: 'WORKFLOW RUNNER', zh: '编排器', note: 'fan-out · phases · typed results', state: 'STANDBY' },
    ];

    const FALLBACK_ARCHIVE = [
      { code: 'A-01', en: 'Source reel', zh: '源影像', meta: '1080p', state: 'LOCK' },
      { code: 'A-02', en: 'Frame set', zh: '抽帧', meta: '319', state: 'DONE' },
      { code: 'A-03', en: 'Token set', zh: '设计变量', meta: 'JSON', state: 'DONE' },
      { code: 'A-04', en: 'Panel build', zh: '面板构建', meta: 'JS', state: 'LIVE' },
    ];

    // ------------------------------------------------------------------
    // Styles
    // ------------------------------------------------------------------
    const CSS = `
.dpa-root {
  position: relative;
  display: grid;
  grid-template-rows: var(--dph-layout-topbar, 56px) minmax(0, 1fr) var(--dph-layout-bottombar, 30px);
  height: 100%;
  min-height: 380px;
  overflow: hidden;
  background: var(--dph-bg-paper);
  color: var(--dph-fg-primary);
  font-family: var(--dph-font-sans);
  font-size: var(--dph-fs-md);
  line-height: var(--dph-lh-normal);
  letter-spacing: 0;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  container-type: inline-size;
}

.dpa-root *, .dpa-root *::before, .dpa-root *::after { box-sizing: border-box; }

.dpa-root::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(to right, var(--dph-grid) 0 1px, transparent 1px var(--dph-layout-grid-size, 32px)),
    repeating-linear-gradient(to bottom, var(--dph-grid) 0 1px, transparent 1px var(--dph-layout-grid-size, 32px));
}

.dpa-root::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.45;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.2'/></svg>");
}

.dpa-root[data-mode="dark"]::after { mix-blend-mode: screen; opacity: 0.24; }

.dpa-crop { position: absolute; z-index: 5; width: var(--dph-layout-crop-arm, 14px); height: var(--dph-layout-crop-arm, 14px); border: 0 solid var(--dph-rule-strong); pointer-events: none; }
.dpa-crop.tl { top: var(--dph-layout-crop-inset, 10px); left: var(--dph-layout-crop-inset, 10px); border-left-width: 1px; border-top-width: 1px; }
.dpa-crop.tr { top: var(--dph-layout-crop-inset, 10px); right: var(--dph-layout-crop-inset, 10px); border-right-width: 1px; border-top-width: 1px; }
.dpa-crop.bl { bottom: var(--dph-layout-crop-inset, 10px); left: var(--dph-layout-crop-inset, 10px); border-left-width: 1px; border-bottom-width: 1px; }
.dpa-crop.br { bottom: var(--dph-layout-crop-inset, 10px); right: var(--dph-layout-crop-inset, 10px); border-right-width: 1px; border-bottom-width: 1px; }

.dpa-top {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--dph-space-4);
  padding: 0 var(--dph-space-5);
  border-bottom: 1px solid var(--dph-rule);
  background: var(--dph-bg-paper);
}
.dpa-brand { display: flex; align-items: center; gap: 9px; flex: none; }
.dpa-brandtext { display: flex; flex-direction: column; gap: 1px; }
.dpa-word { font-size: 14px; font-weight: var(--dph-fw-heavy); letter-spacing: 0.08em; line-height: 1; }
.dpa-wordsub { font-size: 8.5px; letter-spacing: 0.13em; text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 600; }
.dpa-osc { display: inline-flex; align-items: center; justify-content: center; height: 18px; padding: 0 5px; background: var(--dph-bg-invert); color: var(--dph-fg-invert); font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.1em; white-space: nowrap; }

.dpa-crumb { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 8px; font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.12em; text-transform: uppercase; color: var(--dph-fg-muted); overflow: hidden; white-space: nowrap; }
.dpa-crumb .sep { color: var(--dph-accent); }
.dpa-crumb .here { color: var(--dph-fg-primary); }

.dpa-topright { display: flex; align-items: center; gap: 12px; flex: none; }
.dpa-rev { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.1em; color: var(--dph-fg-muted); }
.dpa-clock { font-family: var(--dph-font-mono); font-size: var(--dph-fs-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.06em; min-width: 62px; text-align: right; }
.dpa-mode { display: flex; border: 1px solid var(--dph-rule-strong); }
.dpa-modebtn { width: 22px; height: 20px; display: grid; place-items: center; border: 0; background: transparent; color: var(--dph-fg-muted); font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); cursor: pointer; padding: 0; appearance: none; }
.dpa-modebtn + .dpa-modebtn { border-left: 1px solid var(--dph-rule); }
.dpa-modebtn[data-on="true"] { background: var(--dph-bg-invert); color: var(--dph-fg-invert); }
.dpa-modebtn:hover { color: var(--dph-fg-primary); }
.dpa-modebtn[data-on="true"]:hover { color: var(--dph-fg-invert); }

.dpa-body {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: var(--dph-layout-rail-left, 216px) minmax(0, 1fr) var(--dph-layout-rail-right, 300px);
  min-height: 0;
}

.dpa-rail { display: flex; flex-direction: column; min-height: 0; border-right: 1px solid var(--dph-rule); padding-top: 16px; }
.dpa-railhead { padding: 0 18px 12px; }
.dpa-kicker { font-size: var(--dph-fs-micro); letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 700; }
.dpa-nav { display: flex; flex-direction: column; padding: 4px 10px 1px; gap: 1px; overflow: auto; }
.dpa-navitem {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 7px 8px;
  border: 0;
  border-left: 2px solid transparent;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  appearance: none;
  transition: background var(--dph-dur-fast) var(--dph-ease-standard), color var(--dph-dur-fast) var(--dph-ease-standard);
}
.dpa-navitem:hover { background: var(--dph-bg-raised); }
.dpa-navitem[aria-current="true"] { background: var(--dph-bg-invert); color: var(--dph-fg-invert); border-left-color: var(--dph-accent-invert); }
.dpa-navtext { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.dpa-navtext b { font-size: var(--dph-fs-sm); font-weight: 700; letter-spacing: 0.02em; text-transform: uppercase; }
.dpa-navtext span { font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); letter-spacing: 0.04em; }
.dpa-navitem[aria-current="true"] .dpa-navtext span { color: var(--dph-fg-invert); opacity: 0.65; }
.dpa-navcount { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); }

.dpa-code {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 40px; height: 20px; padding: 0 4px;
  background: var(--dph-bg-invert); color: var(--dph-fg-invert);
  font-size: var(--dph-fs-micro); font-weight: var(--dph-fw-heavy);
  letter-spacing: var(--dph-ls-label); text-transform: uppercase;
  border-radius: var(--dph-r-chip);
}
.dpa-navitem[aria-current="true"] .dpa-code { background: var(--dph-fg-invert); color: var(--dph-bg-invert); }

.dpa-railfoot { margin-top: auto; padding: 14px 18px 16px; border-top: 1px solid var(--dph-rule); display: flex; flex-direction: column; gap: 7px; }
.dpa-legal { font-size: 8.5px; line-height: 1.55; letter-spacing: 0.03em; color: var(--dph-fg-muted); text-transform: uppercase; }
.dpa-live { display: flex; align-items: center; gap: 6px; font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.1em; color: var(--dph-fg-secondary); }
.dpa-dot { width: 6px; height: 6px; border-radius: var(--dph-r-dot); background: var(--dph-accent-text); flex: none; }
.dpa-dot.ok { background: var(--dph-ok); }

.dpa-main { display: flex; flex-direction: column; min-height: 0; overflow: auto; padding: 24px 32px 40px; }
.dpa-sheethead { position: relative; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1px solid var(--dph-rule-strong); }
.dpa-eyebrow { display: flex; align-items: center; gap: 8px; font-size: var(--dph-fs-micro); font-weight: 700; letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-secondary); }
.dpa-eyebrow i { width: 6px; height: 6px; background: var(--dph-accent-text); display: block; flex: none; }
.dpa-h1 { margin: 8px 0 0; font-size: var(--dph-fs-2xl); font-weight: var(--dph-fw-heavy); line-height: var(--dph-lh-tight); letter-spacing: var(--dph-ls-display); text-transform: uppercase; }
.dpa-h1 small { display: block; margin-top: 4px; font-size: var(--dph-fs-sm); font-weight: 500; letter-spacing: 0.06em; color: var(--dph-fg-muted); text-transform: none; }
.dpa-lede { margin: 12px 0 0; max-width: 54ch; font-size: var(--dph-fs-sm); line-height: var(--dph-lh-loose); color: var(--dph-fg-secondary); }
.dpa-ghost { position: absolute; right: -4px; top: -18px; font-size: var(--dph-fs-ghost); font-weight: var(--dph-fw-heavy); letter-spacing: -0.06em; line-height: 1; color: var(--dph-fg-primary); opacity: 0.055; pointer-events: none; user-select: none; }

.dpa-plate {
  position: absolute; right: 0; top: -8px;
  display: flex; align-items: flex-end; gap: 8px;
  padding: 7px 10px 8px 14px;
  background: var(--dph-bg-invert); color: var(--dph-fg-invert);
  transform: rotate(-1.6deg);
  box-shadow: var(--dph-elev-sheet);
}
.dpa-plate::after { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--dph-accent-invert); }
.dpa-plate b { font-size: 30px; font-weight: var(--dph-fw-heavy); line-height: 0.86; letter-spacing: -0.05em; }
.dpa-plate span { font-family: var(--dph-font-mono); font-size: 8px; letter-spacing: 0.16em; opacity: 0.72; padding-bottom: 2px; }

.dpa-noteswrap { margin-top: auto; padding-top: 30px; }
.dpa-notes {
  margin-top: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--dph-rule);
  border-top: 1px solid var(--dph-rule-strong);
  border-bottom: 1px solid var(--dph-rule);
}
.dpa-note { background: var(--dph-bg-paper); padding: 10px 12px; display: flex; flex-direction: column; gap: 5px; }
.dpa-note b { font-size: var(--dph-fs-micro); letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 700; }
.dpa-note span { font-family: var(--dph-font-mono); font-size: 9px; line-height: 1.65; color: var(--dph-fg-secondary); }

.dpa-list { border-top: 1px solid var(--dph-rule-strong); }
.dpa-listhead, .dpa-listrow { display: grid; grid-template-columns: 34px 58px minmax(0, 1fr) 74px 56px; gap: 10px; align-items: center; }
.dpa-listhead { padding: 6px 8px; font-size: var(--dph-fs-micro); letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 700; border-bottom: 1px solid var(--dph-rule); }
.dpa-listrow { position: relative; padding: 11px 8px; border-bottom: 1px solid var(--dph-rule); font-size: var(--dph-fs-sm); }
.dpa-listrow:hover { background: var(--dph-bg-raised); }
.dpa-listrow:hover::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--dph-accent-text); }
.dpa-num { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); color: var(--dph-system-text); }
.dpa-title { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.dpa-title b { font-weight: 600; font-size: var(--dph-fs-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dpa-title span { font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); }
.dpa-meta { font-family: var(--dph-font-mono); font-size: var(--dph-fs-xs); color: var(--dph-fg-secondary); text-align: right; }
.dpa-state { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.08em; text-align: right; color: var(--dph-fg-muted); }
.dpa-state[data-s="LIVE"] { color: var(--dph-accent-text); }
.dpa-state[data-s="DONE"] { color: var(--dph-ok); }

.dpa-group { margin-bottom: 22px; }
.dpa-grouph { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: var(--dph-fs-micro); letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 700; }
.dpa-grouph::after { content: ""; flex: 1; height: 1px; background: var(--dph-rule); }
.dpa-toolgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; border-top: 1px solid var(--dph-rule); border-left: 1px solid var(--dph-rule); }
.dpa-tool { background: var(--dph-bg-paper); padding: 10px 11px; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 4px 10px; align-items: center; border-right: 1px solid var(--dph-rule); border-bottom: 1px solid var(--dph-rule); }
.dpa-tool:hover { background: var(--dph-bg-raised); }
.dpa-toolname { display: block; font-family: var(--dph-font-mono); font-size: var(--dph-fs-xs); letter-spacing: 0.02em; }
.dpa-toolzh { display: block; font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); margin-top: 1px; }
.dpa-toolnote { grid-column: 1 / -1; font-size: var(--dph-fs-micro); color: var(--dph-fg-secondary); padding-left: 50px; }

.dpa-agents { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.dpa-agent { border: 1px solid var(--dph-rule); background: var(--dph-bg-raised); padding: 12px; display: flex; flex-direction: column; gap: 8px; min-height: 132px; }
.dpa-agenttop { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.dpa-agentname { font-size: var(--dph-fs-sm); font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.dpa-agentzh { font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); }
.dpa-agentnote { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); line-height: 1.5; color: var(--dph-fg-secondary); margin-top: auto; }
.dpa-badge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.1em; color: var(--dph-fg-secondary); white-space: nowrap; }
.dpa-badge[data-on="true"] { color: var(--dph-accent-text); }

.dpa-specblock { margin-bottom: 24px; }
.dpa-specblock h3 { margin: 0 0 8px; font-size: var(--dph-fs-micro); letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 700; }
.dpa-swatches { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1px; background: var(--dph-rule); border: 1px solid var(--dph-rule); }
.dpa-swatch { background: var(--dph-bg-paper); padding: 0 0 6px; }
.dpa-swatchchip { height: 52px; border-bottom: 1px solid var(--dph-rule); }
.dpa-swatchmeta { padding: 5px 6px 0; display: flex; flex-direction: column; gap: 1px; }
.dpa-swatchmeta b { font-size: var(--dph-fs-micro); letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; }
.dpa-swatchmeta code { font-family: var(--dph-font-mono); font-size: 8.5px; color: var(--dph-fg-muted); }
.dpa-typeramp { display: flex; flex-direction: column; gap: 7px; }
.dpa-typerow { display: grid; grid-template-columns: 52px minmax(0, 1fr) 62px; gap: 10px; align-items: baseline; border-bottom: 1px dotted var(--dph-rule); padding-bottom: 5px; }
.dpa-typerow .k { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); }
.dpa-typerow .v { font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); color: var(--dph-fg-muted); text-align: right; }
.dpa-radii { display: flex; gap: 18px; align-items: flex-end; }
.dpa-radius { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.dpa-radiusbox { width: 46px; height: 46px; border: 1px solid var(--dph-rule-strong); background: var(--dph-bg-raised); }
.dpa-radius span { font-family: var(--dph-font-mono); font-size: 8.5px; color: var(--dph-fg-muted); }
.dpa-spacing { display: flex; flex-direction: column; gap: 5px; }
.dpa-spacerow { display: flex; align-items: center; gap: 8px; }
.dpa-spacerow i { display: block; height: 8px; background: var(--dph-bg-invert); }
.dpa-spacerow span { font-family: var(--dph-font-mono); font-size: 8.5px; color: var(--dph-fg-muted); }

.dpa-kvlist { display: grid; grid-template-columns: 118px minmax(0, 1fr); border-top: 1px solid var(--dph-rule-strong); }
.dpa-kvlist dt, .dpa-kvlist dd { margin: 0; padding: 7px 8px; border-bottom: 1px solid var(--dph-rule); font-size: var(--dph-fs-sm); }
.dpa-kvlist dt { font-size: var(--dph-fs-micro); letter-spacing: var(--dph-ls-micro); text-transform: uppercase; color: var(--dph-fg-muted); font-weight: 700; }
.dpa-kvlist dd { font-family: var(--dph-font-mono); font-size: var(--dph-fs-xs); }
.dpa-prose { margin-top: 18px; max-width: 66ch; display: flex; flex-direction: column; gap: 9px; }
.dpa-prose p { margin: 0; font-size: var(--dph-fs-sm); line-height: var(--dph-lh-loose); color: var(--dph-fg-secondary); }
.dpa-stamp {
  margin-top: 20px; display: inline-block; padding: 6px 12px;
  border: 2px solid var(--dph-alert); color: var(--dph-alert);
  font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro);
  letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700;
  transform: rotate(-2.4deg); opacity: 0.92;
}

.dpa-railright { border-left: 1px solid var(--dph-rule); padding: 20px 18px 24px; overflow: auto; display: flex; flex-direction: column; gap: 16px; }
.dpa-card { border: 1px solid var(--dph-rule); background: var(--dph-bg-raised); box-shadow: var(--dph-elev-chip); }
.dpa-cardhead { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 7px; background: var(--dph-bg-invert); color: var(--dph-fg-invert); font-size: var(--dph-fs-micro); font-weight: 700; letter-spacing: var(--dph-ls-micro); text-transform: uppercase; }
.dpa-cardhead em { font-style: normal; font-family: var(--dph-font-mono); opacity: 0.6; }
.dpa-cardbody { padding: 10px; }
.dpa-specimen { display: block; width: 100%; height: auto; color: var(--dph-fg-primary); }
.dpa-kv { display: grid; grid-template-columns: 74px minmax(0, 1fr); gap: 6px 10px; margin: 0; font-size: var(--dph-fs-xs); }
.dpa-kv dt { color: var(--dph-fg-muted); font-size: var(--dph-fs-micro); letter-spacing: 0.08em; text-transform: uppercase; }
.dpa-kv dd { margin: 0; font-family: var(--dph-font-mono); text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dpa-statusline { display: flex; align-items: center; gap: 7px; font-family: var(--dph-font-mono); font-size: var(--dph-fs-micro); letter-spacing: 0.1em; color: var(--dph-fg-secondary); }
.dpa-dots { display: flex; gap: 4px; }
.dpa-dots i { width: 7px; height: 7px; border: 1px solid var(--dph-rule-strong); border-radius: var(--dph-r-dot); display: block; }
.dpa-dots i[data-on="true"] { background: var(--dph-accent-text); border-color: var(--dph-accent-text); }
.dpa-mini { margin-top: 8px; font-size: 8.5px; line-height: 1.6; letter-spacing: 0.05em; color: var(--dph-fg-muted); text-transform: uppercase; }

.dpa-bottom {
  position: relative; z-index: 3;
  display: flex; align-items: center; gap: 14px;
  padding: 0 var(--dph-space-5);
  border-top: 1px solid var(--dph-rule);
  font-family: var(--dph-font-mono);
  font-size: var(--dph-fs-micro);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--dph-fg-muted);
  background: var(--dph-bg-paper);
  overflow: hidden;
  white-space: nowrap;
}
.dpa-ticks { margin-left: auto; display: flex; gap: 3px; align-items: center; }
.dpa-tick { width: 7px; height: 7px; border: 1px solid var(--dph-rule-strong); }
.dpa-tick[data-on="true"] { background: var(--dph-fg-primary); border-color: var(--dph-fg-primary); }

.dpa-root button:focus-visible { outline: 1px solid var(--dph-accent); outline-offset: 2px; }

@container (max-width: 1080px) {
  .dpa-body { grid-template-columns: var(--dph-layout-rail-left, 216px) minmax(0, 1fr); }
  .dpa-railright { display: none; }
  .dpa-main { padding: 22px 24px 34px; }
}

@container (max-width: 820px) {
  .dpa-body { grid-template-columns: minmax(0, 1fr); }
  .dpa-rail { flex-direction: row; align-items: stretch; border-right: 0; border-bottom: 1px solid var(--dph-rule); padding: 8px; overflow-x: auto; }
  .dpa-railhead, .dpa-railfoot { display: none; }
  .dpa-nav { flex-direction: row; padding: 0; gap: 4px; }
  .dpa-navitem { grid-template-columns: auto auto; width: auto; border-left: 0; border-bottom: 2px solid transparent; padding: 6px 8px; }
  .dpa-navtext b { white-space: nowrap; }
  .dpa-navitem[aria-current="true"] { border-left-color: transparent; border-bottom-color: var(--dph-accent-invert); }
  .dpa-navtext span, .dpa-navcount { display: none; }
  .dpa-main { padding: 18px 18px 30px; }
  .dpa-h1 { font-size: var(--dph-fs-xl); }
  .dpa-ghost { display: none; }
  .dpa-toolgrid, .dpa-agents { grid-template-columns: minmax(0, 1fr); }
  .dpa-swatches { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .dpa-listhead, .dpa-listrow { grid-template-columns: 28px 52px minmax(0, 1fr) 56px; }
  .dpa-listhead span:last-child, .dpa-state { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .dpa-root *, .dpa-root *::before, .dpa-root *::after { transition: none !important; }
}
`;

    // ------------------------------------------------------------------
    // Atoms
    // ------------------------------------------------------------------
    function localeId(ctx) {
      try {
        const snap = ctx.locale.getLocale();
        return String((snap && (snap.id || snap.locale || snap.current)) || 'en');
      } catch (e) {
        return 'en';
      }
    }

    function fmtTime(d) {
      const p = (n) => (n < 10 ? '0' + n : '' + n);
      return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    }

    function pair(en, zh, loc) {
      return loc === 'zh' ? { primary: zh, secondary: en } : { primary: en, secondary: zh };
    }

    function Mark(props) {
      const size = (props && props.size) || 22;
      return h('svg', {
        viewBox: '0 0 64 64', width: size, height: size, 'aria-hidden': true,
        style: { display: 'block', flex: 'none' },
      },
        h('path', { d: 'M12 10H40L52 22V54H12Z', fill: 'none', stroke: 'currentColor', strokeWidth: 4 }),
        h('path', { d: 'M40 10V22H52', fill: 'none', stroke: 'currentColor', strokeWidth: 4 }),
        h('rect', { x: 21, y: 28, width: 20, height: 16, fill: 'currentColor' }),
        h('rect', { x: 45, y: 44, width: 6, height: 6, fill: 'var(--dph-accent)' })
      );
    }

    function Clock() {
      const [now, setNow] = useState(() => new Date());
      useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
      }, []);
      return span('dpa-clock', fmtTime(now));
    }

    function Specimen() {
      const line = { stroke: 'currentColor', strokeWidth: 0.8, fill: 'none' };
      const label = {
        fontSize: 6.2, letterSpacing: 0.7, fill: 'currentColor', opacity: 0.62,
        fontFamily: 'var(--dph-font-mono)',
      };
      return h('svg', {
        viewBox: '0 0 258 148', className: 'dpa-specimen', role: 'img',
        'aria-label': 'Mark construction with callouts',
      },
        h('rect', {
          x: 14, y: 26, width: 72, height: 72, stroke: 'currentColor', strokeWidth: 0.8,
          strokeDasharray: '2 3', fill: 'none', opacity: 0.5,
        }),
        h('g', { transform: 'translate(20.5 32.5) scale(0.94)' },
          h('path', { d: 'M12 10H40L52 22V54H12Z', fill: 'none', stroke: 'currentColor', strokeWidth: 3.2 }),
          h('path', { d: 'M40 10V22H52', fill: 'none', stroke: 'currentColor', strokeWidth: 3.2 }),
          h('rect', { x: 21, y: 28, width: 20, height: 16, fill: 'currentColor' }),
          h('rect', { x: 45, y: 44, width: 6, height: 6, fill: 'var(--dph-accent)' })
        ),
        h('path', { d: 'M86 34H118L130 22H168', ...line }),
        h('path', { d: 'M86 62H150', ...line }),
        h('path', { d: 'M86 62V86H124L136 98H168', ...line }),
        h('path', { d: 'M50 98V112H96', ...line }),
        h('circle', { cx: 86, cy: 34, r: 1.6, fill: 'currentColor' }),
        h('circle', { cx: 86, cy: 62, r: 1.6, fill: 'currentColor' }),
        h('circle', { cx: 86, cy: 62, r: 4.4, stroke: 'currentColor', strokeWidth: 0.8, fill: 'none', opacity: 0.5 }),
        h('text', { x: 170, y: 24, ...label }, 'PRIMARY MARK'),
        h('text', { x: 152, y: 64, ...label }, 'SAFE AREA 1x'),
        h('text', { x: 170, y: 100, ...label }, 'CORE BLOCK'),
        h('text', { x: 98, y: 115, ...label }, 'ACCENT 2% MAX'),
        h('path', { d: 'M14 122H244', ...line, opacity: 0.35 }),
        h('path', { d: 'M14 118V126M244 118V126', ...line, opacity: 0.35 }),
        h('text', { x: 14, y: 138, ...label }, 'FIG. 08 / CONSTRUCTION')
      );
    }

    // ------------------------------------------------------------------
    // Sections
    // ------------------------------------------------------------------
    function IndexSection({ loc }) {
      const rows = ARCHIVE.length ? ARCHIVE : FALLBACK_ARCHIVE;
      const head = div('dpa-listhead',
        span(null, 'NO.'),
        span(null, 'CODE'),
        span(null, loc === 'zh' ? '条目' : 'ENTRY'),
        h('span', { style: { textAlign: 'right' } }, 'META'),
        h('span', { style: { textAlign: 'right' } }, 'STATE'));
      const body = rows.map((r, i) => div('dpa-listrow',
        span('dpa-num', String(i + 1).padStart(2, '0')),
        span('dpa-num', r.code),
        div('dpa-title', h('b', null, loc === 'zh' ? r.zh : r.en), span(null, loc === 'zh' ? r.en : r.zh)),
        span('dpa-meta', r.meta),
        h('span', { className: 'dpa-state', 'data-s': r.state }, r.state)));
      return div(null, div('dpa-list', head, ...body));
    }

    function ToolSection() {
      const groups = [];
      ['IO', 'EXEC', 'WEB', 'AGENT', 'CORDIS', 'UI', 'META'].forEach((g) => {
        const items = TOOLS.filter((t) => t.group === g);
        if (items.length) groups.push([g, items]);
      });
      const blocks = groups.map(([g, items]) => {
        const cards = items.map((t) => div('dpa-tool',
          span('dpa-code', t.code),
          h('span', null, span('dpa-toolname', t.name), span('dpa-toolzh', t.zh)),
          span('dpa-toolnote', t.note)));
        return div('dpa-group',
          div('dpa-grouph', g, span('dpa-num', String(items.length).padStart(2, '0'))),
          div('dpa-toolgrid', ...cards));
      });
      return div(null, ...blocks);
    }

    function AgentSection({ loc }) {
      return div('dpa-agents', ...AGENTS.map((a) => div('dpa-agent',
        div('dpa-agenttop',
          span('dpa-code', a.code),
          span('dpa-badge', h('i', { className: 'dpa-dot', style: { background: a.state === 'ONLINE' ? 'var(--dph-accent-text)' : 'var(--dph-rule-strong)' } }), a.state)),
        div(null,
          div('dpa-agentname', loc === 'zh' ? a.zh : a.en),
          div('dpa-agentzh', loc === 'zh' ? a.en : a.zh)),
        div('dpa-agentnote', a.note))));
    }

    function SpecSection({ loc }) {
      const swatches = SPEC.length ? SPEC : [
        { name: 'paper', value: 'var(--dph-bg-paper)', hex: '#E7E4DF' },
        { name: 'raised', value: 'var(--dph-bg-raised)', hex: '#F6F4F0' },
        { name: 'ink', value: 'var(--dph-fg-primary)', hex: '#0B0F0D' },
        { name: 'accent', value: 'var(--dph-accent)', hex: '#FF7500' },
        { name: 'system', value: 'var(--dph-system)', hex: '#2971B8' },
        { name: 'alert', value: 'var(--dph-alert)', hex: '#B62A1E' },
      ];
      const ramp = [
        ['2XL', '44px', 'ARCHIVE', 'var(--dph-fs-2xl)', 800],
        ['XL', '27px', 'SPECIMEN', 'var(--dph-fs-xl)', 800],
        ['LG', '18px', 'Section heading', 'var(--dph-fs-lg)', 700],
        ['MD', '14px', 'Registry entries and body copy', 'var(--dph-fs-md)', 400],
        ['SM', '12px', 'Dense table rows', 'var(--dph-fs-sm)', 400],
        ['MICRO', '9px', 'LABELS · SERIALS · META', 'var(--dph-fs-micro)', 700],
      ];
      const radii = [['0', 'var(--dph-r-none)'], ['2', 'var(--dph-r-chip)'], ['inf', 'var(--dph-r-dot)']];
      const spaces = [4, 8, 12, 16, 24, 48];

      const swatchGrid = div('dpa-swatches', ...swatches.map((s) => div('dpa-swatch',
        divx({ className: 'dpa-swatchchip', style: { background: s.value } }),
        div('dpa-swatchmeta', h('b', null, s.name), h('code', null, s.hex)))));

      const typeRamp = div('dpa-typeramp', ...ramp.map(([k, px, sample, size, weight]) => div('dpa-typerow',
        span('k', k),
        h('span', { style: { fontSize: size, fontWeight: weight, lineHeight: 1.1, letterSpacing: k === '2XL' ? '-0.035em' : '0' } }, sample),
        span('v', px))));

      const radiusRow = div('dpa-radii', ...radii.map(([k, v]) => div('dpa-radius',
        divx({ className: 'dpa-radiusbox', style: { borderRadius: v } }),
        span(null, k + 'px'))));

      const spacingRows = div('dpa-spacing', ...spaces.map((n) => div('dpa-spacerow',
        h('i', { style: { width: n * 2 + 'px' } }),
        span(null, n + 'px'))));

      return div(null,
        div('dpa-specblock', h('h3', null, loc === 'zh' ? '色板 COLOUR' : 'COLOUR'), swatchGrid),
        div('dpa-specblock', h('h3', null, loc === 'zh' ? '字阶 TYPE' : 'TYPE'), typeRamp),
        div('dpa-specblock', h('h3', null, loc === 'zh' ? '圆角 RADIUS' : 'RADIUS'), radiusRow),
        div('dpa-specblock', h('h3', null, loc === 'zh' ? '间距 SPACING' : 'SPACING'), spacingRows));
    }

    function SysSection({ loc }) {
      const kv = [
        ['SYSTEM', (BRAND.brand3a || 'HARNESS') + ' ' + (BRAND.brand3b || 'OS')],
        ['IDENTITY', (BRAND.identity || 'Dr.') + ' / ' + (BRAND.identityId || '0000')],
        ['LEVEL', BRAND.accessLevel || '0'],
        ['VERSION', '1.0.0'],
        ['BUILD', BUILD],
        ['SOURCE', 'BV1rr4y1b7sz'],
        ['STYLE', 'TECHNICAL DOSSIER / OS SPECIMEN'],
        ['ASSETS', 'ORIGINAL - NO SOURCE REEL USED'],
        ['ICONS', 'REDRAWN ON 24PX GRID, 1.5PX STROKE'],
        ['LICENCE', 'MIT (CODE) / OWN ART (CC0)'],
      ];
      const rows = [];
      kv.forEach(([k, v]) => {
        rows.push(h('dt', { key: 'k:' + k }, k));
        rows.push(h('dd', { key: 'v:' + k }, v));
      });
      return div(null,
        h('dl', { className: 'dpa-kvlist' }, ...rows),
        div('dpa-prose',
          h('p', null, loc === 'zh'
            ? '本面板的视觉语法学习自一支游戏世界观宣传影像：温白纸面、发丝级网格、三字母科别代码块、极小号双语标注、以及一个不到百分之二面积的强调色。学习的是语法，不是素材。'
            : 'The visual grammar here was studied from a game world-building reel: warm paper, a hairline grid, three-letter section blocks, tiny bilingual annotations, and one accent under two percent of the surface. What was studied is the grammar, not the material.'),
          h('p', null, loc === 'zh'
            ? '源影像的任何帧、标识、角色、字体与文案均未进入本交付物。面板内所有图形为原创绘制，所有栏目语义均对应 DPH 自身能力。'
            : 'No frame, mark, character, typeface or copy from the source reel enters this deliverable. Every graphic is drawn for DPH, and every column maps to a real DPH capability.')),
        div('dpa-stamp', loc === 'zh' ? '风格研究 · 未使用原作素材' : 'STYLE STUDY · NO SOURCE ASSETS'));
    }

    const SECTION_BODY = {
      index: IndexSection,
      tool: ToolSection,
      agnt: AgentSection,
      spec: SpecSection,
      sys: SysSection,
    };

    // ------------------------------------------------------------------
    // Panel
    // ------------------------------------------------------------------
    function createPanel(ctx) {
      const readLocale = () => (/^zh/i.test(localeId(ctx)) ? 'zh' : 'en');
      const readMode = () => {
        try {
          const snap = ctx.theme.getTheme();
          const id = snap && (snap.id || snap.name || snap.current);
          return /dark|night/i.test(String(id)) ? 'dark' : 'light';
        } catch (e) {
          return 'light';
        }
      };

      return function Panel() {
        const [section, setSection] = useState('index');
        const [mode, setMode] = useState(readMode);
        const [loc, setLoc] = useState(readLocale);
        const [view, setView] = useState(() => [0, 0]);

        useEffect(() => {
          const measure = () => setView([window.innerWidth, window.innerHeight]);
          measure();
          window.addEventListener('resize', measure);
          return () => window.removeEventListener('resize', measure);
        }, []);

        useEffect(() => {
          let off = null;
          try {
            off = ctx.locale.subscribe(() => setLoc(readLocale()));
          } catch (e) { /* locale service unavailable */ }
          return () => { if (typeof off === 'function') off(); };
        }, []);

        const copy = COPY[loc] || COPY.en;
        const active = SECTIONS.filter((s) => s.id === section)[0] || SECTIONS[0];
        const Body = SECTION_BODY[active.id] || IndexSection;
        const counts = {
          index: ARCHIVE.length || FALLBACK_ARCHIVE.length,
          tool: TOOLS.length,
          agnt: AGENTS.length,
          spec: SPEC.length || 6,
          sys: 1,
        };

        const navItems = SECTIONS.map((s) => {
          const p = pair(s.short, s.zh, loc);
          return h('button', {
            key: s.id,
            type: 'button',
            className: 'dpa-navitem',
            'aria-current': s.id === active.id ? 'true' : 'false',
            onClick: () => setSection(s.id),
          },
            span('dpa-code', s.code),
            span('dpa-navtext', h('b', null, p.primary), span(null, p.secondary)),
            span('dpa-navcount', String(counts[s.id]).padStart(2, '0')));
        });

        const ticks = divx({ className: 'dpa-ticks', 'aria-hidden': true },
          ...SECTIONS.map((s) => h('span', {
            key: s.id,
            className: 'dpa-tick',
            'data-on': s.id === active.id ? 'true' : 'false',
          })));

        const kvRows = [
          ['RUNTIME', 'DPH'],
          ['IDENTITY', (BRAND.identity || 'Dr.') + ' ' + (BRAND.identityId || '0000')],
          ['LEVEL', BRAND.accessLevel || '0'],
          ['MODE', mode.toUpperCase()],
          ['LOCALE', loc.toUpperCase()],
          ['BUILD', BUILD],
        ];
        const kvKids = [];
        kvRows.forEach(([k, v]) => {
          kvKids.push(h('dt', { key: 'k:' + k }, k));
          kvKids.push(h('dd', { key: 'v:' + k }, v));
        });

        const header = divx({ className: 'dpa-top' },
          div('dpa-brand',
            h(Mark, { size: 21 }),
            div('dpa-brandtext', span('dpa-word', copy.brand), span('dpa-wordsub', copy.brandSub)),
            span('dpa-osc', copy.osc)),
          div('dpa-crumb',
            span(null, loc === 'zh' ? '内部档案' : 'INTERNAL ARCHIVE'),
            span('sep', '/'),
            span('here', active.no + ' ' + active.code)),
          div('dpa-topright',
            span('dpa-rev', 'REV 03'),
            h(Clock),
            divx({ className: 'dpa-mode', role: 'group', 'aria-label': 'Colour mode' },
              h('button', {
                type: 'button', className: 'dpa-modebtn',
                'data-on': mode === 'light' ? 'true' : 'false',
                'aria-pressed': mode === 'light',
                onClick: () => setMode('light'),
              }, 'L'),
              h('button', {
                type: 'button', className: 'dpa-modebtn',
                'data-on': mode === 'dark' ? 'true' : 'false',
                'aria-pressed': mode === 'dark',
                onClick: () => setMode('dark'),
              }, 'D'))));

        const leftRail = h('aside', { className: 'dpa-rail' },
          div('dpa-railhead', div('dpa-kicker', copy.navHint)),
          h('nav', { className: 'dpa-nav', 'aria-label': copy.navHint }, ...navItems),
          div('dpa-railfoot',
            div('dpa-live', h('i', { className: 'dpa-dot ok' }), 'LINK ACTIVE'),
            div('dpa-legal', copy.notice + ' / REV 03 / ' + BUILD)));

        const metaText = {
          index: String(counts.index).padStart(2, '0') + (loc === 'zh' ? ' 条目' : ' ENTRIES'),
          tool: String(TOOLS.length).padStart(2, '0') + (loc === 'zh' ? ' 能力' : ' CAPABILITIES'),
          agnt: String(AGENTS.length).padStart(2, '0') + (loc === 'zh' ? ' 角色' : ' ROLES'),
          spec: String(SPEC.length || 6).padStart(2, '0') + (loc === 'zh' ? ' 组' : ' GROUPS'),
          sys: '01 ' + (loc === 'zh' ? '记录' : 'RECORD'),
        };

        const NOTES = {
          index: [
            ['SOURCE', 'BV1rr4y1b7sz · 1080p25'],
            ['METHOD', '1 fps sweep · pHash dedupe'],
            ['POLICY', 'style only · no frames reused'],
          ],
          tool: [
            ['SURFACE', 'client + host halves'],
            ['SCOPE', 'session and workspace aware'],
            ['GUARD', 'approval policy enforced'],
          ],
          agnt: [
            ['MODE', 'serial · fan-out · pipeline'],
            ['CONTEXT', 'isolated per child'],
            ['OUTPUT', 'typed result only'],
          ],
          spec: [
            ['GROUND', 'paper 200 · lch 0.919 / 85'],
            ['INK', 'ink 950 · 14:1 on paper'],
            ['RULE', '1px · 16% ink · 32px grid'],
          ],
          sys: [
            ['BUILD', 'pipeline/build.py'],
            ['LICENCE', 'MIT code · own art'],
            ['NOTICE', 'no source assets'],
          ],
        };

        const notes = div('dpa-notes', ...(NOTES[active.id] || []).map(([k, v]) =>
          div('dpa-note', h('b', null, k), span(null, v))));

        const main = h('main', { className: 'dpa-main' },
          div('dpa-sheethead',
            div('dpa-eyebrow', h('i', null), active.no + ' / ' + metaText[active.id]),
            h('h1', { className: 'dpa-h1' },
              pair(active.en, active.zh, loc).primary,
              h('small', null, pair(active.en, active.zh, loc).secondary)),
            h('p', { className: 'dpa-lede' }, copy[active.lede] || ''),
            divx({ className: 'dpa-plate', 'aria-hidden': true },
              h('b', null, active.no),
              span(null, active.code))),
          h(Body, { loc: loc }),
          div('dpa-noteswrap', notes));

        const rightRail = h('aside', { className: 'dpa-railright' },
          div('dpa-card',
            div('dpa-cardhead', span(null, (loc === 'zh' ? '标本' : 'SPECIMEN') + ' 08'), h('em', null, BRAND.orgEn || 'DEEPSEEK')),
            div('dpa-cardbody', h(Specimen))),
          div('dpa-card',
            div('dpa-cardhead', span(null, copy.profile), h('em', null, '01')),
            div('dpa-cardbody', h('dl', { className: 'dpa-kv' }, ...kvKids))),
          div('dpa-card',
            div('dpa-cardhead', span(null, copy.status), h('em', null, '02')),
            div('dpa-cardbody',
              div('dpa-statusline',
                divx({ className: 'dpa-dots', 'aria-hidden': true },
                  h('i', { 'data-on': 'true' }),
                  h('i', { 'data-on': 'true' }),
                  h('i', { 'data-on': 'true' })),
                copy.statusLine),
              div('dpa-mini', 'PAPER / INK / 1 ACCENT / 0 RADIUS'))));

        const footer = divx({ className: 'dpa-bottom' },
          span(null, copy.order),
          span(null, copy.footer),
          ticks,
          span(null, copy.sheet + ' ' + active.no + ' / 05'));

        return divx({ className: 'dpa-root', 'data-mode': mode },
          h('style', { dangerouslySetInnerHTML: { __html: TOKENS_CSS + CSS } }),
          span('dpa-crop tl'),
          span('dpa-crop tr'),
          span('dpa-crop bl'),
          span('dpa-crop br'),
          header,
          div('dpa-body', leftRail, main, rightRail),
          footer);
      };
    }

    // ------------------------------------------------------------------
    // App chrome: shape, surface, texture (colour tokens cannot do this)
    // ------------------------------------------------------------------
    const CHROME_CSS = `
/* 1. zero radius: the whole shell is razor-sharp.
   The .dpa-root subtree is excluded so the archive panel keeps its radius scale. */
body *:not(.dpa-root, .dpa-root *) {
  border-radius: 0 !important;
}

button, input, textarea, select,
[role="button"], [role="tab"], [role="menuitem"], [role="option"], [role="combobox"],
[role="searchbox"], [role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"],
[role="tooltip"], [contenteditable="true"] {
  border-radius: 0 !important;
}

/* 0. the shell types in the dossier stack */
body {
  font-family: "Inter", "Helvetica Neue", "Segoe UI", "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;
  font-feature-settings: "tnum" 1, "cv05" 1;
  -webkit-font-smoothing: antialiased;
}

/* 2. popovers replace their float with a hairline + paper shadow */
[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [role="tooltip"] {
  border: 1px solid var(--dsw-alias-border-l2) !important;
  box-shadow: 0 18px 44px rgba(11, 15, 13, 0.16) !important;
  background-clip: padding-box;
}

/* 3. fields sit on the raised paper, not on a tinted pill */
input, textarea {
  background-color: var(--dsw-alias-bg-layer-1) !important;
}
input::placeholder, textarea::placeholder {
  opacity: 1;
  color: var(--dsw-alias-label-secondary);
}

/* 4. focus is a 1px ink/orange rule, never a glow */
:focus-visible {
  outline: 1px solid var(--dsw-alias-brand-primary) !important;
  outline-offset: 1px;
}

/* 5. selection reads as a highlighter mark */
::selection {
  background: rgba(255, 117, 0, 0.24);
}

/* 6. codes and serials are monospaced */
code, pre, kbd, samp, tt {
  font-family: "JetBrains Mono", "Cascadia Mono", Consolas, ui-monospace, monospace;
}

/* 7. a hairline, not a bar, separates */
hr, [role="separator"] {
  border: 0 !important;
  height: 1px !important;
  background: var(--dsw-alias-border-l1) !important;
}

/* 8. thin scrollbars in the same ink */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-border-l2) transparent;
}

/* 9. the sheet: 32px hairline grid + paper grain over the whole frame */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none;
  opacity: 0.6;
  mix-blend-mode: multiply;
  background-image:
    repeating-linear-gradient(to right, rgba(11, 15, 13, 0.05) 0 1px, transparent 1px 32px),
    repeating-linear-gradient(to bottom, rgba(11, 15, 13, 0.05) 0 1px, transparent 1px 32px),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.32'/></svg>");
}

html[data-dph-skin="dark"] body::after {
  mix-blend-mode: screen;
  opacity: 0.42;
  background-image:
    repeating-linear-gradient(to right, rgba(233, 229, 223, 0.045) 0 1px, transparent 1px 32px),
    repeating-linear-gradient(to bottom, rgba(233, 229, 223, 0.045) 0 1px, transparent 1px 32px);
}

/* 10. a hairline at the very edge of the sheet (no marks near the corners,
      where the shell keeps its own buttons) */
html[data-dph-skin] body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l1);
}

/* 11. every icon is redrawn on the same hairline grid */
:is(button, [role="button"], [role="tab"], [role="menuitem"]) svg {
  stroke-linejoin: miter;
  stroke-miterlimit: 2;
}
:is(button, [role="button"], [role="tab"], [role="menuitem"]) svg :is(path, line, polyline, rect, circle, ellipse) {
  stroke-width: 1.4;
}
:is(button, [role="button"]):hover {
  background-color: var(--dsw-alias-bg-layer-2) !important;
}
:is(button, [role="button"]):active {
  background-color: var(--dsw-alias-label-primary) !important;
  color: var(--dsw-alias-bg-base) !important;
}

/* 12. the selected row in a navigation list is an ink plate, not a tint */
[role="treeitem"][aria-selected="true"],
[role="option"][aria-selected="true"] {
  background-color: var(--dsw-alias-label-primary) !important;
  color: var(--dsw-alias-bg-base) !important;
  box-shadow: inset 2px 0 0 #FF7500 !important;
  border: 0 !important;
  outline: 0 !important;
}
[role="treeitem"][aria-selected="true"] *,
[role="option"][aria-selected="true"] * {
  color: var(--dsw-alias-bg-base) !important;
}

/* a tab is underlined, not turned into a block */
[role="tab"][aria-selected="true"] {
  background-color: transparent !important;
  color: var(--dsw-alias-label-primary) !important;
  box-shadow: inset 0 -2px 0 #FF7500 !important;
  border: 0 !important;
}

[role="treeitem"] {
  border-radius: 0 !important;
  border-left: 2px solid transparent !important;
}
[role="treeitem"]:hover {
  background-color: var(--dsw-alias-bg-layer-2) !important;
}

/* 15. sidebar: workspaces header, new-session button, brand row */
[class*="_logoRow"] {
  border-bottom: 1px solid var(--dsw-alias-border-l1);
}
[class*="_sectionHeader"] {
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  padding-bottom: 3px !important;
}
[class*="_sectionLabel"] {
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.16em !important;
  color: var(--dsw-alias-label-secondary) !important;
}
[class*="_searchInput"] {
  background: transparent !important;
  border: 0 !important;
  border-bottom: 1px solid var(--dsw-alias-border-l2) !important;
  border-radius: 0 !important;
  font-size: 11px !important;
  letter-spacing: 0.04em !important;
}
[class*="_iconButton"] {
  border: 1px solid transparent !important;
  border-radius: 0 !important;
}
[class*="_iconButton"]:hover {
  border-color: var(--dsw-alias-border-l2) !important;
  background-color: transparent !important;
}
button[class*="_newSession"] {
  background: transparent !important;
  border: 1px solid var(--dsw-alias-border-l2) !important;
  border-radius: 0 !important;
  font-weight: 600 !important;
  letter-spacing: 0.06em !important;
}
button[class*="_newSession"]:hover {
  background: var(--dsw-alias-label-primary) !important;
  border-color: var(--dsw-alias-label-primary) !important;
  color: var(--dsw-alias-bg-base) !important;
}
button[class*="_newSession"]:hover svg {
  color: var(--dsw-alias-bg-base) !important;
  stroke: currentColor;
}
[class*="_panelTitle"] {
  letter-spacing: 0.02em !important;
}

/* 16. header utilities: explorer / more / right-panel are one hairline trio */
[class*="_headerUtilities"] button,
[class*="_headerCorner"] button,
[class*="_headerUtilities"] a,
[class*="_headerCorner"] a {
  border: 1px solid transparent !important;
  border-radius: 0 !important;
  background: transparent !important;
}
[class*="_headerUtilities"] button:hover,
[class*="_headerCorner"] button:hover,
[class*="_headerUtilities"] a:hover,
[class*="_headerCorner"] a:hover {
  border-color: var(--dsw-alias-border-l2) !important;
  background: transparent !important;
}
[class*="_headerUtilities"] svg,
[class*="_headerCorner"] svg {
  stroke-width: 1.4;
}
[class*="_split"] {
  border: 0 !important;
  background: transparent !important;
}
[class*="_appIcon"] {
  filter: grayscale(1) contrast(1.05);
  opacity: 0.72;
}

/* 18. blank-session hero mark: reuse the shell's own brand glyph */
[data-dph-hero] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--dsw-alias-label-primary);
}
[data-dph-hero] svg {
  display: block;
  width: 40px;
  height: auto;
}

/* 17. bottom-left account row */
[class*="_triggerRow"] {
  border-top: 1px solid var(--dsw-alias-border-l1);
  padding-top: 4px;
}
[class*="_trigger"] {
  border-radius: 0 !important;
}
[class*="_trigger"] [class*="_label"] {
  font-size: 11px !important;
  font-weight: 600 !important;
  letter-spacing: 0.12em !important;
  color: var(--dsw-alias-label-secondary) !important;
}

/* 13. frame chrome (rendered into shell.overlay) */
.dpa-frame {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
}

/* 14. composer framing strip */
.dpa-dock {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 20px;
  padding: 0 2px;
  pointer-events: none;
  font-family: "JetBrains Mono", "Cascadia Mono", Consolas, ui-monospace, monospace;
  font-size: 8.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-secondary);
}
.dpa-dock > .chip {
  display: inline-flex;
  align-items: center;
  height: 14px;
  padding: 0 5px;
  background: var(--dsw-alias-label-primary);
  color: var(--dsw-alias-bg-base);
  font-weight: 700;
  letter-spacing: 0.12em;
}
.dpa-dock > .rule {
  flex: 1;
  height: 1px;
  background: var(--dsw-alias-border-l1);
}
.dpa-dock > .rule.short {
  flex: 0 0 28px;
}
.dpa-dock > .tag.dim {
  opacity: 0.65;
}
`;

    function skinChrome(ctx) {
      if (typeof document === 'undefined' || !document.head) return;
      const cleanup = [];

      // Constructed stylesheet first: CSSOM insertion is not subject to a
      // style-src CSP the way an inline <style> element is.
      let adopted = false;
      try {
        if (typeof CSSStyleSheet === 'function' && 'adoptedStyleSheets' in document) {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(CHROME_CSS);
          document.adoptedStyleSheets = Array.from(document.adoptedStyleSheets).concat(sheet);
          cleanup.push(() => {
            document.adoptedStyleSheets = Array.from(document.adoptedStyleSheets)
              .filter((s) => s !== sheet);
          });
          adopted = true;
        }
      } catch (e) { /* fall through to <style> */ }

      if (!adopted) {
        const node = document.createElement('style');
        node.setAttribute('data-dph-skin', '');
        node.textContent = CHROME_CSS;
        document.head.appendChild(node);
        cleanup.push(() => { if (node.parentNode) node.parentNode.removeChild(node); });
      }

      const paint = () => {
        let scheme = 'light';
        try {
          const snap = ctx.theme.getTheme() || {};
          const active = snap.active || {};
          const preference = snap.preference || snap.id;
          if (active.colorScheme === 'dark' || active.colorScheme === 'light') {
            scheme = active.colorScheme;
          } else if (preference === 'dark' || preference === 'light') {
            scheme = preference;
          } else if (window.matchMedia) {
            scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
        } catch (e) { /* keep light */ }
        document.documentElement.setAttribute('data-dph-skin', scheme);
      };
      paint();

      let offTheme = null;
      try {
        offTheme = ctx.on('theme/change', paint);
      } catch (e) { /* event not available */ }

      if (typeof ctx.effect === 'function') {
        ctx.effect(() => () => {
          cleanup.forEach((fn) => fn());
          document.documentElement.removeAttribute('data-dph-skin');
          if (typeof offTheme === 'function') offTheme();
        });
      }
    }

    function BrandMark(props) {
      const size = (props && (props.size || props.width)) || 24;
      return h('svg', {
        viewBox: '0 0 64 64', width: size, height: size, 'aria-hidden': true,
        style: { display: 'block', color: 'currentColor' },
      },
        h('path', { d: 'M12 10H40L52 22V54H12Z', fill: 'none', stroke: 'currentColor', strokeWidth: 4 }),
        h('path', { d: 'M40 10V22H52', fill: 'none', stroke: 'currentColor', strokeWidth: 4 }),
        h('rect', { x: 21, y: 28, width: 20, height: 16, fill: 'currentColor' }),
        h('rect', { x: 45, y: 44, width: 6, height: 6, fill: '#FF7500' })
      );
    }

    function Icon(props) {
      const size = (props && props.size) || 20;
      return h('svg', {
        viewBox: '0 0 64 64', width: size, height: size, 'aria-hidden': true,
        style: { display: 'block', color: 'currentColor', opacity: props && props.active ? 1 : 0.82 },
      },
        h('path', { d: 'M12 10H40L52 22V54H12Z', fill: 'none', stroke: 'currentColor', strokeWidth: 4.5 }),
        h('path', { d: 'M40 10V22H52', fill: 'none', stroke: 'currentColor', strokeWidth: 4.5 }),
        h('rect', { x: 21, y: 28, width: 20, height: 16, fill: 'currentColor' }),
        h('rect', { x: 45, y: 44, width: 6, height: 6, fill: 'currentColor', opacity: 0.55 })
      );
    }

    // ------------------------------------------------------------------
    // Shell chrome pieces (rendered into shell slots, not into a panel)
    // ------------------------------------------------------------------
    function ComposerDock() {
      const zh = /^zh/i.test(localeId(currentCtx));
      return h('div', { className: 'dpa-dock', 'aria-hidden': true },
        h('span', { className: 'chip' }, 'IN'),
        h('span', { className: 'rule' }),
        h('span', { className: 'tag' }, zh ? '输入 / COMPOSER' : 'COMPOSER / INPUT')
      );
    }

    // The blank-session hero should carry the shell's own brand glyph (the whale).
    // It is cloned from the sidebar mark at runtime, so no copy of the logo ships
    // with the plugin and it always matches the app's current artwork.
    function mountHeroMark(ctx) {
      if (typeof document === 'undefined') return;

      const brandGlyph = () =>
        document.querySelector('[data-slot="sidebar.brand.mark"] svg') ||
        document.querySelector('[class*="_brandMark"] svg');

      const mark = (host) => {
        host.setAttribute('data-dph-hero', '1');
        host.setAttribute('aria-hidden', 'true');
        return host;
      };

      const fromSlot = (whale) => {
        const slot = document.querySelector('[data-slot="conversation.hero.brand.mark"]');
        if (!slot || slot.querySelector('[data-dph-hero]')) return false;
        const host = mark(document.createElement('span'));
        const clone = whale.cloneNode(true);
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        host.appendChild(clone);
        slot.textContent = '';
        slot.appendChild(host);
        return true;
      };

      // Fallback: anchor on the hero headline text, then swap the glyph that
      // sits in the same block. Works even if the slot is renamed.
      const fromHeadline = (whale) => {
        const labels = ['探索未至之境', 'Explore the unknown', 'DEEPSEEK'];
        const all = document.querySelectorAll('h1, h2, h3, div, span, p');
        for (let i = 0; i < all.length; i += 1) {
          const el = all[i];
          if (el.children.length > 0 || !el.textContent) continue;
          const text = el.textContent.trim();
          if (labels.indexOf(text) < 0) continue;
          let scope = el.parentElement;
          for (let depth = 0; depth < 3 && scope; depth += 1) {
            const glyph = scope.querySelector('svg, img');
            if (glyph && !glyph.closest('[data-dph-hero]')) {
              const host = mark(document.createElement('span'));
              const clone = whale.cloneNode(true);
              clone.removeAttribute('width');
              clone.removeAttribute('height');
              host.appendChild(clone);
              glyph.parentNode.insertBefore(host, glyph);
              glyph.remove();
              return true;
            }
            scope = scope.parentElement;
          }
        }
        return false;
      };

      const paint = () => {
        const whale = brandGlyph();
        if (!whale) return;
        if (!fromSlot(whale)) fromHeadline(whale);
      };

      paint();
      const timer = setInterval(paint, 1200);
      try {
        if (typeof ctx.effect === 'function') ctx.effect(() => () => clearInterval(timer));
      } catch (e) { /* keep the timer */ }
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        currentCtx = ctx;

        // ---- 1. app-level skin -------------------------------------
        // Repaints the whole Harness shell through the theme alias layer:
        // paper ground, ink labels, hairline borders, burnt-orange brand.
        const skinTokens = {};
        const lightSkin = (SKIN && SKIN.light) || {};
        const darkSkin = (SKIN && SKIN.dark) || {};
        Object.keys(lightSkin).forEach((key) => {
          skinTokens[key] = { light: lightSkin[key], dark: darkSkin[key] || lightSkin[key] };
        });
        if (Object.keys(skinTokens).length > 0) {
          try {
            const dispose = ctx.theme.overrideTokens('dph-archive', skinTokens);
            if (typeof ctx.effect === 'function') ctx.effect(() => dispose);
          } catch (err) {
            console.warn('[dph-archive] skin override failed:', err);
          }
        }

        // ---- 2. app chrome: shape, surface, texture -----------------
        // Colour tokens cannot square a corner or add grain, so this layer
        // restyles the shell's generic chrome by element type and ARIA role.
        skinChrome(ctx);

        const slot = (name, options, component) => {
          ctx.slots.inject(name, () => {
            try {
              return ctx.slots.register(options, component);
            } catch (err) {
              console.warn('[dph-archive] ' + name + ' registration failed:', err);
              return () => {};
            }
          });
        };

        // ---- 3. identity slots --------------------------------------
        slot('sidebar.brand.mark', { name: 'sidebar.brand.mark', id: 'dph-brand' }, BrandMark);
        slot('conversation.hero.brand.mark', { name: 'conversation.hero.brand.mark' }, BrandMark);

        // ---- 5. composer framing ------------------------------------
        slot('conversation.input.dock', {
          name: 'conversation.input.dock', id: 'dph-input-dock', order: 10,
        }, ComposerDock);

        // ---- 6. hero mark -------------------------------------------
        mountHeroMark(ctx);
      },
    };
  },
});
