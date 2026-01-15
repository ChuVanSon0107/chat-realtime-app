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
  isSendingFriendRequest: false,

  // Lấy danh sách bạn bè
  fetchFriends: async () => {
    get().clearSearch();

    try {
      set({ isLoadingFriends: true });
      const res = await axiosInstance.get('/friends');
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      set({ friends: [] });
    } finally {
      set({ isLoadingFriends: false });
    }
  },

  // Lấy lời mời kết bạn
  fetchFriendRequests: async () => {
    get().clearSearch();

    try {
      set({ isLoadingFriendRequests: true });
      const res = await axiosInstance.get('/friend-requests');
      set({ friendRequests: res.data.received });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      set({ friendRequests: [] });
    } finally {
      set({ isLoadingFriendRequests: false });
    }
  },

  // Chấp nhận lời mời kết bạn
  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/friend-requests/${requestId}/accept`);
      set({ friendRequests: get().friendRequests.filter((friendRequest) => Number(friendRequest.requestId) !== Number(requestId)) });
      toast.success("Chấp nhận kết bạn thành công");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } 
  },

  // Từ chối lời mời kết bạn
  declineFriendRequest: async (requestId) => {
    try {
      await axiosInstance.post(`/friend-requests/${requestId}/decline`);
      set({ friendRequests: get().friendRequests.filter((friendRequest) => Number(friendRequest.requestId) !== Number(requestId)) });
      toast.success("Từ chối kết bạn thành công");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
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
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      } finally {
        set({ isSearching: false });
      }
    }
  },

  // Gửi lời mời kết bạn
  sendFriendRequest: async (receiverId, message) => {
    set({ isSendingFriendRequest: true });
    try {
      await axiosInstance.post('/friend-requests', { receiverId, message });
      toast.success("Gửi lời mời kết bạn thành công thành công");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    } finally { 
      set({ isSendingFriendRequest: false });
    }
  },

  // clear Search
  clearSearch: () => {
    set({ searchResults: [] });
  },
}));