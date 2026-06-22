// Shared chrome, tokens, icons for Pyor — a native-feeling macOS PR reviewer.
// Aesthetic: Xcode/Linear. Flat, dense, neutral grays, single blue accent.

// Two palettes, both expressing semantic intent (no raw colour names in screens).
// Switch via applyTheme(dark).
const LIGHT = {
  // Surfaces
  canvas:      '#ececef',      // canvas behind window
  windowBg:    '#ffffff',      // primary window fill
  surface:     '#ffffff',      // cards, dropdowns, diff body, dialogs
  surface2:    '#fbfbfc',      // sticky group headers, file diff headers
  surface3:    '#f6f6f8',      // status bar, recessed strips
  inputBg:     '#ffffff',
  codeBg:      '#f1f1f4',      // inline code chip bg (matches sidebar)
  sidebar:     '#f1f1f4',
  sidebar2:    '#e8e8ec',
  panel:       '#fafafa',
  titlebar:    '#ececec',
  titlebarBd:  '#d8d8dc',
  hover:       'rgba(0,0,0,0.045)',
  selected:    'rgba(10,132,255,0.12)',
  selectedFg:  '#0a84ff',
  selectionBg: '#eaf3ff',      // active filter chip / tab badge fill
  selectionBd: '#b3d4ff',
  unreadBg:    '#f1f7ff',
  // Borders / dividers
  border:      '#e0e0e4',
  borderSoft:  '#ebebef',
  borderStrong:'#c8c8cc',
  // Text
  text:        '#1d1d1f',
  text2:       '#6e6e73',
  text3:       '#98989d',
  text4:       '#b8b8bd',
  link:        '#0a84ff',
  // Status / semantics
  open:        '#30a14c',
  draft:       '#8a8a8e',
  merged:      '#8e4ec6',
  closed:      '#d2424a',
  warn:        '#c47a06',
  pass:        '#30a14c',
  fail:        '#d2424a',
  pending:     '#c47a06',
  neutral:     '#8a8a8e',
  // Semantic callout tints
  successBg:   '#f0faf2', successBd: '#b9e2c3',
  failBg:      '#fdf0f1', failBd:    '#f0b4b8',
  failTint:    '#fdecec',
  warnBg:      '#fff7ea', warnBd:    '#f0d27a', warnFg: '#7a5601',
  // Diff
  addBg:       '#e6f4ea',
  addBgHi:     '#bbe5c5',
  addLine:     '#1a7f37',
  addGutter:   '#cdebd6',
  delBg:       '#fbeaea',
  delBgHi:     '#ffc8c8',
  delLine:     '#b42318',
  delGutter:   '#f3d2d2',
  ctxGutter:   '#fafafa',
  hunkBg:      '#f0f4ff',
  hunkBd:      '#d9def2',
  hunkText:    '#3b5bdb',
  // Syntax highlight
  synKw:       '#7c3aed',
  synFn:       '#0a84ff',
  synStr:      '#a31515',
  synNum:      '#075985',
  synComment:  '#6f7e8c',
  synTodo:     '#b45309',
  // Comments
  threadBg:    '#fafafa',
  threadBd:    '#e0e0e4',
  composeBg:   '#ffffff',
  unread:      '#0a84ff',
  // Avatar lightness (oklch L, C)
  avatarL: 0.78, avatarC: 0.10, avatarFgL: 0.30, avatarBd: 'rgba(0,0,0,0.08)',
  // Window outer shadow
  windowShadow: '0 0 0 0.5px rgba(0,0,0,0.30), 0 24px 60px rgba(0,0,0,0.22), 0 6px 14px rgba(0,0,0,0.08)',
  // Numbers
  radius:      10,
  radiusSm:    6,
  isDark:      false,
};

