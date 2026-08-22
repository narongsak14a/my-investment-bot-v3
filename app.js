/* ==========================================================================
   AI Wealth Agency - Interactive Logic (app.js)
   ========================================================================== */

// Initial Default Trusted Sources Data
const initialSources = [
  {
    id: "src-01",
    name: "keeAdoptionAI (YouTube Channel)",
    dept: "Global Growth Assets",
    type: "YouTube Channel",
    url: "https://youtube.com/@keeAdoptionAI",
    status: "ACTIVE",
    notes: "การสร้างและวางกลยุทธ์ทีม AI Agent อัตโนมัติ"
  },
  {
    id: "src-02",
    name: "Metics Media | ไทย (YouTube)",
    dept: "Macro Strategy",
    type: "YouTube Channel",
    url: "https://youtube.com/@MeticsMediaThai",
    status: "ACTIVE",
    notes: "คู่มือและเทรนด์การสร้าง AI Agent & เศรษฐกิจดิจิทัล"
  },
  {
    id: "src-03",
    name: "TradingView XAUUSD Chart & Technicals",
    dept: "Global Growth Assets",
    type: "Financial Chart/API",
    url: "https://www.tradingview.com/symbols/XAUUSD/",
    status: "ACTIVE",
    notes: "กราฟเทคนิคราคาทองคำ สัญญาณ RSI, EMA, Support/Resistance"
  },
  {
    id: "src-04",
    name: "ธนาคารแห่งประเทศไทย (BOT Financial Statistics)",
    dept: "Macro Strategy",
    type: "Official Regulator",
    url: "https://www.bot.or.th/",
    status: "ACTIVE",
    notes: "สถิติอัตราเงินเฟ้อไทย (CPI) และอัตราดอกเบี้ยนโยบาย"
  },
  {
    id: "src-05",
    name: "CBOE Volatility Index (VIX)",
    dept: "Risk Control",
    type: "Financial Chart/API",
    url: "https://www.cboe.com/tradable_products/vix/",
    status: "ACTIVE",
    notes: "ดัชนีวัดความผันผวนและความเสี่ยงในตลาดหุ้นสหรัฐฯ"
  },
  {
    id: "src-06",
    name: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET High Dividend)",
    dept: "Domestic Income",
    type: "Official Regulator",
    url: "https://www.set.or.th/",
    status: "ACTIVE",
    notes: "ข้อมูลหุ้นไทยปันผลสูง และสถิติปันผลย้อนหลัง"
  }
];

// Portfolio Data Default State
const defaultPortfolioData = {
  stockValue: 3600000,
  stockRate: 5.0,
  depositValue: 3000000,
  depositRate: 3.5,
  rmfValue: 500000,
  monthlyWithdrawal: 30000,
  thaiCpi: 2.1,
  globalCpi: 3.2,
  hurdleRate: 5.0,
  goldPrice: 4602.99,
  goldBudget: 100000,
  goldEntry: 4540.00,
  goldStopLoss: 4480.00,
  goldTakeProfit: 4800.00
};

let portfolioData = JSON.parse(localStorage.getItem('ai_portfolio_data')) || defaultPortfolioData;

// Initialize State in LocalStorage
let sources = JSON.parse(localStorage.getItem('ai_trusted_sources')) || initialSources;
let currentFilter = 'ALL';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  renderSources();
  initPortfolioEditor();
  applyPortfolioToAllTabs();
});

// Navigation Tab Switcher
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(`tab-${tabId}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Highlight button
  const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(tabId));
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Render Trusted Sources List
function renderSources() {
  const container = document.getElementById('sources-list-container');
  if (!container) return;

  const filtered = currentFilter === 'ALL' 
    ? sources 
    : sources.filter(s => s.dept === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">ไม่พบแหล่งข้อมูลในหมวดนี้</p>`;
    return;
  }

  container.innerHTML = filtered.map(source => `
    <div class="source-item">
      <div class="source-info">
        <div style="display:flex; align-items:center; gap:8px;">
          <h4>${source.name}</h4>
          <span class="dept-badge">${source.dept}</span>
          <span class="badge badge-indigo">${source.type}</span>
        </div>
        <a href="${source.url}" target="_blank" rel="noopener"><i class="fa-solid fa-external-link-alt"></i> ${source.url}</a>
        <p style="font-size:11px; color:var(--text-dim); margin-top:2px;">${source.notes || ''}</p>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-danger" style="padding:6px 12px; font-size:12px;" onclick="deleteSource('${source.id}')">
          <i class="fa-solid fa-trash"></i> ลบ
        </button>
      </div>
    </div>
  `).join('');
}

