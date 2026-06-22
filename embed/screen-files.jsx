// PR detail — Files changed tab. The dominant review surface.
// PR header + tab strip + (NEW) sub-toolbar + file rail + diff (inline OR split)
// + (NEW) jump widget + (NEW) review dock at the bottom.

function FilesChangedScreen({ width = 1320, height = 900, view = {}, appSidebar, from = 'inbox' }) {
  const v = {
    rail: 'tree',         // 'tree' | 'list'
    diff: 'inline',       // 'inline' | 'split'
    dock: 'collapsed',    // 'collapsed' | 'modal'
    verdict: 'changes',   // 'approve' | 'comment' | 'changes'
    commitsOpen: false,
    commitsSelected: 14,
    searchActive: false,
    searchQuery: '',
    railCollapsed: false,
    ...view,
  };
  // Default to the new persistent app sidebar; callers can override.
  const shellSidebar = appSidebar ?? <AppSidebar active={from === 'pulls' ? 'pulls' : 'inbox'}/>;
  return (
    <PierWindow
      width={width} height={height}
      title="#9217" subtitle="perf(diff-render): virtualise hunks larger than 2k lines"
      appSidebar={shellSidebar}
      toolbar={<PRHeaderActions/>}
      status={<PRStatusBar/>}
      overlay={v.dock === 'modal' ? <ReviewModal verdict={v.verdict}/> : null}
    >
      <PRHeader from={from}/>
      <PRTabStrip active="changes"/>
      <FilesSubToolbar view={v}/>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        <FileRail mode={v.rail} collapsed={v.railCollapsed}/>
        <DiffPane mode={v.diff} search={v.searchActive ? v.searchQuery : null}/>
        <JumpWidget/>
      </div>
      <ReviewDock verdict={v.verdict}/>
    </PierWindow>
  );
}

function PRHeaderActions() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Button kind="ghost" size="sm" icon="external">Open on GitHub</Button>
      <Button kind="default" size="sm" icon="x">Request changes</Button>
      <Button kind="success" size="sm" icon="check">Approve · ⌘⏎</Button>
    </div>
  );
}

function PRHeader({ from = 'inbox' }) {
  const fromLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  return (
    <div style={{
      padding: '12px 18px 0', borderBottom: `0.5px solid ${T.border}`,
      background: T.surface, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <button title={`Back to ${fromLabel}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          height: 22, padding: '0 8px 0 4px', marginRight: 2,
          background: 'transparent', border: `0.5px solid ${T.border}`,
          borderRadius: 5, color: T.text2, fontSize: 12, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          <Icon name="chevron-left" size={13} color={T.text2}/>
          {fromLabel}
        </button>
        <Pill bg={T.successBg} color={T.open} weight={600}>
          <Icon name="pr-open" size={11} color={T.open}/> Open
        </Pill>
        <span style={{ fontSize: 13, color: T.text2 }}>
          <b style={{ color: T.text }}>nicolae-i</b> wants to merge <b style={{ color: T.text }}>14 commits</b> into
          <span style={{ fontFamily: MONO, fontSize: 11.5, padding: '1px 5px', background: T.codeBg, borderRadius: 3, margin: '0 4px' }}>main</span>
          from
          <span style={{ fontFamily: MONO, fontSize: 11.5, padding: '1px 5px', background: T.codeBg, borderRadius: 3, margin: '0 4px' }}>perf/virtualise-hunks</span>
        </span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12, color: T.text3 }}>
          Opened <span style={{ color: T.text2 }}>1d 4h ago</span> · synced 12s ago
        </span>
      </div>
      {/* Sub-metadata: checks summary + reviewers + diff stat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '6px 0 10px' }}>
        <MetaItem label="Author">
          <Avatar name="nicolae-i" size={16}/> <span style={{ marginLeft: 4 }}>nicolae-i</span>
        </MetaItem>
        <MetaDivider/>
        <MetaItem label="Reviewers">
          <ReviewerChip name="alex-cho" state="pending"/>
          <ReviewerChip name="priya-r" state="approved"/>
          <ReviewerChip name="marcus-w" state="changes"/>
        </MetaItem>
        <MetaDivider/>
        <MetaItem label="Checks">
          <Icon name="x-circle" size={13} color={T.fail}/>
          <span><b style={{ color: T.fail }}>2</b> failing</span>
          <span style={{ color: T.text4, margin: '0 2px' }}>·</span>
          <Icon name="check-circle" size={13} color={T.pass}/>
          <span>16 passed</span>
        </MetaItem>
        <MetaDivider/>
        <MetaItem label="Diff" mono>
          <span style={{ color: T.addLine }}>+904</span>
          <span style={{ color: T.delLine }}>−311</span>
          <span style={{ color: T.text2 }}>· 7 files</span>
        </MetaItem>
      </div>
    </div>
  );
}
function MetaItem({ label, children, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.text, fontFamily: mono ? MONO : FONT }}>
      <span style={{ fontSize: 11, color: T.text3, fontFamily: FONT, marginRight: 2 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{children}</span>
    </div>
  );
}
function MetaDivider() { return <div style={{ width: 1, height: 14, background: T.border }}/>; }
function ReviewerChip({ name, state }) {
  const dot = { approved: T.pass, changes: T.fail, pending: T.warn, commented: T.text3 }[state];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, position: 'relative' }}>
      <Avatar name={name} size={16}/>
      <span style={{
        position: 'absolute', right: -2, bottom: -2, width: 8, height: 8, borderRadius: '50%',
        background: dot, border: `1.5px solid ${T.windowBg}`,
      }}/>
    </span>
  );
}
function Label({ color, text }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '1px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500,
      background: `color-mix(in oklch, ${color} 18%, white)`,
      border: `0.5px solid color-mix(in oklch, ${color} 35%, white)`,
      color: `color-mix(in oklch, ${color} 60%, black)`,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }}/>
      {text}
    </span>
  );
}

function PRTabStrip({ active }) {
  const tabs = [
    { id: 'desc',    label: 'Description', count: 4,   icon: 'comment' },
    { id: 'commits', label: 'Commits',     count: 6,   icon: 'branch' },
    { id: 'checks',  label: 'Checks',      count: 0,   icon: 'check-circle' },
    { id: 'changes', label: 'Changes',     count: 569, icon: 'file' },
  ];
  return (
    <div style={{
      flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0,
      padding: '0 16px', borderBottom: `0.5px solid ${T.border}`,
      background: T.surface,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '0 12px', height: 36,
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${isActive ? T.link : 'transparent'}`,
            color: isActive ? T.text : T.text2,
            fontWeight: isActive ? 600 : 500, fontSize: 13,
            fontFamily: FONT, cursor: 'pointer',
            marginBottom: -0.5,
          }}>
            <Icon name={t.icon} size={13} color={isActive ? T.link : T.text3}/>
            {t.label}
            <span style={{
              fontSize: 11, padding: '0 5px', height: 16, lineHeight: '16px',
              borderRadius: 8, background: isActive ? T.selectionBg : T.sidebar2,
              color: isActive ? T.link : T.text2, fontVariantNumeric: 'tabular-nums', fontWeight: 600,
            }}>{t.count}</span>
            {t.failing && (
              <span style={{
                fontSize: 11, padding: '0 5px', height: 16, lineHeight: '16px',
                borderRadius: 8, background: T.failTint, color: T.fail, fontWeight: 600,
              }}>{t.failing} failing</span>
            )}
          </button>
        );
      })}
      <div style={{ flex: 1 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.text3, fontSize: 12 }}>
        <Kbd>J</Kbd><span>/</span><Kbd>K</Kbd>
        <span style={{ marginLeft: 2 }}>next file</span>
      </div>
    </div>
  );
}

