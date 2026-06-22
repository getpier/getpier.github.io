// Inbox · comments view — alternative landing where the rows ARE comments,
// not PRs. Sorted by most recent comment. Clicking deep-links into the PR
// detail's Files Changed tab and jumps to the anchored comment.
//
// Keeps the same chrome (PierWindow + sidebar) as the PR-list inbox so they
// feel like two settings on the same screen, not two different products.

const COMMENT_FEED = [
  {
    id: 'c1', kind: 'reply', unread: true,
    author: 'priya-r', ago: '14m',
    pr: { num: 9217, title: 'perf(diff-render): virtualise hunks larger than 2k lines', repo: 'eventmobi/web-event-app' },
    anchor: { file: 'src/diff/VirtualHunk.tsx', line: 20 },
    threadParticipants: ['alex-cho', 'nicolae-i', 'priya-r'],
    threadCount: 3,
    body: <>Could you also add a unit test that asserts <code>measureHunk</code> is called exactly once per mount? We had a regression on this last quarter.</>,
    youAre: 'thread-starter',
  },
  {
    id: 'c2', kind: 'review-changes', unread: true,
    author: 'marcus-w', ago: '2h',
    pr: { num: 9217, title: 'perf(diff-render): virtualise hunks larger than 2k lines', repo: 'eventmobi/web-event-app' },
    body: <>One blocker: this changes the public <code>ResizeObserver</code> contract on HunkWindow. The mobile target depends on the old shape. Can we add an adapter rather than break it?</>,
  },
  {
    id: 'c3', kind: 'mention', unread: true,
    author: 'sara-l', ago: '3h',
    pr: { num: 308, title: 'RFC: cohort export pipeline (S3 + Athena)', repo: 'eventmobi/analytics' },
    anchor: { file: 'docs/cohort-export.md', line: 142 },
    body: <>@alex-cho — flagging you on the partition-key choice here, since you owned this for the events table last quarter. Open to switching to event_date.</>,
  },
  {
    id: 'c4', kind: 'comment', unread: false,
    author: 'jules-k', ago: '5h',
    pr: { num: 612, title: 'Empty-state polish for event picker on small viewports', repo: 'eventmobi/design-system' },
    anchor: { file: 'src/EventPicker/Empty.tsx', line: 24 },
    body: <>Mounted this on iPad portrait — the illustration clips at 768. Want me to add a media query here, or do we treat &lt;800 as a separate breakpoint everywhere?</>,
  },
  {
    id: 'c5', kind: 'reply', unread: false,
    author: 'nicolae-i', ago: '6h',
    pr: { num: 9217, title: 'perf(diff-render): virtualise hunks larger than 2k lines', repo: 'eventmobi/web-event-app' },
    anchor: { file: 'src/diff/VirtualHunk.tsx', line: 20 },
    threadParticipants: ['alex-cho', 'nicolae-i'],
    threadCount: 2,
    body: <>Good catch. I had it as <code>useMemo</code> originally; switched when I added the scroll handler. I'll roll it back here and bring the scroll branch over in the next push.</>,
    youAre: 'thread-starter',
  },
  {
    id: 'c6', kind: 'review-approve', unread: false,
    author: 'priya-r', ago: '22h',
    pr: { num: 9217, title: 'perf(diff-render): virtualise hunks larger than 2k lines', repo: 'eventmobi/web-event-app' },
    body: <>LGTM aside from the comment in VirtualHunk.tsx. Numbers are great — 600 ms → 38 ms on the 18k-line PR.</>,
  },
  {
    id: 'c7', kind: 'resolved', unread: false,
    author: 'marcus-w', ago: '1d',
    pr: { num: 4471, title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle', repo: 'eventmobi/api' },
    anchor: { file: 'src/billing/proration.ts', line: 88 },
    body: <>Resolved · "Off-by-one in the partial-month divisor" — fixed in <span style={{ fontFamily: MONO, fontSize: 11.5 }}>4d29ab1</span>.</>,
  },
  {
    id: 'c8', kind: 'comment', unread: false,
    author: 'alex-cho', ago: '1d',
    you: true,
    pr: { num: 4471, title: 'fix(billing): correct prorated charge math when plan downgrades mid-cycle', repo: 'eventmobi/api' },
    anchor: { file: 'src/billing/proration.ts', line: 88 },
    body: <>Worth adding a property test against the old behaviour so we catch it if the divisor logic regresses.</>,
  },
  {
    id: 'c9', kind: 'mention', unread: false,
    author: 'jules-k', ago: '2d',
    pr: { num: 9198, title: 'spike: replace Redux with Zustand on the attendee dashboard', repo: 'eventmobi/web-event-app' },
    body: <>@alex-cho when you're back from PTO — this overlaps with the route-loader refactor on your branch. Want to sync before we land either?</>,
  },
];

const KIND_META = {
  'reply':           { icon: 'comment-fill', color: T.link,   verb: 'replied on' },
  'comment':         { icon: 'comment',      color: T.text2,  verb: 'commented on' },
  'mention':         { icon: 'comment-fill', color: '#8e4ec6',verb: 'mentioned you in' },
  'review-changes':  { icon: 'x-circle',     color: T.fail,   verb: 'requested changes on' },
  'review-approve':  { icon: 'check-circle', color: T.pass,   verb: 'approved' },
  'resolved':        { icon: 'check',        color: T.pass,   verb: 'resolved a thread on' },
};

function CommentsInboxScreen({ width = 1320, height = 820 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Inbox" subtitle="Comments · 5 unread"
      appSidebar={<AppSidebar active="inbox"/>}
      toolbar={<CommentsInboxToolbar/>}
      status={<InboxStatus/>}
    >
      <CommentsFilterBar/>
      <CommentsList/>
    </PierWindow>
  );
}

function CommentsInboxToolbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '0 8px', height: 24, borderRadius: 5,
        background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
        width: 220,
      }}>
        <Icon name="search" size={12} color={T.text3}/>
        <span style={{ flex: 1, fontSize: 12, color: T.text3 }}>Filter comments…</span>
        <Kbd>⌘F</Kbd>
      </div>
      <Button kind="ghost" size="sm" icon="check">Mark all read</Button>
      <Button kind="ghost" size="sm" icon="refresh">Refresh</Button>
    </div>
  );
}

