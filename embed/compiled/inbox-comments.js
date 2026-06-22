// ─────────────────────────────────────────────────────────────────────
// inbox-comments.jsx — Comments tab feed for the Pyor inbox.
//
// A richer surface than a notification row: each entry is the comment
// itself, not the wrapper subject. We surface every signal the GitHub
// API exposes (comment type, thread membership, diff_hunk snippet,
// reactions, attachments, resolution, outdated state, "first-time
// contributor" badge, review-batch link) so a reviewer can triage
// without round-tripping into the PR.
//
// Components:
//   InboxCommentsList  — full list with filter toolbar + infinite footer
//   InboxCommentRow    — one comment card row
//   InboxCommentSnippet — compact code-snippet pulled from diff_hunk
//   InboxCommentAttachment — image/video/file chip
//   DateRangeChip      — popover with presets + a calendar mock
//   InboxCommentsToolbar — search + filter chips, replaces the basic v3 filter row
//
// Depends on:
//   SAvatar, SBadge, SButton, SKbd, SSeparator (screen-shadcn.jsx)
//   SInput, SChip, SCheckbox, STabsUnderline (shadcn-app.jsx)
//   SPopover, SCommand* (shadcn-ui.jsx)
//   GhReactions, GhCodeBlock, Sx (gh-comments.jsx)
// ─────────────────────────────────────────────────────────────────────

const {
  useState: icU
} = React;

// ── Comment type config ─────────────────────────────────────────
// Drives the type-chip on every row. Maps the five comment surfaces
// described in GITHUB-API-INVENTORY.md§A1 to readable, color-tuned
// chips.
const COMMENT_TYPE_CFG = {
  'conversation': {
    label: 'PR discussion',
    icon: 'message-square',
    variant: 'secondary',
    desc: 'Top-level conversation comment'
  },
  'review-inline': {
    label: 'Inline review',
    icon: 'code-2',
    variant: 'default',
    desc: 'Comment anchored to a specific diff line'
  },
  'review-summary': {
    label: 'Review',
    icon: 'check-check',
    variant: 'success',
    desc: 'Review wrapper (Approve / Request changes / Comment)'
  },
  'file-level': {
    label: 'File comment',
    icon: 'file',
    variant: 'outline',
    desc: 'Comment on a file (no specific line)'
  },
  'commit': {
    label: 'Commit comment',
    icon: 'git-commit',
    variant: 'outline',
    desc: 'Comment anchored to a commit SHA'
  }
};

// `author_association` from the API. Only badge non-default values.
const ASSOC_CFG = {
  OWNER: {
    label: 'OWNER',
    tone: 'text-amber-700 border-amber-200 bg-amber-50'
  },
  MEMBER: {
    label: 'MEMBER',
    tone: 'text-zinc-700 border-zinc-200 bg-zinc-50'
  },
  COLLABORATOR: {
    label: 'COLLABORATOR',
    tone: 'text-zinc-700 border-zinc-200 bg-zinc-50'
  },
  CONTRIBUTOR: {
    label: 'CONTRIBUTOR',
    tone: 'text-zinc-500 border-zinc-200 bg-white'
  },
  FIRST_TIME_CONTRIBUTOR: {
    label: '1ST-TIME',
    tone: 'text-emerald-700 border-emerald-200 bg-emerald-50'
  },
  BOT: {
    label: 'BOT',
    tone: 'text-blue-700 border-blue-200 bg-blue-50'
  }
};

// ── Sample data ─────────────────────────────────────────────────
// 12 mixed comments across types, reactions, attachments, thread state.
// `you` = alex-cho. Things that *notify* alex-cho: replies to your
// comment, mentions, comments on PRs you authored, comments on
// subscribed threads.

