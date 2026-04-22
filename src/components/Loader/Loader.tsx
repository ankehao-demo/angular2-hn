import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={styles.loadingSection}>
      <div className={styles.loader}>Loading...</div>
    </div>
  );
}