const DARK = {
  canvas:      '#1a1a1c',
  windowBg:    '#1f1f22',
  surface:     '#26262a',
  surface2:    '#2a2a2e',
  surface3:    '#1a1a1d',
  inputBg:     '#1a1a1d',
  codeBg:      '#2c2c30',
  sidebar:     '#202023',
  sidebar2:    '#2c2c30',
  panel:       '#222226',
  titlebar:    '#2a2a2e',
  titlebarBd:  '#3a3a3e',
  hover:       'rgba(255,255,255,0.05)',
  selected:    'rgba(10,132,255,0.22)',
  selectedFg:  '#5aa9ff',
  selectionBg: 'rgba(10,132,255,0.18)',
  selectionBd: '#1f4f8f',
  unreadBg:    'rgba(10,132,255,0.10)',
  border:      '#38383c',
  borderSoft:  '#2e2e32',
  borderStrong:'#4a4a4e',
  text:        '#f2f2f7',
  text2:       '#a8a8ae',
  text3:       '#7a7a80',
  text4:       '#5a5a5f',
  link:        '#5aa9ff',
  open:        '#3fb950',
  draft:       '#8b949e',
  merged:      '#a371f7',
  closed:      '#f85149',
  warn:        '#e3a008',
  pass:        '#3fb950',
  fail:        '#f85149',
  pending:     '#e3a008',
  neutral:     '#8b949e',
  successBg:   'rgba(63,185,80,0.10)',  successBd: 'rgba(63,185,80,0.28)',
  failBg:      'rgba(248,81,73,0.10)',  failBd:    'rgba(248,81,73,0.30)',
  failTint:    'rgba(248,81,73,0.18)',
  warnBg:      'rgba(227,160,8,0.10)',  warnBd:    'rgba(227,160,8,0.32)', warnFg: '#e3a008',
  addBg:       'rgba(46,160,67,0.15)',
  addBgHi:     'rgba(46,160,67,0.35)',
  addLine:     '#56d364',
  addGutter:   'rgba(46,160,67,0.25)',
  delBg:       'rgba(248,81,73,0.13)',
  delBgHi:     'rgba(248,81,73,0.30)',
  delLine:     '#f85149',
  delGutter:   'rgba(248,81,73,0.25)',
  ctxGutter:   '#202023',
  hunkBg:      'rgba(56,139,253,0.10)',
  hunkBd:      'rgba(56,139,253,0.25)',
  hunkText:    '#79b8ff',
  synKw:       '#c792ea',
  synFn:       '#82aaff',
  synStr:      '#ecc48d',
  synNum:      '#f78c6c',
  synComment:  '#697077',
  synTodo:     '#ffcb6b',
  threadBg:    '#222226',
  threadBd:    '#38383c',
  composeBg:   '#26262a',
  unread:      '#5aa9ff',
  avatarL: 0.55, avatarC: 0.10, avatarFgL: 0.92, avatarBd: 'rgba(255,255,255,0.08)',
  windowShadow:'0 0 0 0.5px rgba(0,0,0,0.6), 0 24px 60px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.30)',
  radius:      10,
  radiusSm:    6,
  isDark:      true,
};

const T = { ...LIGHT };
function applyTheme(dark) {
  // Clear keys then refill (so removed keys don't linger) — both palettes have
  // the same shape today, but this is safer for future drift.
  for (const k of Object.keys(T)) delete T[k];
  Object.assign(T, dark ? DARK : LIGHT);
}

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif';
const MONO = '"SF Mono", ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace';
const DISPLAY = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

