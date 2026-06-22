// Settings page — 4 sections: Account, GitHub API usage, Diff preferences,
// Appearance. Native macOS settings shape: sidebar nav on the left, scrolling
// content on the right. Lives inside the existing PierWindow chrome.

function SettingsScreen({ width = 1320, height = 820, active = 'general' }) {
  return (
    <PierWindow
      width={width} height={height}
      title="Settings" subtitle="Preferences are stored on this device"
      appSidebar={<AppSidebar active="settings"/>}
      sidebar={<SettingsNav active={active}/>}
      sidebarWidth={220}
      status={
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.pass }}/>
            Saved locally · no sync
          </span>
          <span style={{ margin: '0 12px', color: T.border }}>│</span>
          <span>~/Library/Application Support/Pier/preferences.json</span>
          <span style={{ flex: 1 }}/>
          <span><Kbd>⌘,</Kbd> toggle Settings · <Kbd>⌘⇧T</Kbd> toggle theme</span>
        </>
      }
    >
      <div style={{ flex: 1, overflow: 'auto', background: T.panel }}>
        <div style={{ maxWidth: 720, padding: '28px 36px 60px', margin: '0 auto' }}>
          <AccountSection/>
          <ApiUsageSection/>
          <DiffPrefsSection/>
          <AppearanceSection/>
        </div>
      </div>
    </PierWindow>
  );
}

function SettingsNav({ active }) {
  const items = [
    { id: 'general',     label: 'General',         icon: 'sliders' },
    { id: 'account',     label: 'Account',         icon: 'user',          selected: true },
    { id: 'api',         label: 'GitHub API',      icon: 'commit' },
    { id: 'diff',        label: 'Diff preferences', icon: 'file' },
    { id: 'appearance',  label: 'Appearance',      icon: 'eye' },
    { id: 'notifs',      label: 'Notifications',   icon: 'comment' },
    { id: 'keyboard',    label: 'Keyboard',        icon: 'commit' },
    { id: 'cache',       label: 'Cache & storage', icon: 'folder' },
    { id: 'advanced',    label: 'Advanced',        icon: 'kebab' },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingTop: 8 }}>
      <SidebarSection title="Settings">
        {items.map(i => (
          <SidebarItem key={i.id} icon={i.icon} label={i.label} selected={i.selected}/>
        ))}
      </SidebarSection>
      <div style={{ height: 12 }}/>
      <SidebarSection title="About">
        <SidebarItem icon="info" label="What's new" />
        <SidebarItem icon="external" label="Release notes" />
        <SidebarItem icon="external" label="Send feedback" />
      </SidebarSection>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────
function SettingsSection({ title, subtitle, children, first }) {
  return (
    <section style={{
      paddingTop: first ? 0 : 36,
      paddingBottom: 28,
      borderTop: first ? 'none' : `0.5px solid ${T.border}`,
      marginTop: first ? 0 : 24,
    }}>
      <h2 style={{
        margin: 0, fontFamily: DISPLAY, fontSize: 22, fontWeight: 700,
        letterSpacing: -0.3, color: T.text, lineHeight: 1.2,
      }}>{title}</h2>
      {subtitle && (
        <p style={{ marginTop: 6, marginBottom: 0, fontSize: 13, color: T.text2, lineHeight: 1.5 }}>{subtitle}</p>
      )}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </section>
  );
}

