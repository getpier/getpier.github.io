// ─────────────────────────────────────────────────────────────────────
// comments-inbox.jsx — Pyor's comments-only inbox dashboard.
//
// The inbox is no longer tabbed (All / Comments / Other). It is a single,
// dedicated COMMENTS surface. Every row reuses the real GhComment card from
// the PR-detail Conversation tab (gh-comments.jsx), wrapped in a thin PR
// context strip — so a comment reads identically wherever you meet it.
//
// Toolbar = two visually distinct filter groups, mirroring where the work
// happens:
//
//   ① FROM GITHUB  — server-side, authoritative, cheap. Compiles to GitHub
//      Search qualifiers (involves:@me · repo: · is:open · sort:…) and
//      decides what gets *fetched*. Boxy mono "query tokens" + a live
//      preview of the exact `q=` string.
//
//   ② REFINE       — client-side only. GitHub can't filter at comment
//      granularity, so type / author / resolved / unread / free-text run
//      locally over what's already fetched. Soft pills + a real toggle,
//      with a "47 fetched → 12 shown" ledger.
//
// Feed is grouped by recent activity (Today / Yesterday / Earlier) and
// cursor-paginated (25 / page).
//
// Depends on: GhComment (gh-comments.jsx) · INBOX_COMMENTS,
//   InboxCommentSnippet, InboxCommentAttachment, COMMENT_TYPE_CFG,
//   AssocBadge (inbox-comments.jsx) · PierWindowShell, PierSidebar, SInput
//   (shadcn-app.jsx) · SPopover, SCommand* (shadcn-ui.jsx) · SAvatar,
//   SBadge, SButton, SKbd, SSeparator, LI (screen-shadcn.jsx)
// ─────────────────────────────────────────────────────────────────────

const { useState: ciU } = React;

// ── Server-side qualifier config ────────────────────────────────
const CI_RELATIONSHIPS = [
  { q: 'involves:@me',         label: 'Involves me',     icon: 'circle-dot',        desc: 'Author, assignee, commenter or mentioned' },
  { q: 'review-requested:@me', label: 'Review requested',icon: 'eye',               desc: 'Your review is requested' },
  { q: 'mentions:@me',         label: 'Mentions me',     icon: 'at-sign',           desc: '@-mentioned in a body or thread' },
  { q: 'commenter:@me',        label: 'I commented',     icon: 'message-square',     desc: 'Threads you have replied on' },
  { q: 'reviewed-by:@me',      label: 'I reviewed',      icon: 'check-circle',       desc: 'PRs you submitted a review on' },
  { q: 'assignee:@me',         label: 'Assigned to me',  icon: 'user',               desc: 'You are an assignee' },
  { q: 'author:@me',           label: 'Authored by me',  icon: 'git-pull-request',   desc: 'Pull requests you opened' },
];
const CI_STATES = [
  { q: 'is:open',   label: 'Open',      icon: 'git-pull-request' },
  { q: 'is:merged', label: 'Merged',    icon: 'git-merge' },
  { q: 'is:closed', label: 'Closed',    icon: 'x-circle' },
  { q: 'is:draft',  label: 'Draft',     icon: 'git-pull-request-draft' },
  { q: '',          label: 'Any state', icon: 'circle' },
];
const CI_SORTS = [
  { q: 'updated',      label: 'Recently updated' },
  { q: 'created',      label: 'Newest' },
  { q: 'comments',     label: 'Most commented' },
  { q: 'reactions',    label: 'Most reactions' },
  { q: 'interactions', label: 'Most interactions' },
];
const CI_TIMES = [
  { q: '',                     label: 'Any time',      hint: 'no date qualifier' },
  { q: 'updated:>=2026-06-03', label: 'Last 24 hours', hint: 'updated:>=2026-06-03' },
  { q: 'updated:>=2026-05-28', label: 'Last 7 days',   hint: 'updated:>=2026-05-28' },
  { q: 'updated:>=2026-05-05', label: 'Last 30 days',  hint: 'updated:>=2026-05-05' },
];
const CI_SCOPES = [
  { q: '',                            label: 'All repositories', icon: 'github', hint: 'everything you can read' },
  { q: 'org:northwind',               label: 'northwind',        icon: 'users',  hint: 'org:northwind' },
  { q: 'repo:northwind/web-event-app',label: 'web-event-app',    icon: 'folder', hint: 'repo:northwind/web-event-app' },
  { q: 'repo:northwind/api',          label: 'api',              icon: 'folder', hint: 'repo:northwind/api' },
  { q: 'repo:northwind/mobile-ios',   label: 'mobile-ios',       icon: 'folder', hint: 'repo:northwind/mobile-ios' },
  { q: 'repo:northwind/design-system',label: 'design-system',    icon: 'folder', hint: 'repo:northwind/design-system' },
];
const CI_LABELS = [
  { q: 'performance', dot: 'bg-amber-400' }, { q: 'bug', dot: 'bg-red-500' },
  { q: 'a11y', dot: 'bg-blue-500' }, { q: 'needs-design', dot: 'bg-violet-500' },
  { q: 'breaking', dot: 'bg-rose-500' },
];