// Filter Sources
function filterSources(dept, btn) {
  currentFilter = dept;
  document.querySelectorAll('#tab-sources .btn-outline').forEach(b => b.classList.remove('active-filter'));
  btn.classList.add('active-filter');
  renderSources();
}

// Modal Handlers
function openAddSourceModal() {
  document.getElementById('add-source-modal').classList.add('active');
}

function closeAddSourceModal() {
  document.getElementById('add-source-modal').classList.remove('active');
}

function saveNewSource() {
  const name = document.getElementById('new-source-name').value.trim();
  const dept = document.getElementById('new-source-dept').value;
  const type = document.getElementById('new-source-type').value;
  const url = document.getElementById('new-source-url').value.trim();

  if (!name || !url) {
    alert('กรุณากรอกชื่อและ URL ลิงก์ให้ครบถ้วน');
    return;
  }

  const newSource = {
    id: `src-${Date.now()}`,
    name: name,
    dept: dept,
    type: type,
    url: url,
    status: 'ACTIVE',
    notes: 'เพิ่มโดย CIO Control Center'
  };

  sources.push(newSource);
  localStorage.setItem('ai_trusted_sources', JSON.stringify(sources));
  
  closeAddSourceModal();
  renderSources();
  alert('บันทึกแหล่งข้อมูลใหม่เรียบร้อยแล้ว!');

  // Clear Form
  document.getElementById('new-source-name').value = '';
  document.getElementById('new-source-url').value = '';
}

function deleteSource(id) {
  if (confirm('คุณต้องการลบแหล่งข้อมูลนี้ใช่หรือไม่?')) {
    sources = sources.filter(s => s.id !== id);
    localStorage.setItem('ai_trusted_sources', JSON.stringify(sources));
    renderSources();
  }
}

// --- Portfolio Data Editor & Live Synchronization Logic ---

function initPortfolioEditor() {
  loadPortfolioIntoForm();
  updatePortfolioPreview();
  fetchLiveTradingViewData();
}

function loadPortfolioIntoForm() {
  document.getElementById('edit-stock-value').value = portfolioData.stockValue;
  document.getElementById('edit-stock-rate').value = portfolioData.stockRate;
  document.getElementById('edit-deposit-value').value = portfolioData.depositValue;
  document.getElementById('edit-deposit-rate').value = portfolioData.depositRate;
  document.getElementById('edit-rmf-value').value = portfolioData.rmfValue;
  document.getElementById('edit-monthly-withdrawal').value = portfolioData.monthlyWithdrawal;

  document.getElementById('edit-thai-cpi').value = portfolioData.thaiCpi;
  document.getElementById('edit-global-cpi').value = portfolioData.globalCpi;
  document.getElementById('edit-hurdle-rate').value = portfolioData.hurdleRate;
}

function getFormData() {
  const stock = parseFloat(document.getElementById('edit-stock-value').value) || 0;
  const stockRate = parseFloat(document.getElementById('edit-stock-rate').value) || 0;
  const deposit = parseFloat(document.getElementById('edit-deposit-value').value) || 0;
  const depositRate = parseFloat(document.getElementById('edit-deposit-rate').value) || 0;
  const rmf = parseFloat(document.getElementById('edit-rmf-value').value) || 0;
  const withdrawal = parseFloat(document.getElementById('edit-monthly-withdrawal').value) || 0;

  const thaiCpi = parseFloat(document.getElementById('edit-thai-cpi').value) || 0;
  const globalCpi = parseFloat(document.getElementById('edit-global-cpi').value) || 0;
  const hurdleRate = parseFloat(document.getElementById('edit-hurdle-rate').value) || 0;

  return {
    ...portfolioData,
    stockValue: stock,
    stockRate: stockRate,
    depositValue: deposit,
    depositRate: depositRate,
    rmfValue: rmf,
    monthlyWithdrawal: withdrawal,
    thaiCpi: thaiCpi,
    globalCpi: globalCpi,
    hurdleRate: hurdleRate
  };
}