// A grouped settings card with optional rows
function SettingsCard({ children }) {
  return (
    <div style={{
      background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 10,
      overflow: 'hidden',
      boxShadow: T.isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
    }}>{children}</div>
  );
}
function SettingsRow({ label, hint, children, align = 'center', last }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '200px 1fr', columnGap: 16, rowGap: 4,
      padding: '14px 16px',
      borderBottom: last ? 'none' : `0.5px solid ${T.borderSoft}`,
      alignItems: align,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{label}</div>
        {hint && <div style={{ fontSize: 11.5, color: T.text3, lineHeight: 1.45, marginTop: 2 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── 1. Account ──────────────────────────────────────────────
function AccountSection() {
  return (
    <SettingsSection
      first
      title="Account"
      subtitle="The GitHub user this token belongs to."
    >
      <SettingsCard>
        <SettingsRow label="Signed in as" align="center">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name="Alex Cho" size={40} hue={200}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Alex Cho</div>
              <div style={{ fontSize: 12.5, color: T.text2, fontFamily: MONO, marginTop: 1 }}>@alexcho</div>
            </div>
            <a href="#" style={{
              fontSize: 12, color: T.link, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              View on GitHub <Icon name="external" size={11} color={T.link}/>
            </a>
          </div>
        </SettingsRow>

        <SettingsRow label="Token scopes" hint="Granted by the personal access token currently in use." align="flex-start">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 2 }}>
            <ScopePill name="notifications" required/>
            <ScopePill name="read:org" required/>
            <ScopePill name="read:user" required/>
            <ScopePill name="repo" required/>
          </div>
        </SettingsRow>

        <SettingsRow label="Token fingerprint" hint="First and last four chars of the stored secret." last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <code style={{
              fontFamily: MONO, fontSize: 12, color: T.text,
              background: T.codeBg, padding: '4px 8px', borderRadius: 5,
            }}>ghp_3xK…BqR</code>
            <span style={{ fontSize: 11.5, color: T.text3 }}>· stored in Keychain · rotated 2025-11-04</span>
          </div>
        </SettingsRow>
      </SettingsCard>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 16px', borderRadius: 10,
        background: T.failBg, border: `0.5px solid ${T.failBd}`,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.fail }}>Sign out</div>
          <div style={{ fontSize: 12, color: T.text2, marginTop: 2, lineHeight: 1.45 }}>
            Forgets the token on this device and returns to the setup screen. Cached PR data is removed too.
          </div>
        </div>
        <Button kind="default" size="md" icon="lock" style={{ color: T.fail, borderColor: T.failBd }}>Sign out</Button>
      </div>
    </SettingsSection>
  );
}

function ScopePill({ name, required }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px 3px 6px', borderRadius: 999,
      background: T.successBg, border: `0.5px solid ${T.successBd}`,
      fontFamily: MONO, fontSize: 11.5, color: T.pass, fontWeight: 500,
    }}>
      <Icon name="check" size={10} color={T.pass} strokeWidth={2.2}/>
      {name}
    </span>
  );
}

// ─── 2. GitHub API usage ─────────────────────────────────────
function ApiUsageSection() {
  return (
    <SettingsSection
      title="GitHub API usage"
      subtitle={<>Live counters from <code style={{ fontFamily: MONO, fontSize: 11.5, background: T.codeBg, padding: '1px 5px', borderRadius: 3 }}>GET /rate_limit</code>. REST is per-hour; GraphQL has its own pool used for batched blob fetches.</>}
    >
      <SettingsCard>
        <RateLimitRow
          name="REST (core)"
          used={8} limit={5000} resetsIn="51 min"
          last={false}
        />
        <RateLimitRow
          name="GraphQL"
          used={4501} limit={5000} resetsIn="16 min"
          last={false}
          warn
        />
        <RateLimitRow
          name="Search"
          used={0} limit={30} resetsIn="1 min"
          last
        />
      </SettingsCard>

      <div style={{
        padding: '10px 14px', borderRadius: 8,
        background: T.surface2, border: `0.5px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: T.text2,
      }}>
        <Icon name="refresh" size={13} color={T.text3}/>
        <span style={{ flex: 1 }}>Auto-refreshes every <b style={{ color: T.text }}>30 s</b>. Bars turn red past <b style={{ color: T.fail }}>80 %</b>.</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: T.text3 }}>Last fetch · 14s ago</span>
        <button style={{
          width: 22, height: 22, border: `0.5px solid ${T.borderStrong}`, borderRadius: 4,
          background: T.surface, color: T.text2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} title="Refresh now"><Icon name="refresh" size={11}/></button>
      </div>
    </SettingsSection>
  );
}

function RateLimitRow({ name, used, limit, resetsIn, last, warn }) {
  const pct = (used / limit) * 100;
  const left = limit - used;
  const isWarn = pct >= 80;
  const isDanger = pct >= 95;
  const barColor = isDanger ? T.fail : isWarn ? T.warn : T.link;
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: last ? 'none' : `0.5px solid ${T.borderSoft}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text, minWidth: 100 }}>{name}</span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: T.text2, fontVariantNumeric: 'tabular-nums' }}>
          <b style={{ color: T.text, fontWeight: 600 }}>{used.toLocaleString()}</b> / {limit.toLocaleString()}
          <span style={{ color: T.text3 }}> · {left.toLocaleString()} left</span>
        </span>
        <div style={{ flex: 1 }}/>
        <span style={{ fontSize: 11.5, color: T.text3, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="clock" size={11}/>
          Resets in <b style={{ color: T.text2, fontWeight: 500 }}>{resetsIn}</b>
        </span>
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: T.sidebar2, overflow: 'hidden',
        position: 'relative',
      }}>
        {/* warn threshold marker at 80% */}
        <div style={{
          position: 'absolute', left: '80%', top: -2, bottom: -2, width: 1,
          background: T.warn, opacity: 0.55,
        }}/>
        <div style={{
          height: '100%', width: `${Math.max(pct, 0.5)}%`, borderRadius: 3,
          background: barColor, transition: 'width 250ms ease',
        }}/>
      </div>
    </div>
  );
}

