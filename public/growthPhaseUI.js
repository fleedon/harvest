// growthPhaseUI.js（案Bの UI ラッパ雛形）
import { GrowthPhaseManager } from './growthManager.js';

export class GrowthPhaseUI {
  constructor(canvas, ctx, levelList, onComplete) {
    this.canvas = canvas;
    this.ctx     = ctx;
    this.onComplete = onComplete;

    this.manager = new GrowthPhaseManager(levelList);
    this.manager.rollAll();           // まとめて抽選

    // アニメ管理用
    this.revealIndex = 0;
    this.revealed    = [];

    // 抽選結果を逐次公開
    this.manager.playRevealSequence(
      (type, i) => {                  // onReveal
        this.revealed.push(type);
        this.revealIndex = i + 1;
      },
      () => {                         // onFinish
this.onComplete(this.revealed);   // ← 集計せず “配列” のまま渡す
      }
    );
  }

  update() {/* 必要ならアニメ進行 */}
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.fillText(`成長中… ${this.revealIndex}/${this.manager.results.length}`, 40, 120);

    // TODO: 各種ポップアップ演出をここに
  }
}
export { GrowthPhaseUI as GrowthPhaseManager };