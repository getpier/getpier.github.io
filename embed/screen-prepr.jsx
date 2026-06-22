// Pre-PR Review flow — review your own local branch against its intended
// base BEFORE the PR exists on the remote. v2 feature from ADRs but worth
// designing now to validate the shared-primitives bet.
//
// Two artboards:
//   1. Launcher — pick a worktree, head branch, and base. Shows commit
//      summary, dirty-tree warning, "Start review" CTA.
//   2. Review surface — looks like the Files Changed screen but:
//      - No PR number, no reviewers, no checks (CI doesn't run locally)
//      - Title is the branch comparison, not a PR title
//      - "Request changes / Approve" replaced with "Open PR on GitHub" CTA
//      - Comments are LOCAL notes; they sync to the PR when one is created
//      - Status bar speaks git, not GitHub
//      - File rail header shows uncommitted changes separately when present

// ───────────────────────────────────────────────────────────────
// 1 · LAUNCHER
// ───────────────────────────────────────────────────────────────
const WORKTREES = [
  { id: 'wt-main', path: '~/code/web-event-app', branch: 'perf/virtualise-hunks', ahead: 14, behind: 0, dirty: 3, current: true },
  { id: 'wt-api', path: '~/code/api', branch: 'fix/proration', ahead: 6, behind: 2, dirty: 0 },
  { id: 'wt-spike', path: '~/code/web-event-app-spike', branch: 'spike/zustand', ahead: 38, behind: 12, dirty: 11 },
  { id: 'wt-design', path: '~/code/design-system', branch: 'main', ahead: 0, behind: 0, dirty: 0 },
];

