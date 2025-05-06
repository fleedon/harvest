// seedCatchPhase.js
import { SeedSpawner } from './seedSpawner.js';
import { Catcher } from './catcher.js';

export class SeedCatchPhase {
  constructor(canvas, ctx, onComplete) {
	this.started = false;
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;

    const imgPlayer = document.getElementById('img_player');
    this.imgMaster = document.getElementById('img_master');

    // 種の画像として img_seed を渡すように修正
    this.spawner = new SeedSpawner(canvas.width, canvas.height, document.getElementById('img_seed'));
    this.catcher = new Catcher(canvas.width, canvas.height, imgPlayer);

    this.lastTime = 0;
    this.totalCaught = 0;
    this.phaseEnded = false;

    this.canvas.addEventListener('pointerdown', e => this.handleInput(e));
    this.canvas.addEventListener('pointermove', e => this.handleInput(e));
  }

  handleInput(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    this.catcher.moveTo(x);
  }

update(currentTime) {
  const delta = currentTime - this.lastTime;
  this.lastTime = currentTime;

  // ▼ 開始フラグが false の間は描画だけにする（updateは何も起こさない）
  if (!this.started) return;

  this.catcher.update(delta);
  this.spawner.update(delta);
  this.totalCaught += this.spawner.checkCatch(this.catcher);

  if (!this.phaseEnded && this.spawner.isFinished()) {
    this.phaseEnded = true;
    setTimeout(() => this.onComplete(this.totalCaught), 1000);
  }
}


  draw() {
    this.spawner.draw(this.ctx);

    if (this.imgMaster) {
      const masterX = this.spawner.getMasterX();
      const masterY = this.spawner.getMasterY();
      this.ctx.drawImage(this.imgMaster, masterX - 32, masterY - 32, 64, 64);
    }

    this.catcher.draw(this.ctx);

    this.ctx.fillStyle = '#000';
    this.ctx.font = '16px sans-serif';
    this.ctx.fillText(`種GET数: ${this.totalCaught}`, 10, 30);
  }

// ゲーム開始を明示する関数を追加
start() {
  this.started = true;
}

}
