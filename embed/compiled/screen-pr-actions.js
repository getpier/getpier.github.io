// PR-lifecycle actions for Pyor.
//
// Six features, layered on the existing shadcn redesign:
//   1. Status-pill action menu             — PRStatusPillButton / PRStatusPillState
//   2. Merge split-button + dialog          — PRMergeControl / PRMergeDialog
//   3. Confirm modal (generic + w/ reason)  — PRConfirmModal
//   4. Reviewer management                  — PRReviewerPickerPopover, PRReviewerActionsHover
//   5. Inline PR editing                    — PRTitleEditing, PRBodyEditing
//   6. Copy-path button on inline threads   — PRCopyPathButton, plus PRInlineThreadHeader demo
//
// Everything is built on the existing shadcn primitives (SButton, SBadge,
// SDropdownMenu, SPopover, SDialog, SCommand, SHoverCard, STextarea, …) and
// re-uses the existing PR header chrome / branch-refs row / comment-card
// header — no new toolbars or persistent surfaces. Each component renders a
// happy-path static state so we can mock state combos on the design canvas.

// ── Local helpers ──────────────────────────────────────────────────────

// A compact "spec close-up" frame for an artboard. Renders just the PR header
// chrome slice we need plus a small caption strip, so we don't reproduce the
// whole macOS shell for every tiny variant.
function PRACard({
  width = 1080,
  height,
  caption,
  children,
  padded = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "shadcn-root font-sans antialiased",
    style: {
      width,
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white",
    style: {
      boxShadow: '0 10px 30px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
    }
  }, caption && /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-2 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex size-1.5 rounded-full bg-zinc-400"
  }), /*#__PURE__*/React.createElement("span", null, caption)), /*#__PURE__*/React.createElement("div", {
    className: `relative flex-1 min-h-0 ${padded ? 'p-5' : ''}`
  }, children)));
}

// PR header — title row (just the breadcrumb + title + #num + right actions).
// Re-used by status-pill artboards, inline-title-edit, merge-control, etc.
function PRHeaderTitleRow({
  title = 'perf(diff-render): virtualise hunks larger than 2k lines',
  num = 9217,
  right = null
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-baseline gap-x-2 gap-y-1"
  }, /*#__PURE__*/React.createElement("a", {
    className: "inline-flex cursor-pointer items-center gap-0.5 text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-left",
    className: "-ml-0.5 size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Inbox")), /*#__PURE__*/React.createElement("span", {
    className: "text-[15px] font-light text-zinc-300"
  }, "/"), /*#__PURE__*/React.createElement("h1", {
    className: "text-[18px] font-semibold leading-tight tracking-tight text-zinc-950"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[14px] font-medium text-zinc-400"
  }, "#", num))), right && /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-1.5"
  }, right));
}

// Branch-refs meta line — the row that reads
// "[Open badge] nicolae-i wants to merge 14 commits into main from perf/virtualise-hunks · opened 1d 4h ago"
// Status-pill becomes a button when statusOpen|menu is provided; right-slot
// is where the merge control lands inline with the refs.
function PRBranchRefsRow({
  status = 'open',
  pillTrigger = null,
  // override the status pill (used by status-pill-menu mocks)
  showRefs = true,
  rightSlot = null,
  // e.g. <PRMergeSplitButton/>
  meta = 'Opened 1d 4h ago · synced 12s ago'
}) {
  const pill = pillTrigger ?? /*#__PURE__*/React.createElement(PRStatusPillButton, {
    state: status
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-x-2 gap-y-2 text-[12.5px] text-zinc-600"
  }, pill, showRefs && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "nicolae-i"), " wants to merge ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "14 commits"), " into"), /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "main"), /*#__PURE__*/React.createElement("span", null, "from"), /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "perf/virtualise-hunks"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, meta)), rightSlot && /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, rightSlot));
}

// ═════════════════════════════════════════════════════════════════════════
// 1 ·  STATUS-PILL ACTION MENU
// ═════════════════════════════════════════════════════════════════════════