function PRStatusBar() {
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
        Live polling · 8s
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Icon name="comment" size={11}/> 2 pending in draft review
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Base · <span style={{ fontFamily: MONO, fontSize: 11 }}>main@a3f7b21</span></span>
      <span style={{ flex: 1 }}/>
      <span>Hunk 14 of 38 · ⌥↓ next hunk</span>
    </>
  );
}

// ── File rail ─────────────────────────────────────────────────
// Each file has a `path` so the list mode can flatten with full paths.
const FILES = [
  { kind: 'folder', name: 'src',         path: 'src',          depth: 0, open: true,  viewed: 'partial' },
  { kind: 'folder', name: 'diff',        path: 'src/diff',     depth: 1, open: true,  viewed: 'partial' },
  { kind: 'file',   name: 'VirtualHunk.tsx',   path: 'src/diff/VirtualHunk.tsx',   depth: 2, add: 312, del: 4,  viewed: false, comments: 8, unread: 3, current: true },
  { kind: 'file',   name: 'HunkWindow.ts',     path: 'src/diff/HunkWindow.ts',     depth: 2, add: 184, del: 22, viewed: false, comments: 4, unread: 0 },
  { kind: 'file',   name: 'measureHunk.ts',    path: 'src/diff/measureHunk.ts',    depth: 2, add: 96,  del: 8,  viewed: true,  comments: 1, unread: 0 },
  { kind: 'file',   name: 'index.ts',          path: 'src/diff/index.ts',          depth: 2, add: 4,   del: 2,  viewed: true,  comments: 0, unread: 0 },
  { kind: 'folder', name: 'editor',       path: 'src/editor',   depth: 1, open: true,  viewed: 'full' },
  { kind: 'file',   name: 'CodeMirrorHost.tsx',path: 'src/editor/CodeMirrorHost.tsx', depth: 2, add: 28, del: 41, viewed: true,  comments: 2, unread: 0 },
  { kind: 'file',   name: 'bridge.ts',         path: 'src/editor/bridge.ts',          depth: 2, add: 6,  del: 0,  viewed: true,  comments: 0, unread: 0 },
  { kind: 'folder', name: '__tests__',    path: '__tests__',    depth: 0, open: true,  viewed: 'none' },
  { kind: 'file',   name: 'VirtualHunk.test.tsx', path: '__tests__/VirtualHunk.test.tsx', depth: 1, add: 274, del: 234, viewed: false, comments: 9, unread: 2 },
];

