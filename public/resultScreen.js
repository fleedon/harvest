// resultScreen.js
// ───────────────────────────────────────────────────────────
//  リザルト画面ロジック：種別集計 → ELF換算 → 円換算
// ───────────────────────────────────────────────────────────

import { fetchElfRate, getAllItemELFPrices } from './fetchElfPrice.js';

/* ----------------------------------------------------------
 * ① 表記ゆれ対策：エイリアスマップ & 正規化ユーティリティ
 * -------------------------------------------------------- */
export const aliasMap = {
//  elf_silver: 'silver',   // ハズレ扱い
  bronze:     'copper',   // 旧表記
  miss:       'elf_silver'
};

export function normalizeKey(key = '') {
  return aliasMap[key] || key.toLowerCase();
}

/* ----------------------------------------------------------
 * ② メインクラス
 * -------------------------------------------------------- */
export class ResultScreenManager {
  constructor(results = []) {
    this.results        = results;   // ['gold', 'silver', ...] あるいは { gold:2, ... }
    this.summary        = {};        // 集計結果
    this.totalElf       = 0;         // 合計 ELF
    this.jpyEquivalent  = 0;         // 円換算
    this.elfPrice       = 0.94;      // 1ELF ≒ 0.94円（API fallback）
  }

  /* ---------- 初期化（非同期） ---------- */
  async initialize() {
    // 1) 結果を集計
    this.summary  = this.aggregateResults(this.results);

    // 2) ELFレート取得（失敗時はデフォルト値を保持）
    try {
      this.elfPrice = await fetchELFRate();
    } catch (e) {
      console.warn('ELFレート取得失敗。モック値を使用します', e);
    }

    // 3) ELF / 円計算
    this.totalElf      = await this.calculateElf(this.summary);
    this.jpyEquivalent = Math.round(this.totalElf * this.elfPrice);
  }

  /* ---------- ステップUI用データ ---------- */
  getStepData() {
    return {
      summary   : this.summary,       // { gold:1, silver:2, ... }
      elf       : this.totalElf,      // 合計ELF
      jpy       : this.jpyEquivalent, // 円換算
      elfPrice  : this.elfPrice       // 1ELF 価格
    };
  }

  /* ---------- 結果配列 → 集計 ---------- */
  aggregateResults(results) {
    // 配列パターン
    if (Array.isArray(results)) {
      return results.reduce((acc, rawKey) => {
        const key = normalizeKey(rawKey);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
    }

    // 既に集計済みオブジェクトの場合
    if (results && typeof results === 'object') {
      return Object.entries(results).reduce((acc, [rawKey, count]) => {
        const key = normalizeKey(rawKey);
        acc[key] = (acc[key] || 0) + count;
        return acc;
      }, {});
    }

    // それ以外（null 等）は空オブジェクト
    return {};
  }

  /* ---------- ELF 換算 ---------- */
  async calculateElf(summary) {
    const itemELF = await getAllItemELFPrices(); // { gold:100000/ltp, glass:30, ... }

const total = Object.entries(summary).reduce((sum, [rawKey, count]) => {
  const key = normalizeKey(rawKey);

  // ELF_Silver は無視（加算しない）
  if (key === 'elf_silver') return sum;

  const valuePerItem = itemELF[key] || 0;
  return sum + valuePerItem * count;
}, 0);


    // 小数第2位までで丸め
    return Math.round(total * 100) / 100;
  }
}