// Status pill rendered as a button-with-chevron. Matches the existing SBadge
// styling but is interactive — clicking opens an SDropdownMenu of state
// transitions appropriate to the current state.
function PRStatusPillButton({
  state = 'open',
  open = false
}) {
  const cfg = {
    open: {
      tone: 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-50',
      icon: 'git-pull-request',
      label: 'Open'
    },
    closed: {
      tone: 'border-red-200 bg-red-50/70 text-red-700 hover:bg-red-50',
      icon: 'git-pull-request',
      label: 'Closed'
    },
    draft: {
      tone: 'border-zinc-200 bg-zinc-100/80 text-zinc-700 hover:bg-zinc-100',
      icon: 'git-pull-request-draft',
      label: 'Draft'
    },
    merged: {
      tone: 'border-violet-200 bg-violet-50/70 text-violet-700 hover:bg-violet-50',
      icon: 'git-merge',
      label: 'Merged'
    }
  }[state];
  return /*#__PURE__*/React.createElement("button", {
    className: `inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${cfg.tone} ${open ? 'ring-2 ring-zinc-900/10' : ''}`,
    style: open ? {
      borderColor: 'rgba(24,24,27,0.4)'
    } : undefined
  }, /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", null, cfg.label), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "-mr-0.5 size-3 opacity-70"
  }));
}

// Menu of transitions appropriate to the current state.
function PRStatusPillMenu({
  state
}) {
  if (state === 'open') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SDropdownLabel, null, "Change status"), /*#__PURE__*/React.createElement(SDropdownItem, {
      icon: "git-pull-request-draft",
      label: "Convert to draft"
    }), /*#__PURE__*/React.createElement(SDropdownSeparator, null), /*#__PURE__*/React.createElement(SDropdownItem, {
      icon: "x-circle",
      label: "Close pull request",
      danger: true
    }));
  }
  if (state === 'closed') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SDropdownLabel, null, "Change status"), /*#__PURE__*/React.createElement(SDropdownItem, {
      icon: "git-pull-request",
      label: "Reopen pull request"
    }), /*#__PURE__*/React.createElement(SDropdownItem, {
      icon: "git-pull-request-draft",
      label: "Reopen as draft"
    }));
  }
  if (state === 'draft') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SDropdownLabel, null, "Change status"), /*#__PURE__*/React.createElement(SDropdownItem, {
      icon: "check-circle",
      label: "Mark as ready for review"
    }), /*#__PURE__*/React.createElement(SDropdownSeparator, null), /*#__PURE__*/React.createElement(SDropdownItem, {
      icon: "x-circle",
      label: "Close pull request",
      danger: true
    }));
  }
  return null;
}

// Wraps the pill + open menu together (used by the design-canvas mocks).
function PRStatusPillWithMenu({
  state = 'open',
  menuOpen = true
}) {
  return /*#__PURE__*/React.createElement(SDropdownMenu, {
    open: menuOpen,
    width: 232,
    align: "start",
    trigger: /*#__PURE__*/React.createElement(PRStatusPillButton, {
      state: state,
      open: menuOpen
    })
  }, /*#__PURE__*/React.createElement(PRStatusPillMenu, {
    state: state
  }));
}

// ═════════════════════════════════════════════════════════════════════════
// 2 ·  MERGE CONTROL  +  DIALOG  +  BLOCKED / CONFLICT STATES
// ═════════════════════════════════════════════════════════════════════════

// Methods enabled by repo settings.
const MERGE_METHODS = [{
  id: 'create',
  icon: 'git-merge',
  label: 'Create a merge commit',
  hint: 'All commits from this branch will be added to the base branch via a merge commit.'
}, {
  id: 'squash',
  icon: 'git-commit',
  label: 'Squash and merge',
  hint: 'The 14 commits will be combined into one commit.'
}, {
  id: 'rebase',
  icon: 'corner-down-right',
  label: 'Rebase and merge',
  hint: 'The 14 commits will be rebased onto the base branch.'
}];

