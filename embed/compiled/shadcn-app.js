function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Pyor — full shadcn redesign.
// All screens in one place; depends on primitives + icons from screen-shadcn.jsx
// (LI, SButton, SBadge, SAvatar, SKbd, SSeparator, ShadcnWindow). Where shadcn
// has a stock component shape we use it (Sidebar pattern, Tabs, Card, Input,
// Checkbox, Tooltip). No bespoke chrome beyond the macOS traffic lights.

// ── Extended primitives ──────────────────────────────────────

// shadcn Input — bordered, h-8 by default. Optional left icon + right kbd hint.
function SInput({
  icon,
  placeholder,
  kbd,
  value,
  className = '',
  readOnly = true,
  size = 'sm'
}) {
  const h = size === 'sm' ? 'h-7' : 'h-9';
  return /*#__PURE__*/React.createElement("div", {
    className: `${h} flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12.5px] text-zinc-500 focus-within:ring-1 focus-within:ring-zinc-900 ${className}`
  }, icon && /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("input", {
    className: "flex-1 bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 min-w-0",
    placeholder: placeholder,
    defaultValue: value,
    readOnly: readOnly
  }), kbd && /*#__PURE__*/React.createElement(SKbd, null, kbd));
}

// shadcn Card — rounded-lg border + bg + shadow-sm by default.
function SCard({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `rounded-lg border border-zinc-200 bg-white shadow-sm ${className}`
  }, children);
}
function SCardHeader({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex flex-col space-y-1.5 p-4 ${className}`
  }, children);
}
function SCardTitle({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("h3", {
    className: `text-base font-semibold leading-none tracking-tight ${className}`
  }, children);
}
function SCardDescription({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("p", {
    className: `text-[12.5px] text-zinc-500 ${className}`
  }, children);
}
function SCardContent({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `p-4 pt-0 ${className}`
  }, children);
}

// shadcn Checkbox — 14x14 square.
function SCheckbox({
  checked,
  indeterminate,
  disabled
}) {
  const state = checked ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked';
  const dim = disabled ? 'opacity-40' : '';
  if (state === 'checked') {
    return /*#__PURE__*/React.createElement("span", {
      className: `inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-zinc-900 bg-zinc-900 ${dim}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: "check",
      className: "size-2.5 text-white",
      strokeWidth: 3
    }));
  }
  if (state === 'indeterminate') {
    return /*#__PURE__*/React.createElement("span", {
      className: `inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-zinc-900 bg-zinc-900 ${dim}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "block h-0.5 w-2 rounded-full bg-white"
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex size-3.5 shrink-0 rounded-[3px] border border-zinc-300 bg-white ${dim}`
  });
}

// shadcn Tabs — TabsList is a rounded muted container; TabsTrigger is the pill.
function STabsList({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500 ${className}`
  }, children);
}
function STabsTrigger({
  active,
  children,
  icon,
  count,
  className = ''
}) {
  const base = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-[13px] font-medium transition-all';
  const on = 'bg-white text-zinc-950 shadow-sm';
  const off = 'text-zinc-500 hover:text-zinc-900';
  return /*#__PURE__*/React.createElement("button", {
    className: `${base} ${active ? on : off} ${className}`
  }, icon && /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-3.5"
  }), children, count != null && /*#__PURE__*/React.createElement("span", {
    className: `ml-0.5 rounded px-1.5 py-0 text-[10.5px] font-semibold tabular-nums ${active ? 'bg-zinc-100 text-zinc-700' : ''}`
  }, count));
}

// Underline tab (used for PR detail tab strip — matches shadcn underline variant).
function STabsUnderline({
  tabs,
  active,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border-b border-zinc-200 px-5"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] transition-colors ${t.id === active ? 'text-zinc-950 font-semibold' : 'text-zinc-500 hover:text-zinc-900 font-medium'}`
  }, t.id === active && /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-x-0 bottom-0 h-0.5 bg-zinc-900"
  }), t.icon && /*#__PURE__*/React.createElement(LI, {
    name: t.icon,
    className: `size-3.5 ${t.id === active ? '' : 'text-zinc-400'}`
  }), t.label, t.count != null && /*#__PURE__*/React.createElement(SBadge, {
    variant: t.id === active ? 'secondary' : 'outline',
    className: "ml-0.5 px-1.5 text-[10px]"
  }, t.count), t.failing && /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive",
    className: "px-1.5 text-[10px]"
  }, t.failing, " failing"))), right && /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2 py-1.5"
  }, right));
}

// Chip used for filter chips (matches shadcn Badge variant="outline").
function SChip({
  label,
  value,
  active,
  onClear
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: `inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors ${active ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`
  }, label, value && /*#__PURE__*/React.createElement("span", {
    className: active ? 'text-zinc-300' : 'text-zinc-400'
  }, ":"), value && /*#__PURE__*/React.createElement("span", {
    className: active ? 'text-white' : 'text-zinc-900'
  }, value), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 opacity-60"
  }));
}

// ── App shell window chrome (extends ShadcnWindow with sidebar slot) ──
// PIER_TRAFFIC_SPACE: when building the real macOS app, set this to true to
// reserve room for the OS traffic-light controls at the title-bar's left.
// Kept false here so the designs read as a clean cross-platform window.
const PIER_TRAFFIC_SPACE = false;
function PierWindowShell({
  width,
  height,
  title,
  subtitle,
  toolbar,
  status,
  sidebar,
  children,
  sidebarCollapsed = true
}) {
  const sidebarW = sidebarCollapsed ? 'w-12' : 'w-60';
  return /*#__PURE__*/React.createElement("div", {
    className: "shadcn-root font-sans antialiased",
    style: {
      width,
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full w-full overflow-hidden rounded-xl bg-white text-zinc-950 ring-1 ring-black/15",
    style: {
      boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 6px 14px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-10 shrink-0 items-center border-b border-zinc-200 bg-zinc-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex min-w-0 flex-1 items-center gap-3 px-4 ${PIER_TRAFFIC_SPACE ? 'pl-[78px]' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex min-w-0 items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[13px] font-semibold tracking-tight"
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    className: "truncate text-xs text-zinc-500"
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, toolbar))), /*#__PURE__*/React.createElement("div", {
    className: "flex min-h-0 flex-1"
  }, sidebar && /*#__PURE__*/React.createElement("div", {
    className: `${sidebarW} shrink-0 transition-[width]`
  }, sidebar), /*#__PURE__*/React.createElement("div", {
    className: "flex min-w-0 flex-1 flex-col bg-white"
  }, children)), status && /*#__PURE__*/React.createElement("div", {
    className: "flex h-6 shrink-0 items-center gap-2 border-t border-zinc-200 bg-zinc-50/80 px-3 text-[11px] text-zinc-500"
  }, status)));
}

// ── App sidebar (shadcn Sidebar pattern) ─────────────────────
function PierSidebar({
  active = 'inbox',
  badges = {}
}) {
  const items = [{
    id: 'inbox',
    label: 'Inbox',
    icon: 'inbox',
    badge: badges.inbox ?? 4
  }, {
    id: 'pulls',
    label: 'Pull requests',
    icon: 'git-pull-request',
    badge: badges.pulls
  }, {
    id: 'local',
    label: 'Local reviews',
    icon: 'monitor',
    badge: badges.local ?? 2
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "flex h-full w-12 flex-col border-r border-zinc-200 bg-zinc-50/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 px-2 pt-2"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "flex flex-col items-center gap-0.5"
  }, items.map(it => /*#__PURE__*/React.createElement(SidebarMenuButton, _extends({
    key: it.id
  }, it, {
    active: it.id === active
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 flex-col items-center gap-2 border-t border-zinc-200 p-2"
  }, /*#__PURE__*/React.createElement(ApiUsageGauges, null), /*#__PURE__*/React.createElement(SidebarUserCard, null), /*#__PURE__*/React.createElement(SidebarMenuButton, {
    id: "settings",
    label: "Settings",
    icon: "settings",
    active: active === 'settings'
  })));
}

// Radial usage gauges (rate-limit) — sit just above the profile photo in the
// collapsed rail. Each is a ring with the API initial inside + a hover tooltip
// carrying the exact count and reset time.
function ApiUsageGauges({
  core = 17,
  coreLimit = 5000,
  gql = 148,
  gqlLimit = 5000,
  resetsIn = '38m'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center gap-1.5 pb-0.5"
  }, /*#__PURE__*/React.createElement(UsageGauge, {
    label: "REST API",
    short: "R",
    used: core,
    limit: coreLimit,
    resetsIn: resetsIn
  }), /*#__PURE__*/React.createElement(UsageGauge, {
    label: "GraphQL API",
    short: "G",
    used: gql,
    limit: gqlLimit,
    resetsIn: resetsIn
  }));
}
function UsageGauge({
  label,
  short,
  used,
  limit,
  resetsIn
}) {
  const pct = Math.max(4, Math.min(100, used / limit * 100));
  const tone = pct > 85 ? 'text-red-500' : pct > 60 ? 'text-amber-500' : 'text-zinc-700';
  const r = 8.5;
  const circ = 2 * Math.PI * r;
  return /*#__PURE__*/React.createElement(STooltip, {
    side: "right",
    label: `${label} · ${used.toLocaleString()} / ${limit.toLocaleString()} · resets in ${resetsIn}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative flex size-7 items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "absolute size-7 -rotate-90"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: r,
    fill: "none",
    strokeWidth: "3",
    className: "stroke-zinc-200"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: r,
    fill: "none",
    strokeWidth: "3",
    strokeLinecap: "round",
    className: `${tone} stroke-current`,
    strokeDasharray: circ,
    strokeDashoffset: circ * (1 - pct / 100)
  })), /*#__PURE__*/React.createElement("span", {
    className: "relative text-[8.5px] font-bold leading-none text-zinc-500"
  }, short)));
}

// Signed-in user avatar — opens the account menu. Tooltip carries the name.
function SidebarUserCard() {
  return /*#__PURE__*/React.createElement(STooltip, {
    side: "right",
    label: "Alex Cho \xB7 @alex-cho"
  }, /*#__PURE__*/React.createElement("button", {
    className: "flex size-8 items-center justify-center rounded-full hover:ring-2 hover:ring-zinc-200"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-7"
  })));
}
function SidebarMenuButton({
  id,
  label,
  icon,
  badge,
  active
}) {
  const stateClass = active ? 'bg-zinc-200/70 text-zinc-950' : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900';
  return /*#__PURE__*/React.createElement(STooltip, {
    side: "right",
    label: label
  }, /*#__PURE__*/React.createElement("button", {
    className: `relative inline-flex size-8 items-center justify-center rounded-md ${stateClass}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-4"
  }), badge != null && badge > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute right-0 top-0 inline-flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold text-white ring-2 ring-zinc-50"
  }, badge)));
}

// ═══ Screen — Inbox (notifications feed) ════════════════════
const NOTIFS_S = [{
  id: 'n1',
  reason: 'review_requested',
  unread: true,
  actor: 'priya-r',
  verb: 'requested your review on',
  title: 'feat(scheduler): coalesce identical session pushes into a single fan-out',
  repo: 'northwind/web-event-app',
  num: 9241,
  age: '3m'
}, {
  id: 'n2',
  reason: 'comment',
  unread: true,
  actor: 'marcus-w',
  verb: 'commented on your PR',
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  repo: 'northwind/web-event-app',
  num: 9217,
  age: '12m',
  snippet: 'One blocker: this changes the public ResizeObserver contract on HunkWindow. The mobile target depends on the old shape — can we add an adapter?',
  codeLoc: 'src/diff/HunkWindow.ts:42'
}, {
  id: 'n3',
  reason: 'mention',
  unread: true,
  actor: 'alex-cho',
  verb: 'mentioned you in',
  title: 'RFC: cohort export pipeline (S3 + Athena)',
  repo: 'northwind/analytics',
  num: 308,
  age: '1h',
  snippet: '@alex-cho any thoughts on partitioning by event_date here? worried about hot-spotting on launch days.'
}, {
  id: 'n4',
  reason: 'review_requested',
  unread: true,
  actor: 'jules-k',
  verb: 'requested your review on',
  title: 'Empty-state polish for event picker on small viewports',
  repo: 'northwind/design-system',
  num: 612,
  age: '2h'
}, {
  id: 'n5',
  reason: 'comment',
  unread: false,
  actor: 'priya-r',
  verb: 'replied to your thread on',
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  repo: 'northwind/web-event-app',
  num: 9217,
  age: '4h',
  snippet: "Good call — I've split the path into two and added the regression. Re-requesting review now.",
  codeLoc: 'src/diff/VirtualHunk.tsx:128'
}, {
  id: 'n6',
  reason: 'state_change',
  unread: false,
  actor: 'github',
  verb: 'merged',
  title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle',
  repo: 'northwind/api',
  num: 4471,
  age: '5h'
}, {
  id: 'n7',
  reason: 'assigned',
  unread: false,
  actor: 'sara-l',
  verb: 'assigned you to',
  title: 'spike: replace Redux with Zustand on the attendee dashboard',
  repo: 'northwind/web-event-app',
  num: 9198,
  age: '8h'
}, {
  id: 'n8',
  reason: 'comment',
  unread: false,
  actor: 'nicolae-i',
  verb: 'commented on',
  title: 'feat(ios): persist scroll offset across PR-list refreshes',
  repo: 'northwind/mobile-ios',
  num: 1183,
  age: '11h',
  snippet: 'Should we also handle the case where the cached offset exceeds the new list length after a refresh removes rows above it?'
}, {
  id: 'n9',
  reason: 'state_change',
  unread: false,
  actor: 'marcus-w',
  verb: 'closed',
  title: 'WIP: lazy-load the print/export pipeline',
  repo: 'northwind/web-event-app',
  num: 9168,
  age: '1d'
}, {
  id: 'n10',
  reason: 'subscribed',
  unread: false,
  actor: 'dependabot',
  verb: 'opened',
  title: 'chore(deps): bump pg from 8.11.3 to 8.13.0',
  repo: 'northwind/api',
  num: 4469,
  age: '1d'
}];
const REASON_S = {
  review_requested: {
    label: 'Review',
    icon: 'eye',
    variant: 'default'
  },
  mention: {
    label: 'Mention',
    icon: 'at-sign',
    variant: 'warn'
  },
  comment: {
    label: 'Comment',
    icon: 'message-square',
    variant: 'secondary'
  },
  state_change: {
    label: 'Update',
    icon: 'git-merge',
    variant: 'outline'
  },
  assigned: {
    label: 'Assigned',
    icon: 'user-plus',
    variant: 'success'
  },
  subscribed: {
    label: 'Subscribed',
    icon: 'circle',
    variant: 'outline'
  }
};
function ShadcnNotifRow({
  n,
  hovered
}) {
  const cfg = REASON_S[n.reason];
  return /*#__PURE__*/React.createElement("div", {
    className: `group relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-4 py-2.5 ${hovered ? 'bg-zinc-50' : n.unread ? 'bg-blue-50/30' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1.5 pt-2 shrink-0"
  }, n.unread && /*#__PURE__*/React.createElement("span", {
    className: "block size-1.5 rounded-full bg-blue-600"
  })), /*#__PURE__*/React.createElement(SAvatar, {
    name: n.actor,
    size: "size-7"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-0.5"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: cfg.variant,
    className: "gap-1 px-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: "size-2.5"
  }), " ", cfg.label), /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[12.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, n.actor), " ", n.verb), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto shrink-0 text-[11.5px] text-zinc-400 tabular-nums"
  }, n.age)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: `truncate text-[13px] text-zinc-900 ${n.unread ? 'font-semibold' : 'font-medium'}`,
    style: {
      maxWidth: 760
    }
  }, n.title), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-400"
  }, "#", n.num), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-[12px] text-zinc-500"
  }, n.repo)), n.snippet && /*#__PURE__*/React.createElement("div", {
    className: "mb-0.5 max-w-[760px] text-[12px] text-zinc-600 leading-snug line-clamp-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\""), n.snippet, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\"")), n.codeLoc && /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1 text-[11.5px] text-zinc-400"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, n.codeLoc))), hovered && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-3 top-2 flex items-center gap-1 rounded-md border border-zinc-200 bg-white p-0.5 shadow-sm"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "check-check"
  }, "Mark read"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "external-link"
  }, "Open on GitHub")));
}

// Inbox empty state — uses the v3 tabs so the surface stays consistent.
function ShadcnInboxEmptyScreen({
  width = 1320,
  height = 820
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Inbox",
    subtitle: "0 unread",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox",
      badges: {
        inbox: 0
      }
    }),
    toolbar: /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "refresh"
    }, "Refresh"),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Connected \xB7 alex-cho"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Last checked ", /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-900"
    }, "14s ago")))
  }, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "all",
    tabs: [{
      id: 'all',
      label: 'All',
      icon: 'inbox',
      count: 0
    }, {
      id: 'comments',
      label: 'Comments',
      icon: 'message-square',
      count: 0
    }, {
      id: 'other',
      label: 'Other',
      icon: 'at-sign',
      count: 0
    }]
  }), /*#__PURE__*/React.createElement(EmptyState, {
    icon: "check",
    iconClass: "text-emerald-600",
    title: "You're all caught up.",
    body: "No new review requests, mentions or replies. New activity will appear here within 60 seconds.",
    action: /*#__PURE__*/React.createElement(SButton, {
      variant: "outline",
      size: "sm",
      icon: "refresh"
    }, "Refresh now")
  }));
}
function EmptyState({
  icon,
  iconClass = 'text-zinc-500',
  title,
  body,
  action,
  secondary
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 flex-col items-center justify-center bg-zinc-50/50 p-12 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4 inline-flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm"
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: `size-7 ${iconClass}`,
    strokeWidth: 1.7
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold tracking-tight text-zinc-950"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 max-w-md text-[13px] leading-relaxed text-zinc-500"
  }, body), action && /*#__PURE__*/React.createElement("div", {
    className: "mt-5 flex items-center gap-2"
  }, action), secondary && /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, secondary));
}

// ═══ Screen — Inbox v3 (tabbed: All / Comments / Other) ═══════
// Comments tab is a rich "comment feed" surface — diff_hunk snippets,
// reactions, attachments, reply indicators (see inbox-comments.jsx).
// All / Other tabs keep the notification-row treatment.
function ShadcnInboxScreenV3({
  width = 1320,
  height = 820,
  view = {}
}) {
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
    ...view
  };
  const isComment = n => n.reason === 'comment';
  const rows = v.tab === 'comments' ? NOTIFS_S.filter(isComment) : v.tab === 'other' ? NOTIFS_S.filter(n => !isComment(n)) : NOTIFS_S;
  const counts = {
    all: NOTIFS_S.length,
    // Comments tab uses the richer feed: surface its count instead
    comments: INBOX_COMMENTS.length,
    other: NOTIFS_S.filter(n => !isComment(n)).length
  };
  const unreadCounts = {
    all: NOTIFS_S.filter(n => n.unread).length,
    comments: INBOX_COMMENTS.filter(c => c.unread).length,
    other: NOTIFS_S.filter(n => n.unread && !isComment(n)).length
  };
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Inbox",
    subtitle: `${unreadCounts[v.tab]} unread · ${counts[v.tab]} in feed`,
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox",
      collapsed: v.sidebarCollapsed
    }),
    sidebarCollapsed: v.sidebarCollapsed,
    toolbar: /*#__PURE__*/React.createElement(React.Fragment, null, v.tab !== 'comments' && /*#__PURE__*/React.createElement(SInput, {
      icon: "search",
      placeholder: "Search notifications",
      kbd: "\u2318F",
      className: "w-56"
    }), /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "refresh"
    }, "Refresh"), /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "check-check"
    }, "Mark all read")),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Connected \xB7 alex-cho"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Last checked ", /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-900"
    }, "14s ago"), " \xB7 60s cadence"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, unreadCounts.all, " unread of ", counts.all), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "Rate 4,983 / 5,000"))
  }, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: v.tab,
    tabs: [{
      id: 'all',
      label: 'All',
      icon: 'inbox',
      count: counts.all
    }, {
      id: 'comments',
      label: 'Comments',
      icon: 'message-square',
      count: counts.comments
    }, {
      id: 'other',
      label: 'Other',
      icon: 'at-sign',
      count: counts.other
    }]
  }), v.tab === 'comments' ?
  /*#__PURE__*/
  // Rich comments feed — has its own toolbar built-in
  React.createElement(InboxCommentsList, {
    view: {
      search: v.commentsSearch,
      dateRange: v.commentsDateRange,
      dateRangeOpen: v.commentsDateRangeOpen,
      typeFilter: v.commentsTypeFilter,
      unreadOnly: v.commentsUnreadOnly,
      loading: v.commentsLoading,
      pagesLoaded: v.commentsPagesLoaded
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2"
  }, /*#__PURE__*/React.createElement(SChip, {
    label: "Unread only",
    active: true
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Repo",
    value: "any"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11.5px] text-zinc-500"
  }, "Click row to open \xB7 ", /*#__PURE__*/React.createElement(SKbd, null, "E"), " mark read \xB7 ", /*#__PURE__*/React.createElement(SKbd, null, "\u21E7E"), " mark all")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, rows.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "check",
    iconClass: "text-emerald-600",
    title: v.tab === 'other' ? 'No review requests or mentions.' : "You're all caught up.",
    body: v.tab === 'other' ? 'Review requests, mentions and state changes will show up here.' : 'New activity will appear here within 60 seconds.'
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, rows.map((n, i) => /*#__PURE__*/React.createElement(ShadcnNotifRow, {
    key: n.id,
    n: n,
    hovered: i === 1 && v.tab === 'all'
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 text-center text-[11.5px] text-zinc-400"
  }, "No older notifications \xB7 GitHub returns up to 50 in /notifications")))));
}

// ═══ PR Files variants — search active + rail collapsed + review modal ═══

// Extend the existing screen via new view props. Defaults preserve old behaviour.
function ShadcnPRDetailFilesScreenV2({
  width = 1320,
  height = 900,
  from = 'inbox',
  view = {}
}) {
  const v = {
    commitsOpen: false,
    searchActive: false,
    searchQuery: '',
    railCollapsed: false,
    reviewModal: null,
    // null | 'comment' | 'approve' | 'changes'
    hideComments: false,
    unifiedToolbar: true,
    // app-wide default: tools folded onto tab bar
    headerDensity: 'single-strip',
    // app-wide default header
    ...view
  };
  const backLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  const [hideComments, setHideComments] = React.useState(!!v.hideComments);
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: from === 'pulls' ? 'pulls' : 'inbox'
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Live polling \xB7 8s"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "2 pending in draft review"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main@a3f7b21")))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: backLabel,
    focusMode: "code",
    focusActive: hideComments,
    onToggleFocus: () => setHideComments(h => !h),
    density: v.headerDensity
  }), v.unifiedToolbar ?
  /*#__PURE__*/
  /* Unified bar — tabs + compact tools share one row; Checks tab dropped
     (counts live in the header). */
  React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, {
      commitsOpen: v.commitsOpen,
      searchActive: v.searchActive,
      searchQuery: v.searchQuery
    })
  }), v.commitsOpen && /*#__PURE__*/React.createElement(ShadcnCommitsPopover, {
    align: "right"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'checks',
      label: 'Checks',
      icon: 'check-circle',
      count: 18,
      failing: 2
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(ShadcnFilesToolbarV2, {
    commitsOpen: v.commitsOpen,
    searchActive: v.searchActive,
    searchQuery: v.searchQuery
  }), v.commitsOpen && /*#__PURE__*/React.createElement(ShadcnCommitsPopover, null))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0 relative"
  }, v.railCollapsed ? /*#__PURE__*/React.createElement(ShadcnFileRailCollapsed, null) : /*#__PURE__*/React.createElement(ShadcnFileRail, null), v.searchActive ? /*#__PURE__*/React.createElement(ShadcnDiffPaneHighlighted, {
    query: v.searchQuery
  }) : /*#__PURE__*/React.createElement(ShadcnDiffPane, {
    hideComments: hideComments,
    fontSize: v.diffFontSize,
    lineHeight: v.diffLineHeight
  }), v.reviewModal && /*#__PURE__*/React.createElement(ShadcnReviewSubmitModal, {
    verdict: v.reviewModal
  })), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// Compact tool cluster that lives INLINE on the tabs bar (right side) for the
// unified-bar variant. Everything from ShadcnFilesToolbarV2 — commits picker,
// viewed progress, diff search, inline/split switch — squeezed into icons +
// counts so the whole sub-toolbar row collapses away.
function ShadcnFilesTabTools({
  commitsOpen,
  searchActive,
  searchQuery = '',
  streaming = null,
  pending = false
}) {
  // File-list still paginating — total count unknown, nothing actionable yet.
  if (pending) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3.5 animate-spin text-zinc-500"
    }), /*#__PURE__*/React.createElement("span", null, "listing files"), /*#__PURE__*/React.createElement("span", {
      className: "tabular-nums text-zinc-400"
    }, "\xB7 page 2 of \u2014")), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 opacity-40"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "eye",
      className: "size-3.5 text-zinc-500"
    }), /*#__PURE__*/React.createElement("div", {
      className: "h-1 w-12 overflow-hidden rounded-full bg-zinc-200"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[11.5px] tabular-nums text-zinc-400"
    }, "\u2014/\u2014")), /*#__PURE__*/React.createElement("button", {
      disabled: true,
      title: "Search ready when diffs arrive",
      className: "inline-flex size-7 cursor-not-allowed items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-300"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "search",
      className: "size-3.5"
    })), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "h-4"
    }), /*#__PURE__*/React.createElement("div", {
      className: "pointer-events-none opacity-50"
    }, /*#__PURE__*/React.createElement(SToggleGroup, {
      mode: "icon",
      value: "inline",
      options: [{
        id: 'inline',
        icon: 'rows',
        label: 'Inline view'
      }, {
        id: 'split',
        icon: 'columns',
        label: 'Split view'
      }]
    })));
  }
  // While file contents stream in, the commits pill is replaced by a
  // "computing diffs · N/M" spinner, viewed-progress is muted (can't
  // mark-viewed yet), and search / view-switch are disabled — the same
  // semantics as the full-width FilesToolbarStreaming, folded onto the row.
  if (streaming) {
    const {
      done = 2,
      total = 7
    } = streaming;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3.5 animate-spin text-zinc-500"
    }), /*#__PURE__*/React.createElement("span", null, "computing diffs"), /*#__PURE__*/React.createElement("span", {
      className: "tabular-nums text-zinc-400"
    }, "\xB7 ", done, "/", total)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 opacity-50",
      title: "Viewed progress available once diffs arrive"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "eye",
      className: "size-3.5 text-zinc-500"
    }), /*#__PURE__*/React.createElement("div", {
      className: "relative h-1 w-12 overflow-hidden rounded-full bg-zinc-200"
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute inset-y-0 left-0 bg-zinc-400",
      style: {
        width: '0%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "text-[11.5px] tabular-nums text-zinc-400"
    }, "0/", total)), /*#__PURE__*/React.createElement("button", {
      disabled: true,
      title: "Search ready when diffs arrive",
      className: "inline-flex size-7 cursor-not-allowed items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-300"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "search",
      className: "size-3.5"
    })), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "h-4"
    }), /*#__PURE__*/React.createElement("div", {
      className: "pointer-events-none opacity-50"
    }, /*#__PURE__*/React.createElement(SToggleGroup, {
      mode: "icon",
      value: "inline",
      options: [{
        id: 'inline',
        icon: 'rows',
        label: 'Inline view'
      }, {
        id: 'split',
        icon: 'columns',
        label: 'Split view'
      }]
    })));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    title: "14 commits \xB7 all changes",
    className: `inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[12px] font-medium ${commitsOpen ? 'border-zinc-900 bg-zinc-100 text-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-commit",
    className: `size-3.5 ${commitsOpen ? 'text-zinc-900' : 'text-zinc-500'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums"
  }, "14"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5",
    title: "3 of 7 files viewed"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative h-1 w-12 overflow-hidden rounded-full bg-zinc-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 bg-zinc-900",
    style: {
      width: '42.8%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-900"
  }, "3"), "/7")), searchActive ? /*#__PURE__*/React.createElement("div", {
    className: "flex h-7 w-56 items-center gap-2 rounded-md border border-zinc-900 bg-white px-2.5 text-xs text-zinc-950 ring-1 ring-zinc-900/10"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-3.5 text-zinc-700"
  }), /*#__PURE__*/React.createElement("span", {
    className: "truncate font-mono text-zinc-900"
  }, searchQuery || 'measureHunk'), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-1 text-[10.5px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-900"
  }, "2"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, " of "), "14"), /*#__PURE__*/React.createElement("button", {
    className: "rounded p-0.5 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x",
    className: "size-3"
  })))) : /*#__PURE__*/React.createElement("button", {
    title: "Search in diff (\u2318F)",
    className: "inline-flex size-7 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-3.5"
  })), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement(SToggleGroup, {
    mode: "icon",
    value: "inline",
    options: [{
      id: 'inline',
      icon: 'rows',
      label: 'Inline view'
    }, {
      id: 'split',
      icon: 'columns',
      label: 'Split view'
    }]
  }));
}

// Sub-toolbar with an explicit "active search" affordance.
function ShadcnFilesToolbarV2({
  commitsOpen,
  searchActive,
  searchQuery = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: `inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-[12px] font-medium ${commitsOpen ? 'border-zinc-900 bg-zinc-100 text-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-commit",
    className: `size-3.5 ${commitsOpen ? 'text-zinc-900' : 'text-zinc-500'}`
  }), /*#__PURE__*/React.createElement("span", null, "14 commits"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "\xB7 all changes"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-400"
  })), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-44"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 h-1 rounded-full bg-zinc-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 bg-zinc-900",
    style: {
      width: '42.8%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-900"
  }, "3"), "/7")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: `flex h-7 items-center gap-2 rounded-md border px-2.5 text-xs transition-colors ${searchActive ? 'w-72 border-zinc-900 bg-white text-zinc-950 ring-1 ring-zinc-900/10' : 'w-44 border-zinc-200 bg-white text-zinc-500'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: `size-3.5 ${searchActive ? 'text-zinc-700' : 'text-zinc-400'}`
  }), searchActive ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-900 truncate"
  }, searchQuery || 'measureHunk'), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-1 text-[10.5px] text-zinc-500 tabular-nums"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-900"
  }, "2"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, " of "), "14"), /*#__PURE__*/React.createElement("button", {
    className: "rounded p-0.5 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-up",
    className: "size-3"
  })), /*#__PURE__*/React.createElement("button", {
    className: "rounded p-0.5 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3"
  })), /*#__PURE__*/React.createElement("button", {
    className: "rounded p-0.5 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x",
    className: "size-3"
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "flex-1"
  }, "Search in diff\u2026"), /*#__PURE__*/React.createElement(SKbd, null, "\u2318F"))), /*#__PURE__*/React.createElement(SToggleGroup, {
    className: "ml-auto",
    value: "inline",
    options: [{
      id: 'inline',
      icon: 'rows',
      label: 'Inline'
    }, {
      id: 'split',
      icon: 'columns',
      label: 'Split'
    }]
  }));
}

// Collapsed file rail — narrow icon rail. Folders fold to single dots,
// current file gets a left accent, comments/unread show as small markers.
function ShadcnFileRailCollapsed() {
  // Flatten files only (folders gone in collapsed mode)
  const files = [{
    name: 'VirtualHunk.tsx',
    viewed: false,
    unread: 3,
    current: true
  }, {
    name: 'HunkWindow.ts',
    viewed: false,
    unread: 0,
    comments: 4
  }, {
    name: 'measureHunk.ts',
    viewed: true,
    unread: 0
  }, {
    name: 'index.ts',
    viewed: true,
    unread: 0
  }, {
    name: 'CodeMirrorHost.tsx',
    viewed: true,
    unread: 0
  }, {
    name: 'bridge.ts',
    viewed: true,
    unread: 0
  }, {
    name: 'VirtualHunk.test.tsx',
    viewed: false,
    unread: 2
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-11 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-9 shrink-0 items-center justify-center border-b border-zinc-200"
  }, /*#__PURE__*/React.createElement("button", {
    title: "Expand file rail",
    className: "inline-flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "panel-left-open",
    className: "size-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto py-1 space-y-0.5"
  }, files.map((f, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    title: f.name,
    className: `relative mx-auto flex size-8 items-center justify-center rounded-md ${f.current ? 'bg-zinc-200/70' : 'hover:bg-zinc-100'} ${f.viewed && !f.current ? 'opacity-50' : ''}`
  }, f.current && /*#__PURE__*/React.createElement("span", {
    className: "absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-zinc-900"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: `size-4 ${f.current ? 'text-zinc-900' : 'text-zinc-500'}`
  }), f.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute right-0.5 top-0.5 inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold text-white ring-2 ring-zinc-50"
  }, f.unread)))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 px-1 py-1.5 text-center text-[10px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mono tabular-nums"
  }, "3/7")));
}

// Diff pane variant where one match is highlighted (active) and others outlined.
// Reuses the same body shape but stamps highlight chrome onto two lines.
function ShadcnDiffPaneHighlighted({
  query = 'measureHunk'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[12px] font-semibold"
  }, "src/diff/VirtualHunk.tsx"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+312"), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u22124")), /*#__PURE__*/React.createElement(SBadge, {
    variant: "default",
    className: "ml-2 gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-3"
  }), " 14 matches in this file")), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[12px]"
  }, [{
    l: '12',
    code: 'import { ',
    hl: 'measureHunk',
    tail: ' } from "./measureHunk";',
    kind: 'plus',
    match: true,
    active: true
  }, {
    l: '13',
    code: 'import { VirtualHunk } from "./VirtualHunk";',
    kind: 'plus'
  }, {
    l: '14',
    code: '',
    kind: 'context'
  }, {
    l: '15',
    code: 'export function NaiveHunk(props: HunkProps) {',
    kind: 'context'
  }, {
    l: '16',
    code: '  const lineCount = props.lines.length;',
    kind: 'context'
  }, {
    l: '17',
    code: '  if (lineCount < 2000) {',
    kind: 'plus'
  }, {
    l: '18',
    code: '    return <NaiveRender {...props} />;',
    kind: 'plus'
  }, {
    l: '19',
    code: '  }',
    kind: 'plus'
  }, {
    l: '20',
    code: '  const { lineHeight } = ',
    hl: 'measureHunk',
    tail: '(props);',
    kind: 'plus',
    match: true
  }, {
    l: '21',
    code: '  return <VirtualHunk lineHeight={lineHeight} {...props} />;',
    kind: 'plus'
  }, {
    l: '22',
    code: '}',
    kind: 'context'
  }].map((r, i) => /*#__PURE__*/React.createElement(DiffSearchRow, {
    key: i,
    r: r
  }))));
}
function DiffSearchRow({
  r
}) {
  const bg = r.kind === 'plus' ? 'bg-emerald-50/70' : r.kind === 'minus' ? 'bg-red-50/70' : '';
  const sign = r.kind === 'plus' ? '+' : r.kind === 'minus' ? '−' : ' ';
  const signColor = r.kind === 'plus' ? 'text-emerald-700' : r.kind === 'minus' ? 'text-red-700' : 'text-zinc-300';
  return /*#__PURE__*/React.createElement("div", {
    className: `flex ${bg}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-12 shrink-0 px-2 text-right text-[10.5px] text-zinc-400 tabular-nums select-none"
  }, r.l), /*#__PURE__*/React.createElement("span", {
    className: `w-4 text-center ${signColor}`
  }, sign), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 whitespace-pre"
  }, r.code, r.match && /*#__PURE__*/React.createElement("span", {
    className: `rounded-sm px-0.5 ${r.active ? 'bg-amber-300 text-zinc-900 ring-1 ring-amber-500' : 'bg-amber-100 text-zinc-900'}`
  }, r.hl), r.tail));
}

