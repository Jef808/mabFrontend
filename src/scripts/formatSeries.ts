export function rollup([seriesName, seriesData]) {
  let result = [];
  seriesData.forEach(([action, value]) => {
    const idx = parseInt(action);
    if (result[idx] === undefined) {
      result[idx] = { action: idx, visits: 0, avg_reward: 0.0 };
    }
    result[idx].visits += 1;
    result[idx].avg_reward += value;
  });
  return result.map(({action, visits, avg_reward}) => ({ action, visits, avg_reward: avg_reward / visits }));
}
