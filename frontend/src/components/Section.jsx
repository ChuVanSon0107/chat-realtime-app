import styles from './Section.module.css';
import { Plus } from 'lucide-react';

export const Section = ({ title, open, toggle, onCreate }) => {
  return (
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
  );
};