const STAGE_COUNT = 11;
const STAGE_CONFIG = [
  { name: "アーキレット", color: "var(--sys-red)", bg: "var(--bg-red)" },
  { name: "コルティーナ", color: "var(--sys-purple)", bg: "var(--bg-purple)" },
  { name: "アムネディア", color: "var(--sys-green)", bg: "var(--bg-green)" },
  { name: "自由枠", color: "var(--sys-gray)", bg: "var(--bg-gray)" },
  { name: "刹那", color: "var(--sys-yellow)", bg: "var(--bg-yellow)" },
  { name: "那由多", color: "var(--sys-purple)", bg: "var(--bg-purple)" },
  { name: "阿頼耶", color: "var(--sys-blue)", bg: "var(--bg-blue)" },
  { name: "無量大数", color: "var(--sys-red)", bg: "var(--bg-red)" },
  { name: "涅槃寂静", color: "var(--sys-green)", bg: "var(--bg-green)" },
  { name: "不可思議", color: "var(--sys-yellow)", bg: "var(--bg-yellow)" },
  { name: "インゼムニア", color: "var(--sys-yellow)", bg: "var(--bg-yellow)" }
];
let stageIndex = Number(localStorage.getItem("stageIndex")) || 0;

// O(1) lookups instead of Array.includes (O(n))
const KINKI_STAGES = new Set([4, 5, 6, 7, 8, 9]);
const EX_SELECTOR_STAGES = new Set([0, 1, 2, 10]);

function makeDefault() {
  return { normalClears: 0, extraAppearances: 0, extraRewards: 0, currentStreak: 0, maxStreak: 0, minStreak: null, exDefeats: 0, shihou: 0, lakiriza: 0, drop1: 0, drop2: 0, drop3: 0, drop4: 0, drop5: 0 };
}

// Init allData — single path guarantees correct length
let allData = JSON.parse(localStorage.getItem("stageTrackerAll")) || [];
while (allData.length < STAGE_COUNT) allData.push(makeDefault());
// migrate old data missing new fields
allData.forEach(d => { if (d.exDefeats === undefined) d.exDefeats = 0; if (d.shihou === undefined) d.shihou = 0; if (d.lakiriza === undefined) d.lakiriza = 0; if (d.minStreak === undefined) d.minStreak = null; if (d.drop1 === undefined) { d.drop1 = 0; d.drop2 = 0; d.drop3 = 0; d.drop4 = 0; d.drop5 = 0; } });

// ── Cached DOM references (populated in DOMContentLoaded) ──
const DOM = {};

function saveAll() {
  localStorage.setItem("stageTrackerAll", JSON.stringify(allData));
  localStorage.setItem("stageIndex", stageIndex);
}

function getData() {
  return allData[stageIndex];
}

function flashScreen(color = "flash") {
  const el = document.body;
  el.classList.remove("flash", "flashRed");
  void el.offsetWidth; // Force reflow to restart animation
  el.classList.add(color);
  el.addEventListener("animationend", function cleanup() {
    el.classList.remove(color);
    el.removeEventListener("animationend", cleanup);
  });
}

function normal() {
  if (DOM.statsPanel.classList.contains("is-editing")) {
    alert("先に編集を完了させてください。");
    return;
  }
  const data = getData();
  data.normalClears++;
  data.currentStreak++;
  if (data.currentStreak > data.maxStreak) {
    data.maxStreak = data.currentStreak;
  }
  saveAll();
  update();
  flashScreen("flash");
}

function extra() {
  if (DOM.statsPanel.classList.contains("is-editing")) {
    alert("先に編集を完了させてください。");
    return;
  }
  const data = getData();
  if (data.extraAppearances >= data.normalClears) {
    alert("EX出現数は総周回数を超えません。");
    return;
  }
  if (data.currentStreak === 0) {
    alert("先に現在周回数を追加してください。");
    return;
  }
  const isKinki = KINKI_STAGES.has(stageIndex);
  const useSelector = EX_SELECTOR_STAGES.has(stageIndex);
  const dialogFn = useSelector ? showExSelectorDialog : showExDialog;
  dialogFn(isKinki, function (result) {
    if (!result) return;
    data.extraAppearances++;
    data.extraRewards += result.reward;
    if (result.reward === 0) data.exDefeats++;
    if (result.baseDrop === 1) data.drop1++;
    if (result.baseDrop === 2) data.drop2++;
    if (result.baseDrop === 3) data.drop3++;
    if (result.baseDrop === 4) data.drop4++;
    if (result.baseDrop === 5) data.drop5++;
    if (result.shihou) data.shihou++;
    if (result.lakiriza) data.lakiriza++;
    if (data.currentStreak > data.maxStreak) data.maxStreak = data.currentStreak;
    if (data.minStreak === null || data.currentStreak < data.minStreak) data.minStreak = data.currentStreak;
    data.currentStreak = 0;
    saveAll();
    update();
    setTimeout(() => flashScreen("flashRed"), 50);
  });
}