const IC_REACTIONS_A = {
  '👍': {
    count: 4,
    me: true,
    who: 'You, marcus-w, +2'
  },
  '❤️': {
    count: 2,
    me: false,
    who: 'priya-r, jules-k'
  }
};
const IC_REACTIONS_B = {
  '🚀': {
    count: 6,
    me: false,
    who: 'priya-r, marcus-w, +4'
  },
  '👀': {
    count: 3,
    me: true,
    who: 'You, alex-cho, +1'
  }
};
const IC_REACTIONS_C = {
  '😄': {
    count: 2,
    me: false
  },
  '❤️': {
    count: 1,
    me: true,
    who: 'You'
  }
};
const IC_REACTIONS_D = {
  '👎': {
    count: 1,
    me: false
  },
  '😕': {
    count: 2,
    me: false
  }
};
const INBOX_COMMENTS = [
// 1 — Reply to alex-cho's inline review comment. Most "notify-y".
{
  id: 'ic1',
  type: 'review-inline',
  unread: true,
  age: '3m ago',
  actor: 'priya-r',
  role: 'MEMBER',
  reason: 'comment',
  isReply: {
    to: 'alex-cho',
    parentBody: 'Worth bounding the cache by a max entry count too — the per (font, viewport) tuple is fine but I worry about '
  },
  repo: 'northwind/web-event-app',
  num: 9217,
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  file: 'src/diff/VirtualHunk.tsx',
  line: 128,
  side: 'RIGHT',
  threadResolved: false,
  outdated: false,
  reviewBatch: {
    author: 'priya-r',
    state: 'COMMENTED',
    count: 4,
    date: 'Oct 14'
  },
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Good call. I'd add an ", /*#__PURE__*/React.createElement("code", null, "LRU(64)"), " on top of the tuple key \u2014 covers branch-switches that change ", /*#__PURE__*/React.createElement("code", null, "fontFamily"), ", and 64 distinct (font, viewport) pairs is more than we'll ever realistically see in one session.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Want to also expose the cache size via a debug menu so we can verify in prod?"),
  snippet: {
    filename: 'src/diff/VirtualHunk.tsx',
    lang: 'tsx',
    addedLines: [128, 129, 130],
    highlightLines: [128],
    startLine: 126,
    lines: [[['p', '  '], ['k', 'const '], ['v', 'window'], ['p', ' = '], ['f', 'useMemo'], ['p', '(() => {']], [['p', '    '], ['k', 'if '], ['p', '('], ['v', 'lines'], ['p', '.'], ['v', 'length'], ['p', ' < '], ['n', '2000'], ['p', ') '], ['k', 'return '], ['v', 'lines'], ['p', ';']], [['p', '    '], ['k', 'const '], ['v', 'key'], ['p', ' = '], ['s', '`${fontFamily}|${viewport}`'], ['p', ';']], [['p', '    '], ['k', 'if '], ['p', '(!'], ['v', 'cache'], ['p', '.'], ['f', 'has'], ['p', '('], ['v', 'key'], ['p', ')) '], ['v', 'cache'], ['p', '.'], ['f', 'set'], ['p', '('], ['v', 'key'], ['p', ', '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', '));']], [['p', '    '], ['k', 'return '], ['v', 'cache'], ['p', '.'], ['f', 'get'], ['p', '('], ['v', 'key'], ['p', ');']], [['p', '  }, ['], ['v', 'lines'], ['p', ', '], ['v', 'fontFamily'], ['p', ', '], ['v', 'viewport'], ['p', ']);']]]
  },
  reactions: IC_REACTIONS_A,
  attachments: []
},
// 2 — Top-level PR conversation comment with image attachment.
{
  id: 'ic2',
  type: 'conversation',
  unread: true,
  age: '14m ago',
  actor: 'nicolae-i',
  role: 'CONTRIBUTOR',
  reason: 'subscribed',
  isReply: null,
  repo: 'northwind/web-event-app',
  num: 9241,
  title: 'feat(scheduler): coalesce identical session pushes into a single fan-out',
  file: null,
  line: null,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Numbers from the staging fan-out, day 1 with coalescing on: ", /*#__PURE__*/React.createElement("b", null, "p99 send-time 612ms \u2192 38ms"), ", queue depth holds steady at <200 even during the keynote burst. Going to leave it on for 72h and re-check before declaring victory."),
  attachments: [{
    kind: 'image',
    name: 'fanout-p99-coalesced.png',
    size: '1284 × 712',
    caption: 'Day-1 staging'
  }],
  reactions: IC_REACTIONS_B
},
// 3 — Review summary (Request changes) with no body, 2 inline children.
{
  id: 'ic3',
  type: 'review-summary',
  unread: true,
  age: '47m ago',
  actor: 'marcus-w',
  role: 'MEMBER',
  reason: 'review_requested',
  isReply: null,
  repo: 'northwind/web-event-app',
  num: 9217,
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  file: null,
  line: null,
  reviewState: 'CHANGES_REQUESTED',
  reviewBatch: {
    author: 'marcus-w',
    state: 'CHANGES_REQUESTED',
    count: 2,
    date: 'Oct 14'
  },
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "One blocker on the public ", /*#__PURE__*/React.createElement("code", null, "ResizeObserver"), " contract \u2014 see thread on ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, "HunkWindow.ts:212"), ". Otherwise perf numbers look fantastic, happy to ship as soon as that's adapted."),
  reactions: IC_REACTIONS_C
},
// 4 — Inline review on an OUTDATED hunk. Line drifted off the diff.
{
  id: 'ic4',
  type: 'review-inline',
  unread: false,
  age: '2h ago',
  actor: 'sara-l',
  role: 'COLLABORATOR',
  reason: 'review_requested',
  isReply: null,
  repo: 'northwind/web-event-app',
  num: 9217,
  title: 'perf(diff-render): virtualise hunks larger than 2k lines',
  file: 'src/diff/HunkWindow.ts',
  line: 212,
  side: 'RIGHT',
  threadResolved: false,
  outdated: true,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "The ", /*#__PURE__*/React.createElement("code", null, "resize"), " handler still touches the DOM synchronously on every callback. Could we batch into a ", /*#__PURE__*/React.createElement("code", null, "requestAnimationFrame"), "? My MBP starts dropping frames once you hit ~50 hunks open."),
  snippet: {
    filename: 'src/diff/HunkWindow.ts',
    lang: 'ts',
    startLine: 210,
    delLines: [212],
    addedLines: [],
    highlightLines: [212],
    lines: [[['k', 'export class '], ['t', 'HunkWindow'], ['p', ' {']], [['p', '  '], ['f', 'onResize'], ['p', '('], ['v', 'entry'], ['p', ': '], ['t', 'ResizeObserverEntry'], ['p', ') {']], [['p', '    '], ['k', 'this'], ['p', '.'], ['v', 'node'], ['p', '.'], ['v', 'style'], ['p', '.'], ['v', 'height'], ['p', ' = '], ['s', '`${entry.contentRect.height}px`'], ['p', ';']], [['p', '  }']]]
  },
  reactions: {},
  attachments: []
},
// 5 — File-level comment (no line anchor).
{
  id: 'ic5',
  type: 'file-level',
  unread: false,
  age: '4h ago',
  actor: 'jules-k',
  role: 'MEMBER',
  reason: 'subscribed',
  isReply: null,
  repo: 'northwind/design-system',
  num: 612,
  title: 'Empty-state polish for event picker on small viewports',
  file: 'src/empty/EventPickerEmpty.tsx',
  line: null,
  side: null,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Could we extract the empty-state SVG into its own asset? It's referenced from two other places now (Reports, Audience) and we keep diverging on the stroke widths."),
  reactions: {
    '👍': {
      count: 2,
      me: false
    }
  },
  attachments: []
},
// 6 — Commit comment (rare, but the API exposes them).
{
  id: 'ic6',
  type: 'commit',
  unread: false,
  age: '6h ago',
  actor: 'dependabot',
  role: 'BOT',
  reason: 'subscribed',
  isReply: null,
  repo: 'northwind/api',
  num: 4469,
  commitSha: 'a3f7b21',
  title: 'chore(deps): bump pg from 8.11.3 to 8.13.0',
  file: 'package-lock.json',
  line: null,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Lockfile resolution touched ", /*#__PURE__*/React.createElement("b", null, "23,481 lines"), " \u2014 almost entirely transitive hoisting after the major bump. Reviewed the top-level shape; flagged a single duplicate ", /*#__PURE__*/React.createElement("code", null, "pg-types"), " peer (now resolved)."),
  reactions: {},
  attachments: []
},
// 7 — Reply to alex-cho on a thread, with a video attachment (mp4).
{
  id: 'ic7',
  type: 'conversation',
  unread: false,
  age: '11h ago',
  actor: 'nicolae-i',
  role: 'CONTRIBUTOR',
  reason: 'author',
  isReply: {
    to: 'alex-cho',
    parentBody: 'Should we also handle the case where the cached offset exceeds the new list length after a refresh removes rows above '
  },
  repo: 'northwind/mobile-ios',
  num: 1183,
  title: 'feat(ios): persist scroll offset across PR-list refreshes',
  file: null,
  line: null,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Recorded a quick clip showing the cached-offset-out-of-range case. Right now we clamp to ", /*#__PURE__*/React.createElement("code", null, "list.length - 1"), " which feels OK but is a little disorienting. Suggest also flashing a \"items hidden above\" affordance like the inbox does."),
  attachments: [{
    kind: 'video',
    name: 'cached-offset-out-of-range.mp4',
    size: '00:42 · 18.4 MB',
    caption: 'iPhone 13 · iOS 17'
  }],
  reactions: IC_REACTIONS_C
},
// 8 — Inline review on a RESOLVED thread (still in feed for context).
{
  id: 'ic8',
  type: 'review-inline',
  unread: false,
  age: '1d ago',
  actor: 'priya-r',
  role: 'MEMBER',
  reason: 'subscribed',
  isReply: null,
  repo: 'northwind/web-event-app',
  num: 9244,
  title: 'refactor(notifications): pull /notifications into shared client',
  file: 'src/api/notifications.ts',
  line: 47,
  side: 'RIGHT',
  threadResolved: true,
  outdated: false,
  resolvedBy: 'alex-cho',
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Resolved \u2014 went with the ", /*#__PURE__*/React.createElement("code", null, "If-None-Match"), " wrapper as suggested. ETag round-trip dropped from 3 to ~0 in steady-state."),
  snippet: {
    filename: 'src/api/notifications.ts',
    lang: 'ts',
    startLine: 45,
    addedLines: [47, 48],
    lines: [[['k', 'export async function '], ['f', 'fetchNotifications'], ['p', '(): '], ['t', 'Promise'], ['p', '<'], ['t', 'Notification'], ['p', '[]> {']], [['p', '  '], ['k', 'const '], ['v', 'etag'], ['p', ' = '], ['v', 'cache'], ['p', '.'], ['f', 'get'], ['p', '('], ['s', "'notifications'"], ['p', ');']], [['p', '  '], ['k', 'const '], ['v', 'res'], ['p', ' = '], ['k', 'await '], ['f', 'gh'], ['p', '.'], ['f', 'get'], ['p', '('], ['s', "'/notifications'"], ['p', ', { '], ['v', 'ifNoneMatch'], ['p', ': '], ['v', 'etag'], ['p', ' });']], [['p', '  '], ['k', 'if '], ['p', '('], ['v', 'res'], ['p', '.'], ['v', 'status'], ['p', ' === '], ['n', '304'], ['p', ') '], ['k', 'return '], ['v', 'cache'], ['p', '.'], ['f', 'value'], ['p', ';']]]
  },
  reactions: {
    '🎉': {
      count: 3,
      me: false,
      who: 'marcus-w, priya-r, +1'
    }
  },
  attachments: []
},
// 9 — Mention in a conversation body.
{
  id: 'ic9',
  type: 'conversation',
  unread: true,
  age: '1d ago',
  actor: 'sara-l',
  role: 'COLLABORATOR',
  reason: 'mention',
  isReply: null,
  mentioned: ['alex-cho'],
  repo: 'northwind/analytics',
  num: 308,
  title: 'RFC: cohort export pipeline (S3 + Athena)',
  file: null,
  line: null,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "cc ", /*#__PURE__*/React.createElement("a", {
    className: "text-blue-600 hover:underline"
  }, "@alex-cho"), " \u2014 we discussed this on Slack last week. The Athena side mirrors what you suggested for the diff-render cache (key on tuple, LRU). Quick sketch in the RFC doc."),
  reactions: IC_REACTIONS_D,
  attachments: []
},
// 10 — Review summary (Approve), short body.
{
  id: 'ic10',
  type: 'review-summary',
  unread: false,
  age: '2d ago',
  actor: 'marcus-w',
  role: 'MEMBER',
  reason: 'subscribed',
  isReply: null,
  repo: 'northwind/mobile-ios',
  num: 1183,
  title: 'feat(ios): persist scroll offset across PR-list refreshes',
  file: null,
  line: null,
  reviewState: 'APPROVED',
  reviewBatch: {
    author: 'marcus-w',
    state: 'APPROVED',
    count: 0,
    date: 'Oct 13'
  },
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "LGTM. Cached offset survives the refresh test, no Sentry noise after 18h soak. Ship."),
  reactions: {
    '🚀': {
      count: 5,
      me: true,
      who: 'You, priya-r, +3'
    }
  },
  attachments: []
},
// 11 — First-time contributor (badge variant), conversation w/ code in body.
{
  id: 'ic11',
  type: 'conversation',
  unread: false,
  age: '3d ago',
  actor: 'roma-vn',
  role: 'FIRST_TIME_CONTRIBUTOR',
  reason: 'subscribed',
  isReply: null,
  repo: 'northwind/design-system',
  num: 612,
  title: 'Empty-state polish for event picker on small viewports',
  file: null,
  line: null,
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "Hi \u2014 first PR here! Followed CONTRIBUTING.md; let me know if I missed anything. The breakpoint I picked was ", /*#__PURE__*/React.createElement("code", null, "sm"), " (640px) since that's what the rest of the picker uses."),
  reactions: {
    '❤️': {
      count: 4,
      me: true,
      who: 'You, jules-k, +2'
    }
  },
  attachments: []
},
// 12 — Reply on a thread to your own comment, very short.
{
  id: 'ic12',
  type: 'review-inline',
  unread: false,
  age: '4d ago',
  actor: 'priya-r',
  role: 'MEMBER',
  reason: 'comment',
  isReply: {
    to: 'alex-cho',
    parentBody: 'Are we double-encoding the cursor here? The base64 wrap looks like it happens both client and server side…'
  },
  repo: 'northwind/api',
  num: 4471,
  title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle',
  file: 'src/billing/proration.ts',
  line: 84,
  side: 'RIGHT',
  threadResolved: true,
  outdated: false,
  resolvedBy: 'priya-r',
  body: /*#__PURE__*/React.createElement(React.Fragment, null, "You're right \u2014 pushed the fix. Cursor's now opaque-from-server, client just round-trips it."),
  snippet: {
    filename: 'src/billing/proration.ts',
    lang: 'ts',
    startLine: 82,
    delLines: [84],
    addedLines: [85],
    highlightLines: [85],
    lines: [[['p', '  '], ['k', 'const '], ['v', 'next'], ['p', ' = '], ['f', 'decodeCursor'], ['p', '('], ['v', 'req'], ['p', '.'], ['v', 'query'], ['p', '.'], ['v', 'cursor'], ['p', ');']], [['p', '  '], ['k', 'const '], ['v', 'page'], ['p', ' = '], ['k', 'await '], ['f', 'fetchPage'], ['p', '('], ['v', 'next'], ['p', ');']], [['p', '  '], ['v', 'res'], ['p', '.'], ['v', 'cursor'], ['p', ' = '], ['f', 'base64'], ['p', '('], ['f', 'encodeCursor'], ['p', '('], ['v', 'page'], ['p', '.'], ['v', 'tail'], ['p', '));']], [['p', '  '], ['v', 'res'], ['p', '.'], ['v', 'cursor'], ['p', ' = '], ['v', 'page'], ['p', '.'], ['v', 'nextCursor'], ['p', '; '], ['m', '// opaque, server-issued']]]
  },
  reactions: {},
  attachments: []
}];

