// seedSpawner.js
// 種を一定間隔で生成し、マスターから散弾銃のように打ち出すクラス

import { FallingItem } from './fallingItem.js';

class SeedItem extends FallingItem {
  /**
   * @param {number} originX - 発射位置のX座標
   * @param {number} originY - 発射位置のY座標
   * @param {number} baseFallingSpeed - 通常の落下速度（px/ms）
   * @param {HTMLImageElement} img - 種の画像
   */
constructor(originX, originY, baseFallingSpeed, img, canvasWidth) {
  super(originX, originY, baseFallingSpeed, img);
  this.vx = (Math.random() * 0.3) - 0.15;
  this.vy = baseFallingSpeed;
  this.traveledX = 0;
  this.burstDistance = 50;
  this.baseFallingSpeed = baseFallingSpeed;
  this.canvasWidth = canvasWidth; // ← ここ重要！
}

  
update(deltaTime) {
  // burst phase 中は横方向に進む
  if (Math.abs(this.traveledX) < this.burstDistance) {
    const dx = this.vx * deltaTime;
    this.x += dx;
    this.y += this.vy * deltaTime;
    this.traveledX += Math.abs(dx);

    // ✅ 画面端にぶつかったら vx 反転（バウンド）
    if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
      this.vx *= -1;
      // はみ出し修正
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;
    }

    // burst phase 終了
    if (Math.abs(this.traveledX) >= this.burstDistance) {
      this.vx = 0;
      this.vy = this.baseFallingSpeed;
    }
  } else {
    // 通常落下
    this.y += this.vy * deltaTime;
  }
}

}

export class SeedSpawner {
  /**
   * @param {number} canvasWidth キャンバスの幅
   * @param {number} canvasHeight キャンバスの高さ
   * @param {HTMLImageElement} image 種の画像（img_seed）
   */
  constructor(canvasWidth, canvasHeight, image) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image = image;
    this.items = [];
    this.elapsed = 0;
    this.interval = 1500; // 1.5秒ごとに発射
    this.spawnCount = 0;
    this.maxSeeds = 35;
    this.finished = false;
    
    // マスターの発射原点設定
    this.masterX = canvasWidth / 2;   // 初期は中央
    this.masterY = 70;                // Y座標は固定（例）
    
    // マスターのランダム移動用パラメータ
    this.masterTargetX = Math.random() * (canvasWidth - 100) + 32;  // マスター画像の幅を考慮
    this.masterChangeInterval = 1000; // 3秒ごとにターゲット変更
    this.masterElapsed = 0;
  }

update(deltaTime) {
  // ✅ ① マスターの移動処理は最初に必ず実行（発射終了してても動かす）
  this.masterElapsed += deltaTime;
  if (this.masterElapsed >= this.masterChangeInterval) {
    this.masterTargetX = Math.random() * (this.canvasWidth - 100) + 32;
    this.masterElapsed = 0;
  }

  const dx = this.masterTargetX - this.masterX;
  this.masterX += dx * 0.01 * deltaTime;

  // ✅ ② 発射処理は finished かどうかで判定
  if (!this.finished) {
    this.elapsed += deltaTime;
    if (this.elapsed >= this.interval && this.spawnCount < this.maxSeeds) {
      this.elapsed = 0;
      for (let i = 0; i < 5; i++) {
        // （落下速度ランダム性は次項で調整）
        const speed = (100 + Math.random() * 500) / 1000;
        const item = new SeedItem(this.masterX, this.masterY, speed, this.image, this.canvasWidth);
        this.items.push(item);
      }
      this.spawnCount += 5;
      if (this.spawnCount >= this.maxSeeds) {
        this.finished = true;
      }
    }
  }

  // ✅ ③ 落下処理は常に続ける
  this.items.forEach(item => item.update(deltaTime));
  this.items = this.items.filter(item => !item.caught && !item.isOutOfBounds(this.canvasHeight));
}



  draw(ctx) {
    this.items.forEach(item => item.draw(ctx));
    // （必要なら）マスターの現在位置は seedCatchPhase で描画するのでここでは描画しない
  }

  checkCatch(catcher) {
    let caughtCount = 0;
    this.items.forEach(item => {
      if (!item.caught && item.intersects(catcher)) {
        item.markCaught();
        caughtCount++;
      }
    });
    return caughtCount;
  }

  isFinished() {
    return this.finished && this.items.length === 0;
  }

  getTotalCaught() {
    return this.spawnCount - this.items.length;
  }
  
  // マスターの現在のX座標を返す
  getMasterX() {
    return this.masterX;
  }
  
  // マスターのY座標
  getMasterY() {
    return this.masterY;
  }
}
