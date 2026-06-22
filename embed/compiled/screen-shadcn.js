// Parallel shadcn/ui redesign of two key screens for A/B comparison against
// the native macOS direction. Faithful to shadcn defaults: neutral zinc
// palette, rounded-lg cards with shadow-sm, Geist Sans/Mono, lucide icons,
// ghost-heavy buttons, pill tabs.
//
// All Tailwind classes are scoped via `important: '.shadcn-root'` in the
// Tailwind config so they don't bleed into the inline-styled native screens.

// ─── Lucide icons (inline SVG) ────────────────────────────────
function LI({
  name,
  className = 'size-4',
  strokeWidth = 2
}) {
  const c = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  };
  switch (name) {
    case 'git-pull-request':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M13 6h3a2 2 0 0 1 2 2v7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 9v12"
      }));
    case 'git-pull-request-draft':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18 11.5V15"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 9v12"
      }));
    case 'check-circle':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "22 4 12 14.01 9 11.01"
      }));
    case 'x-circle':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m15 9-6 6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m9 9 6 6"
      }));
    case 'circle-dot':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1",
        fill: "currentColor"
      }));
    case 'message-square':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      }));
    case 'eye':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }));
    case 'inbox':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polyline", {
        points: "22 12 16 12 14 15 10 15 8 12 2 12"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"
      }));
    case 'user':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "7",
        r: "4"
      }));
    case 'users':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "7",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 21v-2a4 4 0 0 0-3-3.87"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 3.13a4 4 0 0 1 0 7.75"
      }));
    case 'search':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m21 21-4.3-4.3"
      }));
    case 'plus':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 5v14"
      }));
    case 'minus':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14"
      }));
    case 'sliders':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("line", {
        x1: "4",
        x2: "4",
        y1: "21",
        y2: "14"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "4",
        x2: "4",
        y1: "10",
        y2: "3"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "21",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "8",
        y2: "3"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "20",
        x2: "20",
        y1: "21",
        y2: "16"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "20",
        x2: "20",
        y1: "12",
        y2: "3"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "2",
        x2: "6",
        y1: "14",
        y2: "14"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "10",
        x2: "14",
        y1: "8",
        y2: "8"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "18",
        x2: "22",
        y1: "16",
        y2: "16"
      }));
    case 'refresh':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 3v5h-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 21v-5h5"
      }));
    case 'folder':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      }));
    case 'file':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 2v4a2 2 0 0 0 2 2h4"
      }));
    case 'chevron-down':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m6 9 6 6 6-6"
      }));
    case 'chevron-up':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m18 15-6-6-6 6"
      }));
    case 'chevron-right':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m9 18 6-6-6-6"
      }));
    case 'chevron-left':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m15 18-6-6 6-6"
      }));
    case 'arrow-left':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M19 12H5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m12 19-7-7 7-7"
      }));
    case 'columns':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3v18"
      }));
    case 'rows':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 12h18"
      }));
    case 'list-tree':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M21 12h-8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 6H8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 18h-8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 6v4c0 1.1.9 2 2 2h3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10v6c0 1.1.9 2 2 2h3"
      }));
    case 'list':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("line", {
        x1: "8",
        x2: "21",
        y1: "6",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "8",
        x2: "21",
        y1: "12",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "8",
        x2: "21",
        y1: "18",
        y2: "18"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        x2: "3.01",
        y1: "6",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        x2: "3.01",
        y1: "12",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        x2: "3.01",
        y1: "18",
        y2: "18"
      }));
    case 'git-commit':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        x2: "9",
        y1: "12",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "15",
        x2: "21",
        y1: "12",
        y2: "12"
      }));
    case 'send':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m22 2-7 20-4-9-9-4Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 2 11 13"
      }));
    case 'tag':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "7.5",
        cy: "7.5",
        r: ".5",
        fill: "currentColor"
      }));
    case 'settings':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }));
    case 'at-sign':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"
      }));
    case 'monitor':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "20",
        height: "14",
        x: "2",
        y: "3",
        rx: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "8",
        x2: "16",
        y1: "21",
        y2: "21"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "17",
        y2: "21"
      }));
    case 'terminal':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polyline", {
        points: "4 17 10 11 4 5"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "20",
        y1: "19",
        y2: "19"
      }));
    case 'cloud-off':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m2 2 20 20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7 7 0 0 0 9.5 3.5"
      }));
    case 'loader':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M21 12a9 9 0 1 1-6.219-8.56"
      }));
    case 'lock':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 11V7a5 5 0 0 1 10 0v4"
      }));
    case 'key-round':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16.5",
        cy: "7.5",
        r: ".5",
        fill: "currentColor"
      }));
    case 'info':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 16v-4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8h.01"
      }));
    case 'alert-circle':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "8",
        y2: "12"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12.01",
        y1: "16",
        y2: "16"
      }));
    case 'alert-triangle':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "9",
        y2: "13"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12.01",
        y1: "17",
        y2: "17"
      }));
    case 'check':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polyline", {
        points: "20 6 9 17 4 12"
      }));
    case 'copy':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }));
    case 'check-check':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M18 6 7 17l-5-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m22 10-7.5 7.5L13 16"
      }));
    case 'x':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M18 6 6 18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m6 6 12 12"
      }));
    case 'panel-left-close':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 3v18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m16 15-3-3 3-3"
      }));
    case 'panel-left-open':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 3v18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m14 9 3 3-3 3"
      }));
    case 'external-link':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M15 3h6v6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 14 21 3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }));
    case 'circle':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }));
    case 'mail':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      }));
    case 'reply':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polyline", {
        points: "9 17 4 12 9 7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 18v-2a4 4 0 0 0-4-4H4"
      }));
    case 'git-merge':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "18",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 21V9a9 9 0 0 0 9 9"
      }));
    case 'shield-check':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m9 12 2 2 4-4"
      }));
    case 'git-fork':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "18",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 12v3"
      }));
    case 'user-plus':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "7",
        r: "4"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "19",
        x2: "19",
        y1: "8",
        y2: "14"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "22",
        x2: "16",
        y1: "11",
        y2: "11"
      }));
    case 'arrow-up-down':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m21 16-4 4-4-4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 20V4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m3 8 4-4 4 4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 4v16"
      }));
    case 'more-horizontal':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "1",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "19",
        cy: "12",
        r: "1",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "5",
        cy: "12",
        r: "1",
        fill: "currentColor"
      }));
    case 'log-out':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "16 17 21 12 16 7"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "21",
        x2: "9",
        y1: "12",
        y2: "12"
      }));
    case 'box':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m3.3 7 8.7 5 8.7-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 22V12"
      }));
    case 'database':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("ellipse", {
        cx: "12",
        cy: "5",
        rx: "9",
        ry: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 5v14a9 3 0 0 0 18 0V5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 12a9 3 0 0 0 18 0"
      }));
    case 'palette':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "13.5",
        cy: "6.5",
        r: ".5",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17.5",
        cy: "10.5",
        r: ".5",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "8.5",
        cy: "7.5",
        r: ".5",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6.5",
        cy: "12.5",
        r: ".5",
        fill: "currentColor"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      }));
    case 'sun':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2v2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 20v2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m4.93 4.93 1.41 1.41"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m17.66 17.66 1.41 1.41"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 12h2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 12h2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m6.34 17.66-1.41 1.41"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m19.07 4.93-1.41 1.41"
      }));
    case 'moon':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
      }));
    case 'github':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 18c-4.51 2-5-2-7-2"
      }));
    case 'trash-2':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M3 6h18"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "10",
        x2: "10",
        y1: "11",
        y2: "17"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "14",
        x2: "14",
        y1: "11",
        y2: "17"
      }));
    case 'archive':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "20",
        height: "5",
        x: "2",
        y: "3",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 12h4"
      }));
    case 'archive-restore':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "20",
        height: "5",
        x: "2",
        y: "3",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 8v11a2 2 0 0 0 2 2h2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 8v11a2 2 0 0 1-2 2h-2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m9 15 3-3 3 3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 12v9"
      }));
    case 'scan-search':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M3 7V5a2 2 0 0 1 2-2h2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 3h2a2 2 0 0 1 2 2v2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 17v2a2 2 0 0 1-2 2h-2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 21H5a2 2 0 0 1-2-2v-2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m16 16-1.9-1.9"
      }));
    case 'folder-plus':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M12 10v6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 13h6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      }));
    case 'folder-search':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M20.4 6.6a2 2 0 0 0-1.4-.6h-7l-.8-1.2A2 2 0 0 0 9.6 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17",
        cy: "17",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m21 21-1.9-1.9"
      }));
    case 'undo-2':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M9 14 4 9l5-5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"
      }));
    case 'package-open':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M12 22v-9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.65 1.65 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 12.43V18a2 2 0 0 1-1 1.73L13 22"
      }));
    case 'code-2':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m18 16 4-4-4-4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m6 8-4 4 4 4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m14.5 4-5 16"
      }));
    case 'corner-down-right':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polyline", {
        points: "15 10 20 15 15 20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 4v7a4 4 0 0 0 4 4h12"
      }));
    case 'calendar':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "4",
        rx: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "16",
        x2: "16",
        y1: "2",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "8",
        x2: "8",
        y1: "2",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        x2: "21",
        y1: "10",
        y2: "10"
      }));
    case 'calendar-range':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "4",
        rx: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "16",
        x2: "16",
        y1: "2",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "8",
        x2: "8",
        y1: "2",
        y2: "6"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "3",
        x2: "21",
        y1: "10",
        y2: "10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 14h-6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M13 18H7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 14h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 18h.01"
      }));
    case 'filter':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polygon", {
        points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      }));
    case 'rotate-ccw':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M3 12a9 9 0 1 0 3-6.7L3 8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 3v5h5"
      }));
    case 'wifi-off':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m2 2 20 20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8.5 16.5a5 5 0 0 1 7 0"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 8.82a15 15 0 0 1 4.17-2.65"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10.66 5c4.01-.36 8.14.9 11.34 3.76"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16.85 11.25a10 10 0 0 1 2.22 1.68"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 13a10 10 0 0 1 5.24-2.76"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12.01",
        y1: "20",
        y2: "20"
      }));
    case 'clock':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "12 6 12 12 16 14"
      }));
    case 'gauge':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "m12 14 4-4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3.34 19a10 10 0 1 1 17.32 0"
      }));
    case 'server-crash':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 6h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 18h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m13 6-4 6h6l-4 6"
      }));
    case 'file-warning':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 2v6h6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 12v4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 20h.01"
      }));
    case 'message-square-plus':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "9",
        x2: "15",
        y1: "10",
        y2: "10"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "7",
        y2: "13"
      }));
    case 'git-branch':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("line", {
        x1: "6",
        x2: "6",
        y1: "3",
        y2: "15"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "18",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18 9a9 9 0 0 1-9 9"
      }));
    case 'git-compare':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "5",
        cy: "6",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "19",
        cy: "18",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 6h5a2 2 0 0 1 2 2v7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 18H7a2 2 0 0 1-2-2V9"
      }));
    case 'image':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "9",
        r: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
      }));
    case 'code':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("polyline", {
        points: "16 18 22 12 16 6"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "8 6 2 12 8 18"
      }));
    case 'wifi':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M5 13a10 10 0 0 1 14 0"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8.5 16.5a5 5 0 0 1 7 0"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 8.82a15 15 0 0 1 20 0"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12.01",
        y1: "20",
        y2: "20"
      }));
    case 'globe':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 12h20"
      }));
    case 'plug-zap':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m2 22 3-3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7.5 13.5 10 11"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10.5 16.5 13 14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m18 3-4 4h6l-4 4"
      }));
    case 'building-2':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 6h4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 10h4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 14h4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 18h4"
      }));
    case 'download':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("path", {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "7 10 12 15 17 10"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        x2: "12",
        y1: "15",
        y2: "3"
      }));
    case 'building':
      return /*#__PURE__*/React.createElement("svg", c, /*#__PURE__*/React.createElement("rect", {
        width: "16",
        height: "20",
        x: "4",
        y: "2",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 22v-4h6v4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 6h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 6h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 6h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 10h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 14h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 10h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 14h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 10h.01"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 14h.01"
      }));
    default:
      return null;
  }
}

