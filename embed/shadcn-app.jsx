// Pyor — full shadcn redesign.
// All screens in one place; depends on primitives + icons from screen-shadcn.jsx
// (LI, SButton, SBadge, SAvatar, SKbd, SSeparator, ShadcnWindow). Where shadcn
// has a stock component shape we use it (Sidebar pattern, Tabs, Card, Input,
// Checkbox, Tooltip). No bespoke chrome beyond the macOS traffic lights.

// ── Extended primitives ──────────────────────────────────────

// shadcn Input — bordered, h-8 by default. Optional left icon + right kbd hint.
function SInput({ icon, placeholder, kbd, value, className = '', readOnly = true, size = 'sm' }) {
  const h = size === 'sm' ? 'h-7' : 'h-9';
  return (
    <div className={`${h} flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12.5px] text-zinc-500 focus-within:ring-1 focus-within:ring-zinc-900 ${className}`}>
      {icon && <LI name={icon} className="size-3.5 text-zinc-400"/>}
      <input
        className="flex-1 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 min-w-0"
        placeholder={placeholder} defaultValue={value} readOnly={readOnly}
      />
      {kbd && <SKbd>{kbd}</SKbd>}
    </div>
  );
}

// shadcn Card — rounded-lg border + bg + shadow-sm by default.
function SCard({ children, className = '' }) {
  return <div className={`rounded-lg border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function SCardHeader({ children, className = '' }) {
  return <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>{children}</div>;
}
function SCardTitle({ children, className = '' }) {
  return <h3 className={`text-base font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
}
function SCardDescription({ children, className = '' }) {
  return <p className={`text-[12.5px] text-zinc-500 ${className}`}>{children}</p>;
}
function SCardContent({ children, className = '' }) {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
}

// shadcn Checkbox — 14x14 square.
function SCheckbox({ checked, indeterminate, disabled }) {
  const state = checked ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked';
  const dim = disabled ? 'opacity-40' : '';
  if (state === 'checked') {
    return (
      <span className={`inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-zinc-900 bg-zinc-900 ${dim}`}>
        <LI name="check" className="size-2.5 text-white" strokeWidth={3}/>
      </span>
    );
  }
  if (state === 'indeterminate') {
    return (
      <span className={`inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-zinc-900 bg-zinc-900 ${dim}`}>
        <span className="block h-0.5 w-2 rounded-full bg-white"/>
      </span>
    );
  }
  return <span className={`inline-flex size-3.5 shrink-0 rounded-[3px] border border-zinc-300 bg-white ${dim}`}/>;
}

// shadcn Tabs — TabsList is a rounded muted container; TabsTrigger is the pill.
function STabsList({ children, className = '' }) {
  return (
    <div className={`inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500 ${className}`}>
      {children}
    </div>
  );
}
function STabsTrigger({ active, children, icon, count, className = '' }) {
  const base = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-[13px] font-medium transition-all';
  const on  = 'bg-white text-zinc-950 shadow-sm';
  const off = 'text-zinc-500 hover:text-zinc-900';
  return (
    <button className={`${base} ${active ? on : off} ${className}`}>
      {icon && <LI name={icon} className="size-3.5"/>}
      {children}
      {count != null && (
        <span className={`ml-0.5 rounded px-1.5 py-0 text-[10.5px] font-semibold tabular-nums ${active ? 'bg-zinc-100 text-zinc-700' : ''}`}>{count}</span>
      )}
    </button>
  );
}

// Underline tab (used for PR detail tab strip — matches shadcn underline variant).
function STabsUnderline({ tabs, active, right }) {
  return (
    <div className="flex items-center border-b border-zinc-200 px-5">
      {tabs.map(t => (
        <button key={t.id} className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] transition-colors ${t.id === active ? 'text-zinc-950 font-semibold' : 'text-zinc-500 hover:text-zinc-900 font-medium'}`}>
          {t.id === active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-900"/>}
          {t.icon && <LI name={t.icon} className={`size-3.5 ${t.id === active ? '' : 'text-zinc-400'}`}/>}
          {t.label}
          {t.count != null && (
            <SBadge variant={t.id === active ? 'secondary' : 'outline'} className="ml-0.5 px-1.5 text-[10px]">{t.count}</SBadge>
          )}
          {t.failing && <SBadge variant="destructive" className="px-1.5 text-[10px]">{t.failing} failing</SBadge>}
        </button>
      ))}
      {right && <div className="ml-auto flex items-center gap-2 py-1.5">{right}</div>}
    </div>
  );
}

// Chip used for filter chips (matches shadcn Badge variant="outline").
function SChip({ label, value, active, onClear }) {
  return (
    <button className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors ${active ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}>
      {label}{value && <span className={active ? 'text-zinc-300' : 'text-zinc-400'}>:</span>}
      {value && <span className={active ? 'text-white' : 'text-zinc-900'}>{value}</span>}
      <LI name="chevron-down" className="size-3 opacity-60"/>
    </button>
  );
}

// ── App shell window chrome (extends ShadcnWindow with sidebar slot) ──
// PIER_TRAFFIC_SPACE: when building the real macOS app, set this to true to
// reserve room for the OS traffic-light controls at the title-bar's left.
// Kept false here so the designs read as a clean cross-platform window.
const PIER_TRAFFIC_SPACE = false;

function PierWindowShell({ width, height, title, subtitle, toolbar, status, sidebar, children, sidebarCollapsed = true }) {
  const sidebarW = sidebarCollapsed ? 'w-12' : 'w-60';
  return (
    <div className="shadcn-root font-sans antialiased" style={{ width, height }}>
      <div className="flex flex-col h-full w-full overflow-hidden rounded-xl bg-white text-zinc-950 ring-1 ring-black/15"
           style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 6px 14px rgba(0,0,0,0.08)' }}>
        {/* Titlebar — one continuous strip; reserves traffic-light space only when PIER_TRAFFIC_SPACE */}
        <div className="flex h-10 shrink-0 items-center border-b border-zinc-200 bg-zinc-50">
          <div className={`flex min-w-0 flex-1 items-center gap-3 px-4 ${PIER_TRAFFIC_SPACE ? 'pl-[78px]' : ''}`}>
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="truncate text-[13px] font-semibold tracking-tight">{title}</span>
              {subtitle && <span className="truncate text-xs text-zinc-500">{subtitle}</span>}
            </div>
            <div className="ml-auto flex items-center gap-2">{toolbar}</div>
          </div>
        </div>
        {/* Body */}
        <div className="flex min-h-0 flex-1">
          {sidebar && <div className={`${sidebarW} shrink-0 transition-[width]`}>{sidebar}</div>}
          <div className="flex min-w-0 flex-1 flex-col bg-white">{children}</div>
        </div>
        {/* Status bar */}
        {status && (
          <div className="flex h-6 shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-50/80 px-3 text-[11px] text-zinc-500">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App sidebar (shadcn Sidebar pattern) ─────────────────────
function PierSidebar({ active = 'inbox', badges = {} }) {
  const items = [
    { id: 'inbox', label: 'Inbox',         icon: 'inbox',            badge: badges.inbox ?? 4 },
    { id: 'pulls', label: 'Pull requests', icon: 'git-pull-request', badge: badges.pulls },
    { id: 'local', label: 'Local reviews', icon: 'monitor',          badge: badges.local ?? 2 },
  ];
  return (
    <aside className="flex h-full w-12 flex-col border-r border-zinc-200 bg-zinc-50/50">
      {/* SidebarContent — icon rail */}
      <div className="flex-1 px-2 pt-2">
        <nav className="flex flex-col items-center gap-0.5">
          {items.map(it => (
            <SidebarMenuButton key={it.id} {...it} active={it.id === active}/>
          ))}
        </nav>
      </div>
      {/* SidebarFooter — API usage gauges, then user, then Settings */}
      <div className="flex shrink-0 flex-col items-center gap-2 border-t border-zinc-200 p-2">
        <ApiUsageGauges/>
        <SidebarUserCard/>
        <SidebarMenuButton id="settings" label="Settings" icon="settings" active={active === 'settings'}/>
      </div>
    </aside>
  );
}

// Radial usage gauges (rate-limit) — sit just above the profile photo in the
// collapsed rail. Each is a ring with the API initial inside + a hover tooltip
// carrying the exact count and reset time.
function ApiUsageGauges({ core = 17, coreLimit = 5000, gql = 148, gqlLimit = 5000, resetsIn = '38m' }) {
  return (
    <div className="flex flex-col items-center gap-1.5 pb-0.5">
      <UsageGauge label="REST API"    short="R" used={core} limit={coreLimit} resetsIn={resetsIn}/>
      <UsageGauge label="GraphQL API" short="G" used={gql}  limit={gqlLimit} resetsIn={resetsIn}/>
    </div>
  );
}

function UsageGauge({ label, short, used, limit, resetsIn }) {
  const pct = Math.max(4, Math.min(100, (used / limit) * 100));
  const tone = pct > 85 ? 'text-red-500' : pct > 60 ? 'text-amber-500' : 'text-zinc-700';
  const r = 8.5;
  const circ = 2 * Math.PI * r;
  return (
    <STooltip side="right" label={`${label} · ${used.toLocaleString()} / ${limit.toLocaleString()} · resets in ${resetsIn}`}>
      <span className="relative flex size-7 items-center justify-center">
        <svg viewBox="0 0 24 24" className="absolute size-7 -rotate-90">
          <circle cx="12" cy="12" r={r} fill="none" strokeWidth="3" className="stroke-zinc-200"/>
          <circle cx="12" cy="12" r={r} fill="none" strokeWidth="3" strokeLinecap="round"
            className={`${tone} stroke-current`} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}/>
        </svg>
        <span className="relative text-[8.5px] font-bold leading-none text-zinc-500">{short}</span>
      </span>
    </STooltip>
  );
}

// Signed-in user avatar — opens the account menu. Tooltip carries the name.
function SidebarUserCard() {
  return (
    <STooltip side="right" label="Alex Cho · @alex-cho">
      <button className="flex size-8 items-center justify-center rounded-full hover:ring-2 hover:ring-zinc-200">
        <SAvatar name="alex-cho" size="size-7"/>
      </button>
    </STooltip>
  );
}

function SidebarMenuButton({ id, label, icon, badge, active }) {
  const stateClass = active
    ? 'bg-zinc-200/70 text-zinc-950'
    : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900';
  return (
    <STooltip side="right" label={label}>
      <button className={`relative inline-flex size-8 items-center justify-center rounded-md ${stateClass}`}>
        <LI name={icon} className="size-4"/>
        {badge != null && badge > 0 && (
          <span className="absolute right-0 top-0 inline-flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold text-white ring-2 ring-zinc-50">{badge}</span>
        )}
      </button>
    </STooltip>
  );
}

// ═══ Screen — Inbox (notifications feed) ════════════════════
const NOTIFS_S = [
  { id: 'n1', reason: 'review_requested', unread: true, actor: 'priya-r', verb: 'requested your review on',
    title: 'feat(scheduler): coalesce identical session pushes into a single fan-out',
    repo: 'northwind/web-event-app', num: 9241, age: '3m' },
  { id: 'n2', reason: 'comment', unread: true, actor: 'marcus-w', verb: 'commented on your PR',
    title: 'perf(diff-render): virtualise hunks larger than 2k lines',
    repo: 'northwind/web-event-app', num: 9217, age: '12m',
    snippet: 'One blocker: this changes the public ResizeObserver contract on HunkWindow. The mobile target depends on the old shape — can we add an adapter?',
    codeLoc: 'src/diff/HunkWindow.ts:42' },
  { id: 'n3', reason: 'mention', unread: true, actor: 'alex-cho', verb: 'mentioned you in',
    title: 'RFC: cohort export pipeline (S3 + Athena)',
    repo: 'northwind/analytics', num: 308, age: '1h',
    snippet: '@alex-cho any thoughts on partitioning by event_date here? worried about hot-spotting on launch days.' },
  { id: 'n4', reason: 'review_requested', unread: true, actor: 'jules-k', verb: 'requested your review on',
    title: 'Empty-state polish for event picker on small viewports',
    repo: 'northwind/design-system', num: 612, age: '2h' },
  { id: 'n5', reason: 'comment', unread: false, actor: 'priya-r', verb: 'replied to your thread on',
    title: 'perf(diff-render): virtualise hunks larger than 2k lines',
    repo: 'northwind/web-event-app', num: 9217, age: '4h',
    snippet: "Good call — I've split the path into two and added the regression. Re-requesting review now.",
    codeLoc: 'src/diff/VirtualHunk.tsx:128' },
  { id: 'n6', reason: 'state_change', unread: false, actor: 'github', verb: 'merged',
    title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle',
    repo: 'northwind/api', num: 4471, age: '5h' },
  { id: 'n7', reason: 'assigned', unread: false, actor: 'sara-l', verb: 'assigned you to',
    title: 'spike: replace Redux with Zustand on the attendee dashboard',
    repo: 'northwind/web-event-app', num: 9198, age: '8h' },
  { id: 'n8', reason: 'comment', unread: false, actor: 'nicolae-i', verb: 'commented on',
    title: 'feat(ios): persist scroll offset across PR-list refreshes',
    repo: 'northwind/mobile-ios', num: 1183, age: '11h',
    snippet: 'Should we also handle the case where the cached offset exceeds the new list length after a refresh removes rows above it?' },
  { id: 'n9', reason: 'state_change', unread: false, actor: 'marcus-w', verb: 'closed',
    title: 'WIP: lazy-load the print/export pipeline',
    repo: 'northwind/web-event-app', num: 9168, age: '1d' },
  { id: 'n10', reason: 'subscribed', unread: false, actor: 'dependabot', verb: 'opened',
    title: 'chore(deps): bump pg from 8.11.3 to 8.13.0',
    repo: 'northwind/api', num: 4469, age: '1d' },
];

const REASON_S = {
  review_requested: { label: 'Review',      icon: 'eye',            variant: 'default' },
  mention:          { label: 'Mention',     icon: 'at-sign',        variant: 'warn' },
  comment:          { label: 'Comment',     icon: 'message-square', variant: 'secondary' },
  state_change:     { label: 'Update',      icon: 'git-merge',      variant: 'outline' },
  assigned:         { label: 'Assigned',    icon: 'user-plus',      variant: 'success' },
  subscribed:       { label: 'Subscribed',  icon: 'circle',         variant: 'outline' },
};

function ShadcnNotifRow({ n, hovered }) {
  const cfg = REASON_S[n.reason];
  return (
    <div className={`group relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-4 py-2.5 ${hovered ? 'bg-zinc-50' : n.unread ? 'bg-blue-50/30' : ''}`}>
      <div className="w-1.5 pt-2 shrink-0">
        {n.unread && <span className="block size-1.5 rounded-full bg-blue-600"/>}
      </div>
      <SAvatar name={n.actor} size="size-7"/>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <SBadge variant={cfg.variant} className="gap-1 px-1.5">
            <LI name={cfg.icon} className="size-2.5"/> {cfg.label}
          </SBadge>
          <span className="truncate text-[12.5px] text-zinc-500">
            <b className="font-semibold text-zinc-900">{n.actor}</b> {n.verb}
          </span>
          <span className="ml-auto shrink-0 text-[11.5px] text-zinc-400 tabular-nums">{n.age}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`truncate text-[13px] text-zinc-900 ${n.unread ? 'font-semibold' : 'font-medium'}`} style={{ maxWidth: 760 }}>
            {n.title}
          </span>
          <span className="font-mono text-[11px] text-zinc-400">#{n.num}</span>
          <span className="text-zinc-300">·</span>
          <span className="text-[12px] text-zinc-500">{n.repo}</span>
        </div>
        {n.snippet && (
          <div className="mb-0.5 max-w-[760px] text-[12px] text-zinc-600 leading-snug line-clamp-2">
            <span className="text-zinc-300">"</span>{n.snippet}<span className="text-zinc-300">"</span>
          </div>
        )}
        {n.codeLoc && (
          <div className="inline-flex items-center gap-1 text-[11.5px] text-zinc-400">
            <LI name="file" className="size-3"/>
            <span className="font-mono">{n.codeLoc}</span>
          </div>
        )}
      </div>
      {hovered && (
        <div className="absolute right-3 top-2 flex items-center gap-1 rounded-md border border-zinc-200 bg-white p-0.5 shadow-sm">
          <SButton variant="ghost" size="sm" icon="check-check">Mark read</SButton>
          <SButton variant="ghost" size="sm" icon="external-link">Open on GitHub</SButton>
        </div>
      )}
    </div>
  );
}

// Inbox empty state — uses the v3 tabs so the surface stays consistent.
function ShadcnInboxEmptyScreen({ width = 1320, height = 820 }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Inbox" subtitle="0 unread"
      sidebar={<PierSidebar active="inbox" badges={{ inbox: 0 }}/>}
      toolbar={<SButton variant="ghost" size="sm" icon="refresh">Refresh</SButton>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Connected · alex-cho</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Last checked <span className="text-zinc-900">14s ago</span></span>
      </>}
    >
      <STabsUnderline active="all" tabs={[
        { id: 'all',      label: 'All',      icon: 'inbox',          count: 0 },
        { id: 'comments', label: 'Comments', icon: 'message-square', count: 0 },
        { id: 'other',    label: 'Other',    icon: 'at-sign',        count: 0 },
      ]}/>
      <EmptyState
        icon="check"
        iconClass="text-emerald-600"
        title="You're all caught up."
        body="No new review requests, mentions or replies. New activity will appear here within 60 seconds."
        action={<SButton variant="outline" size="sm" icon="refresh">Refresh now</SButton>}
      />
    </PierWindowShell>
  );
}

function EmptyState({ icon, iconClass = 'text-zinc-500', title, body, action, secondary }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50/50 p-12 text-center">
      <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <LI name={icon} className={`size-7 ${iconClass}`} strokeWidth={1.7}/>
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-zinc-500">{body}</p>
      {action && <div className="mt-5 flex items-center gap-2">{action}</div>}
      {secondary && <div className="mt-4">{secondary}</div>}
    </div>
  );
}

// ═══ Screen — Inbox v3 (tabbed: All / Comments / Other) ═══════
// Comments tab is a rich "comment feed" surface — diff_hunk snippets,
// reactions, attachments, reply indicators (see inbox-comments.jsx).
// All / Other tabs keep the notification-row treatment.
function ShadcnInboxScreenV3({ width = 1320, height = 820, view = {} }) {
  const v = {
    tab: 'all',
    sidebarCollapsed: true,
    // Comments-tab filters (forwarded into InboxCommentsList)
    commentsSearch: '',
    commentsDateRange: 'Last 7 days',
    commentsDateRangeOpen: false,
    commentsTypeFilter: 'any',
    commentsUnreadOnly: false,
    commentsLoading: false,
    commentsPagesLoaded: 2,
    ...view,
  };
  const isComment = (n) => n.reason === 'comment';
  const rows = v.tab === 'comments' ? NOTIFS_S.filter(isComment)
             : v.tab === 'other'    ? NOTIFS_S.filter(n => !isComment(n))
             : NOTIFS_S;
  const counts = {
    all: NOTIFS_S.length,
    // Comments tab uses the richer feed: surface its count instead
    comments: INBOX_COMMENTS.length,
    other: NOTIFS_S.filter(n => !isComment(n)).length,
  };
  const unreadCounts = {
    all: NOTIFS_S.filter(n => n.unread).length,
    comments: INBOX_COMMENTS.filter(c => c.unread).length,
    other: NOTIFS_S.filter(n => n.unread && !isComment(n)).length,
  };
  return (
    <PierWindowShell width={width} height={height}
      title="Inbox" subtitle={`${unreadCounts[v.tab]} unread · ${counts[v.tab]} in feed`}
      sidebar={<PierSidebar active="inbox" collapsed={v.sidebarCollapsed}/>}
      sidebarCollapsed={v.sidebarCollapsed}
      toolbar={<>
        {v.tab !== 'comments' && <SInput icon="search" placeholder="Search notifications" kbd="⌘F" className="w-56"/>}
        <SButton variant="ghost" size="sm" icon="refresh">Refresh</SButton>
        <SButton variant="ghost" size="sm" icon="check-check">Mark all read</SButton>
      </>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Connected · alex-cho</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Last checked <span className="text-zinc-900">14s ago</span> · 60s cadence</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>{unreadCounts.all} unread of {counts.all}</span>
        <span className="ml-auto">Rate 4,983 / 5,000</span>
      </>}
    >
      {/* Tabs */}
      <STabsUnderline active={v.tab} tabs={[
        { id: 'all',      label: 'All',      icon: 'inbox',          count: counts.all },
        { id: 'comments', label: 'Comments', icon: 'message-square', count: counts.comments },
        { id: 'other',    label: 'Other',    icon: 'at-sign',        count: counts.other },
      ]}/>
      {v.tab === 'comments' ? (
        // Rich comments feed — has its own toolbar built-in
        <InboxCommentsList view={{
          search:        v.commentsSearch,
          dateRange:     v.commentsDateRange,
          dateRangeOpen: v.commentsDateRangeOpen,
          typeFilter:    v.commentsTypeFilter,
          unreadOnly:    v.commentsUnreadOnly,
          loading:       v.commentsLoading,
          pagesLoaded:   v.commentsPagesLoaded,
        }}/>
      ) : (
        <>
          {/* Compact filter bar for All / Other */}
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2">
            <SChip label="Unread only" active/>
            <SChip label="Repo" value="any"/>
            <span className="ml-auto text-[11.5px] text-zinc-500">
              Click row to open · <SKbd>E</SKbd> mark read · <SKbd>⇧E</SKbd> mark all
            </span>
          </div>
          {/* Notifications list */}
          <div className="flex-1 overflow-auto">
            {rows.length === 0 ? (
              <EmptyState icon="check" iconClass="text-emerald-600"
                title={v.tab === 'other' ? 'No review requests or mentions.' : "You're all caught up."}
                body={v.tab === 'other' ? 'Review requests, mentions and state changes will show up here.' : 'New activity will appear here within 60 seconds.'}/>
            ) : (
              <>
                {rows.map((n, i) => <ShadcnNotifRow key={n.id} n={n} hovered={i === 1 && v.tab === 'all'}/>)}
                <div className="px-4 py-3 text-center text-[11.5px] text-zinc-400">
                  No older notifications · GitHub returns up to 50 in /notifications
                </div>
              </>
            )}
          </div>
        </>
      )}
    </PierWindowShell>
  );
}

// ═══ PR Files variants — search active + rail collapsed + review modal ═══

// Extend the existing screen via new view props. Defaults preserve old behaviour.
function ShadcnPRDetailFilesScreenV2({ width = 1320, height = 900, from = 'inbox', view = {} }) {
  const v = {
    commitsOpen: false,
    searchActive: false,
    searchQuery: '',
    railCollapsed: false,
    reviewModal: null,   // null | 'comment' | 'approve' | 'changes'
    hideComments: false,
    unifiedToolbar: true,        // app-wide default: tools folded onto tab bar
    headerDensity: 'single-strip', // app-wide default header
    ...view,
  };
  const backLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  const [hideComments, setHideComments] = React.useState(!!v.hideComments);
  return (
    <PierWindowShell width={width} height={height}
      title="" subtitle=""
      sidebar={<PierSidebar active={from === 'pulls' ? 'pulls' : 'inbox'}/>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Live polling · 8s</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>2 pending in draft review</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Base · <span className="font-mono">main@a3f7b21</span></span>
      </>}
    >
      <ShadcnPRHeader backLabel={backLabel} focusMode="code" focusActive={hideComments} onToggleFocus={() => setHideComments(h => !h)} density={v.headerDensity}/>
      {v.unifiedToolbar ? (
        /* Unified bar — tabs + compact tools share one row; Checks tab dropped
           (counts live in the header). */
        <div className="relative">
          <STabsUnderline active="files"
            tabs={[
              { id: 'conv',    label: 'Conversation',  icon: 'message-square', count: 31 },
              { id: 'commits', label: 'Commits',       icon: 'git-commit',     count: 14 },
              { id: 'files',   label: 'Files changed', icon: 'file',           count: 7 },
            ]}
            right={<ShadcnFilesTabTools commitsOpen={v.commitsOpen} searchActive={v.searchActive} searchQuery={v.searchQuery}/>}
          />
          {v.commitsOpen && <ShadcnCommitsPopover align="right"/>}
        </div>
      ) : (
        <>
          <STabsUnderline active="files" tabs={[
            { id: 'conv',    label: 'Conversation',  icon: 'message-square', count: 31 },
            { id: 'commits', label: 'Commits',       icon: 'git-commit',     count: 14 },
            { id: 'checks',  label: 'Checks',        icon: 'check-circle',   count: 18, failing: 2 },
            { id: 'files',   label: 'Files changed', icon: 'file',           count: 7 },
          ]}/>
          <div className="relative">
            <ShadcnFilesToolbarV2 commitsOpen={v.commitsOpen} searchActive={v.searchActive} searchQuery={v.searchQuery}/>
            {v.commitsOpen && <ShadcnCommitsPopover/>}
          </div>
        </>
      )}
      <div className="flex flex-1 min-h-0 relative">
        {v.railCollapsed ? <ShadcnFileRailCollapsed/> : <ShadcnFileRail/>}
        {v.searchActive ? <ShadcnDiffPaneHighlighted query={v.searchQuery}/> : <ShadcnDiffPane hideComments={hideComments} fontSize={v.diffFontSize} lineHeight={v.diffLineHeight}/>}
        {v.reviewModal && <ShadcnReviewSubmitModal verdict={v.reviewModal}/>}
      </div>
      <ShadcnReviewDock/>
    </PierWindowShell>
  );
}

// Compact tool cluster that lives INLINE on the tabs bar (right side) for the
// unified-bar variant. Everything from ShadcnFilesToolbarV2 — commits picker,
// viewed progress, diff search, inline/split switch — squeezed into icons +
// counts so the whole sub-toolbar row collapses away.
function ShadcnFilesTabTools({ commitsOpen, searchActive, searchQuery = '', streaming = null, pending = false }) {
  // File-list still paginating — total count unknown, nothing actionable yet.
  if (pending) {
    return (
      <>
        <div className="inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700">
          <LI name="loader" className="size-3.5 animate-spin text-zinc-500"/>
          <span>listing files</span>
          <span className="tabular-nums text-zinc-400">· page 2 of —</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-40">
          <LI name="eye" className="size-3.5 text-zinc-500"/>
          <div className="h-1 w-12 overflow-hidden rounded-full bg-zinc-200"/>
          <span className="text-[11.5px] tabular-nums text-zinc-400">—/—</span>
        </div>
        <button disabled title="Search ready when diffs arrive"
          className="inline-flex size-7 cursor-not-allowed items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-300">
          <LI name="search" className="size-3.5"/>
        </button>
        <SSeparator vertical className="h-4"/>
        <div className="pointer-events-none opacity-50">
          <SToggleGroup mode="icon" value="inline" options={[
            { id: 'inline', icon: 'rows',    label: 'Inline view' },
            { id: 'split',  icon: 'columns', label: 'Split view'  },
          ]}/>
        </div>
      </>
    );
  }
  // While file contents stream in, the commits pill is replaced by a
  // "computing diffs · N/M" spinner, viewed-progress is muted (can't
  // mark-viewed yet), and search / view-switch are disabled — the same
  // semantics as the full-width FilesToolbarStreaming, folded onto the row.
  if (streaming) {
    const { done = 2, total = 7 } = streaming;
    return (
      <>
        <div className="inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700">
          <LI name="loader" className="size-3.5 animate-spin text-zinc-500"/>
          <span>computing diffs</span>
          <span className="tabular-nums text-zinc-400">· {done}/{total}</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-50" title="Viewed progress available once diffs arrive">
          <LI name="eye" className="size-3.5 text-zinc-500"/>
          <div className="relative h-1 w-12 overflow-hidden rounded-full bg-zinc-200">
            <div className="absolute inset-y-0 left-0 bg-zinc-400" style={{ width: '0%' }}/>
          </div>
          <span className="text-[11.5px] tabular-nums text-zinc-400">0/{total}</span>
        </div>
        <button disabled title="Search ready when diffs arrive"
          className="inline-flex size-7 cursor-not-allowed items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-300">
          <LI name="search" className="size-3.5"/>
        </button>
        <SSeparator vertical className="h-4"/>
        <div className="pointer-events-none opacity-50">
          <SToggleGroup mode="icon" value="inline" options={[
            { id: 'inline', icon: 'rows',    label: 'Inline view' },
            { id: 'split',  icon: 'columns', label: 'Split view'  },
          ]}/>
        </div>
      </>
    );
  }
  return (
    <>
      {/* Commits — icon + count only ("· all changes" → tooltip) */}
      <button title="14 commits · all changes"
        className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[12px] font-medium ${commitsOpen ? 'border-zinc-900 bg-zinc-100 text-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'}`}>
        <LI name="git-commit" className={`size-3.5 ${commitsOpen ? 'text-zinc-900' : 'text-zinc-500'}`}/>
        <span className="tabular-nums">14</span>
        <LI name="chevron-down" className="size-3 text-zinc-400"/>
      </button>
      {/* Viewed progress — slim bar + count */}
      <div className="flex items-center gap-1.5" title="3 of 7 files viewed">
        <LI name="eye" className="size-3.5 text-zinc-500"/>
        <div className="relative h-1 w-12 overflow-hidden rounded-full bg-zinc-200">
          <div className="absolute inset-y-0 left-0 bg-zinc-900" style={{ width: '42.8%' }}/>
        </div>
        <span className="text-[11.5px] tabular-nums text-zinc-500"><span className="font-semibold text-zinc-900">3</span>/7</span>
      </div>
      {/* Search — collapses to an icon button at rest, expands when active */}
      {searchActive ? (
        <div className="flex h-7 w-56 items-center gap-2 rounded-md border border-zinc-900 bg-white px-2.5 text-xs text-zinc-950 ring-1 ring-zinc-900/10">
          <LI name="search" className="size-3.5 text-zinc-700"/>
          <span className="truncate font-mono text-zinc-900">{searchQuery || 'measureHunk'}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] tabular-nums text-zinc-500">
            <span><span className="font-semibold text-zinc-900">2</span><span className="text-zinc-300"> of </span>14</span>
            <button className="rounded p-0.5 hover:bg-zinc-100"><LI name="x" className="size-3"/></button>
          </span>
        </div>
      ) : (
        <button title="Search in diff (⌘F)"
          className="inline-flex size-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50">
          <LI name="search" className="size-3.5"/>
        </button>
      )}
      <SSeparator vertical className="h-4"/>
      {/* Inline / Split — icon-only segmented control */}
      <SToggleGroup mode="icon" value="inline" options={[
        { id: 'inline', icon: 'rows',    label: 'Inline view' },
        { id: 'split',  icon: 'columns', label: 'Split view'  },
      ]}/>
    </>
  );
}

// Sub-toolbar with an explicit "active search" affordance.
function ShadcnFilesToolbarV2({ commitsOpen, searchActive, searchQuery = '' }) {
  return (
    <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2">
      <button className={`inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-[12px] font-medium ${commitsOpen ? 'border-zinc-900 bg-zinc-100 text-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'}`}>
        <LI name="git-commit" className={`size-3.5 ${commitsOpen ? 'text-zinc-900' : 'text-zinc-500'}`}/>
        <span>14 commits</span>
        <span className="text-zinc-400">· all changes</span>
        <LI name="chevron-down" className="size-3 text-zinc-400"/>
      </button>
      <SSeparator vertical className="h-4"/>
      <div className="flex items-center gap-2 min-w-44">
        <LI name="eye" className="size-3.5 text-zinc-500"/>
        <div className="relative flex-1 h-1 rounded-full bg-zinc-200 overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-zinc-900" style={{ width: '42.8%' }}/>
        </div>
        <span className="text-[11.5px] tabular-nums text-zinc-500"><span className="font-semibold text-zinc-900">3</span>/7</span>
      </div>
      <SSeparator vertical className="h-4"/>
      {/* Search input — active variant shows the query and a result counter. */}
      <div className={`flex h-7 items-center gap-2 rounded-md border px-2.5 text-xs transition-colors ${searchActive ? 'w-72 border-zinc-900 bg-white text-zinc-950 ring-1 ring-zinc-900/10' : 'w-44 border-zinc-200 bg-white text-zinc-500'}`}>
        <LI name="search" className={`size-3.5 ${searchActive ? 'text-zinc-700' : 'text-zinc-400'}`}/>
        {searchActive ? (
          <>
            <span className="font-mono text-zinc-900 truncate">{searchQuery || 'measureHunk'}</span>
            <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-zinc-500 tabular-nums">
              <span><span className="font-semibold text-zinc-900">2</span><span className="text-zinc-300"> of </span>14</span>
              <button className="rounded p-0.5 hover:bg-zinc-100"><LI name="chevron-up" className="size-3"/></button>
              <button className="rounded p-0.5 hover:bg-zinc-100"><LI name="chevron-down" className="size-3"/></button>
              <button className="rounded p-0.5 hover:bg-zinc-100"><LI name="x" className="size-3"/></button>
            </span>
          </>
        ) : (
          <>
            <span className="flex-1">Search in diff…</span>
            <SKbd>⌘F</SKbd>
          </>
        )}
      </div>
      <SToggleGroup className="ml-auto" value="inline" options={[
        { id: 'inline', icon: 'rows',    label: 'Inline' },
        { id: 'split',  icon: 'columns', label: 'Split'  },
      ]}/>
    </div>
  );
}

// Collapsed file rail — narrow icon rail. Folders fold to single dots,
// current file gets a left accent, comments/unread show as small markers.
function ShadcnFileRailCollapsed() {
  // Flatten files only (folders gone in collapsed mode)
  const files = [
    { name: 'VirtualHunk.tsx',     viewed: false, unread: 3, current: true },
    { name: 'HunkWindow.ts',       viewed: false, unread: 0, comments: 4 },
    { name: 'measureHunk.ts',      viewed: true,  unread: 0 },
    { name: 'index.ts',            viewed: true,  unread: 0 },
    { name: 'CodeMirrorHost.tsx',  viewed: true,  unread: 0 },
    { name: 'bridge.ts',           viewed: true,  unread: 0 },
    { name: 'VirtualHunk.test.tsx', viewed: false, unread: 2 },
  ];
  return (
    <aside className="w-11 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col">
      <div className="flex h-9 shrink-0 items-center justify-center border-b border-zinc-200">
        <button title="Expand file rail" className="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100">
          <LI name="panel-left-open" className="size-4"/>
        </button>
      </div>
      <div className="flex-1 overflow-auto py-1 space-y-0.5">
        {files.map((f, i) => (
          <button key={i} title={f.name} className={`relative mx-auto flex size-8 items-center justify-center rounded-md ${f.current ? 'bg-zinc-200/70' : 'hover:bg-zinc-100'} ${f.viewed && !f.current ? 'opacity-50' : ''}`}>
            {f.current && <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-zinc-900"/>}
            <LI name="file" className={`size-4 ${f.current ? 'text-zinc-900' : 'text-zinc-500'}`}/>
            {f.unread > 0 && (
              <span className="absolute right-0.5 top-0.5 inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold text-white ring-2 ring-zinc-50">{f.unread}</span>
            )}
          </button>
        ))}
      </div>
      <div className="border-t border-zinc-200 px-1 py-1.5 text-center text-[10px] text-zinc-500">
        <div className="font-mono tabular-nums">3/7</div>
      </div>
    </aside>
  );
}

// Diff pane variant where one match is highlighted (active) and others outlined.
// Reuses the same body shape but stamps highlight chrome onto two lines.
function ShadcnDiffPaneHighlighted({ query = 'measureHunk' }) {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-2">
        <LI name="chevron-down" className="size-3 text-zinc-500"/>
        <span className="font-mono text-[12px] font-semibold">src/diff/VirtualHunk.tsx</span>
        <span className="font-mono text-[11px]"><span className="text-emerald-600">+312</span> <span className="text-red-600">−4</span></span>
        <SBadge variant="default" className="ml-2 gap-1">
          <LI name="search" className="size-3"/> 14 matches in this file
        </SBadge>
      </div>
      <div className="font-mono text-[12px]">
        {[
          { l: '12', code: 'import { ', hl: 'measureHunk', tail: ' } from "./measureHunk";',    kind: 'plus',    match: true,  active: true },
          { l: '13', code: 'import { VirtualHunk } from "./VirtualHunk";',                        kind: 'plus' },
          { l: '14', code: '',                                                                    kind: 'context' },
          { l: '15', code: 'export function NaiveHunk(props: HunkProps) {',                       kind: 'context' },
          { l: '16', code: '  const lineCount = props.lines.length;',                             kind: 'context' },
          { l: '17', code: '  if (lineCount < 2000) {',                                           kind: 'plus' },
          { l: '18', code: '    return <NaiveRender {...props} />;',                              kind: 'plus' },
          { l: '19', code: '  }',                                                                 kind: 'plus' },
          { l: '20', code: '  const { lineHeight } = ', hl: 'measureHunk', tail: '(props);',     kind: 'plus', match: true },
          { l: '21', code: '  return <VirtualHunk lineHeight={lineHeight} {...props} />;',        kind: 'plus' },
          { l: '22', code: '}',                                                                   kind: 'context' },
        ].map((r, i) => <DiffSearchRow key={i} r={r}/>)}
      </div>
    </div>
  );
}

function DiffSearchRow({ r }) {
  const bg = r.kind === 'plus'  ? 'bg-emerald-50/70'
           : r.kind === 'minus' ? 'bg-red-50/70'
           : '';
  const sign = r.kind === 'plus' ? '+' : r.kind === 'minus' ? '−' : ' ';
  const signColor = r.kind === 'plus' ? 'text-emerald-700' : r.kind === 'minus' ? 'text-red-700' : 'text-zinc-300';
  return (
    <div className={`flex ${bg}`}>
      <span className="w-12 shrink-0 px-2 text-right text-[10.5px] text-zinc-400 tabular-nums select-none">{r.l}</span>
      <span className={`w-4 text-center ${signColor}`}>{sign}</span>
      <span className="flex-1 whitespace-pre">
        {r.code}
        {r.match && (
          <span className={`rounded-sm px-0.5 ${r.active ? 'bg-amber-300 text-zinc-900 ring-1 ring-amber-500' : 'bg-amber-100 text-zinc-900'}`}>
            {r.hl}
          </span>
        )}
        {r.tail}
      </span>
    </div>
  );
}

// Review submit dialog. Verdict radio + summary textarea + pending stats.
function ShadcnReviewSubmitModal({ verdict = 'comment' }) {
  const cfg = {
    comment:  { label: 'Comment',         submit: 'Submit comments',     icon: 'message-square', tone: 'default' },
    approve:  { label: 'Approve',         submit: 'Submit approval',     icon: 'check-circle',   tone: 'default' },
    changes:  { label: 'Request changes', submit: 'Submit requested changes', icon: 'x-circle',  tone: 'destructive' },
  }[verdict];
  return (
    <SDialog open width={560}>
      <SDialogHeader
        icon="check-circle"
        title="Submit your review"
        description="#9217 · perf(diff-render): virtualise hunks larger than 2k lines"
        onClose={() => {}}
      />

      {/* Verdict picker — three SCard "radio" buttons */}
      <div className="space-y-2 px-4 pt-4">
        <div className="text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500">Verdict</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'comment', label: 'Comment',         icon: 'message-square',
              desc: 'Submit general feedback without explicit approval.', tone: 'zinc' },
            { id: 'approve', label: 'Approve',         icon: 'check-circle',
              desc: 'Submit feedback and approve merging.', tone: 'emerald' },
            { id: 'changes', label: 'Request changes', icon: 'x-circle',
              desc: 'Submit feedback that must be addressed before merging.', tone: 'red' },
          ].map(opt => {
            const selected = opt.id === verdict;
            const ring = selected
              ? (opt.tone === 'emerald' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                : opt.tone === 'red'    ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/30'
                : 'border-zinc-900 ring-2 ring-zinc-900/15 bg-zinc-50')
              : 'border-zinc-200 hover:bg-zinc-50';
            const iconColor = selected
              ? (opt.tone === 'emerald' ? 'text-emerald-600'
                : opt.tone === 'red'    ? 'text-red-600'
                : 'text-zinc-900')
              : 'text-zinc-500';
            return (
              <button key={opt.id} className={`relative rounded-md border p-3 text-left transition-colors ${ring}`}>
                <div className="flex items-center gap-1.5">
                  <LI name={opt.icon} className={`size-4 ${iconColor}`}/>
                  <span className="text-[12.5px] font-semibold text-zinc-900">{opt.label}</span>
                  {selected && (
                    <LI name="check" className={`ml-auto size-3.5 ${iconColor}`} strokeWidth={3}/>
                  )}
                </div>
                <div className="mt-1 text-[11.5px] text-zinc-500 leading-snug">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pending review summary */}
      <div className="px-4 pt-3">
        <SCard className="bg-zinc-50/60 border-zinc-200">
          <div className="flex items-center gap-2 p-2.5 text-[12px] text-zinc-700">
            <LI name="message-square" className="size-3.5 text-zinc-500"/>
            <span>
              <b className="font-semibold text-zinc-900">2 pending review comments</b>
              {' '}— 1 on <span className="font-mono text-[11px]">VirtualHunk.tsx:42</span>, 1 on <span className="font-mono text-[11px]">HunkWindow.ts:128</span>
            </span>
            <SButton variant="ghost" size="sm" className="ml-auto">Show</SButton>
          </div>
        </SCard>
      </div>

      {/* Summary textarea */}
      <div className="px-4 pt-3">
        <div className="mb-1 flex items-center gap-2">
          <label className="text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500">Review summary</label>
          <span className="text-[11px] text-zinc-400">optional · markdown supported</span>
          <SToggleGroup className="ml-auto" value="write" options={[
            { id: 'write',   label: 'Write'   },
            { id: 'preview', label: 'Preview' },
          ]}/>
        </div>
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] leading-relaxed text-zinc-700 min-h-[88px]">
          {verdict === 'changes'
            ? <>One blocker on the public ResizeObserver contract — see thread on <span className="font-mono text-[11.5px]">HunkWindow.ts</span>. Otherwise the perf numbers look fantastic.</>
            : verdict === 'approve'
            ? <>LGTM aside from the small nit on VirtualHunk.tsx. Numbers look great — happy to ship.</>
            : <span className="text-zinc-400">Add a summary…</span>}
        </div>
      </div>

      {/* Footer */}
      <SDialogFooter className="mt-4">
        <span className="text-[11.5px] text-zinc-500">
          Posts as <b className="font-mono text-zinc-700">@alex-cho</b> · saved to draft until you submit
        </span>
        <SButton variant="ghost" size="sm" className="ml-auto">Discard draft</SButton>
        <SButton variant={cfg.tone} size="sm" icon={cfg.icon}>{cfg.submit}</SButton>
      </SDialogFooter>
    </SDialog>
  );
}

