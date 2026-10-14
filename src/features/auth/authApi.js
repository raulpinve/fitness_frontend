import { api } from "../../lib/api";

export const syncUser = () => api("/auth/sync", { method: "POST" });