// Split button — primary = current default method · caret = method picker +
// branch ops (update branch · enable/disable auto-merge).
function PRMergeSplitButton({
  method = 'squash',
  menuOpen = false,
  disabled = false,
  blockedReason = null,
  autoMerge = false,
  conflict = false,
  onClick = null
}) {
  const cur = MERGE_METHODS.find(m => m.id === method) || MERGE_METHODS[1];

  // Conflict gets its own visual language — red-tinted + alert icon + a "can't
  // merge" label — so it reads as "blocked by conflicts", distinct from the
  // neutral gray-disabled state used for pending checks / required reviews.
  // Clicking opens a popover (see PRMergeConflictState) explaining the block.
  if (conflict) {
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick,
      className: `inline-flex items-stretch overflow-hidden rounded-md border border-red-200 shadow-sm transition-colors ${menuOpen ? 'ring-2 ring-red-500/20' : ''}`,
      "aria-haspopup": "dialog",
      "aria-expanded": menuOpen,
      title: "2 files conflict with main \u2014 resolve before merging"
    }, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex h-8 items-center gap-1.5 bg-red-50 px-3 text-[12.5px] font-semibold text-red-700 hover:bg-red-100/70"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "alert-triangle",
      className: "size-3.5"
    }), /*#__PURE__*/React.createElement("span", null, "Can't merge")), /*#__PURE__*/React.createElement("span", {
      className: "w-px self-stretch bg-red-200"
    }), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex h-8 items-center justify-center bg-red-50 px-2 text-red-400 hover:bg-red-100/70"
    }, /*#__PURE__*/React.createElement(LI, {
      name: menuOpen ? 'chevron-up' : 'chevron-down',
      className: "size-3.5"
    })));
  }
  const primaryTone = disabled ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700';
  const caretTone = disabled ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700/30';
  return /*#__PURE__*/React.createElement(SPopover, {
    open: menuOpen,
    align: "end",
    width: 340,
    trigger: /*#__PURE__*/React.createElement("div", {
      className: "inline-flex items-stretch overflow-hidden rounded-md shadow-sm"
    }, /*#__PURE__*/React.createElement("button", {
      disabled: disabled,
      className: `inline-flex h-8 items-center gap-1.5 px-3 text-[12.5px] font-semibold transition-colors ${primaryTone}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: cur.icon,
      className: "size-3.5"
    }), /*#__PURE__*/React.createElement("span", null, cur.label)), /*#__PURE__*/React.createElement("span", {
      className: `w-px self-stretch ${disabled ? 'bg-zinc-200' : 'bg-white/20'}`
    }), /*#__PURE__*/React.createElement("button", {
      disabled: disabled,
      className: `inline-flex h-8 items-center justify-center px-2 transition-colors ${caretTone} border-l`,
      title: "Choose merge method"
    }, /*#__PURE__*/React.createElement(LI, {
      name: menuOpen ? 'chevron-up' : 'chevron-down',
      className: "size-3.5"
    })))
  }, /*#__PURE__*/React.createElement(PRMergeMenu, {
    method: method,
    autoMerge: autoMerge
  }));
}

// Caret-menu contents — list of methods + branch operations.
function PRMergeMenu({
  method,
  autoMerge
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
  }, "Merge method"), MERGE_METHODS.map(m => {
    const on = m.id === method;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      className: `flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left transition-colors ${on ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm ${on ? 'text-zinc-900' : 'text-zinc-400'}`
    }, on ? /*#__PURE__*/React.createElement(LI, {
      name: "check",
      className: "size-3.5"
    }) : /*#__PURE__*/React.createElement(LI, {
      name: m.icon,
      className: "size-3.5"
    })), /*#__PURE__*/React.createElement("span", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block text-[12.5px] font-medium text-zinc-900"
    }, m.label), /*#__PURE__*/React.createElement("span", {
      className: "block text-[11px] text-zinc-500 line-clamp-2"
    }, m.hint)), on && /*#__PURE__*/React.createElement("span", {
      className: "rounded-full bg-zinc-900 px-1.5 py-0 text-[9.5px] font-semibold uppercase tracking-wide text-white"
    }, "Default"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-100 p-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
  }, "Branch"), /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "refresh",
    label: "Update branch from main"
  }), autoMerge ? /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "x-circle",
    label: "Disable auto-merge"
  }) : /*#__PURE__*/React.createElement(SDropdownItem, {
    icon: "clock",
    label: "Enable auto-merge\u2026"
  })));
}

// Disabled-with-reason — a thin line under the split button explaining why
// merging is blocked, with a chevron to expand the full checklist.
function PRMergeBlockedReason({
  items
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-md border border-amber-200 bg-amber-50/70 px-3 py-2 text-[12px] text-amber-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 font-semibold"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-circle",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Merging is blocked"), /*#__PURE__*/React.createElement("span", {
    className: "ml-1 font-normal text-amber-700/80"
  }, items.length, " ", items.length === 1 ? 'reason' : 'reasons', " below")), /*#__PURE__*/React.createElement("ul", {
    className: "mt-1.5 space-y-1 pl-5"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "relative text-[11.5px] text-amber-800"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute -left-3.5 top-1.5 inline-block size-1 rounded-full bg-amber-500"
  }), it))));
}

// Conflict banner — now dismissable. The `onDismiss` affordance collapses the
// banner to a slim residual chip (see PRMergeConflictResidual) so the reason
// stays discoverable without the full-width red bar nagging permanently.
function PRMergeConflictBanner({
  onDismiss = null
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 rounded-md border border-red-200 bg-red-50/70 px-3 py-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "size-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[12.5px] font-semibold text-red-900"
  }, "This branch has conflicts that must be resolved"), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 text-[11.5px] text-red-700/80"
  }, "2 files conflict with ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-white/60 px-1 py-0.5 font-mono text-[11px]"
  }, "main"), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "VirtualHunk.tsx"), ", ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "measureHunk.ts"))), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    icon: "external-link",
    className: "border-red-300 bg-white text-red-700 hover:bg-red-50"
  }, "Resolve on GitHub"), onDismiss && /*#__PURE__*/React.createElement(STooltip, {
    label: "Dismiss \xB7 the merge button stays blocked"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    className: "-mr-1 inline-flex size-6 shrink-0 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-100/70 hover:text-red-700",
    "aria-label": "Dismiss conflict banner"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x",
    className: "size-3.5"
  }))));
}

// The collapsed residual the banner leaves behind once dismissed — a slim
// inline chip that re-opens the full banner on click, so the conflict reason
// is never lost even though the merge button already shows the blocked state.
function PRMergeConflictResidual({
  onReopen = null
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onReopen,
    className: "inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50/60 px-2 py-1 text-[11.5px] font-medium text-red-700 transition-colors hover:bg-red-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "2 files"), " conflict with main"), /*#__PURE__*/React.createElement("span", {
    className: "text-red-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "underline-offset-2 hover:underline"
  }, "Details"));
}

// Content of the popover that opens when the blocked merge button is clicked.
// Folds the old banner's information into an on-demand surface + actions.
function PRMergeConflictPopover() {
  const files = ['src/diff/VirtualHunk.tsx', 'src/diff/measureHunk.ts'];
  return /*#__PURE__*/React.createElement("div", {
    className: "w-[330px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 px-3 pt-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "alert-triangle",
    className: "size-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] font-semibold text-zinc-900"
  }, "Merge blocked by conflicts"), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 text-[11.5px] leading-relaxed text-zinc-500"
  }, "These files changed on ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10.5px]"
  }, "main"), " since this branch was created. Resolve them before merging."))), /*#__PURE__*/React.createElement("div", {
    className: "mt-2.5 border-t border-zinc-100 px-3 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400"
  }, "2 conflicting files"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-0.5"
  }, files.map(f => /*#__PURE__*/React.createElement("li", {
    key: f,
    className: "flex items-center gap-1.5 text-[11.5px] text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: "size-3 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, f))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 border-t border-zinc-100 bg-zinc-50/60 px-3 py-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    size: "sm",
    icon: "git-merge",
    className: "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800"
  }, "Resolve in Pyor"), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    icon: "external-link"
  }, "Resolve on GitHub")));
}

// Conflict state — the merge button alone, flipped to its blocked "Can't
// merge" state. Clicking it opens an explanatory popover (files + resolve
// actions) rather than dead-ending; no persistent banner.
function PRMergeConflictState({
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement(PRBranchRefsRow, {
    rightSlot: /*#__PURE__*/React.createElement(SPopover, {
      open: open,
      align: "end",
      width: 330,
      trigger: /*#__PURE__*/React.createElement(PRMergeSplitButton, {
        method: "squash",
        conflict: true,
        menuOpen: open,
        onClick: () => setOpen(o => !o)
      })
    }, /*#__PURE__*/React.createElement(PRMergeConflictPopover, null))
  });
}

// Auto-merge enabled badge — sits inline next to the (now-disabled) primary
// to clarify the queued state.
function PRAutoMergeBadge() {
  return /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/70 px-2 py-1 text-[11.5px] font-medium text-blue-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "clock",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Auto-merge will trigger once checks pass"), /*#__PURE__*/React.createElement("span", {
    className: "text-blue-400"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "cursor-pointer underline-offset-2 hover:underline"
  }, "disable"));
}

// Merge confirmation dialog — editable commit subject + body, delete-branch
// toggle, cancel/confirm footer.
function PRMergeDialog({
  method = 'squash',
  defaultTitle = 'perf(diff-render): virtualise hunks larger than 2k lines (#9217)',
  defaultBody = `* introduce VirtualHunk with line-window virtualisation\n* cache measureHunk widths per font family\n* wire VirtualHunk into NaiveHunk above 2k lines\n* drop the unused useState setter in the threshold branch\n\nLocal benchmark: 600ms → 38ms median frame on the 18k-line PR sample.\nCo-authored-by: priya-r <priya@example.com>`,
  deleteBranch = true
}) {
  const cfg = MERGE_METHODS.find(m => m.id === method) || MERGE_METHODS[1];
  return /*#__PURE__*/React.createElement(SDialog, {
    open: true,
    width: 680
  }, /*#__PURE__*/React.createElement(SDialogHeader, {
    icon: cfg.icon,
    title: `${cfg.label} into main`,
    description: `Combines 14 commits from perf/virtualise-hunks into main as a single commit.`
  }), /*#__PURE__*/React.createElement(SDialogBody, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "Commit subject"), /*#__PURE__*/React.createElement("input", {
    defaultValue: defaultTitle,
    className: "mt-1.5 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-[12.5px] text-zinc-900 outline-none transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "Commit body"), /*#__PURE__*/React.createElement(STextarea, {
    mono: true,
    size: "lg",
    defaultValue: defaultBody,
    className: "mt-1.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center justify-between text-[11px] text-zinc-400"
  }, /*#__PURE__*/React.createElement("span", null, "Markdown is supported \xB7 pre-fills from PR description + commit messages."), /*#__PURE__*/React.createElement("span", null, "5 lines \xB7 312 chars"))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-start gap-2.5 rounded-md border border-zinc-200 bg-zinc-50/40 px-3 py-2 cursor-pointer hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement("span", {
    className: `mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm border ${deleteBranch ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-300 bg-white'}`
  }, deleteBranch && /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: "size-3 text-white"
  })), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block text-[12.5px] font-medium text-zinc-900"
  }, "Delete ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "perf/virtualise-hunks"), " after merging"), /*#__PURE__*/React.createElement("span", {
    className: "block text-[11.5px] text-zinc-500"
  }, "No open PRs reference this branch. You can always restore it from the closed PR page.")))), /*#__PURE__*/React.createElement(SDialogFooter, null, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Cancel"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), "16 of 18 checks passed"), /*#__PURE__*/React.createElement(SButton, {
    size: "sm",
    className: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: "size-3.5"
  }), "Confirm ", cfg.label.toLowerCase()))));
}

