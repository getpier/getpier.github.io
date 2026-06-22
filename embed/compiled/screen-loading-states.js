// ────────────────────────────────────────────────────────────────────
// screen-loading-states.jsx — PR-detail async loading states
// ────────────────────────────────────────────────────────────────────
// Pyor's PR-detail page has 5 independent async data sources (PR meta,
// file list, file contents, comments+threads, checks). Their interleaving
// produces ~6 user-visible loading states. The cold-start "everything is
// loading" already exists as ShadcnStateLoadingScreen — this file covers
// the five remaining states, plus a network-error variant that's not
// strictly "loading" but lives in the same family.
//
// Design rules — keep the family coherent:
//   • Reuse the cold-start skeleton language: grey bars (bg-zinc-200
//     animate-pulse), the "loading card" with a thin progress bar.
//   • Chrome above the diff (PRHeader, tabs, sub-toolbar) is rendered at
//     full fidelity in every state. The skeleton is always *inside* the
//     content area — the user never sees a half-built window.
//   • Progressive reveal is the loading affordance. Bodies that haven't
//     arrived are obviously absent (skeleton blocks, dashed placeholders);
//     bodies that arrived render as if nothing was loading.
//   • Skipped/error states use the same chrome but swap the body for a
//     bordered card so they read as deliberate, not broken.
//   • These artboards size to 1320 × 900 to slot next to existing
//     shell-pr-* artboards in section "00 · App shell" of the canvas.
// ────────────────────────────────────────────────────────────────────

// ── Skeleton primitives ─────────────────────────────────────────────
function SkelBar({
  width = '100%',
  height = 8,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `rounded bg-zinc-200 animate-pulse ${className}`,
    style: {
      width,
      height
    }
  });
}

// Deterministic pseudo-random widths so layout is stable across renders
// but rows don't look identical. Pass an index, get a width in [min, max].
function pseudoWidth(i, min = 30, max = 92) {
  const v = Math.sin(i * 12.9898) * 43758.5453 % 1;
  const f = Math.abs(v);
  return Math.round(min + f * (max - min));
}

