import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';

function App() {
  const [taskLists, setTaskLists] = useState(() => {
    const savedTaskLists = localStorage.getItem('taskLists');
    return savedTaskLists ? JSON.parse(savedTaskLists) : [{ name: 'Default', tasks: [] }];
  });

  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState(new Date());
  const [filter, setFilter] = useState('all');

  const taskRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('taskLists', JSON.stringify(taskLists));
  }, [taskLists]);

  // Handle adding a new task list
  const handleAddList = () => {
    const newListName = prompt('Enter the new list name:');
    if (newListName && newListName.trim() !== '') {
      setTaskLists([...taskLists, { name: newListName, tasks: [] }]);
    }
  };

  // Handle deleting a task list
  const handleDeleteList = (index) => {
    if (window.confirm(`Are you sure you want to delete the list "${taskLists[index].name}"?`)) {
      const updatedTaskLists = taskLists.filter((_, i) => i !== index);
      setTaskLists(updatedTaskLists);
      setSelectedListIndex(0); // Reset to the first list if the deleted list was selected
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObject = {
        text: newTask,
        completed: false,
        priority,
        dueDate: dueDate ? dueDate.toISOString() : null,
        subtasks: [],
        note: ''
      };
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[selectedListIndex].tasks = [...updatedTaskLists[selectedListIndex].tasks, newTaskObject];
      setTaskLists(updatedTaskLists);
      setNewTask('');
      setPriority('Low');
      setDueDate(new Date());
    }
  };

  // Handle adding a note to a task
  const handleAddNote = (index) => {
    const currentNote = taskLists[selectedListIndex].tasks[index]?.note || '';
    const note = prompt('Add a note to the task:', currentNote);
    if (note !== null) {
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[selectedListIndex].tasks[index].note = note.trim();
      setTaskLists(updatedTaskLists);
    }
  };

  // Handle adding a subtask
  const handleAddSubtask = (taskIndex) => {
    const subtask = prompt('Enter a subtask:');
    if (subtask && subtask.trim() !== '') {
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[selectedListIndex].tasks[taskIndex].subtasks.push({
        text: subtask,
        completed: false,
      });
      setTaskLists(updatedTaskLists);
    }
  };

  // Handle toggling a task as completed or incomplete
  const handleToggleTask = (index) => {
    const updatedTaskLists = [...taskLists];
    updatedTaskLists[selectedListIndex].tasks[index].completed = !updatedTaskLists[selectedListIndex].tasks[index].completed;
    setTaskLists(updatedTaskLists);
  };

  // Handle toggling a subtask as completed or incomplete
  const handleToggleSubtask = (taskIndex, subtaskIndex) => {
    const updatedTaskLists = [...taskLists];
    const subtask = updatedTaskLists[selectedListIndex].tasks[taskIndex].subtasks[subtaskIndex];
    subtask.completed = !subtask.completed;
    setTaskLists(updatedTaskLists);
  };

  // Handle editing a task
  const handleEditTask = (index) => {
    const editedTask = prompt('Edit the task:', taskLists[selectedListIndex].tasks[index].text);
    if (editedTask !== null) {
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[selectedListIndex].tasks[index].text = editedTask.trim();
      setTaskLists(updatedTaskLists);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (index) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[selectedListIndex].tasks = updatedTaskLists[selectedListIndex].tasks.filter((_, i) => i !== index);
      setTaskLists(updatedTaskLists);
    }
  };

  // Filtering tasks based on status
  const filteredTasks =
    taskLists[selectedListIndex]?.tasks.filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    }) || [];

  return (
    <div className="app-container">
      <h1 className="app-title">React To-Do List</h1>

      {/* Progress Bar */}
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${filteredTasks.length ? (filteredTasks.filter((task) => task.completed).length / filteredTasks.length) * 100 : 0}%`,
          }}
        ></div>
        <span className="progress-text">
          {filteredTasks.length ? Math.round((filteredTasks.filter((task) => task.completed).length / filteredTasks.length) * 100) : 0}%
          Completed
        </span>
      </div>

      {/* Task List Selector */}
      <div className="task-list-selector">
        {taskLists.map((list, index) => (
          <div key={index} className="task-list-button-container">
            <button
              onClick={() => setSelectedListIndex(index)}
              className={`group-button ${selectedListIndex === index ? 'active' : ''}`}
            >
              {list.name}
            </button>
            <button onClick={() => handleDeleteList(index)} className="delete-list-button" title="Delete List">
              &times;
            </button>
          </div>
        ))}
        <button onClick={handleAddList} className="add-list-button">
          + Add List
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>
          All
        </button>
        <button onClick={() => setFilter('completed')} className={`filter-button ${filter === 'completed' ? 'active' : ''}`}>
          Completed
        </button>
        <button onClick={() => setFilter('incomplete')} className={`filter-button ${filter === 'incomplete' ? 'active' : ''}`}>
          Incomplete
        </button>
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
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} className="date-picker" />
        <button onClick={handleAddTask} className="add-button">
          Add
        </button>
      </div>

      {/* Task List Section */}
      <TransitionGroup component="ul" className="task-list">
        {filteredTasks.map((task, index) => (
          <CSSTransition key={index} timeout={500} classNames="task" nodeRef={taskRef}>
            <li ref={taskRef} className={`task-item ${task.priority.toLowerCase()}`}>
              <div>
                <span onClick={() => handleToggleTask(index)} className="task-text" title="Toggle Complete">
                  {task.text}
                </span>
                {task.note && <p className="task-note">Note: {task.note}</p>}
              </div>

              {/* Subtask Section */}
              {task.subtasks?.length > 0 && (
                <ul className="subtask-list">
                  {task.subtasks.map((subtask, subIndex) => (
                    <li
                      key={subIndex}
                      className={`subtask-item ${subtask.completed ? 'completed' : ''}`}
                      onClick={() => handleToggleSubtask(index, subIndex)}
                    >
                      {subtask.text}
                    </li>
                  ))}
                </ul>
              )}

              {/* Button to Add Subtask */}
              <button onClick={() => handleAddSubtask(index)} className="add-subtask-button">
                Add Subtask
              </button>

              {/* Edit, Note, and Delete Buttons */}
              <div className="button-container">
                <button onClick={() => handleEditTask(index)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleAddNote(index)} className="add-note-button">
                  Note
                </button>
                <button onClick={() => handleDeleteTask(index)} className="delete-button">
                  Delete
                </button>
              </div>
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default App;










