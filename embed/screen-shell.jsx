// App shell restructure (sidebar v2).
// The persistent app sidebar lives at the window level via PierWindow's
// `appSidebar` prop. Screens here pass content as children; the sidebar
// stays mounted as the user navigates between Inbox, Pull requests,
// Local reviews, Settings, and into PR detail.

// ── Inbox · notifications feed ────────────────────────────────
// Sources from /notifications. Each row is an activity item, not a PR.
// Denser than the Pull-requests rows.

const NOTIFS = [
  {
    id: 'n1', reason: 'review_requested', unread: true,
    actor: 'priya-r', verb: 'requested your review on',
    title: 'feat(scheduler): coalesce identical session pushes into a single fan-out',
    repo: 'northwind/web-event-app', num: 9241, age: '3m',
  },
  {
    id: 'n2', reason: 'comment', unread: true,
    actor: 'marcus-w', verb: 'commented on your PR',
    title: 'perf(diff-render): virtualise hunks larger than 2k lines',
    repo: 'northwind/web-event-app', num: 9217, age: '12m',
    snippet: 'One blocker: this changes the public ResizeObserver contract on HunkWindow. The mobile target depends on the old shape — can we add an adapter?',
    codeLoc: 'src/diff/HunkWindow.ts:42',
  },
  {
    id: 'n3', reason: 'mention', unread: true,
    actor: 'alex-cho', verb: 'mentioned you in',
    title: 'RFC: cohort export pipeline (S3 + Athena)',
    repo: 'northwind/analytics', num: 308, age: '1h',
    snippet: '@alex-cho any thoughts on partitioning by event_date here? worried about hot-spotting on launch days.',
  },
  {
    id: 'n4', reason: 'review_requested', unread: true,
    actor: 'jules-k', verb: 'requested your review on',
    title: 'Empty-state polish for event picker on small viewports',
    repo: 'northwind/design-system', num: 612, age: '2h',
  },
  {
    id: 'n5', reason: 'comment', unread: false,
    actor: 'priya-r', verb: 'replied to your thread on',
    title: 'perf(diff-render): virtualise hunks larger than 2k lines',
    repo: 'northwind/web-event-app', num: 9217, age: '4h',
    snippet: "Good call — I've split the path into two and added the regression. Re-requesting review now.",
    codeLoc: 'src/diff/VirtualHunk.tsx:128',
  },
  {
    id: 'n6', reason: 'state_change', unread: false,
    actor: 'github', verb: 'merged',
    title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle',
    repo: 'northwind/api', num: 4471, age: '5h',
  },
  {
    id: 'n7', reason: 'assigned', unread: false,
    actor: 'sara-l', verb: 'assigned you to',
    title: 'spike: replace Redux with Zustand on the attendee dashboard',
    repo: 'northwind/web-event-app', num: 9198, age: '8h',
  },
  {
    id: 'n8', reason: 'comment', unread: false,
    actor: 'nicolae-i', verb: 'commented on',
    title: 'feat(ios): persist scroll offset across PR-list refreshes',
    repo: 'northwind/mobile-ios', num: 1183, age: '11h',
    snippet: 'Should we also handle the case where the cached offset exceeds the new list length after a refresh removes rows above it?',
  },
  {
    id: 'n9', reason: 'state_change', unread: false,
    actor: 'marcus-w', verb: 'closed',
    title: 'WIP: lazy-load the print/export pipeline',
    repo: 'northwind/web-event-app', num: 9168, age: '1d',
  },
  {
    id: 'n10', reason: 'subscribed', unread: false,
    actor: 'dependabot', verb: 'opened',
    title: 'chore(deps): bump pg from 8.11.3 to 8.13.0',
    repo: 'northwind/api', num: 4469, age: '1d',
  },
];

// reason → display config
const REASON_CFG = {
  review_requested: { label: 'Review',     fg: () => T.link,   bgKey: 'selectionBg' },
  mention:          { label: 'Mention',    fg: () => T.warn,   bgKey: 'warnBg'      },
  comment:          { label: 'Comment',    fg: () => T.text2,  bgKey: 'sidebar2'    },
  state_change:     { label: 'Update',     fg: () => T.merged, bgKey: 'sidebar2'    },
  assigned:         { label: 'Assigned',   fg: () => T.pass,   bgKey: 'successBg'   },
  subscribed:       { label: 'Subscribed', fg: () => T.text3,  bgKey: 'sidebar2'    },
};

