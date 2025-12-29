import styles from "./FriendTabs.module.css";

export const FriendTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === "friends" ? styles.active : ""}`}
        onClick={() => setActiveTab("friends")}
        type="button"
      >
        Bạn bè
      </button>

      <button
        className={`${styles.tab} ${activeTab === "requests" ? styles.active : ""}`}
        onClick={() => setActiveTab("requests")}
        type="button"
      >
        Lời mời kết bạn
      </button>

      <button
        className={`${styles.tab} ${activeTab === "search" ? styles.active : ""}`}
        onClick={() => setActiveTab("search")}
        type="button"
      >
        Tìm kiếm bạn bè
      </button>
    </div>
  );
};