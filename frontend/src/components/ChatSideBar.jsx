import { useState } from 'react';
import { ConversationItem } from './ConversationItem.jsx';
import styles from './ChatSideBar.module.css';
import { Section } from './Section.jsx';

export const ChatSideBar = ({ authUser, conversations, selectConversation, selectedConversation, setShowPersonalModal,setShowGroupModal }) => {
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [showPersonalChat, setShowPersonalChat] = useState(false);

  return (
    <div className={styles.sidebar}>

      {/* PERSONAL */}
        <Section
          title="Chat cá nhân"
          open={showPersonalChat}
          toggle={() => setShowPersonalChat(!showPersonalChat)}
          onCreate={() => setShowPersonalModal(true)}
        />

        { showPersonalChat && (
          <div className={styles.list}>
            { conversations
              .filter(c => c.type === "personal")
              .map(c => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  authUser={authUser}
                  selectConversation={selectConversation}
                  selectedConversation={selectedConversation}
                />)
              )}
          </div>
        )}

      {/* GROUP */}
      <Section
        title="Chat nhóm"
        open={showGroupChat}
        toggle={() => setShowGroupChat(!showGroupChat)}
        onCreate={() => setShowGroupModal(true)}
      />

        { showGroupChat && (
          <div className={styles.list}>
            { conversations
              .filter(c => c.type === "group")
              .map(c => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  authUser={authUser}
                  selectConversation={selectConversation}
                  selectedConversation={selectedConversation}
                />)
              )}
          </div>
        )}
    </div>
  );
};