// ═══ Pre-PR launcher — empty (cold start) ═══════════════════════
function ShadcnPrePRLauncherEmptyScreen({ width = 1100, height = 740 }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Local reviews" subtitle="No worktrees discovered"
      sidebar={<PierSidebar active="local" badges={{ local: 0 }}/>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-amber-500"/>git OK · 0 worktrees discovered in ~/code</span>
        <span className="ml-auto">No GitHub round-trip · everything below is local</span>
      </>}
    >
      <div className="flex-1 overflow-auto bg-zinc-50/40 p-8">
        <div className="mx-auto max-w-2xl space-y-5">
          <EmptyState
            icon="folder"
            iconClass="text-zinc-500"
            title="Add a repo to start your first local review."
            body="Pyor looks for git worktrees in your watched paths. Point it at the folder you check code out into and Pyor will find the rest."
            action={<>
              <SButton variant="default" size="sm" icon="plus">Add repo…</SButton>
              <SButton variant="ghost" size="sm" icon="terminal">Discover from $PWD</SButton>
            </>}
          />
          <SCard>
            <SCardHeader>
              <SCardTitle>Watched paths</SCardTitle>
              <SCardDescription>Pyor walks these folders looking for <code className="font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5">.git</code> directories. Empty by default.</SCardDescription>
            </SCardHeader>
            <SCardContent>
              <div className="flex items-center gap-2 rounded-md border border-dashed border-zinc-300 bg-white/40 px-3 py-3 text-[12.5px] text-zinc-500">
                <LI name="folder" className="size-4 text-zinc-400"/>
                <span>No paths added yet</span>
                <SButton variant="ghost" size="sm" icon="plus" className="ml-auto">Add path</SButton>
              </div>
              <div className="mt-2 text-[11.5px] text-zinc-500 leading-relaxed">
                Common choices: <code className="font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5">~/code</code>, <code className="font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5">~/work</code>, <code className="font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5">~/Developer</code>.
              </div>
            </SCardContent>
          </SCard>
          <SCard>
            <div className="flex items-start gap-2.5 p-4">
              <LI name="info" className="mt-0.5 size-4 shrink-0 text-blue-600"/>
              <div className="text-[12.5px] text-zinc-600 leading-relaxed">
                <b className="font-semibold text-zinc-950">Heads up:</b> local reviews stay local. Pyor never reads the contents of files outside the worktrees you've added, and never makes a GitHub request from this screen.
              </div>
            </div>
          </SCard>
        </div>
      </div>
    </PierWindowShell>
  );
}

// ═══ Pre-PR · Add-repo dialog ════════════════════════════════════
// Two modes:
//   • pick — one folder, validate it's a git repo, show base branch hint
//   • scan — point at a parent folder, folder-walk discovers every git repo
//            inside, surface them as a multi-select list
function ShadcnPrePRAddRepoScreen({ width = 1100, height = 740, view = {} }) {
  const v = { state: 'valid', ...view };  // 'valid' | 'not-git' | 'no-base' | 'scanning' | 'scan-results'
  return (
    <div className="relative">
      <ShadcnPrePRLauncherScreen width={width} height={height}/>
      <AddRepoDialog state={v.state}/>
    </div>
  );
}

function AddRepoDialog({ state }) {
  const isScan = state === 'scanning' || state === 'scan-results';
  return (
    <div className="contents">
      <SDialog open width={620}>
        <SDialogHeader
          icon="folder-plus"
          title="Add repositories"
          description="Pyor indexes worktrees so it can spin up a local review in one click."
          onClose={() => {}}
        />
        {/* Mode tabs — segmented header */}
        <div className="border-b border-zinc-100 bg-zinc-50/40 px-3 pt-2.5">
          <div role="tablist" className="grid grid-cols-2 gap-1">
            <AddRepoModeTab active={!isScan} icon="folder"
              title="Pick a folder" desc="Add a single git repo."/>
            <AddRepoModeTab active={isScan} icon="scan-search"
              title="Scan a parent folder" desc="Auto-detect every repo inside."/>
          </div>
        </div>
        {isScan
          ? <AddRepoScanBody state={state}/>
          : <AddRepoPickBody state={state}/>}
      </SDialog>
    </div>
  );
}

function AddRepoModeTab({ active, icon, title, desc }) {
  return (
    <button role="tab"
      className={`flex items-center gap-2.5 rounded-t-md border-b-2 px-3 py-2 text-left transition-colors ${
        active
          ? 'border-zinc-900 bg-white text-zinc-900 shadow-[0_1px_0_0_white]'
          : 'border-transparent text-zinc-500 hover:bg-white/60 hover:text-zinc-700'
      }`}>
      <LI name={icon} className={`size-4 shrink-0 ${active ? 'text-zinc-900' : 'text-zinc-400'}`}/>
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold leading-tight">{title}</div>
        <div className={`text-[10.5px] leading-tight ${active ? 'text-zinc-500' : 'text-zinc-400'}`}>{desc}</div>
      </div>
    </button>
  );
}

// ── Pick-a-folder body ──────────────────────────────────────────
function AddRepoPickBody({ state }) {
  const validation = {
    valid: {
      tone: 'emerald', icon: 'check-circle', title: 'Valid repository',
      body: <>git repo · default branch <span className="font-mono text-[11.5px]">main</span> · 18 local branches · clean working tree</>,
    },
    'not-git': {
      tone: 'red', icon: 'alert-circle', title: 'Not a git repository',
      body: <>No <code className="font-mono text-[11px] bg-white/60 rounded px-1">.git</code> directory found in the selected folder. Run <code className="font-mono text-[11px] bg-white/60 rounded px-1">git init</code> or pick a different path.</>,
    },
    'no-base': {
      tone: 'amber', icon: 'alert-triangle', title: 'No remote base branch',
      body: <>The repo doesn't track a remote — Pyor can show you local diffs but can't help open a PR until you <code className="font-mono text-[11px] bg-white/60 rounded px-1">git push -u origin main</code>.</>,
    },
  }[state];
  const cardBd = validation.tone === 'emerald' ? 'border-emerald-200 bg-emerald-50/50'
              : validation.tone === 'amber'   ? 'border-amber-200 bg-amber-50/50'
              : 'border-red-200 bg-red-50/50';
  const iconColor = validation.tone === 'emerald' ? 'text-emerald-600'
                 : validation.tone === 'amber'   ? 'text-amber-600'
                 : 'text-red-600';
  return (
    <>
      <SDialogBody className="space-y-3.5">
        <div>
          <SLabel className="mb-1">Folder</SLabel>
          <div className="flex items-center gap-2">
            <SInput icon="folder" value="~/code/northwind/web-event-app" className="h-9 flex-1"/>
            <SButton variant="outline" size="sm">Browse…</SButton>
          </div>
        </div>
        <SCard className={cardBd}>
          <div className="flex items-start gap-2.5 p-3">
            <LI name={validation.icon} className={`mt-0.5 size-4 shrink-0 ${iconColor}`}/>
            <div className={`flex-1 text-[12.5px] leading-relaxed ${
              validation.tone === 'emerald' ? 'text-emerald-900'
              : validation.tone === 'amber' ? 'text-amber-900'
              : 'text-red-900'
            }`}>
              <div className="font-semibold">{validation.title}</div>
              <div className={
                validation.tone === 'emerald' ? 'text-emerald-700'
                : validation.tone === 'amber' ? 'text-amber-700'
                : 'text-red-700'
              }>{validation.body}</div>
            </div>
          </div>
        </SCard>
        <div>
          <SLabel className="mb-1">Default base branch</SLabel>
          <SInput icon="git-branch" value={state === 'no-base' ? '— none —' : 'main'} className="h-9" readOnly={false}/>
          <div className="mt-1 text-[11.5px] text-zinc-500">Used as the comparison base when you start a local review.</div>
        </div>
        <SCard className="bg-zinc-50/60">
          <div className="p-3 text-[12px] text-zinc-600 space-y-1.5">
            <div className="flex items-center gap-2"><SCheckbox checked/> <span>Watch this folder for new branches</span></div>
            <div className="flex items-center gap-2"><SCheckbox checked/> <span>Include uncommitted edits in diff by default</span></div>
            <div className="flex items-center gap-2"><SCheckbox/> <span>Auto-fetch every 5 minutes</span></div>
          </div>
        </SCard>
      </SDialogBody>
      <SDialogFooter>
        <span className="text-[11.5px] text-zinc-500">
          Stored at <code className="font-mono">~/Library/Application Support/Pyor/worktrees.json</code>
        </span>
        <SButton variant="ghost" size="sm" className="ml-auto">Cancel</SButton>
        <SButton variant="default" size="sm" icon="plus" disabled={state === 'not-git'}>Add repo</SButton>
      </SDialogFooter>
    </>
  );
}

