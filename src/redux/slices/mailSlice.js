import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { refreshMailListByPath } from "../../utils/mailUtils";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  list: [],
  newReceivedCount: 0,
  singleMail: null,
  isLoading: false,
  error: null,
  success: null,
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    mailRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    mailSuccess: (state, action) => {
      state.isLoading = false;
      state.success = action.payload?.message || null;
      state.error = null;
      if (state.success) toast.success(state.success);
    },
    mailFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || null;
      state.success = null;
      if (state.error) toast.error(state.error);
    },
    getMailsSuccess: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    getSentMailsSuccess: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    getSingleMailSuccess: (state, action) => {
      state.isLoading = false;
      state.singleMail = action.payload || {};
      state.error = null;
    },
    mailDeleteSuccess: (state, action) => {
      state.isLoading = false;
      state.list = action.payload || {};
      state.error = null;
    },
    mailTrashSuccess: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    mailGetTrashSuccess: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    receivedAllMail: (state, action) => {
      state.isLoading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
    archiveMail: (state, action) => {
      state.isLoading = false;
      const archivedMailId = action.payload?.mailId;
      state.list = state.list.filter((mail) => mail.id !== archivedMailId);
      state.error = null;
    },
    getArchiveMails: (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
      state.error = null;
    },
    addStarredSuccess: (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
      state.error = null;
    },
    getAllStarredSuccess: (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
      state.error = null;
    },
  },
});

export const {
  mailRequest,
  mailSuccess,
  mailFail,
  getMailsSuccess,
  getSentMailsSuccess,
  getSingleMailSuccess,
  mailDeleteSuccess,
  mailTrashSuccess,
  mailGetTrashSuccess,
  receivedAllMail,
  archiveMail,
  getArchiveMails,
  addStarredSuccess,
  getAllStarredSuccess,
} = mailSlice.actions;

export const getAllMails = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-all-mails`);
    dispatch(getMailsSuccess(data.data || []));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const senteMail = (mailData, currentPath) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.post(`${baseURL}/mail/sent-email`, mailData);
    dispatch(mailSuccess(data));
    refreshMailListByPath(dispatch, currentPath);
    return data;
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const getAllSentMails = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-all-sent-mails`);
    dispatch(getSentMailsSuccess(data.data || []));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const getBySingleMail = (id) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(
      `${baseURL}/mail/get-by-single-mail/${id}`
    );
    dispatch(getSingleMailSuccess(data.data));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const deleteMails = (idsOrId, currentPath) => async (dispatch) => {
  try {
    dispatch(mailRequest());

    if (Array.isArray(idsOrId)) {
      const { data } = await axios.delete(`${baseURL}/mail/bulk-delete-mail`, {
        data: { mailsId: idsOrId },
      });
      dispatch(mailDeleteSuccess(data));
    } else {
      const { data } = await axios.delete(
        `${baseURL}/mail/delete-mail/${idsOrId}`
      );
      dispatch(mailDeleteSuccess(data));
    }

    refreshMailListByPath(dispatch, currentPath);
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const moveToTrash = (idsOrId, currentPath) => async (dispatch) => {
  try {
    dispatch(mailRequest());

    const payload = Array.isArray(idsOrId)
      ? { mailsId: idsOrId }
      : { mailId: idsOrId };

    const { data } = await axios.post(`${baseURL}/mail/move-to-trash`, payload);
    dispatch(mailTrashSuccess(data));
    refreshMailListByPath(dispatch, currentPath);
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const getTrash = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-trash`);
    dispatch(mailGetTrashSuccess(data.data || []));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

// received mail
export const getAllReceivedMails = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/recived-email`);
    dispatch(receivedAllMail(data.data || []));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const addArchive = (mailId, currentPath) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.post(`${baseURL}/mail/move-to-archive`, {
      mailId,
    });
    dispatch(archiveMail({ mailId }));
    refreshMailListByPath(dispatch, currentPath);
    return data;
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const getAllArchive = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-archive`);
    dispatch(getArchiveMails(data.data));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const addStarred = (mailId, currentPath) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.post(`${baseURL}/mail/add-starred/${mailId}`);
    dispatch(addStarredSuccess(data.data));
    refreshMailListByPath(dispatch, currentPath);
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const removeStarred = (mailId, currentPath) => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.delete(
      `${baseURL}/mail/remove-starred/${mailId}`
    );
    dispatch(addStarredSuccess(data.data));
    refreshMailListByPath(dispatch, currentPath);
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};

export const getAllStarred = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/get-all-starred`);
    dispatch(getAllStarredSuccess(data.data));
  } catch (err) {
    const errMsg = err?.response?.data?.message || err?.message;
    dispatch(mailFail(errMsg));
  }
};











////////////////////////////// sidebar and nav //////////////////
export const newAllCountReceivedMails = () => async (dispatch) => {
  try {
    dispatch(mailRequest());
    const { data } = await axios.get(`${baseURL}/mail/new-received-count`);
    dispatch(mailSuccess(data.data))
    return data
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(mailFail(errMsg));
    return error?.response?.data || { message: errMsg };
  }
};



export default mailSlice.reducer;
