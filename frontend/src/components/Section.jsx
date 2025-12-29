import styles from './Section.module.css';
import { Plus } from 'lucide-react';

export const Section = ({ title, open, toggle, children, onCreate }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={toggle}>
        <span className={styles.arrow}>
          {open ? "▾" : "▸" }
        </span>
        <span className={styles.title}>{title}</span>
        
        { onCreate && (
          <button 
            className={styles.createButton}
            onClick={(event) => {
              event.stopPropagation();
              onCreate();
            }}
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {open && <div className={styles.list}>{children}</div>}
    </div>
  );
};