// ── Scan-parent body ────────────────────────────────────────────
// Folder-walk discovery. User picks a parent dir; Pyor walks the tree
// looking for `.git` markers (skipping node_modules, .git internals,
// build dirs). Discovered repos surface as a multi-select list.
const SCAN_RESULTS = [
  { path: 'northwind/web-event-app',         branch: 'main',    branches: 18, last: '2m ago',  status: 'new',     remote: true,  selected: true,  size: '184 MB',  notes: 'has uncommitted edits' },
  { path: 'northwind/api',                   branch: 'main',    branches: 9,  last: '4h ago',  status: 'new',     remote: true,  selected: true,  size: '62 MB' },
  { path: 'northwind/mobile-ios',            branch: 'main',    branches: 6,  last: '1d ago',  status: 'new',     remote: true,  selected: true,  size: '412 MB' },
  { path: 'northwind/design-system',         branch: 'main',    branches: 12, last: '2d ago',  status: 'already', remote: true,  selected: false, size: '38 MB' },
  { path: 'northwind/analytics',             branch: 'develop', branches: 5,  last: '3d ago',  status: 'new',     remote: true,  selected: true,  size: '94 MB',   notes: 'no remote-tracking base' },
  { path: 'experiments/diff-prototype',      branch: 'main',    branches: 2,  last: '2w ago',  status: 'new',     remote: false, selected: true,  size: '4 MB',    notes: 'no remote — won\u2019t help open PRs' },
  { path: 'experiments/scratch-repo',        branch: 'master',  branches: 1,  last: '6mo ago', status: 'new',     remote: false, selected: false, size: '180 KB' },
];

function AddRepoScanBody({ state }) {
  const scanning = state === 'scanning';
  const found = scanning ? 3 : SCAN_RESULTS.length;
  const eligible = SCAN_RESULTS.filter(r => r.status === 'new');
  const selected = SCAN_RESULTS.filter(r => r.selected).length;
  return (
    <>
      <SDialogBody className="space-y-3">
        <div>
          <SLabel className="mb-1">Parent folder</SLabel>
          <div className="flex items-center gap-2">
            <SInput icon="folder-search" value="~/code" className="h-9 flex-1"/>
            <SButton variant="outline" size="sm">Browse…</SButton>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11.5px] text-zinc-500">
            <span>Walks up to 4 levels deep · skips <code className="font-mono text-[11px]">node_modules</code>, build dirs, hidden folders.</span>
            <button className="text-zinc-700 hover:underline">Settings…</button>
          </div>
        </div>

        {scanning ? (
          <ScanProgressCard found={found}/>
        ) : (
          <ScanResultsCard found={found} selected={selected} eligible={eligible.length}/>
        )}
      </SDialogBody>
      <SDialogFooter>
        {scanning ? (
          <>
            <span className="text-[11.5px] text-zinc-500">
              Scanning… <span className="tabular-nums text-zinc-700">{found}</span> repos found so far.
            </span>
            <SButton variant="ghost" size="sm" className="ml-auto">Cancel</SButton>
            <SButton variant="default" size="sm" disabled>Add 0 repos</SButton>
          </>
        ) : (
          <>
            <span className="text-[11.5px] text-zinc-500">
              <span className="tabular-nums text-zinc-700">{selected}</span> of {eligible.length} selected · {SCAN_RESULTS.filter(r => r.status === 'already').length} already in Pyor
            </span>
            <SButton variant="ghost" size="sm" className="ml-auto">Cancel</SButton>
            <SButton variant="default" size="sm" icon="plus">Add {selected} repos</SButton>
          </>
        )}
      </SDialogFooter>
    </>
  );
}

function ScanProgressCard({ found }) {
  // Indeterminate-style progress: fixed width animated stripe substitute.
  return (
    <SCard className="overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 px-3.5 py-2.5">
        <span className="relative inline-flex size-4 items-center justify-center">
          <span className="absolute inline-flex size-3 rounded-full bg-blue-500/40 motion-safe:animate-ping"/>
          <span className="relative inline-flex size-2 rounded-full bg-blue-600"/>
        </span>
        <span className="text-[12.5px] font-semibold text-zinc-900">Walking <code className="font-mono text-[11.5px] text-zinc-600">~/code</code>…</span>
        <span className="ml-auto text-[11px] tabular-nums text-zinc-500">
          <span className="text-zinc-900">{found}</span> repos · <span>1,847</span> folders walked
        </span>
      </div>
      <div className="px-3.5 pt-3 pb-2.5">
        <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full w-1/3 rounded-full bg-zinc-900" style={{
            animation: 'pier-scan-stripe 1.6s ease-in-out infinite'
          }}/>
        </div>
        <style>{`@keyframes pier-scan-stripe { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
      </div>
      <div className="border-t border-zinc-100">
        {SCAN_RESULTS.slice(0, found).map((r, i) => (
          <div key={r.path} className={`flex items-center gap-2.5 px-3.5 py-1.5 text-[12px] ${i ? 'border-t border-zinc-100' : ''}`}>
            <LI name="folder" className="size-3.5 text-zinc-400"/>
            <code className="font-mono text-[11.5px] text-zinc-700">{r.path}</code>
            <SBadge variant="success" className="ml-auto gap-1 text-[9.5px]">
              <LI name="check" className="size-2.5" strokeWidth={3}/>found
            </SBadge>
          </div>
        ))}
        <div className="flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-[11.5px] text-zinc-500">
          <LI name="folder" className="size-3 text-zinc-400"/>
          <code className="font-mono text-[11px] truncate">~/code/northwind/web-event-app/node_modules/…</code>
          <span className="ml-auto text-zinc-400">skipped</span>
        </div>
      </div>
    </SCard>
  );
}

function ScanResultsCard({ found, selected, eligible }) {
  return (
    <SCard className="overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-zinc-100 bg-zinc-50/60 px-3.5 py-2">
        <LI name="check-circle" className="size-4 text-emerald-600"/>
        <span className="text-[12.5px] font-semibold">Found {found} repositories</span>
        <span className="text-[11.5px] text-zinc-500">in <code className="font-mono">~/code</code></span>
        <div className="ml-auto flex items-center gap-1.5">
          <button className="text-[11.5px] font-medium text-zinc-700 hover:underline">Select all</button>
          <span className="text-zinc-300">·</span>
          <button className="text-[11.5px] font-medium text-zinc-700 hover:underline">None</button>
        </div>
      </div>
      <div className="max-h-[260px] overflow-auto">
        {SCAN_RESULTS.map((r, i) => <ScanResultRow key={r.path} r={r} first={i === 0}/>)}
      </div>
      <div className="flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-[11.5px] text-zinc-600">
        <SCheckbox checked/>
        <span>Skip repos with no remote</span>
        <span className="ml-3 inline-flex items-center gap-1.5"><SCheckbox/> <span>Watch all added repos for new branches</span></span>
      </div>
    </SCard>
  );
}

function ScanResultRow({ r, first }) {
  const isAlready = r.status === 'already';
  return (
    <div className={`flex items-start gap-2.5 px-3.5 py-2 ${first ? '' : 'border-t border-zinc-100'} ${isAlready ? 'bg-zinc-50/40' : 'hover:bg-zinc-50/60'}`}>
      <div className="pt-0.5">
        <SCheckbox checked={r.selected} disabled={isAlready}/>
      </div>
      <LI name="folder" className={`size-3.5 mt-0.5 shrink-0 ${isAlready ? 'text-zinc-300' : 'text-zinc-500'}`}/>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <code className={`truncate font-mono text-[12px] ${isAlready ? 'text-zinc-400 line-through decoration-zinc-300' : 'text-zinc-900 font-semibold'}`}>{r.path}</code>
          {isAlready && <SBadge variant="secondary" className="text-[9.5px]">already in Pyor</SBadge>}
          {!isAlready && !r.remote && <SBadge variant="warn" className="text-[9.5px]">no remote</SBadge>}
        </div>
        <div className={`mt-0.5 flex items-center gap-2 text-[11px] ${isAlready ? 'text-zinc-400' : 'text-zinc-500'}`}>
          <span className="inline-flex items-center gap-1">
            <LI name="git-branch" className="size-3"/>
            <span className="font-mono">{r.branch}</span>
          </span>
          <span className="text-zinc-300">·</span>
          <span>{r.branches} branches</span>
          <span className="text-zinc-300">·</span>
          <span>{r.size}</span>
          <span className="text-zinc-300">·</span>
          <span>last commit {r.last}</span>
          {r.notes && !isAlready && <>
            <span className="text-zinc-300">·</span>
            <span className="text-amber-700">{r.notes}</span>
          </>}
        </div>
      </div>
    </div>
  );
}
const MY_PRS_S = [
  { unread: 0, status: 'open',  title: "feat(ios): persist scroll offset across PR-list refreshes",
    repo: 'northwind/mobile-ios', branch: 'feat/persist-scroll', num: 1183, author: 'alex-cho', age: '11h',
    additions: 28, deletions: 5, files: 2, checks: { p: 7, f: 0, pe: 0 }, comments: 1, approved: true },
  { unread: 1, status: 'open',  title: "refactor(notifications): pull /notifications into shared client",
    repo: 'northwind/web-event-app', branch: 'refactor/notifs-client', num: 9244, author: 'alex-cho', age: '1d',
    additions: 218, deletions: 184, files: 9, checks: { p: 18, f: 0, pe: 0 }, comments: 4 },
  { unread: 0, status: 'draft', title: "RFC: introduce a Pre-PR review surface in Pyor",
    repo: 'northwind/web-event-app', branch: 'rfc/pre-pr', num: 9201, author: 'alex-cho', age: '2d',
    additions: 612, deletions: 8, files: 14, checks: { p: 16, f: 0, pe: 1 }, comments: 12, draft: true },
];
const REVIEWING_PRS_S = [
  { unread: 3, status: 'open',  title: "feat(scheduler): coalesce identical session pushes into a single fan-out",
    repo: 'northwind/web-event-app', branch: 'feat/coalesce-push', num: 9241, author: 'priya-r', age: '12m',
    additions: 412, deletions: 89, files: 14, checks: { p: 18, f: 0, pe: 2 }, comments: 4, selected: true },
  { unread: 5, status: 'open',  title: "perf(diff-render): virtualise hunks larger than 2k lines",
    repo: 'northwind/web-event-app', branch: 'perf/virtualise-hunks', num: 9217, author: 'nicolae-i', age: '1d',
    additions: 904, deletions: 311, files: 7, checks: { p: 16, f: 2, pe: 0 }, comments: 23, changes: true },
  { unread: 0, status: 'open',  title: "fix(billing): correct prorated charge math when plan downgrades mid-cycle",
    repo: 'northwind/api', branch: 'fix/proration', num: 4471, author: 'marcus-w', age: '1h',
    additions: 38, deletions: 47, files: 4, checks: { p: 23, f: 0, pe: 0 }, comments: 7 },
  { unread: 2, status: 'open',  title: "Empty-state polish for event picker on small viewports",
    repo: 'northwind/design-system', branch: 'polish/empty-states', num: 612, author: 'jules-k', age: '7h',
    additions: 64, deletions: 22, files: 3, checks: { p: 11, f: 0, pe: 0 }, comments: 2 },
  { unread: 1, status: 'draft', title: "RFC: cohort export pipeline (S3 + Athena)",
    repo: 'northwind/analytics', branch: 'rfc/cohort-export', num: 308, author: 'sara-l', age: '3h',
    additions: 1240, deletions: 12, files: 38, checks: { p: 4, f: 1, pe: 3 }, comments: 12, draft: true },
  { unread: 1, status: 'open',  title: "spike: replace Redux with Zustand on the attendee dashboard",
    repo: 'northwind/web-event-app', branch: 'spike/zustand', num: 9198, author: 'marcus-w', age: '2d',
    additions: 1820, deletions: 1640, files: 56, checks: { p: 14, f: 0, pe: 0 }, comments: 31 },
];

function ShadcnPullRequestsScreen({ width = 1320, height = 820, view = {} }) {
  const v = {
    tab: 'reviewing',
    empty: null,
    // Search + date range live on the tabs bar now.
    search: '',
    dateRange: 'Last 30 days',
    dateRangeOpen: false,
    // Infinite list state
    loading: false,
    pagesLoaded: 1,
    ...view,
  };
  const rows = v.tab === 'mine' ? MY_PRS_S : REVIEWING_PRS_S;
  return (
    <PierWindowShell width={width} height={height}
      title="Pull requests" subtitle={v.tab === 'mine' ? 'Authored by you' : 'In your review queue'}
      sidebar={<PierSidebar active="pulls"/>}
      toolbar={v.empty === 'no-token'
        ? <SButton variant="default" size="sm" icon="key-round">Connect GitHub</SButton>
        : <>
            <SButton variant="ghost" size="sm" icon="refresh">Refresh</SButton>
            <SButton variant="outline" size="sm" icon="arrow-up-down">Sort: Activity</SButton>
          </>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Connected · alex-cho</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Last poll <span className="text-zinc-900">22s ago</span></span>
        <span className="ml-auto">54 PRs cached · 42 MB · GraphQL search · 1000-row cap</span>
      </>}
    >
      {/* Tabs bar — search input + date range live on the right side */}
      <ShadcnPRsTabsBar v={v}/>
      {/* Filter chip row */}
      {v.empty !== 'no-token' && (
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2">
          <SChip label="Status" value="Open" active/>
          <SChip label="Repo" value={v.empty === 'filtered' ? 'northwind/infra' : 'any'} active={v.empty === 'filtered'}/>
          <SChip label="Author" value={v.empty === 'filtered' ? 'dependabot' : 'any'} active={v.empty === 'filtered'}/>
          <SChip label="Reviewer" value="any"/>
          <SChip label="CI" value="any"/>
          <SChip label="Label" value="any"/>
          {v.empty === 'filtered' && <SButton variant="ghost" size="sm">Clear all</SButton>}
          <span className="ml-auto text-[11.5px] text-zinc-500">
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10.5px]">/search/issues</code> · <span className="tabular-nums">{rows.length}</span> of ~84
          </span>
        </div>
      )}
      {/* Body */}
      {v.empty == null
        ? (
          <div className="flex-1 overflow-auto">
            {rows.map((pr, i) => <ShadcnPRRowV2 key={i} pr={pr}/>)}
            <PRsInfiniteFooter loading={v.loading} pagesLoaded={v.pagesLoaded} shown={rows.length}/>
          </div>
        )
        : <ShadcnPullEmpty kind={v.empty}/>}
    </PierWindowShell>
  );
}

// Tabs bar with search input + date range chip on the right.
// Replaces the previous STabsUnderline call so we can host inline
// filter affordances alongside the tab triggers.
function ShadcnPRsTabsBar({ v }) {
  const tabs = [
    { id: 'mine',      label: 'My PRs',    icon: 'user',  count: MY_PRS_S.length },
    { id: 'reviewing', label: 'Reviewing', icon: 'eye',   count: REVIEWING_PRS_S.length },
  ];
  return (
    <div className="flex items-center border-b border-zinc-200 px-5">
      {tabs.map(t => {
        const on = t.id === v.tab;
        return (
          <button key={t.id}
            className={`relative inline-flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${on ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}>
            <LI name={t.icon} className={`size-3.5 ${on ? 'text-zinc-900' : 'text-zinc-400'}`}/>
            <span>{t.label}</span>
            <span className={`tabular-nums text-[11px] ${on ? 'text-zinc-500' : 'text-zinc-400'}`}>{t.count}</span>
            {on && <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-zinc-900"/>}
          </button>
        );
      })}
      {/* Right cluster — search + date range chip */}
      <div className="ml-auto flex items-center gap-2 py-1.5">
        <SInput icon="search"
          placeholder="Filter PRs · title, repo, author, label…"
          kbd="⌘F"
          value={v.search}
          className="w-80"/>
        <DateRangeChip open={v.dateRangeOpen} value={v.dateRange} active={v.dateRange && v.dateRange !== 'All time'}/>
      </div>
    </div>
  );
}

// Infinite-list sentinel at the bottom of the PR list.
// Three states mirror the comments-list footer.
function PRsInfiniteFooter({ loading, pagesLoaded, shown }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 border-t border-zinc-100 px-4 py-5 text-[12px] text-zinc-500">
        <svg viewBox="0 0 24 24" className="size-3.5 animate-[spin_1s_linear_infinite] text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
        </svg>
        <span>Loading page {pagesLoaded + 1}…</span>
        <span className="text-zinc-300">·</span>
        <span className="tabular-nums">{shown} of ~84</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-1.5 border-t border-zinc-100 px-4 py-5">
      <div className="flex items-center gap-3 text-[12px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <LI name="git-pull-request" className="size-3.5 text-zinc-400"/>
          <span><span className="tabular-nums text-zinc-700">{shown}</span> shown · {pagesLoaded} {pagesLoaded === 1 ? 'page' : 'pages'} loaded</span>
        </span>
        <SSeparator vertical className="h-3"/>
        <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50">
          <LI name="chevron-down" className="size-3.5"/>Load more
        </button>
      </div>
      <span className="text-[10.5px] text-zinc-400">
        Scroll to auto-load · GraphQL cursor pagination · 100 / page
      </span>
    </div>
  );
}

function ShadcnPRRowV2({ pr }) {
  const icon = pr.draft ? 'git-pull-request-draft' : 'git-pull-request';
  const iconColor = pr.draft ? 'text-zinc-400' : 'text-emerald-600';
  return (
    <div className={`relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-5 py-3 ${pr.selected ? 'bg-blue-50/40' : 'hover:bg-zinc-50'}`}>
      {pr.selected && <span className="absolute left-0 top-0 h-full w-0.5 bg-zinc-900"/>}
      <div className="w-1.5 pt-1.5 shrink-0">
        {pr.unread > 0 && <span className="block size-1.5 rounded-full bg-blue-600"/>}
      </div>
      <LI name={icon} className={`size-4 shrink-0 mt-0.5 ${iconColor}`}/>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`truncate text-[13.5px] tracking-tight ${pr.unread ? 'font-semibold' : 'font-medium'} text-zinc-900`} style={{ maxWidth: 580 }}>
            {pr.title}
          </span>
          {pr.changes && <SBadge variant="destructive">changes requested</SBadge>}
          {pr.approved && <SBadge variant="success">approved by you</SBadge>}
          {pr.draft && <SBadge variant="secondary">draft</SBadge>}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-zinc-500">
          <span className="font-mono text-[11px] text-zinc-400">#{pr.num}</span>
          <span className="text-zinc-300">·</span>
          <span>{pr.repo}</span>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1.5"><SAvatar name={pr.author} size="size-4"/>{pr.author}</span>
          <span className="text-zinc-300">·</span>
          <span className="font-mono text-[11px]">{pr.branch}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-500">
        <div className="text-right min-w-[72px]">
          <div className="text-[10.5px] text-zinc-400">{pr.files} files</div>
          <div className="font-mono text-[10.5px]">
            <span className="text-emerald-600">+{pr.additions.toLocaleString()}</span>{' '}
            <span className="text-red-600">−{pr.deletions}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-[64px]">
          {pr.checks.p > 0 && <span className="inline-flex items-center gap-1"><LI name="check-circle" className="size-3.5 text-emerald-600"/>{pr.checks.p}</span>}
          {pr.checks.f > 0 && <span className="inline-flex items-center gap-1"><LI name="x-circle" className="size-3.5 text-red-600"/>{pr.checks.f}</span>}
          {pr.checks.pe > 0 && <span className="inline-flex items-center gap-1"><LI name="circle-dot" className="size-3.5 text-amber-600"/>{pr.checks.pe}</span>}
        </div>
        <div className="min-w-[36px]">
          {pr.comments > 0 ? (
            <span className="inline-flex items-center gap-1">
              <LI name="message-square" className={`size-3.5 ${pr.unread ? 'text-blue-600' : 'text-zinc-400'}`}/>
              <span className={pr.unread ? 'font-semibold text-blue-600' : ''}>{pr.comments}</span>
            </span>
          ) : <span className="text-zinc-300">—</span>}
        </div>
        <div className="min-w-[28px] text-right text-zinc-400">{pr.age}</div>
      </div>
    </div>
  );
}

function ShadcnPullEmpty({ kind }) {
  const v = {
    mine: { icon: 'git-pull-request', iconClass: 'text-zinc-400',
      title: 'No open PRs you authored.',
      body: 'Open one in your terminal and refresh — Pyor picks them up as soon as the API does.',
      action: <SButton variant="outline" size="sm" icon="refresh">Refresh</SButton> },
    reviewing: { icon: 'eye', iconClass: 'text-zinc-400',
      title: 'Nothing in your review queue.',
      body: "PRs you're a requested reviewer on, have commented on, or are subscribed to will show up here.",
      action: <SButton variant="outline" size="sm">Browse your team's PRs</SButton> },
    'no-token': { icon: 'lock', iconClass: 'text-red-500',
      title: 'Connect GitHub to see your PRs.',
      body: 'Pyor needs a personal access token with repo + notifications scope. Settings stays local — the token lives in your Keychain.',
      action: <SButton variant="default" size="sm" icon="key-round">Connect GitHub</SButton> },
    filtered: { icon: 'sliders', iconClass: 'text-zinc-400',
      title: 'No PRs match these filters.',
      body: '2 filters applied. Clear them to see the full list, or adjust them above.',
      action: <SButton variant="outline" size="sm">Clear all filters</SButton>,
      secondary: (
        <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11.5px] text-zinc-500">
          <span className="text-zinc-400">Active filters:</span>
          <SBadge variant="default" className="text-[10px]">Repo: northwind/infra</SBadge>
          <SBadge variant="default" className="text-[10px]">Author: dependabot</SBadge>
        </div>
      ) },
  }[kind];
  return <EmptyState {...v}/>;
}

// ═══ Screen — Local reviews list ═══════════════════════════════
// Catalog of local pre-PR reviews on this machine. Mirrors Pull requests
// shape: rows with status icon, title/branch, head→base, last activity,
// uncommitted count + ahead/behind, viewed progress, age. "New local
// review" CTA opens the launcher.

const LOCAL_REVIEWS = [
  {
    id: 'lr1', status: 'in-progress',
    title: 'perf(diff-render): virtualise hunks larger than 2k lines',
    repo: 'northwind/web-event-app',
    head: 'perf/virtualise-hunks', base: 'main',
    ahead: 14, behind: 0, uncommitted: 3,
    additions: 904, deletions: 311, files: 7,
    viewed: 3, viewedOf: 7,
    notes: 4,
    lastActivity: 'just now', selected: true,
  },
  {
    id: 'lr2', status: 'ready',
    title: 'refactor(notifications): pull /notifications into shared client',
    repo: 'northwind/web-event-app',
    head: 'refactor/notifs-client', base: 'main',
    ahead: 9, behind: 2, uncommitted: 0,
    additions: 218, deletions: 184, files: 9,
    viewed: 9, viewedOf: 9,
    notes: 7,
    lastActivity: '32m ago',
  },
  {
    id: 'lr3', status: 'in-progress',
    title: 'WIP: replace Redux with Zustand on the attendee dashboard',
    repo: 'northwind/web-event-app',
    head: 'spike/zustand', base: 'main',
    ahead: 38, behind: 14, uncommitted: 12,
    additions: 1820, deletions: 1640, files: 56,
    viewed: 11, viewedOf: 56,
    notes: 18,
    lastActivity: '2h ago', dirty: true,
  },
  {
    id: 'lr4', status: 'pr-opened',
    title: 'feat(ios): persist scroll offset across PR-list refreshes',
    repo: 'northwind/mobile-ios',
    head: 'feat/persist-scroll', base: 'main',
    ahead: 4, behind: 0, uncommitted: 0,
    additions: 28, deletions: 5, files: 2,
    viewed: 2, viewedOf: 2,
    notes: 0,
    lastActivity: '11h ago', prNum: 1183,
  },
  {
    id: 'lr5', status: 'ready',
    title: 'RFC: introduce a Pre-PR review surface in Pyor',
    repo: 'northwind/web-event-app',
    head: 'rfc/pre-pr', base: 'main',
    ahead: 22, behind: 0, uncommitted: 0,
    additions: 612, deletions: 8, files: 14,
    viewed: 14, viewedOf: 14,
    notes: 12,
    lastActivity: '2d ago',
  },
  {
    id: 'lr6', status: 'stale',
    title: 'experiment: pre-render diff hunks in a worker',
    repo: 'northwind/web-event-app',
    head: 'spike/diff-worker', base: 'main',
    ahead: 6, behind: 142, uncommitted: 0,
    additions: 184, deletions: 12, files: 4,
    viewed: 1, viewedOf: 4,
    notes: 1,
    lastActivity: '3w ago',
  },
];

const LOCAL_STATUS_CFG = {
  'in-progress': { label: 'In progress', icon: 'circle-dot',     variant: 'warn' },
  'ready':       { label: 'Ready to PR', icon: 'check-circle',   variant: 'success' },
  'pr-opened':   { label: 'PR opened',   icon: 'git-pull-request', variant: 'default' },
  'stale':       { label: 'Stale',       icon: 'clock',          variant: 'secondary' },
};

