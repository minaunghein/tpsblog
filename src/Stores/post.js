import { defineStore } from "pinia";
import {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} from "../Services/post_services";
import { Toast } from "../utils/toast";

export const usePostStore = defineStore("posts", {
  state: () => ({ posts: [], total: 0 }),
  actions: {
    async getPosts(payload) {
      const posts = await getPosts(payload);
      // this.posts = posts.data.data;
      this.posts.push(...posts.data.data);
      this.total = posts.data.meta.total;
      console.log(this.posts);
    },
    async createPost(payload) {
      const toast = new Toast();
      try {
        toast.loading("Creating new post");
        const formData = new FormData();
        formData.append("desc", payload.desc);
        formData.append("file", payload.file);
        const post = await createPost(formData);
        this.posts.unshift(post.data.data);
        toast.success("Post has been created successfully");
      } catch (error) {
        toast.error(error);
        throw error;
      }
    },
    async deletePost(payload) {
      const toast = new Toast();
      try {
        toast.loading("Deleting post");
        await deletePost(payload);
        const findIndex = this.posts.findIndex((post) => post._id === payload);
        this.posts.splice(findIndex, 1);
        toast.success("Post has been deleted successfully");
      } catch (error) {
        toast.error(error);
        throw error;
      }
    },
    async updatePost(payload) {
      const toast = new Toast();
      try {
        toast.loading("Deleting post");
        const formData = new FormData();
        Object.keys(payload).forEach((key) => {
          if (key !== "userid") formData.append(key, payload[key]);
        });
        const post = await updatePost(payload._id, formData);
        const findIndex = this.posts.findIndex(
          (post) => post._id === payload._id
        );
        this.posts.splice(findIndex, 1, post.data.data);
        toast.success("Post has been updated successfully");
      } catch (error) {
        toast.error(error);
        throw error;
      }
    },
  },
});