// ─── InboxCommentSnippet ────────────────────────────────────────
// Compact diff_hunk renderer. ~4 lines max, sticky filename header,
// "View in diff" affordance to the right. Reuses the Sx tone map.
function InboxCommentSnippet({
  snippet
}) {
  const {
    filename,
    lang,
    lines,
    addedLines = [],
    delLines = [],
    highlightLines = [],
    startLine = 1
  } = snippet;
  return /*#__PURE__*/React.createElement("div", {
    className: "overflow-hidden rounded-md border border-zinc-200 bg-zinc-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "code-2",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-700"
  }, filename), /*#__PURE__*/React.createElement("span", {
    className: "rounded-sm bg-zinc-100 px-1 py-0 text-[9.5px] font-medium uppercase tracking-wide text-zinc-500"
  }, lang), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-2 text-zinc-400"
  }, /*#__PURE__*/React.createElement("button", {
    className: "inline-flex items-center gap-1 rounded hover:text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "external-link",
    className: "size-3"
  }), "View in diff"))), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto px-0 py-1 font-mono text-[11px] leading-[16px]"
  }, lines.map((toks, i) => {
    const ln = startLine + i;
    const isAdd = addedLines.includes(ln);
    const isDel = delLines.includes(ln);
    const isHl = highlightLines.includes(ln);
    const rowBg = isAdd ? 'bg-emerald-50/70' : isDel ? 'bg-red-50/70' : isHl ? 'bg-amber-50/40' : '';
    const marker = isAdd ? /*#__PURE__*/React.createElement("span", {
      className: "text-emerald-700"
    }, "+") : isDel ? /*#__PURE__*/React.createElement("span", {
      className: "text-red-700"
    }, "\u2212") : /*#__PURE__*/React.createElement("span", {
      className: "text-transparent"
    }, "\xB7");
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `flex ${rowBg}`
    }, /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 w-9 select-none pr-2 text-right text-zinc-400 tabular-nums"
    }, ln), /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 w-3 select-none text-center"
    }, marker), /*#__PURE__*/React.createElement("code", {
      className: "whitespace-pre pr-4 text-zinc-900"
    }, toks.map(([tk, txt], j) => /*#__PURE__*/React.createElement(Sx, {
      key: j,
      tk: tk
    }, txt))));
  })));
}

