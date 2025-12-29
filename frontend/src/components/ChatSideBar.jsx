import { useState } from 'react';
import { ConversationItem } from './ConversationItem.jsx';
import styles from './ChatSideBar.module.css';
import { Section } from './Section.jsx';

export const ChatSideBar = ({ authUser, conversations, selectConversation, selectedConversation, fetchMessages, cursor, setShowPersonalModal,setShowGroupModal }) => {
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
        onCreate={() => setShowPersonalModal(true)}
      >
        {personalConversations.map(c => (
          <ConversationItem
            key={c.id}
            conversation={c}
            authUser={authUser}
            selectConversation={selectConversation}
            selectedConversation={selectedConversation}
            fetchMessages={fetchMessages}
            cursor={cursor}
          />
        ))}
      </Section>

      {/* GROUP */}
      <Section
        title="Chat nhóm"
        open={showGroupChat}
        toggle={() => setShowGroupChat(!showGroupChat)}
        onCreate={() => setShowGroupModal(true)}
      >
        {groupConversations.map(c => (
          <ConversationItem
            key={c.id}
            conversation={c}
            authUser={authUser}
            selectConversation={selectConversation}
            selectedConversation={selectedConversation}
            fetchMessages={fetchMessages}
            cursor={cursor}
          />
        ))}
      </Section>
    </div>
  );
};

