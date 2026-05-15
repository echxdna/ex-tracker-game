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
    function makeDefault() {
      return { normalClears: 0, extraAppearances: 0, extraRewards: 0, currentStreak: 0, maxStreak: 0, exDefeats: 0, shihou: 0, lakiriza: 0 };
    }
    let allData = JSON.parse(localStorage.getItem("stageTrackerAll")) || Array.from({ length: STAGE_COUNT }, makeDefault);

    while (allData.length < STAGE_COUNT) allData.push(makeDefault());
    // migrate old data missing new fields
    allData.forEach(d => { if (d.exDefeats === undefined) d.exDefeats = 0; if (d.shihou === undefined) d.shihou = 0; if (d.lakiriza === undefined) d.lakiriza = 0; });

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
      showExDialog(isKinki, function (result) {
        if (!result) return;
        data.extraAppearances++;
        data.extraRewards += result.reward;
        if (result.reward === 0) data.exDefeats++;
        if (result.shihou) data.shihou++;
        if (result.lakiriza) data.lakiriza++;
        if (data.currentStreak > data.maxStreak) data.maxStreak = data.currentStreak;
        data.currentStreak = 0;
        save();
        setTimeout(() => flashScreen("flashRed"), 50);
      });
    }

    /* ── EX Dialog ── */
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
          <div style="display:flex;gap:16px;margin:14px 0 4px;">
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
        <div style="font-size:13px;color:var(--label-secondary);margin-bottom:8px;">ドロップ数 (※敗北の場合は0)</div>
        <input id="exRewardInput" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" style="display:block;width:100%;padding:10px 12px;font-size:18px;font-family:inherit;border:1px solid var(--separator);border-radius:10px;background:var(--bg);color:var(--label-primary);outline:none;text-align:center;">
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
      inp.value = '';
      inp.addEventListener('keydown', e => {
        const nav = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'];
        if (nav.includes(e.key)) return;
        if (!/^\d$/.test(e.key)) e.preventDefault(); // digits only — no decimals, no letters, no cursor jump
      });
      inp.focus();

      // Prevent checkboxes from stealing focus (keyboard collapse on mobile)
      if (showChecks) {
        card.querySelectorAll('label').forEach(label => {
          // Desktop: preventDefault on mousedown stops focus from leaving the input
          label.addEventListener('mousedown', e => e.preventDefault());
          // Touch: the synthetic click also steals focus, so handle touchend manually
          label.addEventListener('touchend', e => {
            e.preventDefault();
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
      document.getElementById("shihouLakirizaTotal").textContent = `${data.shihou} / ${data.lakiriza}`;
      document.getElementById("current").textContent = data.currentStreak;
      document.getElementById("max").textContent = data.maxStreak;
      // show/hide kinki-only row
      document.getElementById("rowShihouLakiriza").style.display = isKinki ? '' : 'none';
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

      document.getElementById('editNormal').value = data.normalClears;
      document.getElementById('editExtra').value = data.extraAppearances;
      document.getElementById('editReward').value = data.extraRewards;
      document.getElementById('editCurrent').value = data.currentStreak;
      document.getElementById('editMax').value = data.maxStreak;
      document.getElementById('editDefeat').value = data.exDefeats;

      if (isKinki) {
        document.getElementById('editShihou').value = data.shihou;
        document.getElementById('editLakiriza').value = data.lakiriza;
      }
    }

    function cancelEdit() {
      document.getElementById("statsPanel").classList.remove("is-editing");
    }

    function validate(d) {
      if (d.extraAppearances > d.normalClears)
        return "EX出現数が総周回数を超えています。";
      if (d.currentStreak > d.normalClears)
        return "現在周回数が総周回数を超えています。";
      if (d.maxStreak > d.normalClears)
        return "最高ハマり数が総周回数を超えています。";
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
      let newData = {
        normalClears: parseInt(document.getElementById('editNormal').value, 10) || 0,
        extraAppearances: parseInt(document.getElementById('editExtra').value, 10) || 0,
        extraRewards: parseInt(document.getElementById('editReward').value, 10) || 0,
        currentStreak: parseInt(document.getElementById('editCurrent').value, 10) || 0,
        maxStreak: parseInt(document.getElementById('editMax').value, 10) || 0,
        exDefeats: parseInt(document.getElementById('editDefeat').value, 10) || 0,
        shihou: isKinki ? (parseInt(document.getElementById('editShihou').value, 10) || 0) : (getData().shihou || 0),
        lakiriza: isKinki ? (parseInt(document.getElementById('editLakiriza').value, 10) || 0) : (getData().lakiriza || 0)
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

    window.addEventListener("DOMContentLoaded", () => {
      // Sync toggle button state with saved preference
      const isDark = document.documentElement.classList.contains('dark');
      document.getElementById('switch').checked = isDark;

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