// ─── InboxCommentAttachment ─────────────────────────────────────
// Compact attachment thumbnail. Images/videos paint a mini preview,
// other files just show a paperclip + name.
function InboxCommentAttachment({
  att
}) {
  const isMedia = att.kind === 'image' || att.kind === 'video';
  if (!isMedia) {
    return /*#__PURE__*/React.createElement("a", {
      className: "inline-flex max-w-[280px] items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-[11.5px] hover:bg-zinc-50"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "paperclip",
      className: "size-3.5 text-zinc-400"
    }), /*#__PURE__*/React.createElement("span", {
      className: "truncate font-mono text-zinc-700"
    }, att.name), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto shrink-0 text-zinc-400 tabular-nums"
    }, att.size));
  }
  return /*#__PURE__*/React.createElement("a", {
    className: "group/att inline-flex items-stretch gap-0 overflow-hidden rounded-md border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative h-14 w-20 shrink-0 bg-zinc-100"
  }, att.kind === 'image' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 grid grid-cols-6 gap-px p-1"
  }, ['bg-orange-400', 'bg-orange-500', 'bg-amber-500', 'bg-orange-300', 'bg-amber-400', 'bg-rose-400', 'bg-amber-500', 'bg-orange-400', 'bg-amber-400', 'bg-rose-500', 'bg-orange-300', 'bg-amber-500'].map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `${b} rounded-[1px]`
  }))), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-0.5 top-0.5 rounded bg-white/85 px-1 py-0 text-[8px] font-medium uppercase text-zinc-500"
  }, "img")), att.kind === 'video' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-0 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex size-6 items-center justify-center rounded-full bg-black/55 text-white ring-2 ring-white/30"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    className: "size-3 translate-x-0.5",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 4v16l13-8z"
  })))), /*#__PURE__*/React.createElement("span", {
    className: "absolute right-0.5 top-0.5 rounded bg-black/55 px-1 py-0 text-[8px] font-medium uppercase text-white"
  }, "mp4"))), /*#__PURE__*/React.createElement("div", {
    className: "flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-2.5 py-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[12px] font-medium text-zinc-900"
  }, att.name), /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[10.5px] text-zinc-500"
  }, att.caption ? `${att.caption} · ${att.size}` : att.size)));
}

