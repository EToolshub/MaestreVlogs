/**
 * Metas de suscriptores que avanzan solas: 1.000 → 2.500 → 5.000 → 7.500 →
 * 10.000 → 25.000 → 50.000 → 75.000 → 100.000 → 250.000…
 * (serie 1 · 2,5 · 5 · 7,5 por cada potencia de 10).
 */
const FACTORS = [1, 2.5, 5, 7.5];

function milestonesAround(value: number) {
  const exponent = Math.max(2, Math.floor(Math.log10(Math.max(value, 1))));
  const list: number[] = [];
  for (let e = exponent - 1; e <= exponent + 1; e++) {
    for (const f of FACTORS) list.push(f * 10 ** e);
  }
  return list.filter((m) => m >= 100).sort((a, b) => a - b);
}

/** Próxima meta (siempre mayor que la cifra actual). */
export function nextMilestone(subscribers: number) {
  return milestonesAround(subscribers).find((m) => m > subscribers) ?? subscribers * 2;
}

/** Última meta ya superada (o 0 si todavía no hay ninguna). */
export function previousMilestone(subscribers: number) {
  return [...milestonesAround(subscribers)].reverse().find((m) => m <= subscribers) ?? 0;
}

/** Metas ya alcanzadas desde 1.000 (para mostrarlas como logros). */
export function reachedMilestones(subscribers: number) {
  const reached: number[] = [];
  for (let e = 3; 10 ** e <= subscribers; e++) {
    for (const f of FACTORS) {
      const m = f * 10 ** e;
      if (m <= subscribers) reached.push(m);
    }
  }
  return reached;
}

export function milestoneProgress(subscribers: number) {
  const goal = nextMilestone(subscribers);
  const from = previousMilestone(subscribers);
  return { goal, from, progress: Math.min(1, (subscribers - from) / (goal - from)), remaining: goal - subscribers };
}
