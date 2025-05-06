export class Seed {
  constructor(id) {
    this.id = id;
    this.powderCount = 0;
    this.maxPowder = 10;
  }

  
//    粉を1回分振りかける
//    @returns {boolean} 成功したかどうか
   
  addPowder() {
    if (this.powderCount = this.maxPowder) {
      return false;
    }
    this.powderCount++;
    return true;
  }

  
//    現在の粉レベル（何回振りかけたか）
   
  getLevel() {
    return this.powderCount;
  }
}
