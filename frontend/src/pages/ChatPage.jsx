import { ChatSideBar } from "../components/ChatSideBar.jsx";
import { ChatWindow } from "../components/ChatWindow.jsx";
import { NavBar } from "../components/NavBar.jsx";
import styles from './ChatPage.module.css';

export const ChatPage = () => {
  return (
    <>
      <NavBar />
      <div className={styles.chatPageContainer}>
        <ChatSideBar />
        <ChatWindow />
      </div>
    </>
  )
}
