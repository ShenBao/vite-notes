import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import appStyles from './App.module.scss'
import Test from './Test'

console.log('appStyles:', appStyles);

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className={appStyles.logo}>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={appStyles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={appStyles['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
      <Test/>
    </>
  )
}

export default App
