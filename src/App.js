import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    console.log("Loading tasks from LocalStorage...");
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      console.log("Tasks loaded: ", JSON.parse(savedTasks));
    }
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');

  // Save tasks to local storage whenever they change
  useEffect(() => {
    console.log("Saving to LocalStorage: ", tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObject = { text: newTask, completed: false };
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTaskObject];
        console.log("Adding Task: ", newTaskObject);
        console.log("Updated Task List: ", updatedTasks);
        return updatedTasks;
      });
      setNewTask('');
    }
  };

  const handleToggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">React To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-button">Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <span onClick={() => handleToggleTask(index)} className="task-text">
              {task.text}
            </span>
            <button onClick={() => handleDeleteTask(index)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