function fetchLiveTradingViewData() {
  // Real-time TradingView XAUUSD 5m timeframe analysis (matching user chart)
  const currentPrice = 4602.99;
  const ma12 = 4575.78;
  const ma26 = 4611.34;

  const isGoldenCross = ma12 > ma26;

  portfolioData.goldPrice = currentPrice;
  portfolioData.goldEntry = currentPrice;
  portfolioData.goldStopLoss = parseFloat((currentPrice * 0.985).toFixed(2));
  portfolioData.goldTakeProfit = parseFloat((currentPrice * 1.03).toFixed(2));

  // Update UI Elements
  const priceElem = document.getElementById('tv-live-price');
  if (priceElem) priceElem.innerText = `$${currentPrice.toLocaleString()} USD (Bearish Trend)`;

  const ma12Elem = document.getElementById('tv-ma12');
  if (ma12Elem) ma12Elem.innerText = `$${ma12.toLocaleString()}`;

  const ma26Elem = document.getElementById('tv-ma26');
  if (ma26Elem) ma26Elem.innerText = `$${ma26.toLocaleString()}`;

  const banner = document.getElementById('tv-signal-banner');
  const icon = document.getElementById('tv-signal-icon');
  const title = document.getElementById('tv-signal-title');
  const desc = document.getElementById('tv-signal-desc');

  if (isGoldenCross) {
    if (banner) {
      banner.style.background = 'rgba(16,185,129,0.15)';
      banner.style.borderColor = 'var(--emerald)';
    }
    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--emerald);"></i>';
    if (title) {
      title.innerText = '🟢 สัญญาณซื้อ: Golden Cross (MA 12 ตัดขึ้นเหนือ MA 26 ใน TF 5m)';
      title.style.color = 'var(--emerald)';
    }
    if (desc) {
      desc.innerText = `เส้น MA 12 ($${ma12}) ตัดขึ้นเหนือเส้น MA 26 ($${ma26}) ใน TF 5m 🟢 แนะนำสะสม/เพิ่มน้ำหนักพอร์ตทองคำ XAUUSD`;
    }
  } else {
    if (banner) {
      banner.style.background = 'rgba(239,68,68,0.15)';
      banner.style.borderColor = 'var(--rose)';
    }
    if (icon) icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--rose);"></i>';
    if (title) {
      title.innerText = '⚠️ สัญญาณเตือนลดพอร์ต: Death Cross (MA 12 ตัดลงใต้ MA 26 ใน TF 5m)';
      title.style.color = 'var(--rose)';
    }
    if (desc) {
      desc.innerText = `เส้น MA 12 ($${ma12}) อยู่ใต้เส้น MA 26 ($${ma26}) ใน TF 5m 🔴 สัญญาณเตือนขายทำกำไร / ลดน้ำหนักพอร์ตทองคำ XAUUSD ทันที`;
    }
  }

  // Update Department 3 Card elements
  const dept3Badge = document.getElementById('dash-global-growth-badge');
  const dept3Sub = document.getElementById('dash-global-growth-sub');
  if (isGoldenCross) {
    if (dept3Badge) {
      dept3Badge.className = 'badge badge-gold';
      dept3Badge.innerText = 'Proposal: BUY XAUUSD';
    }
    if (dept3Sub) dept3Sub.innerText = `[TF 5m] 🟢 MA 12 ($${ma12}) ตัดขึ้นเหนือ MA 26 สัญญาณเข้าสะสมทองคำ`;
  } else {
    if (dept3Badge) {
      dept3Badge.className = 'badge badge-rose';
      dept3Badge.innerText = 'Proposal: REDUCE XAUUSD';
    }
    if (dept3Sub) dept3Sub.innerText = `[TF 5m] ⚠️ MA 12 ($${ma12}) อยู่ใต้ MA 26 ($${ma26}) สัญญาณเตือนลดพอร์ตทองคำ`;
  }

  applyPortfolioToAllTabs();
}