function FileRail({ mode = 'tree', collapsed = false }) {
  const filesOnly = FILES.filter(f => f.kind === 'file');
  if (collapsed) {
    return (
      <div style={{
        width: 36, flexShrink: 0, background: T.panel,
        borderRight: `0.5px solid ${T.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '8px 0', gap: 10,
      }}>
        <button title="Show files · ⌘B" style={{
          width: 22, height: 22, border: 'none', background: 'transparent',
          borderRadius: 4, cursor: 'pointer', color: T.text2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="sidebar-expand" size={13}/>
        </button>
        <div style={{ width: 1, height: 1, background: T.border, opacity: 0.6 }}/>
        {/* vertical "Files · 7" label */}
        <div style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontSize: 10.5, color: T.text3, letterSpacing: 0.3,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 0',
        }}>
          <Icon name="file" size={11} color={T.text3}/>
          <span>7 files · 3 viewed</span>
        </div>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 10, color: T.unread, fontWeight: 600 }}>5</span>
      </div>
    );
  }
  return (
    <div style={{
      width: 280, flexShrink: 0, background: T.panel,
      borderRight: `0.5px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', minHeight: 0,
    }}>
      <div style={{
        padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
        borderBottom: `0.5px solid ${T.border}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0,
          height: 22, padding: '0 8px', borderRadius: 5,
          background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        }}>
          <Icon name="search" size={11} color={T.text3}/>
          <span style={{ fontSize: 11.5, color: T.text3 }}>Filter files</span>
        </div>
        <div style={{
          display: 'inline-flex', padding: 2, gap: 2, borderRadius: 5,
          background: T.sidebar2, flexShrink: 0,
        }}>
          {[
            { id: 'tree', icon: 'tree', title: 'Tree · ⌘1' },
            { id: 'list', icon: 'list', title: 'List · ⌘2' },
          ].map(o => {
            const active = o.id === mode;
            return (
              <button key={o.id} title={o.title} style={{
                width: 22, height: 18, border: 'none', borderRadius: 3,
                background: active ? T.surface : 'transparent',
                boxShadow: active ? (T.isDark ? '0 1px 1.5px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)' : '0 1px 1.5px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)') : 'none',
                color: active ? T.text : T.text3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Icon name={o.icon} size={11}/>
              </button>
            );
          })}
        </div>
        <button title="Hide files · ⌘B" style={{
          width: 22, height: 22, border: 'none', background: 'transparent',
          borderRadius: 4, cursor: 'pointer', color: T.text2, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevron-left" size={12}/>
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {mode === 'tree'
          ? FILES.map((f, i) => <FileRowTree key={i} f={f}/>)
          : filesOnly.map((f, i) => <FileRowList key={i} f={f}/>)
        }
      </div>

      <div style={{
        padding: '8px 12px', borderTop: `0.5px solid ${T.border}`,
        fontSize: 11, color: T.text2, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>7 files · 3 folders</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="eye" size={11}/> 3 viewed
          <span style={{ color: T.text4 }}>·</span>
          <span style={{ color: T.unread }}>5 unread</span>
        </span>
      </div>
    </div>
  );
}

function FileRowTree({ f }) {
  const isFolder = f.kind === 'folder';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      height: 24, padding: `0 8px 0 ${8 + f.depth * 14}px`,
      background: f.current ? 'rgba(10,132,255,0.13)' : 'transparent',
      borderLeft: f.current ? `2px solid ${T.link}` : '2px solid transparent',
      fontSize: 12, color: T.text, fontWeight: f.current ? 600 : (f.viewed === true ? 400 : 500),
      opacity: f.viewed === true ? 0.55 : 1,
    }}>
      {isFolder ? (
        <Icon name="chevron-down" size={10} color={T.text2}/>
      ) : (
        <span style={{ width: 10, flexShrink: 0 }}/>
      )}
      {isFolder
        ? <Icon name="folder-open" size={13} color={T.text2}/>
        : <FileGlyph name={f.name}/>
      }
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
      {!isFolder && f.unread > 0 && <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.unread, flexShrink: 0 }}/>}
      {!isFolder && (
        <Icon name={f.viewed ? 'eye' : 'eye-off'} size={12} color={f.viewed ? T.text3 : T.text4}/>
      )}
      {!isFolder && (
        <span style={{
          fontFamily: MONO, fontSize: 10.5, fontWeight: 600,
          color: T.text2, width: 10, textAlign: 'center', flexShrink: 0,
        }}>M</span>
      )}
      {isFolder && f.viewed !== 'none' && (
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: f.viewed === 'full' ? T.pass : T.text4, flexShrink: 0,
        }}/>
      )}
    </div>
  );
}

// Small JS-style file glyph — matches @pierre/tree language icon convention.
function FileGlyph({ name }) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  const styleByExt = {
    tsx: { bg: 'oklch(0.55 0.13 230)', fg: '#fff',     label: 'TS' },
    ts:  { bg: 'oklch(0.55 0.13 230)', fg: '#fff',     label: 'TS' },
    jsx: { bg: 'oklch(0.78 0.15 95)',  fg: '#1a1a1a',  label: 'JS' },
    js:  { bg: 'oklch(0.78 0.15 95)',  fg: '#1a1a1a',  label: 'JS' },
    md:  { bg: 'oklch(0.45 0.02 250)', fg: '#fff',     label: 'MD' },
  };
  const s = styleByExt[ext] || { bg: T.sidebar2, fg: T.text2, label: ext.slice(0,2).toUpperCase() || '··' };
  return (
    <span style={{
      width: 14, height: 12, borderRadius: 2, flexShrink: 0,
      background: s.bg, color: s.fg,
      fontFamily: MONO, fontSize: 8, fontWeight: 700, letterSpacing: 0.2,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>{s.label}</span>
  );
}

function FileRowList({ f }) {
  const parts = f.path.split('/');
  const file = parts.pop();
  const dir = parts.join('/');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      height: 28, padding: '0 12px',
      background: f.current ? 'rgba(10,132,255,0.13)' : 'transparent',
      borderLeft: f.current ? `2px solid ${T.link}` : '2px solid transparent',
      fontSize: 12, color: T.text,
      opacity: f.viewed === true ? 0.6 : 1,
    }}>
      <FileGlyph name={file}/>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{ fontWeight: f.current ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file}</div>
        <div style={{ fontSize: 10.5, color: T.text3, fontFamily: MONO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dir || './'}</div>
      </div>
      {f.unread > 0 && <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.unread }}/>}
      <Icon name={f.viewed ? 'eye' : 'eye-off'} size={12} color={f.viewed ? T.text3 : T.text4}/>
      <span style={{
        fontFamily: MONO, fontSize: 10.5, fontWeight: 600,
        color: T.text2, width: 10, textAlign: 'center', flexShrink: 0,
      }}>M</span>
    </div>
  );
}

// ── Diff pane ─────────────────────────────────────────────────
function DiffPane({ mode = 'inline', search = null, noComments = false }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.surface, minWidth: 0 }}>
      <FileDiffHeader name="src/diff/VirtualHunk.tsx" add={312} del={4} viewed={false}/>
      {mode === 'split' ? <SplitDiffBody search={search} noComments={noComments}/> : <DiffBody search={search} noComments={noComments}/>}
      <FileDiffHeader name="src/diff/HunkWindow.ts" add={184} del={22} viewed={false} collapsed/>
    </div>
  );
}

function FileDiffHeader({ name, add, del, viewed, collapsed }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 2,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 16px', background: T.surface2,
      borderBottom: `0.5px solid ${T.border}`, borderTop: collapsed ? `0.5px solid ${T.border}` : 'none',
    }}>
      <Icon name={collapsed ? 'chevron-right' : 'chevron-down'} size={11} color={T.text2}/>
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: T.text }}>{name}</span>
      <span style={{ fontFamily: MONO, fontSize: 11, display: 'flex', gap: 5, color: T.text3 }}>
        <span style={{ color: T.addLine }}>+{add}</span>
        <span style={{ color: T.delLine }}>−{del}</span>
      </span>
      <div style={{ flex: 1 }}/>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: T.text2,
        padding: '2px 8px', borderRadius: 4, border: `0.5px solid ${T.borderStrong}`, background: T.surface,
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: 3,
          background: viewed ? T.text2 : T.surface,
          border: `0.5px solid ${viewed ? T.text2 : T.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{viewed && <Icon name="check" size={8} color="#fff"/>}</div>
        Mark viewed
      </span>
      <button style={{
        width: 24, height: 22, border: `0.5px solid ${T.borderStrong}`, background: T.surface,
        borderRadius: 4, color: T.text2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name="kebab" size={12}/></button>
    </div>
  );
}

function DiffBody({ search, noComments }) {
  // A compact set of diff lines mixing add/del/context/hunk header,
  // with several mod pairs that demo word-level highlighting,
  // a single-line thread anchor, and a multi-line range thread.
  const lines = [
    { l: '12', r: '12', kind: 'ctx',  code: 'import { measureHunk } from "./measureHunk";' },
    { l: '13', r: null, kind: 'del',  code: 'import { lineHeightFor } from "../editor";',                hi: [{ s: 31, e: 40 }] },
    { l: null, r: '13', kind: 'add',  code: 'import { lineHeightFor } from "../editor/metrics";',         hi: [{ s: 31, e: 48 }] },
    { l: '14', r: '14', kind: 'ctx',  code: '' },
    { l: '15', r: null, kind: 'del',  code: 'const VIRTUALISE_THRESHOLD = 500;',                          hi: [{ s: 29, e: 32 }] },
    { l: null, r: '15', kind: 'add',  code: 'const VIRTUALISE_THRESHOLD = 2_000;',                        hi: [{ s: 29, e: 34 }] },
    { l: '16', r: '16', kind: 'ctx',  code: '' },
    { l: '17', r: '17', kind: 'ctx',  code: 'export function VirtualHunk(props: HunkProps) {' },
    { l: '18', r: '18', kind: 'ctx',  code: '  const { hunk, baseRev, headRev } = props;' },
    { l: '19', r: null, kind: 'del',  code: '  const lineHeight = props.font.size;',                      hi: [{ s: 21, e: 36 }] },
    { l: null, r: '19', kind: 'add',  code: '  const lineHeight = lineHeightFor(props.font);',            hi: [{ s: 21, e: 47 }] },
    { l: null, r: '20', kind: 'add',  code: '  const totalH = hunk.lines.length * lineHeight;', anchor: true },
    { l: null, r: '21', kind: 'add',  code: '' },
    { l: null, r: '22', kind: 'add',  code: '  // Below the threshold, just render the whole hunk synchronously.' },
    { l: '20', r: '23', kind: 'ctx',  code: '  if (hunk.lines.length < VIRTUALISE_THRESHOLD) {' },
    { l: '21', r: '24', kind: 'ctx',  code: '    return <NaiveHunk hunk={hunk} />;' },
    { l: '22', r: '25', kind: 'ctx',  code: '  }' },
    { l: '23', r: null, kind: 'del',  code: '  // TODO(nicolae): virtualise for hunks over 500 lines.' },
    { l: '24', r: null, kind: 'del',  code: '  return null;' },
    { l: null, r: '26', kind: 'add',  code: '' },
    { l: '25', r: null, kind: 'del',  code: '  const [win, setWin] = useState(measureHunk(hunk));',         hi: [{ s: 9, e: 12 }, { s: 14, e: 20 }, { s: 33, e: 46 }] },
    { l: null, r: '27', kind: 'add',  code: '  const [window, setWindow] = useState(() => measureHunk(hunk, 0));', hi: [{ s: 9, e: 15 }, { s: 17, e: 26 }, { s: 38, e: 40 }, { s: 56, e: 66 }] },
    { l: null, r: '28', kind: 'add',  code: '  const containerRef = useRef<HTMLDivElement>(null);' },
    { l: 'hunk', kind: 'hunk', count: 56, text: '@@ -84,12 +89,38 @@ function NaiveHunk({ hunk })' },
    { l: '84', r: '89', kind: 'ctx',  code: '  return (' },
    { l: '85', r: '90', kind: 'ctx',  code: '    <div className="hunk" data-hunk={hunk.id}>' },
    { l: null, r: '91', kind: 'add',  code: '      {hunk.lines.map((line, i) => (', range: 'start', rangeId: 'r1' },
    { l: null, r: '92', kind: 'add',  code: '        <DiffLine key={i} line={line} side={line.side} />',     range: 'mid',   rangeId: 'r1' },
    { l: null, r: '93', kind: 'add',  code: '      ))}',                                                    range: 'end',   rangeId: 'r1' },
    { l: '86', r: '94', kind: 'ctx',  code: '    </div>' },
    { l: '87', r: '95', kind: 'ctx',  code: '  );' },
  ];
  return (
    <div style={{
      fontFamily: MONO, fontSize: 12, lineHeight: '18px',
      borderBottom: `0.5px solid ${T.border}`,
    }}>
      {lines.map((ln, i) => <DiffLine key={i} ln={ln} search={search} noComments={noComments} hit={search && ln.code && ln.code.toLowerCase().includes(search.toLowerCase())} current={search && ln.code === '  const [window, setWindow] = useState(() => measureHunk(hunk, 0));'}/>)}
    </div>
  );
}

// Same data, rendered side-by-side. Old on the left, new on the right.
// Pairs adds/dels in order; context lines render in both columns.
function SplitDiffBody({ search, noComments }) {
  const rows = [
    { l: '12', code: 'import { measureHunk } from "./measureHunk";',          r: '12', rcode: 'import { measureHunk } from "./measureHunk";' },
    { l: '13', code: 'import { lineHeightFor } from "../editor/metrics";',     r: '13', rcode: 'import { lineHeightFor } from "../editor/metrics";' },
    { l: '14', code: '',                                                       r: '14', rcode: '' },
    { l: '15', code: 'const VIRTUALISE_THRESHOLD = 500;',  kind: 'mod',          r: '15', rcode: 'const VIRTUALISE_THRESHOLD = 2_000;' },
    { l: '16', code: '',                                                       r: '16', rcode: '' },
    { l: '17', code: 'export function VirtualHunk(props: HunkProps) {',         r: '17', rcode: 'export function VirtualHunk(props: HunkProps) {' },
    { l: '18', code: '  const { hunk, baseRev, headRev } = props;',             r: '18', rcode: '  const { hunk, baseRev, headRev } = props;' },
    { l: null,                                                                  r: '19', rcode: '  const lineHeight = lineHeightFor(props.font);', kind: 'add' },
    { l: null,                                                                  r: '20', rcode: '  const totalH = hunk.lines.length * lineHeight;', kind: 'add', anchor: true },
    { l: null,                                                                  r: '21', rcode: '', kind: 'add' },
    { l: null,                                                                  r: '22', rcode: '  // Below the threshold, just render the whole hunk synchronously.', kind: 'add' },
    { l: '19', code: '  if (hunk.lines.length < VIRTUALISE_THRESHOLD) {',         r: '23', rcode: '  if (hunk.lines.length < VIRTUALISE_THRESHOLD) {' },
    { l: '20', code: '    return <NaiveHunk hunk={hunk} />;',                    r: '24', rcode: '    return <NaiveHunk hunk={hunk} />;' },
    { l: '21', code: '  }',                                                     r: '25', rcode: '  }' },
    { l: '22', code: '  // TODO(nicolae): virtualise for hunks over 500 lines.', kind: 'del', r: null },
    { l: '23', code: '  return null;',                                          kind: 'del', r: null },
    { l: null,                                                                  r: '26', rcode: '', kind: 'add' },
    { l: null,                                                                  r: '27', rcode: '  const [window, setWindow] = useState(() => measureHunk(hunk, 0));', kind: 'add' },
    { l: null,                                                                  r: '28', rcode: '  const containerRef = useRef<HTMLDivElement>(null);', kind: 'add' },
    { hunk: true, count: 56, text: '@@ -84,12 +89,38 @@ function NaiveHunk({ hunk })' },
    { l: '84', code: '  return (',                                              r: '89', rcode: '  return (' },
    { l: '85', code: '    <div className="hunk" data-hunk={hunk.id}>',           r: '90', rcode: '    <div className="hunk" data-hunk={hunk.id}>' },
    { l: null,                                                                  r: '91', rcode: '      {hunk.lines.map((line, i) => (', kind: 'add', anchor2: true },
    { l: null,                                                                  r: '92', rcode: '        <DiffLine key={i} line={line} side={line.side} />', kind: 'add' },
    { l: null,                                                                  r: '93', rcode: '      ))}', kind: 'add' },
    { l: '86', code: '    </div>',                                              r: '94', rcode: '    </div>' },
    { l: '87', code: '  );',                                                    r: '95', rcode: '  );' },
  ];
  return (
    <div style={{
      fontFamily: MONO, fontSize: 12, lineHeight: '18px',
      borderBottom: `0.5px solid ${T.border}`,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {rows.map((row, i) => <SplitRow key={i} row={row} search={search} noComments={noComments}/>)}
    </div>
  );
}

function DiffLine({ ln, search, hit, current, noComments }) {
  if (ln.kind === 'hunk') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '4px 12px 4px 18px', fontSize: 11.5,
        color: T.text2, fontFamily: FONT,
        borderTop: `0.5px solid ${T.borderSoft}`, borderBottom: `0.5px solid ${T.borderSoft}`,
        background: T.isDark
          ? 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 6px, transparent 6px 12px)'
          : 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 6px, transparent 6px 12px)',
        cursor: 'pointer',
      }}>
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, color: T.text3 }}>
          <Icon name="chevron-up" size={9}/>
          <Icon name="chevron-down" size={9}/>
        </span>
        <span>{ln.count ?? 17} unmodified lines</span>
      </div>
    );
  }
  const inRange = !!ln.range;
  const bg = current
      ? (T.isDark ? 'rgba(255,221,87,0.18)' : '#fff8c5')
      : hit
        ? (T.isDark ? 'rgba(255,221,87,0.10)' : '#fffbe6')
        : ln.kind === 'add' ? T.addBg : ln.kind === 'del' ? T.delBg : T.surface;
  const gutterBg = ln.kind === 'add' ? T.addGutter : ln.kind === 'del' ? T.delGutter : T.ctxGutter;
  const marker = ln.kind === 'add' ? '+' : ln.kind === 'del' ? '−' : ' ';
  const markerColor = ln.kind === 'add' ? T.addLine : ln.kind === 'del' ? T.delLine : T.text3;
  const tokens = highlight(ln.code || '', search, current, ln.hi, ln.kind);
  return (
    <>
      <div style={{ display: 'flex', background: bg, position: 'relative' }}>
        <span style={{
          flexShrink: 0, width: 42, textAlign: 'right', padding: '0 6px 0 0',
          color: T.text3, background: gutterBg, borderRight: `0.5px solid ${T.borderSoft}`,
          fontVariantNumeric: 'tabular-nums',
        }}>{ln.l ?? ''}</span>
        <span style={{
          flexShrink: 0, width: 42, textAlign: 'right', padding: '0 6px 0 0',
          color: T.text3, background: gutterBg, borderRight: `0.5px solid ${T.borderSoft}`,
          fontVariantNumeric: 'tabular-nums',
        }}>{ln.r ?? ''}</span>
        <span style={{
          flexShrink: 0, width: 18, textAlign: 'center',
          color: inRange ? '#fff' : markerColor,
          background: inRange ? T.link : 'transparent',
          fontWeight: inRange ? 700 : 400,
        }}>{inRange ? '·' : marker}</span>
        <span style={{ flex: 1, paddingRight: 12, color: T.text, whiteSpace: 'pre' }}>{tokens}</span>
        {ln.range === 'start' && !noComments && (
          <span style={{
            position: 'absolute', right: 8, top: 0,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 18, padding: '0 6px', borderRadius: 9,
            background: T.unreadBg, border: `0.5px solid ${T.link}`,
            color: T.link, fontFamily: FONT, fontSize: 10, fontWeight: 600,
            letterSpacing: 0.2,
          }}>
            <Icon name="comment-fill" size={9} color={T.link}/>
            RANGE · LINES 91–93
          </span>
        )}
      </div>
      {ln.anchor && !noComments && <InlineThread/>}
      {ln.range === 'end' && !noComments && <MultiLineThread/>}
    </>
  );
}