// ── Shared dialog scroll-freeze helpers ──
function freezeBodyScroll() {
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  return scrollY;
}

function restoreBodyScroll(scrollY) {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, scrollY);
}

/* ── EX Selector Dialog (stages 0,1,2,10) ── */
function showExSelectorDialog(showChecks, callback) {
  let old = document.getElementById('exDialog');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'exDialog';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:2000;display:flex;align-items:center;justify-content:center;';

  const card = document.createElement('div');
  card.style.cssText = 'background:var(--card);border-radius:var(--radius);padding:24px 22px 20px;width:min(340px,90vw);box-shadow:0 8px 32px rgba(0,0,0,.18);';

  card.innerHTML = `
        <div style="font-size:17px;font-weight:600;text-align:center;margin-bottom:18px;">ドロップ数を入力</div>
        <div id="exSelectorRow" style="display:flex;gap:6px;">
          <button class="ex-seg" data-val="1" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">1</button>
          <button class="ex-seg" data-val="2" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">2</button>
          <button class="ex-seg" data-val="3" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">3</button>
          <button class="ex-seg" data-val="4" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">4</button>
          <button class="ex-seg" data-val="5" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">5</button>
          <button class="ex-seg" data-val="defeat" style="flex:1;padding:12px 0;border-radius:10px;font-size:14px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;transition:all .15s;">敗北</button>
        </div>
        <div id="exBossDropRow" style="display:flex;align-items:center;gap:8px;margin:14px 0 4px;opacity:0.4;pointer-events:none;transition:opacity .2s;">
          <input type="checkbox" id="exChkBossDrop" style="width:20px;height:20px;accent-color:var(--tint);cursor:pointer;flex-shrink:0;">
          <label for="exChkBossDrop" style="font-size:15px;color:var(--label-primary);cursor:pointer;">ボスドロップアップ(+3)</label>
        </div>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button id="exDialogOk" style="flex:1;padding:11px 0;border-radius:10px;font-size:15px;font-weight:600;border:none;background:var(--tint);color:#fff;cursor:pointer;font-family:inherit;opacity:0.4;pointer-events:none;transition:opacity .15s;">保存</button>
          <button id="exDialogCancel" style="flex:1;padding:11px 0;border-radius:10px;font-size:15px;font-weight:600;border:none;background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;">キャンセル</button>
        </div>`;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const scrollY = freezeBodyScroll();
  overlay.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  let selectedVal = null; // 'defeat' | 1 | 2 | 3 | 4 | 5

  const segs = card.querySelectorAll('.ex-seg');
  const bossDropRow = document.getElementById('exBossDropRow');
  const bossDropChk = document.getElementById('exChkBossDrop');
  const okBtn = document.getElementById('exDialogOk');

  segs.forEach(btn => {
    btn.addEventListener('click', () => {
      const clickedVal = btn.dataset.val;
      const clickedIsDefeat = clickedVal === 'defeat';
      // Deselect all
      segs.forEach(b => {
        b.style.background = 'var(--bg)';
        b.style.borderColor = 'var(--separator)';
        b.style.color = b.dataset.val === 'defeat' ? 'var(--label-secondary)' : 'var(--label-primary)';
      });
      // Select clicked — red for 敗北, tint for numbers
      const selColor = clickedIsDefeat ? 'var(--red)' : 'var(--tint)';
      btn.style.background = selColor;
      btn.style.borderColor = selColor;
      btn.style.color = '#fff';
      selectedVal = clickedVal;

      // Boss drop availability
      bossDropRow.style.opacity = clickedIsDefeat ? '0.4' : '1';
      bossDropRow.style.pointerEvents = clickedIsDefeat ? 'none' : 'auto';
      if (clickedIsDefeat) bossDropChk.checked = false;

      // Enable OK button
      okBtn.style.opacity = '1';
      okBtn.style.pointerEvents = 'auto';
    });
  });

  function close(result) {
    overlay.remove();
    restoreBodyScroll(scrollY);
    callback(result);
  }

  document.getElementById('exDialogCancel').onclick = () => close(null);

  okBtn.onclick = () => {
    if (selectedVal === null) return;
    const isDefeat = selectedVal === 'defeat';
    const baseReward = isDefeat ? 0 : parseInt(selectedVal, 10);
    const bossBonus = (!isDefeat && bossDropChk.checked) ? 3 : 0;
    close({ reward: baseReward + bossBonus, baseDrop: baseReward, shihou: false, lakiriza: false });
  };
}