// Review submit dialog. Verdict radio + summary textarea + pending stats.
function ShadcnReviewSubmitModal({
  verdict = 'comment'
}) {
  const cfg = {
    comment: {
      label: 'Comment',
      submit: 'Submit comments',
      icon: 'message-square',
      tone: 'default'
    },
    approve: {
      label: 'Approve',
      submit: 'Submit approval',
      icon: 'check-circle',
      tone: 'default'
    },
    changes: {
      label: 'Request changes',
      submit: 'Submit requested changes',
      icon: 'x-circle',
      tone: 'destructive'
    }
  }[verdict];
  return /*#__PURE__*/React.createElement(SDialog, {
    open: true,
    width: 560
  }, /*#__PURE__*/React.createElement(SDialogHeader, {
    icon: "check-circle",
    title: "Submit your review",
    description: "#9217 \xB7 perf(diff-render): virtualise hunks larger than 2k lines",
    onClose: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 px-4 pt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Verdict"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, [{
    id: 'comment',
    label: 'Comment',
    icon: 'message-square',
    desc: 'Submit general feedback without explicit approval.',
    tone: 'zinc'
  }, {
    id: 'approve',
    label: 'Approve',
    icon: 'check-circle',
    desc: 'Submit feedback and approve merging.',
    tone: 'emerald'
  }, {
    id: 'changes',
    label: 'Request changes',
    icon: 'x-circle',
    desc: 'Submit feedback that must be addressed before merging.',
    tone: 'red'
  }].map(opt => {
    const selected = opt.id === verdict;
    const ring = selected ? opt.tone === 'emerald' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30' : opt.tone === 'red' ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/30' : 'border-zinc-900 ring-2 ring-zinc-900/15 bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50';
    const iconColor = selected ? opt.tone === 'emerald' ? 'text-emerald-600' : opt.tone === 'red' ? 'text-red-600' : 'text-zinc-900' : 'text-zinc-500';
    return /*#__PURE__*/React.createElement("button", {
      key: opt.id,
      className: `relative rounded-md border p-3 text-left transition-colors ${ring}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(LI, {
      name: opt.icon,
      className: `size-4 ${iconColor}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[12.5px] font-semibold text-zinc-900"
    }, opt.label), selected && /*#__PURE__*/React.createElement(LI, {
      name: "check",
      className: `ml-auto size-3.5 ${iconColor}`,
      strokeWidth: 3
    })), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 text-[11.5px] text-zinc-500 leading-snug"
    }, opt.desc));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-4 pt-3"
  }, /*#__PURE__*/React.createElement(SCard, {
    className: "bg-zinc-50/60 border-zinc-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 p-2.5 text-[12px] text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "2 pending review comments"), ' ', "\u2014 1 on ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, "VirtualHunk.tsx:42"), ", 1 on ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, "HunkWindow.ts:128")), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Show")))), /*#__PURE__*/React.createElement("div", {
    className: "px-4 pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Review summary"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-zinc-400"
  }, "optional \xB7 markdown supported"), /*#__PURE__*/React.createElement(SToggleGroup, {
    className: "ml-auto",
    value: "write",
    options: [{
      id: 'write',
      label: 'Write'
    }, {
      id: 'preview',
      label: 'Preview'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] leading-relaxed text-zinc-700 min-h-[88px]"
  }, verdict === 'changes' ? /*#__PURE__*/React.createElement(React.Fragment, null, "One blocker on the public ResizeObserver contract \u2014 see thread on ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, "HunkWindow.ts"), ". Otherwise the perf numbers look fantastic.") : verdict === 'approve' ? /*#__PURE__*/React.createElement(React.Fragment, null, "LGTM aside from the small nit on VirtualHunk.tsx. Numbers look great \u2014 happy to ship.") : /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "Add a summary\u2026"))), /*#__PURE__*/React.createElement(SDialogFooter, {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "Posts as ", /*#__PURE__*/React.createElement("b", {
    className: "font-mono text-zinc-700"
  }, "@alex-cho"), " \xB7 saved to draft until you submit"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Discard draft"), /*#__PURE__*/React.createElement(SButton, {
    variant: cfg.tone,
    size: "sm",
    icon: cfg.icon
  }, cfg.submit)));
}

// ═══ Pre-PR launcher — empty (cold start) ═══════════════════════
function ShadcnPrePRLauncherEmptyScreen({
  width = 1100,
  height = 740
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Local reviews",
    subtitle: "No worktrees discovered",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "local",
      badges: {
        local: 0
      }
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-amber-500"
    }), "git OK \xB7 0 worktrees discovered in ~/code"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "No GitHub round-trip \xB7 everything below is local"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-zinc-50/40 p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto max-w-2xl space-y-5"
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "folder",
    iconClass: "text-zinc-500",
    title: "Add a repo to start your first local review.",
    body: "Pyor looks for git worktrees in your watched paths. Point it at the folder you check code out into and Pyor will find the rest.",
    action: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "plus"
    }, "Add repo\u2026"), /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "terminal"
    }, "Discover from $PWD"))
  }), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SCardHeader, null, /*#__PURE__*/React.createElement(SCardTitle, null, "Watched paths"), /*#__PURE__*/React.createElement(SCardDescription, null, "Pyor walks these folders looking for ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5"
  }, ".git"), " directories. Empty by default.")), /*#__PURE__*/React.createElement(SCardContent, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 rounded-md border border-dashed border-zinc-300 bg-white/40 px-3 py-3 text-[12.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-4 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, "No paths added yet"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "plus",
    className: "ml-auto"
  }, "Add path")), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-[11.5px] text-zinc-500 leading-relaxed"
  }, "Common choices: ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5"
  }, "~/code"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5"
  }, "~/work"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px] bg-zinc-100 rounded px-1 py-0.5"
  }, "~/Developer"), "."))), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-4"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "mt-0.5 size-4 shrink-0 text-blue-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[12.5px] text-zinc-600 leading-relaxed"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-950"
  }, "Heads up:"), " local reviews stay local. Pyor never reads the contents of files outside the worktrees you've added, and never makes a GitHub request from this screen."))))));
}

// ═══ Pre-PR · Add-repo dialog ════════════════════════════════════
// Two modes:
//   • pick — one folder, validate it's a git repo, show base branch hint
//   • scan — point at a parent folder, folder-walk discovers every git repo
//            inside, surface them as a multi-select list
function ShadcnPrePRAddRepoScreen({
  width = 1100,
  height = 740,
  view = {}
}) {
  const v = {
    state: 'valid',
    ...view
  }; // 'valid' | 'not-git' | 'no-base' | 'scanning' | 'scan-results'
  return /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(ShadcnPrePRLauncherScreen, {
    width: width,
    height: height
  }), /*#__PURE__*/React.createElement(AddRepoDialog, {
    state: v.state
  }));
}
function AddRepoDialog({
  state
}) {
  const isScan = state === 'scanning' || state === 'scan-results';
  return /*#__PURE__*/React.createElement("div", {
    className: "contents"
  }, /*#__PURE__*/React.createElement(SDialog, {
    open: true,
    width: 620
  }, /*#__PURE__*/React.createElement(SDialogHeader, {
    icon: "folder-plus",
    title: "Add repositories",
    description: "Pyor indexes worktrees so it can spin up a local review in one click.",
    onClose: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-100 bg-zinc-50/40 px-3 pt-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    className: "grid grid-cols-2 gap-1"
  }, /*#__PURE__*/React.createElement(AddRepoModeTab, {
    active: !isScan,
    icon: "folder",
    title: "Pick a folder",
    desc: "Add a single git repo."
  }), /*#__PURE__*/React.createElement(AddRepoModeTab, {
    active: isScan,
    icon: "scan-search",
    title: "Scan a parent folder",
    desc: "Auto-detect every repo inside."
  }))), isScan ? /*#__PURE__*/React.createElement(AddRepoScanBody, {
    state: state
  }) : /*#__PURE__*/React.createElement(AddRepoPickBody, {
    state: state
  })));
}
function AddRepoModeTab({
  active,
  icon,
  title,
  desc
}) {
  return /*#__PURE__*/React.createElement("button", {
    role: "tab",
    className: `flex items-center gap-2.5 rounded-t-md border-b-2 px-3 py-2 text-left transition-colors ${active ? 'border-zinc-900 bg-white text-zinc-900 shadow-[0_1px_0_0_white]' : 'border-transparent text-zinc-500 hover:bg-white/60 hover:text-zinc-700'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: `size-4 shrink-0 ${active ? 'text-zinc-900' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[12.5px] font-semibold leading-tight"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: `text-[10.5px] leading-tight ${active ? 'text-zinc-500' : 'text-zinc-400'}`
  }, desc)));
}

