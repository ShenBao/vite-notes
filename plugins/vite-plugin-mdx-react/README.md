# vite-plugin-mdx-react

Vite Plugin MDX React

example：
- https://github.com/ShenBao/vite-notes/blob/master/plugin-examples/vite-plugin-mdx-react-example

## Getting Started

1. Install:
   ```
   npm i vite-plugin-mdx-react -D
   ```

2. Add the plugin to your `vite.config.js`.

   ```js
    // vite.config.js

    export default defineConfig({
      plugins: [
        viteMdx(),
        reactRefresh({
          include: /\.(mdx|jsx|tsx)/,
        }),
      ],
    });
   ```

3. You can now write `.mdx` files.

   Hello.mdx
    ```mdx-js
    import { Counter } from './Counter.jsx';

    # Hello Vite MDX React

    This text is written in Markdown.

    MDX allows Rich React components to be used directly in Markdown: <Counter/>

    Edit `Counter.jsx` or `Hello.mdx` and save to experience HMR updates.
    ```

   ```ts
    // App.jsx
    import { useState } from 'react'
    import logo from './logo.svg'
    import './App.css'
    import Hello from './Hello.mdx'

    function App() {
      const [count, setCount] = useState(0)

      return (
        <div className="App">
          <Hello />
        </div>
      )
    }

    export default App
   ```

## More links

- [GitHub Home](https://github.com/ShenBao)
- [Blog Home](https://shenbao.github.io)
- [About Me](https://shenbao.github.io/about/)
