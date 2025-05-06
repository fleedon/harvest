// soundManager.js
// 効果音とBGMの管理（ミュート切替対応）

export class SoundManager {
  constructor() {
    this.sounds = {};
    this.bgm = null;
    this.muted = false;
  }

  /** 音ファイルを事前に登録 */
  register(name, audioPath, isBgm = false) {
    const audio = new Audio(audioPath);
    audio.volume = 0.5;
    audio.loop = isBgm;
    this.sounds[name] = audio;
    if (isBgm) this.bgm = audio;
  }

  /** SE再生（ミュート対応） */
  play(name) {
    if (this.muted || !this.sounds[name]) return;
    this.sounds[name].currentTime = 0;
    this.sounds[name].play();
  }

  /** BGM再生（ミュート対応） */
  playBgm() {
    if (this.muted || !this.bgm) return;
    this.bgm.currentTime = 0;
    this.bgm.play();
  }

  /** 停止処理（BGM停止） */
  stopBgm() {
    if (this.bgm) this.bgm.pause();
  }

  /** ミュートON/OFF切り替え */
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      if (this.bgm) this.bgm.pause();
    } else {
      this.playBgm();
    }
  }

  /** ミュート状態取得 */
  isMuted() {
    return this.muted;
  }
}
