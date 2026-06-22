// Empty / loading / error states. These get skipped in design and then look bad in code.

// ── Empty Inbox ───────────────────────────────────────────────
function EmptyInboxScreen({ width = 760, height = 520 }) {
  return (
    <PierWindow width={width} height={height} title="Inbox" subtitle="0 awaiting your review"
      appSidebar={<AppSidebar active="inbox" collapsed badges={{ inbox: 0 }}/>}
      appSidebarWidth={52}
    >
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 36, background: T.panel, textAlign: 'center',
      }}>
        {/* glyph */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: T.surface, border: `0.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 16,
        }}>
          <Icon name="check" size={26} color={T.pass} strokeWidth={2}/>
        </div>
        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
          Inbox zero
        </h2>
        <p style={{ margin: '8px 0 18px', fontSize: 13.5, color: T.text2, maxWidth: 380, lineHeight: 1.5 }}>
          Nothing is waiting on your review. New requests will appear here within 60 seconds and ping you in the macOS Notification Center.
        </p>
        {/* secondary CTAs */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="default" size="md" icon="dot">Mine · 8</Button>
          <Button kind="default" size="md" icon="dot">Participating · 14</Button>
        </div>
        <div style={{
          marginTop: 24, padding: '10px 14px', borderRadius: 8,
          background: T.surface, border: `0.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.text2,
          maxWidth: 420,
        }}>
          <Icon name="info" size={13} color={T.link}/>
          <span style={{ flex: 1, textAlign: 'left' }}>
            Last cleared <b style={{ color: T.text }}>11 min ago</b>. You've shipped 4 reviews today.
          </span>
        </div>
      </div>
    </PierWindow>
  );
}

// ── GitHub unreachable ────────────────────────────────────────
function OfflineScreen({ width = 760, height = 520 }) {
  return (
    <PierWindow
      width={width} height={height} title="Inbox" subtitle="Showing cached results · 12m old"
      appSidebar={<AppSidebar active="inbox" collapsed/>}
      appSidebarWidth={52}
      status={
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: T.fail }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.fail }}/>
            Offline · github.com unreachable
          </span>
          <span style={{ margin: '0 12px', color: T.border }}>│</span>
          <span>Retrying in <span style={{ color: T.text }}>14s</span> (attempt 4 of ∞)</span>
        </>
      }
    >
      {/* warning bar */}
      <div style={{
        flexShrink: 0, padding: '8px 16px', background: T.warnBg,
        borderBottom: `0.5px solid ${T.warnBd}`,
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: T.warnFg,
      }}>
        <Icon name="warning" size={14} color={T.warn}/>
        <span style={{ flex: 1 }}>
          <b>Working offline.</b> Showing what was on disk at 14:02. Comments you write will be queued and posted when GitHub is reachable again.
        </span>
        <Button kind="ghost" size="sm" icon="reload">Retry now</Button>
      </div>

      {/* skeleton list (greyed out) */}
      <div style={{ flex: 1, overflow: 'hidden', background: T.surface, opacity: 0.55, filter: 'saturate(0.6)' }}>
        {[
          { title: 'fix(billing): correct prorated charge math…', repo: 'eventmobi/api', age: '12m' },
          { title: 'RFC: cohort export pipeline', repo: 'eventmobi/analytics', age: '3h' },
          { title: 'Empty-state polish for event picker', repo: 'eventmobi/design-system', age: '7h' },
          { title: 'perf(diff-render): virtualise hunks…', repo: 'eventmobi/web-event-app', age: '1d' },
        ].map((p, i) => (
          <div key={i} style={{
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: `0.5px solid ${T.borderSoft}`,
          }}>
            <Icon name="pr-open" size={14} color={T.text3}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: T.text }}>{p.title}</div>
              <div style={{ fontSize: 12, color: T.text3 }}>{p.repo}</div>
            </div>
            <span style={{ fontSize: 11, color: T.text3 }}>{p.age}</span>
          </div>
        ))}
      </div>

      {/* outgoing queue */}
      <div style={{
        flexShrink: 0, borderTop: `0.5px solid ${T.border}`,
        padding: '10px 16px', background: T.panel, fontSize: 12, color: T.text2,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Icon name="clock" size={13}/>
        <span style={{ flex: 1 }}>
          <b style={{ color: T.text }}>2 pending writes</b> queued · 1 reply on #9217, 1 viewed-toggle on src/diff/VirtualHunk.tsx
        </span>
        <Button kind="ghost" size="sm">View queue</Button>
      </div>
    </PierWindow>
  );
}

