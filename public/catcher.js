// catcher.js
// プレイヤーキャラを表すクラス (画面下部でザルを持つ子)

export class Catcher {
  constructor(canvasWidth, canvasHeight, image) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image = image; // <img id="img_player"> 等を渡す
    this.width = 80;  // 画像サイズに合わせて調整
    this.height = 80; // 画像サイズに合わせて調整
    this.y = canvasHeight - this.height - 20; // 下部に配置
    this.x = (canvasWidth - this.width) / 2;
    this.speed = 0;
    this.targetX = this.x;
  }

moveTo(x) {
  this.targetX = x - this.width / 2;
  this.targetX = Math.max(0, Math.min(this.targetX, this.canvasWidth - this.width));
//  console.log("moveTo - targetX:", this.targetX);
}


  update(deltaTime) {
    // なめらかに追従
    const dx = this.targetX - this.x;
    this.x += dx * 0.3;
  }

  draw(ctx) {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = 'gray';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
