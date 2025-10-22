// VITE_API_URL=http://185.137.92.41:3000
import { http } from "./client";
import type { Post } from "../types";

export const PostsAPI = {
  list: () =>
    http<Post[]>("/api/posts"),
  get: (id: string) =>
    http<Post>(`/api/posts/${id}`),
  create: (
    payload: Omit<
      Post,
      "id" | "createdAt" | "updatedAt"
    >
  ) =>
    http<Post>("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (
    id: string,
    payload: Omit<
      Post,
      "id" | "createdAt"
    >
  ) =>
    http<Post>(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  patch: (
    id: string,
    payload: Partial<Omit<Post, "id">>
  ) =>
    http<Post>(`/api/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  remove: (id: string) =>
    http<void>(`/api/posts/${id}`, {
      method: "DELETE",
    }),
};
