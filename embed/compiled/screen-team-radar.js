// ═══ Direction B · ScreenTeamRadar ═══════════════════════════════════
//  Jump in. A review queue over teammates' PRs, bucketed by how much you
//  can unblock — PRs with no reviewer float to the top, then ones that
//  asked for you, then your team's areas, then work already moving.
//  The hero affordance on every row is a one-click review action.
//  Depends on globals from screen-team.jsx.

const TEAM_RADAR_BUCKETS = [{
  id: 'needs',
  icon: 'alert-triangle',
  accent: 'amber',
  title: 'Needs a first reviewer',
  why: 'No one is on these yet — claiming one unblocks a teammate.',
  test: pr => pr.reviewers.length === 0
}, {
  id: 'yours',
  icon: 'eye',
  accent: 'blue',
  title: 'Your review was requested',
  why: 'You were added as a reviewer.',
  test: pr => pr.relation === 'reviewer'
}, {
  id: 'team',
  icon: 'users',
  accent: 'zinc',
  title: "In your team's areas",
  why: 'Touches code your team owns.',
  test: pr => pr.relation === 'team'
}, {
  id: 'moving',
  icon: 'git-pull-request',
  accent: 'zinc',
  title: 'Already in review',
  why: 'Has reviewers and is progressing.',
  test: () => true
}];
function bucketTeamPRs(source = TEAM_PRS) {
  const seen = new Set();
  return TEAM_RADAR_BUCKETS.map(b => {
    const prs = source.filter(pr => !seen.has(pr.num) && b.test(pr));
    prs.forEach(pr => seen.add(pr.num));
    return {
      ...b,
      prs
    };
  });
}
function TeamRadarRow({
  pr,
  bucket
}) {
  const draft = pr.status === 'draft';
  const tone = waitTone(pr.waiting);
  const accentBar = {
    amber: 'bg-amber-400',
    blue: 'bg-blue-500',
    zinc: 'bg-transparent'
  }[bucket.accent];
  const action = {
    needs: /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "user-plus"
    }, "Add me as reviewer"),
    yours: /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "eye"
    }, "Start review"),
    team: /*#__PURE__*/React.createElement(SButton, {
      variant: "outline",
      size: "sm",
      icon: "user-plus"
    }, "Add me"),
    moving: /*#__PURE__*/React.createElement(SButton, {
      variant: "outline",
      size: "sm"
    }, "Open")
  }[bucket.id];
  return /*#__PURE__*/React.createElement("div", {
    className: "group relative flex cursor-pointer items-center gap-3 border-b border-zinc-100 px-5 py-3 hover:bg-zinc-50"
  }, /*#__PURE__*/React.createElement("span", {
    className: `absolute left-0 top-0 h-full w-0.5 ${accentBar}`
  }), /*#__PURE__*/React.createElement(LI, {
    name: draft ? 'git-pull-request-draft' : 'git-pull-request',
    className: `size-4 shrink-0 ${draft ? 'text-zinc-400' : 'text-emerald-600'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "truncate text-[13.5px] font-semibold tracking-tight text-zinc-900",
    style: {
      maxWidth: 460
    }
  }, pr.title), draft && /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary"
  }, "draft"), pr.checks.f > 0 && /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive"
  }, pr.checks.f, " failing")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-400"
  }, "#", pr.num), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement(OrgGlyph, {
    org: pr.org,
    size: "size-4",
    text: "text-[7px]"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-medium text-zinc-600"
  }, pr.repo), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: pr.author,
    size: "size-4"
  }), pr.author))), /*#__PURE__*/React.createElement("div", {
    className: "hidden w-[120px] shrink-0 flex-col items-start gap-0.5 md:flex"
  }, /*#__PURE__*/React.createElement("span", {
    className: `inline-flex items-center gap-1.5 text-[11.5px] font-medium ${tone.text}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `size-1.5 rounded-full ${tone.dot}`
  }), "waiting ", pr.waiting), /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] text-zinc-400"
  }, "opened ", pr.opened)), /*#__PURE__*/React.createElement("div", {
    className: "hidden w-[112px] shrink-0 items-center md:flex"
  }, pr.reviewers.length === 0 ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 rounded-full border border-dashed border-zinc-300 px-2 py-0.5 text-[10.5px] text-zinc-400"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "user-plus",
    className: "size-3"
  }), "unassigned") : /*#__PURE__*/React.createElement(ReviewerCluster, {
    reviewers: pr.reviewers
  })), /*#__PURE__*/React.createElement("div", {
    className: "shrink-0"
  }, action));
}
function TeamBucketHeader({
  bucket,
  count
}) {
  const tint = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    zinc: 'text-zinc-500'
  }[bucket.accent];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: bucket.icon,
    className: `size-3.5 ${tint}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px] font-semibold text-zinc-900"
  }, bucket.title), /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "tabular-nums"
  }, count), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, "\xB7 ", bucket.why));
}

// ── Beautiful filters ────────────────────────────────────────────────

// Author filter as a multi-select avatar group, capped to `max` faces with
// a "+N" overflow popover for the rest. Selected faces sort to the front so
// a picked author is never hidden behind the overflow.
function AuthorMultiSelect({
  authors,
  selected,
  onToggle,
  onClear,
  max = 6
}) {
  const [open, setOpen] = React.useState(false);
  const active = selected.size > 0;
  const ordered = [...authors].sort((a, b) => (selected.has(b) ? 1 : 0) - (selected.has(a) ? 1 : 0));
  const visible = ordered.slice(0, max);
  const overflow = ordered.slice(max);
  const hiddenSelected = overflow.filter(a => selected.has(a)).length;
  const Face = ({
    a
  }) => {
    const on = selected.has(a);
    const dim = active && !on;
    return /*#__PURE__*/React.createElement(STooltip, {
      label: a === YOU ? 'you' : a
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onToggle(a),
      className: `relative rounded-full outline-none transition duration-150
            ${on ? 'ring-2 ring-zinc-900 ring-offset-1 ring-offset-zinc-50' : ''}
            ${dim ? 'opacity-35 grayscale hover:opacity-100 hover:grayscale-0' : 'hover:-translate-y-0.5'}`
    }, /*#__PURE__*/React.createElement(SAvatar, {
      name: a,
      size: "size-6"
    }), on && /*#__PURE__*/React.createElement("span", {
      className: "absolute -bottom-0.5 -right-0.5 inline-flex size-3 items-center justify-center rounded-full bg-zinc-900 ring-2 ring-zinc-50"
    }, /*#__PURE__*/React.createElement(LI, {
      name: "check",
      className: "size-1.5 text-white",
      strokeWidth: 4
    }))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] font-semibold uppercase tracking-wide text-zinc-400"
  }, active ? `Authors · ${selected.size}` : 'Authors'), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, visible.map(a => /*#__PURE__*/React.createElement(Face, {
    key: a,
    a: a
  })), overflow.length > 0 && /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    align: "start",
    width: 216,
    trigger: /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(o => !o),
      className: `relative inline-flex size-6 items-center justify-center rounded-full border text-[9.5px] font-semibold transition-colors ${open ? 'border-zinc-400 bg-zinc-100 text-zinc-800' : 'border-dashed border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-800'}`
    }, "+", overflow.length, hiddenSelected > 0 && /*#__PURE__*/React.createElement("span", {
      className: "absolute -right-0.5 -top-0.5 size-2 rounded-full bg-blue-600 ring-2 ring-zinc-50"
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-h-[280px] overflow-auto p-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
  }, "All authors"), ordered.map(a => {
    const on = selected.has(a);
    return /*#__PURE__*/React.createElement("button", {
      key: a,
      onClick: () => onToggle(a),
      className: "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-zinc-100"
    }, /*#__PURE__*/React.createElement(SAvatar, {
      name: a,
      size: "size-6"
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[12.5px] text-zinc-700"
    }, a === YOU ? 'you' : a), /*#__PURE__*/React.createElement(LI, {
      name: "check",
      className: `ml-auto size-3.5 ${on ? 'text-zinc-900' : 'text-transparent'}`
    }));
  })))), active && /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    className: "inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x",
    className: "size-3"
  }), "Clear"));
}

// Org scope as a compact segmented glyph control — All · EM · EL · AV.
function OrgSegmented({
  value,
  onChange
}) {
  const opts = [{
    key: 'all',
    node: /*#__PURE__*/React.createElement("span", {
      className: "px-1 text-[11.5px]"
    }, "All")
  }, ...Object.keys(TEAM_ORGS).map(k => ({
    key: k,
    glyph: true,
    tip: TEAM_ORGS[k].name
  }))];
  return /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-0.5 rounded-md bg-zinc-100 p-0.5"
  }, opts.map(o => {
    const on = value === o.key;
    const btn = /*#__PURE__*/React.createElement("button", {
      onClick: () => onChange(o.key),
      className: `inline-flex h-6 items-center justify-center rounded px-1.5 font-medium transition ${on ? 'bg-white shadow-sm' : 'opacity-55 hover:opacity-100'}`
    }, o.glyph ? /*#__PURE__*/React.createElement(OrgGlyph, {
      org: o.key,
      size: "size-4",
      text: "text-[7px]"
    }) : /*#__PURE__*/React.createElement("span", {
      className: on ? 'text-zinc-900' : 'text-zinc-500'
    }, o.node));
    return o.tip ? /*#__PURE__*/React.createElement(STooltip, {
      key: o.key,
      label: o.tip
    }, btn) : /*#__PURE__*/React.createElement("span", {
      key: o.key
    }, btn);
  }));
}

// ── Secondary filters, consolidated behind one popover ───────────────
// One row per filter; label + current value + chevron. Active values read
// darker. Keeps the toolbar uncluttered — the count badge signals how many
// are set without spilling chips across the bar.
function FilterMenuRow({
  icon,
  label,
  value,
  active
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[12.5px] text-zinc-700"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[12px] ${active ? 'font-medium text-zinc-900' : 'text-zinc-400'}`
  }, value), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-right",
    className: "size-3.5 text-zinc-300"
  })));
}
function RadarFiltersButton({
  filters,
  open,
  onToggle,
  onReset
}) {
  const count = Object.values(filters).filter(f => f.active).length;
  return /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    align: "end",
    width: 272,
    trigger: /*#__PURE__*/React.createElement("button", {
      onClick: onToggle,
      className: `inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-medium shadow-sm transition-colors ${count > 0 || open ? 'border-zinc-300 bg-zinc-50 text-zinc-900' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: "sliders",
      className: "size-3.5 text-zinc-500"
    }), "Filters", count > 0 && /*#__PURE__*/React.createElement("span", {
      className: "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[9.5px] font-semibold tabular-nums text-white"
    }, count), /*#__PURE__*/React.createElement(LI, {
      name: "chevron-down",
      className: "size-3 opacity-50"
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-2 py-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
  }, "Filters"), /*#__PURE__*/React.createElement("button", {
    onClick: onReset,
    className: "text-[11px] font-medium text-zinc-500 hover:text-zinc-900"
  }, "Reset")), /*#__PURE__*/React.createElement(FilterMenuRow, {
    icon: "circle-dot",
    label: "Status",
    value: filters.status.value,
    active: filters.status.active
  }), /*#__PURE__*/React.createElement(FilterMenuRow, {
    icon: "folder",
    label: "Repository",
    value: filters.repo.value,
    active: filters.repo.active
  }), /*#__PURE__*/React.createElement(FilterMenuRow, {
    icon: "user",
    label: "Reviewer",
    value: filters.reviewer.value,
    active: filters.reviewer.active
  }), /*#__PURE__*/React.createElement(FilterMenuRow, {
    icon: "check-circle",
    label: "CI status",
    value: filters.ci.value,
    active: filters.ci.active
  }), /*#__PURE__*/React.createElement(FilterMenuRow, {
    icon: "tag",
    label: "Label",
    value: filters.label.value,
    active: filters.label.active
  }), /*#__PURE__*/React.createElement(FilterMenuRow, {
    icon: "calendar",
    label: "Updated",
    value: filters.updated.value,
    active: filters.updated.active
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center justify-end gap-2 border-t border-zinc-100 px-2 pt-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    onClick: onToggle
  }, "Done"))));
}
const RADAR_SORTS = ['Unblock value', 'Oldest first', 'Newest', 'Most comments', 'Largest diff'];
function RadarSortButton({
  value,
  open,
  onToggle,
  onPick
}) {
  return /*#__PURE__*/React.createElement(SPopover, {
    open: open,
    align: "end",
    width: 184,
    trigger: /*#__PURE__*/React.createElement("button", {
      onClick: onToggle,
      className: `inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12.5px] font-medium shadow-sm transition-colors ${open ? 'border-zinc-300 bg-zinc-50 text-zinc-900' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`
    }, /*#__PURE__*/React.createElement(LI, {
      name: "arrow-up-down",
      className: "size-3.5 text-zinc-500"
    }), "Sort: ", /*#__PURE__*/React.createElement("span", {
      className: "text-zinc-900"
    }, value), /*#__PURE__*/React.createElement(LI, {
      name: "chevron-down",
      className: "size-3 opacity-50"
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-1.5"
  }, RADAR_SORTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => onPick(s),
    className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] text-zinc-700 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check",
    className: `size-3.5 ${s === value ? 'text-zinc-900' : 'text-transparent'}`
  }), s))));
}
function ScreenTeamRadar({
  width = 1320,
  height = 820,
  view = {}
}) {
  const [authors, setAuthors] = React.useState(new Set(view.authors || []));
  const [org, setOrg] = React.useState(view.org && view.org !== 'all' && TEAM_ORGS[view.org] ? view.org : 'all');
  const [sort, setSort] = React.useState(view.sort || 'Unblock value');
  const [filtersOpen, setFiltersOpen] = React.useState(!!view.filtersOpen);
  const [sortOpen, setSortOpen] = React.useState(!!view.sortOpen);

  // Secondary (dropdown) filters live in the Filters popover.
  const secondary = {
    status: {
      value: view.status || 'Open',
      active: (view.status || 'Open') !== 'Any'
    },
    repo: {
      value: view.repo || 'Any',
      active: !!view.repo && view.repo !== 'Any'
    },
    reviewer: {
      value: view.reviewer || 'Any',
      active: !!view.reviewer && view.reviewer !== 'Any'
    },
    ci: {
      value: view.ci || 'Any',
      active: !!view.ci && view.ci !== 'Any'
    },
    label: {
      value: view.label || 'Any',
      active: !!view.label && view.label !== 'Any'
    },
    updated: {
      value: view.updated || 'Last 30 days',
      active: !!view.updated && view.updated !== 'All time'
    }
  };
  const toggleAuthor = a => setAuthors(prev => {
    const n = new Set(prev);
    n.has(a) ? n.delete(a) : n.add(a);
    return n;
  });
  const orgScoped = org === 'all' ? TEAM_PRS : TEAM_PRS.filter(p => p.org === org);
  const authorList = [...new Set(orgScoped.map(p => p.author))];
  let filtered = orgScoped;
  if (authors.size) filtered = filtered.filter(p => authors.has(p.author));
  const buckets = bucketTeamPRs(filtered).filter(b => b.prs.length > 0);
  const noReviewer = filtered.filter(p => p.reviewers.length === 0).length;
  const anyScope = authors.size > 0 || org !== 'all';
  const clearScope = () => {
    setAuthors(new Set());
    setOrg('all');
  };
  return /*#__PURE__*/React.createElement(PierWindowShell, {
    width: width,
    height: height,
    title: "Pull requests",
    subtitle: "Team \xB7 review radar",
    sidebar: /*#__PURE__*/React.createElement(PierSidebar, {
      active: "pulls"
    }),
    toolbar: /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm",
      icon: "refresh"
    }, "Refresh"),
    status: /*#__PURE__*/React.createElement(TeamStatusBar, {
      note: `Sorted by ${sort.toLowerCase()} · ${noReviewer} unassigned · GraphQL search`
    })
  }, /*#__PURE__*/React.createElement(TeamTabsBar, {
    active: "team",
    right: /*#__PURE__*/React.createElement(SInput, {
      icon: "search",
      placeholder: "Filter PRs\u2026",
      kbd: "\u2318F",
      className: "w-56"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/40 px-5 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10.5px] font-semibold uppercase tracking-wide text-zinc-400"
  }, "Org"), /*#__PURE__*/React.createElement(OrgSegmented, {
    value: org,
    onChange: setOrg
  })), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-6"
  }), /*#__PURE__*/React.createElement(AuthorMultiSelect, {
    authors: authorList,
    selected: authors,
    onToggle: toggleAuthor,
    onClear: () => setAuthors(new Set())
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2.5"
  }, anyScope && /*#__PURE__*/React.createElement("button", {
    onClick: clearScope,
    className: "inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x",
    className: "size-3"
  }), "Clear scope"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tabular-nums font-medium text-zinc-700"
  }, filtered.length), " of ", TEAM_PRS.length), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-6"
  }), /*#__PURE__*/React.createElement(RadarFiltersButton, {
    filters: secondary,
    open: filtersOpen,
    onToggle: () => {
      setFiltersOpen(o => !o);
      setSortOpen(false);
    },
    onReset: () => {}
  }), /*#__PURE__*/React.createElement(RadarSortButton, {
    value: sort,
    open: sortOpen,
    onToggle: () => {
      setSortOpen(o => !o);
      setFiltersOpen(false);
    },
    onPick: s => {
      setSort(s);
      setSortOpen(false);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, buckets.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "users",
    className: "size-8 text-zinc-300"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[13px] font-medium text-zinc-700"
  }, "No teammate PRs match these filters."), /*#__PURE__*/React.createElement("div", {
    className: "max-w-xs text-[12px] text-zinc-500"
  }, "Try widening the org scope or clearing the selected authors."), /*#__PURE__*/React.createElement(SButton, {
    variant: "outline",
    size: "sm",
    onClick: clearScope
  }, "Clear all filters")) : buckets.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id
  }, /*#__PURE__*/React.createElement(TeamBucketHeader, {
    bucket: b,
    count: b.prs.length
  }), b.prs.map(pr => /*#__PURE__*/React.createElement(TeamRadarRow, {
    key: pr.num,
    pr: pr,
    bucket: b
  }))))));
}
Object.assign(window, {
  ScreenTeamRadar,
  TeamRadarRow,
  TeamBucketHeader,
  bucketTeamPRs,
  AuthorMultiSelect,
  OrgSegmented,
  RadarFiltersButton,
  RadarSortButton
});