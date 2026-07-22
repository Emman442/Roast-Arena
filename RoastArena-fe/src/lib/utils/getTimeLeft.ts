export function getTimeLeft(deadline: number) {
  const now = Date.now();
  const diff = deadline - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) /
    (1000 * 60 * 60)
  );

  const minutes = Math.floor(
    (diff % (1000 * 60 * 60)) /
    (1000 * 60)
  );

  const seconds = Math.floor(
    (diff % (1000 * 60)) /
    1000
  );

  if (days > 0) {
    return `${days}d:${hours}h:${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h:${minutes}m:${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m:${seconds}s`;
  }

  return `${seconds}s`;
}