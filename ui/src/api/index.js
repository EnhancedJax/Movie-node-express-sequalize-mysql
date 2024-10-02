import axios from "axios";
import bookingApi from "./booking";
import cinemaApi from "./cinema";
import movieApi from "./movie";
import screeningApi from "./screening";
import theaterApi from "./theater";
import userApi from "./user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Set the auth token for all requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api, setAuthToken };

export default {
  setAuthToken,
  ...userApi,
  ...movieApi,
  ...cinemaApi,
  ...theaterApi,
  ...screeningApi,
  ...bookingApi,
};