// ── Pick-a-folder body ──────────────────────────────────────────
function AddRepoPickBody({
  state
}) {
  const validation = {
    valid: {
      tone: 'emerald',
      icon: 'check-circle',
      title: 'Valid repository',
      body: /*#__PURE__*/React.createElement(React.Fragment, null, "git repo \xB7 default branch ", /*#__PURE__*/React.createElement("span", {
        className: "font-mono text-[11.5px]"
      }, "main"), " \xB7 18 local branches \xB7 clean working tree")
    },
    'not-git': {
      tone: 'red',
      icon: 'alert-circle',
      title: 'Not a git repository',
      body: /*#__PURE__*/React.createElement(React.Fragment, null, "No ", /*#__PURE__*/React.createElement("code", {
        className: "font-mono text-[11px] bg-white/60 rounded px-1"
      }, ".git"), " directory found in the selected folder. Run ", /*#__PURE__*/React.createElement("code", {
        className: "font-mono text-[11px] bg-white/60 rounded px-1"
      }, "git init"), " or pick a different path.")
    },
    'no-base': {
      tone: 'amber',
      icon: 'alert-triangle',
      title: 'No remote base branch',
      body: /*#__PURE__*/React.createElement(React.Fragment, null, "The repo doesn't track a remote \u2014 Pyor can show you local diffs but can't help open a PR until you ", /*#__PURE__*/React.createElement("code", {
        className: "font-mono text-[11px] bg-white/60 rounded px-1"
      }, "git push -u origin main"), ".")
    }
  }[state];
  const cardBd = validation.tone === 'emerald' ? 'border-emerald-200 bg-emerald-50/50' : validation.tone === 'amber' ? 'border-amber-200 bg-amber-50/50' : 'border-red-200 bg-red-50/50';
  const iconColor = validation.tone === 'emerald' ? 'text-emerald-600' : validation.tone === 'amber' ? 'text-amber-600' : 'text-red-600';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SDialogBody, {
    className: "space-y-3.5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Folder"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "folder",
    value: "~/code/northwind/web-event-app",
    className: "h-9 flex-1"
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm"
  }, "Browse\u2026"))), /*#__PURE__*/React.createElement(SCard, {
    className: cardBd
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: validation.icon,
    className: `mt-0.5 size-4 shrink-0 ${iconColor}`
  }), /*#__PURE__*/React.createElement("div", {
    className: `flex-1 text-[12.5px] leading-relaxed ${validation.tone === 'emerald' ? 'text-emerald-900' : validation.tone === 'amber' ? 'text-amber-900' : 'text-red-900'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold"
  }, validation.title), /*#__PURE__*/React.createElement("div", {
    className: validation.tone === 'emerald' ? 'text-emerald-700' : validation.tone === 'amber' ? 'text-amber-700' : 'text-red-700'
  }, validation.body)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Default base branch"), /*#__PURE__*/React.createElement(SInput, {
    icon: "git-branch",
    value: state === 'no-base' ? '— none —' : 'main',
    className: "h-9",
    readOnly: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-[11.5px] text-zinc-500"
  }, "Used as the comparison base when you start a local review.")), /*#__PURE__*/React.createElement(SCard, {
    className: "bg-zinc-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 text-[12px] text-zinc-600 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), " ", /*#__PURE__*/React.createElement("span", null, "Watch this folder for new branches")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), " ", /*#__PURE__*/React.createElement("span", null, "Include uncommitted edits in diff by default")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, null), " ", /*#__PURE__*/React.createElement("span", null, "Auto-fetch every 5 minutes"))))), /*#__PURE__*/React.createElement(SDialogFooter, null, /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "Stored at ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono"
  }, "~/Library/Application Support/Pyor/worktrees.json")), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "plus",
    disabled: state === 'not-git'
  }, "Add repo")));
}

// ── Scan-parent body ────────────────────────────────────────────
// Folder-walk discovery. User picks a parent dir; Pyor walks the tree
// looking for `.git` markers (skipping node_modules, .git internals,
// build dirs). Discovered repos surface as a multi-select list.
const SCAN_RESULTS = [{
  path: 'northwind/web-event-app',
  branch: 'main',
  branches: 18,
  last: '2m ago',
  status: 'new',
  remote: true,
  selected: true,
  size: '184 MB',
  notes: 'has uncommitted edits'
}, {
  path: 'northwind/api',
  branch: 'main',
  branches: 9,
  last: '4h ago',
  status: 'new',
  remote: true,
  selected: true,
  size: '62 MB'
}, {
  path: 'northwind/mobile-ios',
  branch: 'main',
  branches: 6,
  last: '1d ago',
  status: 'new',
  remote: true,
  selected: true,
  size: '412 MB'
}, {
  path: 'northwind/design-system',
  branch: 'main',
  branches: 12,
  last: '2d ago',
  status: 'already',
  remote: true,
  selected: false,
  size: '38 MB'
}, {
  path: 'northwind/analytics',
  branch: 'develop',
  branches: 5,
  last: '3d ago',
  status: 'new',
  remote: true,
  selected: true,
  size: '94 MB',
  notes: 'no remote-tracking base'
}, {
  path: 'experiments/diff-prototype',
  branch: 'main',
  branches: 2,
  last: '2w ago',
  status: 'new',
  remote: false,
  selected: true,
  size: '4 MB',
  notes: 'no remote — won\u2019t help open PRs'
}, {
  path: 'experiments/scratch-repo',
  branch: 'master',
  branches: 1,
  last: '6mo ago',
  status: 'new',
  remote: false,
  selected: false,
  size: '180 KB'
}];
function AddRepoScanBody({
  state
}) {
  const scanning = state === 'scanning';
  const found = scanning ? 3 : SCAN_RESULTS.length;
  const eligible = SCAN_RESULTS.filter(r => r.status === 'new');
  const selected = SCAN_RESULTS.filter(r => r.selected).length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SDialogBody, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Parent folder"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "folder-search",
    value: "~/code",
    className: "h-9 flex-1"
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm"
  }, "Browse\u2026")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center justify-between text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", null, "Walks up to 4 levels deep \xB7 skips ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px]"
  }, "node_modules"), ", build dirs, hidden folders."), /*#__PURE__*/React.createElement("button", {
    className: "text-zinc-700 hover:underline"
  }, "Settings\u2026"))), scanning ? /*#__PURE__*/React.createElement(ScanProgressCard, {
    found: found
  }) : /*#__PURE__*/React.createElement(ScanResultsCard, {
    found: found,
    selected: selected,
    eligible: eligible.length
  })), /*#__PURE__*/React.createElement(SDialogFooter, null, scanning ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "Scanning\u2026 ", /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums text-zinc-700"
  }, found), " repos found so far."), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    disabled: true
  }, "Add 0 repos")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums text-zinc-700"
  }, selected), " of ", eligible.length, " selected \xB7 ", SCAN_RESULTS.filter(r => r.status === 'already').length, " already in Pyor"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "plus"
  }, "Add ", selected, " repos"))));
}
function ScanProgressCard({
  found
}) {
  // Indeterminate-style progress: fixed width animated stripe substitute.
  return /*#__PURE__*/React.createElement(SCard, {
    className: "overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 border-b border-zinc-100 px-3.5 py-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative inline-flex size-4 items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute inline-flex size-3 rounded-full bg-blue-500/40 motion-safe:animate-ping"
  }), /*#__PURE__*/React.createElement("span", {
    className: "relative inline-flex size-2 rounded-full bg-blue-600"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px] font-semibold text-zinc-900"
  }, "Walking ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11.5px] text-zinc-600"
  }, "~/code"), "\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-900"
  }, found), " repos \xB7 ", /*#__PURE__*/React.createElement("span", null, "1,847"), " folders walked")), /*#__PURE__*/React.createElement("div", {
    className: "px-3.5 pt-3 pb-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-1 overflow-hidden rounded-full bg-zinc-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full w-1/3 rounded-full bg-zinc-900",
    style: {
      animation: 'pier-scan-stripe 1.6s ease-in-out infinite'
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes pier-scan-stripe { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`)), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-100"
  }, SCAN_RESULTS.slice(0, found).map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.path,
    className: `flex items-center gap-2.5 px-3.5 py-1.5 text-[12px] ${i ? 'border-t border-zinc-100' : ''}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11.5px] text-zinc-700"
  }, r.path), /*#__PURE__*/React.createElement(SBadge, {
    variant: "success",
    className: "ml-auto gap-1 text-[9.5px]"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-2.5",
    strokeWidth: 3
  }), "found"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px] truncate"
  }, "~/code/northwind/web-event-app/node_modules/\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-zinc-400"
  }, "skipped"))));
}
function ScanResultsCard({
  found,
  selected,
  eligible
}) {
  return /*#__PURE__*/React.createElement(SCard, {
    className: "overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 border-b border-zinc-100 bg-zinc-50/60 px-3.5 py-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-4 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px] font-semibold"
  }, "Found ", found, " repositories"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "in ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono"
  }, "~/code")), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    className: "text-[11.5px] font-medium text-zinc-700 hover:underline"
  }, "Select all"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    className: "text-[11.5px] font-medium text-zinc-700 hover:underline"
  }, "None"))), /*#__PURE__*/React.createElement("div", {
    className: "max-h-[260px] overflow-auto"
  }, SCAN_RESULTS.map((r, i) => /*#__PURE__*/React.createElement(ScanResultRow, {
    key: r.path,
    r: r,
    first: i === 0
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2 text-[11.5px] text-zinc-600"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), /*#__PURE__*/React.createElement("span", null, "Skip repos with no remote"), /*#__PURE__*/React.createElement("span", {
    className: "ml-3 inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SCheckbox, null), " ", /*#__PURE__*/React.createElement("span", null, "Watch all added repos for new branches"))));
}
function ScanResultRow({
  r,
  first
}) {
  const isAlready = r.status === 'already';
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-start gap-2.5 px-3.5 py-2 ${first ? '' : 'border-t border-zinc-100'} ${isAlready ? 'bg-zinc-50/40' : 'hover:bg-zinc-50/60'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-0.5"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: r.selected,
    disabled: isAlready
  })), /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: `size-3.5 mt-0.5 shrink-0 ${isAlready ? 'text-zinc-300' : 'text-zinc-500'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("code", {
    className: `truncate font-mono text-[12px] ${isAlready ? 'text-zinc-400 line-through decoration-zinc-300' : 'text-zinc-900 font-semibold'}`
  }, r.path), isAlready && /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "text-[9.5px]"
  }, "already in Pyor"), !isAlready && !r.remote && /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn",
    className: "text-[9.5px]"
  }, "no remote")), /*#__PURE__*/React.createElement("div", {
    className: `mt-0.5 flex items-center gap-2 text-[11px] ${isAlready ? 'text-zinc-400' : 'text-zinc-500'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-branch",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, r.branch)), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, r.branches, " branches"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, r.size), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "last commit ", r.last), r.notes && !isAlready && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-amber-700"
  }, r.notes)))));
}
const MY_PRS_S = [{
  unread: 0,
  status: 'open',
  title: "feat(ios): persist scroll offset across PR-list refreshes",
  repo: 'northwind/mobile-ios',
  branch: 'feat/persist-scroll',
  num: 1183,
  author: 'alex-cho',
  age: '11h',
  additions: 28,
  deletions: 5,
  files: 2,
  checks: {
    p: 7,
    f: 0,
    pe: 0
  },
  comments: 1,
  approved: true
}, {
  unread: 1,
  status: 'open',
  title: "refactor(notifications): pull /notifications into shared client",
  repo: 'northwind/web-event-app',
  branch: 'refactor/notifs-client',
  num: 9244,
  author: 'alex-cho',
  age: '1d',
  additions: 218,
  deletions: 184,
  files: 9,
  checks: {
    p: 18,
    f: 0,
    pe: 0
  },
  comments: 4
}, {
  unread: 0,
  status: 'draft',
  title: "RFC: introduce a Pre-PR review surface in Pyor",
  repo: 'northwind/web-event-app',
  branch: 'rfc/pre-pr',
  num: 9201,
  author: 'alex-cho',
  age: '2d',
  additions: 612,
  deletions: 8,
  files: 14,
  checks: {
    p: 16,
    f: 0,
    pe: 1
  },
  comments: 12,
  draft: true
}];
const REVIEWING_PRS_S = [{
  unread: 3,
  status: 'open',
  title: "feat(scheduler): coalesce identical session pushes into a single fan-out",
  repo: 'northwind/web-event-app',
  branch: 'feat/coalesce-push',
  num: 9241,
  author: 'priya-r',
  age: '12m',
  additions: 412,
  deletions: 89,
  files: 14,
  checks: {
    p: 18,
    f: 0,
    pe: 2
  },
  comments: 4,
  selected: true
}, {
  unread: 5,
  status: 'open',
  title: "perf(diff-render): virtualise hunks larger than 2k lines",
  repo: 'northwind/web-event-app',
  branch: 'perf/virtualise-hunks',
  num: 9217,
  author: 'nicolae-i',
  age: '1d',
  additions: 904,
  deletions: 311,
  files: 7,
  checks: {
    p: 16,
    f: 2,
    pe: 0
  },
  comments: 23,
  changes: true
}, {
  unread: 0,
  status: 'open',
  title: "fix(billing): correct prorated charge math when plan downgrades mid-cycle",
  repo: 'northwind/api',
  branch: 'fix/proration',
  num: 4471,
  author: 'marcus-w',
  age: '1h',
  additions: 38,
  deletions: 47,
  files: 4,
  checks: {
    p: 23,
    f: 0,
    pe: 0
  },
  comments: 7
}, {
  unread: 2,
  status: 'open',
  title: "Empty-state polish for event picker on small viewports",
  repo: 'northwind/design-system',
  branch: 'polish/empty-states',
  num: 612,
  author: 'jules-k',
  age: '7h',
  additions: 64,
  deletions: 22,
  files: 3,
  checks: {
    p: 11,
    f: 0,
    pe: 0
  },
  comments: 2
}, {
  unread: 1,
  status: 'draft',
  title: "RFC: cohort export pipeline (S3 + Athena)",
  repo: 'northwind/analytics',
  branch: 'rfc/cohort-export',
  num: 308,
  author: 'sara-l',
  age: '3h',
  additions: 1240,
  deletions: 12,
  files: 38,
  checks: {
    p: 4,
    f: 1,
    pe: 3
  },
  comments: 12,
  draft: true
}, {
  unread: 1,
  status: 'open',
  title: "spike: replace Redux with Zustand on the attendee dashboard",
  repo: 'northwind/web-event-app',
  branch: 'spike/zustand',
  num: 9198,
  author: 'marcus-w',
  age: '2d',
  additions: 1820,
  deletions: 1640,
  files: 56,
  checks: {
    p: 14,
    f: 0,
    pe: 0
  },
  comments: 31
}];
function ShadcnPullRequestsScreen({
  width = 1320,
  height = 820,
  view = {}
}) {
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
    ...view
  };
  const rows = v.tab === 'mine' ? MY_PRS_S : REVIEWING_PRS_S;
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Pull requests",
    subtitle: v.tab === 'mine' ? 'Authored by you' : 'In your review queue',
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "pulls"
    }),
    toolbar: v.empty === 'no-token' ? /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "key-round"
    }, "Connect GitHub") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "refresh"
    }, "Refresh"), /*#__PURE__*/React.createElement(SButton, {
      variant: "outline",
      size: "sm",
      icon: "arrow-up-down"
    }, "Sort: Activity")),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Connected \xB7 alex-cho"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Last poll ", /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-900"
    }, "22s ago")), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "54 PRs cached \xB7 42 MB \xB7 GraphQL search \xB7 1000-row cap"))
  }, /*#__PURE__*/React.createElement(ShadcnPRsTabsBar, {
    v: v
  }), v.empty !== 'no-token' && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2"
  }, /*#__PURE__*/React.createElement(SChip, {
    label: "Status",
    value: "Open",
    active: true
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Repo",
    value: v.empty === 'filtered' ? 'northwind/infra' : 'any',
    active: v.empty === 'filtered'
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Author",
    value: v.empty === 'filtered' ? 'dependabot' : 'any',
    active: v.empty === 'filtered'
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Reviewer",
    value: "any"
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "CI",
    value: "any"
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Label",
    value: "any"
  }), v.empty === 'filtered' && /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Clear all"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10.5px]"
  }, "/search/issues"), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums"
  }, rows.length), " of ~84")), v.empty == null ? /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, rows.map((pr, i) => /*#__PURE__*/React.createElement(ShadcnPRRowV2, {
    key: i,
    pr: pr
  })), /*#__PURE__*/React.createElement(PRsInfiniteFooter, {
    loading: v.loading,
    pagesLoaded: v.pagesLoaded,
    shown: rows.length
  })) : /*#__PURE__*/React.createElement(ShadcnPullEmpty, {
    kind: v.empty
  }));
}

// Tabs bar with search input + date range chip on the right.
// Replaces the previous STabsUnderline call so we can host inline
// filter affordances alongside the tab triggers.
function ShadcnPRsTabsBar({
  v
}) {
  const tabs = [{
    id: 'mine',
    label: 'My PRs',
    icon: 'user',
    count: MY_PRS_S.length
  }, {
    id: 'reviewing',
    label: 'Reviewing',
    icon: 'eye',
    count: REVIEWING_PRS_S.length
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border-b border-zinc-200 px-5"
  }, tabs.map(t => {
    const on = t.id === v.tab;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: `relative inline-flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium transition-colors ${on ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: t.icon,
      className: `size-3.5 ${on ? 'text-zinc-900' : 'text-zinc-400'}`
    }), /*#__PURE__*/React.createElement("span", null, t.label), /*#__PURE__*/React.createElement("span", {
      className: `tabular-nums text-[11px] ${on ? 'text-zinc-500' : 'text-zinc-400'}`
    }, t.count), on && /*#__PURE__*/React.createElement("span", {
      className: "absolute inset-x-0 bottom-[-1px] h-[2px] bg-zinc-900"
    }));
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2 py-1.5"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter PRs \xB7 title, repo, author, label\u2026",
    kbd: "\u2318F",
    value: v.search,
    className: "w-80"
  }), /*#__PURE__*/React.createElement(DateRangeChip, {
    open: v.dateRangeOpen,
    value: v.dateRange,
    active: v.dateRange && v.dateRange !== 'All time'
  })));
}

// Infinite-list sentinel at the bottom of the PR list.
// Three states mirror the comments-list footer.
function PRsInfiniteFooter({
  loading,
  pagesLoaded,
  shown
}) {
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-center gap-2 border-t border-zinc-100 px-4 py-5 text-[12px] text-zinc-500"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      className: "size-3.5 animate-[spin_1s_linear_infinite] text-zinc-500",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2v4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 18v4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4.93 4.93l2.83 2.83"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16.24 16.24l2.83 2.83"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 12h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18 12h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4.93 19.07l2.83-2.83"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16.24 7.76l2.83-2.83"
    })), /*#__PURE__*/React.createElement("span", null, "Loading page ", pagesLoaded + 1, "\u2026"), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "tabular-nums"
    }, shown, " of ~84"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center gap-1.5 border-t border-zinc-100 px-4 py-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums text-zinc-700"
  }, shown), " shown \xB7 ", pagesLoaded, " ", pagesLoaded === 1 ? 'page' : 'pages', " loaded")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-3"
  }), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3.5"
  }), "Load more")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] text-zinc-400"
  }, "Scroll to auto-load \xB7 GraphQL cursor pagination \xB7 100 / page"));
}
function ShadcnPRRowV2({
  pr
}) {
  const icon = pr.draft ? 'git-pull-request-draft' : 'git-pull-request';
  const iconColor = pr.draft ? 'text-zinc-400' : 'text-emerald-600';
  return /*#__PURE__*/React.createElement("div", {
    className: `relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-5 py-3 ${pr.selected ? 'bg-blue-50/40' : 'hover:bg-zinc-50'}`
  }, pr.selected && /*#__PURE__*/React.createElement("span", {
    className: "absolute left-0 top-0 h-full w-0.5 bg-zinc-900"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-1.5 pt-1.5 shrink-0"
  }, pr.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "block size-1.5 rounded-full bg-blue-600"
  })), /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: `size-4 shrink-0 mt-0.5 ${iconColor}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `truncate text-[13.5px] tracking-tight ${pr.unread ? 'font-semibold' : 'font-medium'} text-zinc-900`,
    style: {
      maxWidth: 580
    }
  }, pr.title), pr.changes && /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive"
  }, "changes requested"), pr.approved && /*#__PURE__*/React.createElement(SBadge, {
    variant: "success"
  }, "approved by you"), pr.draft && /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary"
  }, "draft")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-400"
  }, "#", pr.num), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, pr.repo), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: pr.author,
    size: "size-4"
  }), pr.author), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, pr.branch))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right min-w-[72px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-400"
  }, pr.files, " files"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", pr.additions.toLocaleString()), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", pr.deletions))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-[64px]"
  }, pr.checks.p > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), pr.checks.p), pr.checks.f > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5 text-red-600"
  }), pr.checks.f), pr.checks.pe > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "circle-dot",
    className: "size-3.5 text-amber-600"
  }), pr.checks.pe)), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[36px]"
  }, pr.comments > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: `size-3.5 ${pr.unread ? 'text-blue-600' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: pr.unread ? 'font-semibold text-blue-600' : ''
  }, pr.comments)) : /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\u2014")), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[28px] text-right text-zinc-400"
  }, pr.age)));
}
function ShadcnPullEmpty({
  kind
}) {
  const v = {
    mine: {
      icon: 'git-pull-request',
      iconClass: 'text-zinc-400',
      title: 'No open PRs you authored.',
      body: 'Open one in your terminal and refresh — Pyor picks them up as soon as the API does.',
      action: /*#__PURE__*/React.createElement(SButton, {
        variant: "outline",
        size: "sm",
        icon: "refresh"
      }, "Refresh")
    },
    reviewing: {
      icon: 'eye',
      iconClass: 'text-zinc-400',
      title: 'Nothing in your review queue.',
      body: "PRs you're a requested reviewer on, have commented on, or are subscribed to will show up here.",
      action: /*#__PURE__*/React.createElement(SButton, {
        variant: "outline",
        size: "sm"
      }, "Browse your team's PRs")
    },
    'no-token': {
      icon: 'lock',
      iconClass: 'text-red-500',
      title: 'Connect GitHub to see your PRs.',
      body: 'Pyor needs a personal access token with repo + notifications scope. Settings stays local — the token lives in your Keychain.',
      action: /*#__PURE__*/React.createElement(SButton, {
        variant: "default",
        size: "sm",
        icon: "key-round"
      }, "Connect GitHub")
    },
    filtered: {
      icon: 'sliders',
      iconClass: 'text-zinc-400',
      title: 'No PRs match these filters.',
      body: '2 filters applied. Clear them to see the full list, or adjust them above.',
      action: /*#__PURE__*/React.createElement(SButton, {
        variant: "outline",
        size: "sm"
      }, "Clear all filters"),
      secondary: /*#__PURE__*/React.createElement("div", {
        className: "inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11.5px] text-zinc-500"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-zinc-400"
      }, "Active filters:"), /*#__PURE__*/React.createElement(SBadge, {
        variant: "default",
        className: "text-[10px]"
      }, "Repo: northwind/infra"), /*#__PURE__*/React.createElement(SBadge, {
        variant: "default",
        className: "text-[10px]"
      }, "Author: dependabot"))
    }
  }[kind];
  return /*#__PURE__*/React.createElement(EmptyState, v);
}

// ═══ Screen — Local reviews list ═══════════════════════════════
// Catalog of local pre-PR reviews on this machine. Mirrors Pull requests
// shape: rows with status icon, title/branch, head→base, last activity,
// uncommitted count + ahead/behind, viewed progress, age. "New local
// review" CTA opens the launcher.

const LOCAL_REVIEWS = [{
  id: 'lr1',
  status: 'in-progress',
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  repo: 'northwind/web-event-app',
  head: 'perf/virtualise-hunks',
  base: 'main',
  ahead: 14,
  behind: 0,
  uncommitted: 3,
  additions: 904,
  deletions: 311,
  files: 7,
  viewed: 3,
  viewedOf: 7,
  notes: 4,
  lastActivity: 'just now',
  selected: true
}, {
  id: 'lr2',
  status: 'ready',
  title: 'refactor(notifications): pull /notifications into shared client',
  repo: 'northwind/web-event-app',
  head: 'refactor/notifs-client',
  base: 'main',
  ahead: 9,
  behind: 2,
  uncommitted: 0,
  additions: 218,
  deletions: 184,
  files: 9,
  viewed: 9,
  viewedOf: 9,
  notes: 7,
  lastActivity: '32m ago'
}, {
  id: 'lr3',
  status: 'in-progress',
  title: 'WIP: replace Redux with Zustand on the attendee dashboard',
  repo: 'northwind/web-event-app',
  head: 'spike/zustand',
  base: 'main',
  ahead: 38,
  behind: 14,
  uncommitted: 12,
  additions: 1820,
  deletions: 1640,
  files: 56,
  viewed: 11,
  viewedOf: 56,
  notes: 18,
  lastActivity: '2h ago',
  dirty: true
}, {
  id: 'lr4',
  status: 'pr-opened',
  title: 'feat(ios): persist scroll offset across PR-list refreshes',
  repo: 'northwind/mobile-ios',
  head: 'feat/persist-scroll',
  base: 'main',
  ahead: 4,
  behind: 0,
  uncommitted: 0,
  additions: 28,
  deletions: 5,
  files: 2,
  viewed: 2,
  viewedOf: 2,
  notes: 0,
  lastActivity: '11h ago',
  prNum: 1183
}, {
  id: 'lr5',
  status: 'ready',
  title: 'RFC: introduce a Pre-PR review surface in Pyor',
  repo: 'northwind/web-event-app',
  head: 'rfc/pre-pr',
  base: 'main',
  ahead: 22,
  behind: 0,
  uncommitted: 0,
  additions: 612,
  deletions: 8,
  files: 14,
  viewed: 14,
  viewedOf: 14,
  notes: 12,
  lastActivity: '2d ago'
}, {
  id: 'lr6',
  status: 'stale',
  title: 'experiment: pre-render diff hunks in a worker',
  repo: 'northwind/web-event-app',
  head: 'spike/diff-worker',
  base: 'main',
  ahead: 6,
  behind: 142,
  uncommitted: 0,
  additions: 184,
  deletions: 12,
  files: 4,
  viewed: 1,
  viewedOf: 4,
  notes: 1,
  lastActivity: '3w ago'
}];
const LOCAL_STATUS_CFG = {
  'in-progress': {
    label: 'In progress',
    icon: 'circle-dot',
    variant: 'warn'
  },
  'ready': {
    label: 'Ready to PR',
    icon: 'check-circle',
    variant: 'success'
  },
  'pr-opened': {
    label: 'PR opened',
    icon: 'git-pull-request',
    variant: 'default'
  },
  'stale': {
    label: 'Stale',
    icon: 'clock',
    variant: 'secondary'
  }
};