// A skeleton "hunk" — line-number gutter + variable-width grey bars.
// Mirrors the shape of a real diff so the reading-eye is primed.
// Heights cap so a streaming file doesn't dominate the scroll viewport.
function SkelHunk({
  rows = 8,
  seed = 0,
  hint = null
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[12px] leading-[18px] bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center bg-zinc-50/80 border-y border-zinc-200/60 px-3 py-1"
  }, /*#__PURE__*/React.createElement(SkelBar, {
    width: 64,
    height: 10,
    className: "bg-zinc-200/80"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-3 text-[10.5px] text-zinc-400 font-mono"
  }, "@@ \u2026"), hint && /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-1.5 text-[10.5px] text-zinc-400 font-sans"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 animate-spin"
  }), hint)), Array.from({
    length: rows
  }).map((_, j) => {
    const w = pseudoWidth(seed * 13 + j * 7, 24, 86);
    const tone = j % 7 === 1 ? 'bg-emerald-100' : j % 11 === 5 ? 'bg-red-100' : 'bg-zinc-200';
    const indent = j % 5 * 12;
    return /*#__PURE__*/React.createElement("div", {
      key: j,
      className: "flex items-center h-[18px]"
    }, /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 w-11 text-right pr-1.5 text-zinc-300 tabular-nums select-none"
    }, seed * 10 + j + 12), /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 w-11 text-right pr-1.5 text-zinc-300 tabular-nums select-none"
    }, seed * 10 + j + 12), /*#__PURE__*/React.createElement("span", {
      className: "shrink-0 w-5 text-center text-zinc-300"
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 pr-3",
      style: {
        paddingLeft: indent
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-2 rounded animate-pulse ${tone}`,
      style: {
        width: `${w}%`,
        maxWidth: 720
      }
    })));
  }));
}

// Skeleton commit row — mirrors the real Commits-tab row.
function SkelCommitRow({
  i
}) {
  const w1 = pseudoWidth(i * 3 + 1, 38, 78);
  const w2 = pseudoWidth(i * 3 + 2, 14, 28);
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-100 px-5 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "size-6 rounded-full bg-zinc-200 animate-pulse shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1 space-y-1.5"
  }, /*#__PURE__*/React.createElement(SkelBar, {
    width: `${w1}%`,
    height: 10
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SkelBar, {
    width: 86,
    height: 8
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300 text-[10px]"
  }, "\xB7"), /*#__PURE__*/React.createElement(SkelBar, {
    width: `${w2}%`,
    height: 8
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SkelBar, {
    width: 62,
    height: 20,
    className: "rounded-md"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10.5px] text-zinc-300 tracking-wider"
  }, "\xB7\xB7\xB7\xB7\xB7\xB7\xB7")));
}

// Skeleton check row — mirrors the real Checks-tab row.
function SkelCheckRow({
  i
}) {
  const w = pseudoWidth(i * 5 + 3, 30, 70);
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-100 px-5 py-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "size-3.5 rounded-full bg-zinc-200 animate-pulse"
  }), /*#__PURE__*/React.createElement(SkelBar, {
    width: `${w}%`,
    height: 9
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(SkelBar, {
    width: 56,
    height: 8
  }), /*#__PURE__*/React.createElement(SkelBar, {
    width: 28,
    height: 8
  }), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    className: "size-3 text-zinc-300"
  })));
}

// ── Custom file rail variants ────────────────────────────────────────
// Real-fidelity rail header, but rows are skeletons (file list is still
// paginating). Indent + width vary to imply tree depth + path length.
function FileRailSkeleton({
  count = 14
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-72 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 p-2 border-b border-zinc-200"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter files\u2026",
    className: "h-7 flex-1",
    disabled: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex h-7 items-center rounded-md border border-zinc-200 bg-white px-1.5 opacity-60"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "list-tree",
    className: "size-3.5 text-zinc-400"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-hidden py-1"
  }, Array.from({
    length: count
  }).map((_, i) => {
    const depth = i === 0 ? 0 : i % 4 === 0 ? 0 : i % 3 === 0 ? 1 : 2;
    const isFolder = depth < 2 && i % 5 === 0;
    const w = pseudoWidth(i, 42, 90);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "flex items-center gap-1.5 h-7 text-[12.5px] border-l-2 border-transparent",
      style: {
        paddingLeft: 8 + depth * 14,
        paddingRight: 10
      }
    }, isFolder ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LI, {
      name: "chevron-down",
      className: "size-3 text-zinc-300"
    }), /*#__PURE__*/React.createElement(LI, {
      name: "folder",
      className: "size-3.5 text-zinc-300"
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "w-3"
    }), /*#__PURE__*/React.createElement(LI, {
      name: "file",
      className: "size-3.5 text-zinc-300"
    })), /*#__PURE__*/React.createElement(SkelBar, {
      width: `${w}%`,
      height: 8
    }), /*#__PURE__*/React.createElement("span", {
      className: "ml-auto font-mono text-[9.5px] tabular-nums text-zinc-300 tracking-tight"
    }, "+", /*#__PURE__*/React.createElement(SkelBar, {
      width: 14,
      height: 6,
      className: "inline-block align-middle"
    }), ' ', "\u2212", /*#__PURE__*/React.createElement(SkelBar, {
      width: 10,
      height: 6,
      className: "inline-block align-middle"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 animate-spin"
  }), "Listing files\u2026"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono tabular-nums"
  }, "\u2014 / \u2014")));
}

// Real-fidelity rail rendering a known file list, with a per-row badge
// for files whose contents have/haven't arrived yet (used by content-streaming).
function FileRailWithProgress({
  files,
  currentName
}) {
  const arrived = files.filter(f => f.arrived).length;
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-72 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 p-2 border-b border-zinc-200"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter files\u2026",
    className: "h-7 flex-1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex h-7 items-center rounded-md border border-zinc-200 bg-white px-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "list-tree",
    className: "size-3.5 text-zinc-500"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto py-1"
  }, files.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex items-center gap-1.5 h-7 text-[12.5px] ${f.name === currentName ? 'bg-zinc-200/60 border-l-2 border-zinc-900' : 'border-l-2 border-transparent'}`,
    style: {
      paddingLeft: 8 + f.depth * 14,
      paddingRight: 10
    }
  }, f.kind === 'folder' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3.5 text-zinc-500"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "w-3"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: `size-3.5 ${f.arrived ? 'text-zinc-400' : 'text-zinc-300'}`
  })), /*#__PURE__*/React.createElement("span", {
    className: `flex-1 truncate ${f.name === currentName ? 'font-semibold' : ''} ${f.arrived ? '' : 'text-zinc-400'}`
  }, f.name), f.kind === 'file' && !f.arrived && /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 text-zinc-400 animate-spin"
  }), f.kind === 'file' && /*#__PURE__*/React.createElement("span", {
    className: `font-mono text-[10px] tabular-nums ${f.arrived ? '' : 'text-zinc-300'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: f.arrived ? 'text-emerald-600' : 'text-emerald-300'
  }, "+", f.add), ' ', /*#__PURE__*/React.createElement("span", {
    className: f.arrived ? 'text-red-600' : 'text-red-300'
  }, "\u2212", f.del))))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, files.filter(f => f.kind === 'file').length, " files \xB7 2 folders"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative size-2.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-0 rounded-full bg-zinc-300"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-0 rounded-full bg-zinc-900 animate-pulse",
    style: {
      clipPath: `inset(0 ${100 - arrived / files.filter(f => f.kind === 'file').length * 100}% 0 0)`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "font-mono tabular-nums"
  }, arrived, "/", files.filter(f => f.kind === 'file').length))));
}

// ── Sub-toolbar variants ────────────────────────────────────────────
// "computing diffs · N / M" replaces the commits pill while contents
// stream in. Viewed-progress bar is muted (you can't mark-viewed yet).
function FilesToolbarStreaming({
  done = 118,
  total = 200,
  bytesDone = 4.2,
  bytesTotal = 7.1
}) {
  const pct = done / total * 100;
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3.5 text-zinc-500 animate-spin"
  }), /*#__PURE__*/React.createElement("span", null, "computing diffs"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400 tabular-nums"
  }, "\xB7 ", done, " / ", total)), /*#__PURE__*/React.createElement("div", {
    className: "relative h-1 w-32 rounded-full bg-zinc-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 bg-zinc-900 transition-[width] duration-500",
    style: {
      width: `${pct}%`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-pulse",
    style: {
      left: `${Math.max(0, pct - 12)}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-zinc-500 tabular-nums"
  }, bytesDone, " MB / ", bytesTotal, " MB"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-44 opacity-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 h-1 rounded-full bg-zinc-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 bg-zinc-400",
    style: {
      width: '0%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] tabular-nums text-zinc-400"
  }, "0/", total)), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex h-7 w-44 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-xs text-zinc-400 opacity-60"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "flex-1"
  }, "Search ready when diffs arrive")), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto inline-flex rounded-md border border-zinc-200 bg-white p-0.5 opacity-60"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex h-6 items-center gap-1 rounded px-2 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "rows",
    className: "size-3"
  }), "Inline"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex h-6 items-center gap-1 rounded px-2 text-[11.5px] text-zinc-400"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "columns",
    className: "size-3"
  }), "Split")));
}

// Files-paginating sub-toolbar — file count not yet known.
function FilesToolbarFileListPending() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] font-medium text-zinc-700"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3.5 text-zinc-500 animate-spin"
  }), /*#__PURE__*/React.createElement("span", null, "listing files"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400 tabular-nums"
  }, "\xB7 page 2 of \u2014")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-44 opacity-40"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 h-1 rounded-full bg-zinc-200 overflow-hidden"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] tabular-nums"
  }, "\u2014/\u2014")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex h-7 w-44 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-xs text-zinc-400 opacity-60"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "search",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", {
    className: "flex-1"
  }, "Search in diff\u2026")));
}

