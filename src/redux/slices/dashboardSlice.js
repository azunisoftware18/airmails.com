import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  dashboardData: {
    totalDomains: 0,
    totalMailboxes: 0,
    totalReceivedEmails: 0,
    totalSentEmails: 0,
    storageUsed: 0,
    recentDomains: [],
    recentSentEmails: [],
    recentReceivedEmails: [],
  },
  loading: false,
  error: null,
  success: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    dashboardSuccess: (state, action) => {
      state.loading = false;
      state.dashboardData = action.payload || initialState.dashboardData;
      state.error = null;
      state.success = action.payload?.message || null;
    },
    dashboardFail: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong!";
      state.success = null;
      if (state.error) toast.error(state.error);
    },
  },
});

export const { dashboardRequest, dashboardSuccess, dashboardFail } =
  dashboardSlice.actions;


export const getAlldashboardData = () => async (dispatch) => {
  try {
    dispatch(dashboardRequest());
    const { data } = await axios.get(`${baseURL}/dashboard/get-dashboard-data`);
    // data.data contains the dashboard data
    dispatch(dashboardSuccess(data.data));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(dashboardFail(errMsg));
  }
};  


//////////////// super admin /////////////////////////////
export const fetchAdmins = () => async (dispatch) => {
  try {
    dispatch(dashboardRequest());
    const { data } = await axios.get(`${baseURL}/auth/all-admins`);
    dispatch(dashboardSuccess(data.data));
    // dispatch(domainSuccess(data));
  } catch (err) {
    // const errMsg = err?.response?.data?.message || err?.message;
    // dispatch(domainFail(errMsg));
    dispatch(dashboardFail([]));
  }
};

export const allDataGet = () => async (dispatch) => {
  try {
    dispatch(dashboardRequest());
    const { data } = await axios.get(`${baseURL}/auth/all-data`);
    dispatch(dashboardSuccess(data));
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(dashboardFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};

export default dashboardSlice.reducer;