// ── Loading large PR ──────────────────────────────────────────
function LoadingPRScreen({ width = 760, height = 520 }) {
  return (
    <PierWindow
      width={width} height={height}
      title="#9217" subtitle="perf(diff-render): virtualise hunks larger than 2k lines"
      appSidebar={<AppSidebar active="inbox" collapsed/>}
      appSidebarWidth={52}
      status={
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Spinner size={10}/>
            Fetching diff for 200 files…
          </span>
          <span style={{ flex: 1 }}/>
          <span style={{ color: T.text3 }}>This is a cold-cache open. Subsequent opens are &lt; 300 ms.</span>
        </>
      }
    >
      {/* fake tab strip — disabled */}
      <div style={{
        flexShrink: 0, display: 'flex', gap: 16, padding: '0 16px', height: 36, alignItems: 'center',
        borderBottom: `0.5px solid ${T.border}`, color: T.text3, fontSize: 13,
      }}>
        <span>Conversation</span>
        <span>Commits</span>
        <span>Checks</span>
        <span style={{ color: T.text, fontWeight: 600, borderBottom: `2px solid ${T.link}`, padding: '0 0 8px', marginBottom: -8 }}>Files changed</span>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* file rail skeleton */}
        <div style={{ width: 240, background: T.panel, borderRight: `0.5px solid ${T.border}`, padding: '8px 0' }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{
              height: 22, margin: '3px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: T.borderSoft, marginLeft: (i % 3) * 12 }}/>
              <div style={{ flex: 1, height: 8, borderRadius: 3, background: T.borderSoft, width: `${50 + (i * 13) % 40}%` }}/>
            </div>
          ))}
        </div>

        {/* diff skeleton */}
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* progress card */}
          <div style={{
            background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Spinner size={14}/>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Loading diff for 200-file PR</span>
              <div style={{ flex: 1 }}/>
              <span style={{ fontSize: 12, color: T.text2, fontVariantNumeric: 'tabular-nums' }}>118 / 200 files · 4.2 MB / 7.1 MB</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: T.borderSoft, overflow: 'hidden' }}>
              <div style={{ width: '59%', height: '100%', background: T.link, borderRadius: 2 }}/>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11.5, color: T.text3 }}>
              <span><Icon name="check" size={11} color={T.pass}/> Metadata loaded</span>
              <span><Icon name="check" size={11} color={T.pass}/> Threads loaded (31)</span>
              <span><Spinner size={9}/> Diff hunks · 118 / 200</span>
              <span style={{ color: T.text4 }}>○ Syntax highlight</span>
            </div>
          </div>

          {/* fake hunks */}
          {[80, 60, 40].map((w, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ height: 10, width: 160, background: T.borderSoft, borderRadius: 3 }}/>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 8, background: T.borderSoft, borderRadius: 2 }}/>
                  <div style={{ flex: 1, height: 8, background: j % 3 === 0 ? '#e6f4ea' : T.borderSoft, borderRadius: 2, maxWidth: `${w - j * 5}%` }}/>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PierWindow>
  );
}

// ── Auth invalid / token rejected ─────────────────────────────
function AuthErrorScreen({ width = 760, height = 520 }) {
  return (
    <PierWindow
      width={width} height={height} title="Inbox" subtitle="GitHub credentials invalid"
      appSidebar={<AppSidebar active="inbox" collapsed/>}
      appSidebarWidth={52}
      status={
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: T.fail }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.fail }}/>
            Disconnected · 401 Bad credentials
          </span>
          <span style={{ flex: 1 }}/>
          <span>Cached data is read-only</span>
        </>
      }
    >
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 36, background: T.panel,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: T.surface, border: `0.5px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Icon name="lock" size={24} color={T.fail} strokeWidth={1.6}/>
        </div>

        <h2 style={{ margin: 0, fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: T.text }}>
          GitHub rejected your token
        </h2>
        <p style={{ margin: '8px 0 18px', fontSize: 13.5, color: T.text2, maxWidth: 460, lineHeight: 1.5, textAlign: 'center' }}>
          The token in your Keychain returns <code style={codeStyle2()}>401 Bad credentials</code>.
          This usually means it was revoked, expired, or your org enabled SAML SSO and the token isn't authorized for it.
        </p>

        {/* diagnostic detail */}
        <div style={{
          width: 460, background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '12px 14px',
          fontSize: 12, marginBottom: 16,
        }}>
          <DiagRow label="Last successful call" value="14:02 · 1h 12m ago"/>
          <DiagRow label="Failing endpoint" value="GET /notifications" mono/>
          <DiagRow label="Response" value="HTTP 401 · Bad credentials" mono color={T.fail}/>
          <DiagRow label="Token prefix" value="ghp_3xK…BqR" mono/>
          <DiagRow last label="Keychain" value="present, last rotated 2025-11-04"/>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" size="md">Work offline</Button>
          <Button kind="primary" size="md" icon="key">Update token</Button>
        </div>
      </div>
    </PierWindow>
  );
}

function DiagRow({ label, value, mono, color, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0',
      borderBottom: last ? 'none' : `0.5px solid ${T.borderSoft}`,
    }}>
      <span style={{ width: 150, color: T.text2 }}>{label}</span>
      <span style={{ flex: 1, color: color || T.text, fontFamily: mono ? MONO : FONT, fontSize: mono ? 11.5 : 12 }}>{value}</span>
    </div>
  );
}

const codeStyle2 = () => ({
  fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 5px', borderRadius: 3,
});

Object.assign(window, { EmptyInboxScreen, OfflineScreen, LoadingPRScreen, AuthErrorScreen });
