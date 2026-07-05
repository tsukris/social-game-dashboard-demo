(() => {
  const page = document.body.dataset.analysisPage;
  const root = document.getElementById("analysisRoot");
  if (!page || !root) return;

  const dataRangeStart = new Date(2024, 0, 1);
  const dataRangeEnd = new Date(2026, 3, 18);
  const defaultPeriodEnd = new Date(dataRangeEnd);
  const defaultPeriodDays = 30;
  const defaultPeriodStart = addDays(defaultPeriodEnd, -(defaultPeriodDays - 1));
  let periodStart = new Date(defaultPeriodStart);
  let periodEnd = new Date(defaultPeriodEnd);
  let periodDates = buildPeriodDates(periodStart, periodEnd);
  let days = periodDates.map(formatShortDate);
  let periodLabel = formatPeriodLabel(periodDates);
  let calendarCursor = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);
  const allDataDates = buildPeriodDates(dataRangeStart, dataRangeEnd);
  const palette = {
    blue: "#356cff",
    navy: "#1d2d56",
    teal: "#4f83d8",
    amber: "#78a7ff",
    red: "#244cbd",
    violet: "#5f8cff",
    muted: "#8aa6d9",
    product: "#356cff",
    productDeep: "#356cff",
    gacha: "#356cff",
    gachaDeep: "#356cff",
  };
  const cohortColors = {
    low: "#c9d6ea",
    light: "#9fb9ff",
    middle: "#356cff",
    high: "#1d2d56",
  };
  const salesGraphColor = palette.blue;
  const salesStackColors = [cohortColors.high, cohortColors.middle, cohortColors.light, cohortColors.low];
  const summarySnsColors = {
    posts: "#356cff",
    positive: "#3f8a4d",
    negative: "#c44d5c",
  };
  const gachaEventDates = [
    ["2024-01-01", 10, 1.15], ["2024-02-14", 7, 0.72], ["2024-04-26", 9, 0.88], ["2024-07-19", 11, 1.02], ["2024-09-13", 12, 1.2], ["2024-12-27", 10, 1.18],
    ["2025-01-01", 10, 1.1], ["2025-03-21", 9, 0.78], ["2025-05-01", 9, 0.86], ["2025-07-18", 11, 1.08], ["2025-09-12", 12, 1.26], ["2025-12-26", 10, 1.22],
    ["2026-01-01", 10, 1.0], ["2026-03-14", 9, 0.84], ["2026-04-01", 8, 0.62],
  ];
  const productEventDates = [
    ["2024-01-01", 7, 0.72], ["2024-04-01", 8, 0.48], ["2024-08-01", 8, 0.54], ["2024-12-01", 8, 0.6],
    ["2025-01-01", 7, 0.76], ["2025-04-01", 8, 0.52], ["2025-08-01", 8, 0.58], ["2025-12-01", 8, 0.66],
    ["2026-01-01", 7, 0.7], ["2026-03-01", 8, 0.5],
  ];
  const acquisitionEventDates = [
    ["2024-01-01", 14, 0.78], ["2024-05-01", 18, 0.64], ["2024-09-13", 18, 0.9],
    ["2025-01-01", 14, 0.74], ["2025-04-18", 16, 0.58], ["2025-09-12", 18, 0.86], ["2025-12-26", 16, 0.72],
    ["2026-01-01", 14, 0.62], ["2026-03-14", 16, 0.72],
  ];
  const contentEventDates = [
    ["2024-02-14", 10, 0.62], ["2024-06-14", 12, 0.5], ["2024-09-13", 14, 0.78], ["2024-11-15", 10, 0.46],
    ["2025-02-14", 10, 0.66], ["2025-06-13", 12, 0.54], ["2025-09-12", 14, 0.84], ["2025-11-14", 10, 0.5],
    ["2026-02-14", 10, 0.58], ["2026-03-14", 12, 0.62],
  ];
  const issueEventDates = [
    ["2024-10-08", 10, 0.28],
    ["2025-03-20", 12, 0.34],
    ["2025-07-24", 9, 0.32],
    ["2026-03-22", 18, 0.92],
    ["2026-04-09", 12, 0.58],
  ];

  let groups = buildGroups();

  const salesBase = buildSalesBaseData(allDataDates);
  const userBase = buildUserBaseData(allDataDates);

  const salesSegments = {
    spend: [
      { key: "free", name: "無課金", color: cohortColors.low, dashArray: "", revenueShare: 0, rateFactor: 0, arppuFactor: 0, stoneFactor: 1, holdingFactor: 0.32, productCtrFactor: 0.9, productPurchaseFactor: 0, gachaCtrFactor: 0.94, gachaPurchaseFactor: 0, revenueTrend: [1, 1], rateTrend: [1, 1], arppuTrend: [1, 1], stoneTrend: [1, 0.96], holdingTrend: [0.94, 0.76] },
      { key: "light", name: "軽課金", color: cohortColors.light, dashArray: "", revenueShare: 0.18, rateFactor: 0.62, arppuFactor: 0.42, stoneFactor: 1, holdingFactor: 0.72, productCtrFactor: 1.12, productPurchaseFactor: 0.7, gachaCtrFactor: 1.02, gachaPurchaseFactor: 0.72, revenueTrend: [1.06, 0.78], rateTrend: [1.04, 0.74], arppuTrend: [1, 0.82], stoneTrend: [1.03, 0.95], holdingTrend: [1.02, 0.82] },
      { key: "mid", name: "中課金", color: cohortColors.middle, dashArray: "", revenueShare: 0.34, rateFactor: 1.06, arppuFactor: 1, stoneFactor: 3, holdingFactor: 1.2, productCtrFactor: 1.08, productPurchaseFactor: 1.04, gachaCtrFactor: 1.1, gachaPurchaseFactor: 1.04, revenueTrend: [1.02, 0.9], rateTrend: [1.02, 0.86], arppuTrend: [1.04, 0.94], stoneTrend: [1.04, 0.96], holdingTrend: [1.04, 0.92] },
      { key: "heavy", name: "重課金", color: cohortColors.high, dashArray: "", revenueShare: 0.48, rateFactor: 1.58, arppuFactor: 2.25, stoneFactor: 6.6, holdingFactor: 2.05, productCtrFactor: 0.92, productPurchaseFactor: 1.4, gachaCtrFactor: 1.26, gachaPurchaseFactor: 1.55, revenueTrend: [0.98, 1.16], rateTrend: [1, 1.12], arppuTrend: [1.08, 1.22], stoneTrend: [0.96, 1.04], holdingTrend: [1.1, 1.24] },
    ],
    core: [
      { key: "login", name: "ログイン", color: cohortColors.low, dashArray: "", revenueShare: 0, rateFactor: 0, arppuFactor: 0, stoneFactor: 0.2, holdingFactor: 0.38, productCtrFactor: 0.22, productPurchaseFactor: 0, gachaCtrFactor: 0.2, gachaPurchaseFactor: 0, revenueTrend: [1, 0.74], rateTrend: [1, 1], arppuTrend: [1, 1], stoneTrend: [0.92, 0.72], holdingTrend: [0.9, 0.7] },
      { key: "lite", name: "ライト", color: cohortColors.light, dashArray: "", revenueShare: 0.2, rateFactor: 0.68, arppuFactor: 0.58, stoneFactor: 1, holdingFactor: 0.74, productCtrFactor: 0.92, productPurchaseFactor: 0.72, gachaCtrFactor: 0.88, gachaPurchaseFactor: 0.68, revenueTrend: [1.04, 0.76], rateTrend: [1.02, 0.78], arppuTrend: [1, 0.86], stoneTrend: [1.03, 0.95], holdingTrend: [0.98, 0.78] },
      { key: "middle", name: "ミドル", color: cohortColors.middle, dashArray: "", revenueShare: 0.34, rateFactor: 1, arppuFactor: 1, stoneFactor: 3, holdingFactor: 1.12, productCtrFactor: 1.06, productPurchaseFactor: 1.02, gachaCtrFactor: 1.04, gachaPurchaseFactor: 1, revenueTrend: [1.02, 0.92], rateTrend: [1.02, 0.9], arppuTrend: [1.02, 0.96], stoneTrend: [1.04, 0.96], holdingTrend: [1.02, 0.92] },
      { key: "core", name: "コア", color: cohortColors.high, dashArray: "", revenueShare: 0.46, rateFactor: 1.35, arppuFactor: 1.65, stoneFactor: 5.5, holdingFactor: 1.7, productCtrFactor: 1.16, productPurchaseFactor: 1.26, gachaCtrFactor: 1.24, gachaPurchaseFactor: 1.36, revenueTrend: [0.98, 1.18], rateTrend: [1, 1.16], arppuTrend: [1.08, 1.2], stoneTrend: [0.96, 1.04], holdingTrend: [1.06, 1.2] },
    ],
    playHistory: [
      { key: "play30", name: "30日以内", color: cohortColors.low, dashArray: "", revenueShare: 0.12, rateFactor: 0.58, arppuFactor: 0.48, stoneFactor: 0.82, holdingFactor: 0.52, productCtrFactor: 1.08, productPurchaseFactor: 0.72, gachaCtrFactor: 0.84, gachaPurchaseFactor: 0.58, revenueTrend: [1.08, 0.82], rateTrend: [1.04, 0.78], arppuTrend: [1, 0.86], stoneTrend: [1.03, 0.86], holdingTrend: [0.9, 0.72] },
      { key: "play90", name: "31〜90日", color: cohortColors.light, dashArray: "", revenueShare: 0.22, rateFactor: 0.86, arppuFactor: 0.78, stoneFactor: 1.55, holdingFactor: 0.9, productCtrFactor: 1.12, productPurchaseFactor: 0.92, gachaCtrFactor: 1, gachaPurchaseFactor: 0.9, revenueTrend: [1.04, 0.88], rateTrend: [1.02, 0.86], arppuTrend: [1.02, 0.92], stoneTrend: [1.04, 0.92], holdingTrend: [0.98, 0.84] },
      { key: "play180", name: "91〜180日", color: cohortColors.middle, dashArray: "", revenueShare: 0.28, rateFactor: 1.08, arppuFactor: 1.1, stoneFactor: 2.8, holdingFactor: 1.22, productCtrFactor: 1.02, productPurchaseFactor: 1.06, gachaCtrFactor: 1.08, gachaPurchaseFactor: 1.08, revenueTrend: [1.02, 0.96], rateTrend: [1.02, 0.94], arppuTrend: [1.04, 0.98], stoneTrend: [1.04, 0.98], holdingTrend: [1.04, 0.94] },
      { key: "play181", name: "181日以上", color: cohortColors.high, dashArray: "", revenueShare: 0.38, rateFactor: 1.34, arppuFactor: 1.48, stoneFactor: 4.2, holdingFactor: 1.78, productCtrFactor: 0.88, productPurchaseFactor: 1.18, gachaCtrFactor: 1.22, gachaPurchaseFactor: 1.28, revenueTrend: [1, 1.08], rateTrend: [1, 1.06], arppuTrend: [1.04, 1.12], stoneTrend: [0.98, 1.04], holdingTrend: [1.08, 1.16] },
    ],
  };

  const userModifiers = {
    segment: {
      all: { active: 1, retention: 1, newUsers: 1, churn: 1 },
      new: { active: 0.32, retention: 0.86, newUsers: 1, churn: 0.78 },
      returning: { active: 0.18, retention: 1.14, newUsers: 0.36, churn: 0.58 },
      risk: { active: 0.22, retention: 0.62, newUsers: 0.18, churn: 1.42 },
    },
  };

  const configs = {
    sales: {
      title: "課金分析",
      kicker: "Sales Analysis",
      lead: "売上低下を、課金転換、単価、販売物、石消費のどこから掘るべきか判断するための詳細ページです。",
      active: "sales",
      source: "KPI軸: 時間 / 分類軸",
      controls: [
        { id: "grain", label: "時間粒度", options: [["daily", "日次"], ["monthly", "月次"], ["yearly", "年次"]] },
        { id: "payer", label: "分類軸", tooltip: "課金額は無課金/軽課金/中課金/重課金、コアはログイン/ライト/ミドル/コア、プレイ歴は初回プレイからの経過日数で分類します。", options: [["all", "全体"], ["spend", "課金額"], ["core", "コア"], ["playHistory", "プレイ歴"]] },
      ],
      defaults: { grain: "daily", payer: "all", revenueMode: "value" },
    },
    users: {
      title: "ユーザー分析",
      kicker: "User Analysis",
      lead: "MAUの内訳を、流入、定着、離脱、熱量のどこから掘るべきか判断するための詳細ページです。",
      active: "users",
      source: "KPI軸: 時間 / 分類軸",
      controls: [
        { id: "grain", label: "時間粒度", options: [["daily", "日次"], ["monthly", "月次"], ["yearly", "年次"]] },
        { id: "userClassification", label: "分類軸", options: [["all", "全体"], ["spend", "課金額"], ["core", "コア"], ["playHistory", "プレイ歴"]] },
        { id: "userSegment", label: "セグメント", options: userSegmentOptions },
      ],
      defaults: { grain: "daily", userClassification: "all", userSegment: "all", userCountMode: "value", userRauOnly: "on" },
    },
  };

  const state = { ...configs[page].defaults, calendarOpen: false, calendarTarget: "end" };

  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-legend-filter]")) {
      event.stopPropagation();
      return;
    }

    const periodButton = event.target.closest("[data-period-target]");
    if (periodButton) {
      event.stopPropagation();
      state.userSegmentOpen = false;
      const target = periodButton.dataset.periodTarget;
      const nextOpen = !(state.calendarOpen && state.calendarTarget === target);
      state.calendarTarget = target;
      if (nextOpen) {
        const anchorDate = target === "start" ? periodStart : periodEnd;
        calendarCursor = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
      }
      state.calendarOpen = nextOpen;
      render();
      return;
    }

    const calendarShift = event.target.closest("[data-calendar-shift]");
    if (calendarShift) {
      event.stopPropagation();
      state.userSegmentOpen = false;
      calendarCursor = addMonths(calendarCursor, Number(calendarShift.dataset.calendarShift));
      render();
      return;
    }

    const calendarDate = event.target.closest("[data-calendar-date]");
    if (calendarDate) {
      event.stopPropagation();
      refreshPeriodDate(state.calendarTarget, parseIsoDate(calendarDate.dataset.calendarDate));
      state.calendarOpen = false;
      state.userSegmentOpen = false;
      render();
      return;
    }

    const classificationControl = event.target.closest(".classification-control");
    const button = event.target.closest("[data-control][data-value]");
    if (!button) {
      if (classificationControl && state.userClassification !== "all") {
        event.stopPropagation();
        state.calendarOpen = false;
        state.userSegmentDraftClassification = state.userClassification;
        state.userSegmentOpen = true;
        render();
        return;
      }
      if (state.userSegmentOpen) {
        state.userSegmentOpen = false;
        state.userSegmentDraftClassification = state.userClassification;
        render();
      }
      return;
    }
    event.stopPropagation();
    state.calendarOpen = false;
    const control = button.dataset.control;
    const value = button.dataset.value;
    if (control === "userClassification") {
      if (value === "all") {
        state.userClassification = "all";
        state.userSegment = "all";
        state.userSegmentDraftClassification = "all";
        state.userSegmentOpen = false;
      } else {
        state.userSegmentDraftClassification = value;
        state.userSegmentOpen = true;
      }
      render();
      return;
    }

    state[control] = value;
    if (control === "grain") {
      alignPeriodToGrain(state.grain);
      refreshPeriod();
    }
    if (control === "userSegment") {
      state.userClassification = state.userSegmentDraftClassification || state.userClassification;
      state.userSegmentOpen = false;
    } else {
      state.userSegmentOpen = false;
      state.userSegmentDraftClassification = state.userClassification;
    }
    render();
  });

  root.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-legend-filter]");
    if (!checkbox) return;
    event.stopPropagation();
    const group = checkbox.closest("[data-filter-group]");
    const inputs = [...(group?.querySelectorAll("[data-legend-filter]") || [])];
    if (inputs.length && !inputs.some((input) => input.checked)) {
      checkbox.checked = true;
      return;
    }

    const filterKey = checkbox.dataset.filterKey;
    if (!filterKey) return;
    state[filterKey] = inputs.reduce((values, input) => {
      values[input.dataset.seriesKey] = input.checked;
      return values;
    }, {});
    render();
  });

  document.addEventListener("pointerover", (event) => {
    const tip = getInfoTipTarget(event.target);
    if (tip) showInfoTooltip(tip);
  });

  document.addEventListener("pointerout", (event) => {
    const tip = getInfoTipTarget(event.target);
    const related = event.relatedTarget;
    if (tip && (!related || related.nodeType == null || !tip.contains(related))) hideInfoTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const tip = getInfoTipTarget(event.target);
    if (tip) showInfoTooltip(tip);
  });

  document.addEventListener("focusout", (event) => {
    if (getInfoTipTarget(event.target)) hideInfoTooltip();
  });

  document.addEventListener("click", (event) => {
    if (root.contains(event.target)) return;
    let shouldRender = false;
    if (state.calendarOpen) {
      state.calendarOpen = false;
      shouldRender = true;
    }
    if (state.userSegmentOpen) {
      state.userSegmentOpen = false;
      shouldRender = true;
    }
    if (shouldRender) render();
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || (!state.calendarOpen && !state.userSegmentOpen)) return;
    state.calendarOpen = false;
    state.userSegmentOpen = false;
    render();
  });

  render();

  function render() {
    if (page === "sales") renderSales();
    if (page === "users") renderUsers();
  }

  function renderSales() {
    const config = configs.sales;
    const data = buildSalesData();
    normalizeSalesGraphColors(data);
    const payerPanelTitle = "課金率（DPU/rDAU）";
    const payerPanelTooltip = state.payer === "spend"
      ? "課金額分類では無課金は0%、軽課金以上は定義上100%になるため、このカードは全体の課金率推移を表示します。"
      : "課金関連の上位ノード。rDAUのうち課金に進んだ割合を見る。分類軸を選ぶと区分ごとの線で見る。";
    root.innerHTML = renderShell(config) + `
      ${renderSalesMetricCards(data)}
      <section class="kpi-map-grid">
        ${kpiPanel("売上", "coarse sales-revenue-main title-actions", "KGI。最上位の売上実績を同じ粒度で見る。分類軸を選ぶと積み上げ棒で内訳を見る。割合では分類軸ごとの売上構成を見る。", "salesRevenueChart", data.revenueLegend, revenueModeToggle())}
        ${kpiPanel(payerPanelTitle, "sales-payer-rate sales-side-panel", payerPanelTooltip, "salesPayerRateChart", data.segmentLegend)}
        ${kpiPanel("ARPPU", "sales-arppu sales-side-panel", "課金者単価。重課金層やコア層の支えが弱くなっていないかを見る。", "salesArppuChart", data.segmentLegend)}
        ${kpiPanel("石消費数", "sales-stone-spend span-2", "石関連の重要ノード。期間中の石消費量が落ちていないかを見る。", "salesStoneSpendChart", data.segmentLegend)}
        ${kpiPanel("商品クリック率", "sales-product-click sales-funnel-rate", "商品画面への到達率を見る。ここが落ちている場合は、商品露出や入口導線を確認する。", "salesProductClickChart", data.productClickLegend)}
        ${kpiPanel("ガチャクリック率", "sales-gacha-click sales-funnel-rate", "ガチャ画面への到達率を見る。ここが落ちている場合は、露出位置やガチャ訴求を確認する。", "salesGachaClickChart", data.gachaClickLegend)}
        ${kpiPanel("商品購入率", "sales-product-purchase sales-funnel-rate", "商品画面へ到達した後、購入まで進んだ割合を見る。ここが落ちている場合は、価格・内容・再購入導線を確認する。", "salesProductPurchaseChart", data.productPurchaseLegend)}
        ${kpiPanel("ガチャ購入率", "sales-gacha-purchase sales-funnel-rate", "ガチャ画面へ到達した後、購入まで進んだ割合を見る。ここが落ちている場合は、報酬・価格・天井設計を確認する。", "salesGachaPurchaseChart", data.gachaPurchaseLegend)}
        ${kpiPanel("石保有数", "fine sales-stone-holdings span-2", "石関連の下位ノード。次回ガチャを回す余力が残っているかを見る。", "salesStoneHoldingsChart", data.segmentLegend)}
      </section>
      <div class="analysis-page-footer">
        <a class="event-detail-link" href="./event_timeline.html">商品/ガチャ別詳細は施策・イベント分析へ<span aria-hidden="true">→</span></a>
      </div>
    `;

    if (state.revenueMode === "share") {
      drawStackedBarChart("salesRevenueChart", data.labels, data.revenueCompositionSeries, {
        valueFormatter: percent,
        max: 1,
        hideRatioInTooltip: true,
      });
    } else if (data.isSegmented) {
      drawStackedBarChart("salesRevenueChart", data.labels, data.revenueSeries, { valueFormatter: yenMan });
    } else {
      drawBarLineChart("salesRevenueChart", data.labels, data.revenueAgg, null, {
        barColor: palette.blue,
        valueFormatter: yenMan,
      });
    }
    drawLineChart("salesPayerRateChart", data.labels, data.dpuRateSeries, { valueFormatter: percent, min: 0 });
    drawLineChart("salesArppuChart", data.labels, data.arppuSeries, { valueFormatter: yen, min: 0 });
    drawLineChart("salesStoneSpendChart", data.labels, data.stoneSeries, { valueFormatter: count, min: 0 });
    drawLineChart("salesGachaClickChart", data.labels, data.gachaClickSeries, { valueFormatter: percent, min: 0 });
    drawLineChart("salesGachaPurchaseChart", data.labels, data.gachaPurchaseSeries, { valueFormatter: percent, min: 0 });
    drawLineChart("salesProductClickChart", data.labels, data.productClickSeries, { valueFormatter: percent, min: 0 });
    drawLineChart("salesProductPurchaseChart", data.labels, data.productPurchaseSeries, { valueFormatter: percent, min: 0 });
    drawLineChart("salesStoneHoldingsChart", data.labels, data.stoneHoldingSeries, { valueFormatter: count, min: 0 });
  }

  function normalizeSalesGraphColors(data) {
    Object.entries(data).forEach(([key, value]) => {
      if (!Array.isArray(value)) return;
      if (data.isSegmented && key.endsWith("Legend")) return;
      if ((key === "revenueSeries" || key === "revenueCompositionSeries") && data.isSegmented) {
        applySalesStackColors(value);
        return;
      }
      normalizeSalesGraphValue(value);
    });
  }

  function normalizeSalesGraphValue(items) {
    items.forEach((item) => {
      if (Array.isArray(item)) item[1] = salesGraphColor;
      if (!item || typeof item !== "object") return;
      if ("color" in item && !item.segmentKey) item.color = salesGraphColor;
      if (Array.isArray(item.segments)) normalizeSalesGraphValue(item.segments);
    });
  }

  function applySalesStackColors(series) {
    const segmentColors = Object.values(salesSegments).flat().reduce((colors, segment) => {
      colors[segment.key] = segment.color;
      return colors;
    }, {});

    series.forEach((item, index) => {
      item.color = segmentColors[item.segmentKey] || salesStackColors[index] || salesStackColors[salesStackColors.length - 1];
    });
  }

  function renderUsers() {
    const config = configs.users;
    const data = buildUserData();
    const selectedSegment = selectedUserSegment();
    const topSidePanels = selectedSegment
      ? kpiPanel(data.newUsersTitle, "user-segment-movement with-legend", data.newUsersTooltip, "userNewUsersChart", data.newUsersLegend)
      : `
        ${kpiPanel(data.newUsersTitle, "user-new-users user-side-panel with-legend", data.newUsersTooltip, "userNewUsersChart", data.newUsersLegend, "", data.newUsersLegendFilterKey)}
        ${kpiPanel(data.retentionTitle, "user-retention user-side-panel with-legend", data.retentionTooltip, "userRetentionChart", data.retentionLegend)}
      `;
    root.innerHTML = renderShell(config) + `
      ${renderUserMetricCards(data)}
      <section class="kpi-map-grid">
        ${kpiPanel("ユーザー数", "user-primary-active coarse with-legend title-actions", "ユーザー数を実数または割合で見る。分類軸を選ぶと、セグメント選択に関係なく全体母集団の分類構成を表示する。", "userPrimaryActiveChart", data.userPrimaryActiveLegend, userCountModeToggle(), "userPrimaryActiveVisible")}
        ${topSidePanels}
        ${kpiPanel("既存顧客離脱数", "user-churn span-2 with-legend", "既存ユーザーの実離脱と、離脱する可能性のある潜在離脱顧客数を並べて見る。", "userChurnChart", [["離脱数", palette.red], ["潜在離脱顧客数", palette.amber]])}
        ${kpiPanel("クエスト進捗度", "user-quest-progress span-2 with-legend", "下から上級・中級・初級の順に積み上げ、未クリア層は100%までの余白として見る。", "userQuestProgressChart", data.questProgressLegend)}
        ${kpiPanel("メイン進捗度", "user-main-progress span-2 with-legend", "下から最新・三部・二部・一部の順に積み上げ、未クリア層は100%までの余白として見る。", "userMainProgressChart", data.mainProgressLegend)}
        ${kpiPanel("メインシナリオ閲覧率", "user-main-scenario-view", "メインシナリオを閲覧したユーザー割合。分類軸を選ぶと選択中セグメントの推移を見る。", "userMainScenarioViewChart")}
        ${kpiPanel("イベントシナリオ閲覧率", "user-event-scenario-view", "イベントシナリオを閲覧したユーザー割合。分類軸を選ぶと選択中セグメントの推移を見る。", "userEventScenarioViewChart")}
        ${kpiPanel("個別シナリオ閲覧率", "user-personal-scenario-view", "個別シナリオを閲覧したユーザー割合。分類軸を選ぶと選択中セグメントの推移を見る。", "userPersonalScenarioViewChart")}
        ${kpiPanel("親密度エピソード閲覧率", "user-bedroom-view", "親密度エピソードを閲覧したユーザー割合。分類軸を選ぶと選択中セグメントの推移を見る。", "userBedroomViewChart")}
        ${snsTrendPanel(data)}
      </section>
    `;

    drawStackedAreaChart("userPrimaryActiveChart", data.labels, data.userPrimaryActiveSeries, data.userPrimaryActiveOptions);
    if (data.newUsersOptions.chartType === "divergingBar") {
      drawDivergingBarChart("userNewUsersChart", data.labels, data.newUsersSeries.increased, data.newUsersSeries.decreased, data.newUsersOptions);
    } else if (data.newUsersOptions.chartType === "segmentMovementNet") {
      drawSegmentMovementNetChart("userNewUsersChart", data.labels, data.newUsersSeries, data.newUsersOptions);
    } else if (data.newUsersOptions.chartType === "line") {
      drawLineChart("userNewUsersChart", data.labels, data.newUsersSeries, data.newUsersOptions);
    } else {
      drawStackedAreaChart("userNewUsersChart", data.labels, data.newUsersSeries, data.newUsersOptions);
    }
    drawLineChart("userRetentionChart", data.labels, data.retentionSeries, data.retentionOptions);
    drawBarLineChart("userChurnChart", data.labels, data.churnAgg, data.potentialChurnAgg, {
      barColor: palette.red,
      lineColor: palette.amber,
      barName: "離脱数",
      lineName: "潜在離脱顧客数",
      valueFormatter: count,
      lineAxis: "right",
    });
    drawStackedAreaChart("userQuestProgressChart", data.labels, data.questProgressSeries, data.questProgressOptions);
    drawStackedAreaChart("userMainProgressChart", data.labels, data.mainProgressSeries, data.mainProgressOptions);
    drawLineChart("userMainScenarioViewChart", data.labels, data.mainScenarioViewSeries, { valueFormatter: percent, min: 0, max: 1 });
    drawLineChart("userEventScenarioViewChart", data.labels, data.eventScenarioViewSeries, { valueFormatter: percent, min: 0, max: 1 });
    drawLineChart("userPersonalScenarioViewChart", data.labels, data.personalScenarioViewSeries, { valueFormatter: percent, min: 0, max: 1 });
    drawLineChart("userBedroomViewChart", data.labels, data.bedroomViewSeries, { valueFormatter: percent, min: 0, max: 1 });
    drawSnsReactionChart("userSnsTrendChart", data.labels, data.snsTrendData);
  }

  function renderShell(config) {
    return `
      <div class="chart-tooltip" id="analysisChartTooltip" aria-hidden="true"></div>
      <section class="page-head">
        <div class="title-block">
          <p class="kicker">${config.kicker}</p>
          <div class="title-line">
            <h1>${config.title}</h1>
            ${infoTip(config.lead)}
          </div>
        </div>
        <div class="head-side">
          <div class="period-control condition-bar" aria-label="分析条件">
            <div class="period-picker">
              ${renderHeaderSegmentLegend()}
              <div class="period-chip period-range-chip">
                <strong>基準期間:</strong>
                <button class="period-date-button${state.calendarOpen && state.calendarTarget === "start" ? " is-active" : ""}" type="button" data-period-target="start" aria-label="開始日を選択" aria-expanded="${state.calendarOpen && state.calendarTarget === "start"}">
                  <span>${formatFullDate(periodStart)}</span>
                  <span class="calendar-mark" aria-hidden="true"></span>
                </button>
                <span class="period-separator">-</span>
                <button class="period-date-button${state.calendarOpen && state.calendarTarget === "end" ? " is-active" : ""}" type="button" data-period-target="end" aria-label="終了日を選択" aria-expanded="${state.calendarOpen && state.calendarTarget === "end"}">
                  <span>${formatFullDate(periodEnd)}</span>
                  <span class="calendar-mark" aria-hidden="true"></span>
                </button>
                <span class="period-days-badge">${periodDates.length}日</span>
              </div>
              ${state.calendarOpen ? renderCalendarPopover() : ""}
            </div>
            ${config.controls.map(renderConditionControl).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderConditionControl(control) {
    const options = typeof control.options === "function" ? control.options() : control.options;
    if (control.id === "userSegment") return "";
    if (!options?.length) return "";
    if (control.id === "userClassification") return renderUserClassificationControl(control, options);
    return `
      <div class="condition-object control-group">
        <div class="control-label">${control.label}${control.tooltip ? infoTip(control.tooltip) : ""}</div>
        <div class="segment" role="group" aria-label="${control.label}">
          ${options.map(([value, label]) => `
            <button class="segment-button${state[control.id] === value ? " is-active" : ""}" type="button" data-control="${control.id}" data-value="${value}" aria-pressed="${state[control.id] === value}">${label}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderUserClassificationControl(control, options) {
    const segmentOptions = userSegmentOptions();
    const draftClassification = activeUserSegmentDraftClassification();
    const segmentTitle = userSegmentTitle(draftClassification);
    return `
      <div class="condition-object control-group classification-control${state.userSegmentOpen && segmentOptions.length ? " is-open" : ""}">
        <div class="control-label">${control.label}${control.tooltip ? infoTip(control.tooltip) : ""}</div>
        <div class="segment" role="group" aria-label="${control.label}">
          ${options.map(([value, label]) => `
            <button class="segment-button${state[control.id] === value ? " is-active" : ""}" type="button" data-control="${control.id}" data-value="${value}" aria-pressed="${state[control.id] === value}" aria-expanded="${value === draftClassification && segmentOptions.length ? state.userSegmentOpen : false}">${label}</button>
          `).join("")}
        </div>
        ${segmentOptions.length ? `
          <div class="classification-segment-popover" role="group" aria-label="${segmentTitle}">
            <div class="classification-segment-title">${segmentTitle}</div>
            <div class="classification-segment-list">
              ${segmentOptions.map(([value, label]) => `
                <button class="segment-button${state.userClassification === draftClassification && state.userSegment === value ? " is-active" : ""}" type="button" data-control="userSegment" data-value="${value}" aria-pressed="${state.userClassification === draftClassification && state.userSegment === value}">${label}</button>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  function revenueModeToggle() {
    return `
      <div class="panel-mode-toggle segment" role="group" aria-label="売上表示">
        ${[
          ["value", "実数"],
          ["share", "割合"],
        ].map(([value, label]) => `
          <button class="segment-button${state.revenueMode === value ? " is-active" : ""}" type="button" data-control="revenueMode" data-value="${value}" aria-pressed="${state.revenueMode === value}">${label}</button>
        `).join("")}
      </div>
    `;
  }

  function userCountModeToggle() {
    const includeLoginUsers = state.userRauOnly !== "on";
    return `
      <div class="user-count-controls" aria-label="ユーザー数表示">
        <div class="panel-mode-toggle segment" role="group" aria-label="ログインユーザー含む">
          <button class="segment-button${includeLoginUsers ? " is-active" : ""}" type="button" data-control="userRauOnly" data-value="${includeLoginUsers ? "on" : "off"}" aria-pressed="${includeLoginUsers}">ログインユーザー含む</button>
        </div>
        <div class="panel-mode-toggle segment" role="group" aria-label="実数/割合">
          ${[
            ["value", "実数"],
            ["share", "割合"],
          ].map(([value, label]) => `
            <button class="segment-button${state.userCountMode === value ? " is-active" : ""}" type="button" data-control="userCountMode" data-value="${value}" aria-pressed="${state.userCountMode === value}">${label}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderHeaderSegmentLegend() {
    if (page === "users") {
      const segment = selectedUserSegment();
      if (!segment) return "";
      const tooltip = "選択中セグメントの色です。課金分析と同じ分類色を使います。";
      return `
        <div class="header-segment-legend is-compact" aria-label="選択セグメント凡例">
          <span class="header-legend-title">選択${infoTip(tooltip)}</span>
          <span class="header-legend-item" title="${segment.name}" aria-label="${segment.name}">
            ${headerColorSwatch(segment.color)}
            ${segment.name}
          </span>
        </div>
      `;
    }

    const segments = page === "sales" ? salesSegments[state.payer] : null;
    if (!segments?.length) {
      return `
        <div class="header-segment-legend is-compact" aria-label="分類軸凡例">
          <span class="header-legend-title">凡例${infoTip("分類軸を選ぶと、課金分析内の全グラフで同じ分類色を使います。")}</span>
          <span class="header-legend-item" title="全体" aria-label="全体">
            ${headerColorSwatch(palette.blue)}
            全体
          </span>
        </div>
      `;
    }
    const tooltip = state.payer === "spend"
      ? "課金額分類は、選択期間内の課金額で無課金・軽課金・中課金・重課金に分けます。凡例の色は、課金分析内の全グラフで同じ分類を表します。"
      : state.payer === "core"
        ? "コア分類は、ログイン・ライト・ミドル・コアへ分ける独自指標です。ログインはログインだけして実プレイまで進んでいないユーザーです。凡例の色は、課金分析内の全グラフで同じ分類を表します。"
        : "プレイ歴分類は、初回プレイからの経過日数で30日以内・31〜90日・91〜180日・181日以上に分けます。凡例の色は、課金分析内の全グラフで同じ分類を表します。";

    return `
      <div class="header-segment-legend is-compact" aria-label="分類軸凡例">
        <span class="header-legend-title">凡例${infoTip(tooltip)}</span>
        ${segments.map((segment) => `
          <span class="header-legend-item" title="${segment.name}" aria-label="${segment.name}">
            ${headerColorSwatch(segment.color)}
            ${segment.name}
          </span>
        `).join("")}
      </div>
    `;
  }

  function headerColorSwatch(color) {
    return `<span class="header-legend-swatch" style="background:${color}" aria-hidden="true"></span>`;
  }

  function renderCalendarPopover() {
    const targetLabel = state.calendarTarget === "start" ? "開始日" : "終了日";
    return `
      <div class="calendar-popover" role="dialog" aria-label="基準期間の${targetLabel}選択">
        <div class="calendar-popover-head">
          <span>${targetLabel}を選択</span>
          <span>選択範囲 ${periodDates.length}日</span>
        </div>
        <div class="calendar-range-preview">${periodLabel}</div>
        <div class="month-day-picker">
          <div class="calendar-month-switch" aria-label="年月を選択">
            <button class="calendar-nav-button" type="button" data-calendar-shift="-1" aria-label="前の月">&lt;</button>
            <span class="calendar-month-value">${calendarCursor.getFullYear()}/${pad2(calendarCursor.getMonth() + 1)}</span>
            <button class="calendar-nav-button" type="button" data-calendar-shift="1" aria-label="次の月">&gt;</button>
          </div>
          ${renderCalendarDayList()}
        </div>
      </div>
    `;
  }

  function renderCalendarDayList() {
    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    const lastDate = new Date(year, month + 1, 0);
    const targetDate = state.calendarTarget === "start" ? periodStart : periodEnd;
    const dates = Array.from({ length: lastDate.getDate() }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const classes = ["calendar-date"];
      const disabled = date < dataRangeStart || date > dataRangeEnd;
      if (isInSelectedPeriod(date)) classes.push("is-in-range");
      if (sameDate(date, periodDates[0])) classes.push("is-start");
      if (sameDate(date, periodEnd)) classes.push("is-end");
      if (sameDate(date, defaultPeriodEnd)) classes.push("is-default");
      if (disabled) classes.push("is-disabled");
      const isPressed = sameDate(date, targetDate);
      return `
        <button class="${classes.join(" ")}" type="button" data-calendar-date="${formatIsoDate(date)}" aria-pressed="${isPressed}" ${disabled ? "disabled" : ""}>
          ${date.getDate()}
        </button>
      `;
    });

    return `
      <section class="calendar-days">
        <span class="calendar-days-label">日</span>
        <div class="calendar-day-grid" aria-label="日を選択">
          ${dates.join("")}
        </div>
      </section>
    `;
  }

  function buildSalesBaseData(dates) {
    const signals = dates.map((date, index) => mockSignal(date, index, dates.length));
    const revenue = signals.map((signal) => {
      const base = 2.78 - signal.progress * 0.42 + signal.yearSeason * 0.18 + signal.weekend * 0.08 + signal.noise * 0.1;
      const eventLiftValue = signal.gacha * 1.18 + signal.product * 0.36 + signal.payday * 0.14;
      const drag = signal.issue * 0.48 + signal.fatigue * 0.16;
      return million(clamp(base + eventLiftValue - drag, 1.35, 6.2));
    });
    const dpuRate = signals.map((signal) => clamp(
      0.027
      - signal.progress * 0.005
      + signal.gacha * 0.006
      + signal.product * 0.002
      + signal.payday * 0.0014
      - signal.issue * 0.0035
      + signal.noise * 0.001,
      0.015,
      0.052,
    ));
    const arppu = signals.map((signal) => Math.round(clamp(
      4380
      + signal.progress * 740
      + signal.gacha * 960
      + signal.product * 280
      + signal.payday * 170
      - signal.issue * 360
      + signal.noise * 120,
      3200,
      7600,
    )));
    const purchaseRate = signals.map((signal) => clamp(
      0.058
      - signal.progress * 0.008
      + signal.gacha * 0.008
      + signal.product * 0.005
      + signal.payday * 0.002
      - signal.issue * 0.004
      + signal.noise * 0.0015,
      0.034,
      0.088,
    ));
    const productCtr = signals.map((signal) => clamp(
      0.094
      - signal.progress * 0.012
      + signal.product * 0.024
      + signal.payday * 0.006
      + signal.weekend * 0.003
      - signal.issue * 0.007
      + signal.noise * 0.003,
      0.058,
      0.148,
    ));
    const gachaCtr = signals.map((signal) => clamp(
      0.176
      - signal.progress * 0.02
      + signal.gacha * 0.048
      + signal.content * 0.012
      + signal.weekend * 0.006
      - signal.issue * 0.012
      + signal.noise * 0.005,
      0.105,
      0.292,
    ));
    const stoneSpend = signals.map((signal) => {
      const base = 835 + signal.gacha * 220 + signal.content * 75 + signal.payday * 60 - signal.issue * 95 + signal.noise * 48;
      return Math.round(clamp(base, 610, 1260));
    });
    const stoneHoldings = signals.map((signal) => Math.round(clamp(
      102000
      - signal.gacha * 18500
      + signal.product * 7600
      + signal.issue * 9800
      + signal.progress * 4500
      + signal.noise * 4200,
      62000,
      132000,
    )));

    return { revenue, dpuRate, arppu, purchaseRate, productCtr, gachaCtr, stoneSpend, stoneHoldings };
  }

  function buildUserBaseData(dates) {
    const signals = dates.map((date, index) => mockSignal(date, index, dates.length));
    const dau = signals.map((signal) => Math.round(clamp(
      39200
      - signal.progress * 6900
      + signal.acquisition * 2600
      + signal.content * 1750
      + signal.weekend * 900
      - signal.issue * 2100
      + signal.noise * 680,
      23600,
      46200,
    )));
    const dmau = signals.map((signal, index) => {
      const missionRate = clamp(0.62 - signal.progress * 0.045 + signal.content * 0.025 - signal.issue * 0.04 + signal.weekend * 0.012, 0.49, 0.69);
      return Math.round(dau[index] * missionRate);
    });
    const newUsers = signals.map((signal) => Math.round(clamp(
      86
      - signal.progress * 18
      + signal.acquisition * 165
      + signal.gacha * 42
      + signal.content * 34
      - signal.issue * 28
      + signal.weekend * 8
      + signal.noise * 13,
      38,
      420,
    )));
    const returningUsers = signals.map((signal) => Math.round(clamp(
      54
      - signal.progress * 8
      + signal.acquisition * 52
      + signal.content * 68
      + signal.gacha * 28
      - signal.issue * 18
      + signal.weekend * 10
      + signal.noise * 10,
      24,
      210,
    )));
    const churn = signals.map((signal) => Math.round(clamp(
      12.2
      + signal.progress * 1.5
      + signal.issue * 2.4
      + signal.fatigue * 1.2
      - signal.content * 1.3
      + signal.weekend * 0.7
      + signal.noise * 1.4,
      10,
      19,
    )));
    const potentialChurn = signals.map((signal) => {
      return Math.round(clamp(
        1200
        + signal.progress * 700
        + signal.issue * 1200
        + signal.fatigue * 500
        - signal.content * 220
        + signal.weekend * 90
        + signal.noise * 240,
        1000,
        4000,
      ));
    });
    const retentionD1 = signals.map((signal) => clamp(0.392 - signal.progress * 0.048 + signal.acquisition * 0.01 + signal.content * 0.013 - signal.issue * 0.026 + signal.noise * 0.004, 0.258, 0.43));
    const retentionD7 = signals.map((signal) => clamp(0.184 - signal.progress * 0.038 + signal.content * 0.011 - signal.issue * 0.019 + signal.noise * 0.003, 0.106, 0.205));
    const retentionD30 = signals.map((signal) => clamp(0.071 - signal.progress * 0.018 + signal.content * 0.005 - signal.issue * 0.009 + signal.noise * 0.0016, 0.041, 0.079));
    const tutorialCompletion = signals.map((signal) => clamp(0.785 - signal.progress * 0.055 + signal.acquisition * 0.014 + signal.content * 0.018 - signal.issue * 0.044 + signal.weekend * 0.006 + signal.noise * 0.006, 0.61, 0.84));
    const adShare = signals.map((signal) => clamp(0.49 + signal.acquisition * 0.13 + signal.gacha * 0.035 - signal.content * 0.025 + signal.noise * 0.018, 0.36, 0.72));
    const mainScenarioView = signals.map((signal) => clamp(0.61 - signal.progress * 0.065 + signal.content * 0.038 - signal.issue * 0.045 + signal.noise * 0.008, 0.38, 0.68));
    const eventScenarioView = signals.map((signal) => clamp(0.42 - signal.progress * 0.04 + signal.content * 0.075 + signal.gacha * 0.018 - signal.issue * 0.035 + signal.noise * 0.01, 0.22, 0.62));
    const personalScenarioView = signals.map((signal) => clamp(0.31 - signal.progress * 0.032 + signal.content * 0.03 + signal.product * 0.012 - signal.issue * 0.022 + signal.noise * 0.007, 0.16, 0.42));
    const bedroomView = signals.map((signal) => clamp(0.255 - signal.progress * 0.027 + signal.gacha * 0.018 + signal.content * 0.022 - signal.issue * 0.018 + signal.noise * 0.006, 0.13, 0.35));
    const questAdvanced = signals.map((signal) => clamp(0.18 - signal.progress * 0.018 + signal.content * 0.016 - signal.issue * 0.018 + signal.noise * 0.004, 0.11, 0.24));
    const questMiddle = signals.map((signal) => clamp(0.29 - signal.progress * 0.012 + signal.content * 0.01 - signal.issue * 0.004 + signal.noise * 0.004, 0.22, 0.35));
    const mainLatest = signals.map((signal) => clamp(0.235 - signal.progress * 0.028 + signal.content * 0.014 - signal.issue * 0.022 + signal.noise * 0.004, 0.13, 0.28));
    const mainThird = signals.map((signal) => clamp(0.31 + signal.progress * 0.024 + signal.issue * 0.018 - signal.content * 0.008 + signal.noise * 0.004, 0.27, 0.39));
    const mainSecond = signals.map((signal) => clamp(0.285 + signal.progress * 0.018 + signal.issue * 0.012 - signal.content * 0.006 + signal.noise * 0.003, 0.22, 0.35));
    const snsPosts = signals.map((signal) => Math.round(clamp(
      3180
      + signal.progress * 620
      + signal.content * 820
      + signal.gacha * 480
      + signal.issue * 1250
      + signal.noise * 130,
      2400,
      6100,
    )));
    const snsPositive = signals.map((signal) => clamp(31.5 - signal.progress * 5.2 + signal.content * 2.2 + signal.gacha * 0.9 - signal.issue * 5.8 + signal.noise * 0.55, 16, 39));
    const snsNegative = signals.map((signal) => clamp(29.5 + signal.progress * 7.4 + signal.issue * 7.6 + signal.fatigue * 2.6 - signal.content * 2.1 - signal.gacha * 0.8 - signal.noise * 0.45, 22, 53));

    return {
      dau,
      dmau,
      newUsers,
      returningUsers,
      churn,
      potentialChurn,
      retentionD1,
      retentionD7,
      retentionD30,
      tutorialCompletion,
      adShare,
      mainScenarioView,
      eventScenarioView,
      personalScenarioView,
      bedroomView,
      questAdvanced,
      questMiddle,
      mainLatest,
      mainSecond,
      mainThird,
      snsPosts,
      snsPositive,
      snsNegative,
    };
  }

  function mockSignal(date, index, total) {
    const progress = total <= 1 ? 0 : index / (total - 1);
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const yearSeason = Math.sin((dayOfYear(date) - 18) / 365.25 * Math.PI * 2);
    const weekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0;
    const payday = day <= 3 || day >= 25 ? 1 : 0;
    const gacha = clamp(eventLift(date, gachaEventDates), 0, 1.7);
    const product = clamp(eventLift(date, productEventDates) + payday * 0.16, 0, 1.25);
    const acquisition = clamp(eventLift(date, acquisitionEventDates), 0, 1.35);
    const content = clamp(eventLift(date, contentEventDates), 0, 1.35);
    const issue = clamp(eventLift(date, issueEventDates), 0, 1.25);
    const fatigue = clamp(
      gaussianPulse(date, "2024-10-18", 18, 0.35)
      + gaussianPulse(date, "2025-07-31", 16, 0.38)
      + gaussianPulse(date, "2026-04-12", 16, 0.62),
      0,
      1,
    );
    const noise = Math.sin(index * 0.43 + 0.7) * 0.55 + Math.sin(index * 1.71 + 2.2) * 0.25 + Math.sin(index * 0.061 + 1.1) * 0.2;
    return { progress, yearSeason, weekend, payday, gacha, product, acquisition, content, issue, fatigue, noise };
  }

  function eventLift(date, events) {
    return events.reduce((total, event) => total + gaussianPulse(date, event[0], event[1], event[2]), 0);
  }

  function gaussianPulse(date, isoDate, widthDays, amplitude) {
    const diff = Math.round((startOfDay(date) - parseIsoDate(isoDate)) / 86400000);
    return amplitude * Math.exp(-(diff * diff) / (2 * widthDays * widthDays));
  }

  function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.round((startOfDay(date) - start) / 86400000) + 1;
  }

  function buildSalesData() {
    const segments = salesSegments[state.payer] || [];
    const isSegmented = segments.length > 0;
    const revenue = fitSeries(salesBase.revenue);
    const dpu = fitSeries(salesBase.dpuRate);
    const arppu = fitSeries(salesBase.arppu);
    const purchase = fitSeries(salesBase.purchaseRate);
    const productCtr = fitSeries(salesBase.productCtr);
    const gachaCtr = fitSeries(salesBase.gachaCtr);
    const productPurchase = purchase.map((value, index) => value * (0.72 + (index % 6) * 0.006));
    const gachaPurchase = purchase.map((value, index) => value * (1.08 - Math.min(index, 24) * 0.004));
    const stone = fitSeries(salesBase.stoneSpend);
    const stoneHolding = fitSeries(salesBase.stoneHoldings);
    const grain = state.grain;
    const revenueTotal = sum(revenue);
    const gachaShare = 0.68;
    const productShare = 0.32;
    const baseGachaItems = [
      { label: "限定フェス後半", value: revenueTotal * gachaShare * 0.42 },
      { label: "復刻セレクション", value: revenueTotal * gachaShare * 0.28 },
      { label: "月末ステップアップ", value: revenueTotal * gachaShare * 0.18 },
      { label: "常設ピックアップ", value: revenueTotal * gachaShare * 0.12 },
    ];
    const baseProductItems = [
      { label: "初回限定パック", value: revenueTotal * productShare * 0.36 },
      { label: "月額パス", value: revenueTotal * productShare * 0.27 },
      { label: "育成素材パック", value: revenueTotal * productShare * 0.21 },
      { label: "衣装パック", value: revenueTotal * productShare * 0.16 },
    ];
    const summary = {
      revenue: aggregate(revenue, grain, "sum"),
      dpuRate: aggregate(dpu, grain, "avg"),
      arppu: aggregate(arppu, grain, "avg"),
      stone: aggregate(stone, grain, "sum"),
    };

    if (!isSegmented) {
      return {
        labels: groups[grain].map((group) => group.label),
        isSegmented,
        summary,
        revenueLegend: [["売上", palette.blue]],
        segmentLegend: [["全体", palette.blue]],
        gachaClickLegend: [["ガチャクリック率", palette.gacha]],
        gachaPurchaseLegend: [["ガチャ購入率", palette.gachaDeep]],
        productClickLegend: [["商品クリック率", palette.product]],
        productPurchaseLegend: [["商品購入率", palette.productDeep]],
        revenueAgg: aggregate(revenue, grain, "sum"),
        revenueCompositionSeries: [{ name: "全体", values: groups[grain].map(() => 1), color: palette.blue }],
        dpuRateSeries: [{ name: "課金率", values: aggregate(dpu, grain, "avg"), color: palette.blue }],
        arppuSeries: [{ name: "ARPPU", values: aggregate(arppu, grain, "avg"), color: palette.violet }],
        stoneSeries: [{ name: "石消費数", values: aggregate(stone, grain, "sum"), color: palette.blue }],
        gachaClickSeries: [{ name: "ガチャクリック率", values: aggregate(gachaCtr, grain, "avg"), color: palette.gacha }],
        gachaPurchaseSeries: [{ name: "ガチャ購入率", values: aggregate(gachaPurchase, grain, "avg"), color: palette.gachaDeep }],
        productClickSeries: [{ name: "商品クリック率", values: aggregate(productCtr, grain, "avg"), color: palette.product }],
        productPurchaseSeries: [{ name: "商品購入率", values: aggregate(productPurchase, grain, "avg"), color: palette.productDeep }],
        stoneHoldingSeries: [{ name: "石保有数", values: aggregate(stoneHolding, grain, "avg"), color: palette.teal }],
        gachaRevenueItems: baseGachaItems,
        productRevenueItems: baseProductItems,
      };
    }

    const revenueSeries = stackedRevenueSeries(revenue, segments, grain);

    return {
      labels: groups[grain].map((group) => group.label),
      isSegmented,
      summary,
      revenueLegend: segmentLegend(segments),
      segmentLegend: segmentLegend(segments),
      gachaClickLegend: segmentLegend(segments),
      gachaPurchaseLegend: segmentLegend(segments),
      productClickLegend: segmentLegend(segments),
      productPurchaseLegend: segmentLegend(segments),
      revenueSeries,
      revenueCompositionSeries: compositionSeries(revenueSeries),
      dpuRateSeries: state.payer === "spend"
        ? [{ name: "全体 課金率", values: aggregate(dpu, grain, "avg"), color: palette.blue }]
        : segmentSeries(dpu, segments, "rateFactor", grain, "avg", "課金率"),
      arppuSeries: segmentSeries(arppu, segments, "arppuFactor", grain, "avg", "ARPPU"),
      stoneSeries: segmentSeries(stone, segments, "stoneFactor", grain, "sum", "石消費数"),
      gachaClickSeries: segmentSeries(gachaCtr, segments, "gachaCtrFactor", grain, "avg", "ガチャクリック率"),
      gachaPurchaseSeries: segmentSeries(gachaPurchase, segments, "gachaPurchaseFactor", grain, "avg", "ガチャ購入率"),
      productClickSeries: segmentSeries(productCtr, segments, "productCtrFactor", grain, "avg", "商品クリック率"),
      productPurchaseSeries: segmentSeries(productPurchase, segments, "productPurchaseFactor", grain, "avg", "商品購入率"),
      stoneHoldingSeries: segmentSeries(stoneHolding, segments, "holdingFactor", grain, "avg", "石保有数"),
      gachaRevenueItems: segmentedItems(baseGachaItems, segments),
      productRevenueItems: segmentedItems(baseProductItems, segments),
    };
  }

  function segmentLegend(segments) {
    return segments.map((segment) => [segment.name, segment.color, segment.dashArray]);
  }

  function areaLegend(segments) {
    return segments.map((segment) => [segment.name, segment.color, "", "area"]);
  }

  function userSegmentOptions() {
    return (salesSegments[activeUserSegmentDraftClassification()] || []).map((segment) => [segment.key, segment.name]);
  }

  function activeUserSegmentDraftClassification() {
    return state.userSegmentOpen
      ? state.userSegmentDraftClassification || state.userClassification
      : state.userClassification;
  }

  function userSegmentTitle(classification) {
    const labels = {
      spend: "課金額セグメント",
      core: "コアセグメント",
      playHistory: "プレイ歴セグメント",
    };
    return labels[classification] || "セグメント";
  }

  function selectedUserSegment() {
    const segments = salesSegments[state.userClassification] || [];
    return segments.find((segment) => segment.key === state.userSegment) || null;
  }

  function userSegmentModifier(segment) {
    const base = {
      free: { active: 0.64, retention: 0.78, newUsers: 0.74, churn: 1.24 },
      light: { active: 0.23, retention: 0.94, newUsers: 0.2, churn: 0.96 },
      mid: { active: 0.09, retention: 1.1, newUsers: 0.05, churn: 0.78 },
      heavy: { active: 0.04, retention: 1.24, newUsers: 0.01, churn: 0.58 },
      login: { active: 0.41, retention: 0.58, newUsers: 0.46, churn: 1.48 },
      lite: { active: 0.36, retention: 0.86, newUsers: 0.36, churn: 1.05 },
      middle: { active: 0.17, retention: 1.08, newUsers: 0.14, churn: 0.82 },
      core: { active: 0.06, retention: 1.26, newUsers: 0.04, churn: 0.62 },
      play30: { active: 0.18, retention: 0.72, newUsers: 0.62, churn: 1.34 },
      play90: { active: 0.22, retention: 0.88, newUsers: 0.24, churn: 1.08 },
      play180: { active: 0.25, retention: 1.04, newUsers: 0.1, churn: 0.86 },
      play181: { active: 0.35, retention: 1.22, newUsers: 0.04, churn: 0.66 },
    };
    return base[segment?.key] || userModifiers.segment.all;
  }

  function comparisonLegend(segment) {
    return segment ? [[segment.name, segment.color]] : null;
  }

  function comparisonSeries(label, selectedValues, segment, colorOverride = "") {
    if (!segment) return null;
    return [
      { name: `${segment.name} ${label}`, values: selectedValues, color: colorOverride || segment.color },
    ];
  }

  function compositionSeries(series) {
    const length = series[0]?.values.length || 0;
    const totals = Array.from({ length }, (_, index) => sum(series.map((item) => item.values[index] || 0)));

    return series.map((item) => ({
      ...item,
      values: item.values.map((value, index) => (totals[index] ? value / totals[index] : 0)),
    }));
  }

  function filterVisibleSeries(series, filterKey) {
    if (!filterKey) return series;
    const filter = state[filterKey] || {};
    const visible = series.filter((item) => filter[item.name] !== false);
    return visible.length ? visible : series;
  }

  function isSeriesVisible(filterKey, label) {
    return !filterKey || (state[filterKey] || {})[label] !== false;
  }

  function seriesTotals(series) {
    const length = series[0]?.values.length || 0;
    return Array.from({ length }, (_, index) => sum(series.map((item) => item.values[index] || 0)));
  }

  function segmentSeries(values, segments, factorKey, grain, mode, metricName = "", colorOverride = "") {
    return segments.map((segment) => ({
      segmentKey: segment.key,
      name: metricName ? `${segment.name} ${metricName}` : segment.name,
      values: aggregate(segmentValues(values, segment, factorKey), grain, mode),
      color: colorOverride || segment.color,
      dashArray: segment.dashArray,
    }));
  }

  function classificationBaseShares(classification) {
    if (classification === "spend") {
      return {
        free: shareCurve(0.38, 0.66, 0.014, 0.1),
        light: shareCurve(0.34, 0.23, 0.01, 1.2),
        mid: shareCurve(0.2, 0.08, 0.008, 2.1),
        heavy: shareCurve(0.08, 0.03, 0.005, 2.8),
      };
    }

    if (classification === "core") {
      return {
        login: shareCurve(0.28, 0.42, 0.012, 0.3),
        lite: shareCurve(0.34, 0.37, 0.01, 1.1),
        middle: shareCurve(0.25, 0.16, 0.008, 2),
        core: shareCurve(0.13, 0.05, 0.006, 2.7),
      };
    }

    if (classification === "playHistory") {
      return {
        play30: shareCurve(0.24, 0.12, 0.012, 0.6),
        play90: shareCurve(0.28, 0.2, 0.01, 1.4),
        play180: shareCurve(0.22, 0.24, 0.008, 2.2),
        play181: shareCurve(0.26, 0.44, 0.011, 2.9),
      };
    }

    return {};
  }

  function distributionSeries(segments, baseShares, grain, totals = null) {
    const normalized = {};
    days.forEach((_, index) => {
      const total = sum(segments.map((segment) => baseShares[segment.key]?.[index] || 0)) || 1;
      segments.forEach((segment) => {
        if (!normalized[segment.key]) normalized[segment.key] = [];
        normalized[segment.key][index] = (baseShares[segment.key]?.[index] || 0) / total;
      });
    });

    return [...segments].reverse().map((segment) => ({
      segmentKey: segment.key,
      name: segment.name,
      values: aggregate((normalized[segment.key] || days.map(() => 0)).map((value, index) => totals ? value * totals[index] : value), grain, "avg"),
      color: segment.color,
    }));
  }

  function normalizedShareSeries(classification, segmentKey) {
    const segments = salesSegments[classification] || [];
    const baseShares = classificationBaseShares(classification);
    return days.map((_, index) => {
      const total = sum(segments.map((segment) => baseShares[segment.key]?.[index] || 0)) || 1;
      return (baseShares[segmentKey]?.[index] || 0) / total;
    });
  }

  function segmentInflowData(segment, metrics, grain) {
    const classification = state.userClassification;
    const share = normalizedShareSeries(classification, segment.key);
    const segmentUsers = metrics.dau.map((value, index) => value * share[index]);
    const cumulativeNet = segmentUsers.map((value, index) => {
      if (index === 0) return 0;
      const rawChange = value - segmentUsers[index - 1];
      const wave = Math.sin(dataIndexForDate(periodDates[index]) * 0.23 + share[index] * 4) * Math.max(3, value * 0.0009);
      return Math.round(rawChange + wave);
    }).reduce((values, value) => {
      values.push(Math.round((values[values.length - 1] || 0) + value));
      return values;
    }, []);
    const seriesValues = aggregate(cumulativeNet, grain, "last");
    const lineColor = palette.blue;
    const movementData = segmentMovementData(segment, metrics, grain);

    return {
      title: "セグメント増減",
      tooltip: `${segment.name}が期間内で結局増えたか減ったかを線で見ながら、同じ期間の入れ替わり人数を発散棒で見る。`,
      legend: [["期間内純増減", lineColor], ...movementData.legend],
      series: {
        net: seriesValues,
        increased: movementData.series.increased,
        decreased: movementData.series.decreased,
      },
      options: { chartType: "segmentMovementNet", lineColor, increaseColor: summarySnsColors.positive, decreaseColor: summarySnsColors.negative, valueFormatter: count },
    };
  }

  function segmentMovementData(segment, metrics, grain) {
    const classification = state.userClassification;
    const share = normalizedShareSeries(classification, segment.key);
    const segmentUsers = metrics.dau.map((value, index) => value * share[index]);
    const movementRates = {
      free: 0.011,
      light: 0.008,
      mid: 0.0055,
      heavy: 0.0032,
      login: 0.014,
      lite: 0.0095,
      middle: 0.006,
      core: 0.0035,
      play30: 0.014,
      play90: 0.009,
      play180: 0.006,
      play181: 0.0038,
    };
    const movementRate = movementRates[segment.key] || 0.006;
    const movement = segmentUsers.map((value, index) => {
      const dateIndex = dataIndexForDate(periodDates[index]);
      const seasonality = 1 + Math.sin(dateIndex * 0.16 + share[index] * 6) * 0.22 + Math.cos(dateIndex * 0.07) * 0.12;
      return Math.max(1, value * movementRate * seasonality);
    });
    const netChanges = segmentUsers.map((value, index) => {
      if (index === 0) return 0;
      const rawChange = value - segmentUsers[index - 1];
      const wave = Math.sin(dataIndexForDate(periodDates[index]) * 0.23 + share[index] * 4) * Math.max(3, value * 0.0009);
      return Math.round(rawChange + wave);
    });
    const increased = movement.map((value, index) => Math.round(value + Math.max(0, netChanges[index]) * 0.55));
    const decreased = movement.map((value, index) => Math.round(value + Math.max(0, -netChanges[index]) * 0.55));

    return {
      title: "セグメント増減人数",
      tooltip: `${segment.name}へ入った人数と、${segment.name}から外れた人数を同時に見る。純増減だけでは見えない入れ替わり量を確認する。`,
      legend: [["増えた人数", summarySnsColors.positive, "", "bar"], ["減った人数", summarySnsColors.negative, "", "bar"]],
      series: {
        increased: aggregate(increased, grain, "sum"),
        decreased: aggregate(decreased, grain, "sum"),
      },
      options: { chartType: "divergingBar", increaseColor: summarySnsColors.positive, decreaseColor: summarySnsColors.negative, valueFormatter: count },
    };
  }

  function segmentMaintenanceSeries(segment, grain) {
    const modifier = userSegmentModifier(segment);
    const d1 = fitSeries(userBase.retentionD1).map((value) => clamp(0.78 + (value - 0.34) * 0.75 + (modifier.retention - 1) * 0.18, 0.58, 0.96));
    const d7 = fitSeries(userBase.retentionD7).map((value) => clamp(0.57 + (value - 0.16) * 1 + (modifier.retention - 1) * 0.2, 0.36, 0.88));
    const d30 = fitSeries(userBase.retentionD30).map((value) => clamp(0.41 + (value - 0.06) * 1.3 + (modifier.retention - 1) * 0.22, 0.22, 0.76));

    return [
      { name: "D1維持率", values: aggregate(d1, grain, "avg"), color: palette.teal },
      { name: "D7維持率", values: aggregate(d7, grain, "avg"), color: palette.blue },
      { name: "D30維持率", values: aggregate(d30, grain, "avg"), color: segment.color },
    ];
  }

  function userPrimaryActiveData(metrics, grain, activeScale) {
    const isShare = state.userCountMode === "share";
    const isRauOnly = state.userRauOnly === "on";
    const classification = state.userClassification;

    if (salesSegments[classification]) {
      const segments = isRauOnly && classification === "core"
        ? salesSegments[classification].filter((segment) => segment.key !== "login")
        : salesSegments[classification];
      const population = isRauOnly ? metrics.dmau : metrics.dau;
      const totals = population.map((value) => value * activeScale);
      const baseShares = classificationBaseShares(classification);
      const rawSeries = distributionSeries(segments, baseShares, grain, totals);
      const displaySeries = distributionSeries(segments, baseShares, grain, isShare ? null : totals);
      const filteredSeries = filterVisibleSeries(displaySeries, "userPrimaryActiveVisible");
      const filteredRawSeries = filterVisibleSeries(rawSeries, "userPrimaryActiveVisible");
      return {
        legend: areaLegend(segments),
        series: filteredSeries,
        options: {
          valueFormatter: isShare ? percent : count,
          max: isShare ? 1 : undefined,
          hideRatioInTooltip: true,
          showTotalInTooltip: true,
          totalTooltipLabel: "合計",
          tooltipTotals: seriesTotals(filteredRawSeries),
          totalValueFormatter: count,
        },
      };
    }

    const dmau = metrics.dmau.map((value) => value * activeScale);
    const loginUsers = metrics.dau.map((value, index) => Math.max(0, value - metrics.dmau[index]) * activeScale);
    const totals = dmau.map((value, index) => value + loginUsers[index]);
    const valueOrShare = (values) => isShare
      ? values.map((value, index) => (totals[index] ? value / totals[index] : 0))
      : values;
    const displaySeries = [
      { name: "rAU", values: aggregate(valueOrShare(dmau), grain, "avg"), color: cohortColors.middle },
      { name: "ログインユーザー", values: aggregate(valueOrShare(loginUsers), grain, "avg"), color: cohortColors.low },
    ];
    const rawSeries = [
      { name: "rAU", values: aggregate(dmau, grain, "avg"), color: cohortColors.middle },
      { name: "ログインユーザー", values: aggregate(loginUsers, grain, "avg"), color: cohortColors.low },
    ];
    const filteredSeries = isRauOnly
      ? displaySeries.filter((item) => item.name === "rAU")
      : filterVisibleSeries(displaySeries, "userPrimaryActiveVisible");
    const filteredRawSeries = isRauOnly
      ? rawSeries.filter((item) => item.name === "rAU")
      : filterVisibleSeries(rawSeries, "userPrimaryActiveVisible");

    return {
      legend: isRauOnly
        ? [["rAU", cohortColors.middle, "", "area"]]
        : [["ログインユーザー", cohortColors.low, "", "area"], ["rAU", cohortColors.middle, "", "area"]],
      series: filteredSeries,
      options: {
        valueFormatter: isShare ? percent : count,
        max: isShare ? 1 : undefined,
        hideRatioInTooltip: true,
        showTotalInTooltip: true,
        totalTooltipLabel: "合計",
        tooltipTotals: seriesTotals(filteredRawSeries),
        totalValueFormatter: count,
        tooltipLabels: {
          rAU: "rAU（ログインを除いた実プレイユーザー）",
        },
      },
    };
  }

  function userMetricBreakdowns(averageMetrics, grain, activeScale) {
    const segments = salesSegments[state.userClassification] || [];
    if (!segments.length) return {};

    return {
      users: segments.map((segment) => {
        const metrics = buildUserMetricSet(userSegmentModifier(segment));
        const values = metrics.dau.map((value) => value * activeScale);
        return {
          label: segment.name,
          value: count(avg(aggregate(values, grain, "avg"))),
          delta: segmentBreakdownDelta(periodDelta(values)),
          color: segment.color,
        };
      }),
      rau: segments.map((segment) => {
        const metrics = buildUserMetricSet(userSegmentModifier(segment));
        const values = metrics.dmau.map((value) => value * activeScale);
        return {
          label: segment.name,
          value: count(avg(aggregate(values, grain, "avg"))),
          delta: segmentBreakdownDelta(periodDelta(values)),
          color: segment.color,
        };
      }),
      newUsers: segments.map((segment) => {
        const metrics = buildUserMetricSet(userSegmentModifier(segment));
        return {
          label: segment.name,
          value: count(sum(aggregate(metrics.newUsers, grain, "sum"))),
          color: segment.color,
        };
      }),
      returningUsers: segments.map((segment) => {
        const metrics = buildUserMetricSet(userSegmentModifier(segment));
        return {
          label: segment.name,
          value: count(sum(aggregate(metrics.returningUsers, grain, "sum"))),
          color: segment.color,
        };
      }),
      churn: classifiedChurnBreakdown(segments, averageMetrics.churn, grain),
    };
  }

  function classifiedChurnBreakdown(segments, churnValues, grain) {
    const baseShares = classificationBaseShares(state.userClassification);

    return segments.map((segment) => {
      const values = churnValues.map((value, index) => {
        const weights = segments.map((item) => {
          const share = baseShares[item.key]?.[index] || 0;
          return share * userSegmentModifier(item).churn;
        });
        const totalWeight = sum(weights) || 1;
        const segmentWeight = ((baseShares[segment.key]?.[index] || 0) * userSegmentModifier(segment).churn) / totalWeight;
        return value * segmentWeight;
      });

      return {
        label: segment.name,
        value: count(sum(aggregate(values, grain, "sum"))),
        color: segment.color,
      };
    });
  }

  function shareCurve(start, end, wave = 0, phase = 0) {
    const totalSpan = Math.max(1, dataRangeEnd - dataRangeStart);
    return periodDates.map((date) => {
      const progress = clamp((startOfDay(date) - dataRangeStart) / totalSpan, 0, 1);
      const annualWave = Math.sin((dayOfYear(date) / 365.25) * Math.PI * 2 + phase) * wave;
      const shortWave = Math.sin(dataIndexForDate(date) * 0.09 + phase) * wave * 0.35;
      return Math.max(0.001, start + (end - start) * progress + annualWave + shortWave);
    });
  }

  function stackedRevenueSeries(values, segments, grain) {
    return segmentSeries(values, [...segments].reverse(), "revenueShare", grain, "sum");
  }

  function segmentValues(values, segment, factorKey) {
    return values.map((value, index) => value * segment[factorKey] * trendValue(segment, factorKey, index, values.length));
  }

  function trendValue(segment, factorKey, index, length) {
    const trend = segment[`${factorKey.replace(/Factor|Share$/, "")}Trend`];
    if (!trend) return 1;
    const progress = length <= 1 ? 0 : index / (length - 1);
    const wave = 1 + Math.sin(progress * Math.PI * 2) * 0.025;
    return (trend[0] + (trend[1] - trend[0]) * progress) * wave;
  }

  function segmentedItems(items, segments) {
    return items.map((item) => ({
      label: item.label,
      value: item.value,
      segments: segments.map((segment) => ({
        name: segment.name,
        value: item.value * segment.revenueShare,
        color: segment.color,
      })),
    }));
  }

  function buildUserMetricSet(segment) {
    const activeFactor = segment.active;
    const retentionFactor = segment.retention;
    const churnFactor = segment.churn;
    const dau = fitSeries(userBase.dau).map((value) => value * activeFactor);
    const dmau = fitSeries(userBase.dmau).map((value) => value * activeFactor);
    const newUsers = fitSeries(userBase.newUsers).map((value) => value * segment.newUsers);
    const returningUsers = fitSeries(userBase.returningUsers).map((value) => value * clamp(segment.retention * 0.55 + segment.newUsers * 0.45, 0.1, 1.18));
    const churn = fitSeries(userBase.churn).map((value) => value * churnFactor);
    const d1 = fitSeries(userBase.retentionD1).map((value) => value * retentionFactor);
    const d7 = fitSeries(userBase.retentionD7).map((value) => value * retentionFactor);
    const d30 = fitSeries(userBase.retentionD30).map((value) => value * retentionFactor);
    const tutorialCompletion = fitSeries(userBase.tutorialCompletion).map((value) => clamp(value + (retentionFactor - 1) * 0.12, 0.52, 0.9));
    const potentialChurn = fitSeries(userBase.potentialChurn).map((value) => Math.round(clamp(value * clamp(churnFactor, 0.72, 1.35), 1000, 4000)));
    const adShare = fitSeries(userBase.adShare);
    const adNewUsers = newUsers.map((value, index) => value * adShare[index]);
    const organicNewUsers = newUsers.map((value, index) => value - adNewUsers[index]);
    const mainScenarioView = fitSeries(userBase.mainScenarioView).map((value) => clamp(value * segment.retention, 0.18, 0.72));
    const eventScenarioView = fitSeries(userBase.eventScenarioView).map((value) => clamp(value * segment.retention, 0.14, 0.64));
    const personalScenarioView = fitSeries(userBase.personalScenarioView).map((value) => clamp(value * segment.retention, 0.08, 0.45));
    const bedroomView = fitSeries(userBase.bedroomView).map((value) => clamp(value * segment.retention, 0.07, 0.38));
    const questAdvancedRaw = fitSeries(userBase.questAdvanced).map((value) => clamp(value * segment.retention, 0.12, 0.45));
    const questMiddleRaw = fitSeries(userBase.questMiddle).map((value) => clamp(value + (1 - segment.retention) * 0.05, 0.24, 0.44));
    const questClearedTotal = tutorialCompletion.map((value) => clamp(value - 0.035, 0.52, 0.88));
    const [questAdvanced, questMiddle] = fitProgressLayers([questAdvancedRaw, questMiddleRaw], questClearedTotal, 0.64);
    const questBeginner = questClearedTotal.map((value, index) => Math.max(0.04, value - questAdvanced[index] - questMiddle[index]));
    const mainLatestRaw = fitSeries(userBase.mainLatest).map((value) => clamp(value * segment.retention, 0.08, 0.32));
    const mainThirdRaw = fitSeries(userBase.mainThird).map((value) => clamp(value + (1 - segment.retention) * 0.03, 0.24, 0.42));
    const mainSecondRaw = fitSeries(userBase.mainSecond).map((value) => clamp(value + (1 - segment.retention) * 0.025, 0.2, 0.38));
    const mainClearedTotal = mainScenarioView.map((value) => clamp(value + 0.12, 0.52, 0.88));
    const [mainLatest, mainThird, mainSecond] = fitProgressLayers([mainLatestRaw, mainThirdRaw, mainSecondRaw], mainClearedTotal, 0.86);
    const mainFirst = mainClearedTotal.map((value, index) => Math.max(0.04, value - mainLatest[index] - mainThird[index] - mainSecond[index]));

    return {
      dau,
      dmau,
      newUsers,
      returningUsers,
      churn,
      d1,
      d7,
      d30,
      tutorialCompletion,
      potentialChurn,
      adNewUsers,
      organicNewUsers,
      mainScenarioView,
      eventScenarioView,
      personalScenarioView,
      bedroomView,
      questBeginner,
      questMiddle,
      questAdvanced,
      mainFirst,
      mainSecond,
      mainThird,
      mainLatest,
    };
  }

  function questProgressAreaSeries(metrics, grain) {
    const advanced = aggregate(metrics.questAdvanced, grain, "avg");
    const middle = aggregate(metrics.questMiddle, grain, "avg");
    const beginner = aggregate(metrics.questBeginner, grain, "avg");
    const middleCumulative = middle.map((value, index) => value + advanced[index]);
    const beginnerCumulative = beginner.map((value, index) => value + middleCumulative[index]);

    return [
      { name: "上級", values: advanced, tooltipValues: advanced, color: cohortColors.high },
      { name: "中級", values: middle, tooltipValues: middleCumulative, color: cohortColors.middle },
      { name: "初級", values: beginner, tooltipValues: beginnerCumulative, color: cohortColors.light },
    ];
  }

  function mainProgressAreaSeries(metrics, grain) {
    const latest = aggregate(metrics.mainLatest, grain, "avg");
    const third = aggregate(metrics.mainThird, grain, "avg");
    const second = aggregate(metrics.mainSecond, grain, "avg");
    const first = aggregate(metrics.mainFirst, grain, "avg");
    const thirdCumulative = third.map((value, index) => value + latest[index]);
    const secondCumulative = second.map((value, index) => value + thirdCumulative[index]);
    const firstCumulative = first.map((value, index) => value + secondCumulative[index]);

    return [
      { name: "最新", values: latest, tooltipValues: latest, color: cohortColors.high },
      { name: "三部", values: third, tooltipValues: thirdCumulative, color: cohortColors.middle },
      { name: "二部", values: second, tooltipValues: secondCumulative, color: cohortColors.light },
      { name: "一部", values: first, tooltipValues: firstCumulative, color: cohortColors.low },
    ];
  }

  function fitProgressLayers(rawLayers, targetTotals, lowerShareCap) {
    const fitted = rawLayers.map(() => []);
    targetTotals.forEach((target, index) => {
      const rawSum = sum(rawLayers.map((layer) => layer[index] || 0));
      const fittedSum = Math.min(rawSum, target * lowerShareCap, Math.max(0, target - 0.04));
      const scale = rawSum ? fittedSum / rawSum : 0;
      rawLayers.forEach((layer, layerIndex) => {
        fitted[layerIndex][index] = (layer[index] || 0) * scale;
      });
    });
    return fitted;
  }

  function buildUserData() {
    const selectedSegment = selectedUserSegment();
    const averageMetrics = buildUserMetricSet(userModifiers.segment.all);
    const metrics = selectedSegment ? buildUserMetricSet(userSegmentModifier(selectedSegment)) : averageMetrics;
    const grain = state.grain;
    const useMonthlyActive = grain !== "daily";
    const activeScale = useMonthlyActive ? 1.62 : 1;
    const primaryActive = userPrimaryActiveData(averageMetrics, grain, activeScale);
    const metricBreakdowns = userMetricBreakdowns(averageMetrics, grain, activeScale);
    const rauValues = averageMetrics.dmau.map((value) => value * activeScale);
    const userSummary = {
      rau: aggregate(rauValues, grain, "avg"),
      rauDelta: periodDelta(rauValues),
      newUsers: aggregate(averageMetrics.newUsers, grain, "sum"),
      returningUsers: aggregate(averageMetrics.returningUsers, grain, "sum"),
      churn: aggregate(averageMetrics.churn, grain, "sum"),
    };
    const snsPosts = fitSeries(userBase.snsPosts);
    const snsPositive = fitSeries(userBase.snsPositive);
    const snsNegative = fitSeries(userBase.snsNegative);
    const snsTrendLegend = [
      ["SNS投稿数", summarySnsColors.posts],
      ["ポジ率", summarySnsColors.positive],
      ["ネガ率", summarySnsColors.negative],
    ];
    const compareLegend = comparisonLegend(selectedSegment);
    const newUsersData = selectedSegment
      ? segmentInflowData(selectedSegment, averageMetrics, grain)
      : (() => {
        const series = [
          { name: "自然流入", values: aggregate(metrics.organicNewUsers, grain, "sum"), color: palette.teal },
          { name: "広告", values: aggregate(metrics.adNewUsers, grain, "sum"), color: palette.blue },
          { name: "復帰", values: aggregate(metrics.returningUsers, grain, "sum"), color: summarySnsColors.positive },
        ];
        return {
          title: "新規/復帰ユーザー数",
          tooltip: "新規流入と復帰規模。自然流入・広告・復帰を並べて、獲得と呼び戻しのどちらが効いているかを見る。",
          legend: [["復帰", summarySnsColors.positive, "", "area"], ["広告", palette.blue, "", "area"], ["自然流入", palette.teal, "", "area"]],
          series: filterVisibleSeries(series, "userNewUsersVisible"),
          options: { valueFormatter: count },
          legendFilterKey: "userNewUsersVisible",
        };
      })();
    const retentionSeries = selectedSegment ? [] : [
        { name: "チュートリアル突破", values: aggregate(metrics.tutorialCompletion, grain, "avg"), color: summarySnsColors.positive },
        { name: "D1", values: aggregate(metrics.d1, grain, "avg"), color: palette.teal },
        { name: "D7", values: aggregate(metrics.d7, grain, "avg"), color: palette.blue },
        { name: "D30", values: aggregate(metrics.d30, grain, "avg"), color: palette.violet },
      ];
    const questProgressSeries = questProgressAreaSeries(metrics, grain);
    const mainProgressSeries = mainProgressAreaSeries(metrics, grain);
    const lineComparison = (label, values, color) => selectedSegment
      ? comparisonSeries(label, aggregate(values, grain, "avg"), selectedSegment, color)
      : [{ name: label, values: aggregate(values, grain, "avg"), color }];

    return {
      labels: groups[grain].map((group) => group.label),
      snsTrendLegend,
      newUsersTitle: newUsersData.title,
      newUsersTooltip: newUsersData.tooltip,
      newUsersLegend: newUsersData.legend,
      newUsersSeries: newUsersData.series,
      newUsersOptions: newUsersData.options,
      newUsersLegendFilterKey: newUsersData.legendFilterKey,
      retentionTitle: "チュートリアル / D1 / D7 / D30継続率",
      retentionTooltip: "新規定着率の下位重要ノード。チュートリアル突破からD1・D7・D30まで、初回体験後の落ち方を見る。",
      retentionLegend: [["チュートリアル", summarySnsColors.positive], ["D1", palette.teal], ["D7", palette.blue], ["D30", palette.violet]],
      retentionSeries,
      retentionOptions: { valueFormatter: percentFixed1, min: 0, max: 1 },
      questProgressLegend: [["初級", cohortColors.light, "", "area"], ["中級", cohortColors.middle, "", "area"], ["上級", cohortColors.high, "", "area"]],
      mainProgressLegend: [["一部", cohortColors.low, "", "area"], ["二部", cohortColors.light, "", "area"], ["三部", cohortColors.middle, "", "area"], ["最新", cohortColors.high, "", "area"]],
      questProgressOptions: { valueFormatter: percentFixed1, max: 1, hideRatioInTooltip: true },
      mainProgressOptions: { valueFormatter: percentFixed1, max: 1, hideRatioInTooltip: true },
      userPrimaryActiveLegend: primaryActive.legend,
      userPrimaryActiveSeries: primaryActive.series,
      userPrimaryActiveOptions: primaryActive.options,
      userSummary,
      metricBreakdowns,
      snsSummaryItems: [
        {
          label: "全体サマリ",
          tone: "overall",
          body: "投稿量はイベント更新日に伸びる一方、期間後半は反応の質が鈍化。ゲーム内の閲覧率低下と同じ日にネガ率が上がっている。",
        },
        {
          label: "ポジティブサマリ",
          tone: "positive",
          body: "キャラ追加、限定ガチャ、親密度エピソード解放への反応が強い。特にスクショ共有とシナリオ感想がポジティブ投稿を押し上げている。",
        },
        {
          label: "ネガティブサマリ",
          tone: "negative",
          body: "報酬到達までの長さ、ガチャ結果、イベント後半の作業感に不満が集中。離脱リスク層の増加タイミングと重なる。",
        },
      ],
      dauAgg: aggregate(metrics.dau, grain, "avg"),
      dmauAgg: aggregate(metrics.dmau, grain, "avg"),
      churnAgg: aggregate(metrics.churn, grain, "sum"),
      potentialChurnAgg: aggregate(metrics.potentialChurn, grain, "avg"),
      questProgressSeries,
      mainProgressSeries,
      mainScenarioViewSeries: lineComparison("メインシナリオ閲覧率", metrics.mainScenarioView, palette.blue),
      eventScenarioViewSeries: lineComparison("イベントシナリオ閲覧率", metrics.eventScenarioView, palette.blue),
      personalScenarioViewSeries: lineComparison("個別シナリオ閲覧率", metrics.personalScenarioView, palette.blue),
      bedroomViewSeries: lineComparison("親密度エピソード閲覧率", metrics.bedroomView, palette.blue),
      snsTrendData: {
        posts: aggregate(snsPosts, grain, "avg"),
        positive: aggregate(snsPositive, grain, "avg"),
        negative: aggregate(snsNegative, grain, "avg"),
      },
    };
  }

  function metricCard(label, value, caption, breakdownItems = [], auxiliary = null) {
    const items = breakdownItems.length ? breakdownItems : [{ label: "全体", value: metricBreakdownValue(value), color: palette.blue }];
    return `
      <article class="metric-card has-breakdown${auxiliary ? " has-auxiliary" : ""}">
        <div class="metric-top">
          <div class="metric-label">${label}${infoTip(caption)}</div>
        </div>
        <div class="metric-value-row">
          <div class="metric-value">${value}</div>
          ${auxiliary ? metricAuxiliary(auxiliary) : ""}
        </div>
        ${metricBreakdown(items)}
      </article>
    `;
  }

  function metricAuxiliary(item) {
    return `
      <div class="metric-auxiliary">
        <span>${item.label}</span>
        <strong class="metric-delta ${item.tone}">${item.value}</strong>
      </div>
    `;
  }

  function metricBreakdown(items) {
    return `
      <div class="metric-breakdown" aria-label="分類別内訳">
        ${items.map((item) => `
          <div class="metric-breakdown-item" style="--metric-color:${item.color}">
            <span class="metric-breakdown-label"><span class="metric-breakdown-dot" aria-hidden="true"></span>${item.label}</span>
            <span class="metric-breakdown-value">${item.value}</span>
            <span class="metric-breakdown-delta ${item.delta?.tone || "is-empty"}">${item.delta?.value || ""}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderSalesMetricCards(data) {
    const revenueValues = data.summary.revenue;
    const payerValues = data.summary.dpuRate;
    const arppuValues = data.summary.arppu;
    const stoneValues = data.summary.stone;
    const breakdowns = salesMetricBreakdowns(data);

    return `
      <section class="metric-grid analysis-kpi-cards" aria-label="課金分析KPIサマリー">
        ${metricCard("期間内売上", yenMan(sum(revenueValues)), "選択期間中の合計売上。分類軸を選ぶと、分類ごとの売上寄与を確認できます。", breakdowns.revenue)}
        ${metricCard("期間内課金率", percent(avg(payerValues)), "選択期間中の平均課金率。rDAUのうち課金まで進んだ割合を見ます。", breakdowns.payer)}
        ${metricCard("期間内ARPPU", yen(avg(arppuValues)), "選択期間中の平均ARPPU。高単価層の支えが弱くなっていないかを見る入口です。", breakdowns.arppu)}
        ${metricCard("期間内石消費数", metricValueWithUnit(count(sum(stoneValues)), "個"), "選択期間中の合計石消費数。分類軸を選ぶと、どの層の消費が弱いかを確認できます。", breakdowns.stone)}
      </section>
    `;
  }

  function renderUserMetricCards(data) {
    const summary = data.userSummary;
    const breakdowns = data.metricBreakdowns || {};

    return `
      <section class="metric-grid analysis-kpi-cards user-kpi-cards" aria-label="ユーザー分析KPIサマリー">
        ${metricCard("期間内rAU数", metricValueWithUnit(count(avg(summary.rau)), "人"), "選択期間中の平均rAU数。ログインだけのユーザーを除いた実プレイユーザー規模を見ます。", breakdowns.rau, metricDelta("期間内増減", summary.rauDelta))}
        ${metricCard("期間内新規ユーザー数", metricValueWithUnit(count(sum(summary.newUsers)), "人"), "選択期間中の初回流入ユーザー数。分類軸を選ぶと、どの分類に獲得が偏っているかを確認できます。", breakdowns.newUsers)}
        ${metricCard("期間内復帰ユーザー数", metricValueWithUnit(count(sum(summary.returningUsers)), "人"), "選択期間中に戻ってきた復帰ユーザー数。呼び戻し施策やイベント復帰の効きを確認できます。", breakdowns.returningUsers)}
        ${metricCard("期間内顧客離脱数", metricValueWithUnit(count(sum(summary.churn)), "人"), "選択期間中の既存顧客離脱数。分類軸を選ぶと、どの分類から離脱が出ているかを確認できます。", breakdowns.churn)}
      </section>
    `;
  }

  function metricDelta(label, value) {
    return {
      label,
      value: signedCount(value),
      tone: value > 0 ? "good" : value < 0 ? "bad" : "watch",
    };
  }

  function segmentBreakdownDelta(value) {
    return {
      value: signedCount(value),
      tone: value > 0 ? "bad" : value < 0 ? "good" : "watch",
    };
  }

  function metricValueWithUnit(value, unit) {
    return `<span class="metric-value-number">${value}</span><span class="metric-value-unit">${unit}</span>`;
  }

  function metricBreakdownValue(value) {
    return String(value).replace(/<span class="metric-value-number">([^<]+)<\/span><span class="metric-value-unit">[^<]+<\/span>/, "$1");
  }

  function salesMetricBreakdowns(data) {
    const segments = salesSegments[state.payer] || [];
    if (!segments.length) return {};

    return {
      revenue: segmentBreakdownFromSeries(data.revenueSeries, segments, yenMan, sum),
      payer: salesPayerBreakdown(data, segments),
      arppu: segmentBreakdownFromSeries(data.arppuSeries, segments, yen, avg),
      stone: segmentBreakdownFromSeries(data.stoneSeries, segments, count, sum),
    };
  }

  function salesPayerBreakdown(data, segments) {
    if (state.payer === "spend") {
      return segments.map((segment) => ({
        label: segment.name,
        value: segment.key === "free" ? "0%" : "100%",
        color: segment.color,
      }));
    }

    return segmentBreakdownFromSeries(data.dpuRateSeries, segments, percent, avg);
  }

  function segmentBreakdownFromSeries(series, segments, formatter, summarize = avg) {
    if (!Array.isArray(series) || !segments.length) return [];

    return segments.map((segment) => {
      const item = series.find((candidate) => candidate.segmentKey === segment.key);
      return {
        label: segment.name,
        value: formatter(summarize(item?.values || [])),
        color: segment.color,
      };
    });
  }

  function panelHeader(title, subtitle) {
    return `
      <div class="panel-header">
        <div>
          <h2 class="panel-title">${title}${infoTip(subtitle)}</h2>
        </div>
      </div>
    `;
  }

  function kpiPanel(title, className, tooltip, chartId, legendItems, actions = "", legendFilterKey = "") {
    const titleActions = className.includes("title-actions") ? actions : "";
    const headerActions = className.includes("title-actions") ? "" : actions;
    return `
      <article class="panel kpi-panel ${className}">
        <div class="panel-header">
          <div class="panel-title-row">
            <h2 class="panel-title">${title}${infoTip(tooltip)}</h2>
            ${titleActions}
          </div>
          ${headerActions}
        </div>
        ${className.includes("with-legend") && legendItems?.length ? legend(legendItems, legendFilterKey) : ""}
        <div id="${chartId}" class="chart${className.includes("coarse") ? "" : " compact"}"></div>
      </article>
    `;
  }

  function snsTrendPanel(data) {
    return `
      <article class="panel kpi-panel user-sns-trend">
        <div class="panel-header">
          <div class="panel-title-row">
            <h2 class="panel-title">SNS投稿数と反応${infoTip("SNS投稿数、ポジ率、ネガ率を見る。右側はAIによってSNS内容を要約させた結果。")}</h2>
          </div>
          <span class="ai-summary-badge">AI要約</span>
        </div>
        <div class="sns-panel-body">
          <div class="sns-chart-column">
            ${legend(data.snsTrendLegend)}
            <div id="userSnsTrendChart" class="chart sns-panel-chart"></div>
          </div>
          <div class="sns-ai-summary" aria-label="SNS投稿AI要約">
            ${data.snsSummaryItems.map((item) => `
              <section class="sns-ai-summary-item ${item.tone}">
                <div class="sns-ai-summary-label">${item.label}</div>
                <p>${item.body}</p>
              </section>
            `).join("")}
          </div>
        </div>
      </article>
    `;
  }

  function statusList(items) {
    return `<div class="status-list">${items.map((item) => `
      <div class="status-item">
        <div class="status-head">
          <div class="status-title">${item.title}${infoTip(item.body)}</div>
          <span class="status-pill ${item.level}">${item.badge}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${item.score}%;background:${item.color}"></div></div>
      </div>
    `).join("")}</div>`;
  }

  function tablePanel(title, rows, headers) {
    return `
      <article class="table-panel">
        ${panelHeader(title, "細かなKPI採用前でも、完成イメージとして確認できる粒度で並べています。")}
        <div class="table-wrap">
          <table>
            <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
            <tbody>
              ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      </article>
    `;
  }

  function salesStatusItems(item) {
    const all = [
      { type: "gacha", title: "ガチャ到達後の購入率低下", badge: "優先", level: "bad", body: "CTRは残っているが購入率が落ちているため、訴求より価格・報酬設計の確認が先。", score: 86, color: palette.red },
      { type: "product", title: "低価格商品の再購入が弱い", badge: "確認", level: "watch", body: "軽中課金層の入口商品が伸びず、DPU/rDAUの押し下げ要因になっている。", score: 68, color: palette.amber },
      { type: "gacha", title: "重課金層の石消費が鈍化", badge: "確認", level: "watch", body: "月末に向けた石消費の加速が弱く、ARPPUの回復が遅れている。", score: 64, color: palette.violet },
    ];
    return all.filter((row) => item === "all" || row.type === item);
  }

  function userStatusItems(segment) {
    const all = [
      { type: "new", title: "新規のD7継続が落ちている", badge: "優先", level: "bad", body: "チュートリアル後の目的提示が弱く、イベント前に離脱している可能性が高い。", score: 88, color: palette.red },
      { type: "risk", title: "既存ユーザーの離脱が増加", badge: "優先", level: "bad", body: "イベント中盤以降にプレイ熱量が下がり、rDAUが段階的に減っている。", score: 76, color: palette.violet },
    ];
    return all.filter((row) => segment === "all" || row.type === segment || row.type === "all");
  }

  function salesRows(item) {
    const rows = [
      ["ガチャ", "限定フェス後半", percent(0.043), `<span class="impact-bad">-1.4pt</span>`, `<span class="impact-bad">売上 -820万円</span>`, "天井到達率と石消費を確認"],
      ["商品", "初回限定パック", percent(0.018), `<span class="impact-bad">-0.9pt</span>`, `<span class="impact-watch">DPU低下</span>`, "表示位置と再購入導線を確認"],
      ["ガチャ", "復刻セレクション", percent(0.037), `<span class="impact-bad">-1.1pt</span>`, `<span class="impact-bad">石消費鈍化</span>`, "既所持率別に反応を見る"],
      ["商品", "月額パス", percent(0.012), `<span class="impact-watch">-0.4pt</span>`, `<span class="impact-watch">継続収益弱い</span>`, "既存購入者の更新率を確認"],
    ];
    if (item === "gacha") return rows.filter((row) => row[0] === "ガチャ");
    if (item === "product") return rows.filter((row) => row[0] === "商品");
    return rows;
  }

  function userRows(segment) {
    const rows = [
      ["新規", "チュートリアル突破後", percent(0.261), `<span class="impact-bad">D7 -3.8pt</span>`, `<span class="impact-bad">定着低下</span>`, "初回翌日のクエスト到達を確認"],
      ["既存", "イベント中盤", count(3420), `<span class="impact-bad">離脱 +22%</span>`, `<span class="impact-bad">rDAU低下</span>`, "報酬獲得までの到達率を見る"],
      ["復帰", "復帰キャンペーン", count(860), `<span class="impact-watch">復帰率 -18%</span>`, `<span class="impact-watch">流入不足</span>`, "通知開封と復帰後D1を確認"],
      ["離脱リスク", "ログイン止まり", count(13800), `<span class="impact-bad">実プレイ未到達 +2,100</span>`, `<span class="impact-bad">熱量低下</span>`, "ログインユーザーとイベントシナリオ閲覧率を見る"],
    ];
    const labelMap = { new: "新規", returning: "復帰", risk: "離脱リスク" };
    if (!labelMap[segment]) return rows;
    return rows.filter((row) => row[0] === labelMap[segment]);
  }

  function legend(items, filterKey = "") {
    const effectiveFilterKey = filterKey === "userPrimaryActiveVisible" && state.userRauOnly === "on" && items.length === 1 ? "" : filterKey;
    return `<div class="legend" ${effectiveFilterKey ? `data-filter-group="${effectiveFilterKey}"` : ""}>${items.map(([label, color, dashArray, swatchType]) => {
      const checked = isSeriesVisible(effectiveFilterKey, label);
      const swatch = swatchType === "area" || swatchType === "bar"
        ? `<span class="legend-${swatchType}-swatch" aria-hidden="true"></span>`
        : `<svg class="legend-line-swatch" viewBox="0 0 26 8" aria-hidden="true">
          <line x1="2" y1="4" x2="24" y2="4" stroke="currentColor" stroke-width="3" stroke-linecap="round"${dashArray ? ` stroke-dasharray="${dashArray}"` : ""}></line>
        </svg>`;
      const body = `${swatch}${label}`;
      return effectiveFilterKey
        ? `<label class="legend-chip legend-chip-filter${checked ? "" : " is-muted"}" style="color:${color}">
          <input class="legend-checkbox" type="checkbox" data-legend-filter data-filter-key="${effectiveFilterKey}" data-series-key="${escapeHtml(label)}"${checked ? " checked" : ""}>
          ${body}
        </label>`
        : `<span class="legend-chip" style="color:${color}">${body}</span>`;
    }).join("")}</div>`;
  }

  function infoTip(text) {
    const value = escapeHtml(text);
    return `<button class="info-tip" type="button" aria-label="${value}" data-tooltip="${value}">?</button>`;
  }

  function getInfoTipTarget(target) {
    return target?.closest ? target.closest(".info-tip") : null;
  }

  function getInfoTooltipElement() {
    let tooltip = document.getElementById("analysisInfoTooltip");
    if (tooltip) return tooltip;
    if (!document.createElement || !document.body) return null;

    tooltip = document.createElement("div");
    tooltip.id = "analysisInfoTooltip";
    tooltip.className = "info-tooltip";
    tooltip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function showInfoTooltip(target) {
    const tooltip = getInfoTooltipElement();
    const text = target.getAttribute("data-tooltip") || "";
    if (!tooltip || !text) return;
    tooltip.textContent = text;
    tooltip.classList.add("is-visible");
    tooltip.setAttribute("aria-hidden", "false");

    const edge = 10;
    const gap = 9;
    const viewportWidth = window.innerWidth || 1280;
    const viewportHeight = window.innerHeight || 720;
    const targetRect = target.getBoundingClientRect();
    const rect = tooltip.getBoundingClientRect();
    const tooltipWidth = Math.min(rect.width, viewportWidth - edge * 2);
    const tooltipHeight = Math.min(rect.height, viewportHeight - edge * 2);
    const targetCenter = targetRect.left + targetRect.width / 2;
    const left = clamp(targetCenter - tooltipWidth / 2, edge, Math.max(edge, viewportWidth - tooltipWidth - edge));
    const preferredTop = targetRect.bottom + gap;
    const top = preferredTop + tooltipHeight + edge > viewportHeight
      ? Math.max(edge, targetRect.top - tooltipHeight - gap)
      : preferredTop;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.setProperty("--info-arrow-left", `${clamp(targetCenter - left, 12, tooltipWidth - 12)}px`);
  }

  function hideInfoTooltip() {
    const tooltip = document.getElementById("analysisInfoTooltip");
    if (!tooltip) return;
    tooltip.classList.remove("is-visible");
    tooltip.setAttribute("aria-hidden", "true");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function svgTitle(text) {
    return `<title>${escapeHtml(text)}</title>`;
  }

  function encodeTooltip(text) {
    const value = Array.isArray(text) ? text.filter(Boolean).join("\n") : String(text || "");
    return encodeURIComponent(value);
  }

  function buildTooltipTarget({ x, y, width, height, tooltip }) {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return "";
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="transparent" pointer-events="all" class="tooltip-hotspot" data-tooltip="${encodeTooltip(tooltip)}"></rect>`;
  }

  function tooltipValue(value, formatter) {
    return Number.isFinite(value) ? formatChartValue(value, formatter) : "未確定";
  }

  function getChartTooltipElement() {
    return document.getElementById("analysisChartTooltip");
  }

  function renderTooltip(encoded) {
    const tooltip = getChartTooltipElement();
    if (!tooltip || tooltip.dataset.tooltip === encoded) return;
    const decoded = decodeURIComponent(encoded || "");
    tooltip.dataset.tooltip = encoded || "";
    tooltip.innerHTML = decoded.split("\n").map((line) => `<div>${escapeHtml(line)}</div>`).join("");
  }

  function positionTooltip(event) {
    const tooltip = getChartTooltipElement();
    if (!tooltip) return;
    const offset = 14;
    const edge = 12;
    const viewportWidth = window.innerWidth || document.documentElement?.clientWidth || 1024;
    const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 768;
    const rect = tooltip.getBoundingClientRect();
    const tooltipWidth = Math.min(rect.width, viewportWidth - edge * 2);
    const tooltipHeight = Math.min(rect.height, viewportHeight - edge * 2);
    let left = event.clientX + offset;
    let top = event.clientY + offset;
    if (left + tooltipWidth + edge > viewportWidth) left = event.clientX - tooltipWidth - offset;
    if (top + tooltipHeight + edge > viewportHeight) top = event.clientY - tooltipHeight - offset;
    tooltip.style.left = `${clamp(left, edge, Math.max(edge, viewportWidth - tooltipWidth - edge))}px`;
    tooltip.style.top = `${clamp(top, edge, Math.max(edge, viewportHeight - tooltipHeight - edge))}px`;
  }

  function hideChartTooltip() {
    const tooltip = getChartTooltipElement();
    if (!tooltip) return;
    tooltip.classList.remove("is-visible");
    tooltip.setAttribute("aria-hidden", "true");
    tooltip.dataset.tooltip = "";
  }

  function activateChartTooltip(event) {
    const hotspot = event.target.closest(".tooltip-hotspot");
    const tooltip = getChartTooltipElement();
    if (!hotspot || !tooltip) {
      hideChartTooltip();
      return;
    }
    renderTooltip(hotspot.getAttribute("data-tooltip") || "");
    tooltip.classList.add("is-visible");
    tooltip.setAttribute("aria-hidden", "false");
    positionTooltip(event);
  }

  document.addEventListener("pointerover", activateChartTooltip);
  document.addEventListener("pointermove", activateChartTooltip);
  document.addEventListener("pointerleave", hideChartTooltip);
  window.addEventListener("blur", hideChartTooltip);
  document.addEventListener("scroll", hideChartTooltip, true);

  function formatChartValue(value, formatter) {
    return formatter ? formatter(value) : count(value);
  }

  function chartTooltip(label, name, value, formatter) {
    return `${label} ${name ? `${name}: ` : ""}${formatChartValue(value, formatter)}`;
  }

  function drawBarLineChart(id, labels, bars, line, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, 220);
    const hasLine = Array.isArray(line) && line.length > 0;
    const hasRightAxis = hasLine && options.lineAxis === "right";
    const pad = { top: 12, right: hasRightAxis ? 50 : 14, bottom: 28, left: 50 };
    const barFormatter = options.valueFormatter || count;
    const lineFormatter = options.lineFormatter || barFormatter;
    const barScale = createNiceScale(0, Math.max(...bars, 1) * 1.08);
    const lineScale = hasRightAxis
      ? createNiceScale(0, Math.max(...line, 1) * 1.08)
      : createNiceScale(0, Math.max(...bars.concat(hasLine ? line : []), 1) * 1.08);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const x = (index) => pad.left + ((index + 0.5) * innerW) / labels.length;
    const yBar = (value) => pad.top + ((barScale.max - value) / (barScale.max - barScale.min || 1)) * innerH;
    const yLine = (value) => pad.top + ((lineScale.max - value) / (lineScale.max - lineScale.min || 1)) * innerH;
    const barWidth = Math.max(8, (innerW / labels.length) * 0.52);
    const linePath = hasLine ? line.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${yLine(value)}`).join(" ") : "";
    const lineColor = options.lineColor || palette.blue;
    const pointRadius = 2.4;
    const rightAxis = hasRightAxis ? lineScale.ticks.map((value) => {
      const y = pad.top + ((lineScale.max - value) / (lineScale.max - lineScale.min || 1)) * innerH;
      return `
        <line class="chart-grid-line" x1="${width - pad.right}" x2="${width - pad.right + 5}" y1="${y}" y2="${y}" opacity="0.45"></line>
        <text class="axis-text" x="${width - pad.right + 8}" y="${y + 4}" text-anchor="start">${lineFormatter(value)}</text>
      `;
    }).join("") : "";
    const hoverBands = labels.map((label, index) => {
      const step = innerW / Math.max(labels.length, 1);
      const rows = [
        label,
        `${options.barName || "値"} ${tooltipValue(bars[index], barFormatter)}`,
      ];
      if (hasLine) rows.push(`${options.lineName || "線"} ${tooltipValue(line[index], lineFormatter)}`);
      return buildTooltipTarget({
        x: pad.left + index * step,
        y: pad.top,
        width: step,
        height: innerH,
        tooltip: rows,
      });
    }).join("");
    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="棒線グラフ">
        ${gridLines(width, height, pad, barScale, barFormatter)}
        ${rightAxis}
        ${bars.map((value, index) => `<rect x="${x(index) - barWidth / 2}" y="${yBar(value)}" width="${barWidth}" height="${pad.top + innerH - yBar(value)}" fill="${options.barColor}" opacity="0.82">${svgTitle(chartTooltip(labels[index], options.barName || "", value, barFormatter))}</rect>`).join("")}
        ${hasLine ? `<path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="3" stroke-linecap="round"></path>${line.map((value, index) => `<circle cx="${x(index)}" cy="${yLine(value)}" r="${pointRadius}" fill="${lineColor}">${svgTitle(chartTooltip(labels[index], options.lineName || "", value, lineFormatter))}</circle>`).join("")}` : ""}
        ${hoverBands}
        ${labels.map((label, index) => shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index)}" y="${height - 10}" text-anchor="middle">${label}</text>` : "").join("")}
      </svg>
    `;
  }

  function drawDivergingBarChart(id, labels, increased, decreased, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 14, bottom: 28, left: 50 };
    const formatter = options.valueFormatter || count;
    const maxAbs = Math.max(...increased, ...decreased, 1);
    const scale = createSymmetricScale(maxAbs * 1.08);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const x = (index) => pad.left + ((index + 0.5) * innerW) / labels.length;
    const y = (value) => pad.top + ((scale.max - value) / (scale.max - scale.min || 1)) * innerH;
    const zeroY = y(0);
    const barWidth = Math.max(7, (innerW / labels.length) * 0.38);
    const increaseColor = options.increaseColor || palette.blue;
    const decreaseColor = options.decreaseColor || summarySnsColors.negative;
    const hoverBands = labels.map((label, index) => {
      const step = innerW / Math.max(labels.length, 1);
      const up = increased[index] || 0;
      const down = decreased[index] || 0;
      return buildTooltipTarget({
        x: pad.left + index * step,
        y: pad.top,
        width: step,
        height: innerH,
        tooltip: [
          label,
          `増えた人数: ${tooltipValue(up, formatter)}`,
          `減った人数: ${tooltipValue(down, formatter)}`,
          `差し引き: ${tooltipValue(up - down, formatter)}`,
        ],
      });
    }).join("");
    const axisLines = scale.ticks.map((tick) => {
      const ty = y(tick);
      return `
        <line class="${tick === 0 ? "chart-zero-line" : "chart-grid-line"}" x1="${pad.left}" x2="${width - pad.right}" y1="${ty}" y2="${ty}"></line>
        <text class="axis-text" x="${pad.left - 9}" y="${ty + 4}" text-anchor="end">${formatter(tick)}</text>
      `;
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="発散棒グラフ">
        ${axisLines}
        ${labels.map((label, index) => {
          const up = increased[index] || 0;
          const down = decreased[index] || 0;
          const upY = y(up);
          const downY = y(-down);
          const overlap = up > 0 && down > 0 ? 0.75 : 0;
          const upHeight = Math.max(0, zeroY - upY + overlap);
          const downStartY = zeroY - overlap;
          const downHeight = Math.max(0, downY - zeroY + overlap);
          return `
            <rect x="${x(index) - barWidth / 2}" y="${upY}" width="${barWidth}" height="${upHeight}" fill="${increaseColor}">${svgTitle(`${label} 増えた人数: ${formatChartValue(up, formatter)}`)}</rect>
            <rect x="${x(index) - barWidth / 2}" y="${downStartY}" width="${barWidth}" height="${downHeight}" fill="${decreaseColor}">${svgTitle(`${label} 減った人数: ${formatChartValue(down, formatter)}`)}</rect>
          `;
        }).join("")}
        ${hoverBands}
        ${labels.map((label, index) => shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index)}" y="${height - 10}" text-anchor="middle">${label}</text>` : "").join("")}
      </svg>
    `;
  }

  function drawSegmentMovementNetChart(id, labels, series, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 14, bottom: 28, left: 50 };
    const formatter = options.valueFormatter || count;
    const net = series.net || [];
    const increased = series.increased || [];
    const decreased = series.decreased || [];
    const maxAbs = Math.max(...net.map((value) => Math.abs(value || 0)), ...increased, ...decreased, 1);
    const scale = createSymmetricScale(maxAbs * 1.08);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const x = (index) => pad.left + ((index + 0.5) * innerW) / labels.length;
    const y = (value) => pad.top + ((scale.max - value) / (scale.max - scale.min || 1)) * innerH;
    const zeroY = y(0);
    const barWidth = Math.max(7, (innerW / labels.length) * 0.38);
    const lineColor = options.lineColor || palette.blue;
    const increaseColor = options.increaseColor || summarySnsColors.positive;
    const decreaseColor = options.decreaseColor || summarySnsColors.negative;
    const linePath = net.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value || 0)}`).join(" ");
    const hoverBands = labels.map((label, index) => {
      const step = innerW / Math.max(labels.length, 1);
      const up = increased[index] || 0;
      const down = decreased[index] || 0;
      const netValue = net[index] || 0;
      return buildTooltipTarget({
        x: pad.left + index * step,
        y: pad.top,
        width: step,
        height: innerH,
        tooltip: [
          label,
          `期間内純増減: ${tooltipValue(netValue, formatter)}`,
          `増えた人数: ${tooltipValue(up, formatter)}`,
          `減った人数: ${tooltipValue(down, formatter)}`,
        ],
      });
    }).join("");
    const axisLines = scale.ticks.map((tick) => {
      const ty = y(tick);
      return `
        <line class="${tick === 0 ? "chart-zero-line" : "chart-grid-line"}" x1="${pad.left}" x2="${width - pad.right}" y1="${ty}" y2="${ty}"></line>
        <text class="axis-text" x="${pad.left - 9}" y="${ty + 4}" text-anchor="end">${formatter(tick)}</text>
      `;
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="セグメント増減グラフ">
        ${axisLines}
        ${labels.map((label, index) => {
          const up = increased[index] || 0;
          const down = decreased[index] || 0;
          const upY = y(up);
          const downY = y(-down);
          const overlap = up > 0 && down > 0 ? 0.75 : 0;
          return `
            <rect x="${x(index) - barWidth / 2}" y="${upY}" width="${barWidth}" height="${Math.max(0, zeroY - upY + overlap)}" fill="${increaseColor}" opacity="0.36">${svgTitle(`${label} 増えた人数: ${formatChartValue(up, formatter)}`)}</rect>
            <rect x="${x(index) - barWidth / 2}" y="${zeroY - overlap}" width="${barWidth}" height="${Math.max(0, downY - zeroY + overlap)}" fill="${decreaseColor}" opacity="0.34">${svgTitle(`${label} 減った人数: ${formatChartValue(down, formatter)}`)}</rect>
          `;
        }).join("")}
        <path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>
        ${net.map((value, index) => `<circle cx="${x(index)}" cy="${y(value || 0)}" r="2.4" fill="${lineColor}">${svgTitle(`${labels[index]} 期間内純増減: ${formatChartValue(value || 0, formatter)}`)}</circle>`).join("")}
        ${hoverBands}
        ${labels.map((label, index) => shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index)}" y="${height - 10}" text-anchor="middle">${label}</text>` : "").join("")}
      </svg>
    `;
  }

  function drawLineChart(id, labels, series, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 14, bottom: 28, left: 50 };
    const allValues = series.flatMap((item) => item.values);
    const rawMin = options.min ?? Math.min(...allValues);
    const rawMax = options.max ?? Math.max(...allValues);
    const padding = rawMax === rawMin ? 1 : (rawMax - rawMin) * 0.08;
    const scale = options.symmetricZero
      ? createSymmetricScale(Math.max(Math.abs(rawMin), Math.abs(rawMax), 1) * 1.08)
      : createNiceScale(options.min ?? Math.max(0, rawMin - padding), options.max ?? rawMax + padding);
    const min = scale.min;
    const max = scale.max;
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const x = (index) => pad.left + (labels.length === 1 ? innerW / 2 : (index * innerW) / (labels.length - 1));
    const y = (value) => pad.top + ((max - value) / (max - min || 1)) * innerH;
    const formatter = options.valueFormatter || count;
    const pointRadius = 2.4;
    const hoverBands = labels.map((label, index) => {
      const left = labels.length === 1 ? pad.left : (index === 0 ? pad.left : (x(index - 1) + x(index)) / 2);
      const right = labels.length === 1 ? width - pad.right : (index === labels.length - 1 ? width - pad.right : (x(index) + x(index + 1)) / 2);
      return buildTooltipTarget({
        x: left,
        y: pad.top,
        width: Math.max(1, right - left),
        height: innerH,
        tooltip: [
          label,
          ...series.map((item) => `${item.name}: ${tooltipValue(item.values[index], formatter)}`),
        ],
      });
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="折れ線グラフ">
        ${gridLines(width, height, pad, scale, options.valueFormatter)}
        ${series.map((item) => {
          const path = item.values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ");
          const dashValue = item.dashArray || (item.dashed ? "8 7" : "");
          const dash = dashValue ? ` stroke-dasharray="${dashValue}"` : "";
          const points = item.values.map((value, index) => `<circle cx="${x(index)}" cy="${y(value)}" r="${pointRadius}" fill="${item.color}">${svgTitle(chartTooltip(labels[index], item.name, value, formatter))}</circle>`).join("");
          return `<path d="${path}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round"${dash}></path>${points}`;
        }).join("")}
        ${hoverBands}
        ${labels.map((label, index) => shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index)}" y="${height - 10}" text-anchor="middle">${label}</text>` : "").join("")}
      </svg>
    `;
  }

  function drawSnsReactionChart(id, labels, data) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 48, bottom: 28, left: 58 };
    const posts = data.posts || [];
    const positive = data.positive || [];
    const negative = data.negative || [];
    const postScale = createNiceScale(0, Math.max(...posts, 1) * 1.08);
    const percentScale = { min: 0, max: 100, ticks: [100, 75, 50, 25, 0] };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const x = (index) => pad.left + (labels.length === 1 ? innerW / 2 : (index * innerW) / (labels.length - 1));
    const yPost = (value) => pad.top + ((postScale.max - value) / (postScale.max - postScale.min || 1)) * innerH;
    const yPercent = (value) => pad.top + ((percentScale.max - value) / (percentScale.max - percentScale.min || 1)) * innerH;
    const path = (values, yScale) => values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${yScale(value)}`).join(" ");
    const pointRadius = 2.4;
    const dots = (values, yScale, color, name, formatter) => values
      .map((value, index) => `<circle cx="${x(index)}" cy="${yScale(value)}" r="${pointRadius}" fill="${color}">${svgTitle(chartTooltip(labels[index], name, value, formatter))}</circle>`)
      .join("");
    const hoverBands = labels.map((label, index) => {
      const left = labels.length === 1 ? pad.left : (index === 0 ? pad.left : (x(index - 1) + x(index)) / 2);
      const right = labels.length === 1 ? width - pad.right : (index === labels.length - 1 ? width - pad.right : (x(index) + x(index + 1)) / 2);
      return buildTooltipTarget({
        x: left,
        y: pad.top,
        width: Math.max(1, right - left),
        height: innerH,
        tooltip: [
          label,
          `SNS投稿数: ${tooltipValue(posts[index], count)}`,
          `ポジ率: ${tooltipValue(positive[index], (value) => `${value.toFixed(1)}%`)}`,
          `ネガ率: ${tooltipValue(negative[index], (value) => `${value.toFixed(1)}%`)}`,
        ],
      });
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="SNS投稿数とポジネガ割合">
        ${gridLines(width, height, pad, postScale, count)}
        ${percentScale.ticks.map((tick) => {
          const y = yPercent(tick);
          return `<text class="axis-text" x="${width - pad.right + 8}" y="${y + 4}">${tick}%</text>`;
        }).join("")}
        <path d="${path(posts, yPost)}" fill="none" stroke="${summarySnsColors.posts}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="${path(positive, yPercent)}" fill="none" stroke="${summarySnsColors.positive}" stroke-width="2.6" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="${path(negative, yPercent)}" fill="none" stroke="${summarySnsColors.negative}" stroke-width="2.6" stroke-dasharray="7 6" stroke-linecap="round" stroke-linejoin="round"></path>
        ${dots(posts, yPost, summarySnsColors.posts, "SNS投稿数", count)}
        ${dots(positive, yPercent, summarySnsColors.positive, "ポジ率", (value) => `${value.toFixed(1)}%`)}
        ${dots(negative, yPercent, summarySnsColors.negative, "ネガ率", (value) => `${value.toFixed(1)}%`)}
        ${hoverBands}
        ${labels.map((label, index) => shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index)}" y="${height - 10}" text-anchor="middle">${label}</text>` : "").join("")}
      </svg>
    `;
  }

  function drawStackedAreaChart(id, labels, series, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 14, bottom: 28, left: 50 };
    const totals = labels.map((_, index) => sum(series.map((item) => item.values[index] || 0)));
    const scale = createNiceScale(0, options.max ?? Math.max(...totals, 1) * 1.08);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const x = (index) => pad.left + (labels.length === 1 ? innerW / 2 : (index * innerW) / (labels.length - 1));
    const y = (value) => pad.top + ((scale.max - value) / (scale.max - scale.min || 1)) * innerH;
    const running = labels.map(() => 0);
    const formatter = options.valueFormatter || count;
    const isSinglePoint = labels.length === 1;

    const areas = series.map((item) => {
      const lower = running.slice();
      const upper = lower.map((value, index) => value + (item.values[index] || 0));
      upper.forEach((value, index) => {
        running[index] = value;
      });
      const areaPath = isSinglePoint
        ? `M ${pad.left} ${y(upper[0] || 0)} L ${width - pad.right} ${y(upper[0] || 0)} L ${width - pad.right} ${y(lower[0] || 0)} L ${pad.left} ${y(lower[0] || 0)} Z`
        : `M ${upper.map((value, index) => `${x(index)} ${y(value)}`).join(" L ")} L ${lower
          .map((value, index) => ({ value, index }))
          .reverse()
          .map(({ value, index }) => `${x(index)} ${y(value)}`)
          .join(" L ")} Z`;
      const linePath = isSinglePoint
        ? `M ${pad.left} ${y(upper[0] || 0)} L ${width - pad.right} ${y(upper[0] || 0)}`
        : upper.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ");

      return `
        <path d="${areaPath}" fill="${item.color}" opacity="0.58"></path>
        <path d="${linePath}" fill="none" stroke="${item.color}" stroke-width="3" stroke-linecap="round"></path>
      `;
    }).join("");
    const hoverBands = labels.map((label, index) => {
      const left = labels.length === 1 ? pad.left : (index === 0 ? pad.left : (x(index - 1) + x(index)) / 2);
      const right = labels.length === 1 ? width - pad.right : (index === labels.length - 1 ? width - pad.right : (x(index) + x(index + 1)) / 2);
      const total = totals[index] || 0;
      const details = [...series].reverse().map((item) => {
        const value = item.values[index] || 0;
        const displayValue = item.tooltipValues?.[index] ?? value;
        const ratio = total ? value / total : 0;
        const itemName = options.tooltipLabels?.[item.name] || item.name;
        return `${itemName}: ${formatChartValue(displayValue, formatter)}${options.hideRatioInTooltip ? "" : ` (${percent(ratio)})`}`;
      }).join("\n");
      const totalLine = options.showTotalInTooltip
        ? `\n${options.totalTooltipLabel || "合計"}: ${formatChartValue(options.tooltipTotals?.[index] ?? total, options.totalValueFormatter || formatter)}`
        : "";
      return buildTooltipTarget({
        x: left,
        y: pad.top,
        width: Math.max(1, right - left),
        height: innerH,
        tooltip: `${label}${totalLine}\n${details}`,
      });
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="積み上げ面グラフ">
        ${gridLines(width, height, pad, scale, options.valueFormatter || count)}
        ${areas}
        ${hoverBands}
        ${labels.map((label, index) => shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index)}" y="${height - 10}" text-anchor="middle">${label}</text>` : "").join("")}
      </svg>
    `;
  }

  function drawHorizontalBarChart(id, items, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 72, bottom: 12, left: 138 };
    const maxValue = Math.max(...items.map((item) => item.value), 1);
    const scale = createNiceScale(0, maxValue * 1.08);
    const innerW = width - pad.left - pad.right;
    const rowH = (height - pad.top - pad.bottom) / items.length;
    const x = (value) => pad.left + (value / scale.max) * innerW;
    const formatter = options.valueFormatter || count;
    const hoverBands = items.map((item, index) => {
      const y = pad.top + index * rowH;
      return buildTooltipTarget({
        x: pad.left,
        y,
        width: innerW,
        height: rowH,
        tooltip: [item.label, `値: ${tooltipValue(item.value, formatter)}`],
      });
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="横棒グラフ">
        ${scale.ticks.map((tick) => {
          const tx = x(tick);
          return `<line class="chart-grid-line" x1="${tx}" x2="${tx}" y1="${pad.top}" y2="${height - pad.bottom}"></line>`;
        }).join("")}
        ${items.map((item, index) => {
          const y = pad.top + index * rowH + rowH * 0.22;
          const barW = Math.max(0, x(item.value) - pad.left);
          return `
            <text class="axis-text" x="${pad.left - 10}" y="${y + rowH * 0.28}" text-anchor="end">${item.label}</text>
            <rect x="${pad.left}" y="${y}" width="${barW}" height="${rowH * 0.44}" fill="${options.color || palette.blue}" opacity="0.86">${svgTitle(chartTooltip(item.label, "", item.value, formatter))}</rect>
            <text class="axis-text" x="${Math.min(width - pad.right + 8, pad.left + barW + 10)}" y="${y + rowH * 0.28}">${options.valueFormatter ? options.valueFormatter(item.value) : count(item.value)}</text>
          `;
        }).join("")}
        ${hoverBands}
      </svg>
    `;
  }

  function drawStackedHorizontalBarChart(id, items, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 72, bottom: 12, left: 138 };
    const maxValue = Math.max(...items.map((item) => sum(item.segments.map((segment) => segment.value))), 1);
    const scale = createNiceScale(0, maxValue * 1.08);
    const innerW = width - pad.left - pad.right;
    const rowH = (height - pad.top - pad.bottom) / items.length;
    const x = (value) => pad.left + (value / scale.max) * innerW;
    const formatter = options.valueFormatter || count;
    const hoverBands = items.map((item, index) => {
      const total = sum(item.segments.map((segment) => segment.value));
      return buildTooltipTarget({
        x: pad.left,
        y: pad.top + index * rowH,
        width: innerW,
        height: rowH,
        tooltip: [
          item.label,
          ...item.segments.map((segment) => `${segment.name}: ${tooltipValue(segment.value, formatter)} (${percent(total ? segment.value / total : 0)})`),
        ],
      });
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="横積み上げ棒グラフ">
        ${scale.ticks.map((tick) => {
          const tx = x(tick);
          return `<line class="chart-grid-line" x1="${tx}" x2="${tx}" y1="${pad.top}" y2="${height - pad.bottom}"></line>`;
        }).join("")}
        ${items.map((item, index) => {
          const y = pad.top + index * rowH + rowH * 0.22;
          let running = 0;
          const total = sum(item.segments.map((segment) => segment.value));
          const segments = item.segments.map((segment) => {
            const startX = x(running);
            running += segment.value;
            const barW = Math.max(0, x(running) - startX);
            return `<rect x="${startX}" y="${y}" width="${barW}" height="${rowH * 0.44}" fill="${segment.color}" opacity="0.86">${svgTitle(`${item.label} ${segment.name}: ${formatChartValue(segment.value, formatter)} (${percent(total ? segment.value / total : 0)})`)}</rect>`;
          }).join("");
          return `
            <text class="axis-text" x="${pad.left - 10}" y="${y + rowH * 0.28}" text-anchor="end">${item.label}</text>
            ${segments}
            <text class="axis-text" x="${Math.min(width - pad.right + 8, x(running) + 10)}" y="${y + rowH * 0.28}">${options.valueFormatter ? options.valueFormatter(running) : count(running)}</text>
          `;
        }).join("")}
        ${hoverBands}
      </svg>
    `;
  }

  function drawStackedBarChart(id, labels, series, options = {}) {
    const element = document.getElementById(id);
    if (!element) return;
    const { width, height } = chartBox(element, element.classList.contains("compact") ? 166 : 220);
    const pad = { top: 12, right: 14, bottom: 28, left: 50 };
    const totals = labels.map((_, index) => sum(series.map((item) => item.values[index] || 0)));
    const scale = createNiceScale(0, options.max ?? Math.max(...totals, 1) * 1.08);
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const barW = Math.max(9, (innerW / labels.length) * 0.58);
    const x = (index) => pad.left + ((index + 0.5) * innerW) / labels.length - barW / 2;
    const y = (value) => pad.top + ((scale.max - value) / (scale.max - scale.min || 1)) * innerH;
    const formatter = options.valueFormatter || count;
    const hoverBands = labels.map((label, index) => {
      const step = innerW / Math.max(labels.length, 1);
      const total = totals[index] || 0;
      return buildTooltipTarget({
        x: pad.left + index * step,
        y: pad.top,
        width: step,
        height: innerH,
        tooltip: [
          label,
          ...series.map((item) => {
            const value = item.values[index] || 0;
            const ratio = options.hideRatioInTooltip ? "" : ` (${percent(total ? value / total : 0)})`;
            return `${item.name}: ${tooltipValue(value, formatter)}${ratio}`;
          }),
        ],
      });
    }).join("");

    element.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="積み上げ棒グラフ">
        ${gridLines(width, height, pad, scale, options.valueFormatter || count)}
        ${labels.map((label, index) => {
          let running = 0;
          const total = totals[index] || 0;
          const bars = series.map((item) => {
            const value = item.values[index] || 0;
            const yTop = y(running + value);
            const heightValue = y(running) - yTop;
            running += value;
            const ratio = options.hideRatioInTooltip ? "" : ` (${percent(total ? value / total : 0)})`;
            return `<rect x="${x(index)}" y="${yTop}" width="${barW}" height="${heightValue}" fill="${item.color}" opacity="0.86">${svgTitle(`${label} ${item.name}: ${formatChartValue(value, formatter)}${ratio}`)}</rect>`;
          }).join("");
          const axis = shouldShowLabel(index, labels.length) ? `<text class="axis-text" x="${x(index) + barW / 2}" y="${height - 10}" text-anchor="middle">${label}</text>` : "";
          return `${bars}${axis}`;
        }).join("")}
        ${hoverBands}
      </svg>
    `;
  }

  function gridLines(width, height, pad, scale, formatter = (value) => value.toLocaleString()) {
    const { min, max, ticks } = scale;
    const innerH = height - pad.top - pad.bottom;
    return ticks.map((value) => {
      const y = pad.top + ((max - value) / (max - min || 1)) * innerH;
      const lineClass = min < 0 && max > 0 && value === 0 ? "chart-zero-line" : "chart-grid-line";
      return `
        <line class="${lineClass}" x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}"></line>
        <text class="axis-text" x="${pad.left - 8}" y="${y + 4}" text-anchor="end">${formatter(value)}</text>
      `;
    }).join("");
  }

  function chartBox(element, fallbackHeight) {
    const rect = element.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width || 860)),
      height: Math.max(fallbackHeight, Math.round(rect.height || fallbackHeight)),
    };
  }

  function createNiceScale(rawMin, rawMax, segments = 4) {
    const fallback = { min: 0, max: 1, ticks: [1, 0.75, 0.5, 0.25, 0] };
    if (!Number.isFinite(rawMin) || !Number.isFinite(rawMax)) return fallback;

    let min = Math.min(rawMin, rawMax);
    let max = Math.max(rawMin, rawMax);
    if (min >= 0) min = 0;
    if (max === min) max = min + 1;

    const step = niceStep((max - min) / segments);
    const niceMin = min <= 0 ? 0 : Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const ticks = [];

    for (let value = niceMax; value >= niceMin - step / 2; value -= step) {
      ticks.push(roundTick(value));
    }

    return { min: niceMin, max: niceMax, ticks };
  }

  function createSymmetricScale(rawMax, segmentsPerSide = 3) {
    const max = Math.max(Math.abs(rawMax), 1);
    const step = niceStep(max / segmentsPerSide);
    const niceMax = Math.ceil(max / step) * step;
    const ticks = [];

    for (let value = niceMax; value >= -niceMax - step / 2; value -= step) {
      ticks.push(roundTick(value));
    }

    return { min: -niceMax, max: niceMax, ticks };
  }

  function niceStep(target) {
    if (!Number.isFinite(target) || target <= 0) return 1;
    const power = Math.pow(10, Math.floor(Math.log10(target)));
    const candidates = [1, 2, 2.5, 5, 10].map((value) => value * power);
    return candidates.reduce((best, value) => (
      Math.abs(value - target) < Math.abs(best - target) ? value : best
    ), candidates[0]);
  }

  function roundTick(value) {
    if (Math.abs(value) < 1e-10) return 0;
    const precision = Math.max(0, 10 - Math.floor(Math.log10(Math.abs(value))));
    return Number(value.toFixed(precision));
  }

  function shouldShowLabel(index, length) {
    if (length <= 10) return true;
    if (index === 0 || index === length - 1) return true;
    return index % Math.ceil(length / 6) === 0;
  }

  function normalizeTierSeries(series) {
    return series.map((values) => values.map((value, index) => {
      const total = sum(series.map((item) => item[index] || 0));
      return total ? value / total : 0;
    }));
  }

  function aggregate(values, grain, mode) {
    return groups[grain].map((group) => {
      const selected = group.indexes.map((index) => values[index]).filter((value) => Number.isFinite(value));
      if (mode === "sum") return sum(selected);
      if (mode === "last") return selected[selected.length - 1] ?? 0;
      return avg(selected);
    });
  }

  function periodDelta(values) {
    if (!values.length) return 0;
    return values[values.length - 1] - values[0];
  }

  function fitSeries(values) {
    const targetLength = Math.max(1, periodDates.length);
    if (values.length === allDataDates.length) {
      return periodDates.map((date) => {
        const index = clamp(dataIndexForDate(date), 0, values.length - 1);
        return values[index];
      });
    }
    if (values.length === targetLength) return values.slice();
    if (targetLength === 1) return [values[values.length - 1]];
    const maxSourceIndex = values.length - 1;
    return Array.from({ length: targetLength }, (_, index) => {
      const sourceIndex = (index * maxSourceIndex) / (targetLength - 1);
      const left = Math.floor(sourceIndex);
      const right = Math.min(maxSourceIndex, Math.ceil(sourceIndex));
      const ratio = sourceIndex - left;
      return values[left] + (values[right] - values[left]) * ratio;
    });
  }

  function dataIndexForDate(date) {
    return Math.round((startOfDay(date) - dataRangeStart) / 86400000);
  }

  function normalize(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) return values.map(() => 50);
    return values.map((value) => ((value - min) / (max - min)) * 100);
  }

  function range(start, end) {
    return Array.from({ length: end - start }, (_, index) => start + index);
  }

  function buildPeriodDates(startDate, endDate) {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);
    const length = Math.max(1, Math.round((end - start) / 86400000) + 1);
    return Array.from({ length }, (_, index) => addDays(start, index));
  }

  function refreshPeriodDate(target, nextDate) {
    const next = clampDateToDataRange(alignDateToGrainTarget(target, startOfDay(nextDate), state.grain));
    if (target === "start") {
      periodStart = next;
      if (periodStart > periodEnd) periodEnd = new Date(periodStart);
    } else {
      periodEnd = next;
      if (periodEnd < periodStart) periodStart = new Date(periodEnd);
    }
    alignPeriodToGrain(state.grain);
    refreshPeriod();
  }

  function alignPeriodToGrain(grain) {
    if (grain === "monthly") {
      periodStart = startOfMonth(periodStart);
      periodEnd = endOfMonth(periodEnd);
      clampPeriodToDataRange();
      return;
    }

    if (grain === "yearly") {
      periodStart = startOfYear(periodStart);
      periodEnd = endOfYear(periodEnd);
      clampPeriodToDataRange();
    }
  }

  function alignDateToGrainTarget(target, date, grain) {
    if (grain === "monthly") {
      return target === "start" ? startOfMonth(date) : endOfMonth(date);
    }

    if (grain === "yearly") {
      return target === "start" ? startOfYear(date) : endOfYear(date);
    }

    return date;
  }

  function refreshPeriod() {
    clampPeriodToDataRange();
    periodDates = buildPeriodDates(periodStart, periodEnd);
    days = periodDates.map(formatShortDate);
    periodLabel = formatPeriodLabel(periodDates);
    groups = buildGroups();
  }

  function clampPeriodToDataRange() {
    periodStart = clampDateToDataRange(periodStart);
    periodEnd = clampDateToDataRange(periodEnd);
    if (periodStart > periodEnd) periodStart = new Date(periodEnd);
  }

  function clampDateToDataRange(date) {
    const value = startOfDay(date).getTime();
    const min = dataRangeStart.getTime();
    const max = dataRangeEnd.getTime();
    return new Date(clamp(value, min, max));
  }

  function buildGroups() {
    return {
      daily: days.map((label, index) => ({ label, indexes: [index] })),
      monthly: buildCalendarGroups(
        (date) => `${date.getFullYear()}/${pad2(date.getMonth() + 1)}`,
        (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(),
      ),
      yearly: buildCalendarGroups(
        (date) => `${date.getFullYear()}年`,
        (a, b) => a.getFullYear() === b.getFullYear(),
      ),
    };
  }

  function buildCalendarGroups(labeler, sameBucket) {
    const result = [];
    let start = 0;
    for (let index = 1; index <= periodDates.length; index += 1) {
      if (index < periodDates.length && sameBucket(periodDates[index], periodDates[start])) continue;
      result.push({ label: labeler(periodDates[start]), indexes: range(start, index) });
      start = index;
    }
    return result;
  }

  function dateRangeLabel(startIndex, endIndex) {
    const start = formatShortDate(periodDates[startIndex]);
    const end = formatShortDate(periodDates[endIndex]);
    return start === end ? start : `${start}-${end}`;
  }

  function formatPeriodLabel(dates) {
    return `${formatFullDate(dates[0])} - ${formatFullDate(dates[dates.length - 1])}`;
  }

  function formatShortDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatFullDate(date) {
    return `${date.getFullYear()}/${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}`;
  }

  function formatIsoDate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function parseIsoDate(value) {
    const [year, month, date] = value.split("-").map(Number);
    return new Date(year, month - 1, date);
  }

  function addMonths(date, months) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
  }

  function addDays(date, daysToAdd) {
    const next = new Date(date);
    next.setDate(next.getDate() + daysToAdd);
    return startOfDay(next);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  function startOfYear(date) {
    return new Date(date.getFullYear(), 0, 1);
  }

  function endOfYear(date) {
    return new Date(date.getFullYear(), 11, 31);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function sameDate(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function isInSelectedPeriod(date) {
    return date >= periodStart && date <= periodEnd;
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function million(value) {
    return value * 1000000;
  }

  function sum(values) {
    return values.reduce((total, value) => total + value, 0);
  }

  function avg(values) {
    return values.length ? sum(values) / values.length : 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function tail(values, size) {
    return values.slice(Math.max(0, values.length - size));
  }

  function safeRatio(numerator, denominator) {
    return denominator ? numerator / denominator : 0;
  }

  function yen(value) {
    return `¥${Math.round(value).toLocaleString("ja-JP")}`;
  }

  function yenMan(value) {
    return `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;
  }

  function count(value) {
    return Math.round(value).toLocaleString("ja-JP");
  }

  function signedCount(value) {
    const rounded = Math.round(value);
    if (rounded > 0) return `+${rounded.toLocaleString("ja-JP")}`;
    return rounded.toLocaleString("ja-JP");
  }

  function percent(value) {
    const rounded = Math.round(value * 1000) / 10;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}%`;
  }

  function percentFixed1(value) {
    return `${(value * 100).toFixed(1)}%`;
  }

})();