function InboxV2Screen({ width = 1320, height = 820, view = {} }) {
  const v = { sidebarCollapsed: false, ...view };
  return (
    <PierWindow
      width={width} height={height}
      title="Inbox" subtitle="4 unread · 10 in feed"
      appSidebar={<AppSidebar active="inbox" collapsed={v.sidebarCollapsed}/>}
      appSidebarWidth={v.sidebarCollapsed ? 52 : 220}
      toolbar={<InboxV2Toolbar/>}
      status={<InboxV2Status/>}
    >
      <InboxV2FilterBar/>
      <InboxV2List hoveredId="n2"/>
    </PierWindow>
  );
}

function InboxV2Toolbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 8px', height: 24, borderRadius: 5,
        background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        width: 220,
      }}>
        <Icon name="search" size={12} color={T.text3}/>
        <span style={{ flex: 1, fontSize: 12, color: T.text3 }}>Search notifications</span>
        <Kbd>⌘F</Kbd>
      </div>
      <Button kind="ghost" size="sm" icon="refresh">Refresh</Button>
      <Button kind="ghost" size="sm" icon="mark-read">Mark all read</Button>
    </div>
  );
}

function InboxV2Status() {
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
        Connected · alex-cho
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Last checked <span style={{ color: T.text }}>14s ago</span> · 60s cadence</span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>4 unread of 10</span>
      <span style={{ flex: 1 }}/>
      <span style={{ marginRight: 8 }}>Rate: 4,983 / 5,000</span>
    </>
  );
}

function InboxV2FilterBar() {
  return (
    <div style={{
      flexShrink: 0, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: `0.5px solid ${T.border}`, background: T.panel,
    }}>
      <NotifFilterChip label="Unread only" active/>
      <NotifFilterChip label="Reason: any"/>
      <NotifFilterChip label="Repo: any"/>
      <div style={{ flex: 1 }}/>
      <span style={{ fontSize: 11.5, color: T.text3 }}>
        Click row to open · <Kbd>E</Kbd> mark read · <Kbd>⇧E</Kbd> mark all
      </span>
    </div>
  );
}

function NotifFilterChip({ label, active }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 22, padding: '0 8px', borderRadius: 11,
      background: active ? T.selectionBg : T.surface,
      border: `0.5px solid ${active ? T.selectionBd : T.borderStrong}`,
      fontSize: 11.5, color: active ? T.link : T.text2, fontWeight: 500,
    }}>
      {label}
      <Icon name="chevron-down" size={9}/>
    </span>
  );
}

function InboxV2List({ hoveredId }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.surface }}>
      {NOTIFS.map((n, i) => (
        <NotifRow key={n.id} n={n} hovered={n.id === hoveredId}/>
      ))}
      {/* trailing rule */}
      <div style={{ padding: '14px 16px', fontSize: 11.5, color: T.text3, textAlign: 'center' }}>
        No older notifications · GitHub returns up to 50 in /notifications
      </div>
    </div>
  );
}

