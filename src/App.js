import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const apiUrl = 'https://mustang-k8xi.onrender.com'; // Replace with your backend URL

  // Fetch todos from the backend
  useEffect(() => {
    axios.get(`${apiUrl}/todos`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo) return; // Do not add if input is empty

    const todoData = {
      text: newTodo,
      completed: false,  // New todo should be initially incomplete
    };

    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Todo added:', data);
      setTodos([...todos, data]);  // Add the new todo to the state
      setNewTodo('');  // Clear input field
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Toggle completion status of a to-do
  const toggleTodo = (id) => {
    const todo = todos.find(t => t._id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    axios.put(`${apiUrl}/todos/${id}`, updatedTodo)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo._id === id ? response.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error toggling todo:', error));
  };

  // Remove a to-do
  const removeTodo = (id) => {
    axios.delete(`${apiUrl}/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));  // Remove the todo from state
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>

      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new to-do"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo._id)}>{todo.text}</span>
            <button onClick={() => removeTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