/* ── EX Dialog (free input, kinki stages) ── */
function showExDialog(showChecks, callback) {
  // Remove existing dialog if any
  let old = document.getElementById('exDialog');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'exDialog';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:2000;display:flex;align-items:center;justify-content:center;';

  const card = document.createElement('div');
  card.style.cssText = 'background:var(--card);border-radius:var(--radius);padding:24px 22px 20px;width:min(320px,85vw);box-shadow:0 8px 32px rgba(0,0,0,.18);';

  let checksHTML = '';
  if (showChecks) {
    checksHTML = `
          <div id="exChecksRow" style="display:flex;gap:16px;margin:14px 0 4px;transition:opacity .2s;">
            <label style="display:flex;align-items:center;gap:6px;font-size:15px;color:var(--label-primary);cursor:pointer;">
              <input type="checkbox" id="exChkShihou" style="width:20px;height:20px;accent-color:var(--tint);cursor:pointer;"> 至宝
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:15px;color:var(--label-primary);cursor:pointer;">
              <input type="checkbox" id="exChkLakiriza" style="width:20px;height:20px;accent-color:var(--tint);cursor:pointer;"> ラキリザ
            </label>
          </div>`;
  }

  card.innerHTML = `
        <div style="font-size:17px;font-weight:600;text-align:center;margin-bottom:16px;">ドロップ数を入力</div>
        <div style="display:flex;gap:8px;align-items:stretch;">
          <input id="exRewardInput" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="flex:1;min-width:0;padding:10px 12px;font-size:18px;font-family:inherit;border:1px solid var(--separator);border-radius:10px;background:var(--bg);color:var(--label-primary);outline:none;text-align:center;transition:opacity .15s;">
          <button id="exKinkiDefeatBtn" style="padding:10px 14px;border-radius:10px;font-size:14px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;">敗北</button>
        </div>
        ${checksHTML}
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button id="exDialogOk" style="flex:1;padding:11px 0;border-radius:10px;font-size:15px;font-weight:600;border:none;background:var(--tint);color:#fff;cursor:pointer;font-family:inherit;">保存</button>
          <button id="exDialogCancel" style="flex:1;padding:11px 0;border-radius:10px;font-size:15px;font-weight:600;border:none;background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;">キャンセル</button>
        </div>`;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const scrollY = freezeBodyScroll();
  overlay.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  const inp = document.getElementById('exRewardInput');
  const defeatBtn = document.getElementById('exKinkiDefeatBtn');
  const checksRow = showChecks ? document.getElementById('exChecksRow') : null;
  let kinkiDefeatSelected = false;

  function setDefeatMode(on) {
    kinkiDefeatSelected = on;
    if (on) {
      defeatBtn.style.background = 'var(--red)';
      defeatBtn.style.borderColor = 'var(--red)';
      defeatBtn.style.color = '#fff';
      inp.style.opacity = '0.35';
      inp.style.pointerEvents = 'none';
      inp.value = '';
      if (checksRow) {
        checksRow.style.opacity = '0.35';
        checksRow.style.pointerEvents = 'none';
        checksRow.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      }
    } else {
      defeatBtn.style.background = 'var(--bg)';
      defeatBtn.style.borderColor = 'var(--separator)';
      defeatBtn.style.color = 'var(--label-secondary)';
      inp.style.opacity = '';
      inp.style.pointerEvents = '';
      if (checksRow) {
        checksRow.style.opacity = '';
        checksRow.style.pointerEvents = '';
      }
      inp.focus();
    }
  }

  defeatBtn.addEventListener('click', () => setDefeatMode(!kinkiDefeatSelected));

  inp.value = '';
  inp.addEventListener('keydown', e => {
    const nav = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'];
    if (nav.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });
  // Typing in input deactivates defeat mode
  inp.addEventListener('input', () => {
    if (kinkiDefeatSelected) setDefeatMode(false);
  });
  inp.focus();

  // Prevent checkboxes from stealing focus (keyboard collapse on mobile)
  if (showChecks) {
    card.querySelectorAll('label').forEach(label => {
      label.addEventListener('mousedown', e => e.preventDefault());
      label.addEventListener('touchend', e => {
        e.preventDefault();
        if (kinkiDefeatSelected) return;
        const chk = label.querySelector('input[type="checkbox"]');
        if (chk) chk.checked = !chk.checked;
        inp.focus();
      });
    });
  }

  function close(result) {
    overlay.remove();
    restoreBodyScroll(scrollY);
    callback(result);
  }

  document.getElementById('exDialogCancel').onclick = () => close(null);

  document.getElementById('exDialogOk').onclick = () => {
    if (kinkiDefeatSelected) {
      close({ reward: 0, shihou: false, lakiriza: false });
      return;
    }
    const n = parseInt(inp.value, 10);
    if (!Number.isFinite(n) || n < 0) { alert('ドロップ数を入力してください。'); return; }
    const shihou = showChecks && document.getElementById('exChkShihou').checked;
    const lakiriza = showChecks && document.getElementById('exChkLakiriza').checked;
    if ((shihou || lakiriza) && n < 2) { alert('至宝/ラキリザ発動時、ドロップ数は2以上です。'); return; }
    close({ reward: n, shihou, lakiriza });
  };
}

function update() {
  const data = getData();
  const isKinki = KINKI_STAGES.has(stageIndex);
  DOM.normalTotal.textContent = data.normalClears;
  DOM.exAppearDefeats.textContent = `${data.extraAppearances} / ${data.exDefeats}`;
  DOM.rewardTotal.textContent = data.extraRewards;
  DOM.dropTotal.textContent = `${data.drop1} / ${data.drop2} / ${data.drop3} / ${data.drop4} / ${data.drop5}`;
  DOM.shihouLakirizaTotal.textContent = `${data.shihou} / ${data.lakiriza}`;
  DOM.current.textContent = data.currentStreak;
  DOM.minMaxStreak.textContent =
    `${data.minStreak !== null ? data.minStreak : '—'} / ${data.maxStreak}`;
  // show/hide kinki-only row and drop row
  DOM.rowShihouLakiriza.style.display = isKinki ? '' : 'none';
  const useSelector = EX_SELECTOR_STAGES.has(stageIndex);
  DOM.rowDrops.style.display = useSelector ? '' : 'none';
  let rate = 0;
  if (data.normalClears > 0) {
    rate = (data.extraAppearances / data.normalClears * 100).toFixed(2);
  }
  DOM.rate.textContent = rate;
  const conf = STAGE_CONFIG[stageIndex];
  DOM.stageTitle.innerHTML = `<span class="status-dot" style="background: ${conf.color}"></span>${conf.name}`;
  for (let i = 0; i < STAGE_COUNT; i++) {
    const btn = DOM.stageBtns[i];
    if (btn) btn.classList.toggle("active", i === stageIndex);
  }
}

// ── Helper: parse int from a cached DOM input ──
function intVal(el, fallback) {
  const n = parseInt(el.value, 10);
  return Number.isFinite(n) ? n : (fallback !== undefined ? fallback : 0);
}

function openEdit() {
  if (DOM.statsPanel.classList.contains("is-editing")) {
    cancelEdit();
    return;
  }
  const data = getData();
  const isKinki = KINKI_STAGES.has(stageIndex);
  DOM.statsPanel.classList.add("is-editing");
  DOM.mainContent.classList.add("is-editing");

  DOM.editNormal.value = data.normalClears;
  DOM.editExtra.value = data.extraAppearances;
  DOM.editReward.value = data.extraRewards;
  DOM.editCurrent.value = data.currentStreak;
  DOM.editMax.value = data.maxStreak;
  DOM.editMin.value = data.minStreak !== null ? data.minStreak : '';
  DOM.editDefeat.value = data.exDefeats;

  const useSelector = EX_SELECTOR_STAGES.has(stageIndex);
  if (useSelector) {
    DOM.editDrop1.value = data.drop1;
    DOM.editDrop2.value = data.drop2;
    DOM.editDrop3.value = data.drop3;
    DOM.editDrop4.value = data.drop4;
    DOM.editDrop5.value = data.drop5;
  }

  if (isKinki) {
    DOM.editShihou.value = data.shihou;
    DOM.editLakiriza.value = data.lakiriza;
  }
}

function cancelEdit() {
  DOM.statsPanel.classList.remove("is-editing");
  DOM.mainContent.classList.remove("is-editing");
}

function validate(d) {
  if (d.extraAppearances > d.normalClears)
    return "EX出現数が総周回数を超えています。";
  if (d.currentStreak > d.normalClears)
    return "現在周回数が総周回数を超えています。";
  if (d.maxStreak > d.normalClears)
    return "最高ハマり数が総周回数を超えています。";
  if (d.minStreak !== null && d.minStreak < 1)
    return "最低ハマり数は1以上です。";
  if (d.minStreak !== null && d.minStreak > d.maxStreak)
    return "最低ハマり数が最高ハマり数を超えています。";
  if (d.extraRewards < 0)
    return "ラック数は0以上の数字です。";
  if (d.exDefeats > d.extraAppearances)
    return "EX敗北数がEX出現数を超えています。";
  if (d.shihou > d.extraRewards || d.lakiriza > d.extraRewards)
    return "至宝/ラキリザ数はラック数を超えません。";
  return null;
}

function saveEdit() {
  const isKinki = KINKI_STAGES.has(stageIndex);
  const useSelector = EX_SELECTOR_STAGES.has(stageIndex);
  const cur = getData();
  const newData = {
    normalClears: intVal(DOM.editNormal),
    extraAppearances: intVal(DOM.editExtra),
    extraRewards: intVal(DOM.editReward),
    currentStreak: intVal(DOM.editCurrent),
    maxStreak: intVal(DOM.editMax),
    minStreak: (() => { const v = DOM.editMin.value.trim(); const n = parseInt(v, 10); return v === '' ? null : (Number.isFinite(n) && n >= 1 ? n : null); })(),
    exDefeats: intVal(DOM.editDefeat),
    shihou: isKinki ? intVal(DOM.editShihou) : (cur.shihou || 0),
    lakiriza: isKinki ? intVal(DOM.editLakiriza) : (cur.lakiriza || 0),
    drop1: useSelector ? intVal(DOM.editDrop1) : (cur.drop1 || 0),
    drop2: useSelector ? intVal(DOM.editDrop2) : (cur.drop2 || 0),
    drop3: useSelector ? intVal(DOM.editDrop3) : (cur.drop3 || 0),
    drop4: useSelector ? intVal(DOM.editDrop4) : (cur.drop4 || 0),
    drop5: useSelector ? intVal(DOM.editDrop5) : (cur.drop5 || 0)
  };
  const error = validate(newData);
  if (error) {
    alert(error);
    return;
  }
  allData[stageIndex] = newData;
  saveAll();
  cancelEdit();
  update();
}

function toggleSidebar() {
  DOM.sidebar.classList.toggle("open");
  DOM.toggleSidebarBtn.classList.toggle("active");
  DOM.sidebarOverlay.classList.toggle("show");
  const isOpen = DOM.sidebar.classList.contains("open");
  document.body.style.overflow = isOpen ? "hidden" : "";
  if (isOpen) {
    cancelEdit();
  }
}

function selectStage(idx) {
  stageIndex = idx;
  saveAll();
  toggleSidebar();
  update();
}

function toggleGroup(titleElem) {
  const content = titleElem.nextElementSibling;
  content.classList.toggle('collapsed');
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDark);
  DOM.switchDark.checked = isDark;
}

