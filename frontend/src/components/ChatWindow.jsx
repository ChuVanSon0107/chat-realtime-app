import styles from './ChatWindow.module.css';
import { useChatStore } from '../stores/useChatStore';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect } from 'react';

export const ChatWindow = () => {
  const selectedConversation = useChatStore(state => state.selectedConversation);
  const authUser = useAuthStore(state => state.authUser);
  const messages = useChatStore(state => state.messages);
  const fetchMessages = useChatStore(state => state.fetchMessages);
  const hasMore = useChatStore(state => state.hasMore);
  const cursor = useChatStore(state => state.cursor);
  const isLoadingMessages = useChatStore(state => state.isLoadingMessages);
  const sendMessage = useChatStore(state => state.sendMessage);
  const isSendingMessage = useChatStore(state => state.isSendingMessage);

  useEffect(() => {
    if (!selectedConversation) return;
    fetchMessages(selectedConversation.id, null);
  }, [selectedConversation, fetchMessages]);

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
