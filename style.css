/* ── Reset & Base ── */
    @font-face {
      font-family: 'Reggae One';
      src: url('./fonts/ReggaeOne-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      touch-action: manipulation;
      /* Disables double-tap to zoom */
      -webkit-user-select: none;
      /* Prevents text selection on rapid tapping */
      user-select: none;
    }

    :root {
      --bg: #f2f2f7;
      --card: #fff;
      --separator: rgba(60, 60, 67, .12);
      --label-primary: rgba(0, 0, 0, .85);
      --label-secondary: rgba(60, 60, 67, .6);
      --tint: #007aff;
      --green: #34c759;
      --red: #ff3b30;
      /* -- Apple Colors -- */
      --sys-red: #ff3b30;
      --sys-purple: #af52de;
      --sys-green: #34c759;
      --sys-yellow: #ffcc00;
      --sys-blue: #007aff;
      --sys-gray: #8e8e93;
      --bg-red: rgba(255, 59, 48, 0.08);
      --bg-purple: rgba(175, 82, 222, 0.08);
      --bg-green: rgba(52, 199, 89, 0.08);
      --bg-yellow: rgba(255, 204, 0, 0.12);
      --bg-blue: rgba(0, 122, 255, 0.08);
      --bg-gray: rgba(142, 142, 147, 0.08);
      --radius: 14px;
      --card-shadow: 0 1px 3px rgba(0, 0, 0, .08), 0 1px 2px rgba(0, 0, 0, .04);
    }

    html {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: var(--bg);
      color: var(--label-primary);
    }

    body {
      min-height: 100dvh;
      padding: 0;
      margin: 0;
    }

    /* ── Sidebar ── */
    #sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 280px;
      height: 100%;
      background: rgba(255, 255, 255, .82);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      z-index: 1000;
      padding: 68px 0 32px;
      transform: translateX(-280px);
      transition: transform .35s cubic-bezier(.32, .72, 0, 1), background-color .3s, border-color .3s;
      overflow-y: auto;
      border-right: 1px solid var(--separator);
    }

    #sidebar.open {
      transform: translateX(0);
    }

    .sidebarGroup {
      margin-bottom: 6px;
    }

    .sidebarGroupTitle {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: var(--label-secondary);
      padding: 20px 20px 6px;
      cursor: default;
    }

    /* make collapsible title clickable */
    .sidebarGroupTitle[onclick] {
      cursor: pointer;
    }

    .sidebarGroupContent {
      max-height: 500px;
      transition: max-height .35s cubic-bezier(.32, .72, 0, 1), opacity .3s;
      overflow: hidden;
      opacity: 1;
    }

    .sidebarGroupContent.collapsed {
      max-height: 0;
      opacity: 0;
      pointer-events: none;
    }

    #sidebar .stageBtn {
      display: flex;
      align-items: center;
      width: calc(100% - 16px);
      text-align: left;
      background: none;
      border: none;
      padding: 11px 20px;
      font-size: 15px;
      font-family: inherit;
      color: var(--label-primary);
      cursor: pointer;
      border-radius: 10px;
      margin: 1px 8px;
      transition: all .2s;
    }

    #sidebar .stageBtn:hover {
      background: rgba(0, 0, 0, .04);
    }

    #sidebar .stageBtn:active {
      background: rgba(0, 0, 0, .08);
      transform: scale(0.98);
    }

    #sidebar .stageBtn.active {
      background: var(--stage-bg);
      color: var(--label-primary);
      font-weight: 600;
    }

    .status-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 8px;
      flex-shrink: 0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* ── Hamburger / Toggle ── */
    #toggleSidebarBtn {
      position: fixed;
      left: 16px;
      top: 16px;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #34c759, #30b350);
      box-shadow: 0 2px 12px rgba(52, 199, 89, .35);
      border: none;
      border-radius: 10px;
      z-index: 1100;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform .12s, box-shadow .12s;
    }

    #toggleSidebarBtn:active {
      transform: scale(.96);
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .hamburger-line {
      width: 18px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: all .3s cubic-bezier(.32, .72, 0, 1);
      transform-origin: center;
    }

    #toggleSidebarBtn.active .hamburger-line.middle {
      transform: scaleX(0);
      opacity: 0;
    }

    #toggleSidebarBtn.active .hamburger-line.top {
      transform: translateY(6px) rotate(45deg);
    }

    #toggleSidebarBtn.active .hamburger-line.bottom {
      transform: translateY(-6px) rotate(-45deg);
    }

    /* ── Overlay when sidebar is open ── */
    #sidebarOverlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, .18);
      z-index: 999;
      transition: opacity .35s;
    }

    #sidebarOverlay.show {
      display: block;
    }

    /* ── Main Content ── */
    .mainContent {
      max-width: 420px;
      margin: 0 auto;
      padding: 72px 20px 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Layout slots for swap */
    #slotButtons { order: 1; }
    #slotStats   { order: 2; }

    .mainContent.buttons-bottom #slotButtons { order: 2; }
    .mainContent.buttons-bottom #slotStats   { order: 1; }

    /* Always pin these to the bottom regardless of swap state */
    .edit-controls-wrapper { order: 10; }
    .creditFooter          { order: 11; }

    /* Slot animation readiness */
    .layoutSlot {
      will-change: transform;
    }

    /* Credit footer styles */
    .creditFooter {
      text-align: center;
      padding-bottom: 16px;
      font-size: 12px;
      font-weight: 500;
      color: var(--label-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    /* ── Stage Title ── */
    #stageTitle {
      font-size: 22px;
      font-family: 'Reggae One', sans-serif;
      text-align: center;
      letter-spacing: -.02em;
    }

    /* ── Button Group ── */
    .buttonGroup {
      text-align: center;
    }

    .mainButtons {
      display: flex;
      gap: 12px;
    }

    .mainButton {
      flex: 1;
      font-size: 22px;
      font-weight: 700;
      font-family: inherit;
      padding: 18px 0;
      border: none;
      border-radius: var(--radius);
      cursor: pointer;
      transition: transform .12s, box-shadow .12s;
      color: #fff;
      letter-spacing: -.01em;
    }

    .mainButton:first-child {
      background: linear-gradient(135deg, #34c759, #30b350);
      box-shadow: 0 2px 12px rgba(52, 199, 89, .35);
    }

    .mainButton:last-child {
      background: linear-gradient(135deg, #ff6b6b, #ff3b30);
      box-shadow: 0 2px 12px rgba(255, 59, 48, .30);
    }

    .mainButton:active {
      transform: scale(.96);
    }

    .subButton {
      font-size: 13px;
      font-family: inherit;
      font-style: normal;
      background: none;
      border: none;
      color: var(--tint);
      cursor: pointer;
      padding: 6px 12px;
      font-weight: 500;
      transition: opacity .15s;
    }

    .subButton:hover {
      opacity: .7;
    }

    /* ── Stats Card ── */
    .panel {
      background: var(--card);
      border-radius: var(--radius);
      box-shadow: var(--card-shadow);
      overflow: hidden;
    }

    .stats, .stats tbody {
      display: block;
      width: 100%;
    }

    .stats tr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .stats tr:not(:last-child) {
      border-bottom: 1px solid var(--separator);
    }

    .stats td {
      padding: 13px 18px;
    }

    .label {
      font-size: 15px;
      color: var(--label-secondary);
      text-align: left;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .stat {
      font-size: 20px;
      font-weight: 600;
      text-align: right;
      font-variant-numeric: tabular-nums;
      color: var(--label-primary);
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .percent::after {
      content: "%";
      margin-left: 1px;
      font-size: .75em;
      color: var(--label-secondary);
    }

    .stat-icon {
      display: inline-block;
      vertical-align: -3px;
      margin-right: 6px;
      opacity: 0.7;
    }

    /* ── Edit Modes ── */
    .stat {
      position: relative;
    }

    .stat-val {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
    .panel.is-editing .stat-val {
      opacity: 0;
      pointer-events: none;
    }

    .edit-input {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      width: 60px;
      max-width: calc(100% - 18px);
      padding: 4px 6px;
      opacity: 0;
      pointer-events: none;
      text-align: right;
      font-size: 16px;
      font-family: inherit;
      border: 1px solid var(--separator);
      border-radius: 6px;
      background: var(--bg);
      color: var(--label-primary);
      outline: none;
      transition: opacity 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      appearance: textfield;
      -moz-appearance: textfield;
    }
    .panel.is-editing .edit-input {
      opacity: 1;
      pointer-events: auto;
    }

    .edit-input-group {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      max-width: calc(100% - 18px);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .panel.is-editing .edit-input-group {
      opacity: 1;
      pointer-events: auto;
    }
    .edit-input-group .edit-input {
      position: static;
      transform: none;
      min-width: 0;
    }
    
    .edit-input-micro {
      width: 32px !important;
      padding: 2px !important;
      font-size: 14px !important;
      text-align: center;
    }

    .edit-input:focus {
      border-color: var(--tint);
      box-shadow: 0 0 0 3px rgba(0, 122, 255, .15);
    }

    /* Allow selection inside inputs */
    input {
      -webkit-user-select: auto;
      user-select: auto;
    }

    .edit-controls-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      align-items: start;
      order: 10;
    }

    #btnOpenEdit {
      grid-row: 1;
      grid-column: 1;
      justify-self: center;
      margin: 0;
      opacity: 1;
      color: var(--green);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    #mainContent.is-editing .edit-controls-wrapper #btnOpenEdit {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-5px);
    }

    .editActions {
      grid-row: 1;
      grid-column: 1;
      width: 100%;
      display: flex;
      gap: 12px;
      margin: 0;
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      pointer-events: none;
      transition: max-height 0.3s ease, opacity 0.3s ease;
    }
    #mainContent.is-editing .edit-controls-wrapper .editActions {
      max-height: 60px;
      opacity: 1;
      pointer-events: auto;
    }

    .editActions .subButton {
      flex: 1;
      padding: 11px 0;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
    }

    .editActions .subButton:first-child {
      background: var(--tint);
      color: #fff;
    }

    .editActions .subButton:last-child {
      background: rgba(0, 0, 0, 0.08);
      color: var(--label-secondary);
    }

    /* ── Flash Animations ── */
    @keyframes flash {
      0% {
        background-color: var(--bg)
      }

      50% {
        background-color: rgba(52, 199, 89, .18)
      }

      100% {
        background-color: var(--bg)
      }
    }

    @keyframes flashRed {
      0% {
        background-color: var(--bg)
      }

      50% {
        background-color: rgba(255, 59, 48, .15)
      }

      100% {
        background-color: var(--bg)
      }
    }

    .flash {
      animation: flash .25s ease
    }

    .flashRed {
      animation: flashRed .25s ease
    }

    /* ── Dark Mode Overrides ── */
    html.dark {
      --bg: #1c1c1e;
      --card: #2c2c2e;
      --separator: rgba(255, 255, 255, .12);
      --label-primary: rgba(255, 255, 255, .85);
      --label-secondary: rgba(235, 235, 245, .6);
      --card-shadow: 0 1px 3px rgba(0, 0, 0, .24), 0 1px 2px rgba(0, 0, 0, .16);
      --sys-red: #ff453a;
      --sys-purple: #bf5af2;
      --sys-green: #30d158;
      --sys-yellow: #ffd60a;
      --sys-blue: #0a84ff;
      --sys-gray: #98989d;
      --bg-red: rgba(255, 69, 58, 0.15);
      --bg-purple: rgba(191, 90, 242, 0.15);
      --bg-green: rgba(48, 209, 88, 0.15);
      --bg-yellow: rgba(255, 214, 10, 0.15);
      --bg-blue: rgba(10, 132, 255, 0.15);
      --bg-gray: rgba(152, 152, 157, 0.15);
    }

    html.dark #sidebar {
      background: rgba(44, 44, 46, .88);
    }

    html.dark #sidebarOverlay {
      background: rgba(0, 0, 0, .45);
    }

    html.dark #sidebar .stageBtn:hover {
      background: rgba(255, 255, 255, .06);
    }

    html.dark #sidebar .stageBtn:active {
      background: rgba(255, 255, 255, .1);
    }

    html.dark .edit-input {
      border-color: rgba(255, 255, 255, .15);
    }
    
    html.dark .editActions .subButton:last-child {
      background: rgba(255, 255, 255, 0.1);
    }

    /* ── Danger (destructive action) ── */
    .danger {
      color: var(--red) !important;
    }


    /* ── Button Position Toggle Row ── */
    .toggleRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 20px;
      border-top: 1px solid var(--separator);
    }

    .toggleRowLabel {
      font-size: 15px;
      color: var(--label-primary);
    }

    /* Apple-style rounded toggle */
    .appleToggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .appleToggle input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .appleToggleTrack {
      display: block;
      width: 51px;
      height: 31px;
      border-radius: 15.5px;
      background: #e5e5ea;
      position: relative;
      transition: background 0.25s ease;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
    }

    html.dark .appleToggleTrack {
      background: #3a3a3c;
    }

    .appleToggle input:checked + .appleToggleTrack {
      background-color: #34c759;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath d='M 45.96875 10.5 C 30.986175 10.5 18.248089 19.702473 13.03125 32.78125 L 35.71875 100.6875 L 74.375 108.90625 L 126.875 74.46875 L 122.6875 33.78125 L 93.125 10.5 L 45.96875 10.5 z M 102.40625 10.5 L 124.78125 29.09375 L 142.59375 10.5 L 102.40625 10.5 z M 148.3125 10.5 L 126.59375 33.125 L 131.375 75.3125 L 169.8125 93.65625 L 193.5 72.375 L 226.3125 14.4375 C 221.44201 11.926065 215.91027 10.5 210.03125 10.5 L 148.3125 10.5 z M 230.5625 17.03125 L 200.4375 71 L 245.5 83.78125 L 245.5 46 C 245.5 34.007022 239.61367 23.452627 230.5625 17.03125 z M 10.71875 42.09375 C 10.578669 43.380954 10.5 44.674375 10.5 46 L 10.5 108.5 L 30.6875 100.90625 L 10.71875 42.09375 z M 197.15625 75.28125 L 172.15625 97.25 L 174.28125 157.96875 L 208.5625 174.5625 L 245.5 165.34375 L 245.5 89.09375 L 197.15625 75.28125 z M 129.28125 78.84375 L 78.59375 112.25 L 89.28125 155.125 L 127.15625 186 L 169.28125 156.875 L 166.40625 96.875 L 129.28125 78.84375 z M 33.34375 104 L 10.5 112.375 L 10.5 168.3125 L 51.375 172 L 83.28125 154.75 L 74.03125 113.84375 L 33.34375 104 z M 86.34375 158.0625 L 52.4375 176.65625 L 24.34375 238.15625 C 30.322515 242.75627 37.806833 245.5 45.96875 245.5 L 92.25 245.5 L 126.0625 224.65625 L 124.75 191.03125 L 86.34375 158.0625 z M 170.96875 163.96875 L 129.8125 191.03125 L 131.03125 225.9375 L 144.8125 245.5 L 210.03125 245.5 C 214.56941 245.5 218.89434 244.63391 222.875 243.09375 L 206.59375 179.375 L 170.96875 163.96875 z M 245.5 169.6875 L 210.53125 178.9375 L 226.625 241.40625 C 237.87265 235.4648 245.5 223.65619 245.5 210 L 245.5 169.6875 z M 10.5 172.8125 L 10.5 210 C 10.5 219.14459 13.92536 227.46797 19.5625 233.75 L 47.25 176.875 L 10.5 172.8125 z M 127.15625 228.625 L 100.5625 245.5 L 138.84375 245.5 L 127.15625 228.625 z' fill='rgba(0,0,0,0.15)'/%3E%3C/svg%3E");
      background-size: cover;
      background-position: center;
    }

    html.dark .appleToggle input:checked + .appleToggleTrack {
      background-color: #30d158;
    }

    .appleToggleThumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 27px;
      height: 27px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.12);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;
    }

    .appleToggle input:checked + .appleToggleTrack .appleToggleThumb {
      transform: translateX(20px);
    }



    /* ── Theme Transition ── */
    html,
    .panel,
    #toggleSidebarBtn,
    .editGrid input {
      transition: background-color .3s, color .3s, border-color .3s, box-shadow .3s;
    }
