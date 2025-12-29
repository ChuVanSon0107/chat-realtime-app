import styles from './ChatWindow.module.css';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const ChatWindow = ({ authUser, messages, selectedConversation, selectConversation, hasMore, cursor, isSendingMessage, sendMessage, isLoadingMessages, fetchMessages }) => {
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
      />
      <MessageList 
        messages={messages} 
        authUser={authUser} 
        fetchMessages={fetchMessages}  
        hasMore={hasMore}
        cursor={cursor}
        conversation={selectedConversation}
        isLoadingMessages={isLoadingMessages}
      />
      <ChatInput 
        sendMessage={sendMessage} 
        conversation={selectedConversation}
        isSendingMessage={isSendingMessage}
      />
    </div>
  )
}