// ── Real file-header (no contents arrived yet) ───────────────────────
// Reuse the established header chrome — chevron, path, ± counts,
// "Mark viewed" — but mark-viewed is disabled until the body lands.
function FileHeaderFidelity({
  name,
  add,
  del,
  status,
  viewedDisabled = true
}) {
  const statusBadge = status && /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "px-1.5 text-[10px] text-zinc-500"
  }, status);
  return /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[12px] font-semibold"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", add), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", del)), statusBadge, /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-6 items-center gap-1 rounded-md border border-zinc-200 bg-white px-1.5 text-[11px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square-plus",
    className: "size-3"
  }), " Comment on file"), /*#__PURE__*/React.createElement("label", {
    className: `inline-flex items-center gap-1.5 rounded-md border bg-white px-2 py-1 text-[11.5px] ${viewedDisabled ? 'border-zinc-200 text-zinc-400' : 'border-zinc-200 text-zinc-700'}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `size-3 rounded-sm border ${viewedDisabled ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-300 bg-white'}`
  }), "Mark viewed")));
}

// ════════════════════════════════════════════════════════════════════
// 1 · shell-pr-loading-files-paginating
// PR metadata loaded; file list still paginating from /pulls/{n}/files.
// Chrome is live. File rail = skeleton rows. Diff pane shows a single
// centered "waiting for file list" card so the pane reads as deliberate.
// ════════════════════════════════════════════════════════════════════
function PrLoadingFilesPaginating({
  width = 1320,
  height = 900
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3 animate-spin"
    }), "Paginating file list \xB7 page 2 of ~5"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "PR metadata cached \xB7 8s ago"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main@a3f7b21")))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square'
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file'
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, {
      pending: true
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(FileRailSkeleton, {
    count: 16
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 bg-white flex items-center justify-center p-10"
  }, /*#__PURE__*/React.createElement(SCard, {
    className: "w-[420px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-4 text-zinc-700 animate-spin"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] font-semibold text-zinc-900"
  }, "Resolving changed files"), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 text-[12px] text-zinc-500 leading-relaxed"
  }, "GitHub paginates ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "/pulls/9217/files"), " at 30 entries per request. Diffs start rendering as soon as the first page lands."), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 h-1 rounded-full bg-zinc-100 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-zinc-900",
    style: {
      width: '34%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center justify-between text-[11px] text-zinc-500 tabular-nums"
  }, /*#__PURE__*/React.createElement("span", null, "page ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "2"), " of ~5"), /*#__PURE__*/React.createElement("span", null, "62 files so far")))), /*#__PURE__*/React.createElement(SSeparator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 px-4 py-2 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, "You can keep typing in the review dock \u2014 drafts are local."))))), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// ════════════════════════════════════════════════════════════════════
// 2 · shell-pr-loading-content-streaming  ⭐ HERO
// File list resolved; contents fetch in flight. File headers render at
// full fidelity (no per-file pill, no spinner in the row); hunk bodies
// are skeleton blocks until contents arrive. Real diff renders in place
// for the file at the top — the seam between "arrived" and "pending"
// is what tells the user progress is happening.
// ════════════════════════════════════════════════════════════════════
function PrLoadingContentStreaming({
  width = 1320,
  height = 900,
  unified = true
}) {
  const files = [{
    kind: 'folder',
    name: 'src',
    depth: 0
  }, {
    kind: 'folder',
    name: 'diff',
    depth: 1
  }, {
    kind: 'file',
    name: 'VirtualHunk.tsx',
    depth: 2,
    add: 312,
    del: 4,
    arrived: true
  }, {
    kind: 'file',
    name: 'HunkWindow.ts',
    depth: 2,
    add: 184,
    del: 22,
    arrived: true
  }, {
    kind: 'file',
    name: 'measureHunk.ts',
    depth: 2,
    add: 96,
    del: 8,
    arrived: false
  }, {
    kind: 'file',
    name: 'rowHeight.ts',
    depth: 2,
    add: 42,
    del: 0,
    arrived: false
  }, {
    kind: 'file',
    name: 'index.ts',
    depth: 2,
    add: 4,
    del: 2,
    arrived: false
  }, {
    kind: 'folder',
    name: 'editor',
    depth: 1
  }, {
    kind: 'file',
    name: 'CodeMirrorHost.tsx',
    depth: 2,
    add: 28,
    del: 41,
    arrived: false
  }, {
    kind: 'file',
    name: 'bridge.ts',
    depth: 2,
    add: 6,
    del: 0,
    arrived: false
  }, {
    kind: 'folder',
    name: '__tests__',
    depth: 0
  }, {
    kind: 'file',
    name: 'VirtualHunk.test.tsx',
    depth: 1,
    add: 274,
    del: 234,
    arrived: false
  }];
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3 animate-spin"
    }), "Streaming diffs \xB7 2 of 7 files"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "4 batched requests \xB7 1.3 MB / 4.2 MB"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main@a3f7b21")))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), unified ? /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, {
      streaming: {
        done: 2,
        total: 7
      }
    })
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'checks',
      label: 'Checks',
      icon: 'check-circle',
      count: 18,
      failing: 2
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement(FilesToolbarStreaming, {
    done: 2,
    total: 7,
    bytesDone: 1.3,
    bytesTotal: 4.2
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(FileRailWithProgress, {
    files: files,
    currentName: "VirtualHunk.tsx"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/VirtualHunk.tsx",
    add: 312,
    del: 4,
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[12px] leading-[18px]"
  }, [{
    l: '12',
    r: '12',
    k: 'ctx',
    code: 'import { measureHunk } from "./measureHunk";'
  }, {
    l: '13',
    r: null,
    k: 'del',
    code: 'import { lineHeightFor } from "../editor";'
  }, {
    l: null,
    r: '13',
    k: 'add',
    code: 'import { lineHeightFor } from "../editor/metrics";'
  }, {
    l: '14',
    r: '14',
    k: 'ctx',
    code: ''
  }, {
    l: '15',
    r: null,
    k: 'del',
    code: 'const VIRTUALISE_THRESHOLD = 500;'
  }, {
    l: null,
    r: '15',
    k: 'add',
    code: 'const VIRTUALISE_THRESHOLD = 2_000;'
  }, {
    l: '16',
    r: '16',
    k: 'ctx',
    code: ''
  }, {
    l: '17',
    r: '17',
    k: 'ctx',
    code: 'export function VirtualHunk(props: HunkProps) {'
  }, {
    l: '18',
    r: '18',
    k: 'ctx',
    code: '  const { hunk, baseRev, headRev } = props;'
  }].map((ln, i) => {
    const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
    const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
    const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
    const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `flex ${bg}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.l ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.r ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-5 text-center ${markerColor}`
    }, marker), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 pr-3 text-zinc-900 whitespace-pre"
    }, ln.code));
  })), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/HunkWindow.ts",
    add: 184,
    del: 22,
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[12px] leading-[18px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex bg-white"
  }, /*#__PURE__*/React.createElement("span", {
    className: "shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums bg-zinc-50 border-r border-zinc-200/60"
  }, "41"), /*#__PURE__*/React.createElement("span", {
    className: "shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums bg-zinc-50 border-r border-zinc-200/60"
  }, "41"), /*#__PURE__*/React.createElement("span", {
    className: "shrink-0 w-5 text-center text-zinc-400"
  }, " "), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 pr-3 whitespace-pre"
  }, "export class HunkWindow ", '{')), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-emerald-50"
  }, /*#__PURE__*/React.createElement("span", {
    className: "shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums bg-emerald-100/70 border-r border-zinc-200/60"
  }), /*#__PURE__*/React.createElement("span", {
    className: "shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums bg-emerald-100/70 border-r border-zinc-200/60"
  }, "42"), /*#__PURE__*/React.createElement("span", {
    className: "shrink-0 w-5 text-center text-emerald-700"
  }, "+"), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 pr-3 whitespace-pre"
  }, "  private observer = new ResizeObserver(this.onResize);")), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-zinc-50/60 border-t border-zinc-200/60"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex-1 px-4 py-1.5 text-[11px] text-zinc-400 italic"
  }, "174 more lines hidden \u2014 collapsed for canvas preview"))), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/measureHunk.ts",
    add: 96,
    del: 8,
    viewedDisabled: true
  }), /*#__PURE__*/React.createElement(SkelHunk, {
    rows: 6,
    seed: 3,
    hint: "fetching \xB7 queued"
  }), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/rowHeight.ts",
    add: 42,
    del: 0,
    viewedDisabled: true,
    status: "added"
  }), /*#__PURE__*/React.createElement(SkelHunk, {
    rows: 5,
    seed: 4,
    hint: "fetching \xB7 412 KB"
  }), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/index.ts",
    add: 4,
    del: 2,
    viewedDisabled: true
  }), /*#__PURE__*/React.createElement(SkelHunk, {
    rows: 3,
    seed: 5,
    hint: "queued"
  }), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/editor/CodeMirrorHost.tsx",
    add: 28,
    del: 41,
    viewedDisabled: true
  }), /*#__PURE__*/React.createElement(SkelHunk, {
    rows: 7,
    seed: 6,
    hint: "queued"
  }))), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// ════════════════════════════════════════════════════════════════════
