// Files-changed sub-toolbar + commit picker + viewed progress + diff search +
// segmented toggles (tree/list, inline/split) + jump-to-top/bottom + review dock.
// Pure presentation — no state owned here; pass in a `view` config to each.

// ─── Sub-toolbar that sits below the PR tab strip ──────────────
function FilesSubToolbar({ view = {} }) {
  return (
    <div style={{
      flexShrink: 0, position: 'relative',
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '6px 14px', minHeight: 38,
      borderBottom: `0.5px solid ${T.border}`,
      background: T.panel, zIndex: 5,
    }}>
      <CommitSelector open={view.commitsOpen} selected={view.commitsSelected || 14} total={14}/>
      <ToolbarDivider/>
      <ViewedProgress viewed={3} total={7}/>
      <ToolbarDivider/>
      <DiffSearchControl
        active={view.searchActive}
        query={view.searchQuery || 'measureHunk'}
        matches={14} index={3}
      />
      <DiffActions/>
      <div style={{ flex: 1 }}/>
      <Segmented
        value={view.diff || 'inline'}
        options={[
          { id: 'inline', icon: 'inline', label: 'Inline', kbd: '⌘⇧I' },
          { id: 'split',  icon: 'split',  label: 'Split',  kbd: '⌘⇧S' },
        ]}
        label="Diff"
      />

      {view.commitsOpen && <CommitPickerPopover/>}
    </div>
  );
}
function ToolbarDivider() {
  return <div style={{ width: 1, height: 18, background: T.border, flexShrink: 0 }}/>;
}

// ─── Commit selector (closed + open popover) ───────────────────
function CommitSelector({ open, selected, total }) {
  const showingAll = selected === total;
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 24, padding: '0 8px 0 8px', borderRadius: 5,
      background: open ? T.selectionBg : T.surface,
      border: `0.5px solid ${open ? T.selectionBd : T.borderStrong}`,
      fontFamily: FONT, fontSize: 12, color: T.text, cursor: 'pointer',
    }}>
      <Icon name="commit" size={12} color={open ? T.link : T.text2}/>
      {showingAll
        ? <span><b style={{ fontWeight: 600 }}>{total} commits</b> · all changes</span>
        : <span><b style={{ fontWeight: 600, color: T.link }}>{selected} of {total} commits</b> · selected range</span>
      }
      <Icon name="chevron-down" size={10} color={T.text3}/>
    </button>
  );
}