// ─── Window chrome ────────────────────────────────────────────
function ShadcnWindow({
  width,
  height,
  children,
  title,
  subtitle,
  toolbar,
  status
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "shadcn-root font-sans antialiased",
    style: {
      width,
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-full w-full overflow-hidden rounded-xl bg-white text-zinc-950 ring-1 ring-black/15",
    style: {
      boxShadow: '0 24px 60px rgba(0,0,0,0.22), 0 6px 14px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-10 shrink-0 items-center border-b border-zinc-200 bg-zinc-50 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2 min-w-0"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] font-semibold tracking-tight truncate"
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-zinc-500 truncate"
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, toolbar)), children, status && /*#__PURE__*/React.createElement("div", {
    className: "flex h-6 shrink-0 items-center border-t border-zinc-200 bg-zinc-50/80 px-3 text-[11px] text-zinc-500"
  }, status)));
}

// ─── shadcn primitives ────────────────────────────────────────
function SButton({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  icon,
  title
}) {
  const base = 'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors';
  const variants = {
    default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    outline: 'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm',
    ghost: 'text-zinc-700 hover:bg-zinc-100',
    destructive: 'bg-red-600 text-zinc-50 hover:bg-red-600/90 shadow-sm'
  };
  const sizes = {
    sm: 'h-7 px-2.5 text-xs',
    default: 'h-8 px-3',
    lg: 'h-9 px-4',
    icon: 'h-7 w-7 p-0'
  };
  return /*#__PURE__*/React.createElement("button", {
    title: title,
    className: `${base} ${variants[variant]} ${sizes[size]} ${className}`
  }, icon && /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-3.5"
  }), children);
}
function SBadge({
  children,
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-zinc-900 text-zinc-50 border-transparent',
    secondary: 'bg-zinc-100 text-zinc-900 border-transparent',
    outline: 'text-zinc-700 border border-zinc-200 bg-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    destructive: 'bg-red-50 text-red-700 border border-red-200',
    warn: 'bg-amber-50 text-amber-700 border border-amber-200'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${variants[variant]} ${className}`
  }, children);
}

// Stable portrait per known username so the same person reads the same
// across every screen. Unknown names hash deterministically via ?u=.
const AVATAR_IMG = {
  'alex-cho': 12,
  'priya-r': 5,
  'marcus-w': 33,
  'nicolae-i': 51,
  'othman': 8,
  'othman-shareef': 8,
  'sara-k': 9,
  'devon-l': 60,
  'lena-m': 16,
  'tomas-b': 68,
  'wei-z': 53,
  'amara-o': 44
};
function SAvatar({
  name = '',
  size = 'size-6',
  src
}) {
  const initials = name.split(/[-\s]/).map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const url = src || (AVATAR_IMG[name.toLowerCase()] ? `https://i.pravatar.cc/96?img=${AVATAR_IMG[name.toLowerCase()]}` : `https://i.pravatar.cc/96?u=${encodeURIComponent(name)}`);
  const [err, setErr] = React.useState(false);
  if (err) {
    return /*#__PURE__*/React.createElement("div", {
      className: `${size} shrink-0 rounded-full bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 inline-flex items-center justify-center text-[10px] font-medium`
    }, initials);
  }
  return /*#__PURE__*/React.createElement("img", {
    src: url,
    alt: name,
    onError: () => setErr(true),
    className: `${size} shrink-0 rounded-full object-cover bg-zinc-100 ring-1 ring-zinc-200`
  });
}
function SKbd({
  children
}) {
  return /*#__PURE__*/React.createElement("kbd", {
    className: "inline-flex h-5 min-w-5 items-center justify-center rounded border border-zinc-200 bg-zinc-50 px-1.5 text-[10px] font-medium text-zinc-500 font-mono"
  }, children);
}
function SSeparator({
  vertical = false,
  className = ''
}) {
  return vertical ? /*#__PURE__*/React.createElement("div", {
    className: `w-px self-stretch bg-zinc-200 ${className}`
  }) : /*#__PURE__*/React.createElement("div", {
    className: `h-px w-full bg-zinc-200 ${className}`
  });
}

// ═══ Screen 1 — Inbox ═════════════════════════════════════════
function ShadcnInboxScreen({
  width = 1320,
  height = 820
}) {
  return /*#__PURE__*/React.createElement(ShadcnWindow, {
    width: width,
    height: height,
    title: "Pyor",
    subtitle: "Inbox \xB7 32 awaiting your review",
    toolbar: /*#__PURE__*/React.createElement(ShadcnInboxToolbar, null),
    status: /*#__PURE__*/React.createElement(ShadcnStatus, null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(ShadcnSidebar, null), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col min-w-0 bg-white"
  }, /*#__PURE__*/React.createElement(ShadcnInboxHeader, null), /*#__PURE__*/React.createElement(ShadcnInboxList, null))));
}
function ShadcnInboxToolbar() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter PRs\u2026",
    kbd: "\u2318F",
    className: "w-56"
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm",
    icon: "refresh"
  }, "Refresh"));
}
function ShadcnStatus() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "size-1.5 rounded-full bg-emerald-500"
  }), /*#__PURE__*/React.createElement("span", null, "Connected \xB7 alex-cho")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "mx-3 h-3"
  }), /*#__PURE__*/React.createElement("span", null, "Last poll ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-700"
  }, "14s ago"), " \xB7 60s cadence"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "mx-3 h-3"
  }), /*#__PURE__*/React.createElement("span", null, "Rate 4,983 / 5,000"), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto"
  }, "54 PRs cached \xB7 42 MB"));
}
function ShadcnSidebar() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-56 shrink-0 border-r border-zinc-200 bg-zinc-50/50 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 space-y-4 overflow-auto flex-1"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Saved"), /*#__PURE__*/React.createElement("nav", {
    className: "space-y-0.5"
  }, /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "sliders",
    label: "Needs my approval",
    count: "3"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "sliders",
    label: "Drafts mentioning me",
    count: "2"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "sliders",
    label: "Failing checks",
    count: "5",
    countVariant: "destructive"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "sliders",
    label: "Over 7 days old",
    count: "9",
    countVariant: "warn"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-2 py-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Repos"), /*#__PURE__*/React.createElement("button", {
    className: "size-4 rounded text-zinc-400 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "plus",
    className: "size-3.5"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "space-y-0.5"
  }, /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "folder",
    label: "northwind/web-event-app",
    count: "11"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "folder",
    label: "northwind/api",
    count: "7"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "folder",
    label: "northwind/mobile-ios",
    count: "5"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "folder",
    label: "northwind/design-system",
    count: "4"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "folder",
    label: "northwind/infra",
    count: "3"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "folder",
    label: "northwind/analytics",
    count: "2"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
  }, "Teams"), /*#__PURE__*/React.createElement("nav", {
    className: "space-y-0.5"
  }, /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "users",
    label: "@northwind/frontend",
    count: "14"
  }), /*#__PURE__*/React.createElement(SidebarLink, {
    icon: "users",
    label: "@northwind/platform",
    count: "6"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 p-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "flex w-full items-center gap-2 rounded-md p-1.5 hover:bg-zinc-100"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-7"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-medium truncate"
  }, "Alex Cho"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-500 truncate"
  }, "alex@northwind.com")), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3.5 text-zinc-400"
  }))));
}
function SidebarLink({
  icon,
  label,
  count,
  countVariant = 'default'
}) {
  const countColor = {
    default: 'text-zinc-500',
    destructive: 'text-red-600',
    warn: 'text-amber-600'
  }[countVariant];
  return /*#__PURE__*/React.createElement("a", {
    className: "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
  }, /*#__PURE__*/React.createElement(LI, {
    name: icon,
    className: "size-3.5 text-zinc-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 truncate"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: `text-[11px] tabular-nums font-medium ${countColor}`
  }, count));
}
function ShadcnInboxHeader() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-3 border-b border-zinc-200 px-5 py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-semibold tracking-tight"
  }, "Inbox"), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-zinc-500"
  }, "32 PRs awaiting your review")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-xs text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", null, "Sort by"), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-zinc-900 hover:bg-zinc-50"
  }, "Activity ", /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex h-9 items-center rounded-lg bg-zinc-100 p-1"
  }, /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-7 items-center gap-1.5 rounded-md bg-white px-3 text-[13px] font-medium text-zinc-950 shadow-sm"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "inbox",
    className: "size-3.5"
  }), " Inbox", /*#__PURE__*/React.createElement("span", {
    className: "ml-0.5 rounded bg-zinc-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-zinc-700 tabular-nums"
  }, "32")), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "user",
    className: "size-3.5"
  }), " Mine", /*#__PURE__*/React.createElement("span", {
    className: "ml-0.5 text-[10.5px] tabular-nums"
  }, "8")), /*#__PURE__*/React.createElement("button", {
    className: "inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-zinc-500 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5"
  }), " Participating", /*#__PURE__*/React.createElement("span", {
    className: "ml-0.5 text-[10.5px] tabular-nums"
  }, "14"))), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1.5"
  }, "Status: ", /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-950"
  }, "Open"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-2.5"
  })), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline"
  }, "Author: ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "any")), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline"
  }, "Checks: ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "any")), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline"
  }, "Age: ", /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "any")))));
}
const SHADCN_PRS = [{
  unread: 3,
  title: "feat(scheduler): coalesce identical session pushes into a single fan-out",
  repo: 'northwind/web-event-app',
  num: 9241,
  author: 'priya-r',
  age: '12m',
  additions: 412,
  deletions: 89,
  files: 14,
  checks: {
    p: 18,
    f: 0,
    pe: 2
  },
  comments: 4,
  group: 'direct'
}, {
  unread: 0,
  title: "fix(billing): correct prorated charge math when plan downgrades mid-cycle",
  repo: 'northwind/api',
  num: 4471,
  author: 'marcus-w',
  age: '1h',
  additions: 38,
  deletions: 47,
  files: 4,
  checks: {
    p: 23,
    f: 0,
    pe: 0
  },
  comments: 7,
  group: 'direct'
}, {
  unread: 1,
  draft: true,
  title: "RFC: cohort export pipeline (S3 + Athena)",
  repo: 'northwind/analytics',
  num: 308,
  author: 'sara-l',
  age: '3h',
  additions: 1240,
  deletions: 12,
  files: 38,
  checks: {
    p: 4,
    f: 1,
    pe: 3
  },
  comments: 12,
  group: 'direct'
}, {
  unread: 5,
  title: "perf(diff-render): virtualise hunks larger than 2k lines",
  repo: 'northwind/web-event-app',
  num: 9217,
  author: 'nicolae-i',
  age: '1d',
  additions: 904,
  deletions: 311,
  files: 7,
  checks: {
    p: 16,
    f: 2,
    pe: 0
  },
  comments: 23,
  group: 'direct',
  changes: true,
  selected: true
}, {
  unread: 0,
  title: "chore(deps): bump pg from 8.11.3 to 8.13.0",
  repo: 'northwind/api',
  num: 4469,
  author: 'dependabot',
  age: '4h',
  additions: 2,
  deletions: 2,
  files: 1,
  checks: {
    p: 23,
    f: 0,
    pe: 0
  },
  comments: 0,
  group: 'team',
  bot: true
}, {
  unread: 2,
  title: "Empty-state polish for event picker on small viewports",
  repo: 'northwind/design-system',
  num: 612,
  author: 'jules-k',
  age: '7h',
  additions: 64,
  deletions: 22,
  files: 3,
  checks: {
    p: 11,
    f: 0,
    pe: 0
  },
  comments: 2,
  group: 'team'
}, {
  unread: 0,
  title: "fix(auth): refresh session before WebSocket reconnect",
  repo: 'northwind/web-event-app',
  num: 9209,
  author: 'priya-r',
  age: '1d',
  additions: 18,
  deletions: 9,
  files: 2,
  checks: {
    p: 18,
    f: 0,
    pe: 0
  },
  comments: 3,
  group: 'team'
}, {
  unread: 1,
  title: "spike: replace Redux with Zustand on the attendee dashboard",
  repo: 'northwind/web-event-app',
  num: 9198,
  author: 'marcus-w',
  age: '2d',
  additions: 1820,
  deletions: 1640,
  files: 56,
  checks: {
    p: 14,
    f: 0,
    pe: 0
  },
  comments: 31,
  group: 'team'
}, {
  unread: 0,
  title: "Document new PAT scope requirements for SSO orgs",
  repo: 'northwind/web-event-app',
  num: 9192,
  author: 'sara-l',
  age: '3d',
  additions: 78,
  deletions: 4,
  files: 2,
  checks: {
    p: 8,
    f: 0,
    pe: 0
  },
  comments: 1,
  group: 'team'
}, {
  unread: 0,
  title: "test(e2e): re-record session-replay fixtures after schema change",
  repo: 'northwind/web-event-app',
  num: 9180,
  author: 'jules-k',
  age: '4d',
  additions: 312,
  deletions: 286,
  files: 19,
  checks: {
    p: 17,
    f: 0,
    pe: 1
  },
  comments: 6,
  group: 'team'
}];
function ShadcnInboxList() {
  const direct = SHADCN_PRS.filter(p => p.group === 'direct');
  const team = SHADCN_PRS.filter(p => p.group === 'team');
  return /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto"
  }, /*#__PURE__*/React.createElement(ShadcnGroupHeader, {
    label: "Requested directly",
    count: direct.length
  }), direct.map((pr, i) => /*#__PURE__*/React.createElement(ShadcnPRRow, {
    key: i,
    pr: pr
  })), /*#__PURE__*/React.createElement(ShadcnGroupHeader, {
    label: "Via team review \xB7 @northwind/frontend, @northwind/platform",
    count: team.length
  }), team.map((pr, i) => /*#__PURE__*/React.createElement(ShadcnPRRow, {
    key: i + 100,
    pr: pr
  })));
}
function ShadcnGroupHeader({
  label,
  count
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-5 py-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-zinc-500"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3"
  }), label, /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "text-[10px]"
  }, count));
}
function ShadcnPRRow({
  pr
}) {
  const statusIcon = pr.draft ? 'git-pull-request-draft' : 'git-pull-request';
  return /*#__PURE__*/React.createElement("div", {
    className: `group relative flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-5 py-3 hover:bg-zinc-50 ${pr.selected ? 'bg-blue-50/40 hover:bg-blue-50/60' : ''}`
  }, pr.selected && /*#__PURE__*/React.createElement("span", {
    className: "absolute left-0 top-0 h-full w-0.5 bg-zinc-900"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-2 pt-1.5 shrink-0"
  }, pr.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "block size-1.5 rounded-full bg-blue-600"
  })), /*#__PURE__*/React.createElement(LI, {
    name: statusIcon,
    className: `size-4 shrink-0 mt-0.5 ${pr.draft ? 'text-zinc-400' : 'text-emerald-600'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[13.5px] tracking-tight truncate ${pr.unread ? 'font-semibold' : 'font-medium'} text-zinc-900`,
    style: {
      maxWidth: 580
    }
  }, pr.title), pr.changes && /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive"
  }, "changes requested"), pr.bot && /*#__PURE__*/React.createElement(SBadge, {
    variant: "secondary",
    className: "text-zinc-500"
  }, "bot")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex items-center gap-2 text-[12px] text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-zinc-400"
  }, "#", pr.num), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, pr.repo), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: pr.author,
    size: "size-4"
  }), pr.author), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, pr.age))), /*#__PURE__*/React.createElement("div", {
    className: "flex shrink-0 items-center gap-4 text-[12px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right",
    style: {
      minWidth: 70
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10.5px] text-zinc-400"
  }, pr.files, " files"), /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-[10.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", pr.additions.toLocaleString()), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", pr.deletions))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2",
    style: {
      minWidth: 72
    }
  }, pr.checks.p > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), pr.checks.p), pr.checks.f > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5 text-red-600"
  }), pr.checks.f), pr.checks.pe > 0 && /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "circle-dot",
    className: "size-3.5 text-amber-600"
  }), pr.checks.pe)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 40
    }
  }, pr.comments > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: `size-3.5 ${pr.unread ? 'text-blue-600' : 'text-zinc-400'}`
  }), /*#__PURE__*/React.createElement("span", {
    className: pr.unread ? 'font-semibold text-blue-600' : ''
  }, pr.comments)) : /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300"
  }, "\u2014"))));
}