function CommentsFilterBar() {
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
        <Tab label="Comments" count="9" active color={T.link}/>
        <Tab label="PRs" count="32" color={T.text3}/>
      </div>
      <div style={{ width: 1, height: 16, background: T.border, margin: '0 4px' }}/>
      <Pill bg={T.unreadBg} color={T.link} weight={600}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.unread }}/>
        Unread · 5
      </Pill>
      <Pill bg="transparent" color={T.text2}>Mentions · 2</Pill>
      <Pill bg="transparent" color={T.text2}>On my PRs · 4</Pill>
      <Pill bg="transparent" color={T.text2}>Replies to me · 1</Pill>
      <div style={{ flex: 1 }}/>
      <span style={{ fontSize: 11.5, color: T.text3 }}>Sort: newest first</span>
    </div>
  );
}

function CommentsList() {
  // Sort by recency — already in the seed data — and group by "Today" / "Yesterday"
  // for legibility. Within each band, every row is a single comment event.
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.surface }}>
      <CommentsGroup label="Today">
        {COMMENT_FEED.filter(c => /m|h/.test(c.ago)).map((c, i) => <CommentRow key={c.id} c={c} selected={i === 0}/>)}
      </CommentsGroup>
      <CommentsGroup label="Yesterday">
        {COMMENT_FEED.filter(c => c.ago === '1d').map(c => <CommentRow key={c.id} c={c}/>)}
      </CommentsGroup>
      <CommentsGroup label="Earlier this week">
        {COMMENT_FEED.filter(c => c.ago === '2d').map(c => <CommentRow key={c.id} c={c}/>)}
      </CommentsGroup>
    </div>
  );
}

function CommentsGroup({ label, children }) {
  return (
    <>
      <div style={{
        position: 'sticky', top: 0,
        padding: '6px 16px 5px', display: 'flex', alignItems: 'center', gap: 8,
        background: T.surface2, borderBottom: `0.5px solid ${T.border}`,
        fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.text3,
        zIndex: 1,
      }}>
        <Icon name="chevron-down" size={10}/>
        <span>{label}</span>
      </div>
      {children}
    </>
  );
}

