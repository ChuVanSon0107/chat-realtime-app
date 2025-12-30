import { create } from "zustand";
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from "./useAuthStore.js";
import { useChatStore } from "./useChatStore.js";

const BASE_URL = "http://localhost:5000";

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      }
    });
    socket.connect();

    set({ socket: socket});

    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("new-message", (message) => {
      useChatStore.getState().updateMessage(message);
    });

    socket.on("new-conversation", (conversation) => {
      useChatStore.getState().updateConversation(conversation);

      socket.emit("join-conversation", conversation.id);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
  }
}));