import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

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
      toast.success("Lấy danh sách các cuộc hội thoại thành công");
    } catch (error) {
      console.error("❌ Lỗi trong fetchConversations:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingConversations: false });
    }
  },  

  // Tạo cuộc hội thoại
  createConversation: async (name, type, memberIds) => {
    set({ isCreatingConversation: false });
    try {
      await axiosInstance.post('/conversations', { name, type, memberIds });
      toast.success("Tạo cuộc hội thoại thành công");
    } catch (error) {
      console.error("❌ Lỗi trong createConversation:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingConversation: true });
      await get().fetchConversations();
    }
  },

  // Chọn cuộc hội thoại
  selectConversation: async (conversation) => {
    set({ 
      selectedConversation: conversation,
      messages: [],
      cursor: null,
      hasMore: true
    });
  },

  // Lấy danh sách tin nhắn
  fetchMessages: async (conversationId, cursor) => {
    set({ isLoadingMessages: true });
    try { 
      const res = await axiosInstance.get(`/messages/${conversationId}`,  { params: { cursor, limit: 20 } });
      set((state) => ({
        messages: [...res.data.messages, ...state.messages],
        cursor: res.data.nextCursor,
        hasMore: res.data.hasMore
      }));

      toast.success("Lấy danh sách tin nhắn thành công");
    } catch (error) {
      console.error("❌ Lỗi trong fetchMessages:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  // Gửi tin nhắn
  sendMessage: async (conversationId, content, image) => {
    set({ isSendingMessage: true });
    try {
      await axiosInstance.post('messages', { conversationId, content, image });
      toast.success("Đã gửi tin nhắn thành công");
    } catch (error) {
      console.error("❌ Lỗi trong sendMessage:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSendingMessage: false });
    }
  }
}));