// Compose the live GitHub query string from server selections.
function ciBuildQuery(v) {
  const rel   = (CI_RELATIONSHIPS.find(o => o.q === v.relationship) || CI_RELATIONSHIPS[0]).q;
  const scope = (CI_SCOPES.find(o => o.q === v.scope) || CI_SCOPES[0]).q;
  const state = (CI_STATES.find(o => o.q === v.state) || CI_STATES[0]).q;
  const time  = (CI_TIMES.find(o => o.q === v.time) || CI_TIMES[0]).q;
  const sort  = (CI_SORTS.find(o => o.q === v.sort) || CI_SORTS[0]).q;
  const label = v.label ? `label:"${v.label}"` : '';
  return ['is:pr', rel, scope, state, 'archived:false', time, label, `sort:${sort}-desc`]
    .filter(Boolean).join(' ');
}

// ── Client-side refine config ───────────────────────────────────
const CI_TYPES = [
  { q: 'any', label: 'Any type', icon: 'message-square', desc: 'All five comment surfaces' },
  ...Object.entries(COMMENT_TYPE_CFG).map(([q, cfg]) => ({ q, label: cfg.label, icon: cfg.icon, desc: cfg.desc })),
];
const CI_THREADS = [
  { q: 'any',        label: 'Any thread',  icon: 'message-square', desc: 'Resolved and open' },
  { q: 'unresolved', label: 'Unresolved',  icon: 'circle-dot',     desc: 'Still needs a reply or fix' },
  { q: 'resolved',   label: 'Resolved',    icon: 'check-circle',   desc: 'Marked done on the thread' },
];
const CI_AUTHORS = Array.from(new Set(INBOX_COMMENTS.map(c => c.actor)));

// ── Activity bucketing ──────────────────────────────────────────
function ciAgeToMinutes(age) {
  const m = /(\d+)\s*([mhd])/.exec(age || '');
  if (!m) return 0;
  const n = +m[1];
  return m[2] === 'm' ? n : m[2] === 'h' ? n * 60 : n * 1440;
}
const CI_BUCKETS = [
  { id: 'today',     label: 'Today',             hint: 'Wed · Jun 4',   max: 1440 },
  { id: 'yesterday', label: 'Yesterday',         hint: 'Tue · Jun 3',   max: 2880 },
  { id: 'week',      label: 'Earlier this week', hint: 'May 28 – Jun 2', max: 10080 },
  { id: 'older',     label: 'Older',             hint: 'before May 28', max: Infinity },
];
function ciBucketOf(age) {
  const mins = ciAgeToMinutes(age);
  return (CI_BUCKETS.find(b => mins < b.max) || CI_BUCKETS[CI_BUCKETS.length - 1]).id;
}

// ── Free-text walk + client filtering ───────────────────────────
function ciBodyText(node) {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(ciBodyText).join(' ');
  if (React.isValidElement(node)) return ciBodyText(node.props?.children);
  return '';
}
function ciRefine(rows, v) {
  const q = (v.search || '').trim().toLowerCase();
  let out = rows;
  if (v.typeFilter && v.typeFilter !== 'any') out = out.filter(c => c.type === v.typeFilter);
  if (v.author && v.author !== 'any')         out = out.filter(c => c.actor === v.author);
  if (v.thread === 'unresolved')              out = out.filter(c => c.threadResolved === false);
  if (v.thread === 'resolved')                out = out.filter(c => c.threadResolved === true);
  if (v.unreadOnly)                           out = out.filter(c => c.unread);
  if (q) out = out.filter(c =>
    c.actor.includes(q) || c.title.toLowerCase().includes(q) ||
    (c.file || '').toLowerCase().includes(q) || ciBodyText(c.body).toLowerCase().includes(q));
  return out;
}

