import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  list: [],
  isLoading: false,
  error: null,
  success: null,
};

const mailboxSlice = createSlice({
  name: "mailbox",
  initialState,
  reducers: {
    mailboxRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    mailboxSuccess: (state, action) => {
      state.isLoading = false;
      state.success = action.payload?.message || null;
      state.error = null;
      if (state.success) toast.success(state.success);
    },
    mailboxFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || null;
      state.success = null;
      if (state.error) toast.error(state.error);
    },
    getMailboxesSuccess: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    clearMailboxState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  mailboxRequest,
  mailboxSuccess,
  mailboxFail,
  getMailboxesSuccess,
  clearMailboxState,
} = mailboxSlice.actions;

export const fetchMailboxes = () => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    const { data } = await axios.get(`${baseURL}/mailboxes/get-mailbox`);
    dispatch(getMailboxesSuccess(data.data || []));
  } catch (err) {
    dispatch(getMailboxesSuccess([])); 
  }
};

export const createMailbox = (mailboxData) => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    const { data } = await axios.post(
      `${baseURL}/mailboxes/create-mailbox`,
      mailboxData
    );
    dispatch(mailboxSuccess(data));
    dispatch(fetchMailboxes());
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailboxFail(errMsg));
  }
};

export const updateMailbox = (id, mailboxData) => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    const { data } = await axios.put(
      `${baseURL}/mailboxes/update-mailbox/${id}`,
      mailboxData
    );
    dispatch(mailboxSuccess(data));
    dispatch(fetchMailboxes());
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailboxFail(errMsg));
  }
};

export const deleteMailbox = (id) => async (dispatch) => {
  try {
    dispatch(mailboxRequest());
    const { data } = await axios.delete(
      `${baseURL}/mailboxes/delete-mailbox/${id}`
    );
    dispatch(mailboxSuccess(data));
    dispatch(fetchMailboxes());
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailboxFail(errMsg));
  }
};

export default mailboxSlice.reducer;
