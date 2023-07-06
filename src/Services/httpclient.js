import axios from "axios";
console.log("Backend ", import.meta.env.VITE_APP_BACKENDURL);

let httpClient;
if (import.meta.env.VITE_APP_BACKENDURL == "localhost:5002")
  httpClient = axios.create({
    baseURL: "http://" + import.meta.env.VITE_APP_BACKENDURL,
    // timeout: 30000, // indicates, 1000ms ie. 1 second
    headers: {
      "Content-Type": "application/json",
    },
  });
else
  httpClient = axios.create({
    baseURL: "https://" + import.meta.env.VITE_APP_BACKENDURL,
    // timeout: 30000, // indicates, 1000ms ie. 1 second
    headers: {
      "Content-Type": "application/json",
    },
  });

export default httpClient;