const COMMITS = [
  { sha: '8c7d219', msg: 'add measureHunk-called-once regression test', who: 'nicolae-i', ago: '6h', stat: '+38 −2',  selected: true },
  { sha: 'f02ab1c', msg: 'address review: switch to useMemo for the threshold branch', who: 'nicolae-i', ago: '6h', stat: '+12 −18', selected: true },
  { sha: '21fce04', msg: 'wire VirtualHunk into NaiveHunk above 2k lines', who: 'nicolae-i', ago: '22h', stat: '+24 −6', selected: true },
  { sha: 'b9e4cd8', msg: 'measureHunk: cache line widths per font family', who: 'nicolae-i', ago: '23h', stat: '+96 −8', selected: true },
  { sha: '3a1c7f2', msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation', who: 'nicolae-i', ago: '1d', stat: '+412 −188', selected: true },
  { sha: 'e441cb0', msg: 'spike: measure baseline render of NaiveHunk', who: 'nicolae-i', ago: '1d', stat: '+22 −0', selected: false },
  { sha: '7df2a01', msg: "rebase onto main (resolves conflicts in editor/metrics.ts)", who: 'nicolae-i', ago: '1d', stat: '+18 −9', selected: false, rebase: true },
  { sha: '0bf9e2c', msg: 'docs: outline approach in DESIGN.md', who: 'nicolae-i', ago: '2d', stat: '+74 −0', selected: false },
];

function CommitPickerPopover() {
  return (
    <div style={{
      position: 'absolute', top: 36, left: 14, zIndex: 30,
      width: 460, background: T.surface, borderRadius: 8,
      border: `0.5px solid ${T.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.04)',
      fontFamily: FONT, color: T.text,
    }}>
      <div style={{
        padding: '10px 14px', borderBottom: `0.5px solid ${T.borderSoft}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="commit" size={14} color={T.text2}/>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Comparing commits</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 11.5, color: T.text3 }}>5 of 14 selected</span>
        <button style={{ background: 'transparent', border: 'none', color: T.link, fontSize: 12, cursor: 'pointer' }}>Select all</button>
      </div>

      <div style={{
        padding: '8px 14px', borderBottom: `0.5px solid ${T.borderSoft}`,
        display: 'grid', gridTemplateColumns: '60px 1fr', rowGap: 6, fontSize: 12, alignItems: 'center',
      }}>
        <span style={{ color: T.text3, fontSize: 11 }}>Base</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="branch" size={12} color={T.text2}/>
          <span style={{ fontFamily: MONO, fontSize: 11.5 }}>main</span>
          <span style={{ color: T.text3 }}>@</span>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.text2 }}>a3f7b21</span>
        </span>
        <span style={{ color: T.text3, fontSize: 11 }}>Head</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="branch" size={12} color={T.text2}/>
          <span style={{ fontFamily: MONO, fontSize: 11.5 }}>perf/virtualise-hunks</span>
          <span style={{ color: T.text3 }}>@</span>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.text2 }}>8c7d219</span>
        </span>
      </div>

      <div style={{ maxHeight: 260, overflow: 'auto' }}>
        {COMMITS.map((c, i) => (
          <div key={c.sha} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 14px',
            borderTop: i ? `0.5px solid ${T.borderSoft}` : 'none',
            background: c.selected ? T.selectionBg : 'transparent',
            position: 'relative',
          }}>
            <Checkbox state={c.selected ? 'checked' : 'unchecked'}/>
            <Avatar name={c.who} size={16}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.msg}
              </div>
              <div style={{ fontSize: 11, color: T.text3, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ fontFamily: MONO }}>{c.sha}</span>
                <span style={{ color: T.text4 }}>·</span>
                <span>{c.who}</span>
                <span style={{ color: T.text4 }}>·</span>
                <span>{c.ago}</span>
                {c.rebase && (
                  <>
                    <span style={{ color: T.text4 }}>·</span>
                    <Pill bg={T.warnBg} color={T.warnFg}>rebase</Pill>
                  </>
                )}
              </div>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 10.5, color: T.text3, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', marginTop: 2 }}>{c.stat}</span>
          </div>
        ))}
      </div>

      <div style={{
        padding: '10px 14px', borderTop: `0.5px solid ${T.borderSoft}`,
        display: 'flex', alignItems: 'center', gap: 10, background: T.surface2,
      }}>
        <span style={{ fontSize: 11.5, color: T.text3 }}>Range: <span style={{ fontFamily: MONO, color: T.text }}>3a1c7f2..8c7d219</span></span>
        <div style={{ flex: 1 }}/>
        <Button kind="ghost" size="sm">Cancel</Button>
        <Button kind="primary" size="sm">Show diff · 5 commits</Button>
      </div>
    </div>
  );
}

