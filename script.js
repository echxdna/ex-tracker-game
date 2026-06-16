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

const KINKI_STAGES = [4, 5, 6, 7, 8, 9];
const EX_SELECTOR_STAGES = [0, 1, 2, 10];
function makeDefault() {
  return { normalClears: 0, extraAppearances: 0, extraRewards: 0, currentStreak: 0, maxStreak: 0, minStreak: null, exDefeats: 0, shihou: 0, lakiriza: 0, drop1: 0, drop2: 0, drop3: 0, drop4: 0, drop5: 0 };
}
let allData = JSON.parse(localStorage.getItem("stageTrackerAll")) || Array.from({ length: STAGE_COUNT }, makeDefault);

while (allData.length < STAGE_COUNT) allData.push(makeDefault());
// migrate old data missing new fields
allData.forEach(d => { if (d.exDefeats === undefined) d.exDefeats = 0; if (d.shihou === undefined) d.shihou = 0; if (d.lakiriza === undefined) d.lakiriza = 0; if (d.minStreak === undefined) d.minStreak = null; if (d.drop1 === undefined) { d.drop1 = 0; d.drop2 = 0; d.drop3 = 0; d.drop4 = 0; d.drop5 = 0; } });

function saveAll() {
  localStorage.setItem("stageTrackerAll", JSON.stringify(allData));
  localStorage.setItem("stageIndex", stageIndex);
}

function getData() {
  return allData[stageIndex];
}

