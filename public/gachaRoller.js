import drawTable from './drawTable.js';

export function drawMultipleResults(levelList) {
  const summary = {};

  for (const level of levelList) {
    const clamped = Math.max(0, Math.min(10, level));
    const probs = drawTable[clamped.toString()];

    const rand = Math.random() * 100; // 0‑100 の乱数
    let cumulative = 0;
    let selected = 'miss';

    for (const [item, prob] of Object.entries(probs)) {
      cumulative += prob;
      if (rand <= cumulative) {
        selected = item;
        break;
      }
    }
    summary[selected] = (summary[selected] || 0) + 1;
  }
  return summary;
}