// ─── Viewed progress bar ───────────────────────────────────────
function ViewedProgress({ viewed, total }) {
  const pct = (viewed / total) * 100;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
      <Icon name="eye" size={12} color={T.text2}/>
      <div style={{
        flex: 1, height: 4, borderRadius: 2,
        background: T.sidebar2, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${pct}%`,
          background: pct === 100 ? T.pass : T.link, borderRadius: 2,
          transition: 'width 200ms ease',
        }}/>
      </div>
      <span style={{ fontSize: 11.5, color: T.text2, fontVariantNumeric: 'tabular-nums' }}>
        <b style={{ color: T.text, fontWeight: 600 }}>{viewed}</b><span style={{ color: T.text3 }}> / {total}</span>
      </span>
    </div>
  );
}

// ─── Diff search ───────────────────────────────────────────────
function DiffSearchControl({ active, query, matches, index }) {
  if (!active) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 24, padding: '0 8px', borderRadius: 5,
        background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        fontSize: 12, color: T.text3, minWidth: 180,
      }}>
        <Icon name="search" size={11} color={T.text3}/>
        <span style={{ flex: 1 }}>Search in diff</span>
        <Kbd>⌘F</Kbd>
      </div>
    );
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 24, padding: '0 4px 0 8px', borderRadius: 5,
      background: T.inputBg, border: `1px solid ${T.link}`,
      boxShadow: `0 0 0 3px ${T.isDark ? 'rgba(90,169,255,0.18)' : 'rgba(10,132,255,0.12)'}`,
      fontSize: 12, color: T.text, minWidth: 280, fontFamily: MONO,
    }}>
      <Icon name="search" size={11} color={T.link}/>
      <span style={{ flex: 1 }}>{query}</span>
      <span style={{ fontFamily: FONT, fontSize: 11, color: T.text3, fontVariantNumeric: 'tabular-nums' }}>
        {index} / {matches}
      </span>
      <button style={smallIconBtn()}><Icon name="chevron-up" size={11}/></button>
      <button style={smallIconBtn()}><Icon name="chevron-down" size={11}/></button>
      <button style={smallIconBtn()}><Icon name="x" size={10}/></button>
    </div>
  );
}
function smallIconBtn() {
  return {
    width: 18, height: 18, borderRadius: 3, border: 'none',
    background: 'transparent', cursor: 'pointer', color: T.text2,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

// ─── Diff actions (collapse / expand / reset) ──────────────────
function DiffActions() {
  const Btn = ({ icon, label, title }) => (
    <button title={title} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      height: 24, padding: icon ? '0 8px 0 7px' : '0 9px', borderRadius: 5,
      background: T.surface, border: `0.5px solid ${T.borderStrong}`,
      color: T.text, fontFamily: FONT, fontSize: 11.5, cursor: 'pointer',
    }}>
      {icon && <Icon name={icon} size={10} color={T.text2}/>}
      {label}
    </button>
  );
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Btn icon="chevron-up"   label="Collapse all" title="Collapse all hunks · ⌥C"/>
      <Btn icon="chevron-down" label="Expand all"   title="Expand all hunks · ⌥E"/>
      <Btn icon={null}         label="Reset"        title="Reset to default view · ⌥R"/>
    </div>
  );
}

// ─── Segmented control ────────────────────────────────────────
function Segmented({ value, options, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {label && (
        <span style={{ fontSize: 11, color: T.text3 }}>{label}</span>
      )}
      <div style={{
        display: 'inline-flex', padding: 2, gap: 2, borderRadius: 6,
        background: T.sidebar2,
      }}>
        {options.map(o => {
          const active = o.id === value;
          return (
            <button key={o.id} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '0 8px', height: 20, borderRadius: 4, border: 'none',
              background: active ? T.surface : 'transparent',
              boxShadow: active ? (T.isDark ? '0 1px 1.5px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)' : '0 1px 1.5px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)') : 'none',
              color: active ? T.text : T.text2, fontWeight: active ? 600 : 500,
              fontSize: 11.5, fontFamily: FONT, cursor: 'pointer',
            }}>
              {o.icon && <Icon name={o.icon} size={11} color={active ? T.text : T.text2}/>}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Checkbox primitive with tri-state ────────────────────────
function Checkbox({ state = 'unchecked', size = 14 }) {
  // state: 'unchecked' | 'partial' | 'checked'
  return (
    <div style={{
      width: size, height: size, borderRadius: 3, flexShrink: 0,
      background: state === 'unchecked' ? T.surface : T.text2,
      border: `0.5px solid ${state === 'unchecked' ? T.borderStrong : T.text2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: 1,
    }}>
      {state === 'checked' && <Icon name="check" size={size * 0.65} color={T.windowBg}/>}
      {state === 'partial' && (
        <div style={{
          width: size * 0.55, height: 2, borderRadius: 1, background: T.windowBg,
        }}/>
      )}
    </div>
  );
}

