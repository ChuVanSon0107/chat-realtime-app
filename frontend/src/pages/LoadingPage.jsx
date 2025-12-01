import { Loader } from "lucide-react";
import styles from "./LoadingPage.module.css";

export const LoadingPage = () => {
  return (
    <div className={styles.loaderContainer}>
      <Loader className={styles.loaderIcon} />
    </div>
  );
}