// ─── Author association badge ───────────────────────────────────
function AssocBadge({
  role
}) {
  const cfg = ASSOC_CFG[role];
  if (!cfg) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex h-[15px] items-center rounded-full border px-1.5 text-[9.5px] font-semibold uppercase tracking-wider ${cfg.tone}`
  }, cfg.label);
}

// ─── InboxCommentRow ────────────────────────────────────────────
function InboxCommentRow({
  c,
  focused,
  query
}) {
  const typeCfg = COMMENT_TYPE_CFG[c.type];
  const [collapsed, setCollapsed] = icU(false);

  // Resolution / outdated chips (inline review only).
  const stateChip = c.outdated ? {
    label: 'Outdated',
    icon: 'alert-triangle',
    tone: 'text-amber-700 border-amber-200 bg-amber-50'
  } : c.threadResolved ? {
    label: 'Resolved',
    icon: 'check-circle',
    tone: 'text-emerald-700 border-emerald-200 bg-emerald-50'
  } : null;

  // Review state chip (review-summary only).
  const verdictChip = c.type === 'review-summary' ? {
    APPROVED: {
      label: 'Approved',
      icon: 'check-circle',
      tone: 'text-emerald-700 border-emerald-200 bg-emerald-50'
    },
    CHANGES_REQUESTED: {
      label: 'Changes requested',
      icon: 'x-circle',
      tone: 'text-red-700 border-red-200 bg-red-50'
    },
    COMMENTED: {
      label: 'Commented',
      icon: 'message-square',
      tone: 'text-zinc-700 border-zinc-200 bg-zinc-50'
    }
  }[c.reviewState] : null;
  const reasonChip = c.reason === 'mention' ? {
    label: 'Mentioned you',
    icon: 'at-sign',
    tone: 'text-amber-700 border-amber-200 bg-amber-50'
  } : c.reason === 'author' ? {
    label: 'On your PR',
    icon: 'user',
    tone: 'text-blue-700 border-blue-200 bg-blue-50'
  } : null;
  return /*#__PURE__*/React.createElement("article", {
    className: `relative flex gap-3 border-b border-zinc-100 px-4 py-3 ${focused ? 'bg-zinc-50' : c.unread ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-zinc-50/40'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1.5 pt-2 shrink-0"
  }, c.unread && /*#__PURE__*/React.createElement("span", {
    className: "block size-1.5 rounded-full bg-blue-600",
    title: "Unread"
  })), /*#__PURE__*/React.createElement(SAvatar, {
    name: c.actor,
    size: "size-7"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-1.5 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, c.actor), /*#__PURE__*/React.createElement(AssocBadge, {
    role: c.role
  }), /*#__PURE__*/React.createElement(SBadge, {
    variant: typeCfg.variant,
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: typeCfg.icon,
    className: "size-2.5"
  }), typeCfg.label), stateChip && /*#__PURE__*/React.createElement("span", {
    className: `inline-flex h-[18px] items-center gap-1 rounded-full border px-1.5 text-[10px] font-semibold ${stateChip.tone}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: stateChip.icon,
    className: "size-2.5"
  }), stateChip.label), verdictChip && /*#__PURE__*/React.createElement("span", {
    className: `inline-flex h-[18px] items-center gap-1 rounded-full border px-1.5 text-[10px] font-semibold ${verdictChip.tone}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: verdictChip.icon,
    className: "size-2.5"
  }), verdictChip.label), reasonChip && /*#__PURE__*/React.createElement("span", {
    className: `inline-flex h-[18px] items-center gap-1 rounded-full border px-1.5 text-[10px] font-semibold ${reasonChip.tone}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: reasonChip.icon,
    className: "size-2.5"
  }), reasonChip.label), c.isReply && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "corner-down-right",
    className: "size-3 text-zinc-400"
  }), "replied to ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-700"
  }, "@", c.isReply.to)), c.reviewBatch && !c.isReply && c.type === 'review-inline' && /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "\xB7 part of ", /*#__PURE__*/React.createElement("a", {
    className: "text-zinc-600 hover:text-zinc-900 hover:underline"
  }, c.reviewBatch.author, "'s review")), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto shrink-0 text-[11.5px] text-zinc-400 tabular-nums"
  }, c.age)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px]"
  }, /*#__PURE__*/React.createElement("a", {
    className: `truncate hover:underline ${c.unread ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-800'}`,
    style: {
      maxWidth: 540
    }
  }, c.title), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-400"
  }, "#", c.num), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, c.repo), c.file && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500 hover:text-zinc-900 hover:underline"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", null, c.file, c.line && /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, ":", c.line)), c.side === 'LEFT' && /*#__PURE__*/React.createElement("span", {
    className: "rounded bg-red-50 px-1 text-[9.5px] font-medium text-red-700"
  }, "\u2212"))), c.commitSha && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("a", {
    className: "inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500 hover:underline"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-commit",
    className: "size-3"
  }), c.commitSha))), c.isReply?.parentBody && !collapsed && /*#__PURE__*/React.createElement("div", {
    className: "rounded-md border-l-2 border-zinc-300 bg-zinc-50/70 px-2.5 py-1 text-[11.5px] text-zinc-500 italic line-clamp-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "not-italic text-zinc-400"
  }, "@", c.isReply.to, ": "), "\"", c.isReply.parentBody, "\u2026\""), !collapsed && /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] leading-relaxed text-zinc-700"
  }, query ? /*#__PURE__*/React.createElement(HighlightedBody, {
    body: c.body,
    query: query
  }) : c.body), !collapsed && c.snippet && /*#__PURE__*/React.createElement(InboxCommentSnippet, {
    snippet: c.snippet
  }), !collapsed && c.attachments?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 pt-0.5"
  }, c.attachments.map((a, i) => /*#__PURE__*/React.createElement(InboxCommentAttachment, {
    key: i,
    att: a
  }))), !collapsed && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 pt-0.5"
  }, c.reactions && Object.keys(c.reactions).length > 0 ? /*#__PURE__*/React.createElement(GhReactions, {
    entries: c.reactions
  }) : /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-6 items-center gap-1 rounded-full border border-dashed border-zinc-300 bg-white px-2 text-[11px] text-zinc-400 hover:border-zinc-400 hover:text-zinc-600"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "smile",
    className: "size-3"
  }), "React"), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100",
    style: {/* no group on parent; show always but muted */}
  }, /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11.5px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "reply",
    className: "size-3"
  }), "Reply"), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11.5px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-check",
    className: "size-3"
  }), "Mark read"), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11.5px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "external-link",
    className: "size-3"
  }), "Open")))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setCollapsed(c => !c),
    title: collapsed ? 'Expand' : 'Collapse',
    className: "absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: collapsed ? 'chevron-down' : 'chevron-up',
    className: "size-3.5"
  })));
}

