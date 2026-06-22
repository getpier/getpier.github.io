// Embed bootstrap — picks a screen from ?screen= and renders it scaled to
// fit the iframe. Wrapped in an IIFE so its locals never touch the globals
// the artboard modules define. Precompiled to compiled/_boot.js (no runtime
// Babel) by scripts/build-embed.mjs.
(function () {
  const {
    useEffect,
    useState,
    useRef
  } = React;
  const params = new URLSearchParams(window.location.search);
  const screenKey = params.get('screen') || 'files-pulls';

  // ?theme=dark → drive the shadcn dark-mode override layer (shadcn-dark.css).
  document.body.classList.toggle('dark', params.get('theme') === 'dark');

  // The exact shadcn artboards from Pier.html — same component + props as the
  // DCArtboard definitions in the design canvas.
  const SCREENS = {
    'files-pulls': () => /*#__PURE__*/React.createElement(ShadcnPRDetailFilesScreen, {
      width: 1320,
      height: 900,
      from: "pulls"
    }),
    'files-inbox': () => /*#__PURE__*/React.createElement(ShadcnPRDetailFilesScreen, {
      width: 1320,
      height: 900,
      from: "inbox"
    }),
    'conversation': () => /*#__PURE__*/React.createElement(ShadcnPRDetailConversationScreen, {
      width: 1320,
      height: 820,
      from: "inbox"
    }),
    'inbox-comments': () => /*#__PURE__*/React.createElement(ShadcnInboxScreenV3, {
      width: 1320,
      height: 820,
      view: {
        tab: 'comments'
      }
    }),
    'comments': () => /*#__PURE__*/React.createElement(ShadcnCommentsScreen, {
      width: 1320,
      height: 820
    }),
    'team-radar': () => /*#__PURE__*/React.createElement(ScreenTeamRadar, {
      width: 1320,
      height: 820
    }),
    'pulls-reviewing': () => /*#__PURE__*/React.createElement(ShadcnPullRequestsScreen, {
      width: 1320,
      height: 820,
      view: {
        tab: 'reviewing'
      }
    }),
    'local-reviews': () => /*#__PURE__*/React.createElement(ShadcnLocalReviewsScreen, {
      width: 1320,
      height: 820
    }),
    'prepr-launch': () => /*#__PURE__*/React.createElement(ShadcnPrePRLauncherScreen, {
      width: 1100,
      height: 740
    }),
    'prepr-review': () => /*#__PURE__*/React.createElement(ShadcnPrePRReviewScreen, {
      width: 1320,
      height: 900
    }),
    'prepr-unpushed': () => /*#__PURE__*/React.createElement(ShadcnPrePRReviewScreen, {
      width: 1320,
      height: 900,
      view: {
        pushed: false
      }
    })
  };
  function Embed() {
    const [scale, setScale] = useState(1);
    const [size, setSize] = useState({
      w: 1320,
      h: 820
    });
    const innerRef = useRef(null);
    useEffect(() => {
      const fit = () => {
        if (!innerRef.current) return;
        const node = innerRef.current.firstElementChild;
        if (!node) return;
        const w = node.offsetWidth || 1320;
        const h = node.offsetHeight || 820;
        setSize({
          w,
          h
        });
        setScale(Math.min(window.innerWidth / w, window.innerHeight / h));
      };
      const id = requestAnimationFrame(fit);
      // Tailwind Play CDN injects styles asynchronously — refit a few times.
      const timers = [120, 360, 800].map(ms => setTimeout(fit, ms));
      window.addEventListener('resize', fit);
      return () => {
        cancelAnimationFrame(id);
        timers.forEach(clearTimeout);
        window.removeEventListener('resize', fit);
      };
    }, []);
    const ScreenComp = SCREENS[screenKey] || SCREENS['files-pulls'];
    const offsetX = (window.innerWidth - size.w * scale) / 2;
    const offsetY = (window.innerHeight - size.h * scale) / 2;
    return /*#__PURE__*/React.createElement("div", {
      ref: innerRef,
      className: "scale-wrap",
      style: {
        transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
      }
    }, /*#__PURE__*/React.createElement(ScreenComp, null));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Embed, null));
})();