// Archived = repo was removed from Pyor. The review row is kept but
// rendered with an archived treatment (legible, dimmed, no longer
// linked to a live worktree). Re-adding the repo restores the rows.
const LOCAL_ARCHIVED = [
  { id: 'a1', archivedFrom: 'northwind/infra', archivedAt: '4d ago',
    title: 'tf: split networking module into a dedicated workspace',
    head: 'refactor/network-workspace', base: 'main',
    additions: 412, deletions: 187, files: 11,
    viewed: 8, viewedOf: 11, notes: 6, lastActivity: '4d ago' },
  { id: 'a2', archivedFrom: 'northwind/infra', archivedAt: '4d ago',
    title: 'ci: drop the legacy GitLab runner from build matrix',
    head: 'ci/drop-gitlab', base: 'main',
    additions: 14, deletions: 196, files: 3,
    viewed: 3, viewedOf: 3, notes: 1, lastActivity: '6d ago' },
  { id: 'a3', archivedFrom: 'northwind/dashboards',  archivedAt: '2w ago',
    title: 'spike: replace Looker tiles with self-hosted Grafana panels',
    head: 'spike/grafana-tiles', base: 'main',
    additions: 624, deletions: 38, files: 18,
    viewed: 4, viewedOf: 18, notes: 9, lastActivity: '2w ago' },
];

function ShadcnLocalReviewsScreen({ width = 1320, height = 820, view = {} }) {
  const v = {
    empty: 'list',           // 'list' (empty default) | null (populated) | 'filtered'
    archivedExpanded: false, // collapsible "N archived" footer
    repoFilterOpen: false,   // Repo filter chip popover open
    confirmRemoveOpen: false,// "Remove from Pyor?" confirm dialog
    ...view,
  };
  const rows = v.empty === 'filtered'
    ? LOCAL_REVIEWS.filter(r => r.status === 'stale' && r.repo === 'northwind/infra')
    : LOCAL_REVIEWS;
  const showEmpty = v.empty === 'list' || (v.empty === 'filtered' && rows.length === 0);
  // Whether to surface the archived section. Hidden in empty view.
  const showArchived = !showEmpty && LOCAL_ARCHIVED.length > 0;
  return (
    <PierWindowShell width={width} height={height}
      title="Local reviews" subtitle={showEmpty ? 'None yet' : `${LOCAL_REVIEWS.length} on this machine`}
      sidebar={<PierSidebar active="local"/>}
      toolbar={<>
        <SInput icon="search" placeholder="Filter local reviews" kbd="⌘F" className="w-56"/>
        <SButton variant="ghost" size="sm" icon="refresh">Refresh</SButton>
        <SButton variant="default" size="sm" icon="plus">Create new local review</SButton>
      </>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>git OK · 4 worktrees discovered</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Watching <span className="text-zinc-900">~/code</span></span>
        <span className="ml-auto">No GitHub round-trips · everything below is local</span>
      </>}
    >
      {!showEmpty && (
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2">
          <SChip label="Status" value="any"/>
          <RepoManageChip
            open={v.repoFilterOpen}
            value={v.empty === 'filtered' ? 'northwind/infra' : 'any'}
            active={v.empty === 'filtered'}/>
          <SChip label="Base"   value="any"/>
          {v.empty === 'filtered' && <SButton variant="ghost" size="sm">Clear all</SButton>}
          <span className="ml-auto text-[11.5px] text-zinc-500">
            Sorted by <span className="text-zinc-700">Last activity ↓</span>
          </span>
        </div>
      )}
      {showEmpty
        ? <LocalReviewsEmpty kind={v.empty || 'list'}/>
        : (
          <div className="flex-1 overflow-auto">
            {rows.map(r => <LocalReviewRow key={r.id} r={r}/>)}
            {showArchived && <ArchivedSection expanded={v.archivedExpanded}/>}
          </div>
        )}
      {v.confirmRemoveOpen && <ConfirmRemoveRepoDialog repoName="northwind/infra" reviewCount={2}/>}
    </PierWindowShell>
  );
}