// Archived = repo was removed from Pyor. The review row is kept but
// rendered with an archived treatment (legible, dimmed, no longer
// linked to a live worktree). Re-adding the repo restores the rows.
const LOCAL_ARCHIVED = [{
  id: 'a1',
  archivedFrom: 'northwind/infra',
  archivedAt: '4d ago',
  title: 'tf: split networking module into a dedicated workspace',
  head: 'refactor/network-workspace',
  base: 'main',
  additions: 412,
  deletions: 187,
  files: 11,
  viewed: 8,
  viewedOf: 11,
  notes: 6,
  lastActivity: '4d ago'
}, {
  id: 'a2',
  archivedFrom: 'northwind/infra',
  archivedAt: '4d ago',
  title: 'ci: drop the legacy GitLab runner from build matrix',
  head: 'ci/drop-gitlab',
  base: 'main',
  additions: 14,
  deletions: 196,
  files: 3,
  viewed: 3,
  viewedOf: 3,
  notes: 1,
  lastActivity: '6d ago'
}, {
  id: 'a3',
  archivedFrom: 'northwind/dashboards',
  archivedAt: '2w ago',
  title: 'spike: replace Looker tiles with self-hosted Grafana panels',
  head: 'spike/grafana-tiles',
  base: 'main',
  additions: 624,
  deletions: 38,
  files: 18,
  viewed: 4,
  viewedOf: 18,
  notes: 9,
  lastActivity: '2w ago'
}];
function ShadcnLocalReviewsScreen({
  width = 1320,
  height = 820,
  view = {}
}) {
  const v = {
    empty: 'list',
    // 'list' (empty default) | null (populated) | 'filtered'
    archivedExpanded: false,
    // collapsible "N archived" footer
    repoFilterOpen: false,
    // Repo filter chip popover open
    confirmRemoveOpen: false,
    // "Remove from Pyor?" confirm dialog
    ...view
  };
  const rows = v.empty === 'filtered' ? LOCAL_REVIEWS.filter(r => r.status === 'stale' && r.repo === 'northwind/infra') : LOCAL_REVIEWS;
  const showEmpty = v.empty === 'list' || v.empty === 'filtered' && rows.length === 0;
  // Whether to surface the archived section. Hidden in empty view.
  const showArchived = !showEmpty && LOCAL_ARCHIVED.length > 0;
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Local reviews",
    subtitle: showEmpty ? 'None yet' : `${LOCAL_REVIEWS.length} on this machine`,
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "local"
    }),
    toolbar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SInput, {
      icon: "search",
      placeholder: "Filter local reviews",
      kbd: "\u2318F",
      className: "w-56"
    }), /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "refresh"
    }, "Refresh"), /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "plus"
    }, "Create new local review")),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "git OK \xB7 4 worktrees discovered"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Watching ", /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-900"
    }, "~/code")), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "No GitHub round-trips \xB7 everything below is local"))
  }, !showEmpty && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2"
  }, /*#__PURE__*/React.createElement(SChip, {
    label: "Status",
    value: "any"
  }), /*#__PURE__*/React.createElement(RepoManageChip, {
    open: v.repoFilterOpen,
    value: v.empty === 'filtered' ? 'northwind/infra' : 'any',
    active: v.empty === 'filtered'
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Base",
    value: "any"
  }), v.empty === 'filtered' && /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Clear all"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11.5px] text-zinc-500"
  }, "Sorted by ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-700"
  }, "Last activity \u2193"))), showEmpty ? /*#__PURE__*/React.createElement(LocalReviewsEmpty, {
    kind: v.empty || 'list'
  }) : /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, rows.map(r => /*#__PURE__*/React.createElement(LocalReviewRow, {
    key: r.id,
    r: r
  })), showArchived && /*#__PURE__*/React.createElement(ArchivedSection, {
    expanded: v.archivedExpanded
  })), v.confirmRemoveOpen && /*#__PURE__*/React.createElement(ConfirmRemoveRepoDialog, {
    repoName: "northwind/infra",
    reviewCount: 2
  }));
}
function LocalReviewRow({
  r
}) {
  const cfg = LOCAL_STATUS_CFG[r.status];
  const viewedPct = r.viewed / r.viewedOf * 100;
  return /*#__PURE__*/React.createElement("div", {
    className: `relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-5 py-3 ${r.selected ? 'bg-blue-50/40' : 'hover:bg-zinc-50'}`
  }, r.selected && /*#__PURE__*/React.createElement("span", {
    className: "absolute left-0 top-0 h-full w-0.5 bg-zinc-900"
  }), /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: `size-4 shrink-0 mt-0.5 ${r.status === 'ready' ? 'text-emerald-600' : r.status === 'pr-opened' ? 'text-blue-600' : r.status === 'in-progress' ? 'text-amber-600' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[13.5px] font-semibold tracking-tight text-zinc-900",
    style: {
      maxWidth: 540
    }
  }, r.title), /*#__PURE__*/React.createElement(SBadge, {
    variant: cfg.variant,
    className: "gap-1"
  }, cfg.label), r.dirty && /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn",
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "size-2.5"
  }), r.uncommitted, " uncommitted"), r.behind > 0 && r.status === 'stale' && /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "arrow-down",
    className: "size-2.5"
  }), r.behind, " behind"), r.status === 'pr-opened' && /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1 font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-2.5"
  }), "#", r.prNum)), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", null, r.repo), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-700"
  }, r.head), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    className: "size-2.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, r.base)))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-[68px] text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-400"
  }, "commits"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "\u2191", r.ahead), ' ', /*#__PURE__*/React.createElement("span", {
    className: r.behind > 0 ? 'text-amber-600' : 'text-zinc-300'
  }, "\u2193", r.behind))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[80px] text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-400"
  }, r.files, " files"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", r.additions.toLocaleString()), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", r.deletions))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[88px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-0.5 flex items-baseline justify-between text-[10.5px] text-zinc-400"
  }, /*#__PURE__*/React.createElement("span", null, "Viewed"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono tabular-nums"
  }, r.viewed, "/", r.viewedOf)), /*#__PURE__*/React.createElement("div", {
    className: "h-1 rounded-full bg-zinc-100 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full ${viewedPct === 100 ? 'bg-emerald-500' : 'bg-zinc-900'}`,
    style: {
      width: `${viewedPct}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[36px]"
  }, r.notes > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, r.notes)) : /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\u2014")), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[64px] text-right text-zinc-400"
  }, r.lastActivity)));
}

// ── Repo filter chip with management dropdown ─────────────────
// Replaces the basic SChip on the Local Reviews filter row. Opens an
// SPopover with a searchable list of registered repos; each row exposes
// a hover-revealed trash that fires "Remove from Pyor?" confirmation.
const LOCAL_REPOS_REGISTERED = [{
  id: 'web',
  name: 'northwind/web-event-app',
  reviews: 4,
  lastActive: 'just now',
  worktrees: 2,
  dirty: true
}, {
  id: 'mobile',
  name: 'northwind/mobile-ios',
  reviews: 1,
  lastActive: '11h ago',
  worktrees: 1,
  dirty: false
}, {
  id: 'api',
  name: 'northwind/api',
  reviews: 0,
  lastActive: '4h ago',
  worktrees: 1,
  dirty: false
}, {
  id: 'infra',
  name: 'northwind/infra',
  reviews: 1,
  lastActive: '3w ago',
  worktrees: 1,
  dirty: false,
  willRemove: true
}, {
  id: 'design',
  name: 'northwind/design-system',
  reviews: 0,
  lastActive: '2d ago',
  worktrees: 2,
  dirty: false
}];
function RepoManageChip({
  open,
  value,
  active
}) {
  return /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    width: 380,
    align: "start",
    trigger: /*#__PURE__*/React.createElement("span", {
      className: "inline-block"
    }, /*#__PURE__*/React.createElement(SChip, {
      label: "Repo",
      value: value || 'any',
      active: active || open
    }))
  }, /*#__PURE__*/React.createElement(SCommand, null, /*#__PURE__*/React.createElement(SCommandInput, {
    placeholder: "Filter repos\u2026",
    matches: LOCAL_REPOS_REGISTERED.length
  }), /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "Filter by"
  }, /*#__PURE__*/React.createElement(SCommandItem, {
    active: !active
  }, /*#__PURE__*/React.createElement(LI, {
    name: "globe",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex min-w-0 flex-1 items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px] font-medium text-zinc-900"
  }, "Any repo"), !active && /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-3 text-zinc-900",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] text-zinc-400 tabular-nums"
  }, LOCAL_REVIEWS.length)))), /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "Registered repos"
  }, LOCAL_REPOS_REGISTERED.map(r => /*#__PURE__*/React.createElement(RepoFilterRow, {
    key: r.id,
    r: r,
    active: r.name === value
  }))), /*#__PURE__*/React.createElement(SCommandFooter, null, /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "plus",
    kbd: "\u2318N"
  }, "Add a repo\u2026"), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "scan-search"
  }, "Scan a parent folder\u2026"))));
}
function RepoFilterRow({
  r,
  active
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `group relative flex items-center gap-2.5 rounded-sm px-2 py-1.5 ${active ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "github",
    className: `size-3.5 ${active ? 'text-zinc-900' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: `truncate text-[12.5px] ${active ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-900'}`
  }, r.name), active && /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-3 text-zinc-900",
    strokeWidth: 3
  }), r.willRemove && /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive",
    className: "text-[9.5px]"
  }, "about to remove")), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums"
  }, r.reviews, " review", r.reviews === 1 ? '' : 's'), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, r.worktrees, " worktree", r.worktrees > 1 ? 's' : ''), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "active ", r.lastActive))), /*#__PURE__*/React.createElement("button", {
    title: `Remove ${r.name} from Pyor`,
    className: `inline-flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 ${r.willRemove ? '' : 'invisible group-hover:visible'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "trash-2",
    className: "size-3.5"
  })));
}

// ── Confirm remove-repo dialog ───────────────────────────────
// Fired from the Repo filter chip's trash. Soft delete: saved reviews
// stay listed (archived state) so the user doesn't lose notes.
function ConfirmRemoveRepoDialog({
  repoName,
  reviewCount
}) {
  return /*#__PURE__*/React.createElement(SDialog, {
    open: true,
    width: 480
  }, /*#__PURE__*/React.createElement(SDialogHeader, {
    icon: "trash-2",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Remove ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12.5px]"
    }, repoName), " from Pyor?"),
    description: "Pyor will stop watching this folder. Your local files are not touched.",
    onClose: () => {}
  }), /*#__PURE__*/React.createElement(SDialogBody, null, /*#__PURE__*/React.createElement(SCard, {
    className: "border-zinc-200 bg-zinc-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "archive",
    className: "mt-0.5 size-4 shrink-0 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-[12.5px] leading-relaxed text-zinc-700"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-zinc-900"
  }, reviewCount, " saved review", reviewCount === 1 ? '' : 's', " will be archived"), /*#__PURE__*/React.createElement("div", {
    className: "text-zinc-600"
  }, "Notes, threads, and viewed-state stay intact. They'll surface in the ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-700"
  }, reviewCount, " archived"), " section at the bottom of Local reviews.")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 grid gap-1.5 text-[12px] text-zinc-600"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "mt-0.5 size-3 text-emerald-600",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("span", null, "Re-add this repo later \u2014 archived reviews automatically restore.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "mt-0.5 size-3 text-emerald-600",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("span", null, "Delete archived reviews individually whenever you like."))), /*#__PURE__*/React.createElement("label", {
    className: "mt-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50/40 px-2.5 py-2 text-[12px] text-red-900"
  }, /*#__PURE__*/React.createElement(SCheckbox, null), /*#__PURE__*/React.createElement("span", null, "Also delete the ", reviewCount, " review", reviewCount === 1 ? '' : 's', " permanently \u2014 ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-700"
  }, "cannot be undone")))), /*#__PURE__*/React.createElement(SDialogFooter, null, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "destructive",
    size: "sm",
    icon: "trash-2"
  }, "Remove repo")));
}

// ── Archived section ─────────────────────────────────────────
// Collapsible footer that surfaces soft-deleted reviews. Reads
// "archived not broken" — softer typography, archive icon, subtle
// background, per-row kebab to permanently delete or restore the
// originating repo.
function ArchivedSection({
  expanded
}) {
  const groupedByRepo = LOCAL_ARCHIVED.reduce((acc, r) => {
    (acc[r.archivedFrom] = acc[r.archivedFrom] || []).push(r);
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("div", {
    className: "border-t-2 border-dashed border-zinc-200/80 bg-zinc-50/30"
  }, /*#__PURE__*/React.createElement("button", {
    className: "flex w-full items-center gap-2.5 px-5 py-2.5 text-left hover:bg-zinc-50/80"
  }, /*#__PURE__*/React.createElement(LI, {
    name: expanded ? 'chevron-down' : 'chevron-right',
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "archive",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px] font-semibold text-zinc-700"
  }, "Archived"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "text-[10.5px]"
  }, LOCAL_ARCHIVED.length), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "From ", Object.keys(groupedByRepo).length, " removed repos \xB7 notes preserved"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "archive-restore",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, "Re-add the repo to restore"))), expanded && /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200/80"
  }, Object.entries(groupedByRepo).map(([repo, items]) => /*#__PURE__*/React.createElement("div", {
    key: repo
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200/60 bg-zinc-100/50 px-5 py-1.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "github",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px] text-zinc-600"
  }, repo), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "removed ", items[0].archivedAt), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, items.length, " archived review", items.length === 1 ? '' : 's'), /*#__PURE__*/React.createElement("button", {
    className: "ml-auto inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "archive-restore",
    className: "size-3"
  }), "Restore repo\u2026")), items.map(r => /*#__PURE__*/React.createElement(ArchivedReviewRow, {
    key: r.id,
    r: r
  }))))));
}
function ArchivedReviewRow({
  r
}) {
  const viewedPct = r.viewed / r.viewedOf * 100;
  return /*#__PURE__*/React.createElement("div", {
    className: "group relative flex cursor-pointer items-start gap-3 border-b border-zinc-200/60 px-5 py-3 hover:bg-zinc-50/80"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "archive",
    className: "size-4 shrink-0 mt-0.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[13.5px] font-medium tracking-tight text-zinc-600",
    style: {
      maxWidth: 520
    }
  }, r.title), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1 text-[10px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "archive",
    className: "size-2.5"
  }), "Archived")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-500"
  }, r.head), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    className: "size-2.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, r.base)), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "Notes preserved \xB7 read-only"))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-400"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-[80px] text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-400"
  }, r.files, " files"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "+", r.additions.toLocaleString()), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "\u2212", r.deletions))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[88px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-0.5 flex items-baseline justify-between text-[10.5px] text-zinc-400"
  }, /*#__PURE__*/React.createElement("span", null, "Viewed"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono tabular-nums"
  }, r.viewed, "/", r.viewedOf)), /*#__PURE__*/React.createElement("div", {
    className: "h-1 rounded-full bg-zinc-100 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-zinc-400",
    style: {
      width: `${viewedPct}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[36px]"
  }, r.notes > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, r.notes)) : /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\u2014")), /*#__PURE__*/React.createElement("div", {
    className: "min-w-[60px] text-right"
  }, r.lastActivity), /*#__PURE__*/React.createElement(SDropdownMenu, {
    width: 210,
    trigger: /*#__PURE__*/React.createElement("button", {
      className: "inline-flex size-7 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-zinc-700 group-hover:opacity-100"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "more-horizontal",
      className: "size-3.5"
    }))
  }, /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "archive-restore"
  }, "Re-add ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, r.archivedFrom)), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "external-link"
  }, "Open notes (read-only)"), /*#__PURE__*/React.createElement(SDropdownSeparator, null), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "trash-2",
    danger: true
  }, "Delete permanently"))));
}
function LocalReviewsEmpty({
  kind
}) {
  if (kind === 'filtered') {
    return /*#__PURE__*/React.createElement(EmptyState, {
      icon: "sliders",
      iconClass: "text-zinc-400",
      title: "No local reviews match these filters.",
      body: "Clear the filters above to see the full list.",
      action: /*#__PURE__*/React.createElement(SButton, {
        variant: "outline",
        size: "sm"
      }, "Clear all filters")
    });
  }
  return /*#__PURE__*/React.createElement(EmptyState, {
    icon: "monitor",
    iconClass: "text-zinc-500",
    title: "No local reviews yet.",
    body: "Local reviews let you walk your own branch diff before opening a PR. Notes you leave migrate as review comments when you ship it.",
    action: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "plus"
    }, "Create new local review"), /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "external-link"
    }, "Read the spec"))
  });
}

// ═══ Screen — PR detail (Files changed) ══════════════════════
// Re-uses ShadcnFilesScreen body but wraps it in the new shell.

function ShadcnPRDetailFilesScreen({
  width = 1320,
  height = 900,
  from = 'inbox',
  view = {}
}) {
  const v = {
    commitsOpen: false,
    hideComments: false,
    unifiedToolbar: true,
    headerDensity: 'single-strip',
    ...view
  };
  const backLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  const [hideComments, setHideComments] = React.useState(!!v.hideComments);
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: from === 'pulls' ? 'pulls' : 'inbox'
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Live polling \xB7 8s"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "2 pending in draft review"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main@a3f7b21")))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: backLabel,
    focusMode: "code",
    focusActive: hideComments,
    onToggleFocus: () => setHideComments(h => !h),
    density: v.headerDensity
  }), v.unifiedToolbar ? /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, {
      commitsOpen: v.commitsOpen
    })
  }), v.commitsOpen && /*#__PURE__*/React.createElement(ShadcnCommitsPopover, {
    align: "right"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'checks',
      label: 'Checks',
      icon: 'check-circle',
      count: 18,
      failing: 2
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(ShadcnFilesToolbar, {
    commitsOpen: v.commitsOpen
  }), v.commitsOpen && /*#__PURE__*/React.createElement(ShadcnCommitsPopover, null))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(ShadcnFileRail, null), /*#__PURE__*/React.createElement(ShadcnDiffPane, {
    hideComments: hideComments
  })), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// Commits picker popover — opens from the "14 commits" button in the Files
// sub-toolbar. Multi-select with checkbox column, head/base meta, range
// summary, and a primary "Show diff" action. Pure shadcn primitives:
// Card (popover surface), Checkbox, Badge, Button, Separator.
const COMMITS_SC = [{
  sha: '8c7d219',
  msg: 'add measureHunk-called-once regression test',
  who: 'nicolae-i',
  ago: '6h',
  add: 38,
  del: 2,
  selected: true
}, {
  sha: 'f02ab1c',
  msg: 'address review: switch to useMemo for the threshold branch',
  who: 'nicolae-i',
  ago: '6h',
  add: 12,
  del: 18,
  selected: true
}, {
  sha: '21fce04',
  msg: 'wire VirtualHunk into NaiveHunk above 2k lines',
  who: 'nicolae-i',
  ago: '22h',
  add: 24,
  del: 6,
  selected: true
}, {
  sha: 'b9e4cd8',
  msg: 'measureHunk: cache line widths per font family',
  who: 'nicolae-i',
  ago: '23h',
  add: 96,
  del: 8,
  selected: true
}, {
  sha: '3a1c7f2',
  msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation',
  who: 'nicolae-i',
  ago: '1d',
  add: 412,
  del: 188,
  selected: true
}, {
  sha: 'e441cb0',
  msg: 'spike: measure baseline render of NaiveHunk',
  who: 'nicolae-i',
  ago: '1d',
  add: 22,
  del: 0,
  selected: false
}, {
  sha: '7df2a01',
  msg: 'rebase onto main (resolves conflicts in editor/metrics.ts)',
  who: 'nicolae-i',
  ago: '1d',
  add: 18,
  del: 9,
  selected: false,
  rebase: true
}, {
  sha: '0bf9e2c',
  msg: 'docs: outline approach in DESIGN.md',
  who: 'nicolae-i',
  ago: '2d',
  add: 74,
  del: 0,
  selected: false
}];

