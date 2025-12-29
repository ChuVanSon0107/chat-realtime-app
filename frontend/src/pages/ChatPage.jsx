import { useEffect, useState } from "react";
import { ChatSideBar } from "../components/ChatSideBar.jsx";
import { ChatWindow } from "../components/ChatWindow.jsx";
import { NavBar } from "../components/NavBar.jsx";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useChatStore } from "../stores/useChatStore.js";
import { useFriendStore } from "../stores/useFriendStore.js";
import styles from './ChatPage.module.css';
import { CreatePersonalConversationModal } from "../components/CreatePersonalConversationModal.jsx";
import { CreateGroupConversationModal } from "../components/CreateGroupConversationModal.jsx";

export const ChatPage = () => {
  const authUser = useAuthStore(state => state.authUser);
  const conversations = useChatStore(state => state.conversations);
  const selectConversation = useChatStore(state => state.selectConversation);
  const selectedConversation = useChatStore(state => state.selectedConversation);
  const messages = useChatStore(state => state.messages);
  const fetchMessages = useChatStore(state => state.fetchMessages);
  const hasMore = useChatStore(state => state.hasMore);
  const cursor = useChatStore(state => state.cursor);
  const isLoadingMessages = useChatStore(state => state.isLoadingMessages);
  const sendMessage = useChatStore(state => state.sendMessage);
  const isSendingMessage = useChatStore(state => state.isSendingMessage);
  const fetchConversations = useChatStore(state => state.fetchConversations);
  const friends = useFriendStore(state => state.friends);
  const fetchFriends = useFriendStore(state => state.fetchFriends)
  const createConversation = useChatStore(state =>  state.createConversation);
  const isCreatingConversation = useChatStore(state => state.isCreatingConversation);

  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchFriends();
  }, [fetchConversations, fetchFriends]);

  return (
    <div className={styles.app}>
      <NavBar />
      <div className={styles.chatPageContainer}>
        <ChatSideBar 
          authUser={authUser}
          conversations={conversations}
          selectConversation={selectConversation}
          selectedConversation={selectedConversation}
          fetchMessages={fetchMessages}
          setShowPersonalModal={setShowPersonalModal}
          setShowGroupModal={setShowGroupModal}
        />
        <ChatWindow
          authUser={authUser}
          messages={messages}
          selectConversation={selectConversation}
          selectedConversation={selectedConversation}
          hasMore={hasMore}
          cursor={cursor}
          isSendingMessage={isSendingMessage}
          sendMessage={sendMessage}
          isLoadingMessages={isLoadingMessages}
          fetchMessages={fetchMessages}
        />
      </div>

      { showPersonalModal && (
        <CreatePersonalConversationModal 
          friends={friends}
          createConversation={createConversation}
          onClose={() => setShowPersonalModal(false)}
          isCreatingConversation={isCreatingConversation}
        />
      ) }

      {
        showGroupModal && ( 
        <CreateGroupConversationModal
          friends={friends}
          createConversation={createConversation}
          onClose={() => setShowGroupModal(false)}
          isCreatingConversation={isCreatingConversation}
        />)
      }
    </div>
  )
}