function NotifRow({ n, hovered }) {
  const cfg = REASON_CFG[n.reason];
  const isUnread = n.unread;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 16px 9px',
      borderBottom: `0.5px solid ${T.borderSoft}`,
      background: hovered ? T.hover : isUnread ? T.unreadBg : 'transparent',
      cursor: 'pointer', position: 'relative',
    }}>
      {/* unread dot column */}
      <div style={{ width: 8, paddingTop: 6, flexShrink: 0 }}>
        {isUnread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.unread }}/>}
      </div>

      {/* avatar */}
      <div style={{ paddingTop: 1, flexShrink: 0 }}>
        <Avatar name={n.actor} size={20}/>
      </div>

      {/* main column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* line 1: reason chip · "actor verb" · timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <ReasonChip reason={n.reason}/>
          <span style={{ fontSize: 12.5, color: T.text2, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <b style={{ color: T.text, fontWeight: 600 }}>{n.actor}</b> {n.verb}
          </span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11.5, color: T.text3, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
            {n.age}
          </span>
        </div>

        {/* line 2: PR title · #num · repo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: n.snippet ? 4 : 2 }}>
          <span style={{
            fontSize: 13, fontWeight: isUnread ? 600 : 500,
            color: T.text, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', maxWidth: 760,
          }}>{n.title}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>#{n.num}</span>
          <span style={{ color: T.text4 }}>·</span>
          <span style={{ fontSize: 12, color: T.text2 }}>{n.repo}</span>
        </div>

        {/* line 3: snippet */}
        {n.snippet && (
          <div style={{
            fontSize: 12, color: T.text2, lineHeight: 1.45,
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            maxWidth: 760, marginBottom: n.codeLoc ? 3 : 0,
          }}>
            <span style={{ color: T.text4 }}>"</span>{n.snippet}<span style={{ color: T.text4 }}>"</span>
          </div>
        )}

        {/* line 4: code location */}
        {n.codeLoc && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: T.text3 }}>
            <Icon name="file" size={11} color={T.text3}/>
            <span style={{ fontFamily: MONO }}>{n.codeLoc}</span>
          </div>
        )}
      </div>

      {/* hover actions — only render when hovered */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 8, right: 12,
          display: 'flex', alignItems: 'center', gap: 4,
          background: T.surface, border: `0.5px solid ${T.border}`,
          borderRadius: 6, padding: 2,
          boxShadow: T.isDark ? '0 2px 6px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05)',
        }}>
          <HoverAction icon="mark-read" label="Mark read" kbd="E"/>
          <HoverAction icon="external" label="Open on GitHub" kbd="⌘O"/>
        </div>
      )}
    </div>
  );
}

function ReasonChip({ reason }) {
  const cfg = REASON_CFG[reason];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 17, padding: '0 6px', borderRadius: 4,
      background: T[cfg.bgKey], color: cfg.fg(),
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.3,
      textTransform: 'uppercase', flexShrink: 0,
      border: `0.5px solid ${reason === 'review_requested' ? T.selectionBd : reason === 'mention' ? T.warnBd : reason === 'assigned' ? T.successBd : T.border}`,
    }}>
      {cfg.label}
    </span>
  );
}

function HoverAction({ icon, label, kbd }) {
  return (
    <button title={`${label} · ${kbd}`} style={{
      height: 24, padding: '0 8px', borderRadius: 4,
      background: 'transparent', border: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      color: T.text2, fontSize: 12, fontFamily: FONT, fontWeight: 500,
    }}>
      <Icon name={icon} size={12}/>
      {label}
    </button>
  );
}

