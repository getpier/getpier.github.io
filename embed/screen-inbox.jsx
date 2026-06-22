// Inbox — PR list. Most-opened screen.
// Sidebar: three lenses + saved searches + repos. Main: dense list with status,
// title, repo, author, age, checks, reviews, comments.

function InboxScreen({ width = 1320, height = 820 }) {
  // Legacy lens-based Inbox (PR list). Kept for comparison only — the v2
  // Inbox in section 00 is a notifications feed. The internal filter
  // sidebar has been retired (spec: no filtering inside the sidebar);
  // filtering lives in the in-screen toolbar.
  return (
    <PierWindow
      width={width} height={height}
      title="Inbox" subtitle="32 awaiting your review"
      appSidebar={<AppSidebar active="inbox"/>}
      toolbar={<InboxToolbar/>}
      status={<InboxStatus/>}
    >
      <InboxFilterBar/>
      <InboxList/>
    </PierWindow>
  );
}

function InboxSidebar() {
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingTop: 6 }}>
      <SidebarSection title="Saved">
        <SidebarItem icon="filter" label="Needs my approval" count="3"/>
        <SidebarItem icon="filter" label="Drafts mentioning me" count="2"/>
        <SidebarItem icon="filter" label="Failing checks" count="5" badgeColor={T.fail}/>
        <SidebarItem icon="filter" label="Over 7 days old" count="9" badgeColor={T.warn}/>
      </SidebarSection>

      <SidebarSection title="Repos in Inbox">
        <SidebarItem icon="folder" label="eventmobi/web-event-app" count="11"/>
        <SidebarItem icon="folder" label="eventmobi/api" count="7"/>
        <SidebarItem icon="folder" label="eventmobi/mobile-ios" count="5"/>
        <SidebarItem icon="folder" label="eventmobi/design-system" count="4"/>
        <SidebarItem icon="folder" label="eventmobi/infra" count="3"/>
        <SidebarItem icon="folder" label="eventmobi/analytics" count="2"/>
      </SidebarSection>

      <div style={{ height: 12 }}/>

      <SidebarSection title="Teams">
        <SidebarItem icon="folder-open" label="@eventmobi/frontend" count="14"/>
        <SidebarItem icon="folder-open" label="@eventmobi/platform" count="6"/>
      </SidebarSection>
    </div>
  );
}

function InboxToolbar() {
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

function InboxStatus() {
  return (
    <>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
        Connected · alex-cho
      </span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Last poll <span style={{ color: T.text }}>14s ago</span> · 60s cadence</span>
      <span style={{ margin: '0 12px', color: T.border }}>│</span>
      <span>Rate: 4,983 / 5,000</span>
      <span style={{ flex: 1 }}/>
      <span style={{ marginRight: 8 }}>54 PRs cached · 42 MB</span>
    </>
  );
}

function InboxFilterBar() {
  // segmented lens tabs + saved query chips
  const Tab = ({ label, count, active, color }) => (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '0 12px', height: 26, borderRadius: 6, border: 'none',
      background: active ? T.surface : 'transparent',
      boxShadow: active ? (T.isDark ? '0 1px 2px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)' : '0 1px 2px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.10)') : 'none',
      fontFamily: FONT, fontSize: 13, color: active ? T.text : T.text2,
      fontWeight: active ? 600 : 500, cursor: 'pointer',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }}/>
      {label}
      <span style={{ fontSize: 11, color: T.text3, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{count}</span>
    </button>
  );
  return (
    <div style={{
      flexShrink: 0, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: `0.5px solid ${T.border}`, background: T.panel,
    }}>
      <div style={{
        display: 'inline-flex', padding: 2, gap: 2, borderRadius: 7,
        background: T.sidebar2,
      }}>
        <Tab label="Inbox" count="32" active color={T.link}/>
        <Tab label="Mine" count="8" color={T.text3}/>
        <Tab label="Participating" count="14" color={T.text3}/>
      </div>
      <div style={{ flex: 1 }}/>
      <FilterChip label="Status" value="Open"/>
      <FilterChip label="Author" value="any"/>
      <FilterChip label="Checks" value="any" />
      <FilterChip label="Age" value="any"/>
      <button style={{
        background: 'transparent', border: 'none', color: T.link, fontSize: 12, cursor: 'pointer',
        padding: '0 4px',
      }}>Clear</button>
    </div>
  );
}

function FilterChip({ label, value }) {
  const active = value !== 'any';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 22, padding: '0 8px', borderRadius: 11,
      background: active ? T.selectionBg : T.surface,
      border: `0.5px solid ${active ? T.selectionBd : T.borderStrong}`,
      fontSize: 11.5, color: active ? T.link : T.text2, fontWeight: 500,
    }}>
      {label}: <span style={{ color: active ? T.link : T.text, fontWeight: 600 }}>{value}</span>
      <Icon name="chevron-down" size={9}/>
    </span>
  );
}