// ─── Jump-to-top / bottom floating widget ─────────────────────
function JumpWidget() {
  return (
    <div style={{
      position: 'absolute', right: 16, bottom: 16, zIndex: 4,
      display: 'flex', flexDirection: 'column', gap: 0,
      borderRadius: 7, overflow: 'hidden',
      background: T.surface, border: `0.5px solid ${T.borderStrong}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.04)',
    }}>
      <JumpBtn icon="arrow-up-line" title="Top of diff" kbd="⌘↑"/>
      <div style={{ height: 1, background: T.borderSoft }}/>
      <JumpBtn icon="arrow-up" title="Previous hunk" kbd="⌥↑"/>
      <div style={{ height: 1, background: T.borderSoft }}/>
      <JumpBtn icon="arrow-down" title="Next hunk" kbd="⌥↓"/>
      <div style={{ height: 1, background: T.borderSoft }}/>
      <JumpBtn icon="arrow-down-line" title="Bottom of diff" kbd="⌘↓"/>
    </div>
  );
}
function JumpBtn({ icon, title, kbd }) {
  return (
    <button title={`${title}  ${kbd}`} style={{
      width: 30, height: 28, border: 'none', background: 'transparent',
      cursor: 'pointer', color: T.text2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={icon} size={13}/>
    </button>
  );
}

// ─── Review dock ──────────────────────────────────────────────
// Pending review draft: collapsed bar OR expanded panel above the status bar.
const PENDING = [
  {
    file: 'src/diff/VirtualHunk.tsx', line: 20, scope: 'line',
    snippet: [
      { l: null, r: '19', kind: 'add', code: '  const lineHeight = lineHeightFor(props.font);' },
      { l: null, r: '20', kind: 'add', code: '  const totalH = hunk.lines.length * lineHeight;', focus: true },
      { l: null, r: '21', kind: 'add', code: '' },
      { l: '19', r: '22', kind: 'ctx', code: '  if (hunk.lines.length < VIRTUALISE_THRESHOLD) {' },
    ],
    body: <>Why <code>useState(() =&gt; measureHunk(...))</code> instead of <code>useMemo</code>? We never call <code>setWindow</code> in the threshold branch — this allocates a setter we throw away.</>,
  },
  {
    file: 'src/diff/VirtualHunk.tsx', lineStart: 91, lineEnd: 93, scope: 'range',
    snippet: [
      { l: '85', r: '90', kind: 'ctx', code: '    <div className="hunk" data-hunk={hunk.id}>' },
      { l: null, r: '91', kind: 'add', code: '      {hunk.lines.map((line, i) => (',                  range: 'start' },
      { l: null, r: '92', kind: 'add', code: '        <DiffLine key={i} line={line} side={line.side} />', range: 'mid' },
      { l: null, r: '93', kind: 'add', code: '      ))}',                                              range: 'end' },
      { l: '86', r: '94', kind: 'ctx', code: '    </div>' },
    ],
    body: <>This whole map should be wrapped in <code>useMemo</code> — re-creating <code>DiffLine</code> instances on every render trashes the keyed list during scroll. The point of virtualisation is that <i>this</i> path stays cheap.</>,
  },
  {
    file: 'src/diff/VirtualHunk.test.tsx', scope: 'file',
    body: <>Big picture: I'd love a separate test file for the scroll branch — this one is doing a lot. Not blocking; happy to defer.</>,
  },
];

function ReviewDock({ verdict = 'changes' }) {
  // Dock is always the slim bar now. The expanded UI is a modal overlay
  // (see ReviewModal), surfaced by PierWindow's `overlay` slot.
  return <ReviewDockCollapsed verdict={verdict}/>;
}

function ReviewDockCollapsed({ verdict }) {
  const v = VERDICTS[verdict];
  return (
    <div style={{
      flexShrink: 0, height: 38, padding: '0 14px',
      borderTop: `0.5px solid ${T.border}`,
      background: T.panel,
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 12.5, color: T.text,
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.link }}/>
        <b style={{ fontWeight: 600 }}>Review draft</b>
        <span style={{ color: T.text2 }}>· 3 pending</span>
      </span>
      <span style={{ color: T.text4 }}>·</span>
      <span style={{ color: T.text2 }}>1 line · 1 range · 1 file-level</span>
      <span style={{ color: T.text4 }}>·</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <Icon name={v.icon} size={12} color={v.color}/>
        <span style={{ color: v.color, fontWeight: 600 }}>{v.label}</span>
      </span>
      <div style={{ flex: 1 }}/>
      <Button kind="ghost" size="sm">Discard</Button>
      <Button kind="primary" size="sm" icon="check">Submit review · ⌘⏎</Button>
    </div>
  );
}

const VERDICTS = {
  approve:  { id: 'approve', label: 'Approve',          color: '#30a14c', colorDark: '#3fb950', icon: 'check-circle', desc: 'Signal you reviewed and the changes can ship.' },
  comment:  { id: 'comment', label: 'Comment',          color: '#0a84ff', colorDark: '#5aa9ff', icon: 'comment',      desc: 'Submit general feedback without explicit approval.' },
  changes:  { id: 'changes', label: 'Request changes',  color: '#d2424a', colorDark: '#f85149', icon: 'x-circle',     desc: 'Block merge until your concerns are resolved.' },
};

function ReviewModal({ verdict = 'changes' }) {
  return (
    <div style={{
      width: 760, maxHeight: 'min(780px, 94%)',
      background: T.windowBg, borderRadius: 12,
      border: `0.5px solid ${T.border}`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(0,0,0,0.20)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: FONT, color: T.text,
    }}>
      {/* Modal title bar */}
      <div style={{
        height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `0.5px solid ${T.border}`, background: T.surface2,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.link }}/>
        <b style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.1 }}>Submit review</b>
        <span style={{ color: T.text2, fontSize: 12 }}>· #9217 perf(diff-render): virtualise hunks larger than 2k lines</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 11.5, color: T.text3 }}>Draft saved · 4s ago</span>
        <button title="Close · Esc" style={modalCloseBtn()}><Icon name="x" size={11}/></button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px', background: T.panel }}>
        <SectionLabel>Verdict</SectionLabel>
        <div style={{ height: 8 }}/>
        <VerdictPickerHorizontal active={verdict}/>

        <div style={{ height: 18 }}/>
        <SectionLabel>Overall comment <span style={{ color: T.text4, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></SectionLabel>
        <div style={{ height: 8 }}/>
        <div style={{
          background: T.inputBg, border: `0.5px solid ${T.borderStrong}`, borderRadius: 8,
          boxShadow: `0 0 0 3px ${T.isDark ? 'rgba(90,169,255,0.12)' : 'rgba(10,132,255,0.08)'}`,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '10px 12px', fontSize: 12.5, color: T.text,
            minHeight: 76, fontFamily: FONT, lineHeight: 1.5,
          }}>
            Strong direction overall — virtualisation looks clean and the numbers back it up. Blocking on the public
            <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 5px', borderRadius: 3, margin: '0 3px' }}>ResizeObserver</code>
            contract change in HunkWindow that breaks mobile-ios — see thread on line 91. Happy to revisit once the adapter lands.
            <span style={{ display: 'inline-block', width: 1, height: 14, background: T.link, marginLeft: 2, verticalAlign: 'text-bottom' }}/>
          </div>
          <div style={{
            padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 10,
            borderTop: `0.5px solid ${T.borderSoft}`, background: T.surface2,
            fontSize: 11, color: T.text3,
          }}>
            <Icon name="info" size={11}/>
            <span>Markdown</span>
            <span style={{ color: T.text4 }}>·</span>
            <span><Kbd>⌘B</Kbd> bold</span>
            <span><Kbd>⌘I</Kbd> italic</span>
            <span><Kbd>⌘K</Kbd> link</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>132 / 65,535</span>
          </div>
        </div>

        <div style={{ height: 18 }}/>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <SectionLabel inline>Pending comments</SectionLabel>
          <span style={{ fontSize: 11.5, color: T.text3 }}>· 3 · 1 line, 1 range, 1 file-level</span>
          <div style={{ flex: 1 }}/>
          <button style={{ background: 'transparent', border: 'none', color: T.link, fontSize: 11.5, cursor: 'pointer' }}>Group by file</button>
        </div>
        <div style={{ height: 8 }}/>
        <div style={{
          background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8, overflow: 'hidden',
        }}>
          {PENDING.map((p, i) => <PendingRow key={i} p={p} first={i === 0}/>)}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        height: 56, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderTop: `0.5px solid ${T.border}`, background: T.surface,
      }}>
        <span style={{ fontSize: 11.5, color: T.text3, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="info" size={11}/>
          Pending comments are not visible to others until you submit.
        </span>
        <div style={{ flex: 1 }}/>
        <Button kind="ghost" size="md">Cancel</Button>
        <Button kind="default" size="md" icon="trash">Discard draft</Button>
        <SubmitButton verdict={verdict}/>
      </div>
    </div>
  );
}

function modalCloseBtn() {
  return {
    width: 24, height: 24, borderRadius: 5, border: `0.5px solid ${T.borderStrong}`,
    background: T.surface, cursor: 'pointer', color: T.text2,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

function VerdictPickerHorizontal({ active }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {Object.values(VERDICTS).map(v => {
        const isActive = v.id === active;
        const tint = T.isDark ? v.colorDark : v.color;
        return (
          <label key={v.id} style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: '12px 12px', borderRadius: 8,
            background: isActive ? `color-mix(in oklch, ${tint} 14%, ${T.surface})` : T.surface,
            border: `0.5px solid ${isActive ? tint : T.border}`,
            boxShadow: isActive ? `0 0 0 3px color-mix(in oklch, ${tint} 18%, transparent)` : 'none',
            cursor: 'pointer', position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `1.5px solid ${isActive ? tint : T.borderStrong}`,
                background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isActive && <span style={{ width: 8, height: 8, borderRadius: '50%', background: tint }}/>}
              </span>
              <Icon name={v.icon} size={14} color={isActive ? tint : T.text2}/>
              <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? tint : T.text }}>{v.label}</span>
            </div>
            <div style={{ fontSize: 11.5, color: T.text2, lineHeight: 1.45 }}>{v.desc}</div>
          </label>
        );
      })}
    </div>
  );
}

function SubmitButton({ verdict }) {
  const v = VERDICTS[verdict];
  const isApprove = verdict === 'approve';
  const isChanges = verdict === 'changes';
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 30, padding: '0 14px', borderRadius: 6, border: 'none',
      background: isApprove ? T.pass : isChanges ? T.fail : T.link,
      color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      boxShadow: '0 1px 0 rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.18)',
    }}>
      <Icon name={v.icon} size={13} color="#fff"/>
      Submit · {v.label}
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: 4, padding: '0 4px', height: 16,
        background: 'rgba(255,255,255,0.18)', borderRadius: 3,
        fontFamily: MONO, fontSize: 10.5, fontWeight: 500,
      }}>⌘⏎</span>
    </button>
  );
}

function SectionLabel({ children, inline }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
      color: T.text3, ...(inline ? {} : { marginTop: 2 }),
    }}>{children}</span>
  );
}

function VerdictPicker({ active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Object.values(VERDICTS).map(v => {
        const isActive = v.id === active;
        const tint = T.isDark ? v.colorDark : v.color;
        return (
          <label key={v.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '8px 10px', borderRadius: 6,
            background: isActive ? `color-mix(in oklch, ${tint} 12%, ${T.surface})` : T.surface,
            border: `0.5px solid ${isActive ? tint : T.border}`,
            cursor: 'pointer',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              border: `1.5px solid ${isActive ? tint : T.borderStrong}`,
              background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              {isActive && <span style={{ width: 7, height: 7, borderRadius: '50%', background: tint }}/>}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, color: isActive ? tint : T.text }}>
                <Icon name={v.icon} size={12} color={isActive ? tint : T.text3}/>
                {v.label}
              </div>
              <div style={{ fontSize: 11.5, color: T.text2, marginTop: 2 }}>{v.desc}</div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

function PendingRow({ p, first }) {
  const anchorPill = p.scope === 'line'
    ? <Pill bg={T.codeBg} color={T.text2} mono>line {p.line}</Pill>
    : p.scope === 'range'
      ? <Pill bg={T.unreadBg} color={T.link} weight={600} mono>lines {p.lineStart}–{p.lineEnd}</Pill>
      : <Pill bg={T.warnBg} color={T.warnFg}>file-level</Pill>;
  return (
    <div style={{
      padding: '12px 14px',
      borderTop: first ? 'none' : `0.5px solid ${T.borderSoft}`,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {/* Header */}
      <div style={{
        fontFamily: MONO, fontSize: 11.5, color: T.text,
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
      }}>
        <Icon name={p.scope === 'file' ? 'file' : p.scope === 'range' ? 'sliders' : 'comment'} size={12} color={T.text3}/>
        <span style={{ fontWeight: 500 }}>{p.file}</span>
        {anchorPill}
        <Pill bg={T.unreadBg} color={T.link}>pending</Pill>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', gap: 2 }}>
          <button style={pendingActionBtn()} title="Jump to comment"><Icon name="external" size={11}/></button>
          <button style={pendingActionBtn()} title="Edit"><Icon name="kebab" size={11}/></button>
          <button style={pendingActionBtn()} title="Discard"><Icon name="trash" size={11}/></button>
        </div>
      </div>
      {/* Diff snippet (skip for file-level comments) */}
      {p.snippet && <PendingSnippet lines={p.snippet}/>}
      {/* Full comment body */}
      <div style={{
        fontSize: 12.5, color: T.text, lineHeight: 1.5, fontFamily: FONT,
      }}>{p.body}</div>
    </div>
  );
}

function PendingSnippet({ lines }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 11, lineHeight: '17px',
      border: `0.5px solid ${T.border}`, borderRadius: 6, overflow: 'hidden',
      background: T.surface,
    }}>
      {lines.map((ln, i) => <SnippetLine key={i} ln={ln}/>)}
    </div>
  );
}

function SnippetLine({ ln }) {
  const bg = ln.kind === 'add' ? T.addBg : ln.kind === 'del' ? T.delBg : T.surface;
  const gutter = ln.kind === 'add' ? T.addGutter : ln.kind === 'del' ? T.delGutter : T.ctxGutter;
  const marker = ln.kind === 'add' ? '+' : ln.kind === 'del' ? '−' : ' ';
  const inRange = !!ln.range;
  return (
    <div style={{ display: 'flex', background: bg, position: 'relative' }}>
      <span style={{
        flexShrink: 0, width: 28, textAlign: 'right', padding: '0 4px 0 0',
        color: T.text3, background: gutter, borderRight: `0.5px solid ${T.borderSoft}`,
        fontVariantNumeric: 'tabular-nums',
      }}>{ln.l ?? ''}</span>
      <span style={{
        flexShrink: 0, width: 28, textAlign: 'right', padding: '0 4px 0 0',
        color: T.text3, background: gutter, borderRight: `0.5px solid ${T.borderSoft}`,
        fontVariantNumeric: 'tabular-nums',
      }}>{ln.r ?? ''}</span>
      <span style={{
        flexShrink: 0, width: 14, textAlign: 'center',
        color: inRange ? '#fff' : T.text3,
        background: inRange ? T.link : 'transparent',
        fontWeight: inRange ? 700 : 400,
      }}>{inRange ? '·' : marker}</span>
      <span style={{ flex: 1, padding: '0 8px', color: T.text, whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ln.code}</span>
      {ln.focus && (
        <span style={{
          position: 'absolute', right: 6, top: 1,
          fontFamily: FONT, fontSize: 9, color: T.link, fontWeight: 700,
          letterSpacing: 0.2, textTransform: 'uppercase',
        }}>commented</span>
      )}
    </div>
  );
}
function pendingActionBtn() {
  return {
    width: 22, height: 22, borderRadius: 4, border: 'none',
    background: 'transparent', cursor: 'pointer', color: T.text2,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

Object.assign(window, {
  FilesSubToolbar, CommitSelector, CommitPickerPopover,
  ViewedProgress, DiffSearchControl, Segmented, Checkbox, JumpWidget,
  ReviewDock, ReviewModal, VERDICTS,
});
