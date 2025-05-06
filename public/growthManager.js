// growthManager.js
// フェーズ4「成長抽選」ロジック専用クラス
// （キャンバスや演出には一切依存しない純ロジック）
import { drawMultipleResults } from './gachaRoller.js';

/**
 * GrowthPhaseManager
 * @param {number[]} levelList  各種ごとの粉レベル配列 (0-10)
 */
export class GrowthPhaseManager {
  constructor(levelList) {
    this.levelList = levelList;
    this.results   = [];          // shuffled result list (e.g. ['gold','miss',...])
  }

  /** 抽選をまとめて実行し、シャッフルして results に保持 */
  rollAll() {
    const summary = drawMultipleResults(this.levelList);   // { gold:1, silver:3, ... }
    const exploded = [];

    for (const [type, count] of Object.entries(summary)) {
      for (let i = 0; i < count; i++) exploded.push(type);
    }
    // 自然な公開順になるようランダムに並べ替え
    this.results = exploded.sort(() => Math.random() - 0.5);
  }

  /**
   * 0.5 秒おきに 1 件ずつ公開 → 全件後 1 秒待って onFinish。
   * @param {(type:string, index:number, total:number)=>void} onReveal
   * @param {()=>void} onFinish
   */
  playRevealSequence(onReveal, onFinish) {
    if (this.results.length === 0) this.rollAll();

    const total = this.results.length;
    this.results.forEach((type, i) => {
      setTimeout(() => {
        onReveal(type, i, total);
        if (i === total - 1) setTimeout(onFinish, 1000);
      }, i * 500);
    });
  }
}