// 3 · shell-pr-loading-skipped-files
// Contents fully loaded. Some files came back as binary / too-large /
// parse-failed / no-contents. The per-file body shows a deliberate notice
// so the absence of a diff reads as intentional, not still-loading.
// ════════════════════════════════════════════════════════════════════
function PrLoadingSkippedFiles({
  width = 1320,
  height = 900
}) {
  const files = [{
    kind: 'folder',
    name: 'src',
    depth: 0
  }, {
    kind: 'folder',
    name: 'diff',
    depth: 1
  }, {
    kind: 'file',
    name: 'VirtualHunk.tsx',
    depth: 2,
    add: 312,
    del: 4,
    arrived: true
  }, {
    kind: 'file',
    name: 'snapshot.png',
    depth: 2,
    add: 0,
    del: 0,
    arrived: true,
    skip: 'binary'
  }, {
    kind: 'file',
    name: 'bundle.min.js',
    depth: 2,
    add: 1,
    del: 1,
    arrived: true,
    skip: 'too-large'
  }, {
    kind: 'folder',
    name: '__tests__',
    depth: 0
  }, {
    kind: 'file',
    name: 'fixtures.bin',
    depth: 1,
    add: 0,
    del: 0,
    arrived: true,
    skip: 'binary'
  }, {
    kind: 'file',
    name: 'broken.lock',
    depth: 1,
    add: 4,
    del: 4,
    arrived: true,
    skip: 'parse-failed'
  }];
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Diffs loaded \xB7 7 files \xB7 4 unrenderable"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "main@a3f7b21")))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, null)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 border-b border-amber-200 bg-amber-50/60 px-5 py-2 text-[12.5px] text-amber-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "mt-0.5 size-4 shrink-0 text-amber-600"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 leading-relaxed"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "4 of 7 files can't be rendered here."), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-amber-800/80"
  }, "2 binary \xB7 1 over 2 MB \xB7 1 lock-file Pyor doesn't parse. Each is marked in the diff stream below.")), /*#__PURE__*/React.createElement("button", {
    className: "text-[12px] font-medium text-amber-900 underline-offset-2 hover:underline"
  }, "Show all on GitHub \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(FileRailWithProgress, {
    files: files,
    currentName: "VirtualHunk.tsx"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/VirtualHunk.tsx",
    add: 312,
    del: 4,
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[12px] leading-[18px]"
  }, [{
    l: '12',
    r: '12',
    k: 'ctx',
    code: 'import { measureHunk } from "./measureHunk";'
  }, {
    l: '13',
    r: null,
    k: 'del',
    code: 'import { lineHeightFor } from "../editor";'
  }, {
    l: null,
    r: '13',
    k: 'add',
    code: 'import { lineHeightFor } from "../editor/metrics";'
  }, {
    l: '14',
    r: '14',
    k: 'ctx',
    code: ''
  }, {
    l: '15',
    r: null,
    k: 'del',
    code: 'const VIRTUALISE_THRESHOLD = 500;'
  }, {
    l: null,
    r: '15',
    k: 'add',
    code: 'const VIRTUALISE_THRESHOLD = 2_000;'
  }].map((ln, i) => {
    const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
    const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
    const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
    const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `flex ${bg}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.l ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.r ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-5 text-center ${markerColor}`
    }, marker), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 pr-3 text-zinc-900 whitespace-pre"
    }, ln.code));
  })), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/snapshot.png",
    add: 0,
    del: 0,
    status: "added",
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement(SkippedBody, {
    icon: "image",
    tone: "zinc",
    title: "Binary file \xB7 2,134 \xD7 1,200 PNG \xB7 312 KB",
    body: "Pyor renders text diffs only. Open the file on GitHub to view it side-by-side with the base.",
    actions: [{
      label: 'View on GitHub',
      icon: 'external-link',
      primary: true
    }, {
      label: 'Mark viewed',
      icon: 'eye'
    }]
  }), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/bundle.min.js",
    add: 1,
    del: 1,
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement(SkippedBody, {
    icon: "file-warning",
    tone: "amber",
    title: "File over render limit \xB7 3.2 MB \xB7 24,108 lines",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Diff is computed server-side but Pyor skips bodies above ", /*#__PURE__*/React.createElement("b", null, "2 MB"), " to keep scrolling responsive. The byte-level diff is ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "+1 / \u22121"), " \u2014 likely a chunkhash change."),
    actions: [{
      label: 'Render anyway',
      icon: 'rotate-ccw'
    }, {
      label: 'View on GitHub',
      icon: 'external-link'
    }]
  }), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "__tests__/fixtures.bin",
    add: 0,
    del: 0,
    status: "added",
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement(SkippedBody, {
    icon: "file",
    tone: "zinc",
    title: "Binary file \xB7 48 KB \xB7 no preview",
    body: "No text representation. Mark viewed if you've inspected this another way.",
    actions: [{
      label: 'View on GitHub',
      icon: 'external-link'
    }, {
      label: 'Mark viewed',
      icon: 'eye'
    }],
    compact: true
  }), /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "__tests__/broken.lock",
    add: 4,
    del: 4,
    viewedDisabled: false
  }), /*#__PURE__*/React.createElement(SkippedBody, {
    icon: "alert-triangle",
    tone: "red",
    title: "Couldn't parse this file",
    body: /*#__PURE__*/React.createElement(React.Fragment, null, "Pyor's ", /*#__PURE__*/React.createElement("code", {
      className: "rounded bg-white px-1 py-0.5 font-mono text-[11px]"
    }, ".lock"), " parser threw on line 2,041. The raw diff is still available on GitHub. ", /*#__PURE__*/React.createElement("a", {
      className: "text-zinc-900 underline-offset-2 hover:underline"
    }, "Report this"), " so we can teach Pyor the dialect."),
    actions: [{
      label: 'View on GitHub',
      icon: 'external-link'
    }, {
      label: 'Show raw diff',
      icon: 'code'
    }]
  }))), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// SkippedBody — the per-file "this file isn't rendered here" affordance.