// ─── 3. Diff preferences ─────────────────────────────────────
function DiffPrefsSection() {
  return (
    <SettingsSection
      title="Diff preferences"
      subtitle="Applies to every PR's Files changed tab."
    >
      <SettingsCard>
        <SettingsRow
          label="Syntax-highlighting theme"
          hint={<>Shiki theme used by <code style={{ fontFamily: MONO, fontSize: 11, background: T.codeBg, padding: '1px 4px', borderRadius: 3 }}>@pierre/diffs</code> for code highlighting.</>}
        >
          <Select value="Dark+ (default dark)" />
        </SettingsRow>

        <SettingsRow
          label="Intra-line diff style"
          hint="How changed regions inside a line are highlighted."
        >
          <Select value="Word-Alt" />
        </SettingsRow>

        <SettingsRow
          label="Default rail mode"
          hint="Files changed sidebar starts as either a tree or a flat list."
        >
          <Segmented2
            value="tree"
            options={[
              { id: 'tree', label: 'Tree', icon: 'tree' },
              { id: 'list', label: 'List', icon: 'list' },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Default diff view"
          hint="Inline shows old → new in a single column. Split shows them side-by-side."
        >
          <Segmented2
            value="inline"
            options={[
              { id: 'inline', label: 'Inline', icon: 'inline' },
              { id: 'split',  label: 'Split',  icon: 'split' },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Tab width"
          hint="How many spaces a tab character renders as in the diff."
          last
        >
          <Segmented2
            value="2"
            options={[
              { id: '2', label: '2' },
              { id: '4', label: '4' },
              { id: '8', label: '8' },
            ]}
          />
        </SettingsRow>
      </SettingsCard>

      {/* Live preview */}
      <div style={{
        background: T.surface, border: `0.5px solid ${T.border}`, borderRadius: 10,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11.5, color: T.text3,
          borderBottom: `0.5px solid ${T.borderSoft}`, background: T.surface2,
          fontFamily: MONO,
        }}>
          <Icon name="eye" size={12}/>
          <span>Preview · src/diff/VirtualHunk.tsx</span>
        </div>
        <div style={{ padding: '8px 0', fontFamily: MONO, fontSize: 12, lineHeight: '20px' }}>
          {[
            { l: '15', r: null, k: 'del', code: 'const VIRTUALISE_THRESHOLD = 500;', hi: [{ s: 29, e: 32 }] },
            { l: null, r: '15', k: 'add', code: 'const VIRTUALISE_THRESHOLD = 2_000;', hi: [{ s: 29, e: 34 }] },
            { l: '19', r: null, k: 'del', code: '  const lineHeight = props.font.size;', hi: [{ s: 21, e: 36 }] },
            { l: null, r: '19', k: 'add', code: '  const lineHeight = lineHeightFor(props.font);', hi: [{ s: 21, e: 47 }] },
          ].map((ln, i) => (
            <div key={i} style={{
              display: 'flex',
              background: ln.k === 'add' ? T.addBg : ln.k === 'del' ? T.delBg : T.surface,
            }}>
              <span style={{
                flexShrink: 0, width: 38, textAlign: 'right', padding: '0 6px 0 0',
                color: T.text3, background: ln.k === 'add' ? T.addGutter : ln.k === 'del' ? T.delGutter : T.ctxGutter,
                borderRight: `0.5px solid ${T.borderSoft}`, fontVariantNumeric: 'tabular-nums',
              }}>{ln.l ?? ''}</span>
              <span style={{
                flexShrink: 0, width: 38, textAlign: 'right', padding: '0 6px 0 0',
                color: T.text3, background: ln.k === 'add' ? T.addGutter : ln.k === 'del' ? T.delGutter : T.ctxGutter,
                borderRight: `0.5px solid ${T.borderSoft}`, fontVariantNumeric: 'tabular-nums',
              }}>{ln.r ?? ''}</span>
              <span style={{
                flexShrink: 0, width: 16, textAlign: 'center',
                color: ln.k === 'add' ? T.addLine : ln.k === 'del' ? T.delLine : T.text3,
              }}>{ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' '}</span>
              <span style={{ flex: 1, paddingRight: 12, color: T.text, whiteSpace: 'pre' }}>
                <SimpleHi code={ln.code} hi={ln.hi} kind={ln.k}/>
              </span>
            </div>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
}

function SimpleHi({ code, hi, kind }) {
  if (!hi || !hi.length) return code;
  const tint = kind === 'add' ? T.addBgHi : T.delBgHi;
  const outline = kind === 'add' ? T.addLine : T.delLine;
  const segs = [];
  let cursor = 0;
  for (const { s, e } of hi) {
    if (s > cursor) segs.push({ t: code.slice(cursor, s), hi: false });
    segs.push({ t: code.slice(s, e), hi: true });
    cursor = e;
  }
  if (cursor < code.length) segs.push({ t: code.slice(cursor), hi: false });
  return segs.map((s, i) => (
    <span key={i} style={{
      background: s.hi ? tint : 'transparent',
      boxShadow: s.hi ? `inset 0 0 0 0.5px ${outline}` : 'none',
      borderRadius: s.hi ? 2 : 0, fontWeight: s.hi ? 600 : 400,
    }}>{s.t}</span>
  ));
}

// ─── 4. Appearance ───────────────────────────────────────────
function AppearanceSection() {
  return (
    <SettingsSection
      title="Appearance"
      subtitle={<>Light or dark window chrome. Tip: <Kbd>⌘⇧T</Kbd> toggles from anywhere.</>}
    >
      <SettingsCard>
        <SettingsRow label="Theme" hint="The whole interface, including the diff renderer.">
          <ThemeRadioGroup/>
        </SettingsRow>
        <SettingsRow
          label="Density"
          hint="Compact tightens row heights in the inbox and file rail. Comfortable matches macOS defaults."
        >
          <Segmented2
            value="comfortable"
            options={[
              { id: 'compact', label: 'Compact' },
              { id: 'comfortable', label: 'Comfortable' },
              { id: 'cozy', label: 'Cozy' },
            ]}
          />
        </SettingsRow>
        <SettingsRow
          label="Window translucency"
          hint="macOS sidebar uses a frosted material when on. Off keeps the sidebar opaque."
          last
        >
          <Toggle on={false}/>
        </SettingsRow>
      </SettingsCard>
    </SettingsSection>
  );
}

function ThemeRadioGroup() {
  // Three options: System, Light, Dark — each a little swatch card.
  const opts = [
    { id: 'system', label: 'System',  desc: 'Follow macOS / Windows', preview: 'split' },
    { id: 'light',  label: 'Light',   desc: 'Always light', preview: 'light' },
    { id: 'dark',   label: 'Dark',    desc: 'Always dark', preview: 'dark' },
  ];
  const active = T.isDark ? 'dark' : 'light';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {opts.map(o => {
        const isActive = o.id === active || (active === 'dark' && o.id === 'dark') || (active === 'light' && o.id === 'light');
        return (
          <label key={o.id} style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: 8, borderRadius: 8,
            background: T.surface,
            border: `${isActive ? 1.5 : 0.5}px solid ${isActive ? T.link : T.border}`,
            cursor: 'pointer', position: 'relative',
            boxShadow: isActive ? `0 0 0 3px ${T.isDark ? 'rgba(90,169,255,0.16)' : 'rgba(10,132,255,0.10)'}` : 'none',
          }}>
            <ThemeSwatch kind={o.preview}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 2px' }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                border: `1.5px solid ${isActive ? T.link : T.borderStrong}`,
                background: T.surface, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.link }}/>}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{o.label}</span>
            </div>
            <span style={{ fontSize: 11, color: T.text3, padding: '0 2px' }}>{o.desc}</span>
          </label>
        );
      })}
    </div>
  );
}

function ThemeSwatch({ kind }) {
  if (kind === 'split') {
    return (
      <div style={{ height: 64, borderRadius: 5, overflow: 'hidden', display: 'flex', border: `0.5px solid ${T.border}` }}>
        <ThemeSwatch kind="light"/>
        <ThemeSwatch kind="dark"/>
      </div>
    );
  }
  const dark = kind === 'dark';
  return (
    <div style={{
      flex: 1, height: 64,
      background: dark ? '#1f1f22' : '#ffffff',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: 10, background: dark ? '#2a2a2e' : '#ececec',
        borderBottom: `0.5px solid ${dark ? '#3a3a3e' : '#d8d8dc'}`,
        display: 'flex', alignItems: 'center', gap: 3, padding: '0 4px',
      }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff5f57' }}/>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#febc2e' }}/>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#28c840' }}/>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: 14, background: dark ? '#202023' : '#f1f1f4', borderRight: `0.5px solid ${dark ? '#2e2e32' : '#ebebef'}` }}/>
        <div style={{ flex: 1, padding: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ height: 2, width: '60%', background: dark ? '#3a3a3e' : '#d8d8dc', borderRadius: 1 }}/>
          <div style={{ height: 2, width: '40%', background: dark ? '#2e2e32' : '#e0e0e4', borderRadius: 1 }}/>
          <div style={{ height: 2, width: '70%', background: dark ? '#2e2e32' : '#e0e0e4', borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  );
}

// ─── Small form primitives ───────────────────────────────────
function Select({ value }) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 220,
      padding: '7px 10px', borderRadius: 6,
      background: T.inputBg, border: `0.5px solid ${T.borderStrong}`,
      color: T.text, fontSize: 13, fontFamily: FONT, cursor: 'pointer',
      textAlign: 'left',
    }}>
      <span style={{ flex: 1 }}>{value}</span>
      <Icon name="chevron-down" size={10} color={T.text3}/>
    </button>
  );
}
function Segmented2({ value, options }) {
  return (
    <div style={{
      display: 'inline-flex', padding: 2, gap: 2, borderRadius: 6,
      background: T.sidebar2,
    }}>
      {options.map(o => {
        const active = o.id === value;
        return (
          <button key={o.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '0 10px', height: 22, borderRadius: 4, border: 'none',
            background: active ? T.surface : 'transparent',
            boxShadow: active ? (T.isDark ? '0 1px 1.5px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06)' : '0 1px 1.5px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)') : 'none',
            color: active ? T.text : T.text2, fontWeight: active ? 600 : 500,
            fontSize: 12, fontFamily: FONT, cursor: 'pointer',
          }}>
            {o.icon && <Icon name={o.icon} size={11} color={active ? T.text : T.text2}/>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
function Toggle({ on }) {
  return (
    <span style={{
      display: 'inline-block', width: 32, height: 18, borderRadius: 9,
      background: on ? T.link : T.borderStrong, position: 'relative',
      cursor: 'pointer', transition: 'background 150ms ease',
    }}>
      <span style={{
        position: 'absolute', left: on ? 16 : 2, top: 2,
        width: 14, height: 14, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        transition: 'left 150ms ease',
      }}/>
    </span>
  );
}

Object.assign(window, { SettingsScreen });
