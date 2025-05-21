// tradingApi.js
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const fetchCandlestickData = async (symbol, timeframe) => {
  try {
    const response = await axios.post(`${API_URL}/candlestick-data`, {
      symbol,
      timeframe,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error retrieving candlestick data.");
    throw error;
  }
};

export const fetchIndicatorData = async (symbol, timeframe, indicator) => {
  try {
    const response = await axios.post(`${API_URL}/indicator-data`, {
      symbol,
      timeframe,
      indicator,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || `Error retrieving data. ${indicator}.`);
    throw error;
  }
};

export const fetchFVGData = async (symbol, timeframe) => {
  try {
    const response = await axios.post(`${API_URL}/fvg-data`, {
      symbol,
      timeframe,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error retrieving FVG data.");
    throw error;
  }
};

export const fetchMarketSignal = async (symbol, timeframe) => {
  try {
    const response = await axios.post(`${API_URL}/market-signal`, {
      symbol,
      timeframe,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error retrieving market signal.");
    throw error;
  }
};

export const fetchFullAnalysis = async (symbol, timeframe, indicator) => {
  try {
    const response = await axios.post(`${API_URL}/full-analysis`, {
      symbol,
      timeframe,
      indicator,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error retrieving analysis.");
    throw error;
  }
};

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    toast.error("Error retrieving settings.");
    throw error;
  }
};
