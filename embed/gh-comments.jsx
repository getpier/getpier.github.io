// GitHub-style comment system for Pyor — full feature surface.
//   GhComment           — comment card; collapsible, kebab menu, reactions, author hover-card affordance
//   GhReactions         — emoji reaction strip + add-reaction picker
//   GhComposer          — rich-text editor (Write/Preview tabs, full toolbar, slash/markdown hint)
//   GhInlineThread      — diff-anchored thread that wraps GhComment + GhComposer for inline review
//   GhHiddenBanner      — banner shown when "focus on code" is active
//   GhFocusToggle       — the toolbar pill that toggles comments off for a clean diff
//
// Depends on: LI, SButton, SBadge, SAvatar, SKbd, SSeparator (from screen-shadcn.jsx).

const { useState: ghU } = React;

// ── buildAgentPrompt ────────────────────────────────────────────
// Turns an inline review comment + the code line it's anchored to into a
// self-contained prompt you can paste into an AI coding agent. The goal is
// "address this one comment in isolation, but with full context" — so we
// include the file/line anchor, the exact line(s) commented on, and the
// reviewer's prose verbatim.
function buildAgentPrompt({ file, line, code, author, bodyText }) {
  const out = [];
  out.push('Please address this code review comment.');
  out.push('');
  if (file) out.push(`File: ${file}${line ? `  (line ${line})` : ''}`);
  if (code) {
    out.push('');
    out.push('Line commented on:');
    out.push('```');
    out.push(String(code).replace(/\n+$/, ''));
    out.push('```');
  }
  out.push('');
  out.push(`Reviewer comment${author ? ` — @${author}` : ''}:`);
  out.push((bodyText || '').trim() || '(no text)');
  return out.join('\n');
}

