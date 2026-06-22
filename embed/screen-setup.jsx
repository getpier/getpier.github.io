// First-launch setup screen — PAT instructions, scope explanation, paste field, validation.
// Two-pane layout: instructional copy + screenshots on left, paste field + validation on right.

function SetupScreen({ width = 920, height = 660, state = 'validated' }) {
  // state: 'idle' | 'validating' | 'validated' | 'error'
  return (
    <PierWindow width={width} height={height} title="Pier" subtitle="Set up GitHub access">
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* LEFT — instructions */}
        <div style={{
          width: 460, padding: '28px 32px',
          borderRight: `0.5px solid ${T.border}`, background: T.panel,
          overflow: 'auto',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
            color: T.text3, marginBottom: 10,
          }}>Step 1 of 1 · Connect GitHub</div>
          <h1 style={{
            margin: 0, fontFamily: DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -0.4,
            color: T.text, lineHeight: 1.2,
          }}>Paste a Personal Access&nbsp;Token</h1>
          <p style={{ marginTop: 8, marginBottom: 18, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>
            Pier reads PRs directly from GitHub using your account. The token stays
            in your macOS Keychain. We don't run a server.
          </p>

          {/* numbered steps */}
          <Step n="1" label="Open GitHub → Settings → Developer settings → Personal access tokens (classic)">
            <ExternalLink>github.com/settings/tokens</ExternalLink>
          </Step>

          <Step n="2" label="Click 'Generate new token (classic)'. Give it a name like “Pier”.">
            <MockScreenshot kind="generate"/>
          </Step>

          <Step n="3" label="Tick exactly these four scopes — no more, no less.">
            <ScopeList/>
          </Step>

          <Step n="4" label="Copy the token. GitHub shows it once." last>
            <div style={{
              padding: '8px 10px', borderRadius: 6,
              background: T.warnBg, border: `0.5px solid ${T.warnBd}`,
              color: T.warnFg, fontSize: 12, display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <Icon name="info" size={14} color={T.warn}/>
              <span><b>SSO orgs:</b> after creating the token, click "Configure SSO" next to it and authorize the orgs you review for. No admin approval needed.</span>
            </div>
          </Step>
        </div>

        {/* RIGHT — paste & validate */}
        <div style={{ flex: 1, padding: '28px 36px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
            color: T.text3, marginBottom: 10,
          }}>Token</div>

          {/* paste field */}
          <div style={{
            border: `1px solid ${state === 'error' ? T.fail : (state === 'validated' ? T.pass : T.borderStrong)}`,
            borderRadius: 8, background: T.inputBg,
            boxShadow: state === 'validated' ? '0 0 0 3px rgba(48,161,76,0.10)'
                     : state === 'error'     ? '0 0 0 3px rgba(210,66,74,0.10)'
                     : '0 0 0 3px rgba(10,132,255,0.10)',
            transition: 'all 120ms ease',
          }}>
            <div style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: MONO, fontSize: 13, color: T.text,
            }}>
              <Icon name="key" size={14} color={T.text3}/>
              <span style={{ flex: 1, letterSpacing: 0.5 }}>
                ghp_3xK<span style={{ color: T.text3 }}>•••••••••••••••••••••••••••••••</span>BqR
              </span>
              {state === 'validating' && <Spinner size={14}/>}
              {state === 'validated' && <Icon name="check-circle" size={16} color={T.pass}/>}
              {state === 'error' && <Icon name="x-circle" size={16} color={T.fail}/>}
            </div>
          </div>

          {/* validation panel */}
          {state === 'validated' && (
            <div style={{
              marginTop: 14, padding: '14px 16px',
              background: T.successBg, border: `0.5px solid ${T.successBd}`, borderRadius: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon name="check-circle" size={15} color={T.pass}/>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Connected as alex-cho</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 6, fontSize: 12 }}>
                <span style={{ color: T.text2 }}>Account</span>
                <span>Alex Cho · <span style={{ color: T.text2 }}>alex@eventmobi.com</span></span>
                <span style={{ color: T.text2 }}>Scopes</span>
                <span style={{ fontFamily: MONO, fontSize: 11.5 }}>repo, notifications, read:org, read:user</span>
                <span style={{ color: T.text2 }}>Rate limit</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>4,983 / 5,000 · resets in 58m</span>
                <span style={{ color: T.text2 }}>SSO orgs</span>
                <span>eventmobi <span style={{ color: T.pass }}>✓</span> · stripe <span style={{ color: T.warn }}>needs SSO</span></span>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div style={{
              marginTop: 14, padding: '14px 16px',
              background: T.failBg, border: `0.5px solid ${T.failBd}`, borderRadius: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon name="x-circle" size={15} color={T.fail}/>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Token rejected</span>
              </div>
              <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.5 }}>
                GitHub returned <code style={{ fontFamily: MONO, fontSize: 11 }}>401 Bad credentials</code>.
                Check it begins with <code style={{ fontFamily: MONO, fontSize: 11 }}>ghp_</code> and was copied in full.
              </div>
            </div>
          )}

          {/* Why these scopes */}
          <div style={{ marginTop: 22 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase',
              color: T.text3, marginBottom: 10,
            }}>Why these scopes</div>
            <ScopeReason scope="repo" reason="Read PR diffs, threads, viewed-state. Required for private repos."/>
            <ScopeReason scope="notifications" reason="Detect new activity without polling every PR individually."/>
            <ScopeReason scope="read:org" reason="Resolve team review requests into PRs in your Inbox."/>
            <ScopeReason scope="read:user" reason="Show your own avatar &amp; identify the “@me” in queries."/>
          </div>

          <div style={{ flex: 1 }}/>

          <div style={{
            paddingTop: 18, borderTop: `0.5px solid ${T.border}`, marginTop: 18,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ flex: 1, fontSize: 12, color: T.text3 }}>
              Stored in <span style={{ color: T.text2 }}>Keychain</span> under <code style={{ fontFamily: MONO, fontSize: 11 }}>app.pier.review</code>
            </span>
            <Button kind="ghost" size="md">Skip</Button>
            <Button kind="primary" size="md" icon={state === 'validated' ? 'check' : undefined}>
              {state === 'validated' ? 'Open Inbox' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </PierWindow>
  );
}

function Step({ n, label, children, last }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: last ? 0 : 16, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: T.surface, border: `1px solid ${T.borderStrong}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, color: T.text2,
        }}>{n}</div>
        {!last && <div style={{ width: 1, flex: 1, background: T.border, marginTop: 4 }}/>}
      </div>
      <div style={{ flex: 1, paddingTop: 1, paddingBottom: 4 }}>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.45, marginBottom: children ? 8 : 0 }}>{label}</div>
        {children}
      </div>
    </div>
  );
}

function ExternalLink({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 8px', borderRadius: 5,
      background: T.surface, border: `0.5px solid ${T.borderStrong}`,
      fontFamily: MONO, fontSize: 11.5, color: T.link, cursor: 'pointer',
    }}>
      {children}
      <Icon name="external" size={11} color={T.link}/>
    </span>
  );
}

function MockScreenshot({ kind }) {
  // Tiny stylized screenshot of github settings — striped placeholder vibe
  return (
    <div style={{
      width: '100%', height: 96, borderRadius: 6,
      background: T.surface, border: `0.5px solid ${T.border}`,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 18, background: T.surface3, borderBottom: `0.5px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: 1, background: T.borderStrong }}/>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.text3 }}>github.com/settings/tokens/new</div>
      </div>
      <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 8, width: '40%', background: T.borderSoft, borderRadius: 2 }}/>
        <div style={{ height: 22, background: T.surface, border: `0.5px solid ${T.borderStrong}`, borderRadius: 3, display: 'flex', alignItems: 'center', padding: '0 6px', fontFamily: MONO, fontSize: 9, color: T.text3 }}>Pier</div>
        <div style={{ height: 16, background: T.pass, borderRadius: 3, width: 86, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 600 }}>Generate token</div>
      </div>
    </div>
  );
}

