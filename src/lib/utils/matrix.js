export function monthMatrix(year, monthIdx) {
  const first = new Date(year, monthIdx, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Mon=0..Sun=6
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const prevDays = new Date(year, monthIdx, 0).getDate();

  const cells = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = prevDays - i;
    cells.push({ d: day, inMonth: false, date: new Date(year, monthIdx - 1, day) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ d, inMonth: true, date: new Date(year, monthIdx, d) });
  }
  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - (startWeekday + daysInMonth) + 1;
    cells.push({ d: nextDay, inMonth: false, date: new Date(year, monthIdx + 1, nextDay) });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ d: d.getDate(), inMonth: false, date: d });
  }
  return cells;
}