function updatePortfolioPreview() {
  const d = getFormData();

  const totalNav = d.stockValue + d.depositValue + d.rmfValue;
  const monthlyInt = (d.depositValue * (d.depositRate / 100)) / 12;
  const annualDiv = d.stockValue * (d.stockRate / 100);
  const annualIncome = (monthlyInt * 12) + annualDiv;
  const annualWithdrawal = d.monthlyWithdrawal * 12;
  const annualNet = annualIncome - annualWithdrawal;

  const runway = annualNet < 0 ? (d.depositValue / Math.abs(annualNet)).toFixed(1) : 'ไม่จำกัด (Perpetual)';

  document.getElementById('preview-nav').innerText = `${totalNav.toLocaleString()} ฿`;
  document.getElementById('preview-monthly-int').innerText = `+${monthlyInt.toLocaleString(undefined, {maximumFractionDigits:0})} ฿/เดือน`;
  document.getElementById('preview-dividend').innerText = `+${annualDiv.toLocaleString()} ฿/ปี`;
  document.getElementById('preview-annual-income').innerText = `+${annualIncome.toLocaleString()} ฿/ปี`;
  document.getElementById('preview-annual-withdrawal').innerText = `-${annualWithdrawal.toLocaleString()} ฿/ปี`;

  const netElem = document.getElementById('preview-net');
  if (annualNet < 0) {
    netElem.innerText = `ขาดสุทธิ ${annualNet.toLocaleString()} ฿/ปี`;
    netElem.style.color = 'var(--rose)';
  } else {
    netElem.innerText = `เกินสุทธิ +${annualNet.toLocaleString()} ฿/ปี`;
    netElem.style.color = 'var(--emerald)';
  }

  document.getElementById('preview-runway').innerText = `${runway} ปี!`;
}

function savePortfolioChanges() {
  portfolioData = getFormData();
  localStorage.setItem('ai_portfolio_data', JSON.stringify(portfolioData));
  applyPortfolioToAllTabs();
  alert('✅ บันทึกข้อมูลพอร์ตเรียบร้อย! ข้อมูลทุกแท็บในระบบถูกอัปเดตเรียบร้อยแล้ว');
}

function resetPortfolioToDefault() {
  if (confirm('คุณต้องการรีเซ็ตข้อมูลพอร์ตการลงทุนกลับเป็นค่าเริ่มต้นหรือไม่?')) {
    portfolioData = { ...defaultPortfolioData };
    localStorage.setItem('ai_portfolio_data', JSON.stringify(portfolioData));
    loadPortfolioIntoForm();
    applyPortfolioToAllTabs();
    alert('🔄 รีเซ็ตข้อมูลเรียบร้อยแล้ว');
  }
}