// ── Inbox empty state ─────────────────────────────────────────
function InboxV2EmptyScreen({ width = 1320, height = 820 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Inbox" subtitle="0 unread"
      appSidebar={<AppSidebar active="inbox" badges={{ inbox: 0 }}/>}
      toolbar={<InboxV2Toolbar/>}
      status={<InboxV2Status/>}
    >
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 48, background: T.panel, textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: T.surface, border: `0.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 16,
        }}>
          <Icon name="check" size={26} color={T.pass} strokeWidth={2}/>
        </div>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
          You're all caught up.
        </h2>
        <p style={{ margin: '8px 0 18px', fontSize: 13.5, color: T.text2, maxWidth: 420, lineHeight: 1.5 }}>
          No new review requests, mentions or replies. New activity will appear here within 60 seconds.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 7,
          background: T.surface, border: `0.5px solid ${T.border}`,
          fontSize: 12, color: T.text2,
        }}>
          <Icon name="clock" size={12} color={T.text3}/>
          Last checked <b style={{ color: T.text }}>14s ago</b>
          <span style={{ color: T.text4 }}>·</span>
          <button style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: T.link, fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0,
          }}>
            <Icon name="refresh" size={11}/> Refresh now
          </button>
        </div>
      </div>
    </PierWindow>
  );
}

// ── Pull requests · catalog with My PRs / Reviewing tabs ──────

const MY_PRS = [
  { unread: 0, status: 'open',  title: "feat(ios): persist scroll offset across PR-list refreshes", repo: 'northwind/mobile-ios', branch: 'feat/persist-scroll', num: 1183, author: 'alex-cho', age: '11h', additions: 28, deletions: 5, files: 2, checks: { pass: 7, fail: 0, pending: 0 }, reviews: { req: 0, approved: 1, changes: 0 }, comments: 1, approved: true },
  { unread: 1, status: 'open',  title: "refactor(notifications): pull /notifications into shared client", repo: 'northwind/web-event-app', branch: 'refactor/notifs-client', num: 9244, author: 'alex-cho', age: '1d', additions: 218, deletions: 184, files: 9, checks: { pass: 18, fail: 0, pending: 0 }, reviews: { req: 2, approved: 0, changes: 0 }, comments: 4 },
  { unread: 0, status: 'draft', title: "RFC: introduce a Pre-PR review surface in Pyor", repo: 'northwind/web-event-app', branch: 'rfc/pre-pr', num: 9201, author: 'alex-cho', age: '2d', additions: 612, deletions: 8, files: 14, checks: { pass: 16, fail: 0, pending: 1 }, reviews: { req: 0, approved: 0, changes: 0 }, comments: 12, draft: true },
];

const REVIEWING_PRS = [
  { unread: 3, status: 'open',  title: "feat(scheduler): coalesce identical session pushes into a single fan-out", repo: 'northwind/web-event-app', branch: 'feat/coalesce-push', num: 9241, author: 'priya-r', age: '12m', additions: 412, deletions: 89, files: 14, checks: { pass: 18, fail: 0, pending: 2 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 4 },
  { unread: 5, status: 'open',  title: "perf(diff-render): virtualise hunks larger than 2k lines", repo: 'northwind/web-event-app', branch: 'perf/virtualise-hunks', num: 9217, author: 'nicolae-i', age: '1d', additions: 904, deletions: 311, files: 7, checks: { pass: 16, fail: 2, pending: 0 }, reviews: { req: 2, approved: 0, changes: 1 }, comments: 23, changes: true },
  { unread: 0, status: 'open',  title: "fix(billing): correct prorated charge math when plan downgrades mid-cycle", repo: 'northwind/api', branch: 'fix/proration', num: 4471, author: 'marcus-w', age: '1h', additions: 38, deletions: 47, files: 4, checks: { pass: 23, fail: 0, pending: 0 }, reviews: { req: 0, approved: 1, changes: 0 }, comments: 7 },
  { unread: 2, status: 'open',  title: "Empty-state polish for event picker on small viewports", repo: 'northwind/design-system', branch: 'polish/empty-states', num: 612, author: 'jules-k', age: '7h', additions: 64, deletions: 22, files: 3, checks: { pass: 11, fail: 0, pending: 0 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 2 },
  { unread: 1, status: 'draft', title: "RFC: cohort export pipeline (S3 + Athena)", repo: 'northwind/analytics', branch: 'rfc/cohort-export', num: 308, author: 'sara-l', age: '3h', additions: 1240, deletions: 12, files: 38, checks: { pass: 4, fail: 1, pending: 3 }, reviews: { req: 0, approved: 0, changes: 0 }, comments: 12, draft: true },
  { unread: 1, status: 'open',  title: "spike: replace Redux with Zustand on the attendee dashboard", repo: 'northwind/web-event-app', branch: 'spike/zustand', num: 9198, author: 'marcus-w', age: '2d', additions: 1820, deletions: 1640, files: 56, checks: { pass: 14, fail: 0, pending: 0 }, reviews: { req: 3, approved: 1, changes: 0 }, comments: 31 },
];

function PullRequestsScreen({ width = 1320, height = 820, view = {} }) {
  const v = { tab: 'reviewing', empty: null, ...view };
  // empty: 'mine' | 'reviewing' | 'no-token' | 'filtered' | null
  return (
    <PierWindow
      width={width} height={height}
      title="Pull requests"
      subtitle={v.tab === 'mine' ? 'Authored by you' : 'In your review queue'}
      appSidebar={<AppSidebar active="pulls"/>}
      toolbar={<PullRequestsToolbar empty={v.empty}/>}
      status={<PullRequestsStatus/>}
    >
      <PullRequestsTabs active={v.tab}/>
      {v.empty !== 'no-token' && <PullRequestsFilterBar filtered={v.empty === 'filtered'}/>}
      {v.empty == null
        ? <PullRequestsList rows={v.tab === 'mine' ? MY_PRS : REVIEWING_PRS}/>
        : <PullRequestsEmpty kind={v.empty} tab={v.tab}/>}
    </PierWindow>
  );
}

function PullRequestsToolbar({ empty }) {
  if (empty === 'no-token') {
    return <Button kind="primary" size="sm" icon="key">Connect GitHub</Button>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 8px', height: 24, borderRadius: 5,
        background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        width: 220,
      }}>
        <Icon name="search" size={12} color={T.text3}/>
        <span style={{ flex: 1, fontSize: 12, color: T.text3 }}>Filter PRs</span>
        <Kbd>⌘F</Kbd>
      </div>
      <Button kind="ghost" size="sm" icon="refresh">Refresh</Button>
      <Button kind="default" size="sm" icon="filter">Sort: Activity ↓</Button>
    </div>
  );
}

function PullRequestsStatus() {
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
        Connected · alex-cho
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Last poll <span style={{ color: T.text }}>22s ago</span></span>
      <span style={{ flex: 1 }}/>
      <span style={{ marginRight: 8 }}>54 PRs cached · 42 MB</span>
    </>
  );
}

function PullRequestsTabs({ active }) {
  const tabs = [
    { id: 'mine',      label: 'My PRs',    count: MY_PRS.length },
    { id: 'reviewing', label: 'Reviewing', count: REVIEWING_PRS.length },
  ];
  return (
    <div style={{
      flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0,
      padding: '0 14px', borderBottom: `0.5px solid ${T.border}`,
      background: T.surface,
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '0 12px', height: 38,
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${isActive ? T.link : 'transparent'}`,
            color: isActive ? T.text : T.text2,
            fontWeight: isActive ? 600 : 500, fontSize: 13.5,
            fontFamily: FONT, cursor: 'pointer',
            marginBottom: -0.5,
          }}>
            {t.label}
            <span style={{
              fontSize: 11, padding: '0 6px', height: 16, lineHeight: '16px',
              borderRadius: 8,
              background: isActive ? T.selectionBg : T.sidebar2,
              color: isActive ? T.link : T.text2,
              fontVariantNumeric: 'tabular-nums', fontWeight: 600,
            }}>{t.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function PullRequestsFilterBar({ filtered }) {
  return (
    <div style={{
      flexShrink: 0, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: `0.5px solid ${T.border}`, background: T.panel,
    }}>
      <NotifFilterChip label="Status: Open" active/>
      <NotifFilterChip label={filtered ? 'Repo: northwind/infra' : 'Repo: any'} active={filtered}/>
      <NotifFilterChip label={filtered ? 'Author: dependabot' : 'Author: any'} active={filtered}/>
      <NotifFilterChip label="Label: any"/>
      {filtered && (
        <button style={{
          background: 'transparent', border: 'none', color: T.link,
          fontSize: 12, cursor: 'pointer', padding: '0 4px', fontFamily: 'inherit',
        }}>Clear all</button>
      )}
      <div style={{ flex: 1 }}/>
    </div>
  );
}

function PullRequestsList({ rows }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.surface }}>
      {rows.map((pr, i) => <PRListRow key={i} pr={pr} selected={i === 0}/>)}
    </div>
  );
}

