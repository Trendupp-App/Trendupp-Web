export function formatFollowerRange(min: number, max: number | null) {
  const fmt = (n: number) => n.toLocaleString();
  if (max === null) return `${fmt(min)}+ followers`;
  return `${fmt(min)} - ${fmt(max)} followers`;
}

export function formatTierLabel(name: string, min: number, max: number | null) {
  return `${name} (${formatFollowerRange(min, max)})`;
}