// ── Window chrome ─────────────────────────────────────────────
function PierWindow({ width, height, children, title, subtitle, sidebar, sidebarWidth = 232, appSidebar, appSidebarWidth = 220, toolbar, status, overlay }) {
  // Total width used by the chrome's left-side rails for traffic-light offset.
  const leftRailsWidth = (appSidebar ? appSidebarWidth : 0) + (sidebar ? sidebarWidth : 0);
  return (
    <div style={{
      width, height, borderRadius: 12, overflow: 'hidden',
      background: T.windowBg,
      boxShadow: T.windowShadow,
      display: 'flex', flexDirection: 'column',
      fontFamily: FONT, color: T.text, fontSize: 13,
      position: 'relative',
    }}>
      <Titlebar title={title} subtitle={subtitle} leftRailsWidth={leftRailsWidth} toolbar={toolbar} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {appSidebar && (
          <div style={{ width: appSidebarWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {appSidebar}
          </div>
        )}
        {sidebar && (
          <div style={{ width: sidebarWidth, background: T.sidebar, borderRight: `0.5px solid ${T.border}`, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {sidebar}
          </div>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: T.windowBg }}>
          {children}
        </div>
      </div>
      {status && (
        <div style={{
          height: 22, borderTop: `0.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', padding: '0 10px',
          fontSize: 11, color: T.text2, background: T.surface3,
        }}>{status}</div>
      )}
      {overlay && (
        <div style={{
          position: 'absolute', top: 38, left: 0, right: 0, bottom: status ? 22 : 0,
          zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: T.isDark ? 'rgba(0,0,0,0.55)' : 'rgba(20,20,22,0.32)',
          backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        }}>
          {overlay}
        </div>
      )}
    </div>
  );
}

function Titlebar({ title, subtitle, leftRailsWidth, toolbar }) {
  const railsW = leftRailsWidth || 78;
  return (
    <div style={{
      height: 38, flexShrink: 0, display: 'flex', alignItems: 'stretch',
      background: T.titlebar,
      borderBottom: `0.5px solid ${T.titlebarBd}`,
    }}>
      <div style={{
        width: railsW,
        display: 'flex', alignItems: 'center', padding: '0 14px',
        borderRight: leftRailsWidth ? `0.5px solid ${T.border}` : 'none',
      }}>
        <TrafficLights />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12, minWidth: 0 }}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: T.text, whiteSpace: 'nowrap' }}>{title}</span>
            {subtitle && <span style={{ fontSize: 12, color: T.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</span>}
          </div>
        )}
        <div style={{ flex: 1 }} />
        {toolbar}
      </div>
    </div>
  );
}

function TrafficLights() {
  const dot = (bg) => (
    <div style={{
      width: 12, height: 12, borderRadius: '50%', background: bg,
      border: `0.5px solid ${T.isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.12)'}`,
    }} />
  );
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {dot('#ff5f57')}
      {dot('#febc2e')}
      {dot('#28c840')}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────
function Icon({ name, size = 14, color = 'currentColor', strokeWidth = 1.5 }) {
  const s = size;
  const c = color;
  const sw = strokeWidth;
  const common = { width: s, height: s, viewBox: '0 0 16 16', fill: 'none', stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'pr-open': // green circle with merge-arrow
      return (<svg {...common}><circle cx="5" cy="4" r="1.6" fill={c}/><circle cx="5" cy="12" r="1.6" fill={c}/><circle cx="11" cy="12" r="1.6" fill={c}/><path d="M5 5.6V10.4M5 5.6c0 3 3 3 6 3v1.8"/></svg>);
    case 'pr-draft':
      return (<svg {...common}><circle cx="5" cy="4" r="1.6"/><circle cx="5" cy="12" r="1.6"/><circle cx="11" cy="12" r="1.6"/><path d="M5 5.6V10.4M5 5.6c0 3 3 3 6 3v1.8" strokeDasharray="1.5 1.5"/></svg>);
    case 'pr-merged':
      return (<svg {...common} stroke={c}><circle cx="5" cy="4" r="1.6" fill={c}/><circle cx="11" cy="12" r="1.6" fill={c}/><path d="M5 5.6V12M5 12c0-3 3-3 6-3V10.4"/></svg>);
    case 'pr-closed':
      return (<svg {...common}><circle cx="5" cy="4" r="1.6" fill={c}/><circle cx="11" cy="12" r="1.6" fill={c}/><path d="M5 5.6V12M11 5l-3 3M8 5l3 3"/></svg>);
    case 'check': return (<svg {...common}><path d="M3 8.5l3 3 7-7"/></svg>);
    case 'x': return (<svg {...common}><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>);
    case 'dot': return (<svg {...common}><circle cx="8" cy="8" r="3" fill={c} stroke="none"/></svg>);
    case 'clock': return (<svg {...common}><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></svg>);
    case 'comment': return (<svg {...common}><path d="M2.5 3.5h11v7h-5l-3 2.5v-2.5h-3z"/></svg>);
    case 'comment-fill': return (<svg {...common} fill={c} stroke="none"><path d="M2.5 3.5h11v7h-5l-3 2.5v-2.5h-3z"/></svg>);
    case 'eye': return (<svg {...common}><path d="M1.5 8s2.5-4 6.5-4 6.5 4 6.5 4-2.5 4-6.5 4-6.5-4-6.5-4z"/><circle cx="8" cy="8" r="1.5"/></svg>);
    case 'eye-off': return (<svg {...common}><path d="M2.5 4.5s2 3.5 5.5 3.5 5.5-3.5 5.5-3.5M5 8.5l-1.5 2M11 8.5l1.5 2M8 9.5V12"/></svg>);
    case 'file': return (<svg {...common}><path d="M3.5 1.5h6L13 5v9.5H3.5z"/><path d="M9.5 1.5V5H13"/></svg>);
    case 'folder': return (<svg {...common}><path d="M1.5 4.5L3 3h3.5l1.5 1.5h6V13H1.5z"/></svg>);
    case 'folder-open': return (<svg {...common}><path d="M1.5 4.5L3 3h3.5l1.5 1.5h6V6H1.5z"/><path d="M1.5 6L3 13h11l1.5-7z"/></svg>);
    case 'chevron-right': return (<svg {...common}><path d="M6 3.5L10.5 8 6 12.5"/></svg>);
    case 'chevron-left': return (<svg {...common}><path d="M10 3.5L5.5 8 10 12.5"/></svg>);
    case 'chevron-down': return (<svg {...common}><path d="M3.5 6L8 10.5 12.5 6"/></svg>);
    case 'chevron-up': return (<svg {...common}><path d="M3.5 10L8 5.5 12.5 10"/></svg>);
    case 'search': return (<svg {...common}><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>);
    case 'refresh': return (<svg {...common}><path d="M13.5 3.5v3h-3M2.5 12.5v-3h3M13.2 7a5.5 5.5 0 00-10.4-1M2.8 9a5.5 5.5 0 0010.4 1"/></svg>);
    case 'filter': return (<svg {...common}><path d="M2 3.5h12L9.5 9v4l-3-1V9z"/></svg>);
    case 'plus': return (<svg {...common}><path d="M8 3v10M3 8h10"/></svg>);
    case 'external': return (<svg {...common}><path d="M9 2.5h4.5V7M13 3l-6 6M11 9v3.5H3.5V5H7"/></svg>);
    case 'kebab': return (<svg {...common}><circle cx="8" cy="3.5" r="0.9" fill={c} stroke="none"/><circle cx="8" cy="8" r="0.9" fill={c} stroke="none"/><circle cx="8" cy="12.5" r="0.9" fill={c} stroke="none"/></svg>);
    case 'list': return (<svg {...common}><path d="M2 4h12M2 8h12M2 12h12"/></svg>);
    case 'tree': return (<svg {...common}><path d="M3 3h4v3H3zM9 7h4v3H9zM9 11h4v3H9zM5 6v8M5 9h4M5 13h4"/></svg>);
    case 'expand-all': return (<svg {...common}><path d="M3 4h3M3 4v3M13 4h-3M13 4v3M3 12h3M3 12v-3M13 12h-3M13 12v-3"/></svg>);
    case 'collapse-all': return (<svg {...common}><path d="M3 7h3V4M13 7h-3V4M3 9h3v3M13 9h-3v3"/></svg>);
    case 'reset': return (<svg {...common}><path d="M3 8a5 5 0 105-5 5 5 0 00-3.5 1.5L3 6V3M3 6h3"/></svg>);
    case 'sidebar-collapse': return (<svg {...common}><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M6 3v10M11 6L9 8l2 2"/></svg>);
    case 'sidebar-expand': return (<svg {...common}><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M6 3v10M9 6l2 2-2 2"/></svg>);
    case 'split': return (<svg {...common}><rect x="2" y="3" width="5.5" height="10" rx="1"/><rect x="8.5" y="3" width="5.5" height="10" rx="1"/></svg>);
    case 'inline': return (<svg {...common}><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M2 8h12"/></svg>);
    case 'arrow-up': return (<svg {...common}><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/></svg>);
    case 'arrow-down': return (<svg {...common}><path d="M8 3v10M3.5 8.5L8 13l4.5-4.5"/></svg>);
    case 'arrow-up-line': return (<svg {...common}><path d="M2 13.5h12M8 11V3M4.5 6.5L8 3l3.5 3.5"/></svg>);
    case 'arrow-down-line': return (<svg {...common}><path d="M2 2.5h12M8 5v8M4.5 9.5L8 13l3.5-3.5"/></svg>);
    case 'trash': return (<svg {...common}><path d="M2.5 4h11M6 4V2.5h4V4M4 4l.5 9.5h7L12 4M6.5 6.5v5M9.5 6.5v5"/></svg>);
    case 'sliders': return (<svg {...common}><path d="M2 4h6M11 4h3M2 8h2M7 8h7M2 12h9M14 12h0"/><circle cx="9.5" cy="4" r="1.5" fill={c}/><circle cx="5.5" cy="8" r="1.5" fill={c}/><circle cx="12.5" cy="12" r="1.5" fill={c}/></svg>);
    case 'commit': return (<svg {...common}><circle cx="8" cy="8" r="3"/><path d="M2 8h3M11 8h3"/></svg>);
    case 'worktree': return (<svg {...common}><rect x="2" y="2.5" width="5" height="5" rx="1"/><rect x="2" y="8.5" width="5" height="5" rx="1"/><rect x="9" y="5.5" width="5" height="5" rx="1"/><path d="M7 5h2M7 11h2"/></svg>);
    case 'terminal': return (<svg {...common}><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M4 6l2.5 2L4 10M8 10.5h4"/></svg>);
    case 'arrow-right': return (<svg {...common}><path d="M3 8h10M9 4l4 4-4 4"/></svg>);
    case 'play': return (<svg {...common}><path d="M4 3l9 5-9 5z" fill={c}/></svg>);
    case 'swap': return (<svg {...common}><path d="M2 5h10M9 2l3 3-3 3M14 11H4M7 14l-3-3 3-3"/></svg>);
    case 'folder-plus': return (<svg {...common}><path d="M1.5 4.5L3 3h3.5l1.5 1.5h6V13H1.5z"/><path d="M8 7v4M6 9h4"/></svg>);
    case 'drop': return (<svg {...common}><path d="M2 3h12v6.5M2 9.5V13h12M5.5 13v-2.5h5V13M4 7.5L8 4l4 3.5" strokeDasharray="2 1.5"/></svg>);
    case 'scan': return (<svg {...common}><path d="M2 5V3.5A1 1 0 013 2.5h2M14 5V3.5a1 1 0 00-1-1h-2M2 11v1.5a1 1 0 001 1h2M14 11v1.5a1 1 0 01-1 1h-2M4 8h8"/></svg>);
    case 'branch': return (<svg {...common}><circle cx="4" cy="3" r="1.6"/><circle cx="4" cy="13" r="1.6"/><circle cx="12" cy="6" r="1.6"/><path d="M4 4.6v6.8M4 8h4a4 4 0 004-4v0"/></svg>);
    case 'check-circle': return (<svg {...common}><circle cx="8" cy="8" r="6" fill={c} stroke="none"/><path d="M5 8l2.5 2.5L11 6.5" stroke="white"/></svg>);
    case 'x-circle': return (<svg {...common}><circle cx="8" cy="8" r="6" fill={c} stroke="none"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white"/></svg>);
    case 'dot-circle': return (<svg {...common}><circle cx="8" cy="8" r="6" fill={c} stroke="none"/><circle cx="8" cy="8" r="1.5" fill="white" stroke="none"/></svg>);
    case 'lock': return (<svg {...common}><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>);
    case 'key': return (<svg {...common}><circle cx="5" cy="11" r="2.5"/><path d="M6.8 9.2l5.7-5.7M10.5 5.5l2 2M12 4l1.5 1.5"/></svg>);
    case 'warning': return (<svg {...common}><path d="M8 2.5l6 11H2z"/><path d="M8 7v3M8 12v.5"/></svg>);
    case 'info': return (<svg {...common}><circle cx="8" cy="8" r="6"/><path d="M8 7.5v3.5M8 5.5v.5"/></svg>);
    case 'reload': return (<svg {...common}><path d="M3 8a5 5 0 019-3M13 8a5 5 0 01-9 3"/><path d="M11 2v3h-3M5 14v-3h3"/></svg>);
    case 'inbox-app': return (<svg {...common}><path d="M2 3.5h12L13 9.5H10l-1 2H7l-1-2H3z"/><path d="M2 9.5v3h12v-3"/></svg>);
    case 'pulls-app': return (<svg {...common}><circle cx="4" cy="4" r="1.6"/><circle cx="4" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><path d="M4 5.6V10.4M4 5.6c0 3 3 3 7 3v1.8"/></svg>);
    case 'local-app': return (<svg {...common}><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M4.5 7l1.5 1.5L4.5 10M8 10h3.5"/></svg>);
    case 'gear': return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.14 12.94a7.5 7.5 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.4 7.4 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.43h-3.84a.5.5 0 0 0-.5.43l-.36 2.54a7.4 7.4 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.65 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.5 7.5 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96a7.4 7.4 0 0 0 1.62.94l.36 2.54a.5.5 0 0 0 .5.43h3.84a.5.5 0 0 0 .5-.43l.36-2.54a7.4 7.4 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    );
    case 'user': return (<svg {...common}><circle cx="8" cy="5.5" r="2.5"/><path d="M2.5 14a5.5 5.5 0 0111 0"/></svg>);
    case 'at': return (<svg {...common}><circle cx="8" cy="8" r="2.5"/><path d="M10.5 8v1.5a1.5 1.5 0 003 0V8a5.5 5.5 0 10-2.2 4.4"/></svg>);
    case 'merged-pr': return (<svg {...common}><circle cx="4" cy="4" r="1.6" fill={c}/><circle cx="12" cy="12" r="1.6" fill={c}/><path d="M4 5.6V12M4 12c0-3 3-3 7-3V10.4"/></svg>);
    case 'mark-read': return (<svg {...common}><path d="M2.5 8l3 3 8-8"/><path d="M7.5 11l3 3 3-3"/></svg>);
    case 'circle': return (<svg {...common}><circle cx="8" cy="8" r="5"/></svg>);
    default: return null;
  }
}

// ── Status pills, badges, etc. ────────────────────────────────
function Pill({ children, color = T.text2, bg, weight = 500, mono = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '1px 6px', borderRadius: 4,
      background: bg || 'transparent',
      color, fontWeight: weight, fontSize: 11,
      fontFamily: mono ? MONO : FONT,
      letterSpacing: 0.1,
      lineHeight: '16px',
    }}>{children}</span>
  );
}

function Avatar({ name, size = 18, hue }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const h = hue ?? (name.charCodeAt(0) * 37) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `oklch(${T.avatarL} ${T.avatarC} ${h})`,
      color: `oklch(${T.avatarFgL} ${T.avatarC} ${h})`,
      fontSize: size * 0.42, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, letterSpacing: 0.2,
      border: `0.5px solid ${T.avatarBd}`,
    }}>{initials}</div>
  );
}

function CheckSummary({ pass = 0, fail = 0, pending = 0, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.text2 }}>
      {pass > 0 && (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="check-circle" size={size} color={T.pass}/>{pass}</span>)}
      {fail > 0 && (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="x-circle" size={size} color={T.fail}/>{fail}</span>)}
      {pending > 0 && (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Icon name="dot-circle" size={size} color={T.pending}/>{pending}</span>)}
    </span>
  );
}

function Button({ children, kind = 'default', icon, size = 'md', onClick, style }) {
  const map = {
    default:  { bg: T.surface,     bd: T.borderStrong, fg: T.text },
    primary:  { bg: '#0a84ff',     bd: '#0a84ff',      fg: '#fff' },
    success:  { bg: T.pass,        bd: T.pass,         fg: '#fff' },
    ghost:    { bg: 'transparent', bd: 'transparent',  fg: T.text },
    subtle:   { bg: T.sidebar2,    bd: 'transparent',  fg: T.text },
  }[kind];
  const sz = size === 'sm' ? { h: 22, px: 8, fs: 12 } : size === 'lg' ? { h: 32, px: 14, fs: 13 } : { h: 26, px: 10, fs: 12.5 };
  return (
    <button onClick={onClick} style={{
      height: sz.h, padding: `0 ${sz.px}px`, borderRadius: 6,
      background: map.bg, border: `0.5px solid ${map.bd}`, color: map.fg,
      fontFamily: FONT, fontSize: sz.fs, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 5,
      cursor: 'pointer', boxShadow: kind === 'primary' || kind === 'success' ? '0 1px 0 rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.18)' : 'none',
      ...style,
    }}>
      {icon && <Icon name={icon} size={sz.fs} />}
      {children}
    </button>
  );
}

// kbd shortcut pill
function Kbd({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 18, height: 18, padding: '0 4px', borderRadius: 4,
      background: T.codeBg, border: `0.5px solid ${T.border}`,
      color: T.text2, fontFamily: MONO, fontSize: 10.5, fontWeight: 500,
    }}>{children}</span>
  );
}

// ── Sidebar bits ──────────────────────────────────────────────
function SidebarSection({ title, children, action }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {title && (
        <div style={{
          padding: '10px 14px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.text3,
        }}>
          <span>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
function SidebarItem({ icon, label, count, selected, color = T.text2, depth = 0, badgeColor, kbd }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      height: 26, padding: `0 10px 0 ${10 + depth * 14}px`, margin: '0 6px',
      borderRadius: 5, color: selected ? T.text : T.text,
      background: selected ? 'rgba(10,132,255,0.13)' : 'transparent',
      fontSize: 13, fontWeight: selected ? 500 : 400,
      position: 'relative',
    }}>
      <Icon name={icon} size={14} color={selected ? T.link : color}/>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {kbd && <Kbd>{kbd}</Kbd>}
      {count !== undefined && (
        <span style={{
          fontSize: 11, color: badgeColor || (selected ? T.link : T.text3), fontWeight: 500,
          fontVariantNumeric: 'tabular-nums', minWidth: 16, textAlign: 'right',
        }}>{count}</span>
      )}
    </div>
  );
}

// ── App sidebar (persistent, app-shell level) ─────────────────
// Pure navigation. No filtering UI. Expanded ~220px, collapsed 52px.
// Sections: Reviews · (reserved Account slot) · Settings.
function AppSidebar({ active = 'inbox', collapsed = false, badges = {} }) {
  const W = collapsed ? 52 : 220;
  const items = [
    { id: 'inbox',  label: 'Inbox',         icon: 'inbox-app',     badge: badges.inbox ?? 32 },
    { id: 'pulls',  label: 'Pull requests', icon: 'pulls-app',     badge: badges.pulls },
    { id: 'local',  label: 'Local reviews', icon: 'local-app',     soon: true },
  ];
  return (
    <div style={{
      width: W, flex: 1, flexShrink: 0, background: T.sidebar,
      borderRight: `0.5px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', minHeight: 0,
      transition: 'width 180ms ease',
    }}>
      {/* Top: collapse handle */}
      <div style={{
        display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end',
        padding: collapsed ? '6px 0 2px' : '6px 8px 2px',
        flexShrink: 0,
      }}>
        <button title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          borderRadius: 5, cursor: 'pointer', color: T.text3,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={collapsed ? 'sidebar-expand' : 'sidebar-collapse'} size={14}/>
        </button>
      </div>

      {/* Reviews section */}
      <div style={{ paddingTop: 2 }}>
        <AppSidebarLabel collapsed={collapsed}>Reviews</AppSidebarLabel>
        {items.map(it => (
          <AppSidebarItem
            key={it.id}
            collapsed={collapsed}
            icon={it.icon}
            label={it.label}
            badge={it.badge}
            soon={it.soon}
            selected={it.id === active}
          />
        ))}
      </div>

      <div style={{ flex: 1 }}/>

      {/* Bottom group: Account (reserved) + Settings */}
      <div style={{ padding: '6px 0 10px', borderTop: `0.5px solid ${T.borderSoft}` }}>
        {/* Reserved Account slot — dotted placeholder, do not design. */}
        <div style={{ padding: collapsed ? '4px 8px 6px' : '6px 10px 4px' }}>
          {!collapsed ? (
            <div style={{
              border: `1px dashed ${T.borderStrong}`,
              borderRadius: 7, padding: '7px 10px',
              display: 'flex', alignItems: 'center', gap: 8,
              color: T.text3, fontSize: 11, lineHeight: 1.35,
              background: T.isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.012)',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `1px dashed ${T.borderStrong}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.text4, flexShrink: 0,
              }}>
                <Icon name="user" size={12} color={T.text4}/>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: T.text3, letterSpacing: 0.3, textTransform: 'uppercase' }}>Account</div>
                <div style={{ fontSize: 11, color: T.text4 }}>reserved · v2 login</div>
              </div>
            </div>
          ) : (
            <div title="Reserved · Account (v2 login)" style={{
              width: 36, height: 36, margin: '0 auto', borderRadius: '50%',
              border: `1px dashed ${T.borderStrong}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.text4,
            }}>
              <Icon name="user" size={13} color={T.text4}/>
            </div>
          )}
        </div>

        <AppSidebarItem
          collapsed={collapsed}
          icon="gear"
          label="Settings"
          selected={active === 'settings'}
        />
      </div>
    </div>
  );
}

function AppSidebarLabel({ children, collapsed }) {
  if (collapsed) return <div style={{ height: 10 }}/>;
  return (
    <div style={{
      padding: '8px 14px 4px', fontSize: 10.5, fontWeight: 600,
      letterSpacing: 0.5, textTransform: 'uppercase', color: T.text3,
    }}>{children}</div>
  );
}

function AppSidebarItem({ icon, label, badge, soon, selected, collapsed }) {
  if (collapsed) {
    return (
      <div title={label} style={{
        position: 'relative',
        width: 36, height: 36, margin: '2px auto', borderRadius: 8,
        background: selected ? 'rgba(10,132,255,0.13)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <Icon name={icon} size={17} color={selected ? T.link : T.text2}/>
        {badge != null && badge > 0 && (
          <span style={{
            position: 'absolute', top: 1, right: 1,
            minWidth: 14, height: 14, padding: '0 3px',
            borderRadius: 7, background: T.unread, color: '#fff',
            fontSize: 9.5, fontWeight: 700, lineHeight: '14px',
            textAlign: 'center', border: `1.5px solid ${T.sidebar}`,
            fontVariantNumeric: 'tabular-nums',
          }}>{badge}</span>
        )}
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      height: 30, padding: '0 10px', margin: '1px 8px',
      borderRadius: 6, color: T.text,
      background: selected ? 'rgba(10,132,255,0.13)' : 'transparent',
      fontSize: 13, fontWeight: selected ? 600 : 500,
      position: 'relative', cursor: 'pointer',
    }}>
      <Icon name={icon} size={15} color={selected ? T.link : T.text2}/>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {soon && (
        <span style={{
          fontSize: 10, padding: '0 6px', height: 15, lineHeight: '15px',
          borderRadius: 7, background: T.sidebar2, color: T.text3,
          fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>soon</span>
      )}
      {!soon && badge != null && badge > 0 && (
        <span style={{
          minWidth: 18, height: 16, padding: '0 5px', lineHeight: '16px',
          borderRadius: 8, background: selected ? T.link : T.unread,
          color: '#fff', fontSize: 10.5, fontWeight: 700,
          textAlign: 'center', fontVariantNumeric: 'tabular-nums',
        }}>{badge}</span>
      )}
    </div>
  );
}

Object.assign(window, {
  T, LIGHT, DARK, applyTheme, FONT, MONO, DISPLAY,
  PierWindow, Titlebar, TrafficLights, Icon, Pill, Avatar, CheckSummary, Button, Kbd,
  SidebarSection, SidebarItem,
  AppSidebar, AppSidebarItem, AppSidebarLabel,
});
