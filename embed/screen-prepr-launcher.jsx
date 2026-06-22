// Pre-PR Review launcher v2 — re-orders fields (Repo first), introduces the
// Repo Store, and adds the first-run "add a repo" empty state + repo picker
// popover + add-repo dialog as separate artboards.
//
// Same shell as screen-prepr.jsx so they feel like the same screen in
// different states. We export four screens:
//   PrePRLauncherEmpty       — no repos registered yet
//   PrePRLauncherPopulated   — picker card (Repo first), worktree implicit
//   PrePRLauncherRepoPicker  — popover open over the launcher
//   PrePRAddRepoDialog       — full add-repo flow with folder validation

// ─── Repo store seed data ─────────────────────────────────────
const REGISTERED_REPOS = [
  { id: 'r-web', org: 'eventmobi', name: 'web-event-app',  path: '~/code/web-event-app',         defaultBase: 'main',     worktrees: 2, lastUsed: 'just now' },
  { id: 'r-api', org: 'eventmobi', name: 'api',            path: '~/code/api',                   defaultBase: 'main',     worktrees: 1, lastUsed: '2h' },
  { id: 'r-mob', org: 'eventmobi', name: 'mobile-ios',     path: '~/code/mobile-ios',            defaultBase: 'main',     worktrees: 1, lastUsed: '1d' },
  { id: 'r-ds',  org: 'eventmobi', name: 'design-system',  path: '~/code/design-system',         defaultBase: 'main',     worktrees: 1, lastUsed: '3d' },
  { id: 'r-inf', org: 'eventmobi', name: 'infra',          path: '~/code/infra',                 defaultBase: 'main',     worktrees: 1, lastUsed: '1w' },
  { id: 'r-spike', org: 'alex-cho', name: 'sketches',      path: '~/code/sketches',              defaultBase: 'master',   worktrees: 1, lastUsed: '2w' },
];

