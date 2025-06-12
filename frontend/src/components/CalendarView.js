import './CalendarStyles.css';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (date) => {
    return date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');
  };

  // Grupowanie zadań według daty (yyyy-mm-dd)
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.deadline) return acc;
    const date = formatDate(new Date(task.deadline));
    acc[date] = [...(acc[date] || []), task];
    return acc;
  }, {});

  const tileContent = ({ date }) => {
  const day = formatDate(new Date(date));
  const tasksForDay = tasksByDate[day];

  // Kropki na zadania w danym dniu
  return tasksForDay ? (
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '8px',
          backgroundColor: '#094adb',
          color: 'white',
          borderRadius: '50%',
          fontSize: '0.7em',
          width: '1.4em',
          height: '1.4em',
          lineHeight: '1.4em',
          textAlign: 'center',
          fontWeight: 'bold'
        }}
      >
        {tasksForDay.length}
      </div>
    ) : null;
  };


  return (
    <div
      style={{
        margin: '2em auto',
        padding: '1em',
        maxWidth: '600px',
        width: '100%',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}
    >
      <h3 style={{
        textAlign: 'center',
        fontSize: '1.2em',
        marginBottom: '0.5em'
      }}>
        📅 Zadania w kalendarzu
      </h3>

      <Calendar
        onClickDay={(value) => setSelectedDate(formatDate(value))}
        tileContent={tileContent}
        className="custom-calendar"
      />

      {selectedDate && (
        <div style={{ marginTop: '1em' }}>
          <h4 style={{ textAlign: 'center' }}>Zadania na {selectedDate}:</h4>
          <ul>
            {(tasksByDate[selectedDate] || []).map(task => (
              <li key={task._id}>
                {task.title} {task.done ? '✅' : '❌'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
