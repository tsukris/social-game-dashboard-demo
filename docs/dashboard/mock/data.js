window.mockUtils = {
  sum(values) {
    return values.reduce((total, value) => total + value, 0);
  },
  cumulative(values) {
    let running = 0;
    return values.map((value) => (running += value));
  },
  formatCurrencyM(value) {
    return `¥${value.toFixed(1)}M`;
  },
  formatPercent(value, digits = 1) {
    return `${value.toFixed(digits)}%`;
  },
  formatSignedCurrencyM(value) {
    return `${value >= 0 ? "+" : "-"}¥${Math.abs(value).toFixed(1)}M`;
  },
  formatYen(value) {
    return `¥${Math.round(value).toLocaleString("ja-JP")}`;
  },
  formatNumber(value) {
    return Math.round(value).toLocaleString("ja-JP");
  }
};

window.mockDashboardData = {
  updatedAt: "2026-03-31 18:00 JST",
  months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  annual: {
    revenueActual: [64.2, 68.5, 76.4, 74.8, 79.1, 82.3, 85.6, 87.2, 83.4, 81.7, 79.8, 88.1],
    revenueForecast: [66.0, 70.2, 81.0, 78.0, 82.4, 85.0, 88.3, 90.1, 86.0, 84.2, 82.0, 91.0],
    revenueActualLastYear: [60.1, 63.4, 70.7, 69.8, 72.0, 74.2, 76.8, 78.4, 75.3, 73.1, 71.5, 79.0],
    stoneMonthly: [13.8, 14.9, 17.4, 16.2, 18.1, 18.8, 19.6, 20.1, 18.9, 18.2, 17.5, 19.7],
    stoneMonthlyLastYear: [12.6, 13.2, 15.8, 14.9, 16.0, 16.9, 17.5, 18.0, 17.1, 16.4, 15.9, 17.6]
  },
  detailMonth: {
    defaultMonth: 3,
    salesActual: [1.7, 2.0, 2.3, 2.2, 2.4, 2.8, 2.6, 2.7, 2.9, 2.8, 2.7, 2.6, 2.8, 2.9, 3.1, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.95, 2.05, 2.2],
    salesForecast: [1.8, 2.1, 2.2, 2.3, 2.5, 2.7, 2.6, 2.7, 2.8, 2.9, 2.8, 2.8, 2.9, 3.0, 3.1, 3.0, 2.9, 2.9, 2.8, 2.8, 2.7, 2.7, 2.6, 2.6, 2.5, 2.5, 2.4, 2.4, 2.3, 2.3, 2.4],
    freeStone: [0.19, 0.26, 0.31, 0.23, 0.28, 0.35, 0.28, 0.31, 0.39, 0.34, 0.27, 0.26, 0.31, 0.34, 0.40, 0.33, 0.29, 0.25, 0.31, 0.28, 0.24, 0.21, 0.37, 0.27, 0.23, 0.21, 0.18, 0.17, 0.19, 0.22, 0.25],
    paidStone: [0.14, 0.21, 0.27, 0.23, 0.29, 0.38, 0.32, 0.35, 0.39, 0.40, 0.35, 0.33, 0.40, 0.43, 0.48, 0.39, 0.36, 0.35, 0.38, 0.35, 0.31, 0.29, 0.47, 0.34, 0.30, 0.28, 0.26, 0.24, 0.24, 0.30, 0.38]
  },
  productRevenue: [
    { name: "新生活応援パック", revenue: 12.8, units: 43200 },
    { name: "月額パス", revenue: 9.6, units: 82400 },
    { name: "限定ステップアップガチャ", revenue: 18.2, units: 14500 },
    { name: "育成応援ブーストセット", revenue: 4.3, units: 30100 },
    { name: "プレミアム石セット", revenue: 14.9, units: 22800 },
    { name: "初心者支援パック", revenue: 6.6, units: 15400 }
  ],
  contentSpend: [
    { content: "期間限定ガチャ", paid: 4.6, free: 3.1 },
    { content: "新キャラピックアップガチャ", paid: 3.8, free: 2.7 },
    { content: "スタミナ回復", paid: 1.9, free: 1.6 },
    { content: "イベント挑戦ブースト", paid: 1.2, free: 1.7 },
    { content: "育成素材ガチャ", paid: 1.5, free: 1.0 },
    { content: "プレミアムチケット補填", paid: 0.8, free: 1.2 }
  ]
};
