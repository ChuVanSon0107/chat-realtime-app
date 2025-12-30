import { useState } from 'react';
import styles from './ChatInput.module.css';
import { Camera, Send } from 'lucide-react';

export const ChatInput = ({ sendMessage, isSendingMessage }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // giới hạn size
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh tối đa 5MB");
      return;
    }

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setImage(base64Image);
    };
  };

  const handleSendMessage = async () => {
    if (isSendingMessage) return;
    if (!text.trim() && !image) return;

    await sendMessage(text, image);
    setText("");
    setPreview(null);
    setImage(null);
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
            }}
          >✕</button>
        </div>
      ) }

      <div className={styles.inputRow}>
        <label>
          <Camera className={styles.cameraIcon} />
          <input 
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
