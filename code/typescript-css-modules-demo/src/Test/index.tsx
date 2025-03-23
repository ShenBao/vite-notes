import styles from "./index.module.scss";
const Test = () => {
  return (
    <div className={styles.testPage}>
      <div className={`${styles.text} ${styles.bg}`}>
        texttexttexttext
        <span className={`${styles.red} ${styles.bg}`}>redred</span>
      </div>
    </div>
  );
};

export default Test;