// ── Extra Lucide icons (RTE toolbar + kebab menu items) ─────────
// Inline so we don't have to touch screen-shadcn.jsx's LI map.
function LI2({ name, className = 'size-4', strokeWidth = 2 }) {
  const c = { className, fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24' };
  switch (name) {
    case 'bold':           return <svg {...c}><path d="M6 12h9a4 4 0 0 1 0 8H6Z"/><path d="M6 4h8a4 4 0 0 1 0 8H6Z"/></svg>;
    case 'italic':         return <svg {...c}><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>;
    case 'strikethrough':  return <svg {...c}><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/></svg>;
    case 'heading':        return <svg {...c}><path d="M6 12h12"/><path d="M6 20V4"/><path d="M18 20V4"/></svg>;
    case 'code':           return <svg {...c}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case 'code-block':     return <svg {...c}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9-2 3 2 3"/><path d="m15 9 2 3-2 3"/></svg>;
    case 'link':           return <svg {...c}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case 'image':          return <svg {...c}><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
    case 'list':           return <svg {...c}><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
    case 'list-ordered':   return <svg {...c}><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>;
    case 'list-checks':    return <svg {...c}><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><line x1="13" x2="21" y1="6" y2="6"/><line x1="13" x2="21" y1="12" y2="12"/><line x1="13" x2="21" y1="18" y2="18"/></svg>;
    case 'quote':          return <svg {...c}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1Z"/></svg>;
    case 'smile':          return <svg {...c}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>;
    case 'eye-off':        return <svg {...c}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
    case 'pencil':         return <svg {...c}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497Z"/><path d="m15 5 4 4"/></svg>;
    case 'trash':          return <svg {...c}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
    case 'copy':           return <svg {...c}><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
    case 'flag':           return <svg {...c}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>;
    case 'reference':      return <svg {...c}><path d="M4 7V4a1 1 0 0 1 1-1h3"/><path d="M16 3h3a1 1 0 0 1 1 1v3"/><path d="M20 17v3a1 1 0 0 1-1 1h-3"/><path d="M8 21H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'slash':          return <svg {...c}><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>;
    case 'paperclip':      return <svg {...c}><path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/></svg>;
    case 'check':          return <svg {...c}><path d="M20 6 9 17l-5-5"/></svg>;
    case 'sparkles':       return <svg {...c}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>;
    case 'lock':           return <svg {...c}><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'message-plus':   return <svg {...c}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 8v6"/><path d="M9 11h6"/></svg>;
    case 'git-branch':     return <svg {...c}><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>;
    case 'x-circle':       return <svg {...c}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
    case 'arrow-down':     return <svg {...c}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>;
    default: return null;
  }
}

// ── GhReactions ─────────────────────────────────────────────────
// 8 canonical reactions. `entries` is a sparse map { '👍': { count, me } }.
const GH_REACTIONS = [
  { glyph: '👍', name: '+1' },
  { glyph: '👎', name: '-1' },
  { glyph: '😄', name: 'laugh' },
  { glyph: '🎉', name: 'hooray' },
  { glyph: '😕', name: 'confused' },
  { glyph: '❤️', name: 'heart' },
  { glyph: '🚀', name: 'rocket' },
  { glyph: '👀', name: 'eyes' },
];

function GhReactions({ entries = {}, pickerOpen = false }) {
  const visible = GH_REACTIONS.filter(r => entries[r.glyph] && entries[r.glyph].count > 0);
  return (
    <div className="relative flex flex-wrap items-center gap-1.5">
      {visible.map(r => {
        const e = entries[r.glyph];
        const me = e.me;
        return (
          <button key={r.glyph}
            className={`inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[12px] font-medium transition-colors ${me
              ? 'border-blue-600 bg-blue-50/60 text-blue-600 hover:bg-blue-50'
              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'}`}
            title={`${me ? 'You and ' : ''}${e.who || `${e.count} people`} reacted with ${r.name}`}
          >
            <span className="leading-none">{r.glyph}</span>
            <span className="tabular-nums">{e.count}</span>
          </button>
        );
      })}
      <button className="inline-flex h-6 items-center gap-0.5 rounded-full border border-dashed border-zinc-300 bg-white px-1.5 text-zinc-400 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-600" title="Add reaction">
        <LI2 name="smile" className="size-3.5"/>
        <LI2 name="message-plus" className="size-3 -ml-0.5 hidden"/>
        <span className="text-[10.5px] leading-none">+</span>
      </button>
      {pickerOpen && (
        <div className="absolute left-0 top-full z-30 mt-1.5 rounded-lg border border-zinc-200 bg-white px-1.5 py-1.5 shadow-lg"
             style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center gap-0.5">
            {GH_REACTIONS.map(r => (
              <button key={r.glyph} title={`:${r.name}:`}
                className={`inline-flex size-7 items-center justify-center rounded-md text-[16px] hover:bg-zinc-100 ${entries[r.glyph]?.me ? 'bg-blue-50 ring-1 ring-blue-600' : ''}`}>
                {r.glyph}
              </button>
            ))}
            <span className="mx-0.5 h-5 w-px bg-zinc-200"/>
            <button title="Pick another" className="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100">
              <LI2 name="smile" className="size-4"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GhComment ───────────────────────────────────────────────────
// A single comment card. Header + body + reactions + footer actions.
// Self-managed collapsed state; kebab menu state.
// Variants:
//   editing  — body swaps to an inline RTE editor (Write/Preview/toolbar +
//              Update/Cancel actions). Header gains an "Editing" badge.
//   reply    — denser styling for nested replies under a parent.
//   replies  — array of reply objects rendered indented under this comment.
function GhComment({
  author, role,            // 'author' | 'owner' | 'collaborator' | 'member' | null
  age, edited,             // 'edited 2h ago' | null
  body,                    // React node
  diffSlice,               // React node — diff hunk shown under the header, above the body
  preview,                 // string — one-line shown when collapsed
  reactions = {},          // entries map
  isYou,                   // 'you' badge
  highlight,               // 'pending' | 'resolved' | null — subtle border accent
  defaultCollapsed = false,
  menuOpen = false,
  pickerOpen = false,
  pending,                 // boolean — show "Pending" badge
  editing,                 // boolean — render the inline editor in place of the body
  editText,                // string — initial editor content
  editorTab = 'write',     // 'write' | 'preview' — composer tab when editing
  reply,                   // boolean — denser styling for nested replies
  replies,                 // array of nested reply objects
  showReplyComposer,       // boolean — show inline reply composer below replies
  replyComposerText,       // string — prefilled text for that composer
  copyContext,             // { file, line, code } — anchor used by "Copy for agent"
}) {
  const [collapsed, setCollapsed] = ghU(defaultCollapsed);
  const [menu, setMenu] = ghU(menuOpen);
  const [copied, setCopied] = ghU(false);
  const bodyRef = React.useRef(null);

  // Copy the line being reviewed + this comment's text as a ready-to-paste
  // prompt for an AI agent. Body text is read from the rendered DOM so it
  // works regardless of how rich the comment node is (code blocks, lists…).
  const copyForAgent = () => {
    const bodyText = (bodyRef.current?.innerText || (typeof body === 'string' ? body : '')).trim();
    const prompt = buildAgentPrompt({ ...(copyContext || {}), author, bodyText });
    const flash = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(prompt).then(flash, flash);
      else flash();
    } catch { flash(); }
  };

  const roleBadge = role && (
    <span className="rounded-full border border-zinc-200 px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
      {role}
    </span>
  );

  const edge =
    highlight === 'pending'  ? 'border-amber-200 ring-1 ring-amber-500/20' :
    highlight === 'resolved' ? 'border-emerald-200/60 bg-emerald-50/30' :
    editing                  ? 'border-blue-600/40 ring-1 ring-blue-600/15' :
                               'border-zinc-200';

  const denser = reply
    ? { hpx: 'px-2.5', vpy: 'py-0.5', bodyPad: 'px-3 py-1',   avatar: 'size-5', text: 'text-[14.5px]', shadow: '' }
    : { hpx: 'px-3',   vpy: 'py-1',   bodyPad: 'px-4 py-1.5', avatar: 'size-6', text: 'text-[15.5px]', shadow: 'shadow-sm' };

  return (
    <div>
      <div className={`rounded-lg border bg-white ${denser.shadow} ${edge}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 border-b border-zinc-100 ${denser.hpx} ${denser.vpy} ${collapsed ? 'border-b-0' : ''}`}>
          <SAvatar name={author} size={denser.avatar}/>
          <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
            <span className="truncate text-[13px] font-semibold">{author}</span>
            {isYou && <SBadge variant="outline" className="text-[9.5px]">you</SBadge>}
            {roleBadge}
            {pending && <SBadge variant="warn" className="gap-1 text-[9.5px]"><LI2 name="pencil" className="size-2.5"/>Pending</SBadge>}
            {editing && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-600/40 bg-blue-50 px-1.5 py-0 text-[9.5px] font-medium text-blue-600">
                <LI2 name="pencil" className="size-2.5"/>Editing
              </span>
            )}
            {!collapsed && !editing && <span className="ml-1 truncate text-[12px] text-zinc-500">commented {age}</span>}
            {!collapsed && editing && <span className="ml-1 truncate text-[12px] text-zinc-500">editing this comment · autosaved 4s ago</span>}
            {!collapsed && !editing && edited && <span className="text-[11.5px] text-zinc-400">· edited {edited}</span>}
            {collapsed && preview && (
              <span className="ml-1 truncate text-[12.5px] text-zinc-500">{preview}</span>
            )}
          </div>
          {/* Right cluster — kebab + collapse (no smile here — reaction lives in the footer) */}
          <div className="flex shrink-0 items-center gap-0.5 text-zinc-400">
            <SDropdownMenu open={menu} width={220} trigger={
              <button title="More" onClick={() => setMenu(o => !o)}
                className="inline-flex size-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-700">
                <LI name="more-horizontal" className="size-4"/>
              </button>
            }>
              <GhCommentMenuItems onCopyForAgent={copyForAgent}/>
            </SDropdownMenu>
            {!editing && (
              <button title={collapsed ? 'Expand' : 'Collapse'} onClick={() => setCollapsed(c => !c)}
                className="inline-flex size-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-700">
                <LI name={collapsed ? 'chevron-right' : 'chevron-down'} className="size-4"/>
              </button>
            )}
          </div>
        </div>

        {/* Diff slice the thread is anchored to — sits under the header, above the body */}
        {!collapsed && diffSlice && (
          <div className="border-b border-zinc-100">{diffSlice}</div>
        )}

        {/* Body — either rendered markdown OR the inline editor */}
        {!collapsed && (
          editing ? (
            <GhInlineEditor text={editText} tab={editorTab}/>
          ) : (
            <>
              <div ref={bodyRef} className={`${denser.bodyPad} ${denser.text} leading-snug text-zinc-700`}>{body}</div>
              {/* Reactions + actions footer */}
              <div className={`flex items-center gap-3 border-t border-zinc-100 bg-zinc-50/40 ${denser.hpx} ${denser.vpy}`}>
                <GhReactions entries={reactions} pickerOpen={pickerOpen}/>
                <div className="ml-auto flex items-center gap-0.5 text-zinc-500">
                  <button onClick={copyForAgent}
                    title="Copy the line + this comment as a prompt for an AI agent"
                    className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors ${copied
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-blue-600 hover:bg-blue-50'}`}>
                    <LI2 name={copied ? 'check' : 'sparkles'} className="size-3.5"/>{copied ? 'Copied for agent' : 'Copy for agent'}
                  </button>
                  <button className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium hover:bg-zinc-100 hover:text-zinc-900">
                    <LI name="reply" className="size-3.5"/>Reply
                  </button>
                  <button className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium hover:bg-zinc-100 hover:text-zinc-900">
                    <LI2 name="quote" className="size-3.5"/>Quote
                  </button>
                  <button className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium hover:bg-zinc-100 hover:text-zinc-900">
                    <LI2 name="copy" className="size-3.5"/>Copy link
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {/* Nested replies — indented under the parent with a thread guide line */}
      {(replies?.length || showReplyComposer) && (
        <div className="relative ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-5 pb-1">
          {replies?.map((r, i) => (
            <div key={i} className="relative">
              <span className="pointer-events-none absolute -left-5 top-4 h-px w-3.5 bg-zinc-200"/>
              <GhComment {...r} reply copyContext={r.copyContext || copyContext}/>
            </div>
          ))}
          {showReplyComposer && (
            <div className="relative">
              <span className="pointer-events-none absolute -left-5 top-5 h-px w-3.5 bg-zinc-200"/>
              <GhComposer
                variant="inline"
                placeholder="Reply to this thread…"
                submit="Reply"
                showToolbar={false}
                text={replyComposerText}
                hint="Markdown supported · ⌘⏎ to submit"
                height="min-h-[68px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── GhInlineEditor ──────────────────────────────────────────────
// Composer chrome reused inside a GhComment when editing.
// Differs from GhComposer in that it sits flush inside the parent card
// (no border on the wrapper, footer actions read Update/Cancel), and
// shows live-rendered markdown in the Preview tab so users can verify
// formatting before saving.
function GhInlineEditor({ text = '', tab = 'write' }) {
  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-100 px-2 pt-2">
        {['Write', 'Preview'].map(t => {
          const id = t.toLowerCase();
          const on = id === tab;
          return (
            <button key={t} className={`relative -mb-px px-3 py-1.5 text-[12.5px] font-medium transition-colors ${on ? 'rounded-t-md border border-zinc-200 border-b-white bg-white text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'}`}>
              {t}
            </button>
          );
        })}
        <span className="ml-auto inline-flex items-center gap-1 pr-1 text-[11px] text-zinc-400">
          <LI2 name="lock" className="size-3"/>Autosaved · only you can see this draft
        </span>
      </div>

      {/* Toolbar — full RTE feature surface */}
      {tab === 'write' && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 px-1.5 py-1.5 text-zinc-500">
          <TBtn icon="heading"        title="Heading" kbd="⌥⌘1"/>
          <TBtn icon="bold"           title="Bold" kbd="⌘B"/>
          <TBtn icon="italic"         title="Italic" kbd="⌘I"/>
          <TBtn icon="strikethrough"  title="Strikethrough"/>
          <TGap/>
          <TBtn icon="quote"          title="Quote" kbd="⌘⇧."/>
          <TBtn icon="code"           title="Inline code" kbd="⌘E"/>
          <TBtn icon="code-block"     title="Code block" kbd="⌘⇧C"/>
          <TBtn icon="link"           title="Link" kbd="⌘K"/>
          <TGap/>
          <TBtn icon="list"           title="Bullet list" kbd="⌘⇧8"/>
          <TBtn icon="list-ordered"   title="Numbered list" kbd="⌘⇧7"/>
          <TBtn icon="list-checks"    title="Task list" kbd="⌘⇧L"/>
          <TGap/>
          <TBtn icon="at-sign"        title="Mention (@)"/>
          <TBtn icon="reference"      title="Reference (#)"/>
          <TBtn icon="smile"          title="Emoji"/>
          <TBtn icon="paperclip"      title="Attach"/>
          <TBtn icon="image"          title="Insert image"/>
          <TGap/>
          <TBtn icon="sparkles"       title="AI: rewrite" badge="AI"/>
          <TBtn icon="slash"          title="Slash commands" kbd="/"/>
        </div>
      )}

      {/* Body */}
      {tab === 'write' ? (
        <div className="px-4 py-3">
          <STextarea mono size="lg" defaultValue={text}/>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
            <LI2 name="paperclip" className="size-3"/> Drag, paste, or click to attach files & images · 0/65,536
          </div>
        </div>
      ) : (
        <div className="px-4 py-3">
          <div className="prose-like min-h-[140px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13.5px] leading-relaxed text-zinc-700">
            {text
              ? <span>{text}</span>
              : <span className="text-zinc-400">Nothing to preview yet.</span>}
          </div>
        </div>
      )}

      {/* Footer — Update / Cancel */}
      <div className="flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/40 px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
          <LI2 name="sparkles" className="size-3"/>Markdown is supported · <SKbd>⌘⏎</SKbd> to save
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <SButton variant="ghost"   size="sm">Cancel</SButton>
          <SButton variant="default" size="sm" icon="check">Update comment</SButton>
        </div>
      </div>
    </div>
  );
}

// Body of the comment kebab dropdown — rendered inside an SDropdownMenu.
function GhCommentMenuItems({ onCopyForAgent }) {
  return (
    <>
      <SDropdownItem icon="sparkles"  label="Copy for agent" kbd="⌥C" onClick={onCopyForAgent}/>
      <SDropdownItem icon="copy"      label="Copy link"/>
      <SDropdownItem icon="quote"     label="Quote reply" kbd="R"/>
      <SDropdownItem icon="reference" label="Reference in new issue"/>
      <SDropdownSeparator/>
      <SDropdownItem icon="pencil"    label="Edit"/>
      <SDropdownItem icon="eye-off"   label="Hide"/>
      <SDropdownSeparator/>
      <SDropdownItem icon="flag"      label="Report content"/>
      <SDropdownItem icon="trash"     label="Delete" danger/>
    </>
  );
}

// ── GhComposer ──────────────────────────────────────────────────
// A full markdown composer. Tabs (Write / Preview), formatting toolbar,
// textarea, footer with markdown hint + submit cluster.
function GhComposer({
  avatar = 'alex-cho',
  placeholder = 'Add a comment',
  text = '',
  tab = 'write',            // 'write' | 'preview'
  showToolbar = true,
  showFooter = true,
  submit = 'Comment',
  variant = 'card',         // 'card' | 'inline'
  hint = 'Markdown is supported. Drag, paste, or click to attach files & images.',
  pinHint,                  // text — small pin above textarea, e.g. "Drop files to attach"
  height = 'min-h-[120px]',
}) {
  const wrapBg = variant === 'inline' ? 'bg-zinc-50/60' : 'bg-white';
  return (
    <div className={`flex flex-col overflow-hidden rounded-lg border border-zinc-200 ${wrapBg} ${variant === 'card' ? 'shadow-sm' : ''}`}>
      {/* Tabs row — Write / Preview */}
      <div className="flex items-center gap-1 border-b border-zinc-100 px-2 pt-2">
        {['Write', 'Preview'].map(t => {
          const id = t.toLowerCase();
          const on = id === tab;
          return (
            <button key={t} className={`relative -mb-px px-3 py-1.5 text-[12.5px] font-medium transition-colors ${on ? 'rounded-t-md border border-zinc-200 border-b-white bg-white text-zinc-950' : 'text-zinc-500 hover:text-zinc-900'}`}>
              {t}
              {t === 'Preview' && tab !== 'preview' && <span className="ml-1.5 text-[10.5px] text-zinc-400">⌘P</span>}
            </button>
          );
        })}
        <span className="ml-auto inline-flex items-center gap-1 pr-1 text-[11px] text-zinc-400">
          <LI2 name="lock" className="size-3"/>Saved as draft
        </span>
      </div>

      {/* Formatting toolbar */}
      {showToolbar && tab === 'write' && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-100 px-1.5 py-1.5 text-zinc-500">
          <TBtn icon="heading"      title="Heading" kbd="⌥⌘1"/>
          <TBtn icon="bold"         title="Bold" kbd="⌘B"/>
          <TBtn icon="italic"       title="Italic" kbd="⌘I"/>
          <TBtn icon="strikethrough" title="Strikethrough"/>
          <TGap/>
          <TBtn icon="quote"        title="Quote" kbd="⌘⇧."/>
          <TBtn icon="code"         title="Inline code" kbd="⌘E"/>
          <TBtn icon="code-block"   title="Code block" kbd="⌘⇧C"/>
          <TBtn icon="link"         title="Link" kbd="⌘K"/>
          <TGap/>
          <TBtn icon="list"         title="Bullet list" kbd="⌘⇧8"/>
          <TBtn icon="list-ordered" title="Numbered list" kbd="⌘⇧7"/>
          <TBtn icon="list-checks"  title="Task list" kbd="⌘⇧L"/>
          <TGap/>
          <TBtn icon="at-sign"      title="Mention (@)"/>
          <TBtn icon="reference"    title="Reference (#)"/>
          <TBtn icon="smile"        title="Emoji"/>
          <TBtn icon="paperclip"    title="Attach"/>
          <TBtn icon="image"        title="Insert image"/>
          <TGap/>
          <TBtn icon="sparkles"     title="AI: draft a reply" badge="AI"/>
          <TBtn icon="slash"        title="Slash commands (/)" kbd="/"/>
        </div>
      )}

      {/* Body — Write textarea OR preview area */}
      {tab === 'write' ? (
        <div className="flex gap-2.5 p-3">
          <SAvatar name={avatar} size="size-6"/>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <STextarea mono placeholder={placeholder} defaultValue={text} className={height}/>
            {pinHint && (
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <LI2 name="paperclip" className="size-3"/> {pinHint}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-2.5 p-3">
          <SAvatar name={avatar} size="size-6"/>
          <div className="prose-like min-h-[80px] flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13.5px] leading-relaxed text-zinc-700">
            {text
              ? <span>{text}</span>
              : <span className="text-zinc-400">Nothing to preview.</span>}
          </div>
        </div>
      )}

      {/* Footer */}
      {showFooter && (
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 bg-zinc-50/40 px-3 py-2">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-zinc-500">
            <LI2 name="paperclip" className="size-3"/>{hint}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <SButton variant="ghost"   size="sm">Cancel</SButton>
            <SButton variant="default" size="sm" icon="send">{submit}<span className="ml-1.5 hidden font-normal opacity-70 sm:inline">⌘⏎</span></SButton>
          </div>
        </div>
      )}
    </div>
  );
}

function TBtn({ icon, title, kbd, badge }) {
  return (
    <button title={title + (kbd ? ` · ${kbd}` : '')}
      className="relative inline-flex size-7 items-center justify-center rounded-md hover:bg-zinc-100 hover:text-zinc-900">
      <LI2 name={icon} className="size-3.5"/>
      {badge && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-zinc-900 px-1 text-[8.5px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
function TGap() { return <span className="mx-1 h-5 w-px bg-zinc-200"/>; }

// ── GhInlineThread ──────────────────────────────────────────────
// A diff-anchored review thread. Header line ties to the file/line,
// then the parent comment with replies nested under it (border-l-2 thread
// guide), then a reply composer at the bottom.
function GhInlineThread({ file = 'src/diff/VirtualHunk.tsx', line = 32, anchorCode = 'const [window, setWindow] = useState(() => measureHunk(lines));', resolved = false, resolvedBy = 'alex-cho', parent, replies, composer = true, outdated = false, outdatedTreatment = 'saturated' }) {
  const dfltParent = {
    author: 'alex-cho', age: '2h ago', isYou: true,
    body: (
      <>
        <p>Why <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">useState(() =&gt; measureHunk(...))</code> instead of <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">useMemo</code>? We never call <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">setWindow</code> in the threshold branch — this allocates a setter we throw away.</p>
        <p className="mt-2">Suggested change — drop in this hunk:</p>
        <GhCodeBlock lang="tsx" filename="suggestion · VirtualHunk.tsx"
          addedLines={[2, 3, 4, 5]}
          delLines={[1]}
          lines={[
            [['k', 'const '], ['v', 'window'], ['p', ', '], ['v', 'setWindow'], ['p', ' = '], ['f', 'useState'], ['p', '('], ['p', '() => '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', '));']],
            [['k', 'const '], ['v', 'window'], ['p', ' = '], ['f', 'useMemo'], ['p', '('], ['p', '() => {']],
            [['p', '  '], ['k', 'if '], ['p', '('], ['v', 'lines'], ['p', '.'], ['v', 'length'], ['p', ' < '], ['n', '2000'], ['p', ') '], ['k', 'return '], ['v', 'lines'], ['p', ';']],
            [['p', '  '], ['k', 'return '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', ', '], ['v', 'fontFamily'], ['p', ', '], ['v', 'viewport'], ['p', ');']],
            [['p', '}, ['], ['v', 'lines'], ['p', ', '], ['v', 'fontFamily'], ['p', ', '], ['v', 'viewport'], ['p', ']);']],
          ]}/>
        <p className="mt-2 text-[12px] text-zinc-500">Side note — here&rsquo;s the React DevTools trace I caught it on, the setter is sitting in committed-fiber memory for the whole hunk lifetime:</p>
        <GhImageAttach alt="useState-setter-leak.png" caption="React DevTools · Profiler · committed fibers"
          paint="app-screenshot" size="1180 × 540"/>
      </>
    ),
    reactions: { '👍': { count: 3, me: false, who: 'priya-r, marcus-w, +1' }, '👀': { count: 1, me: true, who: 'You' } },
  };
  const dfltReplies = [
    { author: 'nicolae-i', age: '1h ago', role: 'author',
      body: (
        <>
          <p>Good catch. I had it as <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">useMemo</code> originally; switched when I added the scroll handler in a later commit. Rolling it back here.</p>
          <GhCodeBlock lang="diff" filename="f02ab1c · src/diff/VirtualHunk.tsx"
            addedLines={[3, 4, 5]}
            delLines={[1, 2]}
            lines={[
              [['v', 'const [window, setWindow] = useState(() => measureHunk(lines));']],
              [['v', '// eslint-disable-next-line react-hooks/exhaustive-deps -- bundler complains about fontFamily']],
              [['v', 'const window = useMemo(() => {']],
              [['p', '  '], ['k', 'if '], ['p', '('], ['v', 'lines.length'], ['p', ' < '], ['n', '2000'], ['p', ') '], ['k', 'return '], ['v', 'lines'], ['p', ';']],
              [['p', '  '], ['k', 'return '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines, fontFamily, viewport'], ['p', '); }, [lines, fontFamily, viewport]);']],
            ]}/>
          <p className="mt-2 text-[12px]">Re-running the trace — gain is small (about <b>~3ms</b> off the median frame) but the alloc churn is the bigger deal:</p>
          <GhImageAttach alt="after-useMemo-trace.png" caption="React Profiler · after swap"
            paint="flame-graph" size="1180 × 360"/>
        </>
      ),
      reactions: { '🎉': { count: 2, me: true, who: 'You, alex-cho' } },
    },
    { author: 'priya-r', age: '38m ago', role: 'collaborator',
      body: (
        <>
          <p>Bonus — recorded a quick before/after of just this hunk, helped me convince myself nothing visually shifts during the swap:</p>
          <GhImageAttach alt="hunk-swap-no-shift.mp4" caption="00:08 · M2 Air · before/after · 1284×712"
            paint="video-frame" kind="video" size="3.2 MB"/>
          <p className="mt-1 text-[12px]">Approving once <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">f02ab1c</code> is in CI.</p>
        </>
      ),
      reactions: { '❤️': { count: 1, me: true, who: 'You' } },
    },
  ];
  const p = parent || dfltParent;
  const r = replies || dfltReplies;
  const total = 1 + r.length;
  // Outdated wrapper treatments — three options for side-by-side comparison:
  //   'saturated' — full-strength amber dashed box (the literal pitch)
  //   'muted'     — quiet de-emphasised card; the chip is the only loud signal
  //   'hairline'  — compromise: low-chroma dashed amber hairline + faded body
  const wrapBase = 'mx-3 mb-3 mt-1.5 rounded-lg';
  const wrap = !outdated
    ? `${wrapBase} border border-zinc-200 bg-white shadow-sm`
    : outdatedTreatment === 'saturated'
      ? `${wrapBase} border-2 border-dashed border-amber-400 bg-white shadow-sm`
    : outdatedTreatment === 'muted'
      ? `${wrapBase} border border-zinc-200/80 bg-zinc-50/60`
    : /* hairline */
      `${wrapBase} border border-dashed border-amber-300/70 bg-white shadow-sm`;
  const bodyDim = outdated && outdatedTreatment !== 'saturated' ? 'opacity-70' : '';
  return (
    <div className={wrap}>
      {/* No anchor header — file & line are already implied by the diff this
          thread is pinned under. The parent comment leads directly. */}
      <div className="p-2">
        {outdated && (
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-medium text-amber-700"><LI2 name="alert-triangle" className="size-2.5"/>Outdated</span>
            <span className="text-[11px] text-zinc-400">line drifted off the latest diff</span>
          </div>
        )}
        {resolved && !outdated && (
          <div className="mb-2 flex">
            <SBadge variant="success" className="gap-1 text-[9.5px]"><LI2 name="check" className="size-2.5"/>Resolved</SBadge>
          </div>
        )}
        <div className={bodyDim}>
          <GhComment {...p} replies={r} showReplyComposer={composer}
            copyContext={p.copyContext || { file, line, code: anchorCode }}
            replyComposerText=""/>
        </div>
      </div>

      {/* Conversation-level footer — resolve / unresolve the whole thread */}
      <div className={`flex items-center gap-2 rounded-b-lg border-t px-3 py-2 ${
        outdated ? 'border-amber-200/50 bg-amber-50/30'
        : resolved ? 'border-emerald-200/70 bg-emerald-50/50'
        : 'border-zinc-100 bg-zinc-50/50'}`}>
        {outdated ? (
          <>
            <LI2 name="alert-triangle" className="size-3.5 text-amber-500"/>
            <span className="text-[12px] text-zinc-500">This thread is outdated — the code it points to has changed since.</span>
            <SButton variant="outline" size="sm" icon="check" className="ml-auto">Resolve conversation</SButton>
          </>
        ) : resolved ? (
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
    </div>
  );
}

// ── GhHiddenBanner ──────────────────────────────────────────────
// Shown when "focus on code" toggle is on. Sticky strip on top of the
// content area; click → toggle back.
function GhHiddenBanner({ count, scope = 'this PR', onShow }) {
  return (
    <div className="mx-6 my-4 flex items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60 px-4 py-3 text-[12.5px] text-zinc-600">
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
        <LI2 name="eye-off" className="size-4"/>
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-zinc-900">Comments hidden — focusing on code</div>
        <div className="truncate text-[11.5px] text-zinc-500">
          {count} comment{count === 1 ? '' : 's'} in {scope} are temporarily collapsed. Inline review threads in the diff are also hidden.
        </div>
      </div>
      <SButton variant="outline" size="sm" icon="message-square" onClick={onShow}>Show comments</SButton>
    </div>
  );
}

// ── GhFocusToggle ───────────────────────────────────────────────
// Unified per-tab "focus" pill. It always names what you focus ON (never
// what's hidden), so the same affordance reads coherently across tabs even
// though the concrete effect differs:
//   mode="code"     (Changes tab)      → focusing hides comment overlays
//   mode="comments" (Conversation tab) → focusing collapses timeline events
// Shared icon language + ⇧M shortcut + header slot keep the muscle memory.
function GhFocusToggle({ mode = 'code', active = false, onToggle }) {
  const isCode = mode === 'code';
  const label = isCode ? 'Code' : 'Comments';
  const iconName = isCode ? 'code' : 'message-square';
  return (
    <button
      onClick={onToggle}
      title={active
        ? `Focusing on ${label.toLowerCase()} — show everything (⇧M)`
        : `Focus on ${label.toLowerCase()} only (⇧M)`}
      className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors ${active
        ? 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}
    >
      <LI name={iconName} className={`size-3.5 ${active ? 'text-amber-700' : 'text-zinc-500'}`}/>
      <span>Focus: {label}</span>
      <SKbd>⇧M</SKbd>
    </button>
  );
}

// ── Rich content primitives for comment bodies ──────────────────
// Used inside <GhComment body={...}> to mock GitHub-style attachments
// and highlighted code.

// `c` is a token shorthand:
//   k=keyword s=string n=number f=function t=type p=punctuation
//   v=variable a=attribute m=comment x=tag (jsx)
const SX_TONE = {
  k: 'text-pink-600',      // keyword: const, return, if
  s: 'text-emerald-700',   // string literal
  n: 'text-blue-600',      // number
  f: 'text-violet-600',    // function name
  t: 'text-amber-700',     // type / class
  v: 'text-zinc-800',      // identifier
  a: 'text-orange-600',    // attribute
  m: 'text-zinc-400 italic', // comment
  x: 'text-red-600',       // jsx tag bracket
  p: 'text-zinc-500',      // punctuation
};
function Sx({ children, tk }) {
  return <span className={`${SX_TONE[tk] || ''} font-mono`}>{children}</span>;
}

// GhCodeBlock — fenced code block with header, copy button, soft syntax tones.
// Pass `lines` as an array — each line is an array of [token, text] pairs.
function GhCodeBlock({ lang = 'tsx', filename, lines, addedLines = [], delLines = [], highlightLines = [] }) {
  return (
    <div className="my-2 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-3 py-1.5 text-[11px] text-zinc-500">
        <LI2 name="code-block" className="size-3.5 text-zinc-400"/>
        {filename && <span className="font-mono text-zinc-700">{filename}</span>}
        <span className="rounded-sm bg-zinc-100 px-1.5 py-0 font-medium uppercase tracking-wide text-zinc-500">{lang}</span>
        <span className="ml-auto inline-flex items-center gap-2 text-zinc-400">
          <button className="inline-flex items-center gap-1 rounded hover:text-zinc-700" title="Copy"><LI2 name="copy" className="size-3"/>Copy</button>
          <button className="inline-flex items-center gap-1 rounded hover:text-zinc-700" title="Raw"><LI name="external-link" className="size-3"/>Raw</button>
        </span>
      </div>
      <pre className="overflow-x-auto px-0 py-2 font-mono text-[11.5px] leading-[18px]">
        {lines.map((toks, i) => {
          const ln = i + 1;
          const rowBg = addedLines.includes(ln) ? 'bg-emerald-50'
                      : delLines.includes(ln)   ? 'bg-red-50'
                      : highlightLines.includes(ln) ? 'bg-amber-50/60'
                      : '';
          const marker = addedLines.includes(ln) ? <span className="text-emerald-700">+</span>
                       : delLines.includes(ln)   ? <span className="text-red-700">−</span>
                       :                           <span className="text-transparent">·</span>;
          return (
            <div key={i} className={`flex ${rowBg}`}>
              <span className="shrink-0 w-9 select-none pr-2 text-right text-zinc-400">{ln}</span>
              <span className="shrink-0 w-4 select-none text-center">{marker}</span>
              <code className="whitespace-pre pr-4 text-zinc-900">
                {toks.map(([tk, txt], j) => <Sx key={j} tk={tk}>{txt}</Sx>)}
              </code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

// GhImageAttach — image attached inline, with caption + size meta on hover.
// Uses a CSS-painted "screenshot" mock so we don't need real image assets.
function GhImageAttach({ alt = 'Screenshot', caption, paint = 'flame-graph', size = '1284 × 712', kind = 'image' }) {
  return (
    <figure className="my-2 inline-block overflow-hidden rounded-md border border-zinc-200 bg-white">
      <div className="relative" style={{ width: 480, maxWidth: '100%' }}>
        <GhMockPainted kind={paint} aspect={580 / 320}/>
        {kind === 'video' && (
          <>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-black/60 text-white shadow-lg ring-2 ring-white/40 backdrop-blur-sm">
                <svg viewBox="0 0 24 24" className="size-6 translate-x-0.5" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>
              </span>
            </span>
            <span className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-2 rounded bg-black/55 px-2 py-1 text-[10.5px] text-white">
              <span className="font-mono tabular-nums">0:00</span>
              <span className="flex-1"><span className="block h-1 rounded-full bg-white/25"><span className="block h-1 w-[18%] rounded-full bg-white"/></span></span>
              <span className="font-mono tabular-nums">0:42</span>
            </span>
          </>
        )}
      </div>
      <figcaption className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50/70 px-2.5 py-1.5 text-[11px] text-zinc-500">
        <LI2 name={kind === 'video' ? 'paperclip' : 'image'} className="size-3 text-zinc-400"/>
        <span className="truncate font-medium text-zinc-700">{alt}</span>
        {caption && <span className="truncate">· {caption}</span>}
        <span className="ml-auto font-mono tabular-nums text-zinc-400">{size}</span>
      </figcaption>
    </figure>
  );
}

// CSS-painted "screenshot" placeholder for mock attachments. Cheap, themable,
// and reads as the kind of image you'd attach in a perf-PR review.
function GhMockPainted({ kind, aspect = 580 / 320 }) {
  if (kind === 'flame-graph') {
    return (
      <div className="relative grid grid-cols-12 gap-px bg-zinc-100 p-2" style={{ aspectRatio: aspect }}>
        {/* Flame bars */}
        {[
          ['col-span-12', 'h-3 bg-orange-400'],
          ['col-span-9', 'h-3 bg-orange-500'], ['col-span-3', 'h-3 bg-rose-400'],
          ['col-span-4', 'h-3 bg-amber-500'], ['col-span-5', 'h-3 bg-orange-400'], ['col-span-3', 'h-3 bg-rose-500'],
          ['col-span-2', 'h-3 bg-amber-400'], ['col-span-2', 'h-3 bg-amber-500'], ['col-span-5', 'h-3 bg-orange-300'], ['col-span-3', 'h-3 bg-orange-400'],
          ['col-span-1', 'h-3 bg-amber-500'], ['col-span-3', 'h-3 bg-amber-400'], ['col-span-4', 'h-3 bg-orange-400'], ['col-span-4', 'h-3 bg-orange-300'],
        ].map(([cs, cls], i) => <div key={i} className={`${cs} ${cls} rounded-sm`}/>)}
        <div className="col-span-12 mt-1 flex items-center gap-3 font-mono text-[9px] text-zinc-500">
          <span>0ms</span><span className="ml-auto">38ms</span>
        </div>
        <span className="pointer-events-none absolute right-2 top-2 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-zinc-600">FLAME · main thread</span>
      </div>
    );
  }
  if (kind === 'app-screenshot') {
    return (
      <div className="relative bg-zinc-50 p-3" style={{ aspectRatio: aspect }}>
        {/* App window inside a screenshot */}
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100/80 px-2 py-1.5">
            <span className="size-2 rounded-full bg-red-400"/><span className="size-2 rounded-full bg-amber-400"/><span className="size-2 rounded-full bg-emerald-400"/>
            <span className="ml-1.5 h-3 w-32 rounded bg-zinc-200"/>
          </div>
          <div className="flex">
            <div className="w-16 shrink-0 space-y-1 border-r border-zinc-100 p-1.5">
              <span className="block h-1.5 w-full rounded bg-zinc-200"/><span className="block h-1.5 w-2/3 rounded bg-zinc-150"/><span className="block h-1.5 w-3/4 rounded bg-zinc-200"/>
            </div>
            <div className="flex-1 space-y-1.5 p-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-1">
                  <span className="block h-1.5 w-6 shrink-0 rounded bg-emerald-200"/>
                  <span className={`block h-1.5 rounded ${i % 3 === 0 ? 'bg-emerald-100 w-3/4' : i % 3 === 1 ? 'bg-red-100 w-1/2' : 'bg-zinc-200 w-2/3'}`}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === 'video-frame') {
    return (
      <div className="relative bg-zinc-900" style={{ aspectRatio: aspect }}>
        {/* App-frame in dark mode */}
        <div className="absolute inset-2 overflow-hidden rounded bg-zinc-800">
          <div className="flex items-center gap-1.5 border-b border-zinc-700 bg-zinc-900/80 px-2 py-1">
            <span className="size-1.5 rounded-full bg-zinc-600"/><span className="size-1.5 rounded-full bg-zinc-600"/><span className="size-1.5 rounded-full bg-zinc-600"/>
          </div>
          <div className="p-2 space-y-1">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="block h-1 rounded bg-zinc-700" style={{ width: `${30 + ((i*37)%65)}%` }}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ── Sample data exports — populated examples used by the screens ────
const GH_SAMPLES = {
  opening: {
    author: 'nicolae-i', age: '1d 4h ago', role: 'author',
    body: (
      <>
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-zinc-950">Virtualise large hunks</h2>
        <p>The 18k-line PR <a className="text-blue-600 hover:underline">#9081</a> spent 600ms parking a single hunk into the DOM on a fresh PR open. This PR introduces a <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">VirtualHunk</code> that windows the line list under a fixed pixel budget.</p>

        <h3 className="mt-4 mb-1 text-sm font-semibold text-zinc-950">Approach</h3>
        <ul className="list-disc pl-5 space-y-0.5">
          <li>Below 2,000 lines: render the whole hunk synchronously (no behaviour change).</li>
          <li>At/above 2k: a windowed renderer measures line heights once, scrolls a virtual viewport.</li>
          <li>Threads are anchored to the line model, not the DOM node.</li>
        </ul>

        <h3 className="mt-4 mb-1 text-sm font-semibold text-zinc-950">Demo · scrolling the 18k-line PR</h3>
        <p className="text-[12.5px] text-zinc-500">Before / after side-by-side, recorded on M2 Air, dev build, Cmd-Down held.</p>
        <GhImageAttach alt="virtualise-hunks-scrolling.mp4" caption="00:42 · M2 Air · 1284×712"
          paint="video-frame" kind="video" size="48.1 MB"/>

        <h3 className="mt-4 mb-1 text-sm font-semibold text-zinc-950">Flame graph · the win</h3>
        <p className="text-[12.5px] text-zinc-500">Single-hunk render trace, Chrome DevTools <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]">Performance</code> panel.</p>
        <GhImageAttach alt="hunk-render-flame.png" caption="612ms → 38ms · main thread frees up at +120ms"
          paint="flame-graph" size="1180 × 360"/>

        <h3 className="mt-4 mb-1 text-sm font-semibold text-zinc-950">The hot path</h3>
        <p>The new <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">measureHunk</code> short-circuits below the threshold and caches per (font-family, viewport-width):</p>
        <GhCodeBlock lang="tsx" filename="src/diff/VirtualHunk.tsx"
          addedLines={[4, 5, 6, 9, 10, 11, 12]}
          delLines={[3]}
          lines={[
            [['k', 'export function '], ['f', 'VirtualHunk'], ['p', '('], ['v', 'props'], ['p', ': '], ['t', 'HunkProps'], ['p', ') {']],
            [['p', '  '], ['k', 'const '], ['v', '{ lines, fontFamily, viewport }'], ['p', ' = '], ['v', 'props'], ['p', ';']],
            [['p', '  '], ['k', 'const '], ['v', 'window'], ['p', ', '], ['v', 'setWindow'], ['p', ' = '], ['f', 'useState'], ['p', '('], ['p', '() => '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', '));']],
            [['p', '  '], ['k', 'const '], ['v', 'window'], ['p', ' = '], ['f', 'useMemo'], ['p', '('], ['p', '() => {']],
            [['p', '    '], ['k', 'if '], ['p', '('], ['v', 'lines'], ['p', '.'], ['v', 'length'], ['p', ' < '], ['n', '2000'], ['p', ') '], ['k', 'return '], ['v', 'lines'], ['p', ';'], ['m', '   // fast path']],
            [['p', '    '], ['k', 'return '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', ', '], ['v', 'fontFamily'], ['p', ', '], ['v', 'viewport'], ['p', ');']],
            [['p', '  }, ['], ['v', 'lines'], ['p', ', '], ['v', 'fontFamily'], ['p', ', '], ['v', 'viewport'], ['p', ']);']],
            [['p', '']],
            [['p', '  '], ['k', 'return '], ['x', '<'], ['t', 'div'], ['p', ' '], ['a', 'role'], ['p', '='], ['s', '"region"'], ['p', ' '], ['a', 'aria-label'], ['p', '='], ['s', '"diff hunk"'], ['x', '>']],
            [['p', '    {'], ['v', 'window'], ['p', '.'], ['f', 'map'], ['p', '(('], ['v', 'line'], ['p', ') => ('], ['x', '<'], ['t', 'DiffLine'], ['p', ' '], ['a', 'key'], ['p', '={'], ['v', 'line'], ['p', '.'], ['v', 'id'], ['p', '} '], ['a', 'line'], ['p', '={'], ['v', 'line'], ['p', '} />))}']],
            [['p', '  '], ['x', '</'], ['t', 'div'], ['x', '>']],
            [['p', '  );']],
            [['p', '}']],
          ]}/>

        <h3 className="mt-4 mb-1 text-sm font-semibold text-zinc-950">Numbers</h3>
        <pre className="rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11.5px] leading-relaxed text-zinc-700">
{`18,412-line hunk, M2 Air, dev build
parse + render: 612ms → 38ms
steady-state scroll: 24fps → 60fps
memory peak: 184MB → 41MB`}
        </pre>

        <h3 className="mt-4 mb-1 text-sm font-semibold text-zinc-950">Open questions</h3>
        <ul className="list-disc pl-5 space-y-0.5">
          <li>The mobile target depends on <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">HunkWindow</code>&rsquo;s old ResizeObserver shape — see <a className="text-blue-600 hover:underline">#9220</a></li>
          <li>Cache-busting on font-family change: do we need a weight bucket too?</li>
        </ul>
      </>
    ),
    edited: '2h ago',
    reactions: { '🚀': { count: 6, me: true, who: 'You, priya-r, marcus-w, +3' }, '❤️': { count: 3, me: false, who: 'priya-r, +2' }, '👀': { count: 2, me: false, who: '2 people' } },
    preview: 'Virtualise large hunks — 612ms → 38ms render, threads anchored to line model…',
  },
  priyaReview: {
    author: 'priya-r', age: '22h ago', role: 'collaborator',
    body: (
      <>
        <p>LGTM aside from the comment in <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">VirtualHunk.tsx</code>. Numbers are great — <b>600ms → 38ms</b> on the 18k-line PR.</p>
        <p className="mt-2">Suggestion: would be worth a <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">measureHunk</code>-called-once regression test, since the new caching layer has subtle invalidation rules. Something like:</p>
        <GhCodeBlock lang="ts" filename="src/diff/measureHunk.spec.ts"
          highlightLines={[6, 7]}
          lines={[
            [['k', 'import '], ['p', '{ '], ['v', 'measureHunk'], ['p', ' } '], ['k', 'from '], ['s', "'./measureHunk'"], ['p', ';']],
            [['p', '']],
            [['f', 'describe'], ['p', '('], ['s', "'measureHunk cache'"], ['p', ', () => {']],
            [['p', '  '], ['f', 'it'], ['p', '('], ['s', "'hits the cache on a second call with same (font, viewport)'"], ['p', ', () => {']],
            [['p', '    '], ['k', 'const '], ['v', 'spy'], ['p', ' = '], ['f', 'vi'], ['p', '.'], ['f', 'spyOn'], ['p', '('], ['v', 'measureHunk'], ['p', ', '], ['s', "'__layout'"], ['p', ');']],
            [['p', '    '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', ', '], ['s', "'Inter'"], ['p', ', '], ['n', '1280'], ['p', ');']],
            [['p', '    '], ['f', 'measureHunk'], ['p', '('], ['v', 'lines'], ['p', ', '], ['s', "'Inter'"], ['p', ', '], ['n', '1280'], ['p', ');']],
            [['p', '    '], ['f', 'expect'], ['p', '('], ['v', 'spy'], ['p', ').'], ['f', 'toHaveBeenCalledTimes'], ['p', '('], ['n', '1'], ['p', ');']],
            [['p', '  });']],
            [['p', '});']],
          ]}/>
      </>
    ),
    reactions: { '👍': { count: 4, me: true, who: 'You, marcus-w, +2' } },
    preview: 'LGTM aside from the VirtualHunk.tsx comment — would be worth a regression test…',
  },
  marcusReview: {
    author: 'marcus-w', age: '2h ago', role: 'member',
    body: (
      <>
        <p>One blocker: this changes the public <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">ResizeObserver</code> contract on <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">HunkWindow</code>. The mobile target depends on the old shape. Can we add an adapter rather than break it?</p>
        <p className="mt-2">Here&rsquo;s what mobile sees on the failing snapshot:</p>
        <GhImageAttach alt="mobile-regression-snapshot.png" caption="iPhone 13 · /pulls/9081 · main vs branch"
          paint="app-screenshot" size="828 × 1448"/>
        <p className="mt-2">The diff body collapses to zero height because <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">HunkWindow</code> now expects a <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]">{`{ contentRect, target }`}</code> tuple and we&rsquo;re still on the bare entry. Happy to pair on this Wednesday afternoon.</p>
      </>
    ),
    reactions: { '👀': { count: 2, me: true, who: 'You, alex-cho' }, '😕': { count: 1, me: false, who: 'alex-cho' } },
    preview: 'One blocker: changes public ResizeObserver contract on HunkWindow — mobile depends on old shape',
    highlight: 'pending',
  },
};

Object.assign(window, {
  GhComment, GhReactions, GhComposer, GhInlineThread, GhHiddenBanner, GhFocusToggle,
  GhCommentMenuItems, GhInlineEditor,
  GhCodeBlock, GhImageAttach, Sx, LI2, TBtn, TGap,
  GH_REACTIONS, GH_SAMPLES,
});