// ═════════════════════════════════════════════════════════════════════════
// 3 ·  CONFIRM MODAL  (generic + with-required-text variant)
// ═════════════════════════════════════════════════════════════════════════

function PRConfirmModal({
  tone = 'destructive',
  // 'destructive' | 'neutral'
  icon = 'alert-triangle',
  title = 'Close this pull request?',
  description = 'The branch will not be merged. You can reopen this pull request later — comments and reviews are preserved.',
  reasonRequired = false,
  reasonLabel = 'Reason',
  reasonHint = 'Required · shared with the reviewer.',
  reasonPlaceholder = 'Why are you dismissing this review?',
  cancel = 'Cancel',
  confirm = 'Close pull request',
  confirmIcon = 'x-circle'
}) {
  const iconWrap = tone === 'destructive' ? 'bg-red-50 text-red-600 ring-red-100' : 'bg-amber-50 text-amber-600 ring-amber-100';
  const confirmCls = tone === 'destructive' ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' : 'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800';
  return /*#__PURE__*/React.createElement(SDialog, {
    open: true,
    width: 460
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 px-4 py-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `inline-flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ${iconWrap}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[14.5px] font-semibold tracking-tight text-zinc-950"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-[12.5px] leading-relaxed text-zinc-600"
  }, description), reasonRequired && /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-1.5 flex items-baseline justify-between"
  }, /*#__PURE__*/React.createElement(SLabel, null, reasonLabel), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] text-zinc-400"
  }, reasonHint)), /*#__PURE__*/React.createElement(STextarea, {
    size: "sm",
    placeholder: reasonPlaceholder
  })))), /*#__PURE__*/React.createElement(SDialogFooter, null, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, cancel), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto"
  }, /*#__PURE__*/React.createElement(SButton, {
    size: "sm",
    className: confirmCls
  }, confirmIcon && /*#__PURE__*/React.createElement(LI, {
    name: confirmIcon,
    className: "size-3.5"
  }), confirm))));
}

// ═════════════════════════════════════════════════════════════════════════
// 4 ·  REVIEWER MANAGEMENT
// ═════════════════════════════════════════════════════════════════════════

// SCommand-driven picker in an SPopover. Anchored under the "+" add chip.
function PRReviewerPickerPopover({
  query = ''
}) {
  const suggestions = [{
    name: 'mira-okafor',
    role: 'Codeowner · diff/*',
    badge: 'codeowner'
  }, {
    name: 'jules-baxter',
    role: 'Reviewed 3 prior PRs here',
    badge: 'frequent'
  }, {
    name: 'sven-larsen',
    role: 'Suggested by @nicolae-i',
    badge: null
  }];
  const people = [{
    name: 'anh-tran',
    role: 'Mobile · React Native'
  }, {
    name: 'helena-ross',
    role: 'Design Systems'
  }, {
    name: 'tomasz-kw',
    role: 'Infra'
  }];
  const teams = [{
    name: 'eng/perf',
    meta: '6 members · Codeowner of diff/*'
  }, {
    name: 'eng/design-systems',
    meta: '4 members'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "w-[320px] overflow-hidden rounded-lg border border-zinc-200 bg-white",
    style: SHADCN_FLOAT_SHADOW
  }, /*#__PURE__*/React.createElement(SCommand, null, /*#__PURE__*/React.createElement(SCommandInput, {
    placeholder: "Add reviewer or team\u2026",
    defaultValue: query,
    matches: query ? 2 : null
  }), /*#__PURE__*/React.createElement("div", {
    className: "max-h-[340px] overflow-auto"
  }, /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "Suggested"
  }, suggestions.map(s => /*#__PURE__*/React.createElement(SCommandItem, {
    key: s.name
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: s.name,
    size: "size-6"
  }), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block truncate text-[12.5px] font-medium text-zinc-900"
  }, s.name), /*#__PURE__*/React.createElement("span", {
    className: "block truncate text-[11px] text-zinc-500"
  }, s.role)), s.badge === 'codeowner' && /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "text-[9.5px]"
  }, "CODEOWNER"), s.badge === 'frequent' && /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "text-[9.5px]"
  }, "frequent")))), /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "People"
  }, people.map(s => /*#__PURE__*/React.createElement(SCommandItem, {
    key: s.name
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: s.name,
    size: "size-6"
  }), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block truncate text-[12.5px] font-medium text-zinc-900"
  }, s.name), /*#__PURE__*/React.createElement("span", {
    className: "block truncate text-[11px] text-zinc-500"
  }, s.role))))), /*#__PURE__*/React.createElement(SCommandGroup, {
    heading: "Teams"
  }, teams.map(t => /*#__PURE__*/React.createElement(SCommandItem, {
    key: t.name
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "users",
    className: "size-3.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "block truncate text-[12.5px] font-medium text-zinc-900"
  }, t.name), /*#__PURE__*/React.createElement("span", {
    className: "block truncate text-[11px] text-zinc-500"
  }, t.meta)))))), /*#__PURE__*/React.createElement(SCommandFooter, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-2 py-0.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SKbd, null, "\u2191\u2193"), " navigate \xB7 ", /*#__PURE__*/React.createElement(SKbd, null, "\u21B5"), " add"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(SKbd, null, "esc"), " close")))));
}

// A standalone reviewer action card — same visual chrome as the SHoverCard
// content but rendered statically so the canvas can show it without CSS hover.
function PRReviewerActionsCard({
  name,
  role,
  state,
  age,
  comment,
  actions // array of { label, icon, tone? }
}) {
  const cfg = {
    approved: {
      dot: 'bg-emerald-500',
      label: 'Approved this PR',
      icon: 'check-circle',
      tone: 'border-emerald-200 bg-emerald-50/60 text-emerald-700'
    },
    changes: {
      dot: 'bg-red-500',
      label: 'Requested changes',
      icon: 'x-circle',
      tone: 'border-red-200 bg-red-50/60 text-red-700'
    },
    pending: {
      dot: 'bg-amber-500',
      label: 'Awaiting review',
      icon: 'circle-dot',
      tone: 'border-amber-200 bg-amber-50/60 text-amber-700'
    }
  }[state];
  return /*#__PURE__*/React.createElement("div", {
    className: "relative w-[300px] rounded-lg border border-zinc-200 bg-white p-3",
    style: SHADCN_FLOAT_SHADOW
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 left-6 size-2 rotate-45 border-l border-t border-zinc-200 bg-white"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: name,
    size: "size-9"
  }), /*#__PURE__*/React.createElement("span", {
    className: `absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ${cfg.dot} ring-2 ring-white`
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "truncate text-[13.5px] font-semibold text-zinc-900"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "truncate text-[11.5px] text-zinc-500"
  }, "@", name, " \xB7 ", role))), /*#__PURE__*/React.createElement("div", {
    className: `mt-3 flex items-center gap-2 rounded-md border px-2 py-1.5 text-[12px] ${cfg.tone}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: cfg.icon,
    className: "size-3.5 shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, cfg.label), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] opacity-80"
  }, age)), comment && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 rounded-md bg-zinc-50 px-2.5 py-2 text-[12px] leading-relaxed text-zinc-600 line-clamp-3"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "quote",
    className: "mb-1 inline size-3 text-zinc-400"
  }), " ", comment), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 grid grid-cols-1 gap-1"
  }, actions.map((a, i) => {
    const cls = a.tone === 'danger' ? 'border border-red-200 bg-white text-red-700 hover:bg-red-50' : a.tone === 'primary' ? 'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800' : 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50';
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: `inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors ${cls}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: a.icon,
      className: "size-3.5"
    }), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 text-left"
    }, a.label), a.kbd && /*#__PURE__*/React.createElement(SKbd, null, a.kbd));
  })));
}

// ═════════════════════════════════════════════════════════════════════════
// 5 ·  INLINE PR EDITING — title + body
// ═════════════════════════════════════════════════════════════════════════

// Title-in-edit-mode — the breadcrumb-title row swaps the H1 for an input.
function PRTitleEditing({
  value = 'perf(diff-render): virtualise hunks larger than 2k lines'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-x-2 gap-y-1.5"
  }, /*#__PURE__*/React.createElement("a", {
    className: "inline-flex items-center gap-0.5 text-[13px] font-medium text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-left",
    className: "-ml-0.5 size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Inbox")), /*#__PURE__*/React.createElement("span", {
    className: "text-[15px] font-light text-zinc-300"
  }, "/"), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    defaultValue: value,
    className: "min-w-0 flex-1 rounded-md border border-zinc-900 bg-white px-2.5 py-1 text-[17px] font-semibold leading-tight tracking-tight text-zinc-950 outline-none ring-2 ring-zinc-900/10",
    style: {
      minWidth: 320
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[14px] font-medium text-zinc-400"
  }, "#9217")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1.5 flex items-center gap-2 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "pencil",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", null, "Editing title"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement(SKbd, null, "\u2318\u23CE"), /*#__PURE__*/React.createElement("span", null, "save"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement(SKbd, null, "esc"), /*#__PURE__*/React.createElement("span", null, "cancel"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto font-mono text-[11px] text-zinc-400"
  }, value.length, " / 256"))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    size: "sm",
    icon: "check"
  }, "Save title")));
}

// Title in normal mode with a hover-revealed pencil affordance — paired with
// PRTitleEditing so the canvas can show the trigger.
function PRTitleWithEditAffordance() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-baseline gap-x-2 gap-y-1"
  }, /*#__PURE__*/React.createElement("a", {
    className: "inline-flex items-center gap-0.5 text-[13px] font-medium text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-left",
    className: "-ml-0.5 size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "Inbox")), /*#__PURE__*/React.createElement("span", {
    className: "text-[15px] font-light text-zinc-300"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "group/title inline-flex items-baseline gap-2 rounded-md px-1 py-0.5 -mx-1 hover:bg-zinc-100/60"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-[18px] font-semibold leading-tight tracking-tight text-zinc-950"
  }, "perf(diff-render): virtualise hunks larger than 2k lines"), /*#__PURE__*/React.createElement("button", {
    title: "Edit title",
    className: "inline-flex size-6 items-center justify-center rounded-md text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-200/60 hover:text-zinc-700 group-hover/title:opacity-100"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "pencil",
    className: "size-3.5"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[14px] font-medium text-zinc-400"
  }, "#9217")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1.5 text-[11.5px] text-zinc-400"
  }, "Hover the title to edit.")));
}

// Body in edit mode — reuses GhInlineEditor inside a card matching the
// "Description" card pattern.
function PRBodyEditing({
  text
}) {
  const dflt = `## Summary\n\nVirtualises hunks above 2k lines. The naïve hunk renderer was painting every line for huge files, which dominated frame time on the 18k-line review.\n\n- introduce **VirtualHunk** with line-window virtualisation\n- cache \`measureHunk\` widths per font family\n- wire **VirtualHunk** into **NaiveHunk** above 2k lines\n\n## Benchmark\n\n| Sample            | before | after  |\n|-------------------|--------|--------|\n| 2 348 lines       |  84ms  |  21ms  |\n| 18 219 lines      | 612ms  |  38ms  |\n\nCloses #9011, refs #9180.`;
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border border-zinc-200 bg-white shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 px-3 py-2 text-[12.5px]"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "nicolae-i",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "nicolae-i"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "opened this \xB7 1d 4h ago"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "ml-1 text-[9.5px]"
  }, "author"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 rounded-full border border-blue-600/40 bg-blue-50 px-1.5 py-0 text-[9.5px] font-medium text-blue-600"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "pencil",
    className: "size-2.5"
  }), "Editing description"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] text-zinc-400"
  }, "Markdown \xB7 \u2318\u23CE to save")), /*#__PURE__*/React.createElement(GhInlineEditor, {
    text: text || dflt,
    tab: "write"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/40 px-3 py-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "sparkles",
    className: "size-3"
  }), "Drafts autosave every 5s"), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Cancel"), /*#__PURE__*/React.createElement(SButton, {
    size: "sm",
    icon: "check"
  }, "Update description"))));
}