// Range-selection model. Index 0 = newest (top of the list). The first click
// picks a single commit (checkbox). A second click anchors the OTHER end of a
// range — every commit between the two is auto-included and the checkbox column
// morphs into a continuous "range rail" with draggable-looking endpoint handles.
// A third click moves the nearest endpoint, so the range can be grown/shrunk in
// place. "Clear" drops back to the empty state.
function ShadcnCommitsPopover({
  align = 'left'
}) {
  const N = COMMITS_SC.length;
  // Seed with a range over the originally-selected commits (indices 0–4).
  const [a, setA] = React.useState(4); // anchor endpoint
  const [b, setB] = React.useState(0); // focus endpoint (null = single pick)
  const [hover, setHover] = React.useState(null);
  const hasRange = a !== null && b !== null;
  const single = a !== null && b === null;
  const lo = a === null ? null : hasRange ? Math.min(a, b) : a; // newer end (smaller idx)
  const hi = a === null ? null : hasRange ? Math.max(a, b) : a; // older end (larger idx)
  const count = a === null ? 0 : hi - lo + 1;

  // Hover preview while a single commit is picked — telegraphs the range a
  // second click would create.
  const preview = single && hover !== null && hover !== a ? {
    lo: Math.min(a, hover),
    hi: Math.max(a, hover)
  } : null;
  const previewCount = preview ? preview.hi - preview.lo + 1 : 0;
  const inRange = i => lo !== null && i >= lo && i <= hi;
  const inPreview = i => preview && i >= preview.lo && i <= preview.hi;
  function pick(i) {
    if (a === null) {
      setA(i);
      setB(null);
      return;
    } // empty → single
    if (single) {
      // single → range / deselect
      if (i === a) {
        setA(null);
        setB(null);
      } else setB(i);
      return;
    }
    const dLo = Math.abs(i - lo),
      dHi = Math.abs(i - hi); // range → move nearest end
    if (dLo <= dHi) {
      setA(i);
      setB(hi);
    } else {
      setA(lo);
      setB(i);
    }
  }
  const clearSel = () => {
    setA(null);
    setB(null);
    setHover(null);
  };
  const selectAll = () => {
    setA(N - 1);
    setB(0);
  };
  const newSha = lo !== null ? COMMITS_SC[lo].sha : null; // newest in selection
  const oldSha = hi !== null ? COMMITS_SC[hi].sha : null; // oldest in selection
  const sums = (l, h) => COMMITS_SC.slice(l, h + 1).reduce((t, c) => ({
    add: t.add + c.add,
    del: t.del + c.del
  }), {
    add: 0,
    del: 0
  });
  const tot = lo !== null ? sums(lo, hi) : {
    add: 0,
    del: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    className: `absolute ${align === 'right' ? 'right-5' : 'left-5'} top-[calc(100%+4px)] z-40 w-[480px] overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-950`,
    style: SHADCN_FLOAT_SHADOW
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 px-3.5 py-2.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-commit",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] font-semibold tracking-tight"
  }, hasRange ? 'Comparing a range' : 'Comparing commits'), hasRange ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-white"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "arrow-up-down",
    className: "size-2.5"
  }), "range") : single ? /*#__PURE__*/React.createElement("span", {
    className: "rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500"
  }, "single") : null, /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11.5px] text-zinc-500 tabular-nums"
  }, count, " of ", N, " selected"), a === null ? /*#__PURE__*/React.createElement("button", {
    onClick: selectAll,
    className: "text-[12px] font-medium text-zinc-900 hover:underline"
  }, "Select all") : /*#__PURE__*/React.createElement("button", {
    onClick: clearSel,
    className: "text-[12px] font-medium text-zinc-900 hover:underline"
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-[60px_1fr] gap-y-1.5 border-b border-zinc-100 px-3.5 py-2.5 text-[12px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] uppercase tracking-wider text-zinc-500 self-center"
  }, "Base"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-branch",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, "main"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "@"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px] text-zinc-500"
  }, oldSha ? `${oldSha}~1` : 'a3f7b21')), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] uppercase tracking-wider text-zinc-500 self-center"
  }, "Head"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-branch",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, "perf/virtualise-hunks"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "@"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px] text-zinc-500"
  }, newSha || '8c7d219'))), /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-100 px-3.5 py-2"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter commits",
    className: "h-7"
  })), /*#__PURE__*/React.createElement("div", {
    className: "max-h-[260px] overflow-auto"
  }, COMMITS_SC.map((c, i) => {
    const within = inRange(i);
    const isLo = i === lo,
      isHi = i === hi,
      isEdge = within && (isLo || isHi);
    const prev = inPreview(i);
    const bg = within ? 'bg-zinc-100/70' : prev ? 'bg-zinc-50' : 'bg-white';
    return /*#__PURE__*/React.createElement("button", {
      key: c.sha,
      onClick: () => pick(i),
      onMouseEnter: () => setHover(i),
      onMouseLeave: () => setHover(h => h === i ? null : h),
      className: `group/cm relative flex w-full items-start gap-2.5 py-2 pr-3.5 text-left ${bg} ${i ? 'border-t border-zinc-100' : ''} hover:bg-zinc-100`
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative w-9 shrink-0 self-stretch"
    }, hasRange ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: `absolute left-[18px] top-0 h-1/2 w-0.5 -translate-x-1/2 ${within && i > lo ? 'bg-zinc-900' : 'bg-zinc-200'}`
    }), /*#__PURE__*/React.createElement("span", {
      className: `absolute left-[18px] bottom-0 h-1/2 w-0.5 -translate-x-1/2 ${within && i < hi ? 'bg-zinc-900' : 'bg-zinc-200'}`
    }), isEdge ? /*#__PURE__*/React.createElement("span", {
      className: "absolute left-[18px] top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-white shadow-sm"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-white"
    })) : within ? /*#__PURE__*/React.createElement("span", {
      className: "absolute left-[18px] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900"
    }) : /*#__PURE__*/React.createElement("span", {
      className: "absolute left-[18px] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-300 bg-white group-hover/cm:border-zinc-400"
    })) : /*#__PURE__*/React.createElement("span", {
      className: "absolute left-[18px] top-1/2 -translate-x-1/2 -translate-y-1/2"
    }, /*#__PURE__*/React.createElement(SCheckbox, {
      checked: i === a
    }))), /*#__PURE__*/React.createElement(SAvatar, {
      name: c.who,
      size: "size-5"
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "truncate text-[12.5px] text-zinc-900"
    }, c.msg), /*#__PURE__*/React.createElement("div", {
      className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-zinc-700"
    }, c.sha), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, c.who), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, c.ago), isEdge && /*#__PURE__*/React.createElement(SBadge, {
      variant: "outline",
      className: "ml-0.5 text-[9.5px]"
    }, isLo ? 'newest' : 'oldest'), c.rebase && /*#__PURE__*/React.createElement(SBadge, {
      variant: "warn",
      className: "ml-0.5 text-[9.5px]"
    }, "rebase"))), /*#__PURE__*/React.createElement("span", {
      className: "mt-0.5 shrink-0 whitespace-nowrap font-mono text-[10.5px] tabular-nums"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-emerald-600"
    }, "+", c.add), ' ', /*#__PURE__*/React.createElement("span", {
      className: "text-red-600"
    }, "\u2212", c.del)));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "min-w-0 flex-1 truncate text-[11.5px] text-zinc-500"
  }, a === null ? 'Pick a commit, then pick another to compare a range' : preview ? /*#__PURE__*/React.createElement(React.Fragment, null, "Select range \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-zinc-900"
  }, previewCount, " commits")) : single ? /*#__PURE__*/React.createElement(React.Fragment, null, "1 commit \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-900"
  }, newSha), " \u2014 click another to make a range") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-900"
  }, oldSha, "..", newSha), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-emerald-600"
  }, "+", tot.add), " ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-red-600"
  }, "\u2212", tot.del))), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "git-commit",
    className: a === null ? 'pointer-events-none opacity-50' : ''
  }, a === null ? 'Show diff' : `Show diff · ${count} commit${count === 1 ? '' : 's'}`)));
}

// ── Status chip + condensed merge menu ──────────────────────────
// The "Open" PR-state chip gains a caret; clicking it opens a CONDENSED
// merge menu — a fast lane that summarizes lifecycle status and offers the
// primary merge action + overflow, without duplicating the full merge box
// at the foot of the conversation. The chip itself still reads as PR state.
function ShadcnStatusChipMenu({
  mergeState = 'blocked',
  open = false
}) {
  const ready = mergeState === 'ready';
  const trigger = /*#__PURE__*/React.createElement("button", {
    title: "Pull request status & actions",
    className: `group/status inline-flex h-[22px] items-center gap-1.5 rounded-full border pl-2 pr-1.5 text-[11px] font-semibold transition-colors ${open ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", null, "Open"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: `size-3 transition-transform ${open ? 'rotate-180' : 'opacity-60 group-hover/status:opacity-100'}`
  }));
  return /*#__PURE__*/React.createElement(SDropdownMenu, {
    open: open,
    trigger: trigger,
    align: "start",
    width: 304
  }, /*#__PURE__*/React.createElement("div", {
    className: `mb-1 flex items-start gap-2 rounded-md px-2 py-2 ${ready ? 'bg-emerald-50/70' : 'bg-amber-50/70'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: ready ? 'check-circle' : 'alert-triangle',
    className: `mt-0.5 size-4 shrink-0 ${ready ? 'text-emerald-600' : 'text-amber-600'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: `text-[12.5px] font-semibold ${ready ? 'text-emerald-900' : 'text-amber-900'}`
  }, ready ? 'Ready to merge' : 'Merging is blocked'), /*#__PURE__*/React.createElement("div", {
    className: `text-[11px] leading-snug ${ready ? 'text-emerald-700/80' : 'text-amber-700/80'}`
  }, ready ? 'All 18 checks passed · 2 approvals · no conflicts' : '2 of 18 checks failing · changes requested · 3 behind main'))), /*#__PURE__*/React.createElement("div", {
    className: "px-1 pb-1"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: !ready,
    className: `flex h-8 w-full items-center justify-center gap-2 rounded-md text-[12.5px] font-semibold transition-colors ${ready ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-compare",
    className: "size-3.5"
  }), ready ? 'Squash and merge' : 'Merge blocked'), !ready && /*#__PURE__*/React.createElement("div", {
    className: "px-0.5 pt-1 text-[10.5px] leading-snug text-zinc-400"
  }, "Resolve required reviews & checks below to enable merge.")), /*#__PURE__*/React.createElement(SDropdownSeparator, null), !ready && /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "git-branch",
    label: "Update branch"
  }), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "pencil",
    label: "Convert to draft"
  }), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "x-circle",
    label: "Close pull request",
    danger: true
  }), /*#__PURE__*/React.createElement(SDropdownSeparator, null), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "arrow-down",
    label: "Jump to merge box"
  }));
}

// Branch pill that copies its value to the clipboard on click, with a
// transient check-mark confirmation.
function CopyBranch({
  value,
  className = ''
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = e => {
    e.stopPropagation();
    try {
      navigator.clipboard && navigator.clipboard.writeText(value);
    } catch (err) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    title: copied ? 'Copied!' : `Copy "${value}"`,
    className: `group/copy inline-flex items-center gap-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px] text-zinc-600 transition-colors hover:bg-zinc-200 ${className}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-branch",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, value), /*#__PURE__*/React.createElement(LI, {
    name: copied ? 'check' : 'copy',
    className: `size-3 ${copied ? 'text-emerald-600' : 'text-zinc-400 opacity-0 group-hover/copy:opacity-100'}`
  }));
}

// density variants (set via view.headerDensity):
//   'comfortable'  — original 3-line header (default)
//   'tight'        — same content, trimmed padding/margins  (idea A)
//   'compact-meta' — meta sentence collapsed to branch chips (idea B)
//   'single-strip' — meta row folded into row 2 → 2 lines    (idea C)
//   'sticky'       — collapsed-on-scroll one-line bar         (idea D)
function ShadcnPRHeader({
  backLabel = 'Inbox',
  focusMode = 'code',
  focusActive = false,
  onToggleFocus = () => {},
  mergeState = 'blocked',
  statusMenuOpen = false,
  density = 'single-strip'
}) {
  const tight = density === 'tight';

  // ── Shared fragments ────────────────────────────────────────────
  const actions = /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(GhFocusToggle, {
    mode: focusMode,
    active: focusActive,
    onToggle: onToggleFocus
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "icon",
    icon: "github",
    title: "View on GitHub"
  }));
  const titleLine = /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-baseline gap-x-2 gap-y-1"
  }, /*#__PURE__*/React.createElement("a", {
    className: "inline-flex cursor-pointer items-center gap-0.5 text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-left",
    className: "size-3.5 -ml-0.5"
  }), /*#__PURE__*/React.createElement("span", null, backLabel)), /*#__PURE__*/React.createElement("span", {
    className: "text-[15px] font-light text-zinc-300"
  }, "/"), /*#__PURE__*/React.createElement("h1", {
    className: "text-[18px] font-semibold leading-tight tracking-tight text-zinc-950"
  }, "perf(diff-render): virtualise hunks larger than 2k lines"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[14px] font-medium text-zinc-400"
  }, "#9217"));
  const branchChips = /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "main"), /*#__PURE__*/React.createElement(LI, {
    name: "arrow-left",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement(CopyBranch, {
    value: "perf/virtualise-hunks"
  }));
  const reviewers = /*#__PURE__*/React.createElement("div", {
    className: "group/reviewers flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "Reviewers"), /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center"
  }, /*#__PURE__*/React.createElement(ShadcnReviewerChipV2, {
    name: "alex-cho",
    state: "pending",
    age: "Requested 18h ago",
    role: "Frontend reviewer",
    actions: ['Remind', 'Re-request'],
    first: true
  }), /*#__PURE__*/React.createElement(ShadcnReviewerChipV2, {
    name: "priya-r",
    state: "approved",
    age: "Reviewed 22h ago",
    role: "Code owner \xB7 diff/*",
    comment: "LGTM aside from the comment in VirtualHunk.tsx. Numbers are great \u2014 600ms \u2192 38ms on the 18k-line PR.",
    actions: ['View review']
  }), /*#__PURE__*/React.createElement(ShadcnReviewerChipV2, {
    name: "marcus-w",
    state: "changes",
    age: "Reviewed 2h ago",
    role: "Platform reviewer",
    comment: "One blocker: this changes the public ResizeObserver contract on HunkWindow. The mobile target depends on the old shape.",
    actions: ['View thread', 'Dismiss']
  }), /*#__PURE__*/React.createElement(ShadcnReviewerAddChip, null)));
  const checks = /*#__PURE__*/React.createElement("div", {
    className: "-mx-1 flex cursor-default items-center gap-1.5 rounded-md px-1 transition-colors hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5 text-red-600"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-red-700"
  }, "2"), " failing"), /*#__PURE__*/React.createElement("span", {
    className: "mx-0.5 text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", null, "16 passed"));

  // Condensed check counts — icons + numbers only, full labels in tooltip.
  const checksCondensed = /*#__PURE__*/React.createElement("div", {
    className: "-mx-1 flex cursor-default items-center gap-1.5 rounded-md px-1 transition-colors hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5 text-red-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-red-700"
  }, "2"), /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "ml-0.5 size-3.5 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-600"
  }, "16"));

  // PR author — avatar + handle.
  const author = /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "nicolae-i",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "nicolae-i"));

  // Opened / synced timing — tucked behind an info icon + tooltip so the
  // strip stays compact but the detail is one hover away.
  const openedInfo = /*#__PURE__*/React.createElement(STooltip, {
    label: "Opened 1d 4h ago \xB7 synced 12s ago"
  }, /*#__PURE__*/React.createElement("button", {
    className: "inline-flex size-5 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "size-3.5"
  })));

  // Hover card breaking down the 18 checks — failing first, then passing.
  // Doubles as the de-facto checks surface now the Checks tab is gone.
  const failingChecks = [{
    name: 'e2e / playwright (chromium)',
    meta: 'Failed · 4m 12s'
  }, {
    name: 'bundle-size / diff-budget',
    meta: 'Failed · +18 KB over budget'
  }];
  const passingChecks = [{
    name: 'build / typecheck',
    meta: '1m 02s'
  }, {
    name: 'unit / vitest',
    meta: '48s'
  }, {
    name: 'lint / eslint',
    meta: '22s'
  }, {
    name: 'format / prettier',
    meta: '9s'
  }];
  const checksHoverContent = /*#__PURE__*/React.createElement("div", {
    className: "text-[12px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-900"
  }, "18 checks"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 font-medium text-red-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5"
  }), " 2 failing")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, failingChecks.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    className: "flex items-start gap-2 rounded-md border border-red-200 bg-red-50/60 px-2 py-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "mt-0.5 size-3.5 shrink-0 text-red-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "truncate font-medium text-zinc-900"
  }, c.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-red-700/80"
  }, c.meta)), /*#__PURE__*/React.createElement("button", {
    className: "shrink-0 text-[11px] font-medium text-zinc-500 hover:text-zinc-900"
  }, "Details")))), /*#__PURE__*/React.createElement("div", {
    className: "my-2 h-px bg-zinc-100"
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-0.5"
  }, passingChecks.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    className: "flex items-center gap-2 px-1 py-0.5 text-zinc-600"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 shrink-0 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "truncate"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto shrink-0 text-[11px] tabular-nums text-zinc-400"
  }, c.meta))), /*#__PURE__*/React.createElement("div", {
    className: "px-1 pt-1 text-[11px] text-zinc-400"
  }, "+12 more passed")), /*#__PURE__*/React.createElement("button", {
    className: "mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white py-1.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5"
  }), " View all checks"));
  const checksHover = (trigger, opts = {}) => /*#__PURE__*/React.createElement(SHoverCard, {
    width: 320,
    side: opts.side || 'bottom',
    align: opts.align || 'center',
    trigger: trigger
  }, checksHoverContent);
  const diffStats = /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+904"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212311"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "\xB7 7 files"));
  const labels = /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "tag",
    className: "size-3"
  }), " performance"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "tag",
    className: "size-3"
  }), " needs-design-review"));

  // ── Idea D · sticky collapsed bar — single line ─────────────────
  if (density === 'sticky') {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 border-b border-zinc-200 bg-white/95 px-5 py-2.5 backdrop-blur"
    }, /*#__PURE__*/React.createElement("a", {
      className: "inline-flex shrink-0 cursor-pointer items-center gap-0.5 text-[12.5px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "chevron-left",
      className: "size-3.5 -ml-0.5"
    }), /*#__PURE__*/React.createElement("span", null, backLabel)), /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 text-zinc-300"
    }, "/"), /*#__PURE__*/React.createElement("div", {
      className: "flex min-w-0 flex-1 items-baseline gap-2"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "truncate text-[14px] font-semibold tracking-tight text-zinc-950"
    }, "perf(diff-render): virtualise hunks larger than 2k lines"), /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 font-mono text-[12px] font-medium text-zinc-400"
    }, "#9217")), /*#__PURE__*/React.createElement(CopyBranch, {
      value: "perf/virtualise-hunks",
      className: "shrink-0"
    }), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "h-4"
    }), /*#__PURE__*/React.createElement(ShadcnStatusChipMenu, {
      mergeState: mergeState,
      open: statusMenuOpen
    }), checksHover(/*#__PURE__*/React.createElement("div", {
      className: "flex shrink-0 cursor-default items-center gap-1.5 text-[12px] text-zinc-600"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "x-circle",
      className: "size-3.5 text-red-600"
    }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
      className: "font-semibold text-red-700"
    }, "2")), /*#__PURE__*/React.createElement(LI, {
      name: "check-circle",
      className: "size-3.5 text-emerald-600"
    }), /*#__PURE__*/React.createElement("span", null, "16")), {
      align: 'end'
    }), actions);
  }

  // ── Idea C · single status strip — title row + one combined band ─
  if (density === 'single-strip') {
    return /*#__PURE__*/React.createElement("div", {
      className: "border-b border-zinc-200 px-5 pt-3 pb-2.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-2 flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, titleLine), actions), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px] text-zinc-600"
    }, /*#__PURE__*/React.createElement(ShadcnStatusChipMenu, {
      mergeState: mergeState,
      open: statusMenuOpen
    }), author, branchChips, /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "h-4"
    }), reviewers, /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "h-4"
    }), checksHover(checksCondensed), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "h-4"
    }), diffStats, openedInfo, labels));
  }

  // ── Ideas A / B / comfortable — 3-line layout ────────────────────
  return /*#__PURE__*/React.createElement("div", {
    className: `border-b border-zinc-200 px-5 ${tight ? 'pt-2 pb-2' : 'pt-3 pb-3'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex items-start gap-3 ${tight ? 'mb-1.5' : 'mb-2'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, titleLine, /*#__PURE__*/React.createElement("div", {
    className: `flex flex-wrap items-center gap-2 text-[12.5px] text-zinc-600 ${tight ? 'mt-1' : 'mt-1.5'}`
  }, /*#__PURE__*/React.createElement(ShadcnStatusChipMenu, {
    mergeState: mergeState,
    open: statusMenuOpen
  }), density === 'compact-meta' ? /*#__PURE__*/React.createElement(React.Fragment, null, branchChips, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "nicolae-i"), " \xB7 14 commits"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500",
    title: "Opened 1d 4h ago \xB7 synced 12s ago"
  }, "1d 4h ago")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "nicolae-i"), " wants to merge ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "14 commits"), " into"), /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "main"), /*#__PURE__*/React.createElement("span", null, "from"), /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "perf/virtualise-hunks"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "Opened 1d 4h ago \xB7 synced 12s ago")))), actions), /*#__PURE__*/React.createElement("div", {
    className: `flex flex-wrap items-center text-[12.5px] ${tight ? 'gap-3' : 'gap-4'}`
  }, reviewers, /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), checksHover(checks), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), diffStats, labels));
}

