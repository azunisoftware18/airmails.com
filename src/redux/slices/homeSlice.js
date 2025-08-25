import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  success: null,
};

const contactTestimonialSlice = createSlice({
  name: "contactTestimonial",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    requestSuccess: (state, action) => {
      state.isLoading = false;
      state.success = action.payload?.message;
      state.error = null;
    },
    dataSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload?.data;
      state.error = null;
    },
    requestFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      if (state.error) {
        toast.error(state.error);
      }
    },
  },
});

export const { requestStart, requestSuccess, requestFail, dataSuccess } =
  contactTestimonialSlice.actions;

export const submitContact = (contactData) => async (dispatch) => {
  try {
    dispatch(requestStart());
    const { data } = await axios.post(
      `${baseURL}/home/home-contact`,
      contactData
    );
    dispatch(requestSuccess(data));
    toast.success(data.message);
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(requestFail(errMsg));
    return { message: errMsg };
  }
};

export const submitTestimonial = (testimonialData) => async (dispatch) => {
  try {
    dispatch(requestStart());
    const { data } = await axios.post(
      `${baseURL}/home/new-testimonial`,
      testimonialData
    );
    dispatch(requestSuccess(data));
    toast.success(data.message);
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(requestFail(errMsg));
    return { message: errMsg };
  }
};

export const allTestimonials = () => async (dispatch) => {
  try {
    dispatch(requestStart());
    const { data } = await axios.get(`${baseURL}/home/all-testimonials`);
    dispatch(dataSuccess(data));
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(requestFail(errMsg));
    return { message: errMsg };
  }
};

export const allContacts = () => async (dispatch) => {
  try {
    dispatch(requestStart());
    const { data } = await axios.get(`${baseURL}/home/all-contacts`);
    dispatch(dataSuccess(data));
    return data;
  } catch (error) {
    const errMsg = error?.response?.data?.message || error?.message;
    dispatch(requestFail(errMsg));
    return { message: errMsg };
  }
};

export default contactTestimonialSlice.reducer;
