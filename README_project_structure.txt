プロジェクト名: 星の作物キャッチゲーム（エルフの森 二次創作ミニゲーム）

【構成ファイル一覧】
- main.js: ゲームのメイン制御ループ。フェーズ管理、BGM/SE制御、UI表示など一括制御
- gamePhases.js: ゲームの各フェーズを enum 的に定義（SEED_COLLECTION など）
- soundManager.js: BGM・効果音の再生・ミュート管理
- seedCatchPhase.js: フェーズ1：種キャッチ処理（SeedSpawnerとCatcherによる動作）
- seedSpawner.js: 種アイテムを落下させる管理クラス。一定間隔で発射＋落下処理
- catcher.js: プレイヤーのザル（キャラ）制御。X軸移動・当たり判定を提供
- fallingItem.js: 汎用的な落下アイテムクラス（星の粉・毒瓶などでも使用予定）
- powderManager.js: フェーズ2：星の粉キャッチ用ロジック（仮予定）
- powderAllocation.js: フェーズ3：粉を各種に割り振るロジック
- growthManager.js: フェーズ4：種の成長アニメーション、抽選結果の演出・SE表示
- resultScreen.js: フェーズ5：リザルト画面構成、スコア・ELF換算・日本円換算表示
- gachaResolver.js: 粉の回数に応じた抽選結果（テーブル参照）のロジック（growthManagerに統合検討中）
- drawGrowthTable.js: 抽選確率を表形式で表示（開発・調整用 UI）
- drawTable.json: 粉レベルごとの抽選確率を格納した設定ファイル
- fetchElfPrice.js: ELFトークンの現在価格をAPI（bitFlyerなど）から取得
- itemPriceConfig.js: 各星の作物の価格を管理（固定 or 変動）
- historyManager.js: プレイ履歴の保存と表示（Result画面・オープニングから参照予定）

【最近の変更と方針】
- seedGameLogic.js は seedCatchPhase.js に統合・改名されたため削除予定
- SeedCatchPhase が main.js から使用され、種キャッチを統括
- 今後のフェーズ（粉キャッチ・振り分け・抽選・結果）も各フェーズごとに独立したモジュール化を継続

【技術仕様・補足】
- 各フェーズは GamePhaseManager で遷移制御
- 画面サイズは 縦720px × 横360px（スマホ縦画面）
- キャラのセリフや演出は JSON で管理予定
- BGMはプレイ中のみ1曲。リザルトでは停止
- 蒼星の粉は「星の粉+5」として自動加算。上限管理済
