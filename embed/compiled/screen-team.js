// ═══════════════════════════════════════════════════════════════════
//  Team — PRs from teammates across the orgs you belong to.
//  A new third scope on the Pull requests screen (My PRs · Reviewing · Team).
//  Three directions, each tuned to a different job:
//    A · ScreenTeamFeed   — Awareness. Grouped by org, scannable & social.
//    B · ScreenTeamRadar  — Jump in. Queue sorted by how much you can unblock.
//    C · ScreenTeamTable  — Oversight. Dense manager table, sortable.
//  Built entirely on the shadcn primitive layer (LI, SButton, SBadge,
//  SAvatar, SChip, SInput, STooltip, SHoverCard, PierWindowShell, …).
// ═══════════════════════════════════════════════════════════════════

const YOU = 'alex-cho';

// ── Organizations you're a member of ─────────────────────────────────
const TEAM_ORGS = {
  northwind: {
    key: 'northwind',
    name: 'northwind',
    glyph: 'NW',
    color: 'oklch(0.55 0.12 255)',
    blurb: 'Core product · Platform team',
    members: ['priya-r', 'nicolae-i', 'marcus-w', 'devon-l', 'sara-k', 'lena-m', 'othman', 'sara-l']
  },
  'northwind-labs': {
    key: 'northwind-labs',
    name: 'northwind-labs',
    glyph: 'NL',
    color: 'oklch(0.55 0.12 305)',
    blurb: 'R&D · experiments & spikes',
    members: ['wei-z', 'amara-o', 'tomas-b', 'nicolae-i', 'marcus-w']
  },
  aventri: {
    key: 'aventri',
    name: 'aventri',
    glyph: 'AV',
    color: 'oklch(0.55 0.12 165)',
    blurb: 'Sister brand · shared registration',
    members: ['priya-r', 'devon-l', 'marcus-w', 'othman']
  }
};

