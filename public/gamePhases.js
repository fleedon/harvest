// gamePhases.js
// ゲーム全体のフェーズ状態管理（ステートマシン的）

export const GamePhase = {
  OPENING: 'opening',
  SEED_COLLECTION: 'seed_collection',
  POWDER_COLLECTION: 'powder_collection',
  POWDER_ALLOCATION: 'powder_allocation',
  GROWTH_REVEAL: 'growth_reveal',
  RESULT_DISPLAY: 'result_display',
  FINISH: 'finish'
};

export class GamePhaseManager {
  constructor() {
    this.current = GamePhase.OPENING;
  }

  /** 現在のフェーズ取得 */
  getPhase() {
    return this.current;
  }

  /** 強制的にフェーズを変更 */
  setPhase(newPhase) {
    this.current = newPhase;
  }

  /** 次の一般的な進行順（必要に応じて編集） */
  advance() {
    switch (this.current) {
      case GamePhase.OPENING:
        this.current = GamePhase.SEED_COLLECTION; break;
      case GamePhase.SEED_COLLECTION:
        this.current = GamePhase.POWDER_COLLECTION; break;
      case GamePhase.POWDER_COLLECTION:
        this.current = GamePhase.POWDER_ALLOCATION; break;
      case GamePhase.POWDER_ALLOCATION:
        this.current = GamePhase.GROWTH_REVEAL; break;
      case GamePhase.GROWTH_REVEAL:
        this.current = GamePhase.RESULT_DISPLAY; break;
      case GamePhase.RESULT_DISPLAY:
        this.current = GamePhase.FINISH; break;
    }
  }
}
