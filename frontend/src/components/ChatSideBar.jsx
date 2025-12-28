import { useEffect, useState } from 'react';
import { useChatStore } from '../stores/useChatStore.js';
import { useAuthStore } from '../stores/useAuthStore.js';
import { ConversationItem } from './ConversationItem.jsx';
import styles from './ChatSideBar.module.css';
import { Section } from './Section.jsx';

export const ChatSideBar = () => {
  const authUser = useAuthStore(state => state.authUser);
  const isLoadingConversations = useChatStore(state => state.isLoadingConversations);
  const isCreatingConversation = useChatStore(state => state.isCreatingConversation);
  const conversations = useChatStore(state => state.conversations);
  const fetchConversations = useChatStore(state => state.fetchConversations);
  const createConversation = useChatStore(state => state.createConversation);

  useEffect(() => {
    fetchConversations();
  }, []);

  const [showGroupChat, setShowGroupChat] = useState(false);
  const [showPersonalChat, setShowPersonalChat] = useState(false);

  const groupConversations = conversations.filter((conversation) => conversation.type === "group");
  const personalConversations = conversations.filter((conversation) => conversation.type === "personal");

  return (
    <div className={styles.sidebar}>
      {/* PERSONAL */}
      <Section
        title="Chat cá nhân"
        open={showPersonalChat}
        toggle={() => setShowPersonalChat(!showPersonalChat)}
      >
        {personalConversations.map(c => (
          <ConversationItem
            key={c.id}
            conversation={c}
            authUser={authUser}
          />
        ))}
      </Section>

      {/* GROUP */}
      <Section
        title="Chat nhóm"
        open={showGroupChat}
        toggle={() => setShowGroupChat(!showGroupChat)}
      >
        {groupConversations.map(c => (
          <ConversationItem
            key={c.id}
            conversation={c}
            authUser={authUser}
          />
        ))}
      </Section>
    </div>
  );
};

