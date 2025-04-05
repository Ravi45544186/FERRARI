import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);  // To handle loading state
  const [error, setError] = useState('');  // To handle error state

  const apiUrl = 'https://mustang-k8xi.onrender.com'; // Replace with your backend URL

  // Fetch todos from the backend
  useEffect(() => {
    setLoading(true);
    axios.get(`${apiUrl}/todos`)
      .then(response => {
        setTodos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
        setError('Error fetching todos');
        setLoading(false);
      });
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo) return; // Do not add if input is empty

    const todoData = {
      text: newTodo,
      completed: false,  // New todo should be initially incomplete
    };

    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post(`${apiUrl}/todos`, todoData);
      console.log('Todo added:', response.data);
      setTodos([...todos, response.data]);  // Add the new todo to the state
      setNewTodo('');  // Clear input field
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Error adding todo');
    } finally {
      setLoading(false);
    }
  };

  // Toggle completion status of a to-do
  const toggleTodo = (id) => {
    const todo = todos.find(t => t._id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    setLoading(true);
    setError(''); // Clear any previous errors

    axios.put(`${apiUrl}/todos/${id}`, updatedTodo)
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo._id === id ? response.data : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error toggling todo:', error);
        setError('Error toggling todo');
      })
      .finally(() => setLoading(false));
  };

  // Remove a to-do
  const removeTodo = (id) => {
    setLoading(true);
    setError(''); // Clear any previous errors

    axios.delete(`${apiUrl}/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));  // Remove the todo from state
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        setError('Error deleting todo');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>

      {loading && <p>Loading...</p>} {/* Show loading indicator */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}

      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new to-do"
      />
      <button onClick={addTodo} disabled={loading}>Add</button>

      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <span onClick={() => toggleTodo(todo._id)} style={{ cursor: 'pointer' }}>
              {todo.text}
            </span>
            <button onClick={() => removeTodo(todo._id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