// PR row in catalog (unchanged shape from existing PR row design).
function PRListRow({ pr, selected }) {
  const statusColor = pr.draft ? T.draft : T.open;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 16px', borderBottom: `0.5px solid ${T.borderSoft}`,
      background: selected ? 'rgba(10,132,255,0.07)' : 'transparent',
      position: 'relative', cursor: 'pointer',
    }}>
      {selected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: T.link }}/>}
      <div style={{ width: 8, paddingTop: 6, flexShrink: 0 }}>
        {pr.unread > 0 && <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.unread }}/>}
      </div>
      <div style={{ paddingTop: 2, flexShrink: 0 }}>
        <Icon name={pr.draft ? 'pr-draft' : 'pr-open'} size={15} color={statusColor}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span style={{
            fontSize: 13, fontWeight: pr.unread ? 600 : 500, color: T.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 620,
          }}>{pr.title}</span>
          {pr.changes && <Pill bg={T.failTint} color={T.fail} weight={600}>changes requested</Pill>}
          {pr.approved && <Pill bg={T.successBg} color={T.pass} weight={600}>approved by you</Pill>}
          {pr.draft && <Pill bg={T.sidebar2} color={T.text2}>draft</Pill>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.text2 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>#{pr.num}</span>
          <span>{pr.repo}</span>
          <span style={{ color: T.text4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Avatar name={pr.author} size={14}/>{pr.author}
          </span>
          <span style={{ color: T.text4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="branch" size={11}/>
            <span style={{ fontFamily: MONO, fontSize: 11 }}>{pr.branch}</span>
          </span>
        </div>
      </div>
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14,
        fontSize: 12, color: T.text2, fontVariantNumeric: 'tabular-nums',
      }}>
        <div style={{ textAlign: 'right', minWidth: 90 }}>
          <div style={{ fontSize: 11, color: T.text3 }}>{pr.files} files</div>
          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline', fontFamily: MONO, fontSize: 11 }}>
            <span style={{ color: T.addLine }}>+{pr.additions.toLocaleString()}</span>
            <span style={{ color: T.delLine }}>−{pr.deletions}</span>
          </div>
        </div>
        <div style={{ minWidth: 72 }}>
          <CheckSummary pass={pr.checks.pass} fail={pr.checks.fail} pending={pr.checks.pending}/>
        </div>
        <div style={{ minWidth: 64, display: 'flex', alignItems: 'center', gap: 4 }}>
          {pr.reviews.changes > 0 && <Icon name="x-circle" size={13} color={T.fail}/>}
          {pr.reviews.approved > 0 && <Icon name="check-circle" size={13} color={T.pass}/>}
          {pr.reviews.req > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Icon name="eye" size={12} color={T.text3}/> {pr.reviews.req}
            </span>
          )}
        </div>
        <div style={{ minWidth: 36 }}>
          {pr.comments > 0 ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {pr.unread > 0
                ? <Icon name="comment-fill" size={12} color={T.unread}/>
                : <Icon name="comment" size={12} color={T.text3}/>}
              <span style={{ color: pr.unread > 0 ? T.unread : T.text2, fontWeight: pr.unread ? 600 : 400 }}>
                {pr.comments}{pr.unread > 0 ? ` (${pr.unread})` : ''}
              </span>
            </span>
          ) : <span style={{ color: T.text4 }}>—</span>}
        </div>
        <div style={{ minWidth: 28, color: T.text3, textAlign: 'right' }}>{pr.age}</div>
      </div>
    </div>
  );
}

