import styles from "./App.module.scss";

console.log(styles);

function App() {
  return (
    <div className="app">
      <div className={styles.container}>
        <h1 className={styles.title}>Hello SCSS Modules + TS</h1>
        <p
          className={`${styles.test} ${styles["test-a"]} ${styles["test-b"]}`}
        ></p>
      </div>
    </div>
  );
}

export default App;