// ── List ──────────────────────────────────────────────────────
const PRS = [
  { unread: 3, status: 'open', title: "feat(scheduler): coalesce identical session pushes into a single fan-out", repo: 'eventmobi/web-event-app', branch: 'feat/coalesce-push', num: 9241, author: 'priya-r', age: '12m', additions: 412, deletions: 89, files: 14, checks: { pass: 18, fail: 0, pending: 2 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 4, reviewerOf: 'team', mine: false, draft: false },
  { unread: 0, status: 'open', title: "fix(billing): correct prorated charge math when plan downgrades mid-cycle", repo: 'eventmobi/api', branch: 'fix/proration', num: 4471, author: 'marcus-w', age: '1h', additions: 38, deletions: 47, files: 4, checks: { pass: 23, fail: 0, pending: 0 }, reviews: { req: 0, approved: 1, changes: 0 }, comments: 7, reviewerOf: 'direct', mine: false, draft: false },
  { unread: 1, status: 'draft', title: "RFC: cohort export pipeline (S3 + Athena)", repo: 'eventmobi/analytics', branch: 'rfc/cohort-export', num: 308, author: 'sara-l', age: '3h', additions: 1240, deletions: 12, files: 38, checks: { pass: 4, fail: 1, pending: 3 }, reviews: { req: 0, approved: 0, changes: 0 }, comments: 12, reviewerOf: 'mention', mine: false, draft: true },
  { unread: 0, status: 'open', title: "chore(deps): bump pg from 8.11.3 to 8.13.0", repo: 'eventmobi/api', branch: 'dependabot/npm/pg-8.13.0', num: 4469, author: 'dependabot', age: '4h', additions: 2, deletions: 2, files: 1, checks: { pass: 23, fail: 0, pending: 0 }, reviews: { req: 0, approved: 2, changes: 0 }, comments: 0, reviewerOf: 'team', mine: false, draft: false, bot: true },
  { unread: 2, status: 'open', title: "Empty-state polish for event picker on small viewports", repo: 'eventmobi/design-system', branch: 'polish/empty-states', num: 612, author: 'jules-k', age: '7h', additions: 64, deletions: 22, files: 3, checks: { pass: 11, fail: 0, pending: 0 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 2, reviewerOf: 'direct', mine: false, draft: false },
  { unread: 0, status: 'open', title: "feat(ios): persist scroll offset across PR-list refreshes", repo: 'eventmobi/mobile-ios', branch: 'feat/persist-scroll', num: 1183, author: 'alex-cho', age: '11h', additions: 28, deletions: 5, files: 2, checks: { pass: 7, fail: 0, pending: 0 }, reviews: { req: 0, approved: 1, changes: 0 }, comments: 1, reviewerOf: 'team', mine: true, draft: false, approved: true },
  { unread: 5, status: 'open', title: "perf(diff-render): virtualise hunks larger than 2k lines", repo: 'eventmobi/web-event-app', branch: 'perf/virtualise-hunks', num: 9217, author: 'nicolae-i', age: '1d', additions: 904, deletions: 311, files: 7, checks: { pass: 16, fail: 2, pending: 0 }, reviews: { req: 2, approved: 0, changes: 1 }, comments: 23, reviewerOf: 'direct', mine: false, draft: false, changes: true },
  { unread: 0, status: 'open', title: "fix(auth): refresh session before WebSocket reconnect", repo: 'eventmobi/web-event-app', branch: 'fix/ws-session-refresh', num: 9209, author: 'priya-r', age: '1d', additions: 18, deletions: 9, files: 2, checks: { pass: 18, fail: 0, pending: 0 }, reviews: { req: 1, approved: 1, changes: 0 }, comments: 3, reviewerOf: 'team', mine: false, draft: false },
  { unread: 1, status: 'open', title: "spike: replace Redux with Zustand on the attendee dashboard", repo: 'eventmobi/web-event-app', branch: 'spike/zustand', num: 9198, author: 'marcus-w', age: '2d', additions: 1820, deletions: 1640, files: 56, checks: { pass: 14, fail: 0, pending: 0 }, reviews: { req: 3, approved: 1, changes: 0 }, comments: 31, reviewerOf: 'team', mine: false, draft: false },
  { unread: 0, status: 'open', title: "Document new PAT scope requirements for SSO orgs", repo: 'eventmobi/web-event-app', branch: 'docs/pat-sso', num: 9192, author: 'sara-l', age: '3d', additions: 78, deletions: 4, files: 2, checks: { pass: 8, fail: 0, pending: 0 }, reviews: { req: 0, approved: 1, changes: 0 }, comments: 1, reviewerOf: 'team', mine: false, draft: false },
  { unread: 0, status: 'open', title: "test(e2e): re-record session-replay fixtures after schema change", repo: 'eventmobi/web-event-app', branch: 'test/refixture', num: 9180, author: 'jules-k', age: '4d', additions: 312, deletions: 286, files: 19, checks: { pass: 17, fail: 0, pending: 1 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 6, reviewerOf: 'team', mine: false, draft: false },
  { unread: 0, status: 'open', title: "feat(infra): pin Node 20.18 in dev container", repo: 'eventmobi/infra', branch: 'feat/pin-node', num: 88, author: 'nicolae-i', age: '5d', additions: 12, deletions: 8, files: 3, checks: { pass: 6, fail: 0, pending: 0 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 0, reviewerOf: 'team', mine: false, draft: false },
  { unread: 0, status: 'open', title: "WIP: lazy-load the print/export pipeline", repo: 'eventmobi/web-event-app', branch: 'wip/lazy-print', num: 9168, author: 'priya-r', age: '8d', additions: 256, deletions: 18, files: 11, checks: { pass: 14, fail: 0, pending: 0 }, reviews: { req: 1, approved: 0, changes: 0 }, comments: 2, reviewerOf: 'team', mine: false, draft: false },
];

function InboxList() {
  // group header
  const Group = ({ label, count }) => (
    <div style={{
      position: 'sticky', top: 0,
      padding: '6px 16px 5px', display: 'flex', alignItems: 'center', gap: 8,
      background: T.surface2, borderBottom: `0.5px solid ${T.border}`,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.text3,
      zIndex: 1,
    }}>
      <Icon name="chevron-down" size={10}/>
      <span>{label}</span>
      <span style={{ color: T.text4, fontWeight: 500 }}>{count}</span>
    </div>
  );

  // Group by age buckets
  const direct = PRS.filter(p => p.reviewerOf === 'direct' || p.reviewerOf === 'mention');
  const team = PRS.filter(p => p.reviewerOf === 'team');

  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.surface }}>
      <Group label="Requested directly · 4" count={`${direct.length} PRs`}/>
      {direct.map((pr, i) => <PRRow key={i} pr={pr} selected={i === 0}/>)}
      <Group label="Via team review · @eventmobi/frontend, @eventmobi/platform" count={`${team.length} PRs`}/>
      {team.map((pr, i) => <PRRow key={i + 100} pr={pr}/>)}
    </div>
  );
}

function PRRow({ pr, selected }) {
  const statusColor = pr.draft ? T.draft : pr.status === 'open' ? T.open : pr.status === 'merged' ? T.merged : T.closed;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 16px', borderBottom: `0.5px solid ${T.borderSoft}`,
      background: selected ? 'rgba(10,132,255,0.07)' : 'transparent',
      position: 'relative',
      cursor: 'pointer',
    }}>
      {selected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: T.link }}/>}

      {/* unread dot */}
      <div style={{ width: 8, paddingTop: 6, flexShrink: 0 }}>
        {pr.unread > 0 && <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.unread }}/>}
      </div>

      {/* status icon */}
      <div style={{ paddingTop: 2, flexShrink: 0 }}>
        <Icon name={pr.draft ? 'pr-draft' : 'pr-open'} size={15} color={statusColor}/>
      </div>

      {/* main column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span style={{
            fontSize: 13, fontWeight: pr.unread ? 600 : 500, color: T.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 620,
          }}>{pr.title}</span>
          {pr.changes && (
            <Pill bg={T.failTint} color={T.fail} weight={600}>changes requested</Pill>
          )}
          {pr.approved && (
            <Pill bg={T.successBg} color={T.pass} weight={600}>approved by you</Pill>
          )}
          {pr.bot && (
            <Pill bg={T.sidebar2} color={T.text2}>bot</Pill>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.text2 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>#{pr.num}</span>
          <span>{pr.repo}</span>
          <span style={{ color: T.text4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Avatar name={pr.author} size={14}/>
            {pr.author}
          </span>
          <span style={{ color: T.text4 }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="branch" size={11}/>
            <span style={{ fontFamily: MONO, fontSize: 11 }}>{pr.branch}</span>
          </span>
        </div>
      </div>

      {/* right column */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14,
        fontSize: 12, color: T.text2, fontVariantNumeric: 'tabular-nums',
      }}>
        {/* file count + diff stat */}
        <div style={{ textAlign: 'right', minWidth: 90 }}>
          <div style={{ fontSize: 11, color: T.text3 }}>{pr.files} files</div>
          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline', fontFamily: MONO, fontSize: 11 }}>
            <span style={{ color: T.addLine }}>+{pr.additions.toLocaleString()}</span>
            <span style={{ color: T.delLine }}>−{pr.deletions}</span>
          </div>
        </div>

        {/* checks */}
        <div style={{ minWidth: 72 }}>
          <CheckSummary pass={pr.checks.pass} fail={pr.checks.fail} pending={pr.checks.pending}/>
        </div>

        {/* reviewers */}
        <div style={{ minWidth: 64, display: 'flex', alignItems: 'center', gap: 4 }}>
          {pr.reviews.changes > 0 && <Icon name="x-circle" size={13} color={T.fail}/>}
          {pr.reviews.approved > 0 && <Icon name="check-circle" size={13} color={T.pass}/>}
          {pr.reviews.req > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Icon name="eye" size={12} color={T.text3}/> {pr.reviews.req}
            </span>
          )}
        </div>

        {/* comments */}
        <div style={{ minWidth: 36 }}>
          {pr.comments > 0 ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {pr.unread > 0 ? (
                <Icon name="comment-fill" size={12} color={T.unread}/>
              ) : (
                <Icon name="comment" size={12} color={T.text3}/>
              )}
              <span style={{ color: pr.unread > 0 ? T.unread : T.text2, fontWeight: pr.unread ? 600 : 400 }}>
                {pr.comments}{pr.unread > 0 ? ` (${pr.unread})` : ''}
              </span>
            </span>
          ) : (
            <span style={{ color: T.text4 }}>—</span>
          )}
        </div>

        {/* age */}
        <div style={{ minWidth: 28, color: T.text3, textAlign: 'right' }}>{pr.age}</div>
      </div>
    </div>
  );
}

Object.assign(window, { InboxScreen });