function LocalReviewRow({ r }) {
  const cfg = LOCAL_STATUS_CFG[r.status];
  const viewedPct = (r.viewed / r.viewedOf) * 100;
  return (
    <div className={`relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-5 py-3 ${r.selected ? 'bg-blue-50/40' : 'hover:bg-zinc-50'}`}>
      {r.selected && <span className="absolute left-0 top-0 h-full w-0.5 bg-zinc-900"/>}
      <LI name={cfg.icon} className={`size-4 shrink-0 mt-0.5 ${
        r.status === 'ready'       ? 'text-emerald-600' :
        r.status === 'pr-opened'   ? 'text-blue-600' :
        r.status === 'in-progress' ? 'text-amber-600' :
        'text-zinc-400'
      }`}/>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[13.5px] font-semibold tracking-tight text-zinc-900" style={{ maxWidth: 540 }}>
            {r.title}
          </span>
          <SBadge variant={cfg.variant} className="gap-1">{cfg.label}</SBadge>
          {r.dirty && (
            <SBadge variant="warn" className="gap-1">
              <LI name="alert-triangle" className="size-2.5"/>{r.uncommitted} uncommitted
            </SBadge>
          )}
          {r.behind > 0 && r.status === 'stale' && (
            <SBadge variant="secondary" className="gap-1">
              <LI name="arrow-down" className="size-2.5"/>{r.behind} behind
            </SBadge>
          )}
          {r.status === 'pr-opened' && (
            <SBadge variant="outline" className="gap-1 font-mono text-[10.5px]">
              <LI name="git-pull-request" className="size-2.5"/>#{r.prNum}
            </SBadge>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-zinc-500">
          <span>{r.repo}</span>
          <span className="text-zinc-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <LI name="folder" className="size-3 text-zinc-400"/>
            <span className="font-mono text-[11px] text-zinc-700">{r.head}</span>
            <LI name="chevron-right" className="size-2.5 text-zinc-400"/>
            <span className="font-mono text-[11px]">{r.base}</span>
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-500">
        {/* Ahead / behind */}
        <div className="min-w-[68px] text-right">
          <div className="text-[10.5px] text-zinc-400">commits</div>
          <div className="font-mono text-[10.5px]">
            <span className="text-emerald-600">↑{r.ahead}</span>{' '}
            <span className={r.behind > 0 ? 'text-amber-600' : 'text-zinc-300'}>↓{r.behind}</span>
          </div>
        </div>
        {/* +/− and files */}
        <div className="min-w-[80px] text-right">
          <div className="text-[10.5px] text-zinc-400">{r.files} files</div>
          <div className="font-mono text-[10.5px]">
            <span className="text-emerald-600">+{r.additions.toLocaleString()}</span>{' '}
            <span className="text-red-600">−{r.deletions}</span>
          </div>
        </div>
        {/* Viewed progress */}
        <div className="min-w-[88px]">
          <div className="mb-0.5 flex items-baseline justify-between text-[10.5px] text-zinc-400">
            <span>Viewed</span>
            <span className="font-mono tabular-nums">{r.viewed}/{r.viewedOf}</span>
          </div>
          <div className="h-1 rounded-full bg-zinc-100 overflow-hidden">
            <div className={`h-full ${viewedPct === 100 ? 'bg-emerald-500' : 'bg-zinc-900'}`} style={{ width: `${viewedPct}%` }}/>
          </div>
        </div>
        {/* Notes */}
        <div className="min-w-[36px]">
          {r.notes > 0 ? (
            <span className="inline-flex items-center gap-1">
              <LI name="message-square" className="size-3.5 text-zinc-400"/>
              <span>{r.notes}</span>
            </span>
          ) : <span className="text-zinc-300">—</span>}
        </div>
        <div className="min-w-[64px] text-right text-zinc-400">{r.lastActivity}</div>
      </div>
    </div>
  );
}

// ── Repo filter chip with management dropdown ─────────────────
// Replaces the basic SChip on the Local Reviews filter row. Opens an
// SPopover with a searchable list of registered repos; each row exposes
// a hover-revealed trash that fires "Remove from Pyor?" confirmation.
const LOCAL_REPOS_REGISTERED = [
  { id: 'web',    name: 'northwind/web-event-app',  reviews: 4, lastActive: 'just now',  worktrees: 2, dirty: true  },
  { id: 'mobile', name: 'northwind/mobile-ios',     reviews: 1, lastActive: '11h ago',   worktrees: 1, dirty: false },
  { id: 'api',    name: 'northwind/api',            reviews: 0, lastActive: '4h ago',    worktrees: 1, dirty: false },
  { id: 'infra',  name: 'northwind/infra',          reviews: 1, lastActive: '3w ago',    worktrees: 1, dirty: false, willRemove: true },
  { id: 'design', name: 'northwind/design-system',  reviews: 0, lastActive: '2d ago',    worktrees: 2, dirty: false },
];

function RepoManageChip({ open, value, active }) {
  return (
    <SPopover open={open} width={380} align="start" trigger={
      <span className="inline-block">
        <SChip label="Repo" value={value || 'any'} active={active || open}/>
      </span>
    }>
      <SCommand>
        <SCommandInput placeholder="Filter repos…" matches={LOCAL_REPOS_REGISTERED.length}/>
        <SCommandGroup heading="Filter by">
          <SCommandItem active={!active}>
            <LI name="globe" className="size-3.5 text-zinc-400"/>
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="text-[12.5px] font-medium text-zinc-900">Any repo</span>
              {!active && <LI name="check" className="size-3 text-zinc-900" strokeWidth={3}/>}
              <span className="ml-auto text-[11px] text-zinc-400 tabular-nums">{LOCAL_REVIEWS.length}</span>
            </div>
          </SCommandItem>
        </SCommandGroup>
        <SCommandGroup heading="Registered repos">
          {LOCAL_REPOS_REGISTERED.map(r => (
            <RepoFilterRow key={r.id} r={r} active={r.name === value}/>
          ))}
        </SCommandGroup>
        <SCommandFooter>
          <SDropdownItem icon="plus" kbd="⌘N">Add a repo…</SDropdownItem>
          <SDropdownItem icon="scan-search">Scan a parent folder…</SDropdownItem>
        </SCommandFooter>
      </SCommand>
    </SPopover>
  );
}

function RepoFilterRow({ r, active }) {
  return (
    <div className={`group relative flex items-center gap-2.5 rounded-sm px-2 py-1.5 ${active ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}>
      <LI name="github" className={`size-3.5 ${active ? 'text-zinc-900' : 'text-zinc-400'}`}/>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`truncate text-[12.5px] ${active ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-900'}`}>{r.name}</span>
          {active && <LI name="check" className="size-3 text-zinc-900" strokeWidth={3}/>}
          {r.willRemove && <SBadge variant="destructive" className="text-[9.5px]">about to remove</SBadge>}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span className="tabular-nums">{r.reviews} review{r.reviews === 1 ? '' : 's'}</span>
          <span className="text-zinc-300">·</span>
          <span>{r.worktrees} worktree{r.worktrees > 1 ? 's' : ''}</span>
          <span className="text-zinc-300">·</span>
          <span>active {r.lastActive}</span>
        </div>
      </div>
      {/* Per-row trash — fires the confirm dialog. Visible on hover, always visible for the row pre-removed. */}
      <button
        title={`Remove ${r.name} from Pyor`}
        className={`inline-flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 ${r.willRemove ? '' : 'invisible group-hover:visible'}`}>
        <LI name="trash-2" className="size-3.5"/>
      </button>
    </div>
  );
}

// ── Confirm remove-repo dialog ───────────────────────────────
// Fired from the Repo filter chip's trash. Soft delete: saved reviews
// stay listed (archived state) so the user doesn't lose notes.
function ConfirmRemoveRepoDialog({ repoName, reviewCount }) {
  return (
    <SDialog open width={480}>
      <SDialogHeader
        icon="trash-2"
        title={<>Remove <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12.5px]">{repoName}</code> from Pyor?</>}
        description="Pyor will stop watching this folder. Your local files are not touched."
        onClose={() => {}}
      />
      <SDialogBody>
        <SCard className="border-zinc-200 bg-zinc-50/60">
          <div className="flex items-start gap-2.5 p-3">
            <LI name="archive" className="mt-0.5 size-4 shrink-0 text-zinc-500"/>
            <div className="flex-1 text-[12.5px] leading-relaxed text-zinc-700">
              <div className="font-semibold text-zinc-900">{reviewCount} saved review{reviewCount === 1 ? '' : 's'} will be archived</div>
              <div className="text-zinc-600">Notes, threads, and viewed-state stay intact. They'll surface in the <span className="font-semibold text-zinc-700">{reviewCount} archived</span> section at the bottom of Local reviews.</div>
            </div>
          </div>
        </SCard>
        <div className="mt-3 grid gap-1.5 text-[12px] text-zinc-600">
          <div className="flex items-start gap-2">
            <LI name="check" className="mt-0.5 size-3 text-emerald-600" strokeWidth={3}/>
            <span>Re-add this repo later — archived reviews automatically restore.</span>
          </div>
          <div className="flex items-start gap-2">
            <LI name="check" className="mt-0.5 size-3 text-emerald-600" strokeWidth={3}/>
            <span>Delete archived reviews individually whenever you like.</span>
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50/40 px-2.5 py-2 text-[12px] text-red-900">
          <SCheckbox/>
          <span>Also delete the {reviewCount} review{reviewCount === 1 ? '' : 's'} permanently — <span className="text-red-700">cannot be undone</span></span>
        </label>
      </SDialogBody>
      <SDialogFooter>
        <SButton variant="ghost" size="sm" className="ml-auto">Cancel</SButton>
        <SButton variant="destructive" size="sm" icon="trash-2">Remove repo</SButton>
      </SDialogFooter>
    </SDialog>
  );
}

// ── Archived section ─────────────────────────────────────────
// Collapsible footer that surfaces soft-deleted reviews. Reads
// "archived not broken" — softer typography, archive icon, subtle
// background, per-row kebab to permanently delete or restore the
// originating repo.
function ArchivedSection({ expanded }) {
  const groupedByRepo = LOCAL_ARCHIVED.reduce((acc, r) => {
    (acc[r.archivedFrom] = acc[r.archivedFrom] || []).push(r);
    return acc;
  }, {});
  return (
    <div className="border-t-2 border-dashed border-zinc-200/80 bg-zinc-50/30">
      {/* Header — clickable, accordion-style */}
      <button className="flex w-full items-center gap-2.5 px-5 py-2.5 text-left hover:bg-zinc-50/80">
        <LI name={expanded ? 'chevron-down' : 'chevron-right'} className="size-3.5 text-zinc-500"/>
        <LI name="archive" className="size-3.5 text-zinc-500"/>
        <span className="text-[12.5px] font-semibold text-zinc-700">Archived</span>
        <SBadge variant="secondary" className="text-[10.5px]">{LOCAL_ARCHIVED.length}</SBadge>
        <span className="text-[11.5px] text-zinc-500">
          From {Object.keys(groupedByRepo).length} removed repos · notes preserved
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-zinc-500">
          <LI name="archive-restore" className="size-3.5 text-zinc-400"/>
          <span>Re-add the repo to restore</span>
        </span>
      </button>
      {expanded && (
        <div className="border-t border-zinc-200/80">
          {Object.entries(groupedByRepo).map(([repo, items]) => (
            <div key={repo}>
              <div className="flex items-center gap-2 border-b border-zinc-200/60 bg-zinc-100/50 px-5 py-1.5 text-[11px] text-zinc-500">
                <LI name="github" className="size-3 text-zinc-400"/>
                <code className="font-mono text-[11px] text-zinc-600">{repo}</code>
                <span className="text-zinc-300">·</span>
                <span>removed {items[0].archivedAt}</span>
                <span className="text-zinc-300">·</span>
                <span>{items.length} archived review{items.length === 1 ? '' : 's'}</span>
                <button className="ml-auto inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50">
                  <LI name="archive-restore" className="size-3"/>
                  Restore repo…
                </button>
              </div>
              {items.map(r => <ArchivedReviewRow key={r.id} r={r}/>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchivedReviewRow({ r }) {
  const viewedPct = (r.viewed / r.viewedOf) * 100;
  return (
    <div className="group relative flex cursor-pointer items-start gap-3 border-b border-zinc-200/60 px-5 py-3 hover:bg-zinc-50/80">
      {/* Status icon → archive box, not a broken-state icon */}
      <LI name="archive" className="size-4 shrink-0 mt-0.5 text-zinc-400"/>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-[13.5px] font-medium tracking-tight text-zinc-600" style={{ maxWidth: 520 }}>
            {r.title}
          </span>
          <SBadge variant="outline" className="gap-1 text-[10px] text-zinc-500">
            <LI name="archive" className="size-2.5"/>Archived
          </SBadge>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <LI name="folder" className="size-3 text-zinc-400"/>
            <span className="font-mono text-[11px] text-zinc-500">{r.head}</span>
            <LI name="chevron-right" className="size-2.5 text-zinc-400"/>
            <span className="font-mono text-[11px]">{r.base}</span>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-zinc-500">Notes preserved · read-only</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-400">
        <div className="min-w-[80px] text-right">
          <div className="text-[10.5px] text-zinc-400">{r.files} files</div>
          <div className="font-mono text-[10.5px]">
            <span className="text-zinc-500">+{r.additions.toLocaleString()}</span>{' '}
            <span className="text-zinc-500">−{r.deletions}</span>
          </div>
        </div>
        <div className="min-w-[88px]">
          <div className="mb-0.5 flex items-baseline justify-between text-[10.5px] text-zinc-400">
            <span>Viewed</span>
            <span className="font-mono tabular-nums">{r.viewed}/{r.viewedOf}</span>
          </div>
          <div className="h-1 rounded-full bg-zinc-100 overflow-hidden">
            <div className="h-full bg-zinc-400" style={{ width: `${viewedPct}%` }}/>
          </div>
        </div>
        <div className="min-w-[36px]">
          {r.notes > 0 ? (
            <span className="inline-flex items-center gap-1 text-zinc-500">
              <LI name="message-square" className="size-3.5"/>
              <span>{r.notes}</span>
            </span>
          ) : <span className="text-zinc-300">—</span>}
        </div>
        <div className="min-w-[60px] text-right">{r.lastActivity}</div>
        {/* Kebab — visible on hover. Permanently delete or restore. */}
        <SDropdownMenu width={210} trigger={
          <button className="inline-flex size-7 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-zinc-700 group-hover:opacity-100">
            <LI name="more-horizontal" className="size-3.5"/>
          </button>
        }>
          <SDropdownItem icon="archive-restore">Re-add <span className="font-mono text-[11px]">{r.archivedFrom}</span></SDropdownItem>
          <SDropdownItem icon="external-link">Open notes (read-only)</SDropdownItem>
          <SDropdownSeparator/>
          <SDropdownItem icon="trash-2" danger>Delete permanently</SDropdownItem>
        </SDropdownMenu>
      </div>
    </div>
  );
}

function LocalReviewsEmpty({ kind }) {
  if (kind === 'filtered') {
    return <EmptyState icon="sliders" iconClass="text-zinc-400"
      title="No local reviews match these filters."
      body="Clear the filters above to see the full list."
      action={<SButton variant="outline" size="sm">Clear all filters</SButton>}/>;
  }
  return (
    <EmptyState
      icon="monitor"
      iconClass="text-zinc-500"
      title="No local reviews yet."
      body="Local reviews let you walk your own branch diff before opening a PR. Notes you leave migrate as review comments when you ship it."
      action={<>
        <SButton variant="default" size="sm" icon="plus">Create new local review</SButton>
        <SButton variant="ghost" size="sm" icon="external-link">Read the spec</SButton>
      </>}
    />
  );
}

// ═══ Screen — PR detail (Files changed) ══════════════════════
// Re-uses ShadcnFilesScreen body but wraps it in the new shell.

function ShadcnPRDetailFilesScreen({ width = 1320, height = 900, from = 'inbox', view = {} }) {
  const v = { commitsOpen: false, hideComments: false, unifiedToolbar: true, headerDensity: 'single-strip', ...view };
  const backLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  const [hideComments, setHideComments] = React.useState(!!v.hideComments);
  return (
    <PierWindowShell width={width} height={height}
      title="" subtitle=""
      sidebar={<PierSidebar active={from === 'pulls' ? 'pulls' : 'inbox'}/>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Live polling · 8s</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>2 pending in draft review</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Base · <span className="font-mono">main@a3f7b21</span></span>
      </>}
    >
      <ShadcnPRHeader backLabel={backLabel} focusMode="code" focusActive={hideComments} onToggleFocus={() => setHideComments(h => !h)} density={v.headerDensity}/>
      {v.unifiedToolbar ? (
        <div className="relative">
          <STabsUnderline active="files"
            tabs={[
              { id: 'conv',    label: 'Conversation',  icon: 'message-square', count: 31 },
              { id: 'commits', label: 'Commits',       icon: 'git-commit',     count: 14 },
              { id: 'files',   label: 'Files changed', icon: 'file',           count: 7 },
            ]}
            right={<ShadcnFilesTabTools commitsOpen={v.commitsOpen}/>}
          />
          {v.commitsOpen && <ShadcnCommitsPopover align="right"/>}
        </div>
      ) : (
        <>
          <STabsUnderline active="files" tabs={[
            { id: 'conv',    label: 'Conversation',  icon: 'message-square', count: 31 },
            { id: 'commits', label: 'Commits',       icon: 'git-commit',     count: 14 },
            { id: 'checks',  label: 'Checks',        icon: 'check-circle',   count: 18, failing: 2 },
            { id: 'files',   label: 'Files changed', icon: 'file',           count: 7 },
          ]}/>
          <div className="relative">
            <ShadcnFilesToolbar commitsOpen={v.commitsOpen}/>
            {v.commitsOpen && <ShadcnCommitsPopover/>}
          </div>
        </>
      )}
      <div className="flex flex-1 min-h-0">
        <ShadcnFileRail/>
        <ShadcnDiffPane hideComments={hideComments}/>
      </div>
      <ShadcnReviewDock/>
    </PierWindowShell>
  );
}

// Commits picker popover — opens from the "14 commits" button in the Files
// sub-toolbar. Multi-select with checkbox column, head/base meta, range
// summary, and a primary "Show diff" action. Pure shadcn primitives:
// Card (popover surface), Checkbox, Badge, Button, Separator.
const COMMITS_SC = [
  { sha: '8c7d219', msg: 'add measureHunk-called-once regression test', who: 'nicolae-i', ago: '6h', add: 38, del: 2,  selected: true },
  { sha: 'f02ab1c', msg: 'address review: switch to useMemo for the threshold branch', who: 'nicolae-i', ago: '6h', add: 12, del: 18, selected: true },
  { sha: '21fce04', msg: 'wire VirtualHunk into NaiveHunk above 2k lines', who: 'nicolae-i', ago: '22h', add: 24, del: 6, selected: true },
  { sha: 'b9e4cd8', msg: 'measureHunk: cache line widths per font family', who: 'nicolae-i', ago: '23h', add: 96, del: 8, selected: true },
  { sha: '3a1c7f2', msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation', who: 'nicolae-i', ago: '1d', add: 412, del: 188, selected: true },
  { sha: 'e441cb0', msg: 'spike: measure baseline render of NaiveHunk', who: 'nicolae-i', ago: '1d', add: 22, del: 0, selected: false },
  { sha: '7df2a01', msg: 'rebase onto main (resolves conflicts in editor/metrics.ts)', who: 'nicolae-i', ago: '1d', add: 18, del: 9, selected: false, rebase: true },
  { sha: '0bf9e2c', msg: 'docs: outline approach in DESIGN.md', who: 'nicolae-i', ago: '2d', add: 74, del: 0, selected: false },
];

// Range-selection model. Index 0 = newest (top of the list). The first click
// picks a single commit (checkbox). A second click anchors the OTHER end of a
// range — every commit between the two is auto-included and the checkbox column
// morphs into a continuous "range rail" with draggable-looking endpoint handles.
// A third click moves the nearest endpoint, so the range can be grown/shrunk in
// place. "Clear" drops back to the empty state.
function ShadcnCommitsPopover({ align = 'left' }) {
  const N = COMMITS_SC.length;
  // Seed with a range over the originally-selected commits (indices 0–4).
  const [a, setA] = React.useState(4);   // anchor endpoint
  const [b, setB] = React.useState(0);   // focus endpoint (null = single pick)
  const [hover, setHover] = React.useState(null);

  const hasRange = a !== null && b !== null;
  const single   = a !== null && b === null;
  const lo = a === null ? null : (hasRange ? Math.min(a, b) : a);  // newer end (smaller idx)
  const hi = a === null ? null : (hasRange ? Math.max(a, b) : a);  // older end (larger idx)
  const count = a === null ? 0 : (hi - lo + 1);

  // Hover preview while a single commit is picked — telegraphs the range a
  // second click would create.
  const preview = (single && hover !== null && hover !== a)
    ? { lo: Math.min(a, hover), hi: Math.max(a, hover) } : null;
  const previewCount = preview ? (preview.hi - preview.lo + 1) : 0;

  const inRange   = (i) => lo !== null && i >= lo && i <= hi;
  const inPreview = (i) => preview && i >= preview.lo && i <= preview.hi;

  function pick(i) {
    if (a === null) { setA(i); setB(null); return; }       // empty → single
    if (single) {                                          // single → range / deselect
      if (i === a) { setA(null); setB(null); }
      else setB(i);
      return;
    }
    const dLo = Math.abs(i - lo), dHi = Math.abs(i - hi);   // range → move nearest end
    if (dLo <= dHi) { setA(i); setB(hi); } else { setA(lo); setB(i); }
  }
  const clearSel  = () => { setA(null); setB(null); setHover(null); };
  const selectAll = () => { setA(N - 1); setB(0); };

  const newSha = lo !== null ? COMMITS_SC[lo].sha : null;   // newest in selection
  const oldSha = hi !== null ? COMMITS_SC[hi].sha : null;   // oldest in selection
  const sums = (l, h) => COMMITS_SC.slice(l, h + 1).reduce((t, c) => ({ add: t.add + c.add, del: t.del + c.del }), { add: 0, del: 0 });
  const tot  = lo !== null ? sums(lo, hi) : { add: 0, del: 0 };

  return (
    <div
      role="dialog"
      className={`absolute ${align === 'right' ? 'right-5' : 'left-5'} top-[calc(100%+4px)] z-40 w-[480px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-950`}
      style={SHADCN_FLOAT_SHADOW}
    >
      {/* Header — title + live mode pill */}
      <div className="flex items-center gap-2 border-b border-zinc-100 px-3.5 py-2.5">
        <LI name="git-commit" className="size-3.5 text-zinc-500"/>
        <span className="text-[13px] font-semibold tracking-tight">
          {hasRange ? 'Comparing a range' : 'Comparing commits'}
        </span>
        {hasRange
          ? <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white">
              <LI name="arrow-up-down" className="size-2.5"/>range
            </span>
          : single
            ? <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500">single</span>
            : null}
        <span className="ml-auto text-[11.5px] text-zinc-500 tabular-nums">{count} of {N} selected</span>
        {a === null
          ? <button onClick={selectAll} className="text-[12px] font-medium text-zinc-900 hover:underline">Select all</button>
          : <button onClick={clearSel} className="text-[12px] font-medium text-zinc-900 hover:underline">Clear</button>}
      </div>

      {/* Selection summary — base..head reflecting the live range */}
      <div className="grid grid-cols-[60px_1fr] gap-y-1.5 border-b border-zinc-100 px-3.5 py-2.5 text-[12px]">
        <span className="text-[10.5px] uppercase tracking-wider text-zinc-500 self-center">Base</span>
        <span className="inline-flex items-center gap-1.5">
          <LI name="git-branch" className="size-3 text-zinc-500"/>
          <span className="font-mono text-[11.5px]">main</span>
          <span className="text-zinc-400">@</span>
          <span className="font-mono text-[11.5px] text-zinc-500">{oldSha ? `${oldSha}~1` : 'a3f7b21'}</span>
        </span>
        <span className="text-[10.5px] uppercase tracking-wider text-zinc-500 self-center">Head</span>
        <span className="inline-flex items-center gap-1.5">
          <LI name="git-branch" className="size-3 text-zinc-500"/>
          <span className="font-mono text-[11.5px]">perf/virtualise-hunks</span>
          <span className="text-zinc-400">@</span>
          <span className="font-mono text-[11.5px] text-zinc-500">{newSha || '8c7d219'}</span>
        </span>
      </div>

      {/* Quick filter */}
      <div className="border-b border-zinc-100 px-3.5 py-2">
        <SInput icon="search" placeholder="Filter commits" className="h-7"/>
      </div>

      {/* Commit list */}
      <div className="max-h-[260px] overflow-auto">
        {COMMITS_SC.map((c, i) => {
          const within  = inRange(i);
          const isLo = i === lo, isHi = i === hi, isEdge = within && (isLo || isHi);
          const prev = inPreview(i);
          const bg = within ? 'bg-zinc-100/70' : prev ? 'bg-zinc-50' : 'bg-white';
          return (
            <button
              key={c.sha}
              onClick={() => pick(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(h => (h === i ? null : h))}
              className={`group/cm relative flex w-full items-start gap-2.5 py-2 pr-3.5 text-left ${bg} ${i ? 'border-t border-zinc-100' : ''} hover:bg-zinc-100`}
            >
              {/* Left cell: checkbox (single/empty) OR range rail (range mode) */}
              <div className="relative w-9 shrink-0 self-stretch">
                {hasRange ? (
                  <>
                    {/* connecting line — solid through the range, faint outside */}
                    <span className={`absolute left-[18px] top-0 h-1/2 w-0.5 -translate-x-1/2 ${within && i > lo ? 'bg-zinc-900' : 'bg-zinc-200'}`}/>
                    <span className={`absolute left-[18px] bottom-0 h-1/2 w-0.5 -translate-x-1/2 ${within && i < hi ? 'bg-zinc-900' : 'bg-zinc-200'}`}/>
                    {/* node */}
                    {isEdge ? (
                      <span className="absolute left-[18px] top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-white shadow-sm">
                        <span className="size-1.5 rounded-full bg-white"/>
                      </span>
                    ) : within ? (
                      <span className="absolute left-[18px] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900"/>
                    ) : (
                      <span className="absolute left-[18px] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-300 bg-white group-hover/cm:border-zinc-400"/>
                    )}
                  </>
                ) : (
                  <span className="absolute left-[18px] top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <SCheckbox checked={i === a}/>
                  </span>
                )}
              </div>
              <SAvatar name={c.who} size="size-5"/>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] text-zinc-900">{c.msg}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <span className="font-mono text-zinc-700">{c.sha}</span>
                  <span className="text-zinc-300">·</span>
                  <span>{c.who}</span>
                  <span className="text-zinc-300">·</span>
                  <span>{c.ago}</span>
                  {isEdge && <SBadge variant="outline" className="ml-0.5 text-[9.5px]">{isLo ? 'newest' : 'oldest'}</SBadge>}
                  {c.rebase && <SBadge variant="warn" className="ml-0.5 text-[9.5px]">rebase</SBadge>}
                </div>
              </div>
              <span className="mt-0.5 shrink-0 whitespace-nowrap font-mono text-[10.5px] tabular-nums">
                <span className="text-emerald-600">+{c.add}</span>{' '}
                <span className="text-red-600">−{c.del}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer — contextual hint + range summary + action */}
      <div className="flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2.5">
        <span className="min-w-0 flex-1 truncate text-[11.5px] text-zinc-500">
          {a === null
            ? 'Pick a commit, then pick another to compare a range'
            : preview
              ? <>Select range · <span className="font-medium text-zinc-900">{previewCount} commits</span></>
              : single
                ? <>1 commit · <span className="font-mono text-zinc-900">{newSha}</span> — click another to make a range</>
                : <><span className="font-mono text-zinc-900">{oldSha}..{newSha}</span> · <span className="font-mono text-emerald-600">+{tot.add}</span> <span className="font-mono text-red-600">−{tot.del}</span></>}
        </span>
        <SButton variant="ghost" size="sm">Cancel</SButton>
        <SButton variant="default" size="sm" icon="git-commit" className={a === null ? 'pointer-events-none opacity-50' : ''}>
          {a === null ? 'Show diff' : `Show diff · ${count} commit${count === 1 ? '' : 's'}`}
        </SButton>
      </div>
    </div>
  );
}

// ── Status chip + condensed merge menu ──────────────────────────
// The "Open" PR-state chip gains a caret; clicking it opens a CONDENSED
// merge menu — a fast lane that summarizes lifecycle status and offers the
// primary merge action + overflow, without duplicating the full merge box
// at the foot of the conversation. The chip itself still reads as PR state.
function ShadcnStatusChipMenu({ mergeState = 'blocked', open = false }) {
  const ready = mergeState === 'ready';
  const trigger = (
    <button
      title="Pull request status & actions"
      className={`group/status inline-flex h-[22px] items-center gap-1.5 rounded-full border pl-2 pr-1.5 text-[11px] font-semibold transition-colors ${
        open
          ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
    >
      <LI name="git-pull-request" className="size-3"/>
      <span>Open</span>
      <LI name="chevron-down" className={`size-3 transition-transform ${open ? 'rotate-180' : 'opacity-60 group-hover/status:opacity-100'}`}/>
    </button>
  );

  return (
    <SDropdownMenu open={open} trigger={trigger} align="start" width={304}>
      {/* Status summary */}
      <div className={`mb-1 flex items-start gap-2 rounded-md px-2 py-2 ${ready ? 'bg-emerald-50/70' : 'bg-amber-50/70'}`}>
        <LI name={ready ? 'check-circle' : 'alert-triangle'} className={`mt-0.5 size-4 shrink-0 ${ready ? 'text-emerald-600' : 'text-amber-600'}`}/>
        <div className="min-w-0">
          <div className={`text-[12.5px] font-semibold ${ready ? 'text-emerald-900' : 'text-amber-900'}`}>
            {ready ? 'Ready to merge' : 'Merging is blocked'}
          </div>
          <div className={`text-[11px] leading-snug ${ready ? 'text-emerald-700/80' : 'text-amber-700/80'}`}>
            {ready
              ? 'All 18 checks passed · 2 approvals · no conflicts'
              : '2 of 18 checks failing · changes requested · 3 behind main'}
          </div>
        </div>
      </div>

      {/* Primary action — condensed merge button (not the full box) */}
      <div className="px-1 pb-1">
        <button
          disabled={!ready}
          className={`flex h-8 w-full items-center justify-center gap-2 rounded-md text-[12.5px] font-semibold transition-colors ${ready
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400'}`}
        >
          <LI name="git-compare" className="size-3.5"/>
          {ready ? 'Squash and merge' : 'Merge blocked'}
        </button>
        {!ready && (
          <div className="px-0.5 pt-1 text-[10.5px] leading-snug text-zinc-400">
            Resolve required reviews & checks below to enable merge.
          </div>
        )}
      </div>

      <SDropdownSeparator/>

      {/* Overflow lifecycle actions */}
      {!ready && <SDropdownItem icon="git-branch" label="Update branch"/>}
      <SDropdownItem icon="pencil" label="Convert to draft"/>
      <SDropdownItem icon="x-circle" label="Close pull request" danger/>

      <SDropdownSeparator/>

      {/* Pointer to the full box */}
      <SDropdownItem icon="arrow-down" label="Jump to merge box"/>
    </SDropdownMenu>
  );
}

// Branch pill that copies its value to the clipboard on click, with a
// transient check-mark confirmation.
function CopyBranch({ value, className = '' }) {
  const [copied, setCopied] = React.useState(false);
  const copy = (e) => {
    e.stopPropagation();
    try { navigator.clipboard && navigator.clipboard.writeText(value); } catch (err) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button onClick={copy} title={copied ? 'Copied!' : `Copy "${value}"`}
      className={`group/copy inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px] text-zinc-600 transition-colors hover:bg-zinc-200 ${className}`}>
      <LI name="git-branch" className="size-3 text-zinc-400"/>
      <span>{value}</span>
      <LI name={copied ? 'check' : 'copy'} className={`size-3 ${copied ? 'text-emerald-600' : 'text-zinc-400 opacity-0 group-hover/copy:opacity-100'}`}/>
    </button>
  );
}

// density variants (set via view.headerDensity):
//   'comfortable'  — original 3-line header (default)
//   'tight'        — same content, trimmed padding/margins  (idea A)
//   'compact-meta' — meta sentence collapsed to branch chips (idea B)
//   'single-strip' — meta row folded into row 2 → 2 lines    (idea C)
//   'sticky'       — collapsed-on-scroll one-line bar         (idea D)
function ShadcnPRHeader({ backLabel = 'Inbox', focusMode = 'code', focusActive = false, onToggleFocus = () => {}, mergeState = 'blocked', statusMenuOpen = false, density = 'single-strip' }) {
  const tight = density === 'tight';

  // ── Shared fragments ────────────────────────────────────────────
  const actions = (
    <div className="flex shrink-0 items-center gap-1.5">
      <GhFocusToggle mode={focusMode} active={focusActive} onToggle={onToggleFocus}/>
      <SButton variant="ghost" size="icon" icon="github" title="View on GitHub"/>
    </div>
  );

  const titleLine = (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <a className="inline-flex cursor-pointer items-center gap-0.5 text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-900">
        <LI name="chevron-left" className="size-3.5 -ml-0.5"/>
        <span>{backLabel}</span>
      </a>
      <span className="text-[15px] font-light text-zinc-300">/</span>
      <h1 className="text-[18px] font-semibold leading-tight tracking-tight text-zinc-950">
        perf(diff-render): virtualise hunks larger than 2k lines
      </h1>
      <span className="font-mono text-[14px] font-medium text-zinc-400">#9217</span>
    </div>
  );

  const branchChips = (
    <span className="inline-flex items-center gap-1.5">
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]">main</code>
      <LI name="arrow-left" className="size-3 text-zinc-400"/>
      <CopyBranch value="perf/virtualise-hunks"/>
    </span>
  );

  const reviewers = (
    <div className="group/reviewers flex items-center gap-2">
      <span className="text-zinc-500">Reviewers</span>
      <div className="relative flex items-center">
        <ShadcnReviewerChipV2 name="alex-cho"  state="pending"  age="Requested 18h ago"
          role="Frontend reviewer"
          actions={['Remind', 'Re-request']}
          first/>
        <ShadcnReviewerChipV2 name="priya-r"   state="approved" age="Reviewed 22h ago"
          role="Code owner · diff/*"
          comment="LGTM aside from the comment in VirtualHunk.tsx. Numbers are great — 600ms → 38ms on the 18k-line PR."
          actions={['View review']}/>
        <ShadcnReviewerChipV2 name="marcus-w"  state="changes"  age="Reviewed 2h ago"
          role="Platform reviewer"
          comment="One blocker: this changes the public ResizeObserver contract on HunkWindow. The mobile target depends on the old shape."
          actions={['View thread', 'Dismiss']}/>
        <ShadcnReviewerAddChip/>
      </div>
    </div>
  );

  const checks = (
    <div className="-mx-1 flex cursor-default items-center gap-1.5 rounded-md px-1 transition-colors hover:bg-zinc-100">
      <LI name="x-circle" className="size-3.5 text-red-600"/>
      <span><b className="font-semibold text-red-700">2</b> failing</span>
      <span className="mx-0.5 text-zinc-300">·</span>
      <LI name="check-circle" className="size-3.5 text-emerald-600"/>
      <span>16 passed</span>
    </div>
  );

  // Condensed check counts — icons + numbers only, full labels in tooltip.
  const checksCondensed = (
    <div className="-mx-1 flex cursor-default items-center gap-1.5 rounded-md px-1 transition-colors hover:bg-zinc-100">
      <LI name="x-circle" className="size-3.5 text-red-600"/>
      <span className="font-semibold text-red-700">2</span>
      <LI name="check-circle" className="ml-0.5 size-3.5 text-emerald-600"/>
      <span className="text-zinc-600">16</span>
    </div>
  );

  // PR author — avatar + handle.
  const author = (
    <span className="inline-flex items-center gap-1.5">
      <SAvatar name="nicolae-i" size="size-5"/>
      <b className="font-semibold text-zinc-900">nicolae-i</b>
    </span>
  );

  // Opened / synced timing — tucked behind an info icon + tooltip so the
  // strip stays compact but the detail is one hover away.
  const openedInfo = (
    <STooltip label="Opened 1d 4h ago · synced 12s ago">
      <button className="inline-flex size-5 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700">
        <LI name="info" className="size-3.5"/>
      </button>
    </STooltip>
  );

  // Hover card breaking down the 18 checks — failing first, then passing.
  // Doubles as the de-facto checks surface now the Checks tab is gone.
  const failingChecks = [
    { name: 'e2e / playwright (chromium)', meta: 'Failed · 4m 12s' },
    { name: 'bundle-size / diff-budget',   meta: 'Failed · +18 KB over budget' },
  ];
  const passingChecks = [
    { name: 'build / typecheck', meta: '1m 02s' },
    { name: 'unit / vitest',     meta: '48s' },
    { name: 'lint / eslint',     meta: '22s' },
    { name: 'format / prettier', meta: '9s' },
  ];
  const checksHoverContent = (
    <div className="text-[12px]">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-zinc-900">18 checks</span>
        <span className="inline-flex items-center gap-1 font-medium text-red-700"><LI name="x-circle" className="size-3.5"/> 2 failing</span>
      </div>
      <div className="space-y-1">
        {failingChecks.map(c => (
          <div key={c.name} className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50/60 px-2 py-1.5">
            <LI name="x-circle" className="mt-0.5 size-3.5 shrink-0 text-red-600"/>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-zinc-900">{c.name}</div>
              <div className="text-[11px] text-red-700/80">{c.meta}</div>
            </div>
            <button className="shrink-0 text-[11px] font-medium text-zinc-500 hover:text-zinc-900">Details</button>
          </div>
        ))}
      </div>
      <div className="my-2 h-px bg-zinc-100"/>
      <div className="space-y-0.5">
        {passingChecks.map(c => (
          <div key={c.name} className="flex items-center gap-2 px-1 py-0.5 text-zinc-600">
            <LI name="check-circle" className="size-3.5 shrink-0 text-emerald-600"/>
            <span className="truncate">{c.name}</span>
            <span className="ml-auto shrink-0 text-[11px] tabular-nums text-zinc-400">{c.meta}</span>
          </div>
        ))}
        <div className="px-1 pt-1 text-[11px] text-zinc-400">+12 more passed</div>
      </div>
      <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50">
        <LI name="check-circle" className="size-3.5"/> View all checks
      </button>
    </div>
  );
  const checksHover = (trigger, opts = {}) => (
    <SHoverCard width={320} side={opts.side || 'bottom'} align={opts.align || 'center'} trigger={trigger}>
      {checksHoverContent}
    </SHoverCard>
  );

  const diffStats = (
    <span className="font-mono text-[11.5px]">
      <span className="text-emerald-600">+904</span>{' '}
      <span className="text-red-600">−311</span>{' '}
      <span className="text-zinc-500">· 7 files</span>
    </span>
  );

  const labels = (
    <div className="ml-auto flex items-center gap-1.5">
      <SBadge variant="outline" className="gap-1"><LI name="tag" className="size-3"/> performance</SBadge>
      <SBadge variant="outline" className="gap-1"><LI name="tag" className="size-3"/> needs-design-review</SBadge>
    </div>
  );

  // ── Idea D · sticky collapsed bar — single line ─────────────────
  if (density === 'sticky') {
    return (
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-white/95 px-5 py-2.5 backdrop-blur">
        <a className="inline-flex shrink-0 cursor-pointer items-center gap-0.5 text-[12.5px] font-medium text-zinc-500 transition-colors hover:text-zinc-900">
          <LI name="chevron-left" className="size-3.5 -ml-0.5"/>
          <span>{backLabel}</span>
        </a>
        <span className="shrink-0 text-zinc-300">/</span>
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h1 className="truncate text-[14px] font-semibold tracking-tight text-zinc-950">
            perf(diff-render): virtualise hunks larger than 2k lines
          </h1>
          <span className="shrink-0 font-mono text-[12px] font-medium text-zinc-400">#9217</span>
        </div>
        <CopyBranch value="perf/virtualise-hunks" className="shrink-0"/>
        <SSeparator vertical className="h-4"/>
        <ShadcnStatusChipMenu mergeState={mergeState} open={statusMenuOpen}/>
        {checksHover(
          <div className="flex shrink-0 cursor-default items-center gap-1.5 text-[12px] text-zinc-600">
            <LI name="x-circle" className="size-3.5 text-red-600"/>
            <span><b className="font-semibold text-red-700">2</b></span>
            <LI name="check-circle" className="size-3.5 text-emerald-600"/>
            <span>16</span>
          </div>,
          { align: 'end' }
        )}
        {actions}
      </div>
    );
  }

  // ── Idea C · single status strip — title row + one combined band ─
  if (density === 'single-strip') {
    return (
      <div className="border-b border-zinc-200 px-5 pt-3 pb-2.5">
        <div className="mb-2 flex items-start gap-3">
          <div className="min-w-0 flex-1">{titleLine}</div>
          {actions}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px] text-zinc-600">
          <ShadcnStatusChipMenu mergeState={mergeState} open={statusMenuOpen}/>
          {author}
          {branchChips}
          <SSeparator vertical className="h-4"/>
          {reviewers}
          <SSeparator vertical className="h-4"/>
          {checksHover(checksCondensed)}
          <SSeparator vertical className="h-4"/>
          {diffStats}
          {openedInfo}
          {labels}
        </div>
      </div>
    );
  }

  // ── Ideas A / B / comfortable — 3-line layout ────────────────────
  return (
    <div className={`border-b border-zinc-200 px-5 ${tight ? 'pt-2 pb-2' : 'pt-3 pb-3'}`}>
      {/* Row 1 — Breadcrumb-merged-with-title + primary actions. */}
      <div className={`flex items-start gap-3 ${tight ? 'mb-1.5' : 'mb-2'}`}>
        <div className="min-w-0 flex-1">
          {titleLine}
          <div className={`flex flex-wrap items-center gap-2 text-[12.5px] text-zinc-600 ${tight ? 'mt-1' : 'mt-1.5'}`}>
            <ShadcnStatusChipMenu mergeState={mergeState} open={statusMenuOpen}/>
            {density === 'compact-meta' ? (
              <>
                {branchChips}
                <span className="text-zinc-300">·</span>
                <span><b className="font-semibold text-zinc-900">nicolae-i</b> · 14 commits</span>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-500" title="Opened 1d 4h ago · synced 12s ago">1d 4h ago</span>
              </>
            ) : (
              <>
                <span><b className="font-semibold text-zinc-900">nicolae-i</b> wants to merge <b className="font-semibold text-zinc-900">14 commits</b> into</span>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]">main</code>
                <span>from</span>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]">perf/virtualise-hunks</code>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-500">Opened 1d 4h ago · synced 12s ago</span>
              </>
            )}
          </div>
        </div>
        {actions}
      </div>

      {/* Row 2 — Reviewers · checks · diff stats · labels */}
      <div className={`flex flex-wrap items-center text-[12.5px] ${tight ? 'gap-3' : 'gap-4'}`}>
        {reviewers}
        <SSeparator vertical className="h-4"/>
        {checksHover(checks)}
        <SSeparator vertical className="h-4"/>
        {diffStats}
        {labels}
      </div>
    </div>
  );
}

// Reviewer chip with shadcn HoverCard.
// Default layout: stacked (overlap via negative margin). On group-hover of
// the parent .group/reviewers, the row uncramps to a spaced layout so each
// avatar gets breathing room. The hovered chip lifts (scale + ring) and
// opens a HoverCard popover with name, role, status meta, last-comment
// preview, and contextual actions (Re-request / Remind / View thread).
function ShadcnReviewerChipV2({ name, state, age, role, comment, actions = [], first = false }) {
  const cfg = {
    approved: { dot: 'bg-emerald-500', label: 'Approved this PR',   icon: 'check-circle', toneBox: 'border-emerald-200 bg-emerald-50/60 text-emerald-700', ring: 'group-hover/chip:ring-emerald-500/40' },
    changes:  { dot: 'bg-red-500',     label: 'Requested changes',  icon: 'x-circle',     toneBox: 'border-red-200 bg-red-50/60 text-red-700',             ring: 'group-hover/chip:ring-red-500/40' },
    pending:  { dot: 'bg-amber-500',   label: 'Awaiting review',    icon: 'circle-dot',   toneBox: 'border-amber-200 bg-amber-50/60 text-amber-700',       ring: 'group-hover/chip:ring-amber-500/40' },
  }[state];

  const trigger = (
    <button className={`group/chip relative block rounded-full ring-2 ring-white transition-all duration-200 ease-out group-hover/chip:z-30 group-hover/chip:scale-110 group-hover/chip:ring-4 ${cfg.ring}`}>
      <SAvatar name={name} size="size-6"/>
      <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ${cfg.dot} ring-2 ring-white`}/>
    </button>
  );

  return (
    <SHoverCard
      width={288}
      triggerClassName={`${first ? '' : '-ml-1.5'} transition-[margin] duration-200 ease-out group-hover/reviewers:ml-1`}
      trigger={trigger}
    >
      <div className="flex items-start gap-2.5">
        <SAvatar name={name} size="size-9"/>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-zinc-900">{name}</div>
          <div className="truncate text-[11.5px] text-zinc-500">@{name} · {role}</div>
        </div>
      </div>
      <div className={`mt-3 flex items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] ${cfg.toneBox}`}>
        <LI name={cfg.icon} className="size-3.5 shrink-0"/>
        <span className="font-semibold">{cfg.label}</span>
        <span className="ml-auto text-[11px] opacity-80">{age}</span>
      </div>
      {comment && (
        <div className="mt-2 rounded-md bg-zinc-50 px-2.5 py-2 text-[12px] leading-relaxed text-zinc-600 line-clamp-3">
          <LI2 name="quote" className="mb-1 inline size-3 text-zinc-400"/> {comment}
        </div>
      )}
      {actions.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5">
          {actions.map((label, i) => (
            <SButton key={label} variant={i === actions.length - 1 ? 'default' : 'outline'} size="sm" className="flex-1">{label}</SButton>
          ))}
        </div>
      )}
    </SHoverCard>
  );
}

// Add-reviewer chip — discrete dashed circle at the end of the row.
function ShadcnReviewerAddChip() {
  return (
    <button title="Add a reviewer"
      className="ml-1 inline-flex size-6 items-center justify-center rounded-full border border-dashed border-zinc-300 bg-white text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-700">
      <LI name="plus" className="size-3"/>
    </button>
  );
}

// ═══ Screen — PR detail (Conversation) ═══════════════════════
// Shared conversation-node metadata. Drives both the timeline anchors
// (ids + unread accents in ShadcnConvMain) and the minimap ticks/peek
// cards (ConvMinimap). Order matches the rendered timeline; `desc` is
// the PR description rendered above the loop.
const CONV_NODES = [
  { id: 'desc',          type: 'description', author: 'nicolae-i',     age: '2d ago',    title: 'PR description',                  snippet: 'Virtualises the diff hunk renderer so 10k-line files paint without jank.' },
  { id: 'push1',         type: 'event',       author: 'nicolae-i',     age: '1d ago',    title: 'Pushed 3 commits' },
  { id: 'inline1',       type: 'inline',      author: 'alex-cho',      age: '1d ago',    title: 'Inline thread · VirtualHunk.tsx:32', replies: 3, unread: true, snippet: 'Eviction policy question on the line-window cache.' },
  { id: 'review-priya',  type: 'review', state: 'approved', author: 'priya-r', age: '22h ago', title: 'Review · approved', replies: 2, snippet: 'Nice — keying the width cache per font family is exactly right.' },
  { id: 'label1',        type: 'event',       author: 'priya-r',       age: '22h ago',   title: 'Added label “performance”' },
  { id: 'review-marcus', type: 'review', state: 'changes', author: 'marcus-w', age: '1h ago', title: 'Review · requested changes', replies: 2, unread: true, needsResponse: true, snippet: 'This breaks the mobile app’s pinned @pier/diff shape — let’s ship an adapter.' },
  { id: 'ci1',           type: 'event', state: 'failing', author: 'github-actions', age: '1h ago', title: 'ci/perf-suite · 2 failing', unread: true },
  { id: 'draft',         type: 'pending',     author: 'alex-cho', isYou: true, age: 'just now', title: 'Your pending review (draft)' },
];

function ShadcnPRDetailConversationScreen({ width = 1320, height = 820, from = 'inbox', view = {} }) {
  const backLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  // Conversation tab focus = "Focus: Comments" — collapse timeline events,
  // keep the discussion. (Files tab focus is the inverse: "Focus: Code".)
  const [focusComments, setFocusComments] = React.useState(!!(view.focusComments ?? view.hideComments));
  const minimap = !!view.minimap;
  const scrollRef = React.useRef(null);
  return (
    <PierWindowShell width={width} height={height}
      title="" subtitle=""
      sidebar={<PierSidebar active={from === 'pulls' ? 'pulls' : 'inbox'}/>}
      status={<><span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Live polling · 8s</span></>}
    >
      <ShadcnPRHeader backLabel={backLabel} focusMode="comments" focusActive={focusComments} onToggleFocus={() => setFocusComments(h => !h)} mergeState={view.mergeState} statusMenuOpen={view.statusMenuOpen} density={view.headerDensity}/>
      <STabsUnderline active="conv" tabs={[
        { id: 'conv',    label: 'Conversation',  icon: 'message-square', count: 31 },
        { id: 'commits', label: 'Commits',       icon: 'git-commit',     count: 14 },
        { id: 'files',   label: 'Files changed', icon: 'file',           count: 7 },
      ]}/>
      <div className="flex flex-1 min-h-0">
        <ShadcnConvMain focusComments={focusComments} onShowAll={() => setFocusComments(false)} mergeState={view.mergeState} mergeMenuOpen={view.mergeMenuOpen} markNodes={minimap} scrollRef={scrollRef}/>
        <ShadcnConvRail minimap={minimap} scrollRef={scrollRef}/>
      </div>
    </PierWindowShell>
  );
}

function ShadcnConvMain({ focusComments = false, onShowAll = () => {}, mergeState = 'blocked', mergeMenuOpen = false, markNodes = false, scrollRef = null }) {
  // Reply samples — used in the timeline to demo nested conversations.
  const priyaReplies = [
    { author: 'nicolae-i', age: '21h ago', role: 'author',
      body: <>Good shout — pushed <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">measureHunk.spec.ts</code> with a regression case in <span className="font-mono text-[11.5px] text-zinc-600">f02ab1c</span>. Asserts the cache is hit once per (font, viewport) tuple.</>,
      reactions: { '🎉': { count: 2, me: true, who: 'You, priya-r' }, '👍': { count: 1, me: false, who: 'priya-r' } },
    },
    { author: 'priya-r', age: '20h ago', role: 'collaborator',
      body: <>Beautiful, that's exactly what I had in mind. Approving once CI goes green.</>,
      reactions: { '❤️': { count: 1, me: true, who: 'You' } },
    },
  ];
  const marcusReplies = [
    { author: 'alex-cho', age: '1h ago', role: 'reviewer', isYou: true,
      body: <>I checked — the mobile app pins <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">@pier/diff@0.18</code> so it'll keep working until they bump. But I agree, let's ship an adapter rather than do a breaking change. <br/><br/>Want to pair on this <b>Wed 2pm</b>? I have a hunk-aligned ResizeObserver shim I tried last sprint that might fit.</>,
      reactions: { '👀': { count: 1, me: false, who: 'marcus-w' } },
    },
    { author: 'marcus-w', age: '45m ago', role: 'member',
      body: <>Wed 2pm works. I'll bring the failing mobile snapshot test. 🙏</>,
      reactions: {},
    },
  ];

  // The conversation timeline as tagged items. When "Focus: Comments" is on,
  // runs of consecutive `event` items collapse into a single thin divider so
  // the discussion (comments + inline threads) reads uninterrupted.
  const timeline = [
    { kind: 'event', count: 3, id: 'push1', node: (
      <TimelineItem actor="nicolae-i" verb="pushed 3 commits" age="1d ago"
        body={<>
          <div className="font-mono text-[12px] text-zinc-600 space-y-1">
            <div><span className="text-zinc-400">3a1c7f2</span> perf(diff): introduce VirtualHunk with line-window virtualisation</div>
            <div><span className="text-zinc-400">b9e4cd8</span> measureHunk: cache line widths per font family</div>
            <div><span className="text-zinc-400">21fce04</span> wire VirtualHunk into NaiveHunk above 2k lines</div>
          </div>
        </>}/>
    ) },
    { kind: 'comment', id: 'inline1', node: <GhConvInlineRef file="src/diff/VirtualHunk.tsx" line={32}/> },
    { kind: 'comment', id: 'review-priya', node: <GhComment {...GH_SAMPLES.priyaReview} replies={priyaReplies}/> },
    { kind: 'event', count: 1, id: 'label1', node: (
      <TimelineEvent body={<><b className="font-semibold">priya-r</b> added the <SBadge variant="warn">performance</SBadge> label</>}/>
    ) },
    { kind: 'comment', id: 'review-marcus', node: (
      <GhComment {...GH_SAMPLES.marcusReview}
        replies={marcusReplies}
        showReplyComposer
        replyComposerText="Pushed an adapter in `09cd1f2` — falls back to the old shape via a deprecation warning. Let me know if "/>
    ) },
    { kind: 'event', count: 1, id: 'ci1', node: (
      <TimelineEvent body={<><b className="font-semibold">github-actions</b> bot triggered <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">ci/perf-suite</code> · <span className="text-red-600">2 failing</span></>}/>
    ) },
    { kind: 'comment', id: 'draft', node: (
      <GhComment author="alex-cho" age="just now" isYou role="reviewer"
        pending highlight="pending"
        editing
        editText={`Picking this up now — I'll group the inline notes by hunk before submitting the review.\n\nA few questions for @nicolae-i before I sign off:\n\n1. **VirtualHunk eviction policy** — what happens when we scroll back to a hunk after it's been GC'd?\n2. \`measureHunk\` cache invalidation — is keying by font *family* enough, or do we need weight too?\n3. /attach the perf trace from the M2 Air run\n\n\`\`\`tsx\n// example: I'd like to see this guard added\nif (lines.length > THRESHOLD && !window.measureSync) {\n  warn('VirtualHunk: no measureSync polyfill — falling back');\n}\n\`\`\`\n`}
        reactions={{}} preview="Picking this up now — grouping inline notes by hunk before submitting…"/>
    ) },
  ];

  // Collapse consecutive event runs when focused on comments.
  const unreadMap = {}; CONV_NODES.forEach(n => { unreadMap[n.id] = !!n.unread; });
  const rendered = [];
  let i = 0;
  while (i < timeline.length) {
    const it = timeline[i];
    if (focusComments && it.kind === 'event') {
      let n = 0;
      while (i < timeline.length && timeline[i].kind === 'event') { n += timeline[i].count || 1; i++; }
      rendered.push(<GhEventsCollapsed key={`c${i}`} count={n} onShow={onShowAll}/>);
    } else {
      const unread = markNodes && unreadMap[it.id];
      rendered.push(
        <div key={`i${i}`} id={it.id ? `cn-${it.id}` : undefined} data-conv-node={it.id || undefined}
          className={`conv-node scroll-mt-4 ${unread ? 'relative rounded-lg ring-1 ring-sky-200 bg-sky-50/30 -mx-2 px-2 py-1' : ''}`}>
          {unread && (
            <>
              <span className="absolute -left-px top-2 bottom-2 w-[3px] rounded-full bg-sky-500"/>
              <span className="absolute right-2 top-2 z-[1] inline-flex items-center gap-1 rounded-full bg-sky-600 px-1.5 py-[1px] text-[9.5px] font-semibold uppercase tracking-wide text-white shadow-sm">new</span>
            </>
          )}
          {it.node}
        </div>
      );
      i++;
    }
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto bg-zinc-50/40 relative">
      {/* Flush-left content column — comments sit at the gutter, with replies
          indented by their own border-l-2 thread guide. */}
      <div className="px-6 py-5">
        <div className="mx-auto w-full max-w-[920px]">
          {/* Focus-mode strip — names what's being focused, mirrors the header pill */}
          {focusComments && (
            <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2 text-[12.5px] text-amber-900">
              <LI name="message-square" className="size-4 text-amber-700"/>
              <span><b className="font-semibold">Focusing on comments</b> — pushes, labels & CI events are collapsed.</span>
              <button onClick={onShowAll} className="ml-auto inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white/70 px-2 py-1 text-[11.5px] font-medium text-amber-900 hover:bg-white">
                Show all activity
              </button>
            </div>
          )}

          {/* PR description */}
          <div id="cn-desc" data-conv-node="desc" className="conv-node scroll-mt-4 mb-5">
            <GhComment {...GH_SAMPLES.opening}/>
          </div>

          <div className="space-y-4 text-[13px]">
            {rendered}
          </div>

          {/* Top-level composer — always present */}
          <div className="mt-5">
            <GhComposer
              placeholder="Leave a comment, request a change, or @mention someone…"
              submit="Comment"
              pinHint="Drag-and-drop, paste, or click to attach images & files"
            />
          </div>

          {/* PR lifecycle — merge box at the foot of the conversation */}
          <ShadcnMergeBox state={mergeState} methodMenuOpen={mergeMenuOpen}/>
        </div>
      </div>
    </div>
  );
}

// Thin divider standing in for a run of collapsed timeline events when the
// Conversation tab is in "Focus: Comments" mode. Click to show all activity.
function GhEventsCollapsed({ count, onShow }) {
  return (
    <button onClick={onShow}
      className="group flex w-full items-center gap-3 py-0.5 text-[11.5px] text-zinc-400 transition-colors hover:text-zinc-600">
      <span className="h-px flex-1 bg-zinc-200 group-hover:bg-zinc-300"/>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5">
        <LI name="chevron-down" className="size-3.5"/>
        {count} timeline {count === 1 ? 'event' : 'events'} hidden
      </span>
      <span className="h-px flex-1 bg-zinc-200 group-hover:bg-zinc-300"/>
    </button>
  );
}

// ═══ PR merge box ════════════════════════════════════════════════
// The lifecycle home: review/check/conflict status + the merge action
// (split button with method dropdown) + close. Two states:
//   'blocked' — required reviews/checks unmet → merge guarded
//   'ready'   — everything green → green merge button enabled
function ShadcnMergeStatusRow({ ok, warn, children }) {
  const icon = ok ? 'check-circle' : warn ? 'alert-triangle' : 'x-circle';
  const tone = ok ? 'text-emerald-600' : warn ? 'text-amber-600' : 'text-red-600';
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 text-[12.5px] text-zinc-700">
      <LI name={icon} className={`size-4 shrink-0 ${tone}`}/>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

function ShadcnMergeBox({ state = 'blocked', methodMenuOpen = false, method = 'squash' }) {
  const ready = state === 'ready';
  const methods = [
    { id: 'merge',  label: 'Create a merge commit', icon: 'git-merge',  hint: 'All commits from this branch added to the base.' },
    { id: 'squash', label: 'Squash and merge',      icon: 'git-compare', hint: 'The 14 commits combined into one.' },
    { id: 'rebase', label: 'Rebase and merge',      icon: 'git-branch', hint: 'The 14 commits rebased onto the base.' },
  ];
  const current = methods.find(m => m.id === method) || methods[1];

  return (
    <SCard className="mt-5 overflow-visible">
      {/* Status header */}
      <div className={`flex items-center gap-3 border-b px-4 py-3 ${ready ? 'border-emerald-100 bg-emerald-50/50' : 'border-amber-100 bg-amber-50/50'}`}>
        <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full ${ready ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <LI name={ready ? 'git-merge' : 'alert-triangle'} className="size-4"/>
        </span>
        <div className="min-w-0">
          <div className={`text-[14px] font-semibold ${ready ? 'text-emerald-900' : 'text-amber-900'}`}>
            {ready ? 'Ready to merge' : 'Merging is blocked'}
          </div>
          <div className={`text-[12px] ${ready ? 'text-emerald-700/80' : 'text-amber-700/80'}`}>
            {ready
              ? 'All checks have passed and this branch has no conflicts with the base.'
              : 'Required reviews and checks must pass before this pull request can be merged.'}
          </div>
        </div>
      </div>

      {/* Status checklist */}
      <div className="divide-y divide-zinc-100">
        {ready ? (
          <>
            <ShadcnMergeStatusRow ok>2 approving reviews · no changes requested</ShadcnMergeStatusRow>
            <ShadcnMergeStatusRow ok>All 18 checks have passed</ShadcnMergeStatusRow>
            <ShadcnMergeStatusRow ok>This branch is up to date with <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">main</code> · no conflicts</ShadcnMergeStatusRow>
          </>
        ) : (
          <>
            <ShadcnMergeStatusRow>Changes requested by <b className="font-semibold">marcus-w</b> — must be resolved</ShadcnMergeStatusRow>
            <ShadcnMergeStatusRow><b className="font-semibold">2 of 18 checks failing</b> — <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">ci/perf-suite</code></ShadcnMergeStatusRow>
            <ShadcnMergeStatusRow ok>Approved by <b className="font-semibold">priya-r</b></ShadcnMergeStatusRow>
            <ShadcnMergeStatusRow warn>Out of date with <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">main</code> by 3 commits</ShadcnMergeStatusRow>
          </>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/50 px-4 py-3">
        {/* Split merge button: primary action + method dropdown */}
        <div className="flex">
          <button
            disabled={!ready}
            className={`inline-flex h-9 items-center gap-2 rounded-l-md px-4 text-[13px] font-semibold shadow-sm transition-colors ${ready
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400'}`}
          >
            <LI name={current.icon} className="size-4"/>
            {current.label}
          </button>
          <SDropdownMenu open={methodMenuOpen} align="start" width={300} trigger={
            <button
              disabled={!ready}
              className={`inline-flex h-9 items-center justify-center rounded-r-md border-l px-2 shadow-sm transition-colors ${ready
                ? 'border-emerald-700/40 bg-emerald-600 text-white hover:bg-emerald-700'
                : 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400'}`}
            >
              <LI name="chevron-down" className="size-4"/>
            </button>
          }>
            <SDropdownLabel>Merge method</SDropdownLabel>
            {methods.map(m => (
              <button key={m.id}
                className={`flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-zinc-100 ${m.id === method ? 'bg-zinc-50' : ''}`}>
                <LI name={m.id === method ? 'check' : m.icon} className={`mt-0.5 size-3.5 shrink-0 ${m.id === method ? 'text-emerald-600' : 'text-zinc-400'}`}/>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-medium text-zinc-800">{m.label}</span>
                  <span className="block text-[11px] text-zinc-500">{m.hint}</span>
                </span>
              </button>
            ))}
          </SDropdownMenu>
        </div>

        {!ready && (
          <span className="text-[11.5px] text-zinc-500">
            Resolve required reviews & checks to enable merge.
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {!ready && <SButton variant="outline" size="sm" icon="git-branch">Update branch</SButton>}
          <SButton variant="ghost" size="sm" icon="x-circle" className="text-red-600 hover:bg-red-50">Close pull request</SButton>
        </div>
      </div>
    </SCard>
  );
}

// A compact representation of an inline review thread anchored to a diff
// line, surfaced in the Conversation timeline so it's not lost behind tabs.
// Like GitHub, it shows the slice of the diff the thread is anchored to —
// a few lines of context with the commented line(s) highlighted — above the
// comment thread itself, so reviewers don't have to jump to the Files tab.
const CONV_INLINE_HUNK = [
  { l: '30', r: '30', k: 'ctx', code: 'export function VirtualHunk(props: HunkProps) {' },
  { l: '31', r: '31', k: 'ctx', code: '  const { hunk, fontFamily, viewport } = props;' },
  { l: '32', r: null,  k: 'del', code: '  const [window, setWindow] = useState(() => measureHunk(lines));', anchor: true },
  { l: null, r: '32', k: 'add', code: '  const window = useMemo(() => measureHunk(lines, fontFamily, viewport),' },
  { l: null, r: '33', k: 'add', code: '    [lines, fontFamily, viewport]);' },
  { l: '33', r: '34', k: 'ctx', code: '  const totalH = hunk.lines.length * lineHeight;' },
];

// GitHub-style "expand context" row — the unfold affordance shown above and
// below a diff slice so reviewers can reveal the surrounding code in-place.
function GhConvHunkExpander({ dir = 'both' }) {
  return (
    <button className="group flex w-full items-stretch text-left hover:bg-blue-50/70">
      <span className="flex shrink-0 w-[92px] items-center justify-center bg-blue-50/60 text-blue-500 border-r border-zinc-200/60 group-hover:bg-blue-100/70">
        {dir === 'up'   && <LI name="chevron-up" className="size-3.5"/>}
        {dir === 'down' && <LI name="chevron-down" className="size-3.5"/>}
        {dir === 'both' && (
          <span className="flex flex-col -space-y-1.5">
            <LI name="chevron-up" className="size-3"/>
            <LI name="chevron-down" className="size-3"/>
          </span>
        )}
      </span>
      <span className="flex-1 px-3 py-0.5 text-[10.5px] text-blue-500/80 group-hover:text-blue-600 font-sans">
        Expand {dir === 'up' ? 'lines above' : dir === 'down' ? 'lines below' : 'context'}
      </span>
    </button>
  );
}

function GhConvHunkLine({ ln, anchorLine }) {
  const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
  const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
  const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
  const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
  return (
    <div className={`flex ${bg} ${ln.anchor ? 'ring-1 ring-inset ring-amber-300/70' : ''}`}>
      <span className={`shrink-0 w-9 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`}>{ln.l ?? ''}</span>
      <span className={`shrink-0 w-9 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`}>{ln.r ?? ''}</span>
      <span className={`shrink-0 w-5 text-center ${markerColor}`}>{marker}</span>
      <span className="flex-1 pr-3 text-zinc-900 whitespace-pre overflow-x-auto">{ln.code}</span>
    </div>
  );
}

function GhConvInlineRef({ file, line, hunk = CONV_INLINE_HUNK, resolved = false, resolvedBy = 'priya-r' }) {
  const replies = [
    { author: 'nicolae-i', age: '21h ago', role: 'author',
      body: <>Good catch — the setter was dead weight. Switched to <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">useMemo</code> keyed on the font tuple in <span className="font-mono text-[11.5px] text-zinc-600">f02ab1c</span>.</>,
      reactions: { '🎉': { count: 2, me: true, who: 'You, priya-r' } },
    },
    { author: 'priya-r', age: '20h ago', role: 'collaborator',
      body: <>Confirmed the alloc churn is gone in the profiler. Resolving.</>,
      reactions: {},
    },
  ];
  return (
    <SCard>
      {/* Anchor header */}
      <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-3 py-2 text-[12px] text-zinc-500">
        <LI name="message-square" className="size-3.5 text-zinc-400"/>
        <span className="text-zinc-700"><b className="font-semibold text-zinc-800">alex-cho</b> started a thread</span>
        {resolved
          ? <SBadge variant="success" className="ml-auto gap-1 text-[9.5px]"><LI name="check-circle" className="size-2.5"/>Resolved</SBadge>
          : <span className="ml-auto text-[11.5px] text-zinc-400">{replies.length} replies · open</span>}
      </div>
      {/* The thread — diff slice rides inside the parent comment, under the
          author header and just above the comment body */}
      <div className="p-2.5">
        <GhComment
          author="alex-cho" age="2h ago" isYou role="reviewer"
          diffSlice={
            <div className="font-mono text-[11.5px] leading-[18px]">
              <div className="flex items-center gap-2 bg-zinc-50/80 px-3 py-1 text-[10.5px] text-zinc-400">
                <LI name="code" className="size-3"/>
                <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10.5px] text-zinc-600">{file}</code>
                <span className="text-zinc-300">·</span>
                <span className="font-mono text-[10.5px] text-zinc-500">L{line}</span>
                <button title="Copy file path" className="inline-flex size-4 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700">
                  <LI2 name="copy" className="size-2.5"/>
                </button>
                <span className="ml-auto font-mono text-[10.5px] text-zinc-400">@@ -30,4 +30,5 @@ VirtualHunk(props)</span>
              </div>
              <GhConvHunkExpander dir="up"/>
              {hunk.map((ln, i) => <GhConvHunkLine key={i} ln={ln} anchorLine={line}/>)}
              <GhConvHunkExpander dir="down"/>
            </div>
          }
          body={<>Why <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">useState(() =&gt; measureHunk(...))</code> instead of <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">useMemo</code>? We never call <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">setWindow</code> in the threshold branch — this allocates a setter we throw away.</>}
          reactions={{ '👍': { count: 3, me: false, who: 'priya-r, marcus-w, +1' } }}
          replies={replies}
        />
      </div>
      {/* Conversation-level footer — resolve / unresolve the whole thread */}
      <div className={`flex items-center gap-2 border-t px-3 py-2 ${resolved
        ? 'border-emerald-200/70 bg-emerald-50/50'
        : 'border-zinc-100 bg-zinc-50/50'}`}>
        {resolved ? (
          <>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <LI2 name="check" className="size-3"/>
            </span>
            <span className="text-[12px] text-zinc-600">
              <b className="font-semibold text-zinc-900">{resolvedBy}</b> marked this conversation as resolved.
            </span>
            <SButton variant="outline" size="sm" icon="reply" className="ml-auto">Unresolve conversation</SButton>
          </>
        ) : (
          <>
            <LI2 name="check" className="size-3.5 text-zinc-400"/>
            <span className="text-[12px] text-zinc-500">Looks settled? Mark the thread resolved to collapse it.</span>
            <SButton variant="default" size="sm" icon="check" className="ml-auto">Resolve conversation</SButton>
          </>
        )}
      </div>
    </SCard>
  );
}

function TimelineItem({ actor, verb, age, body }) {
  return (
    <SCard>
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2">
        <SAvatar name={actor} size="size-5"/>
        <span className="text-[12.5px]"><b className="font-semibold">{actor}</b> <span className="text-zinc-500">{verb} · {age}</span></span>
      </div>
      <div className="px-4 py-2.5">{body}</div>
    </SCard>
  );
}

function TimelineReviewCard({ who, state, age, body }) {
  const cfg = state === 'approved' ? { variant: 'success', label: 'Approved', icon: 'check-circle' }
            : state === 'changes'  ? { variant: 'destructive', label: 'Requested changes', icon: 'x-circle' }
            : { variant: 'secondary', label: 'Commented', icon: 'message-square' };
  return (
    <SCard>
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2">
        <SAvatar name={who} size="size-5"/>
        <span className="text-[12.5px]"><b className="font-semibold">{who}</b> <span className="text-zinc-500">reviewed · {age}</span></span>
        <SBadge variant={cfg.variant} className="ml-auto gap-1">
          <LI name={cfg.icon} className="size-3"/>{cfg.label}
        </SBadge>
      </div>
      <div className="px-4 py-2.5 text-[13px] text-zinc-700 leading-relaxed">{body}</div>
    </SCard>
  );
}

function TimelineEvent({ body }) {
  return (
    <div className="flex items-center gap-2 pl-4 text-[12.5px] text-zinc-500">
      <span className="size-1.5 rounded-full bg-zinc-300"/>
      <span>{body}</span>
    </div>
  );
}

function ShadcnConvRail({ minimap = false, scrollRef = null }) {
  return (
    <aside className="w-64 shrink-0 border-l border-zinc-200 bg-white p-4 space-y-4 text-[12.5px]">
      {minimap && <ConvMinimap nodes={CONV_NODES} scrollRef={scrollRef}/>}
      <RailSection title="Assignees">
        <div className="flex items-center gap-2"><SAvatar name="nicolae-i" size="size-5"/><span>nicolae-i</span></div>
      </RailSection>
      <RailSection title="Reviewers">
        <div className="flex items-center gap-2"><SAvatar name="alex-cho" size="size-5"/><span>alex-cho</span><SBadge variant="warn" className="ml-auto text-[10px]">pending</SBadge></div>
        <div className="flex items-center gap-2"><SAvatar name="priya-r" size="size-5"/><span>priya-r</span><SBadge variant="success" className="ml-auto text-[10px]">approved</SBadge></div>
        <div className="flex items-center gap-2"><SAvatar name="marcus-w" size="size-5"/><span>marcus-w</span><SBadge variant="destructive" className="ml-auto text-[10px]">changes</SBadge></div>
      </RailSection>
      <RailSection title="Labels">
        <div className="flex flex-wrap gap-1">
          <SBadge variant="warn">performance</SBadge>
          <SBadge variant="outline">needs-design-review</SBadge>
        </div>
      </RailSection>
      <RailSection title="Milestone">
        <div className="text-zinc-700">v1.4 — diff perf pass</div>
        <div className="mt-1 h-1 rounded-full bg-zinc-200 overflow-hidden">
          <div className="h-full bg-zinc-900" style={{ width: '64%' }}/>
        </div>
        <div className="text-[11px] text-zinc-500 mt-1">9 of 14 done</div>
      </RailSection>
    </aside>
  );
}

function RailSection({ title, children }) {
  return (
    <div>
      <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

// ═══ Screen — Settings ═══════════════════════════════════════
function ShadcnSettingsScreen({ width = 1320, height = 820, section = 'account', initialDiffFontSize = 12, initialDiffLineHeight = 18, orgView = {} }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Settings" subtitle="Preferences are stored on this device"
      sidebar={<PierSidebar active="settings"/>}
      status={section === 'organizations'
        ? <>
            <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Live from GitHub · your token</span>
            <span className="ml-auto font-mono">GET /user/installations</span>
          </>
        : <>
            <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Saved locally · no sync</span>
            <span className="ml-auto">~/Library/Application Support/Pyor/preferences.json</span>
          </>}
    >
      <div className="flex flex-1 min-h-0">
        {/* Settings sub-nav */}
        <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white p-2">
          <div className="px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">Preferences</div>
          <nav className="flex flex-col gap-0.5">
            {[
              { id: 'general',       label: 'General',          icon: 'sliders' },
              { id: 'account',       label: 'Account',          icon: 'user' },
              { id: 'organizations', label: 'Organizations',    icon: 'building-2' },
              { id: 'api',           label: 'GitHub API usage', icon: 'database' },
              { id: 'diff',        label: 'Diff preferences', icon: 'columns' },
              { id: 'appearance',  label: 'Appearance',       icon: 'palette' },
              { id: 'shortcuts',   label: 'Shortcuts',        icon: 'monitor' },
            ].map(it => {
              const active = it.id === section;
              return (
                <button key={it.id} className={`flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-medium ${active ? 'bg-zinc-200/70 text-zinc-950' : 'text-zinc-700 hover:bg-zinc-100'}`}>
                  <LI name={it.icon} className={`size-4 ${active ? '' : 'text-zinc-500'}`}/>
                  {it.label}
                </button>
              );
            })}
          </nav>
        </aside>
        {/* Content */}
        <div className="flex-1 overflow-auto bg-zinc-50/40 p-8">
          {section === 'diff'
            ? <SettingsDiffSection initialFontSize={initialDiffFontSize} initialLineHeight={initialDiffLineHeight}/>
            : section === 'organizations'
            ? <SettingsOrganizationsSection view={orgView}/>
            : <SettingsAccountSection/>}
        </div>
      </div>
    </PierWindowShell>
  );
}

function SettingsAccountSection() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-[13px] text-zinc-500">Your GitHub identity and personal access token.</p>
      </div>
      <SCard>
        <div className="flex items-center gap-3 p-4">
          <SAvatar name="alex-cho" size="size-10"/>
          <div className="flex-1">
            <div className="text-[14px] font-semibold">Alex Cho</div>
            <div className="text-[12.5px] text-zinc-500">@alex-cho · alex@northwind.com</div>
          </div>
          <SButton variant="outline" size="sm" icon="external-link">View on GitHub</SButton>
        </div>
      </SCard>
      <SCard>
        <SCardHeader>
          <SCardTitle>Personal access token</SCardTitle>
          <SCardDescription>Stored in your macOS Keychain. Pyor never sees it as plaintext after this screen.</SCardDescription>
        </SCardHeader>
        <SCardContent className="space-y-3">
          <SInput icon="key-round" value="ghp_3xK•••••••••••••BqR" className="h-9" readOnly/>
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <LI name="check-circle" className="size-3.5 text-emerald-600"/>
            <span>Valid · scopes <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">repo</code>, <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">notifications</code></span>
            <span className="ml-auto">Last rotated 2025-11-04</span>
          </div>
          <div className="flex items-center gap-2">
            <SButton variant="outline" size="sm">Rotate token</SButton>
            <SButton variant="ghost" size="sm" icon="log-out">Sign out</SButton>
          </div>
        </SCardContent>
      </SCard>
      <SCard>
        <SCardHeader>
          <SCardTitle>GitHub API usage</SCardTitle>
          <SCardDescription>Live rate-limit bars from <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">/rate_limit</code>.</SCardDescription>
        </SCardHeader>
        <SCardContent className="space-y-3">
          <RateRow label="Core" used={17} limit={5000}/>
          <RateRow label="GraphQL" used={148} limit={5000}/>
          <RateRow label="Search" used={3} limit={30}/>
        </SCardContent>
      </SCard>
    </div>
  );
}

// ─── Settings · Diff preferences ───────────────────────────────
// Sample lines used in the live preview. Mirrors the real diff so the user
// can judge density at a glance — additions, deletions, ctx, and a long line
// so they can see how wrapping behaves at smaller sizes.
const DIFF_PREVIEW_LINES = [
  { l: '142', r: '142', k: 'ctx', code: '  const hunks = useMemo(() => splitHunks(diff), [diff]);' },
  { l: '143', r: null,  k: 'del', code: '  const heights = hunks.map(h => measureHunk(h, lineHeight));' },
  { l: null,  r: '143', k: 'add', code: '  const heights = useMemo(' },
  { l: null,  r: '144', k: 'add', code: '    () => hunks.map(h => measureHunk(h, lineHeight)),' },
  { l: null,  r: '145', k: 'add', code: '    [hunks, lineHeight],' },
  { l: null,  r: '146', k: 'add', code: '  );' },
  { l: '144', r: '147', k: 'ctx', code: '  const window = useWindow(heights, scrollTop, viewport);' },
  { l: '145', r: '148', k: 'ctx', code: '  return <HunkList hunks={hunks} window={window}/>;' },
];

function SettingsDiffSection({ initialFontSize = 12, initialLineHeight = 18 }) {
  const [fontSize, setFontSize] = React.useState(initialFontSize);
  const [lineHeight, setLineHeight] = React.useState(initialLineHeight);
  // Sensible bounds: 10–18px (below 10 is unreadable, above 18 the diff loses
  // its information-dense feel). Line height is independent so users can pack
  // it tight or breathe it out — anywhere from 1.0× to ~1.8× the font size.
  const FS_MIN = 10, FS_MAX = 18;
  const LH_MIN = 12, LH_MAX = 32;
  const presets = [
    { id: 'compact',     label: 'Compact',     fs: 11, lh: 15 },
    { id: 'default',     label: 'Default',     fs: 12, lh: 18 },
    { id: 'comfortable', label: 'Comfortable', fs: 13, lh: 22 },
    { id: 'large',       label: 'Large',       fs: 15, lh: 26 },
  ];
  const matchedPreset = presets.find(p => p.fs === fontSize && p.lh === lineHeight)?.id;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Diff preferences</h1>
        <p className="mt-1 text-[13px] text-zinc-500">Tune how dense the diff feels. Applies to the Files changed tab and the Pre-PR review pane.</p>
      </div>

      <SCard>
        <SCardHeader>
          <SCardTitle>Font size &amp; line height</SCardTitle>
          <SCardDescription>Affects monospace code rendering in the diff pane only. Comment threads and the rest of the UI are unchanged.</SCardDescription>
        </SCardHeader>
        <SCardContent className="space-y-5">
          {/* Font size */}
          <div>
            <div className="mb-1.5 flex items-baseline">
              <SLabel className="mb-0">Font size</SLabel>
              <span className="ml-auto font-mono text-[11.5px] tabular-nums text-zinc-500">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-zinc-400 select-none">A</span>
              <input
                type="range" min={FS_MIN} max={FS_MAX} step={1}
                value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                className="flex-1 accent-zinc-900"
              />
              <span className="font-mono text-[14px] text-zinc-400 select-none">A</span>
              <div className="flex items-center rounded-md border border-zinc-200 bg-white">
                <button
                  className="flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40"
                  disabled={fontSize <= FS_MIN}
                  onClick={() => setFontSize(v => Math.max(FS_MIN, v - 1))}
                >
                  <LI name="minus" className="size-3.5"/>
                </button>
                <span className="w-9 border-x border-zinc-200 py-1 text-center font-mono text-[11.5px] tabular-nums">{fontSize}</span>
                <button
                  className="flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40"
                  disabled={fontSize >= FS_MAX}
                  onClick={() => setFontSize(v => Math.min(FS_MAX, v + 1))}
                >
                  <LI name="plus" className="size-3.5"/>
                </button>
              </div>
            </div>
          </div>

          {/* Line height */}
          <div>
            <div className="mb-1.5 flex items-baseline">
              <SLabel className="mb-0">Line height</SLabel>
              <span className="ml-auto font-mono text-[11.5px] tabular-nums text-zinc-500">{lineHeight}px · {(lineHeight / fontSize).toFixed(2)}×</span>
            </div>
            <div className="flex items-center gap-3">
              <LI name="rows" className="size-3.5 text-zinc-400"/>
              <input
                type="range" min={LH_MIN} max={LH_MAX} step={1}
                value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))}
                className="flex-1 accent-zinc-900"
              />
              <LI name="rows" className="size-4 text-zinc-400"/>
              <div className="flex items-center rounded-md border border-zinc-200 bg-white">
                <button
                  className="flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40"
                  disabled={lineHeight <= LH_MIN}
                  onClick={() => setLineHeight(v => Math.max(LH_MIN, v - 1))}
                >
                  <LI name="minus" className="size-3.5"/>
                </button>
                <span className="w-9 border-x border-zinc-200 py-1 text-center font-mono text-[11.5px] tabular-nums">{lineHeight}</span>
                <button
                  className="flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40"
                  disabled={lineHeight >= LH_MAX}
                  onClick={() => setLineHeight(v => Math.min(LH_MAX, v + 1))}
                >
                  <LI name="plus" className="size-3.5"/>
                </button>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div>
            <SLabel className="mb-1.5">Presets</SLabel>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(p => {
                const active = matchedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => { setFontSize(p.fs); setLineHeight(p.lh); }}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] ${active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'}`}
                  >
                    <span className="font-medium">{p.label}</span>
                    <span className={`font-mono text-[10.5px] tabular-nums ${active ? 'text-zinc-300' : 'text-zinc-400'}`}>{p.fs}/{p.lh}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </SCardContent>
      </SCard>

      {/* Live preview */}
      <SCard className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/70 px-3 py-1.5">
          <LI name="eye" className="size-3.5 text-zinc-500"/>
          <span className="text-[11.5px] font-medium text-zinc-600">Preview</span>
          <span className="font-mono text-[11px] text-zinc-400">src/diff/VirtualHunk.tsx</span>
          <span className="ml-auto font-mono text-[10.5px] text-zinc-400 tabular-nums">{fontSize}px / {lineHeight}px</span>
        </div>
        <div className="font-mono" style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}>
          {DIFF_PREVIEW_LINES.map((ln, i) => {
            const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
            const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
            const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
            const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
            return (
              <div key={i} className={`flex ${bg}`}>
                <span className={`shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`}>{ln.l ?? ''}</span>
                <span className={`shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`}>{ln.r ?? ''}</span>
                <span className={`shrink-0 w-5 text-center ${markerColor}`}>{marker}</span>
                <span className="flex-1 pr-3 text-zinc-900 whitespace-pre">{ln.code}</span>
              </div>
            );
          })}
        </div>
      </SCard>

      <div className="flex items-center gap-2 text-[12px] text-zinc-500">
        <LI name="info" className="size-3.5"/>
        <span>Changes apply immediately. Reset to defaults restores 12px / 18px.</span>
        <SButton variant="ghost" size="sm" className="ml-auto"
          onClick={() => { setFontSize(12); setLineHeight(18); }}
        >Reset to defaults</SButton>
      </div>
    </div>
  );
}

function RateRow({ label, used, limit }) {
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center text-[12.5px]">
        <span className="font-medium">{label}</span>
        <span className="ml-auto font-mono text-[11.5px] tabular-nums text-zinc-500">{used.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
        <div className="h-full bg-zinc-900" style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
}

// ═══ State screens (empty / offline / loading / auth-error) ═══
function ShadcnStateEmptyScreen({ width = 760, height = 560 }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Inbox" subtitle="0 unread"
      sidebar={<PierSidebar active="inbox" collapsed badges={{ inbox: 0 }}/>}
      sidebarCollapsed
    >
      <EmptyState icon="check" iconClass="text-emerald-600"
        title="You're all caught up."
        body="No new review requests, mentions or replies."/>
    </PierWindowShell>
  );
}

function ShadcnStateOfflineScreen({ width = 760, height = 560 }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Inbox" subtitle="Showing cached results · 12m old"
      sidebar={<PierSidebar active="inbox" collapsed/>}
      sidebarCollapsed
      status={<>
        <span className="inline-flex items-center gap-1.5 text-amber-700"><span className="size-1.5 rounded-full bg-amber-500"/>You're offline · your network is down</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Retrying in <span className="text-zinc-900">14s</span></span>
        <span className="ml-auto text-zinc-400">Read-only</span>
      </>}
    >
      <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] text-amber-900">
        <LI name="wifi-off" className="mt-0.5 size-4 text-amber-600"/>
        <div className="flex-1">
          <b className="font-semibold">You're offline.</b> Showing what Pyor saved at 2:02 PM. You'll need to be back online to post comments or reviews — Pyor doesn't queue them.
        </div>
        <SButton variant="outline" size="sm" icon="refresh" className="border-amber-200">Retry</SButton>
      </div>
      <div className="flex-1 overflow-hidden opacity-60 saturate-50">
        {[
          { title: 'fix(billing): correct prorated charge math…', repo: 'northwind/api', age: '12m' },
          { title: 'RFC: cohort export pipeline', repo: 'northwind/analytics', age: '3h' },
          { title: 'Empty-state polish for event picker', repo: 'northwind/design-system', age: '7h' },
          { title: 'perf(diff-render): virtualise hunks…', repo: 'northwind/web-event-app', age: '1d' },
        ].map((p, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-zinc-100 px-4 py-2.5">
            <LI name="git-pull-request" className="size-4 text-zinc-400"/>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-zinc-900 truncate">{p.title}</div>
              <div className="text-[11.5px] text-zinc-500">{p.repo}</div>
            </div>
            <span className="text-[11px] text-zinc-400">{p.age}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50/50 px-4 py-2 text-[12px] text-zinc-500">
        <LI name="clock" className="size-3.5"/>
        <span><b className="font-semibold text-zinc-900">Read-only.</b> Last synced 2:02 PM · live updates and posting resume when you reconnect.</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-amber-700"><LI name="loader" className="size-3"/> reconnecting</span>
      </div>
    </PierWindowShell>
  );
}

function ShadcnStateLoadingScreen({ width = 760, height = 560 }) {
  return (
    <PierWindowShell width={width} height={height}
      title="#9217" subtitle="perf(diff-render): virtualise hunks larger than 2k lines"
      sidebar={<PierSidebar active="inbox" collapsed/>}
      sidebarCollapsed
      status={<><LI name="loader" className="size-3"/><span>Fetching diff for 200 files…</span></>}
    >
      <div className="border-b border-zinc-200 px-5 py-2 text-[12.5px] text-zinc-500">
        <span className="border-b-2 border-zinc-900 pb-2 text-zinc-950 font-semibold">Files changed</span>
      </div>
      <div className="flex flex-1 min-h-0">
        <aside className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-50/40 p-2 space-y-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2" style={{ paddingLeft: (i % 3) * 14 }}>
              <div className="size-3 rounded bg-zinc-200 animate-pulse"/>
              <div className="h-2 flex-1 rounded bg-zinc-200 animate-pulse" style={{ maxWidth: `${50 + (i * 13) % 40}%` }}/>
            </div>
          ))}
        </aside>
        <div className="flex-1 p-5">
          <SCard className="mb-4">
            <div className="flex items-center gap-2 p-3">
              <LI name="loader" className="size-4 text-zinc-500 animate-spin"/>
              <span className="text-[13px] font-semibold">Loading diff for 200-file PR</span>
              <span className="ml-auto text-[12px] tabular-nums text-zinc-500">118 / 200 files · 4.2 MB / 7.1 MB</span>
            </div>
            <div className="h-1 bg-zinc-100">
              <div className="h-full bg-zinc-900" style={{ width: '59%' }}/>
            </div>
          </SCard>
          <div className="space-y-3">
            {[80, 60, 40].map((w, i) => (
              <div key={i} className="space-y-1">
                <div className="h-2 w-32 rounded bg-zinc-200 animate-pulse"/>
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <div className="h-2 w-8 rounded bg-zinc-200 animate-pulse"/>
                    <div className={`h-2 flex-1 rounded animate-pulse ${j % 3 === 0 ? 'bg-emerald-100' : 'bg-zinc-200'}`} style={{ maxWidth: `${w - j * 5}%` }}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PierWindowShell>
  );
}

function ShadcnStateAuthScreen({ width = 760, height = 560 }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Inbox" subtitle="GitHub credentials invalid"
      sidebar={<PierSidebar active="inbox" collapsed/>}
      sidebarCollapsed
      status={<>
        <span className="inline-flex items-center gap-1.5 text-red-600"><span className="size-1.5 rounded-full bg-red-500"/>Disconnected · 401 Bad credentials</span>
        <span className="ml-auto">Cached data is read-only</span>
      </>}
    >
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50/40 p-8 text-center">
        <div className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <LI name="lock" className="size-6 text-red-500" strokeWidth={1.7}/>
        </div>
        <h2 className="text-lg font-semibold tracking-tight">GitHub rejected your token</h2>
        <p className="mt-1.5 max-w-md text-[12.5px] leading-relaxed text-zinc-500">
          The token in your Keychain returns <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">401 Bad credentials</code>. This usually means it was revoked, expired, or your org enabled SAML SSO and the token isn't authorized for it.
        </p>
        <SCard className="mt-4 w-[460px] text-left text-[12px]">
          <DiagRow label="Last successful call" value="14:02 · 1h 12m ago"/>
          <DiagRow label="Failing endpoint" value="GET /notifications" mono/>
          <DiagRow label="Response" value="HTTP 401 · Bad credentials" mono color="text-red-600"/>
          <DiagRow label="Token prefix" value="ghp_3xK…BqR" mono/>
          <DiagRow last label="Keychain" value="present, last rotated 2025-11-04"/>
        </SCard>
        <div className="mt-4 flex gap-2">
          <SButton variant="ghost" size="sm">Work offline</SButton>
          <SButton variant="default" size="sm" icon="key-round">Update token</SButton>
        </div>
      </div>
    </PierWindowShell>
  );
}

function DiagRow({ label, value, mono, color = 'text-zinc-700', last }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2 ${!last ? 'border-b border-zinc-100' : ''}`}>
      <span className="w-36 text-zinc-500">{label}</span>
      <span className={`flex-1 ${color} ${mono ? 'font-mono text-[11.5px]' : ''}`}>{value}</span>
    </div>
  );
}

// ═══ Screen — Setup (first launch) ═══════════════════════════
function ShadcnSetupScreen({ width = 920, height = 660, state = 'validated' }) {
  return (
    <PierWindowShell width={width} height={height}
      title="Pyor" subtitle="Set up GitHub access"
      toolbar={<SButton variant="ghost" size="sm" icon="arrow-left">Back to sign-in</SButton>}
    >
      <div className="flex flex-1 min-h-0">
        {/* Instructions */}
        <div className="flex-1 border-r border-zinc-200 bg-zinc-50/40 p-8 overflow-auto">
          <h1 className="text-xl font-semibold tracking-tight">Welcome to Pyor</h1>
          <p className="mt-1 text-[13px] text-zinc-500">A native macOS PR reviewer. Pyor reads GitHub via your personal access token — nothing is sent to a server.</p>
          <ol className="mt-5 space-y-3 text-[13px] text-zinc-700">
            {[
              ['1', 'Visit github.com/settings/tokens', 'Open in a browser. Use a classic token, fine-grained tokens don\'t cover /notifications yet.'],
              ['2', 'Scopes', <span>Check <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">repo</code> and <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">notifications</code>. Nothing else.</span>],
              ['3', 'Paste it on the right', 'Pyor validates against /user immediately. Token is stored in your macOS Keychain — never touches disk.'],
            ].map(([n, t, b], i) => (
              <li key={i} className="flex gap-3">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-[11px] font-semibold text-zinc-700">{n}</span>
                <div>
                  <div className="font-semibold text-zinc-900">{t}</div>
                  <div className="text-[12.5px] text-zinc-500">{b}</div>
                </div>
              </li>
            ))}
          </ol>
          <SCard className="mt-6">
            <div className="flex items-start gap-2.5 p-3">
              <LI name="info" className="mt-0.5 size-4 shrink-0 text-blue-600"/>
              <div className="text-[12px] text-zinc-600 leading-relaxed">
                <b className="font-semibold text-zinc-900">SAML SSO?</b> Authorize your token for your org from the same Tokens page — there's an "Configure SSO" button next to each token.
              </div>
            </div>
          </SCard>
        </div>
        {/* Paste + validate */}
        <div className="w-[400px] shrink-0 p-8 flex flex-col gap-4 bg-white">
          <div>
            <label className="text-[12.5px] font-semibold text-zinc-900">Personal access token</label>
            <SInput icon="key-round" value="ghp_3xK•••••••••••••BqR" className="mt-1.5 h-9" readOnly/>
          </div>
          {state === 'validated' ? (
            <SCard className="border-emerald-200 bg-emerald-50/60">
              <div className="flex items-start gap-2.5 p-3">
                <LI name="check-circle" className="mt-0.5 size-4 shrink-0 text-emerald-600"/>
                <div className="flex-1 text-[12.5px] text-emerald-900">
                  <div className="font-semibold">Valid · @alex-cho</div>
                  <div className="text-emerald-700">Scopes: repo, notifications · 4,983 / 5,000 rate budget</div>
                </div>
              </div>
            </SCard>
          ) : (
            <SCard className="border-red-200 bg-red-50/60">
              <div className="flex items-start gap-2.5 p-3">
                <LI name="alert-circle" className="mt-0.5 size-4 shrink-0 text-red-600"/>
                <div className="flex-1 text-[12.5px] text-red-900">
                  <div className="font-semibold">Token rejected · 401</div>
                  <div className="text-red-700">GitHub returned <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-[11px]">Bad credentials</code>. Double-check you pasted the full token and that it isn't revoked.</div>
                </div>
              </div>
            </SCard>
          )}
          <SCard>
            <div className="p-3 text-[12px] text-zinc-600 space-y-1.5">
              <div className="flex items-center gap-2"><SCheckbox checked/> <span>Keep me signed in across restarts</span></div>
              <div className="flex items-center gap-2"><SCheckbox checked/> <span>Poll for new notifications every 60s</span></div>
              <div className="flex items-center gap-2"><SCheckbox/> <span>Send anonymized crash reports</span></div>
            </div>
          </SCard>
          <div className="mt-auto flex items-center gap-2">
            <SButton variant="ghost" size="sm">Skip — read-only demo</SButton>
            <SButton variant="default" size="sm" className="ml-auto" disabled={state !== 'validated'}>Open Pyor →</SButton>
          </div>
        </div>
      </div>
    </PierWindowShell>
  );
}

// ═══ Screen — Pre-PR launcher (simplified shadcn port) ════════
function ShadcnPrePRLauncherScreen({ width = 1100, height = 740, view = {} }) {
  const v = { repoPickerOpen: false, worktreePickerOpen: false, ...view };
  return (
    <PierWindowShell width={width} height={height}
      title="Local reviews" subtitle="Self-review before opening a PR"
      sidebar={<PierSidebar active="local"/>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>git OK · 5 repos · 8 worktrees discovered</span>
        <span className="ml-auto">No GitHub round-trip · everything below is local</span>
      </>}
    >
      <div className="flex-1 overflow-auto bg-zinc-50/40 p-8">
        <div className="mx-auto max-w-2xl space-y-5">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">New local review</div>
            <h1 className="text-xl font-semibold tracking-tight">Review a local branch before opening a PR</h1>
            <p className="mt-1 text-[13px] text-zinc-500 leading-relaxed">
              Pick a repo, a worktree, and a head/base pair. Pyor renders the diff exactly like a real PR.
              Notes stay local until you actually open the PR — then they migrate.
            </p>
          </div>

          <SCard>
            <SCardHeader>
              <SCardTitle>Repo, worktree &amp; refs</SCardTitle>
              <SCardDescription>5 repos registered · 8 worktrees discovered on this machine.</SCardDescription>
            </SCardHeader>
            <SCardContent className="space-y-3">
              <RepoPickerSelect open={v.repoPickerOpen}
                value="northwind/web-event-app"
                hint={<span className="text-[11.5px] text-zinc-500">2 worktrees · default branch <span className="font-mono">main</span> · last fetched 12s ago</span>}/>
              <WorktreePickerSelect open={v.worktreePickerOpen}
                value="web-event-app"
                hint={<span className="font-mono text-[11px] text-zinc-500">~/code/northwind/web-event-app · HEAD perf/virtualise-hunks</span>}/>
              <PickerSelect label="Head" icon="git-pull-request"
                value="perf/virtualise-hunks" mono
                hint={<span className="text-[11.5px]">
                  <span className="font-semibold text-emerald-600 tabular-nums">↑ 14 ahead</span>
                  <span className="text-zinc-300 mx-1.5">·</span>
                  <span className="text-zinc-500">0 behind</span>
                  <span className="text-zinc-300 mx-1.5">·</span>
                  <span className="font-semibold text-amber-700">3 uncommitted</span>
                </span>}/>
              <div className="flex justify-end">
                <SButton variant="ghost" size="sm" icon="arrow-up-down">Swap</SButton>
              </div>
              <PickerSelect label="Base" icon="git-pull-request"
                value="main" mono
                hint={<span className="font-mono text-[11px] text-zinc-500">@ a3f7b21 · fetched 14s ago</span>}/>
            </SCardContent>
          </SCard>

          {/* Dirty-tree warning */}
          <SCard className="border-amber-200 bg-amber-50/50">
            <div className="flex items-start gap-2.5 p-3.5">
              <LI name="alert-triangle" className="mt-0.5 size-4 shrink-0 text-amber-600"/>
              <div className="flex-1 text-[12.5px] text-amber-900 leading-relaxed">
                <b className="font-semibold">3 uncommitted changes</b> in this worktree. Pre-PR review compares
                <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[11px] mx-1">HEAD</code>
                against
                <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-[11px] mx-1">main</code>
                — uncommitted edits won't be in the diff.
                <div className="mt-2 flex gap-2">
                  <SButton variant="outline" size="sm">Show uncommitted in diff</SButton>
                  <SButton variant="ghost" size="sm">Open Files in editor</SButton>
                </div>
              </div>
            </div>
          </SCard>

          {/* Commits preview */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">Commits to review</span>
              <SBadge variant="secondary">14</SBadge>
            </div>
            <SCard className="overflow-hidden">
              {[
                { sha: '8c7d219', msg: 'add measureHunk-called-once regression test', ago: 'just now',  stat: '+38 −2' },
                { sha: 'f02ab1c', msg: 'address review: switch to useMemo for the threshold branch', ago: '14m', stat: '+12 −18' },
                { sha: '21fce04', msg: 'wire VirtualHunk into NaiveHunk above 2k lines', ago: '2h',  stat: '+24 −6' },
                { sha: 'b9e4cd8', msg: 'measureHunk: cache line widths per font family', ago: '4h',   stat: '+96 −8' },
                { sha: '3a1c7f2', msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation', ago: '6h', stat: '+412 −188' },
              ].map((c, i) => (
                <div key={c.sha} className={`flex items-center gap-3 px-3.5 py-2 text-[12.5px] ${i > 0 ? 'border-t border-zinc-100' : ''}`}>
                  <span className="font-mono text-[11px] w-16 text-zinc-400">{c.sha}</span>
                  <span className="flex-1 truncate text-zinc-900">{c.msg}</span>
                  <span className="text-[11px] text-zinc-400">{c.ago}</span>
                  <span className="font-mono text-[11px] w-20 text-right tabular-nums text-zinc-500">{c.stat}</span>
                </div>
              ))}
              <div className="border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-1.5 text-center text-[11.5px] text-zinc-500">
                + 9 earlier commits
              </div>
            </SCard>
          </div>

          {/* Footer summary + CTA */}
          <SCard>
            <div className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <div className="text-[12.5px] text-zinc-500">You're about to review</div>
                <div className="mt-1 flex items-center gap-2 text-[13.5px] font-semibold">
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]">perf/virtualise-hunks</code>
                  <LI name="chevron-right" className="size-3 text-zinc-400"/>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]">main</code>
                  <span className="font-normal text-[12px] text-zinc-500">· 14 commits · 7 files ·</span>
                  <span className="font-mono text-[11.5px]">
                    <span className="text-emerald-600">+904</span>{' '}
                    <span className="text-red-600">−311</span>
                  </span>
                </div>
              </div>
              <SButton variant="ghost" size="sm">Cancel</SButton>
              <SButton variant="default" size="sm" icon="play">Start review · ⌘⏎</SButton>
            </div>
          </SCard>
        </div>
      </div>
    </PierWindowShell>
  );
}

function PickerSelect({ label, icon, value, mono, hint }) {
  return (
    <div>
      <SLabel className="mb-1">{label}</SLabel>
      <SSelectTrigger icon={icon} value={value} hint={hint} mono={mono}/>
    </div>
  );
}

// ── Repo + Worktree pickers ────────────────────────────────────
// A *repo* is the project (the GitHub remote, e.g. northwind/web-event-app).
// A *worktree* is a specific filesystem checkout of that repo. Git allows
// multiple worktrees per repo via `git worktree add`. Pyor surfaces both
// because power users keep a primary checkout for feature work and a
// secondary one for hotfixes/long-running spikes.

const PREPR_REPOS_SC = [
  { id: 'web',    name: 'northwind/web-event-app',
    defaultBranch: 'main', worktrees: 2, branches: 18, unread: 2,
    pinned: true,  active: true,  lastFetch: '12s ago', dirty: true,
    remote: 'git@github.com:northwind/web-event-app.git' },
  { id: 'api',    name: 'northwind/api',
    defaultBranch: 'main', worktrees: 1, branches: 9,  unread: 0,
    pinned: true,                       lastFetch: '4h ago',  dirty: false,
    remote: 'git@github.com:northwind/api.git' },
  { id: 'mobile', name: 'northwind/mobile-ios',
    defaultBranch: 'main', worktrees: 1, branches: 6,  unread: 0,
    pinned: false,                      lastFetch: '1d ago',  dirty: false,
    remote: 'git@github.com:northwind/mobile-ios.git' },
  { id: 'design', name: 'northwind/design-system',
    defaultBranch: 'main', worktrees: 2, branches: 12, unread: 1,
    pinned: false,                      lastFetch: '2d ago',  dirty: false,
    remote: 'git@github.com:northwind/design-system.git' },
  { id: 'analyt', name: 'northwind/analytics',
    defaultBranch: 'develop', worktrees: 1, branches: 5, unread: 0,
    pinned: false,                      lastFetch: '3d ago',  dirty: true,
    remote: 'git@github.com:northwind/analytics.git' },
];

// Keyed by repo id — list of worktrees belonging to that repo.
const PREPR_WORKTREES_SC = {
  web: [
    { id: 'web-main',    label: 'web-event-app',        path: '~/code/northwind/web-event-app',         head: 'perf/virtualise-hunks', dirty: 3, last: '12s ago', primary: true, active: true },
    { id: 'web-hotfix',  label: 'web-event-app-hotfix', path: '~/code/northwind/web-event-app-hotfix',  head: 'hotfix/cve-2025-1107',  dirty: 0, last: '2h ago' },
  ],
  api: [
    { id: 'api-main',    label: 'api',                  path: '~/code/northwind/api',                   head: 'fix/proration',         dirty: 0, last: '4h ago', primary: true },
  ],
  mobile: [
    { id: 'mob-main',    label: 'mobile-ios',           path: '~/code/northwind/mobile-ios',            head: 'feat/persist-scroll',   dirty: 0, last: '1d ago', primary: true },
  ],
  design: [
    { id: 'ds-main',     label: 'design-system',        path: '~/work/design-system',                   head: 'polish/empty-states',   dirty: 0, last: '2d ago', primary: true },
    { id: 'ds-rfc',      label: 'design-system-rfc',    path: '~/work/design-system-rfc',               head: 'rfc/density-tokens',    dirty: 2, last: '5d ago' },
  ],
  analyt: [
    { id: 'an-main',     label: 'analytics',            path: '~/code/northwind/analytics',             head: 'rfc/cohort-export',     dirty: 1, last: '3d ago', primary: true },
  ],
};

function RepoPickerSelect({ open, value, hint }) {
  const active = PREPR_REPOS_SC.find(r => r.name === value) || PREPR_REPOS_SC[0];
  return (
    <div>
      <SLabel className="mb-1">Repo</SLabel>
      <SPopover open={open} trigger={
        <SSelectTrigger icon="github" open={open} value={value} hint={hint} kbd="⌘O"
          badges={active?.unread > 0 && <SBadge variant="warn" className="text-[9.5px]">{active.unread} new</SBadge>}/>
      }>
        <SCommand>
          <SCommandInput defaultValue="event" placeholder="Search repos…" matches={PREPR_REPOS_SC.length}/>
          <SCommandGroup heading="Pinned">
            {PREPR_REPOS_SC.filter(r => r.pinned).map(r => <RepoCommandRow key={r.id} r={r} active={r.id === active?.id}/>)}
          </SCommandGroup>
          <SCommandGroup heading="Recent">
            {PREPR_REPOS_SC.filter(r => !r.pinned).map(r => <RepoCommandRow key={r.id} r={r} active={r.id === active?.id}/>)}
          </SCommandGroup>
          <SCommandFooter>
            <SDropdownItem icon="plus"     kbd="⌘N">Add a repo…</SDropdownItem>
            <SDropdownItem icon="folder">Manage watched paths…</SDropdownItem>
          </SCommandFooter>
        </SCommand>
      </SPopover>
    </div>
  );
}

function RepoCommandRow({ r, active }) {
  return (
    <SCommandItem active={active}>
      <LI name="github" className={`size-3.5 ${active ? 'text-zinc-900' : 'text-zinc-400'}`}/>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`truncate text-[12.5px] font-semibold ${active ? 'text-zinc-950' : 'text-zinc-900'}`}>{r.name}</span>
          {active && <LI name="check" className="size-3 text-zinc-900" strokeWidth={3}/>}
          {r.unread > 0 && <SBadge variant="warn" className="text-[9.5px]">{r.unread} new</SBadge>}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <LI name="folder" className="size-3 text-zinc-400"/>
            <span>{r.worktrees} worktree{r.worktrees > 1 ? 's' : ''}</span>
          </span>
          <span className="text-zinc-300">·</span>
          <span>default <code className="font-mono text-zinc-600">{r.defaultBranch}</code></span>
          <span className="text-zinc-300">·</span>
          <span>{r.branches} branches</span>
          <span className="text-zinc-300">·</span>
          {r.dirty
            ? <span className="font-semibold text-amber-700">has uncommitted</span>
            : <span className="text-emerald-600">clean</span>}
          <span className="text-zinc-300">·</span>
          <span>fetched {r.lastFetch}</span>
        </div>
      </div>
    </SCommandItem>
  );
}

// Worktree picker — scoped to the currently-selected repo.
function WorktreePickerSelect({ open, value, hint }) {
  const list = PREPR_WORKTREES_SC.web || [];
  return (
    <div>
      <SLabel className="mb-1">Worktree</SLabel>
      <SPopover open={open} trigger={
        <SSelectTrigger icon="folder" open={open} value={value} hint={hint} kbd="⌘⇧O"
          badges={<SBadge variant="outline" className="gap-1 text-[9.5px]"><LI name="check-circle" className="size-2.5"/>primary</SBadge>}/>
      }>
        <SCommand>
          {/* Scope reminder — worktrees are repo-scoped */}
          <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-3 py-1.5 text-[11px] text-zinc-500">
            <LI name="github" className="size-3 text-zinc-400"/>
            <span>Worktrees of <span className="font-semibold text-zinc-700">northwind/web-event-app</span></span>
            <span className="ml-auto">{list.length} found</span>
          </div>
          <SCommandGroup>
            {list.map(w => <WorktreeCommandRow key={w.id} w={w} active={w.label === value}/>)}
          </SCommandGroup>
          <SCommandFooter>
            <SDropdownItem icon="plus">
              <span className="flex items-center gap-2">
                <span className="flex-1">New worktree from this repo…</span>
                <span className="text-[10.5px] text-zinc-400 font-mono">git worktree add</span>
              </span>
            </SDropdownItem>
            <SDropdownItem icon="terminal">Discover worktrees in <code className="font-mono text-[11px]">$PWD</code></SDropdownItem>
          </SCommandFooter>
        </SCommand>
      </SPopover>
    </div>
  );
}

function WorktreeCommandRow({ w, active }) {
  return (
    <SCommandItem active={active}>
      <LI name="folder" className={`size-3.5 ${active ? 'text-zinc-900' : 'text-zinc-400'}`}/>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`truncate text-[12.5px] font-semibold ${active ? 'text-zinc-950' : 'text-zinc-900'}`}>{w.label}</span>
          {w.primary && <SBadge variant="outline" className="text-[9.5px]">primary</SBadge>}
          {active && <LI name="check" className="size-3 text-zinc-900" strokeWidth={3}/>}
        </div>
        <code className="truncate font-mono text-[11px] text-zinc-500">{w.path}</code>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <LI name="git-pull-request" className="size-3 text-zinc-400"/>
            <span className="font-mono text-zinc-600">{w.head}</span>
          </span>
          <span className="text-zinc-300">·</span>
          {w.dirty > 0
            ? <span className="font-semibold text-amber-700">{w.dirty} uncommitted</span>
            : <span className="text-emerald-600">clean</span>}
          <span className="text-zinc-300">·</span>
          <span>last active {w.last}</span>
        </div>
      </div>
      <STooltip label="Reveal in Finder">
        <span className="invisible inline-flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 group-hover:visible">
          <LI name="external-link" className="size-3.5"/>
        </span>
      </STooltip>
    </SCommandItem>
  );
}

// ═══ Screen — Pre-PR Review surface (local diff review) ═════════
// Looks like the PR-detail Files screen but adapted for local context:
// - No PR number, no reviewers, no CI checks
// - "Local · pre-PR" badge in the header
// - Tabs: Commits · Working tree · Files changed (no Conversation/Checks)
// - File rail has an "Uncommitted" pseudo-bucket above the branch files
// - Right-side actions: Open in iTerm · Refresh diff · Create PR…
// - Status bar speaks git, not GitHub
function ShadcnPrePRReviewScreen({ width = 1320, height = 900, view = {} }) {
  const v = { pushed: true, createOpen: false, ...view };
  return (
    <PierWindowShell width={width} height={height}
      title="Local review" subtitle="perf/virtualise-hunks → main · local"
      sidebar={<PierSidebar active="local"/>}
      toolbar={<>
        <SButton variant="ghost" size="sm" icon="terminal">Open in iTerm</SButton>
        <SButton variant="ghost" size="sm" icon="refresh">Refresh diff</SButton>
        {v.pushed
          ? <SButton variant="default" size="sm" icon="git-pull-request">Create PR…</SButton>
          : <SButton variant="default" size="sm" icon="git-pull-request">Push &amp; create PR…</SButton>}
      </>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Watching FS · debounce 200ms</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Base · <span className="font-mono">main@a3f7b21</span></span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Head · <span className="font-mono">perf/virtualise-hunks@8c7d219</span></span>
        <SSeparator vertical className="mx-2 h-3"/>
        {v.pushed
          ? <span>Origin: <span className="text-emerald-600 font-medium">up-to-date</span></span>
          : <span className="text-amber-600 font-medium">Origin: branch missing · will push on create</span>}
        <span className="ml-auto">Local-only · no GitHub round-trips</span>
      </>}
    >
      <PrePRHeaderSC pushed={v.pushed}/>
      <STabsUnderline active="files" tabs={[
        { id: 'commits', label: 'Commits',       icon: 'git-commit',     count: 14 },
        { id: 'changes', label: 'Working tree',  icon: 'alert-triangle', count: 3 },
        { id: 'files',   label: 'Files changed', icon: 'file',           count: 7 },
      ]}/>
      <ShadcnFilesToolbar/>
      <div className="flex flex-1 min-h-0">
        <ShadcnPrePRFileRail/>
        <ShadcnDiffPane/>
      </div>
      {v.createOpen && <CreatePRDialog pushed={v.pushed}/>}
    </PierWindowShell>
  );
}

function PrePRHeaderSC({ pushed }) {
  return (
    <div className="border-b border-zinc-200 px-5 pt-3 pb-3">
      <div className="mb-2.5 flex items-center gap-2">
        <SBadge variant="default" className="gap-1.5">
          <LI name="monitor" className="size-3"/> Local · pre-PR
        </SBadge>
        <span className="text-[13px] text-zinc-700">
          comparing
          <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]">perf/virtualise-hunks</code>
          against
          <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]">main</code>
          <span className="text-zinc-500 ml-1">· {pushed ? 'no PR yet' : 'branch not pushed'}</span>
        </span>
        <span className="ml-auto text-xs text-zinc-500">
          Worktree <span className="font-mono text-zinc-700">~/code/web-event-app</span>
        </span>
      </div>
      <div className="flex items-center gap-4 text-[12.5px]">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Author</span>
          <SAvatar name="alex-cho" size="size-4"/>
          <span className="font-medium">alex-cho · you</span>
        </div>
        <SSeparator vertical className="h-4"/>
        <div className="flex items-center gap-1.5 font-mono text-[11.5px]">
          <LI name="git-commit" className="size-3.5 text-zinc-500"/>
          <span><b className="font-semibold text-zinc-900 tabular-nums">14</b> ahead</span>
          <span className="text-zinc-300">·</span>
          <span className="text-zinc-500">0 behind</span>
        </div>
        <SSeparator vertical className="h-4"/>
        <span className="font-mono text-[11.5px]">
          <span className="text-emerald-600">+904</span>{' '}
          <span className="text-red-600">−311</span>{' '}
          <span className="text-zinc-500">· 7 files</span>
        </span>
        <SSeparator vertical className="h-4"/>
        <div className="inline-flex items-center gap-1.5 text-amber-700">
          <LI name="alert-triangle" className="size-3.5"/>
          <span className="font-semibold">3 uncommitted</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[11.5px] text-zinc-500">
          <SKbd>J</SKbd><span>/</span><SKbd>K</SKbd> next file
        </div>
      </div>
    </div>
  );
}

function ShadcnPrePRFileRail() {
  const uncommitted = [
    { name: 'src/diff/VirtualHunk.tsx', stat: 'M', statClass: 'text-amber-600', add: 18, del: 4 },
    { name: 'src/diff/measureHunk.ts',  stat: 'M', statClass: 'text-amber-600', add: 6,  del: 0 },
    { name: 'src/notes/scroll.md',      stat: 'A', statClass: 'text-emerald-600', add: 14, del: 0 },
  ];
  const branchFiles = [
    { name: 'src/diff/VirtualHunk.tsx',    stat: 'A', statClass: 'text-emerald-600', add: 412, del: 0,   indent: 0, selected: true },
    { name: 'src/diff/measureHunk.ts',     stat: 'M', statClass: 'text-amber-600',   add: 96,  del: 8,   indent: 0 },
    { name: 'src/diff/NaiveHunk.tsx',      stat: 'M', statClass: 'text-amber-600',   add: 24,  del: 188, indent: 0 },
    { name: 'src/diff/HunkWindow.ts',      stat: 'A', statClass: 'text-emerald-600', add: 218, del: 0,   indent: 0 },
    { name: 'src/diff/index.ts',           stat: 'M', statClass: 'text-amber-600',   add: 4,   del: 1,   indent: 0 },
    { name: 'src/diff/diff.test.tsx',      stat: 'M', statClass: 'text-amber-600',   add: 142, del: 22,  indent: 0 },
    { name: 'docs/diff-rendering.md',      stat: 'M', statClass: 'text-amber-600',   add: 8,   del: 92,  indent: 0 },
  ];
  return (
    <aside className="w-72 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col">
      {/* Search */}
      <div className="border-b border-zinc-200 p-2">
        <SInput icon="search" placeholder="Filter files" className="h-7"/>
      </div>
      {/* Uncommitted bucket */}
      <div className="flex items-center gap-1.5 border-b border-amber-200 bg-amber-50 px-3 py-1.5">
        <LI name="alert-triangle" className="size-3 text-amber-600"/>
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-amber-900">Uncommitted</span>
        <SBadge variant="warn" className="text-[9.5px]">3</SBadge>
        <span className="ml-auto text-[10px] text-amber-700/70">local edits</span>
      </div>
      <div className="border-b border-zinc-200">
        {uncommitted.map((f, i) => <FileRailRowSC key={i} f={f}/>)}
      </div>
      {/* Branch bucket */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100/60 px-3 py-1.5">
        <LI name="git-pull-request" className="size-3 text-zinc-500"/>
        <span className="text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500">In branch · 14 commits</span>
        <SBadge variant="secondary" className="text-[9.5px]">7</SBadge>
      </div>
      <div className="flex-1 overflow-auto py-1">
        {branchFiles.map((f, i) => <FileRailRowSC key={i} f={f}/>)}
      </div>
      {/* Rail footer · viewed progress */}
      <div className="border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500">
        <div className="flex items-center justify-between mb-1">
          <span>Viewed</span>
          <span className="font-mono tabular-nums">3 / 7</span>
        </div>
        <div className="h-1 rounded-full bg-zinc-200 overflow-hidden">
          <div className="h-full bg-zinc-900" style={{ width: '43%' }}/>
        </div>
      </div>
    </aside>
  );
}

function FileRailRowSC({ f }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 text-[12px] ${f.selected ? 'bg-zinc-200/60' : 'hover:bg-zinc-100'}`}>
      <span className={`w-3 text-center font-mono text-[9.5px] font-bold ${f.statClass}`}>{f.stat}</span>
      <LI name="file" className="size-3 shrink-0 text-zinc-400"/>
      <span className="flex-1 truncate font-mono text-[11px] text-zinc-900">{f.name}</span>
      <span className="font-mono text-[10px] tabular-nums">
        <span className="text-emerald-600">+{f.add}</span>{' '}
        <span className="text-red-600">−{f.del}</span>
      </span>
    </div>
  );
}

// Create-PR modal — surfaced when "Create PR…" is clicked.
function ShadcnPrePRCreateScreen({ width = 1320, height = 900 }) {
  return (
    <div className="relative">
      <ShadcnPrePRReviewScreen width={width} height={height} view={{ pushed: true, createOpen: false }}/>
      <CreatePRDialog pushed/>
    </div>
  );
}

function CreatePRDialog({ pushed }) {
  return (
    <SDialog open width={640}>
      <SDialogHeader
        icon="git-pull-request"
        title="Open pull request"
        description={<><code className="font-mono">perf/virtualise-hunks</code> → <code className="font-mono">main</code><span className="ml-1">· northwind/web-event-app</span></>}
        onClose={() => {}}
      />
      <SDialogBody className="space-y-3">
        <div>
          <SLabel className="mb-1 normal-case tracking-normal text-[12px] text-zinc-900">Title</SLabel>
          <SInput value="perf(diff-render): virtualise hunks larger than 2k lines" className="h-9" readOnly={false}/>
        </div>
        <div>
          <SLabel className="mb-1 normal-case tracking-normal text-[12px] text-zinc-900">Description</SLabel>
          <div className="rounded-md border border-zinc-200 bg-white p-3 text-[12.5px] text-zinc-700 leading-relaxed">
            The 18k-line PR #9081 spent 600ms parking a single hunk into the DOM…
            <div className="mt-1 text-[11px] text-zinc-400">Generated from the first commit message · click to edit.</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <SLabel className="mb-1">Reviewers</SLabel>
            <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5">
              <SAvatar name="priya-r" size="size-5"/>
              <SAvatar name="marcus-w" size="size-5"/>
              <SButton variant="ghost" size="sm" icon="plus" className="ml-auto">Add</SButton>
            </div>
          </div>
          <div>
            <SLabel className="mb-1">Labels</SLabel>
            <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5">
              <SBadge variant="warn">performance</SBadge>
              <SButton variant="ghost" size="sm" icon="plus" className="ml-auto">Add</SButton>
            </div>
          </div>
        </div>
        <SCard className="bg-zinc-50/50">
          <div className="p-3 text-[12px] text-zinc-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <SCheckbox checked/>
              <span>Open as <b className="font-semibold">draft</b> · run CI but don't request reviewers yet</span>
            </div>
            <div className="flex items-center gap-2">
              <SCheckbox checked/>
              <span>Migrate <b className="font-semibold">4 local notes</b> as review comments</span>
            </div>
            <div className="flex items-center gap-2">
              <SCheckbox/>
              <span>Delete branch after merge</span>
            </div>
          </div>
        </SCard>
        {!pushed && (
          <SCard className="border-amber-200 bg-amber-50/60">
            <div className="flex items-start gap-2 p-2.5">
              <LI name="alert-triangle" className="mt-0.5 size-3.5 shrink-0 text-amber-600"/>
              <div className="text-[11.5px] text-amber-900 leading-relaxed">
                Branch isn't on origin yet — Pyor will run <code className="font-mono bg-white/60 rounded px-1">git push -u origin perf/virtualise-hunks</code> first.
              </div>
            </div>
          </SCard>
        )}
      </SDialogBody>
      <SDialogFooter>
        <span className="text-[11.5px] text-zinc-500">
          Will create on <b className="font-mono text-zinc-700">github.com/northwind/web-event-app</b>
        </span>
        <SButton variant="ghost" size="sm" className="ml-auto">Cancel</SButton>
        <SButton variant="outline" size="sm">Open as draft</SButton>
        <SButton variant="default" size="sm" icon="git-pull-request">Create PR</SButton>
      </SDialogFooter>
    </SDialog>
  );
}

// ─── Files-changed pieces (re-used inside PR-detail) ──────────
// (these are ported from screen-shadcn.jsx's ShadcnFilesScreen
//  body components — duplicated here so the file is self-contained
//  if/when screen-shadcn.jsx gets retired.)
// Reuses existing ShadcnFileRail, ShadcnDiffPane, ShadcnFilesToolbar,
// ShadcnReviewDock from screen-shadcn.jsx — they're attached to window
// in that file's Object.assign. We re-export them from here untouched.

Object.assign(window, {
  // Primitives
  SInput, SCard, SCardHeader, SCardTitle, SCardDescription, SCardContent,
  SCheckbox, STabsList, STabsTrigger, STabsUnderline, SChip,
  PierWindowShell, PierSidebar,
  // PR-detail body pieces — re-exported so loading-state screens can compose them.
  ShadcnPRHeader, ShadcnFilesToolbarV2, ShadcnFileRailCollapsed, ShadcnFilesTabTools, STabsUnderline,
  // Screens
  ShadcnInboxScreenV3, ShadcnInboxEmptyScreen,
  ShadcnPullRequestsScreen, ShadcnLocalReviewsScreen,
  ShadcnPRDetailFilesScreen, ShadcnPRDetailFilesScreenV2,
  ShadcnPRDetailConversationScreen, ShadcnCommitsPopover, ShadcnReviewSubmitModal,
  ShadcnSettingsScreen,
  ShadcnStateEmptyScreen, ShadcnStateOfflineScreen, ShadcnStateLoadingScreen, ShadcnStateAuthScreen,
  ShadcnSetupScreen,
  ShadcnPrePRLauncherScreen, ShadcnPrePRLauncherEmptyScreen, ShadcnPrePRAddRepoScreen,
  ShadcnPrePRReviewScreen, ShadcnPrePRCreateScreen,
});