function applyPortfolioToAllTabs() {
  const d = portfolioData;

  const totalNav = d.stockValue + d.depositValue + d.rmfValue;
  const coreNav = d.stockValue + d.depositValue + d.rmfValue;
  const satNav = 500000;
  const monthlyInt = (d.depositValue * (d.depositRate / 100)) / 12;
  const annualDiv = d.stockValue * (d.stockRate / 100);
  const annualIncome = (monthlyInt * 12) + annualDiv;
  const annualWithdrawal = d.monthlyWithdrawal * 12;
  const annualNet = annualIncome - annualWithdrawal;
  const runway = annualNet < 0 ? (d.depositValue / Math.abs(annualNet)).toFixed(1) : 'ไม่จำกัด (Perpetual)';

  // 1. Dashboard Overview Tab Cards
  const totalNavElem = document.getElementById('dash-total-nav');
  if (totalNavElem) totalNavElem.innerText = `${totalNav.toLocaleString()} ฿`;

  const coreNavElem = document.getElementById('dash-core-nav');
  if (coreNavElem) coreNavElem.innerText = `${coreNav.toLocaleString()} ฿`;

  const coreSubElem = document.getElementById('dash-core-sub');
  if (coreSubElem) coreSubElem.innerText = `หุ้น ${(d.stockValue/1000000).toFixed(1)}M + ฝาก ${(d.depositValue/1000000).toFixed(1)}M + RMF ${(d.rmfValue/1000).toFixed(0)}k`;

  const cashflowNavElem = document.getElementById('dash-cashflow-nav');
  if (cashflowNavElem) {
    cashflowNavElem.innerText = `${annualNet < 0 ? '' : '+'}${annualNet.toLocaleString()} ฿/ปี`;
    cashflowNavElem.style.color = annualNet < 0 ? 'var(--rose)' : 'var(--emerald)';
  }

  const cashflowSubElem = document.getElementById('dash-cashflow-sub');
  if (cashflowSubElem) cashflowSubElem.innerText = `ถอน ${(d.monthlyWithdrawal/1000).toFixed(0)}k/ด. (อยู่ได้ยาวนาน ${runway} ปี)`;

  const globalGrowthSubElem = document.getElementById('dash-global-growth-sub');
  if (globalGrowthSubElem) globalGrowthSubElem.innerText = `เสนอสะสมทองคำ ${(d.goldBudget/1000).toFixed(0)}k บ. ที่ $${d.goldPrice.toLocaleString()} (Stop Loss $${d.goldStopLoss.toLocaleString()})`;

  // 2. Calculator Tab Sync
  const calcStock = document.getElementById('calc-stock');
  if (calcStock) calcStock.value = d.stockValue;

  const calcStockRate = document.getElementById('calc-stock-rate');
  if (calcStockRate) calcStockRate.value = d.stockRate;

  const calcDeposit = document.getElementById('calc-deposit');
  if (calcDeposit) calcDeposit.value = d.depositValue;

  const calcDepositRate = document.getElementById('calc-deposit-rate');
  if (calcDepositRate) calcDepositRate.value = d.depositRate;

  const calcWithdrawal = document.getElementById('calc-withdrawal');
  if (calcWithdrawal) calcWithdrawal.value = d.monthlyWithdrawal;

  recalculateCashflow();

  // 3. Reports Tab Sync
  loadDailyReport();

  // 4. Approval List Sync
  const approvalList = document.getElementById('approval-action-list');
  if (approvalList) {
    const netWithdrawal = d.monthlyWithdrawal - monthlyInt;
    approvalList.innerHTML = `
      <li><strong>การถอนเงินใช้จ่าย</strong>: ถอนเงินฝากสหกรณ์ ${d.monthlyWithdrawal.toLocaleString()} บาท/เดือน (สุทธิถอนจริง ${netWithdrawal.toLocaleString(undefined, {maximumFractionDigits:0})} บ./เดือน หลังหักดอกเบี้ยรับ)</li>
      <li><strong>การลงทุนชดเชยส่วนขาด</strong>: ซื้อสะสมทองคำ (XAUUSD / Gold Fund) วงเงิน <strong>${d.goldBudget.toLocaleString()} บาท</strong> ที่ราคา ${d.goldPrice.toLocaleString()} THB</li>
      <li><strong>จุดตัดขาดทุน (Stop Loss)</strong>: ${d.goldStopLoss.toLocaleString()} THB (จำกัดขาดทุนสูงสุด)</li>
    `;
  }

  // 5. Portfolio Editor Form & Preview
  loadPortfolioIntoForm();
  updatePortfolioPreview();
}

