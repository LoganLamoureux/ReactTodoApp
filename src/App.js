import React from 'react';
import './App.css';
//import Todos from './components/Todos';
import { useState } from 'react';

function Todo({ todo, index, completeTodo, removeTodo }) {
  return(
    <div style={{textDecoration: todo.isCompleted ? 'line-through' : ''}} className="todo">
      { todo.text }
      <div>
        <button onClick={() => completeTodo(index)}>Complete</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  )
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if(!value) return;
    addTodo(value);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
      type="text" 
      className="input" 
      value={value} 
      placeholder="Add Todo..."
      onChange={e => setValue(e.target.value)} />
    </form>
  )
}

function App() {
  const [todos, setTodos] = useState([
    {
      text: 'Take out the trash',
      isCompleted: false
    },
    {
      text: 'Dinner with wife',
      isCompleted: false
    },
    {
      text: 'Meeting with boss',
      isCompleted: false
    }
  ]);

  const addTodo = text => {
    // Spread operator copies the old todos and adds { text }, this is then saved to NewTodos
    const newTodos = [...todos, { text }];
    // Now we set the list of todos with the new list we created above
    setTodos(newTodos);
  };

  const completeTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  }

  return (
    <div className="App">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo key={index} index={index} todo={todo} completeTodo={completeTodo} removeTodo={removeTodo}/>
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;
