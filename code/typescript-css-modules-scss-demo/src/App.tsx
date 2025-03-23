import { lazy, Suspense } from "react";
import "./App.css";
// import LazyComponent from "./LazyComponent";
const LazyComponent = lazy(() => import('./LazyComponent/LazyComponent.index'));
import './test';

function App() {
  return (
    <>
      <div>Vite + React</div>
      <Suspense fallback="Loading...">
        <LazyComponent />
      </Suspense>
    </>
  );
}

export default App;
