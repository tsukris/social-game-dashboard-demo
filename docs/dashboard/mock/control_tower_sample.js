(() => {
  const reportDate = new Date('2026-04-19T00:00:00+09:00');
  const reportDay = 18;
  const axisFontFamily = "'Noto Sans JP','Yu Gothic UI','Yu Gothic','Hiragino Sans','Meiryo',sans-serif";
  const markerRadius = 2.4;
  const COLORS = {
    ink: '#162033',
    grid: 'rgba(22,32,51,0.08)',
    axis: 'rgba(22,32,51,0.48)',
    axisSoft: 'rgba(22,32,51,0.50)',
    blue: '#356cff',
    blueDeep: '#234bba',
    blueSoft: 'rgba(53,108,255,0.16)',
    blueSoftLine: 'rgba(53,108,255,0.42)',
    green: '#3f8a4d',
    greenSoftLine: 'rgba(63,138,77,0.45)',
    greenBar: 'rgba(63,138,77,0.74)',
    red: '#c44d5c',
    redSoftLine: 'rgba(196,77,92,0.45)',
    redBar: 'rgba(196,77,92,0.70)'
  };

  const elements = {
    alertStrip: document.querySelector('.alert-strip'),
    periodChip: document.getElementById('periodChip'),
    scopeToggle: document.getElementById('scopeToggle'),
    revenueTitle: document.getElementById('revenueTitle'),
    revenueDescription: document.getElementById('revenueDescription'),
    revenueMetricLabel: document.getElementById('revenueMetricLabel'),
    revenueValue: document.getElementById('revenueValue'),
    revenueHint: document.getElementById('revenueHint'),
    revenueLegend: document.getElementById('revenueLegend'),
    revenueMetrics: document.getElementById('revenueMetrics'),
    revenueChart: document.getElementById('revenueChart'),
    dmauDescription: document.getElementById('dmauDescription'),
    dmauMetricLabel: document.getElementById('dmauMetricLabel'),
    dmauValue: document.getElementById('dmauValue'),
    dmauHint: document.getElementById('dmauHint'),
    dmauMetrics: document.getElementById('dmauMetrics'),
    dmauLineLegend: document.getElementById('dmauLineLegend'),
    dmauBarLegend: document.getElementById('dmauBarLegend'),
    playerChart: document.getElementById('playerChart'),
    signalGrid: document.getElementById('signalGrid'),
    tooltip: document.getElementById('chartTooltip'),
    eventListPanel: document.querySelector('.event-list-panel'),
    annualEventPanel: document.querySelector('.annual-event-panel')
  };
  const tooltipMode = Boolean(window.CONTROL_TOWER_TOOLTIP_MODE);

  function getInitiativeMonth(value) {
    const month = Number(String(value || '').split('/')[0]);
    return Number.isFinite(month) ? month : 0;
  }

  function includesInitiativeMonth(startMonth, endMonth, selectedMonth) {
    if (!selectedMonth) return true;
    if (!startMonth || !endMonth) return false;
    if (startMonth <= endMonth) return startMonth <= selectedMonth && selectedMonth <= endMonth;
    return selectedMonth >= startMonth || selectedMonth <= endMonth;
  }

  const initiativeCategoryLabels = {
    all: 'すべて',
    event: 'イベント',
    gacha: 'ガチャ',
    product: '商品'
  };
  const initiativeMonthLabels = {
    all: '年間',
    1: '1月',
    2: '2月',
    3: '3月',
    4: '4月',
    5: '5月',
    6: '6月',
    7: '7月',
    8: '8月',
    9: '9月',
    10: '10月',
    11: '11月',
    12: '12月'
  };

  function closeInitiativeFilterPopovers(exceptCell = null) {
    elements.annualEventPanel?.querySelectorAll('[data-initiative-filter-cell]').forEach((cell) => {
      if (cell === exceptCell) return;
      cell.classList.remove('is-open');
      cell.querySelector('[data-initiative-filter-toggle]')?.setAttribute('aria-expanded', 'false');
    });
  }

  function updateInitiativeFilterStates(panel) {
    const nameQuery = (panel.querySelector('[data-initiative-name]')?.value || '').trim();
    const category = panel.querySelector('[data-initiative-category-option].is-active')?.dataset.value || 'all';
    const periodMonth = panel.querySelector('[data-initiative-period-month-option].is-active')?.dataset.value || 'all';

    const nameCell = panel.querySelector('[data-initiative-name]')?.closest('[data-initiative-filter-cell]');
    const categoryCell = panel.querySelector('[data-initiative-category-option]')?.closest('[data-initiative-filter-cell]');
    const periodMonthCell = panel.querySelector('[data-initiative-period-month-option]')?.closest('[data-initiative-filter-cell]');

    const nameState = panel.querySelector('[data-initiative-filter-state="name"]');
    const categoryState = panel.querySelector('[data-initiative-filter-state="category"]');
    const periodMonthState = panel.querySelector('[data-initiative-filter-state="periodMonth"]');

    if (nameState) nameState.textContent = nameQuery ? `検索: ${nameQuery}` : '施策名';
    if (categoryState) categoryState.textContent = category === 'all' ? '分類' : (initiativeCategoryLabels[category] || initiativeCategoryLabels.all);
    if (periodMonthState) periodMonthState.textContent = periodMonth === 'all' ? '期間' : (initiativeMonthLabels[periodMonth] || initiativeMonthLabels.all);

    nameCell?.classList.toggle('is-filtered', Boolean(nameQuery));
    categoryCell?.classList.toggle('is-filtered', category !== 'all');
    periodMonthCell?.classList.toggle('is-filtered', periodMonth !== 'all');
  }

  function selectInitiativeOption(option, selector) {
    const cell = option.closest('[data-initiative-filter-cell]');
    cell?.querySelectorAll(selector).forEach((button) => {
      button.classList.toggle('is-active', button === option);
      button.setAttribute('aria-pressed', String(button === option));
    });
    const panel = option.closest('[data-initiative-panel]');
    if (panel) {
      updateInitiativeFilterStates(panel);
    }
  }

  function applyInitiativeFilters() {
    if (!elements.annualEventPanel) return;
    const panels = Array.from(elements.annualEventPanel.querySelectorAll('[data-initiative-panel]'));

    panels.forEach((panel) => {
      const category = panel.querySelector('[data-initiative-category-option].is-active')?.dataset.value || 'all';
      const nameQuery = (panel.querySelector('[data-initiative-name]')?.value || '').trim().toLowerCase();
      const periodMonthValue = panel.querySelector('[data-initiative-period-month-option].is-active')?.dataset.value || 'all';
      const selectedPeriodMonth = Number(periodMonthValue === 'all' ? 0 : periodMonthValue);
      const table = panel.querySelector('[data-initiative-list]');
      if (!table) return;
      let visibleCount = 0;
      table.querySelectorAll('.initiative-row:not(.is-header)').forEach((row) => {
        const categoryMatches = category === 'all' || row.dataset.category === category;
        const name = (row.querySelector('.initiative-name')?.textContent || '').trim().toLowerCase();
        const nameMatches = !nameQuery || name.includes(nameQuery);
        const startMonth = getInitiativeMonth(row.dataset.start);
        const endMonth = getInitiativeMonth(row.dataset.end);
        const periodMonthMatches = includesInitiativeMonth(startMonth, endMonth, selectedPeriodMonth);
        const shouldShow = nameMatches && categoryMatches && periodMonthMatches;
        row.hidden = !shouldShow;
        if (shouldShow) visibleCount += 1;
      });

      const empty = panel.querySelector('[data-initiative-empty]');
      if (empty) {
        empty.classList.toggle('is-visible', visibleCount === 0);
      }
    });
  }

  const currentMonthBase = {
    labels: Array.from({ length: 30 }, (_, index) => `4/${index + 1}`),
    revenueDaily: [1.4, 1.6, 1.5, 2.0, 5.8, 3.4, 2.2, 1.7, 1.8, 2.1, 5.2, 3.1, 1.9, 1.6, 4.7, 3.0, 1.8, 2.3, 2.0, 2.4, 1.7, 2.2, 5.0, 3.2, 2.1, 1.8, 4.4, 2.8, 1.9, 2.5],
    revenueTargetDaily: [2.0, 2.1, 2.3, 2.4, 2.7, 2.9, 2.8, 2.9, 3.0, 3.0, 3.1, 3.1, 3.0, 3.0, 3.1, 3.0, 2.9, 2.9, 2.9, 2.8, 2.7, 2.6, 2.6, 2.5, 2.5, 2.5, 2.4, 2.4, 2.4, 2.4],
    dmauTrend: [19040, 19110, 19070, 19150, 19060, 19010, 19080, 18990, 18940, 19020, 18910, 18860, 18930, 18840, 18790, 18850, 18760, 18720, 18780, 18690, 18640, 18710, 18620, 18580, 18630, 18540, 18500, 18560, 18490, 18440],
    newUsersTrend: [52, 58, 64, 55, 82, 74, 61, 54, 57, 63, 86, 78, 60, 56, 79, 72, 58, 64, 70, 66, 55, 53, 81, 76, 62, 57, 74, 68, 56, 60],
    churnUsersTrend: [70, 76, 82, 74, 92, 88, 79, 72, 80, 86, 100, 94, 81, 78, 104, 96, 84, 90, 98, 93, 82, 79, 101, 96, 86, 81, 99, 92, 84, 88],
    walletTrend: [10.6, 10.8, 10.9, 11.0, 11.2, 11.1, 11.3, 11.5, 11.6, 11.7, 11.8, 11.9, 11.7, 11.6, 11.8, 11.9, 12.0, 12.1, 12.2, 12.0, 11.9, 12.1, 12.3, 12.4, 12.5, 12.4, 12.3, 12.5, 12.6, 12.7],
    stoneUseTrend: [1200, 1500, 1300, 2200, 7600, 4200, 2600, 1800, 1900, 2400, 6900, 3800, 2100, 1700, 6200, 3500, 1900, 2600, 2300, 2700, 1800, 2400, 6400, 4100, 2500, 1900, 5600, 3400, 2200, 2800],
    snsPostsTrend: [3180, 3240, 3310, 3370, 3440, 3490, 3530, 3510, 3480, 3540, 3610, 3680, 3740, 3810, 3860, 3890, 3870, 3890, 3920, 3950, 3910, 3880, 3940, 3990, 4030, 4010, 3970, 4000, 4050, 4090],
    snsPositiveTrend: [28.4, 27.9, 28.2, 27.4, 26.8, 26.1, 26.5, 25.7, 25.0, 24.6, 24.9, 23.8, 23.1, 23.4, 22.2, 21.1, 20.5, 20.4, 21.0, 20.6, 21.3, 20.9, 21.6, 22.1, 21.8, 22.7, 23.1, 22.6, 23.4, 24.0],
    snsNegativeTrend: [31.2, 32.0, 31.6, 32.7, 33.4, 34.2, 33.8, 35.0, 35.7, 36.2, 35.9, 37.0, 38.1, 37.6, 39.0, 40.1, 41.3, 42.8, 42.1, 43.0, 42.5, 43.4, 42.7, 41.9, 42.4, 41.6, 40.8, 41.2, 40.4, 39.8],
    loadTimeTrend: [2.18, 2.14, 2.12, 2.16, 2.19, 2.22, 2.17, 2.14, 2.11, 2.15, 2.18, 2.24, 2.21, 2.19, 2.17, 2.16, 2.18, 2.34, 2.28, 2.33, 2.36, 2.34, 2.31, 2.28, 2.24, 2.22, 2.19, 2.17, 2.15, 2.16],
    payerRate: 3.0,
    payerRateYearlyAverage: 4.5,
    arppu: 5300,
    arppuYearlyAverage: 7950,
    newUsersMonthlyAverage: 2720,
    churnUsersMonthlyAverage: 2320,
    walletYearlyAverage: 11.4,
    snsPostsMonthlyAverage: 8650,
    loadThreshold: 2.3
  };

  const marchTail = {
    labels: Array.from({ length: 12 }, (_, index) => `3/${20 + index}`),
    revenueDaily: [1.9, 2.1, 1.8, 2.4, 2.2, 2.0, 1.7, 2.5, 2.8, 2.4, 2.1, 2.6],
    revenueTargetDaily: [2.2, 2.3, 2.1, 2.4, 2.3, 2.2, 2.1, 2.4, 2.5, 2.4, 2.3, 2.4],
    dmauTrend: [19110, 19080, 19240, 19320, 19290, 19410, 19520, 19480, 19570, 19610, 19540, 19490],
    newUsersTrend: [88, 86, 83, 90, 84, 82, 79, 92, 96, 91, 87, 85],
    churnUsersTrend: [80, 82, 84, 81, 85, 86, 88, 84, 83, 86, 87, 89],
    walletTrend: [10.4, 10.5, 10.6, 10.5, 10.7, 10.8, 10.7, 10.8, 10.9, 10.8, 10.9, 10.9],
    stoneUseTrend: [2200, 1800, 2600, 3400, 2100, 1900, 1700, 3600, 4100, 2800, 2400, 3200],
    snsPostsTrend: [2860, 2940, 3010, 2980, 3050, 2990, 3080, 3140, 3210, 3170, 3230, 3290],
    snsPositiveTrend: [23.2, 23.8, 24.1, 23.4, 24.0, 23.6, 24.2, 24.4, 25.1, 24.8, 25.3, 25.9],
    snsNegativeTrend: [37.8, 37.1, 36.9, 37.4, 36.8, 36.5, 36.3, 35.8, 35.2, 35.6, 35.0, 34.6],
    loadTimeTrend: [2.09, 2.12, 2.08, 2.15, 2.11, 2.10, 2.14, 2.12, 2.16, 2.14, 2.17, 2.13]
  };

  const dailyBenchmarks = {
    payerRate: 3.2,
    payerRateAverage: 3.4,
    arppu: 5900,
    arppuAverage: 6100,
    newUsersTotalAverage: 7440,
    churnTotalAverage: 7080,
    stoneUseDailyAverage: 2800,
    walletAverage: 11.3,
    snsPostsDailyAverage: 3120
  };

  const yearlyHistory = [
    { year: 2020, revenue: 628.0, dmau: 17680, yearStartDiff: 980, newUsers: 21500, churn: 18700, wallet: 9.9, stoneUse: 742000, snsPosts: 612000, snsPositive: 28.7, snsNegative: 31.2, loadTime: 2.16, payerRate: 4.2, arppu: 5280 },
    { year: 2021, revenue: 664.0, dmau: 18210, yearStartDiff: 1040, newUsers: 22300, churn: 19280, wallet: 10.2, stoneUse: 781000, snsPosts: 648000, snsPositive: 28.1, snsNegative: 32.0, loadTime: 2.14, payerRate: 4.1, arppu: 5360 },
    { year: 2022, revenue: 702.0, dmau: 18840, yearStartDiff: 1110, newUsers: 23100, churn: 19840, wallet: 10.5, stoneUse: 822000, snsPosts: 695000, snsPositive: 27.6, snsNegative: 33.1, loadTime: 2.13, payerRate: 4.0, arppu: 5440 },
    { year: 2023, revenue: 748.0, dmau: 19460, yearStartDiff: 1180, newUsers: 23950, churn: 20420, wallet: 10.9, stoneUse: 868000, snsPosts: 741000, snsPositive: 26.9, snsNegative: 34.4, loadTime: 2.12, payerRate: 3.9, arppu: 5510 },
    { year: 2024, revenue: 791.0, dmau: 20040, yearStartDiff: 1240, newUsers: 24720, churn: 21110, wallet: 11.3, stoneUse: 914000, snsPosts: 786000, snsPositive: 25.8, snsNegative: 35.8, loadTime: 2.15, payerRate: 3.7, arppu: 5570 },
    { year: 2025, revenue: 836.0, dmau: 20880, yearStartDiff: 1310, newUsers: 25840, churn: 21940, wallet: 11.8, stoneUse: 958000, snsPosts: 824000, snsPositive: 24.7, snsNegative: 37.1, loadTime: 2.17, payerRate: 3.5, arppu: 5610 },
    { year: 2026, revenue: 864.0, dmau: 21480, yearStartDiff: 1390, newUsers: 26880, churn: 22580, wallet: 12.2, stoneUse: 986000, snsPosts: 862000, snsPositive: 22.8, snsNegative: 38.6, loadTime: 2.19, payerRate: 3.3, arppu: 5620 }
  ];

  const notes = {
    stone: '疑似的な売上。<br>売上が伸び悩んでいても、石の消費数が多ければガチャ自体はまわわっていることとなる。<br>石配布数とも関連があるため注意。',
    wallet: 'ユーザーの現在の石保有数。<br>多いならガチャが回りやすい、少ないなら石が売れやすいなど。<br>一部のユーザーが石保有数を引き上げてる可能性に注意。',
    sns: '施策に対する話題性、ユーザーの反応を見る。<br>ネガティブが予想される施策でも事前に想定した範囲内かどうかが重要になる。',
    load: '閾値超えが続く日は体験悪化のサイン。<br>システム対応が必要となる。'
  };

  const state = {
    scope: 'month'
  };

  const monthlyHistory = buildMonthlyHistory();
  const previousMonthSummary = monthlyHistory.find((item) => item.year === 2026 && item.month === 3);
  const currentMonthVisible = sliceVisible(currentMonthBase, reportDay);
  const visibleLabels = currentMonthBase.labels.slice(0, reportDay);
  const previousMonthBase = buildPreviousMonthBase();
  const previousMonthVisible = sliceVisible(previousMonthBase, reportDay);
  const currentYearMonths = monthlyHistory.filter((item) => item.year === 2026);
  const previousYearMonths = monthlyHistory.filter((item) => item.year === 2025);
  const previousYearSameMonths = previousYearMonths.slice(0, currentYearMonths.length);

  const sum = (values) => values.reduce((total, value) => total + value, 0);
  const average = (values) => values.length ? sum(values) / values.length : 0;
  const last = (values) => values[values.length - 1];
  const first = (values) => values[0];
  function round(value, digits = 2) {
    return Number(value.toFixed(digits));
  }
  const cumulative = (values) => values.reduce((acc, value, index) => {
    acc.push((acc[index - 1] || 0) + value);
    return acc;
  }, []);
  const formatNumber = (value) => Math.round(value).toLocaleString('ja-JP');
  const formatSignedNumber = (value) => `${value >= 0 ? '+' : '-'}${Math.round(Math.abs(value)).toLocaleString('ja-JP')}`;
  const formatCurrencyInt = (valueInMillions) => `¥${Math.round(valueInMillions * 1000000).toLocaleString('ja-JP')}`;
  const formatCurrencyDiff = (valueInMillions) => `${valueInMillions >= 0 ? '+' : '-'}¥${Math.round(Math.abs(valueInMillions) * 1000000).toLocaleString('ja-JP')}`;
  const formatYen = (value) => `¥${Math.round(value).toLocaleString('ja-JP')}`;
  const formatPercent = (value, digits = 1) => `${value.toFixed(digits)}%`;
  const formatSeconds = (value) => `${value.toFixed(2)}s`;
  function renderFixedPeriodChip(period) {
    const match = String(period).match(/^(\d{4}\/\d{2}\/\d{2}) - (\d{4}\/\d{2}\/\d{2})$/);
    if (!match) return `<strong>基準期間:</strong><span>${period}</span>`;

    const [, start, end] = match;
    return `
      <strong>基準期間:</strong>
      <span class="period-date-text">${start}</span>
      <span class="period-separator">-</span>
      <span class="period-date-text">${end}</span>
    `;
  }
  const formatWan = (value) => `${round(value, 1).toFixed(1)}万`;
  const formatStoneHoldings = (valueInTenThousands) => formatNumber(valueInTenThousands * 10000);
  const formatCurrencyAxis = (valueInMillions) => `${Math.round(valueInMillions * 100).toLocaleString('ja-JP')}万`;
  const formatCompactNumberAxis = (value) => {
    if (value <= 0) return '0';
    if (value < 100000) return formatNumber(value);
    if (value >= 10000) {
      const valueInMan = value / 10000;
      return `${valueInMan % 1 === 0 ? valueInMan.toFixed(0) : valueInMan.toFixed(1)}万`;
    }
    return formatNumber(value);
  };

  const previousCompleteMonths = getPreviousCompleteMonths(2026, 4, 12);
  const stoneUseSameDayAverageSeries = currentMonthBase.labels.map((_, index) => average(previousCompleteMonths.map((item) => {
    const daysInTargetMonth = new Date(item.year, item.month, 0).getDate();
    const elapsedDays = Math.min(index + 1, daysInTargetMonth);
    const dailyWeights = Array.from({ length: daysInTargetMonth }, (_, dayIndex) => {
      const day = dayIndex + 1;
      const pulse =
        1.8 * Math.exp(-((day - 5) ** 2) / (2 * 1.0 ** 2)) +
        1.45 * Math.exp(-((day - 12) ** 2) / (2 * 1.2 ** 2)) +
        1.55 * Math.exp(-((day - 21) ** 2) / (2 * 1.3 ** 2));
      const smallWave = 0.08 * Math.sin(day * 0.7 + item.month * 0.4);
      return Math.max(0.15, 0.72 + smallWave + pulse);
    });
    return item.stoneUse * (sum(dailyWeights.slice(0, elapsedDays)) / sum(dailyWeights)) * 0.9;
  })));
  const stoneUseSameDayAverage = stoneUseSameDayAverageSeries[reportDay - 1];

  const allMonthsAverage = {
    revenue: average(monthlyHistory.map((item) => item.revenue)),
    payerRate: average(monthlyHistory.map((item) => item.payerRate)),
    arppu: average(monthlyHistory.map((item) => item.arppu)),
    newUsers: average(monthlyHistory.map((item) => item.newUsers)),
    churn: average(monthlyHistory.map((item) => item.churn)),
    stoneUse: average(monthlyHistory.map((item) => item.stoneUse)),
    wallet: average(monthlyHistory.map((item) => item.wallet)),
    snsPosts: average(monthlyHistory.map((item) => item.snsPosts)),
    loadTime: average(monthlyHistory.map((item) => item.loadTime))
  };

  const previousYearAverage = {
    revenue: average(previousYearMonths.map((item) => item.revenue)),
    payerRate: average(previousYearMonths.map((item) => item.payerRate)),
    arppu: average(previousYearMonths.map((item) => item.arppu)),
    newUsers: average(previousYearMonths.map((item) => item.newUsers)),
    churn: average(previousYearMonths.map((item) => item.churn)),
    stoneUse: average(previousYearMonths.map((item) => item.stoneUse)),
    wallet: average(previousYearMonths.map((item) => item.wallet)),
    snsPosts: average(previousYearMonths.map((item) => item.snsPosts)),
    loadTime: average(previousYearMonths.map((item) => item.loadTime))
  };

  function sliceVisible(base, length) {
    return {
      labels: base.labels.slice(0, length),
      revenueDaily: base.revenueDaily.slice(0, length),
      revenueTargetDaily: base.revenueTargetDaily.slice(0, length),
      dmauTrend: base.dmauTrend.slice(0, length),
      newUsersTrend: base.newUsersTrend.slice(0, length),
      churnUsersTrend: base.churnUsersTrend.slice(0, length),
      walletTrend: base.walletTrend.slice(0, length),
      stoneUseTrend: base.stoneUseTrend.slice(0, length),
      snsPostsTrend: base.snsPostsTrend.slice(0, length),
      snsPositiveTrend: base.snsPositiveTrend.slice(0, length),
      snsNegativeTrend: base.snsNegativeTrend.slice(0, length),
      loadTimeTrend: base.loadTimeTrend.slice(0, length)
    };
  }

  function getPreviousCompleteMonths(year, month, count) {
    return monthlyHistory
      .filter((item) => item.year < year || (item.year === year && item.month < month))
      .slice(-count);
  }

  function buildPreCurrentDailyRange() {
    const start = new Date(2026, 0, 19);
    const generatedLength = 60;
    const generated = {
      labels: [],
      revenueDaily: [],
      revenueTargetDaily: [],
      dmauTrend: [],
      newUsersTrend: [],
      churnUsersTrend: [],
      walletTrend: [],
      stoneUseTrend: [],
      snsPostsTrend: [],
      snsPositiveTrend: [],
      snsNegativeTrend: [],
      loadTimeTrend: []
    };

    for (let index = 0; index < generatedLength; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const dayOfWeek = date.getDay();
      const wave = Math.sin(index * 0.33);
      const fineWave = Math.sin(index * 0.91);
      const softTrend = index / generatedLength;
      const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 0.22 : 0;
      const eventA = Math.exp(-((index - 9) ** 2) / (2 * 3.2 ** 2));
      const eventB = Math.exp(-((index - 29) ** 2) / (2 * 4.8 ** 2));
      const eventC = Math.exp(-((index - 51) ** 2) / (2 * 3.8 ** 2));
      const cooldown = Math.exp(-((index - 41) ** 2) / (2 * 5.5 ** 2));
      const lateChurn = Math.exp(-((index - 57) ** 2) / (2 * 3.2 ** 2));

      generated.labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
      generated.revenueDaily.push(Number(Math.max(1.2, 1.72 + softTrend * 0.28 + wave * 0.18 + fineWave * 0.09 + weekendBoost + eventA * 0.55 + eventB * 0.95 + eventC * 0.48 - cooldown * 0.42).toFixed(1)));
      generated.revenueTargetDaily.push(Number((2.15 + softTrend * 0.28 + Math.cos(index * 0.24) * 0.07 + eventB * 0.12).toFixed(1)));
      generated.dmauTrend.push(Math.round(18840 + softTrend * 410 + wave * 80 + eventA * 210 + eventB * 430 + eventC * 250 - cooldown * 260 - lateChurn * 110));
      generated.newUsersTrend.push(Math.round(Math.max(58, 74 + softTrend * 9 + weekendBoost * 38 + fineWave * 5 + eventA * 42 + eventB * 58 + eventC * 30 - cooldown * 13)));
      generated.churnUsersTrend.push(Math.round(Math.max(62, 78 + softTrend * 11 + weekendBoost * 14 - eventA * 9 - eventB * 8 + cooldown * 28 + lateChurn * 22 + wave * 5)));
      generated.walletTrend.push(Number((10.35 + softTrend * 0.38 + eventA * 0.08 - eventB * 0.18 + cooldown * 0.16 + eventC * 0.09 + wave * 0.06).toFixed(1)));
      generated.stoneUseTrend.push(Math.round(Math.max(900, 1750 + softTrend * 620 + weekendBoost * 1150 + Math.max(fineWave, -0.45) * 520 + eventA * 1900 + eventB * 3200 + eventC * 2500 - cooldown * 650)));
      generated.snsPostsTrend.push(Math.round(2760 + softTrend * 360 + wave * 120 + weekendBoost * 260 + eventA * 620 + eventB * 980 + eventC * 720 + cooldown * 260));
      generated.snsPositiveTrend.push(Number((26.2 - softTrend * 1.2 + eventA * 1.1 + eventB * 0.7 - cooldown * 1.3 + wave * 0.35).toFixed(1)));
      generated.snsNegativeTrend.push(Number((34.6 + softTrend * 2.1 - eventA * 0.7 - eventB * 0.4 + cooldown * 1.8 + lateChurn * 1.2 - wave * 0.3).toFixed(1)));
      generated.loadTimeTrend.push(Number((2.11 + softTrend * 0.05 + eventB * 0.08 + cooldown * 0.05 + lateChurn * 0.04 + Math.max(fineWave, 0) * 0.03).toFixed(2)));
    }

    return {
      labels: [...generated.labels, ...marchTail.labels],
      revenueDaily: [...generated.revenueDaily, ...marchTail.revenueDaily],
      revenueTargetDaily: [...generated.revenueTargetDaily, ...marchTail.revenueTargetDaily],
      dmauTrend: [...generated.dmauTrend, ...marchTail.dmauTrend],
      newUsersTrend: [...generated.newUsersTrend, ...marchTail.newUsersTrend],
      churnUsersTrend: [...generated.churnUsersTrend, ...marchTail.churnUsersTrend],
      walletTrend: [...generated.walletTrend, ...marchTail.walletTrend],
      stoneUseTrend: [...generated.stoneUseTrend, ...marchTail.stoneUseTrend],
      snsPostsTrend: [...generated.snsPostsTrend, ...marchTail.snsPostsTrend],
      snsPositiveTrend: [...generated.snsPositiveTrend, ...marchTail.snsPositiveTrend],
      snsNegativeTrend: [...generated.snsNegativeTrend, ...marchTail.snsNegativeTrend],
      loadTimeTrend: [...generated.loadTimeTrend, ...marchTail.loadTimeTrend]
    };
  }

  function buildPreviousMonthBase() {
    return {
      labels: Array.from({ length: 31 }, (_, index) => `3/${index + 1}`),
      revenueDaily: [1.8, 1.5, 2.0, 1.6, 3.8, 2.4, 1.7, 1.5, 1.6, 2.0, 3.6, 2.5, 1.7, 1.4, 3.4, 2.3, 1.6, 2.0, 1.7, 2.1, 3.9, 2.6, 1.8, 1.5, 3.2, 2.4, 1.6, 2.1, 1.8, 2.2, 1.7],
      revenueTargetDaily: [2.2, 2.2, 2.3, 2.4, 2.4, 2.5, 2.5, 2.4, 2.4, 2.6, 2.5, 2.4, 2.5, 2.5, 2.7, 2.6, 2.5, 2.5, 2.4, 2.5, 2.6, 2.5, 2.4, 2.5, 2.5, 2.7, 2.6, 2.5, 2.5, 2.6, 2.5],
      dmauTrend: [20240, 20290, 20230, 20170, 20110, 20160, 20080, 20020, 20060, 19970, 19910, 19950, 19860, 19800, 19840, 19740, 19680, 19710, 19610, 19540, 19570, 19470, 19410, 19440, 19340, 19270, 19300, 19210, 19140, 19180, 19080],
      newUsersTrend: [61, 64, 62, 67, 63, 65, 69, 66, 64, 68, 70, 67, 65, 69, 72, 68, 66, 71, 69, 67, 64, 63, 66, 68, 70, 67, 65, 64, 66, 69, 67],
      churnUsersTrend: [75, 77, 76, 80, 78, 81, 83, 80, 79, 84, 86, 82, 81, 85, 88, 86, 83, 87, 89, 85, 84, 86, 88, 87, 90, 86, 85, 88, 87, 89, 90],
      walletTrend: [10.7, 10.8, 10.8, 10.9, 10.9, 11.0, 11.0, 11.1, 11.1, 11.0, 11.0, 11.1, 11.2, 11.2, 11.3, 11.3, 11.2, 11.2, 11.3, 11.4, 11.4, 11.3, 11.3, 11.4, 11.5, 11.5, 11.4, 11.4, 11.5, 11.6, 11.6],
      stoneUseTrend: [1100, 1300, 1200, 1700, 5200, 3200, 2000, 1500, 1600, 1900, 5000, 3100, 1800, 1500, 4600, 2800, 1700, 2300, 1900, 2400, 5100, 3300, 2100, 1600, 4700, 2900, 1800, 2400, 2000, 2600, 1900],
      snsPostsTrend: [3040, 3110, 3090, 3160, 3220, 3180, 3260, 3290, 3240, 3310, 3370, 3340, 3290, 3360, 3410, 3380, 3450, 3510, 3470, 3420, 3490, 3540, 3520, 3580, 3610, 3560, 3500, 3550, 3590, 3630, 3600],
      snsPositiveTrend: [26.1, 27.8, 25.4, 28.6, 24.9, 26.7, 23.8, 25.2, 24.1, 27.4, 22.9, 24.6, 23.5, 25.9, 21.8, 23.7, 22.6, 26.4, 24.8, 23.1, 25.6, 22.4, 24.0, 21.9, 23.3, 25.0, 22.7, 24.5, 23.6, 26.2, 24.1],
      snsNegativeTrend: [35.4, 33.9, 36.8, 34.1, 37.6, 35.2, 39.1, 37.8, 38.5, 35.9, 40.4, 38.2, 39.3, 36.7, 41.8, 39.5, 40.6, 37.2, 38.8, 40.1, 37.6, 41.2, 39.7, 42.1, 40.8, 38.9, 41.5, 39.0, 40.2, 37.7, 39.6],
      loadTimeTrend: [2.12, 2.16, 2.11, 2.19, 2.14, 2.18, 2.13, 2.17, 2.15, 2.22, 2.16, 2.20, 2.15, 2.18, 2.24, 2.19, 2.17, 2.21, 2.16, 2.18, 2.23, 2.17, 2.20, 2.16, 2.22, 2.25, 2.18, 2.21, 2.17, 2.19, 2.16]
    };
  }

  function buildMonthlyHistory() {
    const revenueSeason = [-1.2, -2.4, 1.6, -0.8, 0.9, 3.2, 5.6, 2.1, -0.6, 0.4, 1.8, 4.3];
    const dmauSeason = [-240, -180, 20, 110, 180, 260, 320, 280, 140, 80, 120, 240];
    const newUsersSeason = [160, 120, 180, 90, 70, 140, 220, 160, 80, 60, 90, 150];
    const churnUsersSeason = [80, 70, 90, 100, 120, 140, 130, 110, 90, 100, 120, 130];
    const walletSeason = [-0.2, -0.15, -0.05, 0.06, 0.12, 0.16, 0.10, 0.02, -0.04, 0.02, 0.09, 0.16];
    const stoneSeason = [-5400, -6200, -1800, -2600, 1200, 5200, 7800, 4600, 600, 1400, 2800, 6400];
    const snsSeason = [-2600, -1800, -900, 200, 800, 2600, 4200, 3200, 1200, 1600, 2100, 3600];
    const posSeason = [0.8, 0.6, 0.4, 0.2, 0.0, -0.2, -0.4, -0.2, 0.1, 0.2, 0.3, 0.5];
    const negSeason = [-0.5, -0.3, -0.1, 0.2, 0.3, 0.5, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1];
    const loadSeason = [0.03, 0.01, 0.02, 0.03, 0.02, 0.00, -0.01, 0.00, 0.01, 0.02, 0.03, 0.04];
    const payerSeason = [0.25, 0.18, 0.10, 0.05, 0.02, -0.05, -0.08, -0.05, 0.00, 0.04, 0.10, 0.18];
    const arppuSeason = [150, 120, 90, 60, 40, 20, -40, -10, 10, 40, 70, 120];
    const history = [];

    for (let year = 2020; year <= 2026; year += 1) {
      const monthLimit = year === 2026 ? 4 : 12;
      for (let month = 1; month <= monthLimit; month += 1) {
        const index = history.length;
        const growth = year - 2020;
        const wave = Math.sin((index + 1) * 0.62);
        history.push({
          year,
          month,
          label: `${String(year).slice(2)}/${String(month).padStart(2, '0')}`,
          revenue: round(52 + growth * 3.9 + revenueSeason[month - 1] + wave * 2.4, 1),
          dmau: Math.round(17000 + growth * 520 + dmauSeason[month - 1] + wave * 90),
          newUsers: Math.round(2050 + growth * 95 + newUsersSeason[month - 1] + wave * 42),
          churn: Math.round(1840 + growth * 82 + churnUsersSeason[month - 1] - wave * 38),
          wallet: round(10.0 + growth * 0.24 + walletSeason[month - 1] + wave * 0.06, 1),
          stoneUse: Math.round(65000 + growth * 4200 + stoneSeason[month - 1] + wave * 2200),
          snsPosts: Math.round(56000 + growth * 5200 + snsSeason[month - 1] + wave * 2600),
          snsPositive: round(27.9 - growth * 0.28 + posSeason[month - 1] + wave * 0.5, 1),
          snsNegative: round(31.4 + growth * 0.48 + negSeason[month - 1] - wave * 0.4, 1),
          loadTime: round(2.06 + growth * 0.015 + loadSeason[month - 1] + wave * 0.02, 2),
          payerRate: round(3.8 - growth * 0.08 + payerSeason[month - 1] + wave * 0.1, 1),
          arppu: Math.round(5400 + growth * 55 + arppuSeason[month - 1] + wave * 120)
        });
      }
    }

    patchMonthlyPoint(history, 2025, 1, { revenue: 76.4, dmau: 19920, newUsers: 2380, churn: 2050, wallet: 11.3, stoneUse: 77600, snsPosts: 70200, snsPositive: 34.2, snsNegative: 30.8, loadTime: 2.13, payerRate: 3.7, arppu: 6100 });
    patchMonthlyPoint(history, 2025, 2, { revenue: 73.2, dmau: 20140, newUsers: 2850, churn: 2180, wallet: 11.4, stoneUse: 80100, snsPosts: 72800, snsPositive: 36.5, snsNegative: 28.6, loadTime: 2.12, payerRate: 3.6, arppu: 6020 });
    patchMonthlyPoint(history, 2025, 3, { revenue: 82.6, dmau: 20320, newUsers: 2220, churn: 2600, wallet: 11.6, stoneUse: 83500, snsPosts: 75400, snsPositive: 32.1, snsNegative: 33.4, loadTime: 2.15, payerRate: 3.5, arppu: 5960 });
    patchMonthlyPoint(history, 2025, 4, { revenue: 54.0, dmau: 19780, newUsers: 1720, churn: 1490, wallet: 11.8, stoneUse: 68100, snsPosts: 71400, snsPositive: 24.8, snsNegative: 42.7, loadTime: 2.18, payerRate: 3.4, arppu: 5820 });
    patchMonthlyPoint(history, 2025, 5, { revenue: 71.6, dmau: 20060, newUsers: 3100, churn: 2200, snsPositive: 39.2, snsNegative: 27.6 });
    patchMonthlyPoint(history, 2025, 6, { revenue: 96.8, dmau: 20210, newUsers: 2440, churn: 2760, snsPositive: 37.0, snsNegative: 29.8 });
    patchMonthlyPoint(history, 2025, 7, { revenue: 78.4, dmau: 20480, newUsers: 2960, churn: 3180, snsPositive: 24.5, snsNegative: 43.1 });
    patchMonthlyPoint(history, 2025, 8, { revenue: 69.2, dmau: 20620, newUsers: 2180, churn: 2380, snsPositive: 31.8, snsNegative: 32.4 });
    patchMonthlyPoint(history, 2025, 9, { revenue: 84.5, dmau: 20940, newUsers: 2760, churn: 2100, snsPositive: 35.6, snsNegative: 30.2 });
    patchMonthlyPoint(history, 2025, 10, { revenue: 74.1, dmau: 20780, newUsers: 2350, churn: 2520, snsPositive: 33.2, snsNegative: 31.6 });
    patchMonthlyPoint(history, 2025, 11, { revenue: 88.0, dmau: 20610, newUsers: 3180, churn: 2850, snsPositive: 29.4, snsNegative: 37.8 });
    patchMonthlyPoint(history, 2025, 12, { revenue: 103.5, dmau: 20840, newUsers: 2900, churn: 2180, snsPositive: 38.4, snsNegative: 28.9 });
    patchMonthlyPoint(history, 2026, 1, { revenue: 68.2, dmau: 19480, newUsers: 2820, churn: 2100, wallet: 11.8, stoneUse: 80100, snsPosts: 74400, snsPositive: 38.1, snsNegative: 30.4, loadTime: 2.16, payerRate: 3.3, arppu: 5740 });
    patchMonthlyPoint(history, 2026, 2, { revenue: 66.0, dmau: 19720, newUsers: 2360, churn: 2680, wallet: 11.9, stoneUse: 82900, snsPosts: 77100, snsPositive: 34.7, snsNegative: 32.8, loadTime: 2.18, payerRate: 3.2, arppu: 5620 });
    patchMonthlyPoint(history, 2026, 3, { revenue: 72.4, dmau: 19890, newUsers: 3150, churn: 2460, wallet: 12.0, stoneUse: 85400, snsPosts: 79300, snsPositive: 22.6, snsNegative: 45.2, loadTime: 2.20, payerRate: 4.2, arppu: 7200 });
    patchMonthlyPoint(history, 2026, 4, { revenue: 47.1, revenueForecast: 51.8, dmau: 18720, newUsers: 1173, churn: 1526, wallet: 12.1, stoneUse: 55400, stoneUseForecast: 73800, snsPosts: 66370, snsPositive: 28.8, snsNegative: 36.9, loadTime: 2.18, payerRate: 3.0, arppu: 5300 });

    return history;
  }

  function patchMonthlyPoint(history, year, month, overrides) {
    const target = history.find((item) => item.year === year && item.month === month);
    if (target) Object.assign(target, overrides);
  }

  function buildNiceAxis(maxValue, segments = 3) {
    const safeMax = Math.max(maxValue, 1);
    const rawStep = safeMax / segments;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const normalized = rawStep / magnitude;
    const scales = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];
    const niceNormalized = scales.find((scale) => scale >= normalized) || 10;
    const step = niceNormalized * magnitude;
    return { step, max: step * segments, segments };
  }

  function buildNiceRangeAxis(minValue, maxValue, segments = 4) {
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return { min: 0, max: 1, step: 0.25, segments };
    if (minValue === maxValue) {
      const pad = Math.max(Math.abs(minValue) * 0.03, 1);
      minValue -= pad;
      maxValue += pad;
    }
    const range = maxValue - minValue;
    const rawStep = range / segments;
    const magnitude = 10 ** Math.floor(Math.log10(rawStep));
    const normalized = rawStep / magnitude;
    const scales = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];
    const niceNormalized = scales.find((scale) => scale >= normalized) || 10;
    const step = niceNormalized * magnitude;
    const min = Math.floor(minValue / step) * step;
    const max = Math.ceil(maxValue / step) * step;
    return { min, max, step, segments: Math.round((max - min) / step) };
  }

  function buildPointCircles(points, { radius = markerRadius, fill, opacity = 1 } = {}) {
    return points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${fill}" opacity="${opacity}" />`).join('');
  }

  function buildAxisLabelIndexes(length, step = null) {
    const resolvedStep = step || (length <= 6 ? 1 : length <= 12 ? 1 : length <= 30 ? 7 : length <= 60 ? 6 : 12);
    const indexes = [];
    for (let index = 0; index < length; index += resolvedStep) indexes.push(index);
    const lastIndex = length - 1;
    if (indexes[indexes.length - 1] !== lastIndex) {
      const lastGap = lastIndex - indexes[indexes.length - 1];
      if (lastGap <= Math.max(2, Math.floor(resolvedStep / 2))) indexes[indexes.length - 1] = lastIndex;
      else indexes.push(lastIndex);
    }
    return indexes;
  }

  function escapeTooltipHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function encodeTooltip(text) {
    return encodeURIComponent(text);
  }

  function buildTooltipTarget({ x, y, width, height, tooltip }) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="transparent" pointer-events="all" class="tooltip-hotspot" data-tooltip="${encodeTooltip(tooltip)}"></rect>`;
  }

  function renderTooltip(encoded) {
    if (!elements.tooltip) return;
    if (elements.tooltip.dataset.tooltip === encoded) return;
    const decoded = decodeURIComponent(encoded || '');
    elements.tooltip.dataset.tooltip = encoded || '';
    elements.tooltip.innerHTML = decoded.split('\n').map((line) => `<div>${escapeTooltipHtml(line)}</div>`).join('');
  }

  function positionTooltip(event) {
    if (!elements.tooltip) return;
    const offset = 14;
    const rect = elements.tooltip.getBoundingClientRect();
    let left = event.clientX + offset;
    let top = event.clientY + offset;
    if (left + rect.width + 12 > window.innerWidth) left = event.clientX - rect.width - offset;
    if (top + rect.height + 12 > window.innerHeight) top = event.clientY - rect.height - offset;
    elements.tooltip.style.left = `${Math.max(12, left)}px`;
    elements.tooltip.style.top = `${Math.max(12, top)}px`;
  }

  function hideTooltip() {
    if (!elements.tooltip) return;
    elements.tooltip.classList.remove('is-visible');
    elements.tooltip.setAttribute('aria-hidden', 'true');
    elements.tooltip.dataset.tooltip = '';
  }

  function activateTooltip(event) {
    const hotspot = event.target.closest('.tooltip-hotspot');
    if (!hotspot || !elements.tooltip) {
      hideTooltip();
      return;
    }
    renderTooltip(hotspot.getAttribute('data-tooltip') || '');
    elements.tooltip.classList.add('is-visible');
    elements.tooltip.setAttribute('aria-hidden', 'false');
    positionTooltip(event);
  }

  document.addEventListener('pointerover', activateTooltip);
  document.addEventListener('pointermove', activateTooltip);
  document.addEventListener('pointerleave', hideTooltip);
  window.addEventListener('blur', hideTooltip);
  document.addEventListener('scroll', hideTooltip, true);

  function buildSeriesChart({
    primary,
    secondary = null,
    labels,
    width = 640,
    height = 240,
    primaryColor,
    secondaryColor = COLORS.blueSoftLine,
    secondaryStrokeWidth = 2.1,
    secondaryDasharray = null,
    secondaryPointRadius = markerRadius,
    secondaryOpacity = 0.82,
    domainLength = labels.length,
    tickStep = null,
    valueFormatter,
    axisFormatter,
    primaryLabel = '実績',
    secondaryLabel = '比較',
    primaryFill = null,
    forecast = null,
    forecastColor = COLORS.blue,
    forecastStrokeWidth = 2.2,
    forecastDasharray = '6 5',
    forecastLabel = '予測',
    forecastTooltipFromIndex = 0
  }) {
    const padding = { top: 14, right: 54, bottom: 24, left: 54 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const chartValues = [
      ...primary,
      ...(secondary || []),
      ...(forecast || [])
    ].filter((value) => Number.isFinite(value));
    const axis = buildNiceAxis(Math.max(...chartValues) * 1.03);
    const maxValue = axis.max;
    const step = plotWidth / domainLength;
    const scaleY = (value) => padding.top + plotHeight - (value / maxValue) * plotHeight;
    const hasValue = (series, index) => Boolean(series) && index < series.length && Number.isFinite(series[index]);
    const formatSeriesValue = (series, index) => (hasValue(series, index) ? valueFormatter(series[index]) : '未確定');
    const buildPath = (points) => points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const buildSeriesPoints = (series) => series
      .map((value, index) => Number.isFinite(value)
        ? { x: padding.left + step * index + step / 2, y: scaleY(value), value, index }
        : null)
      .filter(Boolean);

    const grid = Array.from({ length: 4 }, (_, index) => {
      const y = padding.top + (plotHeight / 3) * index;
      return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${COLORS.grid}" stroke-dasharray="4 6" />`;
    }).join('');
    const yLabels = Array.from({ length: axis.segments + 1 }, (_, index) => {
      const value = axis.max - axis.step * index;
      const y = padding.top + (plotHeight / axis.segments) * index;
      return `<text x="${padding.left - 8}" y="${y + 3}" fill="${COLORS.axis}" font-size="9.5" font-weight="500" font-family="${axisFontFamily}" letter-spacing="-0.02em" text-anchor="end">${axisFormatter(value)}</text>`;
    }).join('');

    const primaryPoints = buildSeriesPoints(primary);
    const primaryPath = buildPath(primaryPoints);
    const primaryAreaPath = primaryFill && primaryPoints.length
      ? `${primaryPath} L ${primaryPoints[primaryPoints.length - 1].x} ${scaleY(0)} L ${primaryPoints[0].x} ${scaleY(0)} Z`
      : '';
    const secondaryPoints = secondary ? buildSeriesPoints(secondary) : [];
    const secondaryPath = buildPath(secondaryPoints);
    const forecastPoints = forecast ? buildSeriesPoints(forecast) : [];
    const forecastPath = buildPath(forecastPoints);

    const tickIndexes = buildAxisLabelIndexes(domainLength, tickStep);
    const xLabels = tickIndexes.map((actualIndex) => {
      const x = padding.left + step * actualIndex + step / 2;
      return `<text x="${x}" y="${height - 8}" fill="${COLORS.axisSoft}" font-size="10" font-weight="500" font-family="${axisFontFamily}" letter-spacing="-0.02em" text-anchor="middle">${labels[actualIndex]}</text>`;
    }).join('');

    const hoverBands = Array.from({ length: domainLength }, (_, index) => {
      const x = padding.left + step * index;
      const title = [
        labels[index],
        hasValue(primary, index) ? `${primaryLabel} ${formatSeriesValue(primary, index)}` : null,
        forecast && index >= forecastTooltipFromIndex && hasValue(forecast, index) ? `${forecastLabel} ${formatSeriesValue(forecast, index)}` : null,
        secondary && hasValue(secondary, index) ? `${secondaryLabel} ${formatSeriesValue(secondary, index)}` : null
      ].filter(Boolean).join('\n');
      return buildTooltipTarget({ x, y: padding.top, width: step, height: plotHeight, tooltip: title });
    }).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" style="font-family:${axisFontFamily}" role="img">
        ${grid}
        ${yLabels}
        ${primaryAreaPath ? `<path d="${primaryAreaPath}" fill="${primaryFill}" />` : ''}
        ${secondary ? `<path d="${secondaryPath}" fill="none" stroke="${secondaryColor}" stroke-width="${secondaryStrokeWidth}" ${secondaryDasharray ? `stroke-dasharray="${secondaryDasharray}"` : ''} stroke-linecap="round" stroke-linejoin="round" />` : ''}
        <path d="${primaryPath}" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${forecast ? `<path d="${forecastPath}" fill="none" stroke="${forecastColor}" stroke-width="${forecastStrokeWidth}" stroke-dasharray="${forecastDasharray}" stroke-linecap="round" stroke-linejoin="round" />` : ''}
        ${secondary && secondaryPointRadius > 0 ? buildPointCircles(secondaryPoints, { radius: secondaryPointRadius, fill: secondaryColor, opacity: secondaryOpacity }) : ''}
        ${forecast ? buildPointCircles(forecastPoints, { fill: forecastColor, opacity: 0.9 }) : ''}
        ${buildPointCircles(primaryPoints, { fill: primaryColor })}
        ${xLabels}
        ${hoverBands}
      </svg>
    `;
  }

  function buildPlayerChart({
    dmau,
    newUsers,
    churn,
    labels,
    comparisonDmau = null,
    comparisonNewUsers = null,
    comparisonChurn = null,
    comparisonDasharray = null,
    comparisonDmauDasharray = comparisonDasharray,
    comparisonFlowDasharray = comparisonDasharray,
    comparisonNewUsersLabel = '比較新規ユーザー数',
    comparisonChurnLabel = '比較既存顧客離脱数',
    width = 640,
    height = 240,
    domainLength = labels.length,
    tickStep = null,
    dmauLabel = 'rDAU',
    comparisonLabel = '前年rDAU'
  }) {
    const padding = { top: 18, right: 54, bottom: 28, left: 54 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const dmauAxis = buildNiceRangeAxis(
      Math.min(...dmau, ...(comparisonDmau || [])) - 120,
      Math.max(...dmau, ...(comparisonDmau || [])) + 120
    );
    const dmauRange = dmauAxis.max - dmauAxis.min || 1;
    const secondaryAxis = buildNiceAxis(Math.max(...newUsers, ...churn, ...(comparisonNewUsers || []), ...(comparisonChurn || [])) * 1.05);
    const secondaryMax = secondaryAxis.max;
    const step = plotWidth / domainLength;
    const yDmau = (value) => padding.top + plotHeight - ((value - dmauAxis.min) / dmauRange) * plotHeight;
    const ySecondary = (value) => padding.top + plotHeight - (value / secondaryMax) * plotHeight;

    const grid = Array.from({ length: 4 }, (_, index) => {
      const y = padding.top + (plotHeight / 3) * index;
      return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="${COLORS.grid}" stroke-dasharray="4 6" />`;
    }).join('');
    const leftLabels = Array.from({ length: dmauAxis.segments + 1 }, (_, index) => {
      const value = dmauAxis.max - dmauAxis.step * index;
      const y = padding.top + (plotHeight / dmauAxis.segments) * index;
      return `<text x="${padding.left - 8}" y="${y + 3}" fill="${COLORS.axis}" font-size="9.5" font-weight="500" font-family="${axisFontFamily}" letter-spacing="-0.02em" text-anchor="end">${formatCompactNumberAxis(value)}</text>`;
    }).join('');
    const rightLabels = Array.from({ length: secondaryAxis.segments + 1 }, (_, index) => {
      const value = secondaryAxis.max - secondaryAxis.step * index;
      const y = padding.top + (plotHeight / secondaryAxis.segments) * index;
      return `<text x="${width - padding.right + 8}" y="${y + 3}" fill="${COLORS.axis}" font-size="9.5" font-weight="500" font-family="${axisFontFamily}" letter-spacing="-0.02em" text-anchor="start">${formatNumber(value)}</text>`;
    }).join('');

    const primaryPoints = dmau.map((value, index) => ({ x: padding.left + step * index + step / 2, y: yDmau(value) }));
    const primaryPath = primaryPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const comparePoints = comparisonDmau ? comparisonDmau.map((value, index) => ({ x: padding.left + step * index + step / 2, y: yDmau(value) })) : [];
    const comparePath = comparePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const newUserPoints = newUsers.map((value, index) => ({ x: padding.left + step * index + step / 2, y: ySecondary(value) }));
    const churnPoints = churn.map((value, index) => ({ x: padding.left + step * index + step / 2, y: ySecondary(value) }));
    const newUserPath = newUserPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const churnPath = churnPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const compareNewUserPoints = comparisonNewUsers ? comparisonNewUsers.map((value, index) => ({ x: padding.left + step * index + step / 2, y: ySecondary(value) })) : [];
    const compareChurnPoints = comparisonChurn ? comparisonChurn.map((value, index) => ({ x: padding.left + step * index + step / 2, y: ySecondary(value) })) : [];
    const compareNewUserPath = compareNewUserPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const compareChurnPath = compareChurnPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const compareDmauDashAttr = comparisonDmauDasharray ? `stroke-dasharray="${comparisonDmauDasharray}"` : '';
    const compareFlowDashAttr = comparisonFlowDasharray ? `stroke-dasharray="${comparisonFlowDasharray}"` : '';

    const tickIndexes = buildAxisLabelIndexes(domainLength, tickStep);
    const xLabels = tickIndexes.map((actualIndex) => {
      const x = padding.left + step * actualIndex + step / 2;
      return `<text x="${x}" y="${height - 8}" fill="${COLORS.axisSoft}" font-size="10" font-weight="500" font-family="${axisFontFamily}" letter-spacing="-0.02em" text-anchor="middle">${labels[actualIndex]}</text>`;
    }).join('');

    const hoverBands = Array.from({ length: domainLength }, (_, index) => {
      const x = padding.left + step * index;
      const title = [
        labels[index],
        `${dmauLabel} ${index < dmau.length ? formatNumber(dmau[index]) : '未確定'}`,
        comparisonDmau ? `${comparisonLabel} ${index < comparisonDmau.length ? formatNumber(comparisonDmau[index]) : '未確定'}` : null,
        `新規ユーザー数 ${index < newUsers.length ? formatNumber(newUsers[index]) : '未確定'}`,
        comparisonNewUsers ? `${comparisonNewUsersLabel} ${index < comparisonNewUsers.length ? formatNumber(comparisonNewUsers[index]) : '未確定'}` : null,
        `既存顧客離脱数 ${index < churn.length ? formatNumber(churn[index]) : '未確定'}`,
        comparisonChurn ? `${comparisonChurnLabel} ${index < comparisonChurn.length ? formatNumber(comparisonChurn[index]) : '未確定'}` : null
      ].filter(Boolean).join('\n');
      return buildTooltipTarget({ x, y: padding.top, width: step, height: plotHeight, tooltip: title });
    }).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" style="font-family:${axisFontFamily}" role="img">
        ${grid}
        ${leftLabels}
        ${rightLabels}
        ${comparisonNewUsers ? `<path d="${compareNewUserPath}" fill="none" stroke="${COLORS.green}" stroke-width="1.7" ${compareFlowDashAttr} stroke-linecap="round" stroke-linejoin="round" opacity="0.45" />` : ''}
        ${comparisonChurn ? `<path d="${compareChurnPath}" fill="none" stroke="${COLORS.red}" stroke-width="1.7" ${compareFlowDashAttr} stroke-linecap="round" stroke-linejoin="round" opacity="0.45" />` : ''}
        <path d="${newUserPath}" fill="none" stroke="${COLORS.green}" stroke-width="1.9" stroke-dasharray="5 5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
        <path d="${churnPath}" fill="none" stroke="${COLORS.red}" stroke-width="1.9" stroke-dasharray="5 5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
        ${comparisonDmau ? `<path d="${comparePath}" fill="none" stroke="${COLORS.blueSoftLine}" stroke-width="2.1" ${compareDmauDashAttr} stroke-linecap="round" stroke-linejoin="round" />` : ''}
        <path d="${primaryPath}" fill="none" stroke="${COLORS.blueDeep}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${buildPointCircles(newUserPoints, { radius: 1.7, fill: COLORS.green, opacity: 0.9 })}
        ${buildPointCircles(churnPoints, { radius: 1.7, fill: COLORS.red, opacity: 0.9 })}
        ${comparisonDmau && !comparisonDmauDasharray ? buildPointCircles(comparePoints, { fill: COLORS.blueSoftLine, opacity: 0.82 }) : ''}
        ${buildPointCircles(primaryPoints, { fill: COLORS.blueDeep })}
        ${xLabels}
        ${hoverBands}
      </svg>
    `;
  }

  function buildSpark({
    series,
    labels,
    width = 280,
    height = 108,
    color = COLORS.blue,
    fill = COLORS.blueSoft,
    benchmarkValue = null,
    benchmarkLabel = '平均',
    benchmarkColor = null,
    comparisonSeries = null,
    comparisonLabel = '比較',
    comparisonColor = COLORS.blueSoftLine,
    comparisonDasharray = null,
    forecastSeries = null,
    forecastLabel = '予測',
    forecastColor = color,
    forecastDasharray = '5 5',
    forecastTooltipFromIndex = 0,
    valueFormatter,
    valueLabel = '実績'
  }) {
    const padding = { top: 10, right: 4, bottom: 8, left: 4 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const allValues = [
      ...series,
      ...(comparisonSeries || []),
      ...(forecastSeries || []),
      ...(benchmarkValue === null || benchmarkValue === undefined ? [] : [benchmarkValue])
    ].filter((value) => Number.isFinite(value));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue || Math.max(Math.abs(maxValue) * 0.08, 1);
    const axis = buildNiceRangeAxis(minValue - range * 0.14, maxValue + range * 0.14, 4);
    const scaleX = (index) => {
      if (labels.length <= 1) return padding.left + plotWidth / 2;
      return padding.left + (plotWidth / (labels.length - 1)) * index;
    };
    const scaleY = (value) => padding.top + plotHeight - ((value - axis.min) / (axis.max - axis.min || 1)) * plotHeight;

    const buildSeriesPoints = (targetSeries) => targetSeries
      .map((value, index) => Number.isFinite(value) ? { x: scaleX(index), y: scaleY(value), value, index } : null)
      .filter(Boolean);
    const buildPath = (targetPoints) => targetPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

    const points = buildSeriesPoints(series);
    const path = buildPath(points);
    const areaPath = points.length
      ? `M ${points[0].x} ${padding.top + plotHeight} ${points.map((point) => `L ${point.x} ${point.y}`).join(' ')} L ${points[points.length - 1].x} ${padding.top + plotHeight} Z`
      : '';
    const benchmarkLine = benchmarkValue === null || benchmarkValue === undefined
      ? ''
      : `<line x1="${padding.left}" y1="${scaleY(benchmarkValue)}" x2="${width - padding.right}" y2="${scaleY(benchmarkValue)}" stroke="${benchmarkColor || comparisonColor}" stroke-width="1.8" stroke-dasharray="4 4" />`;

    const comparisonPoints = comparisonSeries ? buildSeriesPoints(comparisonSeries) : [];
    const comparisonPath = buildPath(comparisonPoints);
    const forecastPoints = forecastSeries ? buildSeriesPoints(forecastSeries) : [];
    const forecastPath = buildPath(forecastPoints);

    const safeFormat = (value) => (value === undefined || value === null ? '未確定' : valueFormatter(value));
    const hoverBands = labels.map((label, index) => {
      const currentX = scaleX(index);
      const leftEdge = index === 0 ? padding.left : (scaleX(index - 1) + currentX) / 2;
      const rightEdge = index === labels.length - 1 ? width - padding.right : (currentX + scaleX(index + 1)) / 2;
      const tooltip = [
        label,
        Number.isFinite(series[index]) ? `${valueLabel} ${safeFormat(series[index])}` : null,
        forecastSeries && index >= forecastTooltipFromIndex && Number.isFinite(forecastSeries[index]) ? `${forecastLabel} ${safeFormat(forecastSeries[index])}` : null,
        benchmarkValue === null || benchmarkValue === undefined ? null : `${benchmarkLabel} ${valueFormatter(benchmarkValue)}`,
        comparisonSeries ? `${comparisonLabel} ${safeFormat(comparisonSeries[index])}` : null
      ].filter(Boolean).join('\n');
      return buildTooltipTarget({ x: leftEdge, y: padding.top, width: rightEdge - leftEdge, height: plotHeight, tooltip });
    }).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" style="font-family:${axisFontFamily}" role="img">
        ${benchmarkLine}
        ${comparisonSeries ? `<path d="${comparisonPath}" fill="none" stroke="${comparisonColor}" stroke-width="1.8" ${comparisonDasharray ? `stroke-dasharray="${comparisonDasharray}"` : ''} stroke-linecap="round" stroke-linejoin="round" />` : ''}
        ${comparisonSeries && !comparisonDasharray ? buildPointCircles(comparisonPoints, { fill: comparisonColor, opacity: 0.82 }) : ''}
        ${areaPath ? `<path d="${areaPath}" fill="${fill}" />` : ''}
        <path d="${path}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        ${forecastSeries ? `<path d="${forecastPath}" fill="none" stroke="${forecastColor}" stroke-width="2.2" stroke-dasharray="${forecastDasharray}" stroke-linecap="round" stroke-linejoin="round" />` : ''}
        ${forecastSeries ? buildPointCircles(forecastPoints, { fill: forecastColor, opacity: 0.9 }) : ''}
        ${buildPointCircles(points, { fill: color })}
        ${hoverBands}
      </svg>
    `;
  }

  function buildSnsSpark({
    posts,
    positive,
    negative,
    labels,
    width = 280,
    height = 108,
    benchmarkValue = null,
    benchmarkLabel = '平均',
    comparisonPosts = null,
    comparisonPositive = null,
    comparisonNegative = null,
    comparisonDasharray = null,
    comparisonLabel = '比較投稿数'
  }) {
    const padding = { top: 10, right: 4, bottom: 8, left: 4 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const postAxis = buildNiceAxis(Math.max(...posts, ...(comparisonPosts || []), ...(benchmarkValue === null || benchmarkValue === undefined ? [] : [benchmarkValue])) * 1.08);
    const scalePostY = (value) => padding.top + plotHeight - (value / postAxis.max) * plotHeight;
    const percentMin = 0;
    const percentMax = 100;
    const scalePercentY = (value) => padding.top + plotHeight - ((value - percentMin) / (percentMax - percentMin || 1)) * plotHeight;
    const step = plotWidth / labels.length;
    const centerX = (index) => padding.left + step * index + step / 2;
    const postPoints = posts.map((value, index) => ({ x: centerX(index), y: scalePostY(value) }));
    const postPath = postPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const positivePoints = positive.map((value, index) => ({ x: centerX(index), y: scalePercentY(value) }));
    const negativePoints = negative.map((value, index) => ({ x: centerX(index), y: scalePercentY(value) }));
    const positivePath = positivePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const negativePath = negativePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const comparisonPoints = comparisonPosts ? comparisonPosts.map((value, index) => ({ x: centerX(index), y: scalePostY(value) })) : [];
    const comparisonPath = comparisonPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const comparisonPositivePoints = comparisonPositive ? comparisonPositive.map((value, index) => ({ x: centerX(index), y: scalePercentY(value) })) : [];
    const comparisonNegativePoints = comparisonNegative ? comparisonNegative.map((value, index) => ({ x: centerX(index), y: scalePercentY(value) })) : [];
    const comparisonPositivePath = comparisonPositivePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const comparisonNegativePath = comparisonNegativePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const comparisonDashAttr = comparisonDasharray ? `stroke-dasharray="${comparisonDasharray}"` : '';
    const comparisonSentimentDashAttr = `stroke-dasharray="${comparisonDasharray || '5 5'}"`;
    const benchmarkLine = benchmarkValue === null || benchmarkValue === undefined
      ? ''
      : `<line x1="${padding.left}" y1="${scalePostY(benchmarkValue)}" x2="${width - padding.right}" y2="${scalePostY(benchmarkValue)}" stroke="${COLORS.blueSoftLine}" stroke-width="1.8" stroke-dasharray="4 4" />`;

    const safeNumber = (value, suffix = '') => (value === undefined || value === null ? '未確定' : `${formatNumber(value)}${suffix}`);
    const safePercent = (value) => (value === undefined || value === null ? '未確定' : formatPercent(value));
    const hoverBands = labels.map((label, index) => {
      const tooltip = [
        label,
        `投稿数 ${safeNumber(posts[index], '件')}`,
        benchmarkValue === null || benchmarkValue === undefined ? null : `${benchmarkLabel} ${formatNumber(benchmarkValue)}件`,
        comparisonPosts ? `${comparisonLabel} ${safeNumber(comparisonPosts[index], '件')}` : null,
        `ポジ ${safePercent(positive[index])}`,
        comparisonPositive ? `前月ポジ ${safePercent(comparisonPositive[index])}` : null,
        `ネガ ${safePercent(negative[index])}`,
        comparisonNegative ? `前月ネガ ${safePercent(comparisonNegative[index])}` : null
      ].filter(Boolean).join('\n');
      return buildTooltipTarget({
        x: padding.left + step * index,
        y: padding.top,
        width: step,
        height: plotHeight,
        tooltip
      });
    }).join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" style="font-family:${axisFontFamily}" role="img">
        ${benchmarkLine}
        ${comparisonPosts ? `<path d="${comparisonPath}" fill="none" stroke="${COLORS.blueSoftLine}" stroke-width="1.8" ${comparisonDashAttr} stroke-linecap="round" stroke-linejoin="round" />` : ''}
        ${comparisonPositive ? `<path d="${comparisonPositivePath}" fill="none" stroke="${COLORS.green}" stroke-width="1.6" ${comparisonSentimentDashAttr} stroke-linecap="round" stroke-linejoin="round" opacity="0.42" />` : ''}
        ${comparisonNegative ? `<path d="${comparisonNegativePath}" fill="none" stroke="${COLORS.red}" stroke-width="1.6" ${comparisonSentimentDashAttr} stroke-linecap="round" stroke-linejoin="round" opacity="0.42" />` : ''}
        ${comparisonPosts && !comparisonDasharray ? buildPointCircles(comparisonPoints, { fill: COLORS.blueSoftLine, opacity: 0.82 }) : ''}
        <path d="${postPath}" fill="none" stroke="${COLORS.blue}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${positivePath}" fill="none" stroke="${COLORS.green}" stroke-width="2.0" stroke-dasharray="5 5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${negativePath}" fill="none" stroke="${COLORS.red}" stroke-width="2.0" stroke-dasharray="5 5" stroke-linecap="round" stroke-linejoin="round" />
        ${buildPointCircles(postPoints, { radius: 1.8, fill: COLORS.blue })}
        ${buildPointCircles(positivePoints, { fill: COLORS.green })}
        ${buildPointCircles(negativePoints, { fill: COLORS.red })}
        ${hoverBands}
      </svg>
    `;
  }

  function buildLegend(items) {
    return items.map((item) => {
      if (item.type === 'bar') return `<span><i class="bar" style="background:${item.color}"></i>${item.label}</span>`;
      const breakBefore = item.breakBefore ? '<span class="legend-break"></span>' : '';
      return `${breakBefore}<span style="color:${item.color}"><i class="line ${item.dashed ? 'is-dashed' : ''}"></i>${item.label}</span>`;
    }).join('');
  }

  function buildInfoTip(label, body) {
    return `
      <span class="insight-tip">
        <button class="insight-button" type="button" aria-label="${label}を表示">?</button>
        <span class="insight-popover" role="tooltip">
          <span class="insight-kicker">${label}</span>
          <span class="insight-copy">${body}</span>
        </span>
      </span>
    `;
  }

  function renderMetricCards(container, cards) {
    if (!cards.length) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    container.style.removeProperty('display');
    container.style.removeProperty('grid-template-columns');
    container.innerHTML = cards.map((card) => `
      <div class="delta">
        <span class="${card.tone || ''}">${card.label}</span>
        <strong>${card.value}</strong>
        ${card.meta ? `<div class="delta-meta">${card.meta}</div>` : ''}
      </div>
    `).join('');
  }

  function renderDmauCards(cards) {
    elements.dmauMetrics.innerHTML = cards.map((card) => `
      <div class="dmau-card">
        <span class="meta ${card.tone || ''}">${card.label}</span>
        <small>${card.value}</small>
        ${card.sub ? `<small class="subtle">${card.sub}</small>` : ''}
      </div>
    `).join('');
  }

  function renderSignalCards(cards) {
    elements.signalGrid.innerHTML = cards.map((card) => `
      <article class="card signal-card ${card.className || ''}">
        <div class="card-body">
          <div class="info">
            ${tooltipMode ? `
              <div class="label-row">
                <div class="label">${card.title}</div>
                ${buildInfoTip(`${card.title}の見方`, card.note)}
              </div>
            ` : `<div class="label">${card.title}</div>`}
            <div class="value ${card.isAlert ? 'is-alert' : ''}">${card.value}</div>
            ${card.balance ? `
              <div class="sns-meta">
                <p class="sub">${card.sub}</p>
                <div class="sns-balance">
                  <span class="pos">ポジ ${formatPercent(card.balance.pos)}</span>
                  <span class="neg">ネガ ${formatPercent(card.balance.neg)}</span>
                </div>
              </div>
            ` : `<p class="sub">${card.sub}</p>`}
            ${tooltipMode ? '' : `<p class="signal-note">${card.note}</p>`}
          </div>
          <div class="chart-side">
            <div class="spark">${card.chart}</div>
            <div class="spark-meta">
              <span>${card.startLabel}</span>
              <span>${card.endLabel}</span>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  function getScopeOptions() {
    return [
      { id: 'month', label: '今月' },
      { id: 'yearOverYear', label: '前年比' }
    ];
  }

  function renderControls() {
    const scopeOptions = getScopeOptions();
    elements.scopeToggle.innerHTML = scopeOptions.map((option) => `
      <button type="button" class="segment-button toggle-button ${state.scope === option.id ? 'is-active' : ''}" data-scope="${option.id}" aria-pressed="${state.scope === option.id}">
        ${option.label}
      </button>
    `).join('');
    elements.scopeToggle.querySelectorAll('[data-scope]').forEach((button) => {
      button.addEventListener('click', () => {
        state.scope = button.dataset.scope;
        render();
      });
    });
  }

  function buildSignal(title, value, sub, note, chart, startLabel, endLabel, extra = {}) {
    return { title, value, sub, note, chart, startLabel, endLabel, ...extra };
  }

  function buildCurrentMonthView({ comparePreviousMonth = false } = {}) {
    const revenueActual = sum(currentMonthVisible.revenueDaily);
    const revenueTargetToDate = sum(currentMonthVisible.revenueTargetDaily);
    const revenueTargetFull = sum(currentMonthBase.revenueTargetDaily);
    const currentRevenueSeries = cumulative(currentMonthVisible.revenueDaily);
    const targetRevenueSeries = currentMonthBase.labels.map(() => revenueTargetFull);
    const futureRevenueForecastDaily = [2.7, 2.4, 2.8, 1.9, 5.6, 3.5, 2.5, 2.2, 4.8, 3.1, 2.3, 2.9];
    const revenueForecastCumulative = cumulative([
      ...currentMonthVisible.revenueDaily,
      ...futureRevenueForecastDaily
    ]);
    const revenueForecastSeries = currentMonthBase.labels.map((_, index) => (
      index >= reportDay - 1 ? revenueForecastCumulative[index] : null
    ));
    const revenueForecastFull = last(revenueForecastCumulative);
    const previousRevenueSeries = cumulative(previousMonthBase.revenueDaily.slice(0, currentMonthBase.labels.length));
    const previousRevenueToDate = last(cumulative(previousMonthBase.revenueDaily.slice(0, reportDay)));
    const dmauNow = last(currentMonthVisible.dmauTrend);
    const newUsersTotal = sum(currentMonthVisible.newUsersTrend);
    const churnTotal = sum(currentMonthVisible.churnUsersTrend);
    const previousNewUsersTotal = sum(previousMonthBase.newUsersTrend);
    const previousChurnTotal = sum(previousMonthBase.churnUsersTrend);
    const stoneCumulative = cumulative(currentMonthVisible.stoneUseTrend);
    const previousStoneCumulative = cumulative(previousMonthBase.stoneUseTrend.slice(0, currentMonthBase.labels.length));
    const previousStoneToDate = last(cumulative(previousMonthVisible.stoneUseTrend));
    const previousWalletSameDay = last(previousMonthVisible.walletTrend);
    const previousSnsSameDay = last(previousMonthVisible.snsPostsTrend);

    return {
      period: '2026/04/01 - 2026/04/18',
      revenueTitle: '累計売上',
      revenueDescription: comparePreviousMonth
        ? '青線は今月累計、薄い破線は前月累計。<br>到達目標ではなく、前月同日比で足元の強弱を見る。'
        : '今月の売上状況を見る。<br>実線は現時点実績、破線は販売施策の着地予測。<br>売上が不足している場合は、売上が不足している要因（課金率、課金単価など）を探る。<br>短期的な目標達成よりも、長期的/持続的な目標達成を目指す。',
      revenueMetricLabel: '累計売上',
      revenueValue: formatCurrencyInt(revenueActual),
      revenueHint: comparePreviousMonth
        ? `前月同日 ${formatCurrencyInt(previousRevenueToDate)}`
        : `到達目標 ${formatCurrencyInt(revenueTargetFull)}`,
      revenueLegend: buildLegend(comparePreviousMonth
        ? [
          { label: '今月累計売上', color: COLORS.blue, type: 'line' },
          { label: '前月累計売上', color: COLORS.blueSoftLine, type: 'line', dashed: true, breakBefore: true }
        ]
        : [
          { label: '累計売上', color: COLORS.blue, type: 'line' },
          { label: '予測売上', color: COLORS.blue, type: 'line', dashed: true },
          { label: '月次目標', color: COLORS.axisSoft, type: 'line' }
        ]),
      revenueMetrics: [
        comparePreviousMonth
          ? { label: '前月同日差', value: formatCurrencyDiff(revenueActual - previousRevenueToDate) }
          : { label: '着地予測差', value: formatCurrencyDiff(revenueForecastFull - revenueTargetFull) },
        {
          label: '課金率',
          value: formatPercent(currentMonthBase.payerRate),
          meta: comparePreviousMonth
            ? `前月実績 ${formatPercent(previousMonthSummary.payerRate)}`
            : `直近12ヵ月平均 ${formatPercent(currentMonthBase.payerRateYearlyAverage)}`
        },
        {
          label: '課金者1人あたり売上',
          value: formatYen(currentMonthBase.arppu),
          meta: comparePreviousMonth
            ? `前月実績 ${formatYen(previousMonthSummary.arppu)}`
            : `直近12ヵ月平均 ${formatYen(currentMonthBase.arppuYearlyAverage)}`
        }
      ],
      revenueChart: buildSeriesChart({
        primary: currentRevenueSeries,
        secondary: comparePreviousMonth ? previousRevenueSeries : targetRevenueSeries,
        labels: currentMonthBase.labels,
        domainLength: currentMonthBase.labels.length,
        tickStep: 7,
        primaryColor: COLORS.blue,
        secondaryColor: comparePreviousMonth ? COLORS.blueSoftLine : COLORS.axisSoft,
        secondaryStrokeWidth: comparePreviousMonth ? 2.1 : 1.8,
        secondaryDasharray: comparePreviousMonth ? '5 5' : null,
        secondaryPointRadius: 0,
        forecast: comparePreviousMonth ? null : revenueForecastSeries,
        forecastColor: COLORS.blue,
        forecastLabel: '予測売上',
        valueFormatter: formatCurrencyInt,
        axisFormatter: formatCurrencyAxis,
        primaryLabel: '累計売上',
        secondaryLabel: comparePreviousMonth ? '前月累計売上' : '月次目標',
        primaryFill: COLORS.blueSoft
      }),
      dmauDescription: 'ログボ勢を除いたrDAU（Real Daily Active User）を見る。<br>重要度は、既に定着した既存顧客＞定着するか分からない新規顧客。<br>離脱したユーザーは戻ってこないので、理想としては離脱するような施策を避けたり、熱量の下がってるユーザーが離脱する前に手を打つこと。',
      dmauMetricLabel: 'rDAU',
      dmauValue: formatNumber(dmauNow),
      dmauHint: comparePreviousMonth
        ? `前月月末 ${formatNumber(last(previousMonthBase.dmauTrend))}`
        : `月初比 ${formatSignedNumber(dmauNow - first(currentMonthVisible.dmauTrend))}`,
      dmauCards: [
        {
          label: '新規ユーザー数',
          value: `月初比 ${formatNumber(newUsersTotal)}`,
          sub: comparePreviousMonth
            ? `前月月末実績 ${formatNumber(previousNewUsersTotal)}`
            : `直近12ヵ月平均 ${formatNumber(currentMonthBase.newUsersMonthlyAverage)}`,
          tone: 'is-green'
        },
        {
          label: '既存顧客離脱数',
          value: `月初比 ${formatNumber(churnTotal)}`,
          sub: comparePreviousMonth
            ? `前月月末実績 ${formatNumber(previousChurnTotal)}`
            : `直近12ヵ月平均 ${formatNumber(currentMonthBase.churnUsersMonthlyAverage)}`,
          tone: 'is-red'
        }
      ],
      dmauLineLegend: buildLegend([
        { label: 'rDAU', color: COLORS.blueDeep, type: 'line' },
        { label: '新規ユーザー数', color: COLORS.green, type: 'line', dashed: true },
        { label: '既存顧客離脱数', color: COLORS.red, type: 'line', dashed: true },
        ...(comparePreviousMonth
          ? [
            { label: '前月rDAU', color: COLORS.blueSoftLine, type: 'line', dashed: true, breakBefore: true },
            { label: '前月新規ユーザー数', color: COLORS.greenSoftLine, type: 'line', dashed: true },
            { label: '前月既存顧客離脱数', color: COLORS.redSoftLine, type: 'line', dashed: true }
          ]
          : [])
      ]),
      dmauBarLegend: '',
      dmauChart: buildPlayerChart({
        dmau: currentMonthVisible.dmauTrend,
        newUsers: currentMonthVisible.newUsersTrend,
        churn: currentMonthVisible.churnUsersTrend,
        labels: currentMonthBase.labels,
        comparisonDmau: comparePreviousMonth ? previousMonthBase.dmauTrend.slice(0, currentMonthBase.labels.length) : null,
        comparisonNewUsers: comparePreviousMonth ? previousMonthBase.newUsersTrend.slice(0, currentMonthBase.labels.length) : null,
        comparisonChurn: comparePreviousMonth ? previousMonthBase.churnUsersTrend.slice(0, currentMonthBase.labels.length) : null,
        comparisonDasharray: comparePreviousMonth ? '5 5' : null,
        domainLength: currentMonthBase.labels.length,
        tickStep: 7,
        dmauLabel: 'rDAU',
        comparisonLabel: '前月rDAU'
      }),
      signals: [
        buildSignal(
          '累計石消費数',
          formatNumber(last(stoneCumulative)),
          comparePreviousMonth
            ? `前月同日累計 ${formatNumber(previousStoneToDate)}`
            : `直近12ヵ月同日平均 ${formatNumber(stoneUseSameDayAverage)}`,
          notes.stone,
          buildSpark({
            series: stoneCumulative,
            labels: currentMonthBase.labels,
            comparisonSeries: comparePreviousMonth ? previousStoneCumulative : stoneUseSameDayAverageSeries,
            comparisonLabel: comparePreviousMonth ? '前月累計' : '直近12ヵ月同日平均',
            comparisonDasharray: comparePreviousMonth ? '5 5' : '4 4',
            valueFormatter: formatNumber,
            valueLabel: '累計石消費数'
          }),
          '4/1',
          '4/30'
        ),
        buildSignal(
          'rDAUの平均石保有数',
          formatStoneHoldings(last(currentMonthVisible.walletTrend)),
          comparePreviousMonth
            ? `前月同日 ${formatStoneHoldings(previousWalletSameDay)}`
            : `直近12ヵ月平均 ${formatStoneHoldings(currentMonthBase.walletYearlyAverage)}`,
          notes.wallet,
          buildSpark({
            series: currentMonthVisible.walletTrend,
            labels: currentMonthBase.labels,
            fill: 'transparent',
            benchmarkValue: comparePreviousMonth ? null : currentMonthBase.walletYearlyAverage,
            benchmarkLabel: comparePreviousMonth ? '前月同日' : '直近12ヵ月平均',
            comparisonSeries: comparePreviousMonth ? previousMonthBase.walletTrend.slice(0, currentMonthBase.labels.length) : null,
            comparisonLabel: '前月',
            comparisonDasharray: comparePreviousMonth ? '5 5' : null,
            valueFormatter: formatStoneHoldings,
            valueLabel: '平均石保有数'
          }),
          '4/1',
          '4/30'
        ),
        buildSignal(
          'SNS投稿数と反応',
          `${formatNumber(last(currentMonthVisible.snsPostsTrend))}件`,
          comparePreviousMonth
            ? `前月同日 ${formatNumber(previousSnsSameDay)}件`
            : `直近12ヵ月日毎平均 ${formatNumber(dailyBenchmarks.snsPostsDailyAverage)}件`,
          notes.sns,
          buildSnsSpark({
            posts: currentMonthVisible.snsPostsTrend,
            positive: currentMonthVisible.snsPositiveTrend,
            negative: currentMonthVisible.snsNegativeTrend,
            labels: currentMonthBase.labels,
            benchmarkValue: comparePreviousMonth ? null : dailyBenchmarks.snsPostsDailyAverage,
            benchmarkLabel: comparePreviousMonth ? '前月同日' : '直近12ヵ月平均',
            comparisonPosts: comparePreviousMonth ? previousMonthBase.snsPostsTrend.slice(0, currentMonthBase.labels.length) : null,
            comparisonPositive: comparePreviousMonth ? previousMonthBase.snsPositiveTrend.slice(0, currentMonthBase.labels.length) : null,
            comparisonNegative: comparePreviousMonth ? previousMonthBase.snsNegativeTrend.slice(0, currentMonthBase.labels.length) : null,
            comparisonDasharray: comparePreviousMonth ? '5 5' : null,
            comparisonLabel: '前月投稿数'
          }),
          '4/1',
          '4/30',
          {
            className: 'is-sns',
            balance: {
              pos: last(currentMonthVisible.snsPositiveTrend),
              neg: last(currentMonthVisible.snsNegativeTrend)
            }
          }
        ),
        buildSignal(
          '平均読み込み時間',
          formatSeconds(last(currentMonthVisible.loadTimeTrend)),
          comparePreviousMonth
            ? `前月同日 ${formatSeconds(last(previousMonthVisible.loadTimeTrend))}`
            : `閾値 ${formatSeconds(currentMonthBase.loadThreshold)}`,
          notes.load,
          buildSpark({
            series: currentMonthVisible.loadTimeTrend,
            labels: currentMonthBase.labels,
            fill: 'transparent',
            benchmarkValue: currentMonthBase.loadThreshold,
            benchmarkLabel: '閾値',
            benchmarkColor: COLORS.red,
            comparisonSeries: comparePreviousMonth ? previousMonthBase.loadTimeTrend.slice(0, currentMonthBase.labels.length) : null,
            comparisonLabel: '前月',
            comparisonDasharray: comparePreviousMonth ? '5 5' : null,
            valueFormatter: formatSeconds,
            valueLabel: '平均読み込み時間',
            comparisonColor: comparePreviousMonth ? COLORS.blueSoftLine : COLORS.red
          }),
          '4/1',
          '4/30',
          { isAlert: last(currentMonthVisible.loadTimeTrend) > currentMonthBase.loadThreshold }
        )
      ]
    };
  }

  function buildYearStartFlowSeries(months, { turnoverScale = 1 } = {}) {
    const startDmau = first(months).dmau;
    return months.map((item, index) => {
      const elapsedRatio = (index + 1) / months.length;
      const baseNewUsers = Math.max(
        0,
        item.dmau - startDmau,
        Math.round(item.newUsers * (0.42 + elapsedRatio * 0.58))
      );
      const dmauDiff = item.dmau - startDmau;
      const newUsers = Math.max(0, dmauDiff, Math.round(baseNewUsers * turnoverScale));
      const churn = Math.max(0, newUsers - dmauDiff);

      return {
        dmauDiff,
        newUsers,
        churn
      };
    });
  }

  function buildMonthlyView(scope) {
    const isCurrentYear = scope === 'currentYear';
    const series = isCurrentYear ? currentYearMonths : monthlyHistory;
    const yearMonthLabels = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);
    const labels = isCurrentYear
      ? yearMonthLabels
      : series.map((item) => `${String(item.year).slice(2)}/${String(item.month).padStart(2, '0')}`);
    const latest = isCurrentYear
      ? series.find((item) => item.month === reportDate.getMonth() + 1) || last(series)
      : last(series);
    const compareSeries = isCurrentYear ? previousYearMonths : null;
    const latestPreviousYear = isCurrentYear
      ? compareSeries.find((item) => item.month === latest.month) || last(compareSeries)
      : previousYearSameMonths[previousYearSameMonths.length - 1];
    const latestMonthPrefix = `${latest.month}月`;
    const forecastMonth = reportDate.getMonth() + 1;
    const revenueMonthlyValues = series.map((item) => item.revenue);
    const revenueActualCumulative = cumulative(revenueMonthlyValues);
    const revenueForecastCumulative = isCurrentYear
      ? cumulative(series.map((item) => item.month === forecastMonth && item.revenueForecast ? item.revenueForecast : item.revenue))
      : null;
    const previousRevenueCumulative = isCurrentYear ? cumulative(compareSeries.map((item) => item.revenue)) : null;
    const latestRevenueCumulativeValue = isCurrentYear
      ? last(revenueForecastCumulative)
      : latest.revenue;
    const latestPreviousRevenueCumulativeValue = isCurrentYear
      ? previousRevenueCumulative[latest.month - 1]
      : allMonthsAverage.revenue;
    const currentYearFlowSeries = isCurrentYear ? buildYearStartFlowSeries(series, { turnoverScale: 2 }) : null;
    const previousYearFlowSeries = isCurrentYear ? buildYearStartFlowSeries(compareSeries, { turnoverScale: 4 }) : null;
    const latestCurrentYearFlow = isCurrentYear ? currentYearFlowSeries[latest.month - 1] : null;
    const latestPreviousYearFlow = isCurrentYear ? previousYearFlowSeries[latest.month - 1] : null;
    const revenuePrimarySeries = isCurrentYear
      ? series.map((item) => item.month === forecastMonth && item.revenueForecast ? null : item.revenue)
      : revenueMonthlyValues;
    const revenueForecastSeries = isCurrentYear
      ? series.map((item, index) => {
        if (item.month === forecastMonth && item.revenueForecast) return item.revenueForecast;
        if (series[index + 1]?.month === forecastMonth && series[index + 1]?.revenueForecast) return item.revenue;
        return null;
      })
      : null;
    const stoneUseMonthlyValues = series.map((item) => item.stoneUse);
    const latestStoneUseValue = isCurrentYear
      ? latest.stoneUseForecast || latest.stoneUse
      : latest.stoneUse;
    const stoneUsePrimarySeries = isCurrentYear
      ? series.map((item) => item.month === forecastMonth && item.stoneUseForecast ? null : item.stoneUse)
      : stoneUseMonthlyValues;
    const stoneUseForecastSeries = isCurrentYear
      ? series.map((item, index) => {
        if (item.month === forecastMonth && item.stoneUseForecast) return item.stoneUseForecast;
        if (series[index + 1]?.month === forecastMonth && series[index + 1]?.stoneUseForecast) return item.stoneUse;
        return null;
      })
      : null;

    return {
      period: isCurrentYear ? '2026/01/01 - 2026/04/18' : '2020/01/01 - 2026/04/18',
      revenueTitle: isCurrentYear ? '年内累計売上' : '累計売上',
      revenueDescription: isCurrentYear
        ? '周年や季節イベントが同じ条件になる前年との比較と長期的な推移を見る。<br>年内累計売上の数値は、今月着地予測を含む今年の累計。'
        : '全期間の月次売上を並べ、繁閑差と長期トレンドを把握する。',
      revenueMetricLabel: isCurrentYear ? '2026年累計売上' : '月次売上',
      revenueValue: formatCurrencyInt(latestRevenueCumulativeValue),
      revenueHint: isCurrentYear
        ? `前年今月時点累計 ${formatCurrencyInt(latestPreviousRevenueCumulativeValue)}`
        : `全期間月平均 ${formatCurrencyInt(allMonthsAverage.revenue)}`,
      revenueLegend: buildLegend(
        isCurrentYear
          ? [
            { label: '2026年月次売上', color: COLORS.blue, type: 'line' },
            { label: '2026年4月予測', color: COLORS.blue, type: 'line', dashed: true },
            { label: '2025年月次売上', color: COLORS.blueSoftLine, type: 'line' }
          ]
          : [{ label: '月次売上', color: COLORS.blue, type: 'line' }]
      ),
      revenueMetrics: [
        {
          label: isCurrentYear ? '前年今月時点累計差' : '平均との差',
          value: formatCurrencyDiff(latestRevenueCumulativeValue - latestPreviousRevenueCumulativeValue)
        },
        {
          label: '課金率',
          value: formatPercent(latest.payerRate),
          meta: `${isCurrentYear ? '前年平均' : '全期間月平均'} ${formatPercent(isCurrentYear ? previousYearAverage.payerRate : allMonthsAverage.payerRate)}`
        },
        {
          label: '課金者1人あたり売上',
          value: formatYen(latest.arppu),
          meta: `${isCurrentYear ? '前年平均' : '全期間月平均'} ${formatYen(isCurrentYear ? previousYearAverage.arppu : allMonthsAverage.arppu)}`
        }
      ],
      revenueChart: buildSeriesChart({
        primary: revenuePrimarySeries,
        secondary: isCurrentYear ? compareSeries.map((item) => item.revenue) : null,
        forecast: revenueForecastSeries,
        forecastColor: COLORS.blue,
        forecastLabel: '2026年4月予測',
        forecastTooltipFromIndex: forecastMonth - 1,
        labels,
        tickStep: isCurrentYear ? 1 : 6,
        primaryColor: COLORS.blue,
        secondaryColor: COLORS.blueSoftLine,
        secondaryDasharray: null,
        secondaryPointRadius: markerRadius,
        valueFormatter: formatCurrencyInt,
        axisFormatter: formatCurrencyAxis,
        primaryLabel: isCurrentYear ? '2026年月次売上' : '月次売上',
        secondaryLabel: '2025年月次売上'
      }),
      dmauDescription: isCurrentYear
        ? 'ログボ勢を除いたrDAU（Real Daily Active User）を見る。<br>重要度は、既に定着した既存顧客＞定着するか分からない新規顧客。<br>前年比では、どの月でユーザーが大きく増減しているかを見て、その時期になんの施策があったかを探る。'
        : '全期間の月末rDAUを見て、伸びが鈍る局面と離脱増の組み合わせを拾う。',
      dmauMetricLabel: isCurrentYear ? '2026年月末rDAU' : '月末rDAU',
      dmauValue: formatNumber(latest.dmau),
      dmauHint: isCurrentYear
        ? `年始比 ${formatSignedNumber(latestCurrentYearFlow.dmauDiff)}`
        : `${latestMonthPrefix}月初比 ${formatSignedNumber(last(currentMonthVisible.dmauTrend) - first(currentMonthVisible.dmauTrend))}`,
      dmauCards: [
        {
          label: '新規ユーザー数',
          value: isCurrentYear
            ? `年始比 ${formatNumber(latestCurrentYearFlow.newUsers)}`
            : `${latestMonthPrefix}月初比 ${formatNumber(latest.newUsers)}`,
          sub: isCurrentYear
            ? `前年年始比 ${formatNumber(latestPreviousYearFlow.newUsers)}`
            : `全期間月平均 ${formatNumber(allMonthsAverage.newUsers)}`,
          tone: 'is-green'
        },
        {
          label: '既存顧客離脱数',
          value: isCurrentYear
            ? `年始比 ${formatNumber(latestCurrentYearFlow.churn)}`
            : `${latestMonthPrefix}月初比 ${formatNumber(latest.churn)}`,
          sub: isCurrentYear
            ? `前年年始比 ${formatNumber(latestPreviousYearFlow.churn)}`
            : `全期間月平均 ${formatNumber(allMonthsAverage.churn)}`,
          tone: 'is-red'
        }
      ],
      dmauLineLegend: buildLegend([
        { label: isCurrentYear ? '2026年月末rDAU' : '月末rDAU', color: COLORS.blueDeep, type: 'line' },
        { label: '新規ユーザー数', color: COLORS.green, type: 'line', dashed: true },
        { label: '既存顧客離脱数', color: COLORS.red, type: 'line', dashed: true },
        ...(isCurrentYear
          ? [
            { label: '2025年月末rDAU', color: COLORS.blueSoftLine, type: 'line', breakBefore: true },
            { label: '2025年新規ユーザー数', color: COLORS.greenSoftLine, type: 'line', dashed: true },
            { label: '2025年既存顧客離脱数', color: COLORS.redSoftLine, type: 'line', dashed: true }
          ]
          : [])
      ]),
      dmauBarLegend: '',
      dmauChart: buildPlayerChart({
        dmau: series.map((item) => item.dmau),
        newUsers: isCurrentYear ? currentYearFlowSeries.map((item) => item.newUsers) : series.map((item) => item.newUsers),
        churn: isCurrentYear ? currentYearFlowSeries.map((item) => item.churn) : series.map((item) => item.churn),
        labels,
        comparisonDmau: isCurrentYear ? compareSeries.map((item) => item.dmau) : null,
        comparisonNewUsers: isCurrentYear ? previousYearFlowSeries.map((item) => item.newUsers) : null,
        comparisonChurn: isCurrentYear ? previousYearFlowSeries.map((item) => item.churn) : null,
        comparisonDasharray: isCurrentYear ? '5 5' : null,
        comparisonDmauDasharray: null,
        comparisonFlowDasharray: isCurrentYear ? '5 5' : null,
        comparisonNewUsersLabel: '2025年新規ユーザー数',
        comparisonChurnLabel: '2025年既存顧客離脱数',
        tickStep: isCurrentYear ? 1 : 6,
        dmauLabel: isCurrentYear ? '2026年月末rDAU' : '月末rDAU',
        comparisonLabel: '2025年月末rDAU'
      }),
      signals: [
        buildSignal(
          '累計石消費数',
          formatNumber(latestStoneUseValue),
          `${isCurrentYear ? '前年平均' : '全期間月平均'} ${formatNumber(isCurrentYear ? previousYearAverage.stoneUse : allMonthsAverage.stoneUse)}`,
          notes.stone,
          buildSpark({
            series: stoneUsePrimarySeries,
            labels,
            comparisonSeries: isCurrentYear ? compareSeries.map((item) => item.stoneUse) : null,
            comparisonLabel: '2025年',
            comparisonDasharray: null,
            forecastSeries: stoneUseForecastSeries,
            forecastLabel: '2026年4月予測',
            forecastTooltipFromIndex: forecastMonth - 1,
            benchmarkValue: isCurrentYear ? null : allMonthsAverage.stoneUse,
            benchmarkLabel: '全期間月平均',
            valueFormatter: formatNumber,
            valueLabel: '石消費数'
          }),
          labels[0],
          labels[labels.length - 1]
        ),
        buildSignal(
          'rDAUの平均石保有数',
          formatStoneHoldings(latest.wallet),
          `${isCurrentYear ? '前年平均' : '全期間月平均'} ${formatStoneHoldings(isCurrentYear ? previousYearAverage.wallet : allMonthsAverage.wallet)}`,
          notes.wallet,
          buildSpark({
            series: series.map((item) => item.wallet),
            labels,
            fill: 'transparent',
            comparisonSeries: isCurrentYear ? compareSeries.map((item) => item.wallet) : null,
            comparisonLabel: '2025年',
            comparisonDasharray: null,
            benchmarkValue: isCurrentYear ? null : allMonthsAverage.wallet,
            benchmarkLabel: '全期間月平均',
            valueFormatter: formatStoneHoldings,
            valueLabel: '平均石保有数'
          }),
          labels[0],
          labels[labels.length - 1]
        ),
        buildSignal(
          'SNS投稿数と反応',
          `${formatNumber(latest.snsPosts)}件`,
          `${isCurrentYear ? '前年平均' : '全期間月平均'} ${formatNumber(isCurrentYear ? previousYearAverage.snsPosts : allMonthsAverage.snsPosts)}件`,
          notes.sns,
          buildSnsSpark({
            posts: series.map((item) => item.snsPosts),
            positive: series.map((item) => item.snsPositive),
            negative: series.map((item) => item.snsNegative),
            labels,
            comparisonPosts: isCurrentYear ? compareSeries.map((item) => item.snsPosts) : null,
            comparisonPositive: isCurrentYear ? compareSeries.map((item) => item.snsPositive) : null,
            comparisonNegative: isCurrentYear ? compareSeries.map((item) => item.snsNegative) : null,
            comparisonDasharray: null,
            comparisonLabel: '2025年投稿数',
            benchmarkValue: isCurrentYear ? null : allMonthsAverage.snsPosts,
            benchmarkLabel: '全期間月平均'
          }),
          labels[0],
          labels[labels.length - 1],
          {
            className: 'is-sns',
            balance: { pos: latest.snsPositive, neg: latest.snsNegative }
          }
        ),
        buildSignal(
          '平均読み込み時間',
          formatSeconds(latest.loadTime),
          `${isCurrentYear ? '前年平均' : '全期間月平均'} ${formatSeconds(isCurrentYear ? previousYearAverage.loadTime : allMonthsAverage.loadTime)}`,
          notes.load,
          buildSpark({
            series: series.map((item) => item.loadTime),
            labels,
            fill: 'transparent',
            comparisonSeries: isCurrentYear ? compareSeries.map((item) => item.loadTime) : null,
            comparisonLabel: '2025年',
            comparisonDasharray: null,
            benchmarkValue: isCurrentYear ? currentMonthBase.loadThreshold : allMonthsAverage.loadTime,
            benchmarkLabel: isCurrentYear ? '閾値' : '全期間月平均',
            benchmarkColor: isCurrentYear ? COLORS.red : null,
            valueFormatter: formatSeconds,
            valueLabel: '平均読み込み時間',
            comparisonColor: isCurrentYear ? COLORS.blueSoftLine : COLORS.red
          }),
          labels[0],
          labels[labels.length - 1]
        )
      ]
    };
  }

  function buildYearlyView() {
    const labels = yearlyHistory.map((item) => `${item.year}`);
    const latest = yearlyHistory[yearlyHistory.length - 1];
    const previous = yearlyHistory[yearlyHistory.length - 2];

    return {
      period: '2020 - 2026',
      revenueTitle: '累計売上',
      revenueDescription: '年次累計で伸びと鈍化を確認し、運営改善が年単位で効いているかを見る。',
      revenueMetricLabel: '年次売上',
      revenueValue: formatCurrencyInt(latest.revenue),
      revenueHint: `前年 ${formatCurrencyInt(previous.revenue)}`,
      revenueLegend: buildLegend([{ label: '年次売上', color: COLORS.blue, type: 'line' }]),
      revenueMetrics: [
        { label: '前年差', value: formatCurrencyDiff(latest.revenue - previous.revenue) },
        { label: '課金率', value: formatPercent(latest.payerRate), meta: `前年 ${formatPercent(previous.payerRate)}` },
        { label: '課金者1人あたり売上', value: formatYen(latest.arppu), meta: `前年 ${formatYen(previous.arppu)}` }
      ],
      revenueChart: buildSeriesChart({
        primary: yearlyHistory.map((item) => item.revenue),
        labels,
        tickStep: 1,
        primaryColor: COLORS.blue,
        valueFormatter: formatCurrencyInt,
        axisFormatter: formatCurrencyAxis,
        primaryLabel: '年次売上'
      }),
      dmauDescription: '年末rDAUを年次で並べ、長期の積み上がりに対して新規と離脱のバランスが崩れていないかを見る。',
      dmauMetricLabel: '年末rDAU',
      dmauValue: formatNumber(latest.dmau),
      dmauHint: `年始比 ${formatSignedNumber(latest.yearStartDiff)}`,
      dmauCards: [
        { label: '新規ユーザー数', value: `2026年累計 ${formatNumber(latest.newUsers)}`, sub: `前年 ${formatNumber(previous.newUsers)}`, tone: 'is-green' },
        { label: '既存顧客離脱数', value: `2026年累計 ${formatNumber(latest.churn)}`, sub: `前年 ${formatNumber(previous.churn)}`, tone: 'is-red' }
      ],
      dmauLineLegend: buildLegend([
        { label: '年末rDAU', color: COLORS.blueDeep, type: 'line' },
        { label: '新規ユーザー数', color: COLORS.green, type: 'line', dashed: true },
        { label: '既存顧客離脱数', color: COLORS.red, type: 'line', dashed: true }
      ]),
      dmauBarLegend: '',
      dmauChart: buildPlayerChart({
        dmau: yearlyHistory.map((item) => item.dmau),
        newUsers: yearlyHistory.map((item) => item.newUsers),
        churn: yearlyHistory.map((item) => item.churn),
        labels,
        tickStep: 1,
        dmauLabel: '年末rDAU'
      }),
      signals: [
        buildSignal(
          '累計石消費数',
          formatNumber(latest.stoneUse),
          `前年 ${formatNumber(previous.stoneUse)}`,
          notes.stone,
          buildSpark({
            series: yearlyHistory.map((item) => item.stoneUse),
            labels,
            valueFormatter: formatNumber,
            valueLabel: '石消費数'
          }),
          labels[0],
          labels[labels.length - 1]
        ),
        buildSignal(
          'rDAUの平均石保有数',
          formatStoneHoldings(latest.wallet),
          `前年 ${formatStoneHoldings(previous.wallet)}`,
          notes.wallet,
          buildSpark({
            series: yearlyHistory.map((item) => item.wallet),
            labels,
            fill: 'transparent',
            valueFormatter: formatStoneHoldings,
            valueLabel: '平均石保有数'
          }),
          labels[0],
          labels[labels.length - 1]
        ),
        buildSignal(
          'SNS投稿数と反応',
          `${formatNumber(latest.snsPosts)}件`,
          `前年 ${formatNumber(previous.snsPosts)}件`,
          notes.sns,
          buildSnsSpark({
            posts: yearlyHistory.map((item) => item.snsPosts),
            positive: yearlyHistory.map((item) => item.snsPositive),
            negative: yearlyHistory.map((item) => item.snsNegative),
            labels
          }),
          labels[0],
          labels[labels.length - 1],
          {
            className: 'is-sns',
            balance: { pos: latest.snsPositive, neg: latest.snsNegative }
          }
        ),
        buildSignal(
          '平均読み込み時間',
          formatSeconds(latest.loadTime),
          `前年 ${formatSeconds(previous.loadTime)}`,
          notes.load,
          buildSpark({
            series: yearlyHistory.map((item) => item.loadTime),
            labels,
            fill: 'transparent',
            valueFormatter: formatSeconds,
            valueLabel: '平均読み込み時間',
            comparisonColor: COLORS.red
          }),
          labels[0],
          labels[labels.length - 1]
        )
      ]
    };
  }

  function getViewModel() {
    if (state.scope === 'previousMonth') return buildCurrentMonthView({ comparePreviousMonth: true });
    if (state.scope === 'yearOverYear') return buildMonthlyView('currentYear');
    return buildCurrentMonthView();
  }

  function render() {
    const view = getViewModel();
    renderControls();
    if (elements.alertStrip) {
      elements.alertStrip.innerHTML = '';
      elements.alertStrip.style.display = 'none';
    }

    elements.periodChip.innerHTML = renderFixedPeriodChip(view.period);
    elements.revenueTitle.textContent = view.revenueTitle || '累計売上';
    elements.revenueDescription.innerHTML = tooltipMode
      ? buildInfoTip(`${view.revenueTitle || '売上'}の見方`, view.revenueDescription)
      : view.revenueDescription;
    elements.revenueMetricLabel.textContent = '';
    elements.revenueValue.textContent = view.revenueValue;
    elements.revenueHint.textContent = view.revenueHint;
    elements.revenueLegend.innerHTML = view.revenueLegend;
    renderMetricCards(elements.revenueMetrics, view.revenueMetrics);
    elements.revenueChart.innerHTML = view.revenueChart;

    elements.dmauDescription.innerHTML = tooltipMode
      ? buildInfoTip('rDAUの見方', view.dmauDescription)
      : view.dmauDescription;
    elements.dmauMetricLabel.textContent = '';
    elements.dmauValue.textContent = view.dmauValue;
    elements.dmauHint.textContent = view.dmauHint;
    renderDmauCards(view.dmauCards);
    elements.dmauLineLegend.innerHTML = view.dmauLineLegend;
    elements.dmauBarLegend.innerHTML = view.dmauBarLegend;
    elements.playerChart.innerHTML = view.dmauChart;

    renderSignalCards(view.signals);
    if (elements.eventListPanel) {
      elements.eventListPanel.style.display = state.scope === 'yearOverYear' ? 'none' : '';
    }
    if (elements.annualEventPanel) {
      elements.annualEventPanel.style.display = state.scope === 'yearOverYear' ? 'grid' : 'none';
      applyInitiativeFilters();
    }
  }

  elements.annualEventPanel?.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-initiative-name]')) {
      const panel = event.target.closest('[data-initiative-panel]');
      if (panel) updateInitiativeFilterStates(panel);
      applyInitiativeFilters();
    }
  });
  elements.annualEventPanel?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const toggle = event.target.closest('[data-initiative-filter-toggle]');
    if (toggle instanceof HTMLButtonElement) {
      const cell = toggle.closest('[data-initiative-filter-cell]');
      const willOpen = !cell?.classList.contains('is-open');
      closeInitiativeFilterPopovers(willOpen ? cell : null);
      cell?.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        cell?.querySelector('[data-initiative-name]')?.focus();
      }
      return;
    }

    const categoryOption = event.target.closest('[data-initiative-category-option]');
    if (categoryOption instanceof HTMLButtonElement) {
      selectInitiativeOption(categoryOption, '[data-initiative-category-option]');
      applyInitiativeFilters();
      closeInitiativeFilterPopovers();
      return;
    }

    const periodMonthOption = event.target.closest('[data-initiative-period-month-option]');
    if (periodMonthOption instanceof HTMLButtonElement) {
      selectInitiativeOption(periodMonthOption, '[data-initiative-period-month-option]');
      applyInitiativeFilters();
      closeInitiativeFilterPopovers();
    }
  });
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('.annual-event-panel')) {
      closeInitiativeFilterPopovers();
    }
  });

  render();
})();