// Reviewer chip with shadcn HoverCard.
// Default layout: stacked (overlap via negative margin). On group-hover of
// the parent .group/reviewers, the row uncramps to a spaced layout so each
// avatar gets breathing room. The hovered chip lifts (scale + ring) and
// opens a HoverCard popover with name, role, status meta, last-comment
// preview, and contextual actions (Re-request / Remind / View thread).
function ShadcnReviewerChipV2({
  name,
  state,
  age,
  role,
  comment,
  actions = [],
  first = false
}) {
  const cfg = {
    approved: {
      dot: 'bg-emerald-500',
      label: 'Approved this PR',
      icon: 'check-circle',
      toneBox: 'border-emerald-200 bg-emerald-50/60 text-emerald-700',
      ring: 'group-hover/chip:ring-emerald-500/40'
    },
    changes: {
      dot: 'bg-red-500',
      label: 'Requested changes',
      icon: 'x-circle',
      toneBox: 'border-red-200 bg-red-50/60 text-red-700',
      ring: 'group-hover/chip:ring-red-500/40'
    },
    pending: {
      dot: 'bg-amber-500',
      label: 'Awaiting review',
      icon: 'circle-dot',
      toneBox: 'border-amber-200 bg-amber-50/60 text-amber-700',
      ring: 'group-hover/chip:ring-amber-500/40'
    }
  }[state];
  const trigger = /*#__PURE__*/React.createElement("button", {
    className: `group/chip relative block rounded-full ring-2 ring-white transition-all duration-200 ease-out group-hover/chip:z-30 group-hover/chip:scale-110 group-hover/chip:ring-4 ${cfg.ring}`
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: name,
    size: "size-6"
  }), /*#__PURE__*/React.createElement("span", {
    className: `absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ${cfg.dot} ring-2 ring-white`
  }));
  return /*#__PURE__*/React.createElement(SHoverCard, {
    width: 288,
    triggerClassName: `${first ? '' : '-ml-1.5'} transition-[margin] duration-200 ease-out group-hover/reviewers:ml-1`,
    trigger: trigger
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: name,
    size: "size-9"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "truncate text-[13.5px] font-semibold text-zinc-900"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "truncate text-[11.5px] text-zinc-500"
  }, "@", name, " \xB7 ", role))), /*#__PURE__*/React.createElement("div", {
    className: `mt-3 flex items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] ${cfg.toneBox}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: "size-3.5 shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, cfg.label), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] opacity-80"
  }, age)), comment && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 rounded-md bg-zinc-50 px-2.5 py-2 text-[12px] leading-relaxed text-zinc-600 line-clamp-3"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "quote",
    className: "mb-1 inline size-3 text-zinc-400"
  }), " ", comment), actions.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex items-center gap-1.5"
  }, actions.map((label, i) => /*#__PURE__*/React.createElement(SButton, {
    key: label,
    variant: i === actions.length - 1 ? 'default' : 'outline',
    size: "sm",
    className: "flex-1"
  }, label))));
}

// Add-reviewer chip — discrete dashed circle at the end of the row.
function ShadcnReviewerAddChip() {
  return /*#__PURE__*/React.createElement("button", {
    title: "Add a reviewer",
    className: "ml-1 inline-flex size-6 items-center justify-center rounded-full border border-dashed border-zinc-300 bg-white text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "plus",
    className: "size-3"
  }));
}

// ═══ Screen — PR detail (Conversation) ═══════════════════════
// Shared conversation-node metadata. Drives both the timeline anchors
// (ids + unread accents in ShadcnConvMain) and the minimap ticks/peek
// cards (ConvMinimap). Order matches the rendered timeline; `desc` is
// the PR description rendered above the loop.
const CONV_NODES = [{
  id: 'desc',
  type: 'description',
  author: 'nicolae-i',
  age: '2d ago',
  title: 'PR description',
  snippet: 'Virtualises the diff hunk renderer so 10k-line files paint without jank.'
}, {
  id: 'push1',
  type: 'event',
  author: 'nicolae-i',
  age: '1d ago',
  title: 'Pushed 3 commits'
}, {
  id: 'inline1',
  type: 'inline',
  author: 'alex-cho',
  age: '1d ago',
  title: 'Inline thread · VirtualHunk.tsx:32',
  replies: 3,
  unread: true,
  snippet: 'Eviction policy question on the line-window cache.'
}, {
  id: 'review-priya',
  type: 'review',
  state: 'approved',
  author: 'priya-r',
  age: '22h ago',
  title: 'Review · approved',
  replies: 2,
  snippet: 'Nice — keying the width cache per font family is exactly right.'
}, {
  id: 'label1',
  type: 'event',
  author: 'priya-r',
  age: '22h ago',
  title: 'Added label “performance”'
}, {
  id: 'review-marcus',
  type: 'review',
  state: 'changes',
  author: 'marcus-w',
  age: '1h ago',
  title: 'Review · requested changes',
  replies: 2,
  unread: true,
  needsResponse: true,
  snippet: 'This breaks the mobile app’s pinned @pier/diff shape — let’s ship an adapter.'
}, {
  id: 'ci1',
  type: 'event',
  state: 'failing',
  author: 'github-actions',
  age: '1h ago',
  title: 'ci/perf-suite · 2 failing',
  unread: true
}, {
  id: 'draft',
  type: 'pending',
  author: 'alex-cho',
  isYou: true,
  age: 'just now',
  title: 'Your pending review (draft)'
}];
function ShadcnPRDetailConversationScreen({
  width = 1320,
  height = 820,
  from = 'inbox',
  view = {}
}) {
  const backLabel = from === 'pulls' ? 'Pull requests' : 'Inbox';
  // Conversation tab focus = "Focus: Comments" — collapse timeline events,
  // keep the discussion. (Files tab focus is the inverse: "Focus: Code".)
  const [focusComments, setFocusComments] = React.useState(!!(view.focusComments ?? view.hideComments));
  const minimap = !!view.minimap;
  const scrollRef = React.useRef(null);
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: from === 'pulls' ? 'pulls' : 'inbox'
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Live polling \xB7 8s"))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: backLabel,
    focusMode: "comments",
    focusActive: focusComments,
    onToggleFocus: () => setFocusComments(h => !h),
    mergeState: view.mergeState,
    statusMenuOpen: view.statusMenuOpen,
    density: view.headerDensity
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "conv",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(ShadcnConvMain, {
    focusComments: focusComments,
    onShowAll: () => setFocusComments(false),
    mergeState: view.mergeState,
    mergeMenuOpen: view.mergeMenuOpen,
    markNodes: minimap,
    scrollRef: scrollRef
  }), /*#__PURE__*/React.createElement(ShadcnConvRail, {
    minimap: minimap,
    scrollRef: scrollRef
  })));
}
function ShadcnConvMain({
  focusComments = false,
  onShowAll = () => {},
  mergeState = 'blocked',
  mergeMenuOpen = false,
  markNodes = false,
  scrollRef = null
}) {
  // Reply samples — used in the timeline to demo nested conversations.
  const priyaReplies = [{
    author: 'nicolae-i',
    age: '21h ago',
    role: 'author',
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Good shout \u2014 pushed ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
    }, "measureHunk.spec.ts"), " with a regression case in ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-[11.5px] text-zinc-600"
    }, "f02ab1c"), ". Asserts the cache is hit once per (font, viewport) tuple."),
    reactions: {
      '🎉': {
        count: 2,
        me: true,
        who: 'You, priya-r'
      },
      '👍': {
        count: 1,
        me: false,
        who: 'priya-r'
      }
    }
  }, {
    author: 'priya-r',
    age: '20h ago',
    role: 'collaborator',
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Beautiful, that's exactly what I had in mind. Approving once CI goes green."),
    reactions: {
      '❤️': {
        count: 1,
        me: true,
        who: 'You'
      }
    }
  }];
  const marcusReplies = [{
    author: 'alex-cho',
    age: '1h ago',
    role: 'reviewer',
    isYou: true,
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "I checked \u2014 the mobile app pins ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
    }, "@pier/diff@0.18"), " so it'll keep working until they bump. But I agree, let's ship an adapter rather than do a breaking change. ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Want to pair on this ", /*#__PURE__*/React.createElement("b", null, "Wed 2pm"), "? I have a hunk-aligned ResizeObserver shim I tried last sprint that might fit."),
    reactions: {
      '👀': {
        count: 1,
        me: false,
        who: 'marcus-w'
      }
    }
  }, {
    author: 'marcus-w',
    age: '45m ago',
    role: 'member',
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Wed 2pm works. I'll bring the failing mobile snapshot test. \uD83D\uDE4F"),
    reactions: {}
  }];

  // The conversation timeline as tagged items. When "Focus: Comments" is on,
  // runs of consecutive `event` items collapse into a single thin divider so
  // the discussion (comments + inline threads) reads uninterrupted.
  const timeline = [{
    kind: 'event',
    count: 3,
    id: 'push1',
    node: /*#__PURE__*/React.createElement(TimelineItem, {
      actor: "nicolae-i",
      verb: "pushed 3 commits",
      age: "1d ago",
      body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "font-mono text-[12px] text-zinc-600 space-y-1"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "text-zinc-400"
      }, "3a1c7f2"), " perf(diff): introduce VirtualHunk with line-window virtualisation"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "text-zinc-400"
      }, "b9e4cd8"), " measureHunk: cache line widths per font family"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "text-zinc-400"
      }, "21fce04"), " wire VirtualHunk into NaiveHunk above 2k lines")))
    })
  }, {
    kind: 'comment',
    id: 'inline1',
    node: /*#__PURE__*/React.createElement(GhConvInlineRef, {
      file: "src/diff/VirtualHunk.tsx",
      line: 32
    })
  }, {
    kind: 'comment',
    id: 'review-priya',
    node: /*#__PURE__*/React.createElement(GhComment, _extends({}, GH_SAMPLES.priyaReview, {
      replies: priyaReplies
    }))
  }, {
    kind: 'event',
    count: 1,
    id: 'label1',
    node: /*#__PURE__*/React.createElement(TimelineEvent, {
      body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
        className: "font-semibold"
      }, "priya-r"), " added the ", /*#__PURE__*/React.createElement(SBadge, {
        variant: "warn"
      }, "performance"), " label")
    })
  }, {
    kind: 'comment',
    id: 'review-marcus',
    node: /*#__PURE__*/React.createElement(GhComment, _extends({}, GH_SAMPLES.marcusReview, {
      replies: marcusReplies,
      showReplyComposer: true,
      replyComposerText: "Pushed an adapter in `09cd1f2` \u2014 falls back to the old shape via a deprecation warning. Let me know if "
    }))
  }, {
    kind: 'event',
    count: 1,
    id: 'ci1',
    node: /*#__PURE__*/React.createElement(TimelineEvent, {
      body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", {
        className: "font-semibold"
      }, "github-actions"), " bot triggered ", /*#__PURE__*/React.createElement("code", {
        className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
      }, "ci/perf-suite"), " \xB7 ", /*#__PURE__*/React.createElement("span", {
        className: "text-red-600"
      }, "2 failing"))
    })
  }, {
    kind: 'comment',
    id: 'draft',
    node: /*#__PURE__*/React.createElement(GhComment, {
      author: "alex-cho",
      age: "just now",
      isYou: true,
      role: "reviewer",
      pending: true,
      highlight: "pending",
      editing: true,
      editText: `Picking this up now — I'll group the inline notes by hunk before submitting the review.\n\nA few questions for @nicolae-i before I sign off:\n\n1. **VirtualHunk eviction policy** — what happens when we scroll back to a hunk after it's been GC'd?\n2. \`measureHunk\` cache invalidation — is keying by font *family* enough, or do we need weight too?\n3. /attach the perf trace from the M2 Air run\n\n\`\`\`tsx\n// example: I'd like to see this guard added\nif (lines.length > THRESHOLD && !window.measureSync) {\n  warn('VirtualHunk: no measureSync polyfill — falling back');\n}\n\`\`\`\n`,
      reactions: {},
      preview: "Picking this up now \u2014 grouping inline notes by hunk before submitting\u2026"
    })
  }];

  // Collapse consecutive event runs when focused on comments.
  const unreadMap = {};
  CONV_NODES.forEach(n => {
    unreadMap[n.id] = !!n.unread;
  });
  const rendered = [];
  let i = 0;
  while (i < timeline.length) {
    const it = timeline[i];
    if (focusComments && it.kind === 'event') {
      let n = 0;
      while (i < timeline.length && timeline[i].kind === 'event') {
        n += timeline[i].count || 1;
        i++;
      }
      rendered.push(/*#__PURE__*/React.createElement(GhEventsCollapsed, {
        key: `c${i}`,
        count: n,
        onShow: onShowAll
      }));
    } else {
      const unread = markNodes && unreadMap[it.id];
      rendered.push(/*#__PURE__*/React.createElement("div", {
        key: `i${i}`,
        id: it.id ? `cn-${it.id}` : undefined,
        "data-conv-node": it.id || undefined,
        className: `conv-node scroll-mt-4 ${unread ? 'relative rounded-lg ring-1 ring-sky-200 bg-sky-50/30 -mx-2 px-2 py-1' : ''}`
      }, unread && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "absolute -left-px top-2 bottom-2 w-[3px] rounded-full bg-sky-500"
      }), /*#__PURE__*/React.createElement("span", {
        className: "absolute right-2 top-2 z-[1] inline-flex items-center gap-1 rounded-full bg-sky-600 px-1.5 py-[1px] text-[9.5px] font-semibold uppercase tracking-wide text-white shadow-sm"
      }, "new")), it.node));
      i++;
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    className: "flex-1 overflow-auto bg-zinc-50/40 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto w-full max-w-[920px]"
  }, focusComments && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2 text-[12.5px] text-amber-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-4 text-amber-700"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "Focusing on comments"), " \u2014 pushes, labels & CI events are collapsed."), /*#__PURE__*/React.createElement("button", {
    onClick: onShowAll,
    className: "ml-auto inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white/70 px-2 py-1 text-[11.5px] font-medium text-amber-900 hover:bg-white"
  }, "Show all activity")), /*#__PURE__*/React.createElement("div", {
    id: "cn-desc",
    "data-conv-node": "desc",
    className: "conv-node scroll-mt-4 mb-5"
  }, /*#__PURE__*/React.createElement(GhComment, GH_SAMPLES.opening)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-[13px]"
  }, rendered), /*#__PURE__*/React.createElement("div", {
    className: "mt-5"
  }, /*#__PURE__*/React.createElement(GhComposer, {
    placeholder: "Leave a comment, request a change, or @mention someone\u2026",
    submit: "Comment",
    pinHint: "Drag-and-drop, paste, or click to attach images & files"
  })), /*#__PURE__*/React.createElement(ShadcnMergeBox, {
    state: mergeState,
    methodMenuOpen: mergeMenuOpen
  }))));
}

// Thin divider standing in for a run of collapsed timeline events when the
// Conversation tab is in "Focus: Comments" mode. Click to show all activity.
function GhEventsCollapsed({
  count,
  onShow
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onShow,
    className: "group flex w-full items-center gap-3 py-0.5 text-[11.5px] text-zinc-400 transition-colors hover:text-zinc-600"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-px flex-1 bg-zinc-200 group-hover:bg-zinc-300"
  }), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3.5"
  }), count, " timeline ", count === 1 ? 'event' : 'events', " hidden"), /*#__PURE__*/React.createElement("span", {
    className: "h-px flex-1 bg-zinc-200 group-hover:bg-zinc-300"
  }));
}

// ═══ PR merge box ════════════════════════════════════════════════
// The lifecycle home: review/check/conflict status + the merge action
// (split button with method dropdown) + close. Two states:
//   'blocked' — required reviews/checks unmet → merge guarded
//   'ready'   — everything green → green merge button enabled
function ShadcnMergeStatusRow({
  ok,
  warn,
  children
}) {
  const icon = ok ? 'check-circle' : warn ? 'alert-triangle' : 'x-circle';
  const tone = ok ? 'text-emerald-600' : warn ? 'text-amber-600' : 'text-red-600';
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 px-4 py-2 text-[12.5px] text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: `size-4 shrink-0 ${tone}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0"
  }, children));
}
function ShadcnMergeBox({
  state = 'blocked',
  methodMenuOpen = false,
  method = 'squash'
}) {
  const ready = state === 'ready';
  const methods = [{
    id: 'merge',
    label: 'Create a merge commit',
    icon: 'git-merge',
    hint: 'All commits from this branch added to the base.'
  }, {
    id: 'squash',
    label: 'Squash and merge',
    icon: 'git-compare',
    hint: 'The 14 commits combined into one.'
  }, {
    id: 'rebase',
    label: 'Rebase and merge',
    icon: 'git-branch',
    hint: 'The 14 commits rebased onto the base.'
  }];
  const current = methods.find(m => m.id === method) || methods[1];
  return /*#__PURE__*/React.createElement(SCard, {
    className: "mt-5 overflow-visible"
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-3 border-b px-4 py-3 ${ready ? 'border-emerald-100 bg-emerald-50/50' : 'border-amber-100 bg-amber-50/50'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `inline-flex size-8 shrink-0 items-center justify-center rounded-full ${ready ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: ready ? 'git-merge' : 'alert-triangle',
    className: "size-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: `text-[14px] font-semibold ${ready ? 'text-emerald-900' : 'text-amber-900'}`
  }, ready ? 'Ready to merge' : 'Merging is blocked'), /*#__PURE__*/React.createElement("div", {
    className: `text-[12px] ${ready ? 'text-emerald-700/80' : 'text-amber-700/80'}`
  }, ready ? 'All checks have passed and this branch has no conflicts with the base.' : 'Required reviews and checks must pass before this pull request can be merged.'))), /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-zinc-100"
  }, ready ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, {
    ok: true
  }, "2 approving reviews \xB7 no changes requested"), /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, {
    ok: true
  }, "All 18 checks have passed"), /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, {
    ok: true
  }, "This branch is up to date with ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "main"), " \xB7 no conflicts")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, null, "Changes requested by ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "marcus-w"), " \u2014 must be resolved"), /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "2 of 18 checks failing"), " \u2014 ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "ci/perf-suite")), /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, {
    ok: true
  }, "Approved by ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "priya-r")), /*#__PURE__*/React.createElement(ShadcnMergeStatusRow, {
    warn: true
  }, "Out of date with ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "main"), " by 3 commits"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/50 px-4 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: !ready,
    className: `inline-flex h-9 items-center gap-2 rounded-l-md px-4 text-[13px] font-semibold shadow-sm transition-colors ${ready ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'cursor-not-allowed border border-zinc-200 bg-zinc-100 text-zinc-400'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: current.icon,
    className: "size-4"
  }), current.label), /*#__PURE__*/React.createElement(SDropdownMenu, {
    open: methodMenuOpen,
    align: "start",
    width: 300,
    trigger: /*#__PURE__*/React.createElement("button", {
      disabled: !ready,
      className: `inline-flex h-9 items-center justify-center rounded-r-md border-l px-2 shadow-sm transition-colors ${ready ? 'border-emerald-700/40 bg-emerald-600 text-white hover:bg-emerald-700' : 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400'}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: "chevron-down",
      className: "size-4"
    }))
  }, /*#__PURE__*/React.createElement(SDropdownLabel, null, "Merge method"), methods.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    className: `flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-zinc-100 ${m.id === method ? 'bg-zinc-50' : ''}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: m.id === method ? 'check' : m.icon,
    className: `mt-0.5 size-3.5 shrink-0 ${m.id === method ? 'text-emerald-600' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block text-[12.5px] font-medium text-zinc-800"
  }, m.label), /*#__PURE__*/React.createElement("span", {
    className: "block text-[11px] text-zinc-500"
  }, m.hint)))))), !ready && /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "Resolve required reviews & checks to enable merge."), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, !ready && /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    icon: "git-branch"
  }, "Update branch"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "x-circle",
    className: "text-red-600 hover:bg-red-50"
  }, "Close pull request"))));
}

// A compact representation of an inline review thread anchored to a diff
// line, surfaced in the Conversation timeline so it's not lost behind tabs.
// Like GitHub, it shows the slice of the diff the thread is anchored to —
// a few lines of context with the commented line(s) highlighted — above the
// comment thread itself, so reviewers don't have to jump to the Files tab.
const CONV_INLINE_HUNK = [{
  l: '30',
  r: '30',
  k: 'ctx',
  code: 'export function VirtualHunk(props: HunkProps) {'
}, {
  l: '31',
  r: '31',
  k: 'ctx',
  code: '  const { hunk, fontFamily, viewport } = props;'
}, {
  l: '32',
  r: null,
  k: 'del',
  code: '  const [window, setWindow] = useState(() => measureHunk(lines));',
  anchor: true
}, {
  l: null,
  r: '32',
  k: 'add',
  code: '  const window = useMemo(() => measureHunk(lines, fontFamily, viewport),'
}, {
  l: null,
  r: '33',
  k: 'add',
  code: '    [lines, fontFamily, viewport]);'
}, {
  l: '33',
  r: '34',
  k: 'ctx',
  code: '  const totalH = hunk.lines.length * lineHeight;'
}];

// GitHub-style "expand context" row — the unfold affordance shown above and
// below a diff slice so reviewers can reveal the surrounding code in-place.
function GhConvHunkExpander({
  dir = 'both'
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "group flex w-full items-stretch text-left hover:bg-blue-50/70"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex shrink-0 w-[92px] items-center justify-center bg-blue-50/60 text-blue-500 border-r border-zinc-200/60 group-hover:bg-blue-100/70"
  }, dir === 'up' && /*#__PURE__*/React.createElement(LI, {
    name: "chevron-up",
    className: "size-3.5"
  }), dir === 'down' && /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3.5"
  }), dir === 'both' && /*#__PURE__*/React.createElement("span", {
    className: "flex flex-col -space-y-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-up",
    className: "size-3"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 px-3 py-0.5 text-[10.5px] text-blue-500/80 group-hover:text-blue-600 font-sans"
  }, "Expand ", dir === 'up' ? 'lines above' : dir === 'down' ? 'lines below' : 'context'));
}
function GhConvHunkLine({
  ln,
  anchorLine
}) {
  const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
  const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
  const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
  const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
  return /*#__PURE__*/React.createElement("div", {
    className: `flex ${bg} ${ln.anchor ? 'ring-1 ring-inset ring-amber-300/70' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `shrink-0 w-9 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
  }, ln.l ?? ''), /*#__PURE__*/React.createElement("span", {
    className: `shrink-0 w-9 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
  }, ln.r ?? ''), /*#__PURE__*/React.createElement("span", {
    className: `shrink-0 w-5 text-center ${markerColor}`
  }, marker), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 pr-3 text-zinc-900 whitespace-pre overflow-x-auto"
  }, ln.code));
}
function GhConvInlineRef({
  file,
  line,
  hunk = CONV_INLINE_HUNK,
  resolved = false,
  resolvedBy = 'priya-r'
}) {
  const replies = [{
    author: 'nicolae-i',
    age: '21h ago',
    role: 'author',
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Good catch \u2014 the setter was dead weight. Switched to ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
    }, "useMemo"), " keyed on the font tuple in ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-[11.5px] text-zinc-600"
    }, "f02ab1c"), "."),
    reactions: {
      '🎉': {
        count: 2,
        me: true,
        who: 'You, priya-r'
      }
    }
  }, {
    author: 'priya-r',
    age: '20h ago',
    role: 'collaborator',
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Confirmed the alloc churn is gone in the profiler. Resolving."),
    reactions: {}
  }];
  return /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-3 py-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-700"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-800"
  }, "alex-cho"), " started a thread"), resolved ? /*#__PURE__*/React.createElement(SBadge, {
    variant: "success",
    className: "ml-auto gap-1 text-[9.5px]"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-2.5"
  }), "Resolved") : /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11.5px] text-zinc-400"
  }, replies.length, " replies \xB7 open")), /*#__PURE__*/React.createElement("div", {
    className: "p-2.5"
  }, /*#__PURE__*/React.createElement(GhComment, {
    author: "alex-cho",
    age: "2h ago",
    isYou: true,
    role: "reviewer",
    diffSlice: /*#__PURE__*/React.createElement("div", {
      className: "font-mono text-[11.5px] leading-[18px]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 bg-zinc-50/80 px-3 py-1 text-[10.5px] text-zinc-400"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "code",
      className: "size-3"
    }), /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10.5px] text-zinc-600"
    }, file), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-[10.5px] text-zinc-500"
    }, "L", line), /*#__PURE__*/React.createElement("button", {
      title: "Copy file path",
      className: "inline-flex size-4 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
    }, /*#__PURE__*/React.createElement(LI2, {
      name: "copy",
      className: "size-2.5"
    })), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto font-mono text-[10.5px] text-zinc-400"
    }, "@@ -30,4 +30,5 @@ VirtualHunk(props)")), /*#__PURE__*/React.createElement(GhConvHunkExpander, {
      dir: "up"
    }), hunk.map((ln, i) => /*#__PURE__*/React.createElement(GhConvHunkLine, {
      key: i,
      ln: ln,
      anchorLine: line
    })), /*#__PURE__*/React.createElement(GhConvHunkExpander, {
      dir: "down"
    })),
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Why ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
    }, "useState(() => measureHunk(...))"), " instead of ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
    }, "useMemo"), "? We never call ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
    }, "setWindow"), " in the threshold branch \u2014 this allocates a setter we throw away."),
    reactions: {
      '👍': {
        count: 3,
        me: false,
        who: 'priya-r, marcus-w, +1'
      }
    },
    replies: replies
  })), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 border-t px-3 py-2 ${resolved ? 'border-emerald-200/70 bg-emerald-50/50' : 'border-zinc-100 bg-zinc-50/50'}`
  }, resolved ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "check",
    className: "size-3"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[12px] text-zinc-600"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, resolvedBy), " marked this conversation as resolved."), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    icon: "reply",
    className: "ml-auto"
  }, "Unresolve conversation")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LI2, {
    name: "check",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12px] text-zinc-500"
  }, "Looks settled? Mark the thread resolved to collapse it."), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "check",
    className: "ml-auto"
  }, "Resolve conversation"))));
}
function TimelineItem({
  actor,
  verb,
  age,
  body
}) {
  return /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 px-4 py-2"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: actor,
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px]"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, actor), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, verb, " \xB7 ", age))), /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2.5"
  }, body));
}
function TimelineReviewCard({
  who,
  state,
  age,
  body
}) {
  const cfg = state === 'approved' ? {
    variant: 'success',
    label: 'Approved',
    icon: 'check-circle'
  } : state === 'changes' ? {
    variant: 'destructive',
    label: 'Requested changes',
    icon: 'x-circle'
  } : {
    variant: 'secondary',
    label: 'Commented',
    icon: 'message-square'
  };
  return /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 px-4 py-2"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: who,
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px]"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, who), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "reviewed \xB7 ", age)), /*#__PURE__*/React.createElement(SBadge, {
    variant: cfg.variant,
    className: "ml-auto gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: "size-3"
  }), cfg.label)), /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2.5 text-[13px] text-zinc-700 leading-relaxed"
  }, body));
}
function TimelineEvent({
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 pl-4 text-[12.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "size-1.5 rounded-full bg-zinc-300"
  }), /*#__PURE__*/React.createElement("span", null, body));
}
function ShadcnConvRail({
  minimap = false,
  scrollRef = null
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-64 shrink-0 border-l border-zinc-200 bg-white p-4 space-y-4 text-[12.5px]"
  }, minimap && /*#__PURE__*/React.createElement(ConvMinimap, {
    nodes: CONV_NODES,
    scrollRef: scrollRef
  }), /*#__PURE__*/React.createElement(RailSection, {
    title: "Assignees"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "nicolae-i",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", null, "nicolae-i"))), /*#__PURE__*/React.createElement(RailSection, {
    title: "Reviewers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", null, "alex-cho"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn",
    className: "ml-auto text-[10px]"
  }, "pending")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "priya-r",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", null, "priya-r"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "success",
    className: "ml-auto text-[10px]"
  }, "approved")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "marcus-w",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", null, "marcus-w"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive",
    className: "ml-auto text-[10px]"
  }, "changes"))), /*#__PURE__*/React.createElement(RailSection, {
    title: "Labels"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn"
  }, "performance"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline"
  }, "needs-design-review"))), /*#__PURE__*/React.createElement(RailSection, {
    title: "Milestone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-zinc-700"
  }, "v1.4 \u2014 diff perf pass"), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 h-1 rounded-full bg-zinc-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-zinc-900",
    style: {
      width: '64%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-zinc-500 mt-1"
  }, "9 of 14 done")));
}
function RailSection({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, children));
}

