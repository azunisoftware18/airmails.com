import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;
const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
    subscription: null,
    isLoading: false,
    error: null,
    success: null,
    isSubscriptionAuthenticated: false,
};

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        subscriptionRequest: (state) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        subscriptionSuccess: (state, action) => {
            state.isLoading = false;
            state.subscription = action.payload?.data || action.payload;
            state.isSubscriptionAuthenticated = true;
            state.success = action.payload?.message !== "Subscription retrieved";
            state.error = null;
            toast.success(state.success);
        },
        subscriptionFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isSubscriptionAuthenticated = false;
            toast.error(action.payload);
        },
        subscriptionReset: (state) => {
            state.subscription = null;
            state.isLoading = false;
            state.error = null;
            state.success = null;
            state.isSubscriptionAuthenticated = false;
        },
    },
});

export const {
    subscriptionRequest,
    subscriptionSuccess,
    subscriptionFail,
    subscriptionReset,
} = subscriptionSlice.actions;

// Create Razorpay order
export const createRazorpayOrder = (orderData) => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await axios.post(
            `${baseURL}/subscription/create-order`,
            orderData
        );
        return data;
    } catch (err) {
        dispatch(subscriptionFail(err?.response?.data?.message || "Order creation failed"));
        throw err;
    }
};

// Create or renew subscription
export const createOrRenewSubscriptionAction = (subscriptionData) => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await axios.post(
            `${baseURL}/subscription/create-or-renew`,
            subscriptionData
        );
        dispatch(subscriptionSuccess(data));
        return data;
    } catch (err) {
        dispatch(subscriptionFail(err?.response?.data?.message || "Subscription failed"));
        throw err;
    }
};

// Verify payment
export const verifyPayment = (paymentData) => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await axios.post(
            `${baseURL}/subscription/verify-payment`,
            paymentData
        );
        dispatch(subscriptionSuccess(data));
        return data;
    } catch (err) {
        dispatch(subscriptionFail(err?.response?.data?.message || "Payment verification failed"));
        throw err;
    }
};

// Get current subscription
export const getMySubscription = () => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await axios.get(`${baseURL}/subscription/current`);
        dispatch(subscriptionSuccess(data));
        return data;
    } catch (err) {
        dispatch(subscriptionFail(err?.response?.data?.message || "Fetching subscription failed"));
        throw err;
    }
};

// Cancel subscription
export const cancelSubscription = () => async (dispatch) => {
    try {
        dispatch(subscriptionRequest());
        const { data } = await axios.delete(`${baseURL}/subscription/cancel`);
        dispatch(subscriptionSuccess(data));
        return data;
    } catch (err) {
        dispatch(subscriptionFail(err?.response?.data?.message || "Cancel subscription failed"));
        throw err;
    }
};

export default subscriptionSlice.reducer;