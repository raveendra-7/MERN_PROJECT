import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <form>
        <h1>Todo App</h1>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" required />
        </div> 
        <button type="submit">Add Todo</button>
        <button type="reset">Reset</button> 
      </form>
    </>
  )
}

export default App