// ═══ Screen — Settings ═══════════════════════════════════════
function ShadcnSettingsScreen({
  width = 1320,
  height = 820,
  section = 'account',
  initialDiffFontSize = 12,
  initialDiffLineHeight = 18,
  orgView = {}
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Settings",
    subtitle: "Preferences are stored on this device",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "settings"
    }),
    status: section === 'organizations' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Live from GitHub \xB7 your token"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto font-mono"
    }, "GET /user/installations")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Saved locally \xB7 no sync"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "~/Library/Application Support/Pyor/preferences.json"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "w-56 shrink-0 border-r border-zinc-200 bg-white p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Preferences"), /*#__PURE__*/React.createElement("nav", {
    className: "flex flex-col gap-0.5"
  }, [{
    id: 'general',
    label: 'General',
    icon: 'sliders'
  }, {
    id: 'account',
    label: 'Account',
    icon: 'user'
  }, {
    id: 'organizations',
    label: 'Organizations',
    icon: 'building-2'
  }, {
    id: 'api',
    label: 'GitHub API usage',
    icon: 'database'
  }, {
    id: 'diff',
    label: 'Diff preferences',
    icon: 'columns'
  }, {
    id: 'appearance',
    label: 'Appearance',
    icon: 'palette'
  }, {
    id: 'shortcuts',
    label: 'Shortcuts',
    icon: 'monitor'
  }].map(it => {
    const active = it.id === section;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      className: `flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-medium ${active ? 'bg-zinc-200/70 text-zinc-950' : 'text-zinc-700 hover:bg-zinc-100'}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: it.icon,
      className: `size-4 ${active ? '' : 'text-zinc-500'}`
    }), it.label);
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-zinc-50/40 p-8"
  }, section === 'diff' ? /*#__PURE__*/React.createElement(SettingsDiffSection, {
    initialFontSize: initialDiffFontSize,
    initialLineHeight: initialDiffLineHeight
  }) : section === 'organizations' ? /*#__PURE__*/React.createElement(SettingsOrganizationsSection, {
    view: orgView
  }) : /*#__PURE__*/React.createElement(SettingsAccountSection, null))));
}
function SettingsAccountSection() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mx-auto max-w-2xl space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-semibold tracking-tight"
  }, "Account"), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-[13px] text-zinc-500"
  }, "Your GitHub identity and personal access token.")), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 p-4"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-10"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[14px] font-semibold"
  }, "Alex Cho"), /*#__PURE__*/React.createElement("div", {
    className: "text-[12.5px] text-zinc-500"
  }, "@alex-cho \xB7 alex@northwind.com")), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    icon: "external-link"
  }, "View on GitHub"))), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SCardHeader, null, /*#__PURE__*/React.createElement(SCardTitle, null, "Personal access token"), /*#__PURE__*/React.createElement(SCardDescription, null, "Stored in your macOS Keychain. Pyor never sees it as plaintext after this screen.")), /*#__PURE__*/React.createElement(SCardContent, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "key-round",
    value: "ghp_3xK\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022BqR",
    className: "h-9",
    readOnly: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", null, "Valid \xB7 scopes ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "repo"), ", ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "notifications")), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto"
  }, "Last rotated 2025-11-04")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm"
  }, "Rotate token"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "log-out"
  }, "Sign out")))), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SCardHeader, null, /*#__PURE__*/React.createElement(SCardTitle, null, "GitHub API usage"), /*#__PURE__*/React.createElement(SCardDescription, null, "Live rate-limit bars from ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "/rate_limit"), ".")), /*#__PURE__*/React.createElement(SCardContent, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(RateRow, {
    label: "Core",
    used: 17,
    limit: 5000
  }), /*#__PURE__*/React.createElement(RateRow, {
    label: "GraphQL",
    used: 148,
    limit: 5000
  }), /*#__PURE__*/React.createElement(RateRow, {
    label: "Search",
    used: 3,
    limit: 30
  }))));
}

// ─── Settings · Diff preferences ───────────────────────────────
// Sample lines used in the live preview. Mirrors the real diff so the user
// can judge density at a glance — additions, deletions, ctx, and a long line
// so they can see how wrapping behaves at smaller sizes.
const DIFF_PREVIEW_LINES = [{
  l: '142',
  r: '142',
  k: 'ctx',
  code: '  const hunks = useMemo(() => splitHunks(diff), [diff]);'
}, {
  l: '143',
  r: null,
  k: 'del',
  code: '  const heights = hunks.map(h => measureHunk(h, lineHeight));'
}, {
  l: null,
  r: '143',
  k: 'add',
  code: '  const heights = useMemo('
}, {
  l: null,
  r: '144',
  k: 'add',
  code: '    () => hunks.map(h => measureHunk(h, lineHeight)),'
}, {
  l: null,
  r: '145',
  k: 'add',
  code: '    [hunks, lineHeight],'
}, {
  l: null,
  r: '146',
  k: 'add',
  code: '  );'
}, {
  l: '144',
  r: '147',
  k: 'ctx',
  code: '  const window = useWindow(heights, scrollTop, viewport);'
}, {
  l: '145',
  r: '148',
  k: 'ctx',
  code: '  return <HunkList hunks={hunks} window={window}/>;'
}];
function SettingsDiffSection({
  initialFontSize = 12,
  initialLineHeight = 18
}) {
  const [fontSize, setFontSize] = React.useState(initialFontSize);
  const [lineHeight, setLineHeight] = React.useState(initialLineHeight);
  // Sensible bounds: 10–18px (below 10 is unreadable, above 18 the diff loses
  // its information-dense feel). Line height is independent so users can pack
  // it tight or breathe it out — anywhere from 1.0× to ~1.8× the font size.
  const FS_MIN = 10,
    FS_MAX = 18;
  const LH_MIN = 12,
    LH_MAX = 32;
  const presets = [{
    id: 'compact',
    label: 'Compact',
    fs: 11,
    lh: 15
  }, {
    id: 'default',
    label: 'Default',
    fs: 12,
    lh: 18
  }, {
    id: 'comfortable',
    label: 'Comfortable',
    fs: 13,
    lh: 22
  }, {
    id: 'large',
    label: 'Large',
    fs: 15,
    lh: 26
  }];
  const matchedPreset = presets.find(p => p.fs === fontSize && p.lh === lineHeight)?.id;
  return /*#__PURE__*/React.createElement("div", {
    className: "mx-auto max-w-2xl space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-semibold tracking-tight"
  }, "Diff preferences"), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-[13px] text-zinc-500"
  }, "Tune how dense the diff feels. Applies to the Files changed tab and the Pre-PR review pane.")), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SCardHeader, null, /*#__PURE__*/React.createElement(SCardTitle, null, "Font size & line height"), /*#__PURE__*/React.createElement(SCardDescription, null, "Affects monospace code rendering in the diff pane only. Comment threads and the rest of the UI are unchanged.")), /*#__PURE__*/React.createElement(SCardContent, {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-1.5 flex items-baseline"
  }, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-0"
  }, "Font size"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto font-mono text-[11.5px] tabular-nums text-zinc-500"
  }, fontSize, "px")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10px] text-zinc-400 select-none"
  }, "A"), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: FS_MIN,
    max: FS_MAX,
    step: 1,
    value: fontSize,
    onChange: e => setFontSize(Number(e.target.value)),
    className: "flex-1 accent-zinc-900"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[14px] text-zinc-400 select-none"
  }, "A"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center rounded-md border border-zinc-200 bg-white"
  }, /*#__PURE__*/React.createElement("button", {
    className: "flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40",
    disabled: fontSize <= FS_MIN,
    onClick: () => setFontSize(v => Math.max(FS_MIN, v - 1))
  }, /*#__PURE__*/React.createElement(LI, {
    name: "minus",
    className: "size-3.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "w-9 border-x border-zinc-200 py-1 text-center font-mono text-[11.5px] tabular-nums"
  }, fontSize), /*#__PURE__*/React.createElement("button", {
    className: "flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40",
    disabled: fontSize >= FS_MAX,
    onClick: () => setFontSize(v => Math.min(FS_MAX, v + 1))
  }, /*#__PURE__*/React.createElement(LI, {
    name: "plus",
    className: "size-3.5"
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-1.5 flex items-baseline"
  }, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-0"
  }, "Line height"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto font-mono text-[11.5px] tabular-nums text-zinc-500"
  }, lineHeight, "px \xB7 ", (lineHeight / fontSize).toFixed(2), "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "rows",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: LH_MIN,
    max: LH_MAX,
    step: 1,
    value: lineHeight,
    onChange: e => setLineHeight(Number(e.target.value)),
    className: "flex-1 accent-zinc-900"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "rows",
    className: "size-4 text-zinc-400"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center rounded-md border border-zinc-200 bg-white"
  }, /*#__PURE__*/React.createElement("button", {
    className: "flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40",
    disabled: lineHeight <= LH_MIN,
    onClick: () => setLineHeight(v => Math.max(LH_MIN, v - 1))
  }, /*#__PURE__*/React.createElement(LI, {
    name: "minus",
    className: "size-3.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "w-9 border-x border-zinc-200 py-1 text-center font-mono text-[11.5px] tabular-nums"
  }, lineHeight), /*#__PURE__*/React.createElement("button", {
    className: "flex size-7 items-center justify-center text-zinc-500 hover:text-zinc-900 disabled:opacity-40",
    disabled: lineHeight >= LH_MAX,
    onClick: () => setLineHeight(v => Math.min(LH_MAX, v + 1))
  }, /*#__PURE__*/React.createElement(LI, {
    name: "plus",
    className: "size-3.5"
  }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1.5"
  }, "Presets"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5"
  }, presets.map(p => {
    const active = matchedPreset === p.id;
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => {
        setFontSize(p.fs);
        setLineHeight(p.lh);
      },
      className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] ${active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium"
    }, p.label), /*#__PURE__*/React.createElement("span", {
      className: `font-mono text-[10.5px] tabular-nums ${active ? 'text-zinc-300' : 'text-zinc-400'}`
    }, p.fs, "/", p.lh));
  }))))), /*#__PURE__*/React.createElement(SCard, {
    className: "overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200 bg-zinc-50/70 px-3 py-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] font-medium text-zinc-600"
  }, "Preview"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-400"
  }, "src/diff/VirtualHunk.tsx"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto font-mono text-[10.5px] text-zinc-400 tabular-nums"
  }, fontSize, "px / ", lineHeight, "px")), /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}px`
    }
  }, DIFF_PREVIEW_LINES.map((ln, i) => {
    const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
    const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
    const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
    const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `flex ${bg}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.l ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.r ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-5 text-center ${markerColor}`
    }, marker), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 pr-3 text-zinc-900 whitespace-pre"
    }, ln.code));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Changes apply immediately. Reset to defaults restores 12px / 18px."), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto",
    onClick: () => {
      setFontSize(12);
      setLineHeight(18);
    }
  }, "Reset to defaults")));
}
function RateRow({
  label,
  used,
  limit
}) {
  const pct = Math.min(100, used / limit * 100);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-1 flex items-center text-[12.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto font-mono text-[11.5px] tabular-nums text-zinc-500"
  }, used.toLocaleString(), " / ", limit.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "h-1.5 rounded-full bg-zinc-100 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-zinc-900",
    style: {
      width: `${pct}%`
    }
  })));
}

// ═══ State screens (empty / offline / loading / auth-error) ═══
function ShadcnStateEmptyScreen({
  width = 760,
  height = 560
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Inbox",
    subtitle: "0 unread",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox",
      collapsed: true,
      badges: {
        inbox: 0
      }
    }),
    sidebarCollapsed: true
  }, /*#__PURE__*/React.createElement(EmptyState, {
    icon: "check",
    iconClass: "text-emerald-600",
    title: "You're all caught up.",
    body: "No new review requests, mentions or replies."
  }));
}
function ShadcnStateOfflineScreen({
  width = 760,
  height = 560
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Inbox",
    subtitle: "Showing cached results \xB7 12m old",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox",
      collapsed: true
    }),
    sidebarCollapsed: true,
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 text-amber-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-amber-500"
    }), "You're offline \xB7 your network is down"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Retrying in ", /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-900"
    }, "14s")), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto text-zinc-400"
    }, "Read-only"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] text-amber-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "wifi-off",
    className: "mt-0.5 size-4 text-amber-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "You're offline."), " Showing what Pyor saved at 2:02 PM. You'll need to be back online to post comments or reviews \u2014 Pyor doesn't queue them."), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    icon: "refresh",
    className: "border-amber-200"
  }, "Retry")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-hidden opacity-60 saturate-50"
  }, [{
    title: 'fix(billing): correct prorated charge math…',
    repo: 'northwind/api',
    age: '12m'
  }, {
    title: 'RFC: cohort export pipeline',
    repo: 'northwind/analytics',
    age: '3h'
  }, {
    title: 'Empty-state polish for event picker',
    repo: 'northwind/design-system',
    age: '7h'
  }, {
    title: 'perf(diff-render): virtualise hunks…',
    repo: 'northwind/web-event-app',
    age: '1d'
  }].map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center gap-3 border-b border-zinc-100 px-4 py-2.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-4 text-zinc-400"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] text-zinc-900 truncate"
  }, p.title), /*#__PURE__*/React.createElement("div", {
    className: "text-[11.5px] text-zinc-500"
  }, p.repo)), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-zinc-400"
  }, p.age)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-200 bg-zinc-50/50 px-4 py-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "clock",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "Read-only."), " Last synced 2:02 PM \xB7 live updates and posting resume when you reconnect."), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-1.5 text-amber-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3"
  }), " reconnecting")));
}
function ShadcnStateLoadingScreen({
  width = 760,
  height = 560
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "#9217",
    subtitle: "perf(diff-render): virtualise hunks larger than 2k lines",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox",
      collapsed: true
    }),
    sidebarCollapsed: true,
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3"
    }), /*#__PURE__*/React.createElement("span", null, "Fetching diff for 200 files\u2026"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-200 px-5 py-2 text-[12.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "border-b-2 border-zinc-900 pb-2 text-zinc-950 font-semibold"
  }, "Files changed")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "w-56 shrink-0 border-r border-zinc-200 bg-zinc-50/40 p-2 space-y-1.5"
  }, Array.from({
    length: 12
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center gap-2",
    style: {
      paddingLeft: i % 3 * 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "size-3 rounded bg-zinc-200 animate-pulse"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-2 flex-1 rounded bg-zinc-200 animate-pulse",
    style: {
      maxWidth: `${50 + i * 13 % 40}%`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 p-5"
  }, /*#__PURE__*/React.createElement(SCard, {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 p-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-4 text-zinc-500 animate-spin"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] font-semibold"
  }, "Loading diff for 200-file PR"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[12px] tabular-nums text-zinc-500"
  }, "118 / 200 files \xB7 4.2 MB / 7.1 MB")), /*#__PURE__*/React.createElement("div", {
    className: "h-1 bg-zinc-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-zinc-900",
    style: {
      width: '59%'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, [80, 60, 40].map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-2 w-32 rounded bg-zinc-200 animate-pulse"
  }), Array.from({
    length: 4
  }).map((_, j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-2 w-8 rounded bg-zinc-200 animate-pulse"
  }), /*#__PURE__*/React.createElement("div", {
    className: `h-2 flex-1 rounded animate-pulse ${j % 3 === 0 ? 'bg-emerald-100' : 'bg-zinc-200'}`,
    style: {
      maxWidth: `${w - j * 5}%`
    }
  })))))))));
}
function ShadcnStateAuthScreen({
  width = 760,
  height = 560
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Inbox",
    subtitle: "GitHub credentials invalid",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox",
      collapsed: true
    }),
    sidebarCollapsed: true,
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5 text-red-600"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-red-500"
    }), "Disconnected \xB7 401 Bad credentials"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "Cached data is read-only"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 flex-col items-center justify-center bg-zinc-50/40 p-8 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 inline-flex size-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "lock",
    className: "size-6 text-red-500",
    strokeWidth: 1.7
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-semibold tracking-tight"
  }, "GitHub rejected your token"), /*#__PURE__*/React.createElement("p", {
    className: "mt-1.5 max-w-md text-[12.5px] leading-relaxed text-zinc-500"
  }, "The token in your Keychain returns ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "401 Bad credentials"), ". This usually means it was revoked, expired, or your org enabled SAML SSO and the token isn't authorized for it."), /*#__PURE__*/React.createElement(SCard, {
    className: "mt-4 w-[460px] text-left text-[12px]"
  }, /*#__PURE__*/React.createElement(DiagRow, {
    label: "Last successful call",
    value: "14:02 \xB7 1h 12m ago"
  }), /*#__PURE__*/React.createElement(DiagRow, {
    label: "Failing endpoint",
    value: "GET /notifications",
    mono: true
  }), /*#__PURE__*/React.createElement(DiagRow, {
    label: "Response",
    value: "HTTP 401 \xB7 Bad credentials",
    mono: true,
    color: "text-red-600"
  }), /*#__PURE__*/React.createElement(DiagRow, {
    label: "Token prefix",
    value: "ghp_3xK\u2026BqR",
    mono: true
  }), /*#__PURE__*/React.createElement(DiagRow, {
    last: true,
    label: "Keychain",
    value: "present, last rotated 2025-11-04"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex gap-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Work offline"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "key-round"
  }, "Update token"))));
}
function DiagRow({
  label,
  value,
  mono,
  color = 'text-zinc-700',
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-3 px-4 py-2 ${!last ? 'border-b border-zinc-100' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-36 text-zinc-500"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: `flex-1 ${color} ${mono ? 'font-mono text-[11.5px]' : ''}`
  }, value));
}

// ═══ Screen — Setup (first launch) ═══════════════════════════
function ShadcnSetupScreen({
  width = 920,
  height = 660,
  state = 'validated'
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Pyor",
    subtitle: "Set up GitHub access",
    toolbar: /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "arrow-left"
    }, "Back to sign-in")
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 border-r border-zinc-200 bg-zinc-50/40 p-8 overflow-auto"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-semibold tracking-tight"
  }, "Welcome to Pyor"), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-[13px] text-zinc-500"
  }, "A native macOS PR reviewer. Pyor reads GitHub via your personal access token \u2014 nothing is sent to a server."), /*#__PURE__*/React.createElement("ol", {
    className: "mt-5 space-y-3 text-[13px] text-zinc-700"
  }, [['1', 'Visit github.com/settings/tokens', 'Open in a browser. Use a classic token, fine-grained tokens don\'t cover /notifications yet.'], ['2', 'Scopes', /*#__PURE__*/React.createElement("span", null, "Check ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "repo"), " and ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "notifications"), ". Nothing else.")], ['3', 'Paste it on the right', 'Pyor validates against /user immediately. Token is stored in your macOS Keychain — never touches disk.']].map(([n, t, b], i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "flex gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-[11px] font-semibold text-zinc-700"
  }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-zinc-900"
  }, t), /*#__PURE__*/React.createElement("div", {
    className: "text-[12.5px] text-zinc-500"
  }, b))))), /*#__PURE__*/React.createElement(SCard, {
    className: "mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "mt-0.5 size-4 shrink-0 text-blue-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[12px] text-zinc-600 leading-relaxed"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "SAML SSO?"), " Authorize your token for your org from the same Tokens page \u2014 there's an \"Configure SSO\" button next to each token.")))), /*#__PURE__*/React.createElement("div", {
    className: "w-[400px] shrink-0 p-8 flex flex-col gap-4 bg-white"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[12.5px] font-semibold text-zinc-900"
  }, "Personal access token"), /*#__PURE__*/React.createElement(SInput, {
    icon: "key-round",
    value: "ghp_3xK\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022BqR",
    className: "mt-1.5 h-9",
    readOnly: true
  })), state === 'validated' ? /*#__PURE__*/React.createElement(SCard, {
    className: "border-emerald-200 bg-emerald-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "mt-0.5 size-4 shrink-0 text-emerald-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-[12.5px] text-emerald-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold"
  }, "Valid \xB7 @alex-cho"), /*#__PURE__*/React.createElement("div", {
    className: "text-emerald-700"
  }, "Scopes: repo, notifications \xB7 4,983 / 5,000 rate budget")))) : /*#__PURE__*/React.createElement(SCard, {
    className: "border-red-200 bg-red-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-circle",
    className: "mt-0.5 size-4 shrink-0 text-red-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-[12.5px] text-red-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold"
  }, "Token rejected \xB7 401"), /*#__PURE__*/React.createElement("div", {
    className: "text-red-700"
  }, "GitHub returned ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-white/60 px-1 py-0.5 font-mono text-[11px]"
  }, "Bad credentials"), ". Double-check you pasted the full token and that it isn't revoked.")))), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "p-3 text-[12px] text-zinc-600 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), " ", /*#__PURE__*/React.createElement("span", null, "Keep me signed in across restarts")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), " ", /*#__PURE__*/React.createElement("span", null, "Poll for new notifications every 60s")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, null), " ", /*#__PURE__*/React.createElement("span", null, "Send anonymized crash reports")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Skip \u2014 read-only demo"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    className: "ml-auto",
    disabled: state !== 'validated'
  }, "Open Pyor \u2192")))));
}

