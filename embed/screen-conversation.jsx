// PR detail — Conversation tab. Rendered description + timeline + threads. v1 read-only.

function ConversationScreen({ width = 1320, height = 820, from = 'inbox' }) {
  return (
    <PierWindow
      width={width} height={height}
      title="#9217" subtitle="perf(diff-render): virtualise hunks larger than 2k lines"
      appSidebar={<AppSidebar active={from === 'pulls' ? 'pulls' : 'inbox'}/>}
      toolbar={<PRHeaderActions/>}
      status={<PRStatusBar/>}
    >
      <PRHeader from={from}/>
      <PRTabStrip active="desc"/>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ConversationMain/>
        <ConversationRail/>
      </div>
    </PierWindow>
  );
}

function ConversationMain() {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: T.panel, padding: '20px 28px 32px' }}>
      <PRDescription/>
      <TimelineBlock>
        <TimelineCommitGroup
          who="nicolae-i" ago="1d ago"
          commits={[
            { sha: '3a1c7f2', msg: 'perf(diff): introduce VirtualHunk with line-window virtualisation' },
            { sha: 'b9e4cd8', msg: 'measureHunk: cache line widths per font family' },
            { sha: '21fce04', msg: 'wire VirtualHunk into NaiveHunk above 2k lines' },
          ]}/>
        <TimelineReview who="priya-r" state="approved" ago="22h ago" body="LGTM aside from the comment in VirtualHunk.tsx. Numbers are great — 600ms → 38ms on the 18k-line PR."/>
        <TimelineEvent kind="label-added" who="priya-r" ago="22h ago"
          body={<>added the <Label color="oklch(0.65 0.16 30)" text="performance"/> label</>}/>
        <TimelineThread/>
        <TimelineEvent kind="ref" who="github-actions" ago="14h ago"
          body={<>referenced this PR in <span style={{ fontFamily: MONO, fontSize: 11.5 }}>eventmobi/web-event-app#9242</span> · "follow-up: drop NaiveHunk path entirely"</>}/>
        <TimelineCommitGroup
          who="nicolae-i" ago="6h ago"
          commits={[
            { sha: 'f02ab1c', msg: 'address review: switch to useMemo for the threshold branch' },
            { sha: '8c7d219', msg: 'add measureHunk-called-once regression test' },
          ]}/>
        <TimelineReview who="marcus-w" state="changes" ago="2h ago" body="One blocker: this changes the public ResizeObserver contract on HunkWindow. The mobile target depends on the old shape. Can we add an adapter rather than break it?"/>
        <TimelineFileComment/>
      </TimelineBlock>
    </div>
  );
}

function PRDescription() {
  return (
    <div style={{
      background: T.surface, borderRadius: 10, border: `0.5px solid ${T.border}`,
      boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
      marginBottom: 20,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
        borderBottom: `0.5px solid ${T.borderSoft}`,
      }}>
        <Avatar name="nicolae-i" size={20}/>
        <span style={{ fontSize: 13, fontWeight: 600 }}>nicolae-i</span>
        <span style={{ fontSize: 12, color: T.text2 }}>opened this · 1d 4h ago</span>
        <div style={{ flex: 1 }}/>
        <Pill bg={T.sidebar2} color={T.text2}>edited 2h ago</Pill>
      </div>
      <div style={{ padding: '16px 18px', fontSize: 13.5, lineHeight: 1.55, color: T.text }}>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, letterSpacing: -0.2, marginBottom: 10 }}>
          Virtualise large hunks
        </h2>
        <p style={{ margin: '0 0 12px' }}>
          The 18k-line PR <a style={{ color: T.link, textDecoration: 'none' }}>#9081</a> spent 600ms parking a single hunk into the DOM
          on a fresh PR open, which trips the &lt; 50 ms intra-PR-switch budget badly. This PR introduces a
          <code style={codeStyle()}>VirtualHunk</code> that windows the line list under a fixed pixel budget.
        </p>
        <h3 style={{ margin: '14px 0 6px', fontSize: 14, fontWeight: 600 }}>Approach</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: T.text }}>
          <li>Below 2,000 lines: render the whole hunk synchronously (no behaviour change).</li>
          <li>At/above 2k: a windowed renderer measures line heights once, scrolls a virtual viewport.</li>
          <li>Threads are anchored to the line model, not the DOM node, so virtualisation doesn't lose them.</li>
        </ul>
        <h3 style={{ margin: '14px 0 6px', fontSize: 14, fontWeight: 600 }}>Numbers</h3>
        <div style={{
          background: T.panel, border: `0.5px solid ${T.border}`, borderRadius: 6,
          padding: '8px 12px', fontFamily: MONO, fontSize: 11.5, color: T.text, lineHeight: 1.6,
          marginBottom: 10,
        }}>
          18,412-line hunk, M2 Air, dev build<br/>
          parse + render: 612ms → 38ms<br/>
          steady-state scroll: 24fps → 60fps<br/>
          memory peak: 184MB → 41MB
        </div>
        <h3 style={{ margin: '14px 0 6px', fontSize: 14, fontWeight: 600 }}>Out of scope</h3>
        <p style={{ margin: 0 }}>
          NaiveHunk is kept for the small-hunk path. <a style={{ color: T.link, textDecoration: 'none' }}>#9242</a> tracks
          dropping it entirely once we're confident.
        </p>
      </div>
    </div>
  );
}
const codeStyle = () => ({
  fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 5px', borderRadius: 3,
});

