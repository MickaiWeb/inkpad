window.InkCalendar = (() => {
  let shown = new Date();
  function render(onSelect) {
    const grid = document.querySelector('#calendar-grid');
    const title = document.querySelector('#calendar-month-title');
    const year = shown.getFullYear();
    const month = shown.getMonth();
    title.textContent = shown.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    grid.innerHTML = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => '<div class="calendar-weekday">' + day + '</div>').join('');
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const previousDays = new Date(year, month, 0).getDate();
    for (let index = 0; index < 42; index++) {
      const number = index - first + 1;
      const date = new Date(year, month, number);
      const actual = number < 1 ? previousDays + number : number > days ? number - days : number;
      const muted = number < 1 || number > days;
      const key = date.toISOString().slice(0, 10);
      const cell = document.createElement('button');
      cell.className = 'calendar-day' + (muted ? ' muted' : '');
      cell.innerHTML = '<span class="day-number">' + actual + '</span>';
      const events = InkStorage.data.calendar[key]?.events || [];
      events.slice(0, 3).forEach(event => {
        const chip = document.createElement('div');
        chip.className = 'calendar-event-chip';
        chip.style.setProperty('--event-color', event.color || '#8b7cf6');
        chip.textContent = (event.time ? event.time + ' ' : '') + event.title;
        chip.title = event.title;
        cell.appendChild(chip);
      });
      if (events.length > 3) {
        const more = document.createElement('div');
        more.className = 'calendar-more-events';
        more.textContent = '+' + (events.length - 3) + ' more';
        cell.appendChild(more);
      }
      cell.onclick = () => onSelect(key);
      grid.appendChild(cell);
    }
  }
  function previous() { shown.setMonth(shown.getMonth() - 1); }
  function next() { shown.setMonth(shown.getMonth() + 1); }
  function today() { shown = new Date(); }
  return { render, previous, next, today };
})();
