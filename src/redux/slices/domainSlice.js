import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
    domains: [],
    isLoading: false,
    error: null,
    success: null,
};

const domainSlice = createSlice({
    name: "domain",
    initialState,
    reducers: {
        domainRequest: (state) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        domainSuccess: (state, action) => {
            state.isLoading = false;
            state.success = action.payload?.message || null;
            state.error = null;
            if (state.success) toast.success(state.success);
        },
        domainFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.success = null;
            if (state.error) toast.error(state.error);
        },
        getDomainsSuccess: (state, action) => {
            state.isLoading = false;
            state.domains = Array.isArray(action.payload) ? action.payload : [];
            state.error = null;
        },
        clearDomainState: (state) => {
            state.error = null;
            state.success = null;
        },
    },
});

export const {
    domainRequest,
    domainSuccess,
    domainFail,
    getDomainsSuccess,
    clearDomainState,
} = domainSlice.actions;

export const fetchDomains = () => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.get(`${baseURL}/domain/get-domains`);
        dispatch(getDomainsSuccess(data.data));
        // dispatch(domainSuccess(data));
    } catch (err) {
        // const errMsg = err?.response?.data?.message || err?.message;
        // dispatch(domainFail(errMsg));
        dispatch(getDomainsSuccess([]));
    }
};

export const addDomain = (domainName) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.post(`${baseURL}/domain/add-domain`, domainName);
        dispatch(domainSuccess(data));
        dispatch(fetchDomains());
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(domainFail(errMsg));
    }
};

export const verifyDomain = (domainName) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.get(`${baseURL}/domain/verify-domain/${domainName}`);
        dispatch(domainSuccess(data));
        dispatch(fetchDomains());
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(domainFail(errMsg));
    }
};

export const updateDomain = (id, domainData) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.put(`${baseURL}/domains/${id}`, domainData);
        dispatch(domainSuccess(data));
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(domainFail(errMsg));
    }
};

export const deleteDomain = (domainName) => async (dispatch) => {
    try {
        dispatch(domainRequest());
        const { data } = await axios.delete(`${baseURL}/domain/delete-domain/${domainName}`);
        dispatch(domainSuccess(data));
        dispatch(fetchDomains());
    } catch (err) {
        const errMsg = err?.response?.data?.message || err?.message;
        dispatch(domainFail(errMsg));
    }
};

export default domainSlice.reducer;