function TimelineBlock({ children }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 19, top: 6, bottom: 6, width: 1, background: T.border }}/>
      {children}
    </div>
  );
}

function TimelineNode({ icon, color, big }) {
  return (
    <div style={{
      width: big ? 36 : 26, height: big ? 36 : 26, borderRadius: '50%',
      background: T.surface, border: `0.5px solid ${T.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      marginLeft: big ? -3 : 3, position: 'relative', zIndex: 1,
      boxShadow: '0 0 0 4px ' + T.panel,
    }}>
      <Icon name={icon} size={big ? 16 : 12} color={color}/>
    </div>
  );
}

function TimelineCommitGroup({ who, ago, commits }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
      <TimelineNode icon="branch" color={T.text2}/>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ fontSize: 12, color: T.text2, marginBottom: 6 }}>
          <b style={{ color: T.text }}>{who}</b> pushed {commits.length} commits · {ago}
        </div>
        <div style={{
          background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8,
          overflow: 'hidden',
        }}>
          {commits.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '7px 12px',
              borderTop: i ? `0.5px solid ${T.borderSoft}` : 'none', fontSize: 12.5,
            }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3, width: 60 }}>{c.sha}</span>
              <span style={{ flex: 1, color: T.text }}>{c.msg}</span>
              <Icon name="external" size={11} color={T.text3}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineReview({ who, state, ago, body }) {
  const meta = {
    approved: { icon: 'check-circle', color: T.pass, label: 'approved these changes' },
    changes:  { icon: 'x-circle',     color: T.fail, label: 'requested changes' },
    commented:{ icon: 'comment',      color: T.text2, label: 'left a review' },
  }[state];
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
      <TimelineNode icon={meta.icon} color={meta.color} big/>
      <div style={{
        flex: 1, background: T.surface, borderRadius: 10, border: `0.5px solid ${T.border}`,
        boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <div style={{
          padding: '10px 14px', borderBottom: `0.5px solid ${T.borderSoft}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Avatar name={who} size={18}/>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{who}</span>
          <span style={{ fontSize: 12.5, color: T.text2 }}>{meta.label}</span>
          <Pill bg={state === 'approved' ? T.successBg : state === 'changes' ? T.failTint : T.sidebar2}
                color={state === 'approved' ? T.pass : state === 'changes' ? T.fail : T.text2} weight={600}>
            {state === 'approved' ? 'Approved' : state === 'changes' ? 'Changes requested' : 'Comment'}
          </Pill>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11.5, color: T.text3 }}>{ago}</span>
        </div>
        <div style={{ padding: '12px 14px', fontSize: 13, lineHeight: 1.55, color: T.text }}>{body}</div>
      </div>
    </div>
  );
}

function TimelineEvent({ kind, who, ago, body }) {
  const icon = { 'label-added': 'dot', 'ref': 'external', 'reviewer-added': 'eye', 'closed': 'x' }[kind] || 'dot';
  return (
    <div style={{ display: 'flex', gap: 12, padding: '4px 0', alignItems: 'center' }}>
      <TimelineNode icon={icon} color={T.text3}/>
      <div style={{ flex: 1, fontSize: 12.5, color: T.text2, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={who} size={16}/>
        <span><b style={{ color: T.text }}>{who}</b> {body}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, color: T.text3 }}>{ago}</span>
      </div>
    </div>
  );
}