// ── Cross-org PR fixtures from teammates ─────────────────────────────
//  relation: your tie to the PR — 'reviewer' (review requested) · 'mentioned'
//            · 'team' (touches your team's area) · null (just awareness)
//  reviewers: [{ name, state: approved|changes|pending|commented }]
//  waiting:   time since last activity (drives staleness color)
const TEAM_PRS = [
// ── northwind ──────────────────────────────────────────────────
{
  org: 'northwind',
  repo: 'northwind/web-event-app',
  num: 9241,
  author: 'priya-r',
  status: 'open',
  title: 'feat(scheduler): coalesce identical session pushes into a single fan-out',
  branch: 'feat/coalesce-push',
  additions: 412,
  deletions: 89,
  files: 14,
  checks: {
    p: 18,
    f: 0,
    pe: 2
  },
  comments: 4,
  opened: '2d ago',
  waiting: '2h',
  relation: 'reviewer',
  labels: ['scheduler'],
  reviewers: [{
    name: 'nicolae-i',
    state: 'pending'
  }, {
    name: YOU,
    state: 'pending'
  }],
  lastEvent: {
    actor: 'priya-r',
    verb: 'pushed 3 commits',
    age: '12m'
  }
}, {
  org: 'northwind',
  repo: 'northwind/web-event-app',
  num: 9217,
  author: 'nicolae-i',
  status: 'open',
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  branch: 'perf/virtualise-hunks',
  additions: 904,
  deletions: 311,
  files: 7,
  checks: {
    p: 16,
    f: 2,
    pe: 0
  },
  comments: 23,
  opened: '1d ago',
  waiting: '1d',
  relation: 'reviewer',
  labels: ['perf'],
  reviewers: [{
    name: 'marcus-w',
    state: 'changes'
  }, {
    name: YOU,
    state: 'commented'
  }],
  lastEvent: {
    actor: 'marcus-w',
    verb: 'requested changes',
    age: '1d'
  }
}, {
  org: 'northwind',
  repo: 'northwind/api',
  num: 4471,
  author: 'marcus-w',
  status: 'open',
  title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle',
  branch: 'fix/proration',
  additions: 38,
  deletions: 47,
  files: 4,
  checks: {
    p: 23,
    f: 0,
    pe: 0
  },
  comments: 7,
  opened: '6h ago',
  waiting: '1h',
  relation: null,
  labels: ['billing'],
  reviewers: [{
    name: 'sara-k',
    state: 'approved'
  }, {
    name: 'priya-r',
    state: 'pending'
  }],
  lastEvent: {
    actor: 'sara-k',
    verb: 'approved',
    age: '1h'
  }
}, {
  org: 'northwind',
  repo: 'northwind/web-event-app',
  num: 9255,
  author: 'devon-l',
  status: 'open',
  title: 'feat(onsite): badge-printer retry queue with exponential backoff',
  branch: 'feat/printer-retry',
  additions: 276,
  deletions: 40,
  files: 11,
  checks: {
    p: 14,
    f: 0,
    pe: 1
  },
  comments: 6,
  opened: '5h ago',
  waiting: '5h',
  relation: null,
  labels: ['onsite'],
  reviewers: [],
  lastEvent: {
    actor: 'devon-l',
    verb: 'marked ready for review',
    age: '5h'
  }
}, {
  org: 'northwind',
  repo: 'northwind/web-event-app',
  num: 9260,
  author: 'sara-k',
  status: 'open',
  title: 'fix(a11y): focus trap escapes the session modal on Safari',
  branch: 'fix/focus-trap',
  additions: 44,
  deletions: 12,
  files: 3,
  checks: {
    p: 18,
    f: 0,
    pe: 0
  },
  comments: 1,
  opened: '4h ago',
  waiting: '4h',
  relation: 'team',
  labels: ['a11y'],
  reviewers: [],
  lastEvent: {
    actor: 'sara-k',
    verb: 'opened this PR',
    age: '4h'
  }
}, {
  org: 'northwind',
  repo: 'northwind/analytics',
  num: 308,
  author: 'sara-l',
  status: 'draft',
  title: 'RFC: cohort export pipeline (S3 + Athena)',
  branch: 'rfc/cohort-export',
  additions: 1240,
  deletions: 12,
  files: 38,
  checks: {
    p: 4,
    f: 1,
    pe: 3
  },
  comments: 12,
  opened: '3h ago',
  waiting: '3h',
  relation: null,
  labels: ['rfc'],
  reviewers: [{
    name: 'nicolae-i',
    state: 'pending'
  }],
  lastEvent: {
    actor: 'sara-l',
    verb: 'opened a draft',
    age: '3h'
  }
},
// ── northwind-labs ─────────────────────────────────────────────
{
  org: 'northwind-labs',
  repo: 'northwind-labs/realtime-spike',
  num: 88,
  author: 'wei-z',
  status: 'draft',
  title: 'spike: WebTransport for live session presence',
  branch: 'spike/webtransport',
  additions: 1420,
  deletions: 30,
  files: 22,
  checks: {
    p: 4,
    f: 1,
    pe: 3
  },
  comments: 12,
  opened: '1d ago',
  waiting: '1d',
  relation: null,
  labels: ['spike'],
  reviewers: [{
    name: 'marcus-w',
    state: 'pending'
  }],
  lastEvent: {
    actor: 'wei-z',
    verb: 'pushed 8 commits',
    age: '1d'
  }
}, {
  org: 'northwind-labs',
  repo: 'northwind-labs/ml-recs',
  num: 131,
  author: 'amara-o',
  status: 'open',
  title: 'feat: session recommender v2 (two-tower retrieval)',
  branch: 'feat/recs-v2',
  additions: 680,
  deletions: 120,
  files: 17,
  checks: {
    p: 9,
    f: 0,
    pe: 0
  },
  comments: 14,
  opened: '2d ago',
  waiting: '2d',
  relation: null,
  labels: ['ml'],
  reviewers: [{
    name: 'wei-z',
    state: 'approved'
  }, {
    name: 'nicolae-i',
    state: 'pending'
  }],
  lastEvent: {
    actor: 'wei-z',
    verb: 'approved',
    age: '2d'
  }
}, {
  org: 'northwind-labs',
  repo: 'northwind-labs/edge-cache',
  num: 54,
  author: 'tomas-b',
  status: 'open',
  title: 'perf: regional cache warmup on deploy',
  branch: 'perf/cache-warmup',
  additions: 96,
  deletions: 18,
  files: 5,
  checks: {
    p: 12,
    f: 0,
    pe: 0
  },
  comments: 3,
  opened: '7d ago',
  waiting: '7d',
  relation: null,
  labels: ['perf'],
  reviewers: [],
  lastEvent: {
    actor: 'tomas-b',
    verb: 'opened this PR',
    age: '7d'
  }
},
// ── aventri ────────────────────────────────────────────────────
{
  org: 'aventri',
  repo: 'aventri/registration',
  num: 2204,
  author: 'priya-r',
  status: 'open',
  title: 'feat: unified attendee import across brands',
  branch: 'feat/unified-import',
  additions: 540,
  deletions: 88,
  files: 19,
  checks: {
    p: 21,
    f: 0,
    pe: 1
  },
  comments: 8,
  opened: '1d ago',
  waiting: '1d',
  relation: 'reviewer',
  labels: ['registration'],
  reviewers: [{
    name: 'devon-l',
    state: 'pending'
  }, {
    name: YOU,
    state: 'pending'
  }],
  lastEvent: {
    actor: 'priya-r',
    verb: 'requested your review',
    age: '1d'
  }
}, {
  org: 'aventri',
  repo: 'aventri/registration',
  num: 2210,
  author: 'devon-l',
  status: 'open',
  title: 'fix: timezone drift in agenda export (ICS)',
  branch: 'fix/ics-tz',
  additions: 60,
  deletions: 34,
  files: 4,
  checks: {
    p: 15,
    f: 0,
    pe: 0
  },
  comments: 5,
  opened: '9h ago',
  waiting: '9h',
  relation: null,
  labels: ['bug'],
  reviewers: [{
    name: 'priya-r',
    state: 'approved'
  }],
  lastEvent: {
    actor: 'priya-r',
    verb: 'approved',
    age: '9h'
  }
}, {
  org: 'aventri',
  repo: 'aventri/payments',
  num: 780,
  author: 'marcus-w',
  status: 'open',
  title: 'chore: bump Stripe SDK to v16 + migrate webhooks',
  branch: 'chore/stripe-v16',
  additions: 210,
  deletions: 240,
  files: 12,
  checks: {
    p: 19,
    f: 0,
    pe: 0
  },
  comments: 2,
  opened: '3d ago',
  waiting: '3d',
  relation: null,
  labels: ['deps'],
  reviewers: [{
    name: 'othman',
    state: 'pending'
  }],
  lastEvent: {
    actor: 'marcus-w',
    verb: 'pushed 1 commit',
    age: '3d'
  }
}];

