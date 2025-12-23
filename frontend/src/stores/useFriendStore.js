import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useFriendStore = create((set, get) => ({
  friends: [],
  friendRequests: [],
  searchResults: [],

  isLoadingFriends: false,
  isLoadingFriendRequests: false,
  isSearching: false,

  // Lấy danh sách bạn bè
  fetchFriends: async () => {
    try {
      set({ isLoadingFriends: true });
      const res = await axiosInstance.get('/friends');
      set({ friends: res.data });

      toast.success("Lấy danh sách bạn bè thành công");
    } catch (error) {
      console.error("❌ Lỗi trong fetchFriends:", error);
      toast.error(error.response.data.message);
      set({ friends: [] });
    } finally {
      set({ isLoadingFriends: false });
    }
  },

  // Lấy lời mời kết bạn
  fetchFriendRequests: async () => {
    try {
      set({ isLoadingFriendRequests: true });
      const res = await axiosInstance.get('/friend-requests');
      set({ friendRequests: res.data.received });

      toast.success("Lấy danh sách lời mời kết bạn thành công");
    } catch (error) {
      console.error("❌ Lỗi trong fetchFriendRequests:", error);
      toast.error(error.response.data.message);
      set({ friendRequests: [] });
    } finally {
      set({ isLoadingFriendRequests: false });
    }
  },

  // Chấp nhận lời mời kết bạn
  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/friend-requests/${requestId}/accept`);
      toast.success("Chấp nhận kết bạn thành công");
    } catch (error) {
      console.error("❌ Lỗi trong acceptFriendRequest:", error);
      toast.error(error.response.data.message);
    } finally {
      await get().fetchFriends();
      await get().fetchFriendRequests();
    }
  },

  // Từ chối lời mời kết bạn
  declineFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/friend-requests/${requestId}/decline`);
      toast.success("Từ chối kết bạn thành công");
    } catch (error) {
      console.error("❌ Lỗi trong declineFriendRequest:", error);
      toast.error(error.response.data.message);
    } finally {
      await get().fetchFriendRequests();
      console.log("decline", requestId);
    }
  },

  // Tìm kiếm bạn bè
  searchUsers: async (q) => {
    if (!q.trim()) {
      set({ searchResults: [] });
      return;
    } else {
      try {
        set({ isSearching: true});
        const res = await axiosInstance.get(`/users/search?q=${q}`);
        set({ searchResults: res.data });
        toast.success("Tìm kiếm bạn bè thành công");
      } catch (error) {
        console.error("❌ Lỗi trong searchUsers:", error);
        toast.error(error.response.data.message);
      } finally {
        set({ isSearching: false });
      }
    }
  },

  // Gửi lời mời kết bạn
  sendFriendRequest: async (receiverId, message) => {
    try {
      await axiosInstance.post('/friend-requests', { receiverId, message });
      toast.success("Gửi lời mời kết bạn thành công thành công");
    } catch (error) {
      console.error("❌ Lỗi trong sendFriendRequest", error);
      toast.error(error.response.data.message);
    } finally { 
      await get().fetchFriendRequests();
    }
  },

  // clear Search
  clearSearch: () => {
    set({ searchResults: [] });
  },


}));