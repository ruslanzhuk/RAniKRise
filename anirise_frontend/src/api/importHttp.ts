import axios from "axios";

const httpAnime = axios.create({
  baseURL: "http://localhost:5000/anime",
});

httpAnime.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default httpAnime;