// ── Derived helpers ──────────────────────────────────────────────────
function teamReviewState(pr) {
  if (pr.reviewers.length === 0) return 'needs-reviewer';
  if (pr.reviewers.some(r => r.state === 'changes')) return 'changes';
  const others = pr.reviewers.filter(r => r.name !== YOU);
  if (others.length && others.every(r => r.state === 'approved')) return 'approved';
  return 'awaiting';
}

// staleness from waiting string ('12m' '2h' '3d')
function waitDays(w) {
  const m = /(\d+)\s*(m|h|d)/.exec(w || '');
  if (!m) return 0;
  const n = +m[1];
  return m[2] === 'd' ? n : m[2] === 'h' ? n / 24 : n / 1440;
}
function waitTone(w) {
  const d = waitDays(w);
  if (d >= 5) return {
    dot: 'bg-red-500',
    text: 'text-red-600'
  };
  if (d >= 3) return {
    dot: 'bg-amber-500',
    text: 'text-amber-600'
  };
  if (d >= 1) return {
    dot: 'bg-zinc-400',
    text: 'text-zinc-500'
  };
  return {
    dot: 'bg-emerald-500',
    text: 'text-zinc-500'
  };
}

// ── Small building blocks ────────────────────────────────────────────

// Org logo — rounded square in the org's brand color with its monogram.
// Each org gets a distinct hue so they're tellable apart at a glance.
function OrgGlyph({
  org,
  size = 'size-6',
  text = 'text-[10px]'
}) {
  const o = TEAM_ORGS[org] || {
    glyph: '?',
    color: 'oklch(0.45 0 0)'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex ${size} shrink-0 items-center justify-center rounded-md ${text} font-semibold tracking-tight text-white shadow-sm ring-1 ring-black/5`,
    style: {
      backgroundColor: o.color
    }
  }, o.glyph);
}

// Overlapping reviewer avatars, each ringed by its review state.
function ReviewerCluster({
  reviewers,
  size = 'size-5'
}) {
  if (!reviewers || reviewers.length === 0) {
    return /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-zinc-400"
    }, "\u2014");
  }
  const ring = {
    approved: 'ring-emerald-500',
    changes: 'ring-red-500',
    pending: 'ring-zinc-300',
    commented: 'ring-blue-400'
  };
  const label = {
    approved: 'approved',
    changes: 'requested changes',
    pending: 'review pending',
    commented: 'commented'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center -space-x-1.5"
  }, reviewers.map((r, i) => /*#__PURE__*/React.createElement(STooltip, {
    key: i,
    label: `${r.name === YOU ? 'you' : r.name} · ${label[r.state]}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `relative inline-block rounded-full ring-2 ${ring[r.state]}`,
    style: {
      zIndex: 10 - i
    }
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: r.name,
    size: size
  }), r.state === 'approved' && /*#__PURE__*/React.createElement("span", {
    className: "absolute -bottom-0.5 -right-0.5 inline-flex size-2.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-1.5 text-white",
    strokeWidth: 4
  })), r.state === 'changes' && /*#__PURE__*/React.createElement("span", {
    className: "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-white"
  })))));
}

