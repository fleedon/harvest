// powderCatchPhase.js
import { FallingItem } from './fallingItem.js';
import { Catcher } from './catcher.js';

export class PowderCatchPhase {
  constructor(canvas, ctx, onComplete, elfSpecies = "default") {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;
    this.elfSpecies = elfSpecies;

    this.imgElf = document.getElementById('img_elf');
    this.catcher = new Catcher(canvas.width, canvas.height, document.getElementById('img_player'));

    this.items = [];
    this.elapsed = 0;
    this.spawnInterval = 1500;
    this.spawnCount = 0;
    this.maxItems = 20;

    this.totalPowder = 0;

    this.canvas.addEventListener("pointerdown", (e) => this.handleInput(e));
    this.canvas.addEventListener("pointermove", (e) => this.handleInput(e));
  }

  handleInput(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    this.catcher.moveTo(x);
  }

  update(deltaTime) {
    // 粉の生成ロジック
    if (this.spawnCount < this.maxItems) {
      this.elapsed += deltaTime;
      if (this.elapsed >= this.spawnInterval) {
        this.elapsed = 0;

        const rand = Math.random();
        let type;
        if (rand < 0.6) {
          type = "powder";       // 星の粉
        } else if (rand < 0.8) {
          type = "bluepowder";   // 蒼星の粉
        } else {
          type = "bottle";       // 毒瓶
        }

        let speed, acceleration;
        if (type === "bottle") {
          speed = 0.05;         // 毒瓶は一定でゆっくり
          acceleration = 0;
        } else {
          speed = 0.08 + Math.random() * 0.1;  // 星の粉系はゆっくり始まり徐々に加速
          acceleration = 0.0002;               // 加速度（px/ms^2）
        }

        const x = this.canvas.width / 2 - 16;
        const y = 64;

        let img;
        if (type === "powder") {
          img = document.getElementById("img_powder");
        } else if (type === "bluepowder") {
          img = document.getElementById("img_bluepowder");
        } else {
          img = document.getElementById("img_bottle");
        }

        const item = new FallingItem(x, y, speed, img);
        item.type = type;
        item.acceleration = acceleration;

        this.items.push(item);
        this.spawnCount++;
      }
    }

    // 落下物の挙動更新
    for (const item of this.items) {
      if (!item.caught) {
        if (item.type === "bottle") {
          item.update(deltaTime);
        } else {
          item.speed += item.acceleration * deltaTime;
          item.update(deltaTime);
        }
      }
    }

    // キャッチ判定
    for (const item of this.items) {
      if (!item.caught && item.intersects(this.catcher)) {
        item.markCaught();
        if (item.type === "bottle") {
          this.totalPowder = Math.max(0, this.totalPowder - 2);
        } else {
          this.totalPowder += (item.type === "bluepowder") ? 5 : 1;
        }
      }
    }

    // 不要アイテム除去
    this.items = this.items.filter(item => !item.caught && !item.isOutOfBounds(this.canvas.height));

    // フェーズ終了判定
    if (this.spawnCount >= this.maxItems && this.items.length === 0) {
      this.onComplete(this.totalPowder);
    }

    this.catcher.update(deltaTime);
  }

  draw() {
    // エルフを描画
    if (this.imgElf && this.imgElf.complete && this.imgElf.naturalWidth > 0) {
      this.ctx.drawImage(this.imgElf, this.canvas.width / 2 - 32, 20, 64, 64);
    }

    // 落下アイテム描画
    for (const item of this.items) {
      item.draw(this.ctx);
    }

    // プレイヤー描画
    this.catcher.draw(this.ctx);

    // 粉獲得数表示
    this.ctx.fillStyle = "#000";
    this.ctx.font = "16px sans-serif";
    this.ctx.fillText(`粉獲得数: ${this.totalPowder}`, 10, 30);
  }
}
