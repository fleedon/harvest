// currencyBar.js
export class CurrencyBar {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx    = ctx;
    this.rate   = 0;                        // 1 ELF = ? EN
    this.lastRate = 0;
    this.bal    = { ELF: 0, EN: 0, ES: 0 };
    this.flashTimer = 0;                   // レート変動で色変化用
  }

  updateBalances({ ELF, EN, ES }) {
    this.bal = { ELF, EN, ES };
  }

  updateRate(newRate) {
    if (this.rate !== 0 && newRate !== this.rate) {
      // レートが変わった瞬間にフラッシュ
      this.flashTimer = 30; // 約0.5s (draw毎に --)
      this.lastRate = this.rate;
    }
    this.rate = newRate;
  }

  draw() {
    const { ctx, canvas } = this;

    // 背景
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // テキスト設定
    ctx.font = 'bold 14px sans-serif';
    ctx.textBaseline = 'middle';

    // レート色：変動中は緑/赤フラッシュ
    let rateColor = '#fff';
    if (this.flashTimer > 0) {
      rateColor = this.rate > this.lastRate ? '#4caf50' : '#ff5252';
      this.flashTimer--;
    }
    ctx.fillStyle = rateColor;
    ctx.fillText(`1 ELF = ${this.rate.toFixed(2)} EN`, 8, 16);

    // 通貨残高
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    const pad = (n) => n.toLocaleString('en-US');
    ctx.fillText(`🪙 ${pad(this.bal.ELF)}`, canvas.width - 8, 10);
    ctx.fillText(`💴 ${pad(this.bal.EN)}`, canvas.width - 8, 22);

    ctx.textAlign = 'center';
    ctx.fillText(`🪪 ${pad(this.bal.ES)}`, canvas.width / 2, 22);
    ctx.textAlign = 'left';
  }
}
