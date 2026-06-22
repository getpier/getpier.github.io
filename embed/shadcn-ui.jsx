// Shadcn primitives — Pyor's local copy of the parts of shadcn/ui we lean on.
// Why a separate file: previously the "shadcn" surface was scattered across
//   - screen-shadcn.jsx  (SButton, SBadge, SAvatar, SKbd, SSeparator)
//   - shadcn-app.jsx     (SCard, SInput, STabs*, SCheckbox, SChip)
//   - inline div-soup    (popovers, dropdowns, hovercards, tooltips, dialogs)
// This file consolidates the *new* primitives we were hand-rolling everywhere
// (popover, hovercard, dropdown menu, textarea, tooltip, dialog, command list)
// and adds an SLabel + SSelectTrigger reused by the various form pickers.
//
// Load order: AFTER screen-shadcn.jsx (depends on SButton/SBadge/SKbd) and
// BEFORE gh-comments.jsx / shadcn-app.jsx (consume the primitives here).
//
// Design notes
// ────────────
// Components are static-mock friendly: an `open` prop force-shows the
// popover/menu/dialog so we can mock states on the design canvas. In a real
// runtime they'd be Radix-controlled.
//
// All primitives obey the existing Tailwind `important: '.shadcn-root'`
// scoping. They use the same zinc palette + dark-mode override layer in
// Pyor.html.

// ── Floating panel shadow (shared across popover, hovercard, dropdown,
//    command, dialog) — keeps every floating surface visually consistent. ──
const SHADCN_FLOAT_SHADOW = {
  boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.05)',
};

// ── SLabel ──────────────────────────────────────────────────────
function SLabel({ children, className = '', htmlFor }) {
  return (
    <label htmlFor={htmlFor}
      className={`block text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500 ${className}`}>
      {children}
    </label>
  );
}

// ── STextarea ───────────────────────────────────────────────────
function STextarea({ placeholder, defaultValue, value, className = '', rows, mono = false, size = 'default' }) {
  const min = size === 'sm' ? 'min-h-[70px]' : size === 'lg' ? 'min-h-[160px]' : 'min-h-[120px]';
  return (
    <textarea
      rows={rows}
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      className={`w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] leading-relaxed text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${mono ? 'font-mono' : ''} ${min} ${className}`}
    />
  );
}