// ════════════════════════════════════════════════════════════════
//  Server band — "FROM GITHUB". Boxy mono query tokens.
// ════════════════════════════════════════════════════════════════
function CIQueryToken({ icon, label, value, open, dimmed }) {
  return (
    <span className={`inline-flex h-7 cursor-default items-center gap-1.5 rounded-md border bg-white px-2 text-[12px] transition-colors hover:bg-zinc-50 ${open ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200'}`}>
      {icon && <LI name={icon} className="size-3.5 text-zinc-400"/>}
      {label && <span className="text-zinc-400">{label}</span>}
      <span className={`font-mono font-medium ${dimmed ? 'text-zinc-400' : 'text-zinc-900'}`}>{value}</span>
      <LI name={open ? 'chevron-up' : 'chevron-down'} className="size-3 text-zinc-400"/>
    </span>
  );
}
function CIMenuItem({ active, icon, dot, title, desc, q }) {
  return (
    <SCommandItem active={active}>
      {dot ? <span className={`size-2.5 shrink-0 rounded-full ${dot}`}/> : icon && <LI name={icon} className={`size-4 shrink-0 ${active ? 'text-zinc-900' : 'text-zinc-400'}`}/>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`truncate text-[12.5px] ${active ? 'font-semibold text-zinc-900' : 'text-zinc-700'}`}>{title}</span>
        {desc && <span className="truncate text-[10.5px] text-zinc-400">{desc}</span>}
      </span>
      {q && <code className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">{q}</code>}
      {active && <LI name="check" className="size-3.5 shrink-0 text-zinc-900"/>}
    </SCommandItem>
  );
}
function CIServerBand({ v, query }) {
  const rel   = CI_RELATIONSHIPS.find(o => o.q === v.relationship) || CI_RELATIONSHIPS[0];
  const scope = CI_SCOPES.find(o => o.q === v.scope) || CI_SCOPES[0];
  const state = CI_STATES.find(o => o.q === v.state) || CI_STATES[0];
  const sort  = CI_SORTS.find(o => o.q === v.sort) || CI_SORTS[0];
  const time  = CI_TIMES.find(o => o.q === v.time) || CI_TIMES[0];
  const P = v.serverPopover;
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50/80 px-5 py-2.5">
      <div className="flex items-center gap-2 pr-1">
        <span className="flex size-[22px] items-center justify-center rounded-md bg-zinc-900 text-white"><LI name="github" className="size-3.5"/></span>
        <div className="leading-tight">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">From GitHub</div>
          <div className="text-[9.5px] text-zinc-400">server · authoritative</div>
        </div>
      </div>
      <SSeparator vertical className="h-7"/>

      <SPopover open={P === 'relationship'} align="start" width={320} trigger={<span><CIQueryToken icon={rel.icon} value={rel.label} open={P === 'relationship'}/></span>}>
        <SCommand><SCommandGroup heading="Your relationship to the PR">{CI_RELATIONSHIPS.map(o => <CIMenuItem key={o.q} active={o.q === v.relationship} icon={o.icon} title={o.label} desc={o.desc} q={o.q}/>)}</SCommandGroup></SCommand>
      </SPopover>

      <SPopover open={P === 'scope'} align="start" width={300} trigger={<span><CIQueryToken icon={scope.icon} label="in" value={scope.q === '' ? 'all repos' : scope.label} open={P === 'scope'} dimmed={scope.q === ''}/></span>}>
        <SCommand><SCommandInput placeholder="Filter repositories…"/><SCommandGroup heading="Scope">{CI_SCOPES.map(o => <CIMenuItem key={o.q || 'all'} active={o.q === v.scope} icon={o.icon} title={o.label} desc={o.hint}/>)}</SCommandGroup></SCommand>
      </SPopover>

      <SPopover open={P === 'state'} align="start" width={220} trigger={<span><CIQueryToken icon={state.icon} value={state.q || 'any'} open={P === 'state'} dimmed={!state.q}/></span>}>
        <SCommand><SCommandGroup heading="Pull-request state">{CI_STATES.map(o => <CIMenuItem key={o.label} active={o.q === v.state} icon={o.icon} title={o.label} q={o.q || undefined}/>)}</SCommandGroup></SCommand>
      </SPopover>

      <SPopover open={P === 'labels'} align="start" width={230} trigger={<span><CIQueryToken icon="tag" label="label" value={v.label || 'any'} open={P === 'labels'} dimmed={!v.label}/></span>}>
        <SCommand><SCommandInput placeholder="Find a label…"/><SCommandGroup heading="Filter by label">{CI_LABELS.map(o => <CIMenuItem key={o.q} active={o.q === v.label} dot={o.dot} title={o.q} q={`label:"${o.q}"`}/>)}</SCommandGroup></SCommand>
      </SPopover>

      <SPopover open={P === 'time'} align="start" width={250} trigger={<span><CIQueryToken icon="clock" value={time.label} open={P === 'time'} dimmed={!time.q}/></span>}>
        <SCommand><SCommandGroup heading="Updated within">{CI_TIMES.map(o => <CIMenuItem key={o.label} active={o.q === v.time} title={o.label} q={o.q || undefined}/>)}</SCommandGroup></SCommand>
      </SPopover>

      <SSeparator vertical className="h-7"/>

      <SPopover open={P === 'sort'} align="start" width={230} trigger={<span><CIQueryToken label="sort" value={`${sort.q}↓`} open={P === 'sort'}/></span>}>
        <SCommand><SCommandGroup heading="Order results (desc)">{CI_SORTS.map(o => <CIMenuItem key={o.q} active={o.q === v.sort} title={o.label} q={`sort:${o.q}`}/>)}</SCommandGroup></SCommand>
      </SPopover>

      <div className="ml-auto flex items-center gap-2.5">
        <code className="hidden max-w-[380px] truncate rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[10.5px] text-zinc-500 2xl:inline"><span className="text-zinc-400">q=</span>{query}</code>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500"/>{v.resultCount ?? 47} PRs</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  Refine band — client-side. Soft pills + a real toggle.
// ════════════════════════════════════════════════════════════════
function CIRefinePill({ icon, label, value, active, open }) {
  const on = active || open;
  return (
    <span className={`inline-flex h-7 cursor-default items-center gap-1.5 rounded-full border px-2.5 text-[12px] font-medium transition-colors ${on ? 'border-blue-600/40 bg-blue-50 text-blue-700' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'}`}>
      {icon && <LI name={icon} className={`size-3.5 ${on ? 'text-blue-500' : 'text-zinc-400'}`}/>}
      {label}{value && <><span className={on ? 'text-blue-300' : 'text-zinc-300'}>·</span><span>{value}</span></>}
      <LI name={open ? 'chevron-up' : 'chevron-down'} className={`size-3 ${on ? 'text-blue-400' : 'text-zinc-300'}`}/>
    </span>
  );
}
function CIRefineToggle({ label, active }) {
  return (
    <button className={`inline-flex h-7 items-center gap-2 rounded-full border px-2.5 text-[12px] font-medium transition-colors ${active ? 'border-blue-600/40 bg-blue-50 text-blue-700' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'}`}>
      <span className={`relative inline-flex h-3.5 w-6 shrink-0 items-center rounded-full transition-colors ${active ? 'bg-blue-600' : 'bg-zinc-300'}`}>
        <span className={`absolute size-2.5 rounded-full bg-white shadow-sm transition-all ${active ? 'left-[11px]' : 'left-0.5'}`}/>
      </span>
      {label}
    </button>
  );
}
function CIRefineBand({ v, fetched, shown }) {
  const P = v.refinePopover;
  const typeCfg = v.typeFilter && v.typeFilter !== 'any' ? COMMENT_TYPE_CFG[v.typeFilter] : null;
  const thread = CI_THREADS.find(t => t.q === v.thread);
  const threadLabel = thread && thread.q !== 'any' ? thread.label : null;
  const refined = !!((v.search || '').trim() || typeCfg || (v.author && v.author !== 'any') || threadLabel || v.unreadOnly);
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-white px-5 py-2.5">
      <div className="flex items-center gap-2 pr-1">
        <span className="flex size-[22px] items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-500"><LI name="filter" className="size-3.5"/></span>
        <div className="leading-tight">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Refine in Pyor</div>
          <div className="text-[9.5px] text-zinc-400">client · per-comment</div>
        </div>
      </div>
      <SSeparator vertical className="h-7"/>

      <SInput icon="search" placeholder="Search comment text, code, files…" kbd="⌘F" value={v.search} className="w-72"/>

      <SPopover open={P === 'type'} align="start" width={300} trigger={<span><CIRefinePill icon="message-square" label="Type" value={typeCfg ? typeCfg.label : null} active={!!typeCfg} open={P === 'type'}/></span>}>
        <SCommand>
          <SCommandGroup heading="Comment surface">{CI_TYPES.map(o => <CIMenuItem key={o.q} active={(v.typeFilter || 'any') === o.q} icon={o.icon} title={o.label} desc={o.desc}/>)}</SCommandGroup>
          <SCommandFooter><div className="px-2 py-1 text-[10.5px] text-zinc-500">GitHub returns these mixed — Pyor splits them apart.</div></SCommandFooter>
        </SCommand>
      </SPopover>

      <SPopover open={P === 'author'} align="start" width={240} trigger={<span><CIRefinePill icon="user" label="Author" value={v.author && v.author !== 'any' ? v.author : null} active={!!v.author && v.author !== 'any'} open={P === 'author'}/></span>}>
        <SCommand>
          <SCommandInput placeholder="Filter commenters…"/>
          <SCommandGroup heading="Comment author">
            <CIMenuItem active={!v.author || v.author === 'any'} icon="users" title="Anyone"/>
            {CI_AUTHORS.map(a => (
              <SCommandItem key={a} active={a === v.author}>
                <SAvatar name={a} size="size-5"/>
                <span className={`flex-1 truncate text-[12.5px] ${a === v.author ? 'font-semibold text-zinc-900' : 'text-zinc-700'}`}>{a}</span>
                {a === v.author && <LI name="check" className="size-3.5 text-zinc-900"/>}
              </SCommandItem>
            ))}
          </SCommandGroup>
        </SCommand>
      </SPopover>

      <SPopover open={P === 'thread'} align="start" width={250} trigger={<span><CIRefinePill icon="check-circle" label="Thread" value={threadLabel} active={!!threadLabel} open={P === 'thread'}/></span>}>
        <SCommand>
          <SCommandGroup heading="Resolution (GraphQL isResolved)">{CI_THREADS.map(o => <CIMenuItem key={o.q} active={(v.thread || 'any') === o.q} icon={o.icon} title={o.label} desc={o.desc}/>)}</SCommandGroup>
        </SCommand>
      </SPopover>

      <CIRefineToggle label="Unread only" active={!!v.unreadOnly}/>

      <div className="ml-auto flex items-center gap-3 text-[11.5px] text-zinc-500">
        {refined && <button className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 hover:bg-zinc-100 hover:text-zinc-900"><LI name="rotate-ccw" className="size-3"/>Reset</button>}
        <span><span className="tabular-nums text-zinc-700">{fetched}</span> fetched <span className="text-zinc-300">→</span> <b className="font-semibold tabular-nums text-zinc-900">{shown}</b> shown</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  Per-comment PR context strip (sits above the GhComment card).
// ════════════════════════════════════════════════════════════════
function CIChip({ icon, label, tone }) {
  return <span className={`inline-flex h-[18px] items-center gap-1 rounded-full border px-1.5 text-[10px] font-semibold ${tone}`}><LI name={icon} className="size-2.5"/>{label}</span>;
}
function CIContextStrip({ c }) {
  const typeCfg = COMMENT_TYPE_CFG[c.type];
  const stateChip =
      c.outdated       ? { label: 'Outdated', icon: 'alert-triangle', tone: 'text-amber-700 border-amber-200 bg-amber-50' }
    : c.threadResolved ? { label: 'Resolved', icon: 'check-circle',   tone: 'text-emerald-700 border-emerald-200 bg-emerald-50' }
    : (c.type === 'review-inline' || c.type === 'file-level') ? { label: 'Unresolved', icon: 'circle-dot', tone: 'text-zinc-600 border-zinc-200 bg-white' }
    : null;
  const verdictChip = c.type === 'review-summary' ? ({
      APPROVED:          { label: 'Approved',          icon: 'check-circle',   tone: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
      CHANGES_REQUESTED: { label: 'Changes requested', icon: 'x-circle',       tone: 'text-red-700 border-red-200 bg-red-50' },
      COMMENTED:         { label: 'Commented',         icon: 'message-square', tone: 'text-zinc-700 border-zinc-200 bg-zinc-50' },
    }[c.reviewState]) : null;
  const reasonChip = c.reason === 'mention' ? { label: 'Mentions you', icon: 'at-sign', tone: 'text-amber-700 border-amber-200 bg-amber-50' }
                   : c.reason === 'review_requested' ? { label: 'Review requested', icon: 'eye', tone: 'text-blue-700 border-blue-200 bg-blue-50' }
                   : c.reason === 'author' ? { label: 'On your PR', icon: 'user', tone: 'text-blue-700 border-blue-200 bg-blue-50' }
                   : null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-0.5">
      {c.unread && <span className="size-1.5 shrink-0 rounded-full bg-blue-600" title="Unread"/>}
      <LI name="git-pull-request" className="size-3.5 shrink-0 text-zinc-400"/>
      <a className={`truncate hover:underline ${c.unread ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-800'} text-[12.5px]`} style={{ maxWidth: 440 }}>{c.title}</a>
      <span className="shrink-0 font-mono text-[11px] text-zinc-400">#{c.num}</span>
      <span className="text-zinc-300">·</span>
      <span className="shrink-0 text-[11.5px] text-zinc-500">{c.repo}</span>
      {c.file && (<>
        <span className="text-zinc-300">·</span>
        <a className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-zinc-500 hover:text-zinc-900 hover:underline"><LI name="file" className="size-3"/>{c.file}{c.line && <span className="text-zinc-400">:{c.line}</span>}</a>
      </>)}
      {c.commitSha && (<>
        <span className="text-zinc-300">·</span>
        <a className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-zinc-500 hover:underline"><LI name="git-commit" className="size-3"/>{c.commitSha}</a>
      </>)}
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-1.5">
        {reasonChip && <CIChip {...reasonChip}/>}
        {verdictChip && <CIChip {...verdictChip}/>}
        {stateChip && <CIChip {...stateChip}/>}
        <SBadge variant={typeCfg.variant} className="gap-1"><LI name={typeCfg.icon} className="size-2.5"/>{typeCfg.label}</SBadge>
        <AssocBadge role={c.role}/>
      </div>
    </div>
  );
}

// Build the GhComment body node: reply quote + text + attachments.
// (The diff the comment is anchored to rides in GhComment's `diffSlice`
// slot instead — see CIDiffSlice — exactly like the Conversation tab.)
function ciBody(c) {
  return (
    <div className="space-y-2">
      {c.isReply?.parentBody && (
        <div className="rounded-md border-l-2 border-zinc-300 bg-zinc-50/70 px-2.5 py-1 text-[12px] italic text-zinc-500 line-clamp-1">
          <span className="not-italic text-zinc-400">@{c.isReply.to}: </span>"{c.isReply.parentBody}…"
        </div>
      )}
      <div>{c.body}</div>
      {c.attachments?.length > 0 && <div className="flex flex-wrap gap-2 pt-0.5">{c.attachments.map((a, i) => <InboxCommentAttachment key={i} att={a}/>)}</div>}
    </div>
  );
}

// ── CIDiffSlice ─────────────────────────────────────────────────
// The diff hunk a comment is anchored to, rendered edge-to-edge to ride
// inside GhComment's diffSlice slot (under the author header, above the
// body) — matching the PR-detail Conversation tab. Consumes the snippet
// fixture shape ({ filename, lang, lines:[tokenArray], addedLines,
// delLines, highlightLines, startLine }).
function CIExpander({ dir }) {
  return (
    <button className="group flex w-full items-stretch text-left hover:bg-blue-50/70">
      <span className="flex w-12 shrink-0 items-center justify-center border-r border-zinc-200/60 bg-blue-50/60 text-blue-500 group-hover:bg-blue-100/70">
        <LI name={dir === 'up' ? 'chevron-up' : 'chevron-down'} className="size-3.5"/>
      </span>
      <span className="flex-1 px-3 py-0.5 font-sans text-[10.5px] text-blue-500/80 group-hover:text-blue-600">Expand {dir === 'up' ? 'lines above' : 'lines below'}</span>
    </button>
  );
}
function CIDiffSlice({ snippet, file, line }) {
  const { lang, lines, addedLines = [], delLines = [], highlightLines = [], startLine = 1 } = snippet;
  const added = addedLines.length, deled = delLines.length, ctx = lines.length - added - deled;
  const hunkHdr = `@@ -${startLine},${ctx + deled} +${startLine},${ctx + added} @@`;
  return (
    <div className="font-mono text-[11.5px] leading-[18px]">
      {/* anchor header — file · line · hunk */}
      <div className="flex items-center gap-2 bg-zinc-50/80 px-3 py-1 text-[10.5px] text-zinc-400">
        <LI name="code-2" className="size-3"/>
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10.5px] text-zinc-600">{file || snippet.filename}</code>
        {line && <><span className="text-zinc-300">·</span><span className="font-mono text-[10.5px] text-zinc-500">L{line}</span></>}
        <button title="Copy file path" className="inline-flex size-4 items-center justify-center rounded text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"><LI2 name="copy" className="size-2.5"/></button>
        <span className="ml-auto truncate font-mono text-[10.5px] text-zinc-400">{hunkHdr}</span>
      </div>
      <CIExpander dir="up"/>
      {lines.map((toks, i) => {
        const ln = startLine + i;
        const isAdd = addedLines.includes(ln), isDel = delLines.includes(ln), isHl = highlightLines.includes(ln);
        const bg = isAdd ? 'bg-emerald-50' : isDel ? 'bg-red-50' : 'bg-white';
        const gutter = isAdd ? 'bg-emerald-100/70' : isDel ? 'bg-red-100/70' : 'bg-zinc-50';
        const markCol = isAdd ? 'text-emerald-700' : isDel ? 'text-red-700' : 'text-zinc-400';
        return (
          <div key={i} className={`flex ${bg} ${isHl ? 'ring-1 ring-inset ring-amber-300/70' : ''}`}>
            <span className={`w-10 shrink-0 select-none border-r border-zinc-200/60 pr-1.5 text-right text-zinc-400 tabular-nums ${gutter}`}>{ln}</span>
            <span className={`w-5 shrink-0 select-none text-center ${markCol}`}>{isAdd ? '+' : isDel ? '−' : ' '}</span>
            <code className="flex-1 overflow-x-auto whitespace-pre pr-3 text-zinc-900">{toks.map(([tk, txt], j) => <Sx key={j} tk={tk}>{txt}</Sx>)}</code>
          </div>
        );
      })}
      <CIExpander dir="down"/>
    </div>
  );
}

// One feed item — PR context strip + the real GhComment card.
// The anchored diff rides in GhComment's diffSlice slot (Conversation-tab parity).
function CIFeedItem({ c }) {
  return (
    <li className={`relative border-b border-zinc-100 px-5 py-3.5 ${c.unread ? 'bg-blue-50/20' : 'hover:bg-zinc-50/40'}`}>
      {c.unread && <span className="absolute inset-y-0 left-0 w-[3px] bg-blue-500/80"/>}
      <div className="mb-2"><CIContextStrip c={c}/></div>
      <GhComment
        author={c.actor}
        age={c.age}
        body={ciBody(c)}
        diffSlice={c.snippet ? <CIDiffSlice snippet={c.snippet} file={c.file} line={c.line}/> : undefined}
        reactions={c.reactions}
        highlight={c.threadResolved ? 'resolved' : undefined}
        copyContext={c.file ? { file: c.file, line: c.line, code: '' } : undefined}
      />
    </li>
  );
}

// Activity-group header.
function CIGroupHeader({ label, hint, count }) {
  return (
    <li className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-100 bg-white/85 px-5 py-2 backdrop-blur-sm">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-700">{label}</span>
      <span className="inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-zinc-100 px-1.5 text-[10px] font-semibold tabular-nums text-zinc-500">{count}</span>
      <div className="h-px flex-1 bg-zinc-100"/>
      <span className="text-[10.5px] text-zinc-400">{hint}</span>
    </li>
  );
}

// Cursor-pagination footer (25 / page).
function CIPaginationFooter({ v, shown }) {
  if (v.loading) {
    return (
      <li className="flex items-center justify-center gap-2 border-t border-zinc-100 bg-zinc-50/40 px-5 py-6 text-[12px] text-zinc-500">
        <svg viewBox="0 0 24 24" className="size-3.5 animate-[spin_1s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
        <span>Fetching page {(v.page || 1) + 1}…</span><span className="text-zinc-300">·</span>
        <code className="font-mono text-[10.5px] text-zinc-400">after: {v.cursor || 'Y3Vyc29yOjI1'}</code>
      </li>
    );
  }
  return (
    <li className="flex flex-col items-center gap-2 border-t border-zinc-100 bg-zinc-50/30 px-5 py-6">
      <div className="flex items-center gap-3 text-[12px] text-zinc-500">
        <span><b className="font-semibold tabular-nums text-zinc-700">{v.pageSize || 25}</b> / page · page <b className="font-semibold tabular-nums text-zinc-700">{v.page || 1}</b> · <span className="tabular-nums">{shown}</span> of ~118</span>
        <SSeparator vertical className="h-3"/>
        <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"><LI name="chevron-down" className="size-3.5"/>Load next 25</button>
      </div>
      <span className="text-[10.5px] text-zinc-400">Cursor pagination · GitHub Search returns 100/page · 30 req/min budget</span>
    </li>
  );
}

// ════════════════════════════════════════════════════════════════
//  Screen — Comments dashboard (no tabs).
// ════════════════════════════════════════════════════════════════
function ShadcnCommentsScreen({ width = 1320, height = 820, view = {} }) {
  const v = {
    sidebarCollapsed: true,
    // server
    relationship: 'involves:@me', scope: '', state: 'is:open', label: '', time: '', sort: 'updated',
    serverPopover: null, resultCount: 47,
    // refine
    search: '', typeFilter: 'any', author: 'any', thread: 'any', unreadOnly: false,
    refinePopover: null,
    // pagination
    loading: false, page: 1, pageSize: 25, cursor: 'Y3Vyc29yOjI1',
    ...view,
  };
  const query = ciBuildQuery(v);
  const fetched = INBOX_COMMENTS.length;
  const rows = ciRefine(INBOX_COMMENTS, v);
  const unread = INBOX_COMMENTS.filter(c => c.unread).length;

  // Group filtered rows into activity buckets, preserving order.
  const grouped = CI_BUCKETS.map(b => ({ ...b, items: rows.filter(c => ciBucketOf(c.age) === b.id) })).filter(g => g.items.length);

  return (
    <PierWindowShell width={width} height={height}
      title="Comments" subtitle={`${unread} unread · ${fetched} fetched`}
      sidebar={<PierSidebar active="inbox" collapsed={v.sidebarCollapsed}/>}
      sidebarCollapsed={v.sidebarCollapsed}
      toolbar={<>
        <SButton variant="ghost" size="sm" icon="refresh">Refresh</SButton>
        <SButton variant="ghost" size="sm" icon="check-check">Mark all read</SButton>
      </>}
      status={<>
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>Connected · alex-cho</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>Last checked <span className="text-zinc-900">14s ago</span> · 60s cadence</span>
        <SSeparator vertical className="mx-2 h-3"/>
        <span>{unread} unread · {rows.length} shown</span>
        <span className="ml-auto">Rate 4,983 / 5,000</span>
      </>}
    >
      <CIServerBand v={v} query={query}/>
      <CIRefineBand v={v} fetched={fetched} shown={rows.length}/>
      <div className="flex-1 overflow-auto bg-zinc-50/30">
        {rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
            <div className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white"><LI name="search" className="size-5 text-zinc-400" strokeWidth={1.7}/></div>
            <div className="text-[14px] font-semibold text-zinc-900">No comments match these filters.</div>
            <div className="mt-1 max-w-sm text-[12px] text-zinc-500">{(v.search || '').trim() ? <>Nothing for "<span className="font-mono">{v.search}</span>" in the fetched set.</> : <>Loosen the refine filters or widen the GitHub query above.</>}</div>
          </div>
        ) : (
          <ul className="bg-white">
            {grouped.map(g => (
              <React.Fragment key={g.id}>
                <CIGroupHeader label={g.label} hint={g.hint} count={g.items.length}/>
                {g.items.map(c => <CIFeedItem key={c.id} c={c}/>)}
              </React.Fragment>
            ))}
            <CIPaginationFooter v={v} shown={rows.length}/>
          </ul>
        )}
      </div>
    </PierWindowShell>
  );
}

// ─── Exports ────────────────────────────────────────────────────
Object.assign(window, {
  ShadcnCommentsScreen,
  CIServerBand, CIRefineBand, CIFeedItem, CIContextStrip,
});
