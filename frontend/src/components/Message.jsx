import styles from './Message.module.css';

export const Message = ({ message, authUser }) => {
  const isMine = (Number(message.senderId) === Number(authUser.id));

  return (
    <div className={`${styles.row} ${isMine ? styles.mine : styles.other}`} >
      { !isMine && (
        <img 
          src={message.profilePic || "/images/avatar.png"}
          className={styles.avatar}
        />
      ) }
      <div className={styles.content}>
        <div className={styles.bubble}>
          { message.image && (
            <img 
              src={message.image}
              className={styles.image}
            />

          ) }

          { message.content && (
            <p className={styles.text}>{ message.content }</p>
          ) }
        </div>

        <span className={isMine ? styles.rightTime : styles.leftTime}>
          { new Date(message.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }) }
        </span>
      </div>
    </div>
  )
}