// ── SPopover ────────────────────────────────────────────────────
// Anchored floating panel. Caller renders <SPopover open trigger=…>…</SPopover>
// — trigger goes in a relative container, content opens below it.
//
// Props
//   open       — boolean, mock-friendly; forces visibility
//   side       — 'bottom' | 'top' (caret position; default 'bottom')
//   align      — 'start' | 'center' | 'end' | 'stretch' (default 'stretch')
//   width      — explicit width in px; otherwise stretches to trigger
//   trigger    — required: the anchor element
function SPopover({ open, side = 'bottom', align = 'stretch', width, trigger, children, className = '' }) {
  const alignCls = align === 'stretch' ? 'left-0 right-0'
                 : align === 'center'  ? 'left-1/2 -translate-x-1/2'
                 : align === 'end'     ? 'right-0'
                                       : 'left-0';
  const sideCls = side === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';
  return (
    <div className="relative">
      {trigger}
      {open && (
        <div
          className={`absolute ${sideCls} ${alignCls} z-40 overflow-hidden rounded-lg border border-zinc-200 bg-white ${className}`}
          style={{ ...SHADCN_FLOAT_SHADOW, width }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── SHoverCard ──────────────────────────────────────────────────
// CSS-driven hover popover. Wrap the trigger and content; the group/hover-card
// utility opens the content on parent hover. Caller controls placement.
function SHoverCard({ trigger, children, width = 288, side = 'bottom', align = 'center', triggerClassName = '' }) {
  const alignCls = align === 'start' ? 'left-0'
                 : align === 'end'   ? 'right-0'
                                     : 'left-1/2 -translate-x-1/2';
  const sideCls = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  return (
    <div className={`group/hovercard relative ${triggerClassName}`}>
      {trigger}
      <div
        className={`pointer-events-none invisible absolute ${sideCls} ${alignCls} z-40 opacity-0 transition-all duration-150 ease-out group-hover/hovercard:visible group-hover/hovercard:opacity-100 group-hover/hovercard:pointer-events-auto`}
        style={{ width }}
      >
        <div className="relative rounded-lg border border-zinc-200 bg-white p-3" style={SHADCN_FLOAT_SHADOW}>
          {/* Caret pointing back at the trigger */}
          {side === 'bottom' && (
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-l border-t border-zinc-200 bg-white"/>
          )}
          {side === 'top' && (
            <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-zinc-200 bg-white"/>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// ── STooltip ────────────────────────────────────────────────────
// Lightweight visual tooltip (separate from the browser's `title` attr,
// which we keep as a fallback). Renders on group-hover.
function STooltip({ label, kbd, children, side = 'top', triggerClassName = '' }) {
  const sideCls = side === 'top'   ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2'
                : side === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2'
                : side === 'left'  ? 'right-full mr-2 top-1/2 -translate-y-1/2'
                :                    'top-full mt-1.5 left-1/2 -translate-x-1/2';
  return (
    <span className={`group/tip relative inline-flex ${triggerClassName}`}>
      {children}
      <span
        className={`pointer-events-none absolute ${sideCls} z-50 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-100 group-hover/tip:opacity-100`}
      >
        {label}
        {kbd && <span className="ml-1.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">{kbd}</span>}
      </span>
    </span>
  );
}

// ── SDropdownMenu ────────────────────────────────────────────────
// Trigger button + items menu. `open` to force-show. Wraps every menu we
// previously hand-rolled (kebab menus, etc.).
function SDropdownMenu({ open, trigger, align = 'end', width = 220, children, className = '' }) {
  return (
    <SPopover open={open} trigger={trigger} align={align} width={typeof width === 'number' ? width : undefined} className={`p-1 ${className}`}>
      {children}
    </SPopover>
  );
}
function SDropdownItem({ icon, label, kbd, danger = false, children, onClick }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12.5px] transition-colors ${danger ? 'text-red-600 hover:bg-red-50' : 'text-zinc-700 hover:bg-zinc-100'}`}>
      {icon && <LI2 name={icon} className="size-3.5 shrink-0"/>}
      <span className="flex-1 truncate">{children || label}</span>
      {kbd && <SKbd>{kbd}</SKbd>}
    </button>
  );
}
function SDropdownSeparator() {
  return <div className="my-1 h-px bg-zinc-100"/>;
}
function SDropdownLabel({ children }) {
  return <div className="px-2 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{children}</div>;
}

// ── SDialog ─────────────────────────────────────────────────────
// Modal frame + scrim. `open` controls visibility. Caller provides the body
// (header / content / footer composition is up to the consumer).
function SDialog({ open, width = 560, onClose, children, className = '' }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div
        className={`overflow-hidden rounded-xl border border-zinc-200 bg-white ${className}`}
        style={{ width, boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.05)' }}
      >
        {children}
      </div>
    </div>
  );
}
function SDialogHeader({ icon, title, description, onClose }) {
  return (
    <div className="flex items-start gap-2.5 border-b border-zinc-100 px-4 py-3">
      {icon && <LI name={icon} className="mt-0.5 size-4 text-zinc-500"/>}
      <div className="flex-1">
        <div className="text-[14px] font-semibold tracking-tight text-zinc-950">{title}</div>
        {description && <div className="mt-0.5 text-[11.5px] text-zinc-500">{description}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} title="Close · Esc"
          className="inline-flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
          <LI name="x" className="size-4"/>
        </button>
      )}
    </div>
  );
}
function SDialogBody({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function SDialogFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}

// ── SCommand ────────────────────────────────────────────────────
// Combobox / command-palette pattern. Used by repo and worktree pickers,
// any keyboard-driven list selection. Composition mirrors shadcn's Command:
//   <SCommand>
//     <SCommandInput placeholder="..."/>
//     <SCommandGroup heading="Pinned">
//       <SCommandItem ...>...</SCommandItem>
//     </SCommandGroup>
//     <SCommandFooter>...</SCommandFooter>
//   </SCommand>
function SCommand({ children, className = '' }) {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
}
function SCommandInput({ placeholder = 'Search…', defaultValue, matches }) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2">
      <LI name="search" className="size-3.5 text-zinc-400"/>
      <input autoFocus defaultValue={defaultValue} placeholder={placeholder}
        className="flex-1 bg-transparent text-[12.5px] text-zinc-900 outline-none placeholder:text-zinc-400"/>
      {matches != null && (
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">{matches} {matches === 1 ? 'match' : 'matches'}</span>
      )}
    </div>
  );
}
function SCommandGroup({ heading, children }) {
  return (
    <div className="border-b border-zinc-100 py-1.5 last:border-b-0">
      {heading && <div className="px-3 pt-0.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{heading}</div>}
      <div>{children}</div>
    </div>
  );
}
function SCommandItem({ active = false, onClick, children, className = '' }) {
  return (
    <button onClick={onClick}
      className={`group flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors ${active ? 'bg-zinc-50' : 'hover:bg-zinc-50'} ${className}`}>
      {children}
    </button>
  );
}
function SCommandEmpty({ children }) {
  return <div className="px-3 py-4 text-center text-[12px] text-zinc-500">{children}</div>;
}
function SCommandFooter({ children }) {
  return <div className="border-t border-zinc-100 bg-zinc-50/60 p-1">{children}</div>;
}

// ── SSelectTrigger ──────────────────────────────────────────────
// Button-styled select trigger used by every form picker. Replaces the
// hand-rolled `PickerSelect` / `RepoPickerSelect` / `WorktreePickerSelect`
// surfaces — they all share this chrome. Pass a custom `right` slot for
// kbd hints, extra badges, etc.
function SSelectTrigger({ icon, open, mono = false, value, hint, badges, kbd, right, className = '' }) {
  const border = open ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200';
  return (
    <button className={`flex w-full items-center gap-2.5 rounded-md border bg-white px-3 py-2 transition-colors hover:bg-zinc-50 ${border} ${className}`}>
      {icon && <LI name={icon} className="size-4 text-zinc-500"/>}
      <div className="flex-1 text-left">
        <div className={`flex items-center gap-1.5 text-[13px] font-semibold text-zinc-900 ${mono ? 'font-mono' : ''}`}>
          <span className="truncate">{value}</span>
          {badges}
        </div>
        {hint && <div className="mt-0.5">{hint}</div>}
      </div>
      {right}
      {kbd && <SKbd>{kbd}</SKbd>}
      <LI name={open ? 'chevron-up' : 'chevron-down'} className="size-3.5 text-zinc-400"/>
    </button>
  );
}

// Note: LI2 is defined in gh-comments.jsx. SDropdownItem references it,
// so consumers must load gh-comments.jsx before they invoke SDropdownItem.
// (Pyor.html already orders it that way: screen-shadcn → gh-comments →
// shadcn-app. shadcn-ui.jsx loads BETWEEN screen-shadcn and gh-comments,
// but the SDropdownItem references are resolved at *call* time, not at
// definition time.)

Object.assign(window, {
  SLabel, STextarea,
  SPopover, SHoverCard, STooltip,
  SDropdownMenu, SDropdownItem, SDropdownSeparator, SDropdownLabel,
  SDialog, SDialogHeader, SDialogBody, SDialogFooter,
  SCommand, SCommandInput, SCommandGroup, SCommandItem, SCommandEmpty, SCommandFooter,
  SSelectTrigger,
  SHADCN_FLOAT_SHADOW,
});

// ── SToggleGroup ────────────────────────────────────────────────
// Segmented control / pill-tab group. Used for layout toggles (Inline/Split,
// Tree/List, Write/Preview). Items can be label-only or icon-only.
//   <SToggleGroup value="inline" options={[
//     { id: 'inline', icon: 'rows', label: 'Inline' },
//     { id: 'split',  icon: 'columns', label: 'Split' },
//   ]}/>
function SToggleGroup({ value, options, size = 'sm', mode = 'label', className = '' }) {
  const h = size === 'sm' ? 'h-7' : 'h-8';
  const itemH = size === 'sm' ? 'h-6' : 'h-7';
  return (
    <div className={`inline-flex rounded-md bg-zinc-100 p-0.5 ${h} ${className}`}>
      {options.map(o => {
        const on = o.id === value;
        if (mode === 'icon') {
          return (
            <button key={o.id} title={o.label}
              className={`inline-flex ${itemH} ${size === 'sm' ? 'w-6' : 'w-7'} items-center justify-center rounded transition-colors ${on ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>
              <LI name={o.icon} className="size-3.5"/>
            </button>
          );
        }
        return (
          <button key={o.id} title={o.label}
            className={`inline-flex ${itemH} items-center gap-1 rounded px-2 text-[11.5px] font-medium transition-colors ${on ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>
            {o.icon && <LI name={o.icon} className="size-3.5"/>} {o.label}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { SToggleGroup });
