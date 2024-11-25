import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

function App() {
  // Load tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(null);
  const [editedText, setEditedText] = useState('');

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle adding a new task
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObject = {
        text: newTask,
        completed: false,
        priority,
        dueDate: dueDate ? dueDate.toISOString() : null,
      };
      setTasks((prevTasks) => [...prevTasks, newTaskObject]);
      setNewTask('');
      setPriority('Low');
      setDueDate(new Date());
    }
  };

  // Handle task completion toggle
  const handleToggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Handle task deletion
  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Handle task editing
  const handleEditTask = (index) => {
    setIsEditing(index);
    setEditedText(tasks[index].text);
  };

  // Handle save after editing a task
  const handleSaveEdit = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editedText } : task
    );
    setTasks(updatedTasks);
    setIsEditing(null);
    setEditedText('');
  };

  // Filtering tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <h1 className="app-title">React To-Do List</h1>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
        <span className="progress-text">{completionPercentage}% Completed</span>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>All</button>
        <button onClick={() => setFilter('completed')} className={`filter-button ${filter === 'completed' ? 'active' : ''}`}>Completed</button>
        <button onClick={() => setFilter('incomplete')} className={`filter-button ${filter === 'incomplete' ? 'active' : ''}`}>Incomplete</button>
      </div>

      {/* Input Section for Adding New Task */}
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          className="date-picker"
          dateFormat="MM/dd/yyyy"
        />
        <button onClick={handleAddTask} className="add-button">Add</button>
      </div>

      {/* Task List Section */}
      {/* Task List Section */}
<TransitionGroup className="task-list">
  {filteredTasks.map((task, index) => (
    <CSSTransition
      key={index}
      timeout={500}
      classNames="task"
    >
      <li className={`task-item ${task.completed ? 'completed' : ''} ${task.priority ? task.priority.toLowerCase() : 'low'}`}>
        {isEditing === index ? (
          // Editing Task Input
          <>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="task-input edit-input"
            />
            <button onClick={() => handleSaveEdit(index)} className="add-button">Save</button>
            <button onClick={() => setIsEditing(null)} className="delete-button">Cancel</button>
          </>
        ) : (
          <>
            <span onClick={() => handleToggleTask(index)} className="task-text">
              {task.text}
            </span>
            <span className={`priority-badge ${task.priority ? task.priority.toLowerCase() : 'low'}`}>{task.priority || 'Low'}</span>
            <div className="due-date-container">
              <span className="due-date-arrow">➞</span>
              <span className="due-date">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not Set'}</span>
            </div>
            <div className="button-container">
              <button onClick={() => handleEditTask(index)} className="edit-button">Edit</button>
              <button onClick={() => handleDeleteTask(index)} className="delete-button">Delete</button>
            </div>
          </>
        )}
      </li>
    </CSSTransition>
  ))}
</TransitionGroup>

    </div>
  );
}

export default App;