function highlight(code, search, currentMatch, hi, kind) {
  if (!code) return code;
  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const parts = [];
    let last = 0; let m; let idx = 0;
    while ((m = re.exec(code))) {
      if (m.index > last) parts.push({ t: code.slice(last, m.index) });
      parts.push({ t: m[0], hit: true, current: currentMatch && idx === 0 });
      last = m.index + m[0].length; idx++;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    if (last < code.length) parts.push({ t: code.slice(last) });
    return parts.map((p, i) => p.hit ? (
      <span key={i} style={{
        background: p.current ? (T.isDark ? 'rgba(255,221,87,0.42)' : '#ffe066')
                              : (T.isDark ? 'rgba(255,221,87,0.22)' : 'rgba(255,221,87,0.55)'),
        outline: p.current ? `1px solid ${T.isDark ? '#c79a00' : '#b48700'}` : 'none',
        borderRadius: 2, color: T.text, fontWeight: 600,
      }}>{p.t}</span>
    ) : <span key={i}>{p.t}</span>);
  }
  if (hi && hi.length) {
    const tintHi = kind === 'add' ? T.addBgHi : T.delBgHi;
    const outlineHi = kind === 'add' ? T.addLine : T.delLine;
    const sorted = [...hi].sort((a, b) => a.s - b.s);
    const segs = [];
    let cursor = 0;
    for (const { s, e } of sorted) {
      if (s > cursor) segs.push({ t: code.slice(cursor, s), hi: false });
      segs.push({ t: code.slice(s, e), hi: true });
      cursor = e;
    }
    if (cursor < code.length) segs.push({ t: code.slice(cursor), hi: false });
    return segs.map((s, i) => (
      <span key={i} style={{
        background: s.hi ? tintHi : 'transparent',
        boxShadow: s.hi ? `inset 0 0 0 0.5px ${outlineHi}` : 'none',
        borderRadius: s.hi ? 2 : 0,
        fontWeight: s.hi ? 600 : 400,
      }}>{syntaxColor(s.t)}</span>
    ));
  }
  return syntaxColor(code);
}

