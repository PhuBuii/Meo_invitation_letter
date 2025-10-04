export function two(n) {
  return String(n).padStart(2, "0");
}

export function getCountdown(target) {
  const diff = target.getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  const s = Math.floor(clamped / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

export function utcStamp(d) {
  return `${d.getUTCFullYear()}${two(d.getUTCMonth() + 1)}${two(d.getUTCDate())}T${two(
    d.getUTCHours()
  )}${two(d.getUTCMinutes())}${two(d.getUTCSeconds())}Z`;
}
