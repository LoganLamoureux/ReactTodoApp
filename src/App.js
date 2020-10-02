import React from 'react';
import './App.css';
//import Todos from './components/Todos';
import { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';

// function Todo({ todo, index, completeTodo, removeTodo }) {
//   return(
//     <div style={{textDecoration: todo.isCompleted ? 'line-through' : ''}} className="todo">
//       { todo.text }
//       <div>
//         <button onClick={() => completeTodo(index)}>Complete</button>
//         <button onClick={() => removeTodo(index)}>x</button>
//       </div>
//     </div>
//   )
// }

// function TodoForm({ addTodo }) {
//   const [value, setValue] = useState('');

//   const handleSubmit = e => {
//     e.preventDefault();
//     if(!value) return;
//     addTodo(value);
//     setValue('');
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input 
//       type="text" 
//       className="input" 
//       value={value} 
//       placeholder="Add Todo..."
//       onChange={e => setValue(e.target.value)} />
//     </form>
//   )
// }

// function App() {
//   const [todos, setTodos] = useState([
//     {
//       text: 'Take out the trash',
//       isCompleted: false
//     },
//     {
//       text: 'Dinner with wife',
//       isCompleted: false
//     },
//     {
//       text: 'Meeting with boss',
//       isCompleted: false
//     }
//   ]);


//   const addTodo = text => {
//     // Spread operator copies the old todos and adds { text }, this is then saved to NewTodos
//     const newTodos = [...todos, { text }];
//     // Now we set the list of todos with the new list we created above
//     setTodos(newTodos);
//   };

//   const completeTodo = index => {
//     const newTodos = [...todos];
//     newTodos[index].isCompleted = true;
//     setTodos(newTodos);
//   };

//   const removeTodo = index => {
//     const newTodos = [...todos];
//     newTodos.splice(index, 1);
//     setTodos(newTodos);
//   }

//   return (
//     <div className="App">
//       <div className="todo-list">
//         {todos.map((todo, index) => (
//           <Todo key={index} index={index} todo={todo} completeTodo={completeTodo} removeTodo={removeTodo}/>
//         ))}
//         <TodoForm addTodo={addTodo} />
//       </div>
//       <AmplifySignOut />
//     </div>
//   );
//}

const initialFormState = { name: '', description: '' }

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    setTodos(apiData.data.listTodos.items);
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createTodoMutation, variables: { input: formData } });
    setTodos([...todos, formData ]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newTodosArray = todos.filter(todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodoMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Todo name"
        value={formData.name}
        />

      <input 
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Todo description"
        value={formData.description}
      />
      
      <button onClick={createTodo}>Create Todo</button>
      <div style={{marginBottom: 30}}>
        {
          todos.map(todo => (
            <div key={todo.id || todo.name}>
              <h2>{todo.name}</h2>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(todo)}>Delete Todo</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
