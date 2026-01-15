import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useChatStore } from './useChatStore.js';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Kiểm tra xem người dùng đã đăng nhập trước đó hay chưa => xác thực người dùng
  // Gọi khi reload lại page
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get('/auth/check-auth');
      set({ authUser: res.data });
    } catch (error) {
      console.error("Lỗi trong checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Gọi api đăng kí của server
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success("Tạo tài khoản thành công");
    } catch (error) {
      toast.error("Lỗi trong đăng kí");
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Gọi api đăng nhập của server
  signin: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post('/auth/signin', data);
      set({ authUser: res.data });
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error("Lỗi trong đăng nhập");
      console.log(error);
    } finally {
      set({ isSigningIn: false });
    }
  },

  // Gọi api đăng xuất của server
  signout: async () => {
    const resetChat = useChatStore.getState().resetChat;
    try {
      await axiosInstance.post('/auth/signout');
      resetChat();
      set({ authUser: null });
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      toast.error("Lỗi trong đăng xuất");
      console.log(error);
    } 
  },

  updateProfile: async (profilePic) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      formData.append("profilePic", profilePic);

      const res = await axiosInstance.put("/auth/update-profile", formData);
      
      set({ authUser: res.data });
      toast.success("Cập nhật ảnh đại diện thành công!")
    } catch (error) {
      console.log(error);
      toast.error("Lỗi trong cập nhật ảnh đại diện");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

}));