import styles from './Message.module.css';
import formatDateTime from '../lib/formatDateTime.js';

export const Message = ({ message, authUser }) => {
  const isMine = (Number(message.senderId) === Number(authUser.id));

  return (
    <div className={`${styles.row} ${isMine ? styles.mine : styles.other}`} >
      { !isMine && (
      <div className={styles.tip} data-tooltip={message.fullName}>
        <img 
          src={message.profilePic || "/images/avatar.png"}
          className={styles.avatar}
        />
      </div>
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
          { formatDateTime(message.createdAt) }
        </span>
      </div>
    </div>
  )
}
