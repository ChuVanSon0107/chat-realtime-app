import { useState } from 'react';
import styles from './ChatInput.module.css';
import { Camera, Send } from 'lucide-react';
import { useRef } from 'react';

export const ChatInput = ({ sendMessage, isSendingMessage }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // giới hạn size
    if (file.size > 2 * 1024 * 1024) {
      alert("Ảnh tối đa 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSendMessage = async () => {
    if (isSendingMessage) return;
    if (!text.trim() && !image) return;

    await sendMessage(text, image);
    setText("");
    setPreview(null);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* preview ảnh */}
      { preview && (
        <div className={styles.preview}>
          <img src={preview} />
          <button 
            onClick={() => {
              setPreview(null);
              setImage(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >✕</button>
        </div>
      ) }

      <div className={styles.inputRow}>
        <label>
          <Camera className={styles.cameraIcon} />
          <input 
            ref={fileInputRef}
            type='file'
            accept='image/*'
            hidden
            onChange={handleImageChange}
          />
        </label>

        <input
          className={styles.input}
          placeholder='Nhập tin nhắn...'
          value={text}
          onChange={(event) => {
            setText(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
        />

        <button 
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={isSendingMessage}
        >
          <Send className={styles.sendIcon} />
        </button>
      </div>
    </div>
  )
}