// ═══════════════════════════════════════════════════════════════
// 1 · EMPTY STATE — no repos registered
// ═══════════════════════════════════════════════════════════════
function PrePRLauncherEmptyScreen({ width = 1100, height = 740 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Pre-PR Review" subtitle="No repos added yet"
      appSidebar={<AppSidebar active="local"/>}
      sidebar={<PrePRSidebarEmpty/>}
      sidebarWidth={232}
      status={<PrePRLauncherStatus empty/>}
    >
      <div style={{ flex: 1, overflow: 'auto', background: T.panel, padding: '40px 28px 28px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, margin: '0 auto 16px',
            borderRadius: 14, background: T.surface,
            border: `0.5px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
          }}>
            <Icon name="folder-plus" size={26} color={T.link} strokeWidth={1.6}/>
          </div>
          <h1 style={{
            margin: 0, fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4,
            color: T.text, lineHeight: 1.2,
          }}>Add a repo to review locally</h1>
          <p style={{
            margin: '8px auto 26px', maxWidth: 460, fontSize: 13.5, color: T.text2, lineHeight: 1.55,
          }}>
            Pier needs to know where your local checkouts live before it can compare branches.
            Repos stay on your machine — paths are saved to <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 5px', borderRadius: 3 }}>repos.json</code> in app support.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <AddRepoAffordance icon="folder-plus" title="Choose folder…" desc="Open the macOS file picker and select a git repo."/>
            <AddRepoAffordance icon="drop" title="Drag here" desc="Drop one or more folders to add them all." dropTarget/>
            <AddRepoAffordance icon="scan" title="Scan parent" desc="Find every git repo under a folder you pick."/>
          </div>

          {/* Helper: how Pier finds repos */}
          <div style={{
            marginTop: 22, padding: '12px 14px', borderRadius: 8,
            background: T.surface, border: `0.5px solid ${T.border}`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            fontSize: 12, color: T.text2, lineHeight: 1.5, textAlign: 'left',
          }}>
            <Icon name="info" size={13} color={T.link} style={{ marginTop: 1 }}/>
            <div style={{ flex: 1 }}>
              <b style={{ color: T.text, fontWeight: 600 }}>Tip:</b> if you keep all your work under one folder (e.g. <code style={{ fontFamily: MONO, fontSize: 11, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>~/code</code>), use <b style={{ color: T.text }}>Scan parent</b>. Pier will list every repo it finds and you can batch-add them. Worktrees inside each repo are discovered automatically; you don't add them separately.
            </div>
          </div>

          <div style={{ marginTop: 22, fontSize: 12, color: T.text3 }}>
            Or <a style={{ color: T.link, textDecoration: 'none', cursor: 'pointer' }}>open a PR from GitHub</a> to skip pre-PR review for now.
          </div>
        </div>
      </div>
    </PierWindow>
  );
}

function AddRepoAffordance({ icon, title, desc, dropTarget }) {
  return (
    <button style={{
      padding: '20px 16px', borderRadius: 10,
      background: T.surface, border: `${dropTarget ? '1.5px' : '0.5px'} ${dropTarget ? 'dashed' : 'solid'} ${dropTarget ? T.link : T.border}`,
      cursor: 'pointer', textAlign: 'left',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
      boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: T.unreadBg, color: T.link,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={15} color={T.link}/>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{title}</div>
      <div style={{ fontSize: 11.5, color: T.text2, lineHeight: 1.4 }}>{desc}</div>
    </button>
  );
}

function PrePRSidebarEmpty() {
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingTop: 6 }}>
      <SidebarSection title="Pre-PR">
        <SidebarItem icon="plus" color={T.link} label="New review" kbd="⌘N" selected/>
      </SidebarSection>
      <SidebarSection title="In progress · 0">
        <div style={{ padding: '8px 16px', fontSize: 11.5, color: T.text3, lineHeight: 1.5 }}>
          Add a repo to start.
        </div>
      </SidebarSection>
      <SidebarSection title="Repos · 0">
        <div style={{ padding: '0 12px 8px' }}>
          <Button kind="default" size="sm" icon="plus" style={{ width: '100%', justifyContent: 'center' }}>Add repo</Button>
        </div>
      </SidebarSection>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2 · POPULATED LAUNCHER — Repo first, Worktree conditional
// ═══════════════════════════════════════════════════════════════
function PrePRLauncherV2Screen({ width = 1100, height = 740, view = {} }) {
  const { picker = null } = view;
  return (
    <PierWindow
      width={width} height={height}
      title="Pre-PR Review" subtitle="Self-review before opening a PR"
      appSidebar={<AppSidebar active="local"/>}
      sidebar={<PrePRSidebarPopulated/>}
      sidebarWidth={232}
      status={<PrePRLauncherStatus/>}
      overlay={picker === 'repo' ? <RepoPickerPopoverWrap/> : null}
    >
      <div style={{ flex: 1, overflow: 'auto', background: T.panel, padding: '24px 28px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
            color: T.text3, marginBottom: 8,
          }}>New pre-PR review</div>
          <h1 style={{
            margin: 0, fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4,
            color: T.text, lineHeight: 1.2,
          }}>Pick a repo and compare two refs</h1>
          <p style={{ marginTop: 8, marginBottom: 22, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
            Defaults to the worktree you last touched. Worktrees are discovered automatically inside each repo.
          </p>

          <div style={{
            background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 10,
            boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)', overflow: 'visible',
          }}>
            <RepoPickerRow active={picker === 'repo'}/>
            <PickerRowV2
              label="Head"
              icon="branch"
              valueIcon={<Icon name="branch" size={13} color={T.link}/>}
              value="perf/virtualise-hunks"
              valueMono
              meta={
                <span style={{ fontSize: 11.5, color: T.text2 }}>
                  <b style={{ color: T.addLine, fontVariantNumeric: 'tabular-nums' }}>↑ 14 ahead</b>
                  <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
                  <span style={{ color: T.text3 }}>0 behind</span>
                  <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
                  <span style={{ color: T.warn, fontWeight: 600 }}>3 uncommitted</span>
                </span>
              }
            />
            <SwapStripV2/>
            <PickerRowV2
              label="Base"
              icon="branch"
              valueIcon={<Icon name="branch" size={13} color={T.text2}/>}
              value="main"
              valueMono
              meta={<span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>@ a3f7b21 · fetched 14s ago</span>}
              last
            />
          </div>

          {/* Dirty-tree warning */}
          <div style={{
            marginTop: 14, padding: '12px 14px', borderRadius: 8,
            background: T.warnBg, border: `0.5px solid ${T.warnBd}`,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Icon name="warning" size={14} color={T.warn}/>
            <div style={{ flex: 1, fontSize: 12.5, color: T.warnFg, lineHeight: 1.5 }}>
              <b>3 uncommitted changes</b> in this worktree. The diff below compares <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>HEAD</code> against <code style={{ fontFamily: MONO, fontSize: 11, background: 'rgba(0,0,0,0.06)', padding: '0 4px', borderRadius: 3 }}>main</code> — your uncommitted edits won't be in it.
              <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                <Button kind="ghost" size="sm">Show uncommitted in diff</Button>
                <Button kind="ghost" size="sm">Open files in editor</Button>
              </div>
            </div>
          </div>

          {/* Commits preview (same as v1) */}
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
                { sha: '8c7d219', msg: 'add measureHunk-called-once regression test', ago: 'just now', stat: '+38 −2' },
                { sha: 'f02ab1c', msg: 'address review: switch to useMemo for the threshold branch', ago: '14m', stat: '+12 −18' },
                { sha: '21fce04', msg: 'wire VirtualHunk into NaiveHunk above 2k lines', ago: '2h', stat: '+24 −6' },
                { sha: 'b9e4cd8', msg: 'measureHunk: cache line widths per font family', ago: '4h', stat: '+96 −8' },
                { sha: '3a1c7f2', msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation', ago: '6h', stat: '+412 −188' },
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
              }}>+ 9 earlier commits</div>
            </div>
          </div>

          {/* Footer CTA */}
          <div style={{
            marginTop: 22, padding: '14px 16px', borderRadius: 10,
            background: T.surface, border: `0.5px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: T.text2 }}>Comparing</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONT, color: T.text2 }}>eventmobi/web-event-app</span>
                <span style={{ color: T.text4 }}>·</span>
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

