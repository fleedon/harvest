// powderManager.js
// 星の粉（合計数）を管理するクラス

export class PowderManager {
  constructor(initial = 0) {
    this.starPowder = initial; // 星の粉の総数
  }

  /**
   * 粉を加算（+1 or 蒼星の粉なら+5）
   * @param {number} amount
   */
  addPowder(amount = 1) {
    this.starPowder += amount;
  }

  /**
   * 現在の星の粉の合計（残り使用回数）
   */
  getTotal() {
    return this.starPowder;
  }

  /**
   * 1単位分の粉を消費
   * @returns {boolean} 成功したか
   */
  consume() {
    if (this.starPowder <= 0) return false;
    this.starPowder--;
    return true;
  }

  /**
   * 表示用（UI表示などに利用）
   */
  getDisplay() {
    return {
      starPowder: this.starPowder
    };
  }
}
