const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://mylibri.onrender.com";

export default API_URL;
