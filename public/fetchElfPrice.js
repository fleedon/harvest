// fetchElfPrice.js
// ─────────────────────────────────────────────────────────────
//  ELF 現在レートの取得 ＆ 各作物の ELF 価格変換ユーティリティ
//    - 金属系は「円 → ELF」換算（動的）
//    - 石系は固定 ELF 価格
//    - API エラー時はデフォルトレート 0.94 円 / ELF
// ─────────────────────────────────────────────────────────────

/* ------------------------------------------------------------
 * 1) 定数テーブル
 * ---------------------------------------------------------- */
const DEFAULT_ELF_RATE = 1.00;           // Fallback 用レート（円）

// 金属系作物：日本円での実質価値
const METAL_ITEM_JPY = {
  copper :   100,
  silver : 10000,
  gold   : 100000
};

// 石系作物：固定 ELF 価値
const FIXED_ITEM_ELF = {
  glass    :     30,
  sapphire :   1000,
  emerald  :  10000,
  diamond  : 300000
};

/* ------------------------------------------------------------
 * 2) 外部 API から ELF / JPY レート取得
 * ---------------------------------------------------------- */
const PROXY = "https://us-central1-<YOUR_PROJECT_ID>.cloudfunctions.net/elfRate";
export async function fetchElfRate () {
  const { ltp } = await fetch(PROXY).then(r => r.json());
  return ltp ?? 1.00;
}

/* ------------------------------------------------------------
 * 3) 金属系作物の ELF 価格を計算
 *    円 ÷ (1ELF の円価格) ＝ 該当作物の ELF 価値
 * ---------------------------------------------------------- */
function calcMetalItemELFPrices(elfRateJPY) {
  return Object.fromEntries(
    Object.entries(METAL_ITEM_JPY).map(([item, yen]) => {
      const value = yen / elfRateJPY;
      // 小数第 2 位で四捨五入
      return [item, Math.round(value * 100) / 100];
    })
  );
}

/* ------------------------------------------------------------
 * 4) 全作物（動的＋固定）の ELF 価格をまとめて取得
 * ---------------------------------------------------------- */
export async function getAllItemELFPrices() {
  const elfRate = await fetchElfRate();                   // ① レート取得
  const metalELF = calcMetalItemELFPrices(elfRate);       // ② 金属系換算

  return {
    ...metalELF,                                          // 動的
    ...FIXED_ITEM_ELF,                                    // 固定
    elfRate                                               // 参考レートも同梱
  };
}

/* ------------------------------------------------------------
 * 5) 単体テスト・デバッグ用簡易エクスポート
 * ---------------------------------------------------------- */
// Node.js で直接実行した場合の簡易テスト
if (import.meta?.url === (typeof document === 'undefined' ? process?.argv?.[1] : undefined)) {
  (async () => {
    console.table(await getAllItemELFPrices());
  })();
}
