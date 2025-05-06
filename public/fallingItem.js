// fallingItem.js
// 落下アイテムの基底クラス（種・粉 共通）

export class FallingItem {
constructor(image, x, y, speed, acceleration, width = 32, height = 32) {
  this.image = image;
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.vy = speed; // ← この1行を追加！
  this.acceleration = acceleration;
  this.width = width;
  this.height = height;
  this.caught = false;
  this.vx = (Math.random() * 0.3) - 0.15; // -0.15〜+0.15 px/ms
  this.traveledX = 0;
  this.burstDistance = 100;

}


update(deltaTime) {
if (!this.caught) {
  // 初期 burst
  if (this.traveledX < this.burstDistance) {
    const dx = this.vx * deltaTime;
    this.x += dx;
    this.y += this.vy * deltaTime;
    this.traveledX += Math.abs(dx);
  } else {
    this.y += this.vy * deltaTime;
  }
}

}


draw(ctx) {
  if (this.image && this.image.complete && this.image.naturalWidth !== 0) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}


  isOutOfBounds(canvasHeight) {
    return this.y > canvasHeight;
  }

intersects(catcher) {
  const marginX = 30;
  const marginY = 35;
  return (
    this.x < catcher.x + catcher.width - marginX &&
    this.x + this.width > catcher.x + marginX &&
    this.y < catcher.y + catcher.height - marginY &&
    this.y + this.height > catcher.y + marginY
  );
}


  markCaught() {
    this.caught = true;
  }
}