function toggleButtonPos() {
  const slotButtons = DOM.slotButtons;
  const slotStats = DOM.slotStats;

  // ── FLIP: First ── record current positions
  const btnFirst = slotButtons.getBoundingClientRect();
  const statsFirst = slotStats.getBoundingClientRect();

  // Toggle class (changes flex order)
  const isBottom = DOM.mainContent.classList.toggle('buttons-bottom');
  localStorage.setItem('buttonsBottom', isBottom);
  DOM.switchButtonPos.checked = isBottom;

  // ── FLIP: Last ── force layout, record new positions
  const btnLast = slotButtons.getBoundingClientRect();
  const statsLast = slotStats.getBoundingClientRect();

  // ── FLIP: Invert ── snap elements back to old positions instantly
  const btnDelta = btnFirst.top - btnLast.top;
  const statsDelta = statsFirst.top - statsLast.top;

  slotButtons.style.transition = 'none';
  slotStats.style.transition = 'none';
  slotButtons.style.transform = `translateY(${btnDelta}px)`;
  slotStats.style.transform = `translateY(${statsDelta}px)`;

  // Force reflow so the browser registers the "from" state
  slotButtons.getBoundingClientRect();

  // ── FLIP: Play ── animate to natural (no transform) positions
  const easing = 'cubic-bezier(0.34, 1.28, 0.64, 1)';
  const dur = '0.42s';
  slotButtons.style.transition = `transform ${dur} ${easing}`;
  slotStats.style.transition = `transform ${dur} ${easing}`;
  slotButtons.style.transform = '';
  slotStats.style.transform = '';

  // Clean up after animation completes
  const cleanup = () => {
    slotButtons.style.transition = '';
    slotStats.style.transition = '';
    slotButtons.style.transform = '';
    slotStats.style.transform = '';
  };
  slotButtons.addEventListener('transitionend', cleanup, { once: true });
}

