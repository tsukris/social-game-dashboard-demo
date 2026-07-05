(() => {
  const root = document.getElementById("questionnaireRoot");
  if (!root) return;

  const colors = {
    blue: "#356cff",
    navy: "#1d2d56",
    teal: "#168f84",
    green: "#3f8a4d",
    amber: "#d98d25",
    red: "#c44d5c",
    violet: "#7168ef",
    pale: "#9fb9ff",
  };

  const ratingColors = {
    verySatisfied: "#356cff",
    satisfied: "#7fa4ff",
    neutral: "rgba(29, 45, 86, 0.2)",
    unsatisfied: "#d98d25",
    veryUnsatisfied: "#c44d5c",
  };

  const axes = {
    all: {
      label: "全体",
      segments: [["all", "全体"]],
    },
    spend: {
      label: "課金額",
      segments: [
        ["free", "無課金"],
        ["light", "軽課金"],
        ["middle", "中課金"],
        ["heavy", "重課金"],
      ],
    },
    core: {
      label: "コア分類",
      segments: [
        ["coreLogin", "ログイン"],
        ["coreLite", "ライト"],
        ["coreMiddle", "ミドル"],
        ["coreCore", "コア"],
      ],
    },
    tenure: {
      label: "プレイ歴",
      segments: [
        ["new", "90日未満"],
        ["returning", "復帰"],
        ["oneYear", "1年以上"],
        ["veteran", "3年以上"],
      ],
    },
  };

  const inGameItems = [
    ["story22", "メインシナリオ", 52, colors.blue],
    ["finalBattle", "高難度バトル", 44, colors.blue],
    ["annivEvent", "期間限定イベント", 68, colors.blue],
    ["eventScenario", "イベントシナリオ", 57, colors.blue],
    ["memoryBattle", "復刻・追憶コンテンツ", 35, colors.blue],
    ["oldFestival", "ランキング/競争型イベント", 26, colors.blue],
    ["wakaba", "育成支援イベント", 49, colors.blue],
    ["other", "その他", 8.7, colors.blue],
  ];

  const playPurposeItems = [
    ["character", "推しキャラを集めたい", 58, colors.blue],
    ["story", "シナリオを読みたい", 63, colors.blue],
    ["battle", "バトルを攻略したい", 39, colors.blue],
    ["growth", "育成を進めたい", 47, colors.blue],
    ["bedroom", "親密度エピソードを見たい", 52, colors.blue],
    ["collection", "図鑑・衣装・称号を集めたい", 28, colors.blue],
    ["community", "ランキング/ギルドで遊びたい", 33, colors.blue],
  ];

  const satisfactionItems = {
    battle: {
      score: 3.8,
      levels: [
        ["verySatisfied", "とても満足", 24],
        ["satisfied", "満足", 40],
        ["neutral", "普通", 22],
        ["unsatisfied", "やや不満", 10],
        ["veryUnsatisfied", "不満", 4],
      ],
    },
    scenario: {
      score: 4.2,
      levels: [
        ["verySatisfied", "とても満足", 35],
        ["satisfied", "満足", 41],
        ["neutral", "普通", 16],
        ["unsatisfied", "やや不満", 6],
        ["veryUnsatisfied", "不満", 2],
      ],
    },
    bedroom: {
      score: 3.7,
      levels: [
        ["verySatisfied", "とても満足", 21],
        ["satisfied", "満足", 38],
        ["neutral", "普通", 25],
        ["unsatisfied", "やや不満", 11],
        ["veryUnsatisfied", "不満", 5],
      ],
    },
    ui: {
      score: 3.2,
      levels: [
        ["verySatisfied", "とても満足", 12],
        ["satisfied", "満足", 32],
        ["neutral", "普通", 31],
        ["unsatisfied", "やや不満", 18],
        ["veryUnsatisfied", "不満", 7],
      ],
    },
    ops: {
      score: 3.5,
      levels: [
        ["verySatisfied", "とても満足", 17],
        ["satisfied", "満足", 35],
        ["neutral", "普通", 30],
        ["unsatisfied", "やや不満", 13],
        ["veryUnsatisfied", "不満", 5],
      ],
    },
  };

  const ageDistributionItems = [
    ["age20a", "20代前半", 10.7, "#7fb3ff"],
    ["age20b", "20代後半", 17.6, colors.blue],
    ["age30a", "30代前半", 24.8, colors.teal],
    ["age30b", "30代後半", 22.3, colors.green],
    ["age40a", "40代前半", 11.0, colors.amber],
    ["age40b", "40代後半", 7.6, colors.red],
    ["other", "その他", 6.0, "rgba(29,45,86,0.35)"],
  ].map(([key, label, value, color]) => ({ key, label, value, color }));

  const storyItems = [
    ["chapter1", "1章", 4.8],
    ["chapter2", "2章", 7.1],
    ["chapter3", "3章", 12.6],
    ["chapter4", "4章", 6.3],
    ["chapter5", "5章", 18.9],
    ["chapter6", "6章", 9.4],
    ["chapter7", "7章", 15.8],
    ["chapter8", "8章", 5.6],
    ["chapter9", "9章", 11.7],
    ["chapter10", "10章", 22.4],
  ];

  const freeTextTopicGroups = {
    q12: [
      {
        key: "storyRequest",
        label: "物語更新関連",
        value: 31,
        summary: "新章追加や本編更新の頻度を求める声が最も多い。物語が継続理由になっている一方で、更新間隔が空くと熱量が落ちる懸念がある。",
        comments: [
          response("本編の続きが一番楽しみなので、次の章の予定だけでも早めに知りたいです。", "30代前半", "中課金", "3年以上"),
          response("イベントも好きですが、やっぱりメインストーリーが進む時が一番戻りたくなります。", "20代後半", "軽課金", "1年以上"),
          response("新章の追加ペースがもう少し安定すると、ログインの目的が作りやすいです。", "30代後半", "重課金", "3年以上"),
        ],
      },
      {
        key: "storyArchive",
        label: "読み返し導線関連",
        value: 17,
        summary: "過去章の再読、用語確認、キャラ関係の整理を求める声がある。新規・復帰ユーザーほど追いつき導線への要望が強い。",
        comments: [
          response("久しぶりに戻ると誰が誰だったか忘れているので、章ごとのあらすじが欲しいです。", "20代前半", "無課金", "復帰"),
          response("好きなシーンだけ見返せる機能があるとありがたいです。", "30代前半", "軽課金", "1年以上"),
          response("用語集や人物相関図があると、物語を追いやすくなると思います。", "40代以上", "中課金", "3年以上"),
        ],
      },
      {
        key: "scenarioTempo",
        label: "シナリオテンポ関連",
        value: 14,
        summary: "会話量や戦闘挿入のテンポへの意見が目立つ。物語評価は高いが、読み進めやすさの改善余地がある。",
        comments: [
          response("会話は好きですが、イベント中は少しテンポよく読めると助かります。", "30代後半", "軽課金", "1年以上"),
          response("戦闘を挟むタイミングが多い時は集中が切れます。", "20代後半", "無課金", "90日未満"),
          response("後日談やエピローグはもっと見たいです。", "30代前半", "中課金", "3年以上"),
        ],
      },
    ],
    q13: [
      {
        key: "newMode",
        label: "新しい遊び関連",
        value: 22,
        summary: "常設で遊べる高難度やランキング以外の目標を求める声がある。短期イベントだけでなく、継続的に触る場所への期待が強い。",
        comments: [
          response("イベントの合間に触れる常設コンテンツがもう少し欲しいです。", "30代前半", "中課金", "3年以上"),
          response("ランキング以外で強くなった実感を試せる場所があると嬉しいです。", "30代後半", "重課金", "3年以上"),
          response("短時間でも達成感がある日課コンテンツが欲しいです。", "20代後半", "軽課金", "1年以上"),
        ],
      },
      {
        key: "socialFeature",
        label: "交流・協力関連",
        value: 15,
        summary: "ギルドやフレンド支援など、他プレイヤーとの薄い協力を求める声がある。強制協力ではなく、任意参加の温度感が望まれている。",
        comments: [
          response("ギルドで協力できる要素が少しあると続ける理由になります。", "20代後半", "軽課金", "1年以上"),
          response("フレンドの推しキャラを借りられる機能が欲しいです。", "30代前半", "無課金", "復帰"),
          response("強制ではなく、ゆるく参加できる共闘があると楽しそうです。", "40代以上", "中課金", "3年以上"),
        ],
      },
      {
        key: "homeFeature",
        label: "推し活・閲覧関連",
        value: 13,
        summary: "キャラ閲覧、衣装、ホーム演出など、推しを眺める体験への要望が多い。課金意向にも接続しやすい領域。",
        comments: [
          response("衣装違いをホームで切り替えて眺めたいです。", "30代前半", "中課金", "3年以上"),
          response("図鑑で過去イラストやボイスをもっと見返したいです。", "20代後半", "軽課金", "1年以上"),
          response("推しキャラの育成状況を見せられるプロフィールが欲しいです。", "30代後半", "重課金", "3年以上"),
        ],
      },
    ],
    q14: [
      {
        key: "skip",
        label: "周回負荷関連",
        value: 24,
        summary: "日課・イベント周回・素材集めの負荷が主要な改善要望。プレイ継続の阻害要因として優先度が高い。",
        comments: [
          response("イベント周回に時間がかかりすぎて、忙しい週は諦めています。", "30代後半", "軽課金", "1年以上"),
          response("スキップできる範囲をもう少し増やしてほしいです。", "40代以上", "中課金", "3年以上"),
          response("毎日やることが多く、楽しいより作業感が強くなる時があります。", "30代前半", "無課金", "復帰"),
        ],
      },
      {
        key: "growth",
        label: "育成導線関連",
        value: 21,
        summary: "育成素材、強化優先度、編成の分かりにくさが不満として出ている。新規・復帰ユーザーの定着に影響する。",
        comments: [
          response("何を優先して育てればいいか分かりづらいです。", "20代前半", "無課金", "90日未満"),
          response("素材が足りなくて新キャラを引いてもすぐ使えないことがあります。", "30代前半", "軽課金", "1年以上"),
          response("おすすめ編成の理由まで見られると助かります。", "20代後半", "中課金", "復帰"),
        ],
      },
      {
        key: "ui",
        label: "UI・検索関連",
        value: 15,
        summary: "所持枠、フィルタ、編成保存など操作効率への要望がある。日常的に触るため、小さな不満が積み上がりやすい。",
        comments: [
          response("キャラ検索と絞り込みをもっと細かくしたいです。", "30代前半", "中課金", "3年以上"),
          response("編成保存枠が足りないので増やしてほしいです。", "30代後半", "重課金", "3年以上"),
          response("アイテム一覧が探しにくいです。", "40代以上", "軽課金", "1年以上"),
        ],
      },
    ],
    q15: [
      {
        key: "gacha",
        label: "ガチャ・配布関連",
        value: 18,
        summary: "ガチャ体感、石配布、天井までの負担感に関する意見が多い。課金満足度と継続意向の両方に影響する。",
        comments: [
          response("天井までが遠く感じるので、周年くらいはもう少し安心して引きたいです。", "30代後半", "重課金", "3年以上"),
          response("配布がある時は戻るきっかけになります。", "20代後半", "無課金", "復帰"),
          response("確定や選べる形式があると課金しやすいです。", "30代前半", "中課金", "1年以上"),
        ],
      },
      {
        key: "balance",
        label: "難度・報酬関連",
        value: 16,
        summary: "イベント難度や報酬量への納得感が論点。高難度を求める声と、報酬回収のしんどさを訴える声が分かれている。",
        comments: [
          response("高難度は好きですが、報酬が限定されると少しつらいです。", "30代前半", "中課金", "3年以上"),
          response("復帰直後だとイベント報酬を取り切るのが難しいです。", "20代後半", "軽課金", "復帰"),
          response("強い人向けとライト向けで目標が分かれていると遊びやすいです。", "40代以上", "無課金", "1年以上"),
        ],
      },
      {
        key: "communication",
        label: "運営告知関連",
        value: 14,
        summary: "改善予定やロードマップを知りたい声がある。実装そのものだけでなく、対応姿勢の見え方が信頼に影響している。",
        comments: [
          response("改善予定が分かるだけでも待ちやすくなります。", "30代後半", "軽課金", "3年以上"),
          response("不具合や調整の説明が丁寧だと安心できます。", "30代前半", "中課金", "1年以上"),
          response("今後の更新方針を定期的に出してほしいです。", "40代以上", "重課金", "3年以上"),
        ],
      },
    ],
  };
  const freeTextExtraComments = {
    storyRequest: [
      response("章の追加タイミングが分かると待ちやすいです。", "30代後半", "中課金", "3年以上"),
      response("イベントより本編更新を優先してほしい月があります。", "40代以上", "重課金", "3年以上"),
      response("メインの続きが来ると課金する理由にもなります。", "30代前半", "中課金", "1年以上"),
      response("新章予告だけでもあるとログインを続けやすいです。", "20代後半", "軽課金", "復帰"),
      response("本編更新の間隔が空くと熱が落ちます。", "30代後半", "無課金", "3年以上"),
      response("周年後も物語が動くことを見せてほしいです。", "30代前半", "重課金", "3年以上"),
      response("次の章で誰が中心になるのか早めに知りたいです。", "20代前半", "軽課金", "1年以上"),
    ],
    storyArchive: [
      response("章ごとのあらすじがあると復帰しやすいです。", "30代前半", "無課金", "復帰"),
      response("キャラ名と関係性を確認できる画面が欲しいです。", "40代以上", "軽課金", "3年以上"),
      response("好きな場面にすぐ飛べる機能があると嬉しいです。", "20代後半", "中課金", "1年以上"),
      response("過去イベントの時系列が分かると読み返しやすいです。", "30代後半", "中課金", "3年以上"),
      response("未読章だけをまとめて見られる導線が欲しいです。", "20代前半", "無課金", "90日未満"),
      response("用語の意味をゲーム内で確認したいです。", "30代前半", "軽課金", "復帰"),
      response("過去章の名場面を一覧で見返したいです。", "40代以上", "重課金", "3年以上"),
    ],
    scenarioTempo: [
      response("イベントシナリオは好きですが、長い時は分割して読みたいです。", "30代前半", "軽課金", "1年以上"),
      response("戦闘前後の会話がもう少し短いと周回中に助かります。", "20代後半", "無課金", "90日未満"),
      response("テンポが良い回は最後まで一気に読めます。", "30代後半", "中課金", "3年以上"),
      response("読み終わった後の余韻がある話を増やしてほしいです。", "40代以上", "中課金", "3年以上"),
      response("スキップせず読みたいので、章ごとの区切りを分かりやすくしてほしいです。", "30代前半", "重課金", "1年以上"),
      response("バトルを挟まずに読めるモードがあると嬉しいです。", "20代後半", "軽課金", "復帰"),
      response("導入が長いイベントは途中で止まりがちです。", "30代後半", "無課金", "1年以上"),
    ],
    newMode: [
      response("毎週少しずつ進む常設コンテンツが欲しいです。", "30代前半", "中課金", "3年以上"),
      response("強くなったキャラを試せる場所があると嬉しいです。", "30代後半", "重課金", "3年以上"),
      response("イベントがない期間にも触る理由が欲しいです。", "20代後半", "軽課金", "1年以上"),
      response("ランキング以外の達成目標があると続けやすいです。", "40代以上", "中課金", "3年以上"),
      response("短時間で終わるチャレンジ系が欲しいです。", "20代前半", "無課金", "90日未満"),
      response("高難度を常設にして練習できるようにしてほしいです。", "30代前半", "重課金", "3年以上"),
      response("推しキャラを使う理由になるコンテンツが欲しいです。", "30代後半", "中課金", "1年以上"),
    ],
    socialFeature: [
      response("ギルド内で軽く協力できる要素が欲しいです。", "30代前半", "軽課金", "1年以上"),
      response("フレンドの編成を参考にできると助かります。", "20代後半", "無課金", "復帰"),
      response("共闘は強制ではなく任意参加がいいです。", "40代以上", "中課金", "3年以上"),
      response("推しキャラを見せ合える機能があると楽しそうです。", "30代後半", "重課金", "3年以上"),
      response("ギルド報酬が重すぎない交流要素が欲しいです。", "30代前半", "中課金", "1年以上"),
      response("初心者を助ける仕組みがあると復帰しやすいです。", "20代前半", "軽課金", "90日未満"),
      response("チャット以外でゆるく反応できる機能が欲しいです。", "30代後半", "無課金", "1年以上"),
    ],
    homeFeature: [
      response("ホームで推しの衣装を複数設定したいです。", "30代前半", "中課金", "3年以上"),
      response("過去ボイスを図鑑で聞き返したいです。", "20代後半", "軽課金", "1年以上"),
      response("親密度で見た目や台詞が変わると嬉しいです。", "30代後半", "重課金", "3年以上"),
      response("お気に入りキャラの専用演出を増やしてほしいです。", "40代以上", "中課金", "3年以上"),
      response("入手済み衣装を一覧で見たいです。", "30代前半", "軽課金", "復帰"),
      response("推しをプロフィールでアピールできると楽しいです。", "20代前半", "無課金", "1年以上"),
      response("季節ボイスを後から確認できるようにしてほしいです。", "30代後半", "中課金", "3年以上"),
    ],
    skip: [
      response("イベントの周回時間をもう少し短くしたいです。", "30代後半", "軽課金", "1年以上"),
      response("素材クエストはまとめて消化できると助かります。", "40代以上", "中課金", "3年以上"),
      response("忙しい日は日課を終えるだけで疲れます。", "30代前半", "無課金", "復帰"),
      response("スキップ券の入手機会を増やしてほしいです。", "20代後半", "軽課金", "1年以上"),
      response("周回数が多いイベントは途中で諦めがちです。", "30代後半", "中課金", "3年以上"),
      response("一度クリアしたクエストはもっと早く終えたいです。", "40代以上", "無課金", "1年以上"),
      response("報酬は欲しいけど時間が足りません。", "30代前半", "重課金", "3年以上"),
    ],
    growth: [
      response("新キャラを引いても育成が追いつきません。", "30代前半", "軽課金", "1年以上"),
      response("素材の必要量が分かりづらいです。", "20代前半", "無課金", "90日未満"),
      response("どこを周回すればいいかおすすめ表示が欲しいです。", "20代後半", "中課金", "復帰"),
      response("育成優先度をゲーム内で教えてほしいです。", "30代後半", "中課金", "3年以上"),
      response("装備整理が大変で編成前に疲れます。", "40代以上", "軽課金", "1年以上"),
      response("復帰後に何から強化するべきか分かりません。", "30代前半", "無課金", "復帰"),
      response("育成素材の入手先を一覧で見たいです。", "30代後半", "重課金", "3年以上"),
    ],
    ui: [
      response("フィルタ条件を保存できるようにしてほしいです。", "30代前半", "中課金", "3年以上"),
      response("キャラ一覧の表示が重い時があります。", "20代後半", "軽課金", "1年以上"),
      response("アイテムの用途が分かりづらいです。", "40代以上", "軽課金", "1年以上"),
      response("編成保存枠をイベント別に分けたいです。", "30代後半", "重課金", "3年以上"),
      response("検索でスキル名まで拾えると助かります。", "30代前半", "中課金", "1年以上"),
      response("所持枠の整理が面倒です。", "20代後半", "無課金", "復帰"),
      response("よく使う画面にすぐ移動できるショートカットが欲しいです。", "40代以上", "中課金", "3年以上"),
    ],
    gacha: [
      response("天井までの負担が大きく感じます。", "30代後半", "重課金", "3年以上"),
      response("周年はもう少し石配布があると戻りやすいです。", "20代後半", "無課金", "復帰"),
      response("選べる確定ガチャがあると課金しやすいです。", "30代前半", "中課金", "1年以上"),
      response("ピックアップの体感が弱い時があります。", "40代以上", "軽課金", "3年以上"),
      response("推しが来た時だけ安心して引ける仕組みが欲しいです。", "30代後半", "中課金", "3年以上"),
      response("ガチャ結果に納得できる演出や保証があると嬉しいです。", "20代前半", "軽課金", "90日未満"),
      response("パックとガチャのつながりが分かりやすいと買いやすいです。", "30代前半", "重課金", "3年以上"),
    ],
    balance: [
      response("高難度の報酬差が大きいとライト層はつらいです。", "30代前半", "中課金", "3年以上"),
      response("復帰直後でも参加できる難度があると助かります。", "20代後半", "軽課金", "復帰"),
      response("育成が進んだ人向けの目標も残してほしいです。", "40代以上", "重課金", "3年以上"),
      response("報酬のために無理に高難度をやるのは疲れます。", "30代後半", "無課金", "1年以上"),
      response("イベント報酬の取り切りラインを少し下げてほしいです。", "30代前半", "軽課金", "1年以上"),
      response("難しいコンテンツは好きですが、挑戦回数の負担は減らしたいです。", "30代後半", "中課金", "3年以上"),
      response("戦力差があっても楽しめる報酬設計だと嬉しいです。", "20代前半", "無課金", "90日未満"),
    ],
    communication: [
      response("改善予定が見えると安心して続けられます。", "30代後半", "軽課金", "3年以上"),
      response("不具合対応の説明が丁寧だと信頼できます。", "30代前半", "中課金", "1年以上"),
      response("ロードマップを定期的に出してほしいです。", "40代以上", "重課金", "3年以上"),
      response("調整理由をもう少し詳しく知りたいです。", "20代後半", "軽課金", "1年以上"),
      response("ユーザーの声にどう対応したか見えると嬉しいです。", "30代前半", "無課金", "復帰"),
      response("生放送で今後の方針を話してくれると安心します。", "30代後半", "中課金", "3年以上"),
      response("お知らせが多いので重要なものを見分けやすくしてほしいです。", "40代以上", "軽課金", "1年以上"),
    ],
  };
  const freeTextOverallSummaries = {
    q12: "物語は継続理由として強く、更新頻度・読み返し導線・読み進めやすさの3点に要望が集中している。新章期待は高い一方、復帰者には過去章の把握支援が必要。",
    q13: "新機能要望は、常設で遊べる目標、ゆるい交流、推しを眺める体験に分かれる。売上に直結しやすいのは推し活・閲覧系、継続に効くのは常設コンテンツ系。",
    q14: "改善要望は周回負荷、育成導線、UI検索に集中している。短期的には日課短縮と検索性改善、復帰・新規向けには育成優先度の提示が効きやすい。",
    q15: "全般意見ではガチャ負担、難度と報酬の納得感、運営告知への信頼が主要論点。施策そのものに加えて、改善予定や調整理由の見せ方が継続意向に影響している。",
  };

  const topicItems = Object.values(freeTextTopicGroups).flat();

  const otherFreeTextGroups = [
    {
      key: "q2",
      number: "Q2",
      title: "その他自由記述（年齢）",
      original: "年齢を教えてください。の「その他」自由記述",
      responses: [
        "50代です",
        "55歳",
        "60代",
        "10代後半",
        "高校生",
        "16歳",
        "40代より上",
        "回答したくない",
        "非公開",
        "年齢は伏せたい",
      ],
    },
    {
      key: "q3",
      number: "Q3",
      title: "その他自由記述（好きなゲーム内コンテンツ）",
      original: "好きなゲーム内コンテンツの「その他」自由記述",
      responses: [
        "推しキャラ同士の掛け合いが好き",
        "ホーム画面のボイスと表情差分",
        "BGMが良いのでサントラ的に聴いている",
        "親密度エピソード前後のキャラエピソード",
        "イベント報酬の小話",
        "編成を考えるところ",
        "ガチャ演出",
        "図鑑で過去イラストを見返すこと",
        "ログイン時の季節ボイス",
        "ギルド内の会話",
      ],
    },
    {
      key: "q4",
      number: "Q4",
      title: "その他自由記述（主なプレイ目的）",
      original: "主なプレイ目的の「その他」自由記述",
      responses: [
        "毎日の習慣として続けている",
        "推しの新規ボイスを聞くため",
        "ログインボーナスや配布を逃したくない",
        "ランキングはやらないがイベント報酬は集めたい",
        "フレンドが続けているので一緒に遊んでいる",
        "育成素材を少しずつ貯めるのが好き",
        "周年や大型更新の雰囲気を追いたい",
        "SNSで話題になった時に戻っている",
        "お気に入りキャラの衣装を眺めたい",
        "寝る前に短時間だけ触るゲームとして使っている",
      ],
    },
  ];

  const otherFreeTextAttrs = {
    q2: [
      ["50代", "中課金", "3年以上"],
      ["50代", "軽課金", "3年以上"],
      ["60代", "無課金", "1年以上"],
      ["10代後半", "無課金", "90日未満"],
      ["10代後半", "無課金", "90日未満"],
      ["10代後半", "軽課金", "90日未満"],
      ["40代以上", "重課金", "3年以上"],
      ["非公開", "軽課金", "1年以上"],
      ["非公開", "無課金", "復帰"],
      ["非公開", "中課金", "3年以上"],
    ],
    q3: [
      ["30代前半", "中課金", "3年以上"],
      ["20代後半", "軽課金", "1年以上"],
      ["40代以上", "無課金", "復帰"],
      ["30代後半", "重課金", "3年以上"],
      ["20代前半", "無課金", "90日未満"],
      ["30代前半", "軽課金", "1年以上"],
      ["20代後半", "中課金", "1年以上"],
      ["40代以上", "中課金", "3年以上"],
      ["30代後半", "軽課金", "3年以上"],
      ["30代前半", "無課金", "1年以上"],
    ],
    q4: [
      ["30代後半", "軽課金", "3年以上"],
      ["20代後半", "中課金", "1年以上"],
      ["30代前半", "無課金", "1年以上"],
      ["40代以上", "軽課金", "3年以上"],
      ["20代後半", "無課金", "復帰"],
      ["30代前半", "軽課金", "1年以上"],
      ["30代後半", "中課金", "3年以上"],
      ["20代前半", "無課金", "90日未満"],
      ["30代前半", "重課金", "3年以上"],
      ["40代以上", "中課金", "1年以上"],
    ],
  };

  const questionMeta = {
    age: {
      number: "Q2",
      title: "年齢分布",
      original: "年齢を教えてください。",
    },
    inGame: {
      number: "Q3",
      title: "好きなゲーム内コンテンツ（複数選択）",
      original: "好きなゲーム内コンテンツを複数選んでください",
    },
    playPurpose: {
      number: "Q4",
      title: "主なプレイ目的（複数選択）",
      original: "このゲームをプレイする主な目的を複数選んでください",
    },
    pv: {
      number: "Q5",
      title: "生放送視聴状況",
      original: "生放送を見たかどうか教えてください",
    },
    battleSatisfaction: {
      number: "Q6",
      title: "バトル部分への満足度（5段階評価）",
      original: "バトル部分への満足度を5段階で教えてください",
    },
    scenarioSatisfaction: {
      number: "Q7",
      title: "シナリオへの満足度（5段階評価）",
      original: "シナリオへの満足度を5段階で教えてください",
    },
    story: {
      number: "Q8",
      title: "好きな物語章（複数選択）",
      original: "本ゲームの物語で好きな章を選んでください",
    },
    bedroomSatisfaction: {
      number: "Q9",
      title: "親密度エピソードへの満足度（5段階評価）",
      original: "親密度エピソードへの満足度を5段階で教えてください",
    },
    uiSatisfaction: {
      number: "Q10",
      title: "UIへの満足度（5段階評価）",
      original: "UIへの満足度を5段階で教えてください",
    },
    opsSatisfaction: {
      number: "Q11",
      title: "運営への満足度（5段階評価）",
      original: "運営への満足度を5段階で教えてください",
    },
    storyFreeText: {
      number: "Q12",
      title: "物語への意見（自由記述）",
      original: "物語に関する感想やご意見などがございましたらご記入ください。（自由記入）",
    },
    newFeatureFreeText: {
      number: "Q13",
      title: "欲しい新機能・コンテンツ（自由記述）",
      original: "本ゲームに欲しい新機能やコンテンツをご記入ください。（自由記入）",
    },
    existingFeatureFreeText: {
      number: "Q14",
      title: "既存機能の改善要望（自由記述）",
      original: "本ゲームの既存コンテンツや機能に対してのご意見 ・改善してほしい点がございましたらご記入ください。（自由記入）",
    },
    overallFreeText: {
      number: "Q15",
      title: "ゲーム全般の意見（自由記述）",
      original: "ゲーム全般においてご意見・改善してほしい点がございましたらご記入ください。（自由記入）",
    },
  };

  const pvBase = {
    yes: 71.5,
    no: 28.5,
  };

  const profiles = {
    all: {
      label: "全体",
      respondents: 8742,
      responseRate: 18.6,
      storyHeat: 82.4,
      cafeRate: 11.8,
      freeTextRate: 47.1,
      confidence: "回答母数十分",
      decision: "6.5周年の勝ち筋は「物語22章」と「最終決戦」の熱量。外部施策は拡散よりも世界観素材の反応が強い。",
      note: "questionnaire.txt の設問構成に沿って、回答が入った後に意思決定者へ見せる分析画面として作成したモックです。",
      boosts: {},
    },
    age20a: {
      label: "20代前半",
      respondents: 936,
      responseRate: 14.2,
      storyHeat: 74.6,
      cafeRate: 8.5,
      freeTextRate: 41.5,
      confidence: "若年獲得確認",
      decision: "拡散キャンペーンの反応は高いが、物語熱量は全体より低め。新規導線と短尺訴求を先に見せるべき層。",
      note: "えらべるPayや投票シェアへの反応が強く、SNS起点の再流入検証に使いやすい。",
      boosts: { campaign: { pay: 9, vote55: 5, wakabaVote: 4 }, topics: { gacha: 4, ui: 3 }, inGame: { finalBattle: -4, memoryBattle: -5 } },
    },
    age20b: {
      label: "20代後半",
      respondents: 1540,
      responseRate: 17.5,
      storyHeat: 80.8,
      cafeRate: 10.6,
      freeTextRate: 45.2,
      confidence: "標準比較",
      decision: "周年素材と楽曲の反応が強い。ビジュアル公開からログイン復帰へつなぐ導線が刺さる。",
      note: "ゲーム内外どちらにも反応するため、周年後半の再接触施策に向く。",
      boosts: { campaign: { visual: 5, song: 5, newChapter: 3 }, inGame: { annivEvent: 4 } },
    },
    age30a: {
      label: "30代前半",
      respondents: 2164,
      responseRate: 20.4,
      storyHeat: 84.7,
      cafeRate: 12.8,
      freeTextRate: 48.8,
      confidence: "主力層",
      decision: "物語22章と最終決戦の両方が強い。周年の中心訴求として最も意思決定しやすい母集団。",
      note: "回答数、熱量、自由記入率のバランスがよく、施策優先度の基準にできる。",
      boosts: { inGame: { story22: 4, finalBattle: 4 }, topics: { storyRequest: 3 } },
    },
    age30b: {
      label: "30代後半",
      respondents: 1948,
      responseRate: 21.1,
      storyHeat: 86.2,
      cafeRate: 13.9,
      freeTextRate: 51.4,
      confidence: "改善要望多め",
      decision: "物語熱量と改善要望がどちらも高い。新章期待と日課短縮をセットで出すと説得力が上がる。",
      note: "自由記入が多く、運営改善の材料として使いやすい層。",
      boosts: { inGame: { story22: 5, memoryBattle: 4 }, topics: { skip: 5, growth: 3 } },
    },
    age40: {
      label: "40代以上",
      respondents: 1628,
      responseRate: 19.7,
      storyHeat: 85.4,
      cafeRate: 15.1,
      freeTextRate: 49.6,
      confidence: "リアル関心",
      decision: "コラボカフェと物語の反応が高い。リアルイベントの再開催・通販訴求に向く。",
      note: "遠方参加や事後通販など、参加障壁を下げる要望が目立つ。",
      boosts: { campaign: { song: 4 }, topics: { realEvent: 7, storyRequest: 3 }, inGame: { eventScenario: 3 } },
    },
    free: {
      label: "無課金",
      respondents: 2786,
      responseRate: 16.3,
      storyHeat: 77.5,
      cafeRate: 7.9,
      freeTextRate: 42.6,
      confidence: "拡散寄り",
      decision: "外部キャンペーンと配布期待が強い。ログイン復帰は可能だが、課金転換は物語更新との併用が必要。",
      note: "石配布やガチャ体感の要望が増えるため、周年配布の納得感を見せたい。",
      boosts: { campaign: { pay: 10, vote55: 4 }, topics: { gacha: 8, skip: 2 }, inGame: { oldFestival: -3 } },
    },
    light: {
      label: "軽課金",
      respondents: 2454,
      responseRate: 19.8,
      storyHeat: 82.1,
      cafeRate: 10.9,
      freeTextRate: 47.8,
      confidence: "転換余地",
      decision: "物語と周年イベントへの反応が平均的に高い。小額商品や限定パックの検証対象にしやすい。",
      note: "魅力項目は広く反応するため、商品価格帯別の出し分けを見せると刺さる。",
      boosts: { inGame: { annivEvent: 5, eventScenario: 3 }, topics: { growth: 3 } },
    },
    middle: {
      label: "中課金",
      respondents: 1842,
      responseRate: 22.6,
      storyHeat: 86.9,
      cafeRate: 13.6,
      freeTextRate: 52.2,
      confidence: "運営判断向き",
      decision: "物語22章・最終決戦・追憶戦が強い。追加コンテンツと商品設計を同時に判断できる層。",
      note: "熱量と支払い意思が近く、周年後半の売上施策の根拠にしやすい。",
      boosts: { inGame: { story22: 6, finalBattle: 6, memoryBattle: 5 }, topics: { storyRequest: 4, growth: 3 } },
    },
    heavy: {
      label: "重課金",
      respondents: 1098,
      responseRate: 26.8,
      storyHeat: 90.5,
      cafeRate: 18.4,
      freeTextRate: 57.7,
      confidence: "最重要顧客",
      decision: "最終決戦と追憶戦の反応が突出。高単価施策は物語の納得感とセットで見せるべき。",
      note: "改善要望も濃く、ガチャ・天井・育成負荷へのコメントを優先的に拾う。",
      boosts: { inGame: { finalBattle: 11, memoryBattle: 8, story22: 6 }, topics: { gacha: 7, growth: 5, storyRequest: 4 }, campaign: { visual: 4 } },
    },
    coreLogin: {
      label: "ログイン",
      respondents: 1264,
      responseRate: 11.8,
      storyHeat: 61.2,
      cafeRate: 4.6,
      freeTextRate: 29.4,
      confidence: "休眠予備軍",
      decision: "ログインは残っているが、遊ぶ理由が弱い。報酬・時短・復帰導線の改善を見る層。",
      note: "周年告知の認知はあるが、ゲーム内行動まで進んでいないライト接点。",
      boosts: { inGame: { story22: -10, finalBattle: -12, annivEvent: 2, wakaba: 7 }, purpose: { character: -6, story: -8, growth: 5 }, topics: { skip: 6, growth: 5, ui: 3 }, satisfaction: { ui: -0.3, ops: -0.2 } },
    },
    coreLite: {
      label: "ライト",
      respondents: 2388,
      responseRate: 17.1,
      storyHeat: 76.4,
      cafeRate: 8.8,
      freeTextRate: 40.6,
      confidence: "再接触候補",
      decision: "イベント参加とキャラ訴求には反応。短時間で成果が出る施策が定着に効く。",
      note: "課金前後の入口になるため、ホーム・イベント導線の見せ方を比較しやすい。",
      boosts: { inGame: { annivEvent: 5, eventScenario: 3, wakaba: 5 }, purpose: { character: 4, growth: 4, community: -4 }, topics: { growth: 4, skip: 4 }, satisfaction: { battle: -0.1, ui: -0.1 } },
    },
    coreMiddle: {
      label: "ミドル",
      respondents: 2846,
      responseRate: 21.6,
      storyHeat: 84.1,
      cafeRate: 12.7,
      freeTextRate: 49.8,
      confidence: "標準比較",
      decision: "物語・イベント・育成のバランスがよく、施策優先度の基準として使える。",
      note: "全体平均に近く、円グラフ絞り込み時の比較母集団にしやすい。",
      boosts: { inGame: { story22: 3, annivEvent: 4, eventScenario: 3 }, purpose: { story: 3, growth: 3, bedroom: 2 }, topics: { storyRequest: 3, growth: 2 }, satisfaction: { scenario: 0.1, ops: 0.1 } },
    },
    coreCore: {
      label: "コア",
      respondents: 2244,
      responseRate: 27.4,
      storyHeat: 92.6,
      cafeRate: 18.9,
      freeTextRate: 60.8,
      confidence: "熱量上位",
      decision: "最終決戦・追憶・高難度への反応が強く、周年後半の売上訴求を判断する主力層。",
      note: "自由記述も濃いため、不満の検知と高単価施策の納得感確認に向く。",
      boosts: { inGame: { story22: 7, finalBattle: 12, memoryBattle: 9, oldFestival: 5 }, purpose: { battle: 7, story: 5, collection: 4 }, topics: { gacha: 6, storyRequest: 5, growth: 4 }, satisfaction: { battle: 0.3, scenario: 0.2, ops: 0.2 } },
    },
    new: {
      label: "90日未満",
      respondents: 714,
      responseRate: 12.9,
      storyHeat: 66.8,
      cafeRate: 5.2,
      freeTextRate: 34.9,
      confidence: "入口検証",
      decision: "周年施策の情報量が多く、物語より報酬・導線に反応。初心者向け要約と育成支援が必要。",
      note: "まずは遊び続ける理由を作る層。物語熱量は育成詰まり解消後に伸びる。",
      boosts: { campaign: { pay: 7 }, topics: { growth: 8, ui: 6, skip: 4 }, inGame: { story22: -8, finalBattle: -9, annivEvent: 3 } },
    },
    returning: {
      label: "復帰",
      respondents: 1186,
      responseRate: 17.7,
      storyHeat: 79.3,
      cafeRate: 9.7,
      freeTextRate: 43.5,
      confidence: "復帰確認",
      decision: "新章追加と周年ビジュアルが復帰理由になる。未読章への追いつき導線が刺さる。",
      note: "復帰後に迷わない導線を示せると、周年後半の定着施策に落とし込める。",
      boosts: { campaign: { newChapter: 8, visual: 5 }, inGame: { story22: 5, memoryBattle: 4 }, topics: { storyRequest: 4, skip: 3 } },
    },
    oneYear: {
      label: "1年以上",
      respondents: 2658,
      responseRate: 20.1,
      storyHeat: 84.8,
      cafeRate: 12.5,
      freeTextRate: 48.2,
      confidence: "安定層",
      decision: "物語22章が安定して強い。周年後の継続コンテンツを見せる対象として扱える。",
      note: "ゲーム内施策の比較対象として使いやすい標準セグメント。",
      boosts: { inGame: { story22: 4, eventScenario: 3 }, topics: { storyRequest: 3 } },
    },
    veteran: {
      label: "3年以上",
      respondents: 3324,
      responseRate: 24.6,
      storyHeat: 91.2,
      cafeRate: 17.2,
      freeTextRate: 56.1,
      confidence: "コア熱量",
      decision: "長期ユーザーは最終決戦・追憶戦・リアルイベントに強く反応。運営の本気度を伝える材料になる。",
      note: "周年の熱量を支える層。プレゼンでは売上だけでなく継続期待の根拠として見せたい。",
      boosts: { inGame: { finalBattle: 10, memoryBattle: 9, oldFestival: 5 }, topics: { storyRequest: 6, realEvent: 5, gacha: 4 }, campaign: { song: 5 } },
    },
    cafeJoined: {
      label: "参加",
      respondents: 1032,
      responseRate: 31.4,
      storyHeat: 89.1,
      cafeRate: 100,
      freeTextRate: 63.8,
      confidence: "リアル強反応",
      decision: "参加者は物語・楽曲・グッズ文脈に強く反応。再開催より先に満足ポイントの可視化が刺さる。",
      note: "自由記入から再訪意向と通販要望を拾うと、リアルイベントの費用対効果を説明しやすい。",
      boosts: { campaign: { song: 8, visual: 6 }, topics: { realEvent: 16, storyRequest: 4 }, inGame: { eventScenario: 5 } },
      cafe: { attended: 100, interested: 0, aware: 0, unknown: 0 },
    },
    cafeInterested: {
      label: "関心あり未参加",
      respondents: 2484,
      responseRate: 20.2,
      storyHeat: 84.5,
      cafeRate: 0,
      freeTextRate: 52.7,
      confidence: "次回来店候補",
      decision: "参加障壁の解消でリアルイベント参加に転びやすい。地方開催・予約枠・事後通販の訴求が有効。",
      note: "未参加理由を分類して、次回開催地と通販施策の優先順位に落とすと説得力が出る。",
      boosts: { topics: { realEvent: 14, ui: 2 }, campaign: { visual: 4, song: 3 }, inGame: { story22: 3 } },
      cafe: { attended: 0, interested: 100, aware: 0, unknown: 0 },
    },
    cafeNo: {
      label: "未参加",
      respondents: 5226,
      responseRate: 16.1,
      storyHeat: 79.4,
      cafeRate: 0,
      freeTextRate: 42.1,
      confidence: "ゲーム内優先",
      decision: "リアルイベントよりゲーム内改善の声が強い。物語更新と周回負荷改善を先に見せるべき。",
      note: "参加しない理由より、ゲーム内で欲しい変化を拾う方が施策に転換しやすい。",
      boosts: { topics: { skip: 5, growth: 4, gacha: 3 }, campaign: { pay: 4 }, inGame: { annivEvent: 3 } },
      cafe: { attended: 0, interested: 34, aware: 48, unknown: 18 },
    },
  };

  const mockRespondents = buildMockRespondents(8742);

  const state = {
    axis: "all",
    segment: "all",
    segmentOpen: false,
    answerFilters: [],
    otherOpen: {},
    freeTextSelection: {},
    freeTextSegmentSelection: {},
  };

  root.addEventListener("click", (event) => {
    const classificationFilterClear = event.target.closest("[data-classification-filter-clear]");
    if (classificationFilterClear) {
      state.axis = "all";
      state.segment = "all";
      state.segmentOpen = false;
      state.freeTextSegmentSelection = {};
      render();
      return;
    }

    const answerFilterClear = event.target.closest("[data-answer-filter-clear]");
    if (answerFilterClear) {
      state.answerFilters = [];
      render();
      return;
    }

    const answerFilterRemove = event.target.closest("[data-answer-filter-remove]");
    if (answerFilterRemove) {
      const filterId = answerFilterRemove.dataset.answerFilterRemove;
      state.answerFilters = state.answerFilters.filter((currentFilterId) => currentFilterId !== filterId);
      render();
      return;
    }

    const answerFilter = event.target.closest("[data-answer-filter]");
    if (answerFilter) {
      const filterId = answerFilter.dataset.answerFilter;
      state.answerFilters = toggleAnswerFilter(state.answerFilters, filterId);
      render();
      return;
    }

    const freeTextSummary = event.target.closest("[data-free-text-summary]");
    if (freeTextSummary) {
      state.freeTextSelection[freeTextSummary.dataset.freeTextSummary] = "overall";
      render();
      return;
    }

    const freeTextCategory = event.target.closest("[data-free-text-category]");
    if (freeTextCategory) {
      state.freeTextSelection[freeTextCategory.dataset.questionKey] = freeTextCategory.dataset.freeTextCategory;
      render();
      return;
    }

    const freeTextSegment = event.target.closest("[data-free-text-segment]");
    if (freeTextSegment) {
      state.freeTextSegmentSelection[freeTextSegment.dataset.questionKey] = freeTextSegment.dataset.freeTextSegment;
      render();
      return;
    }

    const otherToggle = event.target.closest("[data-other-toggle]");
    if (otherToggle) {
      const key = otherToggle.dataset.otherToggle;
      state.otherOpen[key] = !state.otherOpen[key];
      render();
      return;
    }

    const classificationControl = event.target.closest(".classification-control");
    const button = event.target.closest("[data-qa-control][data-value]");
    if (!button) {
      if (state.segmentOpen) {
        state.segmentOpen = false;
        render();
      }
      return;
    }
    const control = button.dataset.qaControl;
    const value = button.dataset.value;
    if (control === "axis") {
      state.axis = value;
      state.segment = "all";
      state.segmentOpen = false;
      state.freeTextSegmentSelection = {};
    }
    if (control === "segment") {
      state.segment = value;
      state.segmentOpen = true;
    }
    render();
  });

  render();

  function render() {
    const answerFilter = getAnswerFilterSet(state.answerFilters);
    const respondents = currentRespondents(answerFilter);
    const profile = buildProfile(respondents, answerFilter);
    const data = buildData(respondents);
    const segmentData = buildSegmentData(respondents);
    root.innerHTML = `
      ${renderHeader(profile)}
      <section class="qa-grid" aria-label="アンケート分析">
        ${renderAgePanel(questionMeta.age, data.ageDistribution, otherFreeTextGroups[0], segmentData)}
        ${renderBarPanel(questionMeta.inGame, "複数選択。どのゲーム内コンテンツが継続理由になっているかを見る。", data.inGame, "qa-panel-main", otherFreeTextGroups[1], segmentData, "inGame")}
        ${renderBarPanel(questionMeta.playPurpose, "複数選択。キャラ・物語・攻略・収集のどれがプレイ動機になっているかを見る。", data.playPurpose, "qa-panel-main", otherFreeTextGroups[2], segmentData, "playPurpose")}
        ${renderPvPanel(data.pv, segmentData)}
        ${renderSatisfactionPanel(questionMeta.battleSatisfaction, "攻略難度・周回負荷・報酬納得感の評価を確認する。", data.satisfaction.battle, "battle", segmentData)}
        ${renderSatisfactionPanel(questionMeta.scenarioSatisfaction, "物語が継続動機として機能しているかを確認する。", data.satisfaction.scenario, "scenario", segmentData)}
        ${renderBarPanel(questionMeta.story, "複数選択。どの章・展開が物語熱量を作っているかを見る。", data.story, "qa-panel-third", null, segmentData, "story")}
        ${renderSatisfactionPanel(questionMeta.bedroomSatisfaction, "親密度エピソードがキャラ愛着や課金意向に効いているかを見る。", data.satisfaction.bedroom, "bedroom", segmentData)}
        ${renderSatisfactionPanel(questionMeta.uiSatisfaction, "毎日の操作負荷が継続阻害になっていないかを見る。", data.satisfaction.ui, "ui", segmentData)}
        ${renderSatisfactionPanel(questionMeta.opsSatisfaction, "告知・改善姿勢・配布納得感への信頼度を見る。", data.satisfaction.ops, "ops", segmentData)}
        ${renderFreeTextAnalysisPanel("q12", questionMeta.storyFreeText, data.topicGroups.q12, segmentData)}
        ${renderFreeTextAnalysisPanel("q13", questionMeta.newFeatureFreeText, data.topicGroups.q13, segmentData)}
        ${renderFreeTextAnalysisPanel("q14", questionMeta.existingFeatureFreeText, data.topicGroups.q14, segmentData)}
        ${renderFreeTextAnalysisPanel("q15", questionMeta.overallFreeText, data.topicGroups.q15, segmentData)}
      </section>
    `;
  }

  function renderHeader(profile) {
    const axisOptions = Object.entries(axes).map(([value, axis]) => [value, axis.label]);
    const classificationFilter = selectedClassificationFilter();
    return `
      <section class="page-head">
        <div class="title-block">
          <p class="kicker">Questionnaire Analysis</p>
          <div class="title-line">
            <h1>アンケート分析</h1>
            ${infoTip("既存アンケートの設問をもとに、ソシャゲ運営判断に使う分析ビューとして構成したプレゼン用モックです。")}
          </div>
        </div>
        <div class="head-side">
          <div class="period-control condition-bar" aria-label="分析条件">
            <div class="period-picker qa-static-period-picker">
              <div class="period-chip period-range-chip qa-source-chip">
                <strong>基準日:</strong>
                <span>2026/04/18</span>
              </div>
            </div>
            <span class="period-chip qa-response-chip">回答数 ${formatNumber(profile.respondents)}人</span>
            ${classificationFilter ? `
              <button class="qa-classification-filter-chip" type="button" data-classification-filter-clear aria-label="分類軸比較を解除">
                <span>分類軸</span>
                <strong>${escapeHtml(classificationFilter.label)}</strong>
                <em>解除</em>
              </button>
            ` : ""}
            ${renderAnswerFilterChips(profile.answerFilters)}
            ${renderQuestionnaireClassificationControl(axisOptions)}
          </div>
        </div>
      </section>
    `;
  }

  function renderAnswerFilterChips(filters = []) {
    if (!filters.length) return "";
    return `
      ${filters.map((filter) => `
        <button class="qa-answer-filter-chip" type="button" data-answer-filter-remove="${escapeAttr(filter.id)}" aria-label="${escapeAttr(`${filter.label} の絞り込みを解除`)}">
          <span>絞り込み</span>
          <strong>${escapeHtml(filter.label)}</strong>
          <em>解除</em>
        </button>
      `).join("")}
      ${filters.length > 1 ? `
        <button class="qa-answer-filter-chip qa-answer-filter-clear-chip" type="button" data-answer-filter-clear aria-label="円グラフ絞り込みをすべて解除">
          <span>絞り込み</span>
          <strong>すべて</strong>
          <em>解除</em>
        </button>
      ` : ""}
    `;
  }

  function selectedClassificationFilter() {
    if (state.axis === "all") return null;
    const axis = axes[state.axis];
    if (!axis) return null;
    return {
      label: axis.label,
    };
  }

  function isAnswerFilterActive(filterId) {
    return state.answerFilters.includes(filterId);
  }

  function toggleAnswerFilter(filterIds, filterId) {
    if (filterIds.includes(filterId)) {
      return filterIds.filter((currentFilterId) => currentFilterId !== filterId);
    }
    return getAnswerFilter(filterId) ? [...filterIds, filterId] : filterIds;
  }

  function renderQuestionnaireClassificationControl(axisOptions) {
    return `
      <div class="condition-object control-group classification-control">
        <div class="control-label">分類軸</div>
        <div class="segment" role="group" aria-label="分類軸">
          ${axisOptions.map(([value, label]) => `
            <button class="segment-button${state.axis === value ? " is-active" : ""}" type="button" data-qa-control="axis" data-value="${value}" aria-pressed="${state.axis === value}">${label}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function defaultQuestionnaireSegment(axis) {
    const segments = axes[axis]?.segments || axes.all.segments;
    return segments[0]?.[0] || "all";
  }

  function renderAgePanel(question, items, otherGroup = null, segmentData = []) {
    return `
      <article class="panel qa-panel qa-panel-side">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${questionTitle(question)}</h2>
          </div>
        </div>
        ${segmentData.length ? renderSegmentPieGrid(segmentData, (segment) => renderAgePie(segment.data.ageDistribution)) : `
          <div class="qa-age-chart">
            ${renderAgePie(items)}
          </div>
        `}
        ${otherGroup ? renderOtherFreeTextBlock(otherGroup) : ""}
      </article>
    `;
  }

  function renderAgePie(items) {
    const size = 240;
    const center = size / 2;
    const radius = 108;
    const labelRadius = 68;
    let start = -90;
    const slices = items.filter((item) => item.value > 0).map((item) => {
      const end = start + (item.value * 3.6);
      const mid = start + ((end - start) / 2);
      const path = describePieSlice(center, center, radius, start, end);
      const labelPoint = polarPoint(center, center, item.value < 8 ? labelRadius + 12 : labelRadius, mid);
      const filterId = `age:${item.key}`;
      start = end;
      return `
        <g class="qa-age-slice${isAnswerFilterActive(filterId) ? " is-active" : ""}" data-answer-filter="${filterId}">
          <path d="${path}" fill="${item.color}">
            <title>${escapeHtml(`${item.label}: ${formatPercent(item.value)} / クリックで絞り込み`)}</title>
          </path>
          <text class="qa-age-slice-text${item.value < 8 ? " is-small" : ""}" x="${labelPoint.x.toFixed(1)}" y="${labelPoint.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">
            <tspan x="${labelPoint.x.toFixed(1)}" dy="-0.55em">${escapeHtml(item.label)}</tspan>
            <tspan x="${labelPoint.x.toFixed(1)}" dy="1.25em">${formatPercent(item.value)}</tspan>
          </text>
        </g>
      `;
    }).join("");

    return `
      <svg class="qa-age-pie" viewBox="0 0 ${size} ${size}" role="img" aria-label="年齢分布">
        ${slices}
      </svg>
    `;
  }

  function renderBarPanel(question, subtitle, items, className, otherGroup = null, segmentData = [], dataKey = "") {
    return `
      <article class="panel qa-panel ${className}">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${questionTitle(question)}</h2>
          </div>
        </div>
        ${segmentData.length && dataKey ? renderSegmentBars(items, segmentData, dataKey) : renderBars(items)}
        ${otherGroup ? renderOtherFreeTextBlock(otherGroup) : ""}
      </article>
    `;
  }

  function renderSegmentBars(items, segmentData, dataKey) {
    const columns = segmentData.length;
    return `
      <div class="qa-segment-bars" style="--segment-count:${columns}">
        <div class="qa-segment-bars-head">
          <span>回答選択肢</span>
          ${segmentData.map((segment) => `
            <span>
              ${escapeHtml(segment.label)}
              <em>${formatNumber(segment.respondents.length)}人</em>
            </span>
          `).join("")}
        </div>
        ${items.map((item) => `
          <div class="qa-segment-bar-row">
            <div class="qa-bar-label">${escapeHtml(item.label)}</div>
            ${segmentData.map((segment) => {
              const segmentItem = segment.data[dataKey].find((candidate) => candidate.key === item.key);
              const value = segmentItem?.value || 0;
              return `
                <div class="qa-bar-track qa-segment-bar-track" title="${escapeAttr(`${segment.label} / ${item.label}: ${formatPercent(value)}`)}">
                  <div class="qa-bar-fill" style="width:${value}%;--bar-color:${colors.blue}"></div>
                  <span class="qa-bar-inset-value">${formatPercent(value)}</span>
                </div>
              `;
            }).join("")}
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderOtherFreeTextBlock(group) {
    const isOpen = Boolean(state.otherOpen[group.key]);
    return `
      <section class="qa-other-inline${isOpen ? " is-open" : ""}" aria-label="${escapeAttr(group.title)}">
        <button class="qa-other-toggle" type="button" data-other-toggle="${group.key}" aria-expanded="${isOpen}">
          <span>その他自由記述</span>
          <strong>${group.title.replace(/^その他自由記述/, "")}</strong>
          <em>${isOpen ? "閉じる" : "確認"}</em>
        </button>
        ${isOpen ? `
          <div class="qa-other-body">
            <div class="qa-other-list">
              ${group.responses.map((rawResponse, index) => {
                const item = otherFreeTextResponse(group.key, rawResponse, index);
                const attrs = formatRespondentAttrs(item.attrs);
                return `
                <div class="qa-other-row" title="${escapeAttr(attrs)}" data-respondent-attrs="${escapeAttr(attrs)}">
                  <span class="qa-other-text">${escapeHtml(item.text)}</span>
                </div>
              `;
              }).join("")}
            </div>
          </div>
        ` : ""}
      </section>
    `;
  }

  function otherFreeTextResponse(groupKey, rawResponse, index) {
    if (typeof rawResponse === "object" && rawResponse !== null) {
      return rawResponse;
    }
    const attrs = otherFreeTextAttrs[groupKey]?.[index] || ["非公開", "非公開", "非公開"];
    return {
      text: rawResponse,
      attrs: {
        age: attrs[0],
        spend: attrs[1],
        tenure: attrs[2],
      },
    };
  }

  function renderPvPanel(pv, segmentData = []) {
    return `
      <article class="panel qa-panel qa-panel-third">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${questionTitle(questionMeta.pv)}</h2>
          </div>
        </div>
        ${segmentData.length ? renderSegmentPieGrid(segmentData, (segment) => renderPvPie(segment.data.pv)) : `
          <div class="qa-rating-chart">
            ${renderPvPie(pv)}
          </div>
        `}
      </article>
    `;
  }

  function renderPvPie(pv) {
    const size = 240;
    const center = size / 2;
    const radius = 108;
    const labelRadius = 67;
    let start = -90;
    const items = [
      ["yes", "はい", pv.yes, colors.blue],
      ["no", "いいえ", pv.no, "rgba(22, 32, 51, 0.18)"],
    ];

    const slices = items.filter(([, , value]) => value > 0).map(([key, label, value, color]) => {
      const end = start + (value * 3.6);
      const mid = start + ((end - start) / 2);
      const path = describePieSlice(center, center, radius, start, end);
      const labelPoint = polarPoint(center, center, value < 8 ? labelRadius + 12 : labelRadius, mid);
      const filterId = `pv:${key}`;
      start = end;
      return `
        <g class="qa-rating-slice${isAnswerFilterActive(filterId) ? " is-active" : ""}" data-pv="${key}" data-answer-filter="${filterId}">
          <path d="${path}" fill="${color}">
            <title>${escapeHtml(`${label}: ${formatPercent(value)} / クリックで絞り込み`)}</title>
          </path>
          <text class="qa-rating-slice-text${value < 8 ? " is-small" : ""}" x="${labelPoint.x.toFixed(1)}" y="${labelPoint.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">
            <tspan x="${labelPoint.x.toFixed(1)}" dy="-0.55em">${escapeHtml(label)}</tspan>
            <tspan x="${labelPoint.x.toFixed(1)}" dy="1.25em">${formatPercent(value)}</tspan>
          </text>
        </g>
      `;
    }).join("");

    return `
      <svg class="qa-rating-pie qa-pv-pie" viewBox="0 0 ${size} ${size}" role="img" aria-label="生放送視聴状況">
        ${slices}
      </svg>
    `;
  }

  function renderSatisfactionPanel(question, subtitle, satisfaction, questionKey, segmentData = []) {
    return `
      <article class="panel qa-panel qa-panel-third">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${questionTitle(question)}</h2>
          </div>
        </div>
        ${segmentData.length ? renderSegmentPieGrid(segmentData, (segment) => renderRatingPie(segment.data.satisfaction[questionKey], questionKey)) : `
          <div class="qa-rating-chart">
            ${renderRatingPie(satisfaction, questionKey)}
          </div>
        `}
      </article>
    `;
  }

  function renderSegmentPieGrid(segmentData, renderPie) {
    return `
      <div class="qa-segment-pie-grid">
        ${segmentData.map((segment) => `
          <section class="qa-segment-pie-card" aria-label="${escapeAttr(segment.label)}">
            <div class="qa-segment-pie-head">
              <span>${escapeHtml(segment.label)}</span>
              <strong>${formatNumber(segment.respondents.length)}人</strong>
            </div>
            <div class="qa-segment-pie-body">
              ${renderPie(segment)}
            </div>
          </section>
        `).join("")}
      </div>
    `;
  }

  function renderRatingPie(satisfaction, questionKey) {
    const size = 240;
    const center = size / 2;
    const radius = 108;
    const labelRadius = 67;
    let start = -90;

    const slices = satisfaction.levels.filter(([, , value]) => value > 0).map(([key, label, value]) => {
      const end = start + (value * 3.6);
      const mid = start + ((end - start) / 2);
      const path = describePieSlice(center, center, radius, start, end);
      const labelPoint = polarPoint(center, center, value < 8 ? labelRadius + 12 : labelRadius, mid);
      const filterId = `rating:${questionKey}:${key}`;
      start = end;
      return `
        <g class="qa-rating-slice${isAnswerFilterActive(filterId) ? " is-active" : ""}" data-rating="${key}" data-answer-filter="${filterId}">
          <path d="${path}" fill="${ratingColors[key]}">
            <title>${escapeHtml(`${label}: ${formatPercent(value)} / クリックで絞り込み`)}</title>
          </path>
          <text class="qa-rating-slice-text${value < 8 ? " is-small" : ""}" x="${labelPoint.x.toFixed(1)}" y="${labelPoint.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">
            <tspan x="${labelPoint.x.toFixed(1)}" dy="-0.55em">${escapeHtml(label)}</tspan>
            <tspan x="${labelPoint.x.toFixed(1)}" dy="1.25em">${formatPercent(value)}</tspan>
          </text>
        </g>
      `;
    }).join("");

    return `
      <svg class="qa-rating-pie" viewBox="0 0 ${size} ${size}" role="img" aria-label="満足度分布">
        ${slices}
        <circle class="qa-rating-center" cx="${center}" cy="${center}" r="34"></circle>
        <text class="qa-rating-center-text" x="${center}" y="${center}" text-anchor="middle" dominant-baseline="middle">
          <tspan x="${center}" dy="-0.65em">平均</tspan>
          <tspan x="${center}" dy="1.25em">${satisfaction.score.toFixed(1)} / 5</tspan>
        </text>
      </svg>
    `;
  }

  function describePieSlice(cx, cy, radius, startAngle, endAngle) {
    if (endAngle - startAngle >= 359.999) {
      return [
        `M ${cx} ${(cy - radius).toFixed(3)}`,
        `A ${radius} ${radius} 0 1 1 ${cx} ${(cy + radius).toFixed(3)}`,
        `A ${radius} ${radius} 0 1 1 ${cx} ${(cy - radius).toFixed(3)}`,
        "Z",
      ].join(" ");
    }
    const start = polarPoint(cx, cy, radius, startAngle);
    const end = polarPoint(cx, cy, radius, endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
      "Z",
    ].join(" ");
  }

  function polarPoint(cx, cy, radius, angle) {
    const rad = angle * Math.PI / 180;
    return {
      x: cx + (Math.cos(rad) * radius),
      y: cy + (Math.sin(rad) * radius),
    };
  }

  function renderFreeTextAnalysisPanel(questionKey, question, categories, segmentData = []) {
    const activeSegmentKey = state.freeTextSegmentSelection[questionKey] || segmentData[0]?.key || "";
    const activeSegment = segmentData.find((segment) => segment.key === activeSegmentKey) || segmentData[0];
    const displayCategories = activeSegment ? activeSegment.data.topicGroups[questionKey] : categories;
    const selectedKey = state.freeTextSelection[questionKey] || "overall";
    const isOverall = selectedKey === "overall";
    const selected = isOverall ? null : displayCategories.find((category) => category.key === selectedKey) || displayCategories[0];
    const baseComments = isOverall ? overallFreeTextComments(displayCategories) : freeTextComments(selected);
    const comments = activeSegment
      ? segmentScopedFreeTextComments(questionKey, baseComments, activeSegment, isOverall ? "" : selected.key)
      : baseComments;
    const summary = isOverall ? freeTextOverallSummaries[questionKey] : selected.summary;
    return `
      <article class="panel qa-panel qa-panel-half qa-free-text-panel">
        <div class="panel-header qa-panel-title-row">
          <div>
            <h2 class="panel-title">${questionTitle(question)}</h2>
          </div>
          ${segmentData.length ? `
            <div class="qa-free-text-segment-tabs" role="tablist" aria-label="${escapeAttr(question.title)} セグメント">
              ${segmentData.map((segment) => `
                <button class="qa-free-text-segment-tab${activeSegment?.key === segment.key ? " is-active" : ""}" type="button" data-question-key="${questionKey}" data-free-text-segment="${segment.key}" aria-selected="${activeSegment?.key === segment.key}">
                  ${escapeHtml(segment.label)}
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>
        <div class="qa-free-text-layout">
          <aside class="qa-free-text-sidebar">
            <button class="qa-ai-category qa-ai-overall-category${isOverall ? " is-active" : ""}" type="button" data-free-text-summary="${questionKey}" aria-pressed="${isOverall}">
              <span>全体要約</span>
              <strong>全件</strong>
            </button>
            <div class="qa-free-text-sidebar-title">分類</div>
            <div class="qa-ai-category-list" aria-label="${escapeAttr(question.title)} 分類">
              ${displayCategories.map((category) => `
                <button class="qa-ai-category${!isOverall && category.key === selected.key ? " is-active" : ""}" type="button" data-question-key="${questionKey}" data-free-text-category="${category.key}" aria-pressed="${!isOverall && category.key === selected.key}">
                  <span>${category.label}</span>
                  <strong>${formatPercent(category.value)}</strong>
                </button>
              `).join("")}
            </div>
          </aside>
          <section class="qa-free-text-detail">
            <section class="qa-ai-summary" aria-label="AI要約">
              <span>${isOverall ? "全体AI要約" : "AI要約"}</span>
              <p>${escapeHtml(summary)}</p>
            </section>
            <div class="qa-free-response-head">
              <span>個別コメント</span>
              <strong>${comments.length}件</strong>
            </div>
            <div class="qa-free-response-list" aria-label="自由記述原文">
              ${comments.map((comment, index) => `
                <blockquote class="qa-free-response" title="${escapeAttr(formatRespondentAttrs(comment.attrs))}" data-respondent-attrs="${escapeAttr(formatRespondentAttrs(comment.attrs))}">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <p>${escapeHtml(comment.text)}</p>
                </blockquote>
              `).join("")}
            </div>
          </section>
        </div>
      </article>
    `;
  }

  function overallFreeTextComments(categories) {
    const commentsByCategory = categories.map((category) => allFreeTextComments(category));
    const maxLength = Math.max(...commentsByCategory.map((comments) => comments.length), 0);
    const comments = [];
    for (let index = 0; index < maxLength; index += 1) {
      commentsByCategory.forEach((categoryComments) => {
        if (categoryComments[index]) {
          comments.push(categoryComments[index]);
        }
      });
    }
    return comments;
  }

  function freeTextComments(category) {
    return allFreeTextComments(category).slice(0, 10);
  }

  function allFreeTextComments(category) {
    return [
      ...(category.comments || []),
      ...(freeTextExtraComments[category.key] || []),
    ];
  }

  function segmentScopedFreeTextComments(questionKey, comments, segment, categoryKey = "") {
    const segmentRespondents = segment.respondents.filter((respondent) => (
      categoryKey
        ? respondent.freeTextTopics[questionKey] === categoryKey
        : Boolean(respondent.freeTextTopics[questionKey])
    ));
    if (!segmentRespondents.length) return comments;
    return comments.map((comment, index) => ({
      ...comment,
      attrs: respondentAttrs(segmentRespondents[index % segmentRespondents.length]),
    }));
  }

  function respondentAttrs(respondent) {
    return {
      age: ageDistributionItems.find((item) => item.key === respondent.ageKey)?.label || "非公開",
      spend: axisSegmentLabel("spend", respondent.spendKey),
      core: axisSegmentLabel("core", respondent.coreKey),
      tenure: axisSegmentLabel("tenure", respondent.tenureKey),
    };
  }

  function axisSegmentLabel(axis, key) {
    return axes[axis]?.segments.find(([segmentKey]) => segmentKey === key)?.[1] || "非公開";
  }

  function renderTopicPanel(question, subtitle, items) {
    return `
      <article class="panel qa-panel qa-panel-third">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${questionTitle(question)}</h2>
          </div>
        </div>
        <div class="qa-topic-list">
          ${items.slice(0, 5).map((item) => `
            <section class="qa-topic-item">
              <div>
                <div class="qa-topic-title">${item.label}</div>
                <p class="qa-topic-meta">${item.meta}</p>
              </div>
              <span class="qa-topic-score">${formatPercent(item.value)}</span>
            </section>
          `).join("")}
        </div>
      </article>
    `;
  }

  function questionTitle(question) {
    return `
      <span class="qa-question-number" title="${escapeAttr(question.original)}">${question.number}</span>
      <span>${question.title}</span>
    `;
  }

  function getAnswerFilter(filterId) {
    if (!filterId) return null;
    const [kind, value, ratingValue] = filterId.split(":");
    if (kind === "age") {
      const item = ageDistributionItems.find((ageItem) => ageItem.key === value);
      if (!item) return null;
      return {
        id: filterId,
        kind,
        value,
        label: `年齢: ${item.label}`,
        share: item.value / 100,
        ...answerFilterEffect("age", value),
      };
    }
    if (kind === "pv") {
      const valueLabel = value === "yes" ? "はい" : "いいえ";
      const share = (pvBase[value] || 0) / 100;
      return {
        id: filterId,
        kind,
        value,
        label: `生放送視聴: ${valueLabel}`,
        share,
        pv: {
          yes: value === "yes" ? 100 : 0,
          no: value === "no" ? 100 : 0,
        },
        ...answerFilterEffect("pv", value),
      };
    }
    if (kind === "rating") {
      const question = satisfactionItems[value];
      const level = question?.levels.find(([key]) => key === ratingValue);
      if (!question || !level) return null;
      return {
        id: filterId,
        kind,
        question: value,
        value: ratingValue,
        label: `${satisfactionFilterLabel(value)}: ${level[1]}`,
        share: level[2] / 100,
        ...answerFilterEffect("rating", ratingValue, value),
      };
    }
    return null;
  }

  function applyAnswerFilter(baseProfile, filter) {
    const share = clamp(filter.share || 0.2, 0.02, 1);
    return {
      ...baseProfile,
      respondents: Math.max(12, Math.round(baseProfile.respondents * share)),
      responseRate: clamp(baseProfile.responseRate + (filter.responseRateDelta || 0), 1, 99),
      storyHeat: clamp(baseProfile.storyHeat + (filter.storyHeatDelta || 0), 0, 100),
      cafeRate: clamp(baseProfile.cafeRate + (filter.cafeRateDelta || 0), 0, 100),
      freeTextRate: clamp(baseProfile.freeTextRate + (filter.freeTextRateDelta || 0), 0, 100),
      boosts: mergeBoosts(baseProfile.boosts || {}, filter.boosts || {}),
      pv: filter.pv || baseProfile.pv,
      answerFilter: filter,
    };
  }

  function answerFilterEffect(kind, value, question = "") {
    const effects = {
      age: {
        age20a: { storyHeatDelta: -8, freeTextRateDelta: -5, boosts: { inGame: { finalBattle: -5, wakaba: 5 }, purpose: { character: 5, story: -5, community: 4 }, topics: { growth: 4, ui: 3 }, satisfaction: { ui: -0.2, ops: -0.1 } } },
        age20b: { storyHeatDelta: -3, freeTextRateDelta: -2, boosts: { inGame: { annivEvent: 4, eventScenario: 3 }, purpose: { character: 4, bedroom: 3 }, topics: { storyRequest: 2 }, satisfaction: { scenario: 0.1 } } },
        age30a: { storyHeatDelta: 2, freeTextRateDelta: 2, boosts: { inGame: { story22: 4, finalBattle: 3 }, purpose: { story: 4, battle: 2 }, topics: { storyRequest: 3 }, satisfaction: { scenario: 0.2 } } },
        age30b: { storyHeatDelta: 4, freeTextRateDelta: 4, boosts: { inGame: { story22: 5, memoryBattle: 3 }, purpose: { story: 5, growth: 3 }, topics: { skip: 4, growth: 3 }, satisfaction: { ops: 0.1 } } },
        age40a: { storyHeatDelta: 3, freeTextRateDelta: 2, boosts: { inGame: { eventScenario: 3, memoryBattle: 3 }, purpose: { collection: 3, story: 3 }, topics: { storyRequest: 3, communication: 2 }, satisfaction: { scenario: 0.1 } } },
        age40b: { storyHeatDelta: 4, freeTextRateDelta: 3, boosts: { inGame: { memoryBattle: 4, finalBattle: 3 }, purpose: { battle: 3, collection: 3 }, topics: { communication: 3, gacha: 2 }, satisfaction: { ops: 0.1 } } },
        other: { storyHeatDelta: -5, freeTextRateDelta: -1, boosts: { inGame: { wakaba: 3 }, purpose: { growth: 3 }, topics: { ui: 3 }, satisfaction: { ui: -0.2 } } },
      },
      pv: {
        yes: { storyHeatDelta: 5, freeTextRateDelta: 4, responseRateDelta: 2, boosts: { inGame: { story22: 4, annivEvent: 5, eventScenario: 4 }, purpose: { story: 4, character: 3 }, topics: { storyRequest: 3, communication: 2 }, satisfaction: { scenario: 0.2, ops: 0.2 } } },
        no: { storyHeatDelta: -6, freeTextRateDelta: -5, responseRateDelta: -3, boosts: { inGame: { story22: -5, annivEvent: -4, wakaba: 4 }, purpose: { growth: 3, story: -4 }, topics: { skip: 4, ui: 3 }, satisfaction: { ops: -0.2, ui: -0.1 } } },
      },
      rating: {
        verySatisfied: { storyHeatDelta: 7, freeTextRateDelta: 3, boosts: ratingBoost(question, 0.4, 5) },
        satisfied: { storyHeatDelta: 3, freeTextRateDelta: 1, boosts: ratingBoost(question, 0.2, 2) },
        neutral: { storyHeatDelta: -1, freeTextRateDelta: 0, boosts: ratingBoost(question, 0, 0) },
        unsatisfied: { storyHeatDelta: -5, freeTextRateDelta: 5, boosts: ratingBoost(question, -0.3, 5) },
        veryUnsatisfied: { storyHeatDelta: -9, freeTextRateDelta: 8, boosts: ratingBoost(question, -0.5, 8) },
      },
    };
    return effects[kind]?.[value] || {};
  }

  function ratingBoost(question, scoreDelta, topicDelta) {
    const topicByQuestion = {
      battle: "growth",
      scenario: "storyRequest",
      bedroom: "homeFeature",
      ui: "ui",
      ops: "communication",
    };
    const inGameByQuestion = {
      battle: "finalBattle",
      scenario: "story22",
      bedroom: "eventScenario",
      ui: "wakaba",
      ops: "annivEvent",
    };
    return {
      satisfaction: { [question]: scoreDelta },
      topics: { [topicByQuestion[question] || "communication"]: topicDelta },
      inGame: { [inGameByQuestion[question] || "annivEvent"]: scoreDelta >= 0 ? Math.ceil(topicDelta / 2) : -Math.ceil(topicDelta / 2) },
    };
  }

  function satisfactionFilterLabel(question) {
    return {
      battle: "バトル満足度",
      scenario: "シナリオ満足度",
      bedroom: "親密度エピソード満足度",
      ui: "UI満足度",
      ops: "運営満足度",
    }[question] || "満足度";
  }

  function mergeBoosts(baseBoosts, extraBoosts) {
    const merged = {};
    [baseBoosts, extraBoosts].forEach((boosts) => {
      Object.entries(boosts || {}).forEach(([group, values]) => {
        if (!values || typeof values !== "object") return;
        merged[group] = { ...(merged[group] || {}) };
        Object.entries(values).forEach(([key, value]) => {
          merged[group][key] = (merged[group][key] || 0) + value;
        });
      });
    });
    return merged;
  }

  function buildData(profile) {
    const filter = profile.answerFilter || null;
    return {
      ageDistribution: buildAgeDistribution(filter),
      inGame: orderedItems(inGameItems, profile.boosts.inGame),
      playPurpose: orderedItems(playPurposeItems, profile.boosts.purpose),
      story: rankedStory(profile.boosts.story),
      satisfaction: buildSatisfaction(profile.boosts.satisfaction, filter),
      topics: rankedTopics(profile.boosts.topics),
      topicGroups: rankedTopicGroups(profile.boosts.topics),
      pv: buildPvDistribution(profile.pv || pvBase, filter),
    };
  }

  function buildAgeDistribution(filter) {
    if (filter?.kind !== "age") return ageDistributionItems;
    return ageDistributionItems.map((item) => ({
      ...item,
      value: item.key === filter.value ? 100 : 0,
    }));
  }

  function buildPvDistribution(pv, filter) {
    if (filter?.kind !== "pv") return pv;
    return {
      yes: filter.value === "yes" ? 100 : 0,
      no: filter.value === "no" ? 100 : 0,
    };
  }

  function orderedItems(items, boosts = {}) {
    return items
      .map(([key, label, value, color]) => ({
        key,
        label,
        value: clamp(value + (boosts?.[key] || 0), 3, 96),
        color,
      }));
  }

  function buildSatisfaction(boosts = {}, filter = null) {
    const ratingScores = {
      verySatisfied: 5,
      satisfied: 4,
      neutral: 3,
      unsatisfied: 2,
      veryUnsatisfied: 1,
    };
    return Object.fromEntries(Object.entries(satisfactionItems).map(([key, item]) => {
      if (filter?.kind === "rating" && filter.question === key) {
        return [key, {
          ...item,
          score: ratingScores[filter.value],
          levels: item.levels.map(([levelKey, label]) => [levelKey, label, levelKey === filter.value ? 100 : 0]),
        }];
      }
      const scoreBoost = boosts?.[key] || 0;
      const score = clamp(item.score + scoreBoost, 1, 5);
      return [key, {
        ...item,
        score,
      }];
    }));
  }

  function rankedStory(boosts = {}) {
    return storyItems
      .map(([key, label, value]) => ({
        key,
        label,
        value: clamp(value + (boosts?.[key] || 0), 1, 42),
        color: colors.blue,
      }));
  }

  function rankedTopics(boosts = {}) {
    return topicItems
      .map((item) => rankedTopicItem(item, boosts))
      .sort((a, b) => b.value - a.value);
  }

  function rankedTopicGroups(boosts = {}) {
    return Object.fromEntries(Object.entries(freeTextTopicGroups).map(([key, items]) => [
      key,
      rankedTopicItems(items, boosts),
    ]));
  }

  function rankedTopicItems(items, boosts = {}) {
    return items
      .map((item) => rankedTopicItem(item, boosts))
      .sort((a, b) => b.value - a.value);
  }

  function rankedTopicItem(item, boosts = {}) {
    const topic = Array.isArray(item)
      ? { key: item[0], label: item[1], summary: item[2], value: item[3], comments: [] }
      : item;
    return {
      ...topic,
      value: clamp(topic.value + (boosts?.[topic.key] || 0), 2, 58),
    };
  }

  function buildMockRespondents(total) {
    return Array.from({ length: total }, (_, index) => buildMockRespondent(index));
  }

  function buildMockRespondent(index) {
    const ageKey = weightedPick(ageDistributionItems.map((item) => [item.key, item.value]), index, 11);
    const spendKey = weightedPick(spendWeights(ageKey), index, 17);
    const tenureKey = weightedPick(tenureWeights(ageKey, spendKey), index, 23);
    const coreKey = weightedPick(coreWeights(spendKey, tenureKey), index, 31);
    const respondent = {
      id: index + 1,
      ageKey,
      spendKey,
      tenureKey,
      coreKey,
    };
    respondent.pv = unit(index, 37) < pvProbability(respondent) ? "yes" : "no";
    respondent.inGame = selectMulti(inGameItems, respondent, "inGame", index, 41);
    respondent.playPurpose = selectMulti(playPurposeItems, respondent, "playPurpose", index, 47);
    respondent.story = selectMulti(storyItems.map(([key, label, value]) => [key, label, value, colors.blue]), respondent, "story", index, 53);
    respondent.ratings = buildRespondentRatings(respondent, index);
    respondent.freeTextTopics = buildRespondentFreeTextTopics(respondent, index);
    return respondent;
  }

  function spendWeights(ageKey) {
    const weights = {
      free: 32,
      light: 28,
      middle: 24,
      heavy: 16,
    };
    if (ageKey === "age20a") {
      weights.free += 12;
      weights.heavy -= 7;
    }
    if (ageKey === "age30b" || ageKey === "age40a" || ageKey === "age40b") {
      weights.middle += 4;
      weights.heavy += 4;
      weights.free -= 5;
    }
    return objectWeights(weights);
  }

  function tenureWeights(ageKey, spendKey) {
    const weights = {
      new: 9,
      returning: 14,
      oneYear: 36,
      veteran: 41,
    };
    if (ageKey === "age20a") {
      weights.new += 14;
      weights.veteran -= 10;
    }
    if (spendKey === "heavy") {
      weights.veteran += 14;
      weights.new -= 5;
    }
    if (spendKey === "free") {
      weights.returning += 5;
      weights.veteran -= 4;
    }
    return objectWeights(weights);
  }

  function coreWeights(spendKey, tenureKey) {
    const weights = {
      coreLogin: 15,
      coreLite: 28,
      coreMiddle: 33,
      coreCore: 24,
    };
    if (spendKey === "free") {
      weights.coreLogin += 12;
      weights.coreCore -= 9;
    }
    if (spendKey === "heavy") {
      weights.coreCore += 18;
      weights.coreLogin -= 8;
    }
    if (tenureKey === "new") {
      weights.coreLogin += 9;
      weights.coreCore -= 8;
    }
    if (tenureKey === "veteran") {
      weights.coreCore += 12;
      weights.coreLite -= 6;
    }
    return objectWeights(weights);
  }

  function pvProbability(respondent) {
    let probability = 0.715;
    if (respondent.coreKey === "coreCore") probability += 0.1;
    if (respondent.coreKey === "coreLogin") probability -= 0.18;
    if (respondent.spendKey === "heavy") probability += 0.07;
    if (respondent.tenureKey === "new") probability -= 0.08;
    if (respondent.ageKey === "age20a") probability -= 0.04;
    if (respondent.ageKey === "age40a" || respondent.ageKey === "age40b") probability += 0.04;
    return clamp(probability, 0.18, 0.96);
  }

  function selectMulti(items, respondent, type, seed, saltBase) {
    const selected = [];
    const scored = items.map(([key, label, base, color], index) => {
      const probability = clamp(selectionProbability(key, base, respondent, type), 2, 92);
      if (unit(seed, saltBase + index) < probability / 100) selected.push(key);
      return { key, label, value: probability, color };
    });
    if (!selected.length) {
      selected.push(weightedPick(scored.map((item) => [item.key, item.value]), seed, saltBase + 71));
    }
    return selected;
  }

  function selectionProbability(key, base, respondent, type) {
    let value = base;
    if (type === "inGame") {
      if (respondent.coreKey === "coreCore") value += { finalBattle: 16, memoryBattle: 14, story22: 7, oldFestival: 8 }[key] || 0;
      if (respondent.coreKey === "coreLogin") value += { finalBattle: -18, memoryBattle: -10, story22: -8, wakaba: 12, annivEvent: 5 }[key] || 0;
      if (respondent.pv === "yes") value += { annivEvent: 7, eventScenario: 5, story22: 4 }[key] || 0;
      if (respondent.spendKey === "heavy") value += { finalBattle: 9, memoryBattle: 7, story22: 5 }[key] || 0;
      if (respondent.tenureKey === "new") value += { wakaba: 14, finalBattle: -12, memoryBattle: -8 }[key] || 0;
      if (respondent.ageKey === "age20a") value += { annivEvent: 5, wakaba: 6, finalBattle: -5 }[key] || 0;
    }
    if (type === "playPurpose") {
      if (respondent.coreKey === "coreCore") value += { battle: 14, story: 8, collection: 7, community: 5 }[key] || 0;
      if (respondent.coreKey === "coreLogin") value += { growth: 7, character: -5, battle: -12, story: -7 }[key] || 0;
      if (respondent.spendKey === "heavy") value += { character: 8, bedroom: 7, collection: 6 }[key] || 0;
      if (respondent.spendKey === "free") value += { story: 4, growth: 5, bedroom: -6 }[key] || 0;
      if (respondent.pv === "yes") value += { story: 6, character: 4 }[key] || 0;
      if (respondent.ageKey === "age20a") value += { character: 6, community: 4, story: -4 }[key] || 0;
    }
    if (type === "story") {
      if (respondent.coreKey === "coreCore" || respondent.tenureKey === "veteran") value += { chapter5: 4, chapter7: 5, chapter10: 7 }[key] || 0;
      if (respondent.tenureKey === "new") value += { chapter1: 5, chapter2: 5, chapter10: -7 }[key] || 0;
      if (respondent.pv === "yes") value += { chapter10: 5, chapter7: 3 }[key] || 0;
    }
    return value;
  }

  function buildRespondentRatings(respondent, seed) {
    return Object.fromEntries(Object.keys(satisfactionItems).map((question, index) => [
      question,
      ratingLevel(question, respondent, seed, 61 + index),
    ]));
  }

  function ratingLevel(question, respondent, seed, salt) {
    let score = satisfactionItems[question].score;
    if (respondent.coreKey === "coreCore") score += 0.25;
    if (respondent.coreKey === "coreLogin") score -= question === "ui" ? 0.35 : 0.2;
    if (respondent.spendKey === "heavy") score += question === "ops" ? -0.05 : 0.12;
    if (respondent.spendKey === "free" && question === "ops") score -= 0.18;
    if (respondent.tenureKey === "new") score -= question === "battle" || question === "ui" ? 0.25 : 0.08;
    if (respondent.pv === "yes" && (question === "scenario" || question === "ops")) score += 0.22;
    if (respondent.inGame.includes("finalBattle") && question === "battle") score += 0.22;
    if (respondent.playPurpose.includes("bedroom") && question === "bedroom") score += 0.28;
    const noise = (unit(seed, salt) - 0.5) * 1.7;
    const finalScore = clamp(score + noise, 1, 5);
    if (finalScore >= 4.45) return "verySatisfied";
    if (finalScore >= 3.55) return "satisfied";
    if (finalScore >= 2.65) return "neutral";
    if (finalScore >= 1.75) return "unsatisfied";
    return "veryUnsatisfied";
  }

  function buildRespondentFreeTextTopics(respondent, seed) {
    return Object.fromEntries(Object.entries(freeTextTopicGroups).map(([questionKey, categories], index) => {
      const writeProbability = clamp(0.43
        + (respondent.coreKey === "coreCore" ? 0.15 : 0)
        + (respondent.coreKey === "coreLogin" ? -0.12 : 0)
        + (respondent.spendKey === "heavy" ? 0.08 : 0)
        + (respondent.tenureKey === "new" ? -0.07 : 0), 0.18, 0.76);
      if (unit(seed, 81 + index) > writeProbability) return [questionKey, ""];
      return [questionKey, weightedPick(categories.map((category) => [
        category.key,
        adjustedTopicWeight(questionKey, category.key, category.value, respondent),
      ]), seed, 91 + index)];
    }));
  }

  function adjustedTopicWeight(questionKey, categoryKey, base, respondent) {
    let weight = base;
    if (questionKey === "q12") {
      if (respondent.pv === "yes" && categoryKey === "storyRequest") weight += 8;
      if (respondent.tenureKey === "returning" && categoryKey === "storyArchive") weight += 10;
      if (respondent.coreKey === "coreLogin" && categoryKey === "scenarioTempo") weight += 6;
    }
    if (questionKey === "q13") {
      if (respondent.coreKey === "coreCore" && categoryKey === "newMode") weight += 9;
      if (respondent.playPurpose.includes("community") && categoryKey === "socialFeature") weight += 8;
      if (respondent.playPurpose.includes("character") && categoryKey === "homeFeature") weight += 7;
    }
    if (questionKey === "q14") {
      if (respondent.coreKey === "coreLogin" && categoryKey === "skip") weight += 10;
      if (respondent.tenureKey === "new" && categoryKey === "growth") weight += 11;
      if (respondent.ratings.ui === "unsatisfied" || respondent.ratings.ui === "veryUnsatisfied") {
        if (categoryKey === "ui") weight += 12;
      }
    }
    if (questionKey === "q15") {
      if (respondent.spendKey === "heavy" && categoryKey === "gacha") weight += 9;
      if (respondent.ratings.battle === "unsatisfied" && categoryKey === "balance") weight += 8;
      if ((respondent.ratings.ops === "unsatisfied" || respondent.ratings.ops === "veryUnsatisfied") && categoryKey === "communication") weight += 12;
    }
    return Math.max(1, weight);
  }

  function currentRespondents(answerFilter) {
    return mockRespondents.filter((respondent) => !answerFilter || answerFilter.match(respondent));
  }

  function buildSegmentData(respondents) {
    const field = classificationField();
    if (!field) return [];
    return axes[state.axis].segments.map(([key, label]) => {
      const segmentRespondents = respondents.filter((respondent) => respondent[field] === key);
      return {
        key,
        label,
        respondents: segmentRespondents,
        data: buildData(segmentRespondents),
      };
    });
  }

  function classificationField() {
    return {
      spend: "spendKey",
      core: "coreKey",
      tenure: "tenureKey",
    }[state.axis] || "";
  }

  function buildProfile(respondents, answerFilter) {
    return {
      label: answerFilter?.label || "全体",
      respondents: respondents.length,
      answerFilter,
      answerFilters: answerFilter?.filters || [],
    };
  }

  function getAnswerFilterSet(filterIds) {
    const filters = [...new Set(filterIds)].map(getAnswerFilter).filter(Boolean);
    if (!filters.length) return null;
    const groups = filters.reduce((result, filter) => {
      const scopeFilters = result.get(filter.scope) || [];
      scopeFilters.push(filter);
      result.set(filter.scope, scopeFilters);
      return result;
    }, new Map());
    return {
      filters,
      label: filters.map((filter) => filter.label).join(" / "),
      match: (respondent) => [...groups.values()].every((scopeFilters) => (
        scopeFilters.some((filter) => filter.match(respondent))
      )),
    };
  }

  function getAnswerFilter(filterId) {
    if (!filterId) return null;
    const [kind, value, ratingValue] = filterId.split(":");
    if (kind === "age") {
      const item = ageDistributionItems.find((ageItem) => ageItem.key === value);
      if (!item) return null;
      return {
        id: filterId,
        kind,
        scope: "age",
        value,
        label: `年齢: ${item.label}`,
        match: (respondent) => respondent.ageKey === value,
      };
    }
    if (kind === "pv") {
      const valueLabel = value === "yes" ? "はい" : "いいえ";
      return {
        id: filterId,
        kind,
        scope: "pv",
        value,
        label: `生放送視聴: ${valueLabel}`,
        match: (respondent) => respondent.pv === value,
      };
    }
    if (kind === "rating") {
      const question = satisfactionItems[value];
      const level = question?.levels.find(([key]) => key === ratingValue);
      if (!question || !level) return null;
      return {
        id: filterId,
        kind,
        scope: `rating:${value}`,
        question: value,
        value: ratingValue,
        label: `${satisfactionFilterLabel(value)}: ${level[1]}`,
        match: (respondent) => respondent.ratings[value] === ratingValue,
      };
    }
    return null;
  }

  function buildData(respondents) {
    return {
      ageDistribution: aggregateAgeDistribution(respondents),
      inGame: aggregateMultiItems(inGameItems, respondents, "inGame"),
      playPurpose: aggregateMultiItems(playPurposeItems, respondents, "playPurpose"),
      story: aggregateMultiItems(storyItems.map(([key, label, value]) => [key, label, value, colors.blue]), respondents, "story"),
      satisfaction: aggregateSatisfaction(respondents),
      topics: rankedTopics({}),
      topicGroups: aggregateTopicGroups(respondents),
      pv: aggregatePv(respondents),
    };
  }

  function aggregateAgeDistribution(respondents) {
    const total = respondents.length || 1;
    return ageDistributionItems.map((item) => ({
      ...item,
      value: percentage(respondents.filter((respondent) => respondent.ageKey === item.key).length, total),
    }));
  }

  function aggregatePv(respondents) {
    const total = respondents.length || 1;
    return {
      yes: percentage(respondents.filter((respondent) => respondent.pv === "yes").length, total),
      no: percentage(respondents.filter((respondent) => respondent.pv === "no").length, total),
    };
  }

  function aggregateMultiItems(items, respondents, field) {
    const total = respondents.length || 1;
    return items.map(([key, label, , color]) => ({
      key,
      label,
      value: percentage(respondents.filter((respondent) => respondent[field]?.includes(key)).length, total),
      color,
    }));
  }

  function aggregateSatisfaction(respondents) {
    const total = respondents.length || 1;
    const scoreMap = {
      verySatisfied: 5,
      satisfied: 4,
      neutral: 3,
      unsatisfied: 2,
      veryUnsatisfied: 1,
    };
    return Object.fromEntries(Object.entries(satisfactionItems).map(([questionKey, item]) => {
      const score = respondents.length
        ? respondents.reduce((sum, respondent) => sum + scoreMap[respondent.ratings[questionKey]], 0) / respondents.length
        : item.score;
      const rawLevels = item.levels.map(([levelKey, label]) => [
        levelKey,
        label,
        percentage(respondents.filter((respondent) => respondent.ratings[questionKey] === levelKey).length, total),
      ]);
      return [questionKey, {
        ...item,
        score,
        levels: normalizeSatisfactionLevels(rawLevels),
      }];
    }));
  }

  function normalizeSatisfactionLevels(levels) {
    const minShare = 2;
    const positiveLevels = levels.filter(([, , value]) => value > 0);
    if (positiveLevels.length <= 1) return levels;

    const underflow = levels.reduce((sum, [, , value]) => (
      value < minShare ? sum + (minShare - value) : sum
    ), 0);
    if (underflow <= 0) return levels;

    const adjustableTotal = levels.reduce((sum, [, , value]) => (
      value > minShare ? sum + (value - minShare) : sum
    ), 0);
    if (adjustableTotal <= 0) return levels;

    return levels.map(([levelKey, label, value]) => {
      if (value < minShare) return [levelKey, label, minShare];
      const reduction = ((value - minShare) / adjustableTotal) * underflow;
      return [levelKey, label, Math.max(minShare, value - reduction)];
    });
  }

  function aggregateTopicGroups(respondents) {
    const total = respondents.length || 1;
    return Object.fromEntries(Object.entries(freeTextTopicGroups).map(([questionKey, categories]) => [
      questionKey,
      categories
        .map((category) => ({
          ...category,
          value: percentage(respondents.filter((respondent) => respondent.freeTextTopics[questionKey] === category.key).length, total),
        }))
        .sort((a, b) => b.value - a.value),
    ]));
  }

  function percentage(countValue, total) {
    return total ? (countValue / total) * 100 : 0;
  }

  function weightedPick(options, seed, salt) {
    const normalized = options.map(([key, weight]) => [key, Math.max(0.001, weight)]);
    const total = normalized.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = unit(seed, salt) * total;
    for (const [key, weight] of normalized) {
      roll -= weight;
      if (roll <= 0) return key;
    }
    return normalized[normalized.length - 1][0];
  }

  function objectWeights(weights) {
    return Object.entries(weights).map(([key, weight]) => [key, Math.max(1, weight)]);
  }

  function unit(seed, salt) {
    const value = Math.sin(((seed + 1) * 1009) + (salt * 9176.37)) * 10000;
    return value - Math.floor(value);
  }

  function renderSegmentControl(label, control, options) {
    return `
      <div class="condition-object control-group">
        <div class="control-label">${label}</div>
        <div class="segment" role="group" aria-label="${label}">
          ${options.map(([value, optionLabel]) => `
            <button class="segment-button${state[control] === value ? " is-active" : ""}" type="button" data-qa-control="${control}" data-value="${value}" aria-pressed="${state[control] === value}">${optionLabel}</button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderBars(items) {
    return `
      <div class="qa-bars">
        ${items.map((item) => `
          <div class="qa-bar-row">
            <div class="qa-bar-label">${item.label}</div>
            <div class="qa-bar-track" title="${item.label}: ${formatPercent(item.value)}">
              <div class="qa-bar-fill" style="width:${item.value}%;--bar-color:${item.color || colors.blue}"></div>
              <span class="qa-bar-inset-value">${formatPercent(item.value)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function miniCard(label, value, note) {
    return `
      <article class="panel qa-mini-card">
        <div class="qa-mini-label">${label}</div>
        <div class="qa-mini-value">${value}</div>
        <div class="qa-mini-note">${note}</div>
      </article>
    `;
  }

  function infoTip(text) {
    return `<span class="info-tip" tabindex="0" aria-label="${escapeAttr(text)}" title="${escapeAttr(text)}">?</span>`;
  }

  function formatNumber(value) {
    return Math.round(value).toLocaleString("ja-JP");
  }

  function formatPercent(value) {
    return `${Number(value).toFixed(1)}%`;
  }

  function response(text, age, spend, tenure) {
    return {
      text,
      attrs: { age, spend, tenure },
    };
  }

  function formatRespondentAttrs(attrs) {
    return `年齢: ${attrs.age} / 課金額: ${attrs.spend} / コア分類: ${attrs.core || "非公開"} / プレイ歴: ${attrs.tenure}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
