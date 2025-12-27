import styles from './ChatWindow.module.css';
import { useChatStore } from '../stores/useChatStore';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useAuthStore } from '../stores/useAuthStore';

export const ChatWindow = () => {
  const selectedConversation = useChatStore(state => state.selectedConversation);
  const authUser = useAuthStore(state => state.authUser);

  if (!selectedConversation) {
    return (
    <div>
      Hãy chọn một cuộc hội thoại để tiếp tục
    </div>
    );
  }

  return (
    <div className={styles.chatWindowContainer}>
      <ChatHeader conversation={selectedConversation} authUser={authUser} />
      <MessageList />
      <ChatInput />
    </div>
  )
}
