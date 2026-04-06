import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Built with <span className={styles.heart}>&hearts;</span> using{' '}
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          React
        </a>{' '}
        and{' '}
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          Vite
        </a>
        .{' '}
        <a href="https://github.com/AhsanAyaz/angular2-hn" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  );
}
