import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(null); // wybrana data

  // formatuj datę do "YYYY-MM-DD"
  const formatDate = date => date.toISOString().slice(0, 10);

  // grupowanie zadań po dacie
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.deadline) return acc;
    const date = formatDate(new Date(task.deadline));
    acc[date] = [...(acc[date] || []), task];
    return acc;
  }, {});

  // kropka jeśli są zadania w danym dniu
  const tileContent = ({ date }) => {
    const day = formatDate(date);
    if (tasksByDate[day]) {
      return <div style={{ textAlign: 'center', color: 'tomato' }}>•</div>;
    }
    return null;
  };

  return (
    <div style={{
      margin: '2em auto',
      padding: '1em',
      maxWidth: '600px',
      width: '100%',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ textAlign: 'center', fontSize: '1.2em' }}>📅 Zadania w kalendarzu</h3>

      {/* kalendarz z zaznaczonymi dniami */}
      <Calendar
        onClickDay={value => setSelectedDate(formatDate(value))}
        tileContent={tileContent}
        className="custom-calendar"
      />

      {/* lista zadań na wybrany dzień */}
      {selectedDate && (
        <div style={{ marginTop: '1em' }}>
          <h4>Zadania na {selectedDate}:</h4>
          <ul>
            {(tasksByDate[selectedDate] || []).map(t => (
              <li key={t._id}>
                {t.title} {t.done ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
