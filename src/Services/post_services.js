import httpClient from "./httpclient";
import axios from "axios";

const END_POINT = "/api/post";

export const getPosts = ({ page, pagesize }) =>
  httpClient.get(END_POINT + `?page=${page}&pagesize=${pagesize}`, {
    headers: {
      "Content-Type": "application/json",
      //   Authorization: axios.defaults.headers.common["Authorization"],
    },
  });

export const createPost = (payload) =>
  httpClient.post(END_POINT, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: axios.defaults.headers.common["Authorization"],
    },
  });

export const deletePost = (payload) =>
  httpClient.delete(END_POINT + "/" + payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: axios.defaults.headers.common["Authorization"],
    },
  });

export const updatePost = (id, formdata) =>
  httpClient.put(END_POINT + "/" + id, formdata, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: axios.defaults.headers.common["Authorization"],
    },
  });
