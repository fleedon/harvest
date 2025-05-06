import { ResultScreenManager } from './resultScreen.js';

export class ResultPhaseUI {
  constructor(canvas, ctx, results, onComplete) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;
    this.manager = new ResultScreenManager(results);

    this.stage = 0;  // 0:summary, 1:ELF, 2:円
    this.ready = false;

    this.nextBtn = this.createNextButton();
    this.nextBtn.onclick = () => this.advanceStage();

    this.manager.initialize().then(() => {
      this.ready = true;
    });
  }

  createNextButton() {
    const btn = document.createElement('button');
    btn.innerText = 'Next ▶';
    btn.style.position = 'absolute';
    btn.style.left = '50%';
    btn.style.bottom = '80px';
    btn.style.transform = 'translateX(-50%)';
    btn.style.fontSize = '18px';
    btn.style.padding = '8px 16px';
    btn.style.zIndex = '10';
    document.body.appendChild(btn);
    return btn;
  }

  advanceStage() {
    if (!this.ready) return;
    this.stage++;
    if (this.stage > 2) {
      this.cleanup();
      this.onComplete(); // スタート画面へ
    }
  }

  cleanup() {
    this.nextBtn.remove();
  }

  update() {
    // アニメ等が必要ならここで進行制御
  }

  draw() {
    if (!this.ready) return;

    const ctx = this.ctx;
    const data = this.manager.getStepData();

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#222';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    switch (this.stage) {
      case 0:
        ctx.fillText('🌟 星の作物 獲得 🌟', centerX, centerY - 40);
        ctx.font = '18px sans-serif';
        const summaryText = Object.entries(data.summary)
          .map(([k, v]) => `${k} × ${v}`)
          .join('　');
        ctx.fillText(summaryText, centerX, centerY + 10);
        break;
      case 1:
        ctx.fillText('🔹 獲得ELF 🔹', centerX, centerY - 40);
        ctx.fillText(`${data.elf} ELF`, centerX, centerY + 10);
        break;
      case 2:
        ctx.fillText('💰 円換算 💰', centerX, centerY - 40);
        ctx.fillText(`¥${data.jpy}`, centerX, centerY + 10);
        break;
    }

    ctx.textAlign = 'start'; // 念のためリセット
  }
}