function ScopeList() {
  const scopes = [
    { name: 'repo', sub: 'Full control of private repositories', on: true, required: true },
    { name: 'notifications', sub: 'Access notifications', on: true, required: true },
    { name: 'read:org', sub: 'Read org & team membership', on: true, required: true },
    { name: 'read:user', sub: 'Read user profile data', on: true, required: true },
    { name: 'workflow', sub: 'Update GitHub Action workflows', on: false },
  ];
  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 6,
      overflow: 'hidden',
    }}>
      {scopes.map((s, i) => (
        <div key={s.name} style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 10px',
          borderTop: i ? `0.5px solid ${T.borderSoft}` : 'none',
          background: s.required ? T.successBg : 'transparent',
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: 3,
            background: s.on ? T.pass : T.surface,
            border: `0.5px solid ${s.on ? T.pass : T.borderStrong}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            marginTop: 1,
          }}>
            {s.on && <Icon name="check" size={10} color="#fff"/>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.text, fontWeight: 500 }}>{s.name}</div>
            <div style={{ fontSize: 11, color: T.text2 }}>{s.sub}</div>
          </div>
          {s.required && <span style={{ fontSize: 10, color: T.pass, fontWeight: 600, marginTop: 2 }}>REQUIRED</span>}
        </div>
      ))}
    </div>
  );
}

function ScopeReason({ scope, reason }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '6px 0', alignItems: 'flex-start' }}>
      <span style={{
        fontFamily: MONO, fontSize: 11, color: T.text, fontWeight: 600,
        background: T.codeBg, padding: '2px 6px', borderRadius: 3,
        flexShrink: 0, marginTop: 1,
      }}>{scope}</span>
      <span style={{ fontSize: 12, color: T.text2, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: reason }}/>
    </div>
  );
}

function Spinner({ size = 14 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `2px solid ${T.border}`, borderTopColor: T.link,
      animation: 'spin 0.8s linear infinite',
    }}/>
  );
}

Object.assign(window, { SetupScreen });