// "Your tie to this PR" tag.
function RelationTag({
  relation
}) {
  if (relation === 'reviewer') return /*#__PURE__*/React.createElement(SBadge, {
    variant: "default",
    className: "bg-blue-600 text-white"
  }, "Review requested");
  if (relation === 'mentioned') return /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "text-blue-700 border-blue-200 bg-blue-50"
  }, "@you");
  if (relation === 'team') return /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline"
  }, "Your team's area");
  return null;
}

// +/− churn + file count.
function Churn({
  pr,
  align = 'text-right'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `${align} tabular-nums`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-400"
  }, pr.files, " files"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", pr.additions.toLocaleString()), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", pr.deletions)));
}
function ChecksInline({
  checks
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-[12px] tabular-nums text-zinc-500"
  }, checks.f > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-red-600"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5"
  }), checks.f) : /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-emerald-600"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5"
  }), checks.p), checks.pe > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-amber-600"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "circle-dot",
    className: "size-3.5"
  }), checks.pe));
}

// Shared tabs bar — My PRs · Reviewing · Team. `right` hosts inline affordances.
function TeamTabsBar({
  active = 'team',
  right
}) {
  const tabs = [{
    id: 'mine',
    label: 'My PRs',
    icon: 'user',
    count: 3
  }, {
    id: 'reviewing',
    label: 'Reviewing',
    icon: 'eye',
    count: 6
  }, {
    id: 'team',
    label: 'Team',
    icon: 'users',
    count: TEAM_PRS.length
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border-b border-zinc-200 px-5"
  }, tabs.map(t => {
    const on = t.id === active;
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
  }), right && /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2 py-1.5"
  }, right));
}

// Shared status footer.
function TeamStatusBar({
  note
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "size-1.5 rounded-full bg-emerald-500"
  }), "Connected \xB7 ", YOU), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "mx-2 h-3"
  }), /*#__PURE__*/React.createElement("span", null, "3 orgs \xB7 8 repos"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto"
  }, note));
}
Object.assign(window, {
  TEAM_ORGS,
  TEAM_PRS,
  YOU,
  teamReviewState,
  waitDays,
  waitTone,
  OrgGlyph,
  ReviewerCluster,
  RelationTag,
  Churn,
  ChecksInline,
  TeamTabsBar,
  TeamStatusBar
});