function PrePRLauncherScreen({ width = 1100, height = 740 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Pre-PR Review" subtitle="Self-review before opening a PR"
      appSidebar={<AppSidebar active="local"/>}
      sidebar={<PrePRSidebar/>}
      sidebarWidth={232}
      status={
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
            git OK · 4 worktrees discovered
          </span>
          <span style={{ margin: '0 12px', color: T.border }}>│</span>
          <span>No GitHub round-trip · everything below is local</span>
          <span style={{ flex: 1 }}/>
          <span><Kbd>⌘N</Kbd> new review</span>
        </>
      }
    >
      <div style={{ flex: 1, overflow: 'auto', background: T.panel, padding: '24px 28px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
            color: T.text3, marginBottom: 8,
          }}>New pre-PR review</div>
          <h1 style={{
            margin: 0, fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4,
            color: T.text, lineHeight: 1.2,
          }}>Review a local branch before opening a PR</h1>
          <p style={{ marginTop: 8, marginBottom: 22, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
            Pier compares two refs in the worktree you choose and gives you the same diff, file rail and
            comments surface as a real PR review. Notes you leave here stay local until you actually open the PR
            on GitHub — then they migrate.
          </p>

          {/* Picker card */}
          <div style={{
            background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 10,
            boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden',
          }}>
            <PickerRow
              label="Worktree"
              icon="worktree"
              valueIcon={<Avatar name="WA" size={18} hue={210}/>}
              value="web-event-app"
              meta={<span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>~/code/web-event-app</span>}
            />
            <PickerRow
              label="Head"
              icon="branch"
              valueIcon={<Icon name="branch" size={13} color={T.link}/>}
              value="perf/virtualise-hunks"
              valueMono
              meta={
                <span style={{ fontSize: 11.5, color: T.text2 }}>
                  <b style={{ color: T.addLine, fontVariantNumeric: 'tabular-nums' }}>↑ 14 commits ahead</b>
                  <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
                  <span style={{ color: T.text3 }}>0 behind</span>
                  <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
                  <span style={{ color: T.warn, fontWeight: 600 }}>3 uncommitted</span>
                </span>
              }
            />
            <SwapStrip/>
            <PickerRow
              label="Base"
              icon="branch"
              valueIcon={<Icon name="branch" size={13} color={T.text2}/>}
              value="main"
              valueMono
              meta={<span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>@ a3f7b21 · fetched 14s ago</span>}
              last
            />
          </div>

          {/* Dirty-tree warning — only when head worktree has uncommitted */}
          <div style={{
            marginTop: 14, padding: '12px 14px', borderRadius: 8,
            background: T.warnBg, border: `0.5px solid ${T.warnBd}`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Icon name="warning" size={14} color={T.warn}/>
            <div style={{ flex: 1, fontSize: 12.5, color: T.warnFg, lineHeight: 1.5 }}>
              <b>3 uncommitted changes</b> in this worktree. Pre-PR review compares <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>HEAD</code> against <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>main</code> — your uncommitted edits won't be in the diff.
              <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                <Button kind="ghost" size="sm">Show uncommitted in diff</Button>
                <Button kind="ghost" size="sm">Open Files in editor</Button>
              </div>
            </div>
          </div>

          {/* Commits preview */}
          <div style={{ marginTop: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
              color: T.text3, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>Commits to review</span>
              <Pill bg={T.sidebar2} color={T.text2}>14</Pill>
            </div>
            <div style={{
              background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8, overflow: 'hidden',
            }}>
              {[
                { sha: '8c7d219', msg: 'add measureHunk-called-once regression test', who: 'alex-cho', ago: 'just now', stat: '+38 −2' },
                { sha: 'f02ab1c', msg: 'address review: switch to useMemo for the threshold branch', who: 'alex-cho', ago: '14m', stat: '+12 −18' },
                { sha: '21fce04', msg: 'wire VirtualHunk into NaiveHunk above 2k lines', who: 'alex-cho', ago: '2h', stat: '+24 −6' },
                { sha: 'b9e4cd8', msg: 'measureHunk: cache line widths per font family', who: 'alex-cho', ago: '4h', stat: '+96 −8' },
                { sha: '3a1c7f2', msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation', who: 'alex-cho', ago: '6h', stat: '+412 −188' },
              ].map((c, i) => (
                <div key={c.sha} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px',
                  borderTop: i ? `0.5px solid ${T.borderSoft}` : 'none', fontSize: 12.5,
                }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3, width: 60 }}>{c.sha}</span>
                  <span style={{ flex: 1, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.msg}</span>
                  <span style={{ fontSize: 11, color: T.text3 }}>{c.ago}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: T.text2, fontVariantNumeric: 'tabular-nums', width: 80, textAlign: 'right' }}>{c.stat}</span>
                </div>
              ))}
              <div style={{
                padding: '7px 14px', borderTop: `0.5px solid ${T.borderSoft}`,
                background: T.surface2, fontSize: 11.5, color: T.text3, textAlign: 'center',
              }}>
                + 9 earlier commits
              </div>
            </div>
          </div>

          {/* Footer summary + CTA */}
          <div style={{
            marginTop: 22, padding: '14px 16px', borderRadius: 10,
            background: T.surface, border: `0.5px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: T.text2 }}>You're about to review</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <code style={{ fontFamily: MONO, fontSize: 12, background: T.codeBg, padding: '2px 6px', borderRadius: 3 }}>perf/virtualise-hunks</code>
                <Icon name="arrow-right" size={12} color={T.text3}/>
                <code style={{ fontFamily: MONO, fontSize: 12, background: T.codeBg, padding: '2px 6px', borderRadius: 3 }}>main</code>
                <span style={{ fontSize: 12, color: T.text3, fontWeight: 400 }}>· 14 commits · 7 files · </span>
                <span style={{ fontFamily: MONO, fontSize: 11.5 }}>
                  <span style={{ color: T.addLine }}>+904</span> <span style={{ color: T.delLine }}>−311</span>
                </span>
              </div>
            </div>
            <Button kind="ghost" size="md">Cancel</Button>
            <Button kind="primary" size="md" icon="play">Start review · ⌘⏎</Button>
          </div>
        </div>
      </div>
    </PierWindow>
  );
}

function PrePRSidebar() {
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingTop: 6 }}>
      <SidebarSection title="Pre-PR">
        <SidebarItem icon="plus" color={T.link} label="New review" kbd="⌘N" selected/>
      </SidebarSection>

      <SidebarSection title="In progress · 2">
        <SidebarItem icon="branch" label="perf/virtualise-hunks" count="4 notes" badgeColor={T.text2}/>
        <SidebarItem icon="branch" label="fix/proration" count="0" badgeColor={T.text3}/>
      </SidebarSection>

      <SidebarSection title="Recent">
        <SidebarItem icon="branch" label="feat/persist-scroll" count="·"/>
        <SidebarItem icon="branch" label="docs/pat-sso"/>
      </SidebarSection>

      <div style={{ height: 12 }}/>

      <SidebarSection title="Worktrees · 4">
        {WORKTREES.map(w => (
          <SidebarItem
            key={w.id}
            icon="worktree"
            label={w.path.replace(/^~\/code\//, '')}
            count={w.dirty > 0 ? `${w.dirty} dirty` : '✓'}
            badgeColor={w.dirty > 0 ? T.warn : T.pass}
          />
        ))}
      </SidebarSection>
    </div>
  );
}

function PickerRow({ label, icon, valueIcon, value, valueMono, meta, last }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '90px 1fr',
      padding: '14px 16px', alignItems: 'center',
      borderBottom: last ? 'none' : `0.5px solid ${T.borderSoft}`,
      columnGap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.text3, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase' }}>
        <Icon name={icon} size={12}/>
        {label}
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '8px 12px', borderRadius: 6,
        background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        cursor: 'pointer', textAlign: 'left',
      }}>
        {valueIcon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: valueMono ? MONO : FONT,
            fontSize: valueMono ? 13 : 13, fontWeight: 600, color: T.text,
          }}>{value}</div>
          {meta && <div style={{ marginTop: 2 }}>{meta}</div>}
        </div>
        <Icon name="chevron-down" size={11} color={T.text3}/>
      </button>
    </div>
  );
}

function SwapStrip() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 0 0 102px', position: 'relative', height: 0,
    }}>
      <button style={{
        position: 'absolute', right: 20, top: -16,
        width: 28, height: 28, borderRadius: 7,
        background: T.surface, border: `0.5px solid ${T.borderStrong}`,
        color: T.text2, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }} title="Swap head and base">
        <Icon name="swap" size={13}/>
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// 2 · REVIEW SURFACE — wraps the existing FilesChangedScreen pieces
// but adapts header / status / actions / dock for the local context.
// ───────────────────────────────────────────────────────────────
function PrePRReviewScreen({ width = 1320, height = 900, view = {} }) {
  const v = {
    rail: 'tree', diff: 'inline', dock: 'collapsed',
    searchActive: false, searchQuery: '',
    pushed: true,            // branch already on remote?
    createOpen: false,       // create-PR modal open?
    ...view,
  };
  return (
    <PierWindow
      width={width} height={height}
      title="Pre-PR Review" subtitle="perf/virtualise-hunks → main · local"
      appSidebar={<AppSidebar active="local"/>}
      toolbar={<PrePRActions pushed={v.pushed}/>}
      status={<PrePRStatusBar pushed={v.pushed}/>}
      overlay={v.createOpen ? <CreatePRModal pushed={v.pushed}/> : null}
    >
      <PrePRHeader pushed={v.pushed}/>
      <PrePRTabStrip active="files"/>
      <FilesSubToolbar view={v}/>
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        <PrePRFileRail/>
        <DiffPane mode={v.diff} search={v.searchActive ? v.searchQuery : null} noComments/>
        <JumpWidget/>
      </div>
    </PierWindow>
  );
}

function PrePRActions({ pushed = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Button kind="ghost" size="sm" icon="terminal">Open in iTerm</Button>
      <Button kind="ghost" size="sm" icon="refresh">Refresh diff</Button>
      {pushed
        ? <Button kind="primary" size="sm" icon="plus">Create PR… · ⌘⇧P</Button>
        : <Button kind="primary" size="sm" icon="plus">Push &amp; create PR…</Button>
      }
    </div>
  );
}

function PrePRHeader({ pushed = true }) {
  return (
    <div style={{
      padding: '12px 18px 0', borderBottom: `0.5px solid ${T.border}`,
      background: T.surface, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Pill bg={T.unreadBg} color={T.link} weight={600}>
          <Icon name="worktree" size={11} color={T.link}/> Local · pre-PR
        </Pill>
        <span style={{ fontSize: 13, color: T.text2 }}>
          comparing
          <span style={{ fontFamily: MONO, fontSize: 11.5, padding: '1px 5px', background: T.codeBg, borderRadius: 3, margin: '0 4px' }}>perf/virtualise-hunks</span>
          against
          <span style={{ fontFamily: MONO, fontSize: 11.5, padding: '1px 5px', background: T.codeBg, borderRadius: 3, margin: '0 4px' }}>main</span>
          <span style={{ color: T.text3, marginLeft: 2 }}>· {pushed ? 'no PR yet' : 'branch not pushed'}</span>
        </span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 12, color: T.text3 }}>
          Worktree <span style={{ fontFamily: MONO, color: T.text2 }}>~/code/web-event-app</span>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '6px 0 10px' }}>
        <MetaSnippet label="Author">
          <Avatar name="alex-cho" size={16}/> <span style={{ marginLeft: 4 }}>alex-cho · you</span>
        </MetaSnippet>
        <MetaSep/>
        <MetaSnippet label="Commits" mono>
          <Icon name="commit" size={12} color={T.text2}/>
          <span><b style={{ color: T.text }}>14</b> ahead</span>
          <span style={{ color: T.text4, margin: '0 2px' }}>·</span>
          <span style={{ color: T.text3 }}>0 behind</span>
        </MetaSnippet>
        <MetaSep/>
        <MetaSnippet label="Diff" mono>
          <span style={{ color: T.addLine }}>+904</span>
          <span style={{ color: T.delLine }}>−311</span>
          <span style={{ color: T.text2 }}>· 7 files</span>
        </MetaSnippet>
        <MetaSep/>
        <MetaSnippet label="Working tree">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: T.warn }}>
            <Icon name="warning" size={12}/>
            <b>3 uncommitted</b>
          </span>
        </MetaSnippet>
        <div style={{ flex: 1 }}/>
      </div>
    </div>
  );
}

function MetaSnippet({ label, children, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.text, fontFamily: mono ? MONO : FONT }}>
      <span style={{ fontSize: 11, color: T.text3, fontFamily: FONT, marginRight: 2 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{children}</span>
    </div>
  );
}
function MetaSep() { return <div style={{ width: 1, height: 14, background: T.border }}/>; }

function PrePRTabStrip({ active }) {
  // Pre-PR is read-only self-review — no Conversation, no Checks, no
  // comments. Comments are a collaboration feature; they exist on PRs.
  const tabs = [
    { id: 'commits', label: 'Commits',      count: 14, icon: 'branch' },
    { id: 'changes', label: 'Working tree', count: 3,  icon: 'warning' },
    { id: 'files',   label: 'Files changed', count: 7, icon: 'file' },
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
            <Icon name={t.icon} size={13} color={isActive ? T.link : (t.id === 'changes' ? T.warn : T.text3)}/>
            {t.label}
            <span style={{
              fontSize: 11, padding: '0 5px', height: 16, lineHeight: '16px',
              borderRadius: 8, background: isActive ? T.selectionBg : T.sidebar2,
              color: isActive ? T.link : T.text2, fontVariantNumeric: 'tabular-nums', fontWeight: 600,
            }}>{t.count}</span>
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

function PrePRStatusBar({ pushed = true }) {
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
        Watching FS · debounce 200ms
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Base · <span style={{ fontFamily: MONO, fontSize: 11 }}>main@a3f7b21</span></span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Head · <span style={{ fontFamily: MONO, fontSize: 11 }}>perf/virtualise-hunks@8c7d219</span></span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      {pushed
        ? <span>Origin: <span style={{ color: T.pass }}>up-to-date</span></span>
        : <span style={{ color: T.warn }}>Origin: branch missing · will push on create</span>}
      <span style={{ flex: 1 }}/>
      <span>Local-only · GitHub access only on “Create PR”</span>
    </>
  );
}

// File rail variant: same structure, but the header injects an "Uncommitted"
// pseudo-folder above the rest of the tree.
function PrePRFileRail() {
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
          display: 'flex', alignItems: 'center', gap: 6, flex: 1,
          height: 22, padding: '0 8px', borderRadius: 5,
          background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        }}>
          <Icon name="search" size={11} color={T.text3}/>
          <span style={{ fontSize: 11.5, color: T.text3 }}>Filter files</span>
        </div>
      </div>

      {/* Uncommitted bucket */}
      <div style={{
        padding: '6px 12px 4px', display: 'flex', alignItems: 'center', gap: 6,
        background: T.warnBg, borderBottom: `0.5px solid ${T.warnBd}`,
        fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.warnFg,
      }}>
        <Icon name="warning" size={11} color={T.warn}/>
        <span>Uncommitted</span>
        <Pill bg="rgba(0,0,0,0.06)" color={T.warnFg} weight={600}>3</Pill>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 10, color: T.warnFg, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>local edits</span>
      </div>
      {[
        { name: 'src/diff/VirtualHunk.tsx', stat: 'M', add: 18, del: 4 },
        { name: 'src/diff/measureHunk.ts',  stat: 'M', add: 6,  del: 0 },
        { name: 'src/notes/scroll.md',      stat: 'A', add: 14, del: 0 },
      ].map((f, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 24, padding: '0 12px 0 14px',
          fontSize: 12, color: T.text, background: 'transparent',
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 9.5, fontWeight: 700,
            color: f.stat === 'A' ? T.addLine : f.stat === 'D' ? T.delLine : T.warn,
            width: 12, textAlign: 'center',
          }}>{f.stat}</span>
          <Icon name="file" size={12} color={T.text3}/>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: MONO, fontSize: 11 }}>{f.name}</span>
          <span style={{ fontFamily: MONO, fontSize: 10, fontVariantNumeric: 'tabular-nums', display: 'flex', gap: 3 }}>
            <span style={{ color: T.addLine }}>+{f.add}</span>
            <span style={{ color: T.delLine }}>−{f.del}</span>
          </span>
        </div>
      ))}

      {/* Committed diff bucket */}
      <div style={{
        padding: '8px 12px 4px', display: 'flex', alignItems: 'center', gap: 6,
        borderTop: `0.5px solid ${T.border}`, borderBottom: `0.5px solid ${T.borderSoft}`,
        fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.text3,
      }}>
        <Icon name="branch" size={11}/>
        <span>In branch · 14 commits</span>
        <Pill bg={T.sidebar2} color={T.text2}>7</Pill>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {FILES.map((f, i) => <FileRowTree key={i} f={f}/>)}
      </div>

      <div style={{
        padding: '8px 12px', borderTop: `0.5px solid ${T.border}`,
        fontSize: 11, color: T.text2, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>7 files · 3 dirty</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="eye" size={11}/> Self-review
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { PrePRLauncherScreen, PrePRReviewScreen, CreatePRModal });

// ═══════════════════════════════════════════════════════════════
// Create PR modal — the moment the local branch becomes a real PR
// ═══════════════════════════════════════════════════════════════
function CreatePRModal({ pushed = true }) {
  return (
    <div style={{
      width: 760, maxHeight: 'min(720px, 94%)',
      background: T.windowBg, borderRadius: 12,
      border: `0.5px solid ${T.border}`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(0,0,0,0.20)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: FONT, color: T.text,
    }}>
      {/* Header */}
      <div style={{
        height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `0.5px solid ${T.border}`, background: T.surface2,
      }}>
        <Icon name="plus" size={14} color={T.link}/>
        <b style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.1 }}>Create pull request</b>
        <span style={{ color: T.text2, fontSize: 12 }}>· eventmobi/web-event-app</span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 11.5, color: T.text3 }}>Esc to cancel</span>
        <button title="Close" style={modalClose()}><Icon name="x" size={11}/></button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 18px', background: T.panel }}>
        {/* Push warning if branch not yet on remote */}
        {!pushed && (
          <div style={{
            marginBottom: 14, padding: '10px 12px', borderRadius: 8,
            background: T.warnBg, border: `0.5px solid ${T.warnBd}`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontSize: 12.5, color: T.warnFg, lineHeight: 1.5,
          }}>
            <Icon name="warning" size={13} color={T.warn}/>
            <span style={{ flex: 1 }}>
              Branch <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>perf/virtualise-hunks</code> isn't on <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>origin</code> yet.
              Pier will run <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>git push -u origin perf/virtualise-hunks</code> and then open the PR in one step.
            </span>
          </div>
        )}

        {/* Compare line */}
        <SectionLabel>Compare</SectionLabel>
        <div style={{ height: 8 }}/>
        <div style={{
          background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8,
          padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
        }}>
          <Icon name="branch" size={13} color={T.text2}/>
          <code style={{ fontFamily: MONO, fontSize: 12, background: T.codeBg, padding: '2px 6px', borderRadius: 3 }}>main</code>
          <Icon name="arrow-right" size={12} color={T.text3}/>
          <code style={{ fontFamily: MONO, fontSize: 12, background: T.codeBg, padding: '2px 6px', borderRadius: 3 }}>perf/virtualise-hunks</code>
          <span style={{ flex: 1, fontSize: 11.5, color: T.text3 }}>
            14 commits · 7 files · <span style={{ fontFamily: MONO }}><span style={{ color: T.addLine }}>+904</span> <span style={{ color: T.delLine }}>−311</span></span>
          </span>
          <button style={{
            background: 'transparent', border: 'none', color: T.link, fontSize: 12, cursor: 'pointer',
          }}>Change base</button>
        </div>

        <div style={{ height: 18 }}/>
        <SectionLabel>Title</SectionLabel>
        <div style={{ height: 8 }}/>
        <div style={{
          background: T.inputBg, border: `1px solid ${T.link}`, borderRadius: 8,
          boxShadow: `0 0 0 3px ${T.isDark ? 'rgba(90,169,255,0.12)' : 'rgba(10,132,255,0.08)'}`,
          padding: '10px 12px', fontSize: 14, color: T.text, fontWeight: 500,
        }}>
          perf(diff-render): virtualise hunks larger than 2k lines
          <span style={{ display: 'inline-block', width: 1, height: 14, background: T.link, marginLeft: 2, verticalAlign: 'text-bottom' }}/>
        </div>
        <div style={{
          marginTop: 6, fontSize: 11, color: T.text3,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="info" size={11}/>
          <span>Auto-filled from the most recent commit. <a style={{ color: T.link, cursor: 'pointer' }}>Use branch name instead</a></span>
        </div>

        <div style={{ height: 18 }}/>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <SectionLabel inline>Description</SectionLabel>
          <span style={{ fontSize: 11.5, color: T.text3 }}>· markdown · supports your repo's PR template</span>
          <div style={{ flex: 1 }}/>
          <button style={{ background: 'transparent', border: 'none', color: T.link, fontSize: 11.5, cursor: 'pointer' }}>Insert template</button>
          <button style={{ background: 'transparent', border: 'none', color: T.link, fontSize: 11.5, cursor: 'pointer' }}>Insert commit messages</button>
        </div>
        <div style={{ height: 8 }}/>
        <div style={{
          background: T.inputBg, border: `0.5px solid ${T.borderStrong}`, borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 14px', fontSize: 13, color: T.text, lineHeight: 1.55,
            minHeight: 120, fontFamily: FONT,
          }}>
            <p style={{ margin: 0 }}>The 18k-line PR #9081 spent ~600 ms parking a single hunk into the DOM on a fresh PR open, which trips the &lt; 50 ms intra-PR-switch budget badly. This introduces a <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 5px', borderRadius: 3 }}>VirtualHunk</code> that windows the line list under a fixed pixel budget.</p>
            <p style={{ margin: '10px 0 0', color: T.text2 }}><b style={{ color: T.text }}>## Numbers</b></p>
            <p style={{ margin: '4px 0 0', fontFamily: MONO, fontSize: 11.5, color: T.text2, lineHeight: 1.6 }}>
              18,412-line hunk on M2 Air, dev build<br/>
              parse + render: 612ms → 38ms<br/>
              steady-state scroll: 24fps → 60fps
            </p>
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
            <span><Kbd>⌘K</Kbd> link</span>
            <div style={{ flex: 1 }}/>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>462 / 65,535</span>
          </div>
        </div>

        {/* Two-column metadata */}
        <div style={{
          marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <MetaCard label="Reviewers">
            <ReviewerSuggest name="priya-r" reason="@eventmobi/frontend"/>
            <ReviewerSuggest name="marcus-w" reason="touched VirtualHunk.tsx last"/>
            <ReviewerSuggest name="nicolae-i" added/>
            <button style={addBtnStyle()}><Icon name="plus" size={10}/> Add reviewer</button>
          </MetaCard>
          <MetaCard label="Assignees & labels">
            <MetaInlineRow icon="user" label="Assignee" value="alex-cho · you" muted/>
            <MetaInlineRow icon="tag" label="Labels" value={
              <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
                <Label color="oklch(0.65 0.16 30)" text="performance"/>
                <Label color="oklch(0.78 0.10 100)" text="v1-budget"/>
              </span>
            }/>
            <MetaInlineRow icon="commit" label="Milestone" value="v1 performance budget"/>
            <MetaInlineRow icon="branch" label="Linked issue" value={<><code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>#9081</code> Large PRs janky on M2</>}/>
          </MetaCard>
        </div>

        {/* Draft toggle row */}
        <div style={{
          marginTop: 18, display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', background: T.surface,
          border: `0.5px solid ${T.border}`, borderRadius: 8,
        }}>
          <Icon name="pr-draft" size={14} color={T.draft}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>Open as draft</div>
            <div style={{ fontSize: 11.5, color: T.text2 }}>Signals "still iterating" — reviewers can comment but the PR can't be merged.</div>
          </div>
          <span style={{
            display: 'inline-block', width: 28, height: 16, borderRadius: 8,
            background: T.borderStrong, position: 'relative',
          }}>
            <span style={{
              position: 'absolute', left: 2, top: 2,
              width: 12, height: 12, borderRadius: '50%',
              background: T.surface, boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }}/>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        height: 56, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderTop: `0.5px solid ${T.border}`, background: T.surface,
      }}>
        <span style={{ fontSize: 11.5, color: T.text3, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="info" size={11}/>
          {pushed
            ? <>Creates the PR via GitHub API · uses your stored token</>
            : <>Will run <code style={{ fontFamily: MONO, fontSize: 10.5, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>git push</code> then create the PR via API</>
          }
        </span>
        <div style={{ flex: 1 }}/>
        <Button kind="ghost" size="md">Cancel</Button>
        <Button kind="default" size="md" icon="external">Open compare on github.com</Button>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 30, padding: '0 14px', borderRadius: 6, border: 'none',
          background: T.link, color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.18)',
        }}>
          <Icon name="plus" size={13} color="#fff"/>
          {pushed ? 'Create PR' : 'Push & create PR'}
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 4, padding: '0 4px', height: 16,
            background: 'rgba(255,255,255,0.18)', borderRadius: 3,
            fontFamily: MONO, fontSize: 10.5, fontWeight: 500,
          }}>⌘⏎</span>
        </button>
      </div>
    </div>
  );
}

function modalClose() {
  return {
    width: 24, height: 24, borderRadius: 5, border: `0.5px solid ${T.borderStrong}`,
    background: T.surface, cursor: 'pointer', color: T.text2,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

function MetaCard({ label, children }) {
  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8,
      padding: '10px 12px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
        color: T.text3, marginBottom: 8,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}

function ReviewerSuggest({ name, reason, added }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
      <Avatar name={name} size={20}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: T.text, fontWeight: 500, lineHeight: 1.2 }}>{name}{added && <span style={{ color: T.pass, marginLeft: 6, fontWeight: 600, fontSize: 11 }}>added</span>}</div>
        {reason && <div style={{ fontSize: 11, color: T.text3, lineHeight: 1.2 }}>{reason}</div>}
      </div>
      {!added && (
        <button style={{
          background: 'transparent', border: 'none', color: T.link, fontSize: 11.5, cursor: 'pointer',
          padding: 0,
        }}>+ Add</button>
      )}
    </div>
  );
}

function addBtnStyle() {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: 'transparent', border: 'none', color: T.link,
    fontSize: 11.5, cursor: 'pointer', padding: 2, marginTop: 2,
  };
}

function MetaInlineRow({ icon, label, value, muted }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <Icon name={icon} size={12} color={T.text3}/>
      <span style={{ color: T.text3, width: 70, flexShrink: 0 }}>{label}</span>
      <span style={{ flex: 1, color: muted ? T.text2 : T.text }}>{value}</span>
    </div>
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
