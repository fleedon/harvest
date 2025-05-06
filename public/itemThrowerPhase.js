// itemThrowerPhase.js
import { FallingItem } from './fallingItem.js';
import { Catcher } from './catcher.js';

export class ItemThrowerPhase {
  constructor({
    canvas, ctx, onComplete,
    throwerImage,
    itemConfigList,
    throwerY = 42,
    batchCount = 5,
    maxItems = 35,
    interval = 1500,
    onCatch = () => {},
    scoreLabel = () => ''
  }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onComplete = onComplete;
    this.throwerImage = throwerImage;
    this.throwerY = throwerY;
    this.itemConfigList = itemConfigList;
    this.batchCount = batchCount;
    this.maxItems = maxItems;
    this.interval = interval;
    this.onCatch = onCatch;
    this.scoreLabel = scoreLabel;

    this.catcher = new Catcher(canvas.width, canvas.height, document.getElementById('img_player'));
    this.items = [];

    this.spawnCount = 0;
    this.elapsed = 0;
    this.finished = false;

    this.throwerX = canvas.width / 2;
    this.targetX = this.throwerX;
    this.moveTimer = 0;
    this.moveInterval = 3000;

    canvas.addEventListener('pointerdown', (e) => this.handleInput(e));
    canvas.addEventListener('pointermove', (e) => this.handleInput(e));
  }

  handleInput(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    this.catcher.moveTo(x);
  }

  update(deltaTime) {
    this.moveTimer += deltaTime;
    if (this.moveTimer >= this.moveInterval) {
      this.targetX = Math.random() * (this.canvas.width - 64) + 32;
      this.moveTimer = 0;
    }
    const dx = this.targetX - this.throwerX;
    this.throwerX += dx * 0.01 * deltaTime;

    if (!this.finished) {
      this.elapsed += deltaTime;
      if (this.elapsed >= this.interval && this.spawnCount < this.maxItems) {
        this.elapsed = 0;
        for (let i = 0; i < this.batchCount; i++) {
          const config = this.chooseItemConfig();
          const x = this.throwerX;
          const y = this.throwerY;
          const item = new FallingItem(
            config.image,
            x,
            y,
            config.initialSpeed,
            config.acceleration,
            config.width || 32,
            config.height || 32
          );
          item.type = config.type;
          this.items.push(item);
        }
        this.spawnCount += this.batchCount;
        if (this.spawnCount >= this.maxItems) this.finished = true;
      }
    }

    for (const item of this.items) {
      if (!item.caught) {
        item.update(deltaTime);
      }
    }

    for (const item of this.items) {
      if (!item.caught && item.intersects(this.catcher)) {
        item.markCaught();
        this.onCatch(item.type);
      }
    }

    this.items = this.items.filter(item => !item.caught && !item.isOutOfBounds(this.canvas.height));

    if (this.finished && this.items.length === 0) {
      this.onComplete();
    }

    this.catcher.update(deltaTime);
  }

  draw() {
    if (this.throwerImage && this.throwerImage.complete && this.throwerImage.naturalWidth > 0) {
      this.ctx.drawImage(this.throwerImage, this.throwerX - 32, this.throwerY - 32, 64, 64);
    }
    for (const item of this.items) item.draw(this.ctx);
    this.catcher.draw(this.ctx);

    // スコア表示（main.js から渡された scoreLabel を使う）
    if (typeof this.scoreLabel === 'function') {
      this.ctx.fillStyle = "#000";
      this.ctx.font = "16px sans-serif";
      this.ctx.fillText(this.scoreLabel(), 10, 30);
    }
  }

  chooseItemConfig() {
    const totalWeight = this.itemConfigList.reduce((sum, c) => sum + c.weight, 0);
    const rand = Math.random() * totalWeight;
    let acc = 0;
    for (const config of this.itemConfigList) {
      acc += config.weight;
      if (rand <= acc) return config;
    }
    return this.itemConfigList[0];
  }
}