function PrePRSidebarPopulated() {
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingTop: 6 }}>
      <SidebarSection title="Pre-PR">
        <SidebarItem icon="plus" color={T.link} label="New review" kbd="⌘N" selected/>
      </SidebarSection>
      <SidebarSection title="In progress · 2">
        <SidebarItem icon="branch" label="perf/virtualise-hunks"/>
        <SidebarItem icon="branch" label="fix/proration"/>
      </SidebarSection>
      <SidebarSection title={`Repos · ${REGISTERED_REPOS.length}`} action={<span style={{ color: T.link, fontSize: 11, cursor: 'pointer' }}>Manage</span>}>
        {REGISTERED_REPOS.slice(0, 4).map(r => (
          <SidebarItem key={r.id} icon="folder" label={`${r.org}/${r.name}`} count={r.worktrees > 1 ? `${r.worktrees}wt` : null} badgeColor={T.text3}/>
        ))}
        <div style={{ padding: '4px 12px 0' }}>
          <Button kind="ghost" size="sm" icon="plus" style={{ width: '100%', justifyContent: 'flex-start', color: T.link }}>Add repo…</Button>
        </div>
      </SidebarSection>
    </div>
  );
}

function PrePRLauncherStatus({ empty }) {
  if (empty) {
    return (
      <>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: T.warn }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.warn }}/>
          0 repos registered
        </span>
        <span style={{ flex: 1 }}/>
        <span>Local-only · no GitHub round-trip</span>
      </>
    );
  }
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
        6 repos · 7 worktrees · git OK
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Local-only · no GitHub round-trip</span>
      <span style={{ flex: 1 }}/>
      <span><Kbd>⌘N</Kbd> new review</span>
    </>
  );
}

// Repo row — primary picker, opens a combobox popover
function RepoPickerRow({ active }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '90px 1fr',
      padding: '14px 16px', alignItems: 'center',
      borderBottom: `0.5px solid ${T.borderSoft}`,
      columnGap: 12, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.text3, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.2, textTransform: 'uppercase' }}>
        <Icon name="folder" size={12}/>
        Repo
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '10px 12px', borderRadius: 6,
        background: T.inputBg,
        border: `${active ? 1 : 0.5}px solid ${active ? T.link : T.borderStrong}`,
        boxShadow: active ? `0 0 0 3px ${T.isDark ? 'rgba(90,169,255,0.18)' : 'rgba(10,132,255,0.12)'}` : 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, flexShrink: 0,
          background: 'oklch(0.78 0.10 210)',
          color: 'oklch(0.30 0.10 210)',
          fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>WE</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>eventmobi/web-event-app</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: T.text3, marginTop: 2 }}>
            ~/code/web-event-app
            <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
            <span style={{ color: T.text2 }}>2 worktrees</span>
            <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
            <span>default base <span style={{ color: T.text2 }}>main</span></span>
          </div>
        </div>
        <Icon name="chevron-down" size={11} color={T.text3}/>
      </button>
    </div>
  );
}

// Reused picker row (same shape as v1 but kept here so v2 is self-contained)
function PickerRowV2({ label, icon, valueIcon, value, valueMono, meta, last }) {
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
            fontSize: 13, fontWeight: 600, color: T.text,
          }}>{value}</div>
          {meta && <div style={{ marginTop: 2 }}>{meta}</div>}
        </div>
        <Icon name="chevron-down" size={11} color={T.text3}/>
      </button>
    </div>
  );
}