function SkippedBody({
  icon,
  tone = 'zinc',
  title,
  body,
  actions = [],
  compact = false
}) {
  const toneCfg = {
    zinc: {
      border: 'border-zinc-200',
      bg: 'bg-zinc-50/60',
      iconBox: 'bg-white border-zinc-200',
      iconC: 'text-zinc-700'
    },
    amber: {
      border: 'border-amber-200',
      bg: 'bg-amber-50/40',
      iconBox: 'bg-white border-amber-200',
      iconC: 'text-amber-700'
    },
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50/40',
      iconBox: 'bg-white border-red-200',
      iconC: 'text-red-700'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-3 border-b ${toneCfg.border} ${toneCfg.bg} px-5 ${compact ? 'py-4' : 'py-6'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `inline-flex size-9 shrink-0 items-center justify-center rounded-md border ${toneCfg.iconBox}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: `size-4 ${toneCfg.iconC}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] font-semibold text-zinc-900"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 text-[12px] text-zinc-600 leading-relaxed"
  }, body)), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, actions.map((a, i) => /*#__PURE__*/React.createElement(SButton, {
    key: i,
    variant: a.primary ? 'default' : 'ghost',
    size: "sm",
    icon: a.icon
  }, a.label))));
}

// ════════════════════════════════════════════════════════════════════
// 4 · shell-pr-loading-force-push
// Detected head.sha change while user is reviewing. Refetch in flight.
// Prior content stays visible (dimmed slightly) under an explanatory
// banner — silent reflow is the failure mode this fixes.
// ════════════════════════════════════════════════════════════════════
function PrLoadingForcePush({
  width = 1320,
  height = 900
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-amber-500"
    }), /*#__PURE__*/React.createElement("b", {
      className: "font-semibold"
    }, "Head moved"), " \xB7 refetching diff"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Was ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "b7c2f04"), " \xB7 now ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono"
    }, "e91d3a6")), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Your draft is safe (3 pending comments)"))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 15
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, null)
  }), /*#__PURE__*/React.createElement("div", {
    className: "border-b border-amber-200 bg-amber-50/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 px-5 py-3 text-[12.5px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-amber-300 bg-white"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-3.5 text-amber-700"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("b", {
    className: "text-[13px] font-semibold text-amber-900"
  }, "Force-push detected \xB7 @nicolae-i pushed 3 commits 47s ago"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-amber-800/70"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "b7c2f04 \u2192 e91d3a6"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-0.5 text-[12px] text-amber-800/90 leading-relaxed"
  }, "Rewrote ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "VirtualHunk.tsx"), " and added 2 new test files. We're keeping the prior diff on screen until the new content arrives so you don't lose your place."), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative h-1 w-44 rounded-full bg-amber-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 bg-amber-700 transition-[width]",
    style: {
      width: '62%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse",
    style: {
      left: '52%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] tabular-nums text-amber-800"
  }, "4 / 7 files")))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "git-compare"
  }, "Compare ranges"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "rotate-ccw"
  }, "Show new diff"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-t border-amber-200/60 bg-amber-50/30 px-5 py-1.5 text-[11.5px] text-amber-900/80"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-700"
  }, "In the new push:"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "border-amber-300 bg-white text-amber-900 gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "VirtualHunk.tsx"), /*#__PURE__*/React.createElement("span", {
    className: "text-amber-600"
  }, "rewritten")), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "border-amber-300 bg-white text-amber-900 gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "+2 test files")), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "border-amber-300 bg-white text-amber-900 gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "measureHunk.ts"), /*#__PURE__*/React.createElement("span", {
    className: "text-amber-600"
  }, "untouched")), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[11px] text-amber-700/70"
  }, "Drafts re-anchor by line content \u2014 should survive the rewrite"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(FileRailDimmed, null), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-hidden bg-white relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "opacity-50 pointer-events-none select-none"
  }, /*#__PURE__*/React.createElement(FileHeaderFidelity, {
    name: "src/diff/VirtualHunk.tsx",
    add: 312,
    del: 4,
    viewedDisabled: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[12px] leading-[18px]"
  }, [{
    l: '12',
    r: '12',
    k: 'ctx',
    code: 'import { measureHunk } from "./measureHunk";'
  }, {
    l: '13',
    r: null,
    k: 'del',
    code: 'import { lineHeightFor } from "../editor";'
  }, {
    l: null,
    r: '13',
    k: 'add',
    code: 'import { lineHeightFor } from "../editor/metrics";'
  }, {
    l: '14',
    r: '14',
    k: 'ctx',
    code: ''
  }, {
    l: '15',
    r: null,
    k: 'del',
    code: 'const VIRTUALISE_THRESHOLD = 500;'
  }, {
    l: null,
    r: '15',
    k: 'add',
    code: 'const VIRTUALISE_THRESHOLD = 2_000;'
  }, {
    l: '16',
    r: '16',
    k: 'ctx',
    code: ''
  }, {
    l: '17',
    r: '17',
    k: 'ctx',
    code: 'export function VirtualHunk(props: HunkProps) {'
  }, {
    l: '18',
    r: '18',
    k: 'ctx',
    code: '  const { hunk, baseRev, headRev } = props;'
  }, {
    l: '19',
    r: null,
    k: 'del',
    code: '  const lineHeight = props.font.size;'
  }, {
    l: null,
    r: '19',
    k: 'add',
    code: '  const lineHeight = lineHeightFor(props.font);'
  }].map((ln, i) => {
    const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
    const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
    const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
    const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `flex ${bg}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.l ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
    }, ln.r ?? ''), /*#__PURE__*/React.createElement("span", {
      className: `shrink-0 w-5 text-center ${markerColor}`
    }, marker), /*#__PURE__*/React.createElement("span", {
      className: "flex-1 pr-3 text-zinc-900 whitespace-pre"
    }, ln.code));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "absolute right-4 top-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/95 px-2.5 py-1 text-[11px] text-zinc-500 shadow-sm"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "clock",
    className: "size-3"
  }), "Previous diff \xB7 stale 47s"))), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// File rail rendered in a "stale, refetching" tone for the force-push state.
function FileRailDimmed() {
  const files = [{
    name: 'VirtualHunk.tsx',
    add: 312,
    del: 4,
    current: true,
    status: 'rewritten'
  }, {
    name: 'HunkWindow.ts',
    add: 184,
    del: 22,
    status: 'unchanged'
  }, {
    name: 'measureHunk.ts',
    add: 96,
    del: 8,
    status: 'unchanged'
  }, {
    name: 'rowHeight.ts',
    add: 42,
    del: 0,
    status: 'new',
    isNew: true
  }, {
    name: 'VirtualHunk.test.tsx',
    add: 274,
    del: 234,
    status: 'rewritten'
  }, {
    name: 'streaming.test.tsx',
    add: 88,
    del: 0,
    status: 'new',
    isNew: true
  }];
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-72 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 p-2 border-b border-zinc-200"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter files\u2026",
    className: "h-7 flex-1",
    disabled: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto py-1"
  }, files.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex items-center gap-1.5 h-7 text-[12.5px] ${f.current ? 'bg-zinc-200/60 border-l-2 border-zinc-900' : 'border-l-2 border-transparent'}`,
    style: {
      paddingLeft: 18,
      paddingRight: 10
    }
  }, /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: `size-3.5 ${f.isNew ? 'text-emerald-600' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: `flex-1 truncate ${f.current ? 'font-semibold' : ''}`
  }, f.name), f.status === 'rewritten' && /*#__PURE__*/React.createElement("span", {
    className: "rounded bg-amber-100 px-1 py-0.5 text-[9.5px] font-semibold text-amber-700"
  }, "rewritten"), f.isNew && /*#__PURE__*/React.createElement("span", {
    className: "rounded bg-emerald-100 px-1 py-0.5 text-[9.5px] font-semibold text-emerald-700"
  }, "new"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10px] tabular-nums"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", f.add), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", f.del))))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 px-3 py-2 text-[11px] text-amber-700 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 animate-spin"
  }), /*#__PURE__*/React.createElement("span", null, "Diffing new head \xB7 4/7")));
}

// ════════════════════════════════════════════════════════════════════
// 5 · shell-pr-loading-tab-first-paint  (Commits)
// User clicks Commits/Checks/Description for the first time. That tab
// fetches its own data on mount. Skeleton must mirror the tab's
// eventual layout — not a generic spinner.
// ════════════════════════════════════════════════════════════════════
function PrLoadingTabCommits({
  width = 1320,
  height = 900
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Live polling \xB7 8s"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3 animate-spin"
    }), "Fetching commits\u2026"))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "commits",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2 text-[12px] text-zinc-600"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-branch",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-900"
  }, "14"), " commits on ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px]"
  }, "perf/virtualise-hunks")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 animate-spin"
  }), "Pulling commit details \xB7 0 / 14"), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto inline-flex h-7 items-center gap-2 rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] text-zinc-400 opacity-60"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "filter",
    className: "size-3.5"
  }), "Filter author\u2026")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, Array.from({
    length: 9
  }).map((_, i) => /*#__PURE__*/React.createElement(SkelCommitRow, {
    key: i,
    i: i
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-3 text-[11.5px] text-zinc-400 inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 animate-spin"
  }), "5 more queued \xB7 GitHub returns 30 commits per page")), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// Same family, Checks tab — skeleton rows mirror the eventual layout
// (status icon · check name · duration · "Details").
function PrLoadingTabChecks({
  width = 1320,
  height = 900
}) {
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "size-1.5 rounded-full bg-emerald-500"
    }), "Live polling \xB7 8s"), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", {
      className: "inline-flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "loader",
      className: "size-3 animate-spin"
    }), "Fetching check runs\u2026"))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "checks",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'checks',
      label: 'Checks',
      icon: 'check-circle',
      count: 18,
      failing: 2
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2.5 text-[12.5px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5 text-red-600"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-red-700"
  }, "2"), " failing")), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", null, "16 passing")), /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5 text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3.5 animate-spin"
  }), /*#__PURE__*/React.createElement("span", null, "Loading details for 18 runs\u2026")), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-zinc-400"
  }, /*#__PURE__*/React.createElement("span", null, "filter"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "opacity-60"
  }, "all"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "opacity-60"
  }, "failing"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "opacity-60"
  }, "pending"))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, [{
    app: 'GitHub Actions',
    rows: 6
  }, {
    app: 'Cloudflare Pages',
    rows: 2
  }, {
    app: 'Codecov',
    rows: 3
  }].map((g, gi) => /*#__PURE__*/React.createElement("div", {
    key: gi
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 bg-zinc-50/60 border-y border-zinc-200/60 px-5 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "size-4 rounded bg-zinc-200 animate-pulse"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12px] font-semibold text-zinc-800"
  }, g.app), /*#__PURE__*/React.createElement(SkelBar, {
    width: 28,
    height: 8
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto inline-flex items-center gap-1.5 text-[11px] text-zinc-400"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "loader",
    className: "size-3 animate-spin"
  }), g.rows, " runs")), Array.from({
    length: g.rows
  }).map((_, i) => /*#__PURE__*/React.createElement(SkelCheckRow, {
    key: i,
    i: gi * 11 + i
  }))))), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// ════════════════════════════════════════════════════════════════════
// 6 · shell-pr-loading-error
// Non-401 fetch failure (rate-limit, network, 500). The screen is the
// same chrome but the diff body is replaced with a network-specific
// card: cause-aware copy, diagnostics, retry. 401 has its own screen.
// ════════════════════════════════════════════════════════════════════
function PrLoadingError({
  width = 1320,
  height = 900,
  cause = 'rate-limit'
}) {
  const causes = {
    'rate-limit': {
      icon: 'gauge',
      tone: 'amber',
      title: 'GitHub rate-limit hit',
      copy: 'Your token has spent its hourly budget (5,000 / 5,000 requests). Pyor reads conservatively but a large PR with many comment polls can drain it. Reads resume automatically at the reset time.',
      kvs: [['Endpoint', 'GET /repos/pier-app/pier/pulls/9217/files', true], ['Status', '403 · rate limit exceeded', true], ['Used / limit', '5,000 / 5,000', false], ['Resets in', '12 min 41 s', false], ['Cached content', '6 of 7 file diffs, all comments (read-only)', false]],
      primary: {
        label: 'Wait & auto-retry',
        icon: 'clock'
      },
      secondary: {
        label: 'Open offline view',
        icon: 'wifi-off'
      }
    },
    'network': {
      icon: 'wifi-off',
      tone: 'red',
      title: "Can't reach api.github.com",
      copy: 'The last three requests timed out. Your Mac sees the network but the GitHub API is unreachable — likely a localised outage or VPN issue. Pyor will keep retrying with backoff.',
      kvs: [['Endpoint', 'GET /repos/pier-app/pier/pulls/9217/files', true], ['Error', 'NSURLErrorTimedOut · -1001', true], ['DNS', 'api.github.com → 140.82.114.6 (OK)', true], ['Last success', '14:02 · 2m 18s ago', false], ['Retries', '3 / ∞ (next in 16s)', false]],
      primary: {
        label: 'Retry now',
        icon: 'rotate-ccw'
      },
      secondary: {
        label: 'Status.github.com',
        icon: 'external-link'
      }
    },
    'server-500': {
      icon: 'server-crash',
      tone: 'red',
      title: 'GitHub returned 500 on this PR',
      copy: 'Five files loaded, then /pulls/9217/files started returning HTTP 500. This is on GitHub\'s side. Your local draft and the diffs that did arrive are safe.',
      kvs: [['Endpoint', 'GET /repos/pier-app/pier/pulls/9217/files?page=2', true], ['Status', '500 · server error', true], ['x-github-request-id', 'C4F3:2A1B:3D9E:8C72:6788AA12', true], ['Loaded so far', '5 of 7 files', false], ['Reachability', 'api.github.com OK', false]],
      primary: {
        label: 'Retry',
        icon: 'rotate-ccw'
      },
      secondary: {
        label: 'Status.github.com',
        icon: 'external-link'
      }
    }
  };
  const c = causes[cause];
  const toneCfg = {
    amber: {
      box: 'border-amber-200 bg-amber-50/40',
      icon: 'text-amber-700',
      iconBox: 'border-amber-200',
      accent: 'bg-amber-500'
    },
    red: {
      box: 'border-red-200   bg-red-50/40',
      icon: 'text-red-700',
      iconBox: 'border-red-200',
      accent: 'bg-red-500'
    }
  }[c.tone];
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "",
    subtitle: "",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "inbox"
    }),
    status: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: `inline-flex items-center gap-1.5 ${c.tone === 'red' ? 'text-red-600' : 'text-amber-700'}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `size-1.5 rounded-full ${toneCfg.accent}`
    }), /*#__PURE__*/React.createElement("b", {
      className: "font-semibold"
    }, c.title)), /*#__PURE__*/React.createElement(SSeparator, {
      vertical: true,
      className: "mx-2 h-3"
    }), /*#__PURE__*/React.createElement("span", null, "Cached content stays read-only \xB7 drafts preserved"))
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, {
    backLabel: "Inbox"
  }), /*#__PURE__*/React.createElement(STabsUnderline, {
    active: "files",
    tabs: [{
      id: 'conv',
      label: 'Conversation',
      icon: 'message-square',
      count: 31
    }, {
      id: 'commits',
      label: 'Commits',
      icon: 'git-commit',
      count: 14
    }, {
      id: 'files',
      label: 'Files changed',
      icon: 'file',
      count: 7
    }],
    right: /*#__PURE__*/React.createElement(ShadcnFilesTabTools, null)
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(FileRailWithProgress, {
    files: [{
      kind: 'folder',
      name: 'src',
      depth: 0
    }, {
      kind: 'folder',
      name: 'diff',
      depth: 1
    }, {
      kind: 'file',
      name: 'VirtualHunk.tsx',
      depth: 2,
      add: 312,
      del: 4,
      arrived: true
    }, {
      kind: 'file',
      name: 'HunkWindow.ts',
      depth: 2,
      add: 184,
      del: 22,
      arrived: true
    }, {
      kind: 'file',
      name: 'measureHunk.ts',
      depth: 2,
      add: 96,
      del: 8,
      arrived: true
    }, {
      kind: 'file',
      name: 'index.ts',
      depth: 2,
      add: 4,
      del: 2,
      arrived: true
    }, {
      kind: 'file',
      name: 'rowHeight.ts',
      depth: 2,
      add: 42,
      del: 0,
      arrived: true
    }, {
      kind: 'file',
      name: 'CodeMirrorHost.tsx',
      depth: 2,
      add: 28,
      del: 41,
      arrived: false
    }, {
      kind: 'file',
      name: 'VirtualHunk.test.tsx',
      depth: 1,
      add: 274,
      del: 234,
      arrived: false
    }],
    currentName: "VirtualHunk.tsx"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-zinc-200 px-5 py-2 text-[11.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400 mr-1"
  }, "cause:"), [['rate-limit', 'Rate limit', '403'], ['network', 'Network', 'timeout'], ['server-500', 'GitHub 5xx', '500']].map(([id, label, code]) => /*#__PURE__*/React.createElement("span", {
    key: id,
    className: `inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-[11.5px] font-medium ${id === cause ? 'border border-zinc-900 bg-zinc-900 text-white' : 'border border-zinc-200 bg-white text-zinc-700'}`
  }, label, /*#__PURE__*/React.createElement("span", {
    className: id === cause ? 'text-zinc-300 font-mono' : 'text-zinc-400 font-mono'
  }, code))), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-zinc-400"
  }, "401 \u2192 Setup (separate artboard)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center p-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-[560px]"
  }, /*#__PURE__*/React.createElement(SCard, {
    className: `${toneCfg.box}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-3 p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg border ${toneCfg.iconBox} bg-white`
  }, /*#__PURE__*/React.createElement(LI, {
    name: c.icon,
    className: `size-5 ${toneCfg.icon}`,
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[15px] font-semibold tracking-tight text-zinc-950"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-[12.5px] text-zinc-600 leading-relaxed"
  }, c.copy))), /*#__PURE__*/React.createElement(SSeparator, null), /*#__PURE__*/React.createElement("div", {
    className: "text-[12px]"
  }, c.kvs.map(([k, v, mono], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `flex items-center gap-3 px-5 py-2 ${i < c.kvs.length - 1 ? 'border-b border-zinc-100' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-36 text-zinc-500"
  }, k), /*#__PURE__*/React.createElement("span", {
    className: `flex-1 text-zinc-800 ${mono ? 'font-mono text-[11.5px] truncate' : ''}`
  }, v)))), /*#__PURE__*/React.createElement(SSeparator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 bg-zinc-50/60 p-3"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: c.secondary.icon
  }, c.secondary.label), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-zinc-400 mx-1"
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    className: "text-[11.5px] text-zinc-500 underline-offset-2 hover:underline"
  }, "Copy diagnostics"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: c.primary.icon,
    className: "ml-auto"
  }, c.primary.label))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 flex items-center justify-center gap-2 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "info",
    className: "size-3"
  }), /*#__PURE__*/React.createElement("span", null, "You can still scroll the ", c.kvs.find(([k]) => k.startsWith('Loaded') || k.startsWith('Cached')) ? 'cached diffs' : 'review draft', " \u2014 Pyor never overwrites unsaved comments on retry.")))))), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}

// ── Export to global scope so Pyor.html can mount the artboards ─────
Object.assign(window, {
  PrLoadingFilesPaginating,
  PrLoadingContentStreaming,
  PrLoadingSkippedFiles,
  PrLoadingForcePush,
  PrLoadingTabCommits,
  PrLoadingTabChecks,
  PrLoadingError
});