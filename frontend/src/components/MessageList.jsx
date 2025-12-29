import { useEffect, useRef } from 'react';
import styles from './MessageList.module.css';
import { Message } from './Message.jsx';

export const MessageList = ({ messages, authUser, fetchMessages, hasMore, cursor, conversation, isLoadingMessages }) => {
  // container
  const containerRef = useRef(null);

  // Load lần đầu
  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  const handleScroll = async () => {
    const element = containerRef.current;
    if (!element || !hasMore) return;

    if (element.scrollTop < 50) {
      const oldHeight = element.scrollHeight;

      await fetchMessages(conversation.id, cursor);
      
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight - oldHeight;
      });
    }
  }

  if (!messages || messages.length === 0) {
    return (
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className={styles.container}
      >
        <div className={styles.emptyContainer}>
          <div className={styles.empty}>Chưa có tin nhắn nào</div>
        </div>
      </div>);
  } 

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className={styles.container}
    >
      { hasMore && (
        <div className={styles.loading}>Đang tải...</div>
      ) }

      { messages.map((message) => {
        return (
          <Message 
            key={message.id} 
            message={message}
            authUser={authUser}
          />
        )
      }) }
    </div>
  )
}
