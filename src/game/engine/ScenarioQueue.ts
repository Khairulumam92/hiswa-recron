// Scenario queue and shuffle utilities
import { ScenarioData } from '../store/types';

export function shuffleScenarios(scenarios: ScenarioData[]): ScenarioData[] {
  const arr = [...scenarios];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getNextScenario(
  scenarios: ScenarioData[],
  currentIndex: number
): ScenarioData | null {
  if (currentIndex + 1 < scenarios.length) {
    return scenarios[currentIndex + 1];
  }
  return null;
}
