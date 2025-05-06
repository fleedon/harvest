// powderAllocationPhaseUI.js  (フェードイン + 背面光棒 + 粒子エフェクト + 種画像描画)

export class PowderAllocationPhaseUI {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} seedCount          取得した種数
   * @param {number} powderAmount       粉総数
   * @param {function} onComplete       完了時コールバック (levels[])
   * @param {HTMLImageElement} imgLight 回転光エフェクト PNG (64×128 推奨)
   * @param {HTMLImageElement} imgSparkle 粒子 PNG (16×16)
   * @param {HTMLImageElement} imgSeed  種 PNG (64×64)
   */
  constructor(canvas, ctx, seedCount, powderAmount, onComplete, imgLight, imgSparkle, imgSeed) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;
    this.imgLight = imgLight;
    this.imgSparkle = imgSparkle;
    this.imgSeed = imgSeed;

    // 種エフェクト状態
    this.effects = Array.from({ length: seedCount }, (_, i) => ({
      x: (i % 4) * 90 + 40,              // 4 列、種画像64px + 26px余白
      y: Math.floor(i / 4) * 110 + 120,  // 行高 110px
      powderLevel: 0,
      lightRotation: Math.random() * Math.PI * 2,
      sparkleParticles: []
    }));

    this.remainingPowder = powderAmount;
    this.fadeAlpha = 1;
    this.finished = false;

    canvas.addEventListener('pointerdown', (e) => this.handleClick(e));
  }

  handleClick(e) {
    if (this.remainingPowder <= 0) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    for (const eff of this.effects) {
      if (eff.powderLevel >= 10) continue;
      const dx = x - (eff.x + 32);
      const dy = y - (eff.y + 32);
      if (Math.abs(dx) < 32 && Math.abs(dy) < 32) {
        eff.powderLevel++;
        this.remainingPowder--;
        eff.sparkleParticles.push({
          x: eff.x + 32 + (Math.random() * 20 - 10),
          y: eff.y + 25,
          vy: 0.05 + Math.random() * 0.04,
          alpha: 1
        });
        break;
      }
    }
  }

  update(delta) {
    if (this.fadeAlpha > 0) {
      this.fadeAlpha -= delta * 0.001;
      if (this.fadeAlpha < 0) this.fadeAlpha = 0;
    }

    for (const eff of this.effects) {
      eff.lightRotation += 0.001 * delta;
      for (const p of eff.sparkleParticles) {
        p.y -= p.vy * delta;
        p.alpha -= 0.001 * delta;
      }
      eff.sparkleParticles = eff.sparkleParticles.filter(p => p.alpha > 0);
    }

    if (!this.finished && this.remainingPowder === 0) {
      this.finished = true;
      const levels = this.effects.map(e => e.powderLevel);
      setTimeout(() => this.onComplete(levels), 600);
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const eff of this.effects) {
      // 背面回転光（粉レベルで強度・本数UP）
      if (eff.powderLevel > 0 && this.imgLight?.complete && this.imgLight.naturalWidth) {
        const alphaBase = 0.18 + 0.05 * eff.powderLevel; // 最大 0.68
        const stripCount = eff.powderLevel <= 5 ? 1 : 2;   // 6 以上なら光棒を 2 本重ねる
        for (let s = 0; s < stripCount; s++) {
          ctx.save();
          ctx.translate(eff.x + 32, eff.y + 32);
          ctx.rotate(eff.lightRotation + (s * Math.PI / 2));
          ctx.globalAlpha = Math.min(alphaBase, 0.85);
          const scale = 1 + 0.15 * eff.powderLevel;  // 粉レベルで長さ拡大
          const w = 32 * scale;
          const h = 128 * scale;
          ctx.drawImage(this.imgLight, -w / 2, -h * 0.5, w, h);
          ctx.restore();
        }
      }

      // 種画像（前面）
      if (this.imgSeed?.complete && this.imgSeed.naturalWidth) {
        ctx.drawImage(this.imgSeed, eff.x, eff.y, 64, 64);
      } else {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(eff.x + 32, eff.y + 32, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // レベル文字
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText(`+${eff.powderLevel}`, eff.x + 20, eff.y + 78);

      // 粒子
      for (const p of eff.sparkleParticles) {
        ctx.globalAlpha = p.alpha;
        if (this.imgSparkle?.complete && this.imgSparkle.naturalWidth) {
          ctx.drawImage(this.imgSparkle, p.x, p.y, 16, 16);
        }
      }
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.fillText(`残り粉: ${this.remainingPowder}`, 10, 26);

    if (this.fadeAlpha > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.fadeAlpha})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
