import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAdmins } from "./dashboardSlice";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;
const storedUser = localStorage.getItem("currentUser");

const initialState = {
  user: [],
  adminsData: [],
  currentUserData: storedUser ? JSON.parse(storedUser) : null,
  isLoading: false,
  error: null,
  success: null,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      const userData =
        action.payload?.user || action.payload?.data?.user || action.payload;
      state.user = userData;
      state.currentUserData = userData;
      state.isAuthenticated = true;
      state.success = action.payload?.message || null;
      state.error = null;
      localStorage.setItem("currentUser", JSON.stringify(userData));
    },
    allDataSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.adminsData = action.payload;
    },
    authFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || null;
      state.isAuthenticated = false;
      if (state.error) {
        toast.error(state.error);
      }
    },
    silentAuthFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || null;
      state.isAuthenticated = false;
      state.user = null;
      state.currentUserData = null;
      localStorage.removeItem("currentUser");
    },

    logoutUser: (state) => {
      state.user = null;
      state.currentUserData = null;
      state.isLoading = false;
      state.isAuthenticated = false;
      state.success = null;
      state.error = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFail,
  silentAuthFail,
  allDataSuccess,
  logoutUser,
} = authSlice.actions;

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/signup`, userData);
    dispatch(authSuccess(data));
    toast.success(data.message);
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export const verifysignup = (token) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(
      `${baseURL}/auth/signup-verify?token=${token}`
    );
    dispatch(authSuccess(data));
    toast.success(data.message);
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/login`, credentials);
    dispatch(authSuccess(data));
    toast.success(data.message);
    await dispatch(getCurrentUser());
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export const getCurrentUser = () => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.get(`${baseURL}/auth/get-current-user`);
    dispatch(authSuccess(data));
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(silentAuthFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(`${baseURL}/auth/logout`);
    dispatch(logoutUser());
    toast.success(data.message);
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export const updateProfile = (profileData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.put(
      `${baseURL}/auth/profile-update`,
      profileData
    );
    dispatch(authSuccess(data));
    toast.success(data.message);
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export const changePassword = (passwordData) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.post(
      `${baseURL}/auth/change-password`,
      passwordData
    );
    toast.success(data.message);
    dispatch(logout());
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

// ====================== super admin =====================

export const toggleActiveAPI = (id) => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.patch(`${baseURL}/auth/admin-toggle/${id}`);
    toast.success(data.message);
    dispatch(fetchAdmins());
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

// landig page

export const getAllCountUsers = () => async (dispatch) => {
  try {
    dispatch(authRequest());
    const { data } = await axios.get(`${baseURL}/auth/get-users-count`);
    dispatch(authSuccess(data));
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(authFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export default authSlice.reducer;