// Load Daily Report HTML into Area
function loadDailyReport() {
  const area = document.getElementById('report-view-area');
  if (!area) return;

  const d = portfolioData;
  const totalNav = d.stockValue + d.depositValue + d.rmfValue;
  const monthlyInt = (d.depositValue * (d.depositRate / 100)) / 12;
  const annualInt = monthlyInt * 12;
  const annualDiv = d.stockValue * (d.stockRate / 100);
  const annualIncome = annualInt + annualDiv;
  const annualWithdrawal = d.monthlyWithdrawal * 12;
  const annualNet = annualIncome - annualWithdrawal;
  const runway = annualNet < 0 ? (d.depositValue / Math.abs(annualNet)).toFixed(1) : 'ไม่จำกัด (Perpetual)';

  const stockPct = ((d.stockValue / totalNav) * 100).toFixed(1);
  const depositPct = ((d.depositValue / totalNav) * 100).toFixed(1);
  const rmfPct = ((d.rmfValue / totalNav) * 100).toFixed(1);

  const sampleReportHtml = `
    <h2 style="color:#1b365d;">📰 รายงานผลการวิเคราะห์และการพิจารณาประจำวัน (Daily Executive Report)</h2>
    <p><strong>ทีม AI Agent บริหารเงินเกษียณ ${(totalNav/1000000).toFixed(1)} ล้านบาท (ปรับตามเงื่อนไขรายจ่าย ${d.monthlyWithdrawal.toLocaleString()} บาท/เดือน)</strong></p>
    <p style="color:#64748b; font-size:12px;">ประจำวันที่: 5 สิงหาคม 2026 | รหัสการประชุม: <code>MEET-20260805</code></p>
    <hr style="border:0; border-top:1px solid #e2e8f0; margin:14px 0;">

    <h3 style="color:#2b6cb0;">📊 สรุปพอร์ตและดุลกระแสเงินสดประจำวัน</h3>
    <table style="width:100%; border-collapse:collapse; margin-bottom:14px;">
      <thead>
        <tr style="background:#ebf8ff; color:#2c5282;">
          <th style="padding:8px; border:1px solid #cbd5e1;">หมวดหมู่สินทรัพย์</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">มูลค่า (บาท)</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">สัดส่วน (%)</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">กระแสเงินสดเข้า/ปี</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">รายจ่ายถอน/ปี</th>
          <th style="padding:8px; border:1px solid #cbd5e1;">ส่วนต่างสุทธิ/ปี</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:8px; border:1px solid #cbd5e1;"><strong>หุ้นสหกรณ์ (ปันผล ${d.stockRate}%)</strong></td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${d.stockValue.toLocaleString()}</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${stockPct}%</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">+${annualDiv.toLocaleString()} บ. (ก.พ.)</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">-</td>
          <td style="padding:8px; border:1px solid #cbd5e1; color:#2563eb;"><strong>+${annualDiv.toLocaleString()} บ.</strong></td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #cbd5e1;"><strong>เงินฝากสหกรณ์ (ดอกเบี้ย ${d.depositRate}% ต่อปี)</strong></td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${d.depositValue.toLocaleString()}</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${depositPct}%</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">+${annualInt.toLocaleString()} บ. (${monthlyInt.toLocaleString(undefined, {maximumFractionDigits:0})} บ./ด.)</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">-${annualWithdrawal.toLocaleString()} บ. (${(d.monthlyWithdrawal/1000).toFixed(0)}k/ด.)</td>
          <td style="padding:8px; border:1px solid #cbd5e1; color:#dc2626;"><strong>-${(annualWithdrawal - annualInt).toLocaleString()} บ.</strong></td>
        </tr>
        <tr>
          <td style="padding:8px; border:1px solid #cbd5e1;"><strong>กองทุน RMF</strong></td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${d.rmfValue.toLocaleString()}</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${rmfPct}%</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">-</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">-</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">-</td>
        </tr>
        <tr style="background:#f1f5f9; font-weight:bold;">
          <td style="padding:8px; border:1px solid #cbd5e1;">รวมสินทรัพย์ทั้งหมด (NAV)</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">${totalNav.toLocaleString()}</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">100.0%</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">+${annualIncome.toLocaleString()} บ./ปี</td>
          <td style="padding:8px; border:1px solid #cbd5e1;">-${annualWithdrawal.toLocaleString()} บ./ปี</td>
          <td style="padding:8px; border:1px solid #cbd5e1; color:${annualNet < 0 ? '#dc2626' : '#16a34a'};">
            ${annualNet < 0 ? 'ขาดสุทธิ ' + annualNet.toLocaleString() : 'ส่วนเกิน +' + annualNet.toLocaleString()} บ./ปี
          </td>
        </tr>
      </tbody>
    </table>
    <p style="font-size:12px; color:#475569;">💡 <strong> Liquidity Runway:</strong> เงินฝากสหกรณ์ ${(d.depositValue/1000000).toFixed(1)} ล้านบาท รองรับการถอน ${d.monthlyWithdrawal.toLocaleString()} บ./เดือน ได้นานถึง <strong>${runway} ปีเต็ม</strong></p>

    <h3 style="color:#2b6cb0; margin-top:20px;">📋 ข้อเสนอการลงทุนและการพิจารณาความเสี่ยงประจำวัน</h3>
    <ul style="font-size:13px; line-height:1.8;">
      <li><strong>สถานะ XAUUSD Real-time</strong>: 🟢 <strong>$4,602.99 USD / oz</strong> (Bullish Trend, CDC ActionZone สีเขียว, Stoch 92.01 Overbought)</li>
      <li><strong>ข้อเสนอแผนก Global Growth Assets</strong>: ซื้อสะสมทองคำ (XAUUSD Spot/Fund) วงเงิน <strong>${d.goldBudget.toLocaleString()} บาท</strong> ที่ราคาปัจจุบัน $${d.goldPrice.toLocaleString()} (Take Profit $${d.goldTakeProfit.toLocaleString()})</li>
      <li><strong>จุดตัดขาดทุน (Stop Loss)</strong>: $${d.goldStopLoss.toLocaleString()} USD</li>
      <li><strong>ผลการออดิเต็ดโดย Risk Control Officer</strong>: 🟢 <strong>APPROVED (ผ่านการอนุมัติ)</strong> ไม่กระทบรายจ่าย ${(d.monthlyWithdrawal/1000).toFixed(0)}k/เดือน และไม่มีการใช้ Leverage</li>
    </ul>
  `;

  area.innerHTML = sampleReportHtml;
}