function CommentRow({ c, selected }) {
  const meta = KIND_META[c.kind];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 16px', borderBottom: `0.5px solid ${T.borderSoft}`,
      background: selected ? 'rgba(10,132,255,0.07)' : 'transparent',
      position: 'relative', cursor: 'pointer',
    }}>
      {selected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: T.link }}/>}

      {/* unread dot column */}
      <div style={{ width: 8, paddingTop: 7, flexShrink: 0 }}>
        {c.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.unread }}/>}
      </div>

      {/* avatar */}
      <div style={{ position: 'relative', flexShrink: 0, paddingTop: 1 }}>
        <Avatar name={c.author} size={28}/>
        <span style={{
          position: 'absolute', right: -3, bottom: -3,
          width: 16, height: 16, borderRadius: '50%',
          background: T.windowBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1.5px solid ${T.windowBg}`,
        }}>
          <Icon name={meta.icon} size={11} color={meta.color}/>
        </span>
      </div>

      {/* main column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* header row: author + verb + PR ref */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 12.5 }}>
          <span style={{ color: T.text, fontWeight: 600 }}>{c.you ? 'You' : c.author}</span>
          <span style={{ color: T.text2 }}>{meta.verb}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>#{c.pr.num}</span>
          <span style={{
            color: T.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', maxWidth: 360,
          }}>{c.pr.title}</span>
          {c.youAre === 'thread-starter' && (
            <Pill bg={T.unreadBg} color={T.link} weight={600}>your thread</Pill>
          )}
          {c.kind === 'mention' && (
            <Pill bg="#f5edff" color="#7c3aed" weight={600}>@you</Pill>
          )}
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, color: T.text3, fontVariantNumeric: 'tabular-nums' }}>{c.ago}</span>
        </div>

        {/* anchor strip — file + line (if applicable) */}
        {c.anchor && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
            fontSize: 11, color: T.text2,
          }}>
            <Icon name="file" size={11} color={T.text3}/>
            <span style={{ fontFamily: MONO, fontSize: 10.5 }}>{c.anchor.file}</span>
            <span style={{ color: T.text4 }}>·</span>
            <span style={{ fontFamily: MONO, fontSize: 10.5 }}>line {c.anchor.line}</span>
            <span style={{ color: T.text4 }}>·</span>
            <span>{c.pr.repo}</span>
          </div>
        )}
        {!c.anchor && (
          <div style={{ marginBottom: 6, fontSize: 11, color: T.text2 }}>
            <span>{c.pr.repo}</span>
            <span style={{ color: T.text4, margin: '0 6px' }}>·</span>
            <span>{c.kind === 'review-changes' ? 'Review summary' : c.kind === 'review-approve' ? 'Review summary' : 'Top-level comment'}</span>
          </div>
        )}

        {/* body — single-line clamped on hover, two-line on inbox */}
        <div style={{
          fontSize: 13, color: T.text, lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{c.body}</div>

        {/* thread tail — participants + count */}
        {c.threadCount > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
            fontSize: 11.5, color: T.text2,
          }}>
            <div style={{ display: 'flex' }}>
              {c.threadParticipants.map((p, i) => (
                <div key={p} style={{ marginLeft: i ? -4 : 0, border: `1.5px solid ${T.surface}`, borderRadius: '50%' }}>
                  <Avatar name={p} size={16}/>
                </div>
              ))}
            </div>
            <span><b style={{ color: T.text, fontWeight: 600 }}>{c.threadCount} comments</b> in thread</span>
            <span style={{ color: T.text4 }}>·</span>
            <span style={{ color: T.link, cursor: 'pointer' }}>Show thread →</span>
          </div>
        )}
      </div>

      {/* right column — action buttons */}
      <div style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        gap: 6, paddingTop: 1,
      }}>
        <Button kind="default" size="sm" icon="external">Open in diff</Button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button title="Mark read" style={miniBtn()}><Icon name="check" size={11}/></button>
          <button title="Reply" style={miniBtn()}><Icon name="comment" size={11}/></button>
          <button title="Mute" style={miniBtn()}><Icon name="eye-off" size={11}/></button>
        </div>
      </div>
    </div>
  );
}

function miniBtn() {
  return {
    width: 24, height: 22, borderRadius: 4,
    background: T.surface, border: `0.5px solid ${T.borderStrong}`,
    color: T.text2, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

Object.assign(window, { CommentsInboxScreen });