// Wrap matches in <mark>. Only operates on string children; passes
// React-node children through. Cheap, good enough for static search demo.
function HighlightedBody({
  body,
  query
}) {
  if (!query) return body;
  // body is a React node — render it then highlight only string nodes.
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  const mark = node => {
    if (typeof node === 'string') {
      return node.split(re).map((p, i) => re.test(p) ? /*#__PURE__*/React.createElement("mark", {
        key: i,
        className: "rounded bg-amber-200/80 px-0.5 text-zinc-900"
      }, p) : p);
    }
    if (Array.isArray(node)) return node.map((n, i) => /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, mark(n)));
    if (React.isValidElement(node) && node.props?.children) {
      return React.cloneElement(node, {}, mark(node.props.children));
    }
    return node;
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, mark(body));
}

// ─── DateRangeChip ──────────────────────────────────────────────
// Popover for filtering by `since`. Renders preset buttons + a small
// calendar mock to communicate that custom ranges are supported.
function DateRangeChip({
  open,
  value = 'Last 7 days',
  active = true
}) {
  return /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    width: 360,
    align: "start",
    trigger: /*#__PURE__*/React.createElement("span", {
      className: "inline-block"
    }, /*#__PURE__*/React.createElement(SChip, {
      label: "Date range",
      value: value,
      active: active || open
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Updated within"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-1.5"
  }, [{
    label: 'Last 24 hours',
    count: 3,
    active: false
  }, {
    label: 'Last 7 days',
    count: 9,
    active: true
  }, {
    label: 'Last 30 days',
    count: 12,
    active: false
  }, {
    label: 'All time',
    count: 47,
    active: false
  }].map(p => /*#__PURE__*/React.createElement("button", {
    key: p.label,
    className: `flex items-center justify-between rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${p.active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`
  }, /*#__PURE__*/React.createElement("span", null, p.label), /*#__PURE__*/React.createElement("span", {
    className: `tabular-nums text-[10.5px] ${p.active ? 'text-white/70' : 'text-zinc-400'}`
  }, p.count))))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-100 px-3 py-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-1.5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Custom range"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] text-zinc-400"
  }, "May 2026")), /*#__PURE__*/React.createElement(MiniCalendar, null), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "calendar",
    value: "May 19",
    className: "h-7 flex-1",
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "\u2192"), /*#__PURE__*/React.createElement(SInput, {
    icon: "calendar",
    value: "May 26",
    className: "h-7 flex-1",
    size: "sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-3 py-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("code", {
    className: "font-mono text-[10.5px]"
  }, "?since=2026-05-19"), " \xB7 9 matches"), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    className: "ml-auto"
  }, "Clear"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm"
  }, "Apply")));
}