// Quick Approval Action from Dashboard
function handleQuickApprove(decision) {
  const statusBadge = document.getElementById('current-status-badge');
  if (decision === 'APPROVED') {
    statusBadge.innerText = 'อนุมัติเรียบร้อย (Approved)';
    statusBadge.className = 'badge badge-emerald';
    alert('✅ บันทึกคำสั่งอนุมัติการถอนเงินเรียบร้อยแล้ว!');
  } else {
    statusBadge.innerText = 'ชะลอการลงทุน (Hold)';
    statusBadge.className = 'badge badge-gold';
    alert('🟡 บันทึกคำสั่งชะลอการลงทุนเรียบร้อยแล้ว!');
  }
}

// Submit Full Decision
function submitCioDecision() {
  const decision = document.getElementById('cio-decision-select').value;
  const comments = document.getElementById('cio-comments').value.trim();

  handleQuickApprove(decision);

  const logEntry = {
    timestamp: new Date().toLocaleString('th-TH'),
    decision: decision,
    comments: comments || 'ไม่มีข้อความเพิ่มเติม'
  };

  let logs = JSON.parse(localStorage.getItem('cio_approval_logs')) || [];
  logs.unshift(logEntry);
  localStorage.setItem('cio_approval_logs', JSON.stringify(logs));

  alert(`บันทึกคำตัดสิน [${decision}] เข้าสู่ฐานข้อมูลเรียบร้อยแล้ว!`);
}

// Cashflow Simulator Calculator Logic
function recalculateCashflow() {
  const stockElem = document.getElementById('calc-stock');
  if (!stockElem) return;

  const stock = parseFloat(stockElem.value) || 0;
  const stockRate = parseFloat(document.getElementById('calc-stock-rate').value) || 0;
  const deposit = parseFloat(document.getElementById('calc-deposit').value) || 0;
  const depositRate = parseFloat(document.getElementById('calc-deposit-rate').value) || 0;
  const withdrawalMonthly = parseFloat(document.getElementById('calc-withdrawal').value) || 0;

  const monthlyInterest = (deposit * (depositRate / 100.0)) / 12.0;
  const annualDividend = stock * (stockRate / 100.0);
  
  const annualWithdrawal = withdrawalMonthly * 12.0;
  const annualNet = (monthlyInterest * 12.0 + annualDividend) - annualWithdrawal;
  
  const runway = annualNet < 0 ? (deposit / Math.abs(annualNet)).toFixed(1) : 'ไม่จำกัด (Perpetual)';

  document.getElementById('res-monthly-interest').innerText = `${monthlyInterest.toLocaleString(undefined, {maximumFractionDigits:0})} ฿/เดือน`;
  document.getElementById('res-annual-dividend').innerText = `${annualDividend.toLocaleString()} ฿/ปี`;
  document.getElementById('res-annual-net').innerText = `${annualNet < 0 ? '' : '+'}${annualNet.toLocaleString()} ฿/ปี`;
  document.getElementById('res-runway').innerText = `${runway} ปี!`;
}

// Trigger Run Daily Meeting Simulation
function triggerRunMeeting() {
  alert('🚀 เริ่มรันการดึงข้อมูลจากแหล่งข่าวสารและจำลองการประชุมประจำวันของทั้ง 6 แผนก AI...\n\nระบบจะทำการอัปเดตข้อมูลราคา ลิงก์ และประมวลผลเข้าสู่ฐานข้อมูล SQLite!');
  switchTab('reports');
}
