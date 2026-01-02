import styles from './ChatWindow.module.css';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const ChatWindow = ({ authUser, messages, selectedConversation, selectConversation, isSendingMessage, sendMessage, isLoadingMessages, fetchMessages, hasMore, onlineUsers }) => {
  if (!selectedConversation) {
    return (
    <div className={styles.textContainer}>
      <p className={styles.text}>Hãy chọn một cuộc hội thoại để tiếp tục</p>
    </div>
    );
  }


  return (
    <div className={styles.chatWindowContainer}>
      <ChatHeader 
        conversation={selectedConversation} 
        authUser={authUser} 
        selectConversation={selectConversation}
        onlineUsers={onlineUsers}
      />
      <MessageList 
        messages={messages} 
        authUser={authUser} 
        fetchMessages={fetchMessages}  
        isLoadingMessages={isLoadingMessages}
        hasMore={hasMore}
      />
      <ChatInput 
        sendMessage={sendMessage} 
        isSendingMessage={isSendingMessage}
      />
    </div>
  )
}
