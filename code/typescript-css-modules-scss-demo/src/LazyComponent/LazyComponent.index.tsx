import styles from "./LazyComponent.module.css";

console.log(styles);

export default function LazyComponent() {
  return <div className={styles.container}>Lazy Component</div>;
}