// ═════════════════════════════════════════════════════════════════════════
// 6 ·  COPY-PATH BUTTON  on inline comment cards
// ═════════════════════════════════════════════════════════════════════════

// The button itself — two states (idle + copied).
function PRCopyPathButton({
  copied = false
}) {
  if (copied) {
    return /*#__PURE__*/React.createElement("span", {
      className: "relative inline-flex"
    }, /*#__PURE__*/React.createElement("button", {
      className: "inline-flex h-6 items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 text-[11px] font-medium text-emerald-700 transition-colors",
      "aria-pressed": "true"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "check",
      className: "size-3"
    }), /*#__PURE__*/React.createElement("span", null, "Copied")), /*#__PURE__*/React.createElement("span", {
      className: "pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-1.5 py-0.5 text-[10.5px] font-medium text-white shadow-lg"
    }, "Path copied to clipboard"));
  }
  return /*#__PURE__*/React.createElement(STooltip, {
    label: "Copy file path",
    kbd: "\u2318\u21E7."
  }, /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-6 items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900",
    title: "Copy file path"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "copy",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", null, "Copy path")));
}

// Mock-friendly version of the inline-thread anchor header that hosts the
// copy-path button. (The real chrome would be edited directly inside
// gh-comments.jsx — this isolates the variation for the design canvas.)
function PRInlineThreadAnchorHeader({
  file = 'src/diff/VirtualHunk.tsx',
  line = 32,
  comments = 3,
  resolved = false,
  copied = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 rounded-t-lg border-b border-zinc-100 bg-zinc-50/60 px-3 py-1.5 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-zinc-700"
  }, file), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, ":"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "L", line), /*#__PURE__*/React.createElement(PRCopyPathButton, {
    copied: copied
  }), resolved && /*#__PURE__*/React.createElement(SBadge, {
    variant: "success",
    className: "ml-1 gap-1 text-[9.5px]"
  }, /*#__PURE__*/React.createElement(LI2, {
    name: "check",
    className: "size-2.5"
  }), "Resolved"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] text-zinc-400"
  }, comments, " ", comments === 1 ? 'comment' : 'comments'));
}