// ═══ Screen 2 — Files changed ════════════════════════════════
function ShadcnFilesScreen({
  width = 1320,
  height = 900
}) {
  return /*#__PURE__*/React.createElement(ShadcnWindow, {
    width: width,
    height: height,
    title: "#9217",
    subtitle: "perf(diff-render): virtualise hunks larger than 2k lines",
    toolbar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SButton, {
      variant: "ghost",
      size: "sm"
    }, "View on GitHub"), /*#__PURE__*/React.createElement(SButton, {
      variant: "outline",
      size: "sm",
      icon: "x-circle"
    }, "Request changes"), /*#__PURE__*/React.createElement(SButton, {
      variant: "default",
      size: "sm",
      icon: "check-circle"
    }, "Approve")),
    status: /*#__PURE__*/React.createElement(ShadcnPRStatus, null)
  }, /*#__PURE__*/React.createElement(ShadcnPRHeader, null), /*#__PURE__*/React.createElement(ShadcnPRTabs, null), /*#__PURE__*/React.createElement(ShadcnFilesToolbar, null), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 min-h-0"
  }, /*#__PURE__*/React.createElement(ShadcnFileRail, null), /*#__PURE__*/React.createElement(ShadcnDiffPane, null)), /*#__PURE__*/React.createElement(ShadcnReviewDock, null));
}
function ShadcnPRStatus() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "size-1.5 rounded-full bg-emerald-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ml-1.5"
  }, "Live polling \xB7 8s"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "mx-3 h-3"
  }), /*#__PURE__*/React.createElement("span", null, "2 pending in draft review"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "mx-3 h-3"
  }), /*#__PURE__*/React.createElement("span", null, "Base \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono"
  }, "main@a3f7b21")));
}
function ShadcnPRHeader() {
  return /*#__PURE__*/React.createElement("div", {
    className: "border-b border-zinc-200 px-5 pt-4 pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    title: "Back to Inbox",
    className: "inline-flex h-6 items-center gap-1 rounded-md border border-zinc-200 bg-white pl-1 pr-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-left",
    className: "size-3.5"
  }), "Inbox"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "success",
    className: "gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-pull-request",
    className: "size-3"
  }), " Open"), /*#__PURE__*/React.createElement("span", {
    className: "text-[13px] text-zinc-700"
  }, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "nicolae-i"), " wants to merge ", /*#__PURE__*/React.createElement("b", {
    className: "font-semibold"
  }, "14 commits"), " into", /*#__PURE__*/React.createElement("code", {
    className: "mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "main"), "from", /*#__PURE__*/React.createElement("code", {
    className: "mx-1 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11.5px]"
  }, "perf/virtualise-hunks")), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-xs text-zinc-500"
  }, "Opened 1d 4h ago \xB7 synced 12s ago")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-[12.5px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "Reviewers"), /*#__PURE__*/React.createElement("div", {
    className: "flex -space-x-1.5"
  }, /*#__PURE__*/React.createElement(ShadcnReviewerChip, {
    name: "alex-cho",
    state: "pending"
  }), /*#__PURE__*/React.createElement(ShadcnReviewerChip, {
    name: "priya-r",
    state: "approved"
  }), /*#__PURE__*/React.createElement(ShadcnReviewerChip, {
    name: "marcus-w",
    state: "changes"
  }))), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5 text-red-600"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-red-700"
  }, "2"), " failing"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-300 mx-0.5"
  }, "\xB7"), /*#__PURE__*/React.createElement(LI, {
    name: "check-circle",
    className: "size-3.5 text-emerald-600"
  }), /*#__PURE__*/React.createElement("span", null, "16 passed")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+904"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212311"), ' ', /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "\xB7 7 files")), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "tag",
    className: "size-3"
  }), " performance"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "gap-1"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "tag",
    className: "size-3"
  }), " needs-design-review"))));
}
function ShadcnReviewerChip({
  name,
  state
}) {
  const dot = {
    approved: 'bg-emerald-500',
    changes: 'bg-red-500',
    pending: 'bg-amber-500',
    commented: 'bg-zinc-400'
  }[state];
  return /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: name,
    size: "size-5"
  }), /*#__PURE__*/React.createElement("span", {
    className: `absolute -bottom-0.5 -right-0.5 size-2 rounded-full ${dot} ring-2 ring-white`
  }));
}
function ShadcnPRTabs() {
  const tabs = [{
    id: 'conv',
    label: 'Conversation',
    count: 31,
    icon: 'message-square'
  }, {
    id: 'commits',
    label: 'Commits',
    count: 14,
    icon: 'git-commit'
  }, {
    id: 'checks',
    label: 'Checks',
    count: 18,
    icon: 'check-circle',
    failing: 2
  }, {
    id: 'files',
    label: 'Files changed',
    count: 7,
    icon: 'file',
    active: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border-b border-zinc-200 px-5"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: `relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] transition-colors ${t.active ? 'text-zinc-950 font-semibold' : 'text-zinc-500 hover:text-zinc-900 font-medium'}`
  }, t.active && /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-x-0 bottom-0 h-0.5 bg-zinc-900"
  }), /*#__PURE__*/React.createElement(LI, {
    name: t.icon,
    className: `size-3.5 ${t.active ? '' : 'text-zinc-400'}`
  }), t.label, /*#__PURE__*/React.createElement(SBadge, {
    variant: t.active ? 'secondary' : 'outline',
    className: "ml-0.5 px-1.5 text-[10px]"
  }, t.count), t.failing && /*#__PURE__*/React.createElement(SBadge, {
    variant: "destructive",
    className: "px-1.5 text-[10px]"
  }, t.failing, " failing"))), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2 text-[11.5px] text-zinc-500"
  }, /*#__PURE__*/React.createElement(SKbd, null, "J"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement(SKbd, null, "K"), /*#__PURE__*/React.createElement("span", null, "next file")));
}
function ShadcnFilesToolbar({
  commitsOpen = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/60 px-5 py-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: `inline-flex h-7 items-center gap-2 rounded-md border px-2.5 text-[12px] font-medium ${commitsOpen ? 'border-zinc-900 bg-zinc-100 text-zinc-900 ring-1 ring-zinc-900/10' : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: "git-commit",
    className: `size-3.5 ${commitsOpen ? 'text-zinc-900' : 'text-zinc-500'}`
  }), /*#__PURE__*/React.createElement("span", null, "14 commits"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-400"
  }, "\xB7 all changes"), /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-400"
  })), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 min-w-44"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3.5 text-zinc-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 h-1 rounded-full bg-zinc-200 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-0 bg-zinc-900",
    style: {
      width: '42.8%'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] tabular-nums text-zinc-500"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-zinc-900"
  }, "3"), "/7")), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-4"
  }), /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Search in diff\u2026",
    kbd: "\u2318F",
    className: "w-44"
  }), /*#__PURE__*/React.createElement(SToggleGroup, {
    className: "ml-auto",
    value: "inline",
    options: [{
      id: 'inline',
      icon: 'rows',
      label: 'Inline'
    }, {
      id: 'split',
      icon: 'columns',
      label: 'Split'
    }]
  }));
}
const SHADCN_FILES = [{
  kind: 'folder',
  name: 'src',
  depth: 0,
  viewed: 'partial'
}, {
  kind: 'folder',
  name: 'diff',
  depth: 1,
  viewed: 'partial'
}, {
  kind: 'file',
  name: 'VirtualHunk.tsx',
  depth: 2,
  add: 312,
  del: 4,
  viewed: false,
  comments: 8,
  unread: 3,
  current: true
}, {
  kind: 'file',
  name: 'HunkWindow.ts',
  depth: 2,
  add: 184,
  del: 22,
  viewed: false,
  comments: 4,
  unread: 0
}, {
  kind: 'file',
  name: 'measureHunk.ts',
  depth: 2,
  add: 96,
  del: 8,
  viewed: true,
  comments: 1,
  unread: 0
}, {
  kind: 'file',
  name: 'index.ts',
  depth: 2,
  add: 4,
  del: 2,
  viewed: true,
  comments: 0,
  unread: 0
}, {
  kind: 'folder',
  name: 'editor',
  depth: 1,
  viewed: 'full'
}, {
  kind: 'file',
  name: 'CodeMirrorHost.tsx',
  depth: 2,
  add: 28,
  del: 41,
  viewed: true,
  comments: 2,
  unread: 0
}, {
  kind: 'file',
  name: 'bridge.ts',
  depth: 2,
  add: 6,
  del: 0,
  viewed: true,
  comments: 0,
  unread: 0
}, {
  kind: 'folder',
  name: '__tests__',
  depth: 0,
  viewed: 'none'
}, {
  kind: 'file',
  name: 'VirtualHunk.test.tsx',
  depth: 1,
  add: 274,
  del: 234,
  viewed: false,
  comments: 9,
  unread: 2
}];
function ShadcnFileRail() {
  return /*#__PURE__*/React.createElement("aside", {
    className: "w-72 shrink-0 border-r border-zinc-200 bg-zinc-50/40 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 p-2 border-b border-zinc-200"
  }, /*#__PURE__*/React.createElement(SInput, {
    icon: "search",
    placeholder: "Filter files\u2026",
    className: "h-7 flex-1"
  }), /*#__PURE__*/React.createElement(SToggleGroup, {
    mode: "icon",
    value: "tree",
    options: [{
      id: 'tree',
      icon: 'list-tree',
      label: 'Tree'
    }, {
      id: 'list',
      icon: 'list',
      label: 'List'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto py-1"
  }, SHADCN_FILES.map((f, i) => /*#__PURE__*/React.createElement(ShadcnFileRow, {
    key: i,
    f: f
  }))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-zinc-200 px-3 py-2 text-[11px] text-zinc-500 flex justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "7 files \xB7 3 folders"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "eye",
    className: "size-3"
  }), " 3 viewed \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "text-blue-600"
  }, "5 unread"))));
}
function ShadcnFileRow({
  f
}) {
  const isFolder = f.kind === 'folder';
  const folderState = isFolder ? {
    full: 'checked',
    partial: 'partial',
    none: 'unchecked'
  }[f.viewed] : null;
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-1.5 h-7 text-[12.5px] ${f.current ? 'bg-zinc-200/60 border-l-2 border-zinc-900' : 'border-l-2 border-transparent'} ${f.viewed === true ? 'opacity-60' : ''}`,
    style: {
      paddingLeft: 8 + f.depth * 14,
      paddingRight: 10
    }
  }, isFolder ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LI, {
    name: "chevron-down",
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "folder",
    className: "size-3.5 text-zinc-500"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "w-3"
  }), /*#__PURE__*/React.createElement(LI, {
    name: "file",
    className: "size-3.5 text-zinc-400"
  })), /*#__PURE__*/React.createElement("span", {
    className: `flex-1 truncate ${f.current ? 'font-semibold' : ''}`
  }, f.name), !isFolder && f.unread > 0 && /*#__PURE__*/React.createElement("span", {
    className: "size-1.5 rounded-full bg-blue-600"
  }), !isFolder && f.comments > 0 && /*#__PURE__*/React.createElement("span", {
    className: `text-[10.5px] ${f.unread ? 'text-blue-600 font-medium' : 'text-zinc-400'}`
  }, f.comments), !isFolder && /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[10px] tabular-nums"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", f.add), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", f.del)), /*#__PURE__*/React.createElement(ShadcnCheckbox, {
    state: isFolder ? folderState : f.viewed ? 'checked' : 'unchecked'
  }));
}
function ShadcnCheckbox({
  state
}) {
  if (state === 'checked') {
    return /*#__PURE__*/React.createElement("span", {
      className: "inline-flex size-3.5 items-center justify-center rounded border border-zinc-900 bg-zinc-900"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "white",
      strokeWidth: "3",
      className: "size-2.5"
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "20 6 9 17 4 12"
    })));
  }
  if (state === 'partial') {
    return /*#__PURE__*/React.createElement("span", {
      className: "inline-flex size-3.5 items-center justify-center rounded border border-zinc-900 bg-zinc-900"
    }, /*#__PURE__*/React.createElement("span", {
      className: "block h-0.5 w-2 rounded-sm bg-white"
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: "size-3.5 rounded border border-zinc-300 bg-white"
  });
}
function ShadcnDiffPane({
  hideComments = false,
  fontSize,
  lineHeight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-auto bg-white"
  }, /*#__PURE__*/React.createElement(ShadcnFileDiffHeader, {
    name: "src/diff/VirtualHunk.tsx",
    add: 312,
    del: 4
  }), /*#__PURE__*/React.createElement(ShadcnDiffBody, {
    hideComments: hideComments,
    fontSize: fontSize,
    lineHeight: lineHeight
  }), /*#__PURE__*/React.createElement(ShadcnFileDiffHeader, {
    name: "src/diff/HunkWindow.ts",
    add: 184,
    del: 22,
    collapsed: true
  }));
}
function ShadcnFileDiffHeader({
  name,
  add,
  del,
  collapsed
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-2 ${collapsed ? 'border-t' : ''}`
  }, /*#__PURE__*/React.createElement(LI, {
    name: collapsed ? 'chevron-right' : 'chevron-down',
    className: "size-3 text-zinc-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[12px] font-semibold"
  }, name), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-600"
  }, "+", add), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-600"
  }, "\u2212", del)), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11.5px] text-zinc-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "size-3 rounded-sm border border-zinc-300 bg-white"
  }), "Mark viewed")));
}
const SHADCN_DIFF_LINES = [{
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
}, {
  l: null,
  r: '20',
  k: 'add',
  code: '  const totalH = hunk.lines.length * lineHeight;',
  anchor: true
}, {
  l: null,
  r: '21',
  k: 'add',
  code: ''
}, {
  l: '20',
  r: '22',
  k: 'ctx',
  code: '  if (hunk.lines.length < VIRTUALISE_THRESHOLD) {'
}, {
  l: '21',
  r: '23',
  k: 'ctx',
  code: '    return <NaiveHunk hunk={hunk} />;'
}, {
  l: '22',
  r: '24',
  k: 'ctx',
  code: '  }'
}, {
  l: '23',
  r: null,
  k: 'del',
  code: '  return null;'
}, {
  l: null,
  r: '25',
  k: 'add',
  code: '  const [window, setWindow] = useState(() => measureHunk(hunk, 0));'
}];
function ShadcnDiffBody({
  hideComments = false,
  fontSize = 12,
  lineHeight = 18
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "font-mono",
    style: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}px`
    }
  }, SHADCN_DIFF_LINES.map((ln, i) => /*#__PURE__*/React.createElement(ShadcnDiffLine, {
    key: i,
    ln: ln,
    hideComments: hideComments
  })), hideComments && SHADCN_DIFF_LINES.some(l => l.anchor) && /*#__PURE__*/React.createElement("div", {
    className: "my-2 ml-[108px] mr-3 rounded-md border border-dashed border-zinc-300 bg-zinc-50/60 px-3 py-2 font-sans text-[11.5px] text-zinc-500 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "message-square",
    className: "size-3.5"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    className: "font-semibold text-zinc-700"
  }, "1 inline thread"), " hidden on this hunk \xB7 2 comments"), /*#__PURE__*/React.createElement("span", {
    className: "ml-auto text-[10.5px] text-zinc-400"
  }, "Toggle ", /*#__PURE__*/React.createElement("span", {
    className: "rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono"
  }, "\u21E7M"), " to show")));
}
function ShadcnDiffLine({
  ln,
  hideComments = false
}) {
  const bg = ln.k === 'add' ? 'bg-emerald-50' : ln.k === 'del' ? 'bg-red-50' : 'bg-white';
  const gutter = ln.k === 'add' ? 'bg-emerald-100/70' : ln.k === 'del' ? 'bg-red-100/70' : 'bg-zinc-50';
  const markerColor = ln.k === 'add' ? 'text-emerald-700' : ln.k === 'del' ? 'text-red-700' : 'text-zinc-400';
  const marker = ln.k === 'add' ? '+' : ln.k === 'del' ? '−' : ' ';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: `flex ${bg}`
  }, /*#__PURE__*/React.createElement("span", {
    className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
  }, ln.l ?? ''), /*#__PURE__*/React.createElement("span", {
    className: `shrink-0 w-11 text-right pr-1.5 text-zinc-400 tabular-nums ${gutter} border-r border-zinc-200/60`
  }, ln.r ?? ''), /*#__PURE__*/React.createElement("span", {
    className: `shrink-0 w-5 text-center ${markerColor}`
  }, marker), /*#__PURE__*/React.createElement("span", {
    className: "flex-1 pr-3 text-zinc-900 whitespace-pre"
  }, ln.code)), ln.anchor && !hideComments && (typeof GhInlineThread === 'function' ? /*#__PURE__*/React.createElement(GhInlineThread, {
    file: "src/diff/VirtualHunk.tsx",
    line: Number(ln.r || ln.l || 0),
    anchorCode: ln.code
  }) : /*#__PURE__*/React.createElement(ShadcnInlineThread, null)));
}
function ShadcnInlineThread() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ml-[108px] my-1.5 mr-3 rounded-lg border border-zinc-200 bg-white shadow-sm font-sans text-[13px] overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-6"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-[13px]"
  }, "alex-cho"), /*#__PURE__*/React.createElement(SBadge, {
    variant: "outline",
    className: "text-[9.5px]"
  }, "you"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-400"
  }, "2h ago")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-[13px] text-zinc-700 leading-relaxed"
  }, "Why ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "useState(() => measureHunk(...))"), " instead of ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "useMemo"), "? We never call ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "setWindow"), " in the threshold branch \u2014 this allocates a setter we throw away."))), /*#__PURE__*/React.createElement(SSeparator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 p-3"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "nicolae-i",
    size: "size-6"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-[13px]"
  }, "nicolae-i"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11.5px] text-zinc-400"
  }, "1h ago")), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 text-[13px] text-zinc-700 leading-relaxed"
  }, "Good catch. I had it as ", /*#__PURE__*/React.createElement("code", {
    className: "rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11.5px]"
  }, "useMemo"), " originally; switched when I added the scroll handler in a later commit. I'll roll it back here."))), /*#__PURE__*/React.createElement(SSeparator, null), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 bg-zinc-50/60 p-2.5"
  }, /*#__PURE__*/React.createElement(SAvatar, {
    name: "alex-cho",
    size: "size-6"
  }), /*#__PURE__*/React.createElement("input", {
    className: "flex-1 bg-transparent text-[12.5px] text-zinc-500 outline-none placeholder:text-zinc-400",
    placeholder: "Reply, or press R to start your draft\u2026",
    readOnly: true
  }), /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Resolve"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm"
  }, "Reply")));
}
function ShadcnReviewDock() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex h-12 items-center gap-3 border-t border-zinc-200 bg-zinc-50/60 px-4 text-[12.5px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "size-1.5 rounded-full bg-blue-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold"
  }, "Review draft"), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "\xB7 3 pending"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-zinc-500"
  }, "1 line \xB7 1 range \xB7 1 file-level"), /*#__PURE__*/React.createElement(SSeparator, {
    vertical: true,
    className: "h-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1.5 font-semibold text-red-600"
  }, /*#__PURE__*/React.createElement(LI, {
    name: "x-circle",
    className: "size-3.5"
  }), " Request changes"), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(SButton, {
    variant: "ghost",
    size: "sm"
  }, "Discard"), /*#__PURE__*/React.createElement(SButton, {
    variant: "default",
    size: "sm",
    icon: "send"
  }, "Submit review \xB7 \u2318\u23CE")));
}
Object.assign(window, {
  ShadcnInboxScreen,
  ShadcnFilesScreen,
  // Primitives and PR-detail body pieces re-used by shadcn-app.jsx.
  LI,
  SButton,
  SBadge,
  SAvatar,
  SKbd,
  SSeparator,
  ShadcnFilesToolbar,
  ShadcnFileRail,
  ShadcnDiffPane,
  ShadcnReviewDock
});