function setData(d) {
  allData[stageIndex] = d;
  saveAll();
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

function save() {
  setData(getData());
  update();
}

function normal() {
  if (document.getElementById("statsPanel").classList.contains("is-editing")) {
    alert("先に編集を完了させてください。");
    return;
  }
  let data = getData();
  data.normalClears++;
  data.currentStreak++;
  if (data.currentStreak > data.maxStreak) {
    data.maxStreak = data.currentStreak;
  }
  save();
  flashScreen("flash");
}

function extra() {
  if (document.getElementById("statsPanel").classList.contains("is-editing")) {
    alert("先に編集を完了させてください。");
    return;
  }
  let data = getData();
  if (data.extraAppearances >= data.normalClears) {
    alert("EX出現数は総周回数を超えません。");
    return;
  }
  if (data.currentStreak === 0) {
    alert("先に現在周回数を追加してください。");
    return;
  }
  const isKinki = KINKI_STAGES.includes(stageIndex);
  const useSelector = EX_SELECTOR_STAGES.includes(stageIndex);
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
    save();
    setTimeout(() => flashScreen("flashRed"), 50);
  });
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
          <button class="ex-seg" data-val="defeat" style="flex:1;padding:12px 0;border-radius:10px;font-size:14px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;transition:all .15s;">敗北</button>
          <button class="ex-seg" data-val="1" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">1</button>
          <button class="ex-seg" data-val="2" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">2</button>
          <button class="ex-seg" data-val="3" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">3</button>
          <button class="ex-seg" data-val="4" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">4</button>
          <button class="ex-seg" data-val="5" style="flex:1;padding:12px 0;border-radius:10px;font-size:17px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-primary);cursor:pointer;font-family:inherit;transition:all .15s;">5</button>
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

  // Freeze body scroll
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
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
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
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
          <button id="exKinkiDefeatBtn" style="padding:10px 14px;border-radius:10px;font-size:14px;font-weight:600;border:2px solid var(--separator);background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;">敗北</button>
          <input id="exRewardInput" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="flex:1;min-width:0;padding:10px 12px;font-size:18px;font-family:inherit;border:1px solid var(--separator);border-radius:10px;background:var(--bg);color:var(--label-primary);outline:none;text-align:center;transition:opacity .15s;">
        </div>
        ${checksHTML}
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button id="exDialogOk" style="flex:1;padding:11px 0;border-radius:10px;font-size:15px;font-weight:600;border:none;background:var(--tint);color:#fff;cursor:pointer;font-family:inherit;">保存</button>
          <button id="exDialogCancel" style="flex:1;padding:11px 0;border-radius:10px;font-size:15px;font-weight:600;border:none;background:var(--bg);color:var(--label-secondary);cursor:pointer;font-family:inherit;">キャンセル</button>
        </div>`;

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Freeze body scroll (iOS-safe: position:fixed preserves layout, saves scroll offset)
  const scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  // Also block touchmove on the overlay itself (belt-and-suspenders for iOS)
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
    // Restore body scroll state
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
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
  let data = getData();
  const isKinki = KINKI_STAGES.includes(stageIndex);
  document.getElementById("normalTotal").textContent = data.normalClears;
  document.getElementById("exAppearDefeats").textContent = `${data.extraAppearances} / ${data.exDefeats}`;
  document.getElementById("rewardTotal").textContent = data.extraRewards;
  document.getElementById("dropTotal").textContent = `${data.drop1} / ${data.drop2} / ${data.drop3} / ${data.drop4} / ${data.drop5}`;
  document.getElementById("shihouLakirizaTotal").textContent = `${data.shihou} / ${data.lakiriza}`;
  document.getElementById("current").textContent = data.currentStreak;
  document.getElementById("minMaxStreak").textContent =
    `${data.minStreak !== null ? data.minStreak : '—'} / ${data.maxStreak}`;
  // show/hide kinki-only row and drop row
  document.getElementById("rowShihouLakiriza").style.display = isKinki ? '' : 'none';
  const useSelector = EX_SELECTOR_STAGES.includes(stageIndex);
  document.getElementById("rowDrops").style.display = useSelector ? '' : 'none';
  let rate = 0;
  if (data.normalClears > 0) {
    rate = (data.extraAppearances / data.normalClears * 100).toFixed(2);
  }
  document.getElementById("rate").textContent = rate;
  let conf = STAGE_CONFIG[stageIndex];
  document.getElementById("stageTitle").innerHTML = `<span class="status-dot" style="background: ${conf.color}"></span>${conf.name}`;
  for (let i = 0; i < STAGE_COUNT; i++) {
    let btn = document.getElementById(`stageBtn${i}`);
    if (btn) btn.classList.toggle("active", i === stageIndex);
  }
}

function openEdit() {
  const panel = document.getElementById("statsPanel");
  if (panel.classList.contains("is-editing")) {
    cancelEdit();
    return;
  }
  let data = getData();
  const isKinki = KINKI_STAGES.includes(stageIndex);
  panel.classList.add("is-editing");
  document.getElementById("mainContent").classList.add("is-editing");

  document.getElementById('editNormal').value = data.normalClears;
  document.getElementById('editExtra').value = data.extraAppearances;
  document.getElementById('editReward').value = data.extraRewards;
  document.getElementById('editCurrent').value = data.currentStreak;
  document.getElementById('editMax').value = data.maxStreak;
  document.getElementById('editMin').value = data.minStreak !== null ? data.minStreak : '';
  document.getElementById('editDefeat').value = data.exDefeats;

  const useSelector = EX_SELECTOR_STAGES.includes(stageIndex);
  if (useSelector) {
    document.getElementById('editDrop1').value = data.drop1;
    document.getElementById('editDrop2').value = data.drop2;
    document.getElementById('editDrop3').value = data.drop3;
    document.getElementById('editDrop4').value = data.drop4;
    document.getElementById('editDrop5').value = data.drop5;
  }

  if (isKinki) {
    document.getElementById('editShihou').value = data.shihou;
    document.getElementById('editLakiriza').value = data.lakiriza;
  }
}

function cancelEdit() {
  document.getElementById("statsPanel").classList.remove("is-editing");
  document.getElementById("mainContent").classList.remove("is-editing");
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
  const isKinki = KINKI_STAGES.includes(stageIndex);
  const useSelector = EX_SELECTOR_STAGES.includes(stageIndex);
  let newData = {
    normalClears: parseInt(document.getElementById('editNormal').value, 10) || 0,
    extraAppearances: parseInt(document.getElementById('editExtra').value, 10) || 0,
    extraRewards: parseInt(document.getElementById('editReward').value, 10) || 0,
    currentStreak: parseInt(document.getElementById('editCurrent').value, 10) || 0,
    maxStreak: parseInt(document.getElementById('editMax').value, 10) || 0,
    minStreak: (() => { const v = document.getElementById('editMin').value.trim(); const n = parseInt(v, 10); return v === '' ? null : (Number.isFinite(n) && n >= 1 ? n : null); })(),
    exDefeats: parseInt(document.getElementById('editDefeat').value, 10) || 0,
    shihou: isKinki ? (parseInt(document.getElementById('editShihou').value, 10) || 0) : (getData().shihou || 0),
    lakiriza: isKinki ? (parseInt(document.getElementById('editLakiriza').value, 10) || 0) : (getData().lakiriza || 0),
    drop1: useSelector ? (parseInt(document.getElementById('editDrop1').value, 10) || 0) : (getData().drop1 || 0),
    drop2: useSelector ? (parseInt(document.getElementById('editDrop2').value, 10) || 0) : (getData().drop2 || 0),
    drop3: useSelector ? (parseInt(document.getElementById('editDrop3').value, 10) || 0) : (getData().drop3 || 0),
    drop4: useSelector ? (parseInt(document.getElementById('editDrop4').value, 10) || 0) : (getData().drop4 || 0),
    drop5: useSelector ? (parseInt(document.getElementById('editDrop5').value, 10) || 0) : (getData().drop5 || 0)
  }
  let error = validate(newData);
  if (error) {
    alert(error);
    return;
  }
  setData(newData);
  cancelEdit();
  update();
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const btn = document.getElementById("toggleSidebarBtn");
  const overlay = document.getElementById("sidebarOverlay");
  sidebar.classList.toggle("open");
  btn.classList.toggle("active");
  overlay.classList.toggle("show");
  const isOpen = sidebar.classList.contains("open");
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
  document.getElementById('switch').checked = isDark;
}

function toggleButtonPos() {
  const mainContent = document.getElementById('mainContent');
  const slotButtons = document.getElementById('slotButtons');
  const slotStats = document.getElementById('slotStats');

  // ── FLIP: First ── record current positions
  const btnFirst = slotButtons.getBoundingClientRect();
  const statsFirst = slotStats.getBoundingClientRect();

  // Toggle class (changes flex order)
  const isBottom = mainContent.classList.toggle('buttons-bottom');
  localStorage.setItem('buttonsBottom', isBottom);
  document.getElementById('switchButtonPos').checked = isBottom;

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
  // Sync dark mode toggle
  const isDark = document.documentElement.classList.contains('dark');
  document.getElementById('switch').checked = isDark;

  // Sync button position toggle
  const isBottom = localStorage.getItem('buttonsBottom') === 'true';
  if (isBottom) document.getElementById('mainContent').classList.add('buttons-bottom');
  document.getElementById('switchButtonPos').checked = isBottom;

  for (let i = 0; i < STAGE_COUNT; i++) {
    let btn = document.getElementById(`stageBtn${i}`);
    if (btn) {
      let conf = STAGE_CONFIG[i];
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