function syntaxColor(code) {
  if (!code) return code;
  const parts = code.split(/(\b(?:const|let|return|if|export|function|import|from|useState|useRef|useMemo|new|TODO)\b|"[^"]*"|\/\/[^\n]*|[{}()<>=]|\d+_?\d*)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (/^\/\//.test(p))     return <span key={i} style={{ color: T.synComment, fontStyle: 'italic' }}>{p}</span>;
    if (/^"/.test(p))         return <span key={i} style={{ color: T.synStr }}>{p}</span>;
    if (/^(const|let|return|if|export|function|import|from|new)$/.test(p)) return <span key={i} style={{ color: T.synKw }}>{p}</span>;
    if (/^(useState|useRef|useMemo)$/.test(p)) return <span key={i} style={{ color: T.synFn }}>{p}</span>;
    if (/^TODO$/.test(p))     return <span key={i} style={{ color: T.synTodo, fontWeight: 600 }}>{p}</span>;
    if (/^\d/.test(p))        return <span key={i} style={{ color: T.synNum }}>{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

function MultiLineThread() {
  return (
    <div style={{
      background: T.threadBg, borderTop: `0.5px solid ${T.threadBd}`, borderBottom: `0.5px solid ${T.threadBd}`,
      borderLeft: `3px solid ${T.link}`, margin: '0 0 0 102px',
      fontFamily: FONT, fontSize: 13,
    }}>
      <div style={{
        padding: '6px 12px', background: T.unreadBg,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11.5, color: T.text,
        borderBottom: `0.5px solid ${T.threadBd}`,
      }}>
        <Icon name="comment-fill" size={11} color={T.link}/>
        <span style={{ fontWeight: 600 }}>Range comment</span>
        <span style={{ color: T.text2 }}>· lines <b style={{ color: T.text, fontFamily: MONO }}>91–93</b></span>
        <span style={{ color: T.text4 }}>·</span>
        <span style={{ color: T.text2 }}>3 added lines</span>
        <div style={{ flex: 1 }}/>
        <button style={{ background: 'transparent', border: 'none', color: T.link, fontSize: 11.5, cursor: 'pointer' }}>Show context</button>
      </div>
      <ThreadComment
        author="alex-cho" you ago="just now"
        body={<>This whole map should be wrapped in <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>useMemo</code> — re-creating <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>DiffLine</code> instances on every render trashes the keyed list during scroll. The point of virtualisation is that <i>this</i> path stays cheap.</>}
      />
      <ThreadComment
        author="nicolae-i" ago="12s" border
        body={<>Fair. I'll memoise on <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>hunk.id + side</code>. Worth keeping it inline for the small-hunk path, or should we always memoise?</>}
      />
      <div style={{
        padding: '8px 12px', borderTop: `0.5px solid ${T.threadBd}`,
        background: T.composeBg, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Avatar name="alex-cho" size={20}/>
        <div style={{ flex: 1, color: T.text3, fontSize: 12.5 }}>Reply, or <Kbd>R</Kbd> to start your draft…</div>
        <Button kind="ghost" size="sm">Resolve</Button>
        <Button kind="primary" size="sm">Reply</Button>
      </div>
    </div>
  );
}

// Split-view diff row — two columns side by side, sharing kind metadata.
function SplitRow({ row, search, noComments }) {
  if (row.hunk) {
    return (
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '4px 12px 4px 18px', fontSize: 11.5,
        color: T.text2, fontFamily: FONT,
        borderTop: `0.5px solid ${T.borderSoft}`, borderBottom: `0.5px solid ${T.borderSoft}`,
        background: T.isDark
          ? 'repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 6px, transparent 6px 12px)'
          : 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 6px, transparent 6px 12px)',
        cursor: 'pointer',
      }}>
        <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, color: T.text3 }}>
          <Icon name="chevron-up" size={9}/>
          <Icon name="chevron-down" size={9}/>
        </span>
        <span>{row.count ?? 17} unmodified lines</span>
      </div>
    );
  }
  const leftKind  = row.kind === 'mod' ? 'del' : row.kind === 'del' ? 'del' : row.kind === 'add' ? null : 'ctx';
  const rightKind = row.kind === 'mod' ? 'add' : row.kind === 'add' ? 'add' : row.kind === 'del' ? null : 'ctx';
  return (
    <>
      <SplitHalf side="L" lineNum={row.l} code={row.code} kind={leftKind} search={search}/>
      <SplitHalf side="R" lineNum={row.r} code={row.rcode} kind={rightKind} search={search} anchor={!noComments && (row.anchor || row.anchor2)} anchorKind={row.anchor ? 'open' : row.anchor2 ? 'resolved' : null}/>
    </>
  );
}

function SplitHalf({ side, lineNum, code, kind, search, anchor, anchorKind }) {
  if (kind === null) {
    return (
      <div style={{
        background: side === 'L' ? T.surface2 : T.surface2,
        borderRight: side === 'L' ? `0.5px solid ${T.border}` : 'none',
        opacity: 0.5,
      }}/>
    );
  }
  const bg = kind === 'add' ? T.addBg : kind === 'del' ? T.delBg : T.surface;
  const gutter = kind === 'add' ? T.addGutter : kind === 'del' ? T.delGutter : T.ctxGutter;
  const marker = kind === 'add' ? '+' : kind === 'del' ? '−' : ' ';
  const markerColor = kind === 'add' ? T.addLine : kind === 'del' ? T.delLine : T.text3;
  const hit = search && code && code.toLowerCase().includes(search.toLowerCase());
  return (
    <div style={{
      display: 'flex', background: hit ? (T.isDark ? 'rgba(255,221,87,0.10)' : '#fffbe6') : bg,
      borderRight: side === 'L' ? `0.5px solid ${T.border}` : 'none',
      position: 'relative',
    }}>
      <span style={{
        flexShrink: 0, width: 42, textAlign: 'right', padding: '0 6px 0 0',
        color: T.text3, background: gutter, borderRight: `0.5px solid ${T.borderSoft}`,
        fontVariantNumeric: 'tabular-nums',
      }}>{lineNum ?? ''}</span>
      <span style={{ flexShrink: 0, width: 14, textAlign: 'center', color: markerColor }}>{marker}</span>
      <span style={{ flex: 1, paddingRight: 8, color: T.text, whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'ellipsis' }}>{highlight(code || '', search, false)}</span>
      {anchor && side === 'R' && (
        <span style={{
          position: 'absolute', right: 4, top: 1,
          width: 14, height: 14, borderRadius: 3, background: anchorKind === 'open' ? T.unreadBg : T.surface2,
          border: `0.5px solid ${anchorKind === 'open' ? T.link : T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="comment" size={9} color={anchorKind === 'open' ? T.link : T.text2}/>
        </span>
      )}
    </div>
  );
}

function InlineThread() {
  return (
    <div style={{
      background: T.threadBg, borderTop: `0.5px solid ${T.threadBd}`, borderBottom: `0.5px solid ${T.threadBd}`,
      padding: '0', fontFamily: FONT, fontSize: 13,
      margin: '0 0 0 102px',
      borderLeft: `2px solid ${T.link}`,
    }}>
      {/* comment 1 */}
      <ThreadComment
        author="alex-cho" you ago="2h"
        body={<>Why <code>useState(() =&gt; measureHunk(...))</code> instead of <code>useMemo</code>? We never actually call <code>setWindow</code> in the threshold branch — the state never moves, so this allocates a setter we throw away.</>}
      />
      {/* comment 2 — from author */}
      <ThreadComment
        author="nicolae-i" ago="1h" border
        body={<>Good catch. I had it as <code>useMemo</code> originally; switched when I added the scroll handler in a later commit. I'll roll it back here and bring the scroll branch over in the next push.</>}
      />
      {/* unread reply */}
      <ThreadComment
        author="priya-r" ago="14m" border unread
        body={<>Could you also add a unit test that asserts <code>measureHunk</code> is called exactly once per mount? We had a regression on this last quarter.</>}
      />
      {/* draft reply composer */}
      <div style={{
        padding: '8px 12px', borderTop: `0.5px solid ${T.threadBd}`,
        background: T.composeBg, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Avatar name="alex-cho" size={20}/>
        <div style={{ flex: 1, color: T.text3, fontSize: 12.5 }}>Reply, or <Kbd>R</Kbd> to start your draft…</div>
        <Button kind="ghost" size="sm">Resolve</Button>
        <Button kind="primary" size="sm">Reply</Button>
      </div>
    </div>
  );
}

function InlineThreadResolved() {
  return (
    <div style={{
      margin: '0 0 0 102px',
      background: T.threadBg, border: `0.5px solid ${T.threadBd}`,
      borderRadius: 6, padding: '6px 10px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12, color: T.text2,
    }}>
      <Icon name="check" size={12} color={T.pass}/>
      <span style={{ flex: 1 }}>
        Resolved thread · <b style={{ color: T.text }}>marcus-w</b> and <b style={{ color: T.text }}>nicolae-i</b> · 4 replies
      </span>
      <button style={{
        background: 'transparent', border: 'none', color: T.link, fontSize: 12, cursor: 'pointer',
      }}>Show</button>
    </div>
  );
}

function ThreadComment({ author, ago, body, you, border, unread }) {
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '10px 12px',
      borderTop: border ? `0.5px solid ${T.threadBd}` : 'none',
      background: unread ? T.unreadBg : 'transparent',
      position: 'relative',
    }}>
      {unread && <div style={{ position: 'absolute', left: 4, top: 14, width: 6, height: 6, borderRadius: '50%', background: T.unread }}/>}
      <Avatar name={author} size={22}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
          <span style={{ fontWeight: 600, fontSize: 12.5 }}>{author}</span>
          {you && <Pill bg={T.sidebar2} color={T.text2} weight={500}>you</Pill>}
          <span style={{ fontSize: 11.5, color: T.text3 }}>{ago}</span>
          <div style={{ flex: 1 }}/>
          <Icon name="kebab" size={12} color={T.text3}/>
        </div>
        <div style={{ fontSize: 12.5, color: T.text, lineHeight: 1.45 }}>{body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { FilesChangedScreen });