function SwapStripV2() {
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

// ═══════════════════════════════════════════════════════════════
// 3 · REPO PICKER POPOVER (rendered as an overlay above the launcher)
// ═══════════════════════════════════════════════════════════════
function RepoPickerPopoverWrap() {
  // Position the popover where the Repo row would be — top-left of the body.
  return (
    <div style={{
      position: 'absolute', top: 130, left: 286, zIndex: 50,
      width: 520,
    }}>
      <RepoPickerPopover/>
    </div>
  );
}

function RepoPickerPopover() {
  return (
    <div style={{
      background: T.surface, borderRadius: 10,
      border: `0.5px solid ${T.border}`,
      boxShadow: '0 4px 14px rgba(0,0,0,0.10), 0 24px 60px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.04)',
      overflow: 'hidden', fontFamily: FONT, color: T.text,
    }}>
      {/* Search field */}
      <div style={{
        padding: '10px 12px', borderBottom: `0.5px solid ${T.borderSoft}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="search" size={13} color={T.text3}/>
        <input
          defaultValue=""
          placeholder="Search registered repos…"
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontSize: 13, color: T.text, fontFamily: FONT,
          }}
          readOnly
        />
        <Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>↵</Kbd>
      </div>

      {/* Repo list */}
      <div style={{ maxHeight: 360, overflow: 'auto' }}>
        <PopoverSectionLabel>Recent</PopoverSectionLabel>
        {REGISTERED_REPOS.slice(0, 3).map((r, i) => (
          <RepoListRow key={r.id} repo={r} selected={i === 0}/>
        ))}
        <PopoverSectionLabel>All registered</PopoverSectionLabel>
        {REGISTERED_REPOS.slice(3).map(r => (
          <RepoListRow key={r.id} repo={r}/>
        ))}
      </div>

      {/* Footer — add-repo entry */}
      <button style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', border: 'none',
        borderTop: `0.5px solid ${T.borderSoft}`, background: T.surface2,
        cursor: 'pointer', textAlign: 'left', color: T.link, fontSize: 13, fontWeight: 500,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          background: T.unreadBg, color: T.link,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="plus" size={13} color={T.link}/>
        </div>
        <span style={{ flex: 1 }}>Add repo…</span>
        <Kbd>⌘O</Kbd>
      </button>
    </div>
  );
}

function PopoverSectionLabel({ children }) {
  return (
    <div style={{
      padding: '8px 14px 4px',
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
      color: T.text3, background: T.surface,
    }}>{children}</div>
  );
}

function RepoListRow({ repo, selected }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 14px',
      background: selected ? T.selectionBg : 'transparent',
      borderLeft: selected ? `2px solid ${T.link}` : '2px solid transparent',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
        background: `oklch(0.78 0.08 ${(repo.id.charCodeAt(2) * 41) % 360})`,
        color: 'oklch(0.32 0.10 200)', fontSize: 9, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{repo.name.slice(0, 2).toUpperCase()}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: T.text, fontWeight: selected ? 600 : 500 }}>
          {repo.org}/{repo.name}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.text3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {repo.path}
          {repo.worktrees > 1 && <span style={{ color: T.text2 }}> · {repo.worktrees} worktrees</span>}
        </div>
      </div>
      <span style={{ fontSize: 11, color: T.text3, fontVariantNumeric: 'tabular-nums' }}>{repo.lastUsed}</span>
      <button title="Repo settings" style={{
        width: 20, height: 20, border: 'none', borderRadius: 4,
        background: 'transparent', color: T.text3, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name="kebab" size={11}/></button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4 · ADD REPO DIALOG — folder picker with validation preview
// ═══════════════════════════════════════════════════════════════
function PrePRAddRepoDialog({ width = 1100, height = 740 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Pre-PR Review" subtitle="Add a repo"
      appSidebar={<AppSidebar active="local"/>}
      sidebar={<PrePRSidebarPopulated/>}
      sidebarWidth={232}
      status={<PrePRLauncherStatus/>}
      overlay={<AddRepoModal/>}
    >
      {/* Dim version of the launcher behind the modal */}
      <div style={{ flex: 1, overflow: 'auto', background: T.panel, padding: '24px 28px', opacity: 0.45, pointerEvents: 'none' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h1 style={{
            margin: 0, fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4,
            color: T.text, lineHeight: 1.2,
          }}>Pick a repo and compare two refs</h1>
        </div>
      </div>
    </PierWindow>
  );
}

function AddRepoModal() {
  return (
    <div style={{
      width: 580, background: T.windowBg, borderRadius: 12,
      border: `0.5px solid ${T.border}`,
      boxShadow: '0 24px 60px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(0,0,0,0.20)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: FONT, color: T.text,
    }}>
      <div style={{
        height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `0.5px solid ${T.border}`, background: T.surface2,
      }}>
        <Icon name="folder-plus" size={14} color={T.link}/>
        <b style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.1 }}>Add repo</b>
        <div style={{ flex: 1 }}/>
        <button title="Close · Esc" style={{
          width: 24, height: 24, borderRadius: 5, border: `0.5px solid ${T.borderStrong}`,
          background: T.surface, cursor: 'pointer', color: T.text2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="x" size={11}/></button>
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Drop / pick zone */}
        <div style={{
          padding: '22px 16px', borderRadius: 10,
          border: `1.5px dashed ${T.link}`, background: T.unreadBg,
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}>
          <Icon name="drop" size={28} color={T.link}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Drop a folder here</div>
            <div style={{ fontSize: 12, color: T.text2 }}>Or use one of the actions below.</div>
          </div>
          <Button kind="default" size="md" icon="folder">Choose folder…</Button>
        </div>

        {/* Validated path preview */}
        <div>
          <SectionLabelV2>Resolved repo</SectionLabelV2>
          <div style={{
            background: T.surface, border: `0.5px solid ${T.successBd}`, borderRadius: 8,
            boxShadow: `0 0 0 3px ${T.isDark ? 'rgba(63,185,80,0.10)' : 'rgba(48,161,76,0.08)'}`,
            padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Icon name="check-circle" size={16} color={T.pass}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>eventmobi/analytics</span>
                <Pill bg={T.successBg} color={T.pass} weight={600}>valid git repo</Pill>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', rowGap: 4, fontSize: 12 }}>
                <span style={{ color: T.text3 }}>Path</span>
                <span style={{ fontFamily: MONO, fontSize: 11 }}>~/code/analytics</span>
                <span style={{ color: T.text3 }}>Remote</span>
                <span style={{ fontFamily: MONO, fontSize: 11 }}>git@github.com:eventmobi/analytics.git</span>
                <span style={{ color: T.text3 }}>Default branch</span>
                <span style={{ fontFamily: MONO, fontSize: 11 }}>main</span>
                <span style={{ color: T.text3 }}>Worktrees</span>
                <span>1 (this folder)</span>
                <span style={{ color: T.text3 }}>Last commit</span>
                <span><b style={{ fontFamily: MONO, fontSize: 11 }}>sara-l</b> 3h ago — “RFC: cohort export pipeline (S3 + Athena)”</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <SectionLabelV2>Settings</SectionLabelV2>
          <div style={{
            background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8,
            overflow: 'hidden',
          }}>
            <ModalSettingRow label="Display name" value="eventmobi/analytics" hint="Defaults to org/name from the remote."/>
            <ModalSettingRow label="Default base branch" value="main" hint="Pre-PR reviews start with this branch as the comparison base."/>
            <ModalSettingRow last label="Scan parent for sibling repos" value="No" toggle hint="If on, Pier will also offer to add other git repos in ~/code/"/>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        height: 56, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10,
        borderTop: `0.5px solid ${T.border}`, background: T.surface,
      }}>
        <span style={{ fontSize: 11.5, color: T.text3, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="info" size={11}/>
          Pier stores paths locally — nothing is uploaded to GitHub.
        </span>
        <div style={{ flex: 1 }}/>
        <Button kind="ghost" size="md">Cancel</Button>
        <Button kind="primary" size="md" icon="plus">Add repo</Button>
      </div>
    </div>
  );
}

function SectionLabelV2({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
      color: T.text3, marginBottom: 8,
    }}>{children}</div>
  );
}

function ModalSettingRow({ label, value, hint, last, toggle }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '170px 1fr',
      padding: '10px 14px', alignItems: 'center',
      borderBottom: last ? 'none' : `0.5px solid ${T.borderSoft}`,
      columnGap: 12, rowGap: 2,
    }}>
      <span style={{ fontSize: 12.5, color: T.text, fontWeight: 500 }}>{label}</span>
      {toggle ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <span style={{ fontSize: 12, color: T.text2 }}>{value}</span>
        </div>
      ) : (
        <button style={{
          textAlign: 'left', background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
          borderRadius: 5, padding: '6px 10px', fontFamily: FONT, fontSize: 12.5, color: T.text,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ flex: 1 }}>{value}</span>
          <Icon name="chevron-down" size={10} color={T.text3}/>
        </button>
      )}
      <span style={{ gridColumn: '2', fontSize: 11, color: T.text3 }}>{hint}</span>
    </div>
  );
}

Object.assign(window, {
  PrePRLauncherEmptyScreen,
  PrePRLauncherV2Screen,
  PrePRAddRepoDialog,
  RepoPickerPopover,
});
