import axios from "axios";
import { GenerateResponse, GenerateType, Product, User } from "./types";

const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://flashcards-server-silk.vercel.app"
    : "http://localhost:3000";

const PYTHON_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:5000";

const server = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const pythonServer = axios.create({
  baseURL: PYTHON_SERVER_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const TOKEN_KEY = "flashcards-token";

server.interceptors.request.use((req) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const api = {
  // User

  login: async (email: string, password: string) => {
    return server.post<User>("/auth/login", { email, password });
  },

  register: async (name: string, email: string, password: string) => {
    return server.post<User>("/auth/register", { name, email, password });
  },

  quietLogin: async () => {
    return server.get<User>("/auth/login");
  },

  requestResetPassword: async (email: string) => {
    return server.post<string>("/auth/request-reset-password", { email });
  },

  resetPassword: async (userId: string, password: string) => {
    return server.post<string>("/auth/reset-password", { userId, password });
  },

  logout: async () => {
    return server.post<string>("/auth/logout");
  },

  // Generate

  generateFlashcards: async (type: GenerateType, text: string) => {
    return server.post<GenerateResponse>(`/protected/generate`, { type, text });
  },

  // Parse

  parsePdf: async (pdf: Blob) => {
    const formData = new FormData();
    formData.append("pdf", pdf);
    return pythonServer.post<string>("/pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  parsePptx: async (pptx: Blob) => {
    const formData = new FormData();
    formData.append("pptx", pptx);
    return pythonServer.post<string>("/pptx", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Products

  fetchProducts: async () => {
    return server.get<Product[]>("/protected/product");
  },
};
