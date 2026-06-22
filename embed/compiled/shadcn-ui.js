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
  boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.05)'
};

// ── SLabel ──────────────────────────────────────────────────────
function SLabel({
  children,
  className = '',
  htmlFor
}) {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    className: `block text-[11.5px] font-semibold uppercase tracking-wider text-zinc-500 ${className}`
  }, children);
}

// ── STextarea ───────────────────────────────────────────────────
function STextarea({
  placeholder,
  defaultValue,
  value,
  className = '',
  rows,
  mono = false,
  size = 'default'
}) {
  const min = size === 'sm' ? 'min-h-[70px]' : size === 'lg' ? 'min-h-[160px]' : 'min-h-[120px]';
  return /*#__PURE__*/React.createElement("textarea", {
    rows: rows,
    defaultValue: defaultValue,
    value: value,
    placeholder: placeholder,
    className: `w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-[12.5px] leading-relaxed text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 ${mono ? 'font-mono' : ''} ${min} ${className}`
  });
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
function SPopover({
  open,
  side = 'bottom',
  align = 'stretch',
  width,
  trigger,
  children,
  className = ''
}) {
  const alignCls = align === 'stretch' ? 'left-0 right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'end' ? 'right-0' : 'left-0';
  const sideCls = side === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';
  return /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, trigger, open && /*#__PURE__*/React.createElement("div", {
    className: `absolute ${sideCls} ${alignCls} z-40 overflow-hidden rounded-lg border border-zinc-200 bg-white ${className}`,
    style: {
      ...SHADCN_FLOAT_SHADOW,
      width
    }
  }, children));
}

// ── SHoverCard ──────────────────────────────────────────────────
// CSS-driven hover popover. Wrap the trigger and content; the group/hover-card
// utility opens the content on parent hover. Caller controls placement.
function SHoverCard({
  trigger,
  children,
  width = 288,
  side = 'bottom',
  align = 'center',
  triggerClassName = ''
}) {
  const alignCls = align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';
  const sideCls = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  return /*#__PURE__*/React.createElement("div", {
    className: `group/hovercard relative ${triggerClassName}`
  }, trigger, /*#__PURE__*/React.createElement("div", {
    className: `pointer-events-none invisible absolute ${sideCls} ${alignCls} z-40 opacity-0 transition-all duration-150 ease-out group-hover/hovercard:visible group-hover/hovercard:opacity-100 group-hover/hovercard:pointer-events-auto`,
    style: {
      width
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-lg border border-zinc-200 bg-white p-3",
    style: SHADCN_FLOAT_SHADOW
  }, side === 'bottom' && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-l border-t border-zinc-200 bg-white"
  }), side === 'top' && /*#__PURE__*/React.createElement("span", {
    className: "absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-zinc-200 bg-white"
  }), children)));
}

// ── STooltip ────────────────────────────────────────────────────
// Lightweight visual tooltip (separate from the browser's `title` attr,
// which we keep as a fallback). Renders on group-hover.
function STooltip({
  label,
  kbd,
  children,
  side = 'top',
  triggerClassName = ''
}) {
  const sideCls = side === 'top' ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2' : side === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : side === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : 'top-full mt-1.5 left-1/2 -translate-x-1/2';
  return /*#__PURE__*/React.createElement("span", {
    className: `group/tip relative inline-flex ${triggerClassName}`
  }, children, /*#__PURE__*/React.createElement("span", {
    className: `pointer-events-none absolute ${sideCls} z-50 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-100 group-hover/tip:opacity-100`
  }, label, kbd && /*#__PURE__*/React.createElement("span", {
    className: "ml-1.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]"
  }, kbd)));
}

// ── SDropdownMenu ────────────────────────────────────────────────
// Trigger button + items menu. `open` to force-show. Wraps every menu we
// previously hand-rolled (kebab menus, etc.).
function SDropdownMenu({
  open,
  trigger,
  align = 'end',
  width = 220,
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    trigger: trigger,
    align: align,
    width: typeof width === 'number' ? width : undefined,
    className: `p-1 ${className}`
  }, children);
}
function SDropdownItem({
  icon,
  label,
  kbd,
  danger = false,
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: `flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[12.5px] transition-colors ${danger ? 'text-red-600 hover:bg-red-50' : 'text-zinc-700 hover:bg-zinc-100'}`
  }, icon && /*#__PURE__*/React.createElement(LI2, {
    name: icon,
    className: "size-3.5 shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 truncate"
  }, children || label), kbd && /*#__PURE__*/React.createElement(SKbd, null, kbd));
}
function SDropdownSeparator() {
  return /*#__PURE__*/React.createElement("div", {
    className: "my-1 h-px bg-zinc-100"
  });
}
function SDropdownLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "px-2 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
  }, children);
}