window.addEventListener("DOMContentLoaded", () => {
  // ── Cache all DOM references ──
  DOM.statsPanel = document.getElementById('statsPanel');
  DOM.mainContent = document.getElementById('mainContent');
  DOM.stageTitle = document.getElementById('stageTitle');
  DOM.normalTotal = document.getElementById('normalTotal');
  DOM.exAppearDefeats = document.getElementById('exAppearDefeats');
  DOM.rewardTotal = document.getElementById('rewardTotal');
  DOM.dropTotal = document.getElementById('dropTotal');
  DOM.shihouLakirizaTotal = document.getElementById('shihouLakirizaTotal');
  DOM.current = document.getElementById('current');
  DOM.minMaxStreak = document.getElementById('minMaxStreak');
  DOM.rate = document.getElementById('rate');
  DOM.rowShihouLakiriza = document.getElementById('rowShihouLakiriza');
  DOM.rowDrops = document.getElementById('rowDrops');
  DOM.sidebar = document.getElementById('sidebar');
  DOM.toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  DOM.sidebarOverlay = document.getElementById('sidebarOverlay');
  DOM.switchDark = document.getElementById('switch');
  DOM.switchButtonPos = document.getElementById('switchButtonPos');
  DOM.slotButtons = document.getElementById('slotButtons');
  DOM.slotStats = document.getElementById('slotStats');
  // Edit inputs
  DOM.editNormal = document.getElementById('editNormal');
  DOM.editExtra = document.getElementById('editExtra');
  DOM.editReward = document.getElementById('editReward');
  DOM.editCurrent = document.getElementById('editCurrent');
  DOM.editMax = document.getElementById('editMax');
  DOM.editMin = document.getElementById('editMin');
  DOM.editDefeat = document.getElementById('editDefeat');
  DOM.editShihou = document.getElementById('editShihou');
  DOM.editLakiriza = document.getElementById('editLakiriza');
  DOM.editDrop1 = document.getElementById('editDrop1');
  DOM.editDrop2 = document.getElementById('editDrop2');
  DOM.editDrop3 = document.getElementById('editDrop3');
  DOM.editDrop4 = document.getElementById('editDrop4');
  DOM.editDrop5 = document.getElementById('editDrop5');
  // Stage buttons (pre-cache array)
  DOM.stageBtns = [];
  for (let i = 0; i < STAGE_COUNT; i++) {
    DOM.stageBtns[i] = document.getElementById(`stageBtn${i}`);
  }

  // Sync dark mode toggle
  const isDark = document.documentElement.classList.contains('dark');
  DOM.switchDark.checked = isDark;

  // Sync button position toggle
  const isBottom = localStorage.getItem('buttonsBottom') === 'true';
  if (isBottom) DOM.mainContent.classList.add('buttons-bottom');
  DOM.switchButtonPos.checked = isBottom;

  for (let i = 0; i < STAGE_COUNT; i++) {
    const btn = DOM.stageBtns[i];
    if (btn) {
      const conf = STAGE_CONFIG[i];
      btn.innerHTML = `${conf.name}`;
      btn.style.setProperty('--stage-bg', conf.bg);
    }
  }

  for (let i = 0; i < allData.length; i++) {
    if (allData[i].currentStreak > allData[i].maxStreak) {
      allData[i].maxStreak = allData[i].currentStreak;
    }
  }
  saveAll();
  update();
});
