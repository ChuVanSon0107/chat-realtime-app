import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create ((set, get) => ({
  // Conversation
  conversations: [],
  selectedConversation: null,
  isLoadingConversations: false,
  isCreatingConversation: false,

  // Message
  messages: [],
  cursor: null,
  hasMore: true,

  isLoadingMessages: false,
  isSendingMessage: false,


  // Lấy danh sách các cuộc hội thoại
  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const res = await axiosInstance.get('/conversations');
      set({ conversations: res.data });
    } catch (error) {
      console.error("❌ Lỗi trong fetchConversations:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingConversations: false });
    }
  },  

  // Tạo cuộc hội thoại
  createConversation: async (name, type, memberIds, groupPic) => {
    set({ isCreatingConversation: true });
    try {
      const res = await axiosInstance.post('/conversations', { name, type, memberIds, groupPic });
      set((state) => ({
        conversations: [...state.conversations, res.data]
      }));
    } catch (error) {
      console.error("❌ Lỗi trong createConversation:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingConversation: false });
    }
  },

  // Chọn cuộc hội thoại
  selectConversation: async (conversation) => {
    const { selectedConversation, resetMessages, fetchMessages } = get();

    if (!conversation) {
      set({ selectedConversation: conversation });
      resetMessages();
    } else {
      if (selectedConversation?.id === conversation.id) return;
      
      set({ selectedConversation: conversation });
      resetMessages();
      await fetchMessages(conversation.id);
    }
  },

  // reset
  resetMessages: () => {
    set({
      messages: [],
      cursor: null,
      hasMore: true,
      isLoadingMessages: false,
      isSendingMessage: false,
    });
  },

  resetChat: () => {
    set({
      selectedConversation: null,
      messages: [],
      cursor: null,
      hasMore: true,
      isLoadingMessages: false,
      isSendingMessage: false,
    });
  },

  // Lấy danh sách tin nhắn
  fetchMessages: async () => {
    const { cursor, hasMore, isLoadingMessages, selectedConversation } = get();
    if (isLoadingMessages || !hasMore) return;

    set({ isLoadingMessages: true });
    try { 
      const res = await axiosInstance.get(`/messages/${selectedConversation?.id}`,  { params: { cursor, limit: 20 } });
      set((state) => ({
        messages: [...res.data.messages, ...state.messages],
        cursor: res.data.nextCursor,
        hasMore: res.data.hasMore
      }));
    } catch (error) {
      console.error("❌ Lỗi trong fetchMessages:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Gửi tin nhắn
  sendMessage: async (content, image) => {
    const { selectedConversation } = get();
    const conversationId = selectedConversation.id;

    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post('messages', { conversationId, content, image });
      set(state => ({
        messages: [...state.messages, res.data],
        conversations: state.conversations.map((c) => 
          c.id === conversationId ? { ...c, lastMessage: res.data} : c
        )
      }));
    } catch (error) {
      console.error("❌ Lỗi trong sendMessage:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  updateMessage: async (message) => {
    try {
      const authUser = useAuthStore.getState().authUser;
      const selectedConversation = get().selectedConversation;
      
      if (Number(message.senderId) === Number(authUser.id)) return;
      
      // cập nhật lastMessage
      set((state) => ({
        conversations: state.conversations.map((c) => 
          c.id === message.conversationId ? { ...c, lastMessage: message} : c
        ),
      }));

      if (Number(selectedConversation.id) !== Number(message.conversationId)) return;

      // cập nhật tin nhắn
      set((state) => ({
        messages: [...state.messages, message],
      }));
    } catch (error) {
      console.error("❌ Lỗi trong updateMessage:", error);
      toast.error(error.response.data.message);
    }
  },

  updateConversation: async (conversation) => {
    const authUser = useAuthStore.getState().authUser;

    if (Number(conversation.creatorId) === Number(authUser.id)) return;
    
    set((state) => ({
      conversations: [...state.conversations, conversation]
    }));
  }
}));