import styles from './Section.module.css';

export const Section = ({ title, open, toggle, children }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={toggle}>
        <span>{title}</span>
        <span>{open ? "▾" : "▸"}</span>
      </div>

      {open && <div className={styles.list}>{children}</div>}
    </div>
  );
};