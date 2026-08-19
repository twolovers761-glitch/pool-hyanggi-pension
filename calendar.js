const CALENDAR_WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

function calPad2(n) {
  return String(n).padStart(2, '0');
}

function calDateStr(year, month, day) {
  return `${year}-${calPad2(month + 1)}-${calPad2(day)}`;
}

// container: element to render into
// blockedDates: Set<'YYYY-MM-DD'> (read fresh on every render)
// mode: 'view' (read-only) | 'admin' (any date clickable, calls onDayClick(dateStr))
//       | 'picker' (only non-blocked, non-past dates clickable/selectable)
// selectedDate: 'YYYY-MM-DD' | null — highlighted cell, only meaningful in 'picker' mode
function createCalendar({ container, blockedDates, mode = 'view', onDayClick, initialDate = new Date(), selectedDate = null }) {
  let year = initialDate.getFullYear();
  let month = initialDate.getMonth();
  let selected = selectedDate;

  function render() {
    const today = new Date();
    const todayStr = calDateStr(today.getFullYear(), today.getMonth(), today.getDate());

    const startWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = startWeekday - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, otherMonth: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, otherMonth: false, dateStr: calDateStr(year, month, d) });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: cells.length - startWeekday - daysInMonth + 1, otherMonth: true });
    }

    const dayCellsHtml = cells.map((c) => {
      if (c.otherMonth) {
        return `<span class="calendar-day other-month">${c.day}</span>`;
      }
      const isBlocked = blockedDates.has(c.dateStr);
      const isPast = c.dateStr < todayStr;
      const classes = ['calendar-day'];
      if (isBlocked) classes.push('blocked');
      if (c.dateStr === todayStr) classes.push('today');
      if (c.dateStr === selected) classes.push('selected');
      if (mode === 'admin') {
        classes.push('clickable');
      } else if (mode === 'picker') {
        classes.push(isBlocked || isPast ? 'disabled' : 'clickable');
      }
      return `<span class="${classes.join(' ')}" data-date="${c.dateStr}">${c.day}</span>`;
    }).join('');

    container.innerHTML = `
      <div class="calendar-header">
        <button type="button" class="cal-nav" data-nav="prev" aria-label="이전 달">‹</button>
        <span class="cal-title">${year}년 ${month + 1}월</span>
        <button type="button" class="cal-nav" data-nav="next" aria-label="다음 달">›</button>
      </div>
      <div class="calendar-weekdays">${CALENDAR_WEEKDAYS_KO.map((w) => `<span>${w}</span>`).join('')}</div>
      <div class="calendar-grid">${dayCellsHtml}</div>
    `;

    container.querySelector('[data-nav="prev"]').addEventListener('click', () => {
      month -= 1;
      if (month < 0) { month = 11; year -= 1; }
      render();
    });
    container.querySelector('[data-nav="next"]').addEventListener('click', () => {
      month += 1;
      if (month > 11) { month = 0; year += 1; }
      render();
    });

    if (mode === 'admin' && onDayClick) {
      container.querySelectorAll('.calendar-day.clickable').forEach((el) => {
        el.addEventListener('click', () => onDayClick(el.dataset.date));
      });
    } else if (mode === 'picker') {
      container.querySelectorAll('.calendar-day.clickable').forEach((el) => {
        el.addEventListener('click', () => {
          selected = el.dataset.date;
          render();
          if (onDayClick) onDayClick(selected);
        });
      });
    }
  }

  render();

  return {
    render,
    setBlockedDates(newSet) {
      blockedDates = newSet;
      render();
    },
    setSelectedDate(dateStr) {
      selected = dateStr;
      render();
    },
  };
}
