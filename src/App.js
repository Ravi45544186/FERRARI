import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const apiUrl = 'https://mustang-k8xi.onrender.com';
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log('Fetched todos:', data);
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
    });
  

  // Fetch todos from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = async (newTodo) => {
    const apiUrl = 'https://mustang-k8xi.onrender.com/todos';  // Replace with your backend URL
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Todo added:', data);
      // Handle success (maybe update the UI)
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  

  // Toggle completion status of a to-do
  const toggleTodo = (id) => {
    axios.put(`http://localhost:5000/todos/${id}`)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? response.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error toggling todo:', error));
  };

  
// Remove a to-do
const removeTodo = (id) => {
  axios.delete(`http://localhost:5000/todos/${id}`)
    .then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
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
          <li key={todo.id} style={{ textDecoration: todo.isComplete ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