// ═══ Screen — Pre-PR launcher (simplified shadcn port) ════════
function ShadcnPrePRLauncherScreen({
  width = 1100,
  height = 740,
  view = {}
}) {
  const v = {
    repoPickerOpen: false,
    worktreePickerOpen: false,
    ...view
  };
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Local reviews",
    subtitle: "Self-review before opening a PR",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "local"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "git OK \xB7 5 repos \xB7 8 worktrees discovered"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "No GitHub round-trip \xB7 everything below is local"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-zinc-50/40 p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mx-auto max-w-2xl space-y-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500 mb-1"
  }, "New local review"), /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-semibold tracking-tight"
  }, "Review a local branch before opening a PR"), /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-[13px] text-zinc-500 leading-relaxed"
  }, "Pick a repo, a worktree, and a head/base pair. Pyor renders the diff exactly like a real PR. Notes stay local until you actually open the PR \u2014 then they migrate.")), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SCardHeader, null, /*#__PURE__*/React.createElement(SCardTitle, null, "Repo, worktree & refs"), /*#__PURE__*/React.createElement(SCardDescription, null, "5 repos registered \xB7 8 worktrees discovered on this machine.")), /*#__PURE__*/React.createElement(SCardContent, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement(RepoPickerSelect, {
    open: v.repoPickerOpen,
    value: "northwind/web-event-app",
    hint: /*#__PURE__*/React.createElement("span", {
      className: "text-[11.5px] text-zinc-500"
    }, "2 worktrees \xB7 default branch ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main"), " \xB7 last fetched 12s ago")
  }), /*#__PURE__*/React.createElement(WorktreePickerSelect, {
    open: v.worktreePickerOpen,
    value: "web-event-app",
    hint: /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-[11px] text-zinc-500"
    }, "~/code/northwind/web-event-app \xB7 HEAD perf/virtualise-hunks")
  }), /*#__PURE__*/React.createElement(PickerSelect, {
    label: "Head",
    icon: "git-pull-request",
    value: "perf/virtualise-hunks",
    mono: true,
    hint: /*#__PURE__*/React.createElement("span", {
      className: "text-[11.5px]"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-emerald-600 tabular-nums"
    }, "\u2191 14 ahead"), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300 mx-1.5"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-500"
    }, "0 behind"), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300 mx-1.5"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "font-semibold text-amber-700"
    }, "3 uncommitted"))
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-up-down"
  }, "Swap")), /*#__PURE__*/React.createElement(PickerSelect, {
    label: "Base",
    icon: "git-pull-request",
    value: "main",
    mono: true,
    hint: /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-[11px] text-zinc-500"
    }, "@ a3f7b21 \xB7 fetched 14s ago")
  }))), /*#__PURE__*/React.createElement(SCard, {
    className: "border-amber-200 bg-amber-50/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "mt-0.5 size-4 shrink-0 text-amber-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-[12.5px] text-amber-900 leading-relaxed"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "3 uncommitted changes"), " in this worktree. Pre-PR review compares", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-white/70 px-1 py-0.5 font-mono text-[11px] mx-1"
  }, "HEAD"), "against", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-white/70 px-1 py-0.5 font-mono text-[11px] mx-1"
  }, "main"), "\u2014 uncommitted edits won't be in the diff.", /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex gap-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm"
  }, "Show uncommitted in diff"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Open Files in editor"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Commits to review"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary"
  }, "14")), /*#__PURE__*/React.createElement(SCard, {
    className: "overflow-hidden"
  }, [{
    sha: '8c7d219',
    msg: 'add measureHunk-called-once regression test',
    ago: 'just now',
    stat: '+38 −2'
  }, {
    sha: 'f02ab1c',
    msg: 'address review: switch to useMemo for the threshold branch',
    ago: '14m',
    stat: '+12 −18'
  }, {
    sha: '21fce04',
    msg: 'wire VirtualHunk into NaiveHunk above 2k lines',
    ago: '2h',
    stat: '+24 −6'
  }, {
    sha: 'b9e4cd8',
    msg: 'measureHunk: cache line widths per font family',
    ago: '4h',
    stat: '+96 −8'
  }, {
    sha: '3a1c7f2',
    msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation',
    ago: '6h',
    stat: '+412 −188'
  }].map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.sha,
    className: `flex items-center gap-3 px-3.5 py-2 text-[12.5px] ${i > 0 ? 'border-t border-zinc-100' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] w-16 text-zinc-400"
  }, c.sha), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 truncate text-zinc-900"
  }, c.msg), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-zinc-400"
  }, c.ago), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] w-20 text-right tabular-nums text-zinc-500"
  }, c.stat))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-1.5 text-center text-[11.5px] text-zinc-500"
  }, "+ 9 earlier commits"))), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[12.5px] text-zinc-500"
  }, "You're about to review"), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center gap-2 text-[13.5px] font-semibold"
  }, /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]"
  }, "perf/virtualise-hunks"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[12px]"
  }, "main"), /*#__PURE__*/React.createElement("span", {
    className: "font-normal text-[12px] text-zinc-500"
  }, "\xB7 14 commits \xB7 7 files \xB7"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+904"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212311")))), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "play"
  }, "Start review \xB7 \u2318\u23CE"))))));
}
function PickerSelect({
  label,
  icon,
  value,
  mono,
  hint
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, label), /*#__PURE__*/React.createElement(SSelectTrigger, {
    icon: icon,
    value: value,
    hint: hint,
    mono: mono
  }));
}

// ── Repo + Worktree pickers ────────────────────────────────────
// A *repo* is the project (the GitHub remote, e.g. northwind/web-event-app).
// A *worktree* is a specific filesystem checkout of that repo. Git allows
// multiple worktrees per repo via `git worktree add`. Pyor surfaces both
// because power users keep a primary checkout for feature work and a
// secondary one for hotfixes/long-running spikes.

const PREPR_REPOS_SC = [{
  id: 'web',
  name: 'northwind/web-event-app',
  defaultBranch: 'main',
  worktrees: 2,
  branches: 18,
  unread: 2,
  pinned: true,
  active: true,
  lastFetch: '12s ago',
  dirty: true,
  remote: 'git@github.com:northwind/web-event-app.git'
}, {
  id: 'api',
  name: 'northwind/api',
  defaultBranch: 'main',
  worktrees: 1,
  branches: 9,
  unread: 0,
  pinned: true,
  lastFetch: '4h ago',
  dirty: false,
  remote: 'git@github.com:northwind/api.git'
}, {
  id: 'mobile',
  name: 'northwind/mobile-ios',
  defaultBranch: 'main',
  worktrees: 1,
  branches: 6,
  unread: 0,
  pinned: false,
  lastFetch: '1d ago',
  dirty: false,
  remote: 'git@github.com:northwind/mobile-ios.git'
}, {
  id: 'design',
  name: 'northwind/design-system',
  defaultBranch: 'main',
  worktrees: 2,
  branches: 12,
  unread: 1,
  pinned: false,
  lastFetch: '2d ago',
  dirty: false,
  remote: 'git@github.com:northwind/design-system.git'
}, {
  id: 'analyt',
  name: 'northwind/analytics',
  defaultBranch: 'develop',
  worktrees: 1,
  branches: 5,
  unread: 0,
  pinned: false,
  lastFetch: '3d ago',
  dirty: true,
  remote: 'git@github.com:northwind/analytics.git'
}];

// Keyed by repo id — list of worktrees belonging to that repo.
const PREPR_WORKTREES_SC = {
  web: [{
    id: 'web-main',
    label: 'web-event-app',
    path: '~/code/northwind/web-event-app',
    head: 'perf/virtualise-hunks',
    dirty: 3,
    last: '12s ago',
    primary: true,
    active: true
  }, {
    id: 'web-hotfix',
    label: 'web-event-app-hotfix',
    path: '~/code/northwind/web-event-app-hotfix',
    head: 'hotfix/cve-2025-1107',
    dirty: 0,
    last: '2h ago'
  }],
  api: [{
    id: 'api-main',
    label: 'api',
    path: '~/code/northwind/api',
    head: 'fix/proration',
    dirty: 0,
    last: '4h ago',
    primary: true
  }],
  mobile: [{
    id: 'mob-main',
    label: 'mobile-ios',
    path: '~/code/northwind/mobile-ios',
    head: 'feat/persist-scroll',
    dirty: 0,
    last: '1d ago',
    primary: true
  }],
  design: [{
    id: 'ds-main',
    label: 'design-system',
    path: '~/work/design-system',
    head: 'polish/empty-states',
    dirty: 0,
    last: '2d ago',
    primary: true
  }, {
    id: 'ds-rfc',
    label: 'design-system-rfc',
    path: '~/work/design-system-rfc',
    head: 'rfc/density-tokens',
    dirty: 2,
    last: '5d ago'
  }],
  analyt: [{
    id: 'an-main',
    label: 'analytics',
    path: '~/code/northwind/analytics',
    head: 'rfc/cohort-export',
    dirty: 1,
    last: '3d ago',
    primary: true
  }]
};
function RepoPickerSelect({
  open,
  value,
  hint
}) {
  const active = PREPR_REPOS_SC.find(r => r.name === value) || PREPR_REPOS_SC[0];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Repo"), /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    trigger: /*#__PURE__*/React.createElement(SSelectTrigger, {
      icon: "github",
      open: open,
      value: value,
      hint: hint,
      kbd: "\u2318O",
      badges: active?.unread > 0 && /*#__PURE__*/React.createElement(SBadge, {
        variant: "warn",
        className: "text-[9.5px]"
      }, active.unread, " new")
    })
  }, /*#__PURE__*/React.createElement(SCommand, null, /*#__PURE__*/React.createElement(SCommandInput, {
    defaultValue: "event",
    placeholder: "Search repos\u2026",
    matches: PREPR_REPOS_SC.length
  }), /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "Pinned"
  }, PREPR_REPOS_SC.filter(r => r.pinned).map(r => /*#__PURE__*/React.createElement(RepoCommandRow, {
    key: r.id,
    r: r,
    active: r.id === active?.id
  }))), /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "Recent"
  }, PREPR_REPOS_SC.filter(r => !r.pinned).map(r => /*#__PURE__*/React.createElement(RepoCommandRow, {
    key: r.id,
    r: r,
    active: r.id === active?.id
  }))), /*#__PURE__*/React.createElement(SCommandFooter, null, /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "plus",
    kbd: "\u2318N"
  }, "Add a repo\u2026"), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "folder"
  }, "Manage watched paths\u2026")))));
}
function RepoCommandRow({
  r,
  active
}) {
  return /*#__PURE__*/React.createElement(SCommandItem, {
    active: active
  }, /*#__PURE__*/React.createElement(LI, {
    name: "github",
    className: `size-3.5 ${active ? 'text-zinc-900' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex min-w-0 flex-1 flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: `truncate text-[12.5px] font-semibold ${active ? 'text-zinc-950' : 'text-zinc-900'}`
  }, r.name), active && /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-3 text-zinc-900",
    strokeWidth: 3
  }), r.unread > 0 && /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn",
    className: "text-[9.5px]"
  }, r.unread, " new")), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, r.worktrees, " worktree", r.worktrees > 1 ? 's' : '')), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "default ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-zinc-600"
  }, r.defaultBranch)), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, r.branches, " branches"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), r.dirty ? /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-amber-700"
  }, "has uncommitted") : /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "clean"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "fetched ", r.lastFetch))));
}

// Worktree picker — scoped to the currently-selected repo.
function WorktreePickerSelect({
  open,
  value,
  hint
}) {
  const list = PREPR_WORKTREES_SC.web || [];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Worktree"), /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    trigger: /*#__PURE__*/React.createElement(SSelectTrigger, {
      icon: "folder",
      open: open,
      value: value,
      hint: hint,
      kbd: "\u2318\u21E7O",
      badges: /*#__PURE__*/React.createElement(SBadge, {
        variant: "outline",
        className: "gap-1 text-[9.5px]"
      }, /*#__PURE__*/React.createElement(LI, {
        name: "check-circle",
        className: "size-2.5"
      }), "primary")
    })
  }, /*#__PURE__*/React.createElement(SCommand, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-3 py-1.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "github",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, "Worktrees of ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-700"
  }, "northwind/web-event-app")), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto"
  }, list.length, " found")), /*#__PURE__*/React.createElement(SCommandGroup, null, list.map(w => /*#__PURE__*/React.createElement(WorktreeCommandRow, {
    key: w.id,
    w: w,
    active: w.label === value
  }))), /*#__PURE__*/React.createElement(SCommandFooter, null, /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "plus"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex-1"
  }, "New worktree from this repo\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] text-zinc-400 font-mono"
  }, "git worktree add"))), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "terminal"
  }, "Discover worktrees in ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[11px]"
  }, "$PWD"))))));
}
function WorktreeCommandRow({
  w,
  active
}) {
  return /*#__PURE__*/React.createElement(SCommandItem, {
    active: active
  }, /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: `size-3.5 ${active ? 'text-zinc-900' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex min-w-0 flex-1 flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: `truncate text-[12.5px] font-semibold ${active ? 'text-zinc-950' : 'text-zinc-900'}`
  }, w.label), w.primary && /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "text-[9.5px]"
  }, "primary"), active && /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-3 text-zinc-900",
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("code", {
    className: "truncate font-mono text-[11px] text-zinc-500"
  }, w.path), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-600"
  }, w.head)), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), w.dirty > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-amber-700"
  }, w.dirty, " uncommitted") : /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "clean"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, "last active ", w.last))), /*#__PURE__*/React.createElement(STooltip, {
    label: "Reveal in Finder"
  }, /*#__PURE__*/React.createElement("span", {
    className: "invisible inline-flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 group-hover:visible"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "external-link",
    className: "size-3.5"
  }))));
}

// ═══ Screen — Pre-PR Review surface (local diff review) ═════════
// Looks like the PR-detail Files screen but adapted for local context:
// - No PR number, no reviewers, no CI checks
// - "Local · pre-PR" badge in the header
// - Tabs: Commits · Working tree · Files changed (no Conversation/Checks)
// - File rail has an "Uncommitted" pseudo-bucket above the branch files
// - Right-side actions: Open in iTerm · Refresh diff · Create PR…
// - Status bar speaks git, not GitHub
function ShadcnPrePRReviewScreen({
  width = 1320,
  height = 900,
  view = {}
}) {
  const v = {
    pushed: true,
    createOpen: false,
    ...view
  };
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Local review",
    subtitle: "perf/virtualise-hunks \u2192 main \xB7 local",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "local"
    }),
    toolbar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "terminal"
    }, "Open in iTerm"), /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "refresh"
    }, "Refresh diff"), v.pushed ? /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "git-pull-request"
    }, "Create PR\u2026") : /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "git-pull-request"
    }, "Push & create PR\u2026")),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Watching FS \xB7 debounce 200ms"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main@a3f7b21")), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Head \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "perf/virtualise-hunks@8c7d219")), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), v.pushed ? /*#__PURE__*/React.createElement("span", null, "Origin: ", /*#__PURE__*/React.createElement("span", {
      className: "text-emerald-600 font-medium"
    }, "up-to-date")) : /*#__PURE__*/React.createElement("span", {
      className: "text-amber-600 font-medium"
    }, "Origin: branch missing \xB7 will push on create"), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto"
    }, "Local-only \xB7 no GitHub round-trips"))
  }, /*#__PURE__*/React.createElement(PrePRHeaderSC, {
    pushed: v.pushed
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'changes',
      label: 'Working tree',
      icon: 'alert-triangle',
      count: 3
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement(ShadcnFilesToolbar, null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(ShadcnPrePRFileRail, null), /*#__PURE__*/React.createElement(ShadcnDiffPane, null)), v.createOpen && /*#__PURE__*/React.createElement(CreatePRDialog, {
    pushed: v.pushed
  }));
}
function PrePRHeaderSC({
  pushed
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-200 px-5 pt-3 pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: "default",
    className: "gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "monitor",
    className: "size-3"
  }), " Local \xB7 pre-PR"), /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] text-zinc-700"
  }, "comparing", /*#__PURE__*/React.createElement("code", {
    className: "mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "perf/virtualise-hunks"), "against", /*#__PURE__*/React.createElement("code", {
    className: "mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "main"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500 ml-1"
  }, "\xB7 ", pushed ? 'no PR yet' : 'branch not pushed')), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-xs text-zinc-500"
  }, "Worktree ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-700"
  }, "~/code/web-event-app"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-[12.5px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "Author"), /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium"
  }, "alex-cho \xB7 you")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 font-mono text-[11.5px]"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-commit",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900 tabular-nums"
  }, "14"), " ahead"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "0 behind")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+904"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212311"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "\xB7 7 files")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5 text-amber-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, "3 uncommitted")), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(SKbd, null, "J"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement(SKbd, null, "K"), " next file")));
}
function ShadcnPrePRFileRail() {
  const uncommitted = [{
    name: 'src/diff/VirtualHunk.tsx',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 18,
    del: 4
  }, {
    name: 'src/diff/measureHunk.ts',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 6,
    del: 0
  }, {
    name: 'src/notes/scroll.md',
    stat: 'A',
    statClass: 'text-emerald-600',
    add: 14,
    del: 0
  }];
  const branchFiles = [{
    name: 'src/diff/VirtualHunk.tsx',
    stat: 'A',
    statClass: 'text-emerald-600',
    add: 412,
    del: 0,
    indent: 0,
    selected: true
  }, {
    name: 'src/diff/measureHunk.ts',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 96,
    del: 8,
    indent: 0
  }, {
    name: 'src/diff/NaiveHunk.tsx',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 24,
    del: 188,
    indent: 0
  }, {
    name: 'src/diff/HunkWindow.ts',
    stat: 'A',
    statClass: 'text-emerald-600',
    add: 218,
    del: 0,
    indent: 0
  }, {
    name: 'src/diff/index.ts',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 4,
    del: 1,
    indent: 0
  }, {
    name: 'src/diff/diff.test.tsx',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 142,
    del: 22,
    indent: 0
  }, {
    name: 'docs/diff-rendering.md',
    stat: 'M',
    statClass: 'text-amber-600',
    add: 8,
    del: 92,
    indent: 0
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-72 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-200 p-2"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter files",
    className: "h-7"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 border-b border-amber-200 bg-amber-50 px-3 py-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "size-3 text-amber-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] font-semibold uppercase tracking-wider text-amber-900"
  }, "Uncommitted"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn",
    className: "text-[9.5px]"
  }, "3"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[10px] text-amber-700/70"
  }, "local edits")), /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-200"
  }, uncommitted.map((f, i) => /*#__PURE__*/React.createElement(FileRailRowSC, {
    key: i,
    f: f
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100/60 px-3 py-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "In branch \xB7 14 commits"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "text-[9.5px]"
  }, "7")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto py-1"
  }, branchFiles.map((f, i) => /*#__PURE__*/React.createElement(FileRailRowSC, {
    key: i,
    f: f
  }))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "Viewed"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono tabular-nums"
  }, "3 / 7")), /*#__PURE__*/React.createElement("div", {
    className: "h-1 rounded-full bg-zinc-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-zinc-900",
    style: {
      width: '43%'
    }
  }))));
}
function FileRailRowSC({
  f
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-1.5 px-3 py-1 text-[12px] ${f.selected ? 'bg-zinc-200/60' : 'hover:bg-zinc-100'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-3 text-center font-mono text-[9.5px] font-bold ${f.statClass}`
  }, f.stat), /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: "size-3 shrink-0 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 truncate font-mono text-[11px] text-zinc-900"
  }, f.name), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10px] tabular-nums"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", f.add), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", f.del)));
}

// Create-PR modal — surfaced when "Create PR…" is clicked.
function ShadcnPrePRCreateScreen({
  width = 1320,
  height = 900
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(ShadcnPrePRReviewScreen, {
    width: width,
    height: height,
    view: {
      pushed: true,
      createOpen: false
    }
  }), /*#__PURE__*/React.createElement(CreatePRDialog, {
    pushed: true
  }));
}
function CreatePRDialog({
  pushed
}) {
  return /*#__PURE__*/React.createElement(SDialog, {
    open: true,
    width: 640
  }, /*#__PURE__*/React.createElement(SDialogHeader, {
    icon: "git-pull-request",
    title: "Open pull request",
    description: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("code", {
      className: "font-mono"
    }, "perf/virtualise-hunks"), " \u2192 ", /*#__PURE__*/React.createElement("code", {
      className: "font-mono"
    }, "main"), /*#__PURE__*/React.createElement("span", {
      className: "ml-1"
    }, "\xB7 northwind/web-event-app")),
    onClose: () => {}
  }), /*#__PURE__*/React.createElement(SDialogBody, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1 normal-case tracking-normal text-[12px] text-zinc-900"
  }, "Title"), /*#__PURE__*/React.createElement(SInput, {
    value: "perf(diff-render): virtualise hunks larger than 2k lines",
    className: "h-9",
    readOnly: false
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1 normal-case tracking-normal text-[12px] text-zinc-900"
  }, "Description"), /*#__PURE__*/React.createElement("div", {
    className: "rounded-md border border-zinc-200 bg-white p-3 text-[12.5px] text-zinc-700 leading-relaxed"
  }, "The 18k-line PR #9081 spent 600ms parking a single hunk into the DOM\u2026", /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-[11px] text-zinc-400"
  }, "Generated from the first commit message \xB7 click to edit."))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Reviewers"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "priya-r",
    size: "size-5"
  }), /*#__PURE__*/React.createElement(SAvatar, {
    name: "marcus-w",
    size: "size-5"
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "plus",
    className: "ml-auto"
  }, "Add"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, {
    className: "mb-1"
  }, "Labels"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: "warn"
  }, "performance"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "plus",
    className: "ml-auto"
  }, "Add")))), /*#__PURE__*/React.createElement(SCard, {
    className: "bg-zinc-50/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 text-[12px] text-zinc-600 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), /*#__PURE__*/React.createElement("span", null, "Open as ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "draft"), " \xB7 run CI but don't request reviewers yet")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, {
    checked: true
  }), /*#__PURE__*/React.createElement("span", null, "Migrate ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "4 local notes"), " as review comments")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SCheckbox, null), /*#__PURE__*/React.createElement("span", null, "Delete branch after merge")))), !pushed && /*#__PURE__*/React.createElement(SCard, {
    className: "border-amber-200 bg-amber-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2 p-2.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "mt-0.5 size-3.5 shrink-0 text-amber-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[11.5px] text-amber-900 leading-relaxed"
  }, "Branch isn't on origin yet \u2014 Pyor will run ", /*#__PURE__*/React.createElement("code", {
    className: "font-mono bg-white/60 rounded px-1"
  }, "git push -u origin perf/virtualise-hunks"), " first.")))), /*#__PURE__*/React.createElement(SDialogFooter, null, /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "Will create on ", /*#__PURE__*/React.createElement("b", {
    className: "font-mono text-zinc-700"
  }, "github.com/northwind/web-event-app")), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm"
  }, "Open as draft"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "git-pull-request"
  }, "Create PR")));
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
  SInput,
  SCard,
  SCardHeader,
  SCardTitle,
  SCardDescription,
  SCardContent,
  SCheckbox,
  STabsList,
  STabsTrigger,
  STabsUnderline,
  SChip,
  PierWindowShell,
  PierSidebar,
  // PR-detail body pieces — re-exported so loading-state screens can compose them.
  ShadcnPRHeader,
  ShadcnFilesToolbarV2,
  ShadcnFileRailCollapsed,
  ShadcnFilesTabTools,
  STabsUnderline,
  // Screens
  ShadcnInboxScreenV3,
  ShadcnInboxEmptyScreen,
  ShadcnPullRequestsScreen,
  ShadcnLocalReviewsScreen,
  ShadcnPRDetailFilesScreen,
  ShadcnPRDetailFilesScreenV2,
  ShadcnPRDetailConversationScreen,
  ShadcnCommitsPopover,
  ShadcnReviewSubmitModal,
  ShadcnSettingsScreen,
  ShadcnStateEmptyScreen,
  ShadcnStateOfflineScreen,
  ShadcnStateLoadingScreen,
  ShadcnStateAuthScreen,
  ShadcnSetupScreen,
  ShadcnPrePRLauncherScreen,
  ShadcnPrePRLauncherEmptyScreen,
  ShadcnPrePRAddRepoScreen,
  ShadcnPrePRReviewScreen,
  ShadcnPrePRCreateScreen
});