// A mock inline comment card with the new header — so the canvas shows how
// the button reads in real context (header + a sample comment under it).
function PRInlineCommentCardWithCopy({
  copied = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-lg border border-zinc-200 bg-white shadow-sm"
  }, /*#__PURE__*/React.createElement(PRInlineThreadAnchorHeader, {
    copied: copied
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-md border border-zinc-200 bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-100 px-3 py-2 text-[12.5px]"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-5"
  }), /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "alex-cho"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "text-[9.5px]"
  }, "you"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "text-[9.5px]"
  }, "reviewer"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "2h ago")), /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-2.5 text-[12.5px] leading-relaxed text-zinc-700"
  }, "Why ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "useState(() => measureHunk(...))"), " instead of ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "useMemo"), "? We never call ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "setWindow"), " in the threshold branch \u2014 this allocates a setter we throw away."))));
}

// ── Exports ─────────────────────────────────────────────────────────────
Object.assign(window, {
  PRACard,
  PRHeaderTitleRow,
  PRBranchRefsRow,
  PRStatusPillButton,
  PRStatusPillMenu,
  PRStatusPillWithMenu,
  PRMergeSplitButton,
  PRMergeMenu,
  PRMergeBlockedReason,
  PRMergeConflictBanner,
  PRMergeConflictResidual,
  PRMergeConflictPopover,
  PRMergeConflictState,
  PRAutoMergeBadge,
  PRMergeDialog,
  PRConfirmModal,
  PRReviewerPickerPopover,
  PRReviewerActionsCard,
  PRTitleEditing,
  PRTitleWithEditAffordance,
  PRBodyEditing,
  PRCopyPathButton,
  PRInlineThreadAnchorHeader,
  PRInlineCommentCardWithCopy,
  MERGE_METHODS
});