(() => {
  const hosts = document.querySelectorAll("[data-dashboard-nav]");
  if (!hosts.length) return;

  const items = [
    { key: "summary", label: "ゲーム状況サマリー", href: "mock/control_tower_sample.html" },
    { key: "sales", label: "課金分析", href: "mock/sales_analysis.html" },
    { key: "users", label: "ユーザー分析", href: "mock/user_analysis.html" },
    { key: "events", label: "施策・イベント分析", href: "mock/event_timeline.html" },
    { key: "questionnaire", label: "アンケート分析", href: "mock/questionnaire_analysis_20260418.html" },
  ];

  hosts.forEach((host) => {
    const active = host.dataset.active || "";
    const base = host.dataset.base || "";
    const layout = host.closest(".app, .app-layout, .dashboard-shell");
    if (layout) layout.classList.add("dashboard-layout");
    host.classList.add("side", "dashboard-nav");
    host.innerHTML = `
      <h2>メニュー</h2>
      <nav class="nav" aria-label="ダッシュボードメニュー">
        ${items.map((item) => {
          const className = item.key === active ? " class=\"on\"" : "";
          return `<a${className} href="${base}${item.href}">${item.label}</a>`;
        }).join("")}
      </nav>
    `;
  });
})();
