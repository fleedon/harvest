// seedPageManager.js
// 多数の種をページ切り替え式で表示・管理するクラス

export class SeedPageManager {
  constructor(seeds = [], perPage = 8) {
    this.seeds = seeds;
    this.perPage = perPage;
    this.page = 0;
  }

  /**
   * 現在のページに表示する種一覧を返す
   */
  getCurrentPageItems() {
    const start = this.page * this.perPage;
    return this.seeds.slice(start, start + this.perPage);
  }

  /**
   * 次ページへ移動（末尾なら循環）
   */
  nextPage() {
    this.page = (this.page + 1) % this.getPageCount();
  }

  /**
   * 前ページへ移動（先頭なら循環）
   */
  prevPage() {
    this.page = (this.page - 1 + this.getPageCount()) % this.getPageCount();
  }

  /**
   * 総ページ数を取得
   */
  getPageCount() {
    return Math.ceil(this.seeds.length / this.perPage);
  }

  /**
   * 現在のページ番号（0始まり）
   */
  getCurrentPageIndex() {
    return this.page;
  }

  /**
   * 対象の種リストを差し替える
   */
  setSeeds(seeds) {
    this.seeds = seeds;
    this.page = 0;
  }
}
