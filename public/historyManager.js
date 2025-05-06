// historyManager.js
// 履歴の保存と読み出し（localStorage）

const STORAGE_KEY = 'game_history_v1';

export class HistoryManager {
  /** 保存する（新しい履歴を上書き追加） */
  static save(entry) {
    const existing = HistoryManager.loadAll();
    existing.unshift({ ...entry, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
  }

  /** 最新50件までの履歴を取得 */
  static loadAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  /** 履歴をすべて削除 */
  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