// Empty-state variants
function PullRequestsEmpty({ kind, tab }) {
  const variants = {
    mine: {
      icon: 'pr-open', glyphColor: T.text3,
      title: 'No open PRs you authored.',
      body: 'Open one in your terminal and refresh — Pyor picks them up as soon as the API does.',
      action: <Button kind="ghost" size="md" icon="refresh">Refresh</Button>,
    },
    reviewing: {
      icon: 'eye', glyphColor: T.text3,
      title: 'Nothing in your review queue.',
      body: 'PRs you\'re a requested reviewer on, have commented on, or are subscribed to will show up here.',
      action: <Button kind="ghost" size="md">Browse your team\'s PRs</Button>,
    },
    'no-token': {
      icon: 'lock', glyphColor: T.fail,
      title: 'Connect GitHub to see your PRs.',
      body: 'Pyor needs a personal access token with repo + notifications scope. Settings stays local — the token lives in your Keychain.',
      action: <Button kind="primary" size="md" icon="key">Connect GitHub</Button>,
    },
    filtered: {
      icon: 'filter', glyphColor: T.text3,
      title: 'No PRs match these filters.',
      body: '2 filters applied. Clear them to see the full list, or adjust them above.',
      action: <Button kind="default" size="md">Clear all filters</Button>,
    },
  };
  const v = variants[kind];
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 48, background: T.panel, textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: T.surface, border: `0.5px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 16,
      }}>
        <Icon name={v.icon} size={24} color={v.glyphColor} strokeWidth={1.6}/>
      </div>
      <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
        {v.title}
      </h2>
      <p style={{ margin: '8px 0 18px', fontSize: 13, color: T.text2, maxWidth: 440, lineHeight: 1.55 }}>
        {v.body}
      </p>
      {v.action}
      {kind === 'filtered' && (
        <div style={{
          marginTop: 22, display: 'flex', gap: 6, alignItems: 'center',
          padding: '6px 10px', borderRadius: 7,
          background: T.surface, border: `0.5px solid ${T.border}`,
          fontSize: 11.5, color: T.text2,
        }}>
          <span style={{ color: T.text3 }}>Active filters:</span>
          <NotifFilterChip label="Repo: northwind/infra" active/>
          <NotifFilterChip label="Author: dependabot" active/>
        </div>
      )}
    </div>
  );
}

// ── Local reviews · placeholder ──────────────────────────────
function LocalReviewsScreen({ width = 1320, height = 820 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Local reviews" subtitle="Coming soon"
      appSidebar={<AppSidebar active="local"/>}
      status={
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
            Connected · alex-cho
          </span>
          <span style={{ flex: 1 }}/>
          <span style={{ marginRight: 8 }}>Pre-PR engine v2 · in development</span>
        </>
      }
    >
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 48, background: T.panel, textAlign: 'center',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: T.surface, border: `0.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 18,
          position: 'relative',
        }}>
          <Icon name="local-app" size={28} color={T.text2} strokeWidth={1.6}/>
          <span style={{
            position: 'absolute', bottom: -6, right: -6,
            padding: '1px 6px', borderRadius: 4,
            background: T.warnBg, color: T.warnFg,
            border: `0.5px solid ${T.warnBd}`,
            fontSize: 9.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase',
          }}>Soon</span>
        </div>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
          Local reviews
        </h2>
        <p style={{ margin: '8px 0 22px', fontSize: 13.5, color: T.text2, maxWidth: 480, lineHeight: 1.55 }}>
          Review your own local branch before the PR exists on GitHub. Reuses Pyor's diff renderer,
          file rail and comment threads — notes carry over the moment you open the PR.
        </p>
        <div style={{
          width: 480, padding: '12px 14px', borderRadius: 8,
          background: T.surface, border: `0.5px solid ${T.border}`,
          textAlign: 'left', fontSize: 12.5, color: T.text2, lineHeight: 1.6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, color: T.text }}>
            <Icon name="info" size={13} color={T.link}/>
            <b style={{ fontWeight: 600 }}>Migrating from "Pre-PR review"</b>
          </div>
          The standalone "Pre-PR review" surface is being folded into this screen in v1.4.
          Existing notes attached to local branches keep working in the meantime.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <Button kind="ghost" size="md" icon="external">Read the spec</Button>
          <Button kind="default" size="md" icon="terminal">Open old Pre-PR launcher</Button>
        </div>
      </div>
    </PierWindow>
  );
}

// ── PR detail with the new external sidebar ──────────────────
// Reuses the existing FilesChangedScreen but injects the app sidebar
// and sets the back-affordance label to track where the user came from.
function PRDetailShellScreen({ width = 1320, height = 900, from = 'inbox', view = {} }) {
  return (
    <FilesChangedScreen
      width={width} height={height}
      view={view}
      appSidebar={<AppSidebar active={from === 'inbox' ? 'inbox' : 'pulls'}/>}
      from={from}
    />
  );
}

Object.assign(window, {
  InboxV2Screen, InboxV2EmptyScreen,
  PullRequestsScreen,
  LocalReviewsScreen,
  PRDetailShellScreen,
});