function TimelineThread() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
      <TimelineNode icon="comment-fill" color={T.link} big/>
      <div style={{
        flex: 1, background: T.surface, borderRadius: 10, border: `0.5px solid ${T.border}`,
        overflow: 'hidden', boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
      }}>
        <div style={{
          padding: '8px 14px', borderBottom: `0.5px solid ${T.borderSoft}`,
          display: 'flex', alignItems: 'center', gap: 8, background: T.surface2,
        }}>
          <Icon name="file" size={12} color={T.text2}/>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.text }}>src/diff/VirtualHunk.tsx</span>
          <span style={{ fontSize: 11.5, color: T.text3 }}>line 20</span>
          <div style={{ flex: 1 }}/>
          <Pill bg={T.successBg} color={T.pass} weight={600}>resolved</Pill>
        </div>
        <ThreadComment author="marcus-w" ago="14h ago" body={<>The <code style={codeStyle()}>VIRTUALISE_THRESHOLD</code> comment in measureHunk.ts still says 500 — keep them in sync.</>}/>
        <ThreadComment border author="nicolae-i" ago="13h ago" body={<>Fixed in <span style={{ fontFamily: MONO, fontSize: 11.5 }}>8c7d219</span>.</>}/>
      </div>
    </div>
  );
}

function TimelineFileComment() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
      <TimelineNode icon="file" color={T.text2}/>
      <div style={{
        flex: 1, background: T.surface, borderRadius: 10, border: `0.5px solid ${T.border}`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 14px', borderBottom: `0.5px solid ${T.borderSoft}`,
          display: 'flex', alignItems: 'center', gap: 8, background: T.surface2,
        }}>
          <Icon name="file" size={12} color={T.text2}/>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.text }}>src/diff/VirtualHunk.test.tsx</span>
          <span style={{ fontSize: 11.5, color: T.text3 }}>· file-level</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 11.5, color: T.text3 }}>1h ago</span>
        </div>
        <ThreadComment author="alex-cho" you ago="1h ago" body={<>Big picture: I'd love a separate test file for the scroll branch — this one is doing a lot. Not blocking; happy to defer.</>}/>
      </div>
    </div>
  );
}

// ── Right rail with metadata ─────────────────────────────────
function ConversationRail() {
  return (
    <div style={{
      width: 280, flexShrink: 0, background: T.surface,
      borderLeft: `0.5px solid ${T.border}`,
      padding: '16px 18px', overflow: 'auto',
    }}>
      <RailSection title="Reviewers" action="Manage">
        <RailRow><ReviewerChip name="alex-cho" state="pending"/> <RailName>alex-cho</RailName> <RailState color={T.warn}>Pending · you</RailState></RailRow>
        <RailRow><ReviewerChip name="priya-r" state="approved"/> <RailName>priya-r</RailName> <RailState color={T.pass}>Approved</RailState></RailRow>
        <RailRow><ReviewerChip name="marcus-w" state="changes"/> <RailName>marcus-w</RailName> <RailState color={T.fail}>Requested changes</RailState></RailRow>
        <RailRow><ReviewerChip name="jules-k" state="commented"/> <RailName>jules-k</RailName> <RailState color={T.text3}>Commented</RailState></RailRow>
      </RailSection>

      <RailSection title="Assignees">
        <RailRow><Avatar name="nicolae-i" size={16}/> <RailName>nicolae-i</RailName></RailRow>
      </RailSection>

      <RailSection title="Labels">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Label color="oklch(0.65 0.16 30)" text="performance"/>
          <Label color="oklch(0.70 0.10 240)" text="needs-design-review"/>
          <Label color="oklch(0.78 0.10 100)" text="v1-budget"/>
        </div>
      </RailSection>

      <RailSection title="Linked issues">
        <RailRow>
          <Icon name="dot-circle" size={13} color={T.open}/>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.text3 }}>#9081</span>
          <span style={{ fontSize: 12.5, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Large PRs janky on M2</span>
        </RailRow>
      </RailSection>

      <RailSection title="Milestone">
        <RailRow>
          <Icon name="warning" size={13} color={T.warn}/>
          <span style={{ fontSize: 12.5 }}>v1 performance budget</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, color: T.text3 }}>74%</span>
        </RailRow>
        <div style={{ height: 3, background: T.borderSoft, borderRadius: 2, marginTop: 6 }}>
          <div style={{ width: '74%', height: '100%', background: T.link, borderRadius: 2 }}/>
        </div>
      </RailSection>

      <RailSection title="Participants · 6">
        <div style={{ display: 'flex', gap: 4 }}>
          {['nicolae-i','alex-cho','priya-r','marcus-w','jules-k','sara-l'].map(n => <Avatar key={n} name={n} size={22}/>)}
        </div>
      </RailSection>
    </div>
  );
}

function RailSection({ title, action, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: T.text3,
        marginBottom: 8,
      }}>
        <span>{title}</span>
        {action && <span style={{ color: T.link, fontSize: 11, cursor: 'pointer', letterSpacing: 0 }}>{action}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}
function RailRow({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>{children}</div>;
}
function RailName({ children }) {
  return <span style={{ flex: 1, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>;
}
function RailState({ children, color }) {
  return <span style={{ color, fontSize: 11.5, fontWeight: 500 }}>{children}</span>;
}

Object.assign(window, { ConversationScreen });