// ── SDialog ─────────────────────────────────────────────────────
// Modal frame + scrim. `open` controls visibility. Caller provides the body
// (header / content / footer composition is up to the consumer).
function SDialog({
  open,
  width = 560,
  onClose,
  children,
  className = ''
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: `overflow-hidden rounded-xl border border-zinc-200 bg-white ${className}`,
    style: {
      width,
      boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 0 0 0.5px rgba(0,0,0,0.05)'
    }
  }, children));
}
function SDialogHeader({
  icon,
  title,
  description,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 border-b border-zinc-100 px-4 py-3"
  }, icon && /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "mt-0.5 size-4 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[14px] font-semibold tracking-tight text-zinc-950"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 text-[11.5px] text-zinc-500"
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    title: "Close \xB7 Esc",
    className: "inline-flex size-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x",
    className: "size-4"
  })));
}
function SDialogBody({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `p-4 ${className}`
  }, children);
}
function SDialogFooter({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-4 py-3 ${className}`
  }, children);
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
function SCommand({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex flex-col ${className}`
  }, children);
}
function SCommandInput({
  placeholder = 'Search…',
  defaultValue,
  matches
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 px-3 py-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    defaultValue: defaultValue,
    placeholder: placeholder,
    className: "flex-1 bg-transparent text-[12.5px] text-zinc-900 outline-none placeholder:text-zinc-400"
  }), matches != null && /*#__PURE__*/React.createElement("span", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500"
  }, matches, " ", matches === 1 ? 'match' : 'matches'));
}
function SCommandGroup({
  heading,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-100 py-1.5 last:border-b-0"
  }, heading && /*#__PURE__*/React.createElement("div", {
    className: "px-3 pt-0.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
  }, heading), /*#__PURE__*/React.createElement("div", null, children));
}
function SCommandItem({
  active = false,
  onClick,
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: `group flex w-full items-center gap-2.5 px-3 py-1.5 text-left transition-colors ${active ? 'bg-zinc-50' : 'hover:bg-zinc-50'} ${className}`
  }, children);
}
function SCommandEmpty({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-4 text-center text-[12px] text-zinc-500"
  }, children);
}
function SCommandFooter({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-100 bg-zinc-50/60 p-1"
  }, children);
}

// ── SSelectTrigger ──────────────────────────────────────────────
// Button-styled select trigger used by every form picker. Replaces the
// hand-rolled `PickerSelect` / `RepoPickerSelect` / `WorktreePickerSelect`
// surfaces — they all share this chrome. Pass a custom `right` slot for
// kbd hints, extra badges, etc.
function SSelectTrigger({
  icon,
  open,
  mono = false,
  value,
  hint,
  badges,
  kbd,
  right,
  className = ''
}) {
  const border = open ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200';
  return /*#__PURE__*/React.createElement("button", {
    className: `flex w-full items-center gap-2.5 rounded-md border bg-white px-3 py-2 transition-colors hover:bg-zinc-50 ${border} ${className}`
  }, icon && /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-4 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-1.5 text-[13px] font-semibold text-zinc-900 ${mono ? 'font-mono' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate"
  }, value), badges), hint && /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5"
  }, hint)), right, kbd && /*#__PURE__*/React.createElement(SKbd, null, kbd), /*#__PURE__*/React.createElement(LI, {
    name: open ? 'chevron-up' : 'chevron-down',
    className: "size-3.5 text-zinc-400"
  }));
}

// Note: LI2 is defined in gh-comments.jsx. SDropdownItem references it,
// so consumers must load gh-comments.jsx before they invoke SDropdownItem.
// (Pyor.html already orders it that way: screen-shadcn → gh-comments →
// shadcn-app. shadcn-ui.jsx loads BETWEEN screen-shadcn and gh-comments,
// but the SDropdownItem references are resolved at *call* time, not at
// definition time.)

Object.assign(window, {
  SLabel,
  STextarea,
  SPopover,
  SHoverCard,
  STooltip,
  SDropdownMenu,
  SDropdownItem,
  SDropdownSeparator,
  SDropdownLabel,
  SDialog,
  SDialogHeader,
  SDialogBody,
  SDialogFooter,
  SCommand,
  SCommandInput,
  SCommandGroup,
  SCommandItem,
  SCommandEmpty,
  SCommandFooter,
  SSelectTrigger,
  SHADCN_FLOAT_SHADOW
});

// ── SToggleGroup ────────────────────────────────────────────────
// Segmented control / pill-tab group. Used for layout toggles (Inline/Split,
// Tree/List, Write/Preview). Items can be label-only or icon-only.
//   <SToggleGroup value="inline" options={[
//     { id: 'inline', icon: 'rows', label: 'Inline' },
//     { id: 'split',  icon: 'columns', label: 'Split' },
//   ]}/>
function SToggleGroup({
  value,
  options,
  size = 'sm',
  mode = 'label',
  className = ''
}) {
  const h = size === 'sm' ? 'h-7' : 'h-8';
  const itemH = size === 'sm' ? 'h-6' : 'h-7';
  return /*#__PURE__*/React.createElement("div", {
    className: `inline-flex rounded-md bg-zinc-100 p-0.5 ${h} ${className}`
  }, options.map(o => {
    const on = o.id === value;
    if (mode === 'icon') {
      return /*#__PURE__*/React.createElement("button", {
        key: o.id,
        title: o.label,
        className: `inline-flex ${itemH} ${size === 'sm' ? 'w-6' : 'w-7'} items-center justify-center rounded transition-colors ${on ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`
      }, /*#__PURE__*/React.createElement(LI, {
        name: o.icon,
        className: "size-3.5"
      }));
    }
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      title: o.label,
      className: `inline-flex ${itemH} items-center gap-1 rounded px-2 text-[11.5px] font-medium transition-colors ${on ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`
    }, o.icon && /*#__PURE__*/React.createElement(LI, {
      name: o.icon,
      className: "size-3.5"
    }), " ", o.label);
  }));
}
Object.assign(window, {
  SToggleGroup
});