// Cheap visual calendar for the popover. Static, mid-range selected.
function MiniCalendar() {
  // May 2026: starts Friday (May 1 = Fri). 31 days.
  const days = [];
  for (let i = 0; i < 4; i++) days.push({
    pad: true
  }); // pad Sun-Wed
  for (let d = 1; d <= 31; d++) days.push({
    day: d
  });
  // Range selection: May 19 → May 26
  const inRange = d => d >= 19 && d <= 26;
  const isStart = d => d === 19;
  const isEnd = d => d === 26;
  return /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-1 grid grid-cols-7 gap-0.5 text-center font-medium text-zinc-400"
  }, ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, d))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-0.5"
  }, days.map((c, i) => {
    if (c.pad) return /*#__PURE__*/React.createElement("span", {
      key: i
    });
    const range = inRange(c.day);
    const start = isStart(c.day);
    const end = isEnd(c.day);
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      className: `inline-flex h-6 items-center justify-center text-[11px] font-medium tabular-nums ${start || end ? 'bg-zinc-900 text-white rounded-md' : range ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50 rounded-md'} ${start ? 'rounded-r-none' : end ? 'rounded-l-none' : ''}`
    }, c.day);
  })));
}

// ─── InboxCommentsList ──────────────────────────────────────────
// Full list. Filter toolbar at top, rows, infinite footer at the bottom.
function InboxCommentsList({
  view = {}
}) {
  const v = {
    search: '',
    // current search query
    dateRange: 'Last 7 days',
    // active preset
    dateRangeOpen: false,
    // popover state
    typeFilter: 'any',
    // any | conversation | review-inline | review-summary | file-level | commit
    unreadOnly: false,
    loading: false,
    // bottom sentinel state
    pagesLoaded: 2,
    // shown in the footer counter
    ...view
  };
  const search = (v.search || '').trim().toLowerCase();
  let rows = INBOX_COMMENTS;
  if (search) {
    rows = rows.filter(c => c.actor.includes(search) || c.title.toLowerCase().includes(search) || (c.file || '').toLowerCase().includes(search) || bodyText(c.body).toLowerCase().includes(search));
  }
  if (v.typeFilter && v.typeFilter !== 'any') rows = rows.filter(c => c.type === v.typeFilter);
  if (v.unreadOnly) rows = rows.filter(c => c.unread);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InboxCommentsToolbar, {
    v: v
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 flex-col items-center justify-center bg-zinc-50/40 px-8 py-16 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-5 text-zinc-400",
    strokeWidth: 1.7
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[14px] font-semibold text-zinc-900"
  }, "No comments match these filters."), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 max-w-sm text-[12px] text-zinc-500"
  }, search ? /*#__PURE__*/React.createElement(React.Fragment, null, "Nothing for \"", /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, v.search), "\" in the ", v.dateRange.toLowerCase(), ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "Try a longer date range or clear the type filter."))) : /*#__PURE__*/React.createElement(React.Fragment, null, rows.map(c => /*#__PURE__*/React.createElement(InboxCommentRow, {
    key: c.id,
    c: c,
    query: search
  })), /*#__PURE__*/React.createElement(InboxCommentsInfiniteFooter, {
    v: v,
    shown: rows.length
  }))));
}

