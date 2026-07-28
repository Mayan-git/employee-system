import { api } from "./api.js";

export const getAIRecommendations = () => api.post("/ai/recommend").then((r) => r.data);