// Plain-text walk for search. We don't need it to be perfect — title+
// actor matches will cover most cases; this catches body words too.
function bodyText(node) {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(bodyText).join(' ');
  if (React.isValidElement(node)) return bodyText(node.props?.children);
  return '';
}

// ─── InboxCommentsToolbar ───────────────────────────────────────
// Replaces the simple v3 filter row. Wider search, type chip with
// popover, date range chip, unread-only chip, repo chip.
function InboxCommentsToolbar({
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50/50 px-4 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Search comments, code, files\u2026",
    kbd: "\u2318F",
    value: v.search,
    className: "w-72"
  })), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-5"
  }), /*#__PURE__*/React.createElement(CommentTypeChip, {
    value: v.typeFilter
  }), /*#__PURE__*/React.createElement(DateRangeChip, {
    open: v.dateRangeOpen,
    value: v.dateRange,
    active: v.dateRange !== 'All time'
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Repo",
    value: "any"
  }), /*#__PURE__*/React.createElement(SChip, {
    label: "Unread only",
    active: !!v.unreadOnly
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-2 text-[11.5px] text-zinc-500"
  }, "Sorted by ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-700"
  }, "Updated \u2193"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-3"
  }), /*#__PURE__*/React.createElement(SKbd, null, "J"), /*#__PURE__*/React.createElement(SKbd, null, "K"), " navigate"));
}
function CommentTypeChip({
  value
}) {
  const active = value && value !== 'any';
  const cfg = active ? COMMENT_TYPE_CFG[value] : null;
  return /*#__PURE__*/React.createElement(SChip, {
    label: "Type",
    value: active ? cfg.label : 'any',
    active: active
  });
}

// ─── Infinite-list footer ───────────────────────────────────────
// Bottom of the list. Three states:
//   loading  — spinner + "Loading more…"
//   end      — soft end-of-feed message
//   idle     — count + an explicit "Load more" button
function InboxCommentsInfiniteFooter({
  v,
  shown
}) {
  if (v.loading) {
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
    })), /*#__PURE__*/React.createElement("span", null, "Loading page ", v.pagesLoaded + 1, "\u2026"), /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-300"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "tabular-nums"
    }, shown, " of ~120"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center gap-1.5 border-t border-zinc-100 px-4 py-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-check",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums text-zinc-700"
  }, shown), " shown \xB7 ", v.pagesLoaded, " ", v.pagesLoaded === 1 ? 'page' : 'pages', " loaded")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-3"
  }), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3.5"
  }), "Load more")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] text-zinc-400"
  }, "Scroll to auto-load \xB7 GitHub returns 100 / page \xB7 5,000 req/h budget"));
}

// ─── Exports ────────────────────────────────────────────────────
Object.assign(window, {
  InboxCommentsList,
  InboxCommentRow,
  InboxCommentSnippet,
  InboxCommentAttachment,
  AssocBadge,
  DateRangeChip,
  COMMENT_TYPE_CFG,
  INBOX